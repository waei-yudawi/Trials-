/* Waei Yudawi V8 | V6 foundation | intentionally isolated educational experiences and owner controls. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const KEY_SCENES='wa3y_interactive_scenes_v1', KEY_LIT='wa3y_literature_v1';
  const KEY_NAV='wa3y_v8_navigation_v1', KEY_VISUALS='wa3y_v8_visuals_v1';
  const KEY_CALC='wa3y_v8_calc_settings_v1', KEY_HEAL='wa3y_timeline_healing_v1';
  const KEY_ORGANS='wa3y_organs_v2',KEY_VIS='wa3y_sections_vis_v2';
  const A='./assets/';
  const OWNER=()=>window.currentUserRole==='owner';
  const STAFF=()=>['owner','super_admin'].includes(window.currentUserRole);
  const clone=obj=>JSON.parse(JSON.stringify(obj));
  const store=(key,fallback)=>{try{const value=typeof getLocal==='function'?getLocal(key,fallback):fallback;return value===null||value===undefined?clone(fallback):value;}catch{return clone(fallback);}};
  const el=(tag,cls='',text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
  const escapeHTML=val=>String(val??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeURL=(u)=>{const v=String(u||'').trim();if(!v)return '';if(/^\.\/assets\/[a-zA-Z0-9._\-/]+$/.test(v)&&!v.includes('..'))return v;try{const obj=new URL(v,window.location.href);return obj.protocol==='https:'?obj.href:'';}catch{return '';}};
  const art=(u,fallback)=>safeURL(u)||safeURL(fallback)||'';
  const imgTag=(src,alt,cls='')=>{const u=art(src,'');return u?`<img class="${cls}" src="${escapeHTML(u)}" alt="${escapeHTML(alt)}" loading="lazy" decoding="async">`:'';};
  const notify=(msg,isError=false)=>{if(typeof showToast==='function')showToast(msg,isError?'error':'success');else console[isError?'warn':'info'](msg);};
  const format=(num)=>new Intl.NumberFormat('en-US',{maximumFractionDigits:2}).format(Number.isFinite(num)?num:0);
  const makeUUID=()=>{if(typeof crypto?.randomUUID==='function')return crypto.randomUUID();try{const a=new Uint8Array(16);crypto.getRandomValues(a);return [...a].map(x=>x.toString(16).padStart(2,'0')).join('');}catch{return String(Date.now())+'-'+Math.random().toString(36).slice(2);}};
  async function confirmStore(key,value,permission='owner'){
    if(permission==='owner'?!OWNER():!STAFF())throw new Error('لا توجد صلاحية لإجراء هذا التعديل');
    if(typeof saveLocalConfirmed!=='function')throw new Error('نظام المزامنة غير متاح');
    const ok=await saveLocalConfirmed(key,value);
    if(!ok)throw new Error('لم يؤكد الخادم حفظ التعديل؛ لن نعتبره محفوظًا');
    return true;
  }
  async function uploadArt(file,folder='v8-illustrations'){
    if(!OWNER()&&!STAFF())throw new Error('رفع الوسائط يتطلب حسابًا إداريًا');
    const allowed=['image/png','image/jpeg','image/webp','image/gif'];
    if(!file||!allowed.includes(file.type))throw new Error('الصيغة المقبولة PNG أو JPG أو WebP أو GIF فقط');
    if(file.size<=0||file.size>7*1024*1024)throw new Error('يجب ألا يتجاوز حجم الصورة 7 ميغابايت');
    if(typeof uploadToSupabaseStorage!=='function')throw new Error('خدمة رفع الوسائط غير جاهزة');
    // Upload the original GIF unchanged so animations are preserved.
    const url=await uploadToSupabaseStorage(file,folder);
    if(!safeURL(url))throw new Error('لم يُرجع المخزن رابطًا آمنًا للصورة');
    return url;
  }
  async function uploadPDF(file){
    if(!STAFF())throw Error('هذه العملية للمشرف المعتمد فقط');
    if(!file||file.size<=0||file.size>10*1024*1024)throw Error('ملف PDF يجب ألا يزيد عن 10 ميغابايت');
    if(file.type!=='application/pdf'&&!/\.pdf$/i.test(file.name||''))throw Error('المرفق يجب أن يكون PDF');
    const buf=await file.slice(0,5).arrayBuffer();
    if(new TextDecoder().decode(buf)!=='%PDF-')throw Error('توقيع الملف لا يشير إلى PDF سليم');
    const url=await uploadToSupabaseStorage(file,'literature-pdf');
    if(!safeURL(url))throw Error('تعذر التحقق من رابط الملف السحابي');return url;
  }
  const defaultScenes={
    nicotine:{brain:A+'brain.webp',character:A+'nicotine.webp',steps:[
      {title:'النيكوتين يصل إلى الدماغ',desc:'بعد استنشاق الدخان، يصل النيكوتين إلى الدماغ بسرعة. لا نكرر هنا شرح الأعضاء الموجود في «جسمك من جوا».',image:A+'nicotine.webp',buttonImage:''},
      {title:'الدماغ يبدأ بالاعتياد',desc:'عند تكرار التعرض، يتكيف الدماغ مع النيكوتين وتصبح الرغبة في تكرار التدخين أقوى لدى بعض الأشخاص.',image:A+'brain.webp',buttonImage:''},
      {title:'ينخفض النيكوتين… وتعود الرغبة',desc:'عندما يقل مستوى النيكوتين، قد تظهر رغبة في التدخين أو انزعاج. هنا نفهم ما يمكن أن يشعر به الشخص عند التوقف.',image:A+'nicotine.webp',buttonImage:''}
    ]},
    withdrawal:{states:[
      {label:'نفسي أدخّن',title:'الرغبة في التدخين',desc:'قد تعود الرغبة بقوة لفترة قصيرة، لكنها غالبًا تمرّ وتخف تدريجيًا.',tip:'غيّر مكانك واشغل نفسك بنشاط قصير أو تحدث مع شخص تثق به.',image:A+'student-sad.webp',buttonImage:A+'nicotine.webp'},
      {label:'راسي بوجعني',title:'صداع محتمل',desc:'قد يظهر صداع مؤقت أثناء تأقلم الجسم مع غياب النيكوتين. وليس كل صداع سببه التوقف.',tip:'الراحة وشرب الماء قد يساعدان. اطلب تقييمًا طبيًا للصداع الشديد أو غير المعتاد.',image:A+'student-sad.webp',buttonImage:A+'brain.webp'},
      {label:'بتضايق بسرعة',title:'تغيّر مؤقت في المزاج',desc:'قد تشعر بالعصبية أو سرعة الانفعال لبعض الوقت، ثم يخف الشعور عادةً مع التأقلم.',tip:'ابتعد قليلًا عن الموقف المزعج، وخذ استراحة قصيرة.',image:A+'student-sad.webp',buttonImage:A+'student-sad.webp'},
      {label:'حاسس بتوتر',title:'توتر وعدم ارتياح',desc:'يمكن أن يظهر توتر مؤقت عند غياب النيكوتين. التجربة تختلف من شخص لآخر.',tip:'جرّب التنفس بهدوء أو المشي أو طلب الدعم من شخص تثق به.',image:A+'student.webp',buttonImage:A+'student.webp'}
    ]},
    bravery:{friend:A+'student.webp',success:A+'student-brave.webp',wrong:A+'student-sad.webp',rounds:[
      {prompt:'زميلك بيحكيلك: «جرّب سيجارة واحدة بس!»',good:'لا، شكرًا. أنا ما بدخّن.',bad:'ماشي، رح أجرّب عشان ما أزعلك.',hint:'رد واضح وقصير كفاية؛ مش مطلوب منك تبرّر قرارك.',image:A+'student.webp',goodImage:A+'student-brave.webp',badImage:A+'student-sad.webp'},
      {prompt:'صاحبك بصرّ: «ليش ما بدك تجرب؟»',good:'سيبك منها، تعال نعمل إشي ثاني.',bad:'بضل أجادله لحد ما يقتنع.',hint:'تغيير الموضوع ممكن يخفف ضغط المجموعة.',image:A+'student.webp',goodImage:A+'student-walk.webp',badImage:A+'student-sad.webp'},
      {prompt:'الضغط عليك مستمر قدام المجموعة.',good:'بترك المكان وبروح لناس بحترموا قراري.',bad:'بوافق عشان ما يضحكوا عليّ.',hint:'الابتعاد عن الضغط قرار شجاع، وتقدر تطلب مساعدة شخص موثوق.',image:A+'student.webp',goodImage:A+'student-brave.webp',badImage:A+'student-sad.webp'}
    ]}
  };
  function scenes(){
    const raw=store(KEY_SCENES,{}),saved=raw&&typeof raw==='object'?raw:{};
    if(saved.v8&&typeof saved.v8==='object'){
      const merged=clone(defaultScenes);
      for(const type of Object.keys(merged)){
        const d=saved.v8[type];if(!d||typeof d!=='object')continue;
        for(const [k,v] of Object.entries(d)){
          if(Array.isArray(v)&&Array.isArray(merged[type][k]))merged[type][k]=v.map((r,i)=>({...merged[type][k][i],...r})).filter(Boolean);
          else merged[type][k]=v;
        }
      }
      return merged;
    }
    // Read V7 content if it was previously published, but never import its code/DOM.
    const d=clone(defaultScenes);
    if(saved.nicotine?.stages?.length){d.nicotine.brain=saved.nicotine.brain||d.nicotine.brain;d.nicotine.character=saved.nicotine.character||d.nicotine.character;d.nicotine.steps=saved.nicotine.stages.slice(0,3).map((v,i)=>({...d.nicotine.steps[i],title:v.title||d.nicotine.steps[i].title,desc:v.line||d.nicotine.steps[i].desc}));}
    if(saved.withdrawal?.items?.length){d.withdrawal.states=saved.withdrawal.items.slice(0,4).map((v,i)=>({...d.withdrawal.states[i],label:v.label||d.withdrawal.states[i].label,desc:v.line||d.withdrawal.states[i].desc,image:saved.withdrawal.images?.[i]||d.withdrawal.states[i].image}));}
    if(saved.bravery?.stages?.length){d.bravery.rounds=saved.bravery.stages.slice(0,3).map((v,i)=>({...d.bravery.rounds[i],prompt:v.prompt||d.bravery.rounds[i].prompt,good:v.right||d.bravery.rounds[i].good,bad:v.wrong||d.bravery.rounds[i].bad,hint:v.hint||d.bravery.rounds[i].hint}));Object.assign(d.bravery,{friend:saved.bravery.images?.idle||d.bravery.friend,success:saved.bravery.images?.good||d.bravery.success,wrong:saved.bravery.images?.bad||d.bravery.wrong});}
    return d;
  }
  let tab='nicotine',nicIndex=0,feelIndex=0,braveIndex=0,braveResult=null;
  function visualMap(){const v=store(KEY_VISUALS,{});return v&&typeof v==='object'&&!Array.isArray(v)?v:{};}
  const visual=(k,fallback)=>art(visualMap()[k],fallback);
  function makeRefusal(){
    const root=$('wy8-refusal-root');if(!root)return;
    root.innerHTML=`<section class="wy8-panel" aria-labelledby="wy8-refusal-title">
      <div class="wy8-panel-header"><div><span class="wy8-kicker">🛡️ مهارات تحمي قرارك</span><h2 id="wy8-refusal-title">فهم النيكوتين… ثم قول «لا» بثقة</h2><p class="wy8-muted">ثلاث تجارب مترابطة من غير إعادة شرح الأعضاء الموجودة في رحلة التدخين.</p></div><button type="button" class="wy8-secondary owner-only-btn hidden" id="wy8-edit-current">✎ تعديل هذه التجربة</button></div>
      <div class="wy8-journey-tabs" role="tablist" aria-label="المحتوى التفاعلي لقسم الرفض" id="wy8-refusal-tabs"></div>
      <div id="wy8-refusal-content" aria-live="polite"></div>
      <p class="wy8-muted" style="margin-top:15px">المعلومات للتثقيف ولا تعني أن الجميع يمر بالتجربة نفسها.</p>
    </section>`;
    $('wy8-edit-current').onclick=()=>openSceneEditor(tab);
    renderRefusal();
  }
  const tabList=[['nicotine','رحلة النيكوتين','tab-nicotine',A+'nicotine.webp'],['withdrawal','شو ممكن أحس؟','tab-withdrawal',A+'student-sad.webp'],['bravery','تحدي الشجاعة','tab-bravery',A+'student-brave.webp']];
  function changeTab(k){tab=k;renderRefusal();}
  function renderRefusal(){
    const root=$('wy8-refusal-content'),nav=$('wy8-refusal-tabs');if(!root||!nav)return;
    nav.replaceChildren();for(const [k,title,iconKey,fallback] of tabList){const b=el('button','wy8-tab');b.type='button';b.setAttribute('role','tab');b.setAttribute('aria-selected',String(tab===k));b.appendChild(el('img'));b.querySelector('img').src=visual(iconKey,fallback);b.querySelector('img').alt='';b.append(el('span','',title));b.onclick=()=>changeTab(k);nav.append(b);}
    if(tab==='nicotine')renderNicotine();else if(tab==='withdrawal')renderWithdrawal();else renderBravery();
    const edit=$('wy8-edit-current');if(edit)edit.classList.toggle('hidden',!OWNER());
  }
  function renderNicotine(){
    const d=scenes().nicotine;nicIndex=Math.max(0,Math.min(nicIndex,d.steps.length-1));const step=d.steps[nicIndex],root=$('wy8-refusal-content');if(!step){root.textContent='لم يُضف محتوى لهذه التجربة.';return;}
    root.innerHTML=`<div class="wy8-stage"><div class="wy8-artwork" data-nic-stage="${nicIndex}">${imgTag(d.brain,'رسم دماغ كرتوني')}${imgTag(step.image||d.character,'رسم كرتوني للنيكوتين','wy8-art-main')}</div><div class="wy8-stage-copy"><span class="wy8-count">الجزء ${nicIndex+1} من ${d.steps.length}</span><h3>${escapeHTML(step.title)}</h3><p>${escapeHTML(step.desc)}</p><div><button type="button" class="wy8-primary" id="wy8-nic-next">${imgTag(step.buttonImage,'', 'wy8-media-inline')} ${nicIndex===d.steps.length-1?'افهم ما قد تشعر به ←':'اكتشف ما يلي ←'}</button></div></div></div><div class="wy8-segment-footer"><span class="wy8-step-points">${d.steps.map((_,i)=>`<span class="${i===nicIndex?'active':''}"></span>`).join('')}</span><button type="button" class="wy8-ghost" id="wy8-nic-restart">إعادة البداية ↻</button></div>`;
    $('wy8-nic-next').onclick=()=>{if(nicIndex+1>=d.steps.length){feelIndex=0;changeTab('withdrawal');}else{nicIndex++;renderNicotine();}};
    $('wy8-nic-restart').onclick=()=>{nicIndex=0;renderNicotine();};
  }
  function renderWithdrawal(){
    const d=scenes().withdrawal;feelIndex=Math.max(0,Math.min(feelIndex,d.states.length-1));const state=d.states[feelIndex],root=$('wy8-refusal-content');if(!state){root.textContent='لا توجد حالات بعد.';return;}
    root.innerHTML=`<div class="wy8-stage wy8-feeling-stage"><div class="wy8-artwork">${imgTag(state.image,'شخصية كرتونية تعبّر عن الشعور','wy8-art-main')}</div><div class="wy8-stage-copy"><span class="wy8-count">قد يشعر بعض الأشخاص بهذه الحالة</span><h3>${escapeHTML(state.title)}</h3><p>${escapeHTML(state.desc)}</p><div class="wy8-tip"><strong>ما الذي قد يساعد؟</strong><p>${escapeHTML(state.tip||'اطلب دعم شخص موثوق.')}</p></div></div></div><div class="wy8-feelings" id="wy8-feeling-buttons"></div><div class="wy8-segment-footer"><span class="wy8-muted">اضغط على الشعور لتغيير تعبير الشخصية</span><button type="button" class="wy8-primary" id="wy8-to-brave">لنجرب الرفض بثقة ←</button></div>`;
    const list=$('wy8-feeling-buttons');d.states.forEach((v,i)=>{const b=el('button','wy8-feel');b.type='button';b.setAttribute('aria-pressed',String(feelIndex===i));const im=el('img');im.alt='';im.src=art(v.buttonImage,v.image);b.append(im,el('span','',v.label));b.onclick=()=>{feelIndex=i;renderWithdrawal();};list.append(b);});
    $('wy8-to-brave').onclick=()=>changeTab('bravery');
  }
  function renderBravery(){
    const d=scenes().bravery;braveIndex=Math.max(0,Math.min(braveIndex,d.rounds.length-1));const round=d.rounds[braveIndex],root=$('wy8-refusal-content');if(!round){root.textContent='لم تُضف مواقف بعد.';return;}
    const currentImg=braveResult===true?d.success:braveResult===false?d.wrong:round.image;
    root.innerHTML=`<div class="wy8-stage wy8-bravery-stage"><div class="wy8-artwork">${imgTag(currentImg,'طالب كرتوني في الموقف','wy8-art-main')}${imgTag(d.friend,'زميل في المدرسة')}</div><div class="wy8-stage-copy"><span class="wy8-count">الموقف ${braveIndex+1} من ${d.rounds.length}</span><h3>${escapeHTML(round.prompt)}</h3><p>اختر ردًا يناسب الموقف؛ تعلّم كيف تحافظ على قرارك بدون صراع.</p></div></div><div class="wy8-choice-grid" id="wy8-brave-choices"></div><div id="wy8-brave-feedback" class="wy8-feedback" ${braveResult===null?'hidden':''}></div><div class="wy8-bravery-footer"><span class="wy8-muted">الرد الهادئ الواثق أفضل من المجادلة الطويلة.</span><button type="button" class="wy8-primary" id="wy8-brave-next" ${braveResult===null?'hidden':''}>${braveResult===false?'أحاول مرة ثانية ↻':braveIndex+1===d.rounds.length?'أعيد التحدي ↻':'الموقف التالي ←'}</button></div>`;
    const options=$('wy8-brave-choices');
    [[true,round.good,round.goodImage],[false,round.bad,round.badImage]].forEach(([good,text,img])=>{
      const b=el('button','wy8-choice');b.type='button';b.disabled=braveResult!==null;
      if(img){const im=el('img');im.alt='';im.src=art(img,A+'student.webp');b.append(im);}
      b.append(el('span','',text));if(braveResult!==null&&good===braveResult)b.classList.add(good?'is-correct':'is-wrong');
      b.onclick=()=>{braveResult=good;renderBravery();};options.append(b);
    });
    const f=$('wy8-brave-feedback');if(braveResult!==null){f.textContent=(braveResult?'أحسنت! ':'جرّب من جديد. ')+(round.hint||'');f.classList.toggle('is-wrong',braveResult===false);}
    const next=$('wy8-brave-next');if(next)next.onclick=()=>{if(braveResult===false){braveResult=null;}else{braveIndex=(braveIndex+1)%d.rounds.length;braveResult=null;}renderBravery();};
  }
  // V6 recovery data, CRUD, owner upload, and active selection remain the canonical source.
  const healFallback={
    'hm-20m':{title:'قلبك يبدأ يرتاح',desc:'يبدأ نبض القلب وضغط الدم بالانخفاض بعد آخر سيجارة.',hint:'قد تبدأ فوائد التوقف سريعًا.',img:A+'heart.webp',organ:'القلب'},
    'hm-8h':{title:'يتراجع أول أكسيد الكربون',desc:'ينخفض أول أكسيد الكربون في الدم خلال الساعات الأولى، ما يحسّن قدرة الدم على حمل الأكسجين.',hint:'التغيّرات تقريبية وتختلف حسب التعرض.',img:A+'oxygen.webp',organ:'الدم'},
    'hm-48h':{title:'الحواس تبدأ بالتحسن',desc:'قد يتحسن الشم والتذوق تدريجيًا خلال الأيام الأولى بعد التوقف.',hint:'قد لا يكون التحسن بالسرعة نفسها لدى الجميع.',img:A+'student.webp',organ:'الحواس'},
    'hm-3m':{title:'التنفس قد يصبح أسهل',desc:'قد تتحسن الدورة الدموية ووظائف التنفس خلال الأسابيع والأشهر التالية.',hint:'قد يستغرق الأمر وقتًا، ويختلف من شخص لآخر.',img:A+'lungs.webp',organ:'الرئتان'},
    'hm-1y':{title:'خطوة مهمة لصحة القلب',desc:'مع استمرار التوقف تنخفض مخاطر أمراض القلب مقارنة بمواصلة التدخين.',hint:'الفوائد تتراكم مع الوقت.',img:A+'heart.webp',organ:'القلب'},
    'hm-10y':{title:'فوائد تستمر لسنوات',desc:'تنخفض مخاطر الإصابة بأمراض مرتبطة بالتدخين، ومنها سرطان الرئة، على المدى الطويل.',hint:'الابتعاد المستمر عن التدخين يحمي صحتك.',img:A+'lungs.webp',organ:'الصحة الطويلة'}
  };
  const getHealing=()=>{
    const fallback=typeof defaultHealingMilestones!=='undefined'?defaultHealingMilestones:[];
    const rows=store(KEY_HEAL,fallback);return Array.isArray(rows)?rows:[];
  };
  let healIndex=0,originalHealRender=null,originalHealSelect=null;
  function setupHealing(){
    const root=$('timelineHealingWidget');if(!root)return;root.classList.add('wy8-healing');
    const heading=root.querySelector('h3');if(heading)heading.textContent='مسار التعافي: جسمك يبدأ يستعيد توازنه';
    const badge=root.querySelector('.border-emerald-200');if(badge&&badge!==root)badge.textContent='🌱 مسار التعافي بعد التوقف';
    const intro=root.querySelector('p');if(intro)intro.textContent='استكشف ما قد يتغير داخل جسمك بعد التوقف. المراحل تقريبية وليست مواعيد ثابتة للجميع.';
    const bar=$('healingMilestonesBar');if(bar)bar.insertAdjacentElement('afterend',el('p','wy8-recovery-note','المعلومات تعليمية؛ الاستجابة للتوقف تختلف بحسب العمر والحالة الصحية ومدة التدخين.'));
    originalHealRender=window.renderTimelineHealingBar;originalHealSelect=window.selectTimelineMilestone;
    if(typeof originalHealRender==='function')window.renderTimelineHealingBar=function(){originalHealRender();renderHealingOverlay();};
    if(typeof originalHealSelect==='function')window.selectTimelineMilestone=function(i){healIndex=Number(i)||0;originalHealSelect(i);renderHealingOverlay();};
    window.renderTimelineHealingBar?.();
  }
  function renderHealingOverlay(){
    const rows=getHealing(),bar=$('healingMilestonesBar');if(!bar)return;
    if(!rows.length){bar.textContent='لم تُضف مراحل تعافٍ بعد.';return;}
    healIndex=Math.max(0,Math.min(healIndex,rows.length-1));bar.replaceChildren();
    const legacyList=typeof defaultHealingMilestones!=='undefined'?defaultHealingMilestones:[];
    rows.forEach((m,i)=>{
      const b=el('button','wy8-heal-milestone');b.type='button';b.setAttribute('aria-current',i===healIndex?'step':'false');
      const original=legacyList.find(v=>v.id===m.id),fallback=healFallback[m.id];
      const shouldFallback=fallback&&original&&(!m.mediaUrl||m.mediaUrl===original.mediaUrl||/^https?:\/\/images\.unsplash\.com\//.test(m.mediaUrl));
      const src=art(m.buttonImage,shouldFallback?fallback?.img:(art(m.mediaUrl,fallback?.img)));
      if(src){const im=el('img');im.src=src;im.alt='';b.append(im);}
      b.append(el('span','',m.timeLabel||`مرحلة ${i+1}`));b.onclick=()=>window.selectTimelineMilestone?.(i);bar.append(b);
    });
    const m=rows[healIndex],f=healFallback[m.id],original=legacyList.find(v=>v.id===m.id);
    const defaultText=!!(f&&original&&m.title===original.title);
    const set=(id,value)=>{if($(id))$(id).textContent=value||'';};
    set('milestoneTimeBadge',m.timeLabel);
    set('milestoneTargetOrgan',defaultText?f.organ:m.organ);
    set('milestoneTitle',defaultText?f.title:m.title);
    set('milestoneClinicalImpact',defaultText?f.desc:m.impact);
    set('milestoneLabMarker',defaultText?f.hint:(m.labMarker||'التغيّر يختلف من شخص لآخر.'));
    const im=$('timelineMediaImg'),video=$('timelineMediaVideoBox');
    if(im){const legacyMedia=!!(f&&original&&(!m.mediaUrl||m.mediaUrl===original.mediaUrl||/^https?:\/\/images\.unsplash\.com\//.test(m.mediaUrl)));
      const chosen=art(legacyMedia?f?.img:m.mediaUrl,f?.img||A+'student.webp');
      if(chosen){im.src=chosen;im.classList.remove('hidden');}if(video){video.classList.add('hidden');video.replaceChildren();}
      const label=$('milestoneMediaLabel');if(label)label.textContent=chosen.toLowerCase().split('?')[0].endsWith('.gif')?'رسم GIF متحرك':'رسم توضيحي';
    }
    // If an owner supplied a supported video in V6, keep its legacy player instead of overriding it.
    if(m.mediaType==='video'&&/^https:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\//i.test(String(m.mediaUrl||''))){
      const yt=String(m.mediaUrl).match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
      if(yt&&video){video.replaceChildren();const frame=el('iframe');frame.src='https://www.youtube-nocookie.com/embed/'+yt[1];frame.title='فيديو مسار التعافي';frame.loading='lazy';frame.allowFullscreen=true;frame.setAttribute('allow','accelerometer;autoplay;encrypted-media;gyroscope;picture-in-picture');video.append(frame);video.classList.remove('hidden');if(im)im.classList.add('hidden');}
    }
  }
  // Financial calculator: preserve the V6 slider and price presets; add a single savings visual.
  const defaultGoals=[{id:'books',title:'كتب',cost:150,image:A+'goal-books.webp'},{id:'headphones',title:'سماعات',cost:300,image:A+'goal-headphones.webp'},{id:'bike',title:'دراجة',cost:900,image:A+'goal-bike.webp'}];
  const defaultCalc={goals:defaultGoals,jar:A+'jar.webp',coin:A+'coin.webp'};
  function calcSettings(){const raw=store(KEY_CALC,{});const data=clone(defaultCalc);if(raw&&typeof raw==='object'){
    if(Array.isArray(raw.goals)&&raw.goals.length)data.goals=raw.goals.map((g,i)=>({...defaultGoals[i],...g}));if(raw.jar)data.jar=raw.jar;if(raw.coin)data.coin=raw.coin;
  }return data;}
  let price=70,goalId='books',period=30,calcWrapped=false;
  function setupCalculator(){
    const ext=$('wy8-calc-extension');if(!ext)return;
    ext.innerHTML=`<div class="wy8-calc-shell"><div class="wy8-panel-header"><div><span class="wy8-kicker">💰 مرطبان الأحلام</span><h2 style="font-family:Cairo;font-size:23px;font-weight:900;margin:8px 0 0">لو وفّرت هالمبلغ، شو ممكن تحقق؟</h2><p class="wy8-muted">الحاسبة القديمة نفسها، مع عرض بصري وأهداف اختيارية.</p></div></div>
      <div class="wy8-calc-grid"><div class="wy8-jar-wrap" id="wy8-jar-wrap">${imgTag(A+'jar.webp','مرطبان توفير مرسوم كرتوني','wy8-jar-image')}<div class="wy8-coins" id="wy8-coins"></div></div><div><label class="wy8-field">السعر الحقيقي للسيجارة الواحدة بالشيكل (قابل للتعديل)<input id="wy8-price" type="number" min="0" max="1000" step="0.5" inputmode="decimal" value="70" aria-label="سعر السيجارة الواحدة"></label>
      <div class="wy8-calc-figures" style="margin-top:12px"><div class="wy8-calc-stat"><small>التوفير في 30 يومًا</small><strong id="wy8-month-amount">0 ₪</strong></div><div class="wy8-calc-stat"><small>التوفير في 365 يومًا</small><strong id="wy8-year-amount">0 ₪</strong></div></div><p class="wy8-muted" style="margin-top:8px">افتراض: يتوقف الإنفاق على السجائر بالكامل طوال الفترة.</p></div></div>
      <div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-top:15px"><strong>اختَر هدفًا للمال</strong><div id="wy8-periods" class="flex gap-2"><button class="wy8-ghost" data-days="7" type="button">أسبوع</button><button class="wy8-ghost" data-days="30" type="button">شهر</button><button class="wy8-ghost" data-days="365" type="button">سنة</button></div></div><div class="wy8-calc-goals" id="wy8-calc-goals"></div>
      <div class="wy8-progress" role="progressbar" id="wy8-goal-progress" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"><span style="width:0" id="wy8-goal-fill"></span></div><p class="wy8-muted" id="wy8-goal-caption" style="margin-top:8px"></p>
      <button id="wy8-edit-goals" class="wy8-secondary owner-only-btn hidden" type="button" style="margin-top:10px">✎ تعديل الأهداف وصورها</button>
    </div>`;
    $('wy8-price').addEventListener('input',()=>{const p=Number($('wy8-price').value);price=Number.isFinite(p)?Math.max(0,Math.min(1000,p)):0;renderCalculator();});
    $('wy8-edit-goals').onclick=()=>openGoalsEditor();
    $('wy8-periods').querySelectorAll('button').forEach(b=>b.onclick=()=>{period=Number(b.dataset.days);renderCalculator();});
    if(!calcWrapped){calcWrapped=true;const legacySet=window.setCalcPrice;
      window.setCalcPrice=function(p,btn){if(typeof legacySet==='function')legacySet(p,btn);price=Number(p)||0;if($('wy8-price'))$('wy8-price').value=price;renderCalculator();};
      const legacyUpdate=window.updateFinancialCalc;
      window.updateFinancialCalc=function(){if(typeof legacyUpdate==='function')legacyUpdate();renderCalculator();};
    }
    $('calcCigsSlider')?.setAttribute('min','0');
    renderCalculator();
  }
  function renderCalculator(){
    if(!$('wy8-month-amount'))return;const slider=$('calcCigsSlider'),n=Math.max(0,Math.min(40,Number(slider?.value)||0)),daily=n*price,month=daily*30,year=daily*365;
    if($('calcCigsCountLabel'))$('calcCigsCountLabel').textContent=n+' سيجارة';
    if($('calcMonthlyWaste'))$('calcMonthlyWaste').textContent=format(month)+' ₪';
    if($('calcYearlyWaste'))$('calcYearlyWaste').textContent=format(year)+' ₪';
    $('wy8-month-amount').textContent=format(month)+' ₪';$('wy8-year-amount').textContent=format(year)+' ₪';
    const config=calcSettings();const goals=config.goals;if(!goals.some(g=>g.id===goalId))goalId=goals[0]?.id;
    const holder=$('wy8-calc-goals');holder.replaceChildren();goals.forEach(g=>{const b=el('button','wy8-goal');b.type='button';b.setAttribute('aria-pressed',String(g.id===goalId));
      const im=el('img');im.src=art(g.image,A+'goal-books.webp');im.alt='';b.append(im,el('span','',g.title||'هدف'));b.onclick=()=>{goalId=g.id;renderCalculator();};holder.append(b);});
    const chosen=goals.find(g=>g.id===goalId);const cost=Number(chosen?.cost)||1,total=daily*period,ratio=Math.max(0,Math.min(100,total/cost*100));
    $('wy8-goal-fill').style.width=ratio+'%';$('wy8-goal-progress').setAttribute('aria-valuenow',String(Math.round(ratio)));
    $('wy8-goal-caption').textContent=daily>0?`خلال ${period} يومًا: ${format(total)} ₪. ${total>=cost?'المبلغ يغطي هدفك «'+chosen.title+'»!':'قد تصل لهدفك «'+chosen.title+'» بعد '+Math.ceil(cost/daily)+' يومًا.'}`:'أدخل سعرًا وعددًا أكبر من الصفر لرؤية التوفير.';
    const jar=$('wy8-jar-wrap .wy8-jar-image');if(jar)jar.src=art(config.jar,A+'jar.webp');
    const coins=$('wy8-coins');const count=Math.min(13,Math.floor(ratio/8));if(coins.children.length!==count){coins.replaceChildren();for(let i=0;i<count;i++){const im=el('img');im.src=art(config.coin,A+'coin.webp');im.alt='';im.style.left=(25+(i%4)*16)+'%';im.style.bottom=(15+Math.floor(i/4)*15)+'%';im.style.opacity=String(.5+Math.min(.5,i/20));coins.append(im);}}
    $('wy8-periods').querySelectorAll('button').forEach(b=>{b.style.background=Number(b.dataset.days)===period?'#922d3c':'';b.style.color=Number(b.dataset.days)===period?'#fff':'';});
    $('wy8-edit-goals').classList.toggle('hidden',!OWNER());
  }
  // Responsive literary works, with separate detail view and an administrative editor.
  let litEditing=null;
  const works=()=>{const data=store(KEY_LIT,[]);return Array.isArray(data)?data.slice():[];};
  const sortedWorks=rows=>rows.slice().sort((a,b)=>(Number(a.order)||0)-(Number(b.order)||0));
  function setupLiterature(){
    if($('screen-literature'))return;
    const screen=el('section','wy8-literature hidden space-y-6');screen.id='screen-literature';screen.dir='rtl';
    screen.innerHTML=`<div class="flex items-center justify-between pb-3 border-b border-brandGray-200"><button type="button" class="wy8-secondary" id="wy8-lit-home">← الرجوع للرئيسية</button><span class="wy8-muted">المنصة / الأدبيات</span></div>
      <header class="wy8-panel"><div class="wy8-panel-header"><div><span class="wy8-kicker">📚 مساحة للكلمة والوعي</span><h2>الأدبيات</h2><p class="wy8-muted">أعمال أدبية مرتبطة برسالة «وعي يداوي»، يضيفها فريق الموقع وينشرها بعد المراجعة.</p></div><button id="wy8-manage-literature" type="button" class="wy8-secondary admin-allowed-btn hidden">✎ إدارة الأدبيات</button></div></header>
      <div id="wy8-lit-grid" class="wy8-lit-grid" aria-live="polite"></div>`;
    const community=$('screen-community');if(community)community.insertAdjacentElement('afterend',screen);
    $('wy8-lit-home').onclick=()=>window.switchMainScreen('screen-home');
    $('wy8-manage-literature').onclick=openLiteratureManager;
    const oldSwitch=window.switchMainScreen;
    if(typeof oldSwitch==='function')window.switchMainScreen=function(id,...args){
      if(id==='screen-literature'){oldSwitch.call(this,'screen-home',...args);document.querySelectorAll('main [id^="screen-"]').forEach(x=>x.classList.add('hidden'));screen.classList.remove('hidden');window.scrollTo({top:0,behavior:'instant'});renderLiterature();if(typeof window.recordVisitorAction==='function')window.recordVisitorAction('زيارة الأدبيات');}
      else {screen.classList.add('hidden');oldSwitch.call(this,id,...args);} };
    renderLiterature();
  }
  function renderLiterature(){
    const host=$('wy8-lit-grid');if(!host)return;
    host.replaceChildren();const publicRows=sortedWorks(works()).filter(w=>w.published!==false);
    if(!publicRows.length){const empty=el('div','wy8-panel');empty.style.gridColumn='1/-1';empty.innerHTML=`<div style="display:flex;align-items:center;gap:18px;flex-wrap:wrap">${imgTag(A+'goal-books.webp','كتب مرسومة كرتونيًا','wy8-owner-preview')}<div><h3 style="font-weight:900;font-size:17px">قريبًا: أعمال أدبية جديدة</h3><p class="wy8-muted">لم تُنشر أعمال أدبية حتى الآن.</p></div></div>`;host.append(empty);}
    for(const work of publicRows){
      const card=el('article','wy8-lit-card'),cover=el('div','wy8-lit-cover');const img=el('img');img.loading='lazy';img.alt='غلاف '+(work.title||'عمل أدبي');img.src=art(work.image,A+'goal-books.webp');if(!work.image)img.className='fallback-img';cover.append(img);
      const body=el('div','wy8-lit-content');body.append(el('small','',work.kind||'عمل أدبي'),el('h3','',work.title||'عنوان غير محدد'),el('small','',(work.author||'')+(work.credential?' — '+work.credential:'')));
      const text=el('p','',work.summary||'');body.append(text);
      const actions=el('div','wy8-lit-actions'),read=el('button','wy8-primary','التفاصيل والقراءة');read.type='button';read.onclick=()=>openLiteratureDetail(work.id);actions.append(read);body.append(actions);card.append(cover,body);host.append(card);
    }
    $('wy8-manage-literature')?.classList.toggle('hidden',!STAFF());
  }
  function showModal(title,markup){
    closeModal();const overlay=el('div','wy8-lit-modal');overlay.id='wy8-dialog-overlay';overlay.setAttribute('role','presentation');
    const box=el('div','wy8-lit-dialog');box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');box.setAttribute('aria-label',title);box.innerHTML=`<div class="wy8-editor-head"><h2 style="font-weight:900;font-size:19px">${escapeHTML(title)}</h2><button type="button" id="wy8-dialog-close" aria-label="إغلاق" class="wy8-ghost">✕</button></div>`+markup;
    overlay.append(box);document.body.append(overlay);$('wy8-dialog-close').onclick=closeModal;overlay.addEventListener('click',e=>{if(e.target===overlay)closeModal();});
    setTimeout(()=>$('wy8-dialog-close')?.focus(),0);return box;
  }
  function closeModal(){$('wy8-dialog-overlay')?.remove();}
  function openLiteratureDetail(id){
    const work=works().find(w=>w.id===id&&w.published!==false);if(!work)return;
    const link=art(work.link,''),file=art(work.file,'');
    const box=showModal(work.title||'تفاصيل العمل',`<div class="wy8-lit-detail-head" style="margin:17px 0">${imgTag(work.image||A+'goal-books.webp','غلاف العمل')}<div><span class="wy8-kicker">${escapeHTML(work.kind||'عمل أدبي')}</span><h2>${escapeHTML(work.title)}</h2><p class="wy8-muted">بقلم: ${escapeHTML(work.author||'غير محدد')}</p><p class="wy8-muted">${escapeHTML(work.credential||'')}</p></div></div><p style="white-space:pre-wrap;line-height:2;color:#424650;margin:16px 0">${escapeHTML(work.summary||'')}</p><div id="wy8-lit-detail-links" class="wy8-lit-actions"></div>`);
    const links=box.querySelector('#wy8-lit-detail-links');for(const [name,url,key] of [['قراءة العمل',link,'readButtonImage'],['فتح ملف PDF',file,'fileButtonImage']]){
      if(!url)continue;const a=el('a','wy8-primary');a.href=url;a.target='_blank';a.rel='noopener noreferrer';if(work[key]){const img=el('img','wy8-media-inline');img.src=art(work[key],'');img.alt='';a.append(img);}a.append(el('span','',name));links.append(a);
    }
  }
  function openLiteratureManager(){if(!STAFF())return notify('هذه الأداة للمشرف المعتمد فقط',true);const box=showModal('إدارة الأدبيات',`<p class="wy8-muted" style="margin:12px 0">إضافة الأعمال وتعديلها وإخفاؤها وترتيبها. لا تظهر المسودات للزائر.</p><button type="button" class="wy8-primary" id="wy8-lit-add">+ عمل جديد</button><div id="wy8-lit-manager-list" style="margin-top:14px"></div>`);box.querySelector('#wy8-lit-add').onclick=()=>openLiteratureForm();renderLiteratureManager();}
  function renderLiteratureManager(){const list=$('wy8-lit-manager-list');if(!list)return;list.replaceChildren();const rows=sortedWorks(works());if(!rows.length){list.textContent='لا توجد أعمال بعد.';return;}
    rows.forEach((w,i)=>{const row=el('div','wy8-owner-item');row.append(el('strong','',(w.title||'عنوان')+' — '+(w.author||'')+(w.published===false?' (مخفي)':'')));
      const actions=el('div','flex gap-2 flex-wrap');for(const [label,cb] of [['تعديل',()=>openLiteratureForm(w.id)],[(w.published===false?'إظهار':'إخفاء'),()=>mutateLit(w.id,'toggle')],['↑',()=>mutateLit(w.id,'up')],['↓',()=>mutateLit(w.id,'down')],['حذف',()=>mutateLit(w.id,'delete')]]){
        const b=el('button','wy8-secondary',label);b.type='button';b.onclick=cb;actions.append(b);
      }row.append(actions);list.append(row);});
  }
  async function mutateLit(id,operation){if(!STAFF())return;let rows=sortedWorks(works()),i=rows.findIndex(w=>w.id===id);if(i<0)return;
    if(operation==='toggle')rows[i].published=rows[i].published===false;
    else if(operation==='delete'){if(!window.confirm('هل تريد حذف هذا العمل؟ لا يمكن استعادته إلا من نسخة احتياطية.'))return;rows.splice(i,1);}
    else {const j=i+(operation==='up'?-1:1);if(j<0||j>=rows.length)return;[rows[i],rows[j]]=[rows[j],rows[i]];}
    rows.forEach((w,j)=>w.order=j+1);
    try{await confirmStore(KEY_LIT,rows,'staff');renderLiterature();renderLiteratureManager();notify('تم حفظ التعديل سحابيًا');}catch(e){notify(e.message,true);}
  }
  function openLiteratureForm(id=null){if(!STAFF())return;litEditing=id;const w=works().find(x=>x.id===id)||{};
    const box=showModal(id?'تعديل العمل الأدبي':'إضافة عمل أدبي',`<form id="wy8-literature-form" class="wy8-editor-body">
      <div class="wy8-owner-form-grid"><label class="wy8-field">عنوان العمل *<input name="title" maxlength="200" required></label><label class="wy8-field">اسم الكاتب / الكاتبة *<input name="author" maxlength="160" required></label></div>
      <div class="wy8-owner-form-grid"><label class="wy8-field">الصفة العلمية أو التعريف بالكاتب<input name="credential" maxlength="160" placeholder="اختياري"></label><label class="wy8-field">نوع العمل<input name="kind" maxlength="100" placeholder="قصة، خاطرة، قصيدة، مقال..."></label></div>
      <label class="wy8-field">وصف العمل أو نص تمهيدي *<textarea name="summary" maxlength="5000" rows="5" required></textarea></label>
      <div class="wy8-owner-form-grid"><label class="wy8-field">رابط قراءة العمل (HTTPS)<input name="link" type="url" placeholder="https://"></label><label class="wy8-field">رابط ملف PDF (HTTPS)<input name="file" type="url" placeholder="https://"></label></div>
      <label class="wy8-field">رفع ملف PDF (حتى 10 ميغابايت)<input name="pdfFile" type="file" accept="application/pdf,.pdf"></label>
      <label class="wy8-field">رابط الغلاف PNG/JPG/GIF/WebP<input name="image" type="text" placeholder="https://"></label>
      <label class="wy8-field">رفع غلاف صورة أو GIF (حتى 7 ميغابايت)<input name="coverFile" type="file" accept="image/png,image/jpeg,image/webp,image/gif"></label>
      <div class="wy8-owner-form-grid"><label class="wy8-field">صورة زر القراءة (اختيارية)<input name="readButtonFile" type="file" accept="image/png,image/jpeg,image/webp,image/gif"></label><label class="wy8-field">صورة زر PDF (اختيارية)<input name="fileButtonFile" type="file" accept="image/png,image/jpeg,image/webp,image/gif"></label></div>
      <label style="display:flex;gap:7px;align-items:center;font-size:13px;font-weight:800"><input name="published" type="checkbox"> نشر العمل للزوار</label>
      <div class="wy8-status" id="wy8-lit-save-status">لن يُعلن نجاح الحفظ قبل تأكيده من Supabase.</div>
      <div class="flex gap-3 flex-wrap"><button type="submit" class="wy8-primary" id="wy8-lit-save">حفظ ومزامنة</button><button type="button" class="wy8-secondary" id="wy8-lit-cancel">إلغاء</button></div></form>`);
    const f=box.querySelector('#wy8-literature-form');for(const k of ['title','author','credential','kind','summary','link','file','image'])f.elements[k].value=w[k]||'';f.elements.published.checked=w.published!==false;
    f.onsubmit=saveLiteratureForm;box.querySelector('#wy8-lit-cancel').onclick=openLiteratureManager;
  }
  async function saveLiteratureForm(event){event.preventDefault();if(!STAFF())return;const form=event.currentTarget,b=form.querySelector('#wy8-lit-save'),status=$('wy8-lit-save-status');b.disabled=true;
    try{
      let data={};for(const k of ['title','author','credential','kind','summary','link','file','image'])data[k]=form.elements[k].value.trim();
      for(const k of ['title','author','summary'])if(!data[k])throw Error('العنوان والكاتب والوصف حقول مطلوبة');
      for(const k of ['link','file','image'])if(data[k]&&!safeURL(data[k]))throw Error('استخدم روابط HTTPS فقط');
      status.textContent='جارٍ التحقق من الملفات ورفعها...';
      const cover=form.elements.coverFile.files?.[0],pdf=form.elements.pdfFile.files?.[0];
      if(cover)data.image=await uploadArt(cover,'literature-covers');if(pdf)data.file=await uploadPDF(pdf);
      for(const [field,key] of [['readButtonFile','readButtonImage'],['fileButtonFile','fileButtonImage']]){const file=form.elements[field].files?.[0];if(file)data[key]=await uploadArt(file,'literature-buttons');}
      data.published=form.elements.published.checked;
      const rows=works(),i=rows.findIndex(w=>w.id===litEditing);
      if(i>=0){data={...rows[i],...data};rows[i]=data;}else{data.id='lit-'+makeUUID();data.order=rows.reduce((m,w)=>Math.max(m,Number(w.order)||0),0)+1;rows.push(data);}
      status.textContent='جارٍ تأكيد المزامنة السحابية...';await confirmStore(KEY_LIT,rows,'staff');renderLiterature();openLiteratureManager();notify('تم حفظ العمل الأدبي ومزامنته');
    }catch(e){status.textContent='فشل الحفظ: '+e.message;status.classList.add('error');notify('تعذر حفظ العمل: '+e.message,true);}finally{b.disabled=false;}
  }
  // Navigation management changes placement only; the section routes and permissions stay intact.
  const catalog=[
    ['screen-team-field','فريقنا والميدان','users-gear'],['screen-community','شكر وتقدير وآراء التجربة','award'],
    ['screen-anatomy','جسمك من جوا','lungs'],['screen-lab','مختبر الحقيقة والسيجارة الذكية','flask-vial'],
    ['screen-research','الدراسات والأبحاث','book-medical'],['screen-calc','احسبها وتحدّى','calculator'],
    ['screen-sayno','كيف ترفض؟ ومواقف واقعية','hand'],['screen-literature','الأدبيات','book-open']
  ];
  const catalogIds=catalog.map(x=>x[0]);
  const navLabel=id=>catalog.find(row=>row[0]===id)?.[1]||id;
  let navDraft=null,navDom={home:{},drawer:{},homeBtn:null};
  function defaultNav(){return catalogIds.map(id=>({id,parent:''}));}
  function navState(){const raw=store(KEY_NAV,defaultNav());const entries=Array.isArray(raw)?raw:defaultNav();const rows=[];
    for(const [id] of catalog){const found=entries.find(r=>r&&r.id===id);rows.push({id,parent:typeof found?.parent==='string'&&catalogIds.includes(found.parent)&&found.parent!==id?found.parent:''});}
    for(const r of rows){const seen=new Set([r.id]);let cur=r.parent;while(cur){if(seen.has(cur)){r.parent='';break;}seen.add(cur);cur=rows.find(v=>v.id===cur)?.parent||'';}}
    return rows;
  }
  function installNavigation(){
    const home=$('slimBentoTabsContainer'),drawer=$('drawerNavLinks');if(!home||!drawer)return;
    // V6 has exactly one visual home tile and one mobile link for each existing screen.
    // Add literature using those same components rather than installing a new navigation system.
    let communityTile=[...home.querySelectorAll('.bento-tab-stripe')].find(x=>(x.getAttribute('onclick')||'').includes('screen-community'));
    // V6 has a community drawer route but no matching home stripe: preserve its discoverability.
    if(!communityTile){communityTile=el('div','bento-tab-stripe');communityTile.setAttribute('onclick',"switchMainScreen('screen-community')");communityTile.setAttribute('role','button');communityTile.tabIndex=0;
      communityTile.innerHTML='<div class="flex items-center gap-3"><span class="w-9 h-9 rounded-xl bg-rose-50 text-crimson flex items-center justify-center text-sm"><i class="fa-solid fa-award"></i></span><div class="text-right"><h3 class="text-sm font-bold text-slate-800 font-cairo">شكر وتقدير وآراء التجربة</h3><p class="text-[11px] text-brandGray-500 font-plex">من فريق المبادرة وزوارها</p></div></div><i class="fa-solid fa-chevron-left text-xs text-brandGray-400"></i>';
      communityTile.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();window.switchMainScreen('screen-community');}});home.append(communityTile);
    }
    const litTile=el('div','bento-tab-stripe');litTile.setAttribute('onclick',"switchMainScreen('screen-literature')");litTile.setAttribute('role','button');litTile.tabIndex=0;
    litTile.innerHTML='<div class="flex items-center gap-3"><span class="w-9 h-9 rounded-xl bg-rose-50 text-crimson flex items-center justify-center text-sm"><i class="fa-solid fa-book-open"></i></span><div class="text-right"><h3 class="text-sm font-bold text-slate-800 font-cairo">الأدبيات</h3><p class="text-[11px] text-brandGray-500 font-plex">أعمال أدبية مرتبطة برسالة الموقع</p></div></div><i class="fa-solid fa-chevron-left text-xs text-brandGray-400"></i>';
    litTile.addEventListener('click',()=>window.switchMainScreen('screen-literature'));
    litTile.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();window.switchMainScreen('screen-literature');}});
    // onclick attribute is retained for V6 show/hide and inspector compatibility; no duplicated navigation.
    litTile.removeAttribute('onclick');litTile.dataset.navScreen='screen-literature';
    if(communityTile)communityTile.insertAdjacentElement('afterend',litTile);else home.append(litTile);
    const litButton=el('button','w-full text-right p-2.5 rounded-xl text-slate-800 hover:bg-brandGray-100 flex items-center gap-2.5 font-bold transition');litButton.type='button';litButton.dataset.navScreen='screen-literature';litButton.innerHTML='<i class="fa-solid fa-book-open text-crimson w-5 text-center"></i><span class="wy-nav-label">الأدبيات</span>';litButton.onclick=()=>window.switchMainScreen('screen-literature');drawer.append(litButton);
    const homeNodes=[...home.querySelectorAll('.bento-tab-stripe')];const drawerNodes=[...drawer.querySelectorAll('button')];navDom.homeBtn=drawerNodes.find(x=>(x.getAttribute('onclick')||'').includes('screen-home'))||drawerNodes[0];
    for(const id of catalogIds){navDom.home[id]=homeNodes.find(x=>(x.getAttribute('onclick')||'').includes(id)||x.dataset.navScreen===id);
      navDom.drawer[id]=drawerNodes.find(x=>(x.getAttribute('onclick')||'').includes(id)||x.dataset.navScreen===id);}
    // Preserve native `onclick` handlers on original tiles and menu items.
    applyNav();
  }
  function applyNav(){const home=$('slimBentoTabsContainer'),drawer=$('drawerNavLinks');if(!home||!drawer||!navDom.home[catalogIds[0]])return;
    const rows=navState(),vis=store(KEY_VIS,{});home.replaceChildren();drawer.replaceChildren();if(navDom.homeBtn)drawer.append(navDom.homeBtn);
    const visited=new Set();
    function appendRow(id,homeTarget,drawerTarget,depth){if(depth>catalogIds.length||visited.has(id))return;visited.add(id);
      const card=navDom.home[id],button=navDom.drawer[id];if(!card&&!button)return;
      const children=rows.filter(r=>r.parent===id).map(r=>r.id);
      const isHidden=vis[id]===false;
      card?.classList.toggle('hidden',isHidden);button?.classList.toggle('hidden',isHidden);
      if(!card){if(button)drawerTarget.append(button);for(const kid of children)appendRow(kid,homeTarget,drawerTarget,depth+1);return;}
      if(!button){homeTarget.append(card);for(const kid of children)appendRow(kid,homeTarget,drawerTarget,depth+1);return;}
      if(children.length){const wrapper=el('div','wy8-nav-group');const sub=el('div','wy8-nav-subitems');wrapper.append(card,sub);homeTarget.append(wrapper);
        const menuGroup=el('div','wy8-drawer-group'),menuKids=el('div','wy8-drawer-subitems');menuGroup.append(button,menuKids);drawerTarget.append(menuGroup);
        if(isHidden){wrapper.classList.add('hidden');menuGroup.classList.add('hidden');}
        for(const kid of children)appendRow(kid,sub,menuKids,depth+1);
      }else{homeTarget.append(card);drawerTarget.append(button);}
    }
    for(const row of rows.filter(r=>!r.parent))appendRow(row.id,home,drawer,0);
    // Invalid/cyclic remote content is not allowed to make a section disappear.
    for(const row of rows)if(!visited.has(row.id))appendRow(row.id,home,drawer,0);
  }
  // Owner-only visual controls: original files or uploaded GIFs are stored as HTTPS URLs, never as large base64 blobs.
  function setPath(obj,path,value){const parts=path.split('.');let target=obj;for(let i=0;i<parts.length-1;i++){
      const key=/^\d+$/.test(parts[i])?Number(parts[i]):parts[i];if(!target[key]||typeof target[key]!=='object')target[key]={};target=target[key];
    }const last=parts[parts.length-1];target[/^\d+$/.test(last)?Number(last):last]=value;
  }
  function formField(desc){const wrapper=el('label','wy8-field');wrapper.append(el('span','',desc.label));
    const input=el(desc.multiline?'textarea':'input');if(!desc.multiline)input.type=desc.numeric?'number':'text';input.value=desc.value===undefined?'':String(desc.value);input.dataset.wy8Path=desc.path;
    input.maxLength=desc.media?3000:desc.multiline?1800:400;if(desc.multiline)input.rows=3;if(desc.numeric){input.min='0';input.max='1000000';input.step='0.5';}
    if(desc.media)input.placeholder='رابط HTTPS أو مسار صورة محلية';wrapper.append(input);
    if(desc.media){const file=el('input');file.type='file';file.accept='image/png,image/jpeg,image/webp,image/gif';file.dataset.wy8UploadPath=desc.path;file.setAttribute('aria-label','رفع صورة أو GIF: '+desc.label);wrapper.append(file);
      const url=art(desc.value,'');if(url){const preview=el('img','wy8-owner-preview');preview.src=url;preview.alt='معاينة '+desc.label;wrapper.append(preview);}}
    return wrapper;
  }
  function openFieldsEditor(title,description,fields,saveHandler,role='owner'){
    if(role==='owner'?!OWNER():!STAFF())return notify('لا توجد صلاحية لهذا المحرر',true);
    const box=showModal(title,`<p class="wy8-muted" style="margin:12px 0">${escapeHTML(description)}</p><form id="wy8-generic-form" class="wy8-editor-body"><div id="wy8-generic-fields" class="wy8-editor-body"></div><div class="wy8-status" id="wy8-form-status">الصور المتحركة GIF تُرفع كما هي وتُحفظ في تخزين Supabase.</div><div class="flex gap-3 flex-wrap"><button type="submit" class="wy8-primary" id="wy8-form-save">حفظ ومزامنة</button><button type="button" class="wy8-secondary" id="wy8-form-cancel">إلغاء</button></div></form>`);
    const holder=box.querySelector('#wy8-generic-fields');fields.forEach(x=>holder.append(formField(x)));
    const form=box.querySelector('#wy8-generic-form');box.querySelector('#wy8-form-cancel').onclick=closeModal;
    form.onsubmit=async event=>{event.preventDefault();if(role==='owner'?!OWNER():!STAFF())return;const btn=$('wy8-form-save'),status=$('wy8-form-status');btn.disabled=true;
      try{const edits={};for(const inp of form.querySelectorAll('[data-wy8-path]')){
          const val=inp.value.trim(),meta=fields.find(f=>f.path===inp.dataset.wy8Path);
          if(meta?.numeric){const n=Number(val);if(!Number.isFinite(n)||n<0||n>1000000)throw Error('قيمة رقمية غير صالحة: '+meta.label);edits[inp.dataset.wy8Path]=n;}
          else if(meta?.media){if(val&&!safeURL(val))throw Error('الرابط غير آمن: '+meta.label);edits[inp.dataset.wy8Path]=val;}
          else edits[inp.dataset.wy8Path]=val;
        }
        for(const inp of form.querySelectorAll('[data-wy8-upload-path]')){const file=inp.files?.[0];if(file){status.textContent='جارٍ رفع صورة '+file.name+' ...';edits[inp.dataset.wy8UploadPath]=await uploadArt(file,'v8-experience-media');}}
        status.textContent='جارٍ تأكيد حفظ البيانات في السحابة...';await saveHandler(edits);closeModal();notify('حُفظت التعديلات بعد تأكيد السحابة');
      }catch(e){status.textContent='لم يتم الحفظ: '+e.message;status.classList.add('error');notify(e.message,true);}finally{btn.disabled=false;}
    };
  }
  function openSceneEditor(kind){if(!OWNER())return;
    const current=scenes(),d=current[kind],fields=[];
    const add=(label,path,value,media=false,multiline=false)=>fields.push({label,path,value,media,multiline});
    if(kind==='nicotine'){
      add('صورة النيكوتين الكرتونية','character',d.character,true);add('صورة الدماغ الكرتونية','brain',d.brain,true);
      d.steps.forEach((s,i)=>{add('خطوة '+(i+1)+' — العنوان',`steps.${i}.title`,s.title);add('خطوة '+(i+1)+' — الشرح',`steps.${i}.desc`,s.desc,false,true);add('خطوة '+(i+1)+' — صورة أو GIF',`steps.${i}.image`,s.image,true);add('خطوة '+(i+1)+' — صورة زر «التالي»',`steps.${i}.buttonImage`,s.buttonImage,true);});
    }else if(kind==='withdrawal'){
      d.states.forEach((s,i)=>{add('الشعور '+(i+1)+' — اسم الزر',`states.${i}.label`,s.label);add('الشعور '+(i+1)+' — العنوان',`states.${i}.title`,s.title);add('الشعور '+(i+1)+' — الشرح',`states.${i}.desc`,s.desc,false,true);add('الشعور '+(i+1)+' — ما الذي يساعد؟',`states.${i}.tip`,s.tip,false,true);add('الشعور '+(i+1)+' — صورة الشخصية/GIF',`states.${i}.image`,s.image,true);add('الشعور '+(i+1)+' — صورة الزر/GIF',`states.${i}.buttonImage`,s.buttonImage,true);});
    }else if(kind==='bravery'){
      add('صورة الزميل', 'friend',d.friend,true);add('صورة تعبير النجاح','success',d.success,true);add('صورة المحاولة غير المناسبة','wrong',d.wrong,true);
      d.rounds.forEach((s,i)=>{add('الموقف '+(i+1)+' — الجملة',`rounds.${i}.prompt`,s.prompt,false,true);add('الموقف '+(i+1)+' — الرد المناسب',`rounds.${i}.good`,s.good,false,true);add('الموقف '+(i+1)+' — الرد غير المناسب',`rounds.${i}.bad`,s.bad,false,true);add('الموقف '+(i+1)+' — التفسير',`rounds.${i}.hint`,s.hint,false,true);add('الموقف '+(i+1)+' — صورة المشهد/GIF',`rounds.${i}.image`,s.image,true);add('الموقف '+(i+1)+' — صورة زر الرد المناسب',`rounds.${i}.goodImage`,s.goodImage,true);add('الموقف '+(i+1)+' — صورة زر الرد الآخر',`rounds.${i}.badImage`,s.badImage,true);});
    }else return;
    openFieldsEditor('تحرير '+({nicotine:'رحلة النيكوتين',withdrawal:'المشاعر بعد التوقف',bravery:'تحدي الشجاعة'})[kind],
      'كل خطوة وزر له نص وصورة اختيارية. ارفع صورة أو GIF من جهازك أو أدخل رابط HTTPS.',fields,async edits=>{
        const all=scenes();for(const [path,val] of Object.entries(edits))setPath(all[kind],path,val);
        const existing=store(KEY_SCENES,{});await confirmStore(KEY_SCENES,{...existing,v8:all});renderRefusal();
      });
  }
  function openGoalsEditor(){if(!OWNER())return;const cfg=calcSettings(),fields=[{label:'صورة مرطبان الأحلام',path:'jar',value:cfg.jar,media:true},{label:'صورة العملة',path:'coin',value:cfg.coin,media:true}];
    cfg.goals.forEach((g,i)=>{fields.push({label:'الهدف '+(i+1)+' — الاسم',path:`goals.${i}.title`,value:g.title},{label:'الهدف '+(i+1)+' — السعر التقريبي بالشيكل',path:`goals.${i}.cost`,value:g.cost,numeric:true},{label:'الهدف '+(i+1)+' — صورة الزر/GIF',path:`goals.${i}.image`,value:g.image,media:true});});
    openFieldsEditor('تحرير الحاسبة ومرطبان الأحلام','تُعدل الأمثلة والأسعار والصور من المالك؛ السعر الحقيقي يحدده كل زائر بنفسه.',fields,async edits=>{
      const data=calcSettings();for(const [path,val] of Object.entries(edits))setPath(data,path,val);await confirmStore(KEY_CALC,data);renderCalculator();
    });
  }
  function openHealingMediaEditor(){if(!OWNER())return;const items=getHealing();const fields=[];
    items.forEach((m,i)=>{fields.push({label:(m.timeLabel||i+1)+' — صورة الزر/GIF',path:`${i}.buttonImage`,value:m.buttonImage||'',media:true},
      {label:(m.timeLabel||i+1)+' — صورة المرحلة/GIF',path:`${i}.mediaUrl`,value:m.mediaUrl||'',media:true});});
    openFieldsEditor('صور خطوات مسار التعافي','تعديل كل صورة وزر. لتعديل المدة والعنوان والشرح استخدم محرر التعافي الأصلي الموجود في القسم نفسه.',fields,async edits=>{
      const latest=getHealing();if(latest.length!==items.length)throw Error('تغيّر عدد المراحل؛ أعيدي فتح المحرر');
      for(const [path,val] of Object.entries(edits)){setPath(latest,path,val);if(path.endsWith('.mediaUrl')){
          const idx=Number(path.split('.')[0]);if(val)latest[idx].mediaType=String(val).toLowerCase().split('?')[0].endsWith('.gif')?'gif':'image';
        }}
      await confirmStore(KEY_HEAL,latest);window.renderTimelineHealingBar?.();
    });
  }
  function organList(){const fallback=typeof defaultOrgans!=='undefined'?defaultOrgans:[];const saved=store(KEY_ORGANS,fallback);return Array.isArray(saved)?saved:[];}
  const organDefault={
    'org-1':A+'brain.webp','org-2':A+'lungs.webp','org-3':A+'heart.webp','org-4':A+'student.webp','org-5':A+'student.webp','org-6':A+'heart.webp'
  };
  function enhanceAnatomy(){const vis=visualMap();
    document.querySelectorAll('#anatomyOrgansPillButtons [data-wy-organ-pill-id]').forEach(b=>{
      const id=b.dataset.wyOrganPillId,url=art(vis['organ.'+id+'.button'],organDefault[id]||A+'student.webp');
      let img=b.querySelector('img.wy8-organ-button-art');if(!img){img=el('img','wy8-organ-button-art');img.style.cssText='width:26px;height:26px;object-fit:contain';img.alt='';b.prepend(img);b.querySelector('i')?.remove();}img.src=url;
    });
    const active=document.querySelector('#anatomyOrgansPillButtons [aria-pressed="true"]')||document.querySelector('#anatomyOrgansPillButtons .active');
    const organId=active?.dataset.wyOrganPillId||organList()[0]?.id;
    const box=$('organDetailBox');if(!box||!organId)return;
    const custom=art(vis['organ.'+organId+'.detail'],organDefault[organId]||A+'student.webp');
    let picture=$('wy8-organ-info-image');if(!picture){picture=el('img','');picture.id='wy8-organ-info-image';picture.style.cssText='float:left;max-width:110px;height:100px;object-fit:contain;border-radius:14px;margin:0 0 8px 8px';picture.alt='رسم توضيحي للعضو';box.querySelector('#organDetailDesc')?.insertAdjacentElement('beforebegin',picture);}
    picture.src=custom;
  }
  function setupAnatomy(){const oldRender=window.renderAnatomyHotspots,oldSelect=window.selectAnatomyOrgan;
    if(typeof oldRender==='function')window.renderAnatomyHotspots=function(...args){const r=oldRender(...args);enhanceAnatomy();return r;};
    if(typeof oldSelect==='function')window.selectAnatomyOrgan=function(...args){const r=oldSelect(...args);enhanceAnatomy();return r;};
    enhanceAnatomy();
  }
  function openOrganMediaEditor(){if(!OWNER())return;const rows=organList(),vis=visualMap(),fields=[];
    for(const o of rows){fields.push({label:o.name+' — صورة زر العضو/GIF',path:'organ.'+o.id+'.button',value:vis['organ.'+o.id+'.button']||'',media:true});fields.push({label:o.name+' — صورة التفاصيل/GIF',path:'organ.'+o.id+'.detail',value:vis['organ.'+o.id+'.detail']||'',media:true});}
    openFieldsEditor('صور الأعضاء وأزرارها','تغيير صورة الجسد الأساسية ومواقع النقاط يبقى في محرر التشريح الأصلي؛ هنا تغيّرين صور كل عضو وزره.',fields,async edits=>{
      const next=visualMap();for(const [path,url] of Object.entries(edits))next[path]=url;await confirmStore(KEY_VISUALS,next);enhanceAnatomy();
    });
  }
  function openTabMediaEditor(){if(!OWNER())return;const v=visualMap(),fields=[
      {label:'صورة زر رحلة النيكوتين',path:'tab-nicotine',value:v['tab-nicotine']||A+'nicotine.webp',media:true},
      {label:'صورة زر المشاعر بعد التوقف',path:'tab-withdrawal',value:v['tab-withdrawal']||A+'student-sad.webp',media:true},
      {label:'صورة زر تحدي الشجاعة',path:'tab-bravery',value:v['tab-bravery']||A+'student-brave.webp',media:true},
      {label:'صورة زر سعر السيجارة الأول',path:'price-0',value:v['price-0']||'',media:true},
      {label:'صورة زر سعر السيجارة الثاني',path:'price-1',value:v['price-1']||'',media:true},
      {label:'صورة زر سعر السيجارة الثالث',path:'price-2',value:v['price-2']||'',media:true}
    ];
    openFieldsEditor('صور أزرار الأقسام الجديدة','يمكنك إرفاق صورة PNG/JPG/WebP أو GIF لكل زر.',fields,async edits=>{
      const next=visualMap();Object.assign(next,edits);await confirmStore(KEY_VISUALS,next);renderRefusal();decoratePriceButtons();
    });
  }
  function decoratePriceButtons(){document.querySelectorAll('.calc-price-btn').forEach((b,i)=>{
      const u=visual('price-'+i,'');let img=b.querySelector('img.wy8-price-art');if(u){if(!img){img=el('img','wy8-price-art wy8-media-inline');img.alt='';b.prepend(img);}img.src=u;}else img?.remove();
    });
  }
  // Owner can set order and parent for any existing major screen. No new primary sections are invented.
  function renderNavManager(){const host=$('wy8-owner-nav-list');if(!host||!OWNER())return;navDraft=navDraft||navState();host.replaceChildren();
    for(const row of navDraft){const line=el('div','wy8-owner-navrow');line.append(el('strong','',navLabel(row.id)));
      const sel=el('select');sel.setAttribute('aria-label','مكان '+navLabel(row.id));
      const rootOption=el('option','', 'قسم مستقل');rootOption.value='';sel.append(rootOption);
      for(const other of navDraft){if(other.id===row.id)continue;const op=el('option','', 'داخل: '+navLabel(other.id));op.value=other.id;sel.append(op);}sel.value=row.parent;
      sel.onchange=()=>{const old=row.parent;row.parent=sel.value;if(!validNav(navDraft)){row.parent=old;sel.value=old;notify('لا يُسمح بوضع قسم داخل نفسه أو إنشاء حلقات متداخلة',true);}};
      line.append(sel);const actions=el('div','flex gap-1');
      for(const [symbol,dir] of [['↑',-1],['↓',1]]){const btn=el('button','wy8-ghost',symbol);btn.title='تغيير الترتيب';btn.type='button';btn.onclick=()=>{const sib=navDraft.filter(x=>x.parent===row.parent),i=sib.indexOf(row),target=sib[i+dir];if(!target)return;const a=navDraft.indexOf(row),b=navDraft.indexOf(target);[navDraft[a],navDraft[b]]=[navDraft[b],navDraft[a]];renderNavManager();};actions.append(btn);}
      line.append(actions);host.append(line);
    }
  }
  function validNav(rows){const dict=Object.fromEntries(rows.map(r=>[r.id,r.parent]));for(const r of rows){const seen=new Set([r.id]);let p=r.parent;while(p){if(!catalogIds.includes(p)||seen.has(p))return false;seen.add(p);p=dict[p]||'';}}return rows.length===catalogIds.length;}
  async function saveNav(){if(!OWNER()||!navDraft)return;if(!validNav(navDraft))return notify('الترتيب يحتوي علاقة متداخلة غير صحيحة',true);
    const b=$('wy8-nav-save');if(b)b.disabled=true;try{await confirmStore(KEY_NAV,navDraft);navDraft=null;applyNav();renderNavManager();notify('تم حفظ ترتيب الأقسام وتداخلها');}
    catch(e){notify('لم يتم الحفظ: '+e.message,true);}finally{if(b)b.disabled=false;}
  }
  function renderOwnerPanel(){const host=$('panel-wy8CMS');if(!host||!OWNER())return;
    host.innerHTML=`<div class="wy8-owner-panel space-y-5" dir="rtl">
      <div><span class="wy8-kicker">⚙️ مساحة المالك</span><h3 class="font-black text-xl text-slate-900 mt-2">ترتيب الأقسام ووسائط التجارب</h3><p class="wy8-muted">قائمة الأقسام الموجودة كما هي. غيّر ترتيبها أو ضع قسمًا داخل آخر. لن تُعدّل هذه الأداة بيانات الأقسام نفسها.</p></div>
      <section class="wy8-panel"><h4 style="font-weight:900;font-size:16px">هيكل الأقسام</h4><p class="wy8-muted">يظهر أي قسم مستقلًا أو داخل قسم آخر بحسب اختيار المالك. الرئيسية ثابتة.</p><div id="wy8-owner-nav-list" style="margin:10px 0"></div><div class="flex gap-2 flex-wrap"><button type="button" class="wy8-primary" id="wy8-nav-save">حفظ ترتيب الأقسام</button><button type="button" class="wy8-secondary" id="wy8-nav-reset">تراجع عن تعديلات غير محفوظة</button></div></section>
      <section class="wy8-panel"><h4 style="font-weight:900;font-size:16px">تحرير صور GIF / PNG / JPG / WebP</h4><p class="wy8-muted">كل زر وكل خطوة في التجارب لها حقول لرفع صورة مستقلة. تبقى صلاحيات المالك الأصلية دون تغيير.</p><div id="wy8-editor-links" class="flex gap-2 flex-wrap mt-3"></div></section>
      <p class="wy8-status">النشر لا يحدث بمجرد اختيار ملف: يلزم نجاح رفعه ثم تأكيد حفظ رابطه في Supabase. لا تتغير أذونات الأدوار القديمة.</p>
    </div>`;
    $('wy8-nav-save').onclick=saveNav;$('wy8-nav-reset').onclick=()=>{navDraft=null;renderNavManager();};renderNavManager();
    const links=$('wy8-editor-links');for(const [title,action] of [
      ['رحلة النيكوتين',()=>openSceneEditor('nicotine')],['المشاعر بعد التوقف',()=>openSceneEditor('withdrawal')],['تحدي الشجاعة',()=>openSceneEditor('bravery')],
      ['مسار التعافي: صور المراحل والأزرار',openHealingMediaEditor],['جسمك من جوا: صور الأعضاء والأزرار',openOrganMediaEditor],
      ['الحاسبة: مرطبان الأحلام والأهداف',openGoalsEditor],['الصور على أزرار التبويبات والأسعار',openTabMediaEditor],['الأدبيات',openLiteratureManager]
    ]){const btn=el('button','wy8-secondary',title);btn.type='button';btn.onclick=action;links.append(btn);}
  }
  function setupOwnerPanel(){const sampleBtn=$('tabBtn-sectionsCMS'),samplePanel=$('panel-sectionsCMS');if(!sampleBtn||!samplePanel)return;
    const button=el('button','admin-tab-btn owner-only-btn hidden px-3.5 py-2 rounded-xl text-slate-300 hover:bg-white/5 font-bold flex items-center gap-2 shrink-0 transition','الترتيب والصور الجديدة');button.id='tabBtn-wy8CMS';button.type='button';button.onclick=()=>window.switchAdminTab('wy8CMS');sampleBtn.insertAdjacentElement('afterend',button);
    const section=el('section','hidden space-y-5');section.id='panel-wy8CMS';samplePanel.insertAdjacentElement('afterend',section);
    const originalSwitch=window.switchAdminTab;
    if(typeof originalSwitch==='function')window.switchAdminTab=function(name,...args){if(name==='wy8CMS'&&!OWNER())return notify('هذه الأداة للمالك فقط',true);
      const result=originalSwitch.call(this,name,...args);section.classList.toggle('hidden',name!=='wy8CMS');
      button.classList.toggle('bg-white/10',name==='wy8CMS');button.classList.toggle('text-white',name==='wy8CMS');if(name==='wy8CMS'){navDraft=null;renderOwnerPanel();}
      return result;
    };
  }
  let lastRole=null;
  function syncRole(){const r=window.currentUserRole||'';if(r===lastRole)return;lastRole=r;
    $('wy8-manage-literature')?.classList.toggle('hidden',!STAFF());
    $('wy8-edit-current')?.classList.toggle('hidden',!OWNER());
    $('wy8-edit-goals')?.classList.toggle('hidden',!OWNER());
    $('tabBtn-wy8CMS')?.classList.toggle('hidden',!OWNER());
    if(!OWNER()){closeModal();$('panel-wy8CMS')?.classList.add('hidden');}
  }
  function refreshFromCloud(key){
    if(key===KEY_SCENES)renderRefusal();
    if(key===KEY_LIT)renderLiterature();
    if(key===KEY_NAV||key===KEY_VIS)applyNav();
    if(key===KEY_CALC)renderCalculator();
    if(key===KEY_VISUALS){renderRefusal();enhanceAnatomy();decoratePriceButtons();}
    if(key===KEY_HEAL)window.renderTimelineHealingBar?.();
    if(key===KEY_ORGANS)enhanceAnatomy();
  }
  function initialize(){
    setupLiterature();installNavigation();makeRefusal();setupCalculator();setupHealing();setupAnatomy();setupOwnerPanel();decoratePriceButtons();
    const toggle=window.setUnifiedElementVisibility;
    if(typeof toggle==='function')window.setUnifiedElementVisibility=async function(...args){const result=await toggle.apply(this,args);if(result)applyNav();return result;};
    syncRole();const bar=$('ownerFloatingContextBar');if(bar){const observer=new MutationObserver(syncRole);observer.observe(bar,{attributes:true,childList:true,subtree:false});}
    window.addEventListener('storage',e=>{if([KEY_SCENES,KEY_LIT,KEY_NAV,KEY_VISUALS,KEY_CALC,KEY_VIS,KEY_HEAL,KEY_ORGANS].includes(e.key))refreshFromCloud(e.key);});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});
  }
  window.waeiV8={refreshFromCloud,renderRefusal,renderLiterature,renderCalculator,applyNav,openSceneEditor,openHealingMediaEditor,openOrganMediaEditor,openGoalsEditor,openTabMediaEditor,openLiteratureManager};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initialize,{once:true});else initialize();
})();
