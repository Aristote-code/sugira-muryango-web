/* ==================== a person's name carries their colour ====================

   Every table in this app has a column saying who: who raised the case, who
   owns the report, who was in the house. Written as plain text they all look
   the same, and finding your own rows means reading forty names.

   ClickUp's answer is the letter avatar — a circle in a colour that belongs to
   that person, with their initials in it. The colour is what you actually scan
   for; the letters confirm it. So the column says it is a who-column, and
   every name in it gets its mark.

   The colour has to be the same name's colour everywhere — the same person on
   Reports, on Activity and in a drawer — or it tells you nothing. It comes
   from the name itself rather than from a list, so a name that appears
   tomorrow already has its colour and nobody has to assign one. */
(function () {
  'use strict';

  var HUES = 7;

  /* Same name in, same colour out, on every screen and after every reload. */
  function hue(name) {
    var h = 0;
    for (var i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 1000003;
    return (h % HUES) + 1;
  }

  /* "A. Gahimana" and "Mukamana Jeanne" are both two words; both give two
     letters. A name that gives none keeps its text and goes unmarked. */
  function initials(name) {
    var out = '';
    var words = name.split(/[\s.·&/-]+/);
    for (var i = 0; i < words.length && out.length < 2; i++) {
      var c = words[i].replace(/[^0-9A-Za-zÀ-ÿ]/g, '').charAt(0);
      if (c) out += c.toUpperCase();
    }
    return out;
  }

  /* The name is what the cell opens with. Anything after a middot — a
     position, a place, an organisation — qualifies it and is not part of it. */
  function nameOf(cell) {
    var t = (cell.textContent || '').replace(/\s+/g, ' ').trim();
    var i = t.indexOf('·');
    if (i > 0) t = t.slice(0, i).trim();
    return t;
  }

  function blank(t) { return !t || t === '—' || t === '-'; }

  function dress(cell) {
    if (cell.querySelector('.who-c')) return;
    var name = nameOf(cell);
    if (blank(name)) return;
    var letters = initials(name);
    if (!letters) return;

    /* The first cell of a row already carries the screen's kind mark — a
       generic people icon on the People screen. Beside a face that is this
       person, it says the same thing twice and less well, so it goes. */
    var kind = cell.querySelector('.cellmark');
    if (kind) { kind.remove(); cell.classList.remove('hasmark'); }

    var wrap = document.createElement('span');
    wrap.className = 'who-c';
    /* The initials are drawn, not written: as text they would join the cell's
       own, and everything that reads a cell — sorting, grouping, an "is"
       condition, the export — would see "MJMukamana Jeanne". */
    var av = document.createElement('span');
    av.className = 'av h' + hue(name);
    av.setAttribute('aria-hidden', 'true');
    av.setAttribute('data-i', letters);
    var rest = document.createElement('span');
    rest.className = 'who-n';
    while (cell.firstChild) rest.appendChild(cell.firstChild);
    wrap.appendChild(av);
    wrap.appendChild(rest);
    cell.appendChild(wrap);
  }

  /* A table says which of its columns names a person; the rows follow. */
  function run(root) {
    (root || document).querySelectorAll('table.tbl').forEach(function (t) {
      if (!t.tHead) return;
      var cols = [];
      [].forEach.call(t.tHead.rows[0].cells, function (h, i) {
        if (h.hasAttribute('data-person')) cols.push(i);
      });
      if (!cols.length) return;
      [].forEach.call(t.tBodies, function (body) {
        [].forEach.call(body.rows, function (r) {
          cols.forEach(function (i) { if (r.cells[i]) dress(r.cells[i]); });
        });
      });
    });
  }

  /* The two avatars written into the page by hand — the one in the top bar
     and the big one at the head of a person — wore the primary colour, which
     would have given the signed-in person one colour there and another in
     every table. They take their own name's colour like everyone else. */
  function tint(av, name) {
    if (!av || blank(name)) return;
    av.className = av.className.replace(/\s*\bh[1-7]\b/g, '') + ' h' + hue(name);
  }

  function named(root) {
    var chip = (root || document).querySelector('.userchip');
    if (chip) tint(chip.querySelector('.av'), nameOf(chip.querySelector('.who b') || {}));
    (root || document).querySelectorAll('.phead').forEach(function (h) {
      var title = h.querySelector('h1');
      /* A project's head has the same mark; only a person's carries a name. */
      if (title && h.querySelector('.big')) tint(h.querySelector('.big'), nameOf(title));
    });
  }

  function all(root) { run(root); named(root); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { all(); });
  } else all();

  /* Rows that arrive later — a drawer's own tables, a list rebuilt — ask for
     the same treatment rather than going unmarked. */
  window.SugiraWho = { run: all, hue: hue, initials: initials };
})();
