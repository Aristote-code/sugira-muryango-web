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
  var SESSIONS = ['Welcome session', '1.Family Narrative',
    '2.The Importance of Early Stimulation & Play', '3.Building Early Communication Skills',
    '4.The Importance of Good Hygiene', '5.The Importance of Good Nutrition',
    '6.The Importance of Good Health', '7.Managing the Stresses of Parenting and Family Life',
    '8.Resolving Conflicts in the Home',
    '9.The Important Role that Everyone Plays in Raising a Baby Well',
    '10.Good Parenting is Better than Being Born Well',
    '11.Making the Home a Place Where a Baby’s Brain Can Grow',
    '12.With a United Family, Anything is Possible',
    'Closing session', '3-Month Booster Session', '6-Month Booster Session',
    '12-Month Booster Session'];

  /* The twelve numbered ones. A form that goes on every module goes on the
     curriculum, not on the welcome, the closing or a booster. */
  var EVERY_SESSION = SESSIONS.slice(1, 13);

  /* The four sessions a supervisor sits in on. The old Monitoring forms tab
     listed these as modules of their own, with the same names as the sessions
     they shadow — the programme written out twice so that supervisors had
     somewhere to hang two forms. */
  var MONITORED = ['Welcome session', '1.Family Narrative',
    '4.The Importance of Good Hygiene', '6.The Importance of Good Health'];

  /* project, tab tag, flag, its sessions, and its forms —
     each form: name, Kinyarwanda, questions, responses, status, sessions used in.

     Every name here is one the app already shows somewhere: the project Forms
     panel, the Session 6 module, the Translations table or the archive. A form
     that nothing in the app names is not in this list. */
  var P = [
    ['Household Module Tracking', 'tablet', null, SESSIONS, [
      ['Family Enrollment and Composition Form', 'Ifishi yo kubarura Abagize Urugo', 24, 2210, 'Active', ['Welcome session'], 'IZU at Village'],
      ['Anthropometric measurement', 'Gupima imikurire y’abana', 9, 1884, 'Active', ['Welcome session', '6.The Importance of Good Health'], 'IZU at Village'],
      ['Flash weekly report on every module', 'Raporo yihuse ya buri kiganiro', 11, 986, 'Active', EVERY_SESSION, 'IZU at Village'],
      ['General Questions-Self report', 'Ibibazo Rusange ku biganiro byose', 18, 412, 'Active', EVERY_SESSION, 'IZU Cell Coordinator'],
      ['Family-Specific Competencies-Self-report', 'Ibibazo ku bushobozi bwo gutanga ikiganiro', 16, 388, 'Active', EVERY_SESSION, 'IZU Cell Coordinator'],
      ['Visit record', '', 30, 986, 'Active', ['6.The Importance of Good Health'], 'IZU at Village'],
      ['Caregiver observation', '', 12, 986, 'Active', ['6.The Importance of Good Health'], 'IZU at Village'],
      ['Supervisor spot-check', '', 8, 141, 'Active', ['6.The Importance of Good Health'], 'Sector lead (SLA)'],
      ['Managing the Stresses of Parenting — visit record', '', 34, 0, 'Draft', ['7.Managing the Stresses of Parenting and Family Life'], 'IZU at Village'],
      ['Resolving Conflicts in the Home — visit record', '', 41, 0, 'Draft', ['8.Resolving Conflicts in the Home'], 'IZU at Village'],
      /* The two that used to hang off the parallel monitoring tree. They are
         imported into the four sessions that are monitored, like any other
         form, and the column that says who fills them in is what makes them
         monitoring forms. */
      ['Session in action', '', 22, 412, 'Active', MONITORED, 'IZU Cell Coordinator'],
      ['IZU quality score', '', 16, 344, 'Active', MONITORED, 'IZU Cell Coordinator']
    ]],
    ['Household Tracking Project', 'tablet', 'near-duplicate', ['Welcome session', '1.Family Narrative'], [
      ['Household visit record v1', '', 30, 0, 'Archived', ['Welcome session'], 'IZU at Village'],
      ['Household visit record v2', '', 30, 0, 'Archived', ['1.Family Narrative'], 'IZU at Village']
    ]],
    ['Household Enrollment', 'tablet', null, [], [
      ['Enrollment of Beneficiaries', '', 24, 2210, 'Active', [], 'IZU at Village'],
      ['Caregiver observation (pilot)', '', 12, 412, 'Archived', [], 'IZU at Village']
    ]],
    ['Risk of Harm/other family problems Management', 'tablet', null, [], [
      ['Risk of Harm management — intake', '', 28, 344, 'Active', [], 'IZU at Village'],
      ['Risk of Harm management — 72-hour review', '', 9, 318, 'Active', [], 'Sector lead (SLA)']
    ]],
    ['FCG participation and interaction form', 'tablet', null, [], [
      ['FCG participation and interaction', '', 14, 1204, 'Active', [], 'IZU at Village']
    ]],
    ['Play Collaborative Meetings', 'tablet', null, [], [
      ['Play session attendance', '', 10, 876, 'Active', [], 'IZU at Village'],
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
      sessions: ns + (ns === 1 ? ' session' : ' sessions'),
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
  var SHORT = {
    'IZU': 'IZU — the home visitor at village level, one per village',
    'SLA': 'SLA — Sugira Muryango Sector lead',
    'HQ': 'HQ — the FXB Rwanda head office team'
  };

  function spellOut(text) {
    return String(text).replace(/\b(IZU|SLA|HQ)\b/g, function (a) {
      return '<abbr data-tip="' + SHORT[a] + '">' + a + '</abbr>';
    });
  }

  /* "6.The Importance of Good Health" is the session's stored name; everywhere
     else in the app it is Session 6. */
  function shortSession(name) {
    var m = /^(\d+)\./.exec(name);
    return m ? 'Session ' + m[1] : name;
  }

  /* A session carries the forms that name it. Said once, here, so the tree and
     the Forms column cannot disagree. */
  function formsOf(project, session) {
    return project.forms.filter(function (f) {
      return f.sessions.indexOf(session) !== -1;
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
      ['Sessions', 'Forms', 'Responses'].forEach(function (t, n) {
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
        return list.reduce(function (a, f) { return a + f.responses; }, 0);
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
          var gT = caret('Forms carried by every session');
          var gTr = tag(kidRow({
            depth: 1, toggle: gT, iconId: 'i-reports', name: 'Carried by every session',
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
    /* Questions is not here. It is on the form and in the tree, and a column
       that wide pushed Filled in by off the card — which is the column that
       tells a monitoring form from a visit form. */
    ['Form', 'Kinyarwanda', 'Project', 'Used in', 'Filled in by', 'Responses', 'Status']
      .forEach(function (h, i) {
        hr.appendChild(el('th', i === 5 ? 'num' : null, h));
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
      var pb = el('button', 'rel');
      pb.type = 'button';
      pb.setAttribute('data-go', 'project');
      pb.setAttribute('data-tip', f.project);
      pb.innerHTML = '<svg aria-hidden="true"><use href="#i-programme"/></svg>';
      pb.appendChild(document.createTextNode(f.project));
      pj.appendChild(pb);
      tr.appendChild(pj);

      /* "Session 6", not "6.The Importance of Good Health" — the rest of the
         app says Session 6, and the full title on the row pushed every other
         column off the card. It is on the tooltip. */
      var used = el('td', 'mut');
      used.textContent = !f.sessions.length ? 'The project itself'
        : f.sessions.length === 1 ? shortSession(f.sessions[0])
          : f.sessions.length + ' sessions';
      if (f.sessions.length > 1 || shortSession(f.sessions[0]) !== f.sessions[0]) {
        used.setAttribute('data-tip', f.sessions.join(' · '));
      }
      tr.appendChild(used);

      var by = el('td', 'mut');
      by.innerHTML = spellOut(f.by);
      tr.appendChild(by);

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
      + ' responses · 3 from the monitoring programme';
    foot.appendChild(span);
    host.appendChild(foot);
  }

  /* the two places that announce how many forms there are read the library,
     so neither can drift from it */
  function mountCounts() {
    ['formCount', 'formCountRail'].forEach(function (id) {
      var n = document.getElementById(id);
      if (n) n.textContent = String(library.length);
    });
  }

  function mount() { mountTree(); mountList(); mountCounts(); }

  /* Mount now rather than on DOMContentLoaded. Every script here is deferred,
     so the document is already parsed when this runs, and app.js — loaded
     first — has its own DOMContentLoaded listener that reads each table's
     columns to build the toolbar. Waiting for the same event would hand it a
     four-column table and then add three more behind its back. */
  mount();
})();
