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

  var SEED = [
    { id: 'translator', name: 'Form translator', icon: 'i-reports', people: 6,
      what: 'Writes the Kinyarwanda alongside the English. Not a rung — the people who '
        + 'translate sit at every level, and none of them needs a position of their own.',
      grants: ['prog-translate', 'prog-see'] },

    { id: 'reporter', name: 'Report builder', icon: 'i-reports', people: 9,
      what: 'Builds reports beyond the standard ones and takes the numbers out of the '
        + 'system. Held by M&E staff at national and district level alike.',
      grants: ['rep-see', 'rep-build', 'rep-export'] },

    { id: 'cohorts', name: 'Cohort manager', icon: 'i-visits', people: 4,
      what: 'Decides which households are grouped together and what dates the group runs '
        + 'between. One or two people per district do this, whatever else they are.',
      grants: ['prog-cohorts'] },

    { id: 'publisher', name: 'Form publisher', icon: 'i-programme', people: 2,
      what: 'Publishes a new version of a form that is already in use, and takes a project '
        + 'off the tablet. The riskiest thing on this list — it reaches every tablet.',
      grants: ['prog-change', 'prog-archive'],
      risk: 'Publishing reaches every tablet in the programme at once.' },

    { id: 'community', name: 'Community manager', icon: 'i-message', people: 3,
      what: 'Answers what field staff post, and keeps the guidance they read current.',
      grants: ['fs-see', 'fs-change', 'fs-community'] }
  ];

  function fresh() {
    return SEED.map(function (r) {
      return { id: r.id, name: r.name, icon: r.icon, people: r.people, what: r.what,
               risk: r.risk, grants: r.grants.slice() };
    });
  }

  var state = { roles: fresh(), open: null };

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

    var foot = el('div', 'rolec-f');
    foot.appendChild(el('span', 'rolec-c',
      r.grants.length + (r.grants.length === 1 ? ' permission' : ' permissions')));
    foot.appendChild(el('span', 'rolec-p',
      r.people + (r.people === 1 ? ' person' : ' people')));
    a.appendChild(foot);
    return a;
  }

  function renderList() {
    var root = document.getElementById('roleBody');
    if (!root || !window.SugiraPerms) return;
    root.innerHTML = '';

    var top = el('div', 'pm-top');
    var mark = el('button', 'ihelp');
    mark.type = 'button';
    mark.setAttribute('aria-expanded', 'false');
    mark.setAttribute('aria-label', 'What a role is');
    mark.setAttribute('data-tip',
      'A role is a small bundle of permissions for work that is not a job. Translating a '
      + 'form, building a report, managing cohorts — the people who do these sit at every '
      + 'level, so none of them is a rung. A Sector lead who translates holds the Sector '
      + 'lead position and the Form translator role, not a position called “Sector lead '
      + 'who translates”. A role only adds; it can never take something away.');
    mark.innerHTML = '<svg aria-hidden="true"><use href="#i-info"/></svg>';
    top.appendChild(mark);


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

  function mount() {
    if (!document.getElementById('roleBody')) return;
    if (!window.SugiraPerms) { setTimeout(mount, 30); return; }
    renderList();
    renderOne();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
