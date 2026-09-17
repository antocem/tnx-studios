/* Reachers — cursor, magnetism and ambient life
   Pointer-precise dot + a lagging ring that reads the thing underneath it.
   Skipped entirely on touch and when reduced motion is requested. */
(function(){
  'use strict';
  var fine = window.matchMedia('(pointer:fine)').matches;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- scroll progress rail (runs everywhere) ---------------- */
  (function(){
    var bar=document.createElement('div');
    bar.className='scrollrail';
    bar.innerHTML='<i></i>';
    document.body.appendChild(bar);
    var fill=bar.firstChild, ticking=false;
    function upd(){
      var h=document.documentElement.scrollHeight-window.innerHeight;
      fill.style.transform='scaleX('+(h>0?Math.min(1,window.scrollY/h):0)+')';
      ticking=false;
    }
    window.addEventListener('scroll',function(){
      if(!ticking){ticking=true;requestAnimationFrame(upd);}
    },{passive:true});
    upd();
  })();

  if(!fine || reduce) return;

  /* ---------------- the cursor ---------------- */
  var root=document.createElement('div');
  root.className='tnxcur';
  root.setAttribute('aria-hidden','true');
  root.innerHTML='<span class="curdot"></span>'+
    '<span class="curring"><b class="curlabel"></b>'+
    '<svg class="curarrow" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'+
    '<svg class="curplay" viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z"/></svg></span>';
  document.body.appendChild(root);
  document.documentElement.classList.add('has-tnxcur');

  var dot=root.querySelector('.curdot');
  var ring=root.querySelector('.curring');
  var label=root.querySelector('.curlabel');

  var mx=innerWidth/2, my=innerHeight/2;   /* true pointer */
  var rx=mx, ry=my;                        /* ring, lagging */
  var vx=0, vy=0, lastX=mx, lastY=my;

  document.addEventListener('pointermove',function(e){
    mx=e.clientX; my=e.clientY;
    root.classList.add('on');
  },{passive:true});
  document.addEventListener('pointerdown',function(){ root.classList.add('down'); });
  document.addEventListener('pointerup',function(){ root.classList.remove('down'); });
  document.addEventListener('mouseleave',function(){ root.classList.remove('on'); });
  document.addEventListener('mouseenter',function(){ root.classList.add('on'); });

  function frame(){
    rx += (mx-rx)*0.17;
    ry += (my-ry)*0.17;
    vx = mx-lastX; vy = my-lastY;
    lastX = mx; lastY = my;
    /* stretch the ring slightly along the direction of travel */
    var sp = Math.min(Math.sqrt(vx*vx+vy*vy)/28, 0.42);
    var ang = Math.atan2(vy,vx)*180/Math.PI;
    dot.style.transform='translate3d('+mx+'px,'+my+'px,0) translate(-50%,-50%)';
    ring.style.transform='translate3d('+rx+'px,'+ry+'px,0) translate(-50%,-50%) rotate('+ang+'deg) scale('+(1+sp)+','+(1-sp*0.62)+')';
    ring.style.setProperty('--unrot', (-ang)+'deg');
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* ---------------- what is under the pointer ---------------- */
  var MODES=[
    ['play',  '.vcard, .vcard *'],
    ['view',  '.shitem, .shitem *, .adshot, .sg, .sg *, .rcrd, .rcrd *, .campimg, .indcrea, .indcrea *, .teamcard, .tcp, .fteamR, .fteamR *, .lmchip, .rcardp, .rcardp *'],
    ['pause', '.lmarq, .lmarq *, .adwall, .adwall *, .marq, .marq *'],
    ['switch','.indtab, .indtab *, .shbtn, .shbtn *'],
    ['open',  '.faqq, .faqq *'],
    ['go',    'a, button, [data-contact], [data-planner], .capply, .capply *, .dditem, .dditem *, .ddpromo, .ddpromo *'],
    ['text',  'p, h1, h2, h3, h4, li, .lead, .sub']
  ];
  var LABEL={play:'PLAY',view:'VIEW',pause:'HOLD',switch:'SWITCH',open:'OPEN',go:'',text:''};

  var cur='';
  function setMode(m,accent){
    if(m===cur) return;
    cur=m;
    root.setAttribute('data-mode',m);
    label.textContent=LABEL[m]||'';
    root.style.setProperty('--acc', accent||'var(--cyan)');
  }
  function accentOf(el){
    var n=el;
    for(var i=0;i<4 && n;i++){
      var cs=getComputedStyle(n);
      var v=cs.getPropertyValue('--c')||cs.getPropertyValue('--dc')||cs.getPropertyValue('--tc')||cs.getPropertyValue('--pc');
      if(v && v.trim()) return v.trim();
      n=n.parentElement;
    }
    return '';
  }
  document.addEventListener('pointerover',function(e){
    var t=e.target;
    if(!(t instanceof Element)) return;
    for(var i=0;i<MODES.length;i++){
      if(t.matches(MODES[i][1])){ setMode(MODES[i][0], accentOf(t)); return; }
    }
    setMode('');
  },{passive:true});

  /* ---------------- magnetic pull on the primary actions ---------------- */
  var MAG='.btn-primary, .capply, .navcta, .indtab, .shbtn, .plannerCta';
  document.querySelectorAll(MAG).forEach(function(el){
    var R=58;
    el.addEventListener('pointermove',function(e){
      var r=el.getBoundingClientRect();
      var dx=e.clientX-(r.left+r.width/2);
      var dy=e.clientY-(r.top+r.height/2);
      var d=Math.sqrt(dx*dx+dy*dy);
      var pull=Math.max(0,1-d/(Math.max(r.width,r.height)/2+R));
      el.style.setProperty('--mgx',(dx*pull*0.28).toFixed(2)+'px');
      el.style.setProperty('--mgy',(dy*pull*0.28).toFixed(2)+'px');
    });
    el.addEventListener('pointerleave',function(){
      el.style.setProperty('--mgx','0px');
      el.style.setProperty('--mgy','0px');
    });
  });

  /* ---------------- ambient glow that trails the pointer ---------------- */
  var aura=document.createElement('div');
  aura.className='curaura';
  aura.setAttribute('aria-hidden','true');
  document.body.appendChild(aura);
  var ax=mx, ay=my;
  (function drift(){
    ax += (mx-ax)*0.045;
    ay += (my-ay)*0.045;
    aura.style.transform='translate3d('+ax+'px,'+ay+'px,0) translate(-50%,-50%)';
    requestAnimationFrame(drift);
  })();
})();

/* Reachers — headings that assemble, tiles that tilt */
(function(){
  'use strict';
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* ---------- split headings into words that rise into place ---------- */
  var TARGETS='.shead h2, .hero h1, .chero h1, .phero h1, .bbhead h3, .applyband h2, .ctaband h2, .teamhead h3, .fteamL h2, .whyL h2';
  var idx;
  function wrapNode(node){
    var parts=node.nodeValue.split(/(\s+)/);
    var frag=document.createDocumentFragment();
    parts.forEach(function(part){
      if(part===''){return;}
      if(/^\s+$/.test(part)){ frag.appendChild(document.createTextNode(part)); return; }
      var w=document.createElement('span'); w.className='wr';
      w.style.setProperty('--wi', idx++);
      var i=document.createElement('i'); i.textContent=part;
      w.appendChild(i); frag.appendChild(w);
    });
    node.parentNode.replaceChild(frag,node);
  }
  function walk(el){
    var kids=Array.prototype.slice.call(el.childNodes);
    kids.forEach(function(n){
      if(n.nodeType===3 && n.nodeValue.trim()) wrapNode(n);
      else if(n.nodeType===1 && n.tagName!=='BR' && !n.classList.contains('wr')) walk(n);
    });
  }
  document.querySelectorAll(TARGETS).forEach(function(h){
    if(h.dataset.split) return;
    h.dataset.split='1';
    idx=0;
    walk(h);
  });
  /* headings that are not themselves revealed still need a trigger */
  if('IntersectionObserver' in window){
    var hio=new IntersectionObserver(function(en){
      en.forEach(function(x){
        if(!x.isIntersecting) return;
        x.target.classList.add('wrdone');
        hio.unobserve(x.target);
      });
    },{threshold:.2,rootMargin:'0px 0px -5% 0px'});
    document.querySelectorAll(TARGETS).forEach(function(h){ hio.observe(h); });
  } else {
    document.querySelectorAll(TARGETS).forEach(function(h){ h.classList.add('wrdone'); });
  }

  /* ---------- media tiles lean toward the pointer ---------- */
  if(!window.matchMedia('(pointer:fine)').matches) return;
  document.querySelectorAll('.vcard, .sg, .adshot, .rcardp').forEach(function(el){
    el.addEventListener('pointermove',function(e){
      var r=el.getBoundingClientRect();
      var px=(e.clientX-r.left)/r.width-.5;
      var py=(e.clientY-r.top)/r.height-.5;
      el.style.setProperty('--tly',(px*9).toFixed(2)+'deg');
      el.style.setProperty('--tlx',(-py*9).toFixed(2)+'deg');
    });
    el.addEventListener('pointerleave',function(){
      el.style.setProperty('--tly','0deg');
      el.style.setProperty('--tlx','0deg');
    });
  });

  /* ---------- marquees speed up with the scroll ---------- */
  var rows=document.querySelectorAll('.lmrow, .marqrow, .adrow');
  if(rows.length){
    var last=window.scrollY, boost=1, tick=false;
    window.addEventListener('scroll',function(){
      if(tick) return; tick=true;
      requestAnimationFrame(function(){
        var d=Math.abs(window.scrollY-last); last=window.scrollY;
        boost=Math.min(1+d/34, 3.4);
        rows.forEach(function(r){ r.style.animationDuration=''; r.style.setProperty('--spd',boost.toFixed(2)); });
        tick=false;
      });
    },{passive:true});
    setInterval(function(){
      if(boost>1.02){ boost+=(1-boost)*0.22;
        rows.forEach(function(r){ r.style.setProperty('--spd',boost.toFixed(2)); }); }
    },90);
  }
})();
