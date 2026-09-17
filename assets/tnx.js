/* TNX Studios — shared site behaviour */
(function(){
  'use strict';

  var CAL_URL='https://calendar.app.google/AH6YUHjwGhJ7ru8NA';
  var MAIL='antoce@technexa.eu';

  /* ---------- sticky header ---------- */
  var nav=document.querySelector('.nav');
  function onScroll(){
    if(!nav) return;
    if(window.scrollY>12) nav.classList.add('stuck');
    else nav.classList.remove('stuck');
  }
  window.addEventListener('scroll',onScroll,{passive:true});
  onScroll();

  /* ---------- mobile menu ---------- */
  var toggle=document.querySelector('.navtoggle');
  if(toggle&&nav){
    toggle.addEventListener('click',function(){
      var open=nav.classList.toggle('menuopen');
      toggle.setAttribute('aria-expanded',open?'true':'false');
      document.body.style.overflow=open?'hidden':'';
    });
  }
  function closeMenu(){
    if(!nav) return;
    nav.classList.remove('menuopen');
    document.body.style.overflow='';
    if(toggle) toggle.setAttribute('aria-expanded','false');
  }

  /* ---------- services dropdown ----------
     Two modes:
       hover  -> opens on hover, closes when the pointer leaves (with a grace delay)
       pinned -> user clicked the trigger; stays open until they click away or press Esc
  */
  var dd=document.querySelector('.navdd');
  if(dd){
    var ddBtn=dd.querySelector('.navlink');
    var mq=window.matchMedia('(min-width:941px)');
    var closeTimer=null, pinned=false;

    function ddOpen(){ if(closeTimer){clearTimeout(closeTimer);closeTimer=null;}
      dd.classList.add('open'); ddBtn.setAttribute('aria-expanded','true'); }
    function ddClose(){ if(closeTimer){clearTimeout(closeTimer);closeTimer=null;}
      pinned=false; dd.classList.remove('open','pinned');
      ddBtn.setAttribute('aria-expanded','false'); }
    function ddCloseSoon(){
      if(pinned) return;                 /* pinned stays open */
      if(closeTimer) clearTimeout(closeTimer);
      closeTimer=setTimeout(function(){ if(!pinned) ddClose(); },260);
    }

    ddBtn.addEventListener('click',function(e){
      e.preventDefault(); e.stopPropagation();
      if(pinned){ ddClose(); }
      else { pinned=true; dd.classList.add('pinned'); ddOpen(); }
    });

    dd.addEventListener('mouseenter',function(){ if(mq.matches) ddOpen(); });
    dd.addEventListener('mouseleave',function(){ if(mq.matches) ddCloseSoon(); });
    /* keep it open while the pointer is anywhere inside the panel */
    dd.addEventListener('pointerenter',function(){ if(closeTimer){clearTimeout(closeTimer);closeTimer=null;} });

    /* clicking a link inside should navigate, not just unpin */
    dd.addEventListener('click',function(e){ e.stopPropagation(); });

    document.addEventListener('click',function(e){
      if(!dd.contains(e.target)) ddClose();
    });
    window.tnxCloseDropdown=ddClose;
  }
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'){ if(window.tnxCloseDropdown) window.tnxCloseDropdown(); closeMenu(); closeContact(); }
  });
  /* Close the mobile menu when a real destination is tapped. The Services
     trigger is not a destination — tapping it must open the submenu, not
     dismiss the menu underneath it. */
  document.querySelectorAll('.navlinks a[href]').forEach(function(a){
    a.addEventListener('click',function(){
      var owner=a.closest('.navdd');
      if(owner && a===owner.querySelector(':scope > .navlink')) return;
      closeMenu();
    });
  });

  /* ---------- reveal on scroll ---------- */
  var rise=document.querySelectorAll('[data-rise]');
  if('IntersectionObserver' in window && rise.length){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){
          var d=parseFloat(en.target.getAttribute('data-rise'))||0;
          setTimeout(function(){en.target.classList.add('in');},d*1000);
          io.unobserve(en.target);
        }
      });
    },{rootMargin:'0px 0px -8% 0px',threshold:.08});
    rise.forEach(function(el){io.observe(el);});
  } else {
    rise.forEach(function(el){el.classList.add('in');});
  }

  /* ---------- service card pointer glow ---------- */
  document.querySelectorAll('.svcard').forEach(function(c){
    c.addEventListener('pointermove',function(e){
      var r=c.getBoundingClientRect();
      c.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');
      c.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%');
    });
  });


  /* dropdown item spotlight follows the pointer */
  document.querySelectorAll('.dditem,.sdditem').forEach(function(it){
    it.addEventListener('pointermove',function(e){
      var r=it.getBoundingClientRect();
      it.style.setProperty('--px',((e.clientX-r.left)/r.width*100)+'%');
      it.style.setProperty('--py',((e.clientY-r.top)/r.height*100)+'%');
    });
  });


  /* ---------- industry showcase tabs ---------- */
  (function(){
    var tabs=document.querySelectorAll('.indtab');
    var panels=document.querySelectorAll('.indpanel');
    if(!tabs.length||!panels.length) return;
    tabs.forEach(function(t){
      t.addEventListener('click',function(){
        var k=t.getAttribute('data-tab');
        tabs.forEach(function(x){
          var on=(x===t);
          x.classList.toggle('on',on);
          x.setAttribute('aria-selected',on?'true':'false');
        });
        panels.forEach(function(p){
          p.classList.toggle('on',p.getAttribute('data-panel')===k);
        });
      });
    });
    /* left/right arrows move between industries */
    document.querySelectorAll('.indtabs').forEach(function(bar){
      bar.addEventListener('keydown',function(e){
        if(e.key!=='ArrowRight'&&e.key!=='ArrowLeft') return;
        var list=Array.prototype.slice.call(tabs);
        var cur=list.indexOf(document.activeElement);
        if(cur<0) return;
        e.preventDefault();
        var nxt=list[(cur+(e.key==='ArrowRight'?1:list.length-1))%list.length];
        nxt.focus(); nxt.click();
      });
    });
  })();

  /* ---------- campaign showcase filter ---------- */
  (function(){
    var btns=document.querySelectorAll('.shbtn');
    var items=document.querySelectorAll('.shitem');
    if(!btns.length||!items.length) return;
    btns.forEach(function(b){
      b.addEventListener('click',function(){
        var ch=b.getAttribute('data-ch');
        btns.forEach(function(x){x.classList.toggle('on',x===b);});
        items.forEach(function(it,i){
          var match=(ch==='all')||it.getAttribute('data-ch')===ch;
          it.style.transitionDelay=(i*0.03)+'s';
          it.classList.toggle('dim',!match);
        });
        setTimeout(function(){items.forEach(function(it){it.style.transitionDelay='';});},600);
      });
    });
  })();

  /* ---------- faq ---------- */
  document.querySelectorAll('.faqi').forEach(function(item){
    var q=item.querySelector('.faqq'), a=item.querySelector('.faqa');
    if(!q||!a) return;
    q.addEventListener('click',function(){
      var open=item.classList.toggle('open');
      q.setAttribute('aria-expanded',open?'true':'false');
      a.style.maxHeight=open?(a.scrollHeight+'px'):'0px';
    });
  });
  window.addEventListener('resize',function(){
    document.querySelectorAll('.faqi.open .faqa').forEach(function(a){a.style.maxHeight=a.scrollHeight+'px';});
  });

  /* ---------- marquee: duplicate content for a seamless loop ---------- */
  document.querySelectorAll('.marqrow').forEach(function(row){
    if(row.dataset.cloned) return;
    row.dataset.cloned='1';
    row.innerHTML=row.innerHTML+row.innerHTML;
  });

  /* ---------- contact dialog ---------- */
  var lastFocus=null;
  function buildContact(){
    if(document.getElementById('tnxContact')) return;
    var d=document.createElement('div');
    d.id='tnxContact';
    d.innerHTML=
      '<div class="tnxc-back" data-cclose></div>'+
      '<div class="tnxc-panel" role="dialog" aria-modal="true" aria-labelledby="tnxc-t">'+
        '<button class="tnxc-x" type="button" data-cclose aria-label="Close">'+
          '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>'+
        '<span class="eyebrow lime">Let’s build</span>'+
        '<h3 id="tnxc-t">Pick whichever is easier.</h3>'+
        '<p class="sub">Tell us what you sell and how often you need to publish. We’ll come back with a plan and a number.</p>'+
        '<div class="tnxc-opts">'+
          '<a class="tnxc-opt" href="'+CAL_URL+'" target="_blank" rel="noopener">'+
            '<span class="tnxc-ico"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2.4"/><path d="M8 3v4M16 3v4M3 11h18"/></svg></span>'+
            '<b>Book a meeting</b><span>30 minutes, screen shared, real numbers.</span></a>'+
          '<a class="tnxc-opt" href="mailto:'+MAIL+'?subject=TNX%20Studios%20%E2%80%94%20project%20enquiry">'+
            '<span class="tnxc-ico"><svg viewBox="0 0 24 24"><rect x="2.5" y="5" width="19" height="14" rx="2.4"/><path d="M3 7l9 6 9-6"/></svg></span>'+
            '<b>Send an email</b><span>'+MAIL+'</span></a>'+
        '</div>'+
      '</div>';
    document.body.appendChild(d);
    d.addEventListener('click',function(e){ if(e.target.closest('[data-cclose]')) closeContact(); });
  }
  function openContact(){
    buildContact();
    lastFocus=document.activeElement;
    var d=document.getElementById('tnxContact');
    requestAnimationFrame(function(){ d.classList.add('open'); });
    document.body.style.overflow='hidden';
    closeMenu();
  }
  function closeContact(){
    var d=document.getElementById('tnxContact');
    if(!d||!d.classList.contains('open')) return;
    d.classList.remove('open');
    document.body.style.overflow='';
    if(lastFocus&&lastFocus.focus) lastFocus.focus();
  }
  document.addEventListener('click',function(e){
    var t=e.target.closest('[data-contact]');
    if(t){ e.preventDefault(); openContact(); }
  });
  window.tnxOpenContact=openContact;

  /* ---------- count-up stats ---------- */
  var counters=document.querySelectorAll('[data-count]');
  if('IntersectionObserver' in window && counters.length){
    var cio=new IntersectionObserver(function(en){
      en.forEach(function(x){
        if(!x.isIntersecting) return;
        cio.unobserve(x.target);
        var el=x.target, to=parseFloat(el.getAttribute('data-count'))||0;
        var pre=el.getAttribute('data-pre')||'', post=el.getAttribute('data-post')||'';
        var dp=(String(to).split('.')[1]||'').length;
        var t0=null, dur=1250;
        function tick(ts){
          if(!t0) t0=ts;
          var p=Math.min(1,(ts-t0)/dur), e=1-Math.pow(1-p,3);
          el.textContent=pre+(to*e).toLocaleString('en-US',{minimumFractionDigits:dp,maximumFractionDigits:dp})+post;
          if(p<1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    },{threshold:.4});
    counters.forEach(function(c){cio.observe(c);});
  }

  /* ---------- year ---------- */
  document.querySelectorAll('[data-year]').forEach(function(el){
    el.textContent=new Date().getFullYear();
  });
})();

/* ---------- reel videos: play only while on screen ---------- */
(function(){
  var vids=[].slice.call(document.querySelectorAll('.vcard video'));
  if(!vids.length) return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    vids.forEach(function(v){ v.removeAttribute('autoplay'); v.pause(); });
    return;
  }
  if(!('IntersectionObserver' in window)){ vids.forEach(function(v){ v.play().catch(function(){}); }); return; }
  var vio=new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      var v=en.target;
      if(en.isIntersecting){ v.play().catch(function(){}); }
      else { v.pause(); }
    });
  },{threshold:.25});
  vids.forEach(function(v){ vio.observe(v); });
})();
