/* ---------------------------------------------------------------------------
   Records — what every list of collected data carries, and what every record
   lets you do to it. From the 15 November walkthrough with FXB.

   1. Views. Households, Visits, Risk of harm and Referrals each get the four
      the old system's projects had: a Dashboard drawn from the data, Recycled
      data (what was deleted, restorable), Generated reports, and a Report
      builder. "The same on visits. The same on risk of harm. The same on
      referrals." A form's own data gets the same four.

   2. Follow-ups. A risk of harm or a referral is followed up the way the
      partners already work: a date, a status and a comment, with the history
      underneath — both open, "so that a person knows what to do right now".

   3. Edit and Delete on every record. Deleting never destroys: the record
      goes to Recycled data, where it can be restored or removed for good.
--------------------------------------------------------------------------- */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var say = function (m, a) { if (window.SugiraToast) window.SugiraToast.say(m, a); };
  var ME = 'A. Gahimana';
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
  function today() { return '15 Nov 2026'; }

  /* ---- what each list holds ---- */
  var MODULES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  var CFG = {
    households: {
      noun: 'household', nouns: 'households',
      fields: ['Household ID', 'Caregiver', 'National ID', 'Family ID', 'Phone', 'Province', 'District',
               'Sector', 'Cell', 'Village', 'Cohort', 'Module reached', 'Last visit', 'Status', 'Enrolled'],
      stats: [['Families', 2210], ['Behind schedule', 148], ['No visit in 30 days', 61], ['Open risk of harm', 3, 'bad']],
      charts: [
        { t: 'Families by district', rows: [['Ngoma', 560], ['Rubavu', 480], ['Nyanza', 450], ['Kirehe', 420], ['Musanze', 300]] },
        { t: 'Families by module reached', rows: [['Modules 1–3', 412], ['Modules 4–6', 980], ['Modules 7–9', 640], ['Modules 10–12', 178]] }
      ],
      bin: [
        ['I-534-212', 'Mukeshimana Grace', 'J. Kamanzi', '2 Nov 2026', 'Enrolled twice'],
        ['I-413-090', 'Ndayisaba Pierre', 'C. Uwimana', '24 Oct 2026', 'Moved out of the programme area'],
        ['I-351-433', 'Uwera Claudine', 'A. Gahimana', '19 Oct 2026', 'Test record']
      ],
      reports: [
        ['Families behind schedule in Ngoma', 'A. Gahimana', 'Status is Behind · District is Ngoma', '3 Nov 2026', 34],
        ['Families enrolled without a national ID', 'J. Kamanzi', 'National ID is empty', '28 Oct 2026', 57],
        ['Cohort 2 families by sector', 'C. Uwimana', 'Cohort is 2 · grouped by Sector', '21 Oct 2026', 990]
      ]
    },
    visits: {
      noun: 'visit', nouns: 'visits',
      fields: ['Visit ID', 'Date', 'Household ID', 'Caregiver', 'Province', 'District', 'Sector', 'Cell',
               'Village', 'Module', 'Form', 'IZU', 'Recorded by', 'Minutes', 'Who was present', 'Outcome'],
      stats: [['Visits conducted', 1842], ['This week', 147], ['Not completed', 368, 'warn'], ['Average minutes', 44]],
      charts: [
        { t: 'Visits by module', rows: MODULES.map(function (m, i) {
          return ['Module ' + m, [312, 298, 270, 254, 201, 168, 129, 98, 61, 33, 12, 6][i]]; }) },
        { t: 'Visits by district', rows: [['Ngoma', 470], ['Rubavu', 400], ['Nyanza', 392], ['Kirehe', 330], ['Musanze', 250]] }
      ],
      bin: [
        ['VIS-8790', 'I-534-107 · Module 5', 'M. Dusabe', '30 Oct 2026', 'Entered twice from the same tablet'],
        ['VIS-8712', 'I-224-204 · Module 3', 'A. Nyirahabimana', '22 Oct 2026', 'Wrong household chosen']
      ],
      reports: [
        ['Visits not completed this month', 'A. Gahimana', 'Outcome is Not completed · Date is this month', '4 Nov 2026', 368],
        ['Module 6 visits in Nyanza', 'C. Uwimana', 'Module is 6 · District is Nyanza', '30 Oct 2026', 61]
      ]
    },
    safeguarding: {
      noun: 'risk of harm', nouns: 'risks of harm',
      fields: ['Case ID', 'Household ID', 'Type', 'Who is at risk', 'Raised by', 'Raised', 'Province',
               'District', 'Sector', 'Status', 'Latest follow-up'],
      stats: [['Active', 3, 'bad'], ['Inactive', 31], ['Total', 34], ['Raised this month', 4]],
      charts: [
        { t: 'Risk of harm by type', rows: [['Neglect', 14], ['Physical', 9], ['Emotional', 6], ['Sexual', 3], ['Other', 2]] },
        { t: 'Who is at risk', rows: [['Child under 5', 21], ['Child 5–17', 8], ['Caregiver', 4], ['Other adult', 1]] }
      ],
      bin: [['RH-0040', 'I-531-988 · Neglect', 'C. Uwimana', '27 Oct 2026', 'Raised twice for the same visit']],
      reports: [
        ['Open risk of harm by district', 'A. Gahimana', 'Status is Active · grouped by District', '5 Nov 2026', 3],
        ['Severe malnutrition cases, 2026', 'J. Kamanzi', 'Type is Severe malnutrition · Raised in 2026', '1 Nov 2026', 9]
      ]
    },
    referrals: {
      noun: 'referral', nouns: 'referrals',
      fields: ['Referral ID', 'Household ID', 'Out of case', 'Type', 'Referred to', 'Referred by', 'Sent',
               'District', 'Sector', 'Status', 'Latest follow-up'],
      stats: [['Active', 3, 'bad'], ['Closed', 3], ['Total', 6], ['Sent this month', 2]],
      charts: [
        { t: 'Referrals by type', rows: [['Health', 3], ['Child protection', 2], ['Social protection', 1]] },
        { t: 'Where they were sent', rows: [['Health centre', 3], ['District CPWO', 2], ['Sector social worker', 1]] }
      ],
      bin: [['RF-0105', 'I-535-133 · Health', 'J. Kamanzi', '25 Oct 2026', 'Sent to the wrong health centre']],
      reports: [['Referrals still open', 'A. Gahimana', 'Status is Active', '5 Nov 2026', 3]]
    },
    form: {
      noun: 'response', nouns: 'responses',
      fields: ['Response ID', 'Household ID', 'Submitted', 'Filled in by', 'Recorded by', 'District', 'Sector',
               'Village', 'Module', 'Q1 Who was present', 'Q2 Minutes', 'Q5 Risk of harm seen', 'Q7 Insurance card', 'Q8 Health post'],
      stats: [['Responses', 1842], ['This week', 147], ['Flagged', 12, 'warn'], ['Median minutes', 42]],
      charts: [
        { t: 'Responses by module', rows: MODULES.slice(0, 8).map(function (m, i) {
          return ['Module ' + m, [312, 298, 270, 254, 201, 168, 129, 98][i]]; }) },
        { t: 'Responses by district', rows: [['Ngoma', 470], ['Rubavu', 400], ['Nyanza', 392], ['Kirehe', 330], ['Musanze', 250]] }
      ],
      bin: [['R-55120', 'I-534-107 · 30 Oct', 'M. Dusabe', '31 Oct 2026', 'Sent twice']],
      reports: [['Visits where a risk of harm was seen', 'A. Gahimana', 'Q5 Risk of harm seen is Yes', '2 Nov 2026', 34]]
    }
  };

  /* ---- the strip ---- */
  var VIEWS = [
    ['data', 'Data', 'reports'],
    ['dash', 'Dashboard', 'dashboard'],
    ['bin', 'Recycled data', 'archive'],
    ['gen', 'Generated reports', 'project'],
    ['build', 'Report builder', 'settings']
  ];

  function strip(key, host, before, only) {
    var views = only ? VIEWS.filter(function (v) { return only.indexOf(v[0]) > -1; }) : VIEWS;
    var bar = document.createElement('div');
    bar.className = 'vbar';
    bar.setAttribute('role', 'tablist');
    bar.setAttribute('aria-label', 'Views of this data');
    bar.innerHTML = views.map(function (v, i) {
      return '<button class="vb' + (i ? '' : ' on') + '" type="button" role="tab" aria-selected="'
        + (i ? 'false' : 'true') + '" data-v="' + v[0] + '"><svg aria-hidden="true"><use href="#i-'
        + v[2] + '"/></svg>' + v[1] + '</button>';
    }).join('');
    host.insertBefore(bar, before || host.firstChild);
    var panel = document.createElement('div');
    panel.className = 'vpanel pad';
    panel.hidden = true;
    bar.parentNode.insertBefore(panel, bar.nextSibling);
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('.vb');
      if (!b) return;
      show(key, host, bar, panel, b.getAttribute('data-v'));
    });
    if (views[0][0] !== 'data') show(key, host, bar, panel, views[0][0]);
    return { bar: bar, panel: panel };
  }

  /* The data view is everything the screen already had; the other four
     replace it while they are showing. */
  function show(key, host, bar, panel, v) {
    $$('.vb', bar).forEach(function (b) {
      var on = b.getAttribute('data-v') === v;
      b.classList.toggle('on', on);
      b.setAttribute('aria-selected', String(on));
    });
    var kids = Array.prototype.slice.call(host.children);
    var from = kids.indexOf(panel) + 1;
    kids.forEach(function (k, i) {
      if (k === bar || k === panel) return;
      if (host.classList.contains('screen') || i >= from) k.classList.toggle('v-off', v !== 'data');
    });
    panel.hidden = v === 'data';
    if (v === 'data') return;
    panel.innerHTML = '';
    ({ dash: drawDash, bin: drawBin, gen: drawGen, build: drawBuild })[v](key, panel, function (nv) {
      show(key, host, bar, panel, nv);
    });
  }

  function bars(rows) {
    var max = Math.max.apply(null, rows.map(function (r) { return r[1]; })) || 1;
    return '<div class="hb">' + rows.map(function (r) {
      return '<div class="hr"><span class="l">' + esc(r[0]) + '</span><span class="t"><i style="width:'
        + Math.round(r[1] / max * 100) + '%"></i></span><span class="v">' + fmt(r[1]) + '</span></div>';
    }).join('') + '</div>';
  }

  function drawDash(key, panel) {
    var c = CFG[key];
    panel.innerHTML = '<div class="stats s4">' + c.stats.map(function (s) {
      return '<div class="st"><div class="l">' + esc(s[0]) + '</div><div class="vrow"><div class="v' + (s[2] ? ' ' + s[2] : '')
        + '">' + fmt(s[1]) + '</div></div></div>';
    }).join('') + '</div><div class="cols c2e">' + c.charts.map(function (ch) {
      return '<div class="card"><div class="card-h"><h3>' + esc(ch.t) + '</h3></div>' + bars(ch.rows) + '</div>';
    }).join('') + '</div>';
  }

  /* ---- recycled data ---- */
  function drawBin(key, panel) {
    var c = CFG[key];
    if (!c.bin.length) {
      panel.innerHTML = '<div class="card"><p class="empty-line">Nothing has been deleted</p></div>';
      return;
    }
    panel.innerHTML = '<div class="card flush plainsurface"><div class="tq vtq">'
      + '<button class="btn sec sm" type="button" data-bin="restore-all">Restore selected</button>'
      + '<button class="btn sec sm danger" type="button" data-bin="purge-all">Delete selected for good</button></div>'
      + '<div class="tblwrap"><table class="tbl vt"><thead><tr><th class="ck"></th><th>Record</th><th>What it was</th>'
      + '<th data-person>Deleted by</th><th>Deleted</th><th>Why</th><th class="acts-c"></th></tr></thead><tbody>'
      + c.bin.map(function (r, i) {
        return '<tr data-i="' + i + '"><td class="ck"><input type="checkbox" aria-label="Select ' + esc(r[0]) + '"></td>'
          + '<td class="nm">' + esc(r[0]) + '</td><td>' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td><td class="mut">'
          + esc(r[3]) + '</td><td class="mut">' + esc(r[4]) + '</td><td class="acts-c">'
          + '<button class="btn sec sm" type="button" data-bin="restore">Restore</button>'
          + '<button class="btn sec sm danger" type="button" data-bin="purge">Delete for good</button></td></tr>';
      }).join('') + '</tbody></table></div><div class="tfoot"><span>' + c.bin.length + ' deleted '
      + (c.bin.length === 1 ? c.noun : c.nouns) + '</span></div></div>';

    panel.onclick = function (e) {
      var b = e.target.closest('[data-bin]');
      if (!b) return;
      var act = b.getAttribute('data-bin');
      var picked = act.indexOf('-all') > -1
        ? $$('tbody tr', panel).filter(function (tr) { return tr.querySelector('input').checked; })
        : [b.closest('tr')];
      if (!picked.length) { say('Tick the records first'); return; }
      var idx = picked.map(function (tr) { return +tr.getAttribute('data-i'); });
      var names = idx.map(function (i) { return c.bin[i][0]; });
      var finish = function () {
        c.bin = c.bin.filter(function (_, i) { return idx.indexOf(i) === -1; });
        drawBin(key, panel);
      };
      if (act.indexOf('restore') === 0) {
        finish();
        say(names.join(', ') + ' restored');
        return;
      }
      window.SugiraModal.ask({
        title: 'Delete ' + (names.length === 1 ? names[0] : names.length + ' records') + ' for good?',
        ok: 'Delete for good', danger: true,
        body: '<p class="m-lead">This cannot be undone.</p>',
        onOk: finish,
        done: names.length === 1 ? names[0] + ' deleted for good' : names.length + ' records deleted for good'
      });
    };
  }

  /* ---- generated reports ---- */
  function drawGen(key, panel, go) {
    var c = CFG[key];
    panel.innerHTML = '<div class="card flush plainsurface"><div class="tblwrap"><table class="tbl vt"><thead><tr>'
      + '<th>Report</th><th data-person>Built by</th><th>Conditions</th><th>Created</th><th class="num">Rows</th>'
      + '<th class="acts-c"></th></tr></thead><tbody>'
      + c.reports.map(function (r, i) {
        return '<tr data-i="' + i + '"><td class="nm"><button class="rel" type="button" data-gen="open">' + esc(r[0])
          + '</button></td><td>' + esc(r[1]) + '</td><td class="mut">' + esc(r[2]) + '</td><td class="mut">' + esc(r[3])
          + '</td><td class="num">' + fmt(r[4]) + '</td><td class="acts-c">'
          + '<button class="btn sec sm" type="button" data-gen="open">Open</button>'
          + (r[1] === ME ? '<button class="btn sec sm" type="button" data-gen="edit">Edit</button>'
            + '<button class="btn sec sm danger" type="button" data-gen="del">Delete</button>' : '')
          + '</td></tr>';
      }).join('') + '</tbody></table></div><div class="tfoot"><span>' + c.reports.length + (c.reports.length === 1 ? ' report' : ' reports') + '</span>'
      + '<button class="btn sm" type="button" data-gen="new"><svg aria-hidden="true"><use href="#i-plus"/></svg>New report</button></div></div>'
      + '<div class="vres"></div>';

    panel.onclick = function (e) {
      var b = e.target.closest('[data-gen]');
      if (!b) return;
      var act = b.getAttribute('data-gen');
      if (act === 'new') { go('build'); return; }
      var i = +b.closest('tr').getAttribute('data-i'), r = c.reports[i];
      if (act === 'edit') { CFG[key].editing = i; go('build'); return; }
      if (act === 'del') {
        window.SugiraModal.ask({
          title: 'Delete “' + r[0] + '”?', ok: 'Delete', danger: true,
          body: '<p class="m-lead">The report goes; the data it read stays.</p>',
          onOk: function () { c.reports.splice(i, 1); drawGen(key, panel, go); },
          done: 'Report deleted'
        });
        return;
      }
      result(key, r, $('.vres', panel));
    };
  }

  /* Opening a report is the data grid again, cut down by its conditions. */
  function result(key, r, host) {
    var c = CFG[key];
    var cols = (r[5] || c.fields.slice(0, 6));
    var rows = [];
    for (var n = 0; n < Math.min(5, r[4]); n++) {
      rows.push(cols.map(function (f, j) { return sample(key, f, n, j); }));
    }
    host.innerHTML = '<div class="card flush plainsurface"><div class="card-h vres-h"><h3>' + esc(r[0]) + '</h3>'
      + '<span class="side"><span class="chip">' + esc(r[2]) + '</span>'
      + '<button class="btn sec sm" type="button" data-x="csv"><svg aria-hidden="true"><use href="#i-download"/></svg>Export CSV</button>'
      + '<button class="btn sec sm" type="button" data-x="xls"><svg aria-hidden="true"><use href="#i-download"/></svg>Export Excel</button></span></div>'
      + '<div class="tblwrap"><table class="tbl vt"><thead><tr>' + cols.map(function (f) { return '<th>' + esc(f) + '</th>'; }).join('')
      + '</tr></thead><tbody>' + rows.map(function (rw) {
        return '<tr>' + rw.map(function (v) { return '<td>' + esc(v) + '</td>'; }).join('') + '</tr>';
      }).join('') + '</tbody></table></div><div class="tfoot"><span>Showing ' + rows.length + ' of ' + fmt(r[4]) + '</span></div></div>';
    host.querySelector('[data-x="csv"]').onclick = function () { say(fmt(r[4]) + ' rows exported as CSV'); };
    host.querySelector('[data-x="xls"]').onclick = function () { say(fmt(r[4]) + ' rows exported as Excel'); };
    host.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  var SAMPLE = {
    id: ['I-534-107', 'I-221-142', 'I-531-988', 'I-535-133', 'I-224-204'],
    who: ['Mukamana Jeanne', 'Nshimiyimana Claude', 'Uwase Marie', 'Habimana Eric', 'Ingabire Alice'],
    district: ['Ngoma', 'Nyanza', 'Ngoma', 'Kirehe', 'Nyanza'],
    sector: ['Kibungo', 'Kigoma', 'Jarama', 'Mahama', 'Busasamana'],
    izu: ['M. Dusabe', 'J. Kamanzi', 'E. Mutesi', 'J. Kamanzi', 'A. Nyirahabimana'],
    date: ['28 Oct 2026', '27 Oct 2026', '24 Oct 2026', '22 Oct 2026', '20 Oct 2026']
  };
  function sample(key, f, n, j) {
    var t = f.toLowerCase();
    if (/household id|^record/.test(t)) return SAMPLE.id[n];
    if (/visit id/.test(t)) return 'VIS-88' + (41 - n);
    if (/case id/.test(t)) return ['RH-0044', 'RH-0045', 'RH-0041', 'RH-0038', 'RH-0035'][n];
    if (/referral id/.test(t)) return ['RF-0112', 'RF-0109', 'RF-0107', 'RF-0104', 'RF-0101'][n];
    if (/response id/.test(t)) return 'R-551' + (40 - n);
    if (/caregiver/.test(t)) return SAMPLE.who[n];
    if (/district/.test(t)) return SAMPLE.district[n];
    if (/sector/.test(t)) return SAMPLE.sector[n];
    if (/province/.test(t)) return /Nyanza/.test(SAMPLE.district[n]) ? 'Southern' : 'Eastern';
    if (/izu|by$|filled|recorded|raised by|referred by/.test(t)) return SAMPLE.izu[n];
    if (/date|raised$|sent$|submitted|last visit|enrolled/.test(t)) return SAMPLE.date[n];
    if (/module/.test(t)) return String(6 - n);
    if (/cohort/.test(t)) return String(1 + (n % 2));
    if (/minutes/.test(t)) return String(42 + n * 3);
    if (/status|outcome/.test(t)) return n ? 'Active' : 'Behind';
    return '—';
  }

  /* ---- report builder ---- */
  function drawBuild(key, panel, go) {
    var c = CFG[key];
    var editing = c.editing != null ? c.reports[c.editing] : null;
    var opts = function (sel) {
      return c.fields.map(function (f) { return '<option' + (f === sel ? ' selected' : '') + '>' + esc(f) + '</option>'; }).join('');
    };
    panel.innerHTML = '<div class="card rb">'
      + '<div class="rb-row"><label for="rb-name">Report name</label><input id="rb-name" type="text" value="'
      + esc(editing ? editing[0] : '') + '" placeholder="Name it the way people will look for it"></div>'
      + '<div class="rb-row"><span class="rb-l" id="rb-il">Indicators</span><div class="rb-ind" role="group" aria-labelledby="rb-il">'
      + c.fields.map(function (f, i) {
        return '<label class="rb-ck"><input type="checkbox"' + (i < 6 ? ' checked' : '') + ' value="' + esc(f) + '">' + esc(f) + '</label>';
      }).join('') + '</div></div>'
      + '<div class="rb-row"><span class="rb-l">Conditions</span><div class="rb-conds"></div>'
      + '<button class="btn sec sm" type="button" data-rb="cond"><svg aria-hidden="true"><use href="#i-plus"/></svg>Add a condition</button></div>'
      + '<div class="cols c2e"><div class="rb-row"><label for="rb-g">Group by</label><select id="rb-g"><option>Nothing</option>' + opts() + '</select></div>'
      + '<div class="rb-row"><label for="rb-o">Order by</label><div class="rb-pair"><select id="rb-o">' + opts(c.fields[0]) + '</select>'
      + '<select id="rb-od" aria-label="Direction"><option>Ascending</option><option>Descending</option></select></div></div></div>'
      + '<div class="rb-row"><label for="rb-who">Who can open it</label><select id="rb-who"><option>Only me</option>'
      + '<option>Everyone who can see this data</option><option>My district</option><option>National team</option></select></div>'
      + '<div class="rb-foot"><button class="btn sec" type="button" data-rb="cancel">Cancel</button>'
      + '<button class="btn" type="button" data-rb="save">' + (editing ? 'Save changes' : 'Save report') + '</button></div></div>';

    var conds = $('.rb-conds', panel);
    function addCond(f, op, val) {
      var row = document.createElement('div');
      row.className = 'rb-cond';
      row.innerHTML = '<select aria-label="Field">' + opts(f) + '</select><select aria-label="Operator">'
        + ['is', 'is not', 'contains', 'is more than', 'is less than', 'is empty'].map(function (o) {
          return '<option' + (o === op ? ' selected' : '') + '>' + o + '</option>';
        }).join('') + '</select><input type="text" aria-label="Value" value="' + esc(val || '') + '">'
        + '<button class="btn sec sm" type="button" data-rb="rm" aria-label="Remove this condition"><svg aria-hidden="true"><use href="#i-cross"/></svg></button>';
      conds.appendChild(row);
    }
    addCond(c.fields[c.fields.length - 2] || c.fields[0], 'is', '');

    panel.onclick = function (e) {
      var b = e.target.closest('[data-rb]');
      if (!b) return;
      var act = b.getAttribute('data-rb');
      if (act === 'cond') { addCond(c.fields[0], 'is', ''); return; }
      if (act === 'rm') { b.closest('.rb-cond').remove(); return; }
      if (act === 'cancel') { c.editing = null; go('gen'); return; }
      var name = $('#rb-name', panel).value.trim();
      if (!name) { $('#rb-name', panel).focus(); say('Give the report a name'); return; }
      var picked = $$('.rb-ind input:checked', panel).map(function (x) { return x.value; });
      var where = $$('.rb-cond', panel).map(function (r) {
        var s = r.querySelectorAll('select'), v = r.querySelector('input').value.trim();
        return v || s[1].value === 'is empty' ? s[0].value + ' ' + s[1].value + (v ? ' ' + v : '') : '';
      }).filter(Boolean);
      var g = $('#rb-g', panel).value;
      if (g !== 'Nothing') where.push('grouped by ' + g);
      var rep = [name, ME, where.join(' · ') || 'Everything', today(), Math.max(1, Math.round(Math.random() * 300)), picked];
      if (c.editing != null) c.reports[c.editing] = rep; else c.reports.unshift(rep);
      c.editing = null;
      say('“' + name + '” saved to Generated reports');
      go('gen');
    };
  }

  /* ---- follow-ups ----
     The partners' own screen: Add follow up (date, status, comment, Submit)
     and Follow up history underneath, both open. */
  var FU = {
    'RH-0044': [
      ['M. Dusabe', '28 Oct 2026 14:38', 'Active', 'Flag raised at the Module 6 visit. The youngest child, aged 2, showed signs of inadequate feeding.'],
      ['C. Uwimana', '29 Oct 2026 09:10', 'Active', 'Mother contacted by phone. Agreed to a growth check at Kabare health centre.']
    ],
    'RH-0041': [['M. Dusabe', '24 Oct 2026 11:02', 'Active', 'Raised at the Module 3 visit.'],
      ['B. Nkurunziza', '29 Oct 2026 15:20', 'Stabilized', 'Seen by the district CPWO. Family supported with food.']],
    'RF-0112': [
      ['J. Kamanzi', '31 Oct 2026 10:15', 'Active', 'Referral sent to Kabare health centre for a growth check.'],
      ['M. Dusabe', '3 Nov 2026 16:40', 'Active', 'Mother says the appointment is on 10 November.']
    ],
    'RF-0109': [['J. Kamanzi', '27 Oct 2026 08:30', 'Active', 'Sent to the district CPWO, Ngoma.']]
  };
  var FU_STATUS = ['Active', 'Stabilized', 'Closed'];

  function initials(n) { return n.replace(/[^A-Z]/g, '').slice(0, 2); }
  function chipFor(s) { return s === 'Closed' ? 'ok' : s === 'Stabilized' ? '' : 'warn'; }

  function followups(host) {
    var id = host.getAttribute('data-fu');
    var list = host._fuList = FU[id] || (FU[id] = []);
    host.classList.add('fu');
    host.innerHTML = '<div class="card fu-add"><div class="card-h"><h3>Add follow up</h3></div>'
      + '<div class="fu-form"><div><label><span>Date <b class="req">*</b></span><input type="date" value="2026-11-15" data-f="date"></label></div>'
      + '<div><label><span>Status <b class="req">*</b></span><select data-f="status">' + FU_STATUS.map(function (s) {
        return '<option>' + s + '</option>'; }).join('') + '</select></label></div>'
      + '<div><label><span>Comment <b class="req">*</b></span><textarea rows="3" data-f="text"></textarea></label></div>'
      + '<div><button class="btn" type="button" data-f="go">Submit</button></div></div></div>'
      + '<div class="card fu-hist"><div class="card-h"><h3>Follow up history</h3><span class="side"><span class="chip">'
      + list.length + '</span></span></div><div class="fu-list"></div></div>';
    function draw() {
      list = host._fuList;
      var box = $('.fu-list', host);
      $('.fu-hist .chip', host).textContent = String(list.length);
      box.innerHTML = list.length ? list.slice().reverse().map(function (x, k) {
        var i = list.length - 1 - k;
        return '<div class="fu-e" data-i="' + i + '"><span class="av">' + esc(initials(x[0])) + '</span><div class="fu-b"><div class="fu-m"><b>'
          + esc(x[0]) + '</b><span class="mut">' + esc(x[1]) + '</span><span class="chip ' + chipFor(x[2]) + '"><i></i>'
          + esc(x[2]) + '</span><span class="rowacts fu-acts"><a data-fe="edit">Edit</a><a data-fe="del">Delete</a></span></div><p>'
          + esc(x[3]) + '</p></div></div>';
      }).join('') : '<p class="empty-line">No follow-up yet</p>';
    }
    draw();
    if (host._fuBound) return;
    host._fuBound = true;
    host.addEventListener('click', function (e) {
      list = host._fuList;
      var fe = e.target.closest('[data-fe]');
      if (fe) {
        var i = +fe.closest('.fu-e').getAttribute('data-i'), x = list[i];
        if (fe.getAttribute('data-fe') === 'del') {
          var gone = list.splice(i, 1)[0];
          draw();
          say('Follow-up deleted', { label: 'Undo', onClick: function () { list.splice(i, 0, gone); draw(); } });
          return;
        }
        window.SugiraModal.ask({
          title: 'Change this follow-up', ok: 'Save',
          body: '<div><label for="f-fes">Status</label><select id="f-fes">' + FU_STATUS.map(function (s) {
            return '<option' + (s === x[2] ? ' selected' : '') + '>' + s + '</option>'; }).join('') + '</select></div>'
            + '<div><label for="f-fet">Comment</label><textarea id="f-fet" rows="3">' + esc(x[3]) + '</textarea></div>',
          onOk: function (body) { x[2] = body.querySelector('#f-fes').value; x[3] = body.querySelector('#f-fet').value; draw(); },
          done: 'Follow-up changed'
        });
        return;
      }
      if (!e.target.closest('[data-f="go"]')) return;
      var d = $('[data-f="date"]', host).value, s = $('[data-f="status"]', host).value;
      var t = $('[data-f="text"]', host).value.trim();
      if (!d || !t) { say('Date and comment are both needed'); ($('[data-f="text"]', host)).focus(); return; }
      var dt = new Date(d + 'T00:00:00');
      list.push([ME, dt.getDate() + ' ' + MONTHS[dt.getMonth()] + ' ' + dt.getFullYear(), s, t]);
      $('[data-f="text"]', host).value = '';
      draw();
      say('Follow-up added · ' + s);
    });
  }


  /* ---- a row opens its own record ----
     One risk-of-harm screen and one referral screen stand for all of them;
     the row clicked says which one is being read. */
  function carryIdentity() {
    var pending = null;
    document.addEventListener('click', function (e) {
      var tr = e.target.closest('tr[data-go="case"], tr[data-go="referral"]');
      if (!tr || e.target.closest('button.rel, a')) return;
      var key = tr.getAttribute('data-go');
      var first = tr.cells[0] ? tr.cells[0].textContent.trim() : '';
      var id = tr.getAttribute('data-recid') || (/^(RH|RF)-\d+$/.test(first) ? first : '');
      if (!id) return;
      var title = tr.getAttribute('data-title') || (/^(RH|RF)-/.test(first) ? '' : first);
      var chip = tr.querySelector('.chip');
      var heads = tr.closest('table') ? [].map.call(tr.closest('table').querySelectorAll('thead th'), function (h) { return h.textContent.trim().toLowerCase(); }) : [];
      var pi = heads.indexOf('place');
      pending = { key: key, id: id, title: title, status: chip ? chip.textContent.trim().replace('Stabilised', 'Stabilized') : '',
        place: pi > -1 && tr.cells[pi] ? tr.cells[pi].textContent.trim() : '' };
      setTimeout(apply, 0);
    }, true);
    document.addEventListener('click', function (e) {
      var b = e.target.closest('button.rel[data-go="case"], button.rel[data-go="referral"], button[data-recid]');
      if (!b) return;
      var id = b.getAttribute('data-recid') || b.textContent.trim();
      if (!/^(RH|RF)-\d+$/.test(id)) return;
      pending = { key: b.getAttribute('data-go'), id: id, title: b.getAttribute('data-title') || '', status: '' };
      setTimeout(apply, 0);
    }, true);
    function apply() {
      if (!pending) return;
      var p = pending; pending = null;
      var sc = document.getElementById('s-' + p.key);
      if (!sc) return;
      var rid = $('.rec-id', sc), was = rid ? rid.textContent : '';
      if (rid) rid.textContent = p.id;
      /* the crumbs name the record too */
      var sd = window.SugiraScreens && window.SugiraScreens[p.key];
      if (sd && sd.crumbs && sd.crumbs.length) sd.crumbs[sd.crumbs.length - 1][0] = p.id;
      $$('#dwCrumbs *, #crumbs *').forEach(function (n) {
        if (n.children.length === 0 && n.textContent.trim() === was) n.textContent = p.id;
      });
      if (p.place) {
        $$('.pg .pgr', sc).forEach(function (row) {
          var k = $('.k', row), v = $('.v', row);
          if (k && v && k.textContent.trim() === 'Place' && !$('.rel, .lnk-off', v)) v.textContent = p.place;
        });
      }
      if (p.title) { var h = $('h1', sc); if (h) h.textContent = p.title; }
      if (p.status) { var bd = $('.pg .pg-badge', sc); if (bd) bd.textContent = p.status; }
      $$('[data-fu]', sc).forEach(function (host) {
        if (host.getAttribute('data-fu') === p.id) return;
        host.setAttribute('data-fu', p.id);
        followups(host);
      });
    }
  }


  /* ---- Delete on a list row ---- */
  function rowDelete() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest('[data-rowdel]');
      if (!a) return;
      e.preventDefault();
      e.stopPropagation();
      var tr = a.closest('tr');
      var name = tr && tr.querySelector('.nm') ? tr.querySelector('.nm').textContent.trim() : 'this row';
      window.SugiraModal.ask({
        title: 'Delete “' + name + '”?', ok: 'Delete', danger: true, body: '',
        onOk: function () {
          tr.hidden = true;
          tr.classList.add('q-out');
          say('“' + name + '” deleted', { label: 'Undo', onClick: function () { tr.hidden = false; tr.classList.remove('q-out'); } });
        }
      });
    }, true);
  }

  /* ---- one record's list on a household: click a row, read its card ---- */
  function caseLists() {
    $$('[data-caselist]').forEach(function (tbl) {
      tbl.addEventListener('click', function (e) {
        var tr = e.target.closest('tbody tr[data-open]');
        if (!tr) return;
        var id = tr.getAttribute('data-open');
        var scope = tbl.closest('[data-panelid]') || document;
        $$('tbody tr', tbl).forEach(function (r) { r.classList.toggle('cur', r === tr); });
        $$('[data-casecard]', scope).forEach(function (c) { c.hidden = c.getAttribute('data-casecard') !== id; });
      });
    });
  }

  /* ---- Edit and Delete on every record ---- */
  var MODS = ['Welcome session'].concat(Array.apply(null, Array(12)).map(function (_, i) { return 'Module ' + (i + 1); }), ['Closing session']);
  var PICK = {
    cohort: ['Cohort 1 · 2026', 'Cohort 2 · 2026', 'Cohort 3 · 2026', 'Cohort 4 · 2026'],
    village: ['Kabare', 'Rugarama', 'Nyakabungo', 'Kigabiro', 'Gahima'],
    place: ['Kabare village', 'Rugarama village', 'Nyakabungo village', 'Kigabiro village', 'Gahima village'],
    sector: ['Kibungo', 'Jarama', 'Sake', 'Kigoma', 'Busasamana', 'Mahama', 'Gisenyi', 'Kinigi'],
    district: ['Ngoma', 'Kirehe', 'Nyanza', 'Rubavu', 'Musanze'],
    izu: ['M. Dusabe', 'J. Kamanzi', 'B. Uwamahoro', 'A. Mukeshimana', 'D. Niyonsaba'],
    supervisor: ['C. Uwimana', 'E. Mutesi', 'P. Hakizimana'],
    module: MODS,
    'family type': ['Single mother-headed household', 'Two-parent household', 'Grandparent-headed household', 'Child-headed household'],
    'booster session': ['No', 'Yes']
  };
  var STATUS = {
    household: ['On track', 'Behind', 'Risk of harm'],
    visit: ['Completed', 'Not completed', 'Missed'],
    'case': ['Active', 'Stabilized', 'Closed'],
    referral: ['Active', 'Stabilized', 'Closed'],
    person: ['Active', 'Inactive']
  };
  /* worked out by the system, never typed */
  var FIXED = /^(minutes|sent in|when|form|forms|enrolled|joined|last active|created|created by|time expected|latest module|recorded by|raised at|review due|translated|submitted|opened|version|household|head of household|members|visits)$/i;
  function pickFor(label, key) {
    var l = label.toLowerCase().replace(/^izu at /, '');
    if (l === 'status') return STATUS[key] || null;
    if (PICK[l]) return PICK[l];
    if (/^izu|visited by|home visitor/.test(l)) return PICK.izu;
    if (/supervisor|sat in/.test(l)) return PICK.supervisor;
    if (/^module$|raised at/.test(l)) return PICK.module;
    if (/cohort/.test(l)) return PICK.cohort;
    if (/village/.test(l)) return PICK.village;
    if (/^place|location/.test(l)) return PICK.place;
    if (/sector/.test(l)) return PICK.sector;
    if (/district/.test(l)) return PICK.district;
    return null;
  }
  /* the value a field holds, without the line under it */
  function valueOf(v) {
    var c = v.cloneNode(true);
    $$('.conseq, svg', c).forEach(function (n) { n.remove(); });
    var t = c.textContent.replace(/\s+/g, ' ').trim();
    return t === '—' ? '' : t;
  }
  /* write a value back, keeping the link and the line under it */
  function setValue(v, val) {
    var holder = $('.pg-badge', v) || $('.rel', v) || $('.lnk-off', v);
    if (holder) {
      var tn = Array.prototype.filter.call(holder.childNodes, function (n) { return n.nodeType === 3 && n.textContent.trim(); }).pop();
      if (tn) tn.textContent = val; else holder.appendChild(document.createTextNode(val));
      return;
    }
    var first = Array.prototype.filter.call(v.childNodes, function (n) { return n.nodeType === 3; })[0];
    if (!val) { v.innerHTML = '&mdash;'; v.classList.add('empty'); v.closest('.pgr').classList.add('is-empty'); return; }
    v.classList.remove('empty'); v.closest('.pgr').classList.remove('is-empty');
    if (first && v.textContent.trim() !== '—') first.textContent = val + ' ';
    else v.textContent = val;
  }

  function editRecord(rec) {
    var screen = rec.closest('.screen');
    var key = screen ? screen.id.replace(/^s-/, '') : '';
    var id = ($('.rec-id', rec) || {}).textContent || '';
    var fields = [];
    var h1 = $('h1', rec), alt = $('.rec-alt', rec);
    if (key === 'module') {
      fields.push({ label: 'Module name', el: h1, val: h1.textContent.trim() });
      if (alt) fields.push({ label: 'Module name in Kinyarwanda', el: alt, val: alt.textContent.trim() });
      fields.push({ label: 'Booster session', el: null, val: rec.getAttribute('data-booster') || 'No', list: PICK['booster session'] });
    } else if (key === 'person' || key === 'form') {
      fields.push({ label: key === 'form' ? 'Form name' : 'Full name', el: h1, val: h1.textContent.trim() });
    }
    $$('.pg .pgr', rec).forEach(function (row) {
      var k = $('.k > span:last-child', row) || $('.k span', row), v = $('.v', row);
      if (!k || !v) return;
      var label = k.textContent.trim();
      if (FIXED.test(label) || key === 'module' && /^module$/i.test(label)) return;
      fields.push({ label: label, el: v, val: valueOf(v), list: pickFor(label, key) });
    });
    var body = fields.map(function (f, i) {
      var fid = 'f-ed' + i, inner;
      if (f.list) {
        var list = f.val && f.list.indexOf(f.val) === -1 ? [f.val].concat(f.list) : f.list;
        inner = '<select id="' + fid + '">' + list.map(function (o) {
          return '<option' + (o === f.val ? ' selected' : '') + '>' + esc(o) + '</option>'; }).join('') + '</select>';
      } else {
        inner = '<input id="' + fid + '" type="text" value="' + esc(f.val) + '">';
      }
      return '<div><label for="' + fid + '">' + esc(f.label) + '</label>' + inner + '</div>';
    }).join('');
    window.SugiraModal.ask({
      title: 'Edit ' + (id || (h1 ? h1.textContent.trim() : 'this record')), ok: 'Save changes',
      body: body,
      onOk: function (box) {
        fields.forEach(function (f, i) {
          var inp = box.querySelector('#f-ed' + i);
          if (!inp) return;
          var val = inp.value.trim();
          if (val === f.val) return;
          if (!f.el) { rec.setAttribute('data-booster', val); return; }
          if (f.el === h1 || f.el === alt) { f.el.textContent = val; return; }
          setValue(f.el, val);
        });
      },
      done: 'Changes saved'
    });
  }

  function deleteRecord(rec) {
    var screen = rec.closest('.screen');
    var key = screen ? screen.id.replace(/^s-/, '') : '';
    var title = ($('h1', rec) || {}).textContent || '';
    var id = ($('.rec-id', rec) || {}).textContent || title || 'This record';
    var listKey = { household: 'households', visit: 'visits', 'case': 'safeguarding', referral: 'referrals' }[key];
    window.SugiraModal.ask({
      title: 'Delete ' + id + '?', ok: 'Delete', danger: true,
      body: '<p class="m-lead">It moves to Recycled data, where it can be restored.</p>',
      onOk: function () {
        if (listKey && CFG[listKey]) CFG[listKey].bin.unshift([id, title, ME, today(), 'Deleted from its record']);
        /* A row opened as a record goes from its list too. */
        var row = key === 'record' && window.SugiraRecordRow;
        if (row) { row.hidden = true; row.classList.add('q-out'); }
        var close = document.querySelector('#dw:not([hidden]) [data-dw="close"]');
        if (close) close.click();
        if (listKey && window.SugiraGo) window.SugiraGo(listKey);
      },
      done: id + ' moved to Recycled data'
    });
  }

  function recordActions() {
    $$('.rec-top').forEach(function (top) {
      var acts = $('.acts', top);
      if (!acts) { acts = document.createElement('span'); acts.className = 'acts'; top.appendChild(acts); }
      if ($('[data-rec-act]', acts)) return;
      if (top.closest('[data-noedit]')) return;
      var ed = document.createElement('button');
      ed.className = 'btn sec sm';
      ed.type = 'button';
      ed.setAttribute('data-rec-act', 'edit');
      ed.innerHTML = '<svg aria-hidden="true"><use href="#i-edit"/></svg> Edit';
      var del = document.createElement('button');
      del.className = 'btn sec sm danger';
      del.type = 'button';
      del.setAttribute('data-rec-act', 'delete');
      del.innerHTML = '<svg aria-hidden="true"><use href="#i-cross"/></svg> Delete';
      acts.appendChild(ed);
      acts.appendChild(del);
    });
    document.addEventListener('click', function (e) {
      var b = e.target.closest('[data-rec-act]');
      if (!b) return;
      var rec = b.closest('.rec');
      if (!rec) return;
      if (b.getAttribute('data-rec-act') === 'edit') editRecord(rec); else deleteRecord(rec);
    });
  }

  /* ---- a form's access, five kinds, each one editable where it is shown ---- */
  var ORGS = ['FXB Rwanda · Head office', 'FXB Rwanda · Monitoring & evaluation', 'FXB Rwanda · Field delivery',
              'NCDA · Child protection', 'University of Rwanda · Research', 'Boston College · Research'];
  function access() {
    var host = document.querySelector('#s-form [data-panelid="access"]');
    if (!host) return;
    host.addEventListener('click', function (e) {
      var b = e.target.closest('[data-acc]');
      if (!b) return;
      var card = b.closest('[data-acc-kind]'), kind = card.getAttribute('data-acc-kind');
      var act = b.getAttribute('data-acc'), row = b.closest('.lr');
      if (act === 'remove') {
        var name = $('.t', row).textContent;
        row.remove();
        say(name + ' removed from ' + kind.toLowerCase(), { label: 'Undo', onClick: function () { card.appendChild(row); } });
        return;
      }
      var cur = row ? $('.t', row).textContent : '';
      window.SugiraModal.ask({
        title: (act === 'add' ? 'Add to ' : 'Change ') + kind.toLowerCase(),
        ok: act === 'add' ? 'Add' : 'Save',
        body: '<div><label for="f-acco">Organisation and department</label><select id="f-acco">' + ORGS.map(function (o) {
          return '<option' + (o === cur.replace(/ /g, ' ') ? ' selected' : '') + '>' + esc(o) + '</option>';
        }).join('') + '</select></div>',
        onOk: function (body) {
          var v = body.querySelector('#f-acco').value;
          if (row) { $('.t', row).textContent = v; return; }
          var r = document.createElement('div');
          r.className = 'lr';
          r.innerHTML = '<span class="t">' + esc(v) + '</span><span class="c rowacts"><a data-acc="update">Change</a><a data-acc="remove">Remove</a></span>';
          card.appendChild(r);
        },
        done: kind + ' saved'
      });
    });
  }

  /* ---- one person's permissions: their position's, plus or minus their own ----
     "Users get their position's permissions by default, with per-user
     additions and removals." A tick that differs from the position says so. */
  function personPerms() {
    var host = document.getElementById('ppBlock'), P = window.SugiraPerms;
    if (!host || !P) return;
    var pos = P.positions().filter(function (p) { return p.id === host.getAttribute('data-position'); })[0];
    var held = pos ? P.held(pos) : {};
    var own = { 'fs-community': true };
    host.innerHTML = P.groups.map(function (g) {
      var perms = P.all.filter(function (x) { return x.group === g.key; });
      if (!perms.length) return '';
      return '<div class="pgrp"><b>' + esc(g.name) + '</b>' + perms.map(function (x) {
        var on = !!held[x.id] !== !!own[x.id];
        return '<label class="rb-ck"><input type="checkbox" value="' + esc(x.id) + '"' + (on ? ' checked' : '')
          + ' data-base="' + (held[x.id] ? 1 : 0) + '">' + esc(x.label) + '<span class="pp-x"></span></label>';
      }).join('') + '</div>';
    }).join('');
    function mark(inp) {
      var base = inp.getAttribute('data-base') === '1', x = inp.parentNode.querySelector('.pp-x');
      x.textContent = inp.checked === base ? '' : inp.checked ? 'added for them' : 'removed for them';
      x.className = 'pp-x' + (inp.checked === base ? '' : inp.checked ? ' add' : ' rm');
    }
    $$('input', host).forEach(mark);
    host.addEventListener('change', function (e) { if (e.target.matches('input')) mark(e.target); });
    var save = document.querySelector('[data-pp="save"]');
    if (save) save.addEventListener('click', function () {
      var n = $$('.pp-x.add, .pp-x.rm', host).length;
      say(n ? n + ' change' + (n === 1 ? '' : 's') + ' to their position saved, for them only' : 'Nothing changed');
    });
  }

  /* ---- the partners' follow-up report: Apply narrows it ---- */
  function followupReport() {
    var go = document.getElementById('fur-apply'), t = document.getElementById('fur-t');
    if (!go || !t) return;
    go.addEventListener('click', function () {
      var pv = $('#fur-p').value, d = $('#fur-d').value, sc = $('#fur-s').value;
      var n = 0;
      $$('tbody tr', t).forEach(function (tr) {
        var c = tr.cells;
        var keep = (/^All/.test(pv) || c[1].textContent === pv) && (/^All/.test(d) || c[2].textContent === d)
          && (/^All/.test(sc) || c[3].textContent === sc);
        tr.hidden = !keep;
        if (keep) n++;
      });
      var show = function (v) { var x = new Date(v + 'T00:00:00'); return x.getDate() + ' ' + MONTHS[x.getMonth()] + ' ' + x.getFullYear(); };
      var total = /^All/.test(pv) && /^All/.test(d) && /^All/.test(sc) ? 538 : n * 7 + 3;
      $('#fur-n').textContent = 'Found ' + total + ' results between ' + show($('#fur-a').value) + ' and ' + show($('#fur-b').value);
    });
  }

  /* Rows deleted from a list's selection bar land in the same bin. */
  window.SugiraRecycle = {
    add: function (screenId, rows) {
      var key = String(screenId).replace(/^s-/, '');
      if (!CFG[key]) return;
      rows.forEach(function (r) { CFG[key].bin.unshift([r[0], r[1] || '', ME, today(), 'Deleted from the list']); });
    }
  };

  function boot() {
    ['households', 'visits', 'safeguarding', 'referrals'].forEach(function (k) {
      var s = document.getElementById('s-' + k);
      if (s) strip(k, s, s.firstElementChild);
    });
    /* A form's data carries the same views, under the form it belongs to;
       its reports sit in their own tab, after Access. */
    var fd = document.querySelector('#s-form [data-panelid="data"]');
    if (fd) strip('form', fd, fd.firstElementChild, ['data', 'dash', 'bin']);
    var fr = document.querySelector('#s-form [data-panelid="freports"]');
    if (fr) strip('form', fr, null, ['gen', 'build']);
    access();
    personPerms();
    followupReport();
    $$('[data-fu]').forEach(followups);
    carryIdentity();
    rowDelete();
    caseLists();
    recordActions();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
