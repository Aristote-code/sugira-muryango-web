/* ---------------------------------------------------------------------------
   The controls that were drawn but never wired: paging, export, the segmented
   toggles, the account menu, and the "+3 more" links.

   Each one does the real thing rather than acknowledging the click. Paging
   actually pages, export actually downloads the rows you are looking at, and
   the segmented controls drive the same filter state the filter bar does, so
   the two can never disagree about what the screen is showing.
--------------------------------------------------------------------------- */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) {
    return Array.prototype.slice.call((r || document).querySelectorAll(s));
  };

  function say(msg) {
    var t = $('#toast');
    if (!t) return;
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(say._t);
    say._t = setTimeout(function () { t.hidden = true; }, 2600);
  }

  function tableNear(el) {
    var card = el.closest('.card');
    var t = card && $('.tbl', card);
    if (t) return t;
    var screen = el.closest('.screen');
    return screen ? $('.tbl', screen) : null;
  }

  /* ---- paging ----
     The page size is deliberately small. These tables hold a sample of a much
     larger set, so a page size of "everything loaded" would leave the control
     drawn and inert — which is what it was. Pages are computed from the rows a
     filter has left visible, so paging and filtering compose instead of
     fighting. */
  var PAGE = 5;

  function pagers() {
    $$('.tfoot .pg').forEach(function (pg) {
      var foot = pg.closest('.tfoot');
      var table = tableNear(pg);
      if (!table) return;
      var label = foot.querySelector('span:not(.pg)');
      var state = { page: 1 };

      /* Filtering owns .f-out and paging owns .p-out, so neither can undo the
         other. Paging only ever pages what the filters have left. */
      function rows() {
        return $$('tbody tr', table).filter(function (r) {
          return !r.classList.contains('f-out');
        });
      }

      function render() {
        var list = rows();
        var pages = Math.max(1, Math.ceil(list.length / PAGE));
        if (state.page > pages) state.page = pages;
        var from = (state.page - 1) * PAGE;
        var to = Math.min(from + PAGE, list.length);

        list.forEach(function (r, i) {
          r.classList.toggle('p-out', !(i >= from && i < to));
        });

        $$('button', pg).forEach(function (b) {
          var t = b.textContent.trim();
          if (t === '›' || t === '‹') {
            b.disabled = (t === '›') ? state.page >= pages : state.page <= 1;
            b.hidden = false;
            return;
          }
          var n = parseInt(t, 10);
          b.hidden = isNaN(n) || n > pages;      // never offer a page that isn't there
          b.classList.toggle('on', n === state.page);
        });

        if (label) {
          label.textContent = list.length
            ? 'Showing ' + (from + 1) + '–' + to + ' of ' + list.length
            : 'Nothing matches these filters';
        }
      }

      pg.addEventListener('click', function (e) {
        var b = e.target.closest('button');
        if (!b || b.disabled) return;
        var t = b.textContent.trim();
        if (t === '›') state.page += 1;
        else if (t === '‹') state.page -= 1;
        else state.page = parseInt(t, 10) || 1;
        render();
      });

      // a filter change resets to the first page, as it should
      table.addEventListener('filtered', function () { state.page = 1; render(); });
      pg._render = render;
      render();
    });
  }

  /* ---- export ----
     Downloads exactly the rows on screen, filters and all. The old system had
     Copy / Excel / CSV / PDF buttons above a list nobody could narrow first. */
  function csvCell(s) {
    s = String(s).replace(/\s+/g, ' ').trim();
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }

  function exportTable(table, name) {
    if (!table) { say('Nothing to export here'); return; }
    var head = $$('thead th', table).map(function (th) { return csvCell(th.textContent); });
    // every row the filters kept, not just the page on screen
    var body = $$('tbody tr', table)
      .filter(function (r) { return !r.classList.contains('f-out'); })
      .map(function (r) {
        return $$('td', r).map(function (td) { return csvCell(td.textContent); }).join(',');
      });
    var csv = [head.join(',')].concat(body).join('\n');
    var url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    var a = document.createElement('a');
    a.href = url;
    a.download = name + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    say(body.length + ' rows exported');
  }

  $$('button').forEach(function (b) {
    var t = b.textContent.trim();
    if (!/^Export( CSV| strings)?$/.test(t)) return;
    b.addEventListener('click', function () {
      var screen = b.closest('.screen');
      exportTable(tableNear(b), (screen ? screen.id.replace('s-', '') : 'sugira'));
    });
  });

  /* ---- segmented controls ----
     These shared a look with the filter bar and none of its behaviour. Where a
     segment names something the filter bar also controls, it sets that filter
     rather than keeping a second, disagreeing copy of the same state. */
  $$('.seg').forEach(function (seg) {
    seg.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      $$('button', seg).forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on');

      var label = b.textContent.trim();
      var screen = seg.closest('.screen');

      // dashboard period: drive the real filter so the tiles recompute
      var period = { 'This week': 'This week', 'Month': 'This month', 'Cohort': 'This cohort' }[label];
      if (period && screen) {
        var fl = $$('.fl', screen).filter(function (f) {
          var k = f.querySelector('.k');
          return k && k.textContent.trim().toLowerCase() === 'period';
        })[0];
        if (fl) {
          fl.querySelector('b').textContent = period;
          fl.click(); fl.click();            // reopen/close to re-run the apply path
          var opt = $$('.flpop-o').filter(function (o) { return o.textContent.trim() === period; })[0];
          if (opt) opt.click();
        }
        return;
      }

      // form screen: swap which language column leads
      if (/^(Kinyarwanda|English)$/.test(label) && screen) {
        var rw = label === 'Kinyarwanda';
        $$('.tbl', screen).forEach(function (tb) {
          var heads = $$('thead th', tb).map(function (th) { return th.textContent.trim(); });
          var ei = heads.indexOf('English'), ki = heads.indexOf('Kinyarwanda');
          if (ei < 0 || ki < 0) return;
          $$('tr', tb).forEach(function (r) {
            var c = r.children;
            if (c.length <= Math.max(ei, ki)) return;
            c[ei].classList.toggle('mut', rw);
            c[ki].classList.toggle('mut', !rw);
          });
        });
        say(rw ? 'Kinyarwanda leads' : 'English leads');
        return;
      }
      say(label);
    });
  });

  /* ---- "+3 more" ---- */
  $$('[data-more]').forEach(function (b) {
    b.addEventListener('click', function () {
      var host = b.parentNode;
      if (b.dataset.open) {
        $$('.more-extra', host).forEach(function (x) { x.remove(); });
        delete b.dataset.open;
        b.textContent = b.dataset.label || b.textContent;
        return;
      }
      b.dataset.label = b.textContent;
      var n = parseInt(b.textContent.replace(/\D/g, ''), 10) || 3;
      var names = (b.getAttribute('data-more') || '').split('|').filter(Boolean);
      for (var i = 0; i < n; i++) {
        var s = document.createElement('span');
        s.className = 'rel more-extra';
        s.textContent = names[i] || ('Item ' + (i + 1));
        host.insertBefore(s, b);
      }
      b.dataset.open = '1';
      b.textContent = 'Show fewer';
    });
  });

  /* ---- account menu ---- */
  var chip = $('.userchip');
  if (chip) {
    chip.setAttribute('aria-haspopup', 'menu');
    chip.setAttribute('aria-expanded', 'false');
    chip.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = $('.usermenu');
      if (open) { open.remove(); chip.setAttribute('aria-expanded', 'false'); return; }
      var m = document.createElement('div');
      m.className = 'usermenu';
      m.setAttribute('role', 'menu');
      [
        ['Your profile', function () { say('Profile is not part of this prototype'); }],
        ['Switch role…', function () { say('A person holds one role per place'); }],
        ['Sign out', function () {
          var b = $('[data-go="login"]');
          if (b) b.click(); else location.hash = '#login';
        }]
      ].forEach(function (row) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'usermenu-i';
        b.setAttribute('role', 'menuitem');
        b.textContent = row[0];
        b.addEventListener('click', function () { m.remove(); chip.setAttribute('aria-expanded', 'false'); row[1](); });
        m.appendChild(b);
      });
      document.body.appendChild(m);
      var r = chip.getBoundingClientRect();
      m.style.top = (r.bottom + 6) + 'px';
      m.style.right = Math.max(12, window.innerWidth - r.right) + 'px';
      chip.setAttribute('aria-expanded', 'true');
    });
    document.addEventListener('click', function () {
      var m = $('.usermenu');
      if (m) { m.remove(); chip.setAttribute('aria-expanded', 'false'); }
    });
  }

  /* ---- cast to display ----
     The dashboard's reason for existing is a wall, so this is the browser's own
     fullscreen rather than a message saying it would be. */
  $$('[data-cast]').forEach(function (b) {
    b.addEventListener('click', function () {
      var target = b.closest('.screen') || document.documentElement;
      if (document.fullscreenElement) {
        document.exitFullscreen();
        return;
      }
      var req = target.requestFullscreen || target.webkitRequestFullscreen;
      if (!req) { say('This browser will not go fullscreen'); return; }
      req.call(target).then(function () {
        say('Press Esc to leave the display');
      }, function () {
        say('The browser refused fullscreen');
      });
    });
  });

  /* ---- navigation sub-items ----
     "All households", "Behind schedule" and "Enrolment" all routed to the same
     unfiltered screen, so the rail offered three links to one place. A sub-item
     now lands on what it names: a filter, a tab, another screen or a dialog. */
  document.addEventListener('click', function (e) {
    var si = e.target.closest('[data-view]');
    if (!si) return;
    var view = si.getAttribute('data-view');
    // let the router finish moving screens before the view is applied
    setTimeout(function () {
      var screen = $('.screen.live') || $('#s-' + si.getAttribute('data-go'));
      if (!screen) return;
      var id = screen.id;

      if (view === 'clear') {
        if (window.SugiraFilters) window.SugiraFilters.clear(id);
        return;
      }
      var m = /^filter:([a-z]+)=(.+)$/.exec(view);
      if (m) {
        if (window.SugiraFilters) window.SugiraFilters.set(id, m[1], m[2]);
        return;
      }
      m = /^tab:(.+)$/.exec(view);
      if (m) {
        var tab = $$('.tab', screen).filter(function (t) {
          return t.textContent.trim().indexOf(m[1]) === 0;
        })[0];
        if (tab) tab.click();
        return;
      }
      m = /^modal:(.+)$/.exec(view);
      if (m) {
        var opener = $('[data-modal="' + m[1] + '"]');
        if (opener) opener.click();
        return;
      }
      m = /^go:(.+)$/.exec(view);
      if (m) {
        var b = $('[data-go="' + m[1] + '"]');
        if (b) b.click();
      }
    }, 60);
  });

  /* ---- one filter surface per screen ----
     A screen with a domain filter bar was also carrying the generic table
     bar's Filter and Export, so there were two ways to filter and three to
     export the same rows, each with its own idea of what was applied. The
     domain bar wins where it exists: it knows the place hierarchy, the
     cohorts and the sessions. Columns and column sorting stay, because the
     domain bar does not do those. */
  $$('.screen').forEach(function (screen) {
    if (!screen.querySelector('.filters')) return;
    $$('.tq-btn', screen).forEach(function (b) {
      var t = b.textContent.trim();
      if (t === 'Filter' || t === 'Export') b.hidden = true;
    });
  });

  pagers();

  // the filter module hides rows; tell the pagers so they re-page what is left
  var reflow = function () {
    $$('.tfoot .pg').forEach(function (pg) { if (pg._render) pg._render(); });
  };
  document.addEventListener('filters:applied', reflow);
})();
