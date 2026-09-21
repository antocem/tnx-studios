/* ==========================================================================
   REACHERS shared behaviour
   Mobile menu, FAQ accordion, scroll reveal, progress bar, offscreen video
   pausing. Loaded by every page so the behaviour cannot drift between them.
   Page specific work (the homepage hero film) stays in that page's own script.
   ========================================================================== */
(function(){
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  var y = document.querySelector('[data-year]');
  if(y) y.textContent = new Date().getFullYear();

  /* ---------- keep tab focus inside an open overlay ---------- */
  function trap(box, e){
    var f = box.querySelectorAll('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])');
    if(!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
    else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
  }

  /* ---------- mobile menu ---------- */
  var menu = document.getElementById('menu'), opener = null;
  function setMenu(open){
    if(!menu) return;
    menu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    var b = document.querySelector('[data-menu-open]');
    if(b) b.setAttribute('aria-expanded', String(open));
    if(open){
      opener = document.activeElement;
      var l = menu.querySelector('a'); if(l) l.focus();
    }else if(opener){ opener.focus(); opener = null; }
  }

  /* ---------- FAQ accordion ---------- */
  function toggleFaq(btn){
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    if(!panel) return;
    var open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    if(reduce){ panel.style.height = open ? '0px' : 'auto'; return; }
    if(open){
      panel.style.height = panel.scrollHeight + 'px';
      requestAnimationFrame(function(){ panel.style.height = '0px'; });
    }else{
      panel.style.height = panel.scrollHeight + 'px';
      panel.addEventListener('transitionend', function h(){
        panel.style.height = 'auto';
        panel.removeEventListener('transitionend', h);
      });
    }
  }

  document.addEventListener('click', function(e){
    if(e.target.closest('[data-menu-open]'))  return setMenu(true);
    if(e.target.closest('[data-menu-close]')) return setMenu(false);
    var fq = e.target.closest('.faqq');
    if(fq) return toggleFaq(fq);
    /* an in-page jump from inside the menu should close it on the way */
    var link = e.target.closest('.menulinks a,.menufoot a');
    if(link && menu && menu.classList.contains('open')) setMenu(false);
  });

  document.addEventListener('keydown', function(e){
    if(!menu || !menu.classList.contains('open')) return;
    if(e.key === 'Escape') return setMenu(false);
    if(e.key === 'Tab') return trap(menu, e);
  });

  /* ---------- scroll work: progress bar and image parallax ----------
     Both live in one rAF-throttled handler so scrolling never schedules two
     frames of work. The bar uses scaleX rather than width, because width
     forces a layout pass on every frame where a transform stays on the
     compositor. The parallax writes a custom property instead of a transform
     so the hover scale on the same image still composes. */
  var bar  = document.querySelector('.prog i');
  var pars = reduce ? [] : [].slice.call(document.querySelectorAll('.bw.par'));

  if(bar || pars.length){
    var ticking = false;

    var measure = function(){
      if(bar){
        var h = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(window.scrollY / h, 1) : 0) + ')';
      }
      var vh = window.innerHeight;
      for(var i = 0; i < pars.length; i++){
        var r = pars[i].getBoundingClientRect();
        if(r.bottom < -120 || r.top > vh + 120) continue;   /* offscreen, skip */
        /* -0.5 above the fold to +0.5 below it, scaled to a few pixels */
        var mid = (r.top + r.height / 2) / vh;
        pars[i].style.setProperty('--py', ((0.5 - mid) * 26).toFixed(1) + 'px');
      }
      ticking = false;
    };

    window.addEventListener('scroll', function(){
      if(ticking) return;
      ticking = true;
      requestAnimationFrame(measure);
    }, {passive:true});
    measure();
  }

  /* ---------- contact sheet ----------
     Rests on one frame so it reads as a photograph. Hovering thumbs through
     the rest. Touch has no hover, so there it turns over slowly while on
     screen instead. */
  var sheet = document.querySelector('.sheet');
  if(sheet){
    var frames = [].slice.call(sheet.querySelectorAll('img'));
    var num    = sheet.querySelector('.sheetn');
    var si = 0, stimer = null;

    var paint = function(){
      for(var i = 0; i < frames.length; i++) frames[i].classList.toggle('on', i === si);
      if(num) num.textContent = '0' + (si + 1) + ' / 0' + frames.length;
    };
    var run = function(ms){
      clearInterval(stimer);
      stimer = setInterval(function(){ si = (si + 1) % frames.length; paint(); }, ms);
    };
    var rest = function(){ clearInterval(stimer); si = 0; paint(); };

    paint();
    if(!reduce && frames.length > 1){
      sheet.addEventListener('mouseenter', function(){ run(420); });
      sheet.addEventListener('mouseleave', rest);
      if(window.matchMedia('(hover:none)').matches && 'IntersectionObserver' in window){
        new IntersectionObserver(function(es){
          es.forEach(function(e){ e.isIntersecting ? run(2200) : rest(); });
        }, {threshold:.4}).observe(sheet);
      }
    }
  }

  /* ---------- reveal on scroll ---------- */
  var els = [].slice.call(document.querySelectorAll('[data-r]'));
  if(reduce || !('IntersectionObserver' in window)){
    els.forEach(function(el){ el.classList.add('on'); });
  }else{
    els.forEach(function(el){
      var d = el.getAttribute('data-rd');
      if(d) el.style.transitionDelay = d + 's';
    });
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){ en.target.classList.add('on'); io.unobserve(en.target); }
      });
    }, {rootMargin:'0px 0px -7% 0px', threshold:.05});
    els.forEach(function(el){ io.observe(el); });
  }

  /* ---------- don't decode video nobody is looking at ---------- */
  if('IntersectionObserver' in window){
    var vio = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        var v = en.target;
        if(v.closest('#herofilm')) return;   /* the hero film runs its own sequencer */
        if(en.isIntersecting){ var p = v.play(); if(p && p.catch) p.catch(function(){}); }
        else v.pause();
      });
    }, {rootMargin:'160px'});
    [].slice.call(document.querySelectorAll('video')).forEach(function(v){ vio.observe(v); });
  }
})();
