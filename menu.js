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
              heading: true, separator: true, back: true}] */
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

      var b = el('button', 'cmenu-i' + (it.selected ? ' sel' : '') + (it.back ? ' back' : ''));
      b.type = 'button';
      b.setAttribute('role', 'menuitem');
      if (it.disabled) b.disabled = true;

      var lab = el('span', 'cmenu-t', it.label);
      b.appendChild(lab);
      if (it.hint) b.appendChild(el('span', 'cmenu-hint', it.hint));
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

      b.addEventListener('click', function (e) {
        e.stopPropagation();
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
          r.hidden = q && r.querySelector('.cmenu-t').textContent.toLowerCase().indexOf(q) === -1;
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
      else if (e.key === 'Escape') { e.preventDefault(); closeAll(); }
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
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && open.length) closeAll();
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

  window.SugiraMenu = { show: show, close: closeAll, enhance: enhanceAll };
})();
