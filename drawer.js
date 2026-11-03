/* The drawer's second pane.

   Measured off the task view (specs/task-view.md): two panes, the record on
   white and, beside it, a 560-wide column on the subtle ground carrying what
   happened to the record and what it is tied to. Its header is 49 tall with
   the pane's name at 14/600; the stream is 12px tertiary system events, each
   with a dot and a right-aligned timestamp; the composer is docked at the
   bottom, white, 1px border.default, radius 10, on elevation-1.

   Left out as not practical here: the AI banner, the floating mini-rail, the
   Brain button and the @-mention composer toolbar. They are ClickUp's
   product, not this one's.

   The record's own markup is never touched — the drawer moves the real screen
   in and puts it back — so this pane builds itself from its own data and from
   the relations map. */
(function () {
  'use strict';

  /* What has happened to each record. Short, dated, and in the programme's
     own vocabulary rather than a generic audit line. */
  var ACTIVITY = {
    household: [
      ['M. Dusabe', 'raised a risk-of-harm flag at the Session 6 visit', '28 Oct'],
      ['M. Dusabe', 'recorded Session 6 as delivered — 42 minutes', '28 Oct'],
      ['System', 'moved this household to behind schedule after a second missed visit', '14 Oct'],
      ['M. Dusabe', 'recorded Session 4 as delivered — 51 minutes', '30 Sep'],
      ['C. Uwimana', 'enrolled this household in Cohort 1', '12 Jun']
    ],
    'case': [
      ['System', 'escalated to the district lead — still unreviewed after 24 hours', '31 Oct'],
      ['System', 'escalated to the district lead on the 72-hour breach', '31 Oct'],
      ['C. Uwimana', 'declined P. Habimana’s request to open this case in full', '30 Oct'],
      ['P. Habimana', 'asked to open this case in full — monthly safeguarding summary', '30 Oct'],
      ['M. Dusabe', 'raised this flag at Session 6, question 5', '28 Oct']
    ],
    project: [
      ['A. Gahimana', 'published a new version of the Visit record form', '2 Nov'],
      ['M&E team', 'changed the interval between sessions to two weeks', '21 Oct'],
      ['A. Gahimana', 'added Cohort 2', '4 Sep']
    ],
    module: [
      ['A. Gahimana', 'published the Visit record form to the tablet', '2 Nov'],
      ['System', 'rescheduled 986 households after the interval changed', '21 Oct']
    ],
    form: [
      ['A. Gahimana', 'published version 4 to the tablet', '2 Nov'],
      ['T. Mukamana', 'completed the Kinyarwanda translation', '28 Oct'],
      ['A. Gahimana', 'added question 5 — opens a risk-of-harm case', '14 Oct']
    ],
    person: [
      ['A. Gahimana', 'granted an exception: delete a risk-of-harm case', '1 Nov'],
      ['System', 'recorded a refused attempt to open a case in Nyanza', '29 Oct'],
      ['A. Gahimana', 'gave this person the Sector lead position at Kibungo', '3 Sep']
    ]
  };
  ACTIVITY.profile = ACTIVITY.person;
  ACTIVITY.role = [
    ['A. Gahimana', 'granted this position Change on risk-of-harm cases', '1 Nov'],
    ['A. Gahimana', 'gave this position to T. Mukamana at Rubavu', '12 Oct']
  ];

  var side = null;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function stream(rows) {
    var list = el('div', 'dws-stream');
    if (!rows || !rows.length) {
      list.appendChild(empty('No activity yet',
        'What anyone does to this record is recorded here, with who and when.'));
      return list;
    }
    rows.forEach(function (r) {
      var line = el('div', 'dws-ev');
      line.appendChild(el('span', 'dws-dot'));
      var t = el('span', 'dws-t');
      t.appendChild(el('b', null, r[0]));
      t.appendChild(document.createTextNode(' ' + r[1]));
      line.appendChild(t);
      line.appendChild(el('span', 'dws-w', r[2]));
      list.appendChild(line);
    });
    return list;
  }

  function empty(title, what) {
    var e = el('div', 'dws-empty');
    var sq = el('span', 'dws-sq');
    sq.innerHTML = '<svg aria-hidden="true"><use href="#i-relation"/></svg>';
    e.appendChild(sq);
    e.appendChild(el('p', 'dws-et', title));
    e.appendChild(el('p', 'dws-ed', what));
    return e;
  }

  function relations(key) {
    var data = (window.SUGIRA_RELATIONS || {})[key];
    var wrap = el('div', 'dws-rel');
    if (!data) {
      wrap.appendChild(empty('No relations recorded',
        'What this record belongs to, and where it gets used, would show here.'));
      return wrap;
    }
    var seg = el('div', 'seg dws-seg');
    var body = el('div', 'dws-rels');
    [['Relationships', data.rel], ['References', data.ref]].forEach(function (pair, i) {
      var b = el('button', i === 0 ? 'on' : null, pair[0]);
      b.type = 'button';
      b.onclick = function () {
        Array.prototype.forEach.call(seg.children, function (c, j) {
          c.classList.toggle('on', j === i);
        });
        fill(pair[1]);
      };
      seg.appendChild(b);
    });
    function fill(items) {
      body.innerHTML = '';
      items.forEach(function (it) {
        var b = el('button', 'dws-r');
        b.type = 'button';
        b.setAttribute('data-go', it[3]);
        var ic = el('span', 'dws-ri');
        ic.innerHTML = '<svg aria-hidden="true"><use href="#' + it[1] + '"/></svg>';
        b.appendChild(ic);
        var m = el('span', 'dws-rm');
        m.appendChild(el('span', 'dws-rk', it[0]));
        m.appendChild(el('span', 'dws-rn', it[2]));
        b.appendChild(m);
        body.appendChild(b);
      });
    }
    fill(data.rel);
    wrap.appendChild(seg);
    wrap.appendChild(body);
    return wrap;
  }

  function composer() {
    var c = el('form', 'dws-comp');
    c.onsubmit = function (e) { e.preventDefault(); };
    var ta = document.createElement('textarea');
    ta.className = 'dws-in';
    ta.rows = 1;
    ta.placeholder = 'Write a comment…';
    ta.setAttribute('aria-label', 'Write a comment');
    ta.oninput = function () {
      ta.style.height = 'auto';
      ta.style.height = Math.min(120, ta.scrollHeight) + 'px';
      send.disabled = !ta.value.trim();
    };
    var bar = el('div', 'dws-bar');
    var send = el('button', 'btn sm', 'Comment');
    send.type = 'submit';
    send.disabled = true;
    send.onclick = function (e) {
      e.preventDefault();
      if (!ta.value.trim()) return;
      var line = el('div', 'dws-ev dws-mine');
      line.appendChild(el('span', 'dws-dot'));
      var t = el('span', 'dws-t');
      t.appendChild(el('b', null, 'A. Gahimana'));
      t.appendChild(document.createTextNode(' ' + ta.value.trim()));
      line.appendChild(t);
      line.appendChild(el('span', 'dws-w', 'just now'));
      var s = side.querySelector('.dws-stream');
      if (s) s.insertBefore(line, s.firstChild);
      ta.value = '';
      ta.style.height = 'auto';
      send.disabled = true;
    };
    bar.appendChild(send);
    c.appendChild(ta);
    c.appendChild(bar);
    return c;
  }

  /* The panel is switched from a rail of 28px buttons at the top right of
     the record, not from tabs at the head of the panel — TaskModal puts them
     there, and the first of them collapses the panel away, which is what
     makes a 980 drawer workable on a laptop. */
  var PANELS = [
    ['activity', 'Activity', 'i-message', function (key) { return stream(ACTIVITY[key]); }],
    ['related', 'Related', 'i-relation', function (key) { return relations(key); }]
  ];

  function render(key) {
    side = document.getElementById('dwSide');
    var body_ = document.getElementById('dwBody');
    if (!side || !body_) return;
    side.innerHTML = '';

    var head = el('div', 'dws-head');
    var title = el('span', 'dws-title');
    head.appendChild(title);
    side.appendChild(head);
    var body = el('div', 'dws-body');
    side.appendChild(body);
    var foot = el('div', 'dws-foot');
    foot.appendChild(composer());
    side.appendChild(foot);

    var at = 'activity';
    function show(id) {
      at = id;
      var pane = PANELS.filter(function (p) { return p[0] === id; })[0];
      title.textContent = pane[1];
      body.innerHTML = '';
      body.appendChild(pane[3](key));
      foot.hidden = id !== 'activity';
      side.hidden = false;
      Array.prototype.forEach.call(rail.children, function (b) {
        if (b.dataset.panel) b.setAttribute('aria-pressed', String(b.dataset.panel === id));
      });
      collapse.setAttribute('aria-label', 'Collapse the panel');
      collapse.classList.remove('shut');
    }

    var old = body_.querySelector('.dws-rail');
    if (old) old.remove();
    var rail = el('nav', 'dws-rail');
    rail.setAttribute('aria-label', 'Record panels');

    var collapse = el('button', 'dws-rb');
    collapse.type = 'button';
    collapse.setAttribute('aria-label', 'Collapse the panel');
    collapse.innerHTML = '<svg aria-hidden="true"><use href="#i-chevronRight"/></svg>';
    collapse.onclick = function () {
      var shut = !side.hidden;
      side.hidden = shut;
      collapse.classList.toggle('shut', shut);
      collapse.setAttribute('aria-label', shut ? 'Show the panel' : 'Collapse the panel');
    };
    rail.appendChild(collapse);

    PANELS.forEach(function (pane) {
      var b = el('button', 'dws-rb');
      b.type = 'button';
      b.dataset.panel = pane[0];
      b.setAttribute('aria-label', pane[1]);
      b.setAttribute('data-tip', pane[1]);
      b.setAttribute('aria-pressed', String(pane[0] === at));
      if (pane[2] === 'i-relation') b.classList.add('fill');
      b.innerHTML = '<svg aria-hidden="true"><use href="#' + pane[2] + '"/></svg>';
      b.onclick = function () { show(pane[0]); };
      rail.appendChild(b);
    });
    body_.appendChild(rail);

    show('activity');
  }

  document.addEventListener('drawer:render', function (e) {
    try { render(e.detail.key); } catch (err) { /* the record still opens */ }
  });
})();
