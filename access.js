/* ---------------------------------------------------------------------------
   The permissions block, and the two places that use it.

   Built on the block ClickUp uses for "Use List Template" — Aristote found it
   and it is the right shape for this. Read from the design system's source,
   not from the screenshot:

     SegmentedControl.tsx  track 32 high, r7, padding 2, background.on-main;
       segments 28 high, r5, padding 6 8, 14/16 500 in content.placeholder; the
       selected one is content.secondary on surface with elevation.border-1.
       Its own comment says it was measured on probe.customize-modal-s8 — the
       very dialog in the screenshot.
     Checkbox.tsx  16, r4, 1 px border.input; checked is primary background and
       border with a 14 px check in on-primary.

   What a position stores is eight groups by four verbs, so the grid is the
   four verbs — thirty-two boxes, not a hundred and twelve. The hundred and
   twelve are one disclosure deeper, under the verb that holds them.

   The greyed boxes carry the rule Aristote set: a position is the rung below
   it plus things, never minus things. ClickUp greys the rows a template cannot
   take — Keep checked items, Task Types, Relationships — and that is the same
   statement. What is greyed differs by where the block is used, which is why
   `render` knows nothing about positions or people and asks its caller:

     on a person  everything the position gives is locked; an empty box is an
       exception, which is one person, one thing, a reason and an end date.
     on a position card  what it inherits from the rung below is locked; what
       this rung adds is its own and can be taken back; an empty box adds.

   One deviation from the system, measured: it puts the unselected segment in
   content.placeholder, which is 2.9:1 at 14px and fails the 4.5 text needs, so
   both segments move up a step. The relationship between them is the same.
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
  function cellsOf(g, verb) {
    return g.perms.filter(function (p) { return p.verb === verb; });
  }

  /* =======================================================================
     The block itself. A model gives it four things and owns its own state:

       segments()        [{id, label}] or null when there is only one view
       mode / setMode    which segment is showing
       summary()         a node to sit under the segments, or null
       cell(key, verb)   null when nothing is stored under that verb, else
                         { on, locked, tip } — locked means ticked and not
                         yours to untick here
       toggle(key, verb) called only when a cell is neither locked nor absent
       caption(groupKey) the line ClickUp puts under its switch
       open / names      plain objects the block writes which group is showing
       redraw()          draw the whole thing again
     ======================================================================= */

  function box(model, g, verb) {
    var wrap = el('label', 'acc-cbw');
    var list = cellsOf(g, verb);
    var c = list.length ? model.cell(g.key, verb) : null;

    if (!c) {
      /* Not every group has all four verbs — Maintenance is three names, all
         See. An absent verb is not a box that happens to be empty. */
      wrap.className = 'acc-cbw gone';
      wrap.appendChild(el('span', 'acc-cb gone'));
      wrap.appendChild(el('span', 'acc-cbt', verb));
      wrap.setAttribute('data-tip', 'Nothing is stored under ' + verb + ' — ' + g.name + '.');
      return wrap;
    }

    var cb = el('span', 'acc-cb' + (c.on ? ' on' : '') + (c.locked ? ' locked' : ''));
    cb.innerHTML = c.on ? '<svg aria-hidden="true"><use href="#i-check"/></svg>' : '';
    var btn = el('button', 'acc-cbb');
    btn.type = 'button';
    btn.setAttribute('role', 'checkbox');
    btn.setAttribute('aria-checked', String(!!c.on));
    btn.setAttribute('aria-label', verb + ' — ' + g.name);
    btn.disabled = !!c.locked;
    wrap.setAttribute('data-tip', c.tip);

    btn.appendChild(cb);
    btn.appendChild(el('span', 'acc-cbt', verb));
    btn.appendChild(el('span', 'acc-cbn', String(list.length)));
    if (!btn.disabled) {
      btn.onclick = function (e) { e.stopPropagation(); model.toggle(g.key, verb); };
    }
    wrap.appendChild(btn);
    return wrap;
  }

  function groupRow(model, g, isOpen) {
    var n = 0, of = 0;
    VERBS.forEach(function (v) {
      if (!cellsOf(g, v).length) return;
      of++;
      var c = model.cell(g.key, v);
      if (c && c.on) n++;
    });
    var r = el('button', 'plr');
    r.type = 'button';
    r.setAttribute('aria-expanded', String(isOpen));
    r.style.paddingLeft = '12px';
    r.appendChild(svg('i-caret', 'plr-c'));
    r.appendChild(svg(g.icon, 'plr-i'));
    r.appendChild(el('span', 'plr-n', g.name));
    r.appendChild(el('span', 'acc-of', n + ' of ' + of));
    r.onclick = function (e) {
      e.stopPropagation();
      model.open[g.key] = !isOpen;
      model.redraw();
    };
    return r;
  }

  function groupBody(model, g) {
    var body = el('div', 'acc-body');
    var grid = el('div', 'acc-grid');
    VERBS.forEach(function (v) { grid.appendChild(box(model, g, v)); });
    body.appendChild(grid);

    /* The hundred and twelve, for whoever has to migrate them. */
    var showing = !!model.names[g.key];
    var more = el('button', 'acc-more');
    more.type = 'button';
    more.setAttribute('aria-expanded', String(showing));
    more.textContent = showing
      ? 'Hide the ' + g.perms.length + ' stored names'
      : 'See the ' + g.perms.length + ' stored names';
    more.onclick = function (e) {
      e.stopPropagation();
      model.names[g.key] = !showing;
      model.redraw();
    };
    body.appendChild(more);

    if (showing) {
      var list = el('div', 'acc-names');
      VERBS.forEach(function (v) {
        var items = cellsOf(g, v);
        if (!items.length) return;
        var c = model.cell(g.key, v);
        var on = c && c.on;
        var vh = el('p', 'acc-vh' + (on ? '' : ' off'));
        vh.appendChild(el('b', null, v));
        vh.appendChild(el('span', null, on ? (c.from ? ' — from ' + c.from : '') : ' — not granted'));
        list.appendChild(vh);
        items.forEach(function (p) {
          var row = el('div', 'acc-nr' + (on ? '' : ' off'));
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

  function render(host, model) {
    host.innerHTML = '';

    var segs = model.segments && model.segments();
    if (segs && segs.length > 1) {
      var g = el('div', 'acc-seg');
      g.setAttribute('role', 'group');
      g.setAttribute('aria-label', 'What to show');
      segs.forEach(function (o) {
        var b = el('button', 'acc-segb' + (model.mode === o.id ? ' on' : ''), o.label);
        b.type = 'button';
        b.setAttribute('aria-pressed', String(model.mode === o.id));
        b.onclick = function (e) { e.stopPropagation(); model.setMode(o.id); };
        g.appendChild(b);
      });
      host.appendChild(g);
    }

    var sum = model.summary && model.summary();
    if (sum) host.appendChild(sum);

    /* ClickUp puts this line once, under the control it explains. Ours had it
       under all eight groups, which is the same sentence eight times. */
    var cap = model.caption && model.caption();
    if (cap) host.appendChild(el('p', 'acc-cap', cap));

    var tree = el('div', 'tree');
    perms().groups.forEach(function (gr) {
      var isOpen = !!model.open[gr.key];
      tree.appendChild(groupRow(model, gr, isOpen));
      if (isOpen) tree.appendChild(groupBody(model, gr));
    });
    host.appendChild(tree);
  }

  window.SugiraAccess = { render: render, verbs: VERBS, cellsOf: cellsOf };

  /* =======================================================================
     One person, in their drawer.
     ======================================================================= */

  /* Nothing is saved. The prototype holds a person's exceptions for as long as
     the page is open, which is long enough to see what the screen does. */
  var extra = {};
  var person = {
    mode: 'all',
    open: {},
    names: {},
    setMode: function (id) { person.mode = id; person.redraw(); },
    redraw: function () { draw(); }
  };

  function host() { return document.getElementById('accessTree'); }
  function attr(k) { var h = host(); return h ? h.getAttribute(k) : ''; }
  function roleName() { return attr('data-role'); }
  function whoName() { return attr('data-who'); }

  function positionNamed(name) {
    var all = perms().positions();
    for (var i = 0; i < all.length; i++) if (all[i].name === name) return all[i];
    return null;
  }

  person.segments = function () {
    return [{ id: 'all', label: 'Everything the position gives' },
            { id: 'add', label: 'Add for ' + whoName() }];
  };

  person.caption = function () {
    return person.mode === 'add'
      ? 'Tick what ' + whoName() + ' should have beyond the position. The greyed ones already '
        + 'arrive from it and cannot be taken away here.'
      : 'Open a group to see what the position gives. Switch to “Add for ' + whoName()
        + '” to give them more.';
  };

  person.cell = function (key, verb) {
    var p = positionNamed(roleName());
    if (!p) return null;
    var g = groupByKey(key);
    var list = cellsOf(g, verb);
    if (!list.length) return null;
    var k = key + '|' + verb;
    var sample = list.slice(0, 3).map(function (x) { return x.id; }).join(', ')
      + (list.length > 3 ? '…' : '');

    if (extra[k]) {
      return { on: true, locked: false, from: 'an exception',
        tip: verb + ' — ' + g.name + ' is an exception for ' + whoName() + ' alone. '
          + list.length + (list.length === 1 ? ' stored name' : ' stored names') + ': ' + sample + '.' };
    }
    var step = perms().held(p)[k];
    if (step) {
      return { on: true, locked: true, from: step.short || step.name,
        tip: verb + ' — ' + g.name + ' comes from ' + (step.short || step.name) + ', which '
          + step.people + (step.people === 1 ? ' person holds' : ' people hold')
          + '. It cannot be taken away here — a position is the rung below it plus things, '
          + 'never minus things. ' + list.length
          + (list.length === 1 ? ' stored name' : ' stored names') + ': ' + sample + '.' };
    }
    return { on: false, locked: person.mode === 'all',
      tip: verb + ' — ' + g.name + ' is not granted. Ticking it gives ' + whoName()
        + ' these ' + list.length + ', and nobody else: ' + sample + '.' };
  };

  person.toggle = function (key, verb) {
    var k = key + '|' + verb;
    if (extra[k]) {
      delete extra[k];
      draw();
      say('Exception withdrawn — ' + verb + ' — ' + groupByKey(key).name + ' is gone');
      return;
    }
    grant(key, verb);
  };

  person.summary = function () {
    var p = positionNamed(roleName());
    if (!p) return null;
    var from = perms().held(p), n = 0;
    perms().groups.forEach(function (g) {
      VERBS.forEach(function (v) {
        if (from[g.key + '|' + v] || extra[g.key + '|' + v]) n += cellsOf(g, v).length;
      });
    });
    var ex = Object.keys(extra).length;
    var s = el('p', 'acc-sum');
    s.appendChild(el('b', null, String(n)));
    s.appendChild(document.createTextNode(' of the 112 stored names, from '));
    s.appendChild(el('b', null, p.short || p.name));
    s.appendChild(document.createTextNode(ex
      ? ' and ' + ex + (ex === 1 ? ' exception' : ' exceptions') + '. '
      : '. '));
    s.appendChild(document.createTextNode(whoName()
      + ' is this position plus what is ticked here, never less than it.'));
    return s;
  };

  function groupByKey(k) {
    var gs = perms().groups;
    for (var i = 0; i < gs.length; i++) if (gs[i].key === k) return gs[i];
    return null;
  }

  /* ---- ticking an empty box: one thing, a reason, an end date ---- */

  var pending = null;

  function grant(key, verb) {
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
    sel.value = key + '|' + verb;
    var trig = sel.previousElementSibling;
    if (trig && trig.classList.contains('cselect')) {
      var t = trig.querySelector('.cselect-t');
      if (t && sel.options[sel.selectedIndex]) t.textContent = sel.options[sel.selectedIndex].text;
    }
    pending = key + '|' + verb;
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

  function draw() {
    var h = host();
    if (!h || !window.SugiraPerms || !positionNamed(roleName())) return;
    render(h, person);
  }

  function mount() {
    if (!host()) return;
    if (!window.SugiraPerms) { setTimeout(mount, 30); return; }
    draw();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
