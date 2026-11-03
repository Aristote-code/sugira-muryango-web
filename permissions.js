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
    if (state.mode === 'role' && role.name === state.role && state.direct.hasOwnProperty(p.id)) {
      return state.direct[p.id];
    }
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
  function toggle(on, label, onChange, cls) {
    var b = el('button', 'tg' + (on ? ' on' : '') + (cls ? ' ' + cls : ''));
    b.type = 'button';
    b.setAttribute('role', 'switch');
    b.setAttribute('aria-checked', String(!!on));
    b.setAttribute('aria-label', label);
    b.innerHTML = '<span class="tg-k"></span>';
    if (onChange) b.onclick = function (e) { e.stopPropagation(); onChange(!on); };
    else { b.disabled = true; b.classList.add('ro'); }
    return b;
  }

  // which toggle columns the table carries, in order
  function columns() {
    if (state.mode === 'role') {
      return ROLES.map(function (r) {
        return { key: r.id, head: r.id, title: r.name, editable: r.name === state.role,
                 get: function (p) { return granted(r, p); },
                 set: function (p, on) {
                   if (on === (r.grants[p.group] || []).indexOf(p.verb) > -1) delete state.direct[p.id];
                   else state.direct[p.id] = on;
                 } };
      });
    }
    var pos = position();
    return [
      { key: 'pos', head: pos.id, title: 'From the position — ' + pos.name, editable: false,
        get: function (p) { return granted(pos, p); } },
      { key: 'who', head: state.who.split(' ').pop(), title: state.who, editable: true, person: true,
        get: effective,
        set: function (p, on) {
          if (on === granted(pos, p)) delete state.exceptions[p.id];
          else state.exceptions[p.id] = on;
        } }
    ];
  }

  function render() {
    var root = $('#permBody');
    if (!root) return;
    root.innerHTML = '';
    var cols = columns();
    var onCount = state.mode === 'role'
      ? ALL.filter(function (p) { return granted(position(), p); }).length
      : ALL.filter(effective).length;
    var exc = ALL.filter(isException).length;

    var head = el('div', 'pm-who');
    if (state.mode === 'person') {
      head.innerHTML = '<p>What <b class="a"></b> can do. The <b class="b"></b> column is what their position ' +
        'grants; the one beside it is them. A cell that disagrees with the position is an exception.</p>';
      head.querySelector('.a').textContent = state.who;
      head.querySelector('.b').textContent = position().id;
    } else {
      head.innerHTML = '<p>Every position across the top, every permission down the side. You are editing ' +
        '<b class="a"></b>; the other columns are shown so you can see what you are making it differ from.</p>';
      head.querySelector('.a').textContent = state.role;
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
    var sum = el('span', 'pm-sum');
    sum.innerHTML = '<b></b> of ' + ALL.length + ' on';
    sum.querySelector('b').textContent = onCount;
    top.appendChild(sum);
    if (exc) top.appendChild(el('span', 'pm-exc', exc + (exc === 1 ? ' exception' : ' exceptions')));
    root.appendChild(top);

    GROUPS.forEach(function (g) {
      var perms = g.perms.filter(matches);
      if (!perms.length) return;
      var expanded = !!state.open[g.key] || !!state.find;
      var gOn = g.perms.filter(state.mode === 'role'
        ? function (p) { return granted(position(), p); } : effective).length;

      var sec = el('section', 'pm-g');
      var h = el('button', 'pm-gh');
      h.type = 'button';
      h.setAttribute('aria-expanded', String(expanded));
      h.innerHTML = CHEV + '<span class="pm-gn"></span><span class="pm-gc"></span>';
      h.querySelector('.pm-gn').textContent = g.name;
      h.querySelector('.pm-gc').textContent = gOn + ' of ' + g.perms.length;
      h.onclick = function (e) { e.stopPropagation(); state.open[g.key] = !expanded; render(); };

      var vs = el('span', 'pm-gv');
      var editable = cols.filter(function (c) { return c.editable; })[0];
      VERBS.forEach(function (v) {
        var inV = g.perms.filter(function (p) { return p.verb === v; });
        if (!inV.length || !editable) { vs.appendChild(el('span', 'pm-gx', '—')); return; }
        var allOn = inV.every(editable.get);
        var someOn = !allOn && inV.some(editable.get);
        var w = el('span', 'pm-gvi');
        w.appendChild(toggle(allOn, v + ' everything in ' + g.name, function (next) {
          inV.forEach(function (p) { editable.set(p, next); });
          state.open[g.key] = true;
          render();
        }, someOn ? 'some' : ''));
        w.appendChild(el('span', 'pm-gvl', v));
        vs.appendChild(w);
      });
      h.appendChild(vs);
      sec.appendChild(h);

      var bd = el('div', 'pm-gb');
      bd.hidden = !expanded;
      if (g.blurb) bd.appendChild(el('p', 'pm-blurb', g.blurb));

      var wrap = el('div', 'tblwrap');
      var tb = el('table', 'tbl pm-t');
      var thead = el('thead');
      var hr = el('tr');
      hr.appendChild(el('th', null, 'Permission'));
      hr.appendChild(el('th', null, 'What it means'));
      hr.appendChild(el('th', 'a', 'Verb'));
      cols.forEach(function (c) {
        var th = el('th', 'a' + (c.person ? ' pm-me' : ''), c.head);
        th.title = c.title;
        hr.appendChild(th);
      });
      thead.appendChild(hr);
      tb.appendChild(thead);

      var body = el('tbody');
      perms.forEach(function (p) {
        var tr = el('tr', isException(p) ? 'is-exc' : null);
        var c0 = el('td', 'nm');
        c0.appendChild(el('code', null, p.id));
        if (p.note) c0.appendChild(el('span', 'pm-note', p.note));
        tr.appendChild(c0);

        var c1 = el('td', 'pm-what');
        c1.appendChild(el('span', null, p.what));
        if (p.risk) c1.appendChild(el('span', 'pm-risk', p.risk));
        tr.appendChild(c1);
        tr.appendChild(el('td', 'a mut', p.verb));

        cols.forEach(function (c) {
          var td = el('td', 'a' + (c.person ? ' pm-me' : ''));
          td.appendChild(toggle(c.get(p), p.id + ' for ' + c.title,
            c.editable ? function (next) { c.set(p, next); render(); } : null));
          tr.appendChild(td);
        });
        body.appendChild(tr);
      });
      tb.appendChild(body);
      wrap.appendChild(tb);
      bd.appendChild(wrap);
      sec.appendChild(bd);
      root.appendChild(sec);
    });

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
