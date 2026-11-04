/* Group by, and groups that collapse.

   The first thing the recording shows is a list gathered under a status
   header — "▾ IN PROGRESS 2" — and the narration is about not having to see
   everything at once: "I don't have to see everything at the same time."
   Places got that as a tree because places are a tree. A table is not; the
   same gesture on a table is grouping, which is what ClickUp does and what
   its toolbar's leftmost chip is for.

   So every table that has a column worth grouping by gets the chip. Picking
   a column gathers the rows under a header carrying the value and its count,
   and the header's caret folds its rows away. Grouping runs after sorting and
   filtering, over whatever is still showing, so the three compose instead of
   overwriting each other.

   A column is worth grouping by when it repeats: between two and eight
   distinct values across the rows. One value per row is a list of headers,
   and nine groups of two is not a grouping either. */
(function () {
  'use strict';

  var MIN_GROUPS = 2, MAX_GROUPS = 8;

  /* Rows carry alternates that are switched off — a redacted twin of a cell,
     a count in place of a name — and a group must be named by what is on
     screen, not by what is hidden behind it. Display is read off the element
     itself, because offsetParent lies inside a hidden ancestor. */
  function text(td) {
    if (!td) return '';
    var out = '';
    Array.prototype.forEach.call(td.childNodes, function (n) {
      if (n.nodeType === 3) { out += n.nodeValue; return; }
      if (n.nodeType !== 1) return;
      if (getComputedStyle(n).display === 'none') return;
      out += text(n);
    });
    return out.replace(/\s+/g, ' ').trim();
  }

  function groupable(table) {
    var heads = Array.prototype.slice.call(table.querySelectorAll('thead th'));
    var rows = Array.prototype.slice.call(table.querySelectorAll('tbody tr'))
      .filter(function (r) { return !r.classList.contains('grp'); });
    if (rows.length < 4) return [];
    return heads.map(function (th, i) {
      return { i: i, name: text(th).replace(/\s*\d+$/, '') };
    }).filter(function (c) {
      if (!c.name || /^(actions?|#)$/i.test(c.name)) return false;
      var seen = {}, n = 0;
      for (var k = 0; k < rows.length; k++) {
        var v = text(rows[k].cells[c.i]);
        if (!v) return false;
        if (!seen[v]) { seen[v] = 1; n++; }
        if (n > MAX_GROUPS) return false;
      }
      return n >= MIN_GROUPS && n < rows.length;
    });
  }

  function setup(table) {
    if (table.dataset.grouped) return;
    var cols = groupable(table);
    if (!cols.length) return;
    table.dataset.grouped = '1';

    var host = table.closest('.card') || table.closest('.tblwrap');
    var bar = host && host.previousElementSibling;
    /* The table's toolbar is the row before it. On a screen that writes its
       own filter row the generated controls flow into that row, so the row
       is the toolbar; on a screen without one the generated row is. */
    var tq = null;
    if (bar && bar.classList) {
      tq = bar.classList.contains('tq') || bar.classList.contains('filters')
        ? bar : bar.querySelector('.tq, .filters');
    }
    if (!tq) {
      var sc = table.closest('.screen');
      tq = sc && (sc.querySelector('.filters') || sc.querySelector('.tq'));
    }
    if (!tq) return;

    var body = table.querySelector('tbody');
    var state = { col: null, shut: {} };

    var chip = document.createElement('button');
    chip.className = 'fl grpby';
    chip.type = 'button';
    chip.setAttribute('aria-haspopup', 'menu');
    paintChip();

    var cols0 = tq.querySelector('[data-q="cols"]');
    if (cols0 && cols0.parentNode === tq) tq.insertBefore(chip, cols0.nextSibling);
    else tq.insertBefore(chip, tq.firstChild);

    function paintChip() {
      chip.innerHTML = '';
      var k = document.createElement('span');
      k.className = 'k';
      k.textContent = 'Group';
      var b = document.createElement('b');
      b.textContent = state.col === null ? 'None'
        : (cols.filter(function (c) { return c.i === state.col; })[0] || {}).name;
      var cv = document.createElement('span');
      cv.className = 'cv';
      cv.textContent = '▼';
      chip.appendChild(k);
      chip.appendChild(b);
      chip.appendChild(cv);
      chip.classList.toggle('on', state.col !== null);
    }

    var menu = null;
    function shutMenu() { if (menu) { menu.remove(); menu = null; } }

    chip.onclick = function (e) {
      e.stopPropagation();
      if (menu) { shutMenu(); return; }
      menu = document.createElement('div');
      menu.className = 'pgmenu';
      menu.setAttribute('role', 'menu');
      [{ i: null, name: 'None' }].concat(cols).forEach(function (c) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'pgmenu-i' + (c.i === state.col ? ' on' : '');
        b.setAttribute('role', 'menuitemradio');
        b.setAttribute('aria-checked', String(c.i === state.col));
        b.textContent = c.name;
        b.onclick = function (ev) {
          ev.stopPropagation();
          shutMenu();
          state.col = c.i;
          state.shut = {};
          paintChip();
          draw();
        };
        menu.appendChild(b);
      });
      document.body.appendChild(menu);
      var r = chip.getBoundingClientRect();
      var w = menu.offsetWidth, pad = 12;
      menu.style.left = Math.max(pad, Math.min(r.left,
        document.documentElement.clientWidth - w - pad)) + window.scrollX + 'px';
      menu.style.top = (r.bottom + 4) + window.scrollY + 'px';
    };

    function clear() {
      Array.prototype.slice.call(body.querySelectorAll('tr.grp'))
        .forEach(function (g) { g.remove(); });
      Array.prototype.slice.call(body.rows).forEach(function (r) {
        if (r.dataset.ghidden) { delete r.dataset.ghidden; r.hidden = false; r.style.display = ''; }
      });
    }

    var drawing = false;
    function draw() {
      if (drawing) return;
      drawing = true;
      clear();
      if (state.col === null) { drawing = false; return; }

      var span = table.querySelectorAll('thead th').length;
      var rows = Array.prototype.slice.call(body.rows).filter(function (r) {
        return !r.classList.contains('grp') && !r.hidden
          && getComputedStyle(r).display !== 'none';
      });
      var order = [], buckets = {};
      rows.forEach(function (r) {
        var v = text(r.cells[state.col]) || '—';
        if (!buckets[v]) { buckets[v] = []; order.push(v); }
        buckets[v].push(r);
      });

      order.forEach(function (v) {
        var shut = !!state.shut[v];
        var tr = document.createElement('tr');
        tr.className = 'grp';
        var td = document.createElement('td');
        td.colSpan = span;
        var btn = document.createElement('button');
        btn.className = 'grp-h';
        btn.type = 'button';
        btn.setAttribute('aria-expanded', String(!shut));
        btn.innerHTML = '<span class="grp-c"><svg aria-hidden="true">'
          + '<use href="#i-caret"/></svg></span>';
        var pill = document.createElement('span');
        pill.className = 'grp-p';
        pill.textContent = v;
        btn.appendChild(pill);
        var n = document.createElement('span');
        n.className = 'grp-n';
        n.textContent = buckets[v].length;
        btn.appendChild(n);
        btn.onclick = function (e) {
          e.stopPropagation();
          state.shut[v] = !shut;
          draw();
        };
        td.appendChild(btn);
        tr.appendChild(td);
        body.appendChild(tr);
        buckets[v].forEach(function (r) {
          body.appendChild(r);
          if (shut) {
            r.dataset.ghidden = '1';
            r.hidden = true;
            r.style.display = 'none';
          }
        });
      });
      drawing = false;
    }

    document.addEventListener('click', shutMenu);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') shutMenu(); });
    table.addEventListener('table:applied', function () { if (state.col !== null) draw(); });
  }

  function init() {
    Array.prototype.slice.call(document.querySelectorAll('table.tbl'))
      .forEach(function (t) { try { setup(t); } catch (e) { /* one table must not stop the rest */ } });
  }

  /* after the tables have their toolbars */
  document.addEventListener('tables:ready', init);
  if (document.readyState !== 'loading') setTimeout(init, 0);
})();
