(function () {
  'use strict';

  var SCREENS = {
    dashboard:    { crumbs: [['Dashboard', null]],                                        nav: 'dashboard' },
    households:   { crumbs: [['Households', null]],                                       nav: 'households' },
    household:    { crumbs: [['Households', 'households'], ['HH-1007 Mukamana', null]],   nav: 'households' },
    visits:       { crumbs: [['Visits', null]],                                           nav: 'visits' },
    safeguarding: { crumbs: [['Safeguarding', null]],                                     nav: 'safeguarding' },
    "case":       { crumbs: [['Safeguarding', 'safeguarding'], ['RH-0044', null]],        nav: 'safeguarding' },
    field:        { crumbs: [['Field status', null]],                                     nav: 'field' },
    reports:      { crumbs: [['Reports', null]],                                          nav: 'reports' },
    followups:    { crumbs: [['Follow-ups', null]],                                      nav: 'followups' },
    community:    { crumbs: [['Community', null]],                                       nav: 'community' },
    izu:          { crumbs: [['IZU performance', null]],                                 nav: 'izu' },
    content:      { crumbs: [['Field support', null]],                                   nav: 'content' },
    people:       { crumbs: [['People', null]],                                           nav: 'people' },
    roles:        { crumbs: [['Roles & access', null]],                                   nav: 'roles' },
    role:         { crumbs: [['Roles & access', 'roles'], ['Sugira Muryango Sector lead (SLA)', null]],   nav: 'roles' },
    places:       { crumbs: [['Places', null]],                                           nav: 'places' },
    system:       { crumbs: [['System', null]],                                           nav: 'system' },
    login:        { crumbs: [['Sign in', null]],                                          nav: null },

    programme:    { crumbs: [['Programme', null]],                                        nav: 'programme' },
    project:      { crumbs: [['Programme', 'programme'], ['Household Module Tracking', null]],
                    nav: 'programme' },
    module:       { crumbs: [['Programme', 'programme'], ['Household Module Tracking', 'project'],
                             ['The Importance of Good Health', null]], nav: 'programme' },
    form:         { crumbs: [['Programme', 'programme'], ['Household Module Tracking', 'project'],
                             ['The Importance of Good Health', 'module'], ['Visit record', null]], nav: 'programme' },
    cohorts:      { crumbs: [['Programme', 'programme'], ['Cohorts', null]],              nav: 'cohorts' },
    translations: { crumbs: [['Programme', 'programme'], ['Translations', null]],         nav: 'translations' }
  };

  var MODALS = {
    furule: {
      title: 'New follow-up rule',
      ok: 'Create rule',
      body: '<div><label for="f-ruf">On this form</label><select id="f-ruf"><option>Household Referral Checklist</option><option>Anthropometric measurement</option><option>Household Module Tracking</option><option>FCG participation tracking</option></select></div>' +
            '<div><label for="f-rua">When this answer is given</label><select id="f-rua"><option>A referral is ticked</option><option>Weight-for-age is below &minus;2</option><option>Two sessions missed in a row</option></select></div>' +
            '<div><label for="f-rud">Someone must act within</label><select id="f-rud"><option>2 days</option><option>7 days</option><option>14 days</option><option>Immediately</option></select></div>' +
            '<div><label for="f-ruw">Who owns it</label><select id="f-ruw"><option>The IZU who filled the form in</option><option>The sector lead</option><option>The cell coordinator</option></select></div>',
      done: 'Rule created — it applies to forms filled in from now on'
    },
    post: {
      title: 'Post to everyone',
      ok: 'Post',
      body: '<div><label for="f-pow">Who sees it</label><select id="f-pow"><option>Every home visitor</option><option>One district</option><option>One sector</option></select></div>' +
            '<div><label for="f-pot">Your post</label><textarea id="f-pot" placeholder="Do not name a household or a child. Posts are visible to every home visitor in the programme."></textarea></div>',
      done: 'Posted — it appears on the tablet at the next sync'
    },
    score: {
      title: 'Record a supervision',
      ok: 'Save score',
      body: '<div><label for="f-sci">IZU</label><select id="f-sci"><option>M. Dusabe — IZU-0142</option><option>E. Mutesi — IZU-0117</option><option>J. Kamanzi — IZU-0208</option></select></div>' +
            '<div><label for="f-scm">Session you sat in on</label><select id="f-scm"><option>6. The Importance of Good Health</option><option>5. The Importance of Good Nutrition</option><option>4. The Importance of Good Hygiene</option></select></div>' +
            '<div><label for="f-scn">What you saw</label><textarea id="f-scn" placeholder="The score is a training signal. Say what would help, not what went wrong."></textarea></div>',
      done: 'Supervision recorded'
    },
    archive: {
      title: 'Archive this form',
      ok: 'Archive',
      body: '<p style="font-size:14px;color:var(--ink-2);line-height:1.6">Archiving takes the form off the tablet at the next sync. Responses already collected stay where they are and keep appearing in reports &mdash; nothing is deleted.</p>' +
            '<div><label for="f-arw">Why</label><select id="f-arw"><option>Replaced by a newer version</option><option>No longer part of the programme</option><option>Created in error</option></select></div>',
      done: 'Archived — it leaves the tablet at the next sync'
    },
    rohask: {
      title: 'Request access to RH-0044',
      ok: 'Send request',
      body: '<div><label for="f-why">Why you need the case detail</label><textarea id="f-why" placeholder="Required. The sector lead who holds the case reads this, and it is kept in the audit trail whether the request is granted or refused."></textarea></div>' +
            '<div><label for="f-how">For how long</label><select id="f-how"><option>Until the case closes</option><option>7 days</option><option>24 hours</option></select></div>' +
            '<div><label for="f-tell">Who is told</label><select id="f-tell" disabled><option>The sector lead, and the home visitor who raised the flag</option></select></div>',
      done: 'Request sent to C. Uwimana — recorded in the audit trail'
    },
    note: {
      title: 'Add a note',
      ok: 'Save note',
      body: '<div><label for="f-note">Note</label><textarea id="f-note" placeholder="What should the next visitor know?"></textarea></div>' +
            '<div><label for="f-vis">Who can see it</label><select id="f-vis"><option>This household’s team</option><option>Supervisors only</option><option>Everyone with access to the sector</option></select></div>',
      done: 'Note saved to HH-1007'
    },
    visit: {
      title: 'Log a visit',
      ok: 'Log visit',
      body: '<div><label for="f-mod">Module</label><select id="f-mod"><option>7 — The Importance of Good Nutrition</option><option>8 — Managing the Stresses of Parenting</option></select></div>' +
            '<div><label for="f-date">Date of visit</label><input id="f-date" type="date" value="2026-11-02"></div>' +
            '<div><label for="f-out">Outcome</label><select id="f-out"><option>Completed</option><option>Household absent</option><option>Road access</option><option>Security concern</option></select></div>',
      done: 'Visit logged — it will sync when the tablet next connects'
    },
    review: {
      title: 'Record supervisor review',
      ok: 'Record review',
      body: '<div><label for="f-find">Finding</label><select id="f-find"><option>Substantiated — refer to social worker</option><option>Substantiated — handle in programme</option><option>Not substantiated — monitor</option><option>Unable to assess</option></select></div>' +
            '<div><label for="f-notes">What you saw</label><textarea id="f-notes" placeholder="Required. This becomes part of the case record."></textarea></div>',
      done: 'Review recorded on RH-0044'
    },
    enrol: {
      title: 'Enrol a household',
      ok: 'Enrol',
      body: '<div><label for="f-care">Primary caregiver</label><input id="f-care" type="text" placeholder="Full name"></div>' +
            '<div><label for="f-vill">Village</label><select id="f-vill"><option>Kabare — Kibungo — Ngoma</option><option>Gatare — Kibungo — Ngoma</option><option>Mpare — Sake — Ngoma</option></select></div>' +
            '<div><label for="f-coh">Cohort</label><select id="f-coh"><option>Cohort 4</option><option>Cohort 5 (not yet started)</option></select></div>',
      done: 'Household enrolled in Cohort 4'
    },
    project: {
      title: 'New project',
      ok: 'Create project',
      body: '<div><label for="f-pn">Project name</label><input id="f-pn" type="text" placeholder="e.g. FCG participation and interaction"></div>' +
            '<div><label for="f-pm">Start from</label><select id="f-pm"><option>An empty project</option><option>A copy of Household Module Tracking</option></select></div>',
      done: 'Project created'
    },
    module: {
      title: 'Add a session',
      ok: 'Add session',
      body: '<div><label for="f-mn">Session name</label><input id="f-mn" type="text" placeholder="e.g. The Importance of Good Nutrition"></div>' +
            '<div><label for="f-mo">Position in the sequence</label><select id="f-mo"><option>After session 9</option><option>At the end</option><option>As a booster, outside the sequence</option></select></div>',
      done: 'Session added \u2014 it is not on the mobile app until you publish'
    },
    form: {
      title: 'New form',
      ok: 'Create form',
      body: '<div><label for="f-fn">Form name</label><input id="f-fn" type="text" placeholder="e.g. Caregiver observation"></div>' +
            '<div><label for="f-fw">Filled in by</label><select id="f-fw"><option>IZU at Village</option><option>Sugira Muryango Sector lead (SLA)</option><option>IZU Cell Coordinator (ICC)</option></select></div>' +
            '<p style="font-size:.82rem;color:var(--ink-3);margin:0">Created in this session, not imported from a global library.</p>',
      done: 'Form created in Session 6'
    },
    cohort: {
      title: 'New cohort',
      ok: 'Create cohort',
      body: '<div><label for="f-cn">Cohort name</label><input id="f-cn" type="text" placeholder="e.g. Cohort 5"></div>' +
            '<div><label for="f-cd">Districts</label><select id="f-cd"><option>Not assigned yet</option><option>Ngoma</option><option>Nyanza</option><option>Rubavu</option></select></div>' +
            '<div><label for="f-cs">First session</label><input id="f-cs" type="date" value="2027-01-11"></div>',
      done: 'Cohort created as a draft \u2014 no household is scheduled yet'
    },
    publish: {
      title: 'Publish to the field',
      ok: 'Publish',
      body: '<div><label for="f-pw">What</label><select id="f-pw"><option>A video</option><option>A document</option><option>An FAQ answer</option></select></div>' +
            '<div><label for="f-pt">Title</label><input id="f-pt" type="text" placeholder="e.g. Recognising signs of harm"></div>' +
            '<div><label for="f-pv">Visible to</label><select id="f-pv"><option>Everyone</option><option>Home visitors</option><option>Supervisors and above</option><option>Social workers only</option></select></div>' +
            '<p style="font-size:.82rem;color:var(--ink-3);margin:0">Visibility reads from the same roles as Roles &amp; access.</p>',
      done: 'Published \u2014 it appears on the tablet at the next sync'
    },
    invite: {
      title: 'Invite someone',
      ok: 'Send invitation',
      body: '<div><label for="f-ie">Email</label><input id="f-ie" type="email" placeholder="name@fxbrwanda.org"></div>' +
            '<div><label for="f-ir">Role</label><select id="f-ir"><option>IZU at Village</option><option>Sugira Muryango Sector lead (SLA)</option><option>IZU Cell Coordinator (ICC)</option><option>Sugira Muryango District lead (DTL)</option><option>District NCDA Child protection and Welfare Officer (CPWO)</option><option>HQ officer</option></select></div>' +
            '<div><label for="f-ip">Where</label><select id="f-ip"><option>Kibungo \u00b7 Ngoma</option><option>Jarama \u00b7 Ngoma</option><option>Sake \u00b7 Ngoma</option><option>Kigoma \u00b7 Nyanza</option></select></div>' +
            '<p style="font-size:.82rem;color:var(--ink-3);margin:0">They set their own password from the invitation. No one else sees it.</p>',
      done: 'Invitation sent \u2014 they appear under Invited until they accept'
    },
    msettings: {
      title: 'Session settings',
      ok: 'Save for all 5 projects',
      body: '<div><label for="f-sn">Session name</label><input id="f-sn" type="text" value="The Importance of Good Health"></div>' +
            '<div><label for="f-sd">Duration</label><input id="f-sd" type="text" value="42 minutes"></div>' +
            '<p class="m-lead">Five projects run this session. Saving changes it in all of them \u2014 open one to check before you do.</p>' +
            '<ul class="blast">' +
            '<li><button class="rel" type="button" data-go="project"><svg aria-hidden="true"><use href="#i-building"/></svg>Household Module Tracking</button><span class="w"><b>2 210</b> households</span></li>' +
            '<li><button class="rel" type="button" data-go="project"><svg aria-hidden="true"><use href="#i-building"/></svg>FCG participation</button><span class="w"><b>410</b> households</span></li>' +
            '<li><button class="rel" type="button" data-go="project"><svg aria-hidden="true"><use href="#i-building"/></svg>Risk of Harm management</button><span class="w"><b>188</b> households</span></li>' +
            '<li><button class="rel" type="button" data-go="project"><svg aria-hidden="true"><use href="#i-building"/></svg>IZU Telephone Supervision</button><span class="w">supervision only</span></li>' +
            '<li><button class="rel" type="button" data-go="project"><svg aria-hidden="true"><use href="#i-building"/></svg>Sector Telephone Supervision</button><span class="w">supervision only</span></li>' +
            '</ul>' +
            '<p class="m-note"><svg aria-hidden="true"><use href="#i-alert"/></svg><span>Three of these are not yours to change. Ask the project owner first.</span></p>',
      done: 'Saved \u2014 The Importance of Good Health changed in all 5 projects'
    },
    fpublish: {
      title: 'Publish to 2 sessions',
      ok: 'Publish to both',
      body: '<p class="m-lead">Visit record is not only Session 6\u2019s form. Publishing changes it everywhere it appears.</p>' +
            '<ul class="blast">' +
            '<li><button class="rel" type="button" data-go="module"><svg aria-hidden="true"><use href="#i-programme"/></svg>Session 6</button><span class="w"><b>986</b> responses already recorded</span></li>' +
            '<li><button class="rel" type="button" data-go="module"><svg aria-hidden="true"><use href="#i-programme"/></svg>Session 9</button><span class="w"><b>412</b> responses already recorded</span></li>' +
            '</ul>' +
            '<p class="m-note"><svg aria-hidden="true"><use href="#i-alert"/></svg><span>Question 5 opens safeguarding cases. 2 are still open against the current wording.</span></p>',
      done: 'Published \u2014 live in Session 6 and Session 9'
    },
    rsave: {
      title: 'Save Sugira Muryango Sector lead (SLA)',
      ok: 'Save for 17 people',
      body: '<p class="m-lead">A role is not held in one place. Saving it changes what every holder can reach, in every project it covers.</p>' +
            '<ul class="blast">' +
            '<li><button class="rel" type="button" data-go="people"><svg aria-hidden="true"><use href="#i-admin"/></svg>17 people</button><span class="w">hold this role today</span></li>' +
            '<li><button class="rel" type="button" data-go="project"><svg aria-hidden="true"><use href="#i-building"/></svg>Household Module Tracking</button><span class="w">sector level</span></li>' +
            '<li><button class="rel" type="button" data-go="project"><svg aria-hidden="true"><use href="#i-building"/></svg>FCG participation</button><span class="w">sector level</span></li>' +
            '</ul>' +
            '<p class="m-note"><svg aria-hidden="true"><use href="#i-alert"/></svg><span>This role can open risk-of-harm detail. Narrowing it hides open cases from the people working them.</span></p>',
      done: 'Role saved \u2014 17 people are affected'
    },
    role: {
      title: 'New role',
      ok: 'Create role',
      body: '<div><label for="f-rn">Role name</label><input id="f-rn" type="text" placeholder="e.g. District coordinator"></div>' +
            '<div><label for="f-rl">Operates at</label><select id="f-rl"><option>Sector</option><option>Cell</option><option>District</option><option>Province</option><option>National</option><option>IZU</option></select></div>' +
            '<div><label for="f-rp">Programme</label><select id="f-rp"><option>All projects</option><option>Selected projects</option></select></div>' +
            '<p style="font-size:.82rem;color:var(--ink-3);margin:0">The level, not the place. Which sector or district a person covers is set when you give them the role.</p>',
      done: 'Role created with nothing granted yet'
    },
    report: {
      title: 'Build a report',
      ok: 'Run report',
      body: '<div><label for="f-q">Question</label><select id="f-q"><option>Male caregiver attendance</option><option>Risk of harm by type</option><option>Household needs</option><option>Visits per module</option><option>Average minutes per module</option></select></div>' +
            '<div><label for="f-sc">Scope</label><select id="f-sc"><option>All of Rwanda</option><option>Southern province</option><option>Ngoma district</option></select></div>' +
            '<div><label for="f-sch">Send it</label><select id="f-sch"><option>Don’t send, just show me</option><option>Weekly, Monday 06:00</option><option>Monthly, 1st at 06:00</option></select></div>',
      done: 'Report saved and queued'
    },
  };

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var crumbEl = $('#crumbs');
  var scrollEl = $('#scroll');
  var current = 'dashboard';

  function setNav(key) {
    $$('.ni, .si').forEach(function (b) { b.classList.remove('on'); b.classList.remove('in'); });
    if (!key) return;
    var hit = $$('[data-go="' + key + '"]').filter(function (b) {
      return b.classList.contains('ni') || b.classList.contains('si');
    })[0];
    if (!hit) return;
    hit.classList.add('on');
    if (hit.classList.contains('si')) {
      var list = hit.closest('.subs');
      if (list) {
        // Open the group you are inside. Arriving by drilling through a table
        // used to leave it shut, so the rail showed no sign of where you were.
        if (list.hidden) list.hidden = false;
        var owner = $('[aria-controls="' + list.id + '"]');
        if (owner) {
          owner.setAttribute('aria-expanded', 'true');
          // Mark the section as well as the item: collapse the rail, or the
          // group, and the only thing carrying the current place disappeared.
          owner.classList.add('in');
        }
      }
    }
  }

  function setCrumbs(parts) {
    crumbEl.innerHTML = '';
    parts.forEach(function (p, i) {
      if (i) {
        var sep = document.createElement('span');
        sep.className = 'sep';
        sep.textContent = '›';
        crumbEl.appendChild(sep);
      }
      var node;
      if (p[1]) {
        node = document.createElement('a');
        node.textContent = p[0];
        node.setAttribute('role', 'button');
        node.setAttribute('tabindex', '0');
        node.addEventListener('click', function () { go(p[1]); });
        node.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(p[1]); }
        });
      } else {
        node = document.createElement('b');
        node.textContent = p[0];
        node.setAttribute('aria-current', 'page');
      }
      crumbEl.appendChild(node);
    });
  }

  function resetTabs(root) {
    var tabbed = root.querySelector('.tab[data-panel]');
    if (!tabbed) return;
    $$('.tab[data-panel]', root).forEach(function (t, i) { t.classList.toggle('on', i === 0); });
    var first = tabbed.getAttribute('data-panel');
    $$('[data-panelid]', root).forEach(function (x) {
      x.hidden = x.getAttribute('data-panelid') !== first;
    });
  }

  // ---- drawer: a record opens over the list it came from ----
  // Records open in the drawer; the screens that *list* them stay pages.
  var DRAWERABLE = { household: 1, 'case': 1, form: 1, project: 1, module: 1 };
  var dw = $('#dw'), dwBody = $('#dwBody'), dwCrumbs = $('#dwCrumbs'), dwPanel = $('#dwPanel');
  var dwStack = [], dwHeld = null, dwReturn = null;

  function dwRelease() {
    if (dwHeld) { scrollEl.appendChild(dwHeld); dwHeld = null; }
  }

  function dwTeardown() {
    dwRelease();
    dw.hidden = true;
    dwStack = [];
    var shell = document.querySelector('.shell');
    if (shell) shell.classList.remove('dw-open');
  }

  function dwRender() {
    var key = dwStack[dwStack.length - 1];
    var def = SCREENS[key];
    var sec = document.getElementById('s-' + key);
    if (!def || !sec) { dwStack.pop(); return; }
    dwRelease();
    dwHeld = sec;
    dwBody.appendChild(sec);
    resetTabs(sec);

    dwCrumbs.innerHTML = '';
    def.crumbs.forEach(function (part, i) {
      if (i) {
        var sep = document.createElement('span');
        sep.className = 'sep';
        sep.textContent = '\u203A';
        dwCrumbs.appendChild(sep);
      }
      var last = i === def.crumbs.length - 1;
      var node = document.createElement(last ? 'b' : 'span');
      node.textContent = part[0];
      dwCrumbs.appendChild(node);
    });
    dwPanel.setAttribute('aria-label', def.crumbs[def.crumbs.length - 1][0]);
    var back = dw.querySelector('[data-dw="back"]');
    if (back) back.hidden = dwStack.length < 2;
    dwBody.scrollTop = 0;
  }

  function openDrawer(key) {
    if (!SCREENS[key] || !document.getElementById('s-' + key)) return;
    var opening = dw.hidden;
    if (opening) { dwReturn = document.activeElement; dwStack = []; }
    dwStack.push(key);
    dwRender();
    dw.hidden = false;
    dw.classList.toggle('as-modal', dwLayout === 'modal');
    dw.classList.toggle('as-sidebar', dwLayout === 'sidebar');
    var shell = document.querySelector('.shell');
    if (shell) shell.classList.add('dw-open');
    if (opening) {
      var c = dw.querySelector('[data-dw="close"]');
      if (c) c.focus();
    }
  }

  function closeDrawer() {
    if (dw.hidden) return;
    var back = dwReturn;
    dwTeardown();
    dwReturn = null;
    if (back && back.focus && document.contains(back)) back.focus();
  }

  function popDrawer() {
    if (dwStack.length < 2) { closeDrawer(); return; }
    dwStack.pop();
    dwRender();
  }

  // ---- layout switch: sidebar, modal, or promote to a full page ----
  var dwLayout = 'sidebar';
  function setLayout(next) {
    if (next === 'page') {
      var key = dwStack[dwStack.length - 1];
      dwReturn = null;
      if (key) go(key); else closeDrawer();
      return;
    }
    dwLayout = next;
    dw.classList.toggle('as-modal', next === 'modal');
    dw.classList.toggle('as-sidebar', next === 'sidebar');
    $$('[data-layout]', dw).forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-layout') === next));
    });
  }
  dw.addEventListener('click', function (e) {
    var l = e.target.closest('[data-layout]');
    if (l) { setLayout(l.getAttribute('data-layout')); }
  });

  // ---- collapse empty fields, as the property grid offers ----
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-pg]');
    if (!t) return;
    var grid = document.getElementById(t.getAttribute('data-pg'));
    if (!grid) return;
    var hiding = grid.classList.toggle('hide-empty');
    t.textContent = hiding ? 'Show empty fields' : 'Collapse empty fields';
  });

  dw.addEventListener('click', function (e) {
    var t = e.target.closest('[data-dw]');
    if (!t) return;
    var action = t.getAttribute('data-dw');
    if (action === 'close') closeDrawer();
    else if (action === 'back') popDrawer();
    else if (action === 'expand') {
      var key = dwStack[dwStack.length - 1];
      dwReturn = null;
      if (key) go(key); else closeDrawer();
    }
  });

  function go(key) {
    var def = SCREENS[key];
    if (!def) return;
    if (!dw.hidden) dwTeardown();
    var next = document.getElementById('s-' + key);
    if (!next) return;
    $$('.screen').forEach(function (s) { s.classList.remove('live'); });
    next.classList.add('live');
    setCrumbs(def.crumbs);
    setNav(def.nav);
    resetTabs(next);
    current = key;
    document.querySelector('.shell').classList.toggle('bare', key === 'login');
    if (scrollEl) scrollEl.scrollTop = 0;
    try {
      if (location.hash.slice(1) !== key) history.replaceState(null, '', '#' + key);
    } catch (e) { /* hash writes can be refused in embedded views */ }
  }

  // ---- navigation groups expand inline ----
  $$('.ni[aria-controls]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (!panel) return;
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      panel.hidden = open;
    });
  });

  // ---- anything carrying data-go routes ----
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-go]');
    if (t) {
      // A redacted row is not a link. Nothing behind it is reachable.
      if (t.classList.contains('shut')) return;
      var key = t.getAttribute('data-go');
      // A chip inside a confirm sends you off to look; the confirm cannot stay behind it.
      if (!scrim.hidden) closeModal();
      if (DRAWERABLE[key]) openDrawer(key); else go(key);
      return;
    }
    var toast = e.target.closest('[data-toast]');
    if (toast) { say(toast.getAttribute('data-toast')); return; }
    var m = e.target.closest('[data-modal]');
    if (m) { openModal(m.getAttribute('data-modal')); }
  });

  // ---- a relationship row with more than three links expands in place ----
  document.addEventListener('click', function (e) {
    var m = e.target.closest('[data-more]');
    if (!m) return;
    e.stopPropagation();
    var row = m.closest('.pgr');
    if (row) row.classList.add('is-open');
  });

  // ---- risk of harm: switch the role looking at the screen ----
  /* Nothing here is saved. The four bands are what splitting roh-list into a
     count and a detail makes possible, and the client picks between them. */
  function applyRoh(mode) {
    $$('.vas-b').forEach(function (b) {
      b.classList.toggle('on', b.getAttribute('data-roh') === mode);
    });
    $$('[data-open]').forEach(function (el) {
      var ok = el.getAttribute('data-open').split(' ').indexOf(mode) > -1;
      if (el.classList.contains('lockwrap')) { el.hidden = ok; }
      else {
        el.classList.toggle('shut', !ok);
        if (el.tagName === 'TR') {
          if (ok) { el.setAttribute('tabindex', '0'); el.setAttribute('role', 'link'); }
          else { el.removeAttribute('tabindex'); el.removeAttribute('role'); }
        }
      }
    });
    // the case body is only reachable when the case itself is
    var caseOpen = ['full', 'own'].indexOf(mode) > -1;
    var sc = document.getElementById('s-case');
    if (sc) {
      $$('[data-panelid]', sc).forEach(function (x) { x.classList.toggle('offlimits', !caseOpen); });
      var bar = sc.querySelector('.tabs');
      if (bar) bar.hidden = !caseOpen;
      var rec = sc.querySelector('.pg');
      if (rec) rec.classList.toggle('offlimits', !caseOpen);
      var desc = sc.querySelector('.rec-desc');
      if (desc) desc.hidden = !caseOpen;
      var acts = sc.querySelector('.rec-top .acts');
      if (acts) acts.hidden = !caseOpen;
    }
    $$('[data-when]').forEach(function (x) {
      x.hidden = x.getAttribute('data-when') !== mode;
    });
    document.body.setAttribute('data-roh', mode);
  }
  $$('.vas-b').forEach(function (b) {
    b.addEventListener('click', function () { applyRoh(b.getAttribute('data-roh')); });
  });
  if (document.querySelector('.vas-b')) applyRoh('full');

  // ---- each grid row lists the permissions it replaces ----
  $$('.pm-count').forEach(function (b) {
    b.addEventListener('click', function () {
      var sub = document.getElementById(b.getAttribute('aria-controls'));
      if (!sub) return;
      var open = b.getAttribute('aria-expanded') === 'true';
      b.setAttribute('aria-expanded', String(!open));
      sub.hidden = open;
    });
  });

  // ---- permission grid ----
  $$('.tick').forEach(function (t) {
    if (t.disabled) return;
    t.addEventListener('click', function () {
      var on = t.classList.toggle('on');
      t.setAttribute('aria-pressed', String(on));
    });
  });

  // ---- scope: one level, one programme rule ----
  $$('.axis .levels').forEach(function (group) {
    group.addEventListener('click', function (e) {
      var b = e.target.closest('.lvl');
      if (!b) return;
      $$('.lvl', group).forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on');
    });
  });

  // ---- framed alerts collapse to their header ----
  $$('.al-hd').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var body = document.getElementById(btn.getAttribute('aria-controls'));
      if (!body) return;
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      body.hidden = open;
      btn.closest('.al').classList.toggle('is-shut', open);
    });
  });

  // ---- rail collapse ----
  var rail = $('#rail');
  var railToggle = $('#railToggle');
  railToggle.addEventListener('click', function () {
    var mini = document.querySelector('.shell').classList.toggle('mini');
    railToggle.setAttribute('aria-label', mini ? 'Expand navigation' : 'Collapse navigation');
    railToggle.innerHTML = mini
      ? '<svg viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg>'
      : '<svg viewBox="0 0 24 24"><path d="M15 6 9 12l6 6"/></svg>';
  });

  // ---- tabs are per-screen ----
  $$('.tabs').forEach(function (bar) {
    bar.addEventListener('click', function (e) {
      var t = e.target.closest('.tab');
      if (!t) return;
      $$('.tab', bar).forEach(function (x) { x.classList.remove('on'); });
      t.classList.add('on');
      var panel = t.getAttribute('data-panel');
      if (!panel) return;
      var screen = bar.closest('.screen');
      $$('[data-panelid]', screen).forEach(function (x) {
        x.hidden = x.getAttribute('data-panelid') !== panel;
      });
      var sc = document.getElementById('scroll');
      if (sc) sc.scrollTop = 0;
    });
  });

  // ---- modal ----
  var scrim = $('#scrim'), mTitle = $('#mTitle'), mBody = $('#mBody'), mOk = $('#mOk');
  var lastFocus = null, pending = null;

  function openModal(key) {
    var def = MODALS[key];
    if (!def) return;
    pending = def;
    lastFocus = document.activeElement;
    mTitle.textContent = def.title;
    mBody.innerHTML = def.body;
    mOk.textContent = def.ok;
    scrim.hidden = false;
    var first = mBody.querySelector('textarea, input, select');
    // A confirm with no fields focuses Cancel, never the button that does the thing.
    if (first) first.focus(); else $('#mCancel').focus();
  }
  function closeModal() {
    scrim.hidden = true;
    pending = null;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $('#mClose').addEventListener('click', closeModal);
  $('#mCancel').addEventListener('click', closeModal);
  scrim.addEventListener('click', function (e) { if (e.target === scrim) closeModal(); });
  mOk.addEventListener('click', function () {
    var msg = pending ? pending.done : 'Saved';
    closeModal();
    say(msg);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && scrim.hidden && !dw.hidden) { popDrawer(); return; }
    if (e.key === 'Tab' && scrim.hidden && !dw.hidden) {
      var f = $$('button, a[href], textarea, input, select, [tabindex]:not([tabindex="-1"])', dwPanel)
        .filter(function (n) { return n.offsetParent !== null; });
      if (f.length) {
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    if (e.key === 'Escape' && !scrim.hidden) closeModal();
    if (e.key === 'Tab' && !scrim.hidden) {
      var f = $$('button, textarea, input, select, [tabindex]:not([tabindex="-1"])', scrim)
        .filter(function (n) { return n.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // ---- toast ----
  var toast = $('#toast'), toastTimer = null;
  function say(msg) {
    toast.textContent = msg;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.hidden = true; }, 2600);
  }

  // ---- table rows route ----
  $$('.tbl tbody tr[data-go]').forEach(function (tr) {
    tr.setAttribute('tabindex', '0');
    tr.setAttribute('role', 'link');
    tr.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !tr.classList.contains('shut')) {
        e.preventDefault(); go(tr.getAttribute('data-go'));
      }
    });
  });

  // ---- open on the screen named in the hash ----
  var start = (location.hash || '').slice(1);
  go(SCREENS[start] ? start : 'dashboard');
})();


/* ---------------------------------------------------------------------------
   Query bar: filter, sort, choose columns, export.

   Written as progressive enhancement — it finds every .tbl in the document and
   wires itself on, so no table markup needs to know about it.

   Shapes follow ClickUp's measured components: SortBadge beside a sorted column
   title, a Filters popover of field / operator / value rows with an And / Or
   match, and a column picker. The client asked for exactly this loop and kept
   tying it to export: "if we use the filter, we can export the filter" [33:14],
   "you can use the columns to export it" [59:29].
--------------------------------------------------------------------------- */
(function () {
  'use strict';
  var ICON = {
    filter: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18M6 12h12M10 19h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    cols:   '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v16H4z M10 4v16 M16 4v16" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" fill="none"/></svg>',
    down:   '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    asc:    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    desc:   '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    x:      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    plus:   '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    tick:   '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 13 4 4L19 7" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };
  var UNIT = { minute: 1, hour: 60, day: 1440, week: 10080, month: 43800, year: 525600 };

  /* A cell's sortable magnitude, or null when it has none.
     Handles "1 842", "83%", "6 of 12", "2 days ago", "40 minutes", "—". */
  function magnitude(text) {
    var t = text.trim().toLowerCase();
    if (!t || t === '—' || t === '-') return null;
    var rel = t.match(/(\d+(?:\.\d+)?)\s*(minute|hour|day|week|month|year)s?/);
    if (rel) return parseFloat(rel[1]) * UNIT[rel[2]];
    if (/^now$/.test(t)) return 0;
    var of = t.match(/^([\d\s,.]+)\s*of\s/);
    if (of) return parseFloat(of[1].replace(/[\s,]/g, ''));
    var plain = t.replace(/[\s,]/g, '').replace(/%$/, '');
    if (/^-?\d+(\.\d+)?$/.test(plain)) return parseFloat(plain);
    return null;
  }
  function cellText(td) { return (td.textContent || '').replace(/\s+/g, ' ').trim(); }

  function enhance(table) {
    var head = table.tHead, body = table.tBodies[0];
    if (!head || !body || !body.rows.length) return;
    var ths = Array.prototype.slice.call(head.rows[0].cells);
    var rows = Array.prototype.slice.call(body.rows).filter(function (r) { return r.cells.length === ths.length; });
    if (rows.length < 2 || ths.length < 2) return;

    var cols = ths.map(function (th, i) {
      var label = cellText(th) || ('Column ' + (i + 1));
      var vals = rows.map(function (r) { return cellText(r.cells[i]); });
      var nums = vals.map(magnitude).filter(function (n) { return n !== null; });
      var distinct = vals.filter(function (v, k, a) { return v && a.indexOf(v) === k; });
      return {
        i: i, label: label, th: th,
        numeric: nums.length >= Math.ceil(vals.length * 0.6),
        enumish: distinct.length > 1 && distinct.length <= Math.max(4, rows.length / 2),
        options: distinct.sort(),
        shown: true
      };
    });

    var host = table.closest('.card') || table.closest('.tblwrap');
    if (!host || !host.parentNode) return;

    /* The card's own "Showing 1-8 of 2 210" line and its pager describe the
       unfiltered page. Once a filter is on they would contradict the toolbar,
       so keep the original text and swap it while filtering. */
    var foot = host.querySelector('.tfoot');
    var footLabel = foot && foot.querySelector('span:not(.pg)');
    var footText = footLabel ? footLabel.textContent : null;
    var pager = foot && foot.querySelector('.pg');
    var state = { sort: null, match: 'and', filters: [] };

    /* ---- toolbar ---- */
    var bar = document.createElement('div');
    bar.className = 'tq';
    bar.innerHTML =
      '<button class="tq-btn" type="button" data-q="filter" aria-expanded="false">' + ICON.filter + 'Filter</button>' +
      '<button class="tq-btn" type="button" data-q="cols" aria-expanded="false">' + ICON.cols + 'Columns</button>' +
      '<span class="tq-sp"><span class="tq-count"></span>' +
      '<button class="tq-btn" type="button" data-q="export">' + ICON.down + 'Export</button></span>';
    host.parentNode.insertBefore(bar, host);

    var filterBtn = bar.querySelector('[data-q="filter"]');
    var colsBtn = bar.querySelector('[data-q="cols"]');
    var count = bar.querySelector('.tq-count');

    /* ---- popovers ---- */
    function popover(cls) {
      var p = document.createElement('div');
      p.className = 'qpop' + (cls ? ' ' + cls : '');
      p.hidden = true;
      document.body.appendChild(p);
      return p;
    }
    var fPop = popover(), cPop = popover('narrow');

    function place(pop, btn) {
      var r = btn.getBoundingClientRect();
      pop.hidden = false;
      var w = pop.offsetWidth;
      var left = Math.min(r.left + window.scrollX, window.scrollX + document.documentElement.clientWidth - w - 16);
      pop.style.left = Math.max(window.scrollX + 8, left) + 'px';
      pop.style.top = (r.bottom + window.scrollY + 6) + 'px';
    }
    function shut() {
      [fPop, cPop].forEach(function (p) { p.hidden = true; });
      [filterBtn, colsBtn].forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    }

    /* ---- filters ---- */
    function ops(col) {
      return col.numeric
        ? [['eq', 'is'], ['gt', 'more than'], ['lt', 'less than'], ['empty', 'is empty'], ['nempty', 'is not empty']]
        : [['has', 'contains'], ['eq', 'is'], ['ne', 'is not'], ['empty', 'is empty'], ['nempty', 'is not empty']];
    }
    function drawFilters() {
      fPop.innerHTML =
        '<div class="qpop-h"><h4>Filters</h4><button class="x" type="button" aria-label="Close">' + ICON.x + '</button></div>' +
        '<div class="qmatch"><button type="button" data-m="and">And</button><button type="button" data-m="or">Or</button></div>' +
        '<div class="qrows"></div>' +
        '<button class="qadd" type="button">' + ICON.plus + 'Add filter</button>';
      fPop.querySelector('.x').onclick = shut;
      fPop.querySelectorAll('.qmatch button').forEach(function (b) {
        b.classList.toggle('on', b.dataset.m === state.match);
        b.onclick = function () { state.match = b.dataset.m; drawFilters(); apply(); };
      });
      var wrap = fPop.querySelector('.qrows');
      if (!state.filters.length) wrap.innerHTML = '<p class="qempty">No filters yet. Add one to narrow this table.</p>';
      state.filters.forEach(function (f, idx) {
        var col = cols[f.col];
        var row = document.createElement('div');
        row.className = 'qrow';
        var fieldSel = '<select aria-label="Field">' + cols.map(function (c) {
          return '<option value="' + c.i + '"' + (c.i === f.col ? ' selected' : '') + '>' + c.label + '</option>';
        }).join('') + '</select>';
        var opSel = '<select aria-label="Operator">' + ops(col).map(function (o) {
          return '<option value="' + o[0] + '"' + (o[0] === f.op ? ' selected' : '') + '>' + o[1] + '</option>';
        }).join('') + '</select>';
        var val;
        if (f.op === 'empty' || f.op === 'nempty') val = '<span></span>';
        else if (col.enumish && !col.numeric) val = '<select aria-label="Value"><option value="">Choose…</option>' + col.options.map(function (o) {
          return '<option' + (o === f.val ? ' selected' : '') + '>' + o + '</option>';
        }).join('') + '</select>';
        else val = '<input type="' + (col.numeric ? 'number' : 'text') + '" aria-label="Value" value="' + (f.val || '').replace(/"/g, '&quot;') + '" placeholder="Value">';
        row.innerHTML = fieldSel + opSel + val + '<button class="clr" type="button" aria-label="Remove filter">' + ICON.x + '</button>';
        var sels = row.querySelectorAll('select, input');
        sels[0].onchange = function () { f.col = +this.value; f.op = ops(cols[f.col])[0][0]; f.val = ''; drawFilters(); apply(); };
        sels[1].onchange = function () { f.op = this.value; drawFilters(); apply(); };
        if (sels[2]) sels[2].oninput = sels[2].onchange = function () { f.val = this.value; apply(); };
        row.querySelector('.clr').onclick = function () { state.filters.splice(idx, 1); drawFilters(); apply(); };
        wrap.appendChild(row);
      });
      fPop.querySelector('.qadd').onclick = function () {
        state.filters.push({ col: 0, op: ops(cols[0])[0][0], val: '' });
        drawFilters(); apply();
      };
    }
    function drawCols() {
      cPop.innerHTML = '<div class="qcols"></div>';
      var w = cPop.querySelector('.qcols');
      cols.forEach(function (c) {
        var shownCount = cols.filter(function (x) { return x.shown; }).length;
        var locked = c.shown && shownCount <= 1;
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'qcol' + (c.shown ? ' on' : '') + (locked ? ' locked' : '');
        b.innerHTML = '<span class="bx">' + ICON.tick + '</span><span>' + c.label + '</span>';
        b.onclick = function () { if (locked) return; c.shown = !c.shown; drawCols(); apply(); };
        w.appendChild(b);
      });
    }

    /* ---- sorting ---- */
    cols.forEach(function (c) {
      c.th.classList.add('srt');
      c.th.innerHTML = '<span class="ttl">' + c.th.innerHTML + '</span>';
      c.th.setAttribute('tabindex', '0');
      c.th.setAttribute('role', 'button');
      function cycle() {
        if (!state.sort || state.sort.col !== c.i) state.sort = { col: c.i, dir: 'asc' };
        else if (state.sort.dir === 'asc') state.sort.dir = 'desc';
        else state.sort = null;
        apply();
      }
      c.th.onclick = cycle;
      c.th.onkeydown = function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); cycle(); } };
    });

    /* ---- apply ---- */
    function passes(row) {
      if (!state.filters.length) return true;
      var results = state.filters.map(function (f) {
        var col = cols[f.col], txt = cellText(row.cells[col.i]), low = txt.toLowerCase();
        var v = (f.val || '').toString().trim(), lv = v.toLowerCase();
        var n = magnitude(txt), fn = parseFloat(v);
        switch (f.op) {
          case 'empty':  return !txt || txt === '—';
          case 'nempty': return !!txt && txt !== '—';
          case 'has':    return !v || low.indexOf(lv) >= 0;
          case 'ne':     return !v || low !== lv;
          case 'gt':     return isNaN(fn) || (n !== null && n > fn);
          case 'lt':     return isNaN(fn) || (n !== null && n < fn);
          case 'eq':     return !v || (col.numeric ? (n !== null && n === fn) : low === lv);
          default:       return true;
        }
      });
      return state.match === 'and' ? results.every(Boolean) : results.some(Boolean);
    }
    var empty = null;
    function apply() {
      var shown = 0;
      rows.forEach(function (r) {
        var ok = passes(r);
        r.hidden = !ok;
        r.style.display = ok ? '' : 'none';
        if (ok) shown++;
      });
      if (state.sort) {
        var c = cols[state.sort.col], sign = state.sort.dir === 'asc' ? 1 : -1;
        rows.slice().sort(function (a, b) {
          var ta = cellText(a.cells[c.i]), tb = cellText(b.cells[c.i]);
          var na = magnitude(ta), nb = magnitude(tb);
          if (na !== null && nb !== null) return (na - nb) * sign;
          if (na !== null) return -1 * sign;
          if (nb !== null) return 1 * sign;
          return ta.localeCompare(tb) * sign;
        }).forEach(function (r) { body.appendChild(r); });
      }
      cols.forEach(function (c) {
        c.th.style.display = c.shown ? '' : 'none';
        rows.forEach(function (r) { r.cells[c.i].style.display = c.shown ? '' : 'none'; });
        var old = c.th.querySelector('.sortb');
        if (old) old.remove();
        if (state.sort && state.sort.col === c.i) {
          var b = document.createElement('span');
          b.className = 'sortb';
          b.innerHTML = state.sort.dir === 'asc' ? ICON.asc : ICON.desc;
          b.setAttribute('aria-label', state.sort.dir === 'asc' ? 'Sorted ascending' : 'Sorted descending');
          c.th.querySelector('.ttl').appendChild(b);
        }
      });
      var active = state.filters.filter(function (f) {
        return f.op === 'empty' || f.op === 'nempty' || (f.val && String(f.val).trim());
      }).length;
      filterBtn.classList.toggle('on', active > 0);
      filterBtn.innerHTML = ICON.filter + 'Filter' + (active ? '<span class="n">' + active + '</span>' : '');
      var hiddenCols = cols.filter(function (c) { return !c.shown; }).length;
      colsBtn.classList.toggle('on', hiddenCols > 0);
      colsBtn.innerHTML = ICON.cols + 'Columns' + (hiddenCols ? '<span class="n">' + (cols.length - hiddenCols) + '</span>' : '');
      count.textContent = shown === rows.length ? (rows.length + ' rows') : (shown + ' of ' + rows.length);
      if (footLabel) {
        var filtered = shown !== rows.length;
        footLabel.textContent = filtered
          ? (shown === 0 ? 'No rows match' : 'Showing ' + shown + ' matching row' + (shown === 1 ? '' : 's'))
          : footText;
        if (pager) pager.hidden = filtered;
      }
      if (!empty) {
        empty = document.createElement('p');
        empty.className = 'tq-none';
        empty.textContent = 'Nothing matches these filters.';
        body.parentNode.parentNode.insertBefore(empty, body.parentNode.nextSibling);
      }
      empty.hidden = shown !== 0;
    }

    /* ---- export reflects exactly what is on screen ---- */
    function csv() {
      var use = cols.filter(function (c) { return c.shown; });
      var lines = [use.map(function (c) { return q(c.label); }).join(',')];
      rows.forEach(function (r) {
        if (r.style.display === 'none') return;
        lines.push(use.map(function (c) { return q(cellText(r.cells[c.i])); }).join(','));
      });
      return lines.join('\r\n');
      function q(s) { return '"' + String(s).replace(/"/g, '""') + '"'; }
    }
    bar.querySelector('[data-q="export"]').onclick = function () {
      var blob = new Blob(['﻿' + csv()], { type: 'text/csv;charset=utf-8' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'sugira-export.csv';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    };

    filterBtn.onclick = function (e) {
      e.stopPropagation();
      var open = fPop.hidden;
      shut();
      if (open) { drawFilters(); place(fPop, filterBtn); filterBtn.setAttribute('aria-expanded', 'true'); }
    };
    colsBtn.onclick = function (e) {
      e.stopPropagation();
      var open = cPop.hidden;
      shut();
      if (open) { drawCols(); place(cPop, colsBtn); colsBtn.setAttribute('aria-expanded', 'true'); }
    };
    document.addEventListener('click', function (e) {
      if (!fPop.contains(e.target) && !cPop.contains(e.target) && !bar.contains(e.target)) shut();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') shut(); });

    apply();
  }

  function init() {
    Array.prototype.slice.call(document.querySelectorAll('table.tbl')).forEach(function (t) {
      if (t.dataset.enhanced) return;
      t.dataset.enhanced = '1';
      try { enhance(t); } catch (err) { /* one bad table must not stop the rest */ }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
