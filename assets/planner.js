(function(){
  var CREDIT_USD=0.0625, EUR_PER_USD=0.92;
  var CAL_URL='https://calendar.app.google/AH6YUHjwGhJ7ru8NA';

  /* Traditional production benchmark: a full-day studio session for 10 products costs
     ~EUR5,000 and delivers 3 clips + 10 photos per product (30 clips / 100 photos per session),
     inclusive of shoot, talent, crew and post. Shown in the UI so it can be checked. */
  var TRAD={session:5000,productsPerSession:10,clipsPerSession:30,photosPerSession:100,persona:2500,sessionsPerWeek:1,postWeeks:2};

  var ICO={
    beauty:'<svg viewBox="0 0 24 24"><path d="M12 3v3M9.5 6h5l1 4.2V19a2 2 0 01-2 2h-3a2 2 0 01-2-2v-8.8L9.5 6z"/></svg>',
    jewelry:'<svg viewBox="0 0 24 24"><path d="M6.5 3h11l3.5 6-9 12L3 9l3.5-6z"/><path d="M3 9h18"/></svg>',
    food:'<svg viewBox="0 0 24 24"><path d="M6 3v8a3 3 0 006 0V3M9 11v10M18 3c-1.4 2-2 4-2 6s.6 3 2 3 2-1 2-3-.6-4-2-6zM18 12v9"/></svg>',
    fashion:'<svg viewBox="0 0 24 24"><path d="M12 3.5a2.2 2.2 0 012.2 2.2c0 1.1-1.1 1.7-2.2 2.3L3 13.5V17h18v-3.5L12 8"/></svg>',
    electronics:'<svg viewBox="0 0 24 24"><rect x="2.5" y="4" width="19" height="12.5" rx="2"/><path d="M8.5 20.5h7M12 16.5v4"/></svg>',
    launch:'<svg viewBox="0 0 24 24"><path d="M12 2.5s4.8 2.2 4.8 8.8c0 3-1.9 5.9-4.8 10.7-2.9-4.8-4.8-7.7-4.8-10.7C7.2 4.7 12 2.5 12 2.5z"/><circle cx="12" cy="9.5" r="1.9"/></svg>',
    monthly:'<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2.4"/><path d="M8 3v4M16 3v4M3 11h18"/></svg>',
    ads:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.6"/><circle cx="12" cy="12" r="1"/></svg>',
    brand:'<svg viewBox="0 0 24 24"><path d="M3 10.5v3a1.5 1.5 0 001.5 1.5H7l5.5 4V5L7 9H4.5A1.5 1.5 0 003 10.5z"/><path d="M17 9.5a4.5 4.5 0 010 5M20 7a8 8 0 010 10"/></svg>',
    catalogue:'<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7.5" height="7.5" rx="1.6"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.6"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.6"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.6"/></svg>',
    growth:'<svg viewBox="0 0 24 24"><path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/></svg>',
    video:'<svg viewBox="0 0 24 24"><rect x="2.5" y="5" width="13.5" height="14" rx="3"/><path d="M16 10.2l5.5-3.2v10L16 13.8"/></svg>',
    image:'<svg viewBox="0 0 24 24"><rect x="2.5" y="4.5" width="14" height="14" rx="2.6"/><path d="M20.5 7.5v10.2a2.3 2.3 0 01-2.3 2.3H8"/><circle cx="7.6" cy="9.4" r="1.4"/><path d="M16.5 15.5l-3.8-3.8-2.8 2.8-2.6-2.2"/></svg>',
    talk:'<svg viewBox="0 0 24 24"><circle cx="9.6" cy="7.8" r="3.2"/><path d="M3.6 20v-.9a5.2 5.2 0 015.2-5.2h1.6a5.2 5.2 0 015.2 5.2V20"/><path d="M18.4 7.2a4.8 4.8 0 010 7.2M21 4.6a8.6 8.6 0 010 12.4"/></svg>',
    persona:'<svg viewBox="0 0 24 24"><rect x="2.5" y="4" width="19" height="16" rx="3"/><circle cx="9.4" cy="10.2" r="2.4"/><path d="M5.8 16.6a4 4 0 017.2 0M16 9.4h3.4M16 13.4h3.4"/></svg>',
    check:'<svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>',
    chev:'<svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>',
    arrow:'<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    cam:'<svg viewBox="0 0 24 24"><path d="M3 8.5A2.5 2.5 0 015.5 6h2L9 4h6l1.5 2h2A2.5 2.5 0 0121 8.5v9A2.5 2.5 0 0118.5 20h-13A2.5 2.5 0 013 17.5v-9z"/><circle cx="12" cy="12.5" r="3.4"/></svg>',
    spark:'<svg viewBox="0 0 24 24"><path d="M12 3l1.9 5.6L19.5 10l-4.6 3.4L16.6 19 12 15.9 7.4 19l1.7-5.6L4.5 10l5.6-1.4z"/></svg>',
    ig:'<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r="1.1" class="f"/></svg>',
    meta:'<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><path d="M14.2 21v-7.4h2.3l.35-2.8h-2.65v-1.6c0-.85.24-1.42 1.5-1.42h1.3V5.1c-.22-.03-1-.1-1.9-.1-1.9 0-3.2 1.15-3.2 3.28v1.52H9.6v2.8h2.3V21h2.3z" class="f"/></svg>',
    tt:'<svg viewBox="0 0 24 24"><path d="M9.5 9a4 4 0 104 4V4.5c1 2 2.4 3 4.5 3"/></svg>',
    li:'<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="7.7" cy="7.6" r="1.5" class="f"/><path d="M6.4 10.6v7h2.6v-7H6.4zM11.2 10.6v7h2.6v-3.7c0-1 .45-1.9 1.5-1.9s1.35.9 1.35 1.9v3.7h2.6v-4.1c0-2.5-1.35-3.6-3.05-3.6-1.4 0-2 .78-2.4 1.33v-1.63h-2.6z" class="f"/></svg>'
  };

  var INDUSTRIES=[
    {id:'beauty',name:'Beauty',v:.38,i:.44,t:.18},
    {id:'jewelry',name:'Jewelry',v:.27,i:.63,t:.10},
    {id:'food',name:'Food',v:.52,i:.38,t:.10},
    {id:'fashion',name:'Fashion',v:.43,i:.47,t:.10},
    {id:'electronics',name:'Electronics',v:.41,i:.33,t:.26}
  ];
  var FREQS=[{id:1,name:'Weekly'},{id:3,name:'3&#215; a week'},{id:7,name:'Daily'}];
  var MONTHS=[{id:1,name:'1 month'},{id:3,name:'3 months'},{id:6,name:'6 months'},{id:12,name:'12 months'}];
  var GOALS=[
    {id:'launch',name:'Product Launch',ico:'launch',vm:1.35,im:1.0,tm:1.5},
    {id:'monthly',name:'Monthly Content',ico:'monthly',vm:1,im:1,tm:1},
    {id:'ads',name:'Paid Ads',ico:'ads',vm:1.6,im:1.35,tm:.6},
    {id:'brand',name:'Brand Awareness',ico:'brand',vm:1.1,im:.9,tm:1.6},
    {id:'catalogue',name:'Catalogue',ico:'catalogue',vm:.4,im:2.2,tm:.2},
    {id:'growth',name:'Social Growth',ico:'growth',vm:1.7,im:.8,tm:.8}
  ];
  var DELIVS=[
    {key:'video',ico:'video',name:'Product Videos',desc:'Short-form product clips built for Meta, TikTok and Reels.',
     unit:'videos',max:600,reformat:2,weight:1,takes:3,
     tiers:[{id:'std',label:'Standard',credits:9,model:'Higgsfield Dop &#183; Standard &#183; 5s',out:'1080p &#183; 5 seconds',src:'ok'},
            {id:'prem',label:'Premium',credits:58,model:'Google Veo 3 &#183; Standard &#183; 8s',out:'Cinematic &#183; 8 seconds',src:'est'}]},
    {key:'image',ico:'image',name:'Product Images',desc:'Lifestyle, hero and e-commerce imagery.',
     unit:'images',max:1200,reformat:2,weight:.25,takes:1.2,
     tiers:[{id:'std',label:'Standard',credits:1.25,model:'Higgsfield Soul &#183; 1080p &#183; batch of 4',out:'1080p &#183; batched 4-up',src:'ok'},
            {id:'prem',label:'Premium',credits:2,model:'Nano Banana Pro &#183; ultra detail',out:'2K &#183; ultra detail',src:'est'}]},
    {key:'talk',ico:'talk',name:'Talking Product Videos',desc:'Avatar or spokesperson videos with synchronised speech.',
     unit:'videos',max:300,reformat:2,weight:1.2,takes:4.5,
     tiers:[{id:'s5',label:'5s',credits:18,model:'Higgsfield Speak V2 &#183; High',out:'High quality &#183; 5 seconds',src:'ok'},
            {id:'s10',label:'10s',credits:36,model:'Higgsfield Speak V2 &#183; High',out:'High quality &#183; 10 seconds',src:'ok'},
            {id:'s15',label:'15s',credits:54,model:'Higgsfield Speak V2 &#183; High',out:'High quality &#183; 15 seconds',src:'ok'}]},
    {key:'persona',ico:'persona',name:'Brand Personas',desc:'A reusable digital brand ambassador, built once and used across every asset.',
     unit:'personas',max:8,reformat:1,weight:2,takes:1,
     tiers:[{id:'one',label:'Reusable',credits:40,model:'Higgsfield Soul ID',out:'One-time build, unlimited reuse',src:'ok'}]}
  ];

  /* Every outlet maps to one of the four deliverables above. 'share' is that outlet's
     default slice of the deliverable's total volume; shares for outlets mapping to the
     same key sum to 1, so platform totals always reconcile with production totals. */
  var PLATFORMS=[
    {id:'instagram',name:'Instagram',color:'#E4405F',ico:'ig',
     outlets:[
       {id:'ig_feed',name:'Feed Posts',sub:'Static image post',maps:'image',unit:'posts',max:220,share:.35},
       {id:'ig_reels',name:'Reels',sub:'Short-form video',maps:'video',unit:'reels',max:180,share:.35},
       {id:'ig_stories',name:'Stories',sub:'24h vertical story',maps:'image',unit:'stories',max:220,share:.20}
     ]},
    {id:'meta',name:'Facebook & Meta Ads',color:'#0866FF',ico:'meta',
     outlets:[
       {id:'meta_static',name:'Static Ads',sub:'Feed & carousel creative',maps:'image',unit:'ads',max:220,share:.25},
       {id:'meta_video',name:'Video Ads',sub:'Short-form ad video',maps:'video',unit:'ads',max:180,share:.25},
       {id:'meta_talk',name:'Talking Ads',sub:'Spokesperson ad video',maps:'talk',unit:'ads',max:100,share:.55}
     ]},
    {id:'tiktok',name:'TikTok',color:'#25F4EE',ico:'tt',
     outlets:[
       {id:'tt_video',name:'Videos',sub:'Native short-form video',maps:'video',unit:'videos',max:220,share:.40}
     ]},
    {id:'linkedin',name:'LinkedIn',color:'#3B9CFF',ico:'li',
     outlets:[
       {id:'li_feed',name:'Feed Posts',sub:'Static image post',maps:'image',unit:'posts',max:160,share:.20},
       {id:'li_talk',name:'Spokesperson Videos',sub:'Executive / talking video',maps:'talk',unit:'videos',max:70,share:.45}
     ]}
  ];
  function allOutlets(){
    var o=[]; PLATFORMS.forEach(function(pf){pf.outlets.forEach(function(x){o.push(x);});}); return o;
  }

  var S={cur:'EUR',view:'internal',mult:3.5,mode:'content',step:1,
         brief:{industry:'beauty',products:8,freq:3,months:3},goal:'monthly',
         budget:1500,
         qty:{video:0,image:0,talk:0,persona:0},
         tier:{video:'std',image:'std',talk:'s10',persona:'one'},
         plat:{}};

  var $=function(id){return document.getElementById(id);};
  function rate(){return S.cur==='EUR'?EUR_PER_USD:1;}
  function sym(){return S.cur==='EUR'?'€':'$';}
  function money(usd,dp){
    var d=(dp===undefined)?2:dp;
    return sym()+(usd*rate()).toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});
  }
  function money0(usd){return sym()+Math.round(usd*rate()).toLocaleString('en-US');}
  function num(v){return Math.round(v).toLocaleString('en-US');}
  function money0e(eur){return money0(eur/EUR_PER_USD);}
  function tierOf(d){var t=S.tier[d.key];for(var i=0;i<d.tiers.length;i++){if(d.tiers[i].id===t)return d.tiers[i];}return d.tiers[0];}
  function effCr(d,t){return t.credits*(d.takes||1);}
  function delivOf(k){return DELIVS.filter(function(x){return x.key===k;})[0];}
  function setRangeFill(el){var mn=+el.min||0,mx=+el.max||100;el.style.setProperty('--p',((+el.value-mn)/(mx-mn)*100)+'%');}
  function indOf(){return INDUSTRIES.filter(function(x){return x.id===S.brief.industry;})[0];}
  function goalOf(){return GOALS.filter(function(x){return x.id===S.goal;})[0];}
  function freqName(){return FREQS.filter(function(x){return x.id===S.brief.freq;})[0].name;}
  function clampQty(d,v){return Math.max(0,Math.min(d.max,Math.round(v)));}

  /* ---- engine ---- */
  function suggest(){
    var ind=indOf(), g=goalOf(), b=S.brief, posts=b.freq*4.33*b.months;
    return {video:Math.max(1,Math.round(posts*ind.v*g.vm+b.products*0.5)),
            image:Math.max(1,Math.round(posts*ind.i*g.im+b.products*2)),
            talk:Math.max(0,Math.round(posts*ind.t*g.tm)),
            persona:b.products>24?3:(b.products>10?2:1)};
  }
  function applySuggestion(){
    var s=suggest();
    DELIVS.forEach(function(d){S.qty[d.key]=clampQty(d,s[d.key]);});
  }
  /* budget mode: keep the recommended mix shape, scale volume to hit the budget */
  /* Budget mode never inflates volume past what the brief can publish. If the budget
     covers the recommended plan, we hold the plan and report the headroom instead. */
  function applyBudget(){
    var base=suggest();
    var personaCredits=base.persona*effCr(delivOf('persona'),delivOf('persona').tiers[0]);
    var mixCredits=0;
    ['video','image','talk'].forEach(function(k){var dd=delivOf(k);mixCredits+=base[k]*effCr(dd,tierOf(dd));});
    var recPriceUsd=(mixCredits+personaCredits)*CREDIT_USD*S.mult;
    var budgetUsd=S.budget/rate();
    var k;
    if(budgetUsd>=recPriceUsd){
      k=1; S.budgetState='headroom';
      S.budgetHeadroomUsd=budgetUsd-recPriceUsd;
      S.budgetMonthsEq=recPriceUsd>0?S.brief.months*(budgetUsd/recPriceUsd):S.brief.months;
    } else {
      var creditsAvail=(budgetUsd/S.mult)/CREDIT_USD-personaCredits;
      k=mixCredits>0?Math.max(0,creditsAvail)/mixCredits:0;
      S.budgetState='constrained'; S.budgetHeadroomUsd=0; S.budgetMonthsEq=0;
    }
    S.budgetRecPriceUsd=recPriceUsd;
    ['video','image','talk'].forEach(function(key){S.qty[key]=clampQty(delivOf(key),base[key]*k);});
    S.qty.persona=clampQty(delivOf('persona'),base.persona);
  }

  function totals(){
    var credits=0,masters=0,assets=0,weighted=0,social=0;
    DELIVS.forEach(function(d){
      var q=S.qty[d.key],t=tierOf(d);
      credits+=q*effCr(d,t); masters+=q; assets+=q*d.reformat; weighted+=q*d.weight;
      if(d.key!=='persona') social+=q;
    });
    var costUsd=credits*CREDIT_USD;
    var priceUsd=costUsd*S.mult;
    var days=weighted>0?Math.max(1,Math.ceil(weighted/15)):0;
    var need=S.brief.freq*4.33*S.brief.months;
    return {credits:credits,masters:masters,assets:assets,costUsd:costUsd,priceUsd:priceUsd,
            days:days,social:social,need:need,cover:need>0?social/need:0};
  }
  /* ---- platform allocation ---- */
  function outletQty(o){
    if(S.mode==='platform') return S.plat[o.id]||0;
    return Math.max(0,Math.round(o.share*S.qty[o.maps]));
  }
  function syncQtyFromPlatforms(){
    ['video','image','talk'].forEach(function(key){
      var sum=0; allOutlets().forEach(function(o){if(o.maps===key) sum+=(S.plat[o.id]||0);});
      S.qty[key]=Math.max(0,Math.round(sum));
    });
  }
  function seedPlatformsFromSuggestion(){
    var s=suggest();
    allOutlets().forEach(function(o){S.plat[o.id]=Math.round(o.share*s[o.maps]);});
    S.qty.persona=clampQty(delivOf('persona'),s.persona);
    syncQtyFromPlatforms();
  }
  function platformBreakdown(){
    return PLATFORMS.map(function(pf){
      var total=0,costUsd=0,parts=[];
      pf.outlets.forEach(function(o){
        var q=outletQty(o),dd=delivOf(o.maps),credits=effCr(dd,tierOf(dd));
        total+=q; costUsd+=q*credits*CREDIT_USD;
        parts.push({o:o,q:q});
      });
      return {pf:pf,total:total,costUsd:costUsd,parts:parts};
    });
  }
  function buildPlatformPanel(){
    var host=$('cPlatformPanel'); if(!host) return;
    var quality='<div class="cplatQuality">'+
      '<div class="cpq"><span>Video quality</span>'+delivOf('video').tiers.map(function(t){
        return '<button type="button" class="ctier'+(t.id===S.tier.video?' on':'')+'" data-qk="video" data-qt="'+t.id+'">'+t.label+'</button>';}).join('')+'</div>'+
      '<div class="cpq"><span>Image quality</span>'+delivOf('image').tiers.map(function(t){
        return '<button type="button" class="ctier'+(t.id===S.tier.image?' on':'')+'" data-qk="image" data-qt="'+t.id+'">'+t.label+'</button>';}).join('')+'</div>'+
      '<div class="cpq"><span>Talking video length</span>'+delivOf('talk').tiers.map(function(t){
        return '<button type="button" class="ctier'+(t.id===S.tier.talk?' on':'')+'" data-qk="talk" data-qt="'+t.id+'">'+t.label+'</button>';}).join('')+'</div>'+
    '</div>';
    var cards=PLATFORMS.map(function(pf){
      var outlets=pf.outlets.map(function(o){
        var q=S.plat[o.id]||0,ddo=delivOf(o.maps),credits=effCr(ddo,tierOf(ddo));
        return '<div class="pfoutlet" data-outlet="'+o.id+'"><div class="pfoName"><b>'+o.name+'</b><span>'+o.sub+'</span></div>'+
          '<input type="range" class="crange jsPfRange" min="0" max="'+o.max+'" value="'+q+'" data-outlet="'+o.id+'" aria-label="'+o.name+'">'+
          '<div class="pfoQty jsPfQty">'+num(q)+'</div><div class="pfoCost jsPfCost">'+money(q*credits*CREDIT_USD)+'</div></div>';
      }).join('');
      return '<div class="pfcard" data-plat="'+pf.id+'"><div class="pfhead">'+
        '<span class="pfico" style="color:'+pf.color+';background:'+pf.color+'22;border-color:'+pf.color+'55">'+ICO[pf.ico]+'</span>'+
        '<div class="pfname"><b>'+pf.name+'</b><span>'+pf.outlets.length+' content types</span></div>'+
        '<div class="pftotal jsPfTotal"><b>0</b><i>assets</i></div></div>'+outlets+'</div>';
    }).join('');
    var personaCard='<div class="pfcard"><div class="pfhead">'+
      '<span class="pfico" style="color:var(--lime);background:rgba(140,255,61,.13);border-color:rgba(140,255,61,.35)">'+ICO.persona+'</span>'+
      '<div class="pfname"><b>Brand Personas</b><span>Shared across every platform, not platform-specific</span></div>'+
      '<div class="pftotal"><b class="jsPersonaTot">'+num(S.qty.persona)+'</b><i>personas</i></div></div>'+
      '<div class="pfoutlet"><div class="pfoName"><b>Reusable</b><span>One-time build</span></div>'+
      '<input type="range" class="crange" id="cPersonaRange" min="0" max="8" value="'+S.qty.persona+'" aria-label="Brand personas">'+
      '<div class="pfoQty" id="cPersonaQtyLbl">'+num(S.qty.persona)+'</div>'+
      '<div class="pfoCost">'+money(S.qty.persona*effCr(delivOf('persona'),delivOf('persona').tiers[0])*CREDIT_USD)+'</div></div></div>';
    host.innerHTML=quality+cards+personaCard;
    host.querySelectorAll('.jsPfRange').forEach(function(r){
      setRangeFill(r);
      r.addEventListener('input',function(){
        S.plat[r.getAttribute('data-outlet')]=+r.value; setRangeFill(r);
        syncQtyFromPlatforms(); paintPlatformPanel(); paint();
      });
    });
    host.querySelectorAll('[data-qk]').forEach(function(b){
      b.addEventListener('click',function(){
        S.tier[b.getAttribute('data-qk')]=b.getAttribute('data-qt');
        buildPlatformPanel(); paint();
      });
    });
    var pr=$('cPersonaRange');
    if(pr){ setRangeFill(pr);
      pr.addEventListener('input',function(){
        S.qty.persona=clampQty(delivOf('persona'),+pr.value); setRangeFill(pr);
        paintPlatformPanel(); paint();
      });
    }
    paintPlatformPanel();
  }
  function paintPlatformPanel(){
    var host=$('cPlatformPanel'); if(!host||S.mode!=='platform') return;
    PLATFORMS.forEach(function(pf){
      var card=host.querySelector('.pfcard[data-plat="'+pf.id+'"]'); if(!card) return;
      var total=0;
      pf.outlets.forEach(function(o){
        var q=S.plat[o.id]||0,ddo2=delivOf(o.maps),credits=effCr(ddo2,tierOf(ddo2)); total+=q;
        var row=card.querySelector('.pfoutlet[data-outlet="'+o.id+'"]');
        if(row){
          row.querySelector('.jsPfQty').textContent=num(q);
          row.querySelector('.jsPfCost').textContent=money(q*credits*CREDIT_USD);
          var rr=row.querySelector('.jsPfRange'); if(rr&&+rr.value!==q){rr.value=q;setRangeFill(rr);}
        }
      });
      var t=card.querySelector('.jsPfTotal b'); if(t) t.textContent=num(total);
    });
    var pt=$('.jsPersonaTot'); var pt2=host.querySelector('.jsPersonaTot'); if(pt2) pt2.textContent=num(S.qty.persona);
    var pq=$('cPersonaQtyLbl'); if(pq) pq.textContent=num(S.qty.persona);
  }

  /* One filming session = EUR 5,000 and covers 10 products, delivering 3 clips + 10 photos
     per product (30 clips + 100 photos per session). A session yields both, so the session
     count is whichever need is greater. */
  function traditional(){
    var v=S.qty.video,i=S.qty.image,t=S.qty.talk,p=S.qty.persona;
    var clips=v+t;
    var sClips=Math.ceil(clips/TRAD.clipsPerSession);
    var sPhotos=Math.ceil(i/TRAD.photosPerSession);
    var sessions=Math.max(sClips,sPhotos);
    var shootCost=sessions*TRAD.session;
    var personaCost=p*TRAD.persona;
    var lines=[];
    if(sessions>0) lines.push({n:sessions,label:'filming sessions &#215; '+money0e(TRAD.session),total:shootCost});
    if(p>0) lines.push({n:p,label:'ambassador contracts &#215; '+money0e(TRAD.persona),total:personaCost});
    var weeks=sessions>0?Math.ceil(sessions/TRAD.sessionsPerWeek)+TRAD.postWeeks:0;
    return {lines:lines,totalEur:shootCost+personaCost,shootCost:shootCost,personaCost:personaCost,sessions:sessions,
            deliveredClips:sessions*TRAD.clipsPerSession,deliveredPhotos:sessions*TRAD.photosPerSession,
            shootDays:sessions,weeks:weeks};
  }
  function fmtMult(x){
    if(!isFinite(x)||x<=0) return '—';
    return (x>=10?Math.round(x):Math.round(x*10)/10)+'×';
  }
  function compare(T,TR){
    var m=T.masters;
    if(m<=0||T.priceUsd<=0||TR.totalEur<=0) return {ok:false,tnxPerUsd:0,tradPerUsd:0,mult:0};
    var tradPerEur=TR.totalEur/m, tnxPerEur=T.priceUsd*EUR_PER_USD/m;
    return {ok:true,
            tnxPerUsd:tnxPerEur/EUR_PER_USD,
            tradPerUsd:tradPerEur/EUR_PER_USD,
            mult:tradPerEur/tnxPerEur};
  }
  function impact(){
    var v=S.qty.video,i=S.qty.image,t=S.qty.talk,T=totals(),m=S.brief.months;
    var wk=Math.max(1,S.brief.freq);
    return [
      {n:Math.floor(T.social/(wk*4.33)),u:'months of Instagram',u1:'month of Instagram'},
      {n:Math.floor(v*2+i),u:'Meta ad creatives'},
      {n:v+t,u:'TikTok posts'},
      {n:Math.floor(i*0.3+v*0.2),u:'LinkedIn posts'},
      {n:Math.max(1,Math.floor(m*1.5)),u:'campaign launches'},
      {n:Math.max(1,Math.floor(m/2)),u:'seasonal collections',u1:'seasonal collection'}
    ];
  }

  /* ---- ui builders ---- */
  function chips(host,list,active,onPick,useIco){
    host.innerHTML='';
    list.forEach(function(o){
      var b=document.createElement('button');
      b.type='button'; b.className='cchip'+(String(o.id)===String(active)?' on':'');
      b.innerHTML=(useIco&&ICO[o.ico||o.id]?ICO[o.ico||o.id]:'')+'<span>'+o.name+'</span>';
      b.addEventListener('click',function(){onPick(o.id);});
      host.appendChild(b);
    });
  }
  function buildDelivs(){
    var host=$('cDelivs'); host.innerHTML='';
    DELIVS.forEach(function(d){
      var t=tierOf(d), card=document.createElement('div');
      card.className='cdeliv'; card.setAttribute('data-key',d.key);
      var tiersHtml=d.tiers.length>1?'<div class="cdTiers">'+d.tiers.map(function(x){
          return '<button type="button" class="ctier'+(x.id===t.id?' on':'')+'" data-tier="'+x.id+'">'+x.label+'</button>';}).join('')+'</div>':'';
      card.innerHTML=
        '<div class="cdTop"><span class="cdIco">'+ICO[d.ico]+'</span>'+
        '<span class="cdName"><b>'+d.name+'</b><span>'+d.desc+'</span></span>'+
        '<span class="cdCount"><b class="jsQty">0</b><i>'+d.unit+'</i></span></div>'+
        '<div class="cdCtl"><input type="range" class="crange jsRange" min="0" max="'+d.max+'" value="0" aria-label="'+d.name+'">'+tiersHtml+'</div>'+
        '<div class="cdAdv"><button type="button" class="cdAdvBtn">'+ICO.chev+'Advanced settings</button>'+
        '<div class="cdAdvBody">'+
          '<span class="cmeta"><i>Model</i><b class="jsModel">'+t.model+'</b></span>'+
          '<span class="cmeta"><i>Output</i><b class="jsOut">'+t.out+'</b></span>'+
          '<span class="cmeta"><i>Unit cost</i><b class="jsUnit">&#8212;</b></span>'+
          '<span class="cmeta"><i>Real-world generations</i><b class="jsTakes">&#8212;</b></span>'+
          '<span class="csrc '+t.src+' jsSrc"></span>'+
        '</div></div>';
      var range=card.querySelector('.jsRange');
      range.addEventListener('input',function(){
        S.qty[d.key]=clampQty(d,+range.value); S.mode='content'; syncMode(); setRangeFill(range); paint();
      });
      card.querySelectorAll('.ctier').forEach(function(btn){
        btn.addEventListener('click',function(){
          S.tier[d.key]=btn.getAttribute('data-tier');
          card.querySelectorAll('.ctier').forEach(function(b2){b2.classList.remove('on');});
          btn.classList.add('on');
          if(S.mode==='budget') applyBudget();
          paint();
        });
      });
      var ab=card.querySelector('.cdAdvBtn'), abd=card.querySelector('.cdAdvBody');
      ab.addEventListener('click',function(){ab.classList.toggle('open');abd.classList.toggle('open');});
      host.appendChild(card);
    });
  }

  /* ---- paint ---- */
  function paint(){
    var T=totals(), TR=traditional(), PB=platformBreakdown();
    var clientView=S.view==='client';

    /* deliverable cards */
    $('cDelivs').querySelectorAll('.cdeliv').forEach(function(card){
      var d=delivOf(card.getAttribute('data-key')), t=tierOf(d), q=S.qty[d.key];
      card.querySelector('.jsQty').textContent=num(q);
      var r=card.querySelector('.jsRange');
      if(+r.value!==q) r.value=q;
      setRangeFill(r);
      card.classList.toggle('active',q>0);
      card.querySelector('.jsModel').innerHTML=t.model;
      card.querySelector('.jsOut').innerHTML=t.out;
      card.querySelector('.jsUnit').textContent=money(effCr(d,t)*CREDIT_USD)+' · '+num(effCr(d,t))+' cr';
      var jt=card.querySelector('.jsTakes');
      if(jt) jt.textContent=(d.takes&&d.takes>1)?(d.takes+'× generations per usable asset'):'1× (single generation)';
      var s=card.querySelector('.jsSrc');
      s.className='csrc '+t.src+' jsSrc';
      s.textContent=t.src==='ok'?'Official pricing':'Estimated pricing';
      card.querySelectorAll('.ctier').forEach(function(cb){cb.classList.toggle('on',cb.getAttribute('data-tier')===S.tier[d.key]);});
    });

    /* production lines */
    var html='';
    if(T.masters===0){
      html='<div class="cEmpty">Nothing selected yet. Go back to the brief and the planner will fill this in.</div>';
    } else {
      DELIVS.forEach(function(d){
        var q=S.qty[d.key],t=tierOf(d),ec=effCr(d,t);
        html+='<div class="cline'+(q===0?' zero':'')+'">'+
          '<span class="clineQty">'+num(q)+'</span>'+
          '<span class="clineName">'+d.name+'<small>'+money(ec*CREDIT_USD)+' each'+((d.takes&&d.takes>1)?' &#183; incl. '+d.takes+'&#215; takes':'')+'</small></span>'+
          '<span class="clineCost">'+money(q*ec*CREDIT_USD)+'<small>'+num(q*ec)+' cr</small></span></div>';
      });
    }
    $('cLines').innerHTML=html;
    $('cStatAssets').textContent=num(T.assets);
    $('cStatTime').textContent=T.days===0?'—':(T.days===1?'1 day':(T.days>20?Math.ceil(T.days/5)+' weeks':T.days+' days'));

    /* platform breakdown */
    $('cPlatRows').innerHTML=PB.map(function(row){
      var parts=row.parts.filter(function(x){return x.q>0;}).map(function(x){return num(x.q)+' '+x.o.unit;}).join(' &#183; ');
      return '<div class="cplatRow"><span class="pfico" style="color:'+row.pf.color+';background:'+row.pf.color+'22;border-color:'+row.pf.color+'55">'+ICO[row.pf.ico]+'</span>'+
        '<span class="cplatRowName"><b>'+row.pf.name+'</b><span>'+(parts||'Nothing yet')+'</span></span>'+
        '<span class="cplatRowNum"><b>'+num(row.total)+'</b><i>assets</i></span></div>';
    }).join('');
    var pct=T.need>0?Math.min(999,Math.round(T.cover*100)):0;
    $('cCapPct').textContent=pct+'% covered';
    if(S.mode==='platform') paintPlatformPanel();

    /* money */
    $('cCost').textContent=T.costUsd>0?money(T.costUsd):'—';
    $('cPerAsset').textContent=T.assets>0?money(T.costUsd/T.assets):'—';
    $('cPrice').textContent=T.priceUsd>0?money0(T.priceUsd):'—';
    var marginPct=S.mult>0?Math.round((1-1/S.mult)*100):0;
    $('cMargin').textContent=T.priceUsd>0?marginPct+'%':'—';
    var mo=$('cMarginOut'); if(mo) mo.textContent=marginPct+'% margin';
    $('calcBar').classList.toggle('clientview',clientView);
    $('cPriceLab').textContent=clientView?'Total investment':'Client investment';

    /* vs traditional: compare per finished deliverable, apples to apples */
    var cmp=compare(T,TR);
    var vsRows=$('cVsRows');
    if(vsRows){
      vsRows.innerHTML=cmp.ok
        ? '<div class="cvsRow trad"><span>'+num(TR.sessions)+' filming sessions</span><b>'+money0e(TR.shootCost)+'</b></div>'+
          (TR.personaCost>0?'<div class="cvsRow trad"><span>'+num(S.qty.persona)+' ambassador contracts</span><b>'+money0e(TR.personaCost)+'</b></div>':'')+
          '<div class="cvsRow"><span>delivers</span><b>'+num(TR.deliveredClips)+' clips &#183; '+num(TR.deliveredPhotos)+' photos</b></div>'+
          '<div class="cvsRow"><span>time to delivery</span><b>~'+num(TR.weeks)+' weeks</b></div>'+
          '<div class="cvsRow tnxr"><span>Reachers, same output</span><b>'+money0(T.priceUsd)+' &#183; '+num(T.days)+'d</b></div>'
        : '<div class="cvsRow"><span>Build a plan to compare</span><b>&#8212;</b></div>';
    }
    var vm=$('cVsMult'); if(vm) vm.textContent=fmtMult(cmp.mult);

    /* recommendation */
    var sg=suggest(), rec=$('cRec');
    var inSync=DELIVS.every(function(d){return S.qty[d.key]===clampQty(d,sg[d.key]);});
    if(inSync){
      $('cRecTxt').innerHTML='For <em>'+S.brief.products+' products</em> at '+freqName().toLowerCase()+
        ' over <em>'+S.brief.months+' month'+(S.brief.months>1?'s':'')+'</em>, this is the mix we would run.';
      $('cRecApply').style.display='none';
    } else {
      $('cRecTxt').innerHTML='We would run <em>'+num(sg.video)+' videos</em>, <em>'+num(sg.image)+' images</em>, <em>'+
        num(sg.talk)+' talking videos</em> and <em>'+num(sg.persona)+' brand persona'+(sg.persona>1?'s':'')+'</em> for this brief.';
      $('cRecApply').style.display='';
    }

    /* budget box */
    $('cBudgetVal').textContent=money0(S.budget/rate());
    if(S.budgetState==='headroom'){
      var eqM=Math.floor(S.budgetMonthsEq||0);
      $('cBudgetNote').innerHTML='This brief only needs <b>'+money0(S.budgetRecPriceUsd||0)+'</b>, so '+
        money0(S.budgetHeadroomUsd||0)+' of your budget is unspent. We do not pad volume you cannot publish. '+
        (eqM>36
          ? 'At this cadence the surplus would fund years of continuous output, which no brand can publish. Widen the brief substantially &#8212; more products, more channels, longer runway &#8212; or hold the difference back.'
          : (eqM>S.brief.months
            ? 'The same budget would instead run roughly <b>'+eqM+' months</b> at '+freqName().toLowerCase().replace('&#215;','×')+
              ' posting, or cover a wider product range &#8212; adjust the brief and this recalculates.'
            : 'Widen the brief to put the rest to work.'));
    } else {
      $('cBudgetNote').innerHTML='<b>Budget-constrained.</b> '+money0(S.budget/rate())+
        ' buys the volume below at a '+S.mult+'× markup, holding the mix we recommend for '+indOf().name.toLowerCase()+
        '. The full recommended plan is '+money0(S.budgetRecPriceUsd||0)+'.';
    }


    /* note */
    var estUsed=DELIVS.some(function(d){return S.qty[d.key]>0&&tierOf(d).src==='est';});
    $('cNote').innerHTML='Production cost is Higgsfield&#8217;s own rate, <b>$1 = 16 credits</b>'+
      (S.cur==='EUR'?', converted at <b>1 USD = 0.92 EUR</b>':'')+
      '. Platform assets assume each master is reformatted for one extra aspect ratio at no generation cost. '+
      (estUsed?'<b>Premium tiers use third-party estimates, not published Higgsfield rates.</b>':'');

    paintProposal(T,TR,PB,cmp);
  }

  function paintProposal(T,TR,PB,cmp){
    var ind=indOf(), b=S.brief, clientView=S.view==='client';

    $('cPropTitle').textContent='Reachers Content System for a '+ind.name+' brand';
    $('cPropMeta').innerHTML=[
      b.products+' product'+(b.products>1?'s':''),
      b.months+' month'+(b.months>1?'s':''),
      freqName().replace('&#215;','×')+' posting',
      goalOf().name
    ].map(function(x){return '<span>'+x+'</span>';}).join('');

    var rec='';
    DELIVS.forEach(function(d){
      if(S.qty[d.key]>0) rec+='<div><b>'+num(S.qty[d.key])+'</b><span>'+d.name+'</span></div>';
    });
    rec+='<div class="tot"><b>'+num(T.assets)+'</b><span>Total platform-ready assets, across every aspect ratio you publish in</span></div>';
    $('cPropReceive').innerHTML=rec;

    $('cPropPublish').innerHTML=PB.map(function(row){
      var outlets=row.parts.map(function(x){
        var ddx=delivOf(x.o.maps);
        return '<div class="pfoutlet"><div class="pfoName"><b>'+x.o.name+'</b><span>'+x.o.sub+'</span></div>'+
          '<div class="pfoQty">'+num(x.q)+'</div><div class="pfoCost">'+money(x.q*effCr(ddx,tierOf(ddx))*CREDIT_USD)+'</div></div>';
      }).join('');
      return '<div class="pfcard"><div class="pfhead"><span class="pfico" style="color:'+row.pf.color+';background:'+row.pf.color+'22;border-color:'+row.pf.color+'55">'+ICO[row.pf.ico]+'</span>'+
        '<div class="pfname"><b>'+row.pf.name+'</b><span>'+row.pf.outlets.length+' content types</span></div>'+
        '<div class="pftotal"><b>'+num(row.total)+'</b><i>assets</i></div></div>'+outlets+'</div>';
    }).join('');

    var perAssetUsd=T.assets>0?(clientView?T.priceUsd:T.costUsd)/T.assets:0;
    var runway=Math.max(1,Math.round(T.social/(Math.max(1,S.brief.freq)*4.33)));
    $('cRoiGrid').innerHTML=
      '<div class="croiCell"><b>'+num(T.assets)+'</b><i>Total assets</i></div>'+
      '<div class="croiCell"><b>'+freqName().replace('&#215;','×')+'</b><i>Posting frequency</i></div>'+
      '<div class="croiCell"><b>'+num(runway)+' mo</b><i>Content runway</i></div>'+
      '<div class="croiCell hero"><b>'+(T.assets>0?money(perAssetUsd):'—')+'</b><i>'+(clientView?'Investment':'Cost')+' per asset</i></div>';

    var tradRows=TR.lines.map(function(l){
      return '<div class="ccolRow"><span>'+num(l.n)+' '+l.label+'</span><b>'+money0e(l.total)+'</b></div>';}).join('');
    tradRows+='<div class="ccolRow"><span>Delivers</span><b>'+num(TR.deliveredClips)+' clips, '+num(TR.deliveredPhotos)+' photos</b></div>';
    var tnxUsd=clientView?T.priceUsd:T.priceUsd;
    $('cCompare').innerHTML=
      '<div class="ccol trad">'+
        '<div class="ccolHead"><span class="cvsIco" style="background:rgba(255,90,72,.13);border-color:rgba(255,90,72,.3);color:var(--red)">'+ICO.cam+'</span><b>Traditional production</b></div>'+
        tradRows+
        '<div class="ccolRow"><span>Time to delivery</span><b>~'+num(TR.weeks)+' weeks</b></div>'+
        '<div class="ccolRow"><span>Cost per deliverable</span><b>'+(cmp.ok?money0(cmp.tradPerUsd):'—')+'</b></div>'+
        '<div class="ccolTotal"><span>Total</span><b>'+money0e(TR.totalEur)+'</b><i>Fixed output. Re-shoot to change anything.</i></div>'+
      '</div>'+
      '<div class="cvsMid"><div class="cvsArrow">'+ICO.arrow+'</div><b>'+fmtMult(cmp.mult)+'</b><span>more output<br>per euro</span></div>'+
      '<div class="ccol tnx">'+
        '<div class="ccolHead"><span class="cvsIco" style="background:rgba(140,255,61,.13);border-color:rgba(140,255,61,.3);color:var(--lime)">'+ICO.spark+'</span><b>Reachers content system</b></div>'+
        '<div class="ccolRow"><span>'+num(T.masters)+' deliverables</span><b>'+num(T.assets)+' assets</b></div>'+
        '<div class="ccolRow"><span>Production time</span><b>'+(T.days===1?'1 day':num(T.days)+' days')+'</b></div>'+
        '<div class="ccolRow"><span>Variations per concept</span><b>Unlimited</b></div>'+
        '<div class="ccolRow"><span>Cost per deliverable</span><b>'+(cmp.ok?money(cmp.tnxPerUsd):'—')+'</b></div>'+
        '<div class="ccolTotal"><span>Investment</span><b>'+money0(tnxUsd)+'</b><i>Always-on. Re-run any concept at any time.</i></div>'+
        '<div class="ccolWins">'+
          '<div>'+ICO.check+'No shoot days, no reshoots</div>'+
          '<div>'+ICO.check+'Reusable brand persona</div>'+
          '<div>'+ICO.check+'Every asset a testable variant</div>'+
        '</div>'+
      '</div>';

    $('cPropInvest').innerHTML=
      '<div><span>Production timeline</span><b>'+(T.days===1?'1 day':num(T.days)+' days')+'</b><i>versus ~'+num(TR.weeks)+' weeks traditionally</i></div>'+
      '<div class="hero"><span>Investment</span><b>'+money0(T.priceUsd)+'</b><i>'+num(T.assets)+' assets &#183; '+money(perAssetUsd)+' per asset</i></div>';

    $('cCompareNote').innerHTML='Read this as a cost-per-deliverable comparison, not a like-for-like swap. '+
      'A studio shoot buys things a content system does not: physical product handling, a named talent&#8217;s likeness rights, '+
      'and footage of a real place at a real moment. What it cannot buy is volume, iteration or a library that keeps producing after the crew goes home. '+
      'Most brands end up running both &#8212; a small amount of hero production, and a system underneath it.';

    $('cPropBook').href=CAL_URL;
    $('cPropFine').innerHTML='Production sized on Higgsfield&#8217;s published credit pricing at $1 = 16 credits'+
      (S.cur==='EUR'?', converted at 1 USD = 0.92 EUR':'')+
      ', with a realistic generations-per-asset factor applied (video and talking-video assets typically need several takes to land one usable clip, not one shot). '+
      'Traditional comparison benchmarks a filming session at '+money0e(TRAD.session)+
      ' covering 10 products (3 clips and 10 photos per product &#8212; '+num(TRAD.clipsPerSession)+' clips and '+num(TRAD.photosPerSession)+' photos per session), '+
      'inclusive of studio, crew, talent and post; a session yields both, so the session count is whichever need is greater. '+
      'Brand ambassador contracts are costed separately at '+money0e(TRAD.persona)+' each. Volumes and timelines are estimates, not a contractual quote.';
  }

  /* ---- steps ---- */
  function showProposal(on){
    $('calcPanel').classList.toggle('propMode',!!on);
    if(on){var pr=$('calcProp'); if(pr) pr.scrollTop=0;}
    paint();
  }
  function syncMode(){
    document.querySelectorAll('.cmode button').forEach(function(b){
      b.classList.toggle('on',b.getAttribute('data-mode')===S.mode);
    });
    $('cBudgetBox').style.display=S.mode==='budget'?'':'none';
    $('cDelivs').style.display=S.mode==='platform'?'none':'';
    $('cPlatformPanel').style.display=S.mode==='platform'?'':'none';
    $('cRec').style.display=S.mode==='platform'?'none':'';
    $('cAutoNote').textContent=S.mode==='budget'?'Solved from your budget':
      (S.mode==='platform'?'Drag any outlet to adjust':'Pre-filled from your brief');
  }
  function refreshBrief(){
    var onChange=function(){
      if(S.mode==='budget'){applyBudget();}
      else if(S.mode==='platform'){seedPlatformsFromSuggestion();}
      else {applySuggestion();}
      refreshBrief(); paint();
    };
    chips($('cIndustry'),INDUSTRIES,S.brief.industry,function(id){S.brief.industry=id;onChange();},true);
    chips($('cFreq'),FREQS,S.brief.freq,function(id){S.brief.freq=+id;onChange();},false);
    chips($('cMonths'),MONTHS,S.brief.months,function(id){S.brief.months=+id;onChange();},false);
    chips($('cGoal'),GOALS,S.goal,function(id){S.goal=id;onChange();},true);
  }

  /* ---- wiring ---- */
  buildDelivs(); buildPlatformPanel(); refreshBrief(); syncMode();

  var prod=$('cProducts');
  prod.addEventListener('input',function(){
    S.brief.products=+prod.value; $('cProdVal').textContent=prod.value; setRangeFill(prod);
    if(S.mode==='budget'){applyBudget();}else{applySuggestion();}
    paint();
  });
  setRangeFill(prod);

  var mult=$('cMult');
  function setMult(v){
    v=parseFloat(v); if(!isFinite(v)||v<1) v=1;
    v=Math.round(v*100)/100; S.mult=v; mult.value=v;
    if(S.mode==='budget') applyBudget();
    paint();
  }
  mult.addEventListener('input',function(){
    var v=parseFloat(mult.value);
    if(isFinite(v)&&v>=1){S.mult=Math.round(v*100)/100; if(S.mode==='budget') applyBudget(); paint();}
  });
  mult.addEventListener('blur',function(){setMult(mult.value);});
  document.querySelectorAll('.cmBtn').forEach(function(b){
    b.addEventListener('click',function(){setMult(S.mult+parseFloat(b.getAttribute('data-mstep')));});
  });

  var bud=$('cBudget');
  bud.addEventListener('input',function(){S.budget=+bud.value;setRangeFill(bud);applyBudget();paint();});
  setRangeFill(bud);

  $('cRecApply').addEventListener('click',function(){S.mode='content';syncMode();applySuggestion();paint();});

  document.querySelectorAll('.cmode button').forEach(function(b){
    b.addEventListener('click',function(){
      S.mode=b.getAttribute('data-mode'); syncMode();
      if(S.mode==='budget'){applyBudget();}
      else if(S.mode==='platform'){seedPlatformsFromSuggestion();buildPlatformPanel();}
      else {applySuggestion();}
      paint();
    });
  });
  document.querySelectorAll('.calcCur button').forEach(function(b){
    b.addEventListener('click',function(){
      S.cur=b.getAttribute('data-cur');
      document.querySelectorAll('.calcCur button').forEach(function(x){x.classList.remove('on');});
      b.classList.add('on');
      $('cBudgetMin').textContent=num(250);
      $('cBudgetMax').textContent=num(25000);
      if(S.mode==='budget') applyBudget();
      paint();
    });
  });
  document.querySelectorAll('.cToggle button').forEach(function(b){
    b.addEventListener('click',function(){
      S.view=b.getAttribute('data-view');
      document.querySelectorAll('.cToggle button').forEach(function(x){x.classList.remove('on');});
      b.classList.add('on'); paint();
    });
  });
  $('cGenProp').addEventListener('click',function(){showProposal(true);});
  $('cPropBack').addEventListener('click',function(){showProposal(false);});
  $('cVsCard').addEventListener('click',function(){showProposal(true);});
  $('cPropPrint').addEventListener('click',function(){window.print();});

  var calcModal=$('calcModal'), calcLastFocus=null;
  function openCalc(){calcLastFocus=document.activeElement;calcModal.classList.add('open');document.body.style.overflow='hidden';}
  function closeCalc(){calcModal.classList.remove('open');document.body.style.overflow='';if(calcLastFocus)calcLastFocus.focus();}
  var cb=$('calcBtn'); if(cb) cb.addEventListener('click',openCalc);
  calcModal.addEventListener('click',function(e){
    if(e.target.hasAttribute('data-calcclose')||e.target.closest('[data-calcclose]'))closeCalc();
  });
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'&&calcModal.classList.contains('open'))closeCalc();
  });

  applySuggestion(); showProposal(false);
})();