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
    person:       { crumbs: [['People', 'people'], ['C. Uwimana', null]],                 nav: 'people' },
    permissions:  { crumbs: [['Roles & access', null]],                                   nav: 'permissions' },
    activity:     { crumbs: [['Activity', null]],                                         nav: 'activity' },
    position:     { crumbs: [['Roles & access', 'permissions'], ['Position', null]],      nav: 'permissions' },
    rolecard:     { crumbs: [['Roles & access', 'permissions'], ['Role', null]],          nav: 'permissions' },
    places:       { crumbs: [['Places', null]],                                           nav: 'places' },
    system:       { crumbs: [['System', null]],                                           nav: 'system' },
    settings:     { crumbs: [['Settings', null]],                                        nav: 'settings' },
    profile:      { crumbs: [['Your profile', null]],                                   nav: null },
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
  /* The crumbs are already this app's own answer to "where am I", so anything
     that has to name a screen — the ⌘K bar saying where a result lives —
     reads them rather than keeping a second list of screen names that would
     drift from this one. */
  window.SugiraScreens = SCREENS;

  /* What each screen is, for the info mark beside its breadcrumb. These
     used to be a paragraph at the top of every screen, which the crumb
     had already named and which cost a row of layout to say. */
  var ABOUT = {
    cohorts:       'A cohort decides which households get which session, and when. Changing one moves real families’ schedules. Five districts run the programme: Kirehe, Musanze, Ngoma, Nyanza and Rubavu.',
    community:     'Home visitors post to each other from the tablet. Anything a reader reports arrives here, and nothing is removed without a reason being recorded.',
    content:       'What a home visitor can open on the tablet: the session videos, the written guidance, the answers to common questions. Each item is visible to the roles you choose.',
    dashboard:     'Coverage, safeguarding and reporting across every district SUGIRA Muryango works in.',
    field:         '174 of 193 home visitors have reported today. Until the rest sync, every figure on the dashboard is provisional.',
    followups:     'An answer on a form can oblige someone to go back. These are the obligations that are open, who owns each one, and how long it has been waiting.',
    households:    '2 210 enrolled across five districts. 148 are behind their cohort schedule.',
    izu:           'Whether a session was delivered the way it was designed, scored by the cell coordinator who sat in on it. A low grade is a training need, not a disciplinary one.',
    people:        'Who can use the system, what they are allowed to do, and the place their role applies to. The place is part of the assignment, not part of the role.',
    permissions:   'A position is built on the one below it and may only add to it, so nobody starts from 112 blank checkboxes \u2014 which is what produced 21 roles for 10 jobs, three of them called Test role. Open a position to see what it starts from, the few things it adds, and the stored names behind them. Where a position applies \u2014 which sector, which district \u2014 is set when it is given to a person, not here.',
    places:        'The administrative hierarchy every role is scoped against, and every household belongs to. Six levels from province down to IZU. The programme runs in five districts across four provinces.',
    programme:     'What a home visit contains: the projects, their sessions, the forms the visitor fills in, and the cohorts that decide who gets which session when.',
    reports:       'Build a question once, save it, and have it sent on a schedule.',
    roles:         'Superseded by Roles & access, which states a position as what it starts from plus what it adds. Kept until FXB has seen both.',
    safeguarding:  'Three open cases. Two of them are past the 72-hour review window.',
    settings:      'The rules the whole programme runs on. Changing one here changes it for every district, every tablet and every household at once, so each says what it will move.',
    system:        'Who did what, and the housekeeping that keeps the data honest. The rules themselves live in Settings.',
    translations:  'Thirteen of the thirty-four forms that carry text are not fully translated. Anything still English-only reaches a home visitor in a language the household may not read.',
    visits:        '147 visits are due this week. 1 842 of 2 210 are done so far in this cohort, and 368 are still missed, the oldest 34 days.'
  };

  var MODALS = {
    setint: {
      title: 'Change the interval between sessions',
      ok: 'Change it',
      body: '<div><label for="f-si">Interval</label><select id="f-si"><option>Two weeks</option><option>Three weeks</option><option>Four weeks</option></select></div>' +
            '<div><label for="f-sw">Apply to</label><select id="f-sw"><option>Sessions not yet delivered</option><option>Cohort 2 only</option></select></div>' +
            '<p class="m-lead">This reschedules 994 households in Cohort 2. Cohort 1 is past session 6, so only its remaining sessions move.</p>',
      done: 'Interval changed — 994 households rescheduled'
    },
    setroh: {
      title: 'Change the review window',
      ok: 'Change it',
      body: '<div><label for="f-sr">A supervisor review is due within</label><select id="f-sr"><option>72 hours</option><option>48 hours</option><option>24 hours</option></select></div>' +
            '<p class="m-note"><svg aria-hidden="true"><use href="#i-alert"/></svg><span>Two cases are open and both are already past 72 hours. Shortening the window does not reopen closed cases, but it will mark more of them late.</span></p>',
      done: 'Review window changed'
    },
    cleanup: {
      title: 'Clean up training data',
      ok: 'Upload and preview',
      body: '<p class="m-lead">Upload a CSV of the accounts used in training. Nothing is removed until you have seen the preview and confirmed it.</p>' +
            '<div><label for="f-cu">CSV file</label><input id="f-cu" type="file"></div>' +
            '<div><label for="f-cc">Match on</label><select id="f-cc"><option>Email</option><option>Phone number</option></select></div>',
      done: 'Uploaded — review the preview before anything is removed'
    },
    profile: {
      title: 'Edit profile',
      ok: 'Save',
      body: '<div><label for="f-pn">Name</label><input id="f-pn" type="text" value="A. Gahimana"></div>' +
            '<div><label for="f-pe">Email</label><input id="f-pe" type="email" value="a.gahimana@fxbrwanda.org"></div>' +
            '<div><label for="f-pp">Phone</label><input id="f-pp" type="tel" value="+250 78 555 0144"></div>' +
            '<div><label for="f-pl">Language</label><select id="f-pl"><option>English</option><option>Kinyarwanda</option></select></div>',
      done: 'Profile saved'
    },
    pwd: {
      title: 'Change password',
      ok: 'Change password',
      body: '<div><label for="f-p0">Current password</label><input id="f-p0" type="password" placeholder="Your current password"></div>' +
            '<div><label for="f-p1">New password</label><input id="f-p1" type="password" placeholder="At least 12 characters"></div>' +
            '<div><label for="f-p2">New password again</label><input id="f-p2" type="password"></div>' +
            '<p class="mhint">Changing it signs you out everywhere except here.</p>',
      done: 'Password changed — other devices have been signed out'
    },
    signoutall: {
      title: 'Sign out everywhere else',
      ok: 'Sign out everywhere else',
      body: '<p class="m-lead">Two other devices are signed in as you: a tablet in Ngoma and a browser in Kigali. Both will be signed out. This browser stays signed in.</p>',
      done: 'Signed out on 2 other devices'
    },
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
      body: '<p class="m-lead">Archiving takes the form off the tablet at the next sync. Responses already collected stay where they are and keep appearing in reports &mdash; nothing is deleted.</p>' +
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
    vprev: {
      title: 'Playing with everyday objects',
      ok: 'Open the full video',
      body: '<div class="vprev"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg><span>4 min 12 s</span></div>' +
            '<div class="kv"><div><div class="k">For</div><div class="v" style="font-size:14px">Session 3 \u2014 Building Early Communication Skills</div></div>' +
            '<div><div class="k">Languages</div><div class="v" style="font-size:14px">EN \u00b7 RW</div></div>' +
            '<div><div class="k">Visible to</div><div class="v" style="font-size:14px">Everyone</div></div>' +
            '<div><div class="k">Opened</div><div class="v" style="font-size:14px">1 204 times</div></div></div>',
      done: 'Opening the full video'
    },
    upd: {
      title: 'Add an update',
      ok: 'Save update',
      body: '<div><label for="f-ud">Date</label><input id="f-ud" type="date" value="2026-11-03"></div>' +
            '<div><label for="f-us">Status</label><select id="f-us"><option>Active</option><option>Stabilised</option></select></div>' +
            '<div><label for="f-uc">Update</label><textarea id="f-uc" placeholder="What has changed since the last update?"></textarea></div>',
      done: 'Update added'
    },
    refer: {
      title: 'Record a follow-up',
      ok: 'Save follow-up',
      body: '<div><label for="f-rd">Date</label><input id="f-rd" type="date" value="2026-11-03"></div>' +
            '<div><label for="f-ro">Outcome</label><select id="f-ro"><option>Seen at the health centre</option><option>Did not attend</option><option>Referred on</option><option>Closed — stabilised</option></select></div>' +
            '<div><label for="f-rn">What came back</label><textarea id="f-rn" placeholder="What the referral found, in the referrer’s words"></textarea></div>',
      done: 'Follow-up recorded on RF-0112'
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
            '<p class="mhint">Created in this session, not imported from a global library.</p>',
      done: 'Form created in Session 6'
    },
    /* "Cohort 1 2026 ... it won't just be numbers, it will be what happened in
       the year", "it has to last four months", and a limit, "otherwise cohorts
       would keep being created, created, created without any limit". The year
       and the length are not extra fields on a cohort: they are what a cohort
       is, so the dialog asks for them before it asks for districts, and the
       limit is stated where it binds rather than discovered on refusal. */
    cohort: {
      title: 'New cohort',
      ok: 'Create cohort',
      body: '<div><label for="f-cy">Year</label><select id="f-cy"><option>2027</option><option>2026</option></select></div>' +
            '<p class="mhint">2026 already has its four cohorts. A fifth would have to replace one.</p>' +
            '<div><label for="f-cn">Number in that year</label><input id="f-cn" type="text" value="1"></div>' +
            '<div><label for="f-cr">Runs for</label><select id="f-cr"><option>Four months</option><option>Six months</option><option>Twelve months</option></select></div>' +
            '<div><label for="f-cs">First session</label><input id="f-cs" type="date" value="2027-01-11"></div>' +
            '<div><label for="f-cd">Districts</label><select id="f-cd"><option>Not assigned yet</option><option>Ngoma</option><option>Nyanza</option><option>Rubavu</option></select></div>',
      done: 'Cohort 1 \u00b7 2027 created as a draft \u2014 no household is scheduled yet'
    },
    /* "I can create a form and it exists; when I come to put it in a project,
       that's when I set permission in that specific project. Because
       permissions, if I put them on a form and put it in another project,
       there could be conflict."

       — "Wait. So do we put those access on form or on project?"
       — "However it goes — even though access we put them on form, it will go
          into project, because a certain project has its own permutations."

       So access is not a property of the form and not a property of the
       project. It belongs to the pair, and the moment the pair comes into
       existence is the moment to settle it. That moment is here.

       "Before you are in a project going to add a form — you have added it,
       then they immediately show you like a pop-up telling you that there is
       conflict on this and this, and you go and choose to solve those
       conflicts. Simple, because those permissions won't be many." And twice,
       seventy seconds apart, by two people: "as dynamic as possible." So the
       conflicts are not a warning to read past — they are the form, and they
       change as soon as you choose a different form.

       Three kinds, not four. View was raised and dropped in the room: "only we
       give you view access without giving you data access — what will you do
       with the form? I don't know what it would be useful for. Instead we
       could have data access, report access, edit access." */
    addform: {
      title: 'Add a form to this project',
      ok: 'Add it and save the access',
      body: '<div><label for="f-af">Form</label><select id="f-af"></select></div>'
          + '<p class="mhint" id="f-afw"></p>'
          + '<div><label for="f-ad">Data access</label><select id="f-ad">'
          + '<option>IZU at Village and above</option><option>Supervisors and above</option>'
          + '<option>Nobody yet</option></select></div>'
          + '<div><label for="f-ar">Report access</label><select id="f-ar">'
          + '<option>Supervisors and above</option><option>M&amp;E and above</option>'
          + '<option>Nobody yet</option></select></div>'
          + '<div><label for="f-ae2">Edit access</label><select id="f-ae2">'
          + '<option>M&amp;E and above</option><option>HQ only</option>'
          + '<option>Nobody yet</option></select></div>'
          + '<div id="f-afc"></div>',
      done: 'Form added — its access in this project is saved',
      init: function (body, from) {
        var sel = body.querySelector('#f-af');
        var warn = body.querySelector('#f-afw');
        var host = body.querySelector('#f-afc');
        var here = (from && from.getAttribute('data-report-project')) || 'this project';

        /* A form already in use somewhere carries what that project gave it.
           Nothing here is a rule about forms in general — it is what these
           two projects happen to have decided, which is the whole point. */
        var FORMS = [
          { name: 'Anthropometric measurement', used: ['Risk of Harm management'],
            clash: [['IZU at Village', 'Edit access in Risk of Harm management',
                     'Data access only here'],
                    ['Sector lead', 'no access in Risk of Harm management',
                     'Report access here']] },
          { name: 'Household Referral Checklist', used: ['Risk of Harm management',
              'IZU Cell Coordinator Telephone Supervision'],
            clash: [['Social worker', 'Data access in Risk of Harm management',
                     'no access here'],
                    ['IZU Cell Coordinator', 'Report access in Telephone Supervision',
                     'Data access only here'],
                    ['District lead', 'Edit access in Risk of Harm management',
                     'Report access here']] },
          { name: 'Session in action', used: [], clash: [] },
          { name: 'FCG participation and interaction form', used: [], clash: [] }
        ];

        function draw() {
          var f = FORMS.filter(function (x) { return x.name === sel.value; })[0] || FORMS[0];
          warn.textContent = f.used.length
            ? 'Already in ' + f.used.join(' and ') + '. What it carries there does not follow it here.'
            : 'Not in any other project, so nothing to reconcile.';
          host.innerHTML = '';
          if (!f.clash.length) return;

          var box = document.createElement('div');
          box.className = 'impact';
          var h = document.createElement('b');
          h.textContent = f.clash.length + (f.clash.length === 1 ? ' conflict' : ' conflicts')
            + ' to settle';
          box.appendChild(h);
          f.clash.forEach(function (c, i) {
            var r = document.createElement('div');
            r.className = 'cfl';
            var who = document.createElement('span');
            who.className = 'cfl-w';
            who.textContent = c[0];
            var what = document.createElement('span');
            what.className = 'cfl-t';
            what.textContent = 'has ' + c[1] + ', and ' + c[2];
            var pick = document.createElement('select');
            pick.setAttribute('aria-label', 'What ' + c[0] + ' gets in ' + here);
            ['Keep what this project gives', 'Take what the form carries', 'Decide later']
              .forEach(function (o) {
                var op = document.createElement('option');
                op.textContent = o;
                pick.appendChild(op);
              });
            r.appendChild(who);
            r.appendChild(what);
            r.appendChild(pick);
            box.appendChild(r);
          });
          host.appendChild(box);
          if (window.SugiraMenu) window.SugiraMenu.enhance(host);
        }

        FORMS.forEach(function (f) {
          var o = document.createElement('option');
          o.textContent = f.name;
          sel.appendChild(o);
        });
        sel.addEventListener('change', draw);
        draw();
      }
    },
    /* A conflict left open has to be reachable, or "1 conflict open" is a
       label on a dead end. It is the same dialog as the one that raised it —
       the same three ways out, the same words — because settling one later is
       not a different act from settling it then. What it adds is the two
       things you did not have at the time: who left it, and when. */
    settle: {
      title: 'Settle this conflict',
      ok: 'Settle it',
      body: '<p class="mhint" id="f-stw"></p><div id="f-stc"></div>'
          + '<div class="impact"><b>What this changes</b>'
          + '<p>Access to one form, in one project. Nothing the IZU Cell '
          + 'Coordinator holds in the two other projects this form is in '
          + 'moves, because each pairing is settled on its own.</p></div>',
      done: 'Settled — the pairing reads as settled from both ends',
      /* The answer has to land somewhere, or the dialog is a form that throws
         away what you tell it: before this, you could settle a conflict and
         the row went on saying "1 conflict open". It lands in two places,
         because an access change is two facts — what is true now, on the
         record, and who made it so, in the log. */
      onOk: function (body) {
        var row = this.row, proj = this.proj;
        if (!row) return;
        var choice = (body.querySelector('#f-stc select') || {}).value || 'Decided later';
        var cell = row.closest('td');
        if (/^Leave it open/.test(choice)) {
          this.done = 'Left open — the pairing still has a conflict to settle';
          return;
        }
        var chip = document.createElement('span');
        chip.className = 'chip ok';
        chip.setAttribute('data-tip', 'Settled today by A. Gahimana — '
          + choice.toLowerCase() + '. The IZU Cell Coordinator keeps Data access here.');
        chip.innerHTML = '<i></i>Settled';
        if (cell) { cell.innerHTML = ''; cell.appendChild(chip); }
        logAccess('Settled a conflict on a form', proj, '1 position');
        this.done = 'Settled — the pairing reads as settled from both ends';
      },
      init: function (body, from) {
        var proj = (from && from.getAttribute('data-settle')) || 'this project';
        this.row = from;
        this.proj = proj;
        body.querySelector('#f-stw').textContent =
          'Left open on 14 October by A. Gahimana, when this form was added to '
          + proj + '.';
        var host = body.querySelector('#f-stc');
        var box = document.createElement('div');
        box.className = 'impact';
        var h = document.createElement('b');
        h.textContent = '1 conflict to settle';
        box.appendChild(h);
        var r = document.createElement('div');
        r.className = 'cfl';
        var who = document.createElement('span');
        who.className = 'cfl-w';
        who.textContent = 'IZU Cell Coordinator';
        var what = document.createElement('span');
        what.className = 'cfl-t';
        what.textContent = 'has Report access in Risk of Harm management, and Data access only here';
        var pick = document.createElement('select');
        pick.setAttribute('aria-label', 'What the IZU Cell Coordinator gets in ' + proj);
        ['Keep what this project gives', 'Take what the form carries', 'Leave it open for now']
          .forEach(function (o) {
            var op = document.createElement('option');
            op.textContent = o;
            pick.appendChild(op);
          });
        r.appendChild(who);
        r.appendChild(what);
        r.appendChild(pick);
        box.appendChild(r);
        host.appendChild(box);
        if (window.SugiraMenu) window.SugiraMenu.enhance(host);
      }
    },
    qedit: {
      title: 'Question 3',
      ok: 'Save the question',
      body: '<div><label for="f-qe">Question, in English</label><input id="f-qe" type="text" value="Was the male caregiver present?"></div>' +
            '<div><label for="f-qk">Question, in Kinyarwanda</label><input id="f-qk" type="text" value="Umubyeyi w\u2019umugabo yari ahari?"></div>' +
            '<div><label for="f-qt">Answer type</label><select id="f-qt"><option>Yes / No</option><option>Single choice</option><option>Multi-select</option><option>Checklist</option><option>Number</option><option>Date</option><option>Short text</option><option>Long text</option></select></div>' +
            '<div><label for="f-qo">Answers offered</label><input id="f-qo" type="text" value="Yego, Oya, Nta mubyeyi w\u2019umugabo"></div>' +
            '<p class="mhint">Separate each answer with a comma. They appear on the tablet in this order.</p>' +
            '<div><label for="f-qr">Must be answered</label><select id="f-qr"><option>Yes</option><option>No</option></select></div>' +
            '<div><label for="f-qc">Opens a risk-of-harm case</label><select id="f-qc"><option>No</option><option>Yes, when answered Yego</option></select></div>' +
            '<p class="mhint">Only question 5 does this today. A second one would send two cases to the same supervisor for one visit.</p>',
      done: 'Question saved \u2014 the tablet gets it when the form is published'
    },
    cmanage: {
      title: 'Manage Cohort 1 · 2026',
      ok: 'Save the cohort',
      body: '<div><label for="f-ml">Label</label><input id="f-ml" type="text" value="Cohort 1 · 2026"></div>' +
            '<div><label for="f-md">Districts</label><select id="f-md"><option>All five districts</option><option>Kirehe, Musanze, Ngoma</option><option>Nyanza, Rubavu</option></select></div>' +
            '<div><label for="f-mf">First session falls on</label><input id="f-mf" type="date" value="2026-01-12"></div>' +
            '<div><label for="f-mr">Runs for</label><select id="f-mr"><option>Four months</option><option>Six months</option><option>Twelve months</option></select></div>' +
            '<p class="mhint">Ends 11 May 2026. Four months holds nine of the twelve fortnightly sessions; session 12 falls on 15 June.</p>' +
            '<div><label for="f-ms">Status</label><select id="f-ms"><option>Active</option><option>Paused</option><option>Closed</option></select></div>' +
            '<div class="impact"><b>What this moves</b>' +
            '<p>1\u202F216 households are on Cohort 1, and 1\u202F104 of them have sessions still to come. ' +
            'Moving the first session moves every one of those, including 148 already behind schedule.</p>' +
            '<p>Sessions already delivered are not touched. Pausing the cohort stops new visits being scheduled ' +
            'but leaves the ones already on a visitor\u2019s list for this week.</p></div>',
      done: 'Cohort 1 saved \u2014 1\u202F104 households rescheduled'
    },
    /* "Document types you can create", behaving as folders, "with their own
       search". A folder was a string typed into the upload dialog, which is
       how you end up with Policy and policy. Made here, it is a thing with a
       name and a default audience, and every document put in it starts from
       that rather than from whatever the last person chose. */
    doctype: {
      title: 'New document type',
      ok: 'Create the type',
      body: '<div><label for="f-dtn">Name</label><input id="f-dtn" type="text" placeholder="e.g. Consent forms"></div>'
          + '<div><label for="f-dtv">Who it is for, to begin with</label><select id="f-dtv">'
          + '<option>Everyone</option><option>IZU at Village</option>'
          + '<option>Supervisors and above</option><option>M&amp;E only</option></select></div>'
          + '<p class="mhint">Each document can be narrowed further. Nothing in a type is opened here — a document is downloaded, which is what the field asked for.</p>',
      done: 'Type created — it is offered the next time anything is uploaded'
    },
    publish: {
      title: 'Publish to the field',
      ok: 'Publish',
      body: '<div><label for="f-pw">What</label><select id="f-pw"><option>A video</option><option>A document</option><option>An FAQ answer</option></select></div>' +
            '<div><label for="f-pt">Title</label><input id="f-pt" type="text" placeholder="e.g. Recognising signs of harm"></div>' +
            '<div><label for="f-pf">File</label><input id="f-pf" type="file"></div>' +
            '<p class="mhint">MP4 or PDF, up to 200 MB. A video is re-encoded for the tablet, which takes a few minutes after you publish.</p>' +
            /* A type, not a typed-in folder name \u2014 the types are the ones that
               exist, and a new one is made where types are made. */
            '<div><label for="f-pd">Type</label><select id="f-pd"><option>Policy</option><option>Field</option><option>Reporting</option><option>Session guidance</option></select></div>' +
            '<div><label for="f-pl">Language</label><select id="f-pl"><option>Kinyarwanda</option><option>English</option><option>Both</option></select></div>' +
            '<div><label for="f-pv">Visible to</label><select id="f-pv"><option>Everyone</option><option>Home visitors</option><option>Supervisors and above</option><option>Social workers only</option></select></div>' +
            '<p class="mhint">Visibility reads from the same roles as Roles &amp; access.</p>',
      done: 'Published \u2014 it appears on the tablet at the next sync'
    },
    vedit: {
      title: 'Edit this item',
      ok: 'Save changes',
      body: '<div><label for="f-et">Title</label><input id="f-et" type="text" value="Playing with everyday objects"></div>' +
            '<div><label for="f-ef">Replace the file</label><input id="f-ef" type="file"></div>' +
            '<p class="mhint">Leave empty to keep the file that is published now.</p>' +
            '<div><label for="f-ed">Folder</label><select id="f-ed"><option>Using the tablet</option><option>Safeguarding</option><option>Session guidance</option><option>Forms and reporting</option></select></div>' +
            '<div><label for="f-el">Language</label><select id="f-el"><option>Kinyarwanda</option><option>English</option><option selected>Both</option></select></div>' +
            '<div><label for="f-ev">Visible to</label><select id="f-ev"><option>Everyone</option><option selected>Home visitors</option><option>Supervisors and above</option><option>Social workers only</option></select></div>',
      done: 'Saved \u2014 the tablet picks it up at the next sync'
    },
    vdelete: {
      title: 'Delete this item?',
      ok: 'Delete',
      danger: true,
      body: '<p class="m-lead">It is removed from every tablet at the next sync. Anyone part-way through watching it loses their place.</p>' +
            '<p class="mhint">Deleted items are recoverable for 30 days from System \u203A Data maintenance. After that they are gone.</p>' +
            '<div><label for="f-dw">Why it is being removed</label><input id="f-dw" type="text" placeholder="Recorded against your name in the activity log"></div>',
      done: 'Deleted \u2014 recoverable for 30 days'
    },
    access: {
      title: 'Change access for C. Uwimana',
      ok: 'Save access',
      body: '<div><label for="f-ap">Position</label><select id="f-ap"><option>Sugira Muryango Sector lead (SLA)</option><option>Sugira Muryango District lead (DTL)</option><option>IZU Cell Coordinator (ICC)</option><option>IZU at Village</option><option>HQ officer</option><option>District NCDA Child protection and Welfare Officer (CPWO)</option><option>National NCDA Government Official</option></select></div>' +
            '<div><label for="f-apr">Province</label><select id="f-apr"><option>Eastern</option><option>Northern</option><option>Southern</option><option>Western</option><option>Kigali</option></select></div>' +
            '<div><label for="f-ad">District</label><select id="f-ad"><option>Ngoma</option><option>Kirehe</option><option>Nyanza</option><option>Rubavu</option><option>Musanze</option></select></div>' +
            '<div><label for="f-as">Sector</label><select id="f-as"><option>Kibungo</option><option>Jarama</option><option>Sake</option><option>Zaza</option></select></div>' +
            '<div><label for="f-ac">Cell</label><select id="f-ac"><option>All cells in the sector</option><option>Kabare</option><option>Rukira</option><option>Zaza</option></select></div>' +
            '<div><label for="f-av">Village</label><select id="f-av"><option>All villages in the cell</option><option>Nyarutovu</option><option>Gituku</option></select></div>' +
            '<div><label for="f-an">Notified by email</label><select id="f-an"><option>Yes</option><option>No</option></select></div>' +
            '<p class="mhint">The position decides what they can do. The place decides whose records they can do it to. Leave a level unset to cover everything under the one above it.</p>',
      done: 'Access changed \u2014 it takes effect the next time they sign in'
    },
    exception: {
      title: 'Add an exception',
      ok: 'Grant exception',
      body: '<div><label for="f-xw">The one thing they get</label><select id="f-xw"><option>Change \u2014 Programme</option><option>Add \u2014 Programme</option><option>Change \u2014 Reports</option><option>Archive \u2014 Reports</option><option>See \u2014 People &amp; access</option><option>See \u2014 Maintenance</option><option>Change \u2014 Maintenance</option><option>Archive \u2014 Households</option><option>Change \u2014 Field support</option></select></div>' +
            '<div><label for="f-xu">Until</label><input id="f-xu" type="date" value="2026-12-31"></div>' +
            '<div><label for="f-xr">Why</label><textarea id="f-xr" placeholder="Required. This is what an auditor reads."></textarea></div>' +
            '<p class="mhint">One person, one thing, with an end date. The list holds only what their position does not already give them. If a second person needs the same thing, it belongs on the position \u2014 or on a rung above it.</p>',
      done: 'Exception granted \u2014 it appears on the record and expires on its own'
    },
    invite: {
      title: 'Invite someone',
      ok: 'Send invitation',
      body: '<div><label for="f-ie">Email</label><input id="f-ie" type="email" placeholder="name@fxbrwanda.org"></div>' +
            '<div><label for="f-ir">Role</label><select id="f-ir"><option>IZU at Village</option><option>Sugira Muryango Sector lead (SLA)</option><option>IZU Cell Coordinator (ICC)</option><option>Sugira Muryango District lead (DTL)</option><option>District NCDA Child protection and Welfare Officer (CPWO)</option><option>HQ officer</option></select></div>' +
            '<div><label for="f-ip">Where</label><select id="f-ip"><option>Kibungo \u00b7 Ngoma</option><option>Jarama \u00b7 Ngoma</option><option>Sake \u00b7 Ngoma</option><option>Kigoma \u00b7 Nyanza</option></select></div>' +
            '<p class="mhint">They set their own password from the invitation. No one else sees it.</p>',
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
            '<p class="m-note"><svg aria-hidden="true"><use href="#i-alert"/></svg><span>Question 5 opens safeguarding cases. 2 are still open against the current wording.</span></p>' +
            /* Where it reaches is half the answer. In a system built for
               villages with no signal, when it reaches them is the other
               half, and the old wording — "live" — skipped it. */
            '<p class="m-note"><svg aria-hidden="true"><use href="#i-clock"/></svg><span data-reach>A tablet gets version 5 when it next syncs.</span></p>',
      init: function (body) {
        var card = document.getElementById('fb-fleet');
        var slot = body.querySelector('[data-reach]');
        if (!card || !slot) return;
        var behind = card.querySelector('[data-fleet="behind"]');
        var n = behind ? behind.textContent.replace(/\D/g, '') : '';
        var v = Number(card.getAttribute('data-version') || 4);
        if (!n) return;
        slot.textContent = 'A tablet gets version ' + (v + 1) + ' when it next syncs. '
          + n + ' are still on version ' + (v - 1) + ' \u2014 the oldest has not synced for '
          + (card.getAttribute('data-oldest') || '6 days') + '.';
      },
      done: 'Published to Session 6 and Session 9 \u2014 tablets take version 5 as they sync'
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
    posadd: {
      title: 'Give a position to someone',
      ok: 'Give it to them',
      body: '<div><label for="f-pap">Person</label><select id="f-pap"><option>M. Dusabe</option><option>J. Mukamana</option><option>A. Gahimana</option><option>C. Uwimana</option></select></div>'
          + '<div><label for="f-papl">Where they work</label><select id="f-papl"><option>Kibungo \u00b7 Ngoma</option><option>Jarama \u00b7 Ngoma</option><option>Sake \u00b7 Ngoma</option><option>Kigoma \u00b7 Nyanza</option></select></div>'
          + '<p class="m-lead">The position decides what they can do. The place decides whose records they can do it to \u2014 which is why it is set here, on the assignment, and not on the position.</p>'
          + '<p class="m-note"><svg aria-hidden="true"><use href="#i-alert"/></svg><span>A position replaces whatever position they hold now. Roles they hold are left alone \u2014 those add on top of whichever position someone has.</span></p>',
      done: 'Position given \u2014 it takes effect the next time they sign in'
    },
    permnew: {
      title: 'Add a permission',
      ok: 'Add it',
      body: '<div><label for="f-pn">What it lets someone do</label><input id="f-pn" type="text" placeholder="e.g. Close a risk-of-harm case"></div>'
          + '<div><label for="f-pd">What that means</label><textarea id="f-pd" placeholder="One sentence, in the words someone in the programme would use. This is what the row shows, and what a tick on a position means."></textarea></div>'
          + '<div><label for="f-pg">Group</label><select id="f-pg"><option>Households</option><option>Visits</option><option>Risk-of-harm cases</option><option>Programme</option><option>Reports</option><option>Field support</option><option>People &amp; access</option><option>Maintenance</option></select></div>'
          + '<div><label for="f-pr">Replaces, in the live system</label><input id="f-pr" type="text" placeholder="Optional \u2014 the stored names this stands for, comma separated"></div>'
          + '<p class="m-lead">It is granted by nothing until a position or a role takes it, and appears on every position\u2019s list unticked.</p>'
          + '<p class="m-note"><svg aria-hidden="true"><use href="#i-alert"/></svg><span>Twenty-six cover the whole programme. The live system carries a hundred and twelve because each screen added its own rather than reusing one \u2014 so check the list first for something that already does this.</span></p>',
      done: 'Permission added \u2014 it is on every position, waiting to be granted'
    },
    rolenew: {
      title: 'New role',
      ok: 'Create the role',
      body: '<div><label for="f-nrn">Name</label><input id="f-nrn" type="text" placeholder="e.g. Form translator"></div>'
          + '<div><label for="f-nrw">What it is for</label><textarea id="f-nrw" placeholder="The work this covers, in one sentence. A role is not a job \u2014 if it describes someone\u2019s whole position, it belongs on the ladder instead."></textarea></div>'
          + '<p class="m-lead">A role only adds. It cannot take anything away from the position its holders already have.</p>'
          + '<p class="m-note"><svg aria-hidden="true"><use href="#i-alert"/></svg><span>Five roles exist. Before making a sixth, the next screen says which of them already grant what you are about to grant \u2014 the live system carries twenty-one roles for ten jobs because nobody could see the twenty that were already there.</span></p>',
      done: 'Role created \u2014 give it permissions, then give it to someone'
    },
    roleadd: {
      title: 'Give a role to someone',
      ok: 'Give it to them',
      body: '<div><label for="f-ra">Role</label><select id="f-ra"><option>Form translator</option><option>Report builder</option><option>Cohort manager</option><option>Form publisher</option><option>Community manager</option></select></div>'
          + '<div><label for="f-rap">Person</label><select id="f-rap"><option>C. Uwimana</option><option>M. Dusabe</option><option>A. Gahimana</option><option>J. Mukamana</option></select></div>'
          + '<p class="m-lead">They keep their position. The role is added on top of it \u2014 nothing they could do before stops working.</p>',
      done: 'Role given \u2014 it takes effect the next time they sign in'
    },
    role: {
      title: 'New position',
      ok: 'Create position',
      body: '<div><label for="f-rn">Name</label><input id="f-rn" type="text" placeholder="e.g. District coordinator"></div>'
          + '<div><label for="f-rw">What the job is</label><textarea id="f-rw" placeholder="One sentence, the way someone in the programme would say it \u2014 \u201cRuns the programme in one sector and supervises the home visitors in it.\u201d This is what the card shows."></textarea></div>'
          + '<div><label for="f-rb">Starts from</label><select id="f-rb"><option>IZU at Village \u2014 8 of 26</option><option>Sugira Muryango Sector lead (SLA) \u2014 14 of 26</option><option>National NCDA Government Official \u2014 2 of 26</option><option>District NCDA Child protection and Welfare Officer (CPWO) \u2014 4 of 26</option><option>IZU Cell Coordinator (ICC) \u2014 6 of 26</option><option>Sugira Muryango District lead (DTL) \u2014 7 of 26</option><option>HQ officer \u2014 19 of 26</option><option>Nothing \u2014 build from zero</option></select></div>'
          + '<div><label for="f-rp">Programme</label><select id="f-rp"><option>All projects</option><option>Selected projects</option></select></div>'
          + '<p class="m-lead">It starts with everything that position has, and you add to it on the card. It cannot take anything away \u2014 something that needs less than its rung is a rung of its own.</p>'
          + '<p class="m-note"><svg aria-hidden="true"><use href="#i-alert"/></svg><span>Eight positions exist for ten jobs. If this one would be an existing position plus one thing for one person, that belongs on their record as an exception \u2014 doing it here is how the live system came to carry twenty-one roles, three of them called Test role.</span></p>'
          + '<p class="m-lead">Which sector or district someone covers is set when the position is given to them, not here. The same position runs in every sector.</p>',
      done: 'Position created \u2014 it already has everything the one it starts from has'
    },
    /* The client called this one "very challenging", and the reason was in the
       first field: Question was a closed list of five, so a builder titled
       "Build a report" could only hand back a report somebody had already
       written. The nine saved reports read as a measure and a grouping —
       "Average minutes per module", "Minutes per visit, by home visitor",
       "Activities completed, by session" — so that is what it asks for now,
       and thirty-six combinations replace the five.

       It also asks what the report is built on, which it never did, though the
       table has carried a "Built on" column all along and the client said
       plainly that reports are built on their projects. Project narrows the
       forms, so choosing one does something. Both lists, and the places, are
       read from the app's own data rather than typed here. */
    report: {
      title: 'Build a report',
      ok: 'Run report',
      body: '<div><label for="f-proj">Project</label><select id="f-proj"></select></div>'
          + '<div><label for="f-form">Built on</label><select id="f-form"></select></div>'
          + '<div><label for="f-measure">Count</label><select id="f-measure">'
          + '<option>Responses</option><option>Visits completed</option>'
          + '<option>Households reached</option><option>Minutes per visit</option>'
          + '<option>Risk-of-harm cases</option><option>Referrals made</option></select></div>'
          + '<div><label for="f-group">Grouped by</label><select id="f-group">'
          + '<option>District</option><option>Sector</option><option>Session</option>'
          + '<option>Home visitor</option><option>Cohort</option><option>Month</option></select></div>'
          + '<div><label for="f-sc">Where</label><select id="f-sc"></select></div>'
          + '<div><label for="f-rn">Name</label><input id="f-rn" type="text"></div>'
          + '<div><label for="f-sch">Send it</label><select id="f-sch">'
          + '<option>Don’t send, just show me</option><option>Weekly, Monday 06:00</option>'
          + '<option>Monthly, 1st at 06:00</option></select></div>',
      init: function (body, from) {
        var proj = body.querySelector('#f-proj'), form = body.querySelector('#f-form');
        var measure = body.querySelector('#f-measure'), group = body.querySelector('#f-group');
        var where = body.querySelector('#f-sc'), name = body.querySelector('#f-rn');
        var prog = window.SUGIRA_PROGRAMME, places = window.SUGIRA_PLACES;
        var typed = false;

        function fill(sel, items) {
          sel.innerHTML = '';
          items.forEach(function (t) {
            var o = document.createElement('option');
            o.textContent = t;
            sel.appendChild(o);
          });
          sel.dispatchEvent(new Event('change', { bubbles: true }));
        }

        /* Only projects with a form still in use: a report cannot be built on
           an archived one, and offering it would be a dead end. */
        var live = (prog ? prog.projects : []).filter(function (p) {
          return p.forms.some(function (f) { return f.status === 'Active'; });
        });

        function formsOf(pname) {
          var p = live.filter(function (x) { return x.name === pname; })[0];
          if (!p) return [];
          return p.forms.filter(function (f) { return f.status === 'Active'; })
            .map(function (f) { return f.name + ' — ' + f.responses + ' responses'; });
        }

        /* The name the nine saved reports are written in, so what comes out of
           here sits in the table beside them without looking foreign. It stops
           following the fields the moment anyone types their own. */
        function rename() {
          if (typed) return;
          name.value = measure.value + ', by ' + group.value.toLowerCase();
        }

        proj.addEventListener('change', function () { fill(form, formsOf(proj.value)); });
        measure.addEventListener('change', rename);
        group.addEventListener('change', rename);
        name.addEventListener('input', function () { typed = true; });

        fill(proj, live.map(function (p) { return p.name; }));
        /* Opened from a project, the project is already answered. The field
           stays — you can still see which one you are in, and change it —
           but nobody has to pick what they just clicked out of. */
        var here = from && from.getAttribute('data-report-project');
        if (here && live.some(function (p) { return p.name === here; })) {
          proj.value = here;
          proj.dispatchEvent(new Event('change', { bubbles: true }));
        }
        fill(where, ['All of Rwanda']
          .concat(places ? places.provinces : [])
          .concat(places ? places.districts.map(function (d) { return d + ' district'; }) : []));
        rename();
      },
      done: 'Report saved and queued'
    },
  };

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var crumbEl = $('#crumbs');
  var scrollEl = $('#scroll');
  var current = 'dashboard';

  // The rail row that started the current move, so the row you actually
  // clicked is the row that lights up. Several rows can name one screen —
  // "All households", "Behind schedule" and "Enrolment" are all the households
  // list — and keying the highlight off the screen alone always lit the first
  // of them, so the other two looked dead however often you clicked them.
  var navFrom = null;

  function setNav(key) {
    var from = navFrom; navFrom = null;
    $$('.ni, .si').forEach(function (b) { b.classList.remove('on'); b.classList.remove('in'); });
    if (!key) return;
    var hit = null;
    if (from && from.getAttribute('data-go') === key &&
        (from.classList.contains('ni') || from.classList.contains('si'))) hit = from;
    if (!hit) {
      var cands = $$('[data-go="' + key + '"]').filter(function (b) {
        return b.classList.contains('ni') || b.classList.contains('si');
      });
      // A header and its own first child name the same screen. Arriving with
      // no click of your own — a crumb, a table drill-through — means the
      // plain unfiltered view, which is that child.
      var pair = null;
      cands.forEach(function (b) {
        var pid = b.classList.contains('ni') && b.getAttribute('aria-controls');
        if (!pid) return;
        var child = cands.filter(function (c) {
          var list = c.classList.contains('si') && c.closest('.subs');
          return list && list.id === pid;
        })[0];
        if (child) pair = child;
      });
      // Failing that, the row that owns the screen outright beats a sub-item in
      // another group that merely cross-links to it: land on Field status and
      // the footer item is where you are, not "Supervision" under Visits.
      hit = pair ||
            cands.filter(function (b) { return b.classList.contains('ni'); })[0] ||
            cands[0];
    }
    if (!hit) return;
    hit.classList.add('on');
    foldOthers(hit.classList.contains('ni') ? hit
      : (hit.closest('.subs') ? $('[aria-controls="' + hit.closest('.subs').id + '"]') : null));
    // Landing on a header itself (a group with no sub-item for this screen)
    // should still show what is inside it.
    if (hit.classList.contains('ni') && hit.getAttribute('aria-controls')) {
      var own = document.getElementById(hit.getAttribute('aria-controls'));
      if (own) { own.hidden = false; hit.setAttribute('aria-expanded', 'true'); }
    }
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

  /* A screen's own actions belong on its toolbar row, not up in the header:
     the breadcrumb bar is where you are, the toolbar is what you can do here.
     The system's ViewsBar lays that row out as two groups — a start group of
     filters and search, an end group pushed to the far edge — so each action
     group moves into the end group of whichever row its screen already has.

     This runs after the tables have been enhanced, because for a screen whose
     only toolbar is the generated one, that row does not exist until then. */
  var actsHost = $('#pageActs');

  function endOf(row) {
    var end = row.querySelector(':scope > .end');
    if (!end) {
      end = document.createElement('span');
      end.className = 'end';
      row.appendChild(end);
    }
    /* whatever the row already pushed right belongs in that same group */
    Array.prototype.slice.call(row.children).forEach(function (c) {
      if (c !== end && (c.classList.contains('tq-sp') || c.classList.contains('rt'))) {
        end.insertBefore(c, end.firstChild);
      }
    });
    return end;
  }

  function placeActs() {
    if (!actsHost) return;
    Array.prototype.slice.call(actsHost.children).forEach(function (acts) {
      var sc = document.getElementById('s-' + acts.getAttribute('data-for'));
      if (!sc) return;
      var row = sc.querySelector('.filters') || sc.querySelector('.tq')
        || sc.querySelector('.pm-top');
      if (!row) {
        /* no filters and no table: the screen still gets the row, empty on
           the left, so its actions sit where every other screen's do */
        row = document.createElement('div');
        row.className = 'filters';
        var pad = sc.querySelector('.pad');
        if (!pad) return;
        pad.insertBefore(row, pad.firstChild);
      }
      acts.hidden = false;
      endOf(row).appendChild(acts);
    });
    actsHost.remove();
  }

  function setCrumbs(parts, about) {
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
    if (!about) return;
    var help = document.createElement('button');
    help.type = 'button';
    help.className = 'ihelp';
    help.setAttribute('data-tip', about);
    help.setAttribute('aria-expanded', 'false');
    help.setAttribute('aria-label', 'About ' + parts[parts.length - 1][0]);
    help.innerHTML = '<svg aria-hidden="true"><use href="#i-info"/></svg>';
    crumbEl.appendChild(help);
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
  var DRAWERABLE = { household: 1, 'case': 1, form: 1, project: 1, module: 1, person: 1,
                     position: 1, rolecard: 1 };
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
    /* the side pane fills itself from here, so the record's own markup
       stays as it is and goes back to the page untouched on close */
    document.dispatchEvent(new CustomEvent('drawer:render', { detail: { key: key } }));
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
  /* Modal is the default because that is what ClickUp opens a record into:
     TaskModal is inset 24 with r12 over the backdrop, and the as-modal layout
     here already measures exactly that. The side panel stays one click away for
     anyone who wants the list visible beside the record. */
  var dwLayout = 'modal';
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

  /* ---- four properties, then More ----
     ClickUp's task detail shows Status, Assignees, Dates and Track time and
     puts everything else behind More. A household here opened with fourteen
     fields at once — national ID, family ID, consent date, phone — so the
     first thing the drawer said was reference detail rather than who the
     household is and where it stands. The rest are one click away and the
     order is the one the markup already declares. */
  var PG_VISIBLE = 4;
  $$('.pg').forEach(function (grid) {
    var rows = $$('.pgr', grid);
    if (rows.length <= PG_VISIBLE + 1) return;
    var extra = rows.slice(PG_VISIBLE);
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pg-collapse pg-more';
    btn.setAttribute('aria-expanded', 'false');
    var caret = document.createElement('span');
    caret.className = 'pg-more-c';
    caret.innerHTML = '<svg aria-hidden="true"><use href="#i-caret"/></svg>';
    var label = document.createTextNode('');
    btn.appendChild(caret);
    btn.appendChild(label);
    function show(open) {
      btn.setAttribute('aria-expanded', String(open));
      extra.forEach(function (r) { r.hidden = !open; });
      label.nodeValue = open ? 'Less' : 'More (' + extra.length + ')';
    }
    show(false);
    btn.addEventListener('click', function () {
      show(btn.getAttribute('aria-expanded') !== 'true');
    });
    grid.parentNode.insertBefore(btn, grid.nextSibling);
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
    setCrumbs(def.crumbs, ABOUT[key]);
    setNav(def.nav);
    resetTabs(next);
    current = key;
    document.querySelector('.shell').classList.toggle('bare', key === 'login');
    if (scrollEl) scrollEl.scrollTop = 0;
    try {
      if (location.hash.slice(1) !== key) history.replaceState(null, '', '#' + key);
    } catch (e) { /* hash writes can be refused in embedded views */ }
  }

  // ---- navigation groups ----
  // The row and the chevron used to be one control, so a section header could
  // only fold its own list: clicking "Households" shut the thing you had just
  /* One section open at a time. Three stood open together, which spent most of
     the rail's height on groups you were not in and pushed the rest below the
     fold. Opening one folds the others, so the rail always shows every section
     and the contents of exactly one. */
  function foldOthers(except) {
    $$('.ni[aria-controls]').forEach(function (b) {
      if (b === except) return;
      var p = document.getElementById(b.getAttribute('aria-controls'));
      if (!p) return;
      b.setAttribute('aria-expanded', 'false');
      p.hidden = true;
    });
  }

  // aimed at and went nowhere. The row now opens the section it names; the
  // chevron — and the arrow keys — fold it.
  $$('.ni[aria-controls]').forEach(function (btn) {
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    if (!panel) return;
    function fold(open) {
      btn.setAttribute('aria-expanded', String(open));
      panel.hidden = !open;
      if (open) foldOthers(btn);
    }
    btn.addEventListener('click', function (e) {
      if (e.target.closest('.cr')) {
        // The chevron folds and does nothing else, or a group you are standing
        // in could never be collapsed. Stop here so the row does not also route.
        e.stopPropagation();
        fold(btn.getAttribute('aria-expanded') !== 'true');
        return;
      }
      // Arriving at a section always opens it. Toggling on the row is what made
      // the list vanish under the pointer.
      fold(true);
    });
    // The chevron is a pointer target, so folding needs the keys a tree gives
    // you as well; Enter and Space stay with the row and navigate.
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' && btn.getAttribute('aria-expanded') !== 'true') {
        e.preventDefault(); fold(true);
      } else if (e.key === 'ArrowLeft' && btn.getAttribute('aria-expanded') === 'true') {
        e.preventDefault(); fold(false);
      }
    });
  });

  /* Going to a screen, as the one click on a [data-go] control does it: some
     screens are drawers and some replace the page, and which is which is
     settled here. Anything that has to navigate without a control to click —
     the ⌘K bar sending you to a record that sits in a table — asks for it by
     name rather than deciding again. */
  function route(key) {
    if (!SCREENS[key] && !DRAWERABLE[key]) return false;
    if (!scrim.hidden) closeModal();
    if (DRAWERABLE[key]) { navFrom = null; openDrawer(key); } else go(key);
    return true;
  }
  window.SugiraGo = route;

  // ---- anything carrying data-go routes ----
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-go]');
    // A control inside a clickable row belongs to the control, not the row —
    // otherwise an Edit button in a table row would just open the row.
    var inner = e.target.closest('[data-modal]');
    if (t && inner && t !== inner && t.contains(inner)) t = null;
    if (t) {
      // A redacted row is not a link. Nothing behind it is reachable.
      if (t.classList.contains('shut')) return;
      var key = t.getAttribute('data-go');
      // Remember the rail row this came from, if it is one, so setNav can light
      // the row you picked rather than the first one naming the same screen.
      navFrom = t.closest('.ni, .si');
      // A chip inside a confirm sends you off to look; the confirm cannot stay behind it.
      if (!scrim.hidden) closeModal();
      if (DRAWERABLE[key]) { navFrom = null; openDrawer(key); } else go(key);
      return;
    }
    var toast = e.target.closest('[data-toast]');
    if (toast) { say(toast.getAttribute('data-toast')); return; }
    var m = e.target.closest('[data-modal]');
    if (m) { openModal(m.getAttribute('data-modal'), m); }
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
      // An action belongs to what is showing. "New project" above a list of
      // forms is the wrong verb for the thing in front of you.
      $$('[data-forpanel]', screen).forEach(function (x) {
        x.hidden = x.getAttribute('data-forpanel').split(' ').indexOf(panel) === -1;
      });
      $$('[data-offpanel]', screen).forEach(function (x) {
        x.hidden = x.getAttribute('data-offpanel').split(' ').indexOf(panel) !== -1;
      });
      var sc = document.getElementById('scroll');
      if (sc) sc.scrollTop = 0;
    });
  });

  // ---- modal ----
  var scrim = $('#scrim'), mTitle = $('#mTitle'), mBody = $('#mBody'), mOk = $('#mOk');
  var lastFocus = null, pending = null;

  /* ---- one popover ----
     A panel hung off the control that opened it: the filter's, the column
     picker's, and anything else that needs more room than a menu and less
     ceremony than a dialog. There is one at a time across the whole app,
     Escape shuts it, and clicking away shuts it — which is the part that was
     being written again each time it was needed.

     A list of choices is not this. That is SugiraMenu, which knows about
     arrow keys, about a submenu, about searching itself once it is longer
     than nine. This is for a panel — the filter's three columns, the
     builder's condition — where there is no list to walk. The two close each
     other, because "one at a time" is not a property either of them can have
     on its own. */
  var livePop = null, liveAnchor = null;
  window.SugiraPop = {
    open: function (anchor, fill, opts) {
      opts = opts || {};
      window.SugiraPop.close();
      if (window.SugiraMenu) window.SugiraMenu.close();
      var pop = document.createElement('div');
      pop.className = 'qpop' + (opts.cls ? ' ' + opts.cls : '');
      pop.setAttribute('role', 'dialog');
      if (opts.label) pop.setAttribute('aria-label', opts.label);
      document.body.appendChild(pop);
      fill(pop, function () { window.SugiraPop.close(); });

      var r = anchor.getBoundingClientRect();
      var w = pop.offsetWidth;
      var left = Math.min(r.left + window.scrollX,
        window.scrollX + document.documentElement.clientWidth - w - 16);
      pop.style.left = Math.max(window.scrollX + 8, left) + 'px';
      /* Below the control, unless that would run off the bottom. */
      var top = r.bottom + window.scrollY + 6;
      if (r.bottom + pop.offsetHeight + 24 > window.innerHeight) {
        top = Math.max(window.scrollY + 8, r.top + window.scrollY - pop.offsetHeight - 6);
      }
      pop.style.top = top + 'px';

      livePop = pop;
      liveAnchor = anchor;
      anchor.setAttribute('aria-expanded', 'true');
      /* The first thing in a panel with a header is the ✕ that shuts it, and
         landing on the way out is not an opening. Take the first control that
         does the panel's actual work, and the ✕ only if there is none. */
      var able = pop.querySelectorAll('button, input, select, .cselect, [tabindex]');
      var first = Array.prototype.filter.call(able, function (n) {
        return !n.closest('.qpop-h');
      })[0] || able[0];
      if (first) first.focus();
      return pop;
    },
    close: function () {
      if (!livePop) return;
      livePop.remove();
      livePop = null;
      if (liveAnchor) {
        liveAnchor.setAttribute('aria-expanded', 'false');
        liveAnchor = null;
      }
    },
    isOpen: function (anchor) { return anchor ? liveAnchor === anchor : !!livePop; },
    /* Is this control inside the panel that is open? A select in the filter
       is; the account chip is not. */
    holds: function (node) { return !!(livePop && node && livePop.contains(node)); }
  };
  document.addEventListener('mousedown', function (e) {
    if (!livePop) return;
    if (livePop.contains(e.target) || (liveAnchor && liveAnchor.contains(e.target))) return;
    if (e.target.closest && e.target.closest('.cmenu')) return;
    window.SugiraPop.close();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || !livePop) return;
    /* A menu opened from inside the panel is the layer on top, so Escape
       belongs to it first. Dismissing both at once would take away the panel
       somebody was halfway through filling in. */
    if (window.SugiraMenu && window.SugiraMenu.isOpen()) return;
    var a = liveAnchor;
    window.SugiraPop.close();
    if (a && a.focus) a.focus();
  });

  /* An access change that nobody recorded is the thing the activity log exists
     to stop. A dialog that changes who can reach what writes its own entry,
     at the top, where the newest one goes. */
  function logAccess(what, touched, reach) {
    var body = document.querySelector('#s-activity table.tbl tbody');
    if (!body) return;
    var tr = document.createElement('tr');
    tr.setAttribute('data-tags', 'access');
    tr.innerHTML = '<td class="mut">Today ' + new Date().toTimeString().slice(0, 5)
      + '</td><td>A. Gahimana</td><td class="nm">' + what
      + '</td><td><button class="rel" type="button" data-go="project">'
      + '<svg aria-hidden="true"><use href="#i-building"/></svg>' + touched
      + '</button></td><td><span class="chip warn"><i></i>' + reach
      + '</span></td><td class="gap"></td>';
    body.insertBefore(tr, body.firstChild);
    if (window.SugiraWho) window.SugiraWho.run(tr.parentNode.parentNode);
  }

  /* `from` is whatever was clicked. A dialog opened from inside a record can
     read its own context off it — a report built from a project should not
     ask which project you are in. */
  function openModal(key, from) {
    var def = MODALS[key];
    if (!def) return;
    pending = def;
    lastFocus = document.activeElement;
    mTitle.textContent = def.title;
    mBody.innerHTML = def.body;
    mOk.textContent = def.ok;
    mOk.classList.toggle('danger', !!def.danger);
    scrim.hidden = false;
    // Build the custom controls before choosing what to focus. A <select> is
    // now visually hidden behind its own trigger, so focusing the first
    // "input, select" put the caret on something nobody can see.
    if (window.SugiraMenu) window.SugiraMenu.enhance(mBody);
    /* A modal whose choices come from the app's own data fills them here,
       after the triggers exist, so refilling one list updates its trigger. */
    if (def.init) def.init(mBody, from);
    var first = mBody.querySelector('textarea, input:not([type="hidden"]), .cselect');
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
    var def = pending;
    /* A dialog that was asked for rather than looked up answers its caller
       before it closes, while its fields still exist — and what it reports is
       read afterwards, because what happened can depend on what was chosen.
       Settling a conflict and leaving it open are not the same outcome. */
    if (def && def.onOk && def.onOk(mBody) === false) return;
    var msg = def ? def.done : 'Saved';
    closeModal();
    if (msg) say(msg);
  });

  /* One dialog in the app, so a module that needs to ask something borrows it
     rather than drawing a second one with its own idea of a button. */
  window.SugiraModal = {
    ask: function (def) {
      MODALS.__ask = { title: def.title, ok: def.ok, body: def.body,
        onOk: def.onOk, done: def.done || '', danger: def.danger };
      openModal('__ask');
    }
  };
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
  /* The stylesheet has carried .toast-undo since the ClickUp pass — "the
     toast action is a real button, not underlined text" — and nothing has
     ever put one there. A toast that only reports needs 2.6 seconds; one
     that offers a way back has to outlast reading it, so it gets seven. */
  var toast = $('#toast'), toastTimer = null;
  function say(msg, action) {
    toast.textContent = '';
    toast.appendChild(document.createTextNode(msg));
    if (action) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'toast-undo';
      b.textContent = action.label || 'Undo';
      b.onclick = function () {
        toast.hidden = true;
        clearTimeout(toastTimer);
        action.onClick();
      };
      toast.appendChild(b);
    }
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.hidden = true;
      if (action && action.onLapse) action.onLapse();
    }, action ? 7000 : 2600);
  }
  window.SugiraToast = { say: say };

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

  /* The generated toolbars do not exist until the tables have been
     enhanced, so the actions are placed once that is done. */
  document.addEventListener('tables:ready', placeActs);

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
  /* textContent would also return what the cell is hiding. A safeguarding row
     carries both the name and the "household withheld" stand-in, one of them
     display:none by role, and a filter that offers you both is offering you
     the redaction. */
  function cellText(td) {
    var out = '';
    Array.prototype.forEach.call(td.childNodes, function (n) {
      if (n.nodeType === 3) { out += n.nodeValue; return; }
      if (n.nodeType !== 1) return;
      // display is read off the element itself, not off layout: a row that
      // the filter has already hidden must still report the same text, or it
      // could never match its way back into view.
      if (getComputedStyle(n).display === 'none') return;
      out += cellText(n);
    });
    return out.replace(/\s+/g, ' ').trim();
  }

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
        shown: true,
        gap: th.classList.contains('gap')
      };
    });
    /* The spacer column holds the slack at the right-hand end and nothing
       else, so it is dropped here rather than in each of the loops below —
       after the indexes are taken, so every column still reads its own cell. */
    cols = cols.filter(function (c) { return !c.gap; });
    var hasGap = cols.length !== ths.length;

    var host = table.closest('.card') || table.closest('.tblwrap');
    if (!host || !host.parentNode) return;

    /* The card's own "Showing 1-8 of 2 210" line and its pager describe the
       unfiltered page. Once a filter is on they would contradict the toolbar,
       so keep the original text and swap it while filtering. */
    var foot = host.querySelector('.tfoot');
    var footLabel = foot && foot.querySelector('span:not(.pg)');
    /* The footer as it was written, kept whole: it may hold a bold count or a
       link to somewhere, and restoring it from a string would lose both. */
    var footText = footLabel ? footLabel.cloneNode(true) : null;
    var pager = foot && foot.querySelector('.pg');
    var state = { sort: null, rules: [], match: 'and', openCol: null };

    /* ---- toolbar ---- */
    var bar = document.createElement('div');
    bar.className = 'tq';
    bar.innerHTML =
      '<button class="tq-btn" type="button" data-q="filter" aria-expanded="false">' + ICON.filter + 'Filter</button>' +
      '<button class="tq-btn" type="button" data-q="cols" aria-expanded="false">' + ICON.cols + 'Columns</button>' +
      '<span class="tq-sp"><span class="tq-count"></span>' +
      '<button class="tq-btn" type="button" data-q="export">' + ICON.down + 'Export</button></span>';
    /* ClickUp gives a view one toolbar, not two. Where the screen already
       writes a filter row above the table, these controls join it (the class
       makes the wrapper display:contents, so they become its own children)
       rather than opening a second band of chrome. */
    var fRow = host.previousElementSibling;
    var joined = !!(fRow && fRow.classList.contains('filters'));
    if (joined) {
      bar.className = 'tq tq-in';
      fRow.appendChild(bar);
    } else {
      host.parentNode.insertBefore(bar, host);
    }
    /* Where a domain filter bar already governs this table — place, cohort,
       module, the pills that know the hierarchy — the generic Filter and
       Export would be a second way to do the same thing with a different idea
       of what is applied, so they go. Columns and column sorting stay,
       because the domain bar does not do those.

       What governs it is the bar in its own panel, or on the screen when the
       table is not in one. Asking the screen alone said yes on Programme,
       where the pills sit behind a tab of their own: the nineteen projects
       and the thirty-seven forms were left with no Filter and no Export and
       a text search for the whole of it. The grouping chip is drawn as a pill
       too, so it is named here and excluded. */
    var scope = host.closest('[data-panelid]') || host.closest('.screen');
    var owned = !!(scope && scope.querySelector('.filters .fl:not(.grpby)'));

    var filterBtn = bar.querySelector('[data-q="filter"]');
    var colsBtn = bar.querySelector('[data-q="cols"]');
    var count = bar.querySelector('.tq-count');
    /* The duplicate Export still goes: two buttons doing one thing is a
       choice nobody wants to make. The Filter stays. It used to go for the
       same reason, but that reasoning only held while this was a facet list
       — a second way to say "Kirehe" when a chip already said it. Field,
       condition, value is not a second way to do the same thing: the chips
       are the common cases, this is everything else, and the client asked
       for it "on all the lists that we have". They narrow together. */
    if (owned) bar.querySelector('[data-q="export"]').hidden = true;

    /* ---- popovers ----
       The filter panel carries three controls across, so it is the wide one;
       the column picker is a list of names and stays narrow.

       Both of these used to be built, placed and closed right here: a third
       copy of the same forty lines, and the copy that never learned to open
       upwards when it would fall off the bottom of the window. It also kept
       its own register of what was open, which is why it had to walk every
       .qpop on the page to shut the others — a screen carries four toolbars,
       and each only ever shut its own pair. SugiraPop keeps that register for
       the whole app now, so what is left here is what is particular to a
       toolbar. */
    var fPop = null, cPop = null;
    function live(p) { return p && p.isConnected; }
    function shut() { window.SugiraPop.close(); }

    /* ---- filters ----

       Field, condition, value. The client asked for exactly this, three
       times over four minutes (gp2 01:41-06:04): "he can take a column, then
       he says where this column is this, it has this and this value", and
       "that is what I am expecting on all the lists that we have".

       What was here before was a facet list, with a comment explaining that
       a query builder was the wrong shape for this data. It was not; the
       reason given — "nobody wants to say Outcome is not empty" — is beside
       the point they were making, which is that a search box that looks in
       every column at once cannot tell age from a first name:

         "if that person puts 'Harerimana' I wouldn't know if it's age or
          first name or last name. And you are on 1,000, 10,000 people."

       The geometry is ClickUp's, measured (QueryPanels.tsx FilterRow):
       32-high rows with a 4 gap, field 143, condition 104, value flex,
       clear 32; triggers 28 high at r7; rows inside one group box.

       Ours rather than theirs: the value. ClickUp types into a box. Our
       columns know their own values, so "is" and "is not" offer them as a
       list — the one good thing about the facets, kept. */

    /* Which conditions a column can take. A column whose values nearly all
       parse as numbers gets "is between" and loses "contains"; everything
       else is text. Dates read as numbers here ("31 Oct" -> 31), which is
       wrong for ordering but right for offering a range, so they land in the
       same place either way. */
    function colKind(c) { return c && c.numeric ? 'number' : 'text'; }
    var OPS = {
      text:   [['is', 'is'], ['not', 'is not'], ['has', 'contains'], ['empty', 'is empty']],
      number: [['is', 'is'], ['not', 'is not'], ['btw', 'is between'], ['empty', 'is empty']]
    };
    function opLabel(kind, op) {
      var hit = OPS[kind].filter(function (o) { return o[0] === op; })[0];
      return hit ? hit[1] : op;
    }

    function activeCount() {
      return state.rules.filter(function (r) { return ruleReady(r); }).length;
    }
    /* A half-built row filters nothing rather than everything: you pick a
       column before you have said what to compare it to, and the table
       should not empty while you are still deciding. */
    function ruleReady(r) {
      if (r.i == null) return false;
      if (r.op === 'empty') return true;
      if (r.op === 'btw') return r.v !== '' || r.v2 !== '';
      return r.v !== '' && r.v != null;
    }

    function drawFilters() {
      /* Every control inside the panel redraws the panel. Once the panel is
         gone there is nothing to redraw, and a closed popover is a real state
         now rather than a hidden div that was always there. */
      if (!live(fPop)) return;
      fPop.innerHTML = '';
      var head = document.createElement('div');
      head.className = 'qpop-h';
      head.innerHTML = '<h4>Filters</h4>';
      var clear = document.createElement('button');
      clear.type = 'button';
      clear.className = 'qclear';
      clear.textContent = 'Clear all';
      clear.hidden = !state.rules.length;
      clear.onclick = function (e) {
        e.stopPropagation();
        state.rules = []; state.match = 'and';
        apply(); drawFilters();
      };
      head.appendChild(clear);
      fPop.appendChild(head);

      var box = document.createElement('div');
      box.className = 'qbox';

      /* Across rows: all of them, or any. One control, only once there are
         two rows to join — with one row it is a question about nothing. */
      if (state.rules.length > 1) {
        var m = document.createElement('div');
        m.className = 'qmatch';
        m.appendChild(document.createTextNode('Match'));
        [['and', 'All'], ['or', 'Any']].forEach(function (o) {
          var b = document.createElement('button');
          b.type = 'button';
          b.className = 'qmatch-b' + (state.match === o[0] ? ' on' : '');
          b.setAttribute('aria-pressed', String(state.match === o[0]));
          b.textContent = o[1];
          b.onclick = function (e) {
            e.stopPropagation();
            state.match = o[0];
            apply(); drawFilters();
          };
          m.appendChild(b);
        });
        box.appendChild(m);
      }

      state.rules.forEach(function (r, n) { box.appendChild(ruleRow(r, n)); });
      if (!state.rules.length) {
        var none = document.createElement('p');
        none.className = 'qnone';
        none.textContent = 'Nothing filtered.';
        box.appendChild(none);
      }
      fPop.appendChild(box);

      var add = document.createElement('button');
      add.type = 'button';
      add.className = 'qadd';
      add.innerHTML = ICON.plus || '';
      add.appendChild(document.createTextNode('Add filter'));
      add.onclick = function (e) {
        e.stopPropagation();
        var first = cols.filter(function (c) { return c.shown; })[0] || cols[0];
        state.rules.push({ i: first ? first.i : null, op: 'is', v: '', v2: '' });
        drawFilters();
      };
      fPop.appendChild(add);
    }

    /* One condition: column, what to ask of it, what to compare against. */
    function ruleRow(r, n) {
      var row = document.createElement('div');
      row.className = 'qrow';
      row.setAttribute('role', 'group');
      row.setAttribute('aria-label', 'Filter condition');

      var col = cols.filter(function (c) { return c.i === r.i; })[0];
      var kind = col ? colKind(col) : 'text';

      /* the column */
      row.appendChild(pick('qf-col', col ? col.label : 'Column',
        cols.map(function (c) { return { v: String(c.i), t: c.label }; }),
        String(r.i), function (v) {
          r.i = +v;
          var k = colKind(cols.filter(function (c) { return c.i === r.i; })[0]);
          if (!OPS[k].some(function (o) { return o[0] === r.op; })) r.op = 'is';
          r.v = ''; r.v2 = '';
          apply(); drawFilters();
        }));

      /* the condition */
      row.appendChild(pick('qf-op', opLabel(kind, r.op),
        OPS[kind].map(function (o) { return { v: o[0], t: o[1] }; }),
        r.op, function (v) {
          r.op = v; r.v = ''; r.v2 = '';
          apply(); drawFilters();
        }));

      /* the value — a list of what the column holds where that makes sense,
         a box where it does not, nothing at all for "is empty" */
      var val = document.createElement('div');
      val.className = 'qf-val';
      if (r.op === 'empty') {
        val.innerHTML = '<span class="qf-na">—</span>';
      } else if (r.op === 'btw') {
        val.appendChild(num(r.v, 'from', function (v) { r.v = v; apply(); }));
        val.appendChild(num(r.v2, 'to', function (v) { r.v2 = v; apply(); }));
      } else if (r.op === 'has' || !col) {
        val.appendChild(text(r.v, 'Value', function (v) { r.v = v; apply(); }));
      } else {
        val.appendChild(pick('qf-pick', r.v || 'Value',
          col.options.map(function (v) { return { v: v, t: v }; }),
          r.v, function (v) { r.v = v; apply(); drawFilters(); }));
      }
      row.appendChild(val);

      var kill = document.createElement('button');
      kill.type = 'button';
      kill.className = 'qf-x';
      kill.setAttribute('aria-label', 'Remove this condition');
      kill.innerHTML = ICON.x || '×';
      kill.onclick = function (e) {
        e.stopPropagation();
        state.rules.splice(n, 1);
        if (state.rules.length < 2) state.match = 'and';
        apply(); drawFilters();
      };
      row.appendChild(kill);
      return row;
    }

    /* A trigger that opens the app's own menu, so these read as every other
       select on the screen rather than as a second kind of control. */
    function pick(cls, label, items, now, onPick) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'cselect qf ' + cls;
      b.setAttribute('aria-haspopup', 'menu');
      var t = document.createElement('span');
      t.className = 'cselect-t';
      t.textContent = label;
      b.appendChild(t);
      var c = document.createElement('span');
      c.className = 'cselect-c';
      c.setAttribute('aria-hidden', 'true');
      c.textContent = '▾';
      b.appendChild(c);
      b.onclick = function (e) {
        e.stopPropagation();
        if (!window.SugiraMenu) return;
        window.SugiraMenu.show(b, items.map(function (it) {
          return { label: it.t, selected: it.v === now, onPick: function () { onPick(it.v); } };
        }), { width: Math.max(160, b.offsetWidth) });
      };
      return b;
    }
    function text(v, ph, onIn) {
      var i = document.createElement('input');
      i.type = 'text'; i.className = 'qf-in'; i.value = v || ''; i.placeholder = ph;
      i.oninput = function () { onIn(this.value); };
      i.onclick = function (e) { e.stopPropagation(); };
      return i;
    }
    function num(v, ph, onIn) {
      var i = text(v, ph, onIn);
      i.classList.add('qf-num');
      i.inputMode = 'decimal';
      return i;
    }

    function drawCols() {
      if (!live(cPop)) return;
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
    /* One condition against one row. A half-built row is not a condition
       yet, so it is skipped rather than failing everything. */
    function holds(row, r) {
      if (!ruleReady(r)) return true;
      var cell = cellText(row.cells[r.i]);
      if (r.op === 'empty') return !cell;
      if (r.op === 'btw') {
        var n = magnitude(cell);
        if (n === null) return false;
        var lo = r.v === '' ? null : magnitude(r.v), hi = r.v2 === '' ? null : magnitude(r.v2);
        if (lo !== null && n < lo) return false;
        if (hi !== null && n > hi) return false;
        return true;
      }
      if (r.op === 'has') return cell.toLowerCase().indexOf(String(r.v).toLowerCase()) > -1;
      if (r.op === 'not') return cell !== r.v;
      return cell === r.v;
    }
    /* Across conditions: all of them, or any — "Match" in the panel. With
       nothing set, every row passes. */
    function passes(row) {
      var live = state.rules.filter(ruleReady);
      if (!live.length) return true;
      return state.match === 'or'
        ? live.some(function (r) { return holds(row, r); })
        : live.every(function (r) { return holds(row, r); });
    }
    var empty = null;
    function apply() {
      var shown = 0;
      rows.forEach(function (r) {
        var ok = passes(r);
        /* A class, not an inline display. The place and status chips on
           Households and Follow-ups hide rows with `f-out`, which is a class
           rule — an inline `display` here would have overridden it and shown
           rows the domain filter had excluded. As classes the two compose:
           a row is out if either says so, which is what someone narrowing by
           place and then by a condition expects. */
        r.classList.toggle('q-out', !ok);
        if (ok && !r.classList.contains('f-out')) shown++;
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
      /* The last column holds the slack, so hiding it would leave nothing to
         hold it and the gaps would spread themselves across the row again.
         The last column still showing takes the job instead. Tables that
         carry a spacer need none of this: the spacer is never hidden. */
      if (!hasGap) {
        var tail = cols.filter(function (c) { return c.shown; }).pop();
        cols.forEach(function (c) {
          var on = c === tail && c !== cols[cols.length - 1];
          c.th.classList.toggle('grow', on);
          rows.forEach(function (r) { r.cells[c.i].classList.toggle('grow', on); });
        });
      }
      var active = activeCount();
      filterBtn.classList.toggle('on', active > 0);
      filterBtn.innerHTML = ICON.filter + 'Filter' + (active ? '<span class="n">' + active + '</span>' : '');
      var hiddenCols = cols.filter(function (c) { return !c.shown; }).length;
      colsBtn.classList.toggle('on', hiddenCols > 0);
      colsBtn.innerHTML = ICON.cols + 'Columns' + (hiddenCols ? '<span class="n">' + (cols.length - hiddenCols) + '</span>' : '');
      count.textContent = shown === rows.length ? (rows.length + ' rows') : (shown + ' of ' + rows.length);
      if (footLabel) {
        var filtered = shown !== rows.length;
        /* Putting the footer back meant writing textContent, which flattens it:
           every "3 open cases" lost its bold on the first paint, and a footer
           carrying a link lost the link. The original is kept as nodes and put
           back as nodes, so a footer can say more than a sentence. */
        if (filtered) {
          footLabel.textContent = shown === 0 ? 'No rows match'
            : 'Showing ' + shown + ' matching row' + (shown === 1 ? '' : 's');
        } else if (footLabel.textContent !== footText.textContent) {
          footLabel.innerHTML = '';
          [].forEach.call(footText.childNodes, function (n) {
            footLabel.appendChild(n.cloneNode(true));
          });
        }
        if (pager) pager.hidden = filtered;
      }
      if (!empty) {
        empty = document.createElement('p');
        empty.className = 'tq-none';
        empty.textContent = 'Nothing matches these filters.';
        body.parentNode.parentNode.insertBefore(empty, body.parentNode.nextSibling);
      }
      empty.hidden = shown !== 0;
      /* Grouping runs over whatever is left showing, so it re-forms after
         every sort and every filter rather than fighting them. */
      table.dispatchEvent(new CustomEvent('table:applied', { bubbles: true }));
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
      if (window.SugiraPop.isOpen(filterBtn)) { shut(); return; }
      window.SugiraPop.open(filterBtn, function (pop) {
        fPop = pop;
        drawFilters();
      }, { cls: 'wide', label: 'Filters' });
    };
    colsBtn.onclick = function (e) {
      e.stopPropagation();
      if (window.SugiraPop.isOpen(colsBtn)) { shut(); return; }
      window.SugiraPop.open(colsBtn, function (pop) {
        cPop = pop;
        drawCols();
      }, { cls: 'narrow', label: 'Columns' });
    };
    /* The click-away and the Escape that used to be here were registered once
       per toolbar, and a screen carries four. SugiraPop has one of each. */

    apply();
  }

  function init() {
    Array.prototype.slice.call(document.querySelectorAll('table.tbl')).forEach(function (t) {
      if (t.dataset.enhanced) return;
      t.dataset.enhanced = '1';
      try { enhance(t); } catch (err) { /* one bad table must not stop the rest */ }
    });
    /* The pinned first column draws its seam only once there is something
       behind it, so the wrapper says whether it has been scrolled sideways.
       A table that fits never gets the class and never grows a line it does
       not need. */
    [].forEach.call(document.querySelectorAll('.tblwrap'), function (w) {
      if (w.dataset.sideways) return;
      w.dataset.sideways = '1';
      var paint = function () {
        w.classList.toggle('is-scrolled', w.scrollLeft > 0);
      };
      w.addEventListener('scroll', paint, { passive: true });
      paint();
    });

    /* Read by anything that must not touch a toolbar before it exists, for
       the case where that module loads after this has already run. */
    window.SugiraTablesReady = true;
    document.dispatchEvent(new Event('tables:ready'));
  }

  /* A table built after load never reached this scan, because it only ran once:
     the Forms library on Programme is assembled by programme.js into an empty
     card, so it was the one table of 34 with no filtering, sorting or export.
     Watching for late tables keeps that the module's own problem rather than
     something every module that builds one has to remember to announce. The
     toolbar this inserts contains no table, so it cannot retrigger the watch. */
  function watch() {
    new MutationObserver(function (recs) {
      for (var i = 0; i < recs.length; i++) {
        var added = recs[i].addedNodes;
        for (var j = 0; j < added.length; j++) {
          var n = added[j];
          if (n.nodeType !== 1) continue;
          if (n.matches('table.tbl') || n.querySelector('table.tbl')) return init();
        }
      }
    }).observe(document.body, { childList: true, subtree: true });
  }
  function start() { init(); watch(); }
  /* A deferred script runs at readyState 'interactive', so "not loading" never
     meant "every module has mounted" — it meant this one is first. It read the
     project list while programme.js had yet to add its Sessions, Forms and
     Responses columns, so the toolbar kept a four-column map of a seven-column
     table: Filter offered Archived's dates under Sessions, and the three new
     columns could not be sorted at all. DOMContentLoaded is after every
     deferred module, which is what the ordering wanted all along. */
  if (document.readyState === 'complete') start();
  else document.addEventListener('DOMContentLoaded', start);
})();

/* ============================ help popovers ============================
   Every screen and most cards opened with a line of prose explaining what
   they were. Twenty-odd of those is a row of layout gone on every page, and
   it read as filler. The words are worth keeping, so they moved behind the
   mark that asks for them: hover it, focus it, or click it.

   One popover, appended to the body, so a card with overflow:hidden cannot
   clip it. */
(function () {
  'use strict';
  var tip = null, owner = null;

  function el() {
    if (tip) return tip;
    tip = document.createElement('div');
    tip.className = 'tip';
    tip.id = 'tip-live';
    tip.setAttribute('role', 'tooltip');
    tip.hidden = true;
    document.body.appendChild(tip);
    return tip;
  }

  function hide() {
    if (!owner) return;
    if (owner.hasAttribute('aria-expanded')) owner.setAttribute('aria-expanded', 'false');
    owner.removeAttribute('aria-describedby');
    owner = null;
    el().hidden = true;
  }

  function own(el) { return (el.textContent || '').replace(/\s+/g, ' ').trim(); }

  function show(btn) {
    var text = btn.getAttribute('data-tip') || own(btn);
    if (!text) return;
    var t = el();
    hide();
    t.textContent = text;
    t.hidden = false;
    var r = btn.getBoundingClientRect();
    var w = t.offsetWidth, h = t.offsetHeight;
    var pad = 16, vw = document.documentElement.clientWidth;
    var left = Math.min(Math.max(pad, r.left - 4), vw - w - pad);
    /* below the mark, unless that would run off the bottom of the window */
    var below = r.bottom + 6;
    var top = (below + h > window.innerHeight - pad) ? r.top - h - 6 : below;
    t.style.left = (left + window.scrollX) + 'px';
    t.style.top = (top + window.scrollY) + 'px';
    owner = btn;
    /* A chip showing its own name adds nothing a screen reader has not already
       read out, so it is shown but not announced twice. */
    if (text !== own(btn)) {
      btn.setAttribute('aria-expanded', 'true');
      btn.setAttribute('aria-describedby', t.id);
    }
  }

  function mark(e) {
    if (!e.target || !e.target.closest) return null;
    var tip = e.target.closest('[data-tip]');
    if (tip) return tip;
    /* A chip too narrow for its own name is a name nobody can read. Rather
       than writing every name into the app twice, the chip that is cut off
       offers itself: hover or focus it and it says what it says. */
    var chip = e.target.closest('.rel');
    if (chip && chip.scrollWidth > chip.clientWidth + 1) return chip;
    return null;
  }

  document.addEventListener('mouseover', function (e) {
    var b = mark(e);
    if (b && b !== owner) show(b);
    else if (!b && owner && !owner.matches(':focus')) hide();
  });
  document.addEventListener('focusin', function (e) {
    var b = mark(e);
    if (b) show(b); else hide();
  });
  document.addEventListener('click', function (e) {
    var b = mark(e);
    if (!b) { hide(); return; }
    /* The info mark is only there to be asked, so a click on it is the
       question and nothing else. Anything else carrying a tip — a column
       head, an abbreviation — still does its own job when clicked. */
    if (!b.classList.contains('ihelp')) { hide(); return; }
    e.preventDefault();
    e.stopPropagation();
    if (b === owner) hide(); else show(b);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') hide(); });
  window.addEventListener('scroll', hide, true);
  window.addEventListener('resize', hide);
})();

/* ==================== table name cells and bare numbers ====================
   Two things the tables were getting wrong.

   A column headed Cohort held "1". On its own that is not a name, it is a
   digit, and in a row of other digits it reads as a measurement. It says
   "Cohort 1" now, which is what people call it.

   And the first cell of a table is the thing itself, so it gets the mark for
   what kind of thing it is — the system's HubNameCell is a 16px icon, 8 from
   a 14/16 500 name. The mark is decorative: filtering and sorting read the
   cell's text, which has not changed. */
(function () {
  'use strict';

  var KIND = {
    's-households': 'i-households', 's-household': 'i-visits', 's-visits': 'i-visits',
    's-safeguarding': 'i-safeguarding', 's-people': 'i-admin', 's-places': 'i-location',
    's-reports': 'i-reports', 's-programme': 'i-programme', 's-project': 'i-programme',
    's-module': 'i-reports', 's-cohorts': 'i-visits', 's-translations': 'i-message',
    's-followups': 'i-clock', 's-community': 'i-message', 's-izu': 'i-admin',
    's-field': 'i-admin', 's-roles': 'i-admin', 's-content': 'i-support'
  };

  /* Only columns whose heading names a thing. "Minutes" and "Likes" are
     quantities and are left alone. */
  var NAMES_A_THING = { cohort: 'Cohort' };

  function decorate(table) {
    var screen = table.closest('.screen');
    var icon = screen && KIND[screen.id];
    var heads = Array.prototype.map.call(table.querySelectorAll('thead th'),
      function (h) { return h.textContent.trim().toLowerCase(); });

    Array.prototype.forEach.call(table.querySelectorAll('tbody tr'), function (tr) {
      Array.prototype.forEach.call(tr.children, function (td, i) {
        var word = NAMES_A_THING[heads[i]];
        if (word && /^\d{1,3}$/.test(td.textContent.trim())) {
          td.textContent = word + ' ' + td.textContent.trim();
        }
      });
      var first = tr.children[0];
      if (!icon || !first || first.querySelector('svg') || !first.textContent.trim()) return;
      var mark = document.createElement('span');
      mark.className = 'cellmark';
      mark.setAttribute('aria-hidden', 'true');
      mark.innerHTML = '<svg><use href="#' + icon + '"/></svg>';
      first.insertBefore(mark, first.firstChild);
      first.classList.add('hasmark');
    });
  }

  function init() {
    Array.prototype.forEach.call(document.querySelectorAll('table.tbl'), function (t) {
      if (t.dataset.celled) return;
      t.dataset.celled = '1';
      try { decorate(t); } catch (e) { /* one odd table must not stop the rest */ }
    });
  }

  /* Same one-shot problem as the query bar above: tables mounted by a module
     after load were never decorated. */
  function watch() {
    new MutationObserver(function (recs) {
      for (var i = 0; i < recs.length; i++) {
        var added = recs[i].addedNodes;
        for (var j = 0; j < added.length; j++) {
          var n = added[j];
          if (n.nodeType !== 1) continue;
          if (n.matches('table.tbl') || n.querySelector('table.tbl')) return init();
        }
      }
    }).observe(document.body, { childList: true, subtree: true });
  }
  function start() { init(); watch(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
