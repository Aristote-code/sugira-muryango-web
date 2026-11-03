/* ---------------------------------------------------------------------------
   Permissions.

   The current system has 112 permissions, listed as free text over twelve
   pages, and a role is a name plus 112 checkboxes. Nothing anywhere says what
   a permission actually does, so nobody can check whether a role is right.
   That is the complaint: some permissions are hard to define. So every one of
   the 112 carries a sentence here, and the sentence is generated from the
   object and the verb rather than typed, which is what keeps 112 of them
   consistent and is why adding the 113th costs one line.

   Shape follows ClickUp's own Security & Permissions table, which this app
   borrows its tokens from: permissions down the side, roles across the top, a
   switch in each cell, grouped into sections with a search over the lot.

   Two readings of the same table:

     a role    — the columns are the ten positions, and you edit one of them
     a person  — the columns are their position and themselves, and a cell
                 that disagrees with the position is an exception

   The density warning in every write-up of this pattern is real: a matrix you
   cannot read at a glance gives the illusion of control without the substance.
   So groups stay collapsed until asked for, and the definition column is the
   widest thing on the row.
--------------------------------------------------------------------------- */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var CRUD = ['list', 'create', 'edit', 'delete'];
  var VERB = { list: 'See', create: 'Add', edit: 'Change', 'delete': 'Archive' };
  var VERBS = ['See', 'Add', 'Change', 'Archive'];

  /* What each object is, in words a programme officer would use. The verb
     sentences are built from these, so a wrong noun here is wrong in four
     places at once — which is the point. */
  function obj(name, noun, plural, opts) {
    opts = opts || {};
    return { name: name, noun: noun, plural: plural, verbs: opts.verbs || CRUD,
             risk: opts.risk, note: opts.note };
  }
  function one(name, verb, what, opts) {
    opts = opts || {};
    return { name: name, verb: verb, what: what, odd: true, risk: opts.risk, note: opts.note };
  }

  var GROUPS = [
    { key: 'households', name: 'Households',
      blurb: 'The family and everyone counted in it. Five objects for one idea — the clearest case for collapsing names.',
      objects: [
        obj('family', 'a household on the programme', 'households'),
        obj('familymember', 'a person counted inside a household', 'the people in a household'),
        obj('familymodule', 'one session’s delivery against one household', 'what each household has been delivered'),
        obj('admittedfamily', 'a household that has been accepted onto the programme', 'accepted households'),
        obj('householdenrollment', 'the enrolment record that admits a household', 'enrolments')],
      extra: [] },

    { key: 'visits', name: 'Visits',
      blurb: 'A session delivered in the household, and the form filled in while it happened.',
      objects: [obj('sessioninaction', 'a visit as it is being delivered', 'visits in progress',
                    { verbs: ['list', 'create', 'edit'],
                      note: 'no delete exists — an incomplete set in the current system' })],
      extra: [
        one('submit-form', 'Add', 'Send a completed form from the tablet into the system. This is the permission every home visitor needs and almost nobody else does.'),
        one('View-collected-data', 'See', 'Read the answers people gave, rather than just the count of them. Separate from seeing the form itself.',
            { note: 'the only capitalised name in the system' })] },

    { key: 'roh', name: 'Risk-of-harm cases',
      blurb: 'Child safeguarding. The one group where being wrong harms a child rather than a workflow.',
      objects: [obj('roh', 'a risk-of-harm case', 'risk-of-harm cases',
                    { risk: 'Child safeguarding. Grant deliberately, never in bulk.' })],
      extra: [] },

    { key: 'programme', name: 'Programme',
      blurb: 'Projects, their sessions, the forms inside them, and the words those forms are written in.',
      objects: [
        obj('project', 'a project — the container a set of sessions belongs to', 'projects'),
        obj('module', 'a session inside a project', 'sessions'),
        obj('form', 'a form a visitor fills in during a session', 'forms'),
        obj('question', 'a single question inside a form', 'the questions in a form'),
        obj('construct', 'a construct — what a group of questions together is measuring', 'constructs'),
        obj('language', 'a language the forms can be translated into', 'languages')],
      extra: [
        one('forms-list', 'See', 'Does nothing that form-list does not already do. One of the two names is dead and nobody knows which.',
            { note: 'typo duplicate of form-list — resolve before anything depends on it' }),
        one('can-archive-project', 'Archive', 'Take a whole project off the tablet. Its collected responses stay readable; nothing new can be added to it.'),
        one('can-translate-forms', 'Change', 'Write the Kinyarwanda alongside the English. Does not allow changing what the question asks.'),
        one('create-form-version', 'Add', 'Publish a new version of a form that is already in use, so earlier answers stay attached to the version they were given under.'),
        one('manage-cohort', 'Change', 'Decide which households are grouped together and what dates the group runs between.')] },

    { key: 'reports', name: 'Reports',
      blurb: 'Reading the data back out, and taking it off the platform.',
      objects: [
        obj('reports', 'a saved report someone built', 'saved reports'),
        obj('generalreport', 'a standard programme report that ships with the system', 'standard reports'),
        obj('indicator', 'an indicator — one measured number with a definition behind it', 'indicators')],
      extra: [
        one('customreport-list', 'See', 'See reports other people built, rather than only the standard ones.',
            { note: 'no create, edit or delete exists — an incomplete set' }),
        one('build-reports', 'Add', 'Use the report builder to make a new report from the data this person can already reach.'),
        one('export-data', 'See', 'Take data out as CSV or Excel. Once exported it is outside every permission in this list.',
            { risk: 'Export removes every protection below. Grant it as carefully as the data it reaches.' })] },

    { key: 'field', name: 'Field support',
      blurb: 'What a home visitor can open on the tablet: videos, documents, answers, and what they send back.',
      objects: [
        obj('instruction', 'an instruction page for field staff', 'instructions'),
        obj('category', 'a category that groups help content', 'help categories'),
        obj('resource', 'a document or video published to the tablet', 'documents and videos'),
        obj('feedback', 'feedback sent in from the field', 'field feedback'),
        obj('help', 'a help article', 'help articles',
            { verbs: ['list', 'create'], note: 'no edit or delete exists — an incomplete set' })],
      extra: [
        one('manage-community', 'Change', 'Moderate what field staff post to each other — hide a post, resolve a report.')] },

    { key: 'people', name: 'People & access',
      blurb: 'This drawer, and who else may open it. The one group that grants the rest.',
      objects: [
        obj('user', 'a person’s account', 'the people who can sign in',
            { risk: 'Creating accounts and assigning positions is how access spreads.' }),
        obj('role', 'a position and the permissions it carries', 'positions',
            { risk: 'Changing a position changes it for everyone holding it.' }),
        obj('permission', 'a permission itself — the rows in this table', 'permissions',
            { risk: 'This is the permission that edits permissions.' }),
        obj('profile', 'a person’s own name, email and password', 'profiles')],
      extra: [
        one('userlogs-list', 'See', 'Read what other people did and when — including the attempts that were refused.',
            { note: 'no create, edit or delete exists, correctly: a log nobody can edit is the point' })] },

    { key: 'maintenance', name: 'Maintenance',
      blurb: 'Housekeeping that touches data directly.',
      objects: [],
      extra: [
        one('recycle-data', 'Change', 'Empty the recycle bin, or restore from it. Reaches records their owner has already deleted.',
            { risk: 'Touches deleted data directly.' }),
        one('checklist-list', 'See', 'See the training-data cleanup checklist.',
            { note: 'no create, edit or delete exists — an incomplete set' }),
        one('monitoring-forms-list', 'See', 'See the monitoring forms, which are the forms supervisors fill in rather than home visitors.',
            { note: 'no create, edit or delete exists — an incomplete set' })] }
  ];

  /* The sentence for a CRUD permission, built from the object. Writing these
     by hand 112 times is how they end up inconsistent. */
  function sentence(o, verb) {
    if (verb === 'See') {
      return 'See ' + o.plural + '. Without this the section does not appear at all, '
        + 'so every other permission here is unreachable.';
    }
    if (verb === 'Add') return 'Create ' + o.noun + '.';
    if (verb === 'Change') return 'Change ' + o.noun + ' that already exists. Does not include creating or removing one.';
    return 'Delete ' + o.noun + '. In the current system this removes it outright rather than archiving it.';
  }

  /* Said once, on the permission that earns it. */
  var RISK = {
    'roh-delete': 'A safeguarding record, removed outright. The audit argues this permission should not exist at all.',
    'roh-list': 'Opens children\u2019s records. The count of cases is not a permission; this is.',
    'user-create': 'Creating accounts and assigning positions is how access spreads.',
    'role-edit': 'Changing a position changes it for everyone holding it, at once.',
    'permission-edit': 'This is the permission that edits permissions.',
    'permission-create': 'Inventing a permission that nothing checks is how the current list reached 112.'
  };

  var ALL = [];
  GROUPS.forEach(function (g) {
    g.perms = [];
    g.objects.forEach(function (o) {
      o.verbs.forEach(function (v) {
        g.perms.push({ id: o.name + '-' + v, obj: o.name, verb: VERB[v], group: g.key,
                       what: sentence(o, VERB[v]), risk: RISK[o.name + '-' + v] || null,
                       note: v === 'list' ? o.note : null });
      });
    });
    g.extra.forEach(function (x) {
      g.perms.push({ id: x.name, obj: null, verb: x.verb, group: g.key,
                     what: x.what, risk: x.risk, note: x.note, odd: true });
    });
    g.perms.forEach(function (p) { ALL.push(p); });
  });

  /* Positions, as group x verb. The place is bound when the position is given
     to a person, so one position serves every sector. */
  var ROLES = [
    { id: 'SLA', name: 'Sugira Muryango Sector lead (SLA)', grants: {
        households: ['See', 'Add', 'Change'], visits: ['See', 'Add', 'Change'],
        roh: ['See', 'Add', 'Change'], programme: ['See'], reports: ['See', 'Add'],
        field: ['See'], people: [], maintenance: [] } },
    { id: 'DTL', name: 'Sugira Muryango District lead (DTL)', grants: {
        households: ['See'], visits: ['See'], roh: ['See'], programme: ['See'],
        reports: ['See', 'Add'], field: ['See'], people: [], maintenance: [] } },
    { id: 'IZU', name: 'IZU at Village', grants: {
        households: ['See', 'Add', 'Change'], visits: ['See', 'Add'], roh: ['See', 'Add'],
        programme: [], reports: [], field: ['See'], people: [], maintenance: [] } },
    { id: 'ICC', name: 'IZU Cell Coordinator (ICC)', grants: {
        households: ['See'], visits: ['See', 'Add'], roh: ['See'], programme: [],
        reports: ['See'], field: ['See'], people: [], maintenance: [] } },
    { id: 'CPWO', name: 'District NCDA Child protection and Welfare Officer (CPWO)', grants: {
        households: [], visits: [], roh: ['See', 'Change'], programme: [], reports: ['See'],
        field: [], people: [], maintenance: [] } },
    { id: 'NCDA', name: 'National NCDA Government Official', grants: {
        households: [], visits: [], roh: [], programme: [], reports: ['See'], field: [],
        people: [], maintenance: [] } },
    { id: 'HQ', name: 'HQ officer', grants: {
        households: ['See', 'Add', 'Change'], visits: ['See', 'Add', 'Change'], roh: ['See'],
        programme: VERBS, reports: ['See', 'Add', 'Change'], field: VERBS,
        people: ['See'], maintenance: ['See'] } },
    { id: 'Admin', name: 'admin', grants: {
        households: VERBS, visits: VERBS, roh: VERBS, programme: VERBS, reports: VERBS,
        field: VERBS, people: VERBS, maintenance: VERBS } }
  ];
  function roleByName(n) {
    for (var i = 0; i < ROLES.length; i++) if (ROLES[i].name === n) return ROLES[i];
    return ROLES[0];
  }

  var state = {
    mode: 'person',
    who: 'C. Uwimana',
    role: 'Sugira Muryango Sector lead (SLA)',
    open: {}, find: '', exceptions: {}, direct: {}
  };

  function granted(role, p) {
    var k = role.id + '|' + p.id;
    if (state.direct.hasOwnProperty(k)) return state.direct[k];
    return (role.grants[p.group] || []).indexOf(p.verb) > -1;
  }
  function position() { return roleByName(state.role); }
  function effective(p) {
    return state.exceptions.hasOwnProperty(p.id) ? state.exceptions[p.id] : granted(position(), p);
  }
  function isException(p) {
    return state.mode === 'person' && state.exceptions.hasOwnProperty(p.id)
      && state.exceptions[p.id] !== granted(position(), p);
  }
  function matches(p) {
    var q = state.find.trim().toLowerCase();
    if (!q) return true;
    return (p.id + ' ' + p.verb + ' ' + p.what).toLowerCase().indexOf(q) > -1;
  }

  /* ---- rendering ---- */
  var CHEV = '<svg class="pm-cv" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6" ' +
    'stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  var TICK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 13 4 4L19 7" ' +
    'stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function cell(on, some, label, onChange) {
    var b = el('button', 'ck' + (on ? ' on' : (some ? ' some' : '')));
    b.type = 'button';
    b.setAttribute('role', 'checkbox');
    b.setAttribute('aria-checked', on ? 'true' : (some ? 'mixed' : 'false'));
    b.setAttribute('aria-label', label);
    b.innerHTML = TICK;
    b.onclick = function (e) { e.stopPropagation(); onChange(!on); };
    return b;
  }

  function render() {
    var root = $('#permBody');
    if (!root) return;
    root.innerHTML = '';
    var editing = state.mode === 'person' ? null : roleByName(state.role);

    var head = el('div', 'pm-who');
    if (state.mode === 'person') {
      head.innerHTML = '<p>The column marked <b class="a"></b> is what ' +
        '<b class="c"></b> holds today. Changing a cell in it records an exception against them; ' +
        'changing any other column changes that position for everyone who holds it.</p>';
      head.querySelector('.a').textContent = position().id;
      head.querySelector('.c').textContent = state.who;
    } else {
      head.innerHTML = '<p>Every position across the top, every capability down the side. ' +
        'Click a cell to grant or remove it. A position is the whole column, so a change here reaches ' +
        'everyone holding it.</p>';
    }
    root.appendChild(head);

    var top = el('div', 'pm-top');
    var find = el('input', 'pm-find');
    find.type = 'text';
    find.placeholder = 'Find a permission by name or by what it does…';
    find.setAttribute('aria-label', 'Find a permission');
    find.value = state.find;
    find.oninput = function () {
      state.find = this.value;
      render();
      var f = $('#permBody .pm-find');
      if (f) { f.focus(); f.setSelectionRange(f.value.length, f.value.length); }
    };
    top.appendChild(find);
    var exc = ALL.filter(isException).length;
    if (exc) top.appendChild(el('span', 'pm-exc', exc + (exc === 1 ? ' exception' : ' exceptions')));
    root.appendChild(top);

    var wrap = el('div', 'tblwrap');
    var tb = el('table', 'tbl pm-t');

    var thead = el('thead');
    var hr = el('tr');
    hr.appendChild(el('th', 'pm-cap', 'Capability'));
    ROLES.forEach(function (r) {
      var mine = state.mode === 'person' && r.name === state.role;
      var th = el('th', 'a' + (mine ? ' pm-me' : ''));
      th.title = r.name + (mine ? ' — the position ' + state.who + ' holds' : '');
      th.appendChild(el('span', 'pm-rid', r.id));
      th.appendChild(el('span', 'pm-rn2', ALL.filter(function (p) { return granted(r, p); }).length + ''));
      hr.appendChild(th);
    });
    if (state.mode === 'person') {
      var me = el('th', 'a pm-me2');
      me.title = state.who;
      me.appendChild(el('span', 'pm-rid', state.who.split(' ').pop()));
      me.appendChild(el('span', 'pm-rn2', ALL.filter(effective).length + ''));
      hr.appendChild(me);
    }
    thead.appendChild(hr);
    tb.appendChild(thead);

    var body = el('tbody');
    var span = ROLES.length + 1 + (state.mode === 'person' ? 1 : 0);

    GROUPS.forEach(function (g) {
      var hits = g.perms.filter(matches);
      if (!hits.length) return;
      var expanded = !!state.open[g.key] || !!state.find;

      // the group row: a heading you can open, not a data row
      var gr = el('tr', 'pm-grp');
      var gc = el('td', 'pm-cap');
      var gb = el('button', 'pm-gh');
      gb.type = 'button';
      gb.setAttribute('aria-expanded', String(expanded));
      gb.innerHTML = CHEV + '<span class="pm-gn"></span><span class="pm-gc"></span>';
      gb.querySelector('.pm-gn').textContent = g.name;
      gb.querySelector('.pm-gc').textContent = g.perms.length + ' permissions';
      gb.onclick = function (e) { e.stopPropagation(); state.open[g.key] = !expanded; render(); };
      gc.appendChild(gb);
      gr.appendChild(gc);
      gr.appendChild(el('td', null, '')).setAttribute('colspan', span - 1);
      body.appendChild(gr);

      if (expanded && g.blurb) {
        var br = el('tr', 'pm-blurbr');
        var bc = el('td', 'pm-cap');
        bc.appendChild(el('p', 'pm-blurb', g.blurb));
        br.appendChild(bc);
        br.appendChild(el('td', null, '')).setAttribute('colspan', span - 1);
        body.appendChild(br);
      }

      VERBS.forEach(function (v) {
        var inV = g.perms.filter(function (p) { return p.verb === v; });
        if (!inV.length) return;
        var shownV = inV.filter(matches);
        if (!shownV.length && state.find) return;

        var tr = el('tr', 'pm-cr');
        var c0 = el('td', 'pm-cap');
        var lab = el('span', 'pm-vb');
        lab.appendChild(el('b', null, v));
        lab.appendChild(el('span', 'pm-vn', inV.length === 1 ? '1 permission' : inV.length + ' permissions'));
        c0.appendChild(lab);
        tr.appendChild(c0);

        ROLES.forEach(function (r) {
          var all = inV.every(function (p) { return granted(r, p); });
          var some = !all && inV.some(function (p) { return granted(r, p); });
          var mine = state.mode === 'person' && r.name === state.role;
          var td = el('td', 'a' + (mine ? ' pm-me' : ''));
          td.appendChild(cell(all, some, r.name + ' — ' + v + ' ' + g.name, function (next) {
            inV.forEach(function (p) {
              if (next === (r.grants[p.group] || []).indexOf(p.verb) > -1) delete state.direct[r.id + '|' + p.id];
              else state.direct[r.id + '|' + p.id] = next;
            });
            render();
          }));
          tr.appendChild(td);
        });
        if (state.mode === 'person') {
          var allMe = inV.every(effective), someMe = !allMe && inV.some(effective);
          var td2 = el('td', 'a pm-me2');
          td2.appendChild(cell(allMe, someMe, state.who + ' — ' + v + ' ' + g.name, function (next) {
            inV.forEach(function (p) {
              if (next === granted(position(), p)) delete state.exceptions[p.id];
              else state.exceptions[p.id] = next;
            });
            render();
          }));
          tr.appendChild(td2);
        }
        body.appendChild(tr);

        if (!expanded) return;
        // the stored names behind this capability
        shownV.forEach(function (p) {
          var pr = el('tr', 'pm-pr' + (isException(p) ? ' is-exc' : ''));
          var pc = el('td', 'pm-cap');
          var nm = el('span', 'pm-pn');
          nm.appendChild(el('code', null, p.id));
          pc.appendChild(nm);
          pc.appendChild(el('span', 'pm-what', p.what));
          if (p.risk) pc.appendChild(el('span', 'pm-risk', p.risk));
          if (p.note) pc.appendChild(el('span', 'pm-note', p.note));
          pr.appendChild(pc);
          ROLES.forEach(function (r) {
            var mine = state.mode === 'person' && r.name === state.role;
            var td = el('td', 'a' + (mine ? ' pm-me' : ''));
            td.appendChild(cell(granted(r, p), false, p.id + ' for ' + r.name, function (next) {
              if (next === (r.grants[p.group] || []).indexOf(p.verb) > -1) delete state.direct[r.id + '|' + p.id];
              else state.direct[r.id + '|' + p.id] = next;
              render();
            }));
            pr.appendChild(td);
          });
          if (state.mode === 'person') {
            var td3 = el('td', 'a pm-me2');
            td3.appendChild(cell(effective(p), false, p.id + ' for ' + state.who, function (next) {
              if (next === granted(position(), p)) delete state.exceptions[p.id];
              else state.exceptions[p.id] = next;
              render();
            }));
            pr.appendChild(td3);
          }
          body.appendChild(pr);
        });
      });
    });

    tb.appendChild(body);
    wrap.appendChild(tb);
    root.appendChild(wrap);

    if (!ALL.filter(matches).length) {
      root.appendChild(el('p', 'pm-none', 'No permission matches “' + state.find + '”.'));
    }
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-perms]');
    if (!t) return;
    state.mode = t.getAttribute('data-perms');
    if (t.getAttribute('data-perms-who')) state.who = t.getAttribute('data-perms-who');
    if (t.getAttribute('data-perms-role')) state.role = t.getAttribute('data-perms-role');
    state.find = '';
    state.open = {};
    setTimeout(render, 0);
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();

  window.SugiraPerms = { render: render, all: ALL, groups: GROUPS, roles: ROLES };
})();
