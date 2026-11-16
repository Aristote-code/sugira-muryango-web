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
  function today() { return '6 Nov 2026'; }

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
        ['I-413-090', 'Ndayisaba Pierre', 'C. Uwimana', '24 Oct 2026', 'Moved out of the project area'],
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
      stats: [['Active', 3, 'bad'], ['Inactive', 31], ['Total', 34], ['Raised this month', 1]],
      charts: [
        { t: 'Risk of harm by type', rows: [['Neglect', 10], ['Severe malnutrition', 9], ['Physical', 8], ['Emotional', 4], ['Sexual', 2], ['Other', 1]] },
        { t: 'Who is at risk', rows: [['Child under 5', 21], ['Child 5–17', 8], ['Caregiver', 4], ['Other adult', 1]] }
      ],
      bin: [['RH-0040', 'withheld · Neglect', 'C. Uwimana', '27 Oct 2026', 'Raised twice for the same visit']],
      reports: [
        ['Open risk of harm by district', 'A. Gahimana', 'Status is Active · grouped by District', '5 Nov 2026', 3],
        ['Severe malnutrition cases, 2026', 'J. Kamanzi', 'Type is Severe malnutrition · Raised in 2026', '1 Nov 2026', 9]
      ]
    },
    referrals: {
      noun: 'referral', nouns: 'referrals',
      fields: ['Referral ID', 'Household ID', 'Out of case', 'Type', 'Referred to', 'Referred by', 'Sent',
               'District', 'Sector', 'Status', 'Latest follow-up'],
      stats: [['Active', 2, 'bad'], ['Stabilized', 1], ['Closed', 3], ['Total', 6]],
      charts: [
        { t: 'Referrals by type', rows: [['Child protection', 3], ['Health', 2], ['Social protection', 1]] },
        { t: 'Where they were sent', rows: [['District CPWO', 3], ['Health centre', 1], ['Health post', 1], ['Sector social worker', 1]] }
      ],
      bin: [['RF-0105', 'Health · withheld', 'J. Kamanzi', '25 Oct 2026', 'Sent to the wrong health centre']],
      reports: [['Referrals still open', 'A. Gahimana', 'Status is Active or Stabilized', '5 Nov 2026', 3]]
    },
    form: {
      noun: 'response', nouns: 'responses',
      fields: ['Response ID', 'Household ID', 'Submitted', 'Filled in by', 'Recorded by', 'District', 'Sector',
               'Village', 'Module', 'Q1 Who was present', 'Q2 Minutes', 'Q5 Any sign of harm or neglect', 'Q7 Insurance card', 'Q8 Referred to the health post'],
      stats: [['Responses', 1842], ['This week', 147], ['Flagged', 12, 'warn'], ['Median minutes', 42]],
      charts: [
        { t: 'Responses by module', rows: MODULES.slice(0, 8).map(function (m, i) {
          return ['Module ' + m, [312, 298, 270, 254, 201, 168, 129, 98][i]]; }) },
        { t: 'Responses by district', rows: [['Ngoma', 470], ['Rubavu', 400], ['Nyanza', 392], ['Kirehe', 330], ['Musanze', 250]] }
      ],
      bin: [['R-55120', 'I-534-107 · 30 Oct', 'M. Dusabe', '31 Oct 2026', 'Sent twice']],
      reports: [['Visits where a risk of harm was seen', 'A. Gahimana', 'Q5 Any sign of harm or neglect is Yes', '2 Nov 2026', 34]]
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

  /* ---- a row leaves its list, and can come back ----
     Deleting hides a row with its own mark, which no tab, filter or pager
     undoes, takes one off every count the row was part of, and leaves an
     entry in Recycled data that knows the row, so Restore puts it back. */
  var rows = {
    find: function (listKey, id) {
      var sc = document.getElementById('s-' + listKey);
      if (!sc || !id) return null;
      return $$('tbody tr', sc).filter(function (tr) {
        var first = tr.cells[0] ? tr.cells[0].textContent.trim() : '';
        var nm = tr.querySelector('.nm');
        return first === id || (nm && nm.textContent.trim() === id) || (tr.getAttribute('data-find') || '').split(' ')[0] === id;
      })[0] || null;
    },
    count: function (tr, d) {
      var sc = tr.closest('.screen');
      if (!sc) return;
      var tags = (tr.getAttribute('data-tags') || '').split(' ');
      $$('.tabs .tab[data-tab]', sc).forEach(function (t) {
        var k = t.getAttribute('data-tab');
        if (k !== 'all' && tags.indexOf(k) === -1) return;
        var c = $('.chip', t);
        if (!c) return;
        var n = parseInt(c.textContent.replace(/[^\d]/g, ''), 10);
        if (isNaN(n)) return;
        n = Math.max(0, n + d);
        c.textContent = fmt(n).replace(/ /g, '\u202f');
      });
      var tbl = tr.closest('table');
      if (tbl) tbl.dispatchEvent(new Event('filtered'));
    },
    remove: function (tr, screenId, why, what) {
      if (!tr || tr.classList.contains('r-gone')) return null;
      tr.classList.add('r-gone');
      rows.count(tr, -1);
      var key = String(screenId || '').replace(/^s-/, '');
      var nm = tr.querySelector('.nm') || tr.cells[0];
      var id = nm ? nm.textContent.trim() : '';
      var vid = (tr.getAttribute('data-find') || '').split(' ')[0];
      if (/^VIS-/.test(vid)) id = vid;
      var entry = [id, what || (tr.cells[2] || tr.cells[1] || {}).textContent || '', ME, today(), why];
      entry.tr = tr;
      if (CFG[key]) CFG[key].bin.unshift(entry);
      return entry;
    },
    restore: function (entry) {
      if (!entry || !entry.tr) return;
      entry.tr.classList.remove('r-gone');
      rows.count(entry.tr, 1);
      Object.keys(CFG).forEach(function (k) {
        var i = CFG[k].bin.indexOf(entry);
        if (i > -1) CFG[k].bin.splice(i, 1);
      });
    }
  };

  /* ---- recycled data ---- */
  function drawBin(key, panel) {
    var c = CFG[key];
    if (!c.bin.length) {
      panel.innerHTML = '<div class="card"><p class="empty-line">Nothing has been deleted</p></div>';
      return;
    }
    panel.innerHTML = '<div class="card flush plainsurface">'
      + '<div class="tblwrap"><table class="tbl vt" data-bulk="bin"><thead><tr><th>Record</th><th>What it was</th>'
      + '<th data-person>Deleted by</th><th>Deleted</th><th>Why</th><th class="acts-c"></th></tr></thead><tbody>'
      + c.bin.map(function (r, i) {
        return '<tr data-i="' + i + '">'
          + '<td class="nm">' + esc(r[0]) + '</td><td>' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td><td class="mut">'
          + esc(r[3]) + '</td><td class="mut">' + esc(r[4]) + '</td><td class="acts-c">'
          + '<button class="btn sec sm" type="button" data-bin="restore">Restore</button>'
          + '<button class="btn sec sm danger" type="button" data-bin="purge">Delete for good</button></td></tr>';
      }).join('') + '</tbody></table></div><div class="tfoot"><span>' + c.bin.length + ' deleted '
      + (c.bin.length === 1 ? c.noun : c.nouns) + '</span></div></div>';

    function act(act, picked) {
      var idx = picked.map(function (tr) { return +tr.getAttribute('data-i'); });
      var names = idx.map(function (i) { return c.bin[i][0]; });
      var finish = function () {
        c.bin = c.bin.filter(function (_, i) { return idx.indexOf(i) === -1; });
        drawBin(key, panel);
      };
      if (act.indexOf('restore') === 0) {
        var back = idx.map(function (i) { return c.bin[i]; });
        back.forEach(function (en) { if (en.tr) rows.restore(en); });
        c.bin = c.bin.filter(function (en) { return back.indexOf(en) === -1; });
        drawBin(key, panel);
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
    }
    panel.onclick = function (e) {
      var b = e.target.closest('[data-bin]');
      if (b) act(b.getAttribute('data-bin'), [b.closest('tr')]);
    };
    var tbl = $('table', panel);
    if (tbl) tbl.addEventListener('bulk:bin', function (e) { act(e.detail.act, e.detail.rows); });
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
            + '<button class="btn sec sm danger" type="button" data-gen="del">Delete</button>'
            /* Only the maker changes or removes a report. The places stay, so
               every row's Open sits in the same column. */
            : '<span class="gen-gap" aria-hidden="true"><button class="btn sec sm" type="button" tabindex="-1">Edit</button><button class="btn sec sm" type="button" tabindex="-1">Delete</button></span>')
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
    var real = window.SugiraRecData && window.SugiraRecData.rows(key, cols, r[2]);
    var rows = [];
    if (real) rows = real.slice(0, 5);
    else for (var n = 0; n < Math.min(5, r[4]); n++) {
      rows.push(cols.map(function (f, j) { return sample(key, f, n, j); }));
    }
    host.innerHTML = '<div class="card flush plainsurface"><div class="card-h vres-h"><h3>' + esc(r[0]) + '</h3>'
      + '<span class="side"><span class="chip">' + esc(r[2]) + '</span>'
      + '<button class="btn sec sm" type="button" data-x="csv"><svg aria-hidden="true"><use href="#i-download"/></svg>Export CSV</button>'
      + '<button class="btn sec sm" type="button" data-x="xls"><svg aria-hidden="true"><use href="#i-download"/></svg>Export Excel</button></span></div>'
      + '<div class="tblwrap"><table class="tbl vt"><thead><tr>' + cols.map(function (f) { return '<th>' + esc(f) + '</th>'; }).join('')
      + '</tr></thead><tbody>' + rows.map(function (rw) {
        return '<tr>' + rw.map(function (v) { return '<td>' + esc(v) + '</td>'; }).join('') + '</tr>';
      }).join('') + (rows.length ? '' : '<tr><td class="mut" colspan="' + cols.length + '">Nothing matches</td></tr>')
      + '</tbody></table></div><div class="tfoot"><span>' + (rows.length ? 'Showing ' + rows.length + ' of ' + fmt(Math.max(r[4], rows.length)) : 'Nothing matches') + '</span></div></div>';
    host.querySelector('[data-x="csv"]').onclick = function () { say(fmt(r[4]) + ' rows exported as CSV'); };
    host.querySelector('[data-x="xls"]').onclick = function () { say(fmt(r[4]) + ' rows exported as Excel'); };
    host.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  var SAMPLE = {
    id: ['I-534-107', 'I-221-142', 'I-531-988', 'I-535-133', 'I-224-204'],
    who: ['Mukamana Jeanne', 'Nshimiyimana Claude', 'Uwase Marie', 'Habimana Eric', 'Ingabire Alice'],
    district: ['Ngoma', 'Nyanza', 'Ngoma', 'Kirehe', 'Nyanza'],
    sector: ['Kibungo', 'Kigoma', 'Jarama', 'Mahama', 'Busasamana'],
    izu: ['M. Dusabe', 'P. Mukamurenzi', 'V. Nyiraneza', 'D. Niyonsaba', 'A. Nyirahabimana'],
    date: ['28 Oct 2026', '27 Oct 2026', '24 Oct 2026', '22 Oct 2026', '20 Oct 2026']
  };
  function sample(key, f, n, j) {
    var t = f.toLowerCase();
    if (/household id|^record$/.test(t)) return SAMPLE.id[n];
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
      + esc(editing ? editing[0] : '') + '" placeholder="Families behind schedule in Ngoma"></div>'
      + '<div class="rb-row"><span class="rb-l" id="rb-il">Indicators</span><div class="rb-ind" role="group" aria-labelledby="rb-il">'
      + c.fields.map(function (f, i) {
        /* The household stays withheld on a case or a referral, here as everywhere. */
        var tick = i < 6 && !(/^Household ID$/.test(f) && (key === 'safeguarding' || key === 'referrals'));
        return '<label class="rb-ck"><input type="checkbox"' + (tick ? ' checked' : '') + ' value="' + esc(f) + '">' + esc(f) + '</label>';
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
        }).join('') + '</select><input type="text" aria-label="Value" placeholder="Value" value="' + esc(val || '') + '">'
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
  /* Each case's history is written with the case, in recdata.js, which
     fills this in as a record opens. */
  var FU = {};
  var FU_STATUS = ['Active', 'Stabilized', 'Closed'];

  function initials(n) { return n.replace(/[^A-Z]/g, '').slice(0, 2); }
  function chipFor(s) { return s === 'Closed' ? 'ok' : s === 'Stabilized' ? '' : 'warn'; }

  function followups(host) {
    var id = host.getAttribute('data-fu');
    var list = host._fuList = FU[id] || (FU[id] = []);
    host.classList.add('fu');
    host.innerHTML = '<div class="card fu-add"><div class="card-h"><h3>Add follow-up</h3></div>'
      + '<div class="fu-form"><div><label><span>Date <b class="req">*</b></span><input type="date" value="2026-11-06" data-f="date"></label></div>'
      + '<div><label><span>Status <b class="req">*</b></span><select data-f="status">' + FU_STATUS.map(function (s) {
        return '<option>' + s + '</option>'; }).join('') + '</select></label></div>'
      + '<div><label><span>Comment <b class="req">*</b></span><textarea rows="3" data-f="text"></textarea></label></div>'
      + '<div><button class="btn" type="button" data-f="go">Submit</button></div></div></div>'
      + '<div class="card fu-hist"><div class="card-h"><h3>Follow-up history</h3><span class="side"><span class="chip">'
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
          onOk: function (body) {
            x[2] = body.querySelector('#f-fes').value; x[3] = body.querySelector('#f-fet').value; draw();
            if (x === list[list.length - 1]) document.dispatchEvent(new CustomEvent('fu:added', { detail: { id: id, status: x[2] } }));
          },
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
      document.dispatchEvent(new CustomEvent('fu:added', { detail: { id: id, status: s } }));
    });
  }


  /* ---- a chart opens the records behind it ----
     ClickUp: click a slice and the tasks in it are listed. Each ring segment,
     bar, district row and heatmap cell on the dashboard opens its list,
     filtered to what it counted, in the place the dashboard is filtered to. */
  function drill() {
    var dash = document.getElementById('s-dashboard');
    if (!dash) return;
    function mark(el, target, tip) {
      if (!el) return;
      el.setAttribute('data-drill', JSON.stringify(target));
      el.setAttribute('role', 'button');
      el.tabIndex = 0;
      el.classList.add('drill');
      if (tip) el.setAttribute('aria-label', tip);
    }
    var RINGS = {
      roh: [{ go: 'safeguarding', tab: 'Open' }, { go: 'safeguarding', tab: 'Closed' }],
      visits: [{ go: 'visits', tab: 'Completed' }, { go: 'visits', tab: 'Not completed' }],
      izu: [{ go: 'izu', tab: 'All' }, { go: 'people', tab: 'Deactivated' }],
      male: [{ go: 'visits' }, { go: 'visits' }]
    };
    Object.keys(RINGS).forEach(function (k) {
      var dn = $('[data-donut="' + k + '"]', dash);
      if (!dn) return;
      var segs = $$('.dn-s', dn), lg = $$('.legend span', dn.closest('.card'));
      RINGS[k].forEach(function (t, i) {
        mark(segs[i], t, 'Open these records');
        mark(lg[i], t, 'Open these records');
      });
    });
    function card(title) {
      return $$('.card', dash).filter(function (c) {
        var h = $('.card-h h3', c);
        return h && h.textContent.trim().indexOf(title) === 0;
      })[0];
    }
    var perModule = card('Visits conducted per module');
    if (perModule) $$('.bc', perModule).forEach(function (b) {
      var n = ($('u', b) || {}).textContent;
      mark(b, { go: 'visits', module: n }, 'Open the visits for module ' + n);
    });
    var att = card('Male caregiver attendance by district');
    if (att) $$('.hr', att).forEach(function (r) {
      var d = ($('.l', r) || {}).textContent;
      mark(r, { go: 'visits', place: d }, 'Open the visits in ' + d);
    });
    $$('.mx .mr', dash).forEach(function (r) {
      var d = ($('.lb', r) || {}).textContent;
      if (!d) return;
      $$('b', r).forEach(function (cell, j) {
        mark(cell, { go: 'visits', place: d, module: String(j + 1) }, 'Open the module ' + (j + 1) + ' visits in ' + d);
      });
    });
    $$('.lr.click[data-go="households"]', dash).forEach(function (r) {
      var s = ($('.t', r) || {}).textContent;
      r.removeAttribute('data-go');
      mark(r, { go: 'households', place: s }, 'Open the households in ' + s);
    });

    function moduleName(screen, n) {
      var hit = null;
      $$('tbody td', screen).some(function (td) {
        var t = td.textContent.trim();
        if (t.indexOf(n + ' — ') === 0) { hit = t; return true; }
        return false;
      });
      return hit || ('Module ' + n);
    }
    function open(el) {
      var t = JSON.parse(el.getAttribute('data-drill'));
      var placeChip = $$('.filters .fl', dash).filter(function (b) { return ($('.k', b) || {}).textContent === 'Place'; })[0];
      var place = t.place || (placeChip ? ($('b', placeChip) || {}).textContent : '');
      window.SugiraGo(t.go);
      setTimeout(function () {
        var sc = document.getElementById('s-' + t.go);
        if (!sc) return;
        if (window.SugiraFilters) window.SugiraFilters.clear('s-' + t.go);
        if (t.tab) {
          var tab = $$('.tab', sc).filter(function (x) { return x.textContent.trim().indexOf(t.tab) === 0; })[0];
          if (tab) tab.click();
        }
        if (place && place !== 'Rwanda' && window.SugiraFilters) window.SugiraFilters.set('s-' + t.go, 'place', place);
        if (t.module && window.SugiraFilters) window.SugiraFilters.set('s-' + t.go, 'module', moduleName(sc, t.module));
      }, 200);
    }
    dash.addEventListener('click', function (e) {
      var el = e.target.closest('[data-drill]');
      if (el) open(el);
    });
    dash.addEventListener('keydown', function (e) {
      var el = e.target.closest && e.target.closest('[data-drill]');
      if (el && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); open(el); }
    });
  }


  /* ---- a table that does not fit wraps its words before it scrolls ----
     Cells hold one line by default. When that makes a table wider than its
     card, the long text cells take a second line; chips, numbers and names
     stay whole. Only what still does not fit scrolls. */
  function fitTables() {
    $$('.tblwrap').forEach(function (w) {
      if (!w.offsetParent) return;
      var t = $('table.tbl', w);
      if (!t || t.classList.contains('tight') || t.classList.contains('scrolls')) return;
      if (w.scrollWidth <= w.clientWidth + 2) return;
      /* Only prose wraps. A code, a date or a name stays on its line. */
      $$('tbody td:not(.num):not(.rowacts):not(.acts-c)', t).forEach(function (td) {
        if (td.querySelector('img, .who-c, .vth')) return;
        if (td.textContent.trim().length > 24 && /\s/.test(td.textContent.trim())) td.classList.add('wrap');
      });
      t.classList.add('tight');
    });
  }
  function fitSoon() { setTimeout(fitTables, 60); }


  /* ---- IZU totals follow the rows on screen ----
     The partners' footer sums the supervisions listed. A tab or a filter
     changes which are listed, so the sums are worked out again each time. */
  function izuTotals() {
    var t = $('#s-izu table.izt');
    if (!t || !t.tFoot) return;
    var heads = $$('thead th', t).map(function (h) { return h.textContent.trim(); });
    var from = heads.indexOf('Cross-module questions');
    if (from < 0) return;
    function redo() {
      var rows = $$('tbody tr', t).filter(function (r) { return !r.classList.contains('t-out') && !r.classList.contains('f-out') && !r.classList.contains('r-gone'); });
      var sums = [];
      for (var c = from; c < heads.length; c++) {
        sums.push(rows.reduce(function (a, r) { return a + (parseFloat((r.cells[c] || {}).textContent) || 0); }, 0));
      }
      var fr = t.tFoot.rows, n = rows.length || 1;
      /* Narrowed, the footer counts what is left rather than the whole year. */
      var foot = document.getElementById('izuFoot');
      if (foot) {
        var narrowed = $$('tbody tr', t).some(function (r) { return r.classList.contains('f-out'); });
        foot.textContent = narrowed ? (rows.length ? rows.length + (rows.length === 1 ? ' supervision' : ' supervisions') : 'Nothing matches')
          : 'Showing 1–' + rows.length + ' of 15 208 supervisions';
      }
      [[sums, 0], [sums.map(function (v) { return v / n; }), 2], [sums.map(function (v) { return v / 12; }), 2]].forEach(function (set, k) {
        if (!fr[k]) return;
        var cells = [].slice.call(fr[k].cells, 1);
        set[0].forEach(function (v, i) { if (cells[i]) cells[i].textContent = k === 0 && Number.isInteger(v) ? String(v) : v.toFixed(2); });
      });
    }
    t.addEventListener('table:applied', redo);
    t.addEventListener('filtered', redo);
    document.addEventListener('filters:applied', function () { setTimeout(redo, 0); });
    document.getElementById('s-izu').addEventListener('click', function () { setTimeout(redo, 30); });
    redo();
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
          var sc = tr.closest('.screen');
          var entry = rows.remove(tr, sc ? sc.id : '', 'Deleted from the list');
          say('“' + name + '” deleted', { label: 'Undo', onClick: function () { rows.restore(entry); } });
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
  var MODS = ['Welcome module'].concat(Array.apply(null, Array(12)).map(function (_, i) { return 'Module ' + (i + 1); }), ['Closing module']);
  var PICK = {
    cohort: ['Cohort 1 · 2026', 'Cohort 2 · 2026', 'Cohort 3 · 2026', 'Cohort 4 · 2026'],
    village: ['Kabare', 'Kibimba', 'Rukoma', 'Munini', 'Rwesero', 'Rugarama', 'Bugoyi', 'Nyonirima'],
    place: ['Kibungo · Ngoma', 'Jarama · Ngoma', 'Sake · Ngoma', 'Mahama · Kirehe', 'Kigoma · Nyanza', 'Busasamana · Nyanza', 'Gisenyi · Rubavu', 'Kinigi · Musanze'],
    sector: ['Kibungo', 'Jarama', 'Sake', 'Kigoma', 'Busasamana', 'Mahama', 'Gisenyi', 'Kinigi'],
    district: ['Ngoma', 'Kirehe', 'Nyanza', 'Rubavu', 'Musanze'],
    izu: ['M. Dusabe', 'V. Nyiraneza', 'G. Uwimbabazi', 'D. Niyonsaba', 'P. Mukamurenzi', 'A. Nyirahabimana', 'F. Uwase', 'B. Uwamahoro'],
    supervisor: ['C. Uwimana', 'A. Uwera', 'F. Kayitesi', 'S. Ingabire', 'P. Hakizimana'],
    module: MODS,
    'family type': ['Single mother-headed household', 'Two-parent household', 'Grandparent-headed household', 'Child-headed household'],
    'booster module': ['No', 'Yes']
  };
  var STATUS = {
    household: ['On track', 'Behind', 'Risk of harm'],
    visit: ['Completed', 'Not completed'],
    'case': ['Active', 'Stabilized', 'Closed'],
    referral: ['Active', 'Stabilized', 'Closed'],
    person: ['Active', 'Inactive'],
    form: ['Draft', 'Active', 'Archived']
  };
  /* worked out by the system, never typed */
  var FIXED = /^(minutes|sent in|when|form|forms|enrolled|joined|last active|created|created by|time expected|latest module|recorded by|raised at|review due|translated|submitted|opened|version|household|head of household|members|visits|used in|project|questions|languages|last edited|out of|full name)$/i;
  function pickFor(label, key) {
    if (/^izu\b/i.test(label)) return PICK.izu;
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
    if (l === 'position' && window.SugiraPerms) return window.SugiraPerms.positions().map(function (p) { return p.name; });
    if (l === 'where') return ['National', 'Ngoma district', 'Kirehe district', 'Nyanza district', 'Rubavu district', 'Musanze district',
      'Kibungo · Ngoma', 'Jarama · Ngoma', 'Sake · Ngoma', 'Mahama · Kirehe', 'Kigoma · Nyanza', 'Busasamana · Nyanza', 'Gisenyi · Rubavu', 'Kinigi · Musanze'];
    if (l === 'email alerts') return ['Yes', 'No'];
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
    if (!val) { v.innerHTML = '&mdash;'; v.classList.add('empty'); var r0 = v.closest('.pgr'); if (r0) r0.classList.add('is-empty'); return; }
    v.classList.remove('empty'); var r1 = v.closest('.pgr'); if (r1) r1.classList.remove('is-empty');
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
      /* the booster mark lives in the Fields section, under the names */
      var bst = $$('.fields .fld', screen).filter(function (r) { return /Booster/.test(r.textContent); })[0];
      var bv = bst && $('.v', bst);
      if (bv) fields.push({ label: 'Booster module', el: bv, val: bv.textContent.trim(), list: PICK['booster module'] });
    } else if (key === 'form') {
      fields.push({ label: 'Form name', el: h1, val: h1.textContent.trim() });
      if (alt) fields.push({ label: 'Form name in Kinyarwanda', el: alt, val: alt.textContent.trim() });
    } else if (key === 'person') {
      fields.push({ label: 'Full name', el: h1, val: h1.textContent.trim() });
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
          if (f.el === h1 || f.el === alt) { f.el.textContent = val; alt && (alt.hidden = !alt.textContent); return; }
          if (/booster/i.test(f.label)) { rec.setAttribute('data-booster', val); rec.setAttribute('data-booster-set', '1'); }
          if (/^village$/i.test(f.label) && window.SugiraRecData) {
            var H = window.SugiraRecData.households, at = Object.keys(H).filter(function (k) { return H[k].village === val; })[0];
            var cq = f.el.querySelector('.conseq');
            if (at && cq) cq.textContent = H[at].cell + ' cell · ' + H[at].sector + ' · ' + H[at].district;
          }
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
        var row = key === 'record' ? window.SugiraRecordRow : rows.find(listKey, id);
        if (row) rows.remove(row, listKey, 'Deleted from its record', title);
        else if (listKey && CFG[listKey]) CFG[listKey].bin.unshift([id, title, ME, today(), 'Deleted from its record']);
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
    var own = { 'fs-community': true, 'rep-export': true };
    host.innerHTML = P.groups.map(function (g) {
      var perms = P.all.filter(function (x) { return x.group === g.key; });
      if (!perms.length) return '';
      return '<div class="pgrp"><b>' + esc(g.name) + '</b>' + perms.map(function (x) {
        var on = !!held[x.id] !== !!own[x.id];
        return '<label class="rb-ck"><input type="checkbox" value="' + esc(x.id) + '"' + (on ? ' checked' : '')
          + ' data-base="' + (held[x.id] ? 1 : 0) + '" data-was="' + (on ? 1 : 0) + '">' + esc(x.label) + '<span class="pp-x"></span></label>';
      }).join('') + '</div>';
    }).join('');
    function mark(inp) {
      var base = inp.getAttribute('data-base') === '1', x = inp.parentNode.querySelector('.pp-x');
      x.textContent = inp.checked === base ? '' : inp.checked ? 'added for them' : 'removed for them';
      x.className = 'pp-x' + (inp.checked === base ? '' : inp.checked ? ' add' : ' rm');
    }
    $$('input', host).forEach(mark);
    if (host._bound) return;
    host._bound = true;
    host.addEventListener('change', function (e) { if (e.target.matches('input')) mark(e.target); });
    var save = document.querySelector('[data-pp="save"]');
    /* What was changed since the page opened, not every difference from the position. */
    if (save) save.addEventListener('click', function () {
      var changed = $$('input', host).filter(function (i) { return (i.checked ? '1' : '0') !== i.getAttribute('data-was'); });
      changed.forEach(function (i) { i.setAttribute('data-was', i.checked ? '1' : '0'); });
      var n = changed.length;
      say(n ? n + ' change' + (n === 1 ? '' : 's') + ' saved, for them only' : 'Nothing changed');
    });
  }
  window.SugiraPersonPerms = personPerms;

  /* ---- the partners' follow-up report: Apply narrows it ---- */
  function followupReport() {
    var go = document.getElementById('fur-apply'), t = document.getElementById('fur-t');
    if (!go || !t) return;
    /* Province narrows District, District narrows Sector. */
    var TREE = { 'Eastern Province': { Ngoma: ['Kibungo', 'Jarama', 'Sake', 'Zaza'], Kirehe: ['Kirehe', 'Mahama', 'Nyarubuye'] },
      'Southern Province': { Nyanza: ['Busasamana', 'Kigoma', 'Mukingo'] }, 'Western Province': { Rubavu: ['Gisenyi', 'Nyundo', 'Rugerero'] },
      'Northern Province': { Musanze: ['Kinigi', 'Busogo', 'Cyuve'] } };
    var P = $('#fur-p'), D = $('#fur-d'), S = $('#fur-s'), F = $('#fur-form');
    function opts(sel, first, list) {
      var was = sel.value;
      sel.innerHTML = '<option>' + first + '</option>' + list.map(function (x) { return '<option>' + esc(x) + '</option>'; }).join('');
      if (list.indexOf(was) > -1) sel.value = was;
      sel.dispatchEvent(new Event('change'));
    }
    function districts() {
      var provs = /^All/.test(P.value) ? Object.keys(TREE) : [P.value];
      return provs.reduce(function (a, p) { return a.concat(Object.keys(TREE[p] || {})); }, []);
    }
    function sectors() {
      var ds = /^All/.test(D.value) ? districts() : [D.value];
      return Object.keys(TREE).reduce(function (a, p) {
        ds.forEach(function (d) { if (TREE[p][d]) a = a.concat(TREE[p][d]); });
        return a;
      }, []);
    }
    P.addEventListener('change', function () { opts(D, 'All districts', districts()); });
    D.addEventListener('change', function () { opts(S, 'All sectors', sectors()); });
    opts(D, 'All districts', districts());
    var total = 538;
    function run() {
      var pv = P.value, d = D.value, sc = S.value, form = F.selectedIndex === 1 ? 'ref' : 'roh';
      var n = 0;
      $$('tbody tr', t).forEach(function (tr) {
        var c = tr.cells;
        var keep = tr.getAttribute('data-form') === form && (/^All/.test(pv) || c[1].textContent === pv) && (/^All/.test(d) || c[2].textContent === d)
          && (/^All/.test(sc) || c[3].textContent === sc);
        tr.hidden = !keep;
        if (keep) n++;
      });
      var all = /^All/.test(pv) && /^All/.test(d) && /^All/.test(sc);
      total = all ? (form === 'ref' ? 212 : 538) : n;
      var show = function (v) { var x = new Date(v + 'T00:00:00'); return x.getDate() + ' ' + MONTHS[x.getMonth()] + ' ' + x.getFullYear(); };
      $('#fur-n').textContent = 'Found ' + total + (total === 1 ? ' result' : ' results') + ' between ' + show($('#fur-a').value) + ' and ' + show($('#fur-b').value);
      var foot = $('#fur-foot');
      if (foot) foot.textContent = n ? 'Showing 1–' + n + ' of ' + fmt(total) : 'Nothing matches';
    }
    go.addEventListener('click', run);
    document.addEventListener('click', function (e) {
      var x = e.target.closest('[data-fur-export]');
      if (!x) return;
      say(fmt(total) + ' follow-ups exported as ' + x.getAttribute('data-fur-export'));
    });
  }

  /* Rows deleted from a list's selection bar land in the same bin. */
  window.SugiraFU = { data: FU, mount: followups };
  window.SugiraFormStats = function (f) {
    var c = CFG.form, n = f.responses;
    c.stats = [['Responses', n], ['This week', Math.round(n * 0.08)], ['Flagged', Math.round(n * 0.012), 'warn'], ['Median minutes', Math.max(5, Math.round(f.questions * 1.4))]];
    var mods = f.sessions.length ? f.sessions : ['The whole project'];
    var share = mods.length ? Math.floor(n / mods.length) : n;
    c.charts[0] = { t: 'Responses by module', rows: mods.slice(0, 12).map(function (s, i) {
      var m = /^(\d+)\./.exec(s);
      return [m ? 'Module ' + m[1] : s.replace(/ ?session$/i, ' module'), i === mods.length - 1 ? n - share * (mods.length - 1) : share];
    }) };
    var d = [0.26, 0.22, 0.21, 0.18, 0.13];
    c.charts[1] = { t: 'Responses by district', rows: ['Ngoma', 'Rubavu', 'Nyanza', 'Kirehe', 'Musanze'].map(function (x, i) { return [x, Math.round(n * d[i])]; }) };
  };
  window.SugiraRows = rows;
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
    /* recdata.js fills each record, follow-ups included, as it opens. */
    rowDelete();
    drill();
    izuTotals();
    fitSoon();
    document.addEventListener('click', fitSoon);
    var go0 = window.SugiraGo;
    if (go0) window.SugiraGo = function () { var r = go0.apply(this, arguments); fitSoon(); return r; };
    window.addEventListener('resize', function () { $$('table.tight, table.scrolls').forEach(function (t) { t.classList.remove('tight', 'scrolls'); }); fitSoon(); });
    caseLists();
    recordActions();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
