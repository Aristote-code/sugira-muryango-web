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
      grants: ['can-translate-forms', 'language-list', 'language-edit', 'form-list'] },

    { id: 'reporter', name: 'Report builder', icon: 'i-reports', people: 9,
      what: 'Builds reports beyond the standard ones and takes the numbers out of the '
        + 'system. Held by M&E staff at national and district level alike.',
      grants: ['build-reports', 'export-data', 'customreport-list', 'indicator-list'] },

    { id: 'cohorts', name: 'Cohort manager', icon: 'i-visits', people: 4,
      what: 'Decides which households are grouped together and what dates the group runs '
        + 'between. One or two people per district do this, whatever else they are.',
      grants: ['manage-cohort'] },

    { id: 'publisher', name: 'Form publisher', icon: 'i-programme', people: 2,
      what: 'Publishes a new version of a form that is already in use, and takes a project '
        + 'off the tablet. The riskiest thing on this list — it reaches every tablet.',
      grants: ['create-form-version', 'can-archive-project'],
      risk: 'Publishing reaches every tablet in the programme at once.' },

    { id: 'community', name: 'Community manager', icon: 'i-message', people: 3,
      what: 'Answers what field staff post, and keeps the guidance they read current.',
      grants: ['manage-community', 'feedback-list', 'resource-edit'] }
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
    var found = permById(permId);
    if (!found) return [];
    var key = found.group.key + '|' + found.perm.verb;
    return perms().positions().filter(function (p) {
      return !!perms().held(p)[key];
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
      + 'level. A role only adds to what a position already gives; it can never take '
      + 'something away, so a person is still their position plus a named list.');
    mark.innerHTML = '<svg aria-hidden="true"><use href="#i-info"/></svg>';
    top.appendChild(mark);

    var sum = el('span', 'pm-sum');
    sum.appendChild(el('b', null, String(state.roles.length)));
    sum.appendChild(el('span', null, ' roles · '));
    sum.appendChild(el('b', null, String(state.roles.reduce(function (n, r) {
      return n + r.grants.length; }, 0))));
    sum.appendChild(el('span', null, ' permissions given · '));
    sum.appendChild(el('b', null, String(state.roles.reduce(function (n, r) {
      return n + r.people; }, 0))));
    sum.appendChild(el('span', null, ' holders'));
    top.appendChild(sum);

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
    add.appendChild(el('p', 'rolec-w',
      'For work that is not a job. Before it is made, this says what already grants the '
      + 'same thing — which is the check the live system never had.'));
    grid.appendChild(add);
    root.appendChild(grid);

    root.appendChild(el('p', 'pm-foot',
      'None of these is a rung. A Sector lead who translates forms holds the Sector lead '
      + 'position and the Form translator role — not a position called “Sector lead who '
      + 'translates”, which is how the live system came to carry twenty-one roles for ten '
      + 'jobs. A role adds; it never takes away.'));
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
    head.appendChild(top);
    head.appendChild(el('h1', null, r.name));
    /* No description paragraph. Prose explaining the record to the person
       reading it is the thing the drawers were asked twice to stop doing, and
       the six written into index.html came out for the same reason. `r.what`
       stays in the data for whatever wants it next. */
    root.appendChild(head);

    /* what it grants */
    var card1 = el('div', 'card');
    var h1 = el('div', 'card-h');
    h1.appendChild(el('h3', null, 'What it grants'));
    var side = el('span', 'side');
    var addb = el('button', 'btn sec sm');
    addb.type = 'button';
    addb.setAttribute('data-modal', 'roleperm');
    addb.innerHTML = '<svg aria-hidden="true"><use href="#i-plus"/></svg>';
    addb.appendChild(document.createTextNode(' Add a permission'));
    side.appendChild(addb);
    h1.appendChild(side);
    card1.appendChild(h1);

    var list = el('div', 'tree');
    r.grants.forEach(function (id) {
      var found = permById(id);
      var row = el('div', 'plr leaf rolep');
      row.appendChild(el('code', 'acc-id', id));
      row.appendChild(el('span', 'acc-what', found ? found.perm.what : 'Not in the capture.'));
      if (found) {
        var also = positionsGranting(id);
        var tag = el('span', 'rolep-also');
        tag.textContent = also.length
          ? also.length + (also.length === 1 ? ' position already has it' : ' positions already have it')
          : 'no position has it';
        tag.setAttribute('data-tip', also.length
          ? 'Already granted by ' + also.map(function (p) { return p.short || p.name; }).join(', ')
            + '. Anyone holding one of those does not need this role for this permission.'
          : 'No position grants this, so this role is the only way anyone gets it.');
        row.appendChild(tag);
      }
      var x = el('button', 'rolep-x');
      x.type = 'button';
      x.setAttribute('aria-label', 'Take ' + id + ' out of ' + r.name);
      x.innerHTML = '<svg aria-hidden="true"><use href="#i-cross"/></svg>';
      x.onclick = function (e) {
        e.stopPropagation();
        r.grants.splice(r.grants.indexOf(id), 1);
        renderOne();
        renderList();
      };
      row.appendChild(x);
      list.appendChild(row);
    });
    if (!r.grants.length) {
      card1.appendChild(el('p', 'pm-none', 'Nothing yet. A role with no permissions gives '
        + 'its holders exactly what their position already gave them.'));
    } else {
      card1.appendChild(list);
    }
    card1.appendChild(el('p', 'pm-rule',
      'A role only adds. Whatever is listed here is given on top of each holder’s position '
      + '— it can never take something away, so nobody ends up less than their job.'));
    root.appendChild(card1);

    /* who holds it */
    var card2 = el('div', 'card');
    var h2 = el('div', 'card-h');
    h2.appendChild(el('h3', null, 'Who holds it'));
    var side2 = el('span', 'side');
    var addp = el('button', 'btn sec sm');
    addp.type = 'button';
    addp.setAttribute('data-modal', 'roleadd');
    addp.innerHTML = '<svg aria-hidden="true"><use href="#i-plus"/></svg>';
    addp.appendChild(document.createTextNode(' Give it to someone'));
    side2.appendChild(addp);
    h2.appendChild(side2);
    card2.appendChild(h2);
    card2.appendChild(el('p', 'pm-rule', r.people
      + (r.people === 1 ? ' person holds this role' : ' people hold this role')
      + ', across every position. Taking a permission out of it above takes it from all '
      + 'of them at once.'));
    var who = el('button', 'rel');
    who.type = 'button';
    who.setAttribute('data-go', 'people');
    who.innerHTML = '<svg aria-hidden="true"><use href="#i-admin"/></svg>';
    who.appendChild(document.createTextNode('See the ' + r.people + ' in People'));
    card2.appendChild(who);
    root.appendChild(card2);
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
