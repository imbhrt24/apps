/* Accessibility, by Example — shared behaviour (no dependencies) */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var el = function (tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  var PAGES = [
    { id: 'home', href: 'index.html', label: 'Start here' },
    { id: 'foundations', href: 'foundations.html', label: 'Foundations', prefix: 'f-', total: 5 },
    { id: 'buttons', href: 'buttons.html', label: 'Buttons', prefix: 'b-', total: 12, group: 1 },
    { id: 'toggles', href: 'toggles.html', label: 'Toggles', prefix: 't-', total: 11, group: 1 },
    { id: 'modals', href: 'modals.html', label: 'Modals', prefix: 'm-', total: 12, group: 1 },
    { id: 'tables', href: 'tables.html', label: 'Tables', prefix: 'tb-', total: 14, group: 1 }
  ];
  var TIERS = { 1: ['You already know this', 'Basics'], 2: ['What you’re probably missing', 'Often missed'], 3: ['Senior-level traps', 'Senior trap'] };
  var WHO = { keyboard: 'Keyboard users', sr: 'Screen reader users', lowvision: 'Low vision', colour: 'Colour blindness', motor: 'Motor & tremor', touch: 'Touch users', voice: 'Voice control', cognitive: 'Cognitive load', everyone: 'Everyone' };
  var page = document.body.getAttribute('data-page');

  /* ---------- icons ---------- */
  var ICONS = {
    x: 'M6 6l12 12M18 6L6 18', check: 'M5 12.5l4.5 4.5L19 7.5',
    trash: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6',
    edit: 'M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4',
    settings: 'M4 7h9M19 7h1M4 17h1M11 17h9M16 9.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM8 19.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
    link: 'M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1',
    warn: 'M12 3l10 18H2L12 3zM12 10v5M12 18v.5', chev: 'M9 6l6 6-6 6', down: 'M6 9l6 6 6-6', up: 'M6 15l6-6 6 6',
    more: 'M5 12h.01M12 12h.01M19 12h.01', speaker: 'M4 10v4h3l5 4V6l-5 4H4zM16 9a4 4 0 010 6M18.5 6.5a8 8 0 010 11',
    menu: 'M4 7h16M4 12h16M4 17h16', arrow: 'M5 12h14M13 6l6 6-6 6', back: 'M19 12H5M11 6l-6 6 6 6',
    moon: 'M20 14.5A8 8 0 019.5 4 8 8 0 1020 14.5z', bell: 'M6 16v-5a6 6 0 0112 0v5l2 2H4l2-2zM10 21h4',
    copy: 'M9 9h11v11H9zM5 15V4h11', heart: 'M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z',
    eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 100-6 3 3 0 000 6z',
    keyboard: 'M3 6h18v12H3zM7 10h.01M11 10h.01M15 10h.01M7 14h10', pointer: 'M5 3l5 17 3-7 7-3L5 3z',
    zoom: 'M11 18a7 7 0 100-14 7 7 0 000 14zM21 21l-5-5M11 8v6M8 11h6', mic: 'M12 3a3 3 0 00-3 3v5a3 3 0 006 0V6a3 3 0 00-3-3zM6 11a6 6 0 0012 0M12 17v4',
    pen: 'M4 20l4-1L20 7l-3-3L5 16l-1 4zM14 6l3 3', print: 'M7 9V3h10v6M7 17H4V9h16v8h-3M7 14h10v7H7z',
    flag: 'M5 21V4h12l-2 4 2 4H5', star: 'M12 3l2.8 5.8 6.2.9-4.5 4.4 1.1 6.3L12 17.5l-5.6 2.9 1.1-6.3L3 9.6l6.2-.9L12 3z'
  };
  function icon(n) { return '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="' + (ICONS[n] || '') + '"' + (n === 'more' ? ' stroke-width="3.2"' : '') + '/></svg>'; }
  function paintIcons(root) { $$('i[data-i]', root).forEach(function (i) { i.outerHTML = icon(i.getAttribute('data-i')); }); }
  paintIcons(document);
  document.body.insertAdjacentHTML('beforeend', '<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><filter id="f-deut" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0"/></filter></svg>');

  /* ---------- progress ---------- */
  var learned = store.get('a11y-learned', {});
  function countFor(p) { var n = 0; for (var k in learned) if (learned[k] && k.indexOf(p.prefix) === 0) n++; return n; }
  function totalFor(p) { return p.id === page ? ($$('[data-learn]').length || p.total) : p.total; }
  function paintProgress() {
    var all = 0, done = 0;
    PAGES.forEach(function (p) {
      if (!p.prefix) return;
      var t = totalFor(p), c = Math.min(countFor(p), t); all += t; done += c;
      $$('[data-count="' + p.id + '"]').forEach(function (n) { n.textContent = c + '/' + t; n.classList.toggle('done', c === t); });
      $$('[data-progress-for="' + p.id + '"]').forEach(function (n) {
        n.innerHTML = '<span class="pp">' + (c === 0 ? t + ' topics' : c === t ? 'All ' + t + ' learned' : c + ' of ' + t + ' learned') + '</span><span class="bar"><i style="width:' + (100 * c / t) + '%"></i></span>';
      });
    });
    $$('[data-total]').forEach(function (n) { n.innerHTML = '<span>' + done + ' of ' + all + ' topics learned</span>'; });
    $$('[data-total-bar]').forEach(function (n) { n.style.width = (100 * done / all) + '%'; });
  }
  function setLearned(id, on) {
    if (on) learned[id] = true; else delete learned[id];
    store.set('a11y-learned', learned);
    var t = document.getElementById(id);
    if (t) { t.classList.toggle('learned', on); var b = $('.learn', t); if (b) { b.setAttribute('aria-pressed', on); b.innerHTML = icon('check') + (on ? 'Learned' : 'Mark as learned'); } }
    $$('.alist a[href="#' + id + '"]').forEach(function (a) { a.classList.toggle('done', on); var v = $('.vh', a); if (v) v.textContent = on ? ' (learned)' : ''; });
    $$('.check input[data-for="' + id + '"]').forEach(function (c) { c.checked = on; });
    paintProgress();
  }

  /* ---------- shell: sidebar + top bar ---------- */
  var shell = $('.shell');
  if (shell) {
    var links = function (g) {
      return PAGES.filter(function (p) { return (p.group || 0) === g; }).map(function (p) {
        return '<li><a href="' + p.href + '"' + (p.id === page ? ' aria-current="page"' : '') + '>' + p.label + (p.prefix ? '<span class="count" data-count="' + p.id + '"></span>' : '') + '</a></li>';
      }).join('');
    };
    var side = el('nav', 'side');
    side.id = 'side'; side.setAttribute('aria-label', 'Site');
    side.innerHTML = '<a class="brand" href="index.html"><span class="brand-mark" aria-hidden="true">A</span><span><b>Accessibility, by Example</b><small>for designers, not developers</small></span></a>' +
      '<div class="nav-label" id="nl1">Learn</div><ul class="nav" aria-labelledby="nl1">' + links(0) + '</ul>' +
      '<div class="nav-label" id="nl2">Components</div><ul class="nav" aria-labelledby="nl2">' + links(1) + '</ul>' +
      '<div class="nav-label" id="nl3">Coming soon</div><ul class="nav" aria-labelledby="nl3"><li><span class="soon">Forms <em>Soon</em></span></li><li><span class="soon">Tabs <em>Soon</em></span></li><li><span class="soon">Toasts <em>Soon</em></span></li></ul>' +
      '<div class="side-foot"><div class="total" data-total></div><div class="bar" style="margin:0 10px"><i data-total-bar></i></div><button type="button" class="theme-btn" id="themeBtn"></button></div>';
    var top = el('div', 'topbar', '<button type="button" class="menu-btn" id="menuBtn" aria-expanded="false" aria-controls="side">' + icon('menu') + 'Menu</button><b>Accessibility, by Example</b>');
    shell.parentNode.insertBefore(top, shell);
    shell.insertBefore(side, shell.firstChild);
    var menuBtn = $('#menuBtn');
    var setNav = function (open) { document.body.classList.toggle('nav-open', open); menuBtn.setAttribute('aria-expanded', open); if (open) $('a', side).focus(); };
    menuBtn.addEventListener('click', function () { setNav(!document.body.classList.contains('nav-open')); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && document.body.classList.contains('nav-open')) { setNav(false); menuBtn.focus(); } });
    $('main').addEventListener('click', function () { if (document.body.classList.contains('nav-open')) setNav(false); });

    var themeBtn = $('#themeBtn');
    var isDark = function () { var t = document.documentElement.getAttribute('data-theme'); return t ? t === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches; };
    var paintTheme = function () { themeBtn.innerHTML = icon('moon') + (isDark() ? 'Switch to light mode' : 'Switch to dark mode'); };
    themeBtn.addEventListener('click', function () {
      var next = isDark() ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('a11y-theme', next); } catch (e) {}
      paintTheme();
    });
    paintTheme();
  }

  /* ---------- tiers, topics, anatomy, checklist ---------- */
  $$('.tier').forEach(function (t) {
    var n = t.getAttribute('data-tier'), h = $('.tier-head', t);
    if (h) h.insertAdjacentHTML('afterbegin', '<p class="k">Level ' + n + ' of 3</p>');
  });
  var topics = $$('article.topic');
  topics.forEach(function (t, i) {
    var tier = t.closest('[data-tier]').getAttribute('data-tier');
    t.setAttribute('data-learn', ''); t.style.setProperty('--tc', 'var(--t' + tier + ')');
    var h = $('h3', t), head = el('div', 'topic-head');
    t.insertBefore(head, h);
    head.appendChild(el('span', 'num', String(i + 1))); head.firstChild.setAttribute('aria-hidden', 'true');
    head.appendChild(h);
    head.appendChild(el('span', 'chip t' + tier, TIERS[tier][1]));
    var who = (t.getAttribute('data-who') || '').split(',').filter(Boolean);
    if (who.length) head.insertAdjacentHTML('afterend', '<p class="who">Who this helps: ' + who.map(function (w) { return '<span>' + (WHO[w] || w) + '</span>'; }).join('') + '</p>');
    $$('.demo.bad, .demo.good', t).forEach(function (d) {
      var bad = d.classList.contains('bad');
      d.insertAdjacentHTML('afterbegin', '<span class="tag">' + icon(bad ? 'x' : 'check') + (d.getAttribute('data-tag') || (bad ? 'Avoid' : 'Do')) + '</span>');
    });
    $$('.try', t).forEach(function (p) { p.innerHTML = icon('keyboard') + '<span><b>Try it.</b> ' + p.innerHTML + '</span>'; });
    $$('.figma', t).forEach(function (p) { p.innerHTML = icon('pen') + '<span><b>In your design file.</b> ' + p.innerHTML + '</span>'; });
    $$('details.rule', t).forEach(function (d) { d.insertAdjacentHTML('afterbegin', '<summary>The rule, for handoff</summary>'); });
    t._num = i + 1; t._tier = tier; t._title = h.textContent;
  });
  $$('[data-learn]').forEach(function (t) {
    var b = el('button', 'learn'); b.type = 'button';
    b.addEventListener('click', function () { setLearned(t.id, b.getAttribute('aria-pressed') !== 'true'); });
    t.appendChild(b);
  });
  $$('a.pin').forEach(function (p) {
    var t = document.getElementById(p.getAttribute('href').slice(1)); if (!t) return;
    p.textContent = t._num; p.classList.add('t' + t._tier); p.setAttribute('aria-label', 'Topic ' + t._num + ': ' + t._title);
  });
  var groupsHTML = function (fn) {
    return [1, 2, 3].map(function (n) {
      var list = topics.filter(function (t) { return t._tier == n; });
      return list.length ? '<h3 class="' + ['g1', 'g2c', 'g3c'][n - 1] + '">' + TIERS[n][0] + '</h3>' + fn(list) : '';
    }).join('');
  };
  var alist = $('#anatomy-list');
  if (alist) alist.innerHTML = groupsHTML(function (list) {
    return '<ol>' + list.map(function (t) { return '<li><a href="#' + t.id + '"><span class="n" aria-hidden="true">' + t._num + '</span><span>' + t._title + '<span class="vh"></span></span><span class="tick">' + icon('check') + '</span></a></li>'; }).join('') + '</ol>';
  });
  var check = $('#checklist-body');
  if (check) {
    check.innerHTML = groupsHTML(function (list) {
      return '<ul>' + list.map(function (t) { return '<li><label><input type="checkbox" data-for="' + t.id + '"><span>' + (t.getAttribute('data-check') || t._title) + '</span></label></li>'; }).join('') + '</ul>';
    });
    check.addEventListener('change', function (e) { if (e.target.matches('input[data-for]')) setLearned(e.target.getAttribute('data-for'), e.target.checked); });
  }
  $$('[data-print]').forEach(function (b) {
    b.addEventListener('click', function () { document.body.classList.add('print-check'); window.print(); setTimeout(function () { document.body.classList.remove('print-check'); }, 500); });
  });
  $$('[data-learn]').forEach(function (t) { setLearned(t.id, !!learned[t.id]); });
  paintProgress();
  if (location.hash.length > 1) { var hashEl = document.getElementById(location.hash.slice(1)); if (hashEl) hashEl.scrollIntoView({ behavior: 'instant' }); }

  /* ---------- simulated screen reader ---------- */
  $$('.sr').forEach(function (s) {
    var hint = s.getAttribute('data-hint') || 'Press Tab to move focus here';
    s._hint = hint; s.classList.add('idle');
    s.innerHTML = icon('speaker') + '<span><span class="lbl">Simulated screen reader</span><span class="txt">' + (s.getAttribute('data-say') || hint) + '</span></span>';
    if (s.hasAttribute('data-say')) s.classList.remove('idle');
  });
  function scopeOf(e) { return e.closest('[data-sr-scope], .demo'); }
  function say(scope, text) {
    var s = scope && $('.sr', scope); if (!s) return;
    s.classList.remove('idle'); s.classList.toggle('silent', !text);
    $('.txt', s).textContent = text || '(silence — nothing is announced)';
  }
  function srText(e) {
    var s = e.getAttribute('data-sr'); if (s == null) return null;
    var st = '';
    if (e.hasAttribute('aria-checked')) st = e.getAttribute('aria-checked') === 'true' ? 'on' : 'off';
    else if (e.hasAttribute('aria-pressed')) st = e.getAttribute('aria-pressed') === 'true' ? 'pressed' : 'not pressed';
    else if (e.hasAttribute('aria-expanded')) st = e.getAttribute('aria-expanded') === 'true' ? 'expanded' : 'collapsed';
    else if (e.type === 'checkbox') st = e.checked ? 'checked' : 'not checked';
    return s.replace('{state}', st);
  }
  function announce(e) { var t = srText(e); if (t != null) say(scopeOf(e), t); }
  document.addEventListener('focusin', function (e) { if (e.target.hasAttribute && e.target.hasAttribute('data-sr')) announce(e.target); nrs(e.target); });

  /* ---------- small interactive controls ---------- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[role="switch"], [data-fake-switch], [data-toggle], [data-fake-toggle], [data-expand], [data-open], [data-close], [data-goto-view], [data-sim], [data-loading], [data-show], [data-noop]');
    if (!t) return;
    if (t.matches('[data-noop]')) { e.preventDefault(); return; }
    if (t.matches('[role="switch"]')) {
      if (t.getAttribute('aria-disabled') === 'true' || t.hasAttribute('data-static')) return;
      t.setAttribute('aria-checked', t.getAttribute('aria-checked') !== 'true');
      announce(t); nrs(t);
      if (t.hasAttribute('data-save')) saveToggle(t);
    } else if (t.matches('[data-fake-switch]')) {
      var sw = t.matches('.sw') ? t : $('.sw', t); sw.classList.toggle('on'); announce(t);
    } else if (t.matches('[data-toggle]')) {
      t.setAttribute('aria-pressed', t.getAttribute('aria-pressed') !== 'true'); announce(t); nrs(t);
    } else if (t.matches('[data-fake-toggle]')) {
      t.classList.toggle('on'); announce(t);
    } else if (t.matches('[data-expand]')) {
      var open = t.getAttribute('aria-expanded') !== 'true'; t.setAttribute('aria-expanded', open);
      var tg = document.getElementById(t.getAttribute('data-expand')); if (tg) tg.hidden = !open;
      var ic = $('svg.i', t); if (ic) ic.style.transform = open ? 'rotate(90deg)' : '';
      announce(t);
    } else if (t.matches('[data-open]')) {
      openModal(t.getAttribute('data-open'), t);
    } else if (t.matches('[data-close]')) {
      closeModal(t.closest('.overlay'), 'btn');
    } else if (t.matches('[data-goto-view]')) {
      var m = t.closest('.modal'); $$('[data-view]', m).forEach(function (v) { v.hidden = v.getAttribute('data-view') !== t.getAttribute('data-goto-view'); });
      var hd = $('[data-view]:not([hidden]) h2', m); if (hd) { hd.tabIndex = -1; hd.focus(); }
    } else if (t.matches('[data-sim]')) {
      var on = t.getAttribute('aria-pressed') !== 'true'; t.setAttribute('aria-pressed', on);
      var target = t.getAttribute('data-target') ? $(t.getAttribute('data-target')) : $('.pair', t.closest('.topic'));
      if (target) target.classList.toggle('sim-' + t.getAttribute('data-sim'), on);
    } else if (t.matches('[data-loading]')) {
      loadingBtn(t);
    } else if (t.matches('[data-show]')) {
      var sh = document.getElementById(t.getAttribute('data-show')); if (sh) sh.hidden = false;
      if (t.hasAttribute('data-say')) say(scopeOf(t), t.getAttribute('data-say'));
    }
  });
  function saveToggle(t) {
    var sc = scopeOf(t), on = t.getAttribute('aria-checked') === 'true', st = $('[data-save-status]', sc);
    if (st) st.innerHTML = '<span class="spin"></span> Saving…';
    say(sc, srText(t) + '. Saving…');
    setTimeout(function () { if (st) st.innerHTML = icon('check') + ' Saved'; say(sc, 'Saved. ' + t.getAttribute('data-name') + ' is ' + (on ? 'on' : 'off') + '.'); }, 1300);
  }
  function loadingBtn(b) {
    var good = b.getAttribute('data-loading') === 'good', sc = scopeOf(b);
    if (b._busy) { if (!good) say(sc, ''); return; }
    b._busy = true; b._label = b._label || b.innerHTML;
    if (good) { b.setAttribute('aria-disabled', 'true'); b.innerHTML = '<span class="spin"></span> Saving…'; say(sc, 'Saving…'); }
    else { b.innerHTML = '<span class="spin"></span>'; say(sc, ''); }
    setTimeout(function () {
      if (good) { b.innerHTML = icon('check') + ' Saved'; say(sc, 'Changes saved'); }
      setTimeout(function () { b.innerHTML = b._label; b.removeAttribute('aria-disabled'); b._busy = false; }, good ? 1600 : 0);
    }, 1700);
  }

  /* ---------- modal engine (deliberately supports broken behaviour for the "avoid" demos) ---------- */
  var stack = [];
  function setInert(on) { $$('.shell, .topbar').forEach(function (n) { n.inert = on; }); }
  function focusables(m) { return $$('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])', m).filter(function (e) { return e.offsetParent !== null; }); }
  function track(ov, step, ok) {
    $$('.tracker[data-for="' + ov.id + '"]').forEach(function (tr) {
      if (step === 'reset') { $$('li', tr).forEach(function (li) { li.className = ''; var s = $('.st', li); if (s) s.remove(); if (li._orig != null) $('.msg', li).textContent = li._orig; }); return; }
      var li = $('[data-step="' + step + '"]', tr); if (!li || li.classList.contains('fail')) return;
      li.className = ok ? 'pass' : 'fail'; var s = $('.st', li); if (s) s.remove();
      li.insertAdjacentHTML('afterbegin', '<span class="st">' + (ok ? 'Passed: ' : 'Failed: ') + '</span>');
      var alt = li.getAttribute(ok ? 'data-pass' : 'data-fail'), msg = $('.msg', li); if (li._orig == null) li._orig = msg.textContent; if (alt) msg.textContent = alt;
    });
  }
  function openModal(id, trigger) {
    var ov = document.getElementById(id); if (!ov) return;
    ov._leaky = ov.hasAttribute('data-leaky'); ov._escTried = false; ov._trigger = trigger; ov.hidden = false; stack.push(ov);
    $$('[data-view]', ov).forEach(function (v, i) { v.hidden = i !== 0; });
    track(ov, 'reset');
    if (!ov._leaky) {
      setInert(true); document.body.classList.add('modal-open');
      var f = $('[data-autofocus]', ov) || focusables(ov)[0]; if (f) f.focus();
      track(ov, 'in', true);
    } else track(ov, 'in', false);
  }
  function closeModal(ov, how, lose) {
    if (!ov) return;
    ov.hidden = true; stack.splice(stack.indexOf(ov), 1);
    if (!stack.some(function (o) { return !o._leaky; })) { setInert(false); document.body.classList.remove('modal-open'); }
    if (how === 'esc') track(ov, 'esc', true);
    if (!ov._leaky && !lose && ov._trigger) { ov._trigger.focus(); track(ov, 'return', true); }
    else { track(ov, 'return', false); if (lose && document.activeElement) document.activeElement.blur(); }
  }
  document.addEventListener('keydown', function (e) {
    if (!stack.length) return;
    var topM = stack[stack.length - 1];
    if (e.key === 'Escape') {
      if (topM.hasAttribute('data-esc-all')) { track(topM, 'esc', false); stack.slice().reverse().forEach(function (o) { closeModal(o, 'all', true); }); }
      else if (topM._leaky) { if (topM._escTried) { topM._escTried = false; closeModal(topM, 'btn'); } else { topM._escTried = true; track(topM, 'esc', false); } }
      else closeModal(topM, 'esc');
      return;
    }
    if (e.key === 'Tab' && !topM._leaky) {
      var f = focusables(topM); if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || !topM.contains(document.activeElement))) { e.preventDefault(); last.focus(); track(topM, 'trap', true); }
      else if (!e.shiftKey && (document.activeElement === last || !topM.contains(document.activeElement))) { e.preventDefault(); first.focus(); track(topM, 'trap', true); }
    }
  });
  document.addEventListener('focusin', function (e) {
    if (!stack.length) return; var topM = stack[stack.length - 1];
    if (topM._leaky && !topM.contains(e.target)) track(topM, 'trap', false);
  });

  /* ---------- table widgets ---------- */
  $$('[data-stepper]').forEach(function (w) {
    var cells = $$('[data-sr]', $('table', w)), i = -1;
    var bar = el('div', 'stepper', '<button type="button" class="btn sec sm">' + icon('back') + 'Previous cell</button><button type="button" class="btn sm">Next cell' + icon('arrow') + '</button>');
    var go = function (d) {
      if (i >= 0) cells[i].classList.remove('reading');
      i = i < 0 ? 0 : (i + d + cells.length) % cells.length;
      cells[i].classList.add('reading'); say(w, cells[i].getAttribute('data-sr'));
    };
    bar.children[0].addEventListener('click', function () { go(-1); });
    bar.children[1].addEventListener('click', function () { go(1); });
    $('.sr', w).parentNode.insertBefore(bar, $('.sr', w));
  });
  $$('table[data-sort]').forEach(function (tb) {
    var good = tb.hasAttribute('data-announce');
    $$('.thbtn', tb).forEach(function (b) {
      b.addEventListener('click', function () {
        var th = b.closest('th'), col = Array.prototype.indexOf.call(th.parentNode.children, th);
        var asc = b._dir !== 'asc'; b._dir = asc ? 'asc' : 'desc';
        var body = $('tbody', tb), rows = $$('tr', body);
        rows.sort(function (a, c) {
          var x = a.children[col].textContent.trim(), y = c.children[col].textContent.trim();
          var nx = parseFloat(x.replace(/[^0-9.-]/g, '')), ny = parseFloat(y.replace(/[^0-9.-]/g, ''));
          var r = (!isNaN(nx) && !isNaN(ny)) ? nx - ny : x.localeCompare(y); return asc ? r : -r;
        }).forEach(function (r) { body.appendChild(r); });
        $$('.thbtn', tb).forEach(function (o) { if (o !== b) { o._dir = null; $('svg.i', o).style.opacity = .3; o.closest('th').removeAttribute('aria-sort'); if (good) o.setAttribute('data-sr', o.getAttribute('data-name') + ', column header, not sorted, button'); } });
        var ic = $('svg.i', b); ic.style.opacity = 1; ic.style.transform = asc ? '' : 'rotate(180deg)';
        if (good) { th.setAttribute('aria-sort', asc ? 'ascending' : 'descending'); b.setAttribute('data-sr', b.getAttribute('data-name') + ', column header, sorted ' + (asc ? 'ascending' : 'descending') + ', button'); }
        announce(b);
      });
    });
  });

  /* ---------- contrast lab ---------- */
  function lum(rgb) { var a = rgb.map(function (v) { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }); return .2126 * a[0] + .7152 * a[1] + .0722 * a[2]; }
  function hsl(h, s, l) { s /= 100; l /= 100; var k = function (n) { return (n + h / 30) % 12; }, a = s * Math.min(l, 1 - l), f = function (n) { return Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))))); }; return [f(0), f(8), f(4)]; }
  $$('[data-contrast]').forEach(function (lab) {
    var r = $('input[type=range]', lab), sample = $('.c-sample', lab), out = $('.lab-out', lab), verdict = $('.c-verdict', lab);
    var upd = function () {
      var bg = hsl(226, 68, +r.value), ratio = 1.05 / (lum(bg) + .05);
      sample.style.background = 'rgb(' + bg.join(',') + ')'; sample.style.borderColor = 'transparent'; sample.style.color = '#fff';
      out.textContent = ratio.toFixed(1) + ' : 1';
      var v = ratio >= 4.5 ? ['yes', 'Passes. White text on this blue is readable for body-size text (needs 4.5 : 1).'] : ratio >= 3 ? ['no', 'Not enough for normal text. 3 : 1 only passes for large text (24px, or 19px bold) and for icons.'] : ['no', 'Fails. Below 3 : 1, many people cannot read this label at all.'];
      verdict.className = 'c-verdict fb ' + v[0]; verdict.textContent = v[1];
      r.setAttribute('aria-valuetext', 'Contrast ' + ratio.toFixed(1) + ' to 1');
    };
    r.addEventListener('input', upd); upd();
  });

  /* ---------- quiz ---------- */
  $$('[data-quiz]').forEach(function (q) {
    var data = JSON.parse($('script', q).textContent), right = {};
    var score = el('p', 'score'); score.setAttribute('role', 'status');
    data.forEach(function (item, qi) {
      var fs = el('fieldset', '', '<legend>' + (qi + 1) + '. ' + item.q + '</legend>');
      item.a.forEach(function (a, ai) { fs.insertAdjacentHTML('beforeend', '<label class="opt"><input type="radio" name="' + q.id + qi + '" value="' + ai + '"><span>' + a + '</span></label>'); });
      var fb = el('p', 'fb'); fb.hidden = true; fs.appendChild(fb);
      fs.addEventListener('change', function (e) {
        var ok = +e.target.value === item.c; right[qi] = ok; fb.hidden = false;
        fb.className = 'fb ' + (ok ? 'yes' : 'no');
        fb.innerHTML = '<b>' + (ok ? 'Correct. ' : 'Not quite. ') + '</b>' + (ok ? item.why : (item.hint || 'Have another look — try again.'));
        var n = Object.keys(right).length, r = Object.keys(right).filter(function (k) { return right[k]; }).length;
        score.textContent = n === data.length ? 'You got ' + r + ' of ' + data.length + (r === data.length ? ' — you can review a design for this component now.' : '. Change any answer to try again.') : '';
      });
      q.appendChild(fs);
    });
    q.appendChild(score);
  });

  /* ---------- foundations widgets ---------- */
  var keys = $('[data-keys]');
  if (keys) document.addEventListener('keydown', function (e) {
    var k = e.key === ' ' ? 'Space' : e.key.indexOf('Arrow') === 0 ? 'Arrow' : (e.key === 'Tab' && e.shiftKey) ? 'ShiftTab' : e.key;
    var kEl = $('[data-key="' + k + '"]', keys); if (!kEl) return;
    kEl.classList.add('hit', 'done'); setTimeout(function () { kEl.classList.remove('hit'); }, 350);
    var out = $('[data-keys-out]'); if (out) { var n = $$('.done', keys).length, t = $$('[data-key]', keys).length; out.textContent = n === t ? 'All ' + t + ' keys tried. That is the whole keyboard vocabulary of most interfaces.' : n + ' of ' + t + ' keys tried — press the rest.'; }
  });
  function nrs(e) {
    if (!e.closest) return; var lab = e.closest('[data-nrs]'); if (!lab || !e.hasAttribute('data-n')) return;
    var st = e.getAttribute('data-s') || '';
    if (e.hasAttribute('aria-checked')) st = e.getAttribute('aria-checked') === 'true' ? 'on' : 'off';
    else if (e.hasAttribute('aria-pressed')) st = e.getAttribute('aria-pressed') === 'true' ? 'pressed' : 'not pressed';
    else if (e.type === 'checkbox') st = e.checked ? 'checked' : 'not checked';
    var o = $('.nrs-out', lab);
    $('[data-slot="n"]', o).textContent = e.getAttribute('data-n') || '(none — it has no name!)';
    $('[data-slot="r"]', o).textContent = e.getAttribute('data-r');
    $('[data-slot="s"]', o).textContent = st || '—';
  }
  document.addEventListener('change', function (e) { if (e.target.closest && e.target.closest('[data-nrs]')) nrs(e.target); if (e.target.hasAttribute && e.target.hasAttribute('data-sr')) announce(e.target); });
})();
