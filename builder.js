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
  /* ---- conditions -------------------------------------------------------
     "Give them flexibility of building a form, including conditions that are
     somehow heavy." One clause reading "is" is not heavy; it is the easiest
     case of the thing he asked for.

     The app already has a grammar for a rule over answers — the list filter,
     field then condition then value, joined by all or any, built from the
     same recording. A condition on a question is the same idea applied to an
     answer instead of a column, so it is the same grammar, the same words
     and the same row geometry. Learning it once should be enough.

     Which conditions are offered depends on what is being asked about: you
     can ask whether a number is more than something, and you cannot ask that
     of a checklist. */
  var OPS = {
    choice: [['is', 'is'], ['not', 'is not']],
    number: [['is', 'is'], ['not', 'is not'], ['gt', 'is more than'], ['lt', 'is less than']],
    text:   [['is', 'is'], ['not', 'is not'], ['has', 'contains'], ['empty', 'is empty']],
    date:   [['is', 'is'], ['not', 'is not']]
  };
  function opsFor(q) {
    if (!q) return OPS.text;
    if (q.kind === 'number') return OPS.number;
    if (q.kind === 'date') return OPS.date;
    if (q.opts) return OPS.choice;
    return OPS.text;
  }
  function opLabel(q, op) {
    var found = opsFor(q).filter(function (o) { return o[0] === op; })[0];
    return found ? found[1] : 'is';
  }

  /* The old shape was { q, is }. Read it as one clause so a form written
     before this still means what it meant. */
  function rules(q) {
    if (!q.when) return [];
    if (q.when.rules) return q.when.rules;
    return [{ q: q.when.q, op: 'is', v: q.when.is }];
  }
  /* A clause with nothing in its value governs nothing — the same rule the
     list filter follows, so a half-written condition does not start hiding
     questions while somebody is still typing it. */
  function ready(r) { return r.op === 'empty' || (r.v !== '' && r.v != null); }
  function live(q) { return rules(q).filter(ready); }
  function match(q) { return (q.when && q.when.match) || 'all'; }
  function setWhen(q, rs, m) {
    if (!rs.length) delete q.when;
    else q.when = { match: m || match(q), rules: rs };
  }

  /* What the card and the tablet both say, in one sentence. */
  /* `building` adds what only the person building needs to know. The tablet
     column shows what the visitor will see, and a visitor never sees a count
     of clauses somebody has not finished writing. */
  function whenText(q, prefix, building) {
    var rs = live(q);
    var waiting = building ? rules(q).length - rs.length : 0;
    var tail = waiting ? ' · ' + waiting + ' unfinished' : '';
    if (!rs.length) return 'Always asked' + tail;
    var join = ' ' + (match(q) === 'any' ? 'or' : 'and') + ' ';
    return prefix + rs.map(function (r) {
      var on = at(r.q);
      var n = FORM.q.indexOf(on) + 1;
      if (r.op === 'empty') return n + ' is empty';
      return n + ' ' + opLabel(on, r.op) + ' ' + (r.v || '…');
    }).join(join) + tail;
  }

  /* A clause that points at a question asked later can never be true. */
  function tooLate(q, i) {
    return live(q).filter(function (r) {
      return FORM.q.indexOf(at(r.q)) >= i;
    });
  }

  /* The panel, in the filter's own clothes: a head saying what it governs,
     all/any when there is more than one clause, then the rows — question,
     condition, value — and a way to add another. */
  function whenPanel(pop, q, i) {
    function redraw() { pop.innerHTML = ''; body(); }
    function body() {
      var head = el('div', 'qpop-h');
      head.appendChild(el('span', null, 'Ask question ' + (i + 1) + ' when'));
      pop.appendChild(head);

      var rs = rules(q).slice();
      var earlier = FORM.q.slice(0, i);

      if (!earlier.length) {
        pop.appendChild(el('p', 'mhint', 'Nothing is asked before this one, so '
          + 'there is no answer to depend on.'));
        return;
      }

      if (rs.length > 1) {
        var m = el('div', 'qmatch');
        [['all', 'All of these'], ['any', 'Any of these']].forEach(function (o) {
          var bn = el('button', 'qmatch-b' + (match(q) === o[0] ? ' on' : ''), o[1]);
          bn.type = 'button';
          bn.onclick = function () { setWhen(q, rs, o[0]); changed(); redraw(); echoCard(); };
          m.appendChild(bn);
        });
        pop.appendChild(m);
      }

      rs.forEach(function (r, ri) {
        var row = el('div', 'qrow');

        var qs = el('select', 'qf-col');
        qs.setAttribute('aria-label', 'Which question');
        earlier.forEach(function (other, oi) {
          var o = el('option', null, (oi + 1) + '. ' + other.en);
          o.value = other.id;
          if (other.id === r.q) o.selected = true;
          qs.appendChild(o);
        });
        qs.onchange = function () {
          r.q = qs.value;
          r.v = '';
          setWhen(q, rs);
          changed();
          redraw();
          echoCard();
        };
        row.appendChild(qs);

        var on = at(r.q);
        var os = el('select', 'qf-op');
        os.setAttribute('aria-label', 'Condition');
        opsFor(on).forEach(function (pair) {
          var o = el('option', null, pair[1]);
          o.value = pair[0];
          if (pair[0] === r.op) o.selected = true;
          os.appendChild(o);
        });
        os.onchange = function () {
          r.op = os.value;
          setWhen(q, rs);
          changed();
          redraw();
          echoCard();
        };
        row.appendChild(os);

        var val = el('span', 'qf-val');
        if (r.op !== 'empty') {
          var input;
          if (on && on.opts) {
            input = el('select');
            on.opts.forEach(function (v) {
              var o = el('option', null, v);
              if (v === r.v) o.selected = true;
              input.appendChild(o);
            });
            if (!r.v) r.v = on.opts[0];
          } else {
            input = el('input');
            input.type = on && on.kind === 'number' ? 'number' : 'text';
            input.value = r.v || '';
          }
          input.setAttribute('aria-label', 'Answer');
          input.onchange = function () {
            r.v = input.value;
            setWhen(q, rs);
            changed();
            echoCard();
          };
          val.appendChild(input);
        }
        row.appendChild(val);

        var x = el('button', 'qf-x');
        x.type = 'button';
        x.setAttribute('aria-label', 'Remove this condition');
        x.innerHTML = '<svg aria-hidden="true"><use href="#i-cross"/></svg>';
        x.onclick = function () {
          rs.splice(ri, 1);
          setWhen(q, rs);
          changed();
          redraw();
          echoCard();
        };
        row.appendChild(x);
        pop.appendChild(row);
      });

      var add = el('button', 'qadd');
      add.type = 'button';
      add.innerHTML = '<svg aria-hidden="true"><use href="#i-plus"/></svg>'
        + (rs.length ? 'And another' : 'Only ask it sometimes');
      add.onclick = function () {
        /* Default to a question this rule is not already about. "7 is Yego
           and 7 is Yego" is a clause that says nothing, and it is what you
           get every time if the default is simply the nearest one. */
        var used = rs.map(function (r) { return r.q; });
        var free = earlier.filter(function (o) { return used.indexOf(o.id) < 0; });
        var first = (free.length ? free : earlier)[(free.length ? free : earlier).length - 1];
        rs.push({ q: first.id, op: 'is', v: first.opts ? first.opts[0] : '' });
        setWhen(q, rs);
        changed();
        redraw();
        echoCard();
      };
      pop.appendChild(add);

      if (rs.length) {
        var clear = el('button', 'qf-clear');
        clear.type = 'button';
        clear.textContent = 'Always ask it';
        clear.onclick = function () {
          setWhen(q, []);
          changed();
          redraw();
          echoCard();
        };
        pop.appendChild(clear);
      }
      if (window.SugiraMenu) window.SugiraMenu.enhance(pop);
    }

    /* The card and the tablet follow while the panel stays open, so you can
       see the sentence change as you build it. */
    function echoCard() {
      var card = host.querySelector('.fb-f[data-q="' + q.id + '"]');
      if (card) {
        var link = card.querySelector('.fb-link');
        var late = tooLate(q, FORM.q.indexOf(q));
        link.textContent = whenText(q, 'Shows when ', true);
        link.classList.toggle('on', !!q.when && !late.length);
        link.classList.toggle('is-broken', late.length > 0);
        card.classList.toggle('is-broken', late.length > 0 || card.querySelector('.fb-bad'));
      }
      paintPreview();
    }

    body();
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
        changed();
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
    /* Dropping used to put the card before the one you dropped on, which is a
       fine rule and an invisible one: you let go on question 3 and it landed
       at 2. The line says where it is going while you can still change your
       mind, and which side of the card you are on decides it. */
    function side(e) {
      var r = li.getBoundingClientRect();
      return (e.clientY - r.top) < r.height / 2 ? 'before' : 'after';
    }
    li.ondragover = function (e) {
      if ([].indexOf.call(e.dataTransfer.types, 'text/x-q') < 0) return;
      e.preventDefault();
      var s = side(e);
      li.classList.toggle('is-over-top', s === 'before');
      li.classList.toggle('is-over-bottom', s === 'after');
    };
    li.ondragleave = function () {
      li.classList.remove('is-over-top', 'is-over-bottom');
    };
    li.ondrop = function (e) {
      e.preventDefault();
      li.classList.remove('is-over-top', 'is-over-bottom');
      var from = e.dataTransfer.getData('text/x-q');
      if (!from || from === q.id) return;
      var s = side(e);
      var moved = at(from);
      FORM.q = FORM.q.filter(function (x) { return x.id !== from; });
      var k = FORM.q.indexOf(q) + (s === 'after' ? 1 : 0);
      FORM.q.splice(k, 0, moved);
      picked = from;
      changed();
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
      if (!q.touched) { q.touched = true; changed(); }
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
          changed();
          draw();
        } };
      }), { width: 200 });
    };
    top.appendChild(num);
    top.appendChild(input);
    top.appendChild(kb);
    body.appendChild(top);

    /* A choice question with nothing to choose from is a question the field
       cannot answer, and the tablet would draw it as an empty space with a
       Next button under it. */
    var needsOpts = q.kind === 'single' || q.kind === 'multi' || q.kind === 'check'
      || q.kind === 'yesno';
    var noOpts = needsOpts && (!q.opts || !q.opts.length);
    if (noOpts) li.classList.add('is-broken');

    if (q.opts || needsOpts) {
      var o = el('input', 'fb-opts');
      o.type = 'text';
      o.value = (q.opts || []).join(', ');
      o.placeholder = 'Separate each answer with a comma';
      o.setAttribute('aria-label', 'Answers offered for ' + q.en);
      o.onchange = function () {
        q.opts = o.value.split(',').map(function (s) { return s.trim(); })
          .filter(Boolean);
        changed();
        draw();
      };
      body.appendChild(o);
    }

    var foot = el('div', 'fb-foot');

    var req = el('label', 'fb-sw');
    var cb = el('input');
    cb.type = 'checkbox';
    cb.checked = !!q.req;
    cb.onchange = function () { q.req = cb.checked; changed(); redrawPreview(); };
    req.appendChild(cb);
    req.appendChild(el('span', null, 'Required'));
    foot.appendChild(req);

    /* The two things this programme does with a question that ClickUp's form
       has no equivalent for: ask it only sometimes, and open a case. */
    var late = tooLate(q, i);
    var broken = late.length > 0;
    var cond = el('button', 'fb-link');
    cond.type = 'button';
    cond.setAttribute('aria-haspopup', 'dialog');
    cond.setAttribute('aria-expanded', 'false');
    cond.textContent = whenText(q, 'Shows when ', true);
    cond.classList.toggle('on', !!q.when && !broken);
    cond.classList.toggle('is-broken', broken);
    cond.onclick = function (e) {
      e.stopPropagation();
      window.SugiraPop.open(cond, function (pop) { whenPanel(pop, q, i); },
        { cls: 'wide', label: 'When question ' + (i + 1) + ' is asked' });
    };
    foot.appendChild(cond);

    /* Reordering is free while you build, so a move can put a question above
       the one it needs. That is not a move to refuse — it is a state to name,
       because the person who made it is the person who can fix it. */
    if (noOpts) {
      var none = el('span', 'fb-bad');
      none.setAttribute('data-tip', 'A ' + kindOf(q.kind).label.toLowerCase()
        + ' question needs something to choose from. As it stands the tablet '
        + 'would show the question with nothing under it.');
      none.innerHTML = '<svg aria-hidden="true"><use href="#i-alert"/></svg>'
        + 'No answers to choose from';
      foot.appendChild(none);
    }

    if (broken) {
      li.classList.add('is-broken');
      var ns = late.map(function (r) { return FORM.q.indexOf(at(r.q)) + 1; });
      var bad = el('span', 'fb-bad');
      bad.setAttribute('data-tip', 'The tablet asks one question at a time, in '
        + 'order. This one is asked at ' + (i + 1) + ', before ' + ns.join(' and ')
        + ' ' + (ns.length > 1 ? 'have' : 'has')
        + ' been answered, so the condition can never be true and the question '
        + 'would never appear. Move it below ' + Math.max.apply(null, ns)
        + ', or point it at something asked earlier.');
      bad.innerHTML = '<svg aria-hidden="true"><use href="#i-alert"/></svg>'
        + 'Asked before ' + ns.join(' and ');
      foot.appendChild(bad);
    }

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
      FORM.q.forEach(function (x) {
        if (!x.when) return;
        var keep = rules(x).filter(function (r) { return r.q !== q.id; });
        setWhen(x, keep);
      });
      FORM.q = FORM.q.filter(function (x) { return x.id !== q.id; });
      if (picked === q.id) picked = null;
      changed();
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

    if (!FORM.q.length) {
      /* A form with nothing in it is not an error, it is the start. It says
         what to do next and points at the only thing that can do it. */
      var none = el('div', 'fb-empty');
      none.appendChild(el('p', 'fb-empty-t', 'No questions yet'));
      none.appendChild(el('p', 'fb-empty-s',
        'Pick a kind on the left and it joins the form here.'));
      pane.appendChild(none);
      return pane;
    }
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
    /* "On the tablet" was a promise this column does not keep: the tablet
       asks one question at a time, and this shows all of them at once —
       which is what you want while building, because checking question
       thirty should not cost thirty taps. So it says what it is, and the
       tab that does walk it one at a time is named in the mark. */
    var ttl = el('h3', null, 'How it will read');
    var help = el('button', 'ihelp');
    help.type = 'button';
    help.setAttribute('aria-label', 'What this is');
    help.setAttribute('data-tip', 'Every question at once, in the language the '
      + 'field works in, so you can see the whole shape while you build. The '
      + 'tablet itself asks one at a time; the Preview tab walks it that way.');
    help.innerHTML = '<svg aria-hidden="true"><use href="#i-info"/></svg>';
    ttl.appendChild(help);
    h.appendChild(ttl);
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
    if (!FORM.q.length) {
      dev.appendChild(el('p', 'fb-dq-w', 'Nothing to ask yet.'));
      return;
    }

    FORM.q.forEach(function (q, i) {
      var box = el('div', 'fb-dq' + (picked === q.id ? ' on' : '')
        + (live(q).length ? ' is-when' : ''));
      box.setAttribute('data-q', q.id);
      /* The preview is the column you scan, so it is where you notice the
         thing that is wrong. Noticing it and being unable to touch it makes
         you hunt for the same question in the other column. */
      box.setAttribute('role', 'button');
      box.tabIndex = 0;
      /* No aria-label: it would replace the question with "Work on question
         4", and the question is the thing somebody is here to read. The
         content is the name. */
      box.onclick = function () { select(q.id, true); };
      box.onkeydown = function (e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        select(q.id, true);
      };
      var label = el('p', 'fb-dq-l');
      label.textContent = (i + 1) + '. ' + (lang === 'rw' ? (q.rw || q.en) : q.en);
      if (q.req) {
        var star = el('span', 'fb-req');
        star.textContent = '*';
        star.setAttribute('data-tip', 'Must be answered before the form can be sent');
        label.appendChild(star);
      }
      box.appendChild(label);

      if (live(q).length) {
        var late = tooLate(q, i);
        var w = el('p', 'fb-dq-w' + (late.length ? ' is-broken' : ''));
        w.textContent = late.length
          ? 'Never asked — ' + late.map(function (r) {
            return FORM.q.indexOf(at(r.q)) + 1;
          }).join(' and ') + ' not answered yet'
          : whenText(q, 'Only asked when ');
        box.appendChild(w);
        if (late.length) box.classList.add('is-broken');
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

  function redrawPreview() { paintPreview(); echo(); }

  /* The screen says the same thing about this form in three places: the
     record at the top, the card under the builder, and the builder itself.
     They were three numbers, and only one of them moved when you changed the
     form. One is the truth — the form as it now stands — and the other two
     read it. */
  var edits = 0;
  function echo() {
    var n = FORM.q.length;
    var req = FORM.q.filter(function (q) { return q.req; }).length;

    var count = document.querySelector('#fbuild .fb-count');
    if (count) count.textContent = n + ' questions · ' + req + ' required';

    var kv = document.querySelectorAll('#s-form [data-panelid="build"] .kv > div');
    [].forEach.call(kv, function (d) {
      var k = (d.querySelector('.k') || {}).textContent;
      if (k === 'Questions') d.querySelector('.v').textContent = String(n);
      if (k === 'Required') d.querySelector('.v').textContent = String(req);
    });

    [].forEach.call(document.querySelectorAll('#pg-form .pgr'), function (r) {
      var k = r.querySelector('.k span:last-child');
      if (!k || k.textContent.trim() !== 'Questions') return;
      r.querySelector('.v').innerHTML = n + ' <span class="chip">' + req + ' required</span>';
    });

    /* A form on a tablet is the version that was published, not the one being
       edited. Saying "Published: Yes" while somebody rewrites it is the app
       telling the field something that is about to stop being true. */
    if (!edits) return;
    [].forEach.call(document.querySelectorAll('#s-form .fld'), function (f) {
      var k = f.querySelector('.fld-k');
      if (!k || k.textContent.indexOf('Published to the tablet') < 0) return;
      var v = f.querySelector('.v');
      if (!v || v.querySelector('.fb-unsent')) return;
      var note = el('span', 'fb-unsent');
      note.textContent = ' · ' + edits + (edits === 1 ? ' change' : ' changes')
        + ' not sent';
      note.setAttribute('data-tip', 'The tablet still has version 4. What you are '
        + 'editing reaches the field when you publish.');
      v.appendChild(note);
    });
    var btn = document.querySelector('#s-form [data-modal="fpublish"]');
    if (btn && !/\d/.test(btn.textContent)) {
      btn.appendChild(el('span', 'n', String(edits)));
    } else if (btn) {
      var n2 = btn.querySelector('.n');
      if (n2) n2.textContent = String(edits);
    }
  }
  function changed() { edits++; echo(); }

  /* `toCard` is set when the choosing happened in the preview, so the scroll
     goes the other way: there, you are pointing at something you want to
     change, and the card is what changes it. */
  function select(id, toCard) {
    if (!host) return;
    picked = id;
    [].forEach.call(host.querySelectorAll('.fb-f'), function (c) {
      var on = c.getAttribute('data-q') === id;
      c.classList.toggle('on', on);
      if (on && toCard && c.scrollIntoView) c.scrollIntoView({ block: 'nearest' });
    });
    [].forEach.call(host.querySelectorAll('.fb-dq'), function (d) {
      var on = d.getAttribute('data-q') === id;
      d.classList.toggle('on', on);
      if (on && !toCard && d.scrollIntoView) d.scrollIntoView({ block: 'nearest' });
    });
    if (toCard) {
      var q = host.querySelector('.fb-f.on .fb-q');
      if (q) q.focus();
    }
  }

  function draw() {
    if (!host) return;
    host.innerHTML = '';
    host.appendChild(palette());
    host.appendChild(canvas());
    host.appendChild(preview());
    paintPreview();
    /* At load as well as after a change: the card and the record were written
       for a thirty-question form and the builder holds ten, so the screen was
       wrong before anybody touched it. */
    echo();
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
