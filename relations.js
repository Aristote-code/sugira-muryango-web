/* Relations, on the records that are configured rather than worked on.

   "Relation ntago ari ngombwa" — "Relation is not necessary" — gp2 13:37,
   said over a household and meant for every record of that kind: a case,
   a referral, a visit. What relates to a case is the case, and a tab that
   lists the household, the home visitor and the question again is a
   second copy of the record you are already reading.

   It stays on a form, a project, a session, a person and a position,
   because gp1 24:31 asks for precisely this there: "you can see its
   parent, you also see all those children, you have control over them...
   all those permissions would be connected, they would have a way it is
   traced." On those, what it is built on is the one thing the screen
   does not otherwise say.


   Almost everything in this programme is a tie to something else: a form
   belongs to a session, a session to a project, a household to an IZU and a
   cohort, a case to the visit that raised it. The app knew all of it and
   showed none of it — you could reach a related record only if someone had
   happened to put a link in the body text.

   ClickUp's task panel has a Related items tab split in two: Relationships,
   which is what the record is structurally part of, and References, which is
   where it gets used. Same split here, because the two answer different
   questions: "what is this part of" and "what breaks if I change it".

   The tab and its panel are added from here rather than written into every
   record screen, so a new relation is one line in the map below. */
(function () {
  'use strict';

  /* How many permissions a position opens, out of how many exist. The second
     number used to be typed into this row, and went stale the day a group was
     added to the ladder. A function rather than a string, because this file is
     read before permissions.js has shaped its data. */
  /* The Sector lead's headcount, read from the ladder rather than typed. It
     said twelve while the ladder said eleven and the live system seventeen. */
  function slaHolders() {
    var P = window.SugiraPerms;
    var p = P && P.positions().filter(function (x) { return x.id === 'SLA'; })[0];
    var n = p ? p.people : 0;
    return n + (n === 1 ? ' person holds this position' : ' people hold this position');
  }
  function assignLine() {
    var a = window.SugiraAssignments ? window.SugiraAssignments.all() : [];
    if (!a.length) return 'None';
    return a.map(function (x) { return x.short + ' · ' + x.place; }).join(', ');
  }
  function projectLine() {
    var a = window.SugiraAssignments ? window.SugiraAssignments.picked() : null;
    if (!a) return '—';
    return a.projects.length + (a.projects.length === 1 ? ' project' : ' projects');
  }
  function permCount() {
    return '14 of the ' + (window.SugiraPerms ? window.SugiraPerms.all.length : 26)
      + ' permissions';
  }

  /* kind, what it points at, the screen it opens, and why it matters */
  var R = {
    project: {
      title: 'Household Module Tracking',
      rel: [
        ['Sessions', 'i-programme', '12 sessions, a welcome, a closing and three boosters', 'module', 'What a household receives'],
        ['Forms', 'i-reports', '12 forms carry this project’s questions', 'form', 'Ten filled in on a visit, two by a supervisor'],
        ['Cohorts', 'i-visits', 'Cohort 1, Cohort 2', 'cohorts', 'Decide who gets which session when'],
        ['Households', 'i-households', '2 210 enrolled', 'households', 'Everyone on this curriculum']
      ],
      ref: [
        ['Report', 'i-reports', 'IZU status and supervision', 'reports', 'Scoped to this project'],
        ['Role', 'i-admin', 'Positions scoped to this project', 'permissions', 'Nineteen projects run here; a role rarely needs them all']
      ]
    },
    module: {
      title: 'Session 6 — The Importance of Good Health',
      rel: [
        ['Project', 'i-programme', 'Household Module Tracking', 'project', 'The curriculum this session is part of'],
        ['Form', 'i-reports', 'Visit record', 'form', 'What the visitor fills in during this session'],
        ['Cohorts', 'i-visits', 'Cohort 1, Cohort 2', 'cohorts', 'Changing the interval moves this session for everyone not yet there'],
        ['Households', 'i-households', '986 at this session', 'households', 'Delivery drops sharply from here on']
      ],
      ref: [
        ['Safeguarding', 'i-safeguarding', 'Question 5 opens a risk-of-harm case', 'settings', 'This session can open a case'],
        ['Report', 'i-reports', 'Average minutes per module', 'reports', 'Counts this session']
      ]
    },
    form: {
      title: 'Visit record',
      rel: [
        ['Session', 'i-programme', 'Session 6 — The Importance of Good Health', 'module', 'Where this form is used'],
        ['Project', 'i-programme', 'Household Module Tracking', 'project', 'Through the session above'],
        ['Languages', 'i-message', 'English, Kinyarwanda', 'translations', 'Kinyarwanda is complete for this form'],
        ['Responses', 'i-reports', '986 responses', 'reports', 'What a report on this form reads']
      ],
      ref: [
        ['Rule', 'i-settings', 'Question 5 opens a risk-of-harm case', 'settings', 'The answer that creates a case'],
        ['Follow-up rule', 'i-clock', 'Caregiver absent → return within 14 days', 'followups', 'An answer here can oblige a return visit']
      ]
    },
    person: {
      title: 'C. Uwimana',
      rel: [
        ['Assignments', 'i-admin', assignLine, 'permissions', 'A position and the place it applies to, one row each'],
        ['Projects', 'i-programme', projectLine, 'project', 'What the chosen assignment covers'],
        ['Reports to', 'i-admin', 'District lead, Ngoma', 'people', 'Where a breach escalates']
      ],
      ref: [
        ['Cases', 'i-safeguarding', 'RH-0044, RH-0045', 'safeguarding', 'Open cases awaiting their review'],
        ['Report', 'i-reports', 'Risk of harm — type and victim', 'reports', 'They own this saved report']
      ]
    },
    position: {
      title: 'Sugira Muryango Sector lead (SLA)',
      rel: [
        ['People', 'i-admin', slaHolders, 'people', 'Each at their own place'],
        ['Permissions', 'i-settings', permCount, 'permissions', 'What the position opens'],
        ['Places', 'i-location', 'Any sector', 'places', 'The place is set when the position is given, not on the position']
      ],
      ref: [
        ['Escalation', 'i-alert', 'Unreviewed cases after 72 hours', 'settings', 'This position is who the clock runs against']
      ]
    }
  };
  R.profile = {
    title: 'A. Gahimana',
    rel: [
      ['Position', 'i-admin', 'HQ officer', 'permissions', 'Where the 88 permissions come from'],
      ['Place', 'i-location', 'National', 'places', 'Every district, which is why nothing is hidden'],
      ['Projects', 'i-programme', 'All projects', 'project', 'No project scope set']
    ],
    ref: [
      ['Report', 'i-reports', 'Male caregiver attendance by district', 'reports', 'Last run today at 06:00'],
      ['Activity', 'i-clock', 'Published Visit record to the tablet', 'system', 'Recorded against this account']
    ]
  };

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function list(items) {
    var ul = el('div', 'relist');
    items.forEach(function (it) {
      var b = el('button', 'relrow');
      b.type = 'button';
      b.setAttribute('data-go', it[3]);
      var ic = el('span', 'relrow-i');
      ic.innerHTML = '<svg aria-hidden="true"><use href="#' + it[1] + '"/></svg>';
      b.appendChild(ic);
      var mid = el('span', 'relrow-m');
      mid.appendChild(el('span', 'relrow-k', it[0]));
      mid.appendChild(el('span', 'relrow-n',
        typeof it[2] === 'function' ? it[2]() : it[2]));
      b.appendChild(mid);
      b.appendChild(el('span', 'relrow-w', it[4]));
      ul.appendChild(b);
    });
    return ul;
  }

  function build(key, data) {
    var sc = document.getElementById('s-' + key);
    if (!sc) return;
    var tabs = sc.querySelector('.tabs');
    if (!tabs || sc.querySelector('[data-panelid="relations"]')) return;

    var tab = el('button', 'tab');
    tab.type = 'button';
    tab.setAttribute('data-panel', 'relations');
    tab.textContent = 'Relations';
    var count = el('span', 'chip');
    count.style.marginLeft = '8px';
    count.textContent = data.rel.length + data.ref.length;
    tab.appendChild(count);
    tabs.appendChild(tab);

    var pad = el('div', 'pad');
    pad.setAttribute('data-panelid', 'relations');
    pad.hidden = true;

    var card = el('div', 'card');
    var h = el('div', 'card-h');
    h.appendChild(el('h3', null, 'Related to ' + data.title));
    var side = el('span', 'side');
    var seg = el('div', 'seg');
    ['Relationships', 'References'].forEach(function (label, i) {
      var btn = el('button', i === 0 ? 'on' : null, label);
      btn.type = 'button';
      btn.onclick = function () {
        Array.prototype.forEach.call(seg.children, function (c, j) {
          c.classList.toggle('on', j === i);
        });
        body.innerHTML = '';
        body.appendChild(list(i === 0 ? data.rel : data.ref));
      };
      seg.appendChild(btn);
    });
    side.appendChild(seg);
    h.appendChild(side);
    card.appendChild(h);

    var body = el('div');
    body.appendChild(list(data.rel));
    card.appendChild(body);
    pad.appendChild(card);

    /* after the last panel, so the tab order and the panel order agree */
    var last = sc.querySelectorAll('[data-panelid]');
    var at = last[last.length - 1];
    at.parentNode.insertBefore(pad, at.nextSibling);
  }

  /* The drawer's side pane shows the same ties in a narrower column, so the
     map is read from there rather than written twice. */
  window.SUGIRA_RELATIONS = R;

  /* A property row is one line (PropertyGrid.tsx: h-8), and the chips in it are
     flex children, so a row with four of them squeezes every one down to an
     ellipsis — "FCG participation" became 47px of "FCG partic…", and the +3
     that was supposed to be the way out became 15px wide. How many fit depends
     on the width the row is read at: the record screen gives it two columns,
     the drawer one, the side pane less again. So it is counted rather than
     written into the markup, and the chips that do not fit go behind the count
     the row already had. */
  function fit(v) {
    var chips = [].slice.call(v.querySelectorAll('.rel:not(.more)'));
    if (chips.length < 2) return;
    var more = v.querySelector('.rel.more');
    if (!more) {
      /* Only one row was written with a way out of itself; the rest need one
         too, and it belongs before the consequence note at the end. */
      more = document.createElement('button');
      more.className = 'rel more';
      more.type = 'button';
      more.setAttribute('data-more', '');
      more.hidden = true;
      v.insertBefore(more, v.querySelector('.conseq'));
    }
    chips.forEach(function (c) { c.classList.remove('hid'); });
    more.hidden = true;
    /* While the chips can shrink, nothing ever overflows — they just get
       narrower — so there is no overflow to measure. They are pinned to their
       own width for the count, and let go again afterwards, which leaves the
       last one free to ellipsise into whatever room is left. */
    v.classList.add('measuring');
    var n = chips.length;
    while (n > 1 && v.scrollWidth > v.clientWidth) {
      chips[--n].classList.add('hid');
      more.hidden = false;
      more.textContent = '+' + (chips.length - n);
    }
    v.classList.remove('measuring');
  }

  /* A row on a screen nobody is looking at measures zero, so counting once at
     load would count every hidden one wrong. Each row is watched instead, and
     recounted when the room it has changes — which is what happens when its
     screen opens, when the drawer takes a different layout, and on resize.
     The recount changes the chips, not the room, so it does not feed itself. */
  var ro = null, seen = null;
  function watch() {
    if (!window.ResizeObserver) return;
    if (!ro) {
      var was = new WeakMap();
      seen = new WeakSet();
      ro = new ResizeObserver(function (entries) {
        entries.forEach(function (en) {
          var w = Math.round(en.contentRect.width);
          if (!w || was.get(en.target) === w) return;
          was.set(en.target, w);
          if (!en.target.closest('.pgr.is-open')) fit(en.target);
        });
      });
    }
    document.querySelectorAll('.pgr .v').forEach(function (v) {
      if (v.querySelectorAll('.rel:not(.more)').length > 1 && !seen.has(v)) {
        seen.add(v);
        ro.observe(v);
      }
    });
  }

  function mount() {
    /* "Relation ntago ari ngombwa" — Relation is not necessary — said of a
       household, while describing what it should show instead: the head of
       the household and those in it, and the things of isibo and village.
       They were right about the household: its tab was the record read back
       to itself, with the supervisor and the project the only lines it had
       that the fields did not. Both are fields now, so the tab goes.

       It stays on the other five for the moment. There it is not a restatement
       — a form's tab is the only place that names the projects using it — and
       taking it off them would lose that with nowhere to put it. */
    Object.keys(R).forEach(function (k) {
      if (k === 'household') return;
      build(k, R[k]);
    });
    watch();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();

  /* A row whose chips arrive later says so, rather than being counted once at
     load and never again. Both the measure and the watch are idempotent. */
  window.SugiraRelations = {
    fit: fit,
    refit: function (v) { if (v) { fit(v); } watch(); }
  };
})();
