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
    person:       { crumbs: [['People', 'people'], ['C. Uwimana', null]],                 nav: 'people' },
    permissions:  { crumbs: [['Roles & access', null]],                                   nav: 'permissions' },
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
            '<p style="font-size:13px;color:var(--ink-2);line-height:1.6">This reschedules 994 households in Cohort 2. Cohort 1 is past session 6, so only its remaining sessions move.</p>',
      done: 'Interval changed — 994 households rescheduled'
    },
    setroh: {
      title: 'Change the review window',
      ok: 'Change it',
      body: '<div><label for="f-sr">A supervisor review is due within</label><select id="f-sr"><option>72 hours</option><option>48 hours</option><option>24 hours</option></select></div>' +
            '<p style="font-size:13px;color:var(--ink-2);line-height:1.6">Two cases are open and both are already past 72 hours. Shortening the window does not reopen closed cases, but it will mark more of them late.</p>',
      done: 'Review window changed'
    },
    cleanup: {
      title: 'Clean up training data',
      ok: 'Upload and preview',
      body: '<p style="font-size:14px;color:var(--ink-2);line-height:1.6">Upload a CSV of the accounts used in training. Nothing is removed until you have seen the preview and confirmed it.</p>' +
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
            '<p style="font-size:13px;color:var(--ink-2)">Changing it signs you out everywhere except here.</p>',
      done: 'Password changed — other devices have been signed out'
    },
    signoutall: {
      title: 'Sign out everywhere else',
      ok: 'Sign out everywhere else',
      body: '<p style="font-size:14px;color:var(--ink-2);line-height:1.6">Two other devices are signed in as you: a tablet in Ngoma and a browser in Kigali. Both will be signed out. This browser stays signed in.</p>',
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
    qadd: {
      title: 'Add a question',
      ok: 'Add it',
      body: '<div><label for="f-at">Answer type</label><select id="f-at"><option>Yes / No</option><option>Single choice</option><option>Multi-select</option><option>Checklist</option><option>Number</option><option>Date</option><option>Short text</option><option>Long text</option></select></div>' +
            '<div><label for="f-ae">Question, in English</label><input id="f-ae" type="text" placeholder="e.g. Did the caregiver attend the growth check?"></div>' +
            '<div><label for="f-ak">Question, in Kinyarwanda</label><input id="f-ak" type="text" placeholder="Leave empty and it shows on the Translate tab"></div>' +
            '<div><label for="f-ap">Position</label><select id="f-ap"><option>At the end, question 31</option><option>After question 5</option><option>After question 12</option></select></div>' +
            '<p class="mhint">Adding a question does not change the 986 responses already collected. They read as unanswered for the new question.</p>',
      done: 'Question added as number 31 \u2014 publish the form to send it to the tablet'
    },
    cmanage: {
      title: 'Manage Cohort 1',
      ok: 'Save the cohort',
      body: '<div><label for="f-ml">Label</label><input id="f-ml" type="text" value="Cohort 1"></div>' +
            '<div><label for="f-md">Districts</label><select id="f-md"><option>All five districts</option><option>Kirehe, Musanze, Ngoma</option><option>Nyanza, Rubavu</option></select></div>' +
            '<div><label for="f-mf">First session falls on</label><input id="f-mf" type="date" value="2026-01-12"></div>' +
            '<div><label for="f-ms">Status</label><select id="f-ms"><option>Active</option><option>Paused</option><option>Closed</option></select></div>' +
            '<div class="impact"><b>What this moves</b>' +
            '<p>1\u202F216 households are on Cohort 1, and 1\u202F104 of them have sessions still to come. ' +
            'Moving the first session moves every one of those, including 148 already behind schedule.</p>' +
            '<p>Sessions already delivered are not touched. Pausing the cohort stops new visits being scheduled ' +
            'but leaves the ones already on a visitor\u2019s list for this week.</p></div>',
      done: 'Cohort 1 saved \u2014 1\u202F104 households rescheduled'
    },
    publish: {
      title: 'Publish to the field',
      ok: 'Publish',
      body: '<div><label for="f-pw">What</label><select id="f-pw"><option>A video</option><option>A document</option><option>An FAQ answer</option></select></div>' +
            '<div><label for="f-pt">Title</label><input id="f-pt" type="text" placeholder="e.g. Recognising signs of harm"></div>' +
            '<div><label for="f-pf">File</label><input id="f-pf" type="file"></div>' +
            '<p class="mhint">MP4 or PDF, up to 200 MB. A video is re-encoded for the tablet, which takes a few minutes after you publish.</p>' +
            '<div><label for="f-pd">Folder</label><select id="f-pd"><option>Using the tablet</option><option>Safeguarding</option><option>Session guidance</option><option>Forms and reporting</option><option>New folder\u2026</option></select></div>' +
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
      body: '<p>It is removed from every tablet at the next sync. Anyone part-way through watching it loses their place.</p>' +
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
            '<p style="font-size:13px;color:var(--ink-3);margin:0;max-width:52ch">The position decides what they can do. The place decides whose records they can do it to. Leave a level unset to cover everything under the one above it.</p>',
      done: 'Access changed \u2014 it takes effect the next time they sign in'
    },
    exception: {
      title: 'Add an exception',
      ok: 'Grant exception',
      body: '<div><label for="f-xw">The one thing they get</label><select id="f-xw"><option>Change \u2014 Programme</option><option>Add \u2014 Programme</option><option>Change \u2014 Reports</option><option>Archive \u2014 Reports</option><option>See \u2014 People &amp; access</option><option>See \u2014 Maintenance</option><option>Change \u2014 Maintenance</option><option>Archive \u2014 Households</option><option>Change \u2014 Field support</option></select></div>' +
            '<div><label for="f-xu">Until</label><input id="f-xu" type="date" value="2026-12-31"></div>' +
            '<div><label for="f-xr">Why</label><textarea id="f-xr" placeholder="Required. This is what an auditor reads."></textarea></div>' +
            '<p style="font-size:13px;color:var(--ink-3);margin:0;max-width:52ch">One person, one thing, with an end date. The list holds only what their position does not already give them. If a second person needs the same thing, it belongs on the position \u2014 or on a rung above it.</p>',
      done: 'Exception granted \u2014 it appears on the record and expires on its own'
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
    posadd: {
      title: 'Give a position to someone',
      ok: 'Give it to them',
      body: '<div><label for="f-pap">Person</label><select id="f-pap"><option>M. Dusabe</option><option>J. Mukamana</option><option>A. Gahimana</option><option>C. Uwimana</option></select></div>'
          + '<div><label for="f-papl">Where they work</label><select id="f-papl"><option>Kibungo \u00b7 Ngoma</option><option>Jarama \u00b7 Ngoma</option><option>Sake \u00b7 Ngoma</option><option>Kigoma \u00b7 Nyanza</option></select></div>'
          + '<p class="m-lead">The position decides what they can do. The place decides whose records they can do it to \u2014 which is why it is set here, on the assignment, and not on the position.</p>'
          + '<p class="m-note"><svg aria-hidden="true"><use href="#i-alert"/></svg><span>A position replaces whatever position they hold now. Roles they hold are left alone \u2014 those add on top of whichever position someone has.</span></p>',
      done: 'Position given \u2014 it takes effect the next time they sign in'
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
    roleperm: {
      title: 'Add a permission to Form translator',
      ok: 'Add it',
      body: '<div><label for="f-rp">Permission</label><select id="f-rp"><option>language-create \u2014 Add a language</option><option>question-list \u2014 See the questions on a form</option><option>form-edit \u2014 Change a form that already exists</option><option>construct-list \u2014 See what a form measures</option></select></div>'
          + '<p class="m-lead">Six people hold this role. Adding here gives it to all six, whatever position each of them has.</p>',
      done: 'Added \u2014 all 6 holders have it from their next sign-in'
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
          + '<div><label for="f-rb">Starts from</label><select id="f-rb"><option>IZU at Village \u2014 26 of 112</option><option>Sugira Muryango Sector lead (SLA) \u2014 44 of 112</option><option>National NCDA Government Official \u2014 5 of 112</option><option>District NCDA Child protection and Welfare Officer (CPWO) \u2014 7 of 112</option><option>IZU Cell Coordinator (ICC) \u2014 20 of 112</option><option>Sugira Muryango District lead (DTL) \u2014 29 of 112</option><option>HQ officer \u2014 88 of 112</option><option>Nothing \u2014 build from zero</option></select></div>'
          + '<div><label for="f-rp">Programme</label><select id="f-rp"><option>All projects</option><option>Selected projects</option></select></div>'
          + '<p class="m-lead">It starts with everything that position has, and you add to it on the card. It cannot take anything away \u2014 something that needs less than its rung is a rung of its own.</p>'
          + '<p class="m-note"><svg aria-hidden="true"><use href="#i-alert"/></svg><span>Eight positions exist for ten jobs. If this one would be an existing position plus one thing for one person, that belongs on their record as an exception \u2014 doing it here is how the live system came to carry twenty-one roles, three of them called Test role.</span></p>'
          + '<p class="m-lead">Which sector or district someone covers is set when the position is given to them, not here. The same position runs in every sector.</p>',
      done: 'Position created \u2014 it already has everything the one it starts from has'
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

  function openModal(key) {
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
    var state = { sort: null, facets: {}, find: {}, openCol: null };

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
    if (fRow && fRow.classList.contains('filters')) {
      bar.className = 'tq tq-in';
      fRow.appendChild(bar);
    } else {
      host.parentNode.insertBefore(bar, host);
    }

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
      /* One popover at a time, across every table. A screen can carry four
         toolbars, and each only ever shut its own pair, so two column pickers
         could stand open at once over different tables. */
      Array.prototype.forEach.call(document.querySelectorAll('.qpop'), function (p) {
        if (p !== pop) p.hidden = true;
      });
      Array.prototype.forEach.call(document.querySelectorAll('.tq-btn[aria-expanded="true"]'), function (b) {
        if (b !== btn) b.setAttribute('aria-expanded', 'false');
      });
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

    /* ---- filters ----

       Deliberately not a query builder. ClickUp's field / operator / value
       rows with an And / Or match were the wrong shape for this data: nobody
       reading a visit register wants to say "Outcome is not empty". They want
       to say Kirehe, not completed, Module 5 — so the popover lists the
       table's own columns, and each column its own values with a count of
       what is left if you pick it. Within a column the values are
       alternatives, across columns they narrow together, and there is no
       operator to learn. A column with too many values to list takes a search
       box instead, and a number column a from / to pair. */
    /* A column is worth listing as values only when those values repeat —
       eight households across eight rows is not a facet, it is the table
       again. "Module 5" and "31 Oct" both parse as numbers, so numeric is
       asked last, and only once a column is too varied to list. */
    function chosen(c) {
      return (state.facets[c.i] || []).length;
    }
    function summary(c) {
      var sel = state.facets[c.i] || [];
      if (!sel.length) return '';
      return sel.length === 1 ? sel[0] : sel.length + ' chosen';
    }
    function activeCount() {
      var n = 0;
      cols.forEach(function (c) { if (chosen(c)) n++; });
      return n;
    }

    function drawFilters() {
      fPop.innerHTML = '';
      var head = document.createElement('div');
      head.className = 'qpop-h';
      head.innerHTML = '<h4>Filters</h4>';
      var clear = document.createElement('button');
      clear.type = 'button';
      clear.className = 'qclear';
      clear.textContent = 'Clear all';
      clear.hidden = !activeCount();
      clear.onclick = function (e) {
        e.stopPropagation();
        state.facets = {}; state.find = {};
        drawFilters(); apply();
      };
      var x = document.createElement('button');
      x.type = 'button';
      x.className = 'x';
      x.setAttribute('aria-label', 'Close');
      x.innerHTML = ICON.x;
      x.onclick = shut;
      head.appendChild(clear);
      head.appendChild(x);
      fPop.appendChild(head);

      var list = document.createElement('div');
      list.className = 'qfacets';
      fPop.appendChild(list);

      cols.forEach(function (c) {
        if (c.options.length < 2) return;
        var open = chosen(c) > 0 || c.i === state.openCol;

        var sec = document.createElement('section');
        sec.className = 'qf';
        var h = document.createElement('button');
        h.type = 'button';
        h.className = 'qf-h';
        h.setAttribute('aria-expanded', String(open));
        h.innerHTML = '<span class="qf-n"></span><span class="qf-s"></span>' +
          '<svg class="qf-cv" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6" ' +
          'stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        h.querySelector('.qf-n').textContent = c.label;
        h.querySelector('.qf-s').textContent = summary(c);
        h.onclick = function (e) { e.stopPropagation(); state.openCol = open ? null : c.i; drawFilters(); };
        sec.appendChild(h);

        var bd = document.createElement('div');
        bd.className = 'qf-b';
        bd.hidden = !open;

        function refresh() {
          h.querySelector('.qf-s').textContent = summary(c);
          clear.hidden = !activeCount();
        }

        var sel = state.facets[c.i] || [];
        var find = (state.find[c.i] || '').trim().toLowerCase();

        /* A long list gets a box to find a value in it. That is still
           picking: the box narrows which of the real values are shown, it is
           never itself the thing filtered on, so a typo can only fail to find
           something rather than quietly empty the table. */
        if (c.options.length > 10) {
          var fx = document.createElement('input');
          fx.type = 'text';
          fx.className = 'qf-q';
          fx.placeholder = 'Find in ' + c.label.toLowerCase() + '\u2026';
          fx.setAttribute('aria-label', 'Find a value in ' + c.label);
          fx.value = state.find[c.i] || '';
          fx.oninput = function (e) {
            e.stopPropagation();
            state.find[c.i] = this.value;
            var q = this.value.trim().toLowerCase();
            bd.querySelectorAll('.qf-v').forEach(function (n) {
              n.hidden = !!q && n.querySelector('.qf-t').textContent.toLowerCase().indexOf(q) < 0;
            });
          };
          bd.appendChild(fx);
        }

        c.options.forEach(function (v) {
          var left = 0;
          rows.forEach(function (r) {
            if (cellText(r.cells[c.i]) === v && passes(r, c.i)) left++;
          });
          var b = document.createElement('button');
          b.type = 'button';
          b.className = 'qf-v' + (sel.indexOf(v) >= 0 ? ' on' : '') + (left ? '' : ' none');
          b.hidden = !!find && v.toLowerCase().indexOf(find) < 0;
          b.innerHTML = '<span class="bx">' + ICON.tick + '</span><span class="qf-t"></span><em></em>';
          b.querySelector('.qf-t').textContent = v;
          b.querySelector('em').textContent = left;
          b.onclick = function (e) {
            e.stopPropagation();
            var cur = state.facets[c.i] || [];
            var at = cur.indexOf(v);
            if (at >= 0) cur.splice(at, 1); else cur.push(v);
            state.facets[c.i] = cur;
            state.openCol = c.i;
            drawFilters(); apply();
          };
          bd.appendChild(b);
        });
        sec.appendChild(bd);
        list.appendChild(sec);
      });
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
    function passes(row, skip) {
      for (var n = 0; n < cols.length; n++) {
        var c = cols[n];
        if (c.i === skip) continue;
        var sel = state.facets[c.i];
        if (sel && sel.length && sel.indexOf(cellText(row.cells[c.i])) < 0) return false;
      }
      return true;
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
      var active = activeCount();
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
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
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
    owner.setAttribute('aria-expanded', 'false');
    owner.removeAttribute('aria-describedby');
    owner = null;
    el().hidden = true;
  }

  function show(btn) {
    var text = btn.getAttribute('data-tip');
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
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-describedby', t.id);
  }

  function mark(e) {
    return e.target && e.target.closest ? e.target.closest('[data-tip]') : null;
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
