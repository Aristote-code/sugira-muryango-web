/* ---------------------------------------------------------------------------
   Filters.

   The old system had two of these. The monitoring one was a Module select that
   enabled a Form select that enabled a Load button; the data one was six place
   search boxes chained province → district → sector → cell → village → IZU,
   with 2,632 options rendered inline. Both ideas are right and both were
   unusable: nothing narrowed until everything was chosen, and nothing showed
   what was currently applied.

   This keeps the chaining and drops the waiting. Every control filters the
   table under it the moment it is set, place drills down a level at a time in
   one popover, and whatever is applied stays visible and removable.

   It reads the dimension from the control's own label, so a new filter is a
   button in the markup and a list of options here — no wiring per screen.
--------------------------------------------------------------------------- */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) {
    return Array.prototype.slice.call((r || document).querySelectorAll(s));
  };

  var SESSIONS = [
    'Welcome session', '1.Family Narrative',
    '2.The Importance of Early Stimulation & Play',
    '3.Building Early Communication Skills', '4.The Importance of Good Hygiene',
    '5.The Importance of Good Nutrition', '6.The Importance of Good Health',
    '7.Managing the Stresses of Parenting and Family Life',
    '8.Resolving Conflicts in the Home',
    '9.The Important Role that Everyone Plays in Raising a Baby Well',
    '10.Good Parenting is Better than Being Born Well',
    "11.Making the Home a Place Where a Baby's Brain Can Grow",
    '12.With a United Family, Anything is Possible', 'Closing session',
    '3-Month Booster Session', '6-Month Booster Session', '12-Month Booster Session'
  ];

  var ROLES = [
    'admin', 'BC office', 'Sugira Muryango coordination office',
    'Sugira Muryango District lead (DTL)', 'Sugira Muryango Sector lead (SLA)',
    'HQ officer', 'IZU Cell Coordinator (ICC)', 'IZU at Village',
    'National NCDA Government Official',
    'District NCDA Child protection and Welfare Officer (CPWO)'
  ];

  var PROJECTS = [
    'Household Module Tracking', 'Household Enrollment', 'Household Tracking Project',
    'Risk of Harm/other family problems Management',
    'FCG participation and interaction form', 'Play Collaborative Meetings',
    'IZU at Village Demographics', 'IZU Cell Coordinator Demographics',
    'IZU Cell Coordinator Telephone Supervision management',
    'IZU Sector Coordinator Telephone Supervision',
    'District Performance Evaluation of Sugira Muryango program'
  ];

  /* The five districts the cohorts name, with the sectors the programme works
     in. Drilling stops at sector: below that the tree is 2,632 rows and belongs
     on the Places screen, not in a popover. */
  var PLACES = {
    'Eastern Province': {
      Ngoma: ['Kibungo', 'Jarama', 'Sake', 'Zaza'],
      Kirehe: ['Kirehe', 'Mahama', 'Nyarubuye']
    },
    'Southern Province': { Nyanza: ['Busasamana', 'Kigoma', 'Mukingo'] },
    'Western Province': { Rubavu: ['Gisenyi', 'Nyundo', 'Rugerero'] },
    'Northern Province': { Musanze: ['Kinigi', 'Busogo', 'Cyuve'] }
  };

  var DISTRICTS = ['Ngoma', 'Kirehe', 'Nyanza', 'Rubavu', 'Musanze'];

  // key -> { all: the value meaning "no filter", options: [...] }
  var DIMENSIONS = {
    place:    { all: 'Rwanda',      tree: true },
    district: { all: 'All',         options: DISTRICTS },
    cohort:   { all: 'All',         options: ['1', '2', '3', '4'] },
    period:   { all: 'This cohort', options: ['This week', 'This month', 'This cohort', 'All time'] },
    date:     { all: 'All',         options: ['Today', 'This week', 'This month', 'This year', 'Date range…'] },
    form:     { all: 'Any',         options: ['Visit record', 'Caregiver observation', 'Supervisor spot-check', 'Enrollment form', 'Risk of harm report'] },
    status:   { all: 'Any',         options: ['Active', 'Behind', 'Complete', 'Overdue', 'Invited'] },
    module:   { all: 'Any',         options: SESSIONS },
    role:     { all: 'Any',         options: ROLES },
    project:  { all: 'Any',         options: PROJECTS },
    level:    { all: 'All',         options: ['Province', 'District', 'Sector'] }
  };

  /* The dashboard goes on a wall, so its filters have to move the numbers
     rather than relabel them. Every district's figures sum to the national
     ones, so scoping down and adding the five back up gives the same totals.
     Cohorts 3 and 4 hold no districts, so filtering to either correctly
     empties the board — that is the data saying something true. */
  var BOARD = {
    Ngoma:   { hh: 560, visits: 470, behind: 34, izu: 124, izuOn: 108, staff: 49, said: 46, male: 41, calls: 92 },
    Kirehe:  { hh: 420, visits: 330, behind: 38, izu: 92,  izuOn: 72,  staff: 37, said: 31, male: 33, calls: 62 },
    Nyanza:  { hh: 450, visits: 392, behind: 26, izu: 99,  izuOn: 86,  staff: 39, said: 36, male: 39, calls: 70 },
    Rubavu:  { hh: 480, visits: 400, behind: 22, izu: 105, izuOn: 92,  staff: 42, said: 39, male: 40, calls: 76 },
    Musanze: { hh: 300, visits: 250, behind: 28, izu: 66,  izuOn: 54,  staff: 26, said: 22, male: 34, calls: 44 }
  };
  var COHORT_SHARE = { '1': 0.55, '2': 0.45, '3': 0, '4': 0 };
  var PERIOD_SHARE = { 'This week': 0.08, 'This month': 0.31, 'This cohort': 1, 'All time': 1 };

  // which districts a place value covers — a sector resolves to its district
  function districtsFor(place) {
    if (!place || place === 'Rwanda') return Object.keys(BOARD);
    if (BOARD[place]) return [place];
    var hit = [];
    Object.keys(PLACES).forEach(function (prov) {
      Object.keys(PLACES[prov]).forEach(function (d) {
        if (prov === place) hit.push(d);
        else if (PLACES[prov][d].indexOf(place) > -1) hit.push(d);
      });
    });
    return hit.length ? hit : Object.keys(BOARD);
  }

  function fmt(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }

  function scopeDashboard(active) {
    var get = function (k) {
      var f = active.filter(function (x) { return x.key === k; })[0];
      return f ? f.value : null;
    };
    var place = get('place');
    var cohort = get('cohort');
    var periodBtn = $$('.filters .fl').filter(function (b) {
      return keyOf(b) === 'period' && b.closest('#s-dashboard');
    })[0];
    var period = periodBtn ? valueOf(periodBtn) : 'This cohort';

    var ds = districtsFor(place);
    var cs = cohort ? (COHORT_SHARE[cohort] || 0) : 1;
    var ps = PERIOD_SHARE[period] === undefined ? 1 : PERIOD_SHARE[period];

    var t = { hh: 0, visits: 0, behind: 0, izu: 0, izuOn: 0, staff: 0, said: 0, calls: 0, maleW: 0 };
    ds.forEach(function (d) {
      var b = BOARD[d];
      t.hh += b.hh * cs; t.visits += b.visits * cs * ps; t.behind += b.behind * cs;
      t.izu += b.izu; t.izuOn += b.izuOn; t.staff += b.staff; t.said += b.said;
      t.calls += b.calls * ps; t.maleW += b.male * b.visits * cs * ps;
    });
    var male = t.visits ? t.maleW / t.visits : 0;
    var pct = function (a, b) { return b ? Math.round(a / b * 100) : 0; };

    var tiles = {
      visits:      { v: t.visits, of: t.hh, pct: pct(t.visits, t.hh), d: period.toLowerCase() },
      behind:      { v: t.behind, of: t.hh, pct: pct(t.behind, t.hh) },
      reported:    { v: t.said, of: t.staff, pct: pct(t.said, t.staff) },
      izu:         { v: t.izuOn, of: t.izu, pct: pct(t.izuOn, t.izu) },
      male:        { v: null, pct: Math.round(male) },
      supervision: { v: t.calls, of: t.izu, pct: pct(t.calls, t.izu) }
    };

    Object.keys(tiles).forEach(function (k) {
      var el = document.querySelector('#s-dashboard [data-tile="' + k + '"]');
      if (!el) return;
      var x = tiles[k];
      var v = el.querySelector('.v');
      if (v) {
        v.innerHTML = (x.v === null ? x.pct + '%' : fmt(x.v)) +
          (x.of !== undefined ? ' <small>of ' + fmt(x.of) + '</small>' : '');
      }
      var trk = el.querySelector('.trk i');
      if (trk) trk.style.width = Math.min(100, x.pct) + '%';
      var delta = el.querySelector('.delta');
      if (delta && x.v !== null) delta.textContent = x.pct + '%';
    });

    var where = place || 'Rwanda';
    var bits = [where === 'Rwanda' ? 'All five districts' : where];
    if (cohort) bits.push('Cohort ' + cohort);
    bits.push(period);
    var sub = document.querySelector('#s-dashboard .phead .sub');
    if (sub) {
      if (!sub.dataset.base) sub.dataset.base = sub.textContent;
      sub.textContent = bits.join(' · ') +
        (cs === 0 ? ' — this cohort has no districts yet' : '');
    }
  }

  function keyOf(btn) {
    var k = btn.querySelector('.k');
    return k ? k.textContent.trim().toLowerCase() : null;
  }

  function valueOf(btn) {
    var b = btn.querySelector('b');
    return b ? b.textContent.trim() : '';
  }

  function setValue(btn, v) {
    var b = btn.querySelector('b');
    if (b) b.textContent = v;
    var dim = DIMENSIONS[keyOf(btn)];
    btn.classList.toggle('on', !!dim && v !== dim.all);
    btn.setAttribute('aria-label', keyOf(btn) + ': ' + v);
  }

  /* Place opens as nested flyouts rather than a drill-down.
     Replacing the list each time threw away the context you were choosing
     within: by the third tap you could no longer see that Ngoma was in the
     Eastern Province. ClickUp's submenus open beside their trigger and leave
     the trail on screen, which is also how the old system's six chained boxes
     wanted to behave before they were crammed into one column. */
  function placeItems(btn) {
    var cur = valueOf(btn);
    var pick = function (v) {
      return function () { setValue(btn, v); window.SugiraMenu.close(); apply(btn); };
    };
    var rows = [{ label: 'All of Rwanda', selected: cur === 'Rwanda', onPick: pick('Rwanda') },
                { separator: true }];

    Object.keys(PLACES).forEach(function (prov) {
      rows.push({
        label: prov,
        hint: Object.keys(PLACES[prov]).length + '',
        submenu: function () {
          var sub = [{ label: 'All of ' + prov, selected: cur === prov, onPick: pick(prov) },
                     { separator: true }];
          Object.keys(PLACES[prov]).forEach(function (d) {
            sub.push({
              label: d,
              hint: PLACES[prov][d].length + '',
              submenu: function () {
                var s2 = [{ label: 'All of ' + d, selected: cur === d, onPick: pick(d) },
                          { separator: true }];
                PLACES[prov][d].forEach(function (sec) {
                  s2.push({ label: sec, selected: cur === sec, onPick: pick(sec) });
                });
                return s2;
              }
            });
          });
          return sub;
        }
      });
    });
    return rows;
  }

  function listItems(btn, dim) {
    var cur = valueOf(btn);
    var pick = function (v) {
      return function () { setValue(btn, v); window.SugiraMenu.close(); apply(btn); };
    };
    var rows = [{ label: dim.all, selected: cur === dim.all, onPick: pick(dim.all) }];
    if (dim.options.length) rows.push({ separator: true });
    dim.options.forEach(function (o) {
      if (o === dim.all) return;
      rows.push({ label: o, selected: cur === o, onPick: pick(o) });
    });
    return rows;
  }

  /* ---- applying ---- */

  function barOf(el) { return el.closest('.filters'); }

  function activeOn(bar) {
    return $$('.fl', bar).map(function (b) {
      var dim = DIMENSIONS[keyOf(b)];
      if (!dim) return null;
      var v = valueOf(b);
      if (v === dim.all) return null;
      return { key: keyOf(b), value: v, btn: b };
    }).filter(Boolean);
  }

  /* A filter binds to a column, not to the row's text.
     Matching against whole-row text made the cohort "4" match HH-1042, and on a
     screen with two tables it hid rows in the table the filter had nothing to
     say about. A filter now applies to a table only when that table has one of
     its columns, and then it reads that column alone. */
  var COLUMN_FOR = {
    place:    ['place', 'where'],
    district: ['place', 'where', 'district'],
    cohort:   ['cohort'],
    status:   ['status', 'outcome'],
    module:   ['module', 'session'],
    role:     ['role'],
    project:  ['project', 'projects'],
    level:    ['level']
  };

  function headerIndex(table, key) {
    var aliases = COLUMN_FOR[key] || [];
    var heads = $$('thead th', table).map(function (th) {
      return th.textContent.trim().toLowerCase();
    });
    for (var i = 0; i < heads.length; i++) {
      for (var j = 0; j < aliases.length; j++) {
        if (heads[i].indexOf(aliases[j]) > -1) return i;
      }
    }
    return -1;
  }

  function cellMatches(row, idx, value) {
    var cells = row.children;
    if (idx < 0 || idx >= cells.length) return false;
    var t = cells[idx].textContent.trim().toLowerCase();
    var v = value.toLowerCase();
    return t === v || (v.length >= 3 && t.indexOf(v) > -1);
  }

  function apply(from) {
    var bar = barOf(from);
    if (!bar) return;
    var screen = bar.closest('.screen');
    if (!screen) return;

    var active = activeOn(bar);
    var search = bar.querySelector('.search input');
    var q = search && search.value.trim().toLowerCase();

    var shown = 0, total = 0;

    $$('.tbl', screen).forEach(function (table) {
      // which of the active filters this table can actually answer
      var cols = active.map(function (f) {
        return { f: f, i: headerIndex(table, f.key) };
      }).filter(function (c) { return c.i > -1; });

      // A table none of the filters name is left alone rather than emptied.
      if (!cols.length && !q) {
        $$('tbody tr', table).forEach(function (r) { r.classList.remove('f-out'); });
        return;
      }
      var rows = $$('tbody tr', table).filter(function (r) { return !r.classList.contains('t-out'); });
      total += rows.length;
      rows.forEach(function (row) {
        var keep = cols.every(function (c) { return cellMatches(row, c.i, c.f.value); });
        if (keep && q) keep = (row.innerText || '').toLowerCase().indexOf(q) > -1;
        row.classList.toggle('f-out', !keep);
        if (keep) shown += 1;
      });
    });

    // the Places tree filters by its own level label
    var tree = $$('.tree .tr', screen);
    if (tree.length) {
      var lvl = active.filter(function (f) { return f.key === 'level'; })[0];
      total += tree.length;
      tree.forEach(function (row) {
        var lv = row.querySelector('.lv');
        var keep = !lvl || (!!lv && lv.textContent.toLowerCase().indexOf(lvl.value.toLowerCase()) === 0);
        if (keep && q) keep = (row.innerText || '').toLowerCase().indexOf(q) > -1;
        row.classList.toggle('f-out', !keep);
        if (keep) shown += 1;
      });
    }

    if (screen.id === 's-dashboard') scopeDashboard(active);
    document.dispatchEvent(new CustomEvent('filters:applied', { detail: { screen: screen.id } }));
    summarise(bar, active, shown, total);
  }

  /* What is applied, shown as removable chips. The old filter never told you
     what it was filtering by, which is why people reloaded the page to clear it. */
  function summarise(bar, active, shown, total) {
    var sum = bar.nextElementSibling;
    if (!sum || !sum.classList.contains('flsum')) {
      sum = document.createElement('div');
      sum.className = 'flsum';
      bar.parentNode.insertBefore(sum, bar.nextSibling);
    }
    var search = bar.querySelector('.search input');
    var q = search && search.value.trim();

    if (!active.length && !q) { sum.hidden = true; sum.innerHTML = ''; return; }
    sum.hidden = false;
    sum.innerHTML = '';

    var n = document.createElement('span');
    n.className = 'flsum-n';
    n.textContent = shown + ' of ' + total;
    sum.appendChild(n);

    active.forEach(function (f) {
      var c = document.createElement('button');
      c.type = 'button';
      c.className = 'flchip';
      c.innerHTML = '<span class="k">' + f.key + '</span>' + f.value + '<span class="x">×</span>';
      c.setAttribute('aria-label', 'Remove ' + f.key + ' filter');
      c.addEventListener('click', function () {
        setValue(f.btn, DIMENSIONS[f.key].all);
        apply(f.btn);
      });
      sum.appendChild(c);
    });

    if (q) {
      var sc = document.createElement('button');
      sc.type = 'button';
      sc.className = 'flchip';
      sc.innerHTML = '<span class="k">search</span>' + q + '<span class="x">×</span>';
      sc.addEventListener('click', function () { search.value = ''; apply(search); });
      sum.appendChild(sc);
    }

    var clr = document.createElement('button');
    clr.type = 'button';
    clr.className = 'flclear';
    clr.textContent = 'Clear all';
    clr.addEventListener('click', function () {
      $$('.fl', bar).forEach(function (b) {
        var d = DIMENSIONS[keyOf(b)];
        if (d) setValue(b, d.all);
      });
      if (search) search.value = '';
      apply(bar.querySelector('.fl') || search);
    });
    sum.appendChild(clr);
  }

  /* ---- wiring ---- */

  $$('.filters .fl').forEach(function (btn) {
    var dim = DIMENSIONS[keyOf(btn)];
    if (!dim) return;
    // Every screen opens on the whole country and narrows from there, so a
    // filter starts at its "everything" value whatever the markup happened to
    // say. A screen that loads already filtered hides rows nobody excluded.
    if (!dim.always) setValue(btn, dim.all);
    btn.setAttribute('aria-haspopup', 'menu');
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      window.SugiraMenu.show(btn, dim.tree ? placeItems(btn) : listItems(btn, dim),
                             { width: dim.tree ? 220 : 200 });
    });
  });

  $$('.filters .search input').forEach(function (inp) {
    var t = null;
    inp.addEventListener('input', function () {
      clearTimeout(t);
      t = setTimeout(function () { apply(inp); }, 120);
    });
  });

  // The tiles are rendered from BOARD at rest too, so the numbers on screen and
  // the numbers the filters produce can never drift apart.
  if (document.getElementById('s-dashboard')) scopeDashboard([]);

  /* Navigation needs to set a filter when a sub-item lands on a filtered view,
     and it must go through the same path a click does, so the two can never
     hold different ideas of what the screen is showing. */
  window.SugiraFilters = {
    set: function (screenId, key, value) {
      var btn = $$('#' + screenId + ' .fl').filter(function (b) { return keyOf(b) === key; })[0];
      if (!btn) return false;
      setValue(btn, value);
      apply(btn);
      return true;
    },
    clear: function (screenId) {
      var bar = $('#' + screenId + ' .filters');
      if (!bar) return false;
      $$('.fl', bar).forEach(function (b) {
        var d = DIMENSIONS[keyOf(b)];
        if (d) setValue(b, d.all);
      });
      var inp = bar.querySelector('.search input');
      if (inp) inp.value = '';
      apply(bar.querySelector('.fl') || inp);
      return true;
    }
  };

  // Dismissal, Escape and reposition-on-resize all belong to the shared menu now.
})();
