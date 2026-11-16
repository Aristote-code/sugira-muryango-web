/* The programme, with what is under it showing.

   The audit's own words, on the live system: "Reachable only by drilling
   Projects → project → module → forms → Data. Nothing in the navigation names
   any of it" (section 3, the hidden survey layer). We had reproduced the
   drilling faithfully and never built the two screens that make it navigable:

     screen 11  a flat global list of every module, with no project column
     screen 12  the global form library, English and Kinyarwanda interleaved
                as separate links

   So a form could be reached only by knowing which project and which session
   it sat in, which is the one thing someone looking for a form does not know.

   This file is one source for both: a project row on Programme opens to show
   its sessions and the forms each one carries, and the Forms tab is every form
   in the programme with the project and sessions it belongs to on the row. No
   count below is typed twice — a project's figures are the sum of its forms. */
(function () {
  'use strict';

  /* A Kinyarwanda name is written below only where the app already carries it.
     Five forms have one. The rest genuinely do not, which is what Translations
     is for, so the cell says so and opens that screen rather than showing a
     name nobody wrote. Inventing Kinyarwanda for a Rwandan programme would be
     worse than leaving the gap visible — the gap is the finding.

     The library is 34 forms because Translations already says "of 34". */
  var SESSIONS = ['Welcome module', '1.Family Narrative',
    '2.The Importance of Early Stimulation & Play', '3.Building Early Communication Skills',
    '4.The Importance of Good Hygiene', '5.The Importance of Good Nutrition',
    '6.The Importance of Good Health', '7.Managing the Stresses of Parenting and Family Life',
    '8.Resolving Conflicts in the Home',
    '9.The Important Role that Everyone Plays in Raising a Baby Well',
    '10.Good Parenting is Better than Being Born Well',
    '11.Making the Home a Place Where a Baby’s Brain Can Grow',
    '12.With a United Family, Anything is Possible',
    'Closing module', '3-Month Booster Module', '6-Month Booster Module',
    '12-Month Booster Module'];

  /* The twelve numbered ones. A form that goes on every module goes on the
     curriculum, not on the welcome, the closing or a booster. */
  var EVERY_SESSION = SESSIONS.slice(1, 13);

  /* The four sessions a supervisor sits in on. The old Monitoring forms tab
     listed these as modules of their own, with the same names as the sessions
     they shadow — the programme written out twice so that supervisors had
     somewhere to hang two forms. */
  var MONITORED = ['Welcome module', '1.Family Narrative',
    '4.The Importance of Good Hygiene', '6.The Importance of Good Health'];

  /* project, tab tag, flag, its sessions, and its forms —
     each form: name, Kinyarwanda, questions, responses, status, sessions used in.

     Every name here is one the app already shows somewhere: the project Forms
     panel, the Session 6 module, the Translations table or the archive. A form
     that nothing in the app names is not in this list. */
  var P = [
    ['Household Module Tracking', 'tablet', null, SESSIONS, [
      ['Family Enrollment and Composition Form', 'Ifishi yo kubarura Abagize Urugo', 24, 2210, 'Active', ['Welcome module'], 'IZU at Village'],
      ['Anthropometric measurement', 'Gupima imikurire y’abana', 9, 1884, 'Active', ['Welcome module', '6.The Importance of Good Health'], 'IZU at Village'],
      ['Flash weekly report on every module', 'Raporo yihuse ya buri kiganiro', 11, 986, 'Active', EVERY_SESSION, 'IZU at Village'],
      ['General Questions-Self report', 'Ibibazo Rusange ku biganiro byose', 18, 412, 'Active', EVERY_SESSION, 'IZU Cell Coordinator'],
      ['Family-Specific Competencies-Self-report', 'Ibibazo ku bushobozi bwo gutanga ikiganiro', 16, 388, 'Active', EVERY_SESSION, 'IZU Cell Coordinator'],
      ['Household Module Tracking Form', 'Inyandiko y’uruzinduko', 30, 1842, 'Active', EVERY_SESSION, 'IZU at Village'],
      ['Caregiver observation', 'Igenzura ry’umurezi', 12, 986, 'Active', ['6.The Importance of Good Health'], 'IZU at Village'],
      ['Supervisor spot-check', 'Igenzura rya superviseri', 8, 141, 'Active', ['6.The Importance of Good Health'], 'Sector lead (SLA)'],
      ['Managing the Stresses of Parenting form', '', 34, 0, 'Draft', ['7.Managing the Stresses of Parenting and Family Life'], 'IZU at Village'],
      ['Resolving Conflicts in the Home form', '', 41, 0, 'Draft', ['8.Resolving Conflicts in the Home'], 'IZU at Village'],
      /* The two that used to hang off the parallel monitoring tree. They are
         imported into the four sessions that are monitored, like any other
         form, and the column that says who fills them in is what makes them
         monitoring forms. */
      ['Module in action', 'Ikiganiro mu bikorwa', 22, 412, 'Active', MONITORED, 'IZU Cell Coordinator'],
      ['IZU quality score', 'Amanota y’ubuziranenge bwa IZU', 16, 344, 'Active', MONITORED, 'IZU Cell Coordinator'],
      ['Household Module Tracking Form — version 2', '', 30, 412, 'Archived', ['6.The Importance of Good Health'], 'IZU at Village'],
      ['Growth check (pilot)', '', 9, 96, 'Archived', ['6.The Importance of Good Health'], 'IZU at Village']
    ]],
    ['Household Tracking Project', 'tablet', 'near-duplicate', ['Welcome module', '1.Family Narrative'], [
      ['Household Module Tracking Form — version 0', '', 30, 0, 'Archived', ['Welcome module'], 'IZU at Village'],
      ['Household Module Tracking Form — version 1', '', 30, 0, 'Archived', ['1.Family Narrative'], 'IZU at Village']
    ]],
    ['Household Enrollment', 'tablet', null, [], [
      ['Enrollment of Beneficiaries', '', 24, 2210, 'Active', [], 'IZU at Village'],
      ['Caregiver observation (pilot)', '', 12, 412, 'Archived', [], 'IZU at Village']
    ]],
    ['Risk of Harm/other family problems Management', 'tablet', null, [], [
      ['Risk of Harm management — intake', '', 28, 34, 'Active', [], 'IZU at Village'],
      ['Risk of Harm management — follow-up', '', 9, 61, 'Active', [], 'Sector lead (SLA)'],
      ['Household Referral Checklist', '', 12, 7, 'Active', [], 'IZU at Village']
    ]],
    ['FCG participation and interaction form', 'tablet', null, [], [
      ['FCG participation and interaction', '', 14, 1204, 'Active', [], 'IZU at Village']
    ]],
    ['Play Collaborative Meetings', 'tablet', null, [], [
      ['Play module attendance', '', 10, 876, 'Active', [], 'IZU at Village'],
      ['Sector supervision in action', '', 19, 212, 'Active', [], 'IZU Sector Coordinator']
    ]],
    ['IZU at Village Demographics', 'tablet', null, [], [
      ['IZU at Village demographics', '', 19, 193, 'Active', [], 'IZU at Village']
    ]],
    ['IZU Cell Coordinator Demographics', 'tablet', null, [], [
      ['IZU Cell Coordinator demographics', '', 19, 63, 'Active', [], 'IZU Cell Coordinator']
    ]],
    ['IZU Cell Coordinator Telephone Supervision management', 'tablet', null, [], [
      ['IZU Telephone Supervision — weekly call', '', 52, 488, 'Active', [], 'IZU Cell Coordinator'],
      ['IZU Telephone Supervision — missed call', '', 11, 174, 'Active', [], 'IZU Cell Coordinator']
    ]],
    ['IZU Sector Coordinator Telephone Supervision', 'tablet', null, [], [
      ['Sector Telephone Supervision — weekly call', '', 52, 212, 'Active', [], 'IZU Sector Coordinator']
    ]],
    ['District Performance Evaluation of Sugira Muryango program', 'tablet', null, [], [
      ['District performance evaluation', '', 27, 20, 'Active', [], 'HQ officer']
    ]],
    ['IZU Sector Coordinator Demographics', 'notablet', null, [], [
      ['IZU Sector Coordinator demographics', '', 19, 19, 'Active', [], 'IZU Sector Coordinator']
    ]],
    ['SLA User Management', 'notablet', null, [], [
      ['Add a user', '', 11, 539, 'Active', [], 'Sector lead (SLA)'],
      ['Change what a user may do', '', 6, 212, 'Active', [], 'Sector lead (SLA)']
    ]],
    ['SM PROGRAM REPORTS BY SM STAFF', 'notablet', null, [], [
      ['Staff programme report', '', 23, 148, 'Active', [], 'HQ officer']
    ]],
    ['Women Economic Empowerment', 'notablet', null, [], [
      ['Enrollment of Beneficiaries in WEE', '', 26, 0, 'Archived', [], 'IZU at Village'],
      ['Gender Questionnaire Form', '', 18, 0, 'Draft', [], 'IZU at Village']
    ]],
    ['IZU Self-Efficacy', 'notablet', null, [], [
      ['IZU self-efficacy', '', 15, 193, 'Active', [], 'IZU at Village']
    ]],
    ['SM END OF WEEK REPORT', 'notablet', null, [], [
      ['End of week report', '', 12, 744, 'Active', [], 'Sector lead (SLA)']
    ]],
    ['Think Aloud testing without Module', 'notablet', 'test', [], [
      ['Think Aloud testing without Module', '', 5, 3, 'Archived', [], 'HQ officer']
    ]],
    ['Test Project', 'notablet', 'test', [], [
      ['Get Stakeholders', '', 2, 0, 'Archived', [], 'HQ officer']
    ]]
  ];

  /* ---- shape it ---- */

  var projects = P.map(function (p) {
    var forms = p[4].map(function (f) {
      return {
        name: f[0], rw: f[1], questions: f[2], responses: f[3],
        status: f[4], sessions: f[5], by: f[6], project: p[0],
        /* the app's own definition, from the permission that governs it:
           "the forms supervisors fill in rather than home visitors" */
        bySupervisor: f[6] !== 'IZU at Village'
      };
    });
    return {
      name: p[0], tags: p[1], flag: p[2], sessions: p[3], forms: forms,
      responses: forms.reduce(function (a, f) { return a + f.responses; }, 0),
      untranslated: forms.filter(function (f) { return !f.rw; }).length
    };
  });

  var library = projects.reduce(function (a, p) { return a.concat(p.forms); }, []);

  window.SUGIRA_PROGRAMME = { projects: projects, forms: library };

  /* ---- a project counts its own contents ----

     The project record stated how many sessions and forms it holds, and both
     numbers were typed. It said 14 sessions above a list of 17, and 34 forms
     — which is a programme-wide figure, not this project's — above a list of
     12. They are read from the same data the lists are drawn from now, so a
     session added to the programme cannot leave the record behind. */
  function projectCounts() {
    var slots = document.querySelectorAll('[data-proj-count]');
    if (!slots.length) return;
    var p = projects.filter(function (x) {
      return x.name === 'Household Module Tracking';
    })[0];
    if (!p) return;
    var use = {};
    projects.forEach(function (q) {
      (q.sessions || []).forEach(function (s) { (use[s] = use[s] || []).push(q.name); });
    });
    var shared = (p.sessions || []).filter(function (s) {
      return use[s] && use[s].length > 1;
    }).length;
    var ns = (p.sessions || []).length, nf = p.forms.length;
    var val = {
      modules: ns + (ns === 1 ? ' module' : ' modules'),
      shared: shared + ' shared with other projects',
      forms: nf + (nf === 1 ? ' form' : ' forms')
    };
    Array.prototype.forEach.call(slots, function (el) {
      var k = el.getAttribute('data-proj-count');
      if (val[k]) el.textContent = val[k];
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', projectCounts);
  } else {
    projectCounts();
  }
  document.addEventListener('drawer:render', function () {
    setTimeout(projectCounts, 0);
  });

  /* ---- bits ---- */

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }

  function icon(id, cls) {
    var s = el('span', cls);
    s.innerHTML = '<svg aria-hidden="true"><use href="#' + id + '"/></svg>';
    return s;
  }

  function chip(text, kind) {
    var c = el('span', 'chip' + (kind ? ' ' + kind : ''));
    c.appendChild(el('i'));
    c.appendChild(document.createTextNode(text));
    return c;
  }

  /* The rest of the app spells IZU, SLA and HQ out on hover rather than in the
     row. Built here rather than written into thirty-seven cells. */
  /* "6.The Importance of Good Health" is the module's stored name; everywhere
     else in the app it is Module 6. */
  function shortSession(name) {
    var m = /^(\d+)\./.exec(name);
    return m ? 'Module ' + m[1] : name;
  }

  /* A session carries the forms that name it. Said once, here, so the tree and
     the Forms column cannot disagree. */
  function formsOf(project, session) {
    return project.forms.filter(function (f) {
      return f.sessions.indexOf(session) !== -1 && f.status !== 'Archived';
    });
  }

  /* ---- the tree, under the project rows on Programme ---- */

  /* The step is the caret's width plus its gap — 16 + 8 — so a session begins
     exactly where its project's icon begins, and a form exactly where that
     session's icon begins. At 28 each level overshot its parent's icon by
     4px, which read as a second, slightly wrong column. */
  var INDENT = 24;
  /* Where each level's marker sits inside the name cell, measured rather
     than stepped: the project row carries a caret before its icon and its
     children carry a spacer, so the first two are not INDENT apart. */
  /* Measured from the pixels, not from the box model: the caret glyph a
     thread hangs from centres at 20 on a project row and steps by INDENT
     from there. The earlier numbers were taken before the name cell stopped
     being a flex container, which moved everything in it — the second-level
     thread sat 6px right of the caret it belongs to. */
  var LINES = [20, 44, 68, 92, 116];

  function kidRow(o) {
    var tr = el('tr', 'prow-kid');
    tr.setAttribute('data-depth', String(o.depth));

    var td = el('td', 'nm prow-n');
    var pad = el('span', 'prow-ind');
    pad.style.width = (o.depth * INDENT) + 'px';
    pad.setAttribute('aria-hidden', 'true');
    td.appendChild(pad);

    if (o.toggle) td.appendChild(o.toggle);
    else td.appendChild(el('span', 'prow-t-gap'));

    td.appendChild(icon(o.iconId, 'cellmark'));
    td.appendChild(document.createTextNode(o.name));
    if (o.context) td.appendChild(el('span', 'prow-ctx', o.context));
    tr.appendChild(td);

    /* Sessions, Forms, Responses — a dash where the number has no meaning at
       this level, which is how ClickUp leaves a cell a row does not fill. */
    [o.sessions, o.forms, o.responses].forEach(function (v) {
      tr.appendChild(el('td', 'num' + (v == null ? ' mut' : ''), v == null ? '—' : v));
    });
    tr.appendChild(el('td'));
    tr.appendChild(el('td'));
    tr.appendChild(el('td'));

    if (o.go) {
      tr.setAttribute('data-go', o.go);
      tr.classList.add('click');
    }
    return tr;
  }

  function caret(label) {
    var t = el('button', 'prow-t');
    t.type = 'button';
    t.setAttribute('aria-expanded', 'false');
    t.setAttribute('aria-label', label);
    t.innerHTML = '<svg aria-hidden="true"><use href="#i-caret"/></svg>';
    return t;
  }

  /* Hang `kids` under `tr`, and take them away again when it shuts. The rows
     a caret owns are its own, so a session closing cannot strip the forms of
     the session after it. */
  function thread(t, tr, make) {
    var kids = [];
    t.onclick = function (e) {
      e.stopPropagation();
      var open = t.getAttribute('aria-expanded') === 'true';
      t.setAttribute('aria-expanded', String(!open));
      tr.classList.toggle('is-open', !open);
      if (open) {
        kids.forEach(function (k) { k.remove(); });
        kids = [];
        redrawGuides(tr.parentNode);
        return;
      }
      kids = make();
      var at = tr;
      kids.forEach(function (k) {
        at.parentNode.insertBefore(k, at.nextSibling);
        at = k;
      });
      redrawGuides(tr.parentNode);
    };
  }

  /* The threads are a property of the whole table, not of one branch.
     Working them out over the rows a single open had just made was why the
     project's thread broke: when a session opened, its three form rows were
     all this branch knew about, so nothing in them was at the session's own
     depth and the level above was judged finished — the line stopped for
     three rows and picked up again underneath. Every row in the body, in the
     order they are in, is the only list that can answer it. */
  function redrawGuides(tbody) {
    if (!window.SugiraTree || !tbody) return;
    var rows = [].slice.call(tbody.rows);
    var depths = rows.map(function (r) {
      return r.classList.contains('prow-kid') ? +r.getAttribute('data-depth') : 0;
    });
    rows.forEach(function (r, i) {
      window.SugiraTree.guides(r.querySelector('.prow-n'), depths[i], LINES);
    });
  }

  function mountTree() {
    var table = document.querySelector('#s-programme [data-panelid="list"] .tbl');
    if (!table) return;
    var body = table.tBodies[0];
    if (!body) return;

    /* Sessions, Forms and Responses become columns. They were one line of
       text under the project name — "13 sessions · 12 forms · 8 749
       responses" — which pushed every row to 43px and left the three columns
       beside it empty. They are numbers about the row, so they belong in
       cells, where they also sort and line up. */
    var head = table.tHead && table.tHead.rows[0];
    if (head && head.cells.length === 4) {
      ['Modules', 'Forms', 'Responses'].forEach(function (t, n) {
        var th = el('th', 'num', t);
        head.insertBefore(th, head.cells[1 + n]);
      });
    }

    var rows = [].slice.call(body.rows).filter(function (r) {
      return !r.classList.contains('prow-kid');
    });

    rows.forEach(function (tr, i) {
      var p = projects[i];
      if (!p) return;
      var cell = tr.cells[0];
      if (!cell || cell.querySelector('.prow-t')) return;

      /* the caret goes before the name, and takes the click that used to open
         the project — Details on the same row still does that */
      var t = caret('What is in ' + p.name);
      cell.insertBefore(t, cell.firstChild);
      cell.classList.add('prow-n');

      [p.sessions.length || null, p.forms.length || null, fmt(p.responses)]
        .forEach(function (v, n) {
          var td = el('td', 'num' + (v == null ? ' mut' : ''), v == null ? '—' : v);
          tr.insertBefore(td, tr.cells[1 + n]);
        });

      thread(t, tr, function () { return build(p, tr); });
    });

    function build(p, tr) {
      var out = [];
      var tags = tr.getAttribute('data-tags') || '';

      /* A supervisor's form says so on the row. That is the whole of what the
         Monitoring forms tab was telling you, said where the form is. */
      function tag(r) { if (tags) r.setAttribute('data-tags', tags); return r; }
      function sumResp(list) {
        return list.reduce(function (a, f) { return a + Math.round(f.responses / Math.max(1, f.sessions.length)); }, 0);
      }
      function formRow(depth, f) {
        return tag(kidRow({
          depth: depth, iconId: 'i-reports', name: f.name,
          context: f.questions + ' questions' + (f.bySupervisor ? ' · ' + f.by : ''),
          sessions: null, forms: null, responses: fmt(f.responses), go: 'form'
        }));
      }

      /* A form every session carries is the project's, not any one session's.
         Listing it under all twelve was true and unreadable — thirty-six rows
         saying the same three things. It sits once, at the top. */
      var everywhere = p.forms.filter(function (f) {
        return f.sessions.length > 2 && f.sessions.length >= p.sessions.length - 1;
      });
      var loose = p.forms.filter(function (f) { return !f.sessions.length; });

      var own = everywhere.concat(loose);
      if (own.length) {
        if (p.sessions.length) {
          /* Its own caret, so the forms every session carries open and shut
             as a group instead of unrolling with the project. */
          var gT = caret('Forms carried by every module');
          var gTr = tag(kidRow({
            depth: 1, toggle: gT, iconId: 'i-reports', name: 'Carried by every module',
            sessions: null, forms: own.length, responses: fmt(sumResp(own))
          }));
          thread(gT, gTr, function () {
            return own.map(function (f) { return formRow(2, f); });
          });
          out.push(gTr);
        } else {
          own.forEach(function (f) { out.push(formRow(1, f)); });
        }
      }

      /* A session is a row that opens, the way a task opens its subtasks on
         ClickUp. Its forms used to come out flat beside it, so opening one
         project put thirty-odd rows on screen at once with nothing to shut. */
      p.sessions.forEach(function (s) {
        var fs = formsOf(p, s).filter(function (f) { return own.indexOf(f) === -1; });
        var sT = fs.length ? caret('Forms in ' + s) : null;
        var sTr = tag(kidRow({
          depth: 1, toggle: sT, iconId: 'i-programme', name: s,
          sessions: null, forms: fs.length || null,
          responses: fs.length ? fmt(sumResp(fs)) : null, go: 'module'
        }));
        if (sT) {
          thread(sT, sTr, function () {
            return fs.map(function (f) { return formRow(2, f); });
          });
        }
        out.push(sTr);
      });

      return out;
    }
  }

  /* ---- the Forms tab: every form, with where it comes from ---- */

  function mountList() {
    var host = document.getElementById('formLib');
    if (!host) return;

    var table = el('table', 'tbl');
    var head = el('thead');
    var hr = el('tr');
    /* Who filled a form in belongs to each response, on the data page, not
       to the form. */
    ['Form', 'Kinyarwanda', 'Project', 'Used in', 'Responses', 'Status']
      .forEach(function (h, i) {
        hr.appendChild(el('th', i === 4 ? 'num' : null, h));
      });
    head.appendChild(hr);
    table.appendChild(head);

    var body = el('tbody');
    library.forEach(function (f) {
      var tr = el('tr');
      tr.setAttribute('data-go', 'form');
      tr.setAttribute('data-tags', (f.rw ? 'translated' : 'untranslated')
        + ' ' + f.status.toLowerCase()
        + (f.bySupervisor ? ' supervisor' : ' visit'));

      tr.appendChild(el('td', 'nm', f.name));

      var rw = el('td');
      if (f.rw) rw.textContent = f.rw;
      else {
        var b = el('button', 'rel');
        b.type = 'button';
        b.setAttribute('data-go', 'translations');
        b.innerHTML = '<svg aria-hidden="true"><use href="#i-alert"/></svg>';
        b.appendChild(document.createTextNode('Not translated'));
        rw.appendChild(b);
      }
      tr.appendChild(rw);

      /* The relation chip is 136px wide in the design system and these project
         names run to sixty characters, so most of them end in an ellipsis. The
         whole name is on the tooltip rather than on a wider chip. */
      var pj = el('td');
      if (f.project) {
        var pb = el('button', 'rel');
        pb.type = 'button';
        pb.setAttribute('data-go', 'project');
        pb.setAttribute('data-tip', f.project);
        pb.innerHTML = '<svg aria-hidden="true"><use href="#i-programme"/></svg>';
        pb.appendChild(document.createTextNode(f.project));
        pj.appendChild(pb);
      } else {
        /* Made on the Forms page and not yet imported anywhere. */
        pj.className = 'mut';
        pj.textContent = 'Not in a project yet';
      }
      tr.appendChild(pj);

      /* "Module 6", not "6.The Importance of Good Health" — the rest of the
         app says Module 6, and the full title on the row pushed every other
         column off the card. It is on the tooltip. */
      var used = el('td', 'mut');
      used.textContent = !f.project ? '\u2014' : !f.sessions.length ? 'The whole project'
        : f.sessions.length === 1 ? shortSession(f.sessions[0])
          : f.sessions.length + ' modules';
      if (f.sessions.length > 1 || shortSession(f.sessions[0]) !== f.sessions[0]) {
        used.setAttribute('data-tip', f.sessions.join(' · '));
      }
      tr.appendChild(used);


      /* "I enter a module, I go to see forms of this module, I go into data of
         a specific form, to filter, to export… it's a very long flow." The
         count is the only thing on the row that is about the data, so it is
         the way into it: one click to this form's Data tab, where the filter
         and Export already live. A form nobody has answered has nothing to
         open. */
      var rc = el('td', 'num');
      if (f.responses) {
        var rb = el('button', 'rel');
        rb.type = 'button';
        rb.setAttribute('data-go', 'form');
        rb.setAttribute('data-view', 'tab:Data');
        rb.setAttribute('data-tip', 'Open these responses, where they can be filtered and exported');
        rb.textContent = fmt(f.responses);
        rc.appendChild(rb);
      } else rc.textContent = fmt(f.responses);
      tr.appendChild(rc);

      var st = el('td');
      st.appendChild(chip(f.status,
        f.status === 'Active' ? 'ok' : f.status === 'Draft' ? 'warn' : ''));
      tr.appendChild(st);

      body.appendChild(tr);
    });
    table.appendChild(body);

    var wrap = el('div', 'tblwrap');
    wrap.appendChild(table);
    host.appendChild(wrap);

    /* No translation figure here. Coverage is Translations' question and it
       counts strings, not names; two numbers about translation on two screens
       meaning two different things is how the live system got into trouble. */
    var foot = el('div', 'tfoot');
    var span = el('span');
    /* Counts, not a sentence about one of them. "the three that had a
       monitoring programme of their own are in here too, on the sessions
       they monitor" was a fact wrapped in an explanation; the fact is three
       and the explanation belongs on the info button. */
    span.innerHTML = library.length + ' forms across ' + projects.length
      + ' projects · ' + fmt(library.reduce(function (a, f) { return a + f.responses; }, 0))
      + ' responses';
    foot.appendChild(span);
    host.appendChild(foot);
  }

  /* the two places that announce how many forms there are read the library,
     so neither can drift from it */
  function mountCounts() {
    var by = function (st) { return library.filter(function (f) { return f.status === st; }).length; };
    var val = { formCount: library.length, formCountRail: library.length,
      formCountActive: by('Active'), formCountDraft: by('Draft'), formCountArchived: by('Archived') };
    Object.keys(val).forEach(function (id) {
      var n = document.getElementById(id);
      if (n) n.textContent = String(val[id]);
    });
  }

  function mount() { mountTree(); mountList(); mountCounts(); }

  /* A form created on the Forms page joins the library as a draft that no
     project carries yet, and the list is drawn again from the library so the
     new row is a row like any other: selectable, sortable, counted. */
  window.SugiraForms = {
    add: function (name, rw, questions, extra) {
      library.unshift({ name: name, rw: rw || '', questions: questions || 0, responses: 0, status: 'Draft',
        sessions: [], by: 'IZU at Village', project: '', bySupervisor: false,
        created: 'A. Gahimana · FXB Rwanda · 6 November 2026', edited: 'Today by A. Gahimana',
        strings: extra && extra.questions, rules: extra && extra.rules, required: extra && extra.required, access: extra && extra.access });
      redraw();
    }
  };

  /* ==================== the pages behind a row ====================
     A project, a module and a form each have one page, and the row clicked
     decides whose it is. Every figure on them is read from the lists above,
     so the module that a form says it is in is the module that lists it,
     and archiving, importing or removing a form changes every place that
     shows it. */

  /* Kinyarwanda names of the modules, as the project's Modules tab gives them. */
  var RW = {
    'Welcome module': 'Guhana ikaze', '1.Family Narrative': 'Amateka y’umuryango',
    '2.The Importance of Early Stimulation & Play': 'Akamaro ko gukangura ubwonko hakiri kare no gukina',
    '3.Building Early Communication Skills': 'Kubaka ubumenyi bwo kuvuga kakiri kare',
    '4.The Importance of Good Hygiene': 'Akamaro k’isuku n’isukura', '5.The Importance of Good Nutrition': 'Akamaro k’imirire myiza',
    '6.The Importance of Good Health': 'Akamaro k’ubuzima bwiza', '7.Managing the Stresses of Parenting and Family Life': 'Guhangana n’ imihangayiko yo kurera',
    '8.Resolving Conflicts in the Home': 'Gukemura amakimbirane mu rugo', '9.The Important Role that Everyone Plays in Raising a Baby Well': 'Akamaro buri wese agira mu kurera neza umwana',
    '10.Good Parenting is Better than Being Born Well': 'Uburere bwiza', '11.Making the Home a Place Where a Baby’s Brain Can Grow': 'Guhindura mu rugo nk’ahantu hatekanye',
    '12.With a United Family, Anything is Possible': 'Umuryango ushyizehamwe nta kiwunanira', 'Closing module': 'Gusoza ibiganiro',
    '3-Month Booster Module': 'Ikiganiro Nshimangira cya Nyuma y’amezi 3', '6-Month Booster Module': 'Ikiganiro Nshimangirabiganiro cya Nyuma y’amezi 6',
    '12-Month Booster Module': 'Ikiganiro Nshimangirabiganiro cya Nyuma y’amezi 12'
  };
  /* What the app calls a module where it is named: "Module 6", "Welcome module". */
  function modName(s) {
    var m = /^(\d+)\.(.*)$/.exec(s);
    if (m) return m[2];
    return s.replace(/ ?[Ss]ession$/, ' module').replace(/Booster module/, 'Booster module');
  }
  function modShort(s) {
    var m = /^(\d+)\./.exec(s);
    return m ? 'Module ' + m[1] : modName(s);
  }
  /* Forms taken out of a module, kept there under Archived forms. */
  var archivedIn = {};
  function archOf(p, s) { var k = p.name + '|' + s; return archivedIn[k] || (archivedIn[k] = []); }

  var cur = { project: projects[0], session: '6.The Importance of Good Health', form: null };
  function formByName(n) {
    n = String(n || '').replace(/\s+/g, ' ').trim();
    var hit = library.filter(function (f) { return f.name === n; })[0];
    if (hit) return hit;
    return library.filter(function (f) { return n.indexOf(f.name) === 0; })
      .sort(function (a, b) { return b.name.length - a.name.length; })[0] || null;
  }
  /* A form keeps the number it was given, whatever is added after it. */
  var lastId = 3;
  library.forEach(function (f) { f.id = 'FORM-' + (++lastId); });
  function formId(f) { if (!f.id) f.id = 'FORM-' + (++lastId); return f.id; }
  function projectOf(f) { return projects.filter(function (p) { return p.name === f.project; })[0] || null; }
  function projectByName(n) {
    n = String(n || '').replace(/\s+/g, ' ').trim();
    return projects.filter(function (p) { return n === p.name || n.indexOf(p.name) === 0; })
      .sort(function (a, b) { return b.name.length - a.name.length; })[0] || null;
  }
  function sessionByText(p, t) {
    t = String(t || '').replace(/\s+/g, ' ').trim();
    var all = p ? p.sessions : SESSIONS;
    var exact = all.filter(function (s) { return t.indexOf(s) > -1; }).sort(function (a, b) { return b.length - a.length; })[0];
    if (exact) return exact;
    var m = /Module (\d+)/.exec(t);
    if (m) return all.filter(function (s) { return s.indexOf(m[1] + '.') === 0; })[0] || null;
    return null;
  }
  function h(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function ic(id) { return '<svg aria-hidden="true"><use href="#i-' + id + '"/></svg>'; }
  function rel(go, icon, text, recid, view) {
    return '<button class="rel" type="button" data-go="' + go + '"' + (recid ? ' data-recid="' + h(recid) + '"' : '')
      + (view ? ' data-view="' + view + '"' : '') + '>' + ic(icon) + h(text) + '</button>';
  }
  function chipH(text, kind) { return '<span class="chip' + (kind ? ' ' + kind : '') + '"><i></i>' + h(text) + '</span>'; }
  function stChip(st) { return chipH(st, st === 'Active' ? 'ok' : st === 'Draft' ? 'warn' : ''); }
  function field(sc, label, html) {
    Array.prototype.forEach.call(sc.querySelectorAll('.pg .pgr'), function (row) {
      var k = row.querySelector('.k > span:last-child') || row.querySelector('.k span');
      if (!k || k.textContent.trim().toLowerCase() !== label.toLowerCase()) return;
      var v = row.querySelector('.v');
      var empty = html == null || html === '';
      v.innerHTML = empty ? '&mdash;' : html;
      v.classList.toggle('empty', empty);
      row.classList.toggle('is-empty', empty);
    });
  }
  function panel(sc, id, html) { var p = sc.querySelector('[data-panelid="' + id + '"]'); if (p) p.innerHTML = html; return p; }
  function tabChip(sc, id, n) {
    var t = sc.querySelector('.tab[data-panel="' + id + '"]');
    if (!t) return;
    var c = t.querySelector('.chip');
    if (n == null) { if (c) c.remove(); return; }
    if (!c) { c = el('span', 'chip'); c.style.marginLeft = 'var(--space-2)'; t.appendChild(c); }
    c.textContent = String(n);
  }
  function head(sc, key, id, title, alt) {
    var rid = sc.querySelector('.rec-id'), was = rid ? rid.textContent : '';
    if (rid) rid.textContent = id;
    var h1 = sc.querySelector('h1');
    if (h1) h1.textContent = title;
    var a = sc.querySelector('.rec-alt');
    if (a) { a.textContent = alt || ''; a.hidden = !alt; }
    var sd = window.SugiraScreens && window.SugiraScreens[key];
    if (sd && sd.crumbs && sd.crumbs.length) sd.crumbs[sd.crumbs.length - 1][0] = id;
    Array.prototype.forEach.call(document.querySelectorAll('#dwCrumbs *, #crumbs *'), function (n) {
      if (n.children.length === 0 && n.textContent.trim() === was) n.textContent = id;
    });
  }
  /* The Fields section under a record holds its names in both languages;
     it follows the record like everything else on the page. */
  function fieldsOf(sc, vals) {
    Array.prototype.forEach.call(sc.querySelectorAll('.fields .fld'), function (r) {
      var k = r.querySelector('.fld-k span:last-child');
      if (!k || !(k.textContent in vals)) return;
      var v = vals[k.textContent];
      var cells = r.querySelectorAll('.v');
      var put = function (c, t) { c.textContent = t || 'Empty'; c.classList.toggle('empty', !t); };
      if (v && typeof v === 'object') { if (cells[0]) put(cells[0], v.en); if (cells[1]) put(cells[1], v.rw); }
      else if (cells[0]) put(cells[0], v);
    });
  }
  /* Where a form sits says the way back to it: its project and module,
     or the Forms page for one no project carries yet. */
  function crumbsFor(f) {
    var sd = window.SugiraScreens && window.SugiraScreens.form;
    if (!sd) return;
    var p = projectOf(f);
    sd.crumbs = !p ? [['Forms', 'forms'], [formId(f), null]]
      : [['Projects', 'programme'], [p.name, 'project']].concat(f.sessions.length === 1 ? [[modName(f.sessions[0]), 'module']] : []).concat([[formId(f), null]]);
  }
  function usedIn(f) {
    if (!f.project) return 'Not in a project yet';
    if (!f.sessions.length) return 'The whole project';
    if (f.sessions.length >= 12) return 'Every module';
    return f.sessions.map(modShort).join(', ');
  }

  /* ---- the form ---- */
  function fillForm(f) {
    var sc = document.getElementById('s-form');
    if (!sc || !f) return;
    cur.form = f;
    var p = projectOf(f);
    head(sc, 'form', formId(f), f.name, f.rw);
    fieldsOf(sc, { 'Form name': { en: f.name, rw: f.rw }, 'Version': f.status === 'Draft' ? '1' : '4', 'Archived': f.status === 'Archived' ? 'Yes' : 'No' });
    field(sc, 'Status', '<span class="pg-badge ' + (f.status === 'Active' ? 'ok' : f.status === 'Draft' ? 'warn' : '') + '">' + h(f.status) + '</span>');
    field(sc, 'Used in', h(usedIn(f)));
    field(sc, 'Project', p ? rel('project', 'project', p.name, p.name) : '');
    var req = f.required != null ? f.required : Math.round(f.questions * 0.37);
    field(sc, 'Questions', f.questions ? f.questions + ' <span class="chip">' + req + ' required</span>' : '');
    field(sc, 'Time expected', Math.max(5, Math.round(f.questions * 1.33)) + ' minutes');
    field(sc, 'Languages', f.rw ? chipH('EN · RW', 'ok') : chipH('EN only', 'warn'));
    if (f.created) field(sc, 'Created by', h(f.created));
    if (f.edited) field(sc, 'Last edited', h(f.edited));
    tabChip(sc, 'data', f.responses);
    /* where the responses are read, the form, project and module they belong to */
    Array.prototype.forEach.call(sc.querySelectorAll('.dhead'), function (d, i) {
      d.innerHTML = i === 0
        ? chipH('Form · ' + f.name) + (p ? chipH('Project · ' + p.name) : '') + (f.sessions.length === 1 ? chipH('Module · ' + modShort(f.sessions[0])) : '')
        : chipH(f.name) + (p ? chipH('in ' + p.name) : '');
    });
    var dataP = sc.querySelector('[data-panelid="data"]');
    if (dataP) {
      var foot = dataP.querySelector('.tfoot span:not(.pg)');
      Array.prototype.forEach.call(dataP.querySelectorAll('table.tbl tbody tr'), function (r) { r.classList.toggle('f-none', !f.responses); });
      if (foot) foot.textContent = f.responses ? 'Showing 1–' + Math.min(4, f.responses) + ' of ' + fmt(f.responses) : 'No response yet';
      var rt = dataP.querySelector('.rt');
      if (rt) rt.innerHTML = '<i></i>' + fmt(f.responses) + ' responses';
    }
    var trf = sc.querySelector('#trTable');
    if (trf && f.strings) {
      var strs = [{ en: f.name, rw: f.rw }];
      f.strings.forEach(function (q) {
        strs.push({ en: q.en, rw: q.rw });
        (q.opts || []).forEach(function (o) { strs.push(o === 'Yego' ? { en: 'Yes', rw: 'Yego' } : o === 'Oya' ? { en: 'No', rw: 'Oya' } : { en: o, rw: '' }); });
      });
      if (!trf._static) trf._static = trf.tBodies[0].innerHTML;
      trf.tBodies[0].innerHTML = strs.map(function (x, i) {
        return '<tr><td class="mut">' + (i + 1) + '</td><td>' + h(x.en) + '</td><td><span class="v' + (x.rw ? '' : ' mut') + '" data-ftype="text">' + h(x.rw || 'Not translated')
          + '</span></td><td>' + (x.rw ? 'A. Gahimana' : '—') + '</td><td class="num mut">' + (x.rw ? 'Today' : '—') + '</td></tr>';
      }).join('');
      f.questions = Math.max(f.questions, f.strings.length);
      var tf2 = trf.closest('.card').querySelector('.tfoot span:not(.pg)');
      if (tf2) tf2.textContent = strs.filter(function (x) { return x.rw; }).length + ' of ' + strs.length + ' in Kinyarwanda';
      var pg2 = trf.closest('.card').querySelector('.tfoot .pg');
      if (pg2) pg2.hidden = true;
    } else if (trf && trf._static) {
      trf.tBodies[0].innerHTML = trf._static;
      var pg3 = trf.closest('.card').querySelector('.tfoot .pg');
      if (pg3) pg3.hidden = false;
    }
    var np = sc.querySelector('[data-panelid="notify"] .card');
    if (!f.rules) f.rules = f.name === 'Household Module Tracking Form' ? [
      { q: 'Q5 Any sign of harm or neglect?', op: 'is', v: 'Yes', msg: 'A risk of harm was raised in your sector', who: ['Sugira Muryango Sector lead (SLA)', 'District NCDA Child protection and Welfare Officer (CPWO)'] },
      { q: 'Q8 Referred to the health post?', op: 'is', v: 'Yes', msg: 'A referral needs following up', who: ['IZU Cell Coordinator (ICC)'] }] : [];
    if (np) {
      if (!np._static) np._static = np.innerHTML;
      if (f.rules) {
        np.innerHTML = '<div class="card-h"><h3>When a response is sent in</h3><span class="side"><button class="btn sec sm" type="button" data-modal="fnotify"><svg aria-hidden="true"><use href="#i-plus"/></svg>Add a rule</button></span></div>'
          + (f.rules.length ? f.rules.map(function (r, i) {
            return '<div class="lr" data-rule="' + i + '"><span class="t">' + h(r.q + ' ' + r.op + ' ' + r.v) + '</span><span class="s">' + (r.msg ? '“' + h(r.msg) + '” → ' : '') + h(r.who.join(', '))
              + '</span><span class="c rowacts"><a data-modal="fnotify">Change</a><a data-rule-del="' + i + '">Remove</a></span></div>';
          }).join('') : '<p class="empty-line">No rule yet</p>');
      } else np.innerHTML = np._static;
    }
    if (trf && !f.strings) {
      trf.setAttribute('data-total', String(f.questions));
      var tf = trf.closest('.card').querySelector('.tfoot span:not(.pg)');
      if (tf) tf.textContent = 'Showing ' + Math.min(5, f.questions) + ' of ' + f.questions;
    }
    if (window.SugiraFormStats) window.SugiraFormStats(f);
    /* its own dashboard and reports, drawn again from it */
    Array.prototype.forEach.call(sc.querySelectorAll('[data-panelid="freports"] .vb.on, [data-panelid="data"] .vb.on:not([data-v="data"])'), function (b) { b.click(); });
    Array.prototype.forEach.call(sc.querySelectorAll('.acc-k'), function (card) {
      var kind = card.getAttribute('data-acc-kind');
      var rows = Array.prototype.slice.call(card.querySelectorAll('.lr'));
      if (!card._static) card._static = rows.map(function (r) { return r.outerHTML; }).join('');
      rows.forEach(function (r) { r.remove(); });
      var list = f.access && f.access[kind];
      card.insertAdjacentHTML('beforeend', list ? list.map(function (o) {
        return '<div class="lr"><span class="t">' + h(o) + '</span><span class="c rowacts"><a data-acc="update">Change</a><a data-acc="remove">Remove</a></span></div>';
      }).join('') : card._static);
    });
    var arch = sc.querySelector('[data-modal="archive"]');
    if (arch) arch.hidden = f.status === 'Archived';
    var acts = sc.querySelector('.rec-top .acts');
    var rs = acts && acts.querySelector('[data-frestore]');
    if (acts && !rs) {
      rs = document.createElement('button');
      rs.type = 'button'; rs.className = 'btn sec sm'; rs.setAttribute('data-frestore', '');
      rs.textContent = 'Restore';
      acts.insertBefore(rs, acts.firstChild);
    }
    if (rs) rs.hidden = f.status !== 'Archived';
    var HM = f.name === 'Household Module Tracking Form';
    /* About this form: this form's facts */
    var about = sc.querySelector('[data-panelid="preview"] .cols > .card:nth-child(2)');
    if (about) {
      var reqN = f.required != null ? f.required : Math.round(f.questions * 0.37);
      about.innerHTML = '<div class="card-h"><h3>About this form</h3></div>'
        + '<div class="lr" style="margin-top:var(--space-3)"><span class="t">Created by</span><span class="s">' + h((f.created || 'A. Gahimana · FXB Rwanda · 18 January 2026').split(' · ').slice(0, 2).join(' · ')) + '</span><span class="c">' + h((f.created || ' ·  · 18 Jan 2026').split(' · ')[2] || '') + '</span></div>'
        + '<div class="lr"><span class="t">Last edited</span><span class="c">' + h(f.edited || '14 October by C. Uwimana') + '</span></div>'
        + '<div class="lr"><span class="t">Status</span><span class="c">' + stChip(f.status) + '</span></div>'
        + '<div class="lr"><span class="t">Questions</span><span class="c">' + f.questions + ' · ' + reqN + ' required</span></div>'
        + '<div class="lr"><span class="t">Time expected</span><span class="c">' + Math.max(5, Math.round(f.questions * 1.33)) + ' minutes</span></div>';
    }
    /* How the visitor sees it: this form's first question */
    var dev = sc.querySelector('[data-panelid="preview"] .tdev');
    if (dev) {
      if (!dev._static) dev._static = dev.innerHTML;
      if (HM) dev.innerHTML = dev._static;
      else {
        var q0 = f.strings && f.strings[0] ? f.strings[0] : { en: 'Household ID', rw: 'Nimero y’urugo', opts: [] };
        var yn = (q0.opts || []).length ? q0.opts : null;
        dev.innerHTML = '<p class="tdev-k">Ikibazo 1 muri ' + Math.max(1, f.questions) + '</p><p class="tdev-q">' + h(q0.rw || q0.en) + '</p>'
          + (yn ? yn.map(function (o) { return '<div class="lr click" role="radio" aria-checked="false"><span class="t">' + h(o) + '</span></div>'; }).join('')
            : '<div class="lr"><span class="t mut">Igisubizo</span></div>')
          + '<div class="tdev-f"><button data-toast="Previous question" class="btn sec sm" type="button">Subira inyuma</button><button data-toast="Next question" class="btn sm" type="button">Komeza</button></div>';
      }
    }
    /* its responses are visits only where it is asked at a visit */
    if (dataP) {
      var visitForm = HM || (f.sessions.length && f.responses);
      Array.prototype.forEach.call(dataP.querySelectorAll('table.tbl tbody tr'), function (r) { r.classList.toggle('f-none', !visitForm); });
      var foot2 = dataP.querySelector('.tfoot span:not(.pg)');
      if (foot2 && !visitForm) foot2.textContent = f.responses ? fmt(f.responses) + ' responses' : 'No response yet';
    }
    /* its translations: its own strings where it has them */
    if (trf && !f.strings && !HM) {
      if (!trf._static) trf._static = trf.tBodies[0].innerHTML;
      trf.tBodies[0].innerHTML = [{ en: f.name, rw: f.rw }].map(function (x, i) {
        return '<tr><td class="mut">' + (i + 1) + '</td><td>' + h(x.en) + '</td><td><span class="v' + (x.rw ? '' : ' mut') + '" data-ftype="text">' + h(x.rw || 'Not translated')
          + '</span></td><td>' + (x.rw ? 'C. Uwimana' : '—') + '</td><td class="num mut">' + (x.rw ? '14 Oct' : '—') + '</td></tr>';
      }).join('');
      var tf3 = trf.closest('.card').querySelector('.tfoot span:not(.pg)');
      if (tf3) tf3.textContent = 'Form name · ' + f.questions + ' questions to translate';
      var pg4 = trf.closest('.card').querySelector('.tfoot .pg');
      if (pg4) pg4.hidden = true;
    }
  }

  /* ---- the module ---- */
  function fillModule(p, s) {
    var sc = document.getElementById('s-module');
    if (!sc || !p || !s) return;
    cur.project = p; cur.session = s;
    var i = p.sessions.indexOf(s);
    head(sc, 'module', 'MOD-' + (17 + i), modName(s), RW[s] ? RW[s].replace(/^\d+\.\s*/, '') : '');
    fieldsOf(sc, { 'Module name': { en: modName(s), rw: (RW[s] || '').replace(/^\d+\.\s*/, '') }, 'Booster module': /Booster/.test(s) ? 'Yes' : 'No' });
    var fs = formsOf(p, s);
    var ar = archOf(p, s).concat(p.forms.filter(function (f) { return f.status === 'Archived' && f.sessions.indexOf(s) > -1; }).map(function (f) {
      return { name: f.name, responses: f.responses, when: f.archivedWhen || '3 Aug 2026', by: f.archivedBy || 'A. Gahimana', archived: true };
    }));
    tabChip(sc, 'forms', fs.length);
    tabChip(sc, 'marchived', ar.length);
    panel(sc, 'forms', '<div class="card flush plainsurface"><div class="tblwrap"><table class="tbl"><thead><tr><th>Form</th><th class="num">Questions</th><th class="num">Responses</th><th>Languages</th><th>Status</th><th class="ract">Actions</th></tr></thead><tbody>'
      + (fs.map(function (f) {
        return '<tr data-go="form" data-recid="' + h(f.name) + '"><td class="nm">' + h(f.name) + '</td><td class="num">' + f.questions + '</td><td class="num">'
          + (f.responses ? rel('form', 'reports', fmt(f.responses), f.name, 'tab:Data') : '0') + '</td><td>' + (f.rw ? chipH('EN · RW', 'ok') : chipH('EN only', 'warn'))
          + '</td><td>' + stChip(f.status) + '</td><td class="rowacts"><a data-go="form" data-recid="' + h(f.name) + '">Open</a><a data-go="form" data-recid="' + h(f.name) + '" data-view="tab:Data">View data</a>'
          + '<a data-mremove="' + h(f.name) + '">Remove</a></td></tr>';
      }).join('') || '<tr><td colspan="6" class="mut">No form in this module yet</td></tr>')
      + '</tbody></table></div><div class="tfoot"><span>' + fs.length + (fs.length === 1 ? ' form' : ' forms') + '</span></div></div>');
    panel(sc, 'marchived', '<div class="card flush plainsurface"><div class="tblwrap"><table class="tbl"><thead><tr><th>Form</th><th class="num">Responses</th><th>Archived</th><th data-person>Archived by</th><th class="ract">Actions</th></tr></thead><tbody>'
      + (ar.map(function (a) {
        var known = formByName(a.name) && formByName(a.name).name === a.name;
        return '<tr' + (known ? ' data-go="form" data-recid="' + h(a.name) + '"' : '') + '><td class="nm">' + h(a.name) + '</td><td class="num">' + fmt(a.responses) + '</td><td class="mut">' + h(a.when) + '</td><td>' + h(a.by) + '</td><td class="rowacts">'
          + (known ? '<a data-go="form" data-recid="' + h(a.name) + '" data-view="tab:Data">View data</a><a data-mrestore="' + h(a.name) + '"' + (a.archived ? ' data-whole="1"' : '') + '>Restore</a>' : '') + '</td></tr>';
      }).join('') || '<tr><td colspan="5" class="mut">Nothing archived</td></tr>')
      + '</tbody></table></div><div class="tfoot"><span>' + ar.length + ' archived</span></div></div>');
  }

  /* ---- the project ---- */
  function fillProject(p) {
    var sc = document.getElementById('s-project');
    if (!sc || !p) return;
    cur.project = p;
    head(sc, 'project', 'PRJ-' + (projects.indexOf(p) + 1), p.name);
    fieldsOf(sc, { 'Project name': { en: p.name, rw: p === projects[0] ? 'Gukurikirana amasomo y’umuryango' : '' },
      'Description': { en: p === projects[0] ? 'The core home-visiting curriculum: twelve fortnightly modules, a welcome, a closing and three boosters.' : '', rw: '' } });
    var live = p.forms.filter(function (f) { return f.status !== 'Archived'; });
    field(sc, 'Status', '<span class="pg-badge ok">Active</span>');
    field(sc, 'Modules', p.sessions.length ? p.sessions.length + (p.sessions.length === 1 ? ' module' : ' modules') : 'Forms only, no modules');
    field(sc, 'Forms', p.forms.length + (p.forms.length === 1 ? ' form' : ' forms'));
    field(sc, 'Translation', live.filter(function (f) { return f.rw; }).length + ' of ' + live.length + ' forms');
    field(sc, 'Mobile app', p.tags === 'tablet' ? 'Yes' : 'No');
    tabChip(sc, 'modules', p.sessions.length || null);
    tabChip(sc, 'forms', live.length);
    var tm = sc.querySelector('.tab[data-panel="modules"]');
    if (tm) tm.hidden = !p.sessions.length;
    var mp = panel(sc, 'modules', '<div class="card flush plainsurface"><div class="tblwrap"><table class="tbl"><thead><tr><th style="width:3rem">#</th><th>Module</th><th>Kinyarwanda</th><th>Status</th><th class="num">Forms</th></tr></thead><tbody>'
      + p.sessions.map(function (s) {
        var fs = formsOf(p, s), n = /^(\d+)\./.exec(s);
        return '<tr data-go="module" data-recid="' + h(s) + '"><td class="mut">' + (n ? n[1] : '—') + '</td><td class="nm"><button class="sx" type="button" aria-expanded="false" aria-label="Show the forms in this module">' + ic('chevronRight') + '</button>'
          + h(modName(s)) + '</td><td class="mut">' + h((RW[s] || '').replace(/^\d+\.\s*/, '')) + '</td><td>' + chipH('Active', 'ok') + '</td><td class="num">' + fs.length + '</td></tr>'
          + '<tr class="sxr" hidden><td colspan="5"><div class="sxb"><div class="sxh"><b>' + fs.length + (fs.length === 1 ? ' form' : ' forms') + '</b><button class="btn sec sm" type="button" data-modal="addform" data-session="' + h(s) + '">' + ic('plus') + ' Add a form</button></div>'
          + fs.map(function (f) {
            return '<div class="lr"><span class="t">' + h(f.name) + '</span><span class="c rowacts"><a data-go="form" data-recid="' + h(f.name) + '">Open</a><a data-go="form" data-recid="' + h(f.name) + '" data-view="tab:Data">View data</a></span></div>';
          }).join('') + '</div></td></tr>';
      }).join('') + '</tbody></table></div><div class="tfoot"><span>' + p.sessions.length + ' modules</span></div></div>');
    if (!p.sessions.length && tm && tm.classList.contains('on')) {
      var tf = sc.querySelector('.tab[data-panel="forms"]');
      if (tf) tf.click();
    }
    panel(sc, 'forms', '<div class="filters"><span class="side" style="margin-left:auto"><button class="btn sm" type="button" data-modal="addform">' + ic('plus') + ' Add a form</button></span></div>'
      + '<div class="card flush plainsurface"><div class="tblwrap"><table class="tbl"><thead><tr><th>Form</th><th>Kinyarwanda</th><th>Used in</th><th class="num">Responses</th><th>Status</th></tr></thead><tbody>'
      + live.map(function (f) {
        return '<tr data-go="form" data-recid="' + h(f.name) + '"><td class="nm">' + h(f.name) + '</td><td>' + (f.rw ? h(f.rw) : rel('translations', 'alert', 'Not translated'))
          + '</td><td class="mut">' + h(usedIn(f)) + '</td><td class="num">' + (f.responses ? rel('form', 'reports', fmt(f.responses), f.name, 'tab:Data') : '0') + '</td><td>' + stChip(f.status) + '</td></tr>';
      }).join('') + '</tbody></table></div><div class="tfoot"><span>' + live.length + (live.length === 1 ? ' form' : ' forms') + ' in this project</span></div></div>');
    var arch = p.forms.filter(function (f) { return f.status === 'Archived'; }).map(function (f) {
      return { name: f.name, module: f.sessions.length ? modShort(f.sessions[0]) : '—', by: f.archivedBy || 'A. Gahimana', when: f.archivedWhen || '22 Nov 2025', responses: f.responses };
    });
    p.sessions.forEach(function (s) {
      archOf(p, s).forEach(function (a) { arch.push({ name: a.name, module: modShort(s), by: a.by, when: a.when, responses: a.responses }); });
    });
    tabChip(sc, 'archive', arch.length || null);
    panel(sc, 'archive', '<div class="card flush plainsurface"><div class="tblwrap"><table class="tbl"><thead><tr><th>Form</th><th>Module</th><th data-person>Archived by</th><th class="num">Archived</th><th class="num">Responses kept</th></tr></thead><tbody>'
      + (arch.map(function (a) {
        return '<tr><td class="nm">' + h(a.name) + '</td><td class="mut">' + h(a.module) + '</td><td class="mut">' + h(a.by) + '</td><td class="num mut">' + h(a.when) + '</td><td class="num">' + fmt(a.responses) + '</td></tr>';
      }).join('') || '<tr><td colspan="5" class="mut">Nothing archived</td></tr>')
      + '</tbody></table></div><div class="tfoot"><span>' + arch.length + ' archived</span></div></div>');
  }

  /* Everything that shows the library is drawn again after a change. */
  function redraw() {
    var host = document.getElementById('formLib');
    if (host) {
      var page = host.closest('.screen');
      Array.prototype.forEach.call(page ? page.querySelectorAll('.tq') : [], function (b) { b.remove(); });
      host.innerHTML = '';
      mountList();
      setTimeout(function () {
        var acts = page && page.querySelector('.filters .acts');
        var end = acts && (acts.closest('.end') || acts);
        if (end) end.parentNode.appendChild(end);
      }, 60);
    }
    mountCounts();
    projects.forEach(function (p) {
      p.responses = p.forms.reduce(function (a, f) { return a + f.responses; }, 0);
    });
    /* every page that shows the library is drawn again, on screen or not */
    fillModule(cur.project, cur.session);
    fillProject(cur.project);
    if (cur.form) fillForm(cur.form);
  }

  /* ---- which page a click opens ---- */
  function rowText(el) {
    var tr = el.closest('tr');
    if (!tr) return '';
    var nm = tr.querySelector('.nm') || tr.cells[0];
    return nm ? nm.textContent : '';
  }
  var pend = null;
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-go="form"], [data-go="module"], [data-go="project"]');
    if (!a) return;
    var key = a.getAttribute('data-go');
    var own = a.getAttribute('data-recid') || '';
    var txt = own || (a.tagName === 'TR' ? rowText(a) : (a.textContent.trim() || rowText(a)));
    var lr = a.closest('.lr');
    if (!own && lr && a.closest('.rowacts')) txt = (lr.querySelector('.t') || {}).textContent || txt;
    if (!own && a.closest('.rowacts') && a.closest('tr')) txt = rowText(a);
    var job = null;
    if (key === 'form') {
      var f = formByName(txt) || formByName(rowText(a));
      if (f) { crumbsFor(f); job = function () { fillForm(f); }; }
    } else if (key === 'project') {
      var p = projectByName(txt) || projectByName(rowText(a));
      if (p) job = function () { fillProject(p); };
    } else {
      var inProj = a.closest('#s-project') ? cur.project : null;
      var tree = a.closest('#s-programme');
      var pj = inProj;
      if (tree) {
        var at = a.closest('tr');
        while (at && at.classList.contains('prow-kid')) at = at.previousElementSibling;
        if (at) pj = projectByName(rowText(at));
      }
      pj = pj || projects[0];
      var s = sessionByText(pj, txt) || sessionByText(pj, rowText(a));
      if (s) job = function () { fillModule(pj, s); };
    }
    if (!job) return;
    pend = job;
    setTimeout(function () { if (pend) { var j = pend; pend = null; j(); } }, 0);
  }, true);

  document.addEventListener('click', function (e) {
    var r = e.target.closest('[data-frestore]');
    if (r && cur.form) {
      window.SugiraProg.restore(cur.form.name);
      if (window.SugiraToast) window.SugiraToast.say('“' + cur.form.name + '” restored');
      return;
    }
    var d = e.target.closest('[data-rule-del]');
    if (d && cur.form && cur.form.rules) {
      var i = +d.getAttribute('data-rule-del'), gone = cur.form.rules.splice(i, 1)[0];
      fillForm(cur.form);
      if (window.SugiraToast) window.SugiraToast.say('Rule removed', { label: 'Undo', onClick: function () { cur.form.rules.splice(i, 0, gone); fillForm(cur.form); } });
    }
  });

  /* ---- taking a form out of a module, and putting it back ---- */
  document.addEventListener('click', function (e) {
    var rm = e.target.closest('[data-mremove]'), rs = e.target.closest('[data-mrestore]');
    if (!rm && !rs) return;
    e.preventDefault();
    e.stopPropagation();
    var p = cur.project, s = cur.session;
    if (rs) {
      var nm = rs.getAttribute('data-mrestore'), f0 = formByName(nm);
      if (rs.hasAttribute('data-whole') && f0) { f0.status = 'Active'; }
      var list = archOf(p, s);
      archivedIn[p.name + '|' + s] = list.filter(function (x) { return x.name !== nm; });
      if (f0 && f0.sessions.indexOf(s) === -1) f0.sessions.push(s);
      redraw();
      if (window.SugiraToast) window.SugiraToast.say('“' + nm + '” is back in ' + modShort(s));
      return;
    }
    var f = formByName(rm.getAttribute('data-mremove'));
    if (!f || !window.SugiraModal) return;
    window.SugiraModal.ask({
      title: 'Remove “' + f.name + '” from ' + modShort(s) + '?', ok: 'Remove', body: '',
      onOk: function () {
        f.sessions = f.sessions.filter(function (x) { return x !== s; });
        archOf(p, s).unshift({ name: f.name, responses: f.responses, when: '6 Nov 2026', by: 'A. Gahimana' });
        redraw();
      },
      done: '“' + f.name + '” removed from ' + modShort(s) + ' · under Archived forms'
    });
  }, true);

  window.SugiraProg = {
    /* What Add form is adding to, and what is already there. */
    context: function (from) {
      var sxs = from && from.getAttribute && from.getAttribute('data-session');
      if (from && from.closest && from.closest('#s-module')) return { kind: 'module', project: cur.project, session: cur.session };
      if (sxs) return { kind: 'module', project: cur.project, session: sxs };
      if (from && from.closest && from.closest('#s-project')) return { kind: 'project', project: cur.project };
      return { kind: 'module', project: cur.project, session: cur.session };
    },
    has: function (ctx) {
      return ctx.kind === 'project'
        ? ctx.project.forms.filter(function (f) { return f.status !== 'Archived'; }).map(function (f) { return f.name; })
        : formsOf(ctx.project, ctx.session).map(function (f) { return f.name; });
    },
    offer: function (ctx) {
      var have = this.has(ctx);
      return library.filter(function (f) { return f.status !== 'Archived' && have.indexOf(f.name) === -1; });
    },
    importInto: function (ctx, names) {
      names.forEach(function (n) {
        var f = formByName(n);
        if (!f) return;
        if (!f.project || ctx.kind === 'project' && f.project !== ctx.project.name) {
          /* a form made on the Forms page joins the project it is imported into */
          if (!f.project) {
            f.project = ctx.project.name;
            if (ctx.project.forms.indexOf(f) === -1) ctx.project.forms.push(f);
          } else if (ctx.project.forms.indexOf(f) === -1) {
            var copy = {};
            Object.keys(f).forEach(function (k) { copy[k] = f[k]; });
            copy.project = ctx.project.name; copy.sessions = [];
            ctx.project.forms.push(copy);
            library.push(copy);
            f = copy;
          }
        }
        if (ctx.kind === 'module' && f.sessions.indexOf(ctx.session) === -1) {
          if (f.project !== ctx.project.name && ctx.project.forms.indexOf(f) === -1) ctx.project.forms.push(f);
          f.sessions.push(ctx.session);
        }
      });
      redraw();
    },
    restore: function (name) {
      var f = formByName(name);
      if (!f) return;
      f.status = f.questions ? 'Active' : 'Draft';
      redraw();
    },
    remove: function (name) {
      var f = formByName(name);
      if (!f) return null;
      var at = library.indexOf(f), p = projectOf(f), pi = p ? p.forms.indexOf(f) : -1;
      library.splice(at, 1);
      if (p && pi > -1) p.forms.splice(pi, 1);
      redraw();
      return function () {
        library.splice(at, 0, f);
        if (p && pi > -1) p.forms.splice(pi, 0, f);
        redraw();
      };
    },
    rules: function () { return cur.form ? cur.form.rules || (cur.form.rules = []) : []; },
    questions: function () {
      var f = cur.form;
      if (!f) return [];
      if (f.strings) return f.strings.map(function (q, i) { return 'Q' + (i + 1) + ' ' + q.en; });
      if (f.name === 'Household Module Tracking Form') return ['Q5 Any sign of harm or neglect?', 'Q8 Referred to the health post?'];
      return ['Q1 Household ID'];
    },
    redrawForm: function () { if (cur.form) fillForm(cur.form); },
    archive: function (name) {
      var f = formByName(name);
      if (!f) return;
      f.status = 'Archived';
      f.archivedBy = 'A. Gahimana';
      f.archivedWhen = '6 Nov 2026';
      redraw();
    },
    current: cur,
    modName: modShort,
    /* Open a form's page, on one of its tabs. */
    open: function (name, tab) {
      var f = formByName(name);
      if (!f || !window.SugiraGo) return;
      crumbsFor(f);
      window.SugiraGo('form');
      setTimeout(function () {
        fillForm(f);
        var sc = document.getElementById('s-form');
        var t = sc && sc.querySelector('.tab[data-panel="' + tab + '"]');
        if (t) t.click();
      }, 80);
    },
    addModule: function (name, rw, booster) {
      var p = cur.project;
      var n = p.sessions.filter(function (s) { return /^\d+\./.test(s); }).length + 1;
      var key = booster ? name : n + '.' + name;
      p.sessions.push(key);
      if (rw) RW[key] = rw;
      redraw();
      var live = document.getElementById('s-project');
      if (live) fillProject(p);
    }
  };

  /* Mount now rather than on DOMContentLoaded. Every script here is deferred,
     so the document is already parsed when this runs, and app.js — loaded
     first — has its own DOMContentLoaded listener that reads each table's
     columns to build the toolbar. Waiting for the same event would hand it a
     four-column table and then add three more behind its back. */
  mount();
  /* The pages open on these until a row says otherwise. */
  document.addEventListener('DOMContentLoaded', function () {
    fillProject(projects[0]);
    fillModule(projects[0], '6.The Importance of Good Health');
    fillForm(formByName('Household Module Tracking Form'));
  });
})();
