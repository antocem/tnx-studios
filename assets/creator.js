/* TNX Studios — creator programme motion layer */
(function(){
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- reveal-once triggers for the choreographed blocks ----------
     Anything with [data-seen] (or the dashboard / vs comparison) gets a
     .seen class the first time it enters the viewport, which is what the
     CSS transitions key off. */
  var blocks = [].slice.call(document.querySelectorAll('[data-seen],[data-dash],.vs'));
  if(blocks.length){
    if(!('IntersectionObserver' in window) || reduce){
      blocks.forEach(function(b){ b.classList.add('seen'); });
    } else {
      var bio = new IntersectionObserver(function(entries){
        entries.forEach(function(en){
          if(!en.isIntersecting) return;
          en.target.classList.add('seen');
          bio.unobserve(en.target);
        });
      },{ threshold: .18, rootMargin: '0px 0px -6% 0px' });
      blocks.forEach(function(b){ bio.observe(b); });
    }
  }

  /* ---------- marquee: duplicate rows so the loop is seamless ---------- */
  document.querySelectorAll('.lmrow').forEach(function(row){
    if(row.dataset.cloned) return;
    row.dataset.cloned = '1';
    /* content is already doubled server-side; only clone if it is not */
    if(row.scrollWidth < row.parentElement.clientWidth * 2){
      row.innerHTML = row.innerHTML + row.innerHTML;
    }
  });

  if(reduce) return;

  /* ---------- parallax: hero roster stack drifts against the scroll ---------- */
  var stack = document.querySelector('.rstack');
  var motes = document.querySelector('.motes');
  if(stack || motes){
    var ticking = false;
    window.addEventListener('scroll', function(){
      if(ticking) return;
      ticking = true;
      requestAnimationFrame(function(){
        var y = window.scrollY;
        if(y < 1200){
          if(stack) stack.style.transform = 'translateY(' + (y * -0.045) + 'px)';
          if(motes) motes.style.transform = 'translateY(' + (y * 0.09) + 'px)';
        }
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- pointer-tracked sheen on the premium cards ---------- */
  document.querySelectorAll('.scard,.rcrd,.camp,.quote').forEach(function(el){
    el.addEventListener('pointermove', function(e){
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      el.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
  });

  /* ---------- roster stack: gentle tilt toward the cursor ---------- */
  if(stack && window.matchMedia('(min-width:1001px)').matches){
    stack.addEventListener('pointermove', function(e){
      var r = stack.getBoundingClientRect();
      var dx = (e.clientX - r.left) / r.width - .5;
      var dy = (e.clientY - r.top) / r.height - .5;
      stack.style.setProperty('--tx', (dx * 10).toFixed(2) + 'px');
      stack.style.setProperty('--ty', (dy * 8).toFixed(2) + 'px');
    });
    stack.addEventListener('pointerleave', function(){
      stack.style.setProperty('--tx','0px');
      stack.style.setProperty('--ty','0px');
    });
  }
})();
