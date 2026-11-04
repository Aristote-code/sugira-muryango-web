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

  /* ---- the permissions ----

     Twenty-six, and we wrote them.

     The live system has 112, and they are not a design — they are what happens
     when permission names are free text typed into a field called "Name". That
     is where `form-list` AND `forms-list` come from, and `View-collected-data`
     as the one capitalised name, and seven sets missing a verb, and five
     different words — family, familymember, familymodule, admittedfamily,
     householdenrollment — for one idea. Drawing 112 checkboxes better does not
     fix any of that. Nobody can hold 112 of anything in their head, so nobody
     reads them, so everyone presses Check all, so a role means nothing.

     So each of these names a decision somebody actually makes, and carries the
     stored names it replaces. 111 of the 112 land in exactly one of them; the
     112th is `roh-delete`, which is not here because a safeguarding record
     should not be deletable at all.

     `replaces` is the migration map. It is also the tooltip: hover a permission
     and you are told which old names it covers, so nothing is hidden and a
     developer can still answer "where did family-create go". */

  var PERMS = [
    /* id, group, label, what it means, the stored names it replaces */
    ['hh-see', 'households', 'See households',
      'See households and the people counted in them.',
      ['family-list', 'familymember-list', 'familymodule-list', 'admittedfamily-list',
        'householdenrollment-list']],
    ['hh-enrol', 'households', 'Enrol a household',
      'Put a household on the programme and record who is in it.',
      ['family-create', 'familymember-create', 'familymodule-create', 'admittedfamily-create',
        'householdenrollment-create']],
    ['hh-change', 'households', 'Change household details',
      'Correct a household’s details, or who is counted in it.',
      ['family-edit', 'familymember-edit', 'familymodule-edit', 'admittedfamily-edit',
        'householdenrollment-edit']],
    ['hh-remove', 'households', 'Remove a household',
      'Take a household off the programme. Today this deletes it outright rather than archiving it.',
      ['family-delete', 'familymember-delete', 'familymodule-delete', 'admittedfamily-delete',
        'householdenrollment-delete'], { risk: 'Deletes the record and everything collected against it.' }],

    ['visit-see', 'visits', 'See visits and answers',
      'See visits, and read the answers people gave.',
      ['sessioninaction-list', 'View-collected-data']],
    ['visit-record', 'visits', 'Record a visit',
      'Deliver a session and send the completed form in from the tablet.',
      ['sessioninaction-create', 'submit-form']],
    ['visit-change', 'visits', 'Change a recorded visit',
      'Correct a visit already recorded, and set a follow-up.',
      ['sessioninaction-edit', 'follow-up']],

    ['roh-see', 'roh', 'See that cases exist',
      'See that a case exists and how many are open — not the child’s record.',
      ['roh-list']],
    ['roh-open', 'roh', 'Open a case in full',
      'Read the whole case, including the child’s record.',
      [], { risk: 'New. Today there is no way to hold the count without also holding this, '
        + 'which is why roh-list is effectively a national grant.' }],
    ['roh-raise', 'roh', 'Raise a case',
      'Open a risk-of-harm case from a visit.', ['roh-create']],
    ['roh-close', 'roh', 'Close a case',
      'Record the outcome and close a case.', ['roh-edit']],

    ['prog-see', 'programme', 'See the programme',
      'See projects, sessions, forms and the questions in them.',
      ['project-list', 'module-list', 'form-list', 'question-list', 'construct-list',
        'language-list']],
    ['prog-change', 'programme', 'Change sessions and forms',
      'Write and edit sessions, forms and questions, and cut a new version of a form.',
      ['project-create', 'project-edit', 'module-create', 'module-edit', 'form-create',
        'form-edit', 'question-create', 'question-edit', 'construct-create', 'construct-edit',
        'language-create', 'language-edit', 'create-form-version']],
    ['prog-archive', 'programme', 'Archive part of the programme',
      'Take a project, session or form out of use, keeping everything it collected.',
      ['project-delete', 'module-delete', 'form-delete', 'question-delete', 'construct-delete',
        'language-delete', 'can-archive-project']],
    ['prog-translate', 'programme', 'Translate',
      'Write the Kinyarwanda for a form and its questions.', ['can-translate-forms']],
    ['prog-cohorts', 'programme', 'Manage cohorts',
      'Decide which households get which session, and when.', ['manage-cohort']],

    ['rep-see', 'reports', 'See reports',
      'Open reports and indicators someone has already built.',
      ['reports-list', 'generalreport-list', 'indicator-list', 'customreport-list']],
    ['rep-build', 'reports', 'Build a report',
      'Ask a question of the collected data, save it, and put it on a schedule.',
      ['reports-create', 'reports-edit', 'reports-delete', 'generalreport-create',
        'generalreport-edit', 'generalreport-delete', 'indicator-create', 'indicator-edit',
        'indicator-delete', 'build-reports']],
    ['rep-export', 'reports', 'Export data',
      'Take the data out of the system as a file.', ['export-data'],
      { risk: 'Once a file leaves the system nothing in it can be withdrawn.' }],

    ['fs-see', 'field', 'See field support material',
      'Open the videos, documents and FAQs the field team uses.',
      ['help-list', 'instruction-list', 'category-list', 'resource-list', 'feedback-list']],
    ['fs-change', 'field', 'Change the material',
      'Add, edit and remove the videos, documents and FAQs.',
      ['help-create', 'instruction-create', 'instruction-edit', 'instruction-delete',
        'category-create', 'category-edit', 'category-delete', 'resource-create',
        'resource-edit', 'resource-delete']],
    ['fs-community', 'field', 'Moderate community posts',
      'Answer, hide and remove what field staff post to each other.',
      ['feedback-create', 'feedback-edit', 'feedback-delete', 'manage-community']],

    ['ppl-see', 'people', 'See people',
      'See who is on the system, what they hold, and when they were last active.',
      ['user-list', 'role-list', 'permission-list', 'profile-list', 'userlogs-list']],
    ['ppl-add', 'people', 'Add and invite people',
      'Invite someone and create their account.',
      ['user-create', 'profile-create'],
      { risk: 'An invitation carries a position with it, so this grants whatever that position holds.' }],
    ['ppl-access', 'people', 'Change what people can do',
      'Change positions, roles and permissions — including your own.',
      ['user-edit', 'user-delete', 'profile-edit', 'profile-delete', 'role-create', 'role-edit',
        'role-delete', 'permission-create', 'permission-edit', 'permission-delete'],
      { risk: 'Whoever holds this can give themselves everything else on this screen.' }],

    ['maint-restore', 'maintenance', 'Restore deleted records',
      'Bring back something that was deleted, and see the checklists and monitoring forms behind it.',
      ['recycle-data', 'checklist-list', 'monitoring-forms-list']]
  ];

  /* The one stored name that is deliberately not above. Said here rather than
     left as an absence, because an absence looks like an oversight. */
  var RETIRED = {
    'roh-delete': 'A safeguarding record should not be deletable. Nothing in the redesign '
      + 'grants it, and the migration should drop it rather than map it.'
  };

  /* ---- the eight groups ---- */
  var GROUPS = [
    { key: 'households', name: 'Households', icon: 'i-households',
      blurb: 'The family and everyone counted in it.' },
    { key: 'visits', name: 'Visits', icon: 'i-visits',
      blurb: 'A session delivered in the household, and the form filled in while it happened.' },
    { key: 'roh', name: 'Risk-of-harm cases', icon: 'i-safeguarding', guarded: true,
      blurb: 'A child may be at risk. The one group where seeing and opening are separate.' },
    { key: 'programme', name: 'Programme', icon: 'i-programme',
      blurb: 'The projects, sessions and forms everyone else delivers.' },
    { key: 'reports', name: 'Reports', icon: 'i-reports',
      blurb: 'Questions asked of what has been collected.' },
    { key: 'field', name: 'Field support', icon: 'i-support',
      blurb: 'What the field team reads, watches and asks each other.' },
    { key: 'people', name: 'People & access', icon: 'i-admin',
      blurb: 'Who is on the system and what they may do — this screen included.' },
    { key: 'maintenance', name: 'Maintenance', icon: 'i-settings',
      blurb: 'Putting back what was deleted.' }
  ];

  /* ---- shape it ---- */

  var ALL = [], BY_ID = {};
  PERMS.forEach(function (r) {
    var p = { id: r[0], group: r[1], label: r[2], what: r[3],
      replaces: r[4] || [], risk: (r[5] || {}).risk || null };
    ALL.push(p);
    BY_ID[p.id] = p;
  });
  GROUPS.forEach(function (g) {
    g.perms = ALL.filter(function (p) { return p.group === g.key; });
  });
  function groupByKey(k) {
    for (var i = 0; i < GROUPS.length; i++) if (GROUPS[i].key === k) return GROUPS[i];
    return null;
  }
  /* What a permission is worth in old money, for the migration note. */
  function replacedBy(p) { return p.replaces.length; }

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
      adds: ['hh-see', 'hh-enrol', 'hh-change', 'visit-see', 'visit-record', 'roh-see',
             'roh-raise', 'fs-see'] },

    { id: 'SLA', name: 'Sugira Muryango Sector lead (SLA)', short: 'the Sector lead', base: 'IZU', people: 11,
      what: 'Runs the programme in one sector and supervises the home visitors in it.',
      adds: ['visit-change', 'roh-open', 'roh-close', 'prog-see', 'rep-see',
             'rep-build'] },

    { id: 'NCDA', name: 'National NCDA Government Official', short: 'National NCDA', base: null, people: 2,
      what: 'Government oversight. Reads the numbers, never the names behind them.',
      adds: ['rep-see', 'roh-see'] },

    { id: 'CPWO', name: 'District NCDA Child protection and Welfare Officer (CPWO)', short: 'the district CPWO', base: 'NCDA', people: 2,
      what: 'Takes the referral when a case leaves the programme. Works on cases, not on households.',
      adds: ['roh-open', 'roh-close'] },

    { id: 'ICC', name: 'IZU Cell Coordinator (ICC)', short: 'the Cell Coordinator', base: 'NCDA', people: 21,
      what: 'Sits in on visits in one cell and scores how they were delivered.',
      adds: ['hh-see', 'visit-see', 'visit-record', 'fs-see'] },

    { id: 'DTL', name: 'Sugira Muryango District lead (DTL)', short: 'the District lead', base: 'NCDA', people: 5,
      what: 'Reads across a whole district. Reports on it rather than working in it.',
      adds: ['hh-see', 'visit-see', 'prog-see', 'rep-build', 'fs-see'] },

    { id: 'HQ', name: 'HQ officer', short: 'the HQ officer', base: 'DTL', people: 4,
      what: 'FXB Rwanda head office. Builds the programme everyone else delivers.',
      adds: ['hh-enrol', 'hh-change', 'visit-change', 'prog-change', 'prog-archive',
             'prog-translate', 'prog-cohorts', 'rep-export', 'fs-change',
             'fs-community', 'ppl-see', 'maint-restore'] },

    { id: 'Admin', name: 'admin', short: 'admin', base: 'HQ', people: 2,
      what: 'Everything, including this screen. Two people hold it.',
      adds: ['hh-remove', 'visit-record', 'roh-open', 'roh-raise', 'roh-close',
             'ppl-add', 'ppl-access'] }
  ];

  function freshPositions() {
    return SEED.map(function (p) {
      return { id: p.id, name: p.name, short: p.short, base: p.base, people: p.people, what: p.what,
               adds: p.adds.slice() };
    });
  }

  var state = {
    pos: freshPositions(),
    open: null,          // the one expanded card
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
  /* Every permission this position holds, and the rung it first arrives from.
     The value is the position, not just true, because "where does this come
     from" is the question the screen exists to answer. */
  function held(p) {
    var from = {};
    chain(p).reverse().forEach(function (step) {
      step.adds.forEach(function (id) { if (!from[id]) from[id] = step; });
    });
    return from;
  }
  function total(p) {
    var from = held(p), n = 0;
    for (var k in from) if (from.hasOwnProperty(k)) n += 1;
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
    if (!p.base) return 'Built from nothing.';
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

  function reach(n) {
    var w = el('span', 'pm-reach');
    w.appendChild(el('b', null, String(n)));
    w.appendChild(el('span', null, ' of ' + ALL.length));
    var trk = el('span', 'trk');
    trk.appendChild(el('i')).style.width = Math.round(n / 112 * 100) + '%';
    w.appendChild(trk);
    return w;
  }

  /* ---- the additions ----
     ShareDialog's member rows: the thing, what it costs, and a remove on the
     right; then one full-width subtle button underneath, where "Make Private"
     sits in ClickUp's own dialog. */

  /* Which segment, which groups are open and which are showing their stored
     names, per card — so reopening a position finds it as you left it. */
  /* which groups are open, per position card */
  var cardOpen = {};

  function addsList(p) {
    var wrap = el('div', 'pm-sect');
    var host = el('div', 'pm-perm');
    wrap.appendChild(host);
    if (!window.SugiraAccess) return wrap;

    var below = p.base ? held(byId(p.base)) : {};

    function own(id) { return p.adds.indexOf(id); }

    var model = {
      open: cardOpen[p.id] || (cardOpen[p.id] = {}),

      perm: function (id) {
        var step = below[id];
        if (step) return { on: true, locked: true, from: shortOf(step) };
        return { on: own(id) > -1, locked: false };
      },

      toggle: function (id) {
        var i = own(id);
        if (i > -1) p.adds.splice(i, 1); else p.adds.push(id);
        render();
      },

      /* The switch acts on what this rung may act on. Anything arriving from
         below is left alone — a position is the one under it plus things, and
         never minus things, so the switch cannot take away what it did not
         give. */
      setGroup: function (key, on) {
        groupByKey(key).perms.forEach(function (perm) {
          if (below[perm.id]) return;
          var i = own(perm.id);
          if (on && i < 0) p.adds.push(perm.id);
          if (!on && i > -1) p.adds.splice(i, 1);
        });
        render();
      },




      redraw: function () { window.SugiraAccess.render(host, model); }
    };
    model.redraw();
    return wrap;
  }

  /* ---- one card ----

     Same card as a role's, because they are the same gesture: a thing you
     open. What a position adds is the line that a role has no use for — what
     it is built on — and the strip of what its holders can actually do. */

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

    var foot = el('div', 'rolec-f');
    foot.appendChild(reach(total(p)));
    foot.appendChild(el('span', 'rolec-p', p.people + (p.people === 1 ? ' person' : ' people')));
    a.appendChild(foot);

    a.onclick = function () {
      state.open = p.id;
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
    root.innerHTML = '';

    var rec = el('div', 'rec');
    var rtop = el('div', 'rec-top');
    var type = el('span', 'rec-type');
    type.appendChild(icon('i-hierarchy'));
    type.appendChild(el('span', null, 'Position'));
    rtop.appendChild(type);

    /* Who holds it was a card of its own at the foot of the drawer, with the
       count and the action buried in a paragraph. The count belongs beside
       the name, and the action is the one thing you do to a position, so it
       is the primary button at the top where every other record puts its. */
    var who = el('button', 'rec-who');
    who.type = 'button';
    who.setAttribute('data-go', 'people');
    who.textContent = p.people + (p.people === 1 ? ' person holds it' : ' people hold it');
    rtop.appendChild(who);

    var acts = el('span', 'acts');
    var give = el('button', 'btn');
    give.type = 'button';
    give.setAttribute('data-modal', 'posadd');
    give.innerHTML = '<svg aria-hidden="true"><use href="#i-plus"/></svg>';
    give.appendChild(document.createTextNode('Give it to someone'));
    acts.appendChild(give);
    rtop.appendChild(acts);

    rec.appendChild(rtop);
    rec.appendChild(el('h1', null, p.name));
    root.appendChild(rec);

    root.appendChild(addsList(p));
  }



  /* ---- the screen ---- */

  /* Hiding rather than redrawing, so the caret stays where it is. */
  function filterCards(root, q) {
    q = (q || '').trim().toLowerCase();
    var n = 0;
    Array.prototype.forEach.call(root.querySelectorAll('.rolegrid > .posc'), function (c) {
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
    none.textContent = q && !n ? 'No position matches \u201c' + q + '\u201d.' : '';
    none.hidden = !(q && !n);
  }

  function render() {
    var root = $('#permBody');
    if (!root) return;
    /* Both surfaces read the same positions, so a change in the drawer has to
       reach the list behind it and the other way round. */
    setTimeout(renderOne, 0);
    root.innerHTML = '';

    var top = el('div', 'pm-top');

    var find = el('div', 'search');
    find.innerHTML = '<svg aria-hidden="true"><use href="#i-search"/></svg>';
    var inp = el('input');
    inp.type = 'text';
    inp.placeholder = 'Search positions';
    inp.setAttribute('aria-label', 'Search positions');
    inp.value = state.find;
    inp.oninput = function () {
      state.find = this.value;
      filterCards(root, state.find);
    };
    find.appendChild(inp);
    top.appendChild(find);

    /* Each tab builds its own action, because the two tabs make two different
       things and the screen's shared .acts group could only ever name one.
       What was here was Discard and Save, which this screen cannot honestly
       offer: nothing is saved anywhere, and a tick on a card is already live.
       Putting the positions back is still worth having, so it moved to the
       footer, where it reads as the aside it is. */
    var end = el('span', 'end');
    var mk = el('button', 'btn');
    mk.type = 'button';
    mk.setAttribute('data-modal', 'role');
    mk.innerHTML = '<svg aria-hidden="true"><use href="#i-plus"/></svg>';
    mk.appendChild(document.createTextNode('Add position'));
    end.appendChild(mk);
    top.appendChild(end);
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
        ? 'That is ' + total(who) + ' of the ' + ALL.length + ' permissions, and ' + (who.people - 1)
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

    /* The only way to make one was a button on the legacy roles screen, which
       this tab replaced. Roles have their card; positions get the same one. */
    var add = el('button', 'rolec new');
    add.type = 'button';
    add.setAttribute('data-modal', 'role');
    add.appendChild(icon('i-plus', 'rolec-i'));
    add.appendChild(el('span', 'rolec-n', 'New position'));
    add.appendChild(el('p', 'rolec-w', 'A job, not a task.'));
    add.setAttribute('data-tip',
      'It starts from the nearest position below it and adds. If the new one would be an '
      + 'existing position plus one thing for one person, that belongs on their record as '
      + 'an exception instead.');
    ladder.appendChild(add);
    root.appendChild(ladder);

    /* What this paragraph said — eight positions for ten jobs, twenty-one
       roles in the live system, two that could not be read — is in the mark
       on the toolbar, where an explanation can be asked for rather than read
       every time. What is left are the two things you can go and do. */
    var foot = el('p', 'pm-foot');
    var asis = el('button', 'rel');
    asis.type = 'button';
    asis.setAttribute('data-go', 'roles');
    asis.innerHTML = '<svg aria-hidden="true"><use href="#i-admin"/></svg>';
    asis.appendChild(document.createTextNode('How it works today'));
    foot.appendChild(asis);

    var undo = el('button', 'rel');
    undo.type = 'button';
    undo.setAttribute('data-perms-act', 'discard');
    undo.setAttribute('data-toast', 'The positions are back as they were');
    undo.innerHTML = '<svg aria-hidden="true"><use href="#i-expand"/></svg>';
    undo.appendChild(document.createTextNode('Put the positions back'));
    foot.appendChild(undo);
    root.appendChild(foot);
    if (state.find) filterCards(root, state.find);
  }

  /* ---- entry points ---- */

  document.addEventListener('click', function (e) {
    var reset = e.target.closest('[data-perms-act="discard"]');
    if (reset) {
      state.pos = freshPositions();
      setTimeout(render, 0);
      return;
    }
    var t = e.target.closest('[data-perms]');
    if (!t) return;
    var mode = t.getAttribute('data-perms');
    state.whoRole = t.getAttribute('data-perms-role') || state.whoRole;
    state.who = mode === 'person' ? (t.getAttribute('data-perms-who') || state.who) : null;
    state.open = state.whoRole && byName(state.whoRole) ? byName(state.whoRole).id : null;
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
    reset: function () { state.pos = freshPositions(); state.open = null; cardOpen = {}; render(); }
  };
})();
