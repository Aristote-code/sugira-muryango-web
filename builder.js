/* ==================== the form builder ====================================

   "We gave flexibility to build a form, including conditions" — gp4 00:35,
   describing the tool underneath this programme. And how it should read:
   the pieces you build with down one side, and the thing you are building
   shown as it will actually look down the other.

   So three columns, and each answers a different question. What can I add.
   What is in the form. What will the home visitor see. The middle one is the
   form; the outer two exist to serve it.

   The field card is ClickUp's FormBuilder, measured from its source: a card
   at radius-lg on elevation-border-1 with padding 12, the move handle 16 wide
   and 24 tall in content.tertiary at cursor:grab, the question in a text
   field taking the rest of the row, the kind behind an outline button
   carrying its own icon, and under that a switch labelled Required. Reorder
   is drag, or the arrow keys on the handle, because a form of thirty
   questions is not something to drag through.

   What is ours rather than theirs: ClickUp adds a field from a menu, and the
   client asked for the pieces to sit out on the side where you can see them
   all. Their field maps onto a task property; ours maps onto nothing, because
   a question here is answered on a tablet in a house. In its place are the
   two things this programme actually does with a question — whether it opens
   a risk-of-harm case, and whether it is asked at all, which is what a
   condition decides.
   ========================================================================= */
(function () {
  'use strict';

  /* The eight the app already offers, in the order the Add-a-question dialog
     offers them, each with the icon it is given everywhere else. */
  var KINDS = [
    { id: 'yesno',  label: 'Yes / No',      icon: 'i-check',    hint: 'Two buttons' },
    { id: 'single', label: 'Single choice', icon: 'i-caret',    hint: 'One of a list' },
    { id: 'multi',  label: 'Multi-select',  icon: 'i-expand',   hint: 'Any of a list' },
    { id: 'check',  label: 'Checklist',     icon: 'i-check',    hint: 'Tick what applies' },
    { id: 'number', label: 'Number',        icon: 'i-reports',  hint: 'A figure' },
    { id: 'date',   label: 'Date',          icon: 'i-visits',   hint: 'A day' },
    { id: 'short',  label: 'Short text',    icon: 'i-message',  hint: 'A line' },
    { id: 'long',   label: 'Long text',     icon: 'i-message',  hint: 'A paragraph' }
  ];
  function kindOf(id) {
    return KINDS.filter(function (k) { return k.id === id; })[0] || KINDS[0];
  }

  /* The Visit record, as it stands. Ten of its thirty, which is what fits on
     a screen without the list becoming the thing you are reading. */
  var FORM = {
    name: 'Visit record',
    rw: 'Inyandiko y’urugendo',
    q: [
      { id: 'q1', en: 'Date of visit', rw: 'Itariki y’urugendo', kind: 'date', req: true },
      { id: 'q2', en: 'Who was present?', rw: 'Ni nde wari ahari?', kind: 'multi', req: true,
        opts: ['Umubyeyi w’umugore', 'Umubyeyi w’umugabo', 'Umwana', 'Undi'] },
      { id: 'q3', en: 'Was the male caregiver present?', rw: 'Umubyeyi w’umugabo yari ahari?',
        kind: 'yesno', req: true, opts: ['Yego', 'Oya', 'Nta mubyeyi w’umugabo'] },
      { id: 'q4', en: 'Why was he not present?', rw: '', kind: 'short',
        when: { q: 'q3', is: 'Oya' } },
      { id: 'q5', en: 'Which activities were completed?', rw: 'Ni ibihe bikorwa byarangiye?',
        kind: 'check', req: true,
        opts: ['Gukina', 'Gusoma', 'Kuririmba', 'Kuvugana'] },
      { id: 'q6', en: 'Minutes spent', rw: 'Iminota yakoreshejwe', kind: 'number', req: true },
      { id: 'q7', en: 'Any sign of harm or neglect?', rw: 'Hari ikimenyetso cy’ihohoterwa?',
        kind: 'yesno', req: true, opens: true, opts: ['Yego', 'Oya'] },
      { id: 'q8', en: 'What did you see?', rw: '', kind: 'long',
        when: { q: 'q7', is: 'Yego' }, req: true },
      { id: 'q9', en: 'Household needs identified', rw: 'Ibikenewe mu rugo', kind: 'check',
        opts: ['Ubwishingizi', 'Ibiryo', 'Ishuri', 'Ubuvuzi'] },
      { id: 'q10', en: 'Notes for the next visit', rw: 'Inyandiko z’urugendo rutaha',
        kind: 'long' }
    ]
  };

  var picked = null;     // the question being worked on
  var host = null;

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
  function rwLabel(q) {
    if (!q.rw) return 'No Kinyarwanda yet';
    return q.stale ? 'Kinyarwanda is behind' : 'Kinyarwanda ready';
  }
  function at(id) {
    for (var i = 0; i < FORM.q.length; i++) if (FORM.q[i].id === id) return FORM.q[i];
    return null;
  }

  /* ---- the pieces, down the left ---- */
  function palette() {
    var pane = el('div', 'fb-pane fb-kinds');
    var h = el('div', 'fb-h');
    h.appendChild(el('h3', null, 'Add a question'));
    pane.appendChild(h);

    KINDS.forEach(function (k) {
      var b = el('button', 'fb-kind');
      b.type = 'button';
      b.appendChild(svg(k.icon, 'fb-kind-i'));
      var m = el('span', 'fb-kind-m');
      m.appendChild(el('span', 'fb-kind-n', k.label));
      m.appendChild(el('span', 'fb-kind-h', k.hint));
      b.appendChild(m);
      b.onclick = function () {
        var q = { id: 'q' + (Date.now() % 100000), en: k.label, rw: '', kind: k.id,
          opts: (k.id === 'single' || k.id === 'multi' || k.id === 'check')
            ? ['Option 1', 'Option 2'] : undefined };
        FORM.q.push(q);
        picked = q.id;
        draw();
        var row = host.querySelector('[data-q="' + q.id + '"] .fb-q');
        if (row) { row.focus(); row.select(); }
      };
      pane.appendChild(b);
    });

    var note = el('p', 'mhint', 'A question joins the end of the form. Drag its '
      + 'handle to move it, or hold the handle and use the arrow keys.');
    pane.appendChild(note);
    return pane;
  }

  /* ---- the form, in the middle ---- */
  function card(q, i) {
    var li = el('li', 'fb-f' + (picked === q.id ? ' on' : ''));
    li.setAttribute('data-q', q.id);
    /* Choosing a question used to redraw everything, which took the card out
       of the DOM between mousedown and mouseup — so a click that started on
       the number never finished, and the dialog it opens never opened.
       Choosing is not a change to the form: it moves a highlight, so it moves
       a class. */
    li.onmousedown = function () { select(q.id); };

    var grip = el('span', 'fb-grip');
    grip.setAttribute('role', 'button');
    grip.tabIndex = 0;
    grip.draggable = true;
    grip.setAttribute('aria-label', 'Move ' + q.en);
    grip.innerHTML = '<svg aria-hidden="true" viewBox="0 0 12 12">'
      + '<circle cx="4" cy="2" r="1"/><circle cx="8" cy="2" r="1"/>'
      + '<circle cx="4" cy="6" r="1"/><circle cx="8" cy="6" r="1"/>'
      + '<circle cx="4" cy="10" r="1"/><circle cx="8" cy="10" r="1"/></svg>';
    grip.ondragstart = function (e) {
      e.dataTransfer.setData('text/x-q', q.id);
      li.classList.add('dragging');
    };
    grip.ondragend = function () { li.classList.remove('dragging'); };
    grip.onkeydown = function (e) {
      var j = e.key === 'ArrowUp' ? i - 1 : e.key === 'ArrowDown' ? i + 1 : -1;
      if (j < 0 || j >= FORM.q.length) return;
      e.preventDefault();
      var t = FORM.q[i]; FORM.q[i] = FORM.q[j]; FORM.q[j] = t;
      picked = q.id;
      draw();
      var g = host.querySelector('[data-q="' + q.id + '"] .fb-grip');
      if (g) g.focus();
    };
    li.ondragover = function (e) {
      if ([].indexOf.call(e.dataTransfer.types, 'text/x-q') > -1) e.preventDefault();
    };
    li.ondrop = function (e) {
      e.preventDefault();
      var from = e.dataTransfer.getData('text/x-q');
      if (!from || from === q.id) return;
      var moved = at(from);
      FORM.q = FORM.q.filter(function (x) { return x.id !== from; });
      var k = FORM.q.indexOf(q);
      FORM.q.splice(k, 0, moved);
      picked = from;
      draw();
    };
    li.appendChild(grip);

    var body = el('div', 'fb-body');

    var top = el('div', 'fb-top');
    /* The card holds the edits you make while building — the wording, the
       kind, whether it is required, when it is asked. The rest of the
       question lives in the dialog that has always held it: the Kinyarwanda,
       and whether answering it opens a risk-of-harm case, which is not a
       thing to toggle past on the way to somewhere else. The number is the
       way in, because the number is what everything else calls it by. */
    var num = el('button', 'fb-n');
    num.type = 'button';
    num.textContent = String(i + 1);
    num.setAttribute('data-modal', 'qedit');
    num.setAttribute('data-tip', 'Open question ' + (i + 1) + ' in full');
    var input = el('input', 'fb-q');
    input.type = 'text';
    input.value = q.en;
    input.setAttribute('aria-label', 'Question ' + (i + 1));
    input.oninput = function () {
      q.en = input.value;
      /* The Kinyarwanda was written for the question as it was. Once the
         English moves it is behind, and the field is the last place that
         should find that out. */
      if (q.rw) q.stale = true;
      var state = li.querySelector('.fb-rw');
      if (state) {
        state.className = 'fb-rw' + (q.rw ? (q.stale ? ' is-stale' : '') : ' is-missing');
        state.textContent = rwLabel(q);
      }
      redrawPreview();
    };
    var kb = el('button', 'btn sec sm fb-kindbtn');
    kb.type = 'button';
    kb.innerHTML = '<svg aria-hidden="true"><use href="#' + kindOf(q.kind).icon + '"/></svg>'
      + kindOf(q.kind).label + '<span class="cv">▾</span>';
    kb.onclick = function (e) {
      e.stopPropagation();
      window.SugiraMenu.show(kb, KINDS.map(function (k) {
        return { label: k.label, selected: k.id === q.kind, onPick: function () {
          q.kind = k.id;
          if ((k.id === 'single' || k.id === 'multi' || k.id === 'check') && !q.opts) {
            q.opts = ['Option 1', 'Option 2'];
          }
          window.SugiraMenu.close();
          draw();
        } };
      }), { width: 200 });
    };
    top.appendChild(num);
    top.appendChild(input);
    top.appendChild(kb);
    body.appendChild(top);

    if (q.opts) {
      var o = el('input', 'fb-opts');
      o.type = 'text';
      o.value = q.opts.join(', ');
      o.setAttribute('aria-label', 'Answers offered for ' + q.en);
      o.onchange = function () {
        q.opts = o.value.split(',').map(function (s) { return s.trim(); })
          .filter(Boolean);
        redrawPreview();
      };
      body.appendChild(o);
    }

    var foot = el('div', 'fb-foot');

    var req = el('label', 'fb-sw');
    var cb = el('input');
    cb.type = 'checkbox';
    cb.checked = !!q.req;
    cb.onchange = function () { q.req = cb.checked; redrawPreview(); };
    req.appendChild(cb);
    req.appendChild(el('span', null, 'Required'));
    foot.appendChild(req);

    /* The two things this programme does with a question that ClickUp's form
       has no equivalent for: ask it only sometimes, and open a case. */
    var cond = el('button', 'fb-link');
    cond.type = 'button';
    cond.textContent = q.when
      ? 'Shows when ' + (FORM.q.indexOf(at(q.when.q)) + 1) + ' is ' + q.when.is
      : 'Always asked';
    cond.classList.toggle('on', !!q.when);
    cond.onclick = function (e) {
      e.stopPropagation();
      var rows = [{ label: 'Always asked', selected: !q.when, onPick: function () {
        delete q.when; window.SugiraMenu.close(); draw();
      } }];
      FORM.q.forEach(function (other, oi) {
        if (other.id === q.id || !other.opts) return;
        other.opts.forEach(function (v) {
          rows.push({
            label: 'When ' + (oi + 1) + ' is ' + v,
            selected: !!(q.when && q.when.q === other.id && q.when.is === v),
            onPick: function () {
              q.when = { q: other.id, is: v };
              window.SugiraMenu.close();
              draw();
            }
          });
        });
      });
      window.SugiraMenu.show(cond, rows, { width: 260 });
    };
    foot.appendChild(cond);

    if (q.opens) {
      var c = el('span', 'chip bad');
      c.setAttribute('data-tip', 'Answered Yego, this opens a risk-of-harm case '
        + 'and sends it to the sector supervisor with a 72-hour review window.');
      c.innerHTML = '<i></i>Opens a case';
      foot.appendChild(c);
    }

    var rwState = el('span', 'fb-rw' + (q.rw ? (q.stale ? ' is-stale' : '') : ' is-missing'));
    rwState.textContent = rwLabel(q);
    rwState.setAttribute('data-tip', q.rw
      ? 'On the tablet this reads “' + q.rw + '”. The Translate tab is '
        + 'where it is written.'
      : 'Until this is translated the tablet shows the English. The Translate '
        + 'tab is where it is written.');
    foot.appendChild(rwState);

    body.appendChild(foot);
    li.appendChild(body);

    var del = el('button', 'fb-del');
    del.type = 'button';
    del.setAttribute('aria-label', 'Remove ' + q.en);
    del.innerHTML = '<svg aria-hidden="true"><use href="#i-cross"/></svg>';
    del.onclick = function (e) {
      e.stopPropagation();
      /* A question other questions depend on cannot quietly take them with
         it; the ones that asked about it are told to stand on their own. */
      FORM.q.forEach(function (x) { if (x.when && x.when.q === q.id) delete x.when; });
      FORM.q = FORM.q.filter(function (x) { return x.id !== q.id; });
      if (picked === q.id) picked = null;
      draw();
    };
    li.appendChild(del);
    return li;
  }

  function canvas() {
    var pane = el('div', 'fb-pane fb-form');
    var h = el('div', 'fb-h');
    h.appendChild(el('h3', null, FORM.name));
    var n = el('span', 'fb-count');
    var req = FORM.q.filter(function (q) { return q.req; }).length;
    n.textContent = FORM.q.length + ' questions · ' + req + ' required';
    h.appendChild(n);
    pane.appendChild(h);

    var ol = el('ol', 'fb-list');
    ol.setAttribute('aria-label', 'The questions in this form');
    FORM.q.forEach(function (q, i) { ol.appendChild(card(q, i)); });
    pane.appendChild(ol);
    return pane;
  }

  /* ---- what the home visitor will see, down the right ---- */
  function preview() {
    var pane = el('div', 'fb-pane fb-prev');
    var h = el('div', 'fb-h');
    h.appendChild(el('h3', null, 'On the tablet'));
    h.appendChild(langSeg());
    pane.appendChild(h);

    var dev = el('div', 'fb-dev');
    dev.id = 'fb-dev';
    pane.appendChild(dev);
    return pane;
  }

  /* The tablet works in Kinyarwanda, so that is what the preview opens on.
     But editing the English and watching nothing move is its own kind of
     wrong — and it hides the thing that just became true: the Kinyarwanda now
     says something the English no longer does. Both, then. The switch shows
     the other language, and a question whose English has moved says that its
     Kinyarwanda is behind. */
  var lang = 'rw';
  function langSeg() {
    var seg = el('span', 'seg fb-seg');
    [['rw', 'Kinyarwanda'], ['en', 'English']].forEach(function (pair) {
      var b = el('button', lang === pair[0] ? 'on' : null, pair[1]);
      b.type = 'button';
      b.onclick = function () { lang = pair[0]; draw(); };
      seg.appendChild(b);
    });
    return seg;
  }

  function paintPreview() {
    var dev = document.getElementById('fb-dev');
    if (!dev) return;
    dev.innerHTML = '';
    dev.appendChild(el('p', 'fb-dev-t', lang === 'rw' ? (FORM.rw || FORM.name) : FORM.name));

    FORM.q.forEach(function (q, i) {
      var box = el('div', 'fb-dq' + (picked === q.id ? ' on' : '')
        + (q.when ? ' is-when' : ''));
      box.setAttribute('data-q', q.id);
      var label = el('p', 'fb-dq-l');
      label.textContent = (i + 1) + '. ' + (lang === 'rw' ? (q.rw || q.en) : q.en);
      if (q.req) {
        var star = el('span', 'fb-req');
        star.textContent = '*';
        star.setAttribute('data-tip', 'Must be answered before the form can be sent');
        label.appendChild(star);
      }
      box.appendChild(label);

      if (q.when) {
        var w = el('p', 'fb-dq-w');
        w.textContent = 'Only asked when ' + (FORM.q.indexOf(at(q.when.q)) + 1)
          + ' is “' + q.when.is + '”';
        box.appendChild(w);
      }
      /* Showing the Kinyarwanda is showing what the field will read. If the
         English has moved on, this is the sentence they will actually get,
         and the gap is worth naming here rather than on another screen. */
      if (lang === 'rw' && q.stale) {
        var st = el('p', 'fb-dq-w is-stale');
        st.textContent = 'Written for an earlier wording of this question';
        box.appendChild(st);
      }

      box.appendChild(control(q));
      dev.appendChild(box);
    });

    var f = el('div', 'fb-dev-f');
    f.appendChild(el('button', 'btn sec sm', 'Subira inyuma'));
    var ok = el('button', 'btn sm', 'Ohereza');
    f.appendChild(ok);
    dev.appendChild(f);

    if (picked) {
      var on = dev.querySelector('.fb-dq.on');
      if (on && on.scrollIntoView) on.scrollIntoView({ block: 'nearest' });
    }
  }

  /* One control per kind, drawn the way the tablet draws it. */
  function control(q) {
    var k = q.kind;
    if (k === 'yesno' || k === 'single') {
      var list = el('div', 'fb-dq-opts');
      (q.opts || ['Yego', 'Oya']).forEach(function (o) {
        list.appendChild(el('span', 'fb-dq-o', o));
      });
      return list;
    }
    if (k === 'multi' || k === 'check') {
      var box = el('div', 'fb-dq-opts');
      (q.opts || []).forEach(function (o) {
        var row = el('span', 'fb-dq-o fb-dq-tick');
        row.appendChild(el('span', 'fb-tick'));
        row.appendChild(el('span', null, o));
        box.appendChild(row);
      });
      return box;
    }
    var field = el('div', 'fb-dq-in' + (k === 'long' ? ' tall' : ''));
    field.textContent = k === 'number' ? '0' : k === 'date' ? 'dd / mm / yyyy' : '';
    return field;
  }

  function redrawPreview() { paintPreview(); }

  function select(id) {
    if (picked === id || !host) return;
    picked = id;
    [].forEach.call(host.querySelectorAll('.fb-f'), function (c) {
      c.classList.toggle('on', c.getAttribute('data-q') === id);
    });
    [].forEach.call(host.querySelectorAll('.fb-dq'), function (d) {
      var on = d.getAttribute('data-q') === id;
      d.classList.toggle('on', on);
      if (on && d.scrollIntoView) d.scrollIntoView({ block: 'nearest' });
    });
  }

  function draw() {
    if (!host) return;
    host.innerHTML = '';
    host.appendChild(palette());
    host.appendChild(canvas());
    host.appendChild(preview());
    paintPreview();
    if (window.SugiraMenu) window.SugiraMenu.enhance(host);
  }

  function init() {
    host = document.getElementById('fbuild');
    if (!host) return;
    draw();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else init();

  window.SugiraBuilder = { form: FORM, draw: draw };
})();
