/* ═══════════════════════════════════════════════════════════════════════
   KIRONPUNOJA — holding page
   Two ambient fields, no dependencies:
     1. the mark smoulders — an ember field drifting up behind the logo,
        clipped to the silhouette by the CSS mask;
     2. a few embers have escaped, drifting up the open page.
   Both honour prefers-reduced-motion by rendering a single frame.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  var rand = function (a, b) { return a + Math.random() * (b - a); };

  /* Assigned inside the guards below. Declared here because a function
     *declaration* inside an `if` block is block-scoped in strict mode and
     would not be visible to the driver at the foot of this file. */
  var sizeField, drawField, seedAsh, drawAsh;

  /* ── Shared palette, read from CSS so there is one source of truth ─── */
  var css  = getComputedStyle(document.documentElement);
  var INK  = (css.getPropertyValue('--ink')  || '#0A0A0B').trim();
  var BONE = (css.getPropertyValue('--bone') || '#E8E2D4').trim();
  var SULPHUR = (css.getPropertyValue('--sulphur') || '#C7BC3E').trim();

  function rgb(hex) {
    var h = hex.replace('#', '');
    return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)];
  }
  var INK_RGB = rgb(INK), SUL_RGB = rgb(SULPHUR);
  function rgba(c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }

  /* Soft radial blob — the only drawing primitive either field needs. */
  function blob(ctx, x, y, r, colour, alpha) {
    var g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, rgba(colour, alpha));
    g.addColorStop(1, rgba(colour, 0));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }


  /* ═══ 1. THE SMOULDERING MARK ═══════════════════════════════════════
     Painted at a deliberately tiny resolution and scaled up: the browser's
     own bilinear filtering does the blurring, so the field costs a handful
     of gradients per frame instead of hundreds of full-size ones.         */
  var field = document.querySelector('.mark__canvas');

  if (field) {
    var view = field.getContext('2d');

    var FW = 200, FH = 110;                       // field resolution
    var src = document.createElement('canvas');
    src.width = FW; src.height = FH;
    var ctx = src.getContext('2d');

    // Shadow blobs mottle the bone so the thorns are never a flat fill.
    var shade = [];
    for (var i = 0; i < 7; i++) {
      shade.push({
        x: rand(0, FW), y: rand(0, FH), r: rand(28, 62),
        vx: rand(-0.05, 0.05), vy: rand(-0.03, 0.03), a: rand(0.30, 0.62)
      });
    }

    // Embers rise, sway, and wrap — the page never resolves or repeats.
    var embers = [];
    for (var j = 0; j < 13; j++) {
      embers.push({
        x: rand(0, FW), y: rand(0, FH), r: rand(11, 30),
        vy: rand(0.06, 0.20), phase: rand(0, Math.PI * 2),
        sway: rand(0.10, 0.34), a: rand(0.13, 0.36)
      });
    }

    sizeField = function () {
      var box = field.getBoundingClientRect();
      if (!box.width) return false;
      field.width  = Math.max(1, Math.round(box.width  * DPR));
      field.height = Math.max(1, Math.round(box.height * DPR));
      return true;
    };

    drawField = function (t) {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = BONE;
      ctx.fillRect(0, 0, FW, FH);

      shade.forEach(function (s) {
        s.x += s.vx; s.y += s.vy;
        if (s.x < -s.r) s.x = FW + s.r; if (s.x > FW + s.r) s.x = -s.r;
        if (s.y < -s.r) s.y = FH + s.r; if (s.y > FH + s.r) s.y = -s.r;
        blob(ctx, s.x, s.y, s.r, INK_RGB, s.a);
      });

      embers.forEach(function (e) {
        e.y -= e.vy;
        if (e.y < -e.r) { e.y = FH + e.r; e.x = rand(0, FW); }
        var x = e.x + Math.sin(t * 0.0004 + e.phase) * (e.sway * 26);
        blob(ctx, x, e.y, e.r, SUL_RGB, e.a);
      });

      view.imageSmoothingEnabled = true;
      view.imageSmoothingQuality = 'high';
      view.clearRect(0, 0, field.width, field.height);
      view.drawImage(src, 0, 0, FW, FH, 0, 0, field.width, field.height);
    };
  }


  /* ═══ 2. ESCAPED EMBERS ═════════════════════════════════════════════ */
  var ash = document.querySelector('.ash');
  var motes = [];

  if (ash) {
    var actx = ash.getContext('2d');

    seedAsh = function () {
      var w = ash.clientWidth, h = ash.clientHeight;
      if (!w || !h) return false;
      ash.width  = Math.round(w * DPR);
      ash.height = Math.round(h * DPR);

      var count = Math.round(Math.min(38, Math.max(11, (w * h) / 46000)));
      motes = [];
      for (var i = 0; i < count; i++) {
        motes.push({
          x: rand(0, w), y: rand(0, h), r: rand(0.6, 1.9),
          vy: rand(0.06, 0.24), phase: rand(0, Math.PI * 2),
          sway: rand(6, 22), a: rand(0.14, 0.46),
          warm: Math.random() < 0.55
        });
      }
      return true;
    };

    drawAsh = function (t) {
      var w = ash.clientWidth, h = ash.clientHeight;
      actx.setTransform(DPR, 0, 0, DPR, 0, 0);
      actx.clearRect(0, 0, w, h);

      motes.forEach(function (m) {
        m.y -= m.vy;
        if (m.y < -4) { m.y = h + 4; m.x = rand(0, w); }
        var x = m.x + Math.sin(t * 0.0003 + m.phase) * m.sway;
        var c = m.warm ? SUL_RGB : [232, 226, 212];
        blob(actx, x, m.y, m.r * 5, c, m.a * 0.5);   // halo
        actx.fillStyle = rgba(c, m.a);
        actx.beginPath();
        actx.arc(x, m.y, m.r, 0, Math.PI * 2);
        actx.fill();
      });
    };
  }


  /* ═══ DRIVE ═════════════════════════════════════════════════════════ */
  var ready = false;

  function measure() {
    var a = field ? sizeField() : true;
    var b = ash ? seedAsh() : true;
    ready = a && b;
    return ready;
  }

  function frame(t) {
    if (!document.hidden) {          // idle in a background tab
      if (field) drawField(t);
      if (ash) drawAsh(t);
    }
    requestAnimationFrame(frame);
  }

  function start() {
    if (!measure()) { requestAnimationFrame(start); return; }   // await layout
    if (reduced) {
      if (field) drawField(0);
      if (ash) drawAsh(0);
      return;                        // one frame, then still
    }
    requestAnimationFrame(frame);
  }

  start();

  var t;
  window.addEventListener('resize', function () {
    clearTimeout(t);
    t = setTimeout(function () {
      measure();
      if (reduced) { if (field) drawField(0); if (ash) drawAsh(0); }
    }, 150);
  }, { passive: true });

}());
