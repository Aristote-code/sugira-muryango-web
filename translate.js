/* Translating a form while watching it.

   The client's complaint, in front of this screen: "can you watch
   translated?", and then "you need to open this form again". The two halves
   of the job sat in two tabs. Preview drew the tablet; Translate held the
   strings; and checking that a Kinyarwanda line still fitted meant leaving
   the row you were working on, switching tab, finding the question, and
   coming back. Kinyarwanda runs longer than English — "Was the male caregiver
   present?" is 32 characters and "Umubyeyi w'umugabo yari ahari?" is 30, but
   "Any sign of harm or neglect?" becomes 51 — so the fit is the whole reason
   anyone previews a translation, and it was the one thing you could not see
   while translating.

   So the tablet now sits beside the strings and follows the row you are on.
   The language you are not previewing stays underneath rather than behind the
   toggle, because translating is comparing and a comparison with one side
   hidden is not one. */
(function () {
  'use strict';

  var panel, table, dev, alt, seg;
  var row = null;        // the <tr> being previewed
  var lang = 'rw';       // which language the tablet is drawn in

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  /* A cell being edited has had its text replaced by edit.js's input, so the
     text is in the input's value. Reading it there is what lets the tablet
     follow the typing rather than the last saved version — which is the whole
     of "can you watch translated?". */
  function cellText(td) {
    if (!td) return '';
    var inp = td.querySelector('input.pgedit');
    return (inp ? inp.value : td.textContent).trim();
  }

  /* The cells are #, English, Kinyarwanda, Status. The first three are what a
     translator is looking at; the status chip speaks for itself in the row. */
  function strings(tr) {
    var c = tr && tr.cells;
    if (!c || c.length < 3) return null;
    return { n: cellText(c[0]), en: cellText(c[1]), rw: cellText(c[2]) };
  }

  function total() {
    var tb = table && table.tBodies[0];
    return tb ? tb.rows.length : 0;
  }

  function draw() {
    if (!dev || !alt) return;
    dev.innerHTML = '';
    alt.innerHTML = '';
    var s = row ? strings(row) : null;
    if (!s) return;

    /* The tablet counts the question against the form's thirty, not against
       the five on this page, and says it in the language being drawn. */
    var head = lang === 'rw'
      ? 'Icyiciro 6 · Ikibazo ' + s.n + ' muri 30'
      : 'Session 6 · Question ' + s.n + ' of 30';
    dev.appendChild(el('p', 'tdev-k', head));
    dev.appendChild(el('p', 'tdev-q', lang === 'rw' ? s.rw : s.en));

    var other = el('b', null, lang === 'rw' ? 'EN' : 'RW');
    alt.appendChild(other);
    alt.appendChild(document.createTextNode(lang === 'rw' ? s.en : s.rw));
  }

  function select(tr) {
    if (!tr || !table.contains(tr)) return;
    Array.prototype.forEach.call(table.tBodies[0].rows, function (r) {
      r.classList.toggle('is-open', r === tr);
      r.setAttribute('aria-selected', r === tr ? 'true' : 'false');
    });
    row = tr;
    draw();
  }

  function onClick(e) {
    var tr = e.target.closest ? e.target.closest('tr') : null;
    if (!tr || !tr.parentNode || tr.parentNode.tagName !== 'TBODY') return;
    /* A click on the Kinyarwanda cell is someone starting to edit it, and
       edit.js owns that; selecting the row as well is right either way. */
    select(tr);
  }

  /* Up and down walk the strings, which is how anyone works through thirty
     of them. The table is the only thing focused, so nothing else sees these. */
  function onKey(e) {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    var rows = Array.prototype.slice.call(table.tBodies[0].rows);
    var i = rows.indexOf(row);
    if (i < 0) return;
    var next = rows[i + (e.key === 'ArrowDown' ? 1 : -1)];
    if (!next) return;
    e.preventDefault();
    select(next);
  }

  function mount() {
    panel = document.querySelector('#s-form [data-panelid="translate"]');
    if (!panel) return;
    table = panel.querySelector('#trTable');
    dev = panel.querySelector('#trDev');
    alt = panel.querySelector('#trAlt');
    seg = panel.querySelector('#trLang');
    if (!table || !dev || !alt || !table.tBodies[0] || !total()) return;

    table.addEventListener('click', onClick);
    table.addEventListener('keydown', onKey);
    /* Typing in a cell redraws the tablet on the next keystroke, so the fit is
       visible while the words are still being chosen. `input` fires on the
       cell's field and bubbles; the edit ends by putting a text node back,
       which is why draw() reads the cell rather than holding the string. */
    table.addEventListener('input', function () { draw(); });
    table.addEventListener('focusout', function () { setTimeout(draw, 0); });
    table.tabIndex = 0;

    if (seg) {
      seg.addEventListener('click', function (e) {
        var b = e.target.closest ? e.target.closest('button') : null;
        if (!b || !seg.contains(b)) return;
        Array.prototype.forEach.call(seg.querySelectorAll('button'), function (x) {
          x.classList.toggle('on', x === b);
        });
        lang = /kiny/i.test(b.textContent) ? 'rw' : 'en';
        draw();
      });
    }

    /* Question 3 is the one the Preview tab has always opened on, so the two
       tabs agree with each other on arrival. */
    var rows = table.tBodies[0].rows;
    select(rows[Math.min(2, rows.length - 1)]);
  }

  mount();
})();
