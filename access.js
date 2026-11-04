/* ---------------------------------------------------------------------------
   The permissions block.

   One block, used in three places that all ask the same question — a position,
   a role, one person — so they look the same and behave the same.

   Eight group rows. Each has a switch and a caret. Open it and you get that
   group's permissions as checkboxes, two across. That is the whole thing:
   a permission is the object you tick, so there is nothing between you and it.

   What this replaces had four layers — a segmented control, a group row, a
   grid of four verbs, and then "See the 20 stored names" before you reached a
   name. The permission you cared about was four clicks down and called three
   different things on the way.

   Inheritance is drawn, not navigated. A position built on another shows the
   permissions arriving from below as ticked and disabled, with the rung they
   come from on hover. That is ClickUp's disabled checkbox doing the job the
   segmented control used to do, and it is why the control is gone.

   Measured from the design system's own source:

     atoms/Checkbox.tsx:34-50   16px box, radius --checkbox-radius (4), checked
       fill --checkbox-checked-bg, mixed is an 8 x 1.75 dash. Disabled is NOT
       half opacity: disabledLook="type" keeps full opacity and swaps to
       --checkbox-bg-disabled / --checkbox-border-disabled, which is what cu3
       actually does (specs/foundations/states.md:24). Dimming would have put
       the label under 4.5:1.
     atoms/Switch.tsx:30-47     24 x 14, 2px border in the track colour, a 10px
       knob travelling 10px. On --switch-track-on-bg-default.
     components/PropertyGrid.tsx:11-17  two columns at container >= 720px, one
       below, column gap --property-grid-gap-x (22), row gap 4.
     blocks/Settings.tsx:203-227  switch before the text, gap 12.
--------------------------------------------------------------------------- */
(function () {
  'use strict';

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

  /* ---- the model a caller supplies -------------------------------------
     perm(id)        null when the permission is not offered here, else
                     { on, locked, from } — locked means ticked and not
                     yours to untick on this screen
     toggle(id)      called only when a permission is neither locked nor absent
     setGroup(key,on) tick or clear every unlocked permission in the group
     summary()       a node to sit above the groups, or null
     caption(key)    one line under the group name, or null
     open            a plain object this block writes which group is showing
     redraw()        draw the whole thing again
  --------------------------------------------------------------------- */

  /* A group's state is its children's: all on, some on, or none. */
  function tally(model, g) {
    var on = 0, off = 0, locked = 0, n = 0;
    g.perms.forEach(function (p) {
      var c = model.perm(p.id);
      if (!c) return;
      n++;
      if (c.locked) locked++;
      if (c.on) on++; else off++;
    });
    return { on: on, off: off, locked: locked, n: n,
      all: n > 0 && on === n, none: on === 0, some: on > 0 && on < n,
      frozen: n > 0 && locked === n };
  }

  function checkbox(model, p) {
    var c = model.perm(p.id);
    var wrap = el('label', 'acc-p' + (c && c.locked ? ' is-locked' : ''));

    var btn = el('button', 'acc-pb');
    btn.type = 'button';
    btn.setAttribute('role', 'checkbox');
    btn.setAttribute('aria-checked', String(!!(c && c.on)));
    btn.disabled = !c || !!c.locked;

    var box = el('span', 'acc-box' + (c && c.on ? ' on' : ''));
    if (c && c.on) box.innerHTML = '<svg aria-hidden="true"><use href="#i-check"/></svg>';
    btn.appendChild(box);
    btn.appendChild(el('span', 'acc-pn', p.label));
    if (p.risk) btn.appendChild(svg('i-alert', 'acc-prisk'));

    /* The whole row carries the explanation, so hovering anywhere gives it:
       what the permission does, where it arrives from, and — because the
       complaint was that nobody could find where a stored name went — which
       of the old 112 it replaces. */
    var tip = p.what;
    if (c && c.from) tip += ' Comes from ' + c.from + ', so it cannot be removed here.';
    if (p.risk) tip += ' ' + p.risk;
    if (p.replaces.length) {
      tip += ' Replaces ' + p.replaces.length
        + (p.replaces.length === 1 ? ' stored name: ' : ' stored names: ')
        + p.replaces.join(', ') + '.';
    }
    wrap.setAttribute('data-tip', tip);

    if (c && !c.locked) btn.onclick = function () { model.toggle(p.id); };
    wrap.appendChild(btn);
    return wrap;
  }

  function groupRow(model, g) {
    var t = tally(model, g);
    var open = !!model.open[g.key];

    /* The switch is gone. It led every row, so the eye met a control before it
       met a name, and it said the same thing the count beside it already said.
       The count is the row's whole right-hand side now, in a column of its
       own so the eight line up, and close enough to the names to be read with
       them rather than across a gap. Turning a group on or off is the job of
       the permissions inside it. */
    var row = el('button', 'acc-g' + (open ? ' is-open' : ''));
    row.type = 'button';
    row.setAttribute('aria-expanded', String(open));
    row.appendChild(svg('i-caret', 'acc-gc'));
    row.appendChild(svg(g.icon, 'acc-gi'));
    row.appendChild(el('span', 'acc-gn', g.name));
    var c = el('span', 'acc-gcount' + (t.on ? '' : ' none'));
    c.appendChild(el('b', null, String(t.on)));
    c.appendChild(document.createTextNode(' of ' + t.n));
    row.appendChild(c);
    row.onclick = function () { model.open[g.key] = !open; model.redraw(); };
    return row;
  }

  function groupBody(model, g) {
    var body = el('div', 'acc-gb');
    var grid = el('div', 'acc-grid');
    g.perms.forEach(function (p) { grid.appendChild(checkbox(model, p)); });
    body.appendChild(grid);
    return body;
  }

  function render(host, model) {
    if (!host || !perms()) return;
    host.innerHTML = '';

    if (model.summary) {
      var s = model.summary();
      if (s) host.appendChild(s);
    }

    var tree = el('div', 'acc-tree');
    perms().groups.forEach(function (g) {
      tree.appendChild(groupRow(model, g));
      if (model.open[g.key]) tree.appendChild(groupBody(model, g));
    });
    host.appendChild(tree);
  }

  window.SugiraAccess = { render: render, tally: tally };

  /* ---- one person -------------------------------------------------------

     The third caller. What a person can open is their position, plus any roles
     they hold, plus anything granted to them by name. All three arrive the
     same way, so the row says which — and only the last kind is theirs to
     change here.

     There is no segmented control. The old one had a read-only "Everything the
     position gives" view and an editable "Add for …" view, which was two
     screens of the same thing; a locked checkbox says it in place. */

  var extra = {};      // permission id -> true, for this page only

  function attr(n) { var h = host(); return h ? h.getAttribute(n) : null; }
  function host() { return document.getElementById('accessTree'); }
  function whoName() { return attr('data-who') || 'this person'; }

  function position() {
    var name = attr('data-role');
    var list = perms() ? perms().positions() : [];
    for (var i = 0; i < list.length; i++) if (list[i].name === name) return list[i];
    return null;
  }
  function theirRoles() {
    var ids = (attr('data-roles') || '').split(',').filter(Boolean);
    if (!window.SugiraRoles) return [];
    return ids.map(function (id) { return window.SugiraRoles.byId(id); }).filter(Boolean);
  }

  var person = {
    open: {},

    perm: function (id) {
      var p = position();
      var from = p && perms().held(p)[id];
      if (from) {
        return { on: true, locked: true,
          from: 'their position' + (from.short ? ' (' + from.short + ')' : '') };
      }
      var role = theirRoles().filter(function (r) { return r.grants.indexOf(id) > -1; })[0];
      if (role) return { on: true, locked: true, from: 'the ' + role.name + ' role' };
      return { on: !!extra[id], locked: false };
    },

    toggle: function (id) {
      if (extra[id]) { delete extra[id]; person.redraw(); return; }
      ask(id);
    },

    /* The switch would grant a whole group by name to one person, which is the
       thing positions exist to prevent. It only ever clears here. */
    setGroup: function (key, on) {
      if (on) return;
      perms().groups.forEach(function (g) {
        if (g.key !== key) return;
        g.perms.forEach(function (p) { delete extra[p.id]; });
      });
      person.redraw();
    },

    caption: function () { return null; },

    summary: function () {
      var p = position(), from = p ? perms().held(p) : {};
      var n = 0;
      for (var k in from) if (from.hasOwnProperty(k)) n++;
      var roles = theirRoles(), ex = Object.keys(extra).length;
      var s = el('p', 'acc-sum');
      s.appendChild(el('b', null, String(n)));
      s.appendChild(document.createTextNode(' from their position'));
      if (roles.length) {
        s.appendChild(document.createTextNode(', ' + roles.length
          + (roles.length === 1 ? ' role' : ' roles')));
      }
      if (ex) {
        s.appendChild(document.createTextNode(', and ' + ex
          + (ex === 1 ? ' thing granted by name' : ' things granted by name')));
      }
      s.appendChild(document.createTextNode('.'));
      /* Why a greyed box is greyed is on the box itself, where someone meets
         it, rather than in a sentence above the whole list. */
      s.setAttribute('data-tip', 'The greyed ones arrive from the position or a role and '
        + 'cannot be taken away here — change the position, or move ' + whoName()
        + ' to a different one.');
      return s;
    },

    redraw: function () { render(host(), person); }
  };

  /* Granting one thing to one person is an exception, and an exception has to
     say why and until when. So it goes through the dialog rather than a tick. */
  function ask(id) {
    var opener = document.querySelector('[data-modal="exception"]');
    if (!opener) { extra[id] = true; person.redraw(); return; }
    var sel = document.getElementById('f-xw');
    if (sel) {
      sel.innerHTML = '';
      perms().all.forEach(function (p) {
        if (person.perm(p.id).locked || extra[p.id]) return;
        var o = document.createElement('option');
        o.value = p.id;
        o.textContent = p.label + ' — ' + p.what;
        sel.appendChild(o);
      });
      sel.value = id;
    }
    pending = id;
    opener.click();
  }

  var pending = null;
  document.addEventListener('click', function (e) {
    if (!pending) return;
    if (!e.target.closest || !e.target.closest('#mOk')) return;
    var sel = document.getElementById('f-xw');
    extra[(sel && sel.value) || pending] = true;
    pending = null;
    setTimeout(person.redraw, 0);
  }, true);

  function mountPerson() { if (host()) person.redraw(); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountPerson);
  } else {
    mountPerson();
  }
  document.addEventListener('drawer:render', function (e) {
    if (e.detail && e.detail.key === 'person') setTimeout(mountPerson, 0);
  });
})();
