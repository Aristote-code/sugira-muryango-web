/* ==================== what the administration dialogs change ================

   Several dialogs said they had done something and left the screen as it was:
   a new cohort year, districts added to a year, a new user. Each now changes
   the list it belongs to, from data written down once here.
   ========================================================================= */
(function () {
  'use strict';

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function ic(id) { return '<svg aria-hidden="true"><use href="#i-' + id + '"/></svg>'; }
  var M = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var TODAY = new Date(2026, 10, 6);
  function d(s) { var p = s.split(' '); return new Date(+p[2], M.indexOf(p[1]), +p[0]); }
  function short(x) { return x.getDate() + ' ' + M[x.getMonth()]; }
  function long(x) { return x.getDate() + ' ' + M[x.getMonth()] + ' ' + x.getFullYear(); }

  /* ---- cohorts: per district, per year ----
     A cohort runs for the year's length and ends the day before the next
     one starts, so two never share a day. */
  var YEARS = [
    { y: 2026, n: 2, months: 4, households: 2210, rows: [
      ['Kirehe', 1, '6 Apr 2026'], ['Kirehe', 2, '10 Aug 2026'], ['Musanze', 1, '12 Jan 2026'], ['Musanze', 2, '8 Jun 2026'],
      ['Ngoma', 1, '19 Jan 2026'], ['Ngoma', 2, '13 Jul 2026'], ['Nyanza', 1, '19 Jan 2026'], ['Nyanza', 2, '13 Jul 2026'],
      ['Rubavu', 1, '26 Jan 2026'], ['Rubavu', 2, '20 Jul 2026']] },
    { y: 2027, n: 3, months: 4, households: 0, rows: [] }
  ];
  function end(start, months) { var e = new Date(start); e.setMonth(e.getMonth() + months); e.setDate(e.getDate() - 1); return e; }
  function stateOf(start, months) {
    var e = end(start, months);
    return e < TODAY ? ['Finished', 'ok'] : start <= TODAY ? ['Running', 'warn'] : ['Planned', ''];
  }
  function year(y) { return YEARS.filter(function (x) { return x.y === y; })[0]; }
  function drawCohorts(open) {
    var body = $('#s-cohorts table.tbl tbody');
    if (!body) return;
    YEARS.sort(function (a, b) { return a.y - b.y; });
    body.innerHTML = YEARS.map(function (Y) {
      var ds = Y.rows.map(function (r) { return r[0]; }).filter(function (x, i, a) { return a.indexOf(x) === i; });
      var any = Y.rows.map(function (r) { return stateOf(d(r[2]), Y.months)[0]; });
      var st = !Y.rows.length ? ['Not started', ''] : any.indexOf('Running') > -1 ? ['Running', 'warn'] : any.indexOf('Planned') > -1 ? ['Planned', ''] : ['Finished', 'ok'];
      var rows = Y.rows.slice().sort(function (a, b) { return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : a[1] - b[1]; });
      var isOpen = open === Y.y;
      return '<tr data-year="' + Y.y + '"><td class="nm"><button class="sx" type="button" aria-expanded="' + isOpen + '" aria-label="Show the districts in ' + Y.y + '">' + ic('chevronRight') + '</button>' + Y.y
        + '</td><td class="num">' + Y.n + '</td><td>' + Y.months + ' months</td><td class="num">' + ds.length + '</td><td class="num">' + (Y.households ? Y.households.toLocaleString('en').replace(/,/g, ' ') : 0)
        + '</td><td><span class="chip ' + st[1] + '"><i></i>' + st[0] + '</span></td></tr>'
        + '<tr class="sxr"' + (isOpen ? '' : ' hidden') + '><td colspan="6"><div class="sxb"><div class="sxh"><b>' + ds.length + (ds.length === 1 ? ' district' : ' districts') + ' in ' + Y.y + '</b>'
        + '<button class="btn sec sm" type="button" data-modal="cdistricts" data-year="' + Y.y + '">' + ic('plus') + 'Add districts</button></div>'
        + (rows.length ? rows.map(function (r) {
          var s0 = d(r[2]), e0 = end(s0, Y.months), x = stateOf(s0, Y.months);
          return '<div class="lr"><span class="t">' + esc(r[0]) + '</span><span class="s">Cohort ' + r[1] + ' · ' + short(s0) + ' to ' + short(e0) + (e0.getFullYear() !== Y.y ? ' ' + e0.getFullYear() : '')
            + '</span><span class="c"><span class="chip ' + x[1] + '"><i></i>' + x[0] + '</span></span><span class="c rowacts"><a data-modal="cdistricts" data-year="' + Y.y + '" data-change="' + esc(r[0]) + '|' + r[1] + '">Change</a>'
            + '<a data-cremove="' + Y.y + '|' + esc(r[0]) + '|' + r[1] + '">Remove</a></span></div>';
        }).join('') : '<p class="empty-line">No district yet</p>') + '</div></td></tr>';
    }).join('');
    var rail = $('.ni[data-go="cohorts"] .ct');
    if (rail) rail.textContent = String(YEARS.length);
    /* the project's own Cohorts tab: each year's cohorts, from the same list */
    var pb = $('#s-project [data-panelid="cohorts"] tbody');
    if (pb) {
      var HH = { '2026|1': 1216, '2026|2': 994 };
      pb.innerHTML = YEARS.map(function (Y) {
        var out = [];
        for (var k = 1; k <= Y.n; k++) {
          var rs = Y.rows.filter(function (r) { return r[1] === k; });
          var ds = rs.map(function (r) { return r[0]; }).sort();
          var sts = rs.map(function (r) { return stateOf(d(r[2]), Y.months)[0]; });
          var st = !rs.length ? ['Not started', ''] : sts.indexOf('Running') > -1 ? ['Running', 'warn'] : sts.indexOf('Planned') > -1 ? ['Planned', ''] : ['Finished', 'ok'];
          out.push('<tr><td>' + Y.y + ' · Cohort ' + k + '</td><td>' + (ds.length ? esc(ds.join(', ')) : '<span class="rd">None yet</span>') + '</td><td class="num">'
            + (HH[Y.y + '|' + k] || 0).toLocaleString('en').replace(/,/g, ' ') + '</td><td>' + (st[0] === 'Running' ? (k === 1 ? '6 of 12' : '3 of 12') : '&mdash;')
            + '</td><td><span class="chip ' + st[1] + '"><i></i>' + st[0] + '</span></td></tr>');
        }
        return out.join('');
      }).join('');
      var pf = pb.closest('.card') && pb.closest('.card').querySelector('.tfoot span');
      if (pf) pf.textContent = '2 210 households in 2026';
    }
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-cremove]');
    if (!a) return;
    e.preventDefault();
    var p = a.getAttribute('data-cremove').split('|'), Y = year(+p[0]);
    var gone = Y.rows.filter(function (r) { return r[0] === p[1] && r[1] === +p[2]; })[0];
    Y.rows = Y.rows.filter(function (r) { return r !== gone; });
    drawCohorts(Y.y);
    if (window.SugiraToast) window.SugiraToast.say(p[1] + ' cohort ' + p[2] + ' removed from ' + p[0], { label: 'Undo', onClick: function () { Y.rows.push(gone); drawCohorts(Y.y); } });
  });

  window.SugiraCohorts = {
    years: function () { return YEARS.map(function (Y) { return Y.y; }); },
    year: function (y) { return year(y); },
    end: end,
    addYear: function (y, n, months) {
      if (year(y)) return false;
      YEARS.push({ y: y, n: n, months: months, households: 0, rows: [] });
      drawCohorts(y);
      return true;
    },
    /* Districts start a cohort on one date; the later ones in the year follow
       from how long each runs. A change replaces that district's cohorts
       from the one changed onward. */
    add: function (y, districts, n, startIso, replace) {
      var Y = year(y);
      if (!Y) return;
      districts.forEach(function (dist) {
        Y.rows = Y.rows.filter(function (r) { return !(r[0] === dist && r[1] >= n); });
        var s0 = new Date(startIso + 'T00:00:00');
        for (var k = n; k <= Y.n; k++) {
          Y.rows.push([dist, k, long(s0)]);
          s0 = end(s0, Y.months); s0.setDate(s0.getDate() + 1);
        }
      });
      drawCohorts(y);
    }
  };

  /* ---- people: a user created is a user on the list ---- */
  window.SugiraPeople = {
    add: function (p) {
      var body = $('#s-people table.tbl tbody');
      if (!body) return;
      var tr = document.createElement('tr');
      tr.setAttribute('data-tags', 'active');
      tr.setAttribute('data-go', 'person');
      tr.innerHTML = '<td class="nm">' + esc(p.name) + '</td><td>' + esc(p.position) + '</td><td class="mut">' + esc(p.where)
        + '</td><td class="mut">' + esc(p.projects || 'Household Module Tracking') + '</td><td class="num mut">never</td><td><span class="chip ok"><i></i>Active</span></td>';
      body.insertBefore(tr, body.firstChild);
      var tab = $('#s-people .tab[data-tab="active"] .chip');
      if (tab) tab.textContent = String((parseInt(tab.textContent.replace(/\D/g, ''), 10) || 0) + 1);
      var rail = $('.si[data-go="people"] .ct');
      if (rail) rail.textContent = String((parseInt(rail.textContent.replace(/\D/g, ''), 10) || 0) + 1);
      var tbl = tr.closest('table');
      if (tbl) tbl.dispatchEvent(new Event('filtered'));
    }
  };

  /* ---- a report opened shows what it found ---- */
  var DIST = [['Ngoma', 470], ['Rubavu', 400], ['Nyanza', 392], ['Kirehe', 330], ['Musanze', 250]];
  function resultFor(name) {
    var n = name.toLowerCase();
    if (/sector/.test(n)) return { by: 'Sector', rows: [['Kibungo', 184], ['Jarama', 152], ['Sake', 121], ['Mahama', 176], ['Kigoma', 140], ['Busasamana', 133], ['Gisenyi', 160], ['Kinigi', 118]] };
    if (/home visitor|izu/.test(n)) return { by: 'Home visitor', rows: [['M. Dusabe', 46], ['V. Nyiraneza', 44], ['D. Niyonsaba', 41], ['A. Nyirahabimana', 49], ['B. Uwamahoro', 45]] };
    if (/module/.test(n)) return { by: 'Module', rows: [1, 2, 3, 4, 5, 6, 7, 8].map(function (m, i) { return ['Module ' + m, [312, 298, 270, 254, 201, 168, 129, 98][i]]; }) };
    if (/type|victim/.test(n)) return { by: 'Type', rows: [['Neglect', 10], ['Severe malnutrition', 9], ['Physical', 8], ['Emotional', 4], ['Sexual', 2], ['Other', 1]] };
    if (/needs/.test(n)) return { by: 'Need', rows: [['Health insurance', 612], ['Food', 540], ['School fees', 388], ['Health care', 301]] };
    return { by: 'District', rows: DIST };
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-ropen]');
    if (!a || !window.SugiraModal) return;
    e.preventDefault();
    var tr = a.closest('tr');
    var name = tr.querySelector('.nm').textContent.trim();
    var form = tr.cells[3] ? tr.cells[3].textContent.trim() : '';
    var r = resultFor(name), max = Math.max.apply(null, r.rows.map(function (x) { return x[1]; }));
    window.SugiraModal.ask({
      title: name, ok: 'Export', body: '<div class="hb">' + r.rows.map(function (x) {
        return '<div class="hr"><span class="l">' + esc(x[0]) + '</span><span class="t"><i style="width:' + Math.round(x[1] / max * 100) + '%"></i></span><span class="v">' + x[1] + '</span></div>';
      }).join('') + '</div><p class="mut" style="margin:0">' + esc(form) + ' · by ' + r.by.toLowerCase() + '</p>',
      done: name + ' exported'
    });
  });

  /* ---- a person row opens that person ---- */
  var FULL = { 'A. Gahimana': 'A. Gahimana', 'C. Uwimana': 'Claudine Uwimana', 'M. Dusabe': 'Marie Dusabe', 'E. Mutesi': 'Esther Mutesi',
    'J. Kamanzi': 'Jean Kamanzi', 'P. Niyonkuru': 'Patrick Niyonkuru', 'B. Nkurunziza': 'Bosco Nkurunziza', 'R. Mugisha': 'Robert Mugisha',
    'T. Mukamana': 'Thérèse Mukamana', 'S. Habimana': 'Samuel Habimana', 'D. Uwera': 'Diane Uwera' };
  function setField(sc, label, html) {
    $$('.pg .pgr', sc).forEach(function (row) {
      var k = $('.k > span:last-child', row);
      if (k && k.textContent.trim() === label) $('.v', row).innerHTML = html;
    });
  }
  function fillPerson(tr) {
    var sc = document.getElementById('s-person');
    if (!sc) return;
    var c = tr.cells, name = c[0].textContent.trim(), pos = c[1].textContent.replace(/\s+/g, ' ').trim();
    var where = c[2].textContent.replace(/\s+/g, ' ').trim(), last = c[4].textContent.trim(), st = c[5].textContent.trim();
    var P = window.SugiraPerms, p = P ? P.positions().filter(function (x) { return x.name === pos || pos.indexOf(x.name) === 0 || x.name.indexOf(pos) === 0; })[0] : null;
    $('h1', sc).textContent = FULL[name] || name;
    var id = $('.rec-id', sc);
    if (id) id.textContent = 'USR-' + (100 + name.length * 7);
    var sd = window.SugiraScreens && window.SugiraScreens.person;
    if (sd && sd.crumbs && sd.crumbs.length) sd.crumbs[sd.crumbs.length - 1][0] = name;
    setField(sc, 'Status', '<span class="pg-badge ' + (st === 'Active' ? 'ok' : '') + '">' + esc(st) + '</span>');
    setField(sc, 'Phone', '+250 78 ' + (300 + name.length * 13) + ' ' + (1000 + name.charCodeAt(0) * 7));
    setField(sc, 'Position', p ? '<button class="rel" type="button" data-go="position" data-pos-id="' + esc(p.id) + '">' + ic('role') + esc(p.name) + '</button>' : esc(pos));
    setField(sc, 'Where', esc(where));
    setField(sc, 'Email', esc(name.replace(/[^A-Za-z]+/g, '.').replace(/^\.|\.$/g, '').toLowerCase()) + '@fxbrwanda.org');
    setField(sc, 'Last active', esc(last));
    var h3 = $('[data-panelid="pperm"] .card-h h3', sc);
    if (h3) h3.textContent = 'What ' + name + ' can do';
    var block = document.getElementById('ppBlock');
    if (block) {
      block.setAttribute('data-position', p ? p.id : '');
      if (window.SugiraPersonPerms) window.SugiraPersonPerms();
    }
  }
  document.addEventListener('click', function (e) {
    var tr = e.target.closest('#s-people tbody tr[data-go="person"]');
    if (!tr) return;
    setTimeout(function () { fillPerson(tr); }, 0);
  }, true);

  /* ---- your own permissions, in the grouping every other screen uses ---- */
  function profilePerms() {
    var P = window.SugiraPerms, host = $('#s-profile [data-panelid="paccess"] .card.flush');
    if (!P || !host) return;
    var me = P.positions().filter(function (x) { return x.id === 'HQ'; })[0];
    var held = me ? P.held(me) : {};
    host.className = 'card';
    host.innerHTML = '<div class="card-h"><h3>What you can do</h3><span class="side"><span class="chip">' + Object.keys(held).length + '</span></span></div>'
      + '<div class="pblock">' + P.groups.map(function (g) {
        var mine = g.perms.filter(function (x) { return held[x.id]; });
        if (!mine.length) return '';
        return '<div class="pgrp"><b>' + esc(g.name) + '</b>' + mine.map(function (x) {
          return '<span class="rb-ck">' + ic('check') + esc(x.label) + '</span>';
        }).join('') + '</div>';
      }).join('') + '</div>';
  }

  function boot() { drawCohorts(null); profilePerms(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
