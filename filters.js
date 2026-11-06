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
    /* "switching between today, this week, this month… there would also be a
       place where you can put a range of time", and "even to all the pages,
       they would all look like that". One dimension, one word, every list that
       has a moment in it. */
    when:     { all: 'Any time', fixed: true, options: ['Today', 'This week', 'This month', 'This year', 'Date range…'] },
    form:     { all: 'Any',         options: ['Visit record', 'Caregiver obs.', 'Supervisor spot-check'] },
    status:   { all: 'Any',         options: ['Active', 'Behind', 'Complete', 'Overdue', 'Invited'] },
    module:   { all: 'Any',         options: SESSIONS },
    role:     { all: 'Any',         options: ROLES },
    project:  { all: 'Any',         options: PROJECTS },
    year:     { all: 'All',         options: ['2026', '2025', '2024'] },
    izu:      { all: 'All',         options: ['M. Dusabe', 'J. Kamanzi', 'E. Mutesi', 'A. Nyirahabimana', 'B. Uwamahoro'] },
    level:    { all: 'All',         options: ['Province', 'District', 'Sector'] },
    /* A document type is a folder somebody made, so the list of them is read
       off the documents rather than written here. Same for the kind of thing a
       follow-up is chasing. */
    type:     { all: 'All',         options: [] },
    kind:     { all: 'Any',         options: [] }
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
    var sub = document.getElementById('dashScope');
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

  /* "Date range…" is the only option that cannot answer itself, so it asks.
     Two dates, and the chip then reads the span rather than the word — a
     filter that says "Date range…" afterwards has told you nothing. */
  function askRange(btn) {
    var cur = valueOf(btn);
    var pair = cur.split('–');
    var iso = function (d) {
      return d ? d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2)
        + '-' + ('0' + d.getDate()).slice(-2) : '';
    };
    var a = readDate(pair[0]) || new Date(2026, 9, 1);
    var b = readDate(pair[1] || '') || TODAY;
    window.SugiraModal.ask({
      title: 'A range of time',
      ok: 'Show that range',
      body: '<div><label for="f-wa">From</label><input id="f-wa" type="date" value="' + iso(a) + '"></div>' +
            '<div><label for="f-wb">To</label><input id="f-wb" type="date" value="' + iso(b) + '"></div>',
      onOk: function (body) {
        var from = body.querySelector('#f-wa').value;
        var to = body.querySelector('#f-wb').value;
        if (!from || !to) return;
        var show = function (s) {
          var d = new Date(s + 'T00:00:00');
          return d.getDate() + ' ' + ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
            'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()] + ' ' + d.getFullYear();
        };
        setValue(btn, show(from) + ' – ' + show(to));
        apply(btn);
      }
    });
  }

  function listItems(btn, dim) {
    var cur = valueOf(btn);
    var pick = function (v) {
      return function () {
        if (/^Date range/.test(v)) { window.SugiraMenu.close(); askRange(btn); return; }
        setValue(btn, v); window.SugiraMenu.close(); apply(btn);
      };
    };
    var opts = optionsFor(btn, keyOf(btn), dim);
    var rows = [{ label: dim.all, selected: cur === dim.all, onPick: pick(dim.all) }];
    if (opts.length) rows.push({ separator: true });
    opts.forEach(function (o) {
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
    level:    ['level'],
    form:     ['form', 'survey'],
    izu:      ['izu', 'visitor'],
    type:     ['type'],
    kind:     ['kind'],
    /* Every heading in this app that holds a moment, matched whole. As
       fragments they caught four columns that hold nothing of the kind:
       "Posted by" and "Archived by" are people, "Opened" is a count, and
       "When this answer is given" is a condition. A chip bound to one of those
       filters a column it cannot read, which empties a list for no reason
       anybody can see. */
    when:     ['=when', '=date', '=last visit', '=last run', '=last active',
               '=last sync', '=last edited', '=archived', '=sent', '=updated',
               '=review due', '=waiting', '=posted']
  };

  /* ---- reading the dates this app writes ----------------------------------
     "Today 09:12", "Yesterday 16:40", "2 days ago", "31 Oct", "23 Jun 2025",
     "now", "6 days". One vocabulary, written six ways across thirty screens,
     so it is read in one place.

     A cell with no moment in it — "—", "Not scheduled" — is not in any range,
     which is the honest answer: it has no date, so no date filter claims it. */
  var TODAY = new Date(2026, 10, 6);          // the day this prototype is on
  var MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun',
                'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

  function days(d) { return Math.round(d.getTime() / 86400000); }

  function readDate(text) {
    var t = (text || '').toLowerCase().trim();
    if (!t || t === '—' || t === '-') return null;
    if (/^now\b/.test(t) || /^today\b/.test(t)) return TODAY;
    if (/^yesterday\b/.test(t)) return new Date(2026, 10, 5);

    var ago = t.match(/^(\d+)\s*(minute|hour|day|week|month)/);
    if (ago) {
      var n = +ago[1], unit = ago[2];
      var back = unit === 'minute' || unit === 'hour' ? 0
        : unit === 'day' ? n : unit === 'week' ? n * 7 : n * 30;
      return new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() - back);
    }

    /* "23 Jun 2025", "31 Oct", "14 Aug 2026" */
    var dm = t.match(/(\d{1,2})\s+([a-z]{3})[a-z]*\.?(?:\s+(\d{4}))?/);
    if (dm) {
      var mi = MONTHS.indexOf(dm[2]);
      if (mi < 0) return null;
      var y = dm[3] ? +dm[3] : TODAY.getFullYear();
      var d = new Date(y, mi, +dm[1]);
      /* A day and a month with no year is the most recent one that has
         happened, not one in the future. */
      if (!dm[3] && d > TODAY) d = new Date(y - 1, mi, +dm[1]);
      return d;
    }
    return null;
  }

  /* A value from the menu, or "12 Jan 2026 – 11 May 2026" from the range
     dialog, as a pair of day numbers. */
  function window_(value) {
    var v = (value || '').toLowerCase();
    var t = days(TODAY);
    if (v === 'today') return [t, t];
    if (v === 'this week') return [t - 6, t];
    if (v === 'this month') return [t - 29, t];
    if (v === 'this year') return [days(new Date(TODAY.getFullYear(), 0, 1)), t];
    var pair = (value || '').split('–');
    if (pair.length === 2) {
      var a = readDate(pair[0]), b = readDate(pair[1]);
      if (a && b) return [days(a), days(b)];
    }
    return null;
  }

  function headerIndex(table, key) {
    var aliases = COLUMN_FOR[key] || [];
    var heads = $$('thead th', table).map(function (th) {
      return th.textContent.trim().toLowerCase();
    });
    for (var i = 0; i < heads.length; i++) {
      for (var j = 0; j < aliases.length; j++) {
        var a = aliases[j];
        /* "=" asks for the whole heading. Most dimensions want the fragment —
           Project has to find "Project, exactly as it is stored" — but a
           dimension that reads the cell rather than compares it as text has to
           be sure of the column it got. */
        var hit = a.charAt(0) === '=' ? heads[i] === a.slice(1)
          : heads[i].indexOf(a) > -1;
        if (hit) return i;
      }
    }
    return -1;
  }

  /* A cell can carry text it is hiding — a safeguarding row holds both the
     household name and the "household withheld" stand-in, one of them
     display:none by role. Reading textContent would offer the redaction as a
     filter value. display is read off the element, not off layout, so a row
     the filter has already hidden still reports the same text. */
  function visibleText(el) {
    var out = '';
    Array.prototype.forEach.call(el.childNodes, function (n) {
      if (n.nodeType === 3) { out += n.nodeValue; return; }
      if (n.nodeType !== 1) return;
      if (getComputedStyle(n).display === 'none') return;
      out += visibleText(n);
    });
    return out.replace(/\s+/g, ' ').trim();
  }

  /* What this screen can actually be narrowed by. Falls back to the
     configured list for dimensions with no column to read — place, which is
     a hierarchy rather than a column, and period, which is not in the data. */
  function optionsFor(btn, key, dim) {
    if (dim.tree) return dim.options;
    /* A period is worked out, not collected. Offering the column's own values
       would put "Today 09:12" and "3 Nov 14:05" in the menu — every row its
       own filter, which is a list of the data, not a way through it. */
    if (dim.fixed) return dim.options;
    var screen = btn.closest('.screen');
    if (!screen) return dim.options;
    var seen = [];
    // A screen can hold several tables behind tabs. Only the one on screen
    // should contribute values, or Status on Follow-ups offers On and Off
    // from the rules table nobody is looking at.
    var tables = $$('.tbl', screen).filter(function (t) { return t.offsetParent !== null; });
    if (!tables.length) tables = $$('.tbl', screen);
    tables.forEach(function (table) {
      var i = headerIndex(table, key);
      if (i < 0) return;
      $$('tbody tr', table).forEach(function (r) {
        var c = r.children[i];
        if (!c) return;
        var v = visibleText(c);
        if (v && v !== '\u2014' && seen.indexOf(v) < 0) seen.push(v);
      });
    });
    return seen.length > 1 ? seen.sort() : dim.options;
  }

  function cellMatches(row, idx, value, key) {
    var cells = row.children;
    if (idx < 0 || idx >= cells.length) return false;
    var t = visibleText(cells[idx]).toLowerCase();
    /* A moment is compared as a moment. "2 days ago" is inside this week and
       "31 Oct" is not inside today, neither of which string matching can say. */
    if (key === 'when') {
      var win = window_(value);
      if (!win) return true;
      var d = readDate(t);
      if (!d) return false;
      return days(d) >= win[0] && days(d) <= win[1];
    }
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
        var keep = cols.every(function (c) { return cellMatches(row, c.i, c.f.value, c.f.key); });
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

  /* "even to all the pages, they would all look like that."

     Not every page: every page with a moment on it. A chip the table cannot
     answer is worse than none — it reads as a control and does nothing — so a
     list gets one only when one of its columns holds a date, and it is added
     here rather than written into thirty filter rows by hand. */
  function whenChip() {
    var btn = document.createElement('button');
    btn.className = 'fl';
    btn.type = 'button';
    btn.innerHTML = '<span class="k">When</span><b></b><span class="cv">▼</span>';
    return btn;
  }

  function mountWhen() {
    $$('.screen').forEach(function (screen) {
      if ($$('.fl', screen).some(function (b) { return keyOf(b) === 'when'; })) return;
      var dated = $$('.tbl', screen).filter(function (t) {
        return headerIndex(t, 'when') > -1;
      });
      if (!dated.length) return;

      var bar = screen.querySelector('.filters');
      if (bar) {
        /* After the search, before the controls that act on the result: a
           period is what you are looking at, not a view setting. */
        var btn = whenChip();
        var search = bar.querySelector('.search');
        if (search) search.parentNode.insertBefore(btn, search.nextSibling);
        else bar.insertBefore(btn, bar.firstChild);
        wire(btn);
        return;
      }
      /* A record screen — a household, a module, a person — has no filter row
         of its own, because a row floating above its tabs would belong to
         whichever table happened to be open. Its tables each carry a toolbar
         instead, so the chip goes in there, at the front of the one table on
         that tab that has dates in it. */
      dated.forEach(function (t) {
        var host = t.closest('.card') || t.closest('.tblwrap');
        var tq = host && host.parentNode.querySelector('.tq');
        if (!tq || $$('.fl', tq).some(function (b) { return keyOf(b) === 'when'; })) return;
        var b2 = whenChip();
        tq.insertBefore(b2, tq.firstChild);
        wire(b2);
      });
    });
  }

  function wire(btn) {
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
  }

  $$('.filters .fl').forEach(wire);

  /* The generated toolbars carry the Columns button a table is read through,
     and they land on the same row, so the When chip waits for them. */
  if (window.SugiraTablesReady) mountWhen();
  else document.addEventListener('tables:ready', mountWhen);

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
