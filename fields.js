/* Fields, and the record menu that copies its id.

   Two things from the narration: "you have things which need fields like
   this", and "copy ID — please, you have all these stuffs".

   The fields are not decoration. The audit found the real Edit project screen
   is "eleven fields in one column, including 'Does it have modules' and 'Show
   this project on the mobile app?' as free selects", with "Kinyarwanda fields
   sit below the English ones with no pairing" (notes/09-screen-study.md, screen
   35). Those eleven fields are what this section holds, and the pairing is
   fixed here: a name that exists in two languages is one field with two
   values, tagged EN and RW, rather than two unrelated rows a screen apart.

   Geometry is CustomFieldRow as measured: rows 36 high on a 1px top
   border.subtle, a 220 label column with a 16px type icon and the name 8
   after it, the value taking the rest, and "Hide N empty fields" under them.
   Values edit in place, because edit.js binds the same contract. */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) {
    return Array.prototype.slice.call((r || document).querySelectorAll(s));
  };

  /* type: text | number | date | choice. A value given as {en, rw} is one
     field in two languages. */
  var FIELDS = {
    project: [
      ['Project name', 'text', { en: 'Household Module Tracking',
        rw: 'Gukurikirana amasomo y’umuryango' }],
      ['Description', 'text', { en: 'The core home-visiting curriculum: twelve '
        + 'fortnightly sessions plus two boosters.', rw: '' }],
      ['Project URL', 'text', ''],
      ['Archived', 'choice:Yes,No', 'No']
    ],
    module: [
      ['Session name', 'text', { en: 'The Importance of Good Health',
        rw: 'Akamaro k’ubuzima bwiza' }],
      ['Order in the project', 'number', '6'],
      ['Weeks after the previous session', 'number', '2'],
      ['Booster session', 'choice:Yes,No', 'No'],
      ['Opens a risk-of-harm case', 'choice:Yes,No', 'Yes'],
      ['Notes for the visitor', 'text', '']
    ],
    form: [
      ['Form name', 'text', { en: 'Visit record', rw: 'Inyandiko y’uruzinduko' }],
      ['Version', 'number', '4'],
      ['Published to the tablet', 'choice:Yes,No', 'Yes'],
      ['Archived', 'choice:Yes,No', 'No'],
      ['Replaces', 'text', '']
    ],
    person: [
      ['Full name', 'text', 'C. Uwimana'],
      ['Phone', 'text', '+250 78 555 0144'],
      ['Employee number', 'text', ''],
      ['Started', 'date', '3 September 2026']
    ]
  };

  var TYPE_ICON = {
    text: 'i-message', number: 'i-reports', date: 'i-clock', choice: 'i-check'
  };

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function valueCell(value, type) {
    var v = el('span', 'v' + (value ? '' : ' empty'), value || 'Empty');
    v.setAttribute('data-ftype', type);
    return v;
  }

  function row(name, type, value) {
    var r = el('div', 'fld');
    var k = el('span', 'fld-k');
    var ic = el('span', 'fld-i');
    ic.innerHTML = '<svg aria-hidden="true"><use href="#'
      + (TYPE_ICON[type.split(':')[0]] || 'i-message') + '"/></svg>';
    k.appendChild(ic);
    k.appendChild(el('span', null, name));
    r.appendChild(k);

    if (value && typeof value === 'object') {
      /* one field, two languages — the thing the old screen split in half */
      var pair = el('span', 'fld-pair');
      [['EN', value.en], ['RW', value.rw]].forEach(function (p) {
        var line = el('span', 'fld-lang');
        line.appendChild(el('span', 'fld-tag', p[0]));
        line.appendChild(valueCell(p[1], type));
        pair.appendChild(line);
      });
      r.appendChild(pair);
      r.dataset.empty = (value.en || value.rw) ? '' : '1';
    } else {
      r.appendChild(valueCell(value, type));
      r.dataset.empty = value ? '' : '1';
    }
    return r;
  }

  function build(key, defs) {
    var sc = document.getElementById('s-' + key);
    if (!sc || sc.querySelector('.fields')) return;
    var anchor = sc.querySelector('.rec-desc') || sc.querySelector('.pg');
    if (!anchor) return;

    var wrap = el('section', 'fields');
    var head = el('div', 'fields-h');
    head.appendChild(el('h3', null, 'Fields'));
    wrap.appendChild(head);

    var rows = el('div', 'fields-b');
    defs.forEach(function (d) { rows.appendChild(row(d[0], d[1], d[2])); });
    wrap.appendChild(rows);

    var empties = $$('.fld[data-empty="1"]', rows);
    if (empties.length) {
      var toggle = el('button', 'fields-t');
      toggle.type = 'button';
      var hidden = true;
      function paint() {
        empties.forEach(function (e) { e.hidden = hidden; });
        toggle.textContent = (hidden ? 'Show ' : 'Hide ') + empties.length
          + ' empty field' + (empties.length === 1 ? '' : 's');
        toggle.setAttribute('aria-expanded', String(!hidden));
      }
      toggle.onclick = function () { hidden = !hidden; paint(); };
      paint();
      wrap.appendChild(toggle);
    }

    anchor.parentNode.insertBefore(wrap, anchor.nextSibling);
  }

  /* ---- the record menu: Copy link | Copy ID, then the rest ---- */

  var open = null;

  function shut() {
    if (!open) return;
    open.remove();
    open = null;
  }

  function copy(text, said) {
    function done() {
      var t = $('#toast');
      if (!t) return;
      t.textContent = said;
      t.hidden = false;
      clearTimeout(copy.timer);
      copy.timer = setTimeout(function () { t.hidden = true; }, 3000);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, done);
    } else {
      done();
    }
  }

  function menuFor(btn, id) {
    shut();
    var m = el('div', 'recmenu');
    m.setAttribute('role', 'menu');

    /* MenuButtonGroup as measured: two bordered buttons sharing an edge,
       33 tall, outer corners r6, 13px. */
    var grp = el('div', 'recmenu-pair');
    [['Copy link', location.origin + location.pathname + '#' + id,
      'Link copied'],
     ['Copy ID', id, 'ID copied: ' + id]].forEach(function (p) {
      var b = el('button', 'recmenu-pb', p[0]);
      b.type = 'button';
      b.onclick = function (e) { e.stopPropagation(); shut(); copy(p[1], p[2]); };
      grp.appendChild(b);
    });
    m.appendChild(grp);

    [['Open as a full page', function () {
      var x = document.querySelector('[data-dw="expand"]');
      if (x) x.click();
    }], ['Print this record', function () { window.print(); }]].forEach(function (p) {
      var b = el('button', 'recmenu-i', p[0]);
      b.type = 'button';
      b.setAttribute('role', 'menuitem');
      b.onclick = function (e) { e.stopPropagation(); shut(); p[1](); };
      m.appendChild(b);
    });

    document.body.appendChild(m);
    open = m;
    var r = btn.getBoundingClientRect();
    var w = m.offsetWidth, pad = 12;
    m.style.left = Math.max(pad, Math.min(r.right - w,
      document.documentElement.clientWidth - w - pad)) + window.scrollX + 'px';
    m.style.top = (r.bottom + 4) + window.scrollY + 'px';
    var f = m.querySelector('button');
    if (f) f.focus();
  }

  function addMenu(sc) {
    var top = sc.querySelector('.rec-top');
    if (!top || top.querySelector('.recmore')) return;
    var idEl = top.querySelector('.rec-id');
    var id = idEl ? idEl.textContent.trim() : sc.id.replace(/^s-/, '');
    var acts = top.querySelector('.acts') || top;
    var b = el('button', 'recmore');
    b.type = 'button';
    b.setAttribute('aria-haspopup', 'menu');
    b.setAttribute('aria-label', 'More for ' + id);
    b.innerHTML = '<svg aria-hidden="true"><use href="#i-expand"/></svg>';
    b.textContent = '';
    b.innerHTML = '⋯';
    b.onclick = function (e) {
      e.stopPropagation();
      if (open) { shut(); return; }
      menuFor(b, id);
    };
    acts.insertBefore(b, acts.firstChild);
  }

  function mount() {
    Object.keys(FIELDS).forEach(function (k) { build(k, FIELDS[k]); });
    $$('.rec').forEach(function (rec) { addMenu(rec.closest('.screen') || rec); });
    document.dispatchEvent(new Event('fields:ready'));
  }

  document.addEventListener('click', function (e) {
    if (open && !open.contains(e.target)) shut();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') shut(); });
  window.addEventListener('scroll', shut, true);
  window.addEventListener('resize', shut);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
