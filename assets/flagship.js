/* ==========================================================================
   TNX Studios — Flagship motion system
   One rAF loop for all scroll-linked work. IntersectionObserver for reveals.
   Everything degrades to a static, readable page without JS or with
   prefers-reduced-motion.
   ========================================================================== */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };

  /* ---------------------------------------------------------------------
     Reveals
     --------------------------------------------------------------------- */
  var rv = document.querySelectorAll('[data-rv]');
  if (reduce || !('IntersectionObserver' in window)) {
    rv.forEach(function (el) { el.classList.add('rv'); });
  } else {
    var rvIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var d = parseFloat(en.target.getAttribute('data-rv-d')) || 0;
        if (d) en.target.style.transitionDelay = d + 's';
        en.target.classList.add('rv');
        rvIO.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
    rv.forEach(function (el) { rvIO.observe(el); });
  }

  /* ---------------------------------------------------------------------
     Counters  [data-cnt="1284"] [data-cnt-dec="1"] [data-cnt-suf="%"]
     --------------------------------------------------------------------- */
  function runCount(el) {
    var target = parseFloat(el.getAttribute('data-cnt')) || 0;
    var dec = parseInt(el.getAttribute('data-cnt-dec') || '0', 10);
    var suf = el.getAttribute('data-cnt-suf') || '';
    var pre = el.getAttribute('data-cnt-pre') || '';
    var dur = parseInt(el.getAttribute('data-cnt-dur') || '1500', 10);
    if (reduce) {
      el.textContent = pre + target.toLocaleString('en-US',
        { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
      return;
    }
    var t0 = null;
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = clamp((ts - t0) / dur, 0, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + (target * e).toLocaleString('en-US',
        { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('[data-cnt]');
  if (!('IntersectionObserver' in window)) {
    counters.forEach(runCount);
  } else {
    var cIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        runCount(en.target);
        cIO.unobserve(en.target);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cIO.observe(el); });
  }

  /* ---------------------------------------------------------------------
     Creator fit rings
     --------------------------------------------------------------------- */
  var crcards = document.querySelectorAll('.crcard');
  if (crcards.length) {
    if (!('IntersectionObserver' in window) || reduce) {
      crcards.forEach(function (c) { c.classList.add('rv'); });
    } else {
      var kIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          en.target.classList.add('rv');
          kIO.unobserve(en.target);
        });
      }, { threshold: 0.4 });
      crcards.forEach(function (c, i) {
        c.querySelector('.crfit .vl') &&
          c.querySelector('.crfit .vl').style.setProperty('--d', (i * 0.1) + 's');
        kIO.observe(c);
      });
    }
  }

  /* ---------------------------------------------------------------------
     HERO FLOW — one product, three creators, one distribution surface.
     Six curves, one per relationship. Nothing shares a rail, so every
     path can be followed from where it starts to where it ends.
     Geometry is measured off the grid, so it survives any viewport.
     --------------------------------------------------------------------- */
  (function () {
    var flow = document.querySelector('.flow');
    if (!flow) return;
    var svg = flow.querySelector('svg.floww');
    var host = flow.querySelector('[data-flow-paths]');
    if (!svg || !host) return;

    function box(el) {
      var s = flow.getBoundingClientRect(), r = el.getBoundingClientRect();
      return {
        l: r.left - s.left, r: r.right - s.left,
        t: r.top - s.top, b: r.bottom - s.top,
        cy: r.top - s.top + r.height / 2
      };
    }

    // Horizontal-tangent cubic: leaves its source flat and arrives flat, so
    // curves never appear to clip into the side of a node.
    function curve(x1, y1, x2, y2) {
      var f = function (n) { return n.toFixed(1); };
      var dx = Math.max(26, (x2 - x1) * 0.55);
      return 'M' + f(x1) + ' ' + f(y1) +
             ' C' + f(x1 + dx) + ' ' + f(y1) +
             ' ' + f(x2 - dx) + ' ' + f(y2) +
             ' ' + f(x2) + ' ' + f(y2);
    }

    function draw() {
      var s = flow.getBoundingClientRect();
      if (!s.width) return;
      svg.setAttribute('viewBox', '0 0 ' + s.width + ' ' + s.height);
      ['flowRail', 'flowPulse'].forEach(function (id) {
        var g = svg.querySelector('#' + id);
        if (g) g.setAttribute('x2', s.width);
      });

      // curves are a desktop affordance; the stacked mobile layout drops them
      if (window.matchMedia('(max-width:820px)').matches) {
        host.textContent = '';
        return;
      }

      var product = flow.querySelector('[data-flow="product"]');
      var creators = [].slice.call(flow.querySelectorAll('[data-flow="creator"]'));
      var dist = flow.querySelector('[data-flow="dist"]');
      if (!product || !creators.length || !dist) return;

      var pb = box(product), db = box(dist);
      var GAP = 7;
      var segs = [];

      // stage 1 · the product out to each creator
      creators.forEach(function (c, i) {
        var cb = box(c);
        segs.push({ d: curve(pb.r + GAP, pb.cy, cb.l - GAP, cb.cy), delay: i * 0.1 });
      });

      // stage 2 · each creator into the distribution panel, entering at its
      // own height so the three arrivals stay separate
      var n = creators.length;
      creators.forEach(function (c, i) {
        var cb = box(c);
        var t = n === 1 ? 0.5 : 0.26 + (i / (n - 1)) * 0.48;
        var y = db.t + (db.b - db.t) * t;
        segs.push({ d: curve(cb.r + GAP, cb.cy, db.l - GAP, y), delay: 1.5 + i * 0.1 });
      });

      var NS = 'http://www.w3.org/2000/svg';
      var frag = document.createDocumentFragment();

      segs.forEach(function (sg) {
        var rail = document.createElementNS(NS, 'path');
        rail.setAttribute('class', 'frail');
        rail.setAttribute('d', sg.d);
        frag.appendChild(rail);
      });

      if (!reduce) {
        // wide soft stroke under a thin bright one reads as a lit packet,
        // and costs far less than an SVG blur filter
        segs.forEach(function (sg) {
          ['fglow', 'fpulse'].forEach(function (cls) {
            var pl = document.createElementNS(NS, 'path');
            pl.setAttribute('class', cls);
            pl.setAttribute('d', sg.d);
            pl.style.setProperty('--d', sg.delay + 's');
            frag.appendChild(pl);
          });
        });
      }

      host.textContent = '';
      host.appendChild(frag);
    }

    draw();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
    window.addEventListener('load', draw);
    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt); rt = setTimeout(draw, 160);
    }, { passive: true });
  })();

  /* ---------------------------------------------------------------------
     PLATFORM — callouts zoom the matching dashboard cell
     --------------------------------------------------------------------- */
  (function () {
    var tabs = [].slice.call(document.querySelectorAll('.bitab'));
    var panels = [].slice.call(document.querySelectorAll('[data-bi-panel]'));
    if (!tabs.length || !panels.length) return;
    function show(key) {
      tabs.forEach(function (t) {
        var on = t.getAttribute('data-bi') === key;
        t.classList.toggle('on', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      panels.forEach(function (p) {
        p.classList.toggle('on', p.getAttribute('data-bi-panel') === key);
      });
    }
    tabs.forEach(function (t) {
      t.addEventListener('click', function () { show(t.getAttribute('data-bi')); });
    });
  })();

  /* ---------------------------------------------------------------------
     Chaos workspace panel — scale to fit the sticky stage.
     The panel is a fixed-proportion dashboard, so on a short viewport it
     would otherwise run under the headline and off the bottom.
     --------------------------------------------------------------------- */
  (function () {
    var order = document.querySelector('.order');
    var arena = document.querySelector('.chaosarena');
    if (!order || !arena) return;
    function fit() {
      // offsetHeight is the untransformed layout height, so measuring it
      // here does not feed the previous scale back into the next one.
      var natural = order.offsetHeight;
      var room = arena.clientHeight;
      if (!natural || !room) return;
      var s = Math.min(1, (room - 6) / natural);
      order.style.setProperty('--os', s.toFixed(3));
    }
    fit();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    window.addEventListener('load', fit);
    var ft;
    window.addEventListener('resize', function () {
      clearTimeout(ft); ft = setTimeout(fit, 140);
    }, { passive: true });
  })();

  /* ---------------------------------------------------------------------
     Scroll-linked sections — single rAF loop
     --------------------------------------------------------------------- */
  var chaosTrack = document.querySelector('.chaostrack');
  var chaosStage = document.querySelector('.chaostage');
  var campTrack = document.querySelector('.camptrack');
  var campSlides = document.querySelectorAll('.campslide');
  var campSteps = document.querySelectorAll('.campstep');

  function progressOf(track) {
    var r = track.getBoundingClientRect();
    var total = r.height - window.innerHeight;
    if (total <= 0) return 0;
    return clamp(-r.top / total, 0, 1);
  }

  var ticking = false;
  function frame() {
    ticking = false;

    if (chaosTrack && chaosStage) {
      var p = progressOf(chaosTrack);
      // hold the chaos for the first stretch, then collapse
      var cp = clamp((p - 0.12) / 0.62, 0, 1);
      chaosStage.style.setProperty('--p', cp.toFixed(4));
    }

    if (campTrack && campSlides.length) {
      var q = progressOf(campTrack);
      var n = campSlides.length;
      // spread slides across the track with a small lead-in/lead-out
      var raw = clamp((q - 0.04) / 0.9, 0, 0.9999) * n;
      var idx = Math.floor(raw);
      var within = raw - idx;
      for (var i = 0; i < n; i++) {
        campSlides[i].classList.toggle('on', i === idx);
      }
      for (var j = 0; j < campSteps.length; j++) {
        var fill = j < idx ? 100 : j === idx ? within * 100 : 0;
        campSteps[j].style.setProperty('--fill', fill + '%');
        campSteps[j].classList.toggle('on', j === idx);
      }
    }
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(frame);
  }

  if (!reduce && (chaosTrack || campTrack)) {
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    frame();
  } else {
    // static fallback: show the resolved state
    if (chaosStage) chaosStage.style.setProperty('--p', '1');
    campSlides.forEach(function (s) { s.classList.add('on'); });
    campSteps.forEach(function (s) { s.classList.add('on'); s.style.setProperty('--fill', '100%'); });
  }

  /* ---------------------------------------------------------------------
     Mouse-responsive lighting (desktop, pointer:fine only)
     --------------------------------------------------------------------- */
  if (!reduce && window.matchMedia('(pointer:fine)').matches) {
    var lit = document.querySelectorAll('[data-lit]');
    if (lit.length) {
      lit.forEach(function (el) {
        el.addEventListener('pointermove', function (e) {
          var r = el.getBoundingClientRect();
          el.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
          el.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
        });
      });
    }
  }

  /* ---------------------------------------------------------------------
     Lazy background images  [data-bg="url"]
     --------------------------------------------------------------------- */
  var lazy = document.querySelectorAll('[data-bg]');
  if (lazy.length) {
    if (!('IntersectionObserver' in window)) {
      lazy.forEach(function (el) { el.style.backgroundImage = "url('" + el.getAttribute('data-bg') + "')"; });
    } else {
      var lIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          var el = en.target;
          el.style.backgroundImage = "url('" + el.getAttribute('data-bg') + "')";
          lIO.unobserve(el);
        });
      }, { rootMargin: '300px 0px' });
      lazy.forEach(function (el) { lIO.observe(el); });
    }
  }

  /* ---------------------------------------------------------------------
     Year stamp
     --------------------------------------------------------------------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
