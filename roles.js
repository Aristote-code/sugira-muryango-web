/* ---------------------------------------------------------------------------
   Roles: the things that are not rungs.

   A position is a job, and the ladder makes each one the job below it plus a
   few named things. That answers "what can a Sector lead do?" — but it cannot
   answer "who may translate a form?", because translating is not a job. An
   IZU, a Sector lead and an HQ officer might all do it, and none of them
   should need a position of their own to say so. That is what a role is here:
   a small, named bundle of permissions, held by whoever does that work.

   Aristote's model, and the client's own words carry it:
     [43:23] "You can select the roles" — documents are shared by role
     [44:04] "Access to the details by roles. That is the permission."

   Two rules keep it from becoming what the audit found — twenty-one roles for
   ten jobs, three of them called Test role:

     A role only adds. It cannot take away what a position gives, so a person
     is still their position plus a named list, and the ladder stays the
     single answer to what a job can do.

     Making a role tells you what already grants it. The reason the live
     system has twenty-one is that nobody could see the twenty that already
     existed, so every new need became a new role.

   The grain is deliberately different from a position's. A position holds
   group-by-verb cells, because a job is broad — eight by four is the whole of
   it. A role holds named permissions, because a role is narrow: three or four
   stored names, listed, each saying what it does. Giving roles the grid would
   make a translator a programme editor; giving positions the list would be
   the hundred and twelve checkboxes again. The control matches the grain.
--------------------------------------------------------------------------- */
(function () {
  'use strict';

  /* `across` is the positions a role's holders actually occupy, and it is the
     whole difference between this tab and the one beside it: a position is a
     rung, so nobody is on two of them, while a role sits on top of as many
     rungs as it likes. Each of these used to be asserted in the description
     — "the people who translate sit at every level", "national and district
     level alike" — which is a sentence doing a column's job. The sentences
     are gone; the fact is data now, and the card and drawer both show it. */
  var SEED = [
    { id: 'translator', name: 'Form translator', icon: 'i-reports', people: 6,
      across: ['IZU', 'SLA', 'ICC', 'DTL', 'HQ'],
      what: 'Writes the Kinyarwanda alongside the English.',
      grants: ['prog-translate', 'prog-see'] },

    { id: 'reporter', name: 'Report builder', icon: 'i-reports', people: 9,
      across: ['NCDA', 'CPWO', 'DTL', 'HQ'],
      what: 'Builds reports beyond the standard ones and takes the numbers out of the '
        + 'system.',
      grants: ['rep-see', 'rep-build', 'rep-export'] },

    { id: 'cohorts', name: 'Cohort manager', icon: 'i-visits', people: 4,
      across: ['CPWO', 'ICC', 'DTL'],
      what: 'Decides which households are grouped together and what dates the group runs '
        + 'between.',
      grants: ['prog-cohorts'] },

    { id: 'publisher', name: 'Form publisher', icon: 'i-programme', people: 2,
      across: ['HQ', 'Admin'],
      what: 'Publishes a new version of a form that is already in use, and takes a project '
        + 'off the tablet.',
      grants: ['prog-change', 'prog-archive'],
      risk: 'Publishing reaches every tablet in the programme at once.' },

    { id: 'community', name: 'Community manager', icon: 'i-message', people: 3,
      across: ['SLA', 'DTL', 'HQ'],
      what: 'Answers what field staff post, and keeps the guidance they read current.',
      grants: ['fs-see', 'fs-change', 'fs-community'] }
  ];

  function fresh() {
    return SEED.map(function (r) {
      return { id: r.id, name: r.name, icon: r.icon, people: r.people, what: r.what,
               risk: r.risk, grants: r.grants.slice(),
               across: (r.across || []).slice() };
    });
  }

  var state = { roles: fresh(), open: null, find: '' };

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function svg(id, cls) {
    var s = el('span', cls);
    s.innerHTML = '<svg aria-hidden="true"><use href="#' + id + '"/></svg>';
    return s;
  }
  function perms() { return window.SugiraPerms; }

  /* The stored name, found once rather than looked up in eight places. */
  /* which groups are open, per role drawer */
  var roleOpen = {};

  function permById(id) {
    var gs = perms().groups;
    for (var i = 0; i < gs.length; i++) {
      for (var j = 0; j < gs[i].perms.length; j++) {
        if (gs[i].perms[j].id === id) return { perm: gs[i].perms[j], group: gs[i] };
      }
    }
    return null;
  }

  function byId(id) {
    for (var i = 0; i < state.roles.length; i++) if (state.roles[i].id === id) return state.roles[i];
    return null;
  }

  /* Which positions already grant a stored name, so making a role can say what
     already covers it. This is the check the live system could not do. */
  function positionsGranting(permId) {
    return perms().positions().filter(function (p) {
      return !!perms().held(p)[permId];
    });
  }
  function rolesGranting(permId, except) {
    return state.roles.filter(function (r) {
      return r.id !== except && r.grants.indexOf(permId) >= 0;
    });
  }

  /* The positions a role reaches, as position records rather than ids. */
  function heldIn(r) {
    if (!perms() || !r.across) return [];
    var all = perms().positions();
    return r.across.map(function (id) {
      for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
      return null;
    }).filter(Boolean);
  }

  /* "the Sector lead" is how a position reads mid-sentence; in a chip the
     article is in the way. */
  function chipName(p) {
    return (p.short || p.name).replace(/^the /, '');
  }

  /* ---- what a role actually does for the person holding it --------------

     A role grants a fixed set; what a holder gains is that set minus what
     their position already gave them, and the two are not the same number.
     An HQ officer given Report builder gains nothing — all three are already
     theirs — and the card still said "+3 permissions".

     Worse, Form publisher grants two things that both of its holders already
     have, so it does nothing at all for anyone. That is the failure the
     original audit found in the live system, where twenty-one roles covered
     ten jobs, reproduced here in the replacement. A role that adds nothing is
     not a small inaccuracy on a card; it is a role that should not exist, and
     the screen is where that has to become visible. */
  function addsTo(r, pos) {
    if (!perms() || !pos) return r.grants.length;
    var already = perms().held(pos);
    return r.grants.filter(function (id) { return !already[id]; }).length;
  }

  /* Every position it sits on, with what it gains — so the card can say when
     the headline number is not what anyone actually gets. */
  function effect(r) {
    var rows = heldIn(r).map(function (p) {
      return { pos: p, adds: addsTo(r, p) };
    });
    var nums = rows.map(function (x) { return x.adds; });
    return {
      rows: rows,
      dead: rows.filter(function (x) { return !x.adds; }),
      min: nums.length ? Math.min.apply(null, nums) : r.grants.length,
      max: nums.length ? Math.max.apply(null, nums) : r.grants.length
    };
  }

  function spread(r) {
    var n = heldIn(r).length;
    var who = r.people + (r.people === 1 ? ' person' : ' people');
    if (!n) return who;
    return who + (n === 1 ? ' in one position' : ' across ' + n + ' positions');
  }

  /* ---- the list ---- */

  function card(r) {
    var a = el('button', 'rolec');
    a.type = 'button';
    a.setAttribute('data-go', 'rolecard');
    a.setAttribute('data-role-id', r.id);

    var top = el('div', 'rolec-t');
    top.appendChild(svg(r.icon, 'rolec-i'));
    top.appendChild(el('span', 'rolec-n', r.name));
    if (r.risk) {
      var w = el('span', 'rolec-risk');
      w.setAttribute('data-tip', r.risk);
      w.innerHTML = '<svg aria-hidden="true"><use href="#i-alert"/></svg>';
      top.appendChild(w);
    }
    a.appendChild(top);
    a.appendChild(el('p', 'rolec-w', r.what));

    /* The plus is the whole difference between this tab and the one beside
       it. A position card shows a share of everything — "14 of 26", with a
       meter. A role never has a share; it only ever adds to whatever the
       position already gave. One character says that, from across a room.

       What follows the plus is what a holder gains, not what the role
       grants. Where that differs by position it is a range, because one
       number would have to be wrong for somebody. */
    var foot = el('div', 'rolec-f');
    var e = effect(r);
    var cnt = el('span', 'rolec-c' + (e.max ? '' : ' is-dead'));
    if (!e.max) {
      cnt.appendChild(el('b', null, 'Adds nothing'));
      cnt.setAttribute('data-tip', 'Every permission this grants is already held by '
        + 'both positions it sits on, so nobody gains anything by being given it. '
        + 'A role that adds nothing is a role to retire.');
    } else {
      cnt.appendChild(el('b', null, e.min === e.max ? '+' + e.max : '+' + e.min + '–' + e.max));
      cnt.appendChild(el('span', null, e.max === 1 ? ' permission' : ' permissions'));
      if (e.dead.length) {
        cnt.setAttribute('data-tip', 'It grants ' + r.grants.length + ', but '
          + e.dead.map(function (x) { return chipName(x.pos); }).join(' and ')
          + (e.dead.length === 1 ? ' already holds' : ' already hold')
          + ' all of them and gains nothing.');
      }
    }
    foot.appendChild(cnt);
    /* Only where the role itself is the problem. A role that gains one of its
       holders nothing is a question about that assignment, and the range says
       so on its own — the "+0" is the warning. A role that gains nobody
       anything is a different thing: it should not exist, and that is worth a
       mark of its own rather than the fifth identical triangle on a tab where
       four cards would otherwise carry one. */
    if (!e.max) foot.appendChild(svg('i-alert', 'rolec-dead'));
    foot.appendChild(el('span', 'rolec-p', spread(r)));
    a.appendChild(foot);
    return a;
  }

  /* Hiding rather than redrawing, so the caret stays where it is. */
  function filterCards(root, q) {
    q = (q || '').trim().toLowerCase();
    var n = 0;
    Array.prototype.forEach.call(root.querySelectorAll('.rolegrid > .rolec[data-role-id]'),
      function (c) {
        var hit = !q || c.textContent.toLowerCase().indexOf(q) > -1;
        c.hidden = !hit;
        if (hit) n++;
      });
    var mk = root.querySelector('.rolegrid > .rolec.new');
    if (mk) mk.hidden = !!q;
    var none = root.querySelector('.pm-nohit');
    if (!none) {
      none = el('p', 'pm-nohit');
      var grid = root.querySelector('.rolegrid');
      if (grid) grid.parentNode.insertBefore(none, grid.nextSibling);
    }
    none.textContent = q && !n ? 'No role matches \u201c' + q + '\u201d.' : '';
    none.hidden = !(q && !n);
  }

  function renderList() {
    var root = document.getElementById('roleBody');
    if (!root || !window.SugiraPerms) return;
    root.innerHTML = '';

    var top = el('div', 'pm-top');

    var find = el('div', 'search');
    find.innerHTML = '<svg aria-hidden="true"><use href="#i-search"/></svg>';
    var inp = el('input');
    inp.type = 'text';
    inp.placeholder = 'Search roles';
    inp.setAttribute('aria-label', 'Search roles');
    inp.value = state.find || '';
    inp.oninput = function () {
      state.find = this.value;
      filterCards(root, state.find);
    };
    find.appendChild(inp);
    top.appendChild(find);

    /* It used to clone the screen's end group, which by then the positions
       tab had already taken, so this tab's toolbar was empty. It builds its
       own, the same as that tab does. */
    var end = el('span', 'end');
    var mk = el('button', 'btn');
    mk.type = 'button';
    mk.setAttribute('data-modal', 'rolenew');
    mk.innerHTML = '<svg aria-hidden="true"><use href="#i-plus"/></svg>';
    mk.appendChild(document.createTextNode('Add role'));
    end.appendChild(mk);
    top.appendChild(end);
    root.appendChild(top);

    var grid = el('div', 'rolegrid');
    state.roles.forEach(function (r) { grid.appendChild(card(r)); });

    var add = el('button', 'rolec new');
    add.type = 'button';
    add.setAttribute('data-modal', 'rolenew');
    add.appendChild(svg('i-plus', 'rolec-i'));
    add.appendChild(el('span', 'rolec-n', 'New role'));
    add.appendChild(el('p', 'rolec-w', 'For work that is not a job.'));
    add.setAttribute('data-tip',
      'Before it is made, the sheet says what already grants the same thing — the check '
      + 'the live system never had, which is why it carries twenty-one roles for ten jobs.');
    grid.appendChild(add);
    root.appendChild(grid);
    if (state.find) filterCards(root, state.find);

  }

  /* ---- one role, in a drawer ---- */

  function renderOne() {
    var root = document.getElementById('roleCardBody');
    if (!root || !window.SugiraPerms) return;
    var r = byId(state.open) || state.roles[0];
    if (!r) return;
    root.innerHTML = '';

    var head = el('div', 'rec');
    var top = el('div', 'rec-top');
    var type = el('span', 'rec-type');
    type.appendChild(svg(r.icon, null));
    type.appendChild(el('span', null, 'Role'));
    top.appendChild(type);

    /* Who holds it, and the one thing you do to a role, in the header — the
       same shape the position drawer took, so the two read as one record
       type seen twice rather than two screens. */
    var who = el('button', 'rec-who');
    who.type = 'button';
    who.setAttribute('data-go', 'people');
    who.textContent = r.people + (r.people === 1 ? ' person holds it' : ' people hold it');
    top.appendChild(who);

    var acts = el('span', 'acts');
    var give = el('button', 'btn');
    give.type = 'button';
    give.setAttribute('data-modal', 'roleadd');
    give.innerHTML = '<svg aria-hidden="true"><use href="#i-plus"/></svg>';
    give.appendChild(document.createTextNode('Give it to someone'));
    acts.appendChild(give);
    top.appendChild(acts);
    head.appendChild(top);
    head.appendChild(el('h1', null, r.name));
    /* No description paragraph. Prose explaining the record to the person
       reading it is the thing the drawers were asked twice to stop doing, and
       the six written into index.html came out for the same reason. `r.what`
       stays in the data for whatever wants it next. */
    /* The positions its holders are in. A position drawer can carry nothing
       like this — you hold one position and that is the end of it — so this
       row is the clearest statement on the screen of what a role is: the
       thing that sits on top of several rungs at once. Chips, not a
       sentence, and no box around them. */
    var inPos = heldIn(r);
    if (inPos.length) {
      var held = el('div', 'rec-held');
      held.appendChild(el('span', 'rec-held-k', 'Held in'));
      var chips = el('span', 'rec-held-v');
      inPos.forEach(function (p) {
        var gains = addsTo(r, p);
        var c = el('button', 'chip' + (gains ? '' : ' is-dead'));
        c.type = 'button';
        c.setAttribute('data-go', 'position');
        c.setAttribute('data-pos-id', p.id);
        c.appendChild(document.createTextNode(chipName(p)));
        /* What this position gains, beside the position — the card can only
           carry a range, and the range is useless for deciding whether one
           particular person should be given the role. */
        c.appendChild(el('span', 'chip-n', gains ? '+' + gains : 'gains nothing'));
        chips.appendChild(c);
      });
      held.appendChild(chips);
      head.appendChild(held);
    }
    root.appendChild(head);

    /* what it grants — the same block the position drawer uses. A role has no
       base, so nothing in it is locked; everything is this role's own. */
    var wrap = el('div', 'pm-sect');
    var host = el('div', 'pm-perm');
    wrap.appendChild(host);

    if (window.SugiraAccess) {
      var model = {
        open: roleOpen[r.id] || (roleOpen[r.id] = {}),

        perm: function (id) { return { on: r.grants.indexOf(id) > -1, locked: false }; },

        toggle: function (id) {
          var i = r.grants.indexOf(id);
          if (i > -1) r.grants.splice(i, 1); else r.grants.push(id);
          renderOne();
          renderList();
        },

        setGroup: function (key, on) {
          perms().groups.forEach(function (g) {
            if (g.key !== key) return;
            g.perms.forEach(function (perm) {
              var i = r.grants.indexOf(perm.id);
              if (on && i < 0) r.grants.push(perm.id);
              if (!on && i > -1) r.grants.splice(i, 1);
            });
          });
          renderOne();
          renderList();
        },

        caption: function (key) {
          var granted = r.grants.filter(function (id) {
            var found = permById(id);
            return found && found.group.key === key;
          });
          if (!granted.length) return null;
          /* The check the live system could not do: a role that only repeats
             what a position already gives is a role nobody needs. */
          var covered = granted.filter(function (id) { return positionsGranting(id).length; });
          if (covered.length === granted.length) {
            return 'Every one of these is already granted by a position, so this role adds '
              + 'nothing here.';
          }
          return null;
        },



        redraw: function () { window.SugiraAccess.render(host, model); }
      };
      model.redraw();
    }
    root.appendChild(wrap);

  }

  /* ---- routing ---- */

  document.addEventListener('click', function (e) {
    var c = e.target.closest ? e.target.closest('[data-role-id]') : null;
    if (!c) return;
    state.open = c.getAttribute('data-role-id');
    setTimeout(renderOne, 0);
  }, true);

  document.addEventListener('drawer:render', function () { setTimeout(renderOne, 0); });

  window.SugiraRoles = {
    all: function () { return state.roles; },
    byId: byId,
    rolesGranting: rolesGranting,
    positionsGranting: positionsGranting,
    renderList: renderList,
    renderOne: renderOne
  };

  /* ---- a person, who is one position plus these ----------------------

     The person drawer names its roles in two places — the property grid at
     the top and the access panel below. Both used to be typed by hand, which
     is how "at four different positions" was still on the screen after the
     data said five. Both read the one list now: the ids on #accessTree, the
     same ones the permission rows are computed from. */

  function personRoles() {
    var t = document.getElementById('accessTree');
    var ids = ((t && t.getAttribute('data-roles')) || '').split(',').filter(Boolean);
    return ids.map(byId).filter(Boolean);
  }

  function fillPersonRoles() {
    var rs = personRoles();
    Array.prototype.forEach.call(
      document.querySelectorAll('[data-person-roles]'), function (slot) {
        slot.innerHTML = '';
        var row = slot.closest ? slot.closest('.pgr') : null;
        if (row) row.classList.toggle('is-empty', !rs.length);
        if (!rs.length) {
          var none = el('span', 'empty', '—');
          slot.appendChild(none);
          return;
        }
        rs.forEach(function (r) {
          var b = el('button', 'rel');
          b.type = 'button';
          b.setAttribute('data-go', 'rolecard');
          b.setAttribute('data-role-id', r.id);
          b.appendChild(svg(r.icon, null));
          b.appendChild(document.createTextNode(r.name));
          slot.appendChild(b);
        });
      });
  }

  function mount() {
    if (!document.getElementById('roleBody')) return;
    if (!window.SugiraPerms) { setTimeout(mount, 30); return; }
    renderList();
    renderOne();
    fillPersonRoles();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
