/* ---------------------------------------------------------------------------
   What one person can open, as a tree they can work in.

   The person's record already said where their access came from, in prose:
   the position, the rung it is built on, and "44 of the 112 permissions". It
   named a number and then gave you no way to see the 44, let alone touch them.
   This is that number opened up.

   The tree is the one Places uses, because it is the same question — a thing
   with things under it — and the rows are literally the same .plr rows.

   Three levels, not 112 checkboxes:

     Households          See  Add  Change  Archive      <- 8 of these
       Add                                              <- the verb that holds
         family-create   Add a household …                 the stored names
         familymember-create …

   What is toggleable is the middle level: eight groups by four verbs, which is
   thirty-two switches rather than a hundred and twelve. That is not a display
   trick — it is what a position actually stores. `adds` is a list of
   [group, verb] pairs, and the stored names underneath are what that pair
   contains. Ticking names one at a time is the thing that produced twenty-one
   roles for ten jobs.

   Switching one ON makes an exception: one person, one thing, a reason and an
   end date. Switching one OFF is not offered. Aristote's call, and the right
   one: a position is the rung below it plus things, never minus things, so a
   person is always exactly their position plus a named list of additions. The
   moment someone can be their position minus something, "what can a sector
   lead do?" has seventeen answers and the ladder stops meaning anything. A
   granted cell says where it comes from and offers the two routes that do not
   break that: change the position for everyone who holds it, or move this
   person to a different position.
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

  /* An exception is held here rather than on the position, because that is
     what an exception is: this person, not this rung. Nothing is saved — the
     prototype keeps it for as long as the page is open, which is long enough
     to see what the screen does. */
  var extra = {};

  function sourceOf(from, key) {
    if (extra[key]) return { kind: 'exception', label: 'exception' };
    var step = from[key];
    return step ? { kind: 'position', label: step.short || step.name, step: step } : null;
  }

  /* ---- the cell: granted, and from where ---- */

  function cell(host, g, verb, from, redraw) {
    var key = g.key + '|' + verb;
    var has = perms().groups.some(function (x) {
      return x.key === g.key && x.perms.some(function (p) { return p.verb === verb; });
    });
    var b = el('button', 'acc-c');
    b.type = 'button';

    if (!has) {
      /* Not every group has all four verbs — Maintenance is three names, all
         See. An empty cell is not a switch that happens to be off. */
      b.className = 'acc-c none';
      b.disabled = true;
      b.setAttribute('aria-label', verb + ' — ' + g.name + ': nothing stored under this');
      host.appendChild(b);
      return;
    }

    var src = sourceOf(from, key);
    var n = g.perms.filter(function (p) { return p.verb === verb; }).length;
    b.className = 'acc-c' + (src ? ' on' : '') + (src && src.kind === 'exception' ? ' exc' : '');
    b.setAttribute('aria-pressed', String(!!src));
    b.setAttribute('aria-label', verb + ' — ' + g.name + ': ' + (src
      ? 'granted by ' + src.label + ', ' + n + (n === 1 ? ' permission' : ' permissions')
      : 'not granted'));
    b.setAttribute('data-tip', src
      ? verb + ' — ' + g.name + ' comes from ' + src.label + '. ' + n
        + (n === 1 ? ' stored name' : ' stored names') + ' behind it.'
      : verb + ' — ' + g.name + ' is not granted. ' + n
        + (n === 1 ? ' stored name' : ' stored names') + ' would arrive with it.');
    b.innerHTML = '<span class="acc-d"></span>';
    b.onclick = function (e) {
      e.stopPropagation();
      if (src) explain(b, g, verb, src);
      else grant(b, g, verb, redraw);
    };
    host.appendChild(b);
  }

  /* ---- a granted cell: where it comes from, and the two ways to change it ---- */

  function explain(btn, g, verb, src) {
    if (src.kind === 'exception') {
      window.SugiraMenu.show(btn, [
        { heading: true, label: verb + ' — ' + g.name },
        { label: 'Granted as an exception',
          description: 'For this person only, with a reason and an end date on it.' },
        { label: 'Withdraw the exception',
          description: 'Takes back the one thing. The position underneath is untouched.',
          onPick: function () {
            window.SugiraMenu.close();
            delete extra[g.key + '|' + verb];
            draw();
            say('Exception withdrawn — ' + verb + ' — ' + g.name + ' is gone');
          } }
      ], { width: 380 });
      return;
    }

    var step = src.step;
    var n = step.people;
    window.SugiraMenu.show(btn, [
      { heading: true, label: verb + ' — ' + g.name },
      { label: 'Comes from ' + (step.short || step.name),
        description: n + (n === 1 ? ' person holds' : ' people hold') + ' that position. '
          + 'It cannot be taken away here — a position is the rung below it plus things, '
          + 'never minus things.' },
      { label: 'Change the position',
        description: 'Opens the ladder. What you change there changes for all '
          + n + (n === 1 ? ' holder' : ' holders') + '.',
        onPick: function () {
          window.SugiraMenu.close();
          var go = document.querySelector('[data-go="permissions"][data-perms="role"]');
          if (go) go.click();
        } },
      { label: 'Move them to another position',
        description: 'If this person needs less than this one gives, they are on the wrong rung.',
        onPick: function () {
          window.SugiraMenu.close();
          openModal('access');
        } }
    ], { width: 420 });
  }

  /* ---- an ungranted cell: the exception sheet, already filled in ---- */

  function grant(btn, g, verb, redraw) {
    openModal('exception');
    var sel = document.getElementById('f-xw');
    if (!sel) return;
    /* The sheet claimed to hold "only what their position does not already
       give them" and then listed nine things it had been written with. It is
       built from what is actually missing. */
    var p = positionNamed(roleName());
    var from = perms().held(p);
    sel.innerHTML = '';
    perms().groups.forEach(function (gr) {
      VERBS.forEach(function (v) {
        var k = gr.key + '|' + v;
        if (from[k] || extra[k]) return;
        if (!gr.perms.some(function (x) { return x.verb === v; })) return;
        var o = document.createElement('option');
        o.text = v + ' — ' + gr.name;
        o.value = k;
        sel.appendChild(o);
      });
    });
    sel.value = g.key + '|' + verb;
    var trigger = sel.previousElementSibling;
    if (trigger && trigger.classList.contains('cselect')) {
      var t = trigger.querySelector('.cselect-t');
      if (t && sel.options[sel.selectedIndex]) t.textContent = sel.options[sel.selectedIndex].text;
    }
    pendingGrant = { key: g.key + '|' + verb, label: verb + ' — ' + g.name };
  }

  var pendingGrant = null;

  /* The modal's own OK closes it and says its line; this adds the one thing it
     was opened for to the tree behind it. */
  document.addEventListener('click', function (e) {
    var ok = e.target.closest && e.target.closest('#mOk');
    if (!ok || !pendingGrant) return;
    var sel = document.getElementById('f-xw');
    var k = sel && sel.value ? sel.value : pendingGrant.key;
    var label = sel && sel.options[sel.selectedIndex]
      ? sel.options[sel.selectedIndex].text : pendingGrant.label;
    extra[k] = true;
    pendingGrant = null;
    setTimeout(function () { draw(); }, 0);
    void label;
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
    say._t = setTimeout(function () { t.hidden = true; }, 4000);
  }

  /* ---- the tree ---- */

  function host() { return document.getElementById('accessTree'); }
  function roleName() { var h = host(); return h ? h.getAttribute('data-role') : ''; }
  function whoName() { var h = host(); return h ? h.getAttribute('data-who') : ''; }

  var open = {};

  function headRow() {
    var r = el('div', 'plr head');
    r.appendChild(el('span', 'plr-c'));
    r.appendChild(el('span', 'plr-i'));
    r.appendChild(el('span', 'plr-n'));
    var vs = el('span', 'acc-vs');
    VERBS.forEach(function (v) { vs.appendChild(el('span', 'acc-vl', v)); });
    r.appendChild(vs);
    return r;
  }

  function groupRow(g, from, isOpen) {
    var r = el('button', 'plr');
    r.type = 'button';
    r.setAttribute('aria-expanded', String(isOpen));
    r.style.paddingLeft = '12px';
    r.appendChild(svg('i-caret', 'plr-c'));
    r.appendChild(svg(g.icon, 'plr-i'));
    r.appendChild(el('span', 'plr-n', g.name));

    var vs = el('span', 'acc-vs');
    VERBS.forEach(function (v) { cell(vs, g, v, from, draw); });
    r.appendChild(vs);
    r.onclick = function () { open[g.key] = !isOpen; draw(); };
    return r;
  }

  /* Under an open group: the stored names, by verb, each saying what it does
     and which rung it arrives from. These are what the switch above contains,
     so they are read, not set. */
  function permRows(g, from, into) {
    VERBS.forEach(function (v) {
      var list = g.perms.filter(function (p) { return p.verb === v; });
      if (!list.length) return;
      var src = sourceOf(from, g.key + '|' + v);
      var vr = el('div', 'plr leaf acc-vr' + (src ? '' : ' off'));
      vr.style.paddingLeft = '32px';
      vr.appendChild(el('span', 'plr-c'));
      vr.appendChild(el('span', 'plr-n', v));
      vr.appendChild(el('span', 'acc-src', src
        ? 'from ' + src.label
        : 'not granted'));
      into.appendChild(vr);

      list.forEach(function (p) {
        var pr = el('div', 'plr leaf acc-pr' + (src ? '' : ' off'));
        pr.style.paddingLeft = '52px';
        pr.appendChild(el('code', 'acc-id', p.id));
        pr.appendChild(el('span', 'acc-what', p.what));
        if (p.risk) pr.appendChild(svg('i-alert', 'acc-risk'));
        into.appendChild(pr);
      });
    });
  }

  function draw() {
    var h = host();
    if (!h || !window.SugiraPerms) return;
    var p = positionNamed(roleName());
    if (!p) return;
    var from = perms().held(p);

    h.innerHTML = '';
    h.appendChild(headRow());
    perms().groups.forEach(function (g) {
      var isOpen = !!open[g.key];
      h.appendChild(groupRow(g, from, isOpen));
      if (isOpen) permRows(g, from, h);
    });

    var n = 0;
    perms().groups.forEach(function (g) {
      VERBS.forEach(function (v) {
        if (from[g.key + '|' + v] || extra[g.key + '|' + v]) {
          n += g.perms.filter(function (x) { return x.verb === v; }).length;
        }
      });
    });
    var ex = Object.keys(extra).length;
    var foot = el('p', 'acc-foot');
    foot.appendChild(el('b', null, String(n)));
    foot.appendChild(el('span', null, ' of the 112 stored names, from '));
    foot.appendChild(el('b', null, p.short || p.name));
    foot.appendChild(el('span', null, ex
      ? ' and ' + ex + (ex === 1 ? ' exception' : ' exceptions') + '. '
      : '. '));
    foot.appendChild(el('span', null, whoName()
      + ' is this position plus what is listed here, never less than it.'));
    h.appendChild(foot);
  }

  function mount() {
    if (!host()) return;
    /* permissions.js builds its positions at load; if this runs first, wait */
    if (!window.SugiraPerms) { setTimeout(mount, 30); return; }
    draw();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
