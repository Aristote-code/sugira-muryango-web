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
    '12.With a United Family, Anything is Possible'];

  var EVERY_SESSION = SESSIONS.slice(1);

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

  function childRow(depth, iconId, name, note, right, go) {
    var tr = el('tr', 'prow-kid');
    var td = el('td');
    td.colSpan = 4;
    var w = el('div', 'prk');
    w.style.paddingLeft = (depth * 22) + 'px';
    w.appendChild(icon(iconId, 'prk-i'));
    var nm = el('span', 'prk-n', name);
    w.appendChild(nm);
    if (note) w.appendChild(el('span', 'prk-note', note));
    if (right) w.appendChild(el('span', 'prk-r', right));
    td.appendChild(w);
    tr.appendChild(td);
    if (go) {
      tr.setAttribute('data-go', go);
      tr.classList.add('click');
    }
    return tr;
  }

  function mountTree() {
    var table = document.querySelector('#s-programme [data-panelid="list"] .tbl');
    if (!table) return;
    var body = table.tBodies[0];
    if (!body) return;

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
      var t = el('button', 'prow-t');
      t.type = 'button';
      t.setAttribute('aria-expanded', 'false');
      t.setAttribute('aria-label', 'What is in ' + p.name);
      t.innerHTML = '<svg aria-hidden="true"><use href="#i-caret"/></svg>';
      cell.insertBefore(t, cell.firstChild);
      cell.classList.add('prow-n');

      /* what it holds, on the row, so the shape is readable without opening */
      var sum = el('span', 'prow-s');
      sum.textContent = (p.sessions.length ? p.sessions.length + ' sessions · ' : '')
        + p.forms.length + (p.forms.length === 1 ? ' form · ' : ' forms · ')
        + fmt(p.responses) + ' responses';
      cell.appendChild(sum);

      var kids = [];
      t.onclick = function (e) {
        e.stopPropagation();
        var open = t.getAttribute('aria-expanded') === 'true';
        t.setAttribute('aria-expanded', String(!open));
        tr.classList.toggle('is-open', !open);
        if (open) {
          kids.forEach(function (k) { k.remove(); });
          kids = [];
          return;
        }
        kids = build(p, tr);
        kids.forEach(function (k, n) {
          tr.parentNode.insertBefore(k, n === 0 ? tr.nextSibling : kids[n - 1].nextSibling);
        });
      };
    });

    function build(p, tr) {
      var out = [];
      var tags = tr.getAttribute('data-tags') || '';

      /* A supervisor's form says so on the row. That is the whole of what the
         Monitoring forms tab was telling you, said where the form is. */
      function formRow(depth, f) {
        return childRow(depth, 'i-reports', f.name,
          f.questions + ' questions' + (f.bySupervisor ? ' · ' + f.by : ''),
          fmt(f.responses) + ' responses', 'form');
      }
      function count(n) { return n + (n === 1 ? ' form' : ' forms'); }

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
          out.push(childRow(1, 'i-reports', 'Carried by every session', count(own.length)));
        }
        own.forEach(function (f) { out.push(formRow(p.sessions.length ? 2 : 1, f)); });
      }

      p.sessions.forEach(function (s) {
        var fs = formsOf(p, s).filter(function (f) { return own.indexOf(f) === -1; });
        out.push(childRow(1, 'i-programme', s,
          fs.length ? count(fs.length) : 'no form of its own', null, 'module'));
        fs.forEach(function (f) { out.push(formRow(2, f)); });
      });

      /* child rows answer to the same tabs as the project they hang under */
      out.forEach(function (r) { if (tags) r.setAttribute('data-tags', tags); });
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

      tr.appendChild(el('td', 'num', fmt(f.responses)));

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
    span.innerHTML = library.length + ' forms across ' + projects.length
      + ' projects · ' + fmt(library.reduce(function (a, f) { return a + f.responses; }, 0))
      + ' responses collected · the three that had a monitoring programme of '
      + 'their own are in here too, on the sessions they monitor';
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

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
