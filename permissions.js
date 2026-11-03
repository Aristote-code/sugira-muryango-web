/* ---------------------------------------------------------------------------
   Permissions.

   The current system has 112 permissions, listed as free text over twelve
   pages, and a role is a name plus 112 checkboxes. There is no way to see what
   a permission grants, no way to see what a person ended up with, and no way
   to give one person one extra thing — so anyone needing one extra thing got a
   whole new role. That is how twenty-one roles exist for ten jobs, three of
   them called Test role.

   This drawer is the whole chain in one place:

     a permission  is one thing you may do to one object
     an object     is a thing in the system — family, form, report
     a group       is the eight rows people actually think in
     a role        is a set of group x verb grants
     a person      holds a role at a place, and may hold exceptions to it

   Every one of the 112 is here under the group it belongs to, with a toggle.
   Toggling a group verb moves every permission under it. Toggling one
   permission on a person records an exception, which says so on the row.

   The 112 are reconstructed from the audit in
   ux-case-study/notes/14-permissions.md, which counted them off the staging
   captures: 20 households, 5 visits, 4 risk of harm, 29 programme, 15 reports,
   19 field support, 17 people and access, 3 maintenance.
--------------------------------------------------------------------------- */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var CRUD = ['list', 'create', 'edit', 'delete'];
  var VERB = { list: 'See', create: 'Add', edit: 'Change', 'delete': 'Archive' };
  var VERBS = ['See', 'Add', 'Change', 'Archive'];

  // object name -> the verbs it actually has. Short of four means the set is
  // incomplete in the real system, which is a defect, not a design.
  function obj(name, verbs) { return { name: name, verbs: verbs || CRUD }; }
  // a permission whose name follows no convention; the verb is explicit
  function one(name, verb, note) { return { name: name, verb: verb, odd: true, note: note }; }

  var GROUPS = [
    { key: 'households', name: 'Households',
      blurb: 'The family and everyone counted in it. Five objects for one idea — the clearest case for collapsing names.',
      objects: [obj('family'), obj('familymember'), obj('familymodule'), obj('admittedfamily'), obj('householdenrollment')],
      extra: [] },
    { key: 'visits', name: 'Visits',
      blurb: 'A session delivered in the household, and the form filled in while it happened.',
      objects: [obj('sessioninaction', ['list', 'create', 'edit'])],
      extra: [one('submit-form', 'Add'), one('View-collected-data', 'See', 'the only capitalised name in the system')] },
    { key: 'roh', name: 'Risk-of-harm cases',
      blurb: 'Child safeguarding. The one group where being wrong harms a child rather than a workflow.',
      objects: [obj('roh')],
      extra: [] },
    { key: 'programme', name: 'Programme',
      blurb: 'Projects, their sessions, the forms inside them, and the words those forms are written in.',
      objects: [obj('project'), obj('module'), obj('form'), obj('question'), obj('construct'), obj('language')],
      extra: [one('forms-list', 'See', 'a typo duplicate of form-list; one of the two is dead'),
              one('can-archive-project', 'Archive'), one('can-translate-forms', 'Change'),
              one('create-form-version', 'Add'), one('manage-cohort', 'Change')] },
    { key: 'reports', name: 'Reports',
      blurb: 'Reading the data back out, and taking it off the platform.',
      objects: [obj('reports'), obj('generalreport'), obj('indicator')],
      extra: [one('customreport-list', 'See'), one('build-reports', 'Add'), one('export-data', 'See')] },
    { key: 'field', name: 'Field support',
      blurb: 'What a home visitor can open on the tablet: videos, documents, answers, and what they send back.',
      objects: [obj('instruction'), obj('category'), obj('resource'), obj('feedback'), obj('help', ['list', 'create'])],
      extra: [one('manage-community', 'Change')] },
    { key: 'people', name: 'People & access',
      blurb: 'This drawer, and who else may open it. Grant it carefully — it is the one that grants the rest.',
      objects: [obj('user'), obj('role'), obj('permission'), obj('profile')],
      extra: [one('userlogs-list', 'See')] },
    { key: 'maintenance', name: 'Maintenance',
      blurb: 'Housekeeping that touches data directly.',
      objects: [obj('recycle-data')],
      extra: [] }
  ];
  // Maintenance is three loose names rather than an object
  GROUPS[7].objects = [];
  GROUPS[7].extra = [one('recycle-data', 'Change'), one('checklist-list', 'See'), one('monitoring-forms-list', 'See')];

  // flatten to the real list
  var ALL = [];
  GROUPS.forEach(function (g) {
    g.perms = [];
    g.objects.forEach(function (o) {
      o.verbs.forEach(function (v) {
        g.perms.push({ id: o.name + '-' + v, obj: o.name, verb: VERB[v], group: g.key,
                       partial: o.verbs.length < 4 });
      });
    });
    g.extra.forEach(function (x) {
      g.perms.push({ id: x.name, obj: null, verb: x.verb, group: g.key, odd: true, note: x.note });
    });
    g.perms.forEach(function (p) { ALL.push(p); });
  });

  /* What each role grants, as group x verb. This is the whole role: the place
     is bound when the role is given to a person, so one role serves every
     sector. */
  var ROLES = {
    'Sugira Muryango Sector lead (SLA)': {
      households: ['See', 'Add', 'Change'], visits: ['See', 'Add', 'Change'],
      roh: ['See', 'Add', 'Change'], programme: ['See'], reports: ['See', 'Add'],
      field: ['See'], people: [], maintenance: [] },
    'Sugira Muryango District lead (DTL)': {
      households: ['See'], visits: ['See'], roh: ['See'], programme: ['See'],
      reports: ['See', 'Add'], field: ['See'], people: [], maintenance: [] },
    'IZU at Village': {
      households: ['See', 'Add', 'Change'], visits: ['See', 'Add'], roh: ['See', 'Add'],
      programme: [], reports: [], field: ['See'], people: [], maintenance: [] },
    'IZU Cell Coordinator (ICC)': {
      households: ['See'], visits: ['See', 'Add'], roh: ['See'], programme: [],
      reports: ['See'], field: ['See'], people: [], maintenance: [] },
    'District NCDA Child protection and Welfare Officer (CPWO)': {
      households: [], visits: [], roh: ['See', 'Change'], programme: [], reports: ['See'],
      field: [], people: [], maintenance: [] },
    'National NCDA Government Official': {
      households: [], visits: [], roh: [], programme: [], reports: ['See'], field: [],
      people: [], maintenance: [] },
    'HQ officer': {
      households: ['See', 'Add', 'Change'], visits: ['See', 'Add', 'Change'],
      roh: ['See'], programme: ['See', 'Add', 'Change', 'Archive'],
      reports: ['See', 'Add', 'Change'], field: ['See', 'Add', 'Change', 'Archive'],
      people: ['See'], maintenance: ['See'] },
    admin: {
      households: VERBS, visits: VERBS, roh: VERBS, programme: VERBS, reports: VERBS,
      field: VERBS, people: VERBS, maintenance: VERBS }
  };

  /* ---- state ---- */
  var state = {
    mode: 'person',                                   // 'person' or 'role'
    who: 'C. Uwimana',
    role: 'Sugira Muryango Sector lead (SLA)',
    open: {},                                         // group key -> expanded
    find: '',
    exceptions: {},                                   // perm id -> true|false
    direct: {}                                        // role mode: perm id -> true|false
  };

  function fromRole(p) {
    var r = ROLES[state.role] || {};
    return (r[p.group] || []).indexOf(p.verb) > -1;
  }
  function isOn(p) {
    if (state.mode === 'role') {
      return state.direct.hasOwnProperty(p.id) ? state.direct[p.id] : fromRole(p);
    }
    return state.exceptions.hasOwnProperty(p.id) ? state.exceptions[p.id] : fromRole(p);
  }
  function isException(p) {
    return state.mode === 'person' && state.exceptions.hasOwnProperty(p.id)
      && state.exceptions[p.id] !== fromRole(p);
  }
  function setPerm(p, on) {
    var bag = state.mode === 'role' ? state.direct : state.exceptions;
    if (on === fromRole(p)) delete bag[p.id]; else bag[p.id] = on;
  }
  function matches(p) {
    var q = state.find.trim().toLowerCase();
    if (!q) return true;
    return p.id.toLowerCase().indexOf(q) > -1 || p.verb.toLowerCase().indexOf(q) > -1;
  }

  /* ---- rendering ---- */
  var ICON_CHEV = '<svg class="pm-cv" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6" ' +
    'stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function toggle(on, label, onChange, extraCls) {
    var b = el('button', 'tg' + (on ? ' on' : '') + (extraCls ? ' ' + extraCls : ''));
    b.type = 'button';
    b.setAttribute('role', 'switch');
    b.setAttribute('aria-checked', String(!!on));
    b.setAttribute('aria-label', label);
    b.innerHTML = '<span class="tg-k"></span>';
    b.onclick = function (e) { e.stopPropagation(); onChange(!on); };
    return b;
  }

  function render() {
    var root = $('#permBody');
    if (!root) return;
    root.innerHTML = '';

    var shown = ALL.filter(matches);
    var on = ALL.filter(isOn).length;
    var exc = ALL.filter(isException).length;

    // ---- who this is for ----
    var head = el('div', 'pm-who');
    if (state.mode === 'person') {
      head.innerHTML = '<p>Showing what <b></b> can do. Everything comes from the position ' +
        '<b class="pm-role"></b>, except where a row says Exception.</p>';
      head.querySelector('b').textContent = state.who;
      head.querySelector('.pm-role').textContent = state.role;
    } else {
      head.innerHTML = '<p>Editing the position <b></b>. Every change here reaches ' +
        'everyone holding it &mdash; <b class="pm-n"></b> people today.</p>';
      head.querySelector('b').textContent = state.role;
      head.querySelector('.pm-n').textContent = '17';
    }
    root.appendChild(head);

    // ---- find + summary ----
    var top = el('div', 'pm-top');
    var find = el('input', 'pm-find');
    find.type = 'text';
    find.placeholder = 'Find a permission by name, like roh or export…';
    find.setAttribute('aria-label', 'Find a permission');
    find.value = state.find;
    find.oninput = function () { state.find = this.value; render(); $('#permBody .pm-find').focus(); };
    top.appendChild(find);
    var sum = el('span', 'pm-sum');
    sum.innerHTML = '<b></b> of ' + ALL.length + ' on';
    sum.querySelector('b').textContent = on;
    top.appendChild(sum);
    if (exc) {
      var e = el('span', 'pm-exc', exc + (exc === 1 ? ' exception' : ' exceptions'));
      top.appendChild(e);
    }
    root.appendChild(top);

    // ---- groups ----
    GROUPS.forEach(function (g) {
      var perms = g.perms.filter(matches);
      if (!perms.length) return;
      var gOn = g.perms.filter(isOn).length;
      var expanded = !!state.open[g.key] || !!state.find;

      var sec = el('section', 'pm-g');
      var h = el('button', 'pm-gh');
      h.type = 'button';
      h.setAttribute('aria-expanded', String(expanded));
      h.innerHTML = ICON_CHEV + '<span class="pm-gn"></span><span class="pm-gc"></span>';
      h.querySelector('.pm-gn').textContent = g.name;
      h.querySelector('.pm-gc').textContent = gOn + ' of ' + g.perms.length;
      h.onclick = function (e) { e.stopPropagation(); state.open[g.key] = !expanded; render(); };

      // the four verb switches that move everything under them
      var vs = el('span', 'pm-gv');
      VERBS.forEach(function (v) {
        var inV = g.perms.filter(function (p) { return p.verb === v; });
        if (!inV.length) { vs.appendChild(el('span', 'pm-gx', '—')); return; }
        var allOn = inV.every(isOn);
        var someOn = !allOn && inV.some(isOn);
        var t = toggle(allOn, v + ' everything in ' + g.name, function (next) {
          inV.forEach(function (p) { setPerm(p, next); });
          state.open[g.key] = true;
          render();
        }, someOn ? 'some' : '');
        var w = el('span', 'pm-gvi');
        w.appendChild(t);
        w.appendChild(el('span', 'pm-gvl', v));
        vs.appendChild(w);
      });
      h.appendChild(vs);
      sec.appendChild(h);

      var bd = el('div', 'pm-gb');
      bd.hidden = !expanded;
      if (g.blurb) bd.appendChild(el('p', 'pm-blurb', g.blurb));

      // group by object so the four verbs of one thing sit together
      var seen = {};
      perms.forEach(function (p) {
        var k = p.obj || '— loose names';
        if (!seen[k]) {
          seen[k] = el('div', 'pm-o');
          var oh = el('div', 'pm-oh');
          oh.appendChild(el('span', 'pm-on', k));
          if (p.partial) oh.appendChild(el('span', 'pm-note', 'incomplete set in the current system'));
          seen[k].appendChild(oh);
          bd.appendChild(seen[k]);
        }
        var row = el('div', 'pm-r' + (isException(p) ? ' is-exc' : ''));
        var nm = el('span', 'pm-rn');
        nm.appendChild(el('code', null, p.id));
        if (p.note) nm.appendChild(el('span', 'pm-note', p.note));
        row.appendChild(nm);
        row.appendChild(el('span', 'pm-rv', p.verb));
        row.appendChild(el('span', 'pm-rs', isException(p) ? 'Exception' :
          (isOn(p) ? (state.mode === 'person' ? 'From the position' : 'Granted') : 'Not granted')));
        row.appendChild(toggle(isOn(p), p.id, function (next) { setPerm(p, next); render(); }));
        seen[k].appendChild(row);
      });
      sec.appendChild(bd);
      root.appendChild(sec);
    });

    if (!shown.length) {
      root.appendChild(el('p', 'pm-none', 'No permission matches “' + state.find + '”.'));
    }
  }

  /* ---- entry points ---- */
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
