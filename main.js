/* ═══════════════════════════════════════════════════════════════════════
   KIRONPUNOJA — interaction layer
   No dependencies. Restrained motion: mask reveals, a scroll-aware
   masthead, nothing that fights the user. Honours prefers-reduced-motion.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Current year in the colophon ─────────────────────────────────── */
  var year = document.getElementById('vuosi');
  if (year) year.textContent = new Date().getFullYear();


  /* ── Split text into masked units ─────────────────────────────────────
     Each word (or character) gets its own overflow-hidden wrapper so the
     reveal survives line wrapping instead of clipping across lines.      */
  function split(el, mode) {
    var text = el.textContent.trim();
    var parts = mode === 'chars' ? Array.from(text) : text.split(/\s+/);
    var frag = document.createDocumentFragment();

    parts.forEach(function (part, i) {
      if (part === ' ') { frag.appendChild(document.createTextNode(' ')); return; }

      var mask = document.createElement('span');
      mask.className = 'line';
      mask.setAttribute('aria-hidden', 'true');

      var unit = document.createElement('span');
      unit.className = 'unit';
      unit.style.setProperty('--i', i);
      unit.textContent = part;

      mask.appendChild(unit);
      frag.appendChild(mask);
      if (mode !== 'chars' && i < parts.length - 1) {
        frag.appendChild(document.createTextNode(' '));
      }
    });

    /* The split markup is decorative; keep the real string for assistive
       tech and for anyone who copies the text. */
    var sr = document.createElement('span');
    sr.className = 'visually-hidden';
    sr.textContent = text;

    el.textContent = '';
    el.appendChild(sr);
    el.appendChild(frag);
  }

  var splits = document.querySelectorAll('[data-split]');
  if (!reduced) {
    splits.forEach(function (el) { split(el, el.getAttribute('data-split')); });
  }


  /* ── Reveal on entry ──────────────────────────────────────────────── */
  var targets = document.querySelectorAll('[data-reveal], [data-split]');

  if (reduced || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);          /* reveal once, then let go */
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    targets.forEach(function (el) { io.observe(el); });

    /* Above-the-fold content should animate in on load, not wait for a
       scroll event that may never come. */
    requestAnimationFrame(function () {
      document.querySelectorAll('.hero [data-reveal], .hero [data-split]')
        .forEach(function (el) { el.classList.add('is-in'); io.unobserve(el); });
    });
  }


  /* ── Fit the text wordmark flush to its column ─────────────────────
     A vw-derived font-size can only ever guess at the width of eleven
     glyphs in a given face. Measure instead, so the wordmark hits the
     column edge exactly — at any viewport, in any fallback font.        */
  var wordmark = document.querySelector('.wordmark');

  function fitWordmark() {
    if (!wordmark) return;
    var avail = wordmark.parentElement.clientWidth;
    if (!avail) return;

    var PROBE = 100;

    /* Measure shrink-to-fit. `scrollWidth` on a block element does not
       report overflowing white-space:nowrap inline content, so the element
       has to be inline-block for the duration of the measurement. */
    var prevDisplay = wordmark.style.display;
    wordmark.style.fontSize = PROBE + 'px';
    wordmark.style.display = 'inline-block';
    var natural = wordmark.offsetWidth;
    wordmark.style.display = prevDisplay;

    if (!natural) { wordmark.style.fontSize = ''; return; }

    wordmark.style.fontSize = (PROBE * avail / natural) * 0.995 + 'px';
  }

  if (wordmark) {
    fitWordmark();
    /* Re-fit once the real face lands — Bodoni's metrics are nothing like
       the fallback serif's. */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(fitWordmark);
    }
    var t;
    window.addEventListener('resize', function () {
      clearTimeout(t);
      t = setTimeout(fitWordmark, 120);
    }, { passive: true });
  }


  /* ── Masthead: appears only once the hero wordmark is gone ────────── */
  var masthead = document.getElementById('masthead');
  var hero = document.querySelector('.hero');

  if (masthead && hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      masthead.classList.toggle('is-visible', !entries[0].isIntersecting);
    }, { rootMargin: '-72% 0px 0px 0px' }).observe(hero);
  }

}());
