/* ---------------------------------------------------------------------------
   One menu, built to ClickUp's measured spec, used everywhere a list of
   choices appears.

   The numbers below are not taste. They are read from the ClickUp design
   system's own tokens and component measurements:

     surface   #fff, radius 12px (--menu-surface-radius / --radius-lg),
               shadow --x-clickup-elevation-border-3 (three layers),
               8px vertical padding, 200 wide (220 for a submenu)
     item      28 tall, 8px side inset, radius 7px (--x-clickup-radii-3-5),
               6/8 padding, 8px gap, 14px/16.002 label, 2px apart
     hover     --x-clickup-color-background-on-main (#0000000f)
     heading   12px, --color-content-tertiary (#838383)
     submenu   the trigger is an item with a trailing 16px chevron, and the
               panel opens to the side rather than replacing the list

   That last one matters: a drill-down that replaces what you were looking at
   loses the context you were choosing within. ClickUp opens a second panel
   beside the first, so Rwanda → Eastern → Ngoma stays on screen as a trail.
--------------------------------------------------------------------------- */
(function () {
  'use strict';

  var open = [];          // the stack of panels currently on screen
  var root = null;        // the element the whole stack belongs to

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function closeAll() {
    open.forEach(function (p) { if (p.panel.parentNode) p.panel.parentNode.removeChild(p.panel); });
    open = [];
    if (root) {
      root.setAttribute('aria-expanded', 'false');
      root = null;
    }
  }

  /* Escape is a way back, so it has to put you back. Closing while the focus
     is inside the panel and leaving it there drops the focus onto the body:
     the next Tab starts from the top of the document, which for anyone on a
     keyboard is worse than the menu still being open. */
  function dismiss() {
    var a = root;
    var inside = a && document.activeElement
      && open.some(function (p) { return p.panel.contains(document.activeElement); });
    closeAll();
    if (inside && a.focus) a.focus();
  }

  /* Close every panel deeper than `depth`, so moving back up the trail folds
     the flyouts away rather than leaving them stacked. */
  function closeBelow(depth) {
    while (open.length > depth + 1) {
      var p = open.pop();
      if (p.panel.parentNode) p.panel.parentNode.removeChild(p.panel);
    }
  }

  function place(panel, anchorRect, depth) {
    panel.style.visibility = 'hidden';
    document.body.appendChild(panel);
    var w = panel.offsetWidth, h = panel.offsetHeight;
    var pad = 8, top, left;

    if (depth === 0) {
      top = anchorRect.bottom + 6;
      left = anchorRect.left;
      if (top + h > window.innerHeight - pad) top = Math.max(pad, anchorRect.top - h - 6);
    } else {
      // a submenu sits beside its trigger, flipping to the left if it would spill
      top = anchorRect.top - 8;
      left = anchorRect.right + 2;
      if (left + w > window.innerWidth - pad) left = anchorRect.left - w - 2;
      if (top + h > window.innerHeight - pad) top = Math.max(pad, window.innerHeight - h - pad);
    }
    if (left + w > window.innerWidth - pad) left = window.innerWidth - w - pad;
    panel.style.top = Math.max(pad, top) + 'px';
    panel.style.left = Math.max(pad, left) + 'px';
    panel.style.visibility = '';
  }

  /* items: [{label, hint, selected, disabled, submenu: fn -> items, onPick,
              heading: true, separator: true, back: true, radio: true,
              node: <element>}]

     `radio` is for a menu that holds a value rather than a list of errands:
     grouping by a column, a cell whose answer is one of a set. The row is the
     control, so it says so — menuitemradio, and aria-checked on every row, not
     a tick on one of them.

     `node` is an escape hatch for the one row that is not a row: the record
     menu's pair of copy buttons, which the design system draws as a
     MenuButtonGroup. Without it that menu had to be written again from
     scratch, which is how the app ended up with four of these. */
  function panelFor(items, depth, width) {
    var panel = el('div', 'cmenu');
    panel.setAttribute('role', depth ? 'menu' : 'menu');
    panel.style.width = (width || (depth ? 220 : 200)) + 'px';

    var search = null;
    var rows = [];

    if (items.length > 9) {
      search = el('input', 'cmenu-s');
      search.type = 'text';
      search.placeholder = 'Search';
      search.setAttribute('aria-label', 'Search this menu');
      panel.appendChild(search);
    }

    var list = el('div', 'cmenu-l');
    panel.appendChild(list);

    items.forEach(function (it) {
      if (it.separator) { list.appendChild(el('div', 'cmenu-sep')); return; }
      if (it.heading) { list.appendChild(el('div', 'cmenu-h', it.label)); return; }
      if (it.node) {
        list.appendChild(it.node);
        Array.prototype.forEach.call(it.node.querySelectorAll('button'), function (n) {
          rows.push(n);
        });
        return;
      }

      var b = el('button', 'cmenu-i' + (it.selected ? ' sel' : '') + (it.back ? ' back' : ''));
      b.type = 'button';
      if (it.radio) {
        b.setAttribute('role', 'menuitemradio');
        b.setAttribute('aria-checked', String(!!it.selected));
      } else {
        b.setAttribute('role', 'menuitem');
      }
      if (it.disabled) b.disabled = true;

      var lab = el('span', 'cmenu-t', it.label);
      b.appendChild(lab);
      if (it.hint) b.appendChild(el('span', 'cmenu-hint', it.hint));
      /* A second line under the label, as MenuRadioItem has (Menu.tsx:141):
         the row wraps and the description takes the whole next line. It is
         how the design system explains an option at the moment of choosing,
         rather than leaving it to a tooltip nobody opens. */
      if (it.description) {
        b.classList.add('desc');
        b.appendChild(el('span', 'cmenu-d', it.description));
      }
      if (it.submenu) {
        var c = el('span', 'cmenu-ch');
        c.setAttribute('aria-hidden', 'true');
        c.textContent = '›';
        b.appendChild(c);
        b.setAttribute('aria-haspopup', 'menu');
      }

      function openSub() {
        closeBelow(depth);
        var sub = panelFor(it.submenu(), depth + 1, it.submenuWidth);
        place(sub.panel, b.getBoundingClientRect(), depth + 1);
        open.push(sub);
        sub.focusFirst();
      }

      /* A row that goes somewhere says so and lets the router read it off the
         button, the way every other link in the app works. Which means this
         one click has to reach the router, so it is the only kind that does
         not stop here. */
      if (it.go) b.setAttribute('data-go', it.go);

      b.addEventListener('click', function (e) {
        if (!it.go) e.stopPropagation();
        if (it.submenu) { openSub(); return; }
        if (it.onPick) it.onPick();
      });
      // Hovering a sibling folds away a flyout opened from another row.
      b.addEventListener('mouseenter', function () {
        if (it.submenu) openSub(); else closeBelow(depth);
      });

      rows.push(b);
      list.appendChild(b);
    });

    if (search) {
      search.addEventListener('input', function () {
        var q = search.value.toLowerCase();
        rows.forEach(function (r) {
          var t = r.querySelector('.cmenu-t');
          if (!t) return;
          r.hidden = q && t.textContent.toLowerCase().indexOf(q) === -1;
        });
      });
    }

    panel.addEventListener('keydown', function (e) {
      var live = rows.filter(function (r) { return !r.hidden && !r.disabled; });
      var i = live.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); (live[i + 1] || live[0]).focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); (live[i - 1] || live[live.length - 1]).focus(); }
      else if (e.key === 'ArrowRight' && live[i] && live[i].getAttribute('aria-haspopup')) { e.preventDefault(); live[i].click(); }
      else if (e.key === 'ArrowLeft' && depth > 0) { e.preventDefault(); closeBelow(depth - 1); }
      /* Escape stops here. A menu opened from inside a filter panel is the
         layer on top; letting the key carry on down takes the panel away in
         the same keystroke, and the panel is what somebody was filling in. */
      else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); dismiss(); }
    });

    return {
      panel: panel,
      focusFirst: function () {
        if (search) { search.focus(); return; }
        var f = rows.filter(function (r) { return !r.disabled; })[0];
        if (f) f.focus();
      }
    };
  }

  function show(anchor, items, opts) {
    opts = opts || {};
    var already = root === anchor;
    closeAll();
    /* One layer at a time, and the two kinds of layer have to know about each
       other or they do not have it. A menu and a filter panel could stand open
       together because each only ever closed its own kind.

       Unless the menu belongs to the panel. Every field and operator in the
       filter is a select, and a select is one of these — so closing the panel
       whenever a menu opens would close it the instant anyone tried to use
       it. A layer opened from inside another is on top of it, not instead. */
    if (window.SugiraPop && !window.SugiraPop.holds(anchor)) window.SugiraPop.close();
    if (already) return;
    root = anchor;
    anchor.setAttribute('aria-expanded', 'true');
    var p = panelFor(items, 0, opts.width);
    place(p.panel, anchor.getBoundingClientRect(), 0);
    open.push(p);
    if (opts.focus !== false) p.focusFirst();
  }

  document.addEventListener('click', function (e) {
    if (open.length && !e.target.closest('.cmenu')) closeAll();
  });
  window.addEventListener('resize', closeAll);
  /* A fixed panel does not scroll with the control it belongs to, so scrolling
     leaves it pointing at nothing. Closing is the honest answer — the control
     is where the reader's attention went. */
  window.addEventListener('scroll', function (e) {
    if (!open.length) return;
    /* A long menu scrolls its own list. That is the menu working, not the page
       moving out from under it. */
    if (e.target && e.target.closest && e.target.closest('.cmenu')) return;
    closeAll();
  }, true);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && open.length) dismiss();
  });

  /* ---- native <select> is the thing that reads as unfinished ----
     The browser's own popup is a different typeface, a different highlight and
     a different radius from everything around it. Every select becomes the
     menu above, keeping the real <select> in the DOM so its value, its name and
     its label association still work. */
  function enhanceSelect(sel) {
    if (sel.dataset.cmenu) return;
    sel.dataset.cmenu = '1';

    var trigger = el('button', 'cselect');
    trigger.type = 'button';
    trigger.setAttribute('aria-haspopup', 'menu');
    trigger.setAttribute('aria-expanded', 'false');
    if (sel.id) {
      var lab = document.querySelector('label[for="' + sel.id + '"]');
      if (lab) trigger.setAttribute('aria-labelledby', lab.id || (lab.id = sel.id + '-l'));
    }
    if (sel.disabled) trigger.disabled = true;

    var text = el('span', 'cselect-t');
    var chev = el('span', 'cselect-c');
    chev.setAttribute('aria-hidden', 'true');
    chev.textContent = '▾';
    trigger.appendChild(text);
    trigger.appendChild(chev);

    function sync() { text.textContent = sel.options[sel.selectedIndex] ? sel.options[sel.selectedIndex].text : ''; }
    sync();
    /* The trigger is the only part anyone sees, so it has to follow the select
       wherever the change came from. Picking from the menu below calls sync
       itself; a select refilled by something else — one list narrowing another
       — reaches it this way, and without it the trigger keeps showing an
       option that is no longer in the list. */
    sel.addEventListener('change', sync);

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var items = Array.prototype.map.call(sel.options, function (o, i) {
        return {
          label: o.text,
          selected: i === sel.selectedIndex,
          disabled: o.disabled,
          onPick: function () {
            sel.selectedIndex = i;
            sel.dispatchEvent(new Event('change', { bubbles: true }));
            sync();
            closeAll();
            trigger.focus();
          }
        };
      });
      show(trigger, items, { width: Math.max(200, trigger.offsetWidth) });
    });

    sel.parentNode.insertBefore(trigger, sel);
    sel.classList.add('cselect-native');
    sel.setAttribute('tabindex', '-1');
    sel.setAttribute('aria-hidden', 'true');
  }

  function enhanceAll(scope) {
    Array.prototype.forEach.call((scope || document).querySelectorAll('select'), enhanceSelect);
  }

  enhanceAll();
  // modals build their fields when they open, so catch those too
  new MutationObserver(function (muts) {
    muts.forEach(function (m) {
      Array.prototype.forEach.call(m.addedNodes, function (n) {
        if (n.nodeType !== 1) return;
        if (n.tagName === 'SELECT') enhanceSelect(n);
        else enhanceAll(n);
      });
    });
  }).observe(document.body, { childList: true, subtree: true });

  window.SugiraMenu = {
    show: show,
    close: closeAll,
    enhance: enhanceAll,
    isOpen: function (anchor) { return anchor ? root === anchor : !!open.length; }
  };
})();
