/* Places, as a tree you open.

   It used to be a flat list with everything already showing and three of the
   six levels missing, so the one question it exists to answer — what is under
   this district — had no gesture. ClickUp answers it with a caret on any row
   that has children: the row opens, and what is under it is the same kind of
   row, indented. That is this.

   The tree is generated rather than written out, because the real one is 4
   provinces, 5 districts, 63 sectors and 193 villages, and a hand-written copy
   of that would be wrong within a week. Every count rolls up from the villages,
   so a parent is the sum of its children at every level, and the totals match
   what the rest of the app states: 2 210 households and 193 home visitors, one
   per village. */
(function () {
  'use strict';

  var DISTRICTS = [
    ['Eastern Province', 'Ngoma', ['Kibungo', 'Jarama', 'Sake', 'Rukumberi', 'Rurenge',
      'Murama', 'Remera', 'Zaza', 'Mugesera', 'Karembo', 'Kazo', 'Mutenderi', 'Gashanda',
      'Rukira']],
    ['Eastern Province', 'Kirehe', ['Kirehe', 'Mahama', 'Nyarubuye', 'Gahara', 'Kigina',
      'Mpanga', 'Musaza', 'Mushikiri', 'Nasho', 'Nyamugari', 'Kigarama', 'Gatore']],
    ['Southern Province', 'Nyanza', ['Busasamana', 'Busoro', 'Cyabakamyi', 'Kibirizi',
      'Kigoma', 'Mukingo', 'Muyira', 'Ntyazo', 'Nyagisozi', 'Rwabicuma']],
    ['Western Province', 'Rubavu', ['Gisenyi', 'Rubavu', 'Nyamyumba', 'Nyundo', 'Rugerero',
      'Kanama', 'Cyanzarwe', 'Bugeshi', 'Kanzenze', 'Mudende', 'Nyakiriba', 'Rusizi']],
    ['Northern Province', 'Musanze', ['Muhoza', 'Cyuve', 'Kinigi', 'Gacaca', 'Gashaki',
      'Busogo', 'Kimonyi', 'Nkotsi', 'Nyange', 'Rwaza', 'Shingiro', 'Muko', 'Gataraga',
      'Remera', 'Musanze']]
  ];
  var CELLS = ['Kabare', 'Gatore', 'Nyakarambi', 'Rwabutazi', 'Cyunuzi', 'Karambi',
    'Bwiza', 'Rugarama', 'Kagasa', 'Muhurire', 'Rwimbogo', 'Mpanga'];
  var VILLAGES = ['Akabuga', 'Gihinga', 'Kagarama', 'Rweru', 'Byimana', 'Nyakabanda',
    'Gitaraga', 'Kamabuye', 'Rugendabari', 'Umutara', 'Rusenyi', 'Nyamirama'];

  var TOTAL_HOUSEHOLDS = 2210;
  var TOTAL_VILLAGES = 193;

  /* ---- build ---- */

  function build() {
    var sectors = [];
    DISTRICTS.forEach(function (d) {
      d[2].forEach(function (name) { sectors.push({ province: d[0], district: d[1], name: name }); });
    });

    /* 193 villages over 63 sectors: three each, and the remainder one at a time
       from the top, so the biggest districts carry the extra. */
    var base = Math.floor(TOTAL_VILLAGES / sectors.length);
    var extra = TOTAL_VILLAGES - base * sectors.length;
    var vi = 0, ci = 0, village = 0;

    var perVillage = Math.floor(TOTAL_HOUSEHOLDS / TOTAL_VILLAGES);
    var spare = TOTAL_HOUSEHOLDS - perVillage * TOTAL_VILLAGES;

    sectors.forEach(function (s, si) {
      var n = base + (si < extra ? 1 : 0);
      s.children = [];
      var made = 0;
      while (made < n) {
        var take = Math.min(2, n - made);          // two villages to a cell
        var cell = { name: CELLS[ci++ % CELLS.length] + ' cell', level: 'Cell', children: [] };
        for (var k = 0; k < take; k++) {
          var hh = perVillage + (village < spare ? 1 : 0);
          village++;
          cell.children.push({
            name: VILLAGES[vi++ % VILLAGES.length] + ' village',
            level: 'Village',
            households: hh,
            /* one home visitor per village, which is what IZU means here */
            izu: 'I-' + String(100 + village),
            children: []
          });
        }
        s.children.push(cell);
        made += take;
      }
      s.level = 'Sector';
    });

    var byProvince = {};
    sectors.forEach(function (s) {
      var p = byProvince[s.province] || (byProvince[s.province] =
        { name: s.province, level: 'Province', children: [], byDistrict: {} });
      var d = p.byDistrict[s.district] || (p.byDistrict[s.district] =
        { name: s.district, level: 'District', children: [] });
      if (p.children.indexOf(d) < 0) p.children.push(d);
      d.children.push(s);
    });

    var roots = Object.keys(byProvince).map(function (k) {
      delete byProvince[k].byDistrict;
      return byProvince[k];
    });
    roots.forEach(roll);
    return roots;
  }

  /* A parent is the sum of what is under it — no number is typed twice. */
  function roll(n) {
    if (!n.children || !n.children.length) {
      n.villages = 1;
      return n;
    }
    n.children.forEach(roll);
    n.households = n.children.reduce(function (a, c) { return a + c.households; }, 0);
    n.villages = n.children.reduce(function (a, c) { return a + c.villages; }, 0);
    return n;
  }

  /* ---- render ---- */

  var ICON = {
    Province: 'i-hierarchy', District: 'i-location', Sector: 'i-location',
    Cell: 'i-building', Village: 'i-households'
  };
  var FILLED = { 'i-hierarchy': 1 };

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }

  /* A tree reads as a tree when the levels are drawn, not only indented. One
     1px line per ancestor that still has rows below it, at that ancestor's own
     indent — so a line stops under the last child of its branch rather than
     running to the bottom of the list. Drawn as background images because the
     rows are siblings in the DOM, not nested, and a sibling cannot be wrapped
     by its parent's border. */
  /* `xs` is where each level's marker actually sits, because the levels are
     not evenly spaced everywhere: on Programme the project row has a caret
     before its icon and its children do not, so the first two lines are 10px
     apart and the rest 22. A step and an offset guessed that wrong by 12px. */
  /* A tree reads as a tree when the levels are drawn, not only indented.
     The rule is as simple as it can be: a row at depth d carries one line for
     every level above it, at that level's own marker. Nothing about siblings
     — a level's line spans exactly the run of rows deeper than it, which is
     the group of children it owns, and ends where that run ends.

     The earlier rule asked whether each ancestor still had rows to come, and
     got it wrong twice: a branch could only see its own rows, so it judged
     the level above finished and left a gap; and the last descendant of a
     branch was missed, so the line stopped a row early.

     Drawn as background images because the rows are siblings in the DOM, not
     nested, and a sibling cannot be wrapped by its parent's border. Three
     long-hands, not the one shorthand: position and size are not
     background-image's to take, and one handed them is dropped whole. */
  function guides(node, depth, xs) {
    if (!node) return;
    node.style.removeProperty('--guides-img');
    node.style.removeProperty('--guides-pos');
    node.style.removeProperty('--guides-size');
    if (!depth) return;
    var img = [], pos = [];
    for (var i = 0; i < depth; i++) {
      img.push('linear-gradient(var(--color-border-strong),var(--color-border-strong))');
      pos.push(xs[Math.min(i, xs.length - 1)] + 'px 0');
    }
    /* Handed to a pseudo-element rather than painted on the row itself. A
       row's own background is painted before its border, so the border cut
       the thread once per row — seventeen 1px nicks down one line, which is
       what made it look like a stack of segments. A positioned child paints
       after the border, and reaches 1px past the bottom to bridge it. */
    node.style.setProperty('--guides-img', img.join(','));
    node.style.setProperty('--guides-pos', pos.join(','));
    node.style.setProperty('--guides-size', img.map(function () { return '1px 100%'; }).join(','));
  }
  window.SugiraTree = { guides: guides };

  function row(node, depth, open, onToggle) {
    var kids = node.children && node.children.length;
    var r = el(kids ? 'button' : 'div', 'plr' + (kids ? '' : ' leaf'));
    if (kids) {
      r.type = 'button';
      r.setAttribute('aria-expanded', String(open));
    }
    /* The step is the caret's width plus the row's gap — 16 + 8 — so a child
       begins exactly where its parent's icon begins. At 20 it fell 4px short
       of that icon every level down, which is close enough to look like a
       mistake and too far to look like a column. */
    r.style.paddingLeft = (12 + depth * 24) + 'px';
    /* a row's marker is its caret, at the indent its depth gives it */
    guides(r, depth, [19, 43, 67, 91, 115, 139]);

    var caret = el('span', 'plr-c');
    if (kids) caret.innerHTML = '<svg aria-hidden="true"><use href="#i-caret"/></svg>';
    r.appendChild(caret);

    var ico = el('span', 'plr-i' + (FILLED[ICON[node.level]] ? ' fill' : ''));
    ico.innerHTML = '<svg aria-hidden="true"><use href="#' + ICON[node.level] + '"/></svg>';
    r.appendChild(ico);

    r.appendChild(el('span', 'plr-n', node.name));
    r.appendChild(el('span', 'plr-l', node.level));

    var rt = el('span', 'plr-r');
    rt.appendChild(el('span', null, fmt(node.households) + ' households'));
    rt.appendChild(el('span', null, node.level === 'Village'
      ? node.izu
      : fmt(node.villages) + (node.villages === 1 ? ' home visitor' : ' home visitors')));
    r.appendChild(rt);

    if (kids) r.onclick = onToggle;
    return r;
  }

  function mount() {
    var host = document.getElementById('placeTree');
    if (!host) return;
    var roots = build();
    var open = {};
    /* the first province is open, so the shape of the thing is visible without
       a click; everything else waits to be asked */
    open[roots[0].name] = true;

    function key(node, path) { return path + '/' + node.name; }

    function draw() {
      host.innerHTML = '';
      (function walk(nodes, depth, path) {
        nodes.forEach(function (n) {
          var k = key(n, path);
          var isOpen = !!open[depth === 0 ? n.name : k];
          host.appendChild(row(n, depth, isOpen, function (e) {
            e.stopPropagation();
            var kk = depth === 0 ? n.name : k;
            open[kk] = !open[kk];
            draw();
          }));
          if (isOpen && n.children && n.children.length) {
            walk(n.children, depth + 1, k);
          }
        });
      })(roots, 0, '');
      var total = roots.reduce(function (a, r) { return a + r.households; }, 0);
      var vs = roots.reduce(function (a, r) { return a + r.villages; }, 0);
      var cap = document.getElementById('placeCount');
      if (cap) cap.textContent = fmt(total) + ' households · ' + fmt(vs)
        + ' villages · 5 districts · 4 provinces';
    }

    draw();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
