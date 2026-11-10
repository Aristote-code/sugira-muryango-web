/* ---------------------------------------------------------------------------
   What a person holds.

   D2: "A person can hold more than one assignment. Small organisations double
   up. A sector supervisor who also coordinates a district is ordinary, and
   designing for one-role-only means the first such person breaks the model.
   People get a list of assignments, which renders as a single row when there
   is only one."

   The record did not have that list. It had a Position row, a Place row and a
   Projects row — one of each — which is the one-role-only model written into
   the furniture. The first person who covers a district while running their
   own sector has nowhere to be put, and the live system's answer to that is
   visible on this very screen: an *exception* called "Change — Reports",
   reason "Covering the district lead on leave". A whole job, expressed as one
   permission granted by name for six weeks.

   So the three rows become one. An assignment is a position, a place and the
   projects it covers, and a person holds a list of them.

   Why this file rather than markup: what someone can open and how far it
   reaches are both *per assignment*, so choosing one has to redraw two tabs.
   The access tree already reads its position from #accessTree's data-role,
   and already redraws on `drawer:render` — so switching assignment sets that
   attribute and fires that event, rather than growing a second renderer that
   could disagree with the first.
--------------------------------------------------------------------------- */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) {
    return Array.prototype.slice.call((r || document).querySelectorAll(s));
  };

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function svg(id, cls) {
    var n = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    if (cls) n.setAttribute('class', cls);
    n.setAttribute('aria-hidden', 'true');
    var u = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    u.setAttribute('href', '#' + id);
    n.appendChild(u);
    return n;
  }
  function group(x) { return String(x).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }

  /* ---- the assignments ----

     Two, because one teaches nothing: a list of one looks like a row with a
     longer label, and the whole point of D2 is what happens on the second.
     The second one here is the district cover that the live system could only
     express as a six-week exception.

     `position` is the name as permissions.js stores it, because that is what
     the access tree looks itself up by. */
  var ASSIGN = [
    {
      id: 'a-sla',
      position: 'Sugira Muryango Sector lead (SLA)',
      short: 'Sector lead',
      level: 'sector',
      place: 'Kibungo',
      district: 'Ngoma',
      province: 'Eastern Province',
      cells: ['Kabare cell', 'Rukira cell', 'Zaza cell'],
      projects: ['Household Module Tracking', 'Household Enrollment',
                 'Risk of Harm/other family problems Management'],
      since: '19 August 2026',
      until: null,
      why: 'Their own job',
      covers: [['Households', 184], ['IZU at Village', 11], ['Open cases', 2],
               ['Villages', 14]]
    },
    {
      id: 'a-dtl',
      position: 'Sugira Muryango District lead (DTL)',
      short: 'District lead',
      level: 'district',
      place: 'Ngoma',
      district: 'Ngoma',
      province: 'Eastern Province',
      cells: null,
      projects: ['Household Module Tracking'],
      since: '2 October 2026',
      until: '14 November 2026',
      why: 'Covering while the district lead is on leave',
      covers: [['Households', 564], ['IZU at Village', 98], ['Open cases', 2],
               ['Villages', 124]]
    }
  ];

  var pickedId = ASSIGN[0].id;
  function picked() {
    for (var i = 0; i < ASSIGN.length; i++) if (ASSIGN[i].id === pickedId) return ASSIGN[i];
    return ASSIGN[0];
  }

  /* An assignment that runs out says so, because the thing a reader most needs
     to know about a second assignment is whether it is permanent. */
  function endsIn(a) {
    if (!a.until) return null;
    return 'ends ' + a.until.replace(/ 20\d\d$/, '');
  }

  /* ---- the row on the record ---- */

  function fillRow() {
    $$('[data-person-assign]').forEach(function (slot) {
      slot.innerHTML = '';
      var row = slot.closest ? slot.closest('.pgr') : null;
      if (row) row.classList.toggle('is-empty', !ASSIGN.length);
      if (!ASSIGN.length) { slot.appendChild(el('span', 'empty', '—')); return; }
      ASSIGN.forEach(function (a) {
        var b = el('button', 'rel');
        b.type = 'button';
        b.setAttribute('data-go', 'permissions');
        b.setAttribute('data-perms', 'role');
        b.setAttribute('data-perms-role', a.position);
        b.setAttribute('data-tip', a.position + ' — ' + a.why);
        b.appendChild(svg('i-safeguarding', null));
        b.appendChild(document.createTextNode(a.short + ' · ' + a.place));
        slot.appendChild(b);
      });
      /* No end date here. It belongs to one assignment, and the moment the
         row is narrow enough to fold that assignment behind a "+1" the date
         is describing something you cannot see. The cards say it instead. */
      /* The row is one line wide. Whatever does not fit goes behind the "+N"
         every other relation row uses, rather than squeezing two names to
         seven characters each. */
      if (window.SugiraRelations) window.SugiraRelations.refit(slot);
    });
  }

  /* ---- the chooser, and the cards under it ---- */

  function card(a) {
    var c = el('div', 'asg' + (a.id === pickedId ? ' on' : ''));
    var b = el('button', 'asg-b');
    b.type = 'button';
    b.setAttribute('aria-pressed', String(a.id === pickedId));

    var h = el('span', 'asg-h');
    h.appendChild(svg('i-safeguarding', 'asg-i'));
    h.appendChild(el('span', 'asg-n', a.position));
    b.appendChild(h);

    var w = el('span', 'asg-w');
    w.appendChild(el('span', 'asg-p', a.place + ' ' + a.level));
    w.appendChild(el('span', 'asg-d', a.why));
    b.appendChild(w);

    var m = el('span', 'asg-m');
    m.appendChild(el('span', 'chip' + (a.until ? ' warn' : ''),
      a.until ? endsIn(a) : 'No end date'));
    b.appendChild(m);

    b.addEventListener('click', function () {
      if (pickedId === a.id) return;
      pickedId = a.id;
      render();
    });
    c.appendChild(b);
    return c;
  }

  function fillChooser() {
    var host = $('#asgList');
    if (!host) return;
    host.innerHTML = '';
    ASSIGN.forEach(function (a) { host.appendChild(card(a)); });
  }

  /* ---- what the chosen assignment reaches ---- */

  function treeRow(name, level, depth, note) {
    var r = el('div', 'tr d' + depth);
    r.appendChild(el('span', 'nm', name));
    var rt = el('span', 'rt');
    rt.appendChild(el('span', 'lv', note || level));
    r.appendChild(rt);
    return r;
  }

  function fillReach() {
    var a = picked();
    var host = $('#asgReach');
    if (host) {
      host.innerHTML = '';
      host.appendChild(treeRow(a.province, 'province', 0,
        a.level === 'district' ? 'above them' : 'above them'));
      host.appendChild(treeRow(a.district, 'district', 1,
        a.level === 'district' ? 'their district' : 'above them'));
      if (a.level === 'sector') {
        host.appendChild(treeRow(a.place, 'sector', 2, 'their sector'));
        (a.cells || []).forEach(function (c) {
          host.appendChild(treeRow(c, 'cell', 3, 'within'));
        });
      } else {
        /* A district lead reaches every sector in it. Three are named and the
           rest counted, because fourteen rows of the same word is a wall. */
        ['Kibungo', 'Jarama', 'Sake'].forEach(function (sname) {
          host.appendChild(treeRow(sname, 'sector', 2, 'within'));
        });
        host.appendChild(treeRow('11 more sectors', 'sector', 2, 'within'));
      }
    }
    var cv = $('#asgCovers');
    if (cv) {
      cv.innerHTML = '';
      a.covers.forEach(function (pair) {
        var d = el('div');
        var k = el('div', 'k');
        if (pair[0] === 'IZU at Village') {
          var ab = el('abbr', null, 'IZU');
          ab.setAttribute('data-tip',
            'IZU — the home visitor at village level, one per village');
          k.appendChild(ab);
          k.appendChild(document.createTextNode(' at Village'));
        } else {
          k.textContent = pair[0];
        }
        d.appendChild(k);
        d.appendChild(el('div', 'v', group(pair[1])));
        cv.appendChild(d);
      });
    }
    $$('[data-asg-name]').forEach(function (n) { n.textContent = a.place + ' ' + a.level; });
    var pj = $('#asgProjects');
    if (pj) {
      pj.innerHTML = '';
      a.projects.forEach(function (name) {
        var b = el('button', 'rel');
        b.type = 'button';
        b.setAttribute('data-go', 'project');
        b.appendChild(svg('i-project', null));
        b.appendChild(document.createTextNode(name));
        pj.appendChild(b);
      });
    }
  }

  /* ---- hand the chosen position to the access tree ----
     It reads data-role off #accessTree and redraws on drawer:render, so this
     is the whole of the coupling: one attribute and one event. */
  function pushToTree() {
    var t = $('#accessTree');
    if (!t) return;
    var a = picked();
    if (t.getAttribute('data-role') === a.position) return;
    t.setAttribute('data-role', a.position);
    document.dispatchEvent(new CustomEvent('drawer:render', { detail: { key: 'person' } }));
  }

  function render() {
    fillRow();
    fillChooser();
    fillReach();
    pushToTree();
  }

  function start() {
    if (!$('#asgList') && !$('[data-person-assign]')) return;
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
  /* The person record is also opened as a drawer, which clones the screen, so
     the slots have to be filled again each time it is handed over. */
  document.addEventListener('drawer:render', function (e) {
    if (e.detail && e.detail.key === 'person') setTimeout(function () {
      fillRow(); fillChooser(); fillReach();
    }, 0);
  });

  window.SugiraAssignments = { all: function () { return ASSIGN; }, picked: picked };
})();
