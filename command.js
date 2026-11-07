/* ---------------------------------------------------------------------------
   ⌘K — find anything

   This app holds 2 210 households, 539 people and 37 forms, and until now the
   only way to reach one of them was to know which screen it was on and read
   down a table. There was no search control anywhere in it.

   ClickUp's answer is the command bar (block.command-bar in the design
   system), measured at 800×540 in its own window. Everything below comes from
   that spec and its probe — probe.command-bar-leaves.light.800 — and every
   number is a token the stylesheet already carried:

     surface   800×540, background.menu, 12vh from the top, centred,
               elevation.border-5
     header    40 high, padding 8 8 2; input 28 high, 16/20 500
     chips     24 high, r12, 1px border.default, padding 3 6, gap 2;
               label 12/16 500 secondary
     section   12/16 500 tertiary, padding 16 top 4 bottom 8
     row       34 high, inset 8, r10, padding 0 8, gap 12; the highlighted one
               takes color.border.subtle
     row parts icon 20, title 14/18.676, location 14/18.676 placeholder,
               the right-hand column 13/13 placeholder, right-aligned
     hotkey    26×28, r7, on the primary fill
     footer    36 high, 13 tertiary, top border

   Three things in ClickUp's bar are not here, and their absence is the point:

   - The source tabs (All / ClickUp / Gmail / Google Drive / SharePoint) sort
     results by which service they came from. SUGIRA has one service. A tab
     row with one tab in it answers a question nobody is asking.
   - Ask AI hands the query to an assistant. There is no assistant.
   - ClickUp's right-hand column is the time of last activity. Our rows do not
     carry one, and "6h" invented for the screen would be a number somebody
     could read off and act on. What a result most needs to say is what it
     will open, so that column is the kind.

   And nothing here is a list of things to find. The index is read off the
   page every time the bar opens: the rail for pages, every table for records,
   every button that opens a dialog for commands. A hand-written index goes
   stale the first time somebody adds a row, and goes stale silently.
--------------------------------------------------------------------------- */
(function () {
  'use strict';

  var MAC = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent || '');

  /* A mark per kind, so a result's type reads before its name does. The
     colour is not here: the stylesheet gives every kind one, keyed on the
     icon, and the table rows and relation pills read the same rule. This map
     used to carry a `hue` of its own and the bar drew a tinted plate from it,
     which is how a household came to be azure-blue in a table and a pale blue
     tile in here. Two places holding one fact is two places to drift. */
  var KIND = {
    page:      { label: 'Page',         icon: 'hierarchy' },
    household: { label: 'Household',    icon: 'households' },
    person:    { label: 'Person',       icon: 'person' },
    /* "Case", not "Risk of harm", which is what this said until the column
       clipped it to "Risk of ha…". The safeguarding table's own header is
       Case, and reading the app's word off the table rather than inventing
       one is the rule the rest of this file follows. The red shield carries
       what kind of case it is. */
    'case':    { label: 'Case',         icon: 'safeguarding' },
    visit:     { label: 'Visit',        icon: 'visits' },
    project:   { label: 'Project',      icon: 'project'  },
    module:    { label: 'Module',       icon: 'programme' },
    form:      { label: 'Form',         icon: 'edit' },
    report:    { label: 'Report',       icon: 'reports' },
    followup:  { label: 'Follow-up',    icon: 'clock' },
    guidance:  { label: 'Guidance',     icon: 'support' },
    role:      { label: 'Role',         icon: 'role' },
    permission: { label: 'Permission',  icon: 'settings' },
    action:    { label: 'Action',       icon: 'check' },
    cohort:    { label: 'Cohort',       icon: 'households' },
    post:      { label: 'Post',         icon: 'message' },
    activity:  { label: 'Activity',     icon: 'monitor' },
    command:   { label: 'Command',      icon: 'command' }
  };

  /* What a row is, is not a property of the screen it sits on — the project
     screen carries sessions, forms, cohorts, reports and archived forms in
     five tables. It is a property of the table, and every table in the app
     already says it, in the header above the column that holds the name.
     That word was written by whoever built the screen, so it is the app's
     own vocabulary rather than a second one kept here. */
  var BY_HEAD = {
    form: 'form', project: 'project', session: 'module', permission: 'permission',
    role: 'role', report: 'report', person: 'person', household: 'household',
    'follow-up': 'followup', 'when this answer is given': 'followup',
    'posted by': 'post', izu: 'person', 'izu at village': 'person',
    'case': 'case', action: 'action', cohort: 'cohort',
    instruction: 'guidance', video: 'guidance', document: 'guidance',
    from: 'guidance', 'what they did': 'activity', 'the one thing': 'permission',
    'in this project': 'project'
  };
  /* A few columns are called Name or Item, which says nothing. Only those
     fall back to what the screen is about. */
  var GENERIC = /^(name|title|item|#|english|kinyarwanda)$/;
  var BY_SCREEN = {
    project: 'form', household: 'person', module: 'form', people: 'person',
    content: 'guidance', programme: 'form'
  };
  /* The profile's table is a grid of what you may do, not a list of records;
     its six rows would be six nouns with nowhere to go. */
  var NOT_RECORDS = { profile: 1 };

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function clean(t) { return String(t == null ? '' : t).replace(/\s+/g, ' ').trim(); }

  /* ---- the index, read off the page ---- */

  /* What a screen is called. The breadcrumb is the app's own answer to "where
     am I", and its last step is the screen's own name — "Household Module
     Tracking" for the project, "HH-1007 Mukamana" for the household. Which
     settles a question that has no rule otherwise: a household is known by
     its code and a project by its title, and the crumbs already know which
     is which, because somebody decided it once when they wrote them. */
  var named = null;
  function nameOf(id) {
    if (!named) {
      named = {};
      var s = window.SugiraScreens || {};
      Object.keys(s).forEach(function (k) {
        var c = s[k].crumbs;
        if (c && c.length) named[k] = c[c.length - 1][0];
      });
      [].forEach.call(document.querySelectorAll('.rail [data-go]'), function (b) {
        var k = b.getAttribute('data-go');
        var t = b.querySelector('.tx');
        if (k && t && !named[k]) named[k] = clean(t.textContent);
      });
    }
    if (named[id]) return named[id];
    var sc = document.getElementById('s-' + id);
    var h = sc && sc.querySelector('h1');
    return h ? clean(h.textContent) : id;
  }

  /* The word above the column the name sits in. */
  function kindOf(tr, nm, heads, id) {
    var th = heads[nm.cellIndex];
    var h = clean(th ? th.textContent : '')
      .replace(/,? exactly as (it is|they are) stored$/i, '')
      .replace(/\s*\d+$/, '')
      .toLowerCase();
    if (BY_HEAD[h]) return BY_HEAD[h];
    if (GENERIC.test(h) || !h) return BY_SCREEN[id] || null;
    return null;
  }

  /* A row carries alternates that are switched off — a redacted twin of a
     name, a count standing in for a person. Indexing what is not on screen
     would put a name into search that the reader is not allowed to see. */
  function shown(td) {
    var out = '';
    [].forEach.call(td.childNodes, function (n) {
      if (n.nodeType === 3) { out += n.nodeValue; return; }
      if (n.nodeType !== 1) return;
      if (n.hidden || getComputedStyle(n).display === 'none') return;
      out += shown(n);
    });
    return out;
  }

  function index() {
    var out = [], seen = {};
    function add(it) {
      var k = it.kind + '|' + it.title + '|' + (it.where || '');
      if (seen[k]) return;
      seen[k] = 1;
      out.push(it);
    }

    /* Pages, from the rail — including the sub-rows, which are a screen plus
       the view it opens on, and are how somebody actually thinks about where
       they are going ("Forms", not "Programme, then the Forms tab"). */
    [].forEach.call(document.querySelectorAll('.rail [data-go]'), function (b) {
      var t = b.querySelector('.tx');
      if (!t) return;
      var parent = b.classList.contains('si')
        ? (b.closest('.subs') || {}).previousElementSibling : null;
      var pt = parent && parent.querySelector('.tx');
      add({
        kind: 'page', title: clean(t.textContent),
        where: pt ? clean(pt.textContent) : '', el: b
      });
    });

    /* Records, from every table on every screen. */
    [].forEach.call(document.querySelectorAll('.screen'), function (sc) {
      var id = sc.id.replace(/^s-/, '');
      if (NOT_RECORDS[id]) return;
      var where = nameOf(id);
      [].forEach.call(sc.querySelectorAll('table.tbl'), function (tbl) {
        var heads = [].slice.call(tbl.querySelectorAll('thead th'));
        [].forEach.call(tbl.querySelectorAll('tbody tr'), function (tr) {
          if (tr.classList.contains('grp') || tr.classList.contains('shut')) return;
          var nm = tr.querySelector('.nm');
          if (!nm) return;
          var title = clean(shown(nm));
          if (!title) return;
          var kind = kindOf(tr, nm, heads, id);
          if (!kind) return;
          /* The rest of the row is worth searching even though it is not
             worth showing: a household found by its visitor's name is the
             search somebody actually runs. */
          add({
            kind: kind, title: title, where: where, el: tr,
            also: clean(shown(tr)).slice(0, 160)
          });
        });
      });
    });

    /* Commands — every control that opens a dialog, named by its own label
       and located on the screen it belongs to. */
    [].forEach.call(document.querySelectorAll('[data-modal]'), function (b) {
      var title = clean(b.textContent);
      if (!title || b.closest('#kbar')) return;
      var sc = b.closest('.screen');
      var holder = b.closest('[data-for]');
      var id = sc ? sc.id.replace(/^s-/, '') : (holder ? holder.getAttribute('data-for') : '');
      add({ kind: 'command', title: title, where: id ? nameOf(id) : '', el: b });
    });

    return out;
  }

  /* ---- searching ---- */

  /* What the bar shows before anybody types.

     ClickUp shows recent items. This app records nothing about what anyone
     opened, so there is no recency to read, and stamping a "3w" against a row
     to fill ClickUp's time column would be a number somebody could act on.

     What it does know is two things. Where the reader is standing — ClickUp's
     own empty state leads with the current List — and what kinds of thing it
     holds. So the screen you are on comes first, then one of each kind in
     turn. That puts a household, a person, a form and a project in the first
     screenful, which is what the app is, instead of thirty-four pages, which
     is only how you get around it. */
  function sample(all) {
    var sc = document.querySelector('.screen.live');
    var lead = [], pool = [];
    all.forEach(function (i) {
      if (i.kind !== 'page' && sc && i.el && sc.contains(i.el) && lead.length < 5) lead.push(i);
      else pool.push(i);
    });
    var by = {}, kinds = [];
    pool.forEach(function (i) {
      if (!by[i.kind]) { by[i.kind] = []; kinds.push(i.kind); }
      by[i.kind].push(i);
    });
    /* Round-robin, so the variety lands in the rows somebody can see rather
       than three hundred rows down. */
    var out = lead, n = 0, more = true;
    while (more) {
      more = false;
      for (var k = 0; k < kinds.length; k++) {
        var q = by[kinds[k]];
        if (n < q.length) { out.push(q[n]); more = true; }
      }
      n++;
    }
    return out;
  }

  function hits(all, q) {
    q = q.trim().toLowerCase();
    if (!q) return sample(all);
    var out = [];
    all.forEach(function (i) {
      var t = i.title.toLowerCase();
      var at = t.indexOf(q);
      if (at > -1) { out.push({ i: i, at: at, rank: at === 0 ? 0 : 1 }); return; }
      if (i.where && i.where.toLowerCase().indexOf(q) > -1) { out.push({ i: i, at: -1, rank: 2 }); return; }
      if (i.also && i.also.toLowerCase().indexOf(q) > -1) out.push({ i: i, at: -1, rank: 3 });
    });
    /* A name that starts with what you typed before one that merely contains
       it; a page before a record, because a page is a smaller promise. */
    out.sort(function (a, b) {
      if (a.rank !== b.rank) return a.rank - b.rank;
      var ap = a.i.kind === 'page' ? 0 : 1, bp = b.i.kind === 'page' ? 0 : 1;
      if (ap !== bp) return ap - bp;
      return a.i.title.length - b.i.title.length;
    });
    return out.map(function (r) { return r.i; });
  }

  /* ---- the address of a result ---- */

  /* The app has written the screen into the hash since long before this bar
     existed, so a page has had a real address all along and the link is just
     that address. A record has not: it lives in a row of a table on a screen,
     and there is nothing in the URL that can name a row.

     What the bar can do is hand back the search that found it. It already
     knows how to find anything by name and put the reader in front of it —
     that is the whole of run() — so the link carries the kind and the name,
     and opening it replays exactly that. It is a working address for all 349
     things rather than a working one for the 34 that are pages.

     The hash is not the place to put it. app.js owns the hash, and on load it
     rewrites anything it does not recognise to the screen it fell back to —
     which it has already done by the time this file runs, because both scripts
     are deferred and it is first. So a record's address goes in the query,
     which nothing else writes, and survives the rewrite. */
  function address(it) {
    var go = it.el && it.el.getAttribute && it.el.getAttribute('data-go');
    if (it.kind === 'page' && go) return '#' + go;
    return '?find=' + encodeURIComponent(it.kind + ':' + it.title);
  }

  /* Built from the path, never from the address bar as it stands: this page's
     own query may already carry the find= that opened it, and a link copied
     from here would then point at whatever somebody else was looking at. */
  function link(it) {
    return location.origin + location.pathname + address(it);
  }

  function openTab(it) {
    window.open(link(it), '_blank', 'noopener');
  }

  function copyLink(it) {
    var url = link(it);
    function said() {
      if (window.SugiraToast) window.SugiraToast.say('Link copied');
    }
    /* The clipboard API needs a secure context and a permission that can be
       refused, and this app is also opened from a file on a tablet. */
    function byHand() {
      var t = document.createElement('textarea');
      t.value = url;
      t.setAttribute('readonly', '');
      t.style.cssText = 'position:fixed;top:-100px;opacity:0';
      document.body.appendChild(t);
      t.select();
      try { document.execCommand('copy'); said(); } catch (e) { /* nothing to offer */ }
      document.body.removeChild(t);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(said, byHand);
    } else byHand();
  }

  /* Someone has opened one of those links. */
  var came = false;
  function fromLink() {
    if (came) return;
    came = true;
    var m = /[?&]find=([^&]*)/.exec(location.search || '');
    if (!m) return;
    var want = decodeURIComponent(m[1].replace(/\+/g, ' '));
    var at = want.indexOf(':');
    var kind = at < 0 ? '' : want.slice(0, at);
    var title = at < 0 ? want : want.slice(at + 1);
    named = null;
    var hit = index().filter(function (i) {
      return i.title === title && (!kind || i.kind === kind);
    })[0];
    if (hit) run(hit);
  }

  /* ---- drawing ---- */

  var bar = null, input = null, list = null, foot = null;
  var all = [], rows = [], active = 0, only = null;

  function mark(title, q) {
    var span = el('span', 'kb-t');
    q = q.trim();
    var at = q ? title.toLowerCase().indexOf(q.toLowerCase()) : -1;
    if (at < 0) { span.textContent = title; return span; }
    span.appendChild(document.createTextNode(title.slice(0, at)));
    span.appendChild(el('b', null, title.slice(at, at + q.length)));
    span.appendChild(document.createTextNode(title.slice(at + q.length)));
    return span;
  }

  function glyph(kind) {
    var k = KIND[kind] || KIND.page;
    var s = el('span', 'kb-i');
    s.innerHTML = '<svg aria-hidden="true"><use href="#i-' + k.icon + '"/></svg>';
    return s;
  }

  /* The right-hand end of a row: what it is, or — on the one row the keys are
     pointed at — what can be done with it.

     ClickUp's cluster is Ask AI, open in a new window, copy link and ↵. There
     is no assistant here to ask, so that one is not drawn rather than drawn
     dead; the other three are real. */
  function tail(it, on) {
    if (!on) return el('span', 'kb-kind', (KIND[it.kind] || {}).label || it.kind);
    var wrap = el('span', 'kb-acts');
    wrap.appendChild(act('openEntity', 'Open in a new tab', MAC ? '⌘↵' : 'Ctrl+↵',
      function () { openTab(it); }));
    wrap.appendChild(act('link', 'Copy link', MAC ? '⌘C' : 'Ctrl+C',
      function () { copyLink(it); }));
    wrap.appendChild(el('kbd', 'kb-k', '↵'));
    return wrap;
  }

  function act(icon, label, key, onPick) {
    var b = el('button', 'kb-act');
    b.type = 'button';
    b.title = label + '  ' + key;
    /* The row is a listbox option, and an option with buttons inside it has
       stopped being one: a reader would be told about controls that the
       arrow keys driving this list cannot reach. So these stay out of the
       tab order and out of the tree, and each one's work is also on a key
       that does it from the field — which is where the focus is anyway. */
    b.tabIndex = -1;
    b.setAttribute('aria-hidden', 'true');
    b.innerHTML = '<svg aria-hidden="true"><use href="#i-' + icon + '"/></svg>';
    b.onclick = function (e) { e.stopPropagation(); onPick(); };
    return b;
  }

  function drawChips() {
    var wrap = bar.querySelector('.kb-chips');
    wrap.textContent = '';
    /* The chips are the kinds this search actually turned up — not a fixed
       row of types, most of which would narrow to nothing. */
    var kinds = [], count = {};
    rows.forEach(function (r) {
      if (!count[r.kind]) { count[r.kind] = 0; kinds.push(r.kind); }
      count[r.kind]++;
    });
    if (only && kinds.indexOf(only) < 0) kinds.push(only);
    kinds.slice(0, 7).forEach(function (k) {
      var b = el('button', 'kb-chip' + (only === k ? ' on' : ''));
      b.type = 'button';
      b.setAttribute('aria-pressed', String(only === k));
      b.appendChild(glyph(k));
      b.appendChild(el('span', 'kb-chip-t', (KIND[k] || {}).label || k));
      if (count[k]) b.appendChild(el('span', 'kb-chip-n', String(count[k])));
      b.onclick = function (e) {
        e.stopPropagation();
        only = only === k ? null : k;
        draw();
        input.focus();
      };
      wrap.appendChild(b);
    });
    /* One chip is not a filter: a control offering to narrow a list of one
       kind to the same list cannot do anything. */
    wrap.hidden = kinds.length < 2;
  }

  function draw() {
    var q = input.value;
    rows = hits(all, q);
    drawChips();
    var show = only ? rows.filter(function (r) { return r.kind === only; }) : rows;
    rows = show;
    if (active >= show.length) active = Math.max(0, show.length - 1);

    list.textContent = '';
    if (!show.length) {
      var none = el('div', 'kb-none');
      none.appendChild(el('p', null, q.trim()
        ? 'Nothing here matches “' + q.trim() + '”'
        : 'Nothing to show'));
      list.appendChild(none);
      foot.querySelector('.kb-count').textContent = '';
      /* Teaching the arrow keys under a list with nothing in it is the footer
         saying something that is not true of what is on screen. */
      foot.classList.add('bare');
      input.removeAttribute('aria-activedescendant');
      return;
    }
    foot.classList.remove('bare');

    var label = el('div', 'kb-sect', 'Results');
    list.appendChild(label);

    /* 2 210 households is 2 210 rows of DOM nobody will scroll to the end of.
       The count in the footer says what the list is a window onto. */
    show.slice(0, 60).forEach(function (it, i) {
      var r = el('div', 'kb-r' + (i === active ? ' on' : ''));
      r.setAttribute('role', 'option');
      r.id = 'kb-o-' + i;
      r.setAttribute('aria-selected', String(i === active));
      r.setAttribute('data-i', String(i));
      r.appendChild(glyph(it.kind));

      var mid = el('span', 'kb-m');
      mid.appendChild(mark(it.title, q));
      if (it.where) {
        /* A result can match on where it lives rather than on its name —
           "every command on HH-1007" — and a row whose title has nothing
           marked in it looks like a mistake until the location says why. */
        var w = mark(it.where, q);
        w.className = 'kb-w';
        w.insertBefore(document.createTextNode('in '), w.firstChild);
        mid.appendChild(w);
      }
      r.appendChild(mid);

      r.appendChild(tail(it, i === active));

      r.onmouseenter = function () {
        if (active === i) return;
        active = i;
        paint();
      };
      r.onclick = function (e) { e.stopPropagation(); run(it); };
      list.appendChild(r);
    });

    foot.querySelector('.kb-count').textContent = show.length > 60
      ? 'first 60 of ' + show.length
      : show.length + (show.length === 1 ? ' result' : ' results');
    var cur = list.querySelector('.kb-r.on');
    if (cur) input.setAttribute('aria-activedescendant', cur.id);
    else input.removeAttribute('aria-activedescendant');
  }

  /* Moving the highlight redraws two rows, not the list. Rebuilding sixty
     rows on every arrow key is how a list starts to feel heavy under a
     keyboard, which is the one way this is meant to be used. */
  function paint() {
    [].forEach.call(list.querySelectorAll('.kb-r'), function (r, i) {
      var on = i === active;
      if (r.classList.contains('on') === on) return;
      r.classList.toggle('on', on);
      r.setAttribute('aria-selected', String(on));
      var end = r.lastChild;
      if (end) r.removeChild(end);
      r.appendChild(tail(rows[i], on));
    });
    var cur = list.querySelector('.kb-r.on');
    if (cur) cur.scrollIntoView({ block: 'nearest' });
    /* The focus never leaves the field, so the field is what has to say which
       option is current — otherwise a screen reader hears the typing and
       nothing about what the arrow keys are moving through. */
    if (cur) input.setAttribute('aria-activedescendant', cur.id);
    else input.removeAttribute('aria-activedescendant');
  }

  /* ---- opening a result ---- */

  /* The bar does not navigate. It presses the thing you were looking for —
     the rail button, the table row, the button that opens the dialog — so
     every one of them behaves exactly as it does when you reach it by hand,
     and none of the app's routing is written down a second time here. */
  function run(it) {
    close();
    var e = it.el;
    if (!e || !e.isConnected) return;
    /* A row that navigates has somewhere of its own to go, and goes there.
       A row that does not is still in its table, so the reader is taken to
       the table and the row is named. */
    if (e.tagName === 'TR' && !e.hasAttribute('data-go')) { reveal(e); return; }
    e.click();
  }

  /* A record with nowhere of its own to go is still worth finding: take the
     reader to the screen it is on and say which row it was.

     This used to look for a rail button carrying the screen's name, which
     works for the nine screens the rail lists and silently does nothing for
     the rest — a member of a household, an action on a case, a session in a
     project. Those screens have no rail row because you reach them through a
     record, and some of them are drawers rather than pages. The app knows
     which; it is asked. */
  function reveal(tr) {
    var sc = tr.closest('.screen');
    var went = false;
    if (sc && !sc.classList.contains('live') && window.SugiraGo) {
      went = window.SugiraGo(sc.id.replace(/^s-/, ''));
    }
    setTimeout(function () {
      uncover(tr);
      tr.scrollIntoView({ block: 'center' });
      flash(tr);
    }, went ? 220 : 120);
  }

  /* Arriving at a screen is not the same as arriving at the row. Most of
     these records live under a tab — Members, Archived forms, Risk of harm —
     and a screen opens on its first one, so four kinds of result were landing
     on a row inside a panel that was switched off: measurably a zero-sized
     box behind the drawer. Press the tab the row is under, and let the tab
     bar do the rest, since it also moves the page actions that belong to it. */
  function uncover(tr) {
    var panel = tr.closest('[data-panelid]');
    if (!panel || !panel.hidden) return;
    var id = panel.getAttribute('data-panelid');
    var root = panel.closest('.screen') || document;
    var tab = root.querySelector('.tab[data-panel="' + id + '"]');
    if (tab) tab.click();
  }

  function flash(tr) {
    tr.classList.remove('kb-hit');
    void tr.offsetWidth;
    tr.classList.add('kb-hit');
    setTimeout(function () { tr.classList.remove('kb-hit'); }, 1800);
  }

  /* ---- the bar itself ---- */

  function build() {
    bar = el('div', 'kb');
    bar.id = 'kbar';
    bar.hidden = true;
    bar.innerHTML =
      '<div class="kb-scrim"></div>'
      + '<div class="kb-win" role="dialog" aria-modal="true" aria-label="Find anything">'
      + '<div class="kb-h"><svg class="kb-h-i" aria-hidden="true"><use href="#i-search"/></svg>'
      + '<input class="kb-in" type="text" autocomplete="off" spellcheck="false"'
      + ' placeholder="Search for a household, a person, a form — or run a command"'
      + ' aria-label="Search for a household, a person, a form, or run a command"'
      + ' aria-controls="kb-list" role="combobox" aria-expanded="true"></div>'
      + '<div class="kb-chips" role="group" aria-label="Narrow by kind"></div>'
      + '<div class="kb-list" id="kb-list" role="listbox" aria-label="Results"></div>'
      + '<footer class="kb-f"><span class="kb-count"></span><span class="kb-keys">'
      + '<span class="kb-key-m"><kbd>↑</kbd><kbd>↓</kbd> move '
      + '<kbd>↵</kbd> open </span><kbd>esc</kbd> close'
      + '</span></footer></div>';
    document.body.appendChild(bar);
    input = bar.querySelector('.kb-in');
    list = bar.querySelector('.kb-list');
    foot = bar.querySelector('.kb-f');

    input.addEventListener('input', function () { active = 0; draw(); });
    bar.querySelector('.kb-scrim').addEventListener('click', close);
    bar.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        active = Math.min(rows.length - 1, active + 1);
        paint();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        active = Math.max(0, active - 1);
        paint();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (!rows[active]) return;
        /* Cmd-Enter is a new tab everywhere a link is, so it is one here. */
        if (e.metaKey || e.ctrlKey) openTab(rows[active]); else run(rows[active]);
      } else if (String(e.key).toLowerCase() === 'c'
                 && (e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey) {
        /* Copy means copy the link — unless there is something selected in
           the field, where copy already means something and has to win. */
        if (input.selectionStart !== input.selectionEnd) return;
        if (!rows[active]) return;
        e.preventDefault();
        copyLink(rows[active]);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        close();
      } else if (e.key === 'Tab') {
        /* Tab stays inside, and goes round. It must not leave — tabbing out
           of a search that is covering the page lands you somewhere you
           cannot see — but blocking it outright, which is what this did
           first, leaves the kind chips reachable by mouse only. */
        var can = [].filter.call(
          bar.querySelectorAll('input, button, [tabindex]:not([tabindex="-1"])'),
          function (n) { return !n.disabled && n.offsetParent !== null; });
        if (!can.length) return;
        var at = can.indexOf(document.activeElement);
        var next = e.shiftKey ? at - 1 : at + 1;
        if (next < 0) next = can.length - 1;
        if (next >= can.length) next = 0;
        e.preventDefault();
        can[next].focus();
      }
    });
  }

  var was = null;
  function open() {
    if (!bar) build();
    if (!bar.hidden) { input.select(); return; }
    /* Every other layer is below this one. */
    if (window.SugiraMenu) window.SugiraMenu.close();
    if (window.SugiraPop) window.SugiraPop.close();
    was = document.activeElement;
    named = null;
    all = index();
    only = null;
    active = 0;
    input.value = '';
    bar.hidden = false;
    document.body.classList.add('kb-open');
    draw();
    input.focus();
  }

  function close() {
    if (!bar || bar.hidden) return;
    bar.hidden = true;
    document.body.classList.remove('kb-open');
    if (was && was.isConnected && was.focus) was.focus();
    was = null;
  }

  /* ---- the key, and the pill that says what the key is ---- */

  document.addEventListener('keydown', function (e) {
    var k = String(e.key || '').toLowerCase();
    if (k === 'k' && (e.metaKey || e.ctrlKey) && !e.altKey) {
      e.preventDefault();
      if (bar && !bar.hidden) close(); else open();
      return;
    }
    /* A plain slash opens it too, the way search does everywhere else — but
       not while somebody is typing, where a slash is a slash. */
    if (k === '/' && !e.metaKey && !e.ctrlKey && !e.altKey) {
      var a = document.activeElement, t = a && a.tagName;
      if (t === 'INPUT' || t === 'TEXTAREA' || (a && a.isContentEditable)) return;
      e.preventDefault();
      open();
    }
  });

  function pill() {
    var tools = document.querySelector('.topbar .tools');
    var chip = tools && tools.querySelector('.userchip');
    if (!tools || !chip || tools.querySelector('.kb-pill')) return;
    var b = el('button', 'kb-pill');
    b.type = 'button';
    b.setAttribute('aria-label', 'Find anything');
    b.innerHTML = '<svg aria-hidden="true"><use href="#i-search"/></svg>'
      + '<span class="kb-pill-t">Search</span>'
      + '<kbd>' + (MAC ? '⌘K' : 'Ctrl K') + '</kbd>';
    b.onclick = function (e) { e.stopPropagation(); open(); };
    tools.insertBefore(b, chip);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', pill);
  else pill();

  /* The index reads the tables, so a link cannot be resolved until they have
     been built. */
  document.addEventListener('tables:ready', fromLink);
  if (window.SugiraTablesReady) fromLink();

  window.SugiraFind = { open: open, close: close, index: index };
})();
