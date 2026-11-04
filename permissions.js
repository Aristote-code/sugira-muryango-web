/* ---------------------------------------------------------------------------
   Roles & access.

   The live system has 112 permissions and 21 roles for 10 jobs, three of them
   called "Test role". The cause is in the create-role form: a name, and 112
   blank checkboxes with Check all / Uncheck all. There is no way to say "what
   a sector lead has, plus one thing", so anyone who needed one extra thing got
   a whole new role.

   So the question is not how to draw 112 checkboxes better. It is how to stop
   anyone starting from 112 checkboxes.

   What the design system actually does about permissions — read from the
   component source, not the prose:

     components/AppDialog.tsx:547  SpacePermission = full | edit | comment | view.
       Four *named, ordered* levels, each carrying one sentence: "Full edit —
       Can create and edit items, and manage sharing". The entire permission
       control on Create a Space is one row: an icon, a label, and an outline
       button that opens four radio items. No checkboxes anywhere.

     components/AppDialog.tsx:404  DialogSelect, the "Invite as" row: a 52 tall
       trigger with a 36 px icon tile, the level's title and a chevron, and the
       level's description on a second line, visible at rest rather than hidden
       behind a tooltip. That is ClickUp's "choose what this person is".

     components/Menu.tsx:117  MenuRadioItem carries a `description` that wraps
       onto its own line (--menu-description-font-size). The chooser explains
       itself inside the menu, at the moment of choosing.

     blocks/ListDialogs.tsx:70  ShareDialog: stacked cards, one expanded, the
       rest collapsed to their header; a "Share with" heading; the inherited
       row (the Space) with a switch; and anything extra as its own row
       underneath, each one individually removable.

   Three things taken from that, and nothing else:

     1. A position is a *named* thing with a sentence, not a set of ticks.
     2. A position is built on another position and may only ADD to it. This is
        ClickUp's custom-role rule, and it is exactly what the 21-for-10 problem
        needs: a job that needs less is not a new role, it is a lower rung.
     3. Stacked disclosure cards, one open at a time, with the extras as rows
        you can remove one by one.

   What that produces, from the same grant data the matrix was built from:

     IZU at Village (26) ── the field root: a home visitor sees no reports
       └─ Sugira Muryango Sector lead (44)

     National NCDA (5) ──── the office root: reports and nothing else
       ├─ District CPWO (7)
       ├─ IZU Cell Coordinator (20)
       └─ District lead (29)
           └─ HQ officer (88)
               └─ admin (112)

   Two roots, and they meet nowhere: the field ladder and the office ladder
   share no rung. That falls out of the data rather than being arranged, and it
   is the most useful sentence on the screen.

   The 112 stored names are still here, each with a definition generated from
   its object and verb — because the complaint was that nothing anywhere says
   what a permission does. They sit one disclosure deeper, under the position
   that holds them, with the rung they arrive from named on each row.

   Place stays off the position. Which sector or district someone covers is set
   when the position is given to them. Putting it here would make this
   8 x 32 x 63 and nobody would read it again.
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
    return { name: name, noun: noun, plural: plural, verbs: opts.verbs || CRUD, note: opts.note };
  }
  function one(name, verb, what, opts) {
    opts = opts || {};
    return { name: name, verb: verb, what: what, odd: true, risk: opts.risk, note: opts.note };
  }

  var GROUPS = [
    { key: 'households', name: 'Households', icon: 'i-households',
      blurb: 'The family and everyone counted in it. Five objects for one idea — the clearest case for collapsing names.',
      objects: [
        obj('family', 'a household on the programme', 'households'),
        obj('familymember', 'a person counted inside a household', 'the people in a household'),
        obj('familymodule', 'one session’s delivery against one household', 'what each household has been delivered'),
        obj('admittedfamily', 'a household that has been accepted onto the programme', 'accepted households'),
        obj('householdenrollment', 'the enrolment record that admits a household', 'enrolments')],
      extra: [] },

    { key: 'visits', name: 'Visits', icon: 'i-visits',
      blurb: 'A session delivered in the household, and the form filled in while it happened.',
      objects: [obj('sessioninaction', 'a visit as it is being delivered', 'visits in progress',
                    { verbs: ['list', 'create', 'edit'],
                      note: 'no delete exists — an incomplete set in the current system' })],
      extra: [
        one('submit-form', 'Add', 'Send a completed form from the tablet into the system. This is the permission every home visitor needs and almost nobody else does.'),
        one('View-collected-data', 'See', 'Read the answers people gave, rather than just the count of them. Separate from seeing the form itself.',
            { note: 'the only capitalised name in the system' })] },

    { key: 'roh', name: 'Risk-of-harm cases', icon: 'i-safeguarding', guarded: true,
      blurb: 'Child safeguarding. The one group where being wrong harms a child rather than a workflow.',
      objects: [obj('roh', 'a risk-of-harm case', 'risk-of-harm cases')],
      extra: [] },

    { key: 'programme', name: 'Programme', icon: 'i-programme',
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

    { key: 'reports', name: 'Reports', icon: 'i-reports',
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

    { key: 'field', name: 'Field support', icon: 'i-support',
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

    { key: 'people', name: 'People & access', icon: 'i-admin',
      blurb: 'This screen, and who else may open it. The one group that grants the rest.',
      objects: [
        obj('user', 'a person’s account', 'the people who can sign in'),
        obj('role', 'a position and the permissions it carries', 'positions'),
        obj('permission', 'a permission itself — the names behind these rows', 'permissions'),
        obj('profile', 'a person’s own name, email and password', 'profiles')],
      extra: [
        one('userlogs-list', 'See', 'Read what other people did and when — including the attempts that were refused.',
            { note: 'no create, edit or delete exists, correctly: a log nobody can edit is the point' })] },

    { key: 'maintenance', name: 'Maintenance', icon: 'i-settings',
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
    /* The "-list is what makes the section appear" rule is true of all thirty
       of them, so it is said once above the list rather than thirty times in
       it. Repeating it was most of the reading. */
    if (verb === 'See') return 'See ' + o.plural + '.';
    if (verb === 'Add') return 'Create ' + o.noun + '.';
    if (verb === 'Change') return 'Change ' + o.noun + ' that already exists. Does not include creating or removing one.';
    return 'Delete ' + o.noun + '. In the current system this removes it outright rather than archiving it.';
  }

  /* Said once, on the permission that earns it. */
  var RISK = {
    'roh-delete': 'A safeguarding record, removed outright. The audit argues this permission should not exist at all.',
    'roh-list': 'Opens children’s records. The count of cases is not a permission; this is.',
    'user-create': 'Creating accounts and assigning positions is how access spreads.',
    'role-edit': 'Changing a position changes it for everyone holding it, at once.',
    'permission-edit': 'This is the permission that edits permissions.',
    'permission-create': 'Inventing a permission that nothing checks is how the current list reached 112.'
  };

  /* A capability is one group and one verb: the unit a position is built from.
     Risk is said on the capability too, because that is where it is granted. */
  var CAP_RISK = {
    'roh|Archive': 'Deletes a safeguarding record outright. The audit argues this should not exist.',
    'roh|See': 'Opens children’s records in full, not just the count of them.',
    'people|Add': 'Creating accounts and assigning positions is how access spreads.',
    'people|Change': 'Includes editing positions, which changes them for everyone holding them.',
    'people|Archive': 'Removes accounts, positions and permissions.',
    'maintenance|Change': 'Reaches records their owner has already deleted.'
  };

  var ALL = [];
  var BY_CAP = {};
  GROUPS.forEach(function (g) {
    g.perms = [];
    g.objects.forEach(function (o) {
      o.verbs.forEach(function (v) {
        g.perms.push({ id: o.name + '-' + v, group: g.key, verb: VERB[v],
                       what: sentence(o, VERB[v]), risk: RISK[o.name + '-' + v] || null,
                       note: v === 'list' ? o.note : null });
      });
    });
    g.extra.forEach(function (x) {
      g.perms.push({ id: x.name, group: g.key, verb: x.verb,
                     what: x.what, risk: x.risk, note: x.note, odd: true });
    });
    g.perms.forEach(function (p) {
      ALL.push(p);
      (BY_CAP[p.group + '|' + p.verb] = BY_CAP[p.group + '|' + p.verb] || []).push(p);
    });
  });
  function capPerms(g, v) { return BY_CAP[g + '|' + v] || []; }
  function capSize(g, v) { return capPerms(g, v).length; }
  function groupByKey(k) {
    for (var i = 0; i < GROUPS.length; i++) if (GROUPS[i].key === k) return GROUPS[i];
    return null;
  }

  /* ---- the positions, each one built on the one below it ----

     `adds` is what this position grants that its base does not. Everything
     else it has, it has because the base has it. Nothing subtracts: a job that
     needs less than its base is a different rung, not an exception.

     The two roots are a finding, not an arrangement. IZU at Village cannot be
     built on anything, because every other position sees reports and a home
     visitor does not. */
  var SEED = [
    { id: 'IZU', name: 'IZU at Village', short: 'IZU at Village', base: null, people: 146,
      what: 'The home visitor, one per village. Everything they do happens in a household, on a tablet.',
      adds: [['households', 'See'], ['households', 'Add'], ['households', 'Change'],
             ['visits', 'See'], ['visits', 'Add'],
             ['roh', 'See'], ['roh', 'Add'],
             ['field', 'See']] },

    { id: 'SLA', name: 'Sugira Muryango Sector lead (SLA)', short: 'the Sector lead', base: 'IZU', people: 11,
      what: 'Runs the programme in one sector and supervises the home visitors in it.',
      adds: [['visits', 'Change'], ['roh', 'Change'],
             ['programme', 'See'], ['reports', 'See'], ['reports', 'Add']] },

    { id: 'NCDA', name: 'National NCDA Government Official', short: 'National NCDA', base: null, people: 2,
      what: 'Government oversight. Reads the numbers, never the names behind them.',
      adds: [['reports', 'See']] },

    { id: 'CPWO', name: 'District NCDA Child protection and Welfare Officer (CPWO)', short: 'the district CPWO', base: 'NCDA', people: 2,
      what: 'Takes the referral when a case leaves the programme. Works on cases, not on households.',
      adds: [['roh', 'See'], ['roh', 'Change']] },

    { id: 'ICC', name: 'IZU Cell Coordinator (ICC)', short: 'the Cell Coordinator', base: 'NCDA', people: 21,
      what: 'Sits in on visits in one cell and scores how they were delivered.',
      adds: [['households', 'See'], ['visits', 'See'], ['visits', 'Add'],
             ['roh', 'See'], ['field', 'See']] },

    { id: 'DTL', name: 'Sugira Muryango District lead (DTL)', short: 'the District lead', base: 'NCDA', people: 5,
      what: 'Reads across a whole district. Reports on it rather than working in it.',
      adds: [['households', 'See'], ['visits', 'See'], ['roh', 'See'],
             ['programme', 'See'], ['reports', 'Add'], ['field', 'See']] },

    { id: 'HQ', name: 'HQ officer', short: 'the HQ officer', base: 'DTL', people: 4,
      what: 'FXB Rwanda head office. Builds the programme everyone else delivers.',
      adds: [['households', 'Add'], ['households', 'Change'],
             ['visits', 'Add'], ['visits', 'Change'],
             ['programme', 'Add'], ['programme', 'Change'], ['programme', 'Archive'],
             ['reports', 'Change'],
             ['field', 'Add'], ['field', 'Change'], ['field', 'Archive'],
             ['people', 'See'], ['maintenance', 'See']] },

    { id: 'Admin', name: 'admin', short: 'admin', base: 'HQ', people: 2,
      what: 'Everything, including this screen. Two people hold it.',
      adds: [['households', 'Archive'],
             ['roh', 'Add'], ['roh', 'Change'], ['roh', 'Archive'],
             ['reports', 'Archive'],
             ['people', 'Add'], ['people', 'Change'], ['people', 'Archive'],
             ['maintenance', 'Change']] }
  ];

  function freshPositions() {
    return SEED.map(function (p) {
      return { id: p.id, name: p.name, short: p.short, base: p.base, people: p.people, what: p.what,
               adds: p.adds.map(function (c) { return [c[0], c[1]]; }) };
    });
  }

  var state = {
    pos: freshPositions(),
    open: null,          // the one expanded card
    detail: false,       // the 112 names, under the expanded card
    find: '',            // search inside that detail
    who: null,           // set when the screen is opened from a person
    whoRole: null
  };

  function byId(id) {
    for (var i = 0; i < state.pos.length; i++) if (state.pos[i].id === id) return state.pos[i];
    return null;
  }
  function byName(n) {
    for (var i = 0; i < state.pos.length; i++) if (state.pos[i].name === n) return state.pos[i];
    return null;
  }
  /* A position, then what it is built on, all the way down. */
  function chain(p) {
    var out = [], seen = {};
    while (p && !seen[p.id]) { seen[p.id] = 1; out.push(p); p = p.base ? byId(p.base) : null; }
    return out;
  }
  function depth(p) { return chain(p).length - 1; }
  function children(p) {
    return state.pos.filter(function (q) { return q.base === p.id; });
  }
  /* Every capability a position holds, and the rung each one arrives from. */
  function held(p) {
    var from = {};
    chain(p).reverse().forEach(function (step) {
      step.adds.forEach(function (c) {
        var k = c[0] + '|' + c[1];
        if (!from[k]) from[k] = step;
      });
    });
    return from;
  }
  function total(p) {
    var from = held(p), n = 0;
    for (var k in from) if (from.hasOwnProperty(k)) n += BY_CAP[k] ? BY_CAP[k].length : 0;
    return n;
  }

  /* The ladder, in reading order: each root, then everything under it. */
  function ordered() {
    var out = [];
    function walk(p) { out.push(p); children(p).forEach(walk); }
    state.pos.filter(function (p) { return !p.base; }).forEach(walk);
    /* anything orphaned by a base change still has to appear */
    state.pos.forEach(function (p) { if (out.indexOf(p) < 0) out.push(p); });
    return out;
  }

  /* ---- words ---- */

  function shortOf(p) { return p.short || p.name.replace(/ \(.*\)$/, ''); }
  /* "Everything IZU at Village has, plus five more things." The sentence is
     the whole point of the model, so it is what the collapsed card shows. */
  function lineage(p) {
    if (!p.base) {
      return 'Built from nothing — there is no smaller position to start from.';
    }
    var b = byId(p.base);
    if (!b) return 'Built on a position that no longer exists.';
    var n = p.adds.length;
    if (!n) return 'Exactly what ' + shortOf(b) + ' has, and nothing more.';
    return 'Everything ' + shortOf(b) + ' has, plus '
      + n + (n === 1 ? ' thing' : ' things') + '.';
  }

  /* ---- bits ---- */

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function icon(id, cls) {
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    if (cls) s.setAttribute('class', cls);
    s.setAttribute('aria-hidden', 'true');
    var u = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    u.setAttribute('href', '#' + id);
    s.appendChild(u);
    return s;
  }
  var CHEV = '<svg class="pm-cv" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6" ' +
    'stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function reach(n) {
    var w = el('span', 'pm-reach');
    w.appendChild(el('b', null, String(n)));
    w.appendChild(el('span', null, ' of 112'));
    var trk = el('span', 'trk');
    trk.appendChild(el('i')).style.width = Math.round(n / 112 * 100) + '%';
    w.appendChild(trk);
    return w;
  }

  /* ---- the base chooser ----
     DialogSelect's shape (AppDialog.tsx:404): icon tile, title with a chevron,
     and the description on a second line, read without opening anything. The
     menu rows carry MenuRadioItem's description, which here says what the
     change would cost: a base that grants something this position does not
     hold can only add it, never remove it. */

  function baseOptions(p) {
    var mine = held(p);
    return state.pos.filter(function (q) {
      if (q.id === p.id) return false;
      /* no cycles: a position cannot be built on something built on it */
      return chain(q).indexOf(p) < 0;
    }).map(function (q) {
      var theirs = held(q), gained = [];
      for (var k in theirs) if (theirs.hasOwnProperty(k) && !mine[k]) gained.push(k);
      return { pos: q, gained: gained };
    }).sort(function (a, b) { return total(a.pos) - total(b.pos); });
  }

  function setBase(p, baseId) {
    var mine = held(p);
    p.base = baseId;
    /* Inherit-only: keep everything this position already had. Whatever the new
       base does not supply stays as an addition; whatever it supplies and the
       position lacked is now granted, because a base cannot be subtracted. */
    var now = baseId ? held(byId(baseId)) : {};
    var keep = [];
    for (var k in mine) {
      if (!mine.hasOwnProperty(k) || now[k]) continue;
      keep.push(k.split('|'));
    }
    keep.sort(function (a, b) {
      var ga = GROUPS.map(function (g) { return g.key; });
      return ga.indexOf(a[0]) - ga.indexOf(b[0]) || VERBS.indexOf(a[1]) - VERBS.indexOf(b[1]);
    });
    p.adds = keep;
  }

  function baseSelect(p) {
    var wrap = el('div', 'pm-sect');
    wrap.appendChild(el('p', 'pm-lbl', 'Starts from'));
    var b = byId(p.base);
    var btn = el('button', 'pm-bsel');
    btn.type = 'button';
    btn.setAttribute('aria-haspopup', 'menu');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Starts from: ' + (b ? b.name : 'nothing'));

    var tile = el('span', 'pm-bico' + (b ? ' fill' : ''));
    tile.appendChild(icon(b ? 'i-hierarchy' : 'i-plus'));
    btn.appendChild(tile);

    var tx = el('span', 'pm-btx');
    var t = el('span', 'pm-bt');
    t.appendChild(el('span', null, b ? b.name : 'Nothing — built from zero'));
    t.innerHTML += CHEV;
    tx.appendChild(t);
    tx.appendChild(el('span', 'pm-bd', b
      ? total(b) + ' of the 112 permissions come from here. ' + b.what
      : 'Every one of this position’s permissions is granted on this card.'));
    btn.appendChild(tx);

    btn.onclick = function (e) {
      e.stopPropagation();
      var items = [{ heading: true, label: 'Build this position on' }];
      items.push({
        label: 'Nothing — build from zero',
        description: 'Every permission is granted here. Only a root position should need this.',
        selected: !p.base,
        onPick: function () { window.SugiraMenu.close(); setBase(p, null); render(); }
      });
      baseOptions(p).forEach(function (o) {
        items.push({
          label: o.pos.name,
          hint: total(o.pos) + '',
          selected: p.base === o.pos.id,
          description: o.gained.length
            ? 'Would also grant ' + o.gained.length + (o.gained.length === 1 ? ' thing' : ' things')
              + ' this position does not have today. A base can only add.'
            : 'Everything it holds, this position already holds.',
          onPick: function () { window.SugiraMenu.close(); setBase(p, o.pos.id); render(); }
        });
      });
      window.SugiraMenu.show(btn, items, { width: 420 });
    };
    wrap.appendChild(btn);
    return wrap;
  }

  /* ---- the additions ----
     ShareDialog's member rows: the thing, what it costs, and a remove on the
     right; then one full-width subtle button underneath, where "Make Private"
     sits in ClickUp's own dialog. */

  /* Which segment, which groups are open and which are showing their stored
     names, per card — so reopening a position finds it as you left it. */
  var cardMode = {}, cardOpen = {}, cardNames = {};

  function addsList(p) {
    var wrap = el('div', 'pm-sect');
    var h = el('div', 'pm-sh');
    h.appendChild(el('p', 'pm-lbl', p.base ? 'Plus, on top of that' : 'Granted here'));
    wrap.appendChild(h);

    var host = el('div', 'pm-perm');
    wrap.appendChild(host);
    if (!window.SugiraAccess) return wrap;

    var below = p.base ? held(byId(p.base)) : {};
    var A = window.SugiraAccess;

    function mine(key, verb) {
      for (var i = 0; i < p.adds.length; i++) {
        if (p.adds[i][0] === key && p.adds[i][1] === verb) return i;
      }
      return -1;
    }

    var model = {
      mode: cardMode[p.id] || 'adds',
      open: cardOpen[p.id] || (cardOpen[p.id] = {}),
      names: cardNames[p.id] || (cardNames[p.id] = {}),
      setMode: function (id) { cardMode[p.id] = id; render(); },
      redraw: function () { A.render(host, model); },
      segments: function () {
        if (!p.base) return null;
        return [{ id: 'below', label: 'Everything it inherits' },
                { id: 'adds', label: 'What this adds' }];
      },
      caption: function () {
        if (model.mode === 'below') {
          return 'What ' + shortOf(byId(p.base))
            + ' gives, and every position built on it. Switch to \u201cWhat this adds\u201d '
            + 'to change this rung.';
        }
        return p.base
          ? 'Tick what this rung adds on top of ' + shortOf(byId(p.base))
            + '. The greyed ones already arrive from it.'
          : 'Tick what this position grants. It starts from nothing, so everything here is its own.';
      },
      cell: function (key, verb) {
        var g = groupByKey(key);
        var list = A.cellsOf(g, verb);
        if (!list.length) return null;
        var k = key + '|' + verb;
        var sample = list.slice(0, 3).map(function (x) { return x.id; }).join(', ')
          + (list.length > 3 ? '\u2026' : '');
        var risk = CAP_RISK[k] ? ' ' + CAP_RISK[k] : '';
        var step = below[k];
        if (step) {
          return { on: true, locked: true, from: shortOf(step),
            tip: verb + ' \u2014 ' + g.name + ' arrives from ' + shortOf(step)
              + '. A position may only add to the one it starts from, so it cannot be taken '
              + 'away here \u2014 change ' + shortOf(step) + ' itself, which reaches everyone '
              + 'built on it. ' + list.length
              + (list.length === 1 ? ' stored name' : ' stored names') + ': ' + sample + '.' + risk };
        }
        var own = mine(key, verb) >= 0;
        return { on: own, locked: model.mode === 'below', from: own ? 'this position' : null,
          tip: own
            ? verb + ' \u2014 ' + g.name + ' is what this rung adds. Unticking it takes it from '
              + p.people + (p.people === 1 ? ' person' : ' people')
              + ' and from every position built on this one. ' + list.length
              + (list.length === 1 ? ' stored name' : ' stored names') + ': ' + sample + '.' + risk
            : verb + ' \u2014 ' + g.name + ' is not granted. Ticking it gives these '
              + list.length + ' to ' + p.people + (p.people === 1 ? ' person' : ' people')
              + ' and to every position built on this one: ' + sample + '.' + risk };
      },
      toggle: function (key, verb) {
        var i = mine(key, verb);
        if (i >= 0) p.adds.splice(i, 1);
        else p.adds.push([key, verb]);
        render();
      },
      summary: function () {
        var s = el('p', 'acc-sum');
        s.appendChild(el('b', null, String(total(p))));
        s.appendChild(document.createTextNode(' of the 112 stored names'));
        if (p.base) {
          s.appendChild(document.createTextNode(' \u2014 '));
          s.appendChild(el('b', null, String(total(byId(p.base)))));
          s.appendChild(document.createTextNode(' from ' + shortOf(byId(p.base)) + ', and '));
          s.appendChild(el('b', null, String(p.adds.length)));
          s.appendChild(document.createTextNode(p.adds.length === 1
            ? ' thing added here.' : ' things added here.'));
        } else {
          s.appendChild(document.createTextNode(', all granted on this card.'));
        }
        var kids = children(p);
        if (kids.length) {
          s.appendChild(document.createTextNode(' ' + (kids.length === 1
            ? shortOf(kids[0]) + ' is built on this one, so a change here reaches it too.'
            : kids.length + ' positions are built on this one, so a change here reaches them too.')));
        }
        return s;
      }
    };
    A.render(host, model);
    return wrap;
  }

  /* ---- the 112 stored names, one disclosure deeper ---- */

  function matches(p) {
    var q = state.find.trim().toLowerCase();
    if (!q) return true;
    return (p.id + ' ' + p.verb + ' ' + p.what).toLowerCase().indexOf(q) > -1;
  }

  function detailPanel(p) {
    var from = held(p);
    var wrap = el('div', 'pm-detail');

    var find = el('input', 'pm-find');
    find.type = 'text';
    find.placeholder = 'Find a permission by its stored name or by what it does…';
    find.setAttribute('aria-label', 'Find a permission');
    find.value = state.find;
    find.oninput = function () {
      state.find = this.value;
      render();
      var f = $('#permBody .pm-find');
      if (f) { f.focus(); f.setSelectionRange(f.value.length, f.value.length); }
    };
    wrap.appendChild(find);
    wrap.appendChild(el('p', 'pm-drule',
      'A name ending ‑list is what makes a section appear at all. Without it nothing '
      + 'else in that section can be reached, whatever else is granted.'));

    var shown = 0;
    GROUPS.forEach(function (g) {
      var rows = [];
      VERBS.forEach(function (v) {
        if (!from[g.key + '|' + v]) return;
        capPerms(g.key, v).filter(matches).forEach(function (perm) {
          rows.push({ perm: perm, src: from[g.key + '|' + v] });
        });
      });
      if (!rows.length) return;
      shown += rows.length;

      var sec = el('section', 'pm-dg');
      var hd = el('h4', 'pm-dgh');
      hd.appendChild(icon(g.icon));
      hd.appendChild(el('span', null, g.name));
      var holds = 0;
      VERBS.forEach(function (v) { if (from[g.key + '|' + v]) holds += capSize(g.key, v); });
      var tot = g.perms.length;
      hd.appendChild(el('span', 'pm-dgc', holds + ' of ' + tot));
      sec.appendChild(hd);
      if (g.blurb) sec.appendChild(el('p', 'pm-dgb', g.blurb));

      rows.forEach(function (r) {
        var row = el('div', 'pm-dr');
        var left = el('div', 'pm-dl');
        var nm = el('span', 'pm-dn');
        nm.appendChild(el('code', null, r.perm.id));
        nm.appendChild(el('span', 'pm-dv', r.perm.verb));
        left.appendChild(nm);
        left.appendChild(el('span', 'pm-dw', r.perm.what));
        if (r.perm.risk) left.appendChild(el('span', 'pm-drisk', r.perm.risk));
        if (r.perm.note) left.appendChild(el('span', 'pm-dnote', r.perm.note));
        row.appendChild(left);
        var src = el('span', 'pm-dsrc' + (r.src === p ? ' here' : ''));
        src.textContent = r.src === p ? 'added here' : shortOf(r.src);
        row.appendChild(src);
        sec.appendChild(row);
      });
      wrap.appendChild(sec);
    });

    if (!shown) {
      wrap.appendChild(el('p', 'pm-none', state.find
        ? 'Nothing this position holds matches “' + state.find + '”.'
        : 'This position holds no permissions.'));
    }
    return wrap;
  }

  /* ---- one card ----

     Same card as a role's, because they are the same gesture: a thing you
     open. What a position adds is the line that a role has no use for — what
     it is built on — and the strip of what its holders can actually do. */

  /* The eight groups this position touches, each with the verbs it has. One
     wrapped line is enough to tell a home visitor from an administrator
     without opening anything. */
  function canStrip(p) {
    var from = held(p);
    var wrap = el('div', 'posc-can');
    var any = false;
    GROUPS.forEach(function (g) {
      var verbs = VERBS.filter(function (v) { return !!from[g.key + '|' + v]; });
      if (!verbs.length) return;
      any = true;
      var chip = el('span', 'posc-g');
      chip.setAttribute('data-tip', g.name + ': ' + verbs.join(', ') + '. '
        + verbs.reduce(function (n, v) { return n + capSize(g.key, v); }, 0)
        + ' of the stored names.');
      chip.appendChild(icon(g.icon, 'posc-gi'));
      chip.appendChild(el('span', 'posc-gn', g.name));
      chip.appendChild(el('span', 'posc-gv', verbs.length + ' of ' + VERBS.filter(
        function (v) { return !!capSize(g.key, v); }).length));
      wrap.appendChild(chip);
    });
    if (!any) {
      wrap.appendChild(el('span', 'posc-none', 'Grants nothing at all.'));
    }
    return wrap;
  }

  function card(p) {
    var a = el('button', 'rolec posc');
    a.type = 'button';
    a.setAttribute('data-pos', p.id);
    a.setAttribute('data-go', 'position');
    a.setAttribute('data-pos-id', p.id);
    if (state.whoRole && p.name === state.whoRole) a.classList.add('is-theirs');

    var top = el('div', 'rolec-t');
    top.appendChild(icon('i-hierarchy', 'rolec-i'));
    top.appendChild(el('span', 'rolec-n', p.name));
    if (state.whoRole && p.name === state.whoRole) {
      top.appendChild(el('span', 'pm-mine', 'theirs'));
    }
    a.appendChild(top);

    /* The indent used to say what this is built on. A grid has no indent, so
       the sentence says it, and the cards stay in chain order. */
    a.appendChild(el('p', 'posc-l', lineage(p)));
    a.appendChild(canStrip(p));

    var foot = el('div', 'rolec-f');
    foot.appendChild(reach(total(p)));
    foot.appendChild(el('span', 'rolec-p', p.people + (p.people === 1 ? ' person' : ' people')));
    a.appendChild(foot);

    a.onclick = function () {
      state.open = p.id;
      state.detail = false;
      state.find = '';
      setTimeout(renderOne, 0);
    };
    return a;
  }

  /* ---- one position, in the drawer ---- */

  function renderOne() {
    var root = $('#positionBody');
    if (!root) return;
    var p = byId(state.open) || state.pos[0];
    if (!p) return;
    var sec = root;
    sec.innerHTML = '';

    var rec = el('div', 'rec');
    var rtop = el('div', 'rec-top');
    var type = el('span', 'rec-type');
    type.appendChild(icon('i-hierarchy'));
    type.appendChild(el('span', null, 'Position'));
    rtop.appendChild(type);
    rtop.appendChild(el('span', 'rec-id', p.people + (p.people === 1 ? ' person' : ' people')));
    rec.appendChild(rtop);
    rec.appendChild(el('h1', null, p.name));
    rec.appendChild(el('p', 'rec-desc', p.what));
    sec.appendChild(rec);

    var body = el('div', 'pm-cb');
    body.appendChild(baseSelect(p));
    body.appendChild(addsList(p));

    var foot = el('div', 'pm-cfoot');
    var more = el('button', 'pm-more');
    more.type = 'button';
    more.setAttribute('aria-expanded', String(state.detail));
    more.textContent = state.detail
      ? 'Hide the ' + total(p) + ' stored names'
      : 'See all ' + total(p) + ' stored names';
    more.onclick = function () { state.detail = !state.detail; state.find = ''; render(); };
    foot.appendChild(more);
    var kids = children(p);
    if (kids.length) {
      foot.appendChild(el('span', 'pm-kids', kids.length === 1
        ? shortOf(kids[0]) + ' is built on this one, so a change here reaches it too.'
        : kids.length + ' positions are built on this one, so a change here reaches them too.'));
    }
    body.appendChild(foot);

    if (state.detail) body.appendChild(detailPanel(p));
    sec.appendChild(body);
    sec.appendChild(holders(p));
  }

  /* Who actually holds this position. The card said "11 people" and gave you
     no way to reach them or add a twelfth — the role drawer had both, and
     these are the same record with the same two questions. */
  function holders(p) {
    var card = el('div', 'card');
    var h = el('div', 'card-h');
    h.appendChild(el('h3', null, 'Who holds it'));
    var side = el('span', 'side');
    var add = el('button', 'btn sec sm');
    add.type = 'button';
    add.setAttribute('data-modal', 'posadd');
    add.innerHTML = '<svg aria-hidden="true"><use href="#i-plus"/></svg>';
    add.appendChild(document.createTextNode(' Give it to someone'));
    side.appendChild(add);
    h.appendChild(side);
    card.appendChild(h);

    var kids = children(p);
    card.appendChild(el('p', 'pm-rule',
      p.people + (p.people === 1 ? ' person holds this position' : ' people hold this position')
      + '. Everything above is theirs together \u2014 a change here reaches all of them'
      + (kids.length
          ? ', and everyone on the ' + (kids.length === 1 ? 'position' : kids.length + ' positions')
            + ' built on it.'
          : '.')
      + ' Where each of them works \u2014 which sector, which district \u2014 is set on their own'
      + ' record, not here.'));

    var go = el('button', 'rel');
    go.type = 'button';
    go.setAttribute('data-go', 'people');
    go.innerHTML = '<svg aria-hidden="true"><use href="#i-admin"/></svg>';
    go.appendChild(document.createTextNode('See the ' + p.people + ' in People'));
    card.appendChild(go);
    return card;
  }

  /* ---- the screen ---- */

  function render() {
    var root = $('#permBody');
    if (!root) return;
    /* Both surfaces read the same positions, so a change in the drawer has to
       reach the list behind it and the other way round. */
    setTimeout(renderOne, 0);
    root.innerHTML = '';

    /* The explanation waits behind the mark on the toolbar rather than being
       read aloud every time the screen opens. */
    var top = el('div', 'pm-top');
    var mark = el('button', 'ihelp');
    mark.type = 'button';
    mark.setAttribute('aria-expanded', 'false');
    mark.setAttribute('aria-label', 'What a position is');
    mark.setAttribute('data-tip',
      'A position is built on the one below it and may only add to it. Nobody starts from '
      + '112 blank checkboxes, which is what produced 21 roles for 10 jobs. Where a position '
      + 'applies — which sector, which district — is set when it is given to a person, not here.');
    mark.innerHTML = '<svg aria-hidden="true"><use href="#i-info"/></svg>';
    top.appendChild(mark);

    var sum = el('span', 'pm-sum');
    sum.appendChild(el('b', null, String(state.pos.length)));
    sum.appendChild(el('span', null, ' positions · '));
    sum.appendChild(el('b', null, '112'));
    sum.appendChild(el('span', null, ' permissions · '));
    sum.appendChild(el('b', null, String(state.pos.reduce(function (n, p) { return n + p.people; }, 0))));
    sum.appendChild(el('span', null, ' people'));
    top.appendChild(sum);

    /* This screen builds its own toolbar after the page actions have been
       placed, so it takes the end group over rather than leaving Discard and
       Save stranded on a row of their own. */
    var end = $('#s-permissions .filters > .end');
    if (end) {
      top.appendChild(end);
      var empty = $('#s-permissions .filters');
      if (empty && !empty.children.length) empty.remove();
    }
    root.appendChild(top);

    /* Opened from a person: say whose access this is before showing it. */
    if (state.who) {
      var who = byName(state.whoRole);
      var band = el('div', 'pm-who');
      var av = el('span', 'av');
      av.textContent = state.who.replace(/^(\w)\.?\s*/, '$1').slice(0, 1);
      band.appendChild(av);
      var wt = el('div', 'pm-whot');
      var l1 = el('p', 'pm-whon');
      l1.appendChild(el('b', null, state.who));
      l1.appendChild(el('span', null, ' holds ' + (who ? who.name : state.whoRole) + '.'));
      wt.appendChild(l1);
      wt.appendChild(el('p', 'pm-whod', who
        ? 'That is ' + total(who) + ' of the 112 permissions, and ' + (who.people - 1)
          + ' other people hold the same position — so anything changed here changes it for all of them. '
          + 'One thing for one person belongs on their record as an exception, not on this card.'
        : 'That position is not on this screen.'));
      band.appendChild(wt);
      var back = el('button', 'btn sec sm');
      back.type = 'button';
      back.setAttribute('data-go', 'person');
      back.textContent = 'Back to ' + state.who;
      band.appendChild(back);
      root.appendChild(band);
    }

    var ladder = el('div', 'rolegrid');
    /* ordered() walks each root and then everything built on it, so a
       position still comes after the one it starts from. */
    ordered().forEach(function (p) { ladder.appendChild(card(p)); });
    root.appendChild(ladder);

    var foot = el('p', 'pm-foot');
    foot.appendChild(document.createTextNode(
      'Eight positions stand for the ten jobs the programme actually has. The live system '
      + 'carries twenty-one roles for those ten — three of them called Test role — because there '
      + 'was no way to give one person one extra thing. Two more, BC office and Sugira Muryango '
      + 'coordination office, could not be read from the capture and are not shown. '));
    /* The ten roles as they are stored today are the evidence for all of the
       above, and they were reachable only from a chip on a safeguarding row.
       They belong next to the thing that replaces them. */
    var asis = el('button', 'rel');
    asis.type = 'button';
    asis.setAttribute('data-go', 'roles');
    asis.innerHTML = '<svg aria-hidden="true"><use href="#i-admin"/></svg>';
    asis.appendChild(document.createTextNode('How it works today'));
    foot.appendChild(asis);
    root.appendChild(foot);
  }

  /* ---- entry points ---- */

  document.addEventListener('click', function (e) {
    var reset = e.target.closest('[data-perms-act="discard"]');
    if (reset) {
      state.pos = freshPositions();
      state.detail = false;
      state.find = '';
      setTimeout(render, 0);
      return;
    }
    var t = e.target.closest('[data-perms]');
    if (!t) return;
    var mode = t.getAttribute('data-perms');
    state.whoRole = t.getAttribute('data-perms-role') || state.whoRole;
    state.who = mode === 'person' ? (t.getAttribute('data-perms-who') || state.who) : null;
    state.open = state.whoRole && byName(state.whoRole) ? byName(state.whoRole).id : null;
    state.detail = false;
    state.find = '';
    setTimeout(render, 0);
  });

  /* The drawer moves the screen's markup into itself and then asks whoever
     owns it to fill it, which is how the other records do it too. */
  document.addEventListener('drawer:render', function (e) {
    if (e.detail && e.detail.key === 'position') setTimeout(renderOne, 0);
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();

  window.SugiraPerms = {
    render: render,
    all: ALL,
    groups: GROUPS,
    positions: function () { return state.pos; },
    total: total,
    held: held,
    renderOne: renderOne,
    reset: function () { state.pos = freshPositions(); state.open = null; state.detail = false; state.find = ''; render(); }
  };
})();
