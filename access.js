/* ---------------------------------------------------------------------------
   What one person can open, in the drawer.

   Built on the block ClickUp uses for "Use List Template" — Aristote found it
   and it is the right shape for this. Read from the design system's source,
   not from the screenshot:

     SegmentedControl.tsx  track 32 high, r7, padding 2, background.on-main;
       segments 28 high, r5, padding 6 8, 14/16 500 in content.placeholder; the
       selected one is content.secondary on surface with elevation.border-1.
       Its own comment says it was measured on probe.customize-modal-s8 — the
       very dialog in the screenshot.
     Checkbox.tsx  16 (md), r4, 1 px border.input; checked is primary
       background and border with a 14 px check in on-primary.

   The two segments carry the model rather than decorating it. "Everything the
   position gives" is the default and is read-only: C. Uwimana is the Sector
   lead, and that is the whole answer for most people. "Add for this person" is
   where the checkboxes come alive.

   What a position stores is eight groups by four verbs, so the grid is the
   four verbs — thirty-two boxes across the whole screen, not a hundred and
   twelve. The hundred and twelve are still here, one disclosure deeper, under
   the verb that holds them.

   The greyed boxes do the work the popover used to. ClickUp greys the rows a
   template cannot take — Keep checked items, Task Types, Relationships — and
   that is exactly the rule Aristote set: a position is the rung below it plus
   things, never minus things. A verb the position grants is checked and
   disabled, and its tooltip says which rung it arrives from and how many
   people hold that rung. There is no way to uncheck it, because there is no
   such thing. A verb it does not grant is empty and live: ticking it is an
   exception — one person, one thing, a reason and an end date.
--------------------------------------------------------------------------- */
(function () {
  'use strict';

  var VERBS = ['See', 'Add', 'Change', 'Archive'];

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function svg(id, cls) {
    var s = el('span', cls);
    s.innerHTML = '<svg aria-hidden="true"><use href="#' + id + '"/></svg>';
    return s;
  }
  function perms() { return window.SugiraPerms; }

  function positionNamed(name) {
    var all = perms().positions();
    for (var i = 0; i < all.length; i++) if (all[i].name === name) return all[i];
    return null;
  }

  /* Nothing is saved. The prototype holds a person's exceptions for as long as
     the page is open, which is long enough to see what the screen does. */
  var extra = {};
  var mode = 'all';          // 'all' = the position as it is, 'add' = add to it
  var open = {};             // which groups are expanded
  var names = {};            // which groups are showing their stored names

  function host() { return document.getElementById('accessTree'); }
  function attr(k) { var h = host(); return h ? h.getAttribute(k) : ''; }
  function roleName() { return attr('data-role'); }
  function whoName() { return attr('data-who'); }

  function cellsOf(g, verb) {
    return g.perms.filter(function (p) { return p.verb === verb; });
  }

  function sourceOf(from, key) {
    if (extra[key]) return { kind: 'exception', label: 'an exception' };
    var step = from[key];
    return step ? { kind: 'position', label: step.short || step.name, step: step } : null;
  }

  /* ---- the two segments ---- */

  function segments() {
    var g = el('div', 'acc-seg');
    g.setAttribute('role', 'group');
    g.setAttribute('aria-label', 'What to show');
    [['all', 'Everything the position gives'], ['add', 'Add for ' + whoName()]].forEach(function (o) {
      var b = el('button', 'acc-segb' + (mode === o[0] ? ' on' : ''), o[1]);
      b.type = 'button';
      b.setAttribute('aria-pressed', String(mode === o[0]));
      b.onclick = function () { mode = o[0]; draw(); };
      g.appendChild(b);
    });
    return g;
  }

  /* ---- one verb, as a checkbox ---- */

  function box(g, verb, from) {
    var key = g.key + '|' + verb;
    var list = cellsOf(g, verb);
    var wrap = el('label', 'acc-cbw');

    if (!list.length) {
      /* Not every group has all four verbs — Maintenance is three names, all
         See. An absent verb is not a box that happens to be empty. */
      wrap.className = 'acc-cbw gone';
      wrap.appendChild(el('span', 'acc-cb gone'));
      wrap.appendChild(el('span', 'acc-cbt', verb));
      wrap.setAttribute('data-tip', 'Nothing is stored under ' + verb + ' — ' + g.name + '.');
      return wrap;
    }

    var src = sourceOf(from, key);
    var held = !!src;
    var locked = held && src.kind === 'position';
    var sample = list.slice(0, 3).map(function (p) { return p.id; }).join(', ');

    var cb = el('span', 'acc-cb' + (held ? ' on' : '') + (locked ? ' locked' : ''));
    cb.innerHTML = held ? '<svg aria-hidden="true"><use href="#i-check"/></svg>' : '';
    var btn = el('button', 'acc-cbb');
    btn.type = 'button';
    btn.setAttribute('role', 'checkbox');
    btn.setAttribute('aria-checked', String(held));
    btn.setAttribute('aria-label', verb + ' — ' + g.name);
    if (locked || mode === 'all') btn.disabled = true;

    wrap.setAttribute('data-tip', held
      ? (src.kind === 'exception'
          ? verb + ' — ' + g.name + ' is an exception for ' + whoName()
            + ' alone. ' + list.length + (list.length === 1 ? ' stored name' : ' stored names')
            + ': ' + sample + (list.length > 3 ? '…' : '') + '.'
          : verb + ' — ' + g.name + ' comes from ' + src.label + ', which '
            + src.step.people + (src.step.people === 1 ? ' person holds' : ' people hold')
            + '. It cannot be taken away here — a position is the rung below it plus things, '
            + 'never minus things. ' + list.length
            + (list.length === 1 ? ' stored name' : ' stored names') + ': '
            + sample + (list.length > 3 ? '…' : '') + '.')
      : verb + ' — ' + g.name + ' is not granted. Ticking it gives ' + whoName()
        + ' these ' + list.length + ', and nobody else: ' + sample
        + (list.length > 3 ? '…' : '') + '.');

    btn.appendChild(cb);
    btn.appendChild(el('span', 'acc-cbt', verb));
    btn.appendChild(el('span', 'acc-cbn', String(list.length)));
    if (!btn.disabled) {
      btn.onclick = function () {
        if (src && src.kind === 'exception') {
          delete extra[key];
          draw();
          say('Exception withdrawn — ' + verb + ' — ' + g.name + ' is gone');
        } else {
          grant(g, verb);
        }
      };
    }
    wrap.appendChild(btn);
    return wrap;
  }

  /* ---- the group ---- */

  function groupRow(g, from, isOpen) {
    var n = 0, of = 0;
    VERBS.forEach(function (v) {
      if (!cellsOf(g, v).length) return;
      of++;
      if (from[g.key + '|' + v] || extra[g.key + '|' + v]) n++;
    });
    var r = el('button', 'plr');
    r.type = 'button';
    r.setAttribute('aria-expanded', String(isOpen));
    r.style.paddingLeft = '12px';
    r.appendChild(svg('i-caret', 'plr-c'));
    r.appendChild(svg(g.icon, 'plr-i'));
    r.appendChild(el('span', 'plr-n', g.name));
    r.appendChild(el('span', 'acc-of', n + ' of ' + of));
    r.onclick = function () { open[g.key] = !isOpen; draw(); };
    return r;
  }

  function groupBody(g, from) {
    var body = el('div', 'acc-body');
    body.appendChild(el('p', 'acc-cap', mode === 'add'
      ? 'Tick what ' + whoName() + ' should have beyond the position. The greyed ones already arrive from it.'
      : 'What the position gives under ' + g.name + '. Switch to “Add for ' + whoName()
        + '” to give them more.'));

    var grid = el('div', 'acc-grid');
    VERBS.forEach(function (v) { grid.appendChild(box(g, v, from)); });
    body.appendChild(grid);

    /* The hundred and twelve, for whoever has to migrate them. */
    var showing = !!names[g.key];
    var more = el('button', 'acc-more');
    more.type = 'button';
    more.setAttribute('aria-expanded', String(showing));
    more.textContent = showing
      ? 'Hide the ' + g.perms.length + ' stored names'
      : 'See the ' + g.perms.length + ' stored names';
    more.onclick = function (e) { e.stopPropagation(); names[g.key] = !showing; draw(); };
    body.appendChild(more);

    if (showing) {
      var list = el('div', 'acc-names');
      VERBS.forEach(function (v) {
        var items = cellsOf(g, v);
        if (!items.length) return;
        var src = sourceOf(from, g.key + '|' + v);
        var vh = el('p', 'acc-vh' + (src ? '' : ' off'));
        vh.appendChild(el('b', null, v));
        vh.appendChild(el('span', null, src ? ' — from ' + src.label : ' — not granted'));
        list.appendChild(vh);
        items.forEach(function (p) {
          var row = el('div', 'acc-nr' + (src ? '' : ' off'));
          row.appendChild(el('code', 'acc-id', p.id));
          row.appendChild(el('span', 'acc-what', p.what));
          if (p.risk) row.appendChild(svg('i-alert', 'acc-risk'));
          list.appendChild(row);
        });
      });
      body.appendChild(list);
    }
    return body;
  }

  /* ---- ticking a box: one thing, a reason, an end date ---- */

  var pending = null;

  function grant(g, verb) {
    openModal('exception');
    var sel = document.getElementById('f-xw');
    if (!sel) return;
    /* The sheet promised "only what their position does not already give
       them" and then listed nine things it had been written with. It is built
       from what is actually missing. */
    var p = positionNamed(roleName());
    var from = perms().held(p);
    sel.innerHTML = '';
    perms().groups.forEach(function (gr) {
      VERBS.forEach(function (v) {
        var k = gr.key + '|' + v;
        if (from[k] || extra[k] || !cellsOf(gr, v).length) return;
        var o = document.createElement('option');
        o.text = v + ' — ' + gr.name;
        o.value = k;
        sel.appendChild(o);
      });
    });
    sel.value = g.key + '|' + verb;
    var trig = sel.previousElementSibling;
    if (trig && trig.classList.contains('cselect')) {
      var t = trig.querySelector('.cselect-t');
      if (t && sel.options[sel.selectedIndex]) t.textContent = sel.options[sel.selectedIndex].text;
    }
    pending = g.key + '|' + verb;
  }

  document.addEventListener('click', function (e) {
    var ok = e.target.closest && e.target.closest('#mOk');
    if (!ok || !pending) return;
    var sel = document.getElementById('f-xw');
    extra[sel && sel.value ? sel.value : pending] = true;
    pending = null;
    setTimeout(draw, 0);
  }, true);

  function openModal(key) {
    var b = document.createElement('button');
    b.setAttribute('data-modal', key);
    b.style.cssText = 'position:fixed;left:-9999px';
    document.body.appendChild(b);
    b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    b.remove();
  }

  function say(msg) {
    var t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(say._t);
    say._t = setTimeout(function () { t.hidden = true; }, 2600);
  }

  /* ---- the panel ---- */

  function draw() {
    var h = host();
    if (!h || !window.SugiraPerms) return;
    var p = positionNamed(roleName());
    if (!p) return;
    var from = perms().held(p);

    h.innerHTML = '';
    h.appendChild(segments());

    var n = 0;
    perms().groups.forEach(function (g) {
      VERBS.forEach(function (v) {
        if (from[g.key + '|' + v] || extra[g.key + '|' + v]) n += cellsOf(g, v).length;
      });
    });
    var ex = Object.keys(extra).length;

    var sum = el('p', 'acc-sum');
    sum.appendChild(el('b', null, String(n)));
    sum.appendChild(document.createTextNode(' of the 112 stored names, from '));
    sum.appendChild(el('b', null, p.short || p.name));
    sum.appendChild(document.createTextNode(ex
      ? ' and ' + ex + (ex === 1 ? ' exception' : ' exceptions') + '. '
      : '. '));
    sum.appendChild(document.createTextNode(whoName()
      + ' is this position plus what is ticked here, never less than it.'));
    h.appendChild(sum);

    var tree = el('div', 'tree');
    perms().groups.forEach(function (g) {
      var isOpen = !!open[g.key];
      tree.appendChild(groupRow(g, from, isOpen));
      if (isOpen) tree.appendChild(groupBody(g, from));
    });
    h.appendChild(tree);
  }

  function mount() {
    if (!host()) return;
    if (!window.SugiraPerms) { setTimeout(mount, 30); return; }
    draw();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
