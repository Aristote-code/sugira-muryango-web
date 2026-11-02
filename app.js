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
    wall:         { crumbs: [['Reports', 'reports'], ['Wall board', null]],               nav: 'wall' },
    empty:        { crumbs: [['Not designed yet', null]],                                 nav: null },

    programme:    { crumbs: [['Programme', null]],                                        nav: 'programme' },
    project:      { crumbs: [['Programme', 'programme'], ['SUGIRA Muryango \u2014 core', null]],
                    nav: 'programme' },
    module:       { crumbs: [['Programme', 'programme'], ['SUGIRA Muryango \u2014 core', 'project'],
                             ['Play and communication', null]], nav: 'programme' },
    form:         { crumbs: [['Programme', 'programme'], ['SUGIRA Muryango \u2014 core', 'project'],
                             ['Play and communication', 'module'], ['Visit record', null]], nav: 'programme' },
    cohorts:      { crumbs: [['Programme', 'programme'], ['Cohorts', null]],              nav: 'cohorts' },
    translations: { crumbs: [['Programme', 'programme'], ['Translations', null]],         nav: 'translations' }
  };

  var MODALS = {
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
      body: '<div><label for="f-mod">Module</label><select id="f-mod"><option>7 — Problem solving</option><option>8 — Family conflict</option></select></div>' +
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
            '<div><label for="f-vill">Village</label><select id="f-vill"><option>Rango — Tumba — Huye</option><option>Cyarwa — Tumba — Huye</option><option>Mpare — Mbazi — Huye</option></select></div>' +
            '<div><label for="f-coh">Cohort</label><select id="f-coh"><option>Cohort 4</option><option>Cohort 5 (not yet started)</option></select></div>',
      done: 'Household enrolled in Cohort 4'
    },
    project: {
      title: 'New project',
      ok: 'Create project',
      body: '<div><label for="f-pn">Project name</label><input id="f-pn" type="text" placeholder="e.g. Male engagement booster"></div>' +
            '<div><label for="f-pm">Start from</label><select id="f-pm"><option>An empty project</option><option>A copy of SUGIRA Muryango \u2014 core</option></select></div>',
      done: 'Project created'
    },
    module: {
      title: 'Add a session',
      ok: 'Add session',
      body: '<div><label for="f-mn">Session name</label><input id="f-mn" type="text" placeholder="e.g. Problem solving"></div>' +
            '<div><label for="f-mo">Position in the sequence</label><select id="f-mo"><option>After session 9</option><option>At the end</option><option>As a booster, outside the sequence</option></select></div>',
      done: 'Session added \u2014 it is not on the mobile app until you publish'
    },
    form: {
      title: 'New form',
      ok: 'Create form',
      body: '<div><label for="f-fn">Form name</label><input id="f-fn" type="text" placeholder="e.g. Caregiver observation"></div>' +
            '<div><label for="f-fw">Filled in by</label><select id="f-fw"><option>Home visitor</option><option>Sector supervisor</option><option>IZU cell coordinator</option></select></div>' +
            '<p style="font-size:.82rem;color:var(--ink-3);margin:0">Created in this session, not imported from a global library.</p>',
      done: 'Form created in Session 6'
    },
    cohort: {
      title: 'New cohort',
      ok: 'Create cohort',
      body: '<div><label for="f-cn">Cohort name</label><input id="f-cn" type="text" placeholder="e.g. Cohort 5"></div>' +
            '<div><label for="f-cd">Districts</label><select id="f-cd"><option>Not assigned yet</option><option>Huye</option><option>Gisagara</option><option>Nyamagabe</option></select></div>' +
            '<div><label for="f-cs">First session</label><input id="f-cs" type="date" value="2027-01-11"></div>',
      done: 'Cohort created as a draft \u2014 no household is scheduled yet'
    },
    report: {
      title: 'Build a report',
      ok: 'Run report',
      body: '<div><label for="f-q">Question</label><select id="f-q"><option>Male caregiver attendance</option><option>Risk of harm by type</option><option>Household needs</option><option>Visits per module</option><option>Average minutes per module</option></select></div>' +
            '<div><label for="f-sc">Scope</label><select id="f-sc"><option>All of Rwanda</option><option>Southern province</option><option>Huye district</option></select></div>' +
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
    $$('.ni, .si').forEach(function (b) { b.classList.remove('on'); });
    if (!key) return;
    var hit = $$('[data-go="' + key + '"]').filter(function (b) {
      return b.classList.contains('ni') || b.classList.contains('si');
    })[0];
    if (!hit) return;
    hit.classList.add('on');
    if (hit.classList.contains('si')) {
      var list = hit.closest('.subs');
      if (list && list.hidden) {
        list.hidden = false;
        var owner = $('[aria-controls="' + list.id + '"]');
        if (owner) owner.setAttribute('aria-expanded', 'true');
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

  function go(key) {
    var def = SCREENS[key];
    if (!def) return;
    var next = document.getElementById('s-' + key);
    if (!next) return;
    $$('.screen').forEach(function (s) { s.classList.remove('live'); });
    next.classList.add('live');
    setCrumbs(def.crumbs);
    setNav(def.nav);
    var tabbed = next.querySelector('.tab[data-panel]');
    if (tabbed) {
      $$('.tab[data-panel]', next).forEach(function (t, i) { t.classList.toggle('on', i === 0); });
      var first = tabbed.getAttribute('data-panel');
      $$('[data-panelid]', next).forEach(function (x) {
        x.hidden = x.getAttribute('data-panelid') !== first;
      });
    }
    current = key;
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
    if (t) { go(t.getAttribute('data-go')); return; }
    var toast = e.target.closest('[data-toast]');
    if (toast) { say(toast.getAttribute('data-toast')); return; }
    var m = e.target.closest('[data-modal]');
    if (m) { openModal(m.getAttribute('data-modal')); }
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
    if (first) first.focus();
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
    tr.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); go(tr.getAttribute('data-go')); }
    });
  });

  // ---- open on the screen named in the hash ----
  var start = (location.hash || '').slice(1);
  go(SCREENS[start] ? start : 'dashboard');
})();
