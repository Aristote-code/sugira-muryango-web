/* Editing where the record is.

   Opening a record and then having to open a dialog on top of it to change
   one field is two surfaces for one thought. The system's own rule is blunt
   about it — "titles, names and fields edit in place; Enter saves, Escape
   stops editing; there is no edit mode or Save button" — and the property
   cell is the picker's trigger, so the change applies the moment it is
   chosen.

   So: every value in a record's property grid is a control. Click it and it
   becomes a field, or a menu where the value comes from a fixed set. Enter
   or clicking away saves, Escape puts it back. A change says what it was,
   with an undo, because an edit that happens instantly needs a way back. */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) {
    return Array.prototype.slice.call((r || document).querySelectorAll(s));
  };

  /* Where a value comes from a fixed set, it is picked, not typed. Keyed by
     the label the row carries. */
  var CHOICES = {
    'status': ['On track', 'Behind', 'Risk of harm', 'Active', 'Closed', 'Draft'],
    'cohort': ['Cohort 1', 'Cohort 2', 'Cohort 3', 'Cohort 4'],
    'session': ['Session 1', 'Session 2', 'Session 3', 'Session 4', 'Session 5',
      'Session 6', 'Session 7', 'Session 8', 'Session 9', 'Session 10',
      'Session 11', 'Session 12'],
    'family structure': ['Single mother-headed household', 'Single father-headed household',
      'Both caregivers present', 'Child-headed household', 'Grandparent-headed household'],
    'consent': ['Given', 'Withdrawn', 'Not yet asked'],
    'position': ['Sugira Muryango Sector lead (SLA)', 'Sugira Muryango District lead (DTL)',
      'IZU at Village', 'IZU Cell Coordinator (ICC)',
      'District NCDA Child protection and Welfare Officer (CPWO)',
      'National NCDA Government Official', 'HQ officer', 'admin'],
    'opens records at': ['Village', 'Cell', 'Sector', 'District', 'Province', 'National'],
    'visible on app': ['Available', 'Not visible'],
    'language': ['Kinyarwanda', 'English', 'Both']
  };

  var undo = null;

  function say(msg, back) {
    undo = back;
    var t = $('#toast');
    if (!t) return;
    t.innerHTML = '';
    t.appendChild(document.createTextNode(msg));
    if (back) {
      var u = document.createElement('button');
      u.className = 'toast-undo';
      u.type = 'button';
      u.textContent = 'Undo';
      u.onclick = function () {
        back();
        t.hidden = true;
        undo = null;
      };
      t.appendChild(u);
    }
    t.hidden = false;
    clearTimeout(say.timer);
    say.timer = setTimeout(function () { t.hidden = true; }, 6000);
  }

  function labelOf(cell) {
    var row = cell.closest('.pgr') || cell.closest('.fld');
    var k = row && (row.querySelector('.k span:last-child')
      || row.querySelector('.fld-k span:last-child'));
    return k ? k.textContent.trim().toLowerCase() : '';
  }

  /* The property grid writes an empty value as an em dash, the fields
     section as an en dash; neither is a value. */
  function blank(text) {
    return !text || text === '\u2014' || text === '\u2013' || text === 'Empty';
  }

  /* The text a cell shows, ignoring the chips and links it may wrap. */
  function plain(cell) {
    return cell.textContent.replace(/\s+/g, ' ').trim();
  }

  function commit(cell, next, was) {
    if (next === was) return;
    cell.innerHTML = '';
    cell.appendChild(document.createTextNode(next));
    cell.classList.remove('empty');
    var label = labelOf(cell);
    say((label ? label.charAt(0).toUpperCase() + label.slice(1) : 'Value')
      + ' is now ' + next, function () {
        cell.innerHTML = '';
        cell.appendChild(document.createTextNode(was));
        if (blank(was)) cell.classList.add('empty');
      });
  }

  /* ---- a field, in the cell ---- */

  function typeIn(cell) {
    var was = plain(cell);
    var input = document.createElement('input');
    input.type = 'text';
    input.className = 'pgedit';
    input.value = blank(was) ? '' : was;
    cell.innerHTML = '';
    cell.appendChild(input);
    cell.classList.add('editing');
    input.focus();
    input.select();

    var closed = false;
    function done(save) {
      if (closed) return;
      closed = true;
      cell.classList.remove('editing');
      var next = input.value.trim();
      if (!save || !next) {
        cell.innerHTML = '';
        cell.appendChild(document.createTextNode(was));
        if (blank(was)) cell.classList.add('empty');
        return;
      }
      commit(cell, next, was);
    }
    input.onkeydown = function (e) {
      if (e.key === 'Enter') { e.preventDefault(); done(true); }
      else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); done(false); }
    };
    input.onblur = function () { done(true); };
  }

  /* ---- a menu, where the value is one of a set ---- */

  var openMenu = null;

  function shutMenu() {
    if (!openMenu) return;
    openMenu.remove();
    openMenu = null;
  }

  function pick(cell, options) {
    shutMenu();
    var was = plain(cell);
    var m = document.createElement('div');
    m.className = 'pgmenu';
    m.setAttribute('role', 'menu');
    options.forEach(function (o) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'pgmenu-i' + (o === was ? ' on' : '');
      b.setAttribute('role', 'menuitemradio');
      b.setAttribute('aria-checked', String(o === was));
      b.textContent = o;
      b.onclick = function (e) {
        e.stopPropagation();
        shutMenu();
        commit(cell, o, was);
      };
      m.appendChild(b);
    });
    document.body.appendChild(m);
    openMenu = m;

    var r = cell.getBoundingClientRect();
    var w = m.offsetWidth, h = m.offsetHeight, pad = 12;
    var left = Math.min(r.left, document.documentElement.clientWidth - w - pad);
    var top = r.bottom + 4;
    if (top + h > window.innerHeight - pad) top = Math.max(pad, r.top - h - 4);
    m.style.left = Math.max(pad, left) + window.scrollX + 'px';
    m.style.top = top + window.scrollY + 'px';
    var first = m.querySelector('.on') || m.firstChild;
    if (first) first.focus();
  }

  /* ---- wiring ---- */

  function editable(cell) {
    if (cell.dataset.editable) return;
    cell.dataset.editable = '1';
    cell.setAttribute('tabindex', '0');
    cell.setAttribute('role', 'button');
    cell.title = '';
  }

  function start(cell) {
    /* a field declares its own set when it has one */
    var t = cell.getAttribute('data-ftype') || '';
    var opts = t.indexOf('choice:') === 0 ? t.slice(7).split(',')
      : CHOICES[labelOf(cell)];
    if (opts) pick(cell, opts); else typeIn(cell);
  }

  document.addEventListener('click', function (e) {
    if (openMenu && !openMenu.contains(e.target)) shutMenu();
    var cell = e.target.closest ? e.target.closest('.pgr .v, .fld .v') : null;
    /* a link or chip inside the value keeps its own job */
    if (!cell || cell.classList.contains('editing')) return;
    if (e.target.closest('.rel, button:not(.pgmenu-i), a')) return;
    e.stopPropagation();
    start(cell);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') shutMenu();
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var cell = document.activeElement;
    if (!cell || !cell.classList || !cell.classList.contains('v')) return;
    if (!cell.closest('.pgr') && !cell.closest('.fld')) return;
    e.preventDefault();
    start(cell);
  });

  /* ---- the title and the description edit in place too ---- */

  function inPlace(node, what) {
    if (!node || node.dataset.inplace) return;
    node.dataset.inplace = '1';
    node.setAttribute('tabindex', '0');
    node.addEventListener('focus', function () { node.classList.add('inplace'); });
    node.addEventListener('blur', function () {
      node.classList.remove('inplace');
      node.removeAttribute('contenteditable');
    });
    node.addEventListener('click', function () {
      if (node.getAttribute('contenteditable')) return;
      var was = node.textContent;
      node.setAttribute('contenteditable', 'plaintext-only');
      node.focus();
      function off(e) {
        if (e.type === 'keydown' && e.key === 'Escape') {
          node.textContent = was;
          node.blur();
        } else if (e.type === 'keydown' && e.key === 'Enter' && what === 'title') {
          e.preventDefault();
          node.blur();
        } else if (e.type === 'blur') {
          node.removeAttribute('contenteditable');
          if (node.textContent.trim() && node.textContent !== was) {
            var now = node.textContent;
            say(what === 'title' ? 'Renamed to ' + now : 'Description changed',
              function () { node.textContent = was; });
          } else if (!node.textContent.trim()) {
            node.textContent = was;
          }
          node.removeEventListener('keydown', off);
          node.removeEventListener('blur', off);
        }
      }
      node.addEventListener('keydown', off);
      node.addEventListener('blur', off);
    });
  }

  function mount() {
    $$('.pgr .v, .fld .v').forEach(editable);
    $$('.rec h1').forEach(function (h) { inPlace(h, 'title'); });
    $$('.rec-desc').forEach(function (d) { inPlace(d, 'description'); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
  /* the fields section is built after this file runs, so it says when its
     rows exist and they pick up the same keyboard handling */
  document.addEventListener('fields:ready', mount);
  window.addEventListener('resize', shutMenu);
  window.addEventListener('scroll', shutMenu, true);
})();
