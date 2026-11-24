/* WAEI YUDAWI - contextual effects v3.0
 * Pure presentation. The entire original data, admin, navigation and content
 * layer remains in index.html. No writes, storage, backend or new dependencies.
 */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motionOK = () => !reduced.matches;
  const overlay = document.createElement('div');
  overlay.className = 'wy-anim-layer';
  overlay.setAttribute('aria-hidden','true');
  const timers = new WeakMap();
  function ensureOverlay(){if(!overlay.isConnected && document.body)document.body.appendChild(overlay);}
  function whenAnimationEnds(el,duration){
    const old=timers.get(el);if(old)clearTimeout(old);
    const timer=setTimeout(()=>{el.remove();timers.delete(el);},duration);
    timers.set(el,timer);
  }
  function burst(kind,anchor){
    if(!motionOK())return;
    ensureOverlay();
    if(overlay.children.length>38)return;
    const b=anchor?.getBoundingClientRect?.();
    const x=b?b.left+b.width/2:window.innerWidth*.5;
    const y=b?b.top+b.height/2:window.innerHeight*.42;
    const n=kind==='star'?9:7;
    for(let i=0;i<n;i++){
      const a=Math.PI*2*i/n-Math.PI/2;
      const dist=(kind==='star'?78:63)+(i%3)*11;
      const node=document.createElement('span');
      node.className='wy-burst '+kind;
      node.textContent=kind==='star'?'\u2605':'\u2713';
      node.style.left=Math.max(15,Math.min(window.innerWidth-15,x))+'px';
      node.style.top=Math.max(15,Math.min(window.innerHeight-15,y))+'px';
      node.style.setProperty('--wy-dx',Math.round(Math.cos(a)*dist)+'px');
      node.style.setProperty('--wy-dy',Math.round(Math.sin(a)*dist-23)+'px');
      node.style.setProperty('--wy-life',1100+(i%4)*100+'ms');
      node.style.setProperty('--wy-rotation',(-28+i*12)+'deg');
      overlay.appendChild(node);whenAnimationEnds(node,1550);
    }
  }

  function labStage(){return $('vapeLiquidBody')?.closest('.vape-device-wrapper')?.parentElement||null;}
  function makeSmoke(stage){
    if(!stage)return;
    if(stage.querySelector('.wy-smoke-plume'))return;
    const plume=document.createElement('div');
    plume.className='wy-smoke-plume';plume.setAttribute('aria-hidden','true');
    plume.innerHTML=`<svg viewBox="0 0 140 115"><defs><linearGradient id="wy-smoke-gradient" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#89949d" stop-opacity=".68"/><stop offset=".55" stop-color="#a5afb9" stop-opacity=".55"/><stop offset="1" stop-color="#d1d7dc" stop-opacity=".06"/></linearGradient></defs><g stroke="url(#wy-smoke-gradient)" stroke-width="9"><path class="wy-smoke-strand" d="M69 110 C50 94 93 76 69 59 C42 44 76 27 58 6"/><path class="wy-smoke-strand" d="M77 109 C94 94 58 75 85 59 C108 44 75 25 91 6"/><path class="wy-smoke-strand" d="M70 107 C81 89 53 73 68 55 C84 38 58 29 67 9"/></g></svg>`;
    stage.insertBefore(plume,stage.firstChild);
  }
  function labLabels(){
    const stage=labStage();if(!stage)return;
    makeSmoke(stage);
    const panel=stage.parentElement;
    let trace=$('wy-lab-trace');
    if(!trace){
      trace=document.createElement('section');
      trace.className='wy-lab-trace';trace.id='wy-lab-trace';trace.setAttribute('aria-live','polite');
      const heading=document.createElement('div');heading.className='wy-lab-trace-label';
      const title=document.createElement('span');title.textContent='\u0627\u0644\u0645\u0648\u0627\u062f \u0627\u0644\u0645\u062d\u062f\u062f\u0629 \u0641\u064a \u0627\u0644\u0645\u062d\u0627\u0643\u0627\u0629';
      const count=document.createElement('span');count.className='wy-lab-trace-count';count.id='wy-lab-trace-count';
      const body=document.createElement('div');body.className='wy-lab-trace-items';body.id='wy-lab-trace-items';
      heading.append(title,count);trace.append(heading,body);panel.appendChild(trace);
    }
    const chosen=window.activeLabToxins instanceof Set ? Array.from(window.activeLabToxins):[];
    const plume=stage.querySelector('.wy-smoke-plume');
    plume?.classList.toggle('is-active',chosen.length>0);
    stage.classList.toggle('wy-lab-active',chosen.length>0);
    $('wy-lab-trace-count').textContent=chosen.length+'/8';
    const body=$('wy-lab-trace-items');body.replaceChildren();
    if(!chosen.length){
      const empty=document.createElement('span');empty.className='wy-lab-trace-count';
      empty.textContent='\u0644\u0645 \u062a\u062e\u062a\u0631 \u0645\u0627\u062f\u0629 \u0628\u0639\u062f';
      body.appendChild(empty);
    }
    for(const key of chosen){
      const btn=Array.from(document.querySelectorAll('#labInteractiveToxinsPalette button')).find(b=>b.getAttribute('onclick')?.includes("'"+key+"'"));
      const chip=document.createElement('span');chip.className='wy-lab-chip';
      const bar=document.createElement('i');bar.className='wy-lab-chip-mark';bar.setAttribute('aria-hidden','true');
      const name=document.createElement('span');name.textContent=btn?.querySelector('strong')?.textContent?.trim()||key;
      chip.append(bar,name);body.appendChild(chip);
    }
  }
  function flyReagent(button,key){
    if(!motionOK()||!button)return;
    const dest=$('vapeLiquidBody');if(!dest)return;
    ensureOverlay();
    const a=button.getBoundingClientRect(),b=dest.getBoundingClientRect();
    const label=button.querySelector('strong')?.textContent?.trim()||key;
    const el=document.createElement('div');el.className='wy-reagent-flight';el.textContent=label;
    // Localized motion from the selected chemical card to the pod tank.
    el.style.setProperty('--wy-from-x',Math.round(a.left+a.width/2-46)+'px');
    el.style.setProperty('--wy-from-y',Math.round(a.top+a.height/2-16)+'px');
    el.style.setProperty('--wy-to-x',Math.round(b.left+b.width/2-46)+'px');
    el.style.setProperty('--wy-to-y',Math.round(b.top+b.height/2-16)+'px');
    overlay.appendChild(el);whenAnimationEnds(el,960);
  }
  function revealScreen(screenId){
    const target=$(screenId);if(!target||!motionOK())return;
    target.classList.remove('wy-screen-enter');void target.offsetWidth;target.classList.add('wy-screen-enter');
    const scene=target.querySelector('.wy-community-hero,.bento-card');
    if(scene){
      const lens=document.createElement('div');lens.className='wy-glass-sweep';lens.setAttribute('aria-hidden','true');
      scene.appendChild(lens);whenAnimationEnds(lens,850);
    }
  }
  function ensureSurfaces(){
    const lab=$('screen-lab')?.querySelector('.bento-card');
    const anatomy=$('anatomyStageWrapper');
    if(lab)lab.classList.add('wy-interactive-surface');
    if(anatomy)anatomy.classList.add('wy-interactive-surface');
    labLabels();
  }
  function wrap(name,callback){
    const original=window[name];if(typeof original!=='function'||original.__wyContextWrapped)return;
    const enhanced=function(...args){
      const result=original.apply(this,args);
      try{callback(...args);}catch(e){console.warn('Noncritical UI effect skipped:',name,e);}
      return result;
    };
    Object.defineProperty(enhanced,'__wyContextWrapped',{value:true});
    window[name]=enhanced;
  }
  function install(){
    ensureOverlay();ensureSurfaces();
    wrap('renderAnatomyHotspots',()=>ensureSurfaces());
    wrap('toggleToxinInMixer',(key,button)=>{
      labLabels();
      // Removing a material must not create a new injection effect.
      if(window.activeLabToxins?.has(key))flyReagent(button,key);
    });
    wrap('resetInteractiveMixerLab',()=>labLabels());
    wrap('selectScenarioChoice',(s,i)=>{
      const rows=typeof getLocal==='function'&&typeof KEY_SCENARIOS!=='undefined' ? getLocal(KEY_SCENARIOS,defaultPeerScenarios):[];
      if(rows?.[s]?.choices?.[i]?.score==='good')burst('check',$('scenarioFeedbackBox'));
    });
    wrap('submitClashDecision',i=>{
      const rows=typeof getLocal==='function'&&typeof KEY_SCENARIOS!=='undefined' ? getLocal(KEY_SCENARIOS,defaultPeerScenarios):[];
      const idx=typeof clashCurrentIndex!=='undefined'?clashCurrentIndex:0;
      const choice=rows?.[idx]?.choices?.[i];
      if(choice&&(choice.score==='good'||choice.deltaPurity===0))burst('check',$('clashArenaPlayBox'));
    });
    wrap('switchMainScreen',screenId=>{ensureSurfaces();revealScreen(screenId);});
    wrap('switchTeamFieldSubTab',()=>{}); // Keep the original multi-layer visibility/permissions logic.
    document.addEventListener('keydown',event=>{
      const mark=event.target.closest?.('.wy-anatomy-hotspot');
      if(mark&&(event.key==='Enter'||event.key===' ')){
        event.preventDefault();mark.click();
      }
    });
    document.addEventListener('click',event=>{
      const button=event.target.closest?.('.bento-tab-stripe');
      if(!button||!motionOK())return;
      const rect=button.getBoundingClientRect();
      const ripple=document.createElement('span');ripple.className='wy-tap-ripple';ripple.setAttribute('aria-hidden','true');
      ripple.style.left=(event.clientX-rect.left)+'px';ripple.style.top=(event.clientY-rect.top)+'px';
      button.style.position='relative';button.style.overflow='hidden';button.appendChild(ripple);
      whenAnimationEnds(ripple,700);
    });
    if(window.matchMedia('(hover:hover) and (pointer:fine)').matches){
      let raf=0, pending=null;
      document.addEventListener('pointermove',event=>{
        if(!motionOK())return;
        const scene=event.target.closest?.('.wy-glass,.wy-community-card,.wy-interactive-surface');
        if(!scene)return;
        pending={scene,x:event.clientX,y:event.clientY};
        if(!raf)raf=requestAnimationFrame(()=>{
          raf=0;if(!pending)return;
          const b=pending.scene.getBoundingClientRect();
          pending.scene.style.setProperty('--wy-pointer-x',(pending.x-b.left)+'px');
          pending.scene.style.setProperty('--wy-pointer-y',(pending.y-b.top)+'px');
          pending=null;
        });
      },{passive:true});
    }
  }
  window.waeiEffects=Object.freeze({
    correct:element=>burst('check',element),
    stars:element=>burst('star',element),
    lab:()=>labLabels(),
    anatomy:input=>{ if(typeof input==='string')window.selectAnatomyOrgan?.(input); },
    refresh:ensureSurfaces
  });
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();


/* Waei Yudawi V7: interactive refusal, recovery child widget and literature.
   Uses existing confirmed Supabase store and owner role; never grants access client-side.
   No visitor question, interaction or health data is uploaded by this module. */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const short = (v,max=1000) => String(v==null?'':v).trim().slice(0,max);
  const isOwner = () => window.currentUserRole === 'owner';
  const newId = () => 'lit-'+(window.crypto?.randomUUID?.() || (Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,12)));
  const jsArg = id => esc(JSON.stringify(String(id ?? '')));
  const toast = (s,t) => { if(typeof window.showToast==='function') window.showToast(s,t||'success'); };
  const url = val => {try { const a=new URL(String(val||'').trim()); return a.protocol==='https:'&&a.toString().length<2200 ? a.href : ''; }catch{return '';} };
  const KEY='wa3y_interactive_refusal_recovery_v7', LIT='wa3y_literature_v7';
  const defaultData={
    story:[
      {label:'البداية',title:'آدم والتجربة',speech:'فكّرت إنها مرة وخلص…',text:'آدم كان فضولي، وصاحبه شجّعه يجرّب فيب فيه نيكوتين. التجربة بتحمل مخاطر، بس مش كل شخص بجرّب بصير مدمن.',note:'القرار مش بسيط لما يكون الكل حواليك بحكي: جرّب.'},
      {label:'الدماغ',title:'شو بصير بدماغ آدم؟',speech:'ليش صرت أفكّر أرجع؟',text:'النيكوتين بيوصل للدماغ بسرعة، وبيحفّز نظام المكافأة فيه. الدماغ ممكن يربط السحبة بإحساس مؤقت مريح، فيصير آدم يفكّر يكررها.',note:'اضغط «شغّل الإشارات» على الرسم. الإضاءة للتوضيح، مش تصوير دقيق للدماغ.'},
      {label:'الإدمان',title:'ليش التوقف صار صعب؟',speech:'بحكي بوقف… وبرجع!',text:'مع التكرار، الدماغ ممكن يتعوّد على النيكوتين. آدم بصير يشتاق إله حتى لو هو مش حابب يرجع. هاي مش «شخصية ضعيفة»؛ الإدمان حالة بتصعّب التحكم.',note:'ضغط الأصحاب، العادة، والتوتر كمان ممكن يرجّعوا الرغبة.'},
      {label:'التوقف',title:'شو بصير لما آدم يحاول يوقف؟',speech:'وقفت… بس ليش مش مرتاح؟',text:'إذا جسم آدم تعوّد على النيكوتين، ممكن يحس بعصبية ورغبة قوية فيه أو مشاكل بالتركيز والنوم. بنسمي هاي التغيّرات «أعراض انسحاب النيكوتين».',note:'بتختلف الأعراض من شخص لثاني، وغالباً بتخف مع الوقت. إذا صارت شديدة أو مقلقة، الأفضل يسأل مختص صحي.'}
    ],
    chat:[
      {label:'ساحة المدرسة',context:'سامي لاقى آدم بفسحة المدرسة.',prompt:'يا زلمة جرّب السحبة، ريحتها فواكه!',replies:[{text:'لا يا زلمة، مش جوي 😎',response:'تمام، براحتك.',tip:'جواب قصير وواضح.',adam:'confident',sami:'kind'},{text:'ليش مصرّ عليّ أجرب؟',response:'آه، معك حق، خلص.',tip:'من حقك تسأل ليش في ضغط عليك.',adam:'question',sami:'surprised'},{text:'يلا نروح نلعب بدل هالحكي.',response:'يلا، أحسن!',tip:'غيّرت الموقف بدون ما تدخل بنقاش طويل.',adam:'happy',sami:'happy'}]},
      {label:'بعد المدرسة',context:'سامي رجع فتح الموضوع بعد الدوام.',prompt:'مرة وحدة بس… مش رح يصير إشي!',replies:[{text:'لا، أنا مش موافق.',response:'طيب، فهمت.',tip:'كلمة «لا» كفاية، حتى لو غيرك مش عاجبه.',adam:'confident',sami:'kind'},{text:'لا تضل تضغط عليّ، خلص.',response:'آسف، ما رح أعيدها.',tip:'حطّ حدودك بوضوح.',adam:'question',sami:'surprised'},{text:'بدنا نلحق الباص، يلا!',response:'صح، امشي.',tip:'الابتعاد عن الضغط خيار ذكي.',adam:'happy',sami:'happy'}]},
      {label:'قدّام الشباب',context:'مجموعة من الشباب واقفة مع سامي وآدم.',prompt:'إذا ما جرّبت رح نضحك عليك!',replies:[{text:'اضحكوا، أنا مرتاح بقراري.',response:'خلص، براحتك.',tip:'قرارك مش مرهون برأي المجموعة.',adam:'confident',sami:'surprised'},{text:'الصاحب ما بضغط على صاحبه.',response:'صح، سامحني.',tip:'ذكّرهم إن الصحبة فيها احترام.',adam:'question',sami:'kind'},{text:'أنا ماشي، منشوفكم بعدين.',response:'طيب، بنشوفك.',tip:'إذا استمر الضغط، ابتعد واطلب دعم إذا احتجت.',adam:'happy',sami:'kind'}]}
    ],
    doctor:[
      {q:'كيف أرفض بدون إحراج؟',a:'احكي بهدوء: «لا، مش حابب». مش ضروري تبرّر قرارك. وإذا بتحب، غيّر الموضوع بعدها.',keywords:'ارفض,إحراج,احراج,أرفض,رفض,احكي,لا'},
      {q:'شو لو ظلّوا يضغطوا عليّ؟',a:'كرّر موقفك: «حكيت لا». وإذا استمر الضغط، اترك المكان واطلب مساعدة شخص كبير بتثق فيه.',keywords:'ضغط,يضغطوا,مصر,يجبر,إصرار,اصرار'},
      {q:'بخاف أخسر أصحابي، شو أعمل؟',a:'الصديق اللي بحترمك بحترم كلمة «لا». قرّب من أصحاب بدعموك، واحكي مع شخص بتثق فيه إذا كنت متضايق.',keywords:'صحاب,أصحاب,اصحابي,خسر,صديق,سامي,تنمر,يتنمرو'},
      {q:'شو لو حاسس برغبة قوية بالنيكوتين؟',a:'الرغبة ممكن تيجي وتروح. جرّب تبعد عن الموقف اللي بذكّرك فيه، اشغل نفسك بشي بتحبه، واطلب مساعدة مختص صحي إذا بدك خطة مناسبة لإلك.',keywords:'نيكوتين,انسحاب,سحبة,اشتياق,اريد,بدي ادخن,فيب'}
    ],
    recovery:[
      {label:'أول يوم',tag:'البداية',message:'جسمك بلّش يتأقلم مع غياب النيكوتين.',brain:'ممكن تحس برغبة في النيكوتين أو عصبية وصعوبة بالتركيز.',heart:'بعد ترك التدخين، نبض القلب ببلّش ينخفض باتجاه مستواه المعتاد خلال وقت قصير.',lungs:'إذا كنت بتدخّن، مستوى أول أكسيد الكربون بالدم ببلّش ينخفض خلال الساعات الأولى.'},
      {label:'أول أسبوع',tag:'التحدّي',message:'الأيام الأولى ممكن تكون صعبة، بس كل يوم إله قيمة.',brain:'الرغبة والعصبية واضطراب النوم ممكن يكونوا أوضح بأول الأيام.',heart:'البعد عن دخان السجائر بيقلّل تعرّض القلب والأوعية لمواد ضارّة.',lungs:'بعد ترك التدخين، ممكن تتحسّن حاسة الشم والتذوق، وتبلّش رئتك تستعيد قدرتها على التنظيف.'},
      {label:'بعد شهر',tag:'التقدّم',message:'جسمك مستمر بالتأقلم حتى لو ما بتحس بكل تغيير.',brain:'أعراض انسحاب النيكوتين غالباً بتخف تدريجياً، مع إن بعض المواقف ممكن ترجع الرغبة.',heart:'خلال أسابيع إلى أشهر، الدورة الدموية بتتحسّن عند كثير من اللي تركوا التدخين.',lungs:'خلال أسابيع إلى أشهر بعد الإقلاع عن التدخين، ممكن تصير الحركة والتنفس أسهل تدريجياً.'},
      {label:'مع الاستمرار',tag:'المستقبل',message:'كل فترة بدون تدخين بتعطي جسمك فرصة إضافية.',brain:'الدماغ بيتأقلم مع الوقت، والتعامل مع المحفّزات بيساعد على الاستمرار.',heart:'مخاطر مشاكل القلب المرتبطة بالتدخين بتقلّ مع مرور الوقت.',lungs:'مخاطر أمراض الرئة بتقل مع الوقت بعد ترك التدخين؛ مقدار التحسّن بختلف حسب الضرر السابق.'}
    ],
    media:{}
  };
  const defaultLit={title:'أدبيات',description:'كتابات وأعمال ومساهمات نعتزّ فيها.',theme:'navy',items:[]};
  let tabIndex=0,storyIndex=0,symptomIndex=0,chatIndex=0,chatAnswer=-1,brainPlaying=true,recoveryIndex=0,organ='brain',fact=false,doctorQuestion=-1,editMode='',editIndex=0,mediaKey='';
  const organs={brain:{label:'الدماغ',icon:'fa-brain'},heart:{label:'القلب',icon:'fa-heart-pulse'},lungs:{label:'الرئتين',icon:'fa-lungs'}};
  const symptoms=[{label:'العصبية والتوتر',face:'😠',detail:'آدم ممكن ينفعل أسرع لأنه جسمه عم يتأقلم.'},{label:'الرغبة القوية',face:'😣',detail:'ممكن يشعر إنه بده يرجع للنيكوتين، حتى لو قرر يوقف.'},{label:'صعوبة التركيز',face:'😵‍💫',detail:'التركيز بالدراسة ممكن يصير أصعب لفترة.'},{label:'اضطراب النوم',face:'🥱',detail:'ممكن ينام أقل أو يتقلّب بالليل.'}];
  function data(){
    const source=typeof getLocal==='function'?getLocal(KEY,null):null;
    if(!source||typeof source!=='object'||Array.isArray(source))return structuredClone(defaultData);
    const base=structuredClone(defaultData);
    for(const group of ['story','chat','doctor','recovery'])if(Array.isArray(source[group])){
      if(group==='doctor')base[group]=source[group].filter(x=>x&&typeof x==='object').slice(0,16);
      else for(let i=0;i<base[group].length;i++)if(source[group][i]&&typeof source[group][i]==='object'){
        const item=source[group][i];base[group][i]={...base[group][i],...item};
        if(group==='chat'&&Array.isArray(item.replies))base[group][i].replies=item.replies.slice(0,3).map((x,j)=>({...defaultData.chat[i].replies[j],...(x&&typeof x==='object'?x:{})}));
      }
    }
    if(source.media&&typeof source.media==='object'&&!Array.isArray(source.media))base.media=source.media;
    return base;
  }
  function lit(){const x=typeof getLocal==='function'?getLocal(LIT,null):null;return x&&typeof x==='object'&&!Array.isArray(x)?{...defaultLit,...x,items:Array.isArray(x.items)?x.items.slice(0,120):[]}:structuredClone(defaultLit);}
  async function store(key,value){if(!isOwner())return toast('التعديل متاح للمالك فقط.','error'),false;
    if(typeof saveLocalConfirmed!=='function')return toast('خدمة الحفظ غير جاهزة.','error'),false;
    const ok=await saveLocalConfirmed(key,value);
    if(ok){renderAll();admin();toast('تم حفظ التعديل وتأكيده سحابياً ✓');}
    else toast('فشل تأكيد الحفظ السحابي. لم نعتمد التعديل.','error');
    return Boolean(ok);
  }
  function asset(key){return url(data().media[key]||'');}
  function mediaImg(key,alt,extraClass=''){
    const src=asset(key);
    return src?`<img class="wy-v7-visual-media ${extraClass}" alt="${esc(alt)}" src="${esc(src)}" loading="lazy" referrerpolicy="no-referrer">`:'';
  }
  function ownerMedia(key,label){return isOwner()?`<button type="button" class="wy-v7-media-action" onclick="waeiV7.openMedia('${esc(key)}')"><i class="fa-solid fa-camera"></i> ${esc(label||'إرفاق صورة / GIF')}</button>`:'';}
  function personSvg(who,mood){
    const coat=who==='doctor', sami=who==='sami', base=sami?'#C99AC9':coat?'#EDF5FF':'#8FC7D9';
    const eyebrows=mood==='surprised'?'<path d="M70 79L83 74 M112 74L125 79" stroke="#343949" stroke-width="3"/>':mood==='question'?'<path d="M69 78L83 76 M113 73L125 80" stroke="#343949" stroke-width="3"/>':'<path d="M69 78L83 78 M113 78L125 78" stroke="#343949" stroke-width="3"/>';
    const mouth=mood==='happy'||mood==='kind'||mood==='confident'?'<path d="M84 108 Q98 123 111 108" stroke="#9E6660" stroke-width="3" fill="none" stroke-linecap="round"/>':mood==='surprised'?'<ellipse cx="98" cy="111" rx="6" ry="8" fill="#A66B67"/>':'<path d="M87 112 Q97 107 108 111" stroke="#9E6660" stroke-width="3" fill="none"/>';
    const hair=sami?'#473750':coat?'#394758':'#2B364B';
    return `<svg class="wy-v7-cartoon" role="img" aria-label="رسمة شخصية ${sami?'سامي':coat?'دكتور وعي':'آدم'}" viewBox="0 0 195 198"><ellipse cx="98" cy="178" rx="58" ry="13" fill="#a3c9e9" opacity=".15"/><path d="M34 194 Q43 138 98 139 Q154 138 162 194" fill="${base}" stroke="#d8eaf6" stroke-width="2.5"/><path d="M80 134 Q98 147 116 134" stroke="#D8A98D" stroke-width="4" fill="none"/><ellipse cx="98" cy="91" rx="48" ry="53" fill="#E7B99B" stroke="#F5D8C5" stroke-width="2"/><path d="M51 91 Q43 34 95 33 Q149 31 146 84 Q134 64 121 65 Q85 75 58 57 Z" fill="${hair}"/><path d="M51 93 Q47 77 58 74 M145 92 Q150 78 139 76" stroke="${hair}" stroke-width="8" fill="none"/><circle cx="80" cy="89" r="4" fill="#29384C"/><circle cx="116" cy="89" r="4" fill="#29384C"/>${eyebrows}${mouth}${coat?'<path d="M97 151 L97 191 M77 146 L95 163 L81 191 M117 146 L99 163 L115 191" stroke="#9AB7C8" stroke-width="3" fill="none"/><path d="M133 143 Q156 140 150 161 Q147 174 132 169" stroke="#406379" stroke-width="3" fill="none"/><circle cx="131" cy="169" r="6" fill="#406379"/>':''}</svg>`;
  }
  function brainSvg(){
    return `<svg role="img" aria-label="رسم توضيحي متحرك لدماغ ونظام المكافأة" viewBox="0 0 310 212"><rect x="14" y="8" width="112" height="29" rx="14" fill="#14283D" stroke="#A1CCEE" stroke-opacity=".3"/><text x="70" y="27" font-size="12" fill="#EDF6FF" text-anchor="middle">نظام المكافأة</text><path d="M151 176V142 Q113 131 107 97 Q100 56 127 42 Q151 26 172 42 Q211 33 219 78 Q225 122 184 144 V176" fill="#DFB49F" stroke="#FFE1CC" stroke-width="3"/><path d="M129 113 Q107 99 121 76 Q112 50 138 49 Q151 31 170 51 Q190 35 206 59 Q222 79 206 94 Q211 117 189 123 Q172 137 158 118 Q141 132 129 113Z" fill="#D7A2C2" stroke="#FFE3F4" stroke-width="2.5"/><path d="M157 50 Q145 68 161 83 Q141 97 159 118 M177 50 Q189 65 175 78 Q198 89 185 119 M123 80 Q147 73 146 98 M205 78 Q183 82 199 101" stroke="#A66F97" stroke-width="3" fill="none" stroke-linecap="round"/>${[[135,72],[189,66],[145,109],[188,107]].map(([x,y])=>`<path class="wy-v7-brain-line ${brainPlaying?'':'is-paused'}" d="M${x} ${y} L164 88" stroke="#FDE59F" stroke-width="2" fill="none"/><circle class="wy-v7-brain-activity ${brainPlaying?'':'is-paused'}" cx="${x}" cy="${y}" r="5" fill="#FFE6A1"/>`).join('')}<circle class="wy-v7-brain-activity ${brainPlaying?'':'is-paused'}" cx="164" cy="88" r="20" fill="#FFDA80" opacity=".38"/><circle cx="164" cy="88" r="8" fill="#FFE3A1"/><text x="155" y="202" fill="#d9ecfa" font-size="12" text-anchor="middle">إشارات عصبية (رسم مبسّط)</text></svg>`;
  }
  function recoverySvg(type){
    const cx=type==='brain'?158:type==='heart'?160:145,cy=type==='brain'?49:type==='heart'?157:145;
    return `<svg role="img" aria-label="رسم تفاعلي للجسم يبرز ${esc(organs[type].label)}" viewBox="0 0 310 280"><circle cx="155" cy="139" r="114" fill="#A0C6E8" opacity=".07"/><circle cx="155" cy="51" r="29" fill="#E5BEA5" stroke="#E5EAF8" stroke-width="2"/><path d="M126 50 Q125 20 155 20 Q184 19 186 50 Q168 39 148 41 Z" fill="#27374C"/><path d="M126 88 Q103 91 95 131 L86 214 Q94 226 107 216 L122 150 L124 273 L186 273 L189 150 L204 216 Q215 227 226 214 L216 131 Q209 90 184 88 Z" fill="#5A83A6" stroke="#B1D7F4" stroke-width="2"/><path d="M144 46 Q138 37 133 47 Q130 57 142 61 Q152 69 158 61 Q171 71 181 60 Q192 51 181 45 Q175 37 164 45Z" fill="${type==='brain'?'#FFE0EB':'#D6A9BD'}" stroke="#FDE1F0" stroke-width="2"/><path d="M154 44 Q146 54 158 57 M169 44 Q163 56 174 60" fill="none" stroke="#B078A0" stroke-width="2"/><path d="M151 123 Q129 110 121 135 Q115 157 147 178 Z" fill="${type==='lungs'?'#B6E5FA':'#85B9D4'}" stroke="#D8F0FF" stroke-width="2"/><path d="M164 123 Q186 110 194 135 Q200 157 168 178 Z" fill="${type==='lungs'?'#B6E5FA':'#85B9D4'}" stroke="#D8F0FF" stroke-width="2"/><path d="M157 118V145 M157 145L141 153 M157 145L174 153" stroke="#EAF9FF" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M157 153 C148 141 136 152 157 174 C178 154 167 142 157 153Z" fill="${type==='heart'?'#FF9CAD':'#DE7C93'}" stroke="#FFE4E7" stroke-width="2"/><circle class="wy-v7-organ-glow" cx="${cx}" cy="${cy}" r="25" fill="#B0E4FF" opacity=".15" stroke="#C5E9FF" stroke-width="2" stroke-dasharray="4 5"/><rect x="10" y="12" width="94" height="28" rx="12" fill="#162A41"/><text x="57" y="30" text-anchor="middle" fill="#E8F5FF" font-size="12">${esc(organs[type].label)}</text></svg>`;
  }
  function doctorSvg(){return `<svg role="img" aria-label="دكتور وعي كرتوني في ركن حملة وعي يداوي" viewBox="0 0 310 260"><rect x="6" y="8" width="298" height="245" rx="18" fill="#365675" stroke="#82AACC" stroke-width="1"/><rect x="49" y="18" width="212" height="35" rx="10" fill="#BDE0EF"/><text x="155" y="42" text-anchor="middle" font-weight="bold" font-size="17" fill="#244259">حملة وعي يداوي</text><g transform="translate(55 35) scale(.98)">${personSvg('doctor','kind').replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'')}</g><rect x="18" y="125" width="72" height="86" rx="8" fill="#82B1C9"/><text x="54" y="156" font-size="12" font-weight="bold" text-anchor="middle" fill="#183C55">قرارك</text><text x="54" y="177" font-size="14" font-weight="bold" text-anchor="middle" fill="#183C55">بإيدك</text><rect x="221" y="125" width="72" height="86" rx="8" fill="#82B1C9"/><text x="257" y="156" font-size="12" font-weight="bold" text-anchor="middle" fill="#183C55">اسأل</text><text x="257" y="177" font-size="14" font-weight="bold" text-anchor="middle" fill="#183C55">الدكتور</text></svg>`;}
  function renderTabs(){for(let i=0;i<3;i++){const btn=$(`wy-v7-tab-${i}`), panel=$(`wy-v7-panel-${i}`);if(btn){btn.classList.toggle('is-active',tabIndex===i);btn.setAttribute('aria-selected',String(i===tabIndex));btn.tabIndex=i===tabIndex?0:-1;}if(panel)panel.hidden=i!==tabIndex;}}
  function tab(i){if(!Number.isInteger(i)||i<0||i>2)return;tabIndex=i;renderTabs();if(i===0)renderStory();if(i===1)renderChat();if(i===2)renderDoctor();}
  function renderStory(){if(!$('wy-v7-story-steps'))return;const all=data().story, s=all[storyIndex]||all[0];
    $('wy-v7-story-steps').innerHTML=all.map((x,i)=>`<button type="button" class="wy-v7-step ${i===storyIndex?'is-active':''}" aria-pressed="${i===storyIndex}" onclick="waeiV7.storySet(${i})"><span class="wy-v7-step-dot"></span>${esc(x.label)}</button>`).join('');
    $('wy-v7-story-number').textContent=`المشهد ${storyIndex+1}`;$('wy-v7-story-title').textContent=s.title||'';$('wy-v7-story-speech').textContent='«'+(s.speech||'')+'»';$('wy-v7-story-text').textContent=s.text||'';
    const k=`story-${storyIndex}`,custom=mediaImg(k,s.title);
    const fallback=(storyIndex===1||storyIndex===2)?brainSvg():personSvg('adam',storyIndex===3?'question':'kind');
    $('wy-v7-story-visual').innerHTML=`<span class="wy-v7-visual-key">${esc(s.label)}</span>${custom||fallback}${ownerMedia(k,'صورة / GIF للمشهد')}${!custom&&(storyIndex===1||storyIndex===2)?`<button type="button" class="wy-v7-toy-btn" onclick="waeiV7.brainToggle()"><i class="fa-solid fa-bolt"></i> ${brainPlaying?'أوقف الإشارات':'شغّل الإشارات'}</button>`:''}`;
    if(storyIndex===3){const sel=symptoms[symptomIndex];$('wy-v7-story-extra').innerHTML=`<div class="wy-v7-body-icons">${symptoms.map((x,i)=>`<button type="button" class="wy-v7-symptom ${i===symptomIndex?'is-active':''}" onclick="waeiV7.symptomSet(${i})">${mediaImg(`symptom-${i}`,x.label,'wy-v7-symptom-media')||esc(x.face)} ${esc(x.label)}</button>`).join('')}</div><div class="wy-v7-callout">${esc(sel.detail)}</div><div class="wy-v7-callout">${esc(s.note||'')}</div>`;}
    else $('wy-v7-story-extra').innerHTML=`<div class="wy-v7-callout">${esc(s.note||'')}</div>`;
    $('wy-v7-story-count').textContent=`${storyIndex+1} / ${all.length}`;$('wy-v7-story-prev').disabled=storyIndex===0;$('wy-v7-story-next').innerHTML=storyIndex===all.length-1?'أعد الرحلة <i class="fa-solid fa-arrows-rotate"></i>':'المشهد التالي <i class="fa-solid fa-arrow-left"></i>';
  }
  function storySet(i){if(i>=0&&i<data().story.length){storyIndex=i;renderStory();}}
  function storyMove(d){storySet((storyIndex+d+data().story.length)%data().story.length);}
  function brainToggle(){brainPlaying=!brainPlaying;renderStory();}
  function symptomSet(i){symptomIndex=i;renderStory();}
  function faceMarkup(who,face){const key=`chat-${who}-${face}`,custom=mediaImg(key,`الشخصية ${who==='adam'?'آدم':'سامي'}`);
    const label=({neutral:'طبيعي',confident:'واثق',question:'مستغرب',happy:'مبسوط',kind:'متفهّم',surprised:'متفاجئ'})[face]||'طبيعي';
    return `<div class="wy-v7-person">${custom||personSvg(who,face)}<strong class="wy-v7-person-name">${who==='adam'?'آدم':'سامي'}</strong><span class="wy-v7-person-face">${esc(label)}</span>${ownerMedia(key,'صورتك / GIF')}</div>`; }
  function renderChat(){if(!$('wy-v7-chat-scenes'))return;const list=data().chat,s=list[chatIndex];
    $('wy-v7-chat-scenes').innerHTML=list.map((x,i)=>`<button type="button" class="wy-v7-step ${i===chatIndex?'is-active':''}" aria-pressed="${i===chatIndex}" onclick="waeiV7.chatScene(${i})">${esc(x.label)}</button>`).join('');
    const selected=chatAnswer>=0?s.replies[chatAnswer]:null;
    const sceneKey=`chat-scene-${chatIndex}`,sceneImg=mediaImg(sceneKey,s.label,'wy-v7-scene-media');
    $('wy-v7-chat-characters').innerHTML=(sceneImg||isOwner()?`<div class="wy-v7-chat-scene-media">${sceneImg}${ownerMedia(sceneKey,'صورة / GIF للموقف')}</div>`:'')+faceMarkup('sami',selected?.sami||'neutral')+faceMarkup('adam',selected?.adam||'neutral');
    $('wy-v7-chat-bubbles').innerHTML=`<div class="wy-v7-bubble peer">${esc(s.prompt)}</div>`+(selected?`<div class="wy-v7-bubble adam">${esc(selected.text)}</div><div class="wy-v7-bubble peer">${esc(selected.response)}</div>`:'');
    $('wy-v7-chat-choices').innerHTML=selected?`<div class="wy-v7-callout">💡 ${esc(selected.tip)}</div>`:s.replies.map((r,i)=>`<button type="button" class="wy-v7-choice" onclick="waeiV7.chatChoose(${i})">${esc(r.text)}</button>`).join('');
    $('wy-v7-chat-tip').textContent=selected?'ممتاز إنك جرّبت. بتقدر تغيّر جوابك وتشوف رد مختلف.':s.context;
  }
  function chatScene(i){if(i<0||i>=data().chat.length)return;chatIndex=i;chatAnswer=-1;renderChat();}
  function chatChoose(i){if(!data().chat[chatIndex]?.replies[i])return;chatAnswer=i;renderChat();if(typeof window.waeiEffects?.correct==='function')window.waeiEffects.correct($('wy-v7-chat-characters'));}
  function chatReset(){chatAnswer=-1;renderChat();}
  function renderDoctor(){if(!$('wy-v7-doctor-chips'))return;const items=data().doctor;
    const booth=mediaImg('doctor-booth','ركن حملة وعي يداوي'),face=mediaImg('doctor-person','دكتور وعي');
    $('wy-v7-doctor-visual').innerHTML=booth||doctorSvg();if(face){const wrap=document.createElement('div');wrap.style.width='min(100%,170px)';wrap.innerHTML=face;$('wy-v7-doctor-visual').append(wrap);}$('wy-v7-doctor-visual').insertAdjacentHTML('beforeend',ownerMedia('doctor-booth','صورة / GIF للركن')+ownerMedia('doctor-person','صورة / GIF للدكتور'));
    $('wy-v7-doctor-chips').innerHTML=items.map((x,i)=>`<button type="button" class="wy-v7-question-chip" onclick="waeiV7.doctorChoose(${i})">${esc(x.q)}</button>`).join('');
  }
  function doctorChoose(i){const x=data().doctor[i];if(!x)return;doctorQuestion=i;$('wy-v7-doctor-input').value=x.q;answerDoctor(x.a);}
  function answerDoctor(a){const box=$('wy-v7-doctor-response');box.hidden=false;box.textContent='دكتور وعي: '+a;}
  function ask(e){e.preventDefault();const v=short($('wy-v7-doctor-input').value,250).toLocaleLowerCase('ar').normalize('NFKC');if(!v)return;
    const items=data().doctor;
    let match=items.find(x=>short(x.q,250).toLocaleLowerCase('ar')===v);
    if(!match){let score=0;for(const d of items){const words=String(d.keywords||'').split(',').map(s=>s.trim().toLocaleLowerCase('ar')).filter(s=>s.length>=2);const n=words.filter(w=>v.includes(w)).length;if(n>score){match=d;score=n;}}}
    answerDoctor(match?match.a:'سؤالك مهم، بس ما عندي إله جواب مُراجع لهذا السؤال حالياً. إذا الموضوع بخص صحتك أو في ضغط عليك، احكي مع مختص صحي أو شخص كبير بتثق فيه.');
  }
  function renderRecovery(){if(!$('wy-v7-recovery-phases'))return;const list=data().recovery,p=list[recoveryIndex];
    $('wy-v7-recovery-phases').innerHTML=list.map((x,i)=>`<button type="button" class="wy-v7-step ${i===recoveryIndex?'is-active':''}" aria-pressed="${i===recoveryIndex}" onclick="waeiV7.recoverySet(${i})"><span class="wy-v7-step-dot"></span>${esc(x.label)}</button>`).join('');
    $('wy-v7-recovery-tag').textContent=p.tag||'';$('wy-v7-recovery-title').textContent=p.label||'';$('wy-v7-recovery-message').textContent=p.message||'';
    $('wy-v7-recovery-organs').innerHTML=Object.keys(organs).map(k=>`<button type="button" class="wy-v7-organ ${k===organ?'is-active':''}" aria-pressed="${k===organ}" onclick="waeiV7.recoveryOrgan('${k}')"><i class="fa-solid ${organs[k].icon}"></i> ${esc(organs[k].label)}</button>`).join('');
    $('wy-v7-recovery-detail').textContent=p[organ]||'';
    const key=`recovery-${recoveryIndex}-${organ}`,custom=mediaImg(key,`تعافي ${organs[organ].label}`);
    $('wy-v7-recovery-visual').innerHTML=`<span class="wy-v7-visual-key">${esc(organs[organ].label)}</span>${custom||recoverySvg(organ)}${ownerMedia(key,'صورة / GIF للعضو')}`;
    $('wy-v7-recovery-count').textContent=`${recoveryIndex+1} / ${list.length}`;$('wy-v7-recovery-prev').disabled=recoveryIndex===0;$('wy-v7-recovery-fact').hidden=!fact;$('wy-v7-fact-label').textContent=fact?'إخفاء المعلومة':'معلومة بتفيدك';
  }
  function recoverySet(i){if(i<0||i>=data().recovery.length)return;recoveryIndex=i;fact=false;renderRecovery();}
  function recoveryMove(d){recoverySet((recoveryIndex+d+data().recovery.length)%data().recovery.length);}
  function recoveryOrgan(k){if(!organs[k])return;organ=k;renderRecovery();}
  function factToggle(){fact=!fact;renderRecovery();}
  function renderLiterature(){const box=$('wy-lit-items'),config=lit();if(!box)return;
    $('wy-lit-title').textContent=config.title||'أدبيات';$('wy-lit-description').textContent=config.description||'';$('wy-literature-section').dataset.theme=['navy','slate','teal'].includes(config.theme)?config.theme:'navy';
    const items=config.items.filter(x=>x&&x.published!==false).sort((a,b)=>(Number(a.order)||0)-(Number(b.order)||0));
    box.innerHTML=items.length?items.map(item=>{const img=url(item.imageUrl),link=url(item.linkUrl),file=url(item.fileUrl);return `<article class="wy-lit-card">${img?`<img alt="غلاف ${esc(item.title)}" src="${esc(img)}" loading="lazy" referrerpolicy="no-referrer">`:'<div class="wy-lit-no-media"><i class="fa-solid fa-book-open"></i></div>'}<div class="wy-lit-body"><h3>${esc(item.title)}</h3><p class="by">${esc(item.author)}</p><p>${esc(item.description)}</p>${link?`<a class="wy-lit-link" href="${esc(link)}" target="_blank" rel="noopener noreferrer">اقرأ العمل <i class="fa-solid fa-arrow-up-left-from-square"></i></a>`:''}${file?` <a class="wy-lit-link" href="${esc(file)}" target="_blank" rel="noopener noreferrer">الملف المرفق <i class="fa-solid fa-file"></i></a>`:''}</div></article>`;}).join(''):'<div class="wy-lit-empty"><i class="fa-regular fa-bookmark"></i> الأعمال الأدبية رح تظهر هون بعد نشرها من المالك.</div>';
  }
  function renderAll(){renderTabs();renderStory();renderChat();renderDoctor();renderRecovery();renderLiterature();}
  function overlay(on){const n=$('wy-v7-dialog');if(!n)return;n.hidden=!on;if(on) n.querySelector('input,button,textarea')?.focus();}
  function close(){overlay(false);}
  function editor(title,html,onSubmit){if(!isOwner())return;
    const target=$('wy-v7-dialog-content');target.innerHTML=`<h3>${esc(title)}</h3><form id="wy-v7-editor-form">${html}<div class="wy-v7-editor-actions"><button type="submit" id="wy-v7-editor-save">حفظ ونشر سحابياً</button><button type="button" class="secondary" onclick="waeiV7.close()">إلغاء</button></div></form>`;
    $('wy-v7-editor-form').addEventListener('submit',async event=>{event.preventDefault();const btn=$('wy-v7-editor-save');btn.disabled=true;try{await onSubmit(event);}catch(e){toast('تعذّر الحفظ: '+String(e.message||''),'error');}finally{btn.disabled=false;}});
    overlay(true);
  }
  function fields(list,values){return '<div class="wy-v7-editor-grid">'+list.map(f=>{
    const key=f[0],label=f[1],multi=Boolean(f[2]),value=short(values[key]||'',multi?1100:350);
    return `<label class="wy-v7-editor-field ${multi?'wide':''}"><span>${esc(label)}</span>${multi?`<textarea name="${esc(key)}" maxlength="1100">${esc(value)}</textarea>`:`<input name="${esc(key)}" value="${esc(value)}" maxlength="350">`}</label>`;
  }).join('')+'</div>';
  }
  const schemas={story:[['label','اسم المرحلة'],['title','عنوان المشهد'],['speech','كلام آدم'],['text','الشرح المبسّط',true],['note','ملحوظة إضافية',true]],chat:[['label','عنوان الموقف'],['context','مقدمة قصيرة'],['prompt','كلام سامي / الضغط',true]],doctor:[['q','السؤال'],['a','الجواب المعتمد',true],['keywords','كلمات تساعد على فهم السؤال المكتوب (افصل بينها بفاصلة)',true]],recovery:[['label','عنوان المرحلة'],['tag','وصف صغير'],['message','رسالة المرحلة',true],['brain','الدماغ',true],['heart','القلب',true],['lungs','الرئتان',true]]};
  function edit(section,index){if(!isOwner())return;if(!schemas[section])return;const config=data();
    const targetIndex=Number.isInteger(index)?index:section==='story'?storyIndex:section==='chat'?chatIndex:section==='recovery'?recoveryIndex:0;
    editMode=section;editIndex=targetIndex;
    let item=config[section][targetIndex]||{};
    const replySchema=section==='chat'?`<h4 style="font:800 .85rem Cairo,sans-serif;margin:14px 0 7px">ردود آدم ورد فعل سامي</h4><div class="wy-v7-editor-grid">${(item.replies||[]).map((r,i)=>[['text','رد آدم'],['response','رد سامي'],['tip','النصيحة']].map(([k,label])=>`<label class="wy-v7-editor-field"><span>الاختيار ${i+1} / ${label}</span><input name="r${i}_${k}" maxlength="350" value="${esc(r[k]||'')}"></label>`).join('')).join('')}</div>`:'';
    editor(`تعديل ${section==='story'?'رحلة آدم':section==='chat'?'موقف الرفض':section==='doctor'?'إجابة دكتور وعي':'رحلة الجسم'} • ${targetIndex+1}`,fields(schemas[section],item)+replySchema,async e=>{
      const form=e.target;const row={...item};for(const [key] of schemas[section])row[key]=short(form.elements.namedItem(key)?.value,1100);
      if(section==='chat')row.replies=item.replies.map((r,i)=>{const x={...r};for(const key of ['text','response','tip'])x[key]=short(form.elements.namedItem(`r${i}_${key}`)?.value,350);return x;});
      if(section==='doctor'&&!row.q)return toast('السؤال مطلوب.','error');
      config[section][targetIndex]=row;
      if(await store(KEY,config))close();
    });
  }
  function doctorAdd(){if(!isOwner())return;const d=data();if(d.doctor.length>=16)return toast('الحد الأقصى 16 سؤالاً.','error');d.doctor.push({q:'سؤال جديد',a:'إجابة قصيرة ومراجعة',keywords:''});return store(KEY,d);}
  async function doctorRemove(i){if(!isOwner()||!confirm('حذف السؤال المحدد؟'))return;const d=data();d.doctor.splice(i,1);await store(KEY,d);}
  function openMedia(k){if(!isOwner())return;if(!/^(story-[0-3]|symptom-[0-3]|chat-scene-[0-2]|chat-(adam|sami)-(neutral|confident|question|happy|kind|surprised)|doctor-(person|booth)|recovery-[0-3]-(brain|heart|lungs))$/.test(k))return;mediaKey=k;
    const existing=asset(k);
    editor('إرفاق صورة أو GIF — '+k,`<p class="wy-v7-admin-note">ارفع صورة JPG/PNG/WebP أو GIF متحرك (حتى 12MB)، أو استخدم رابط HTTPS مباشر. صورة المشهد الافتراضية بتظل ظاهرة إذا ما أرفقت صورة.</p><div class="wy-v7-editor-grid"><label class="wy-v7-editor-field wide"><span>ملف من جهازك</span><input type="file" id="wy-v7-media-file" accept="image/jpeg,image/png,image/webp,image/gif"></label><label class="wy-v7-editor-field wide"><span>أو رابط HTTPS للصورة / GIF</span><input id="wy-v7-media-url" type="url" placeholder="https://..." value="${esc(existing)}"></label></div>${existing?`<img alt="الوسائط الحالية" src="${esc(existing)}" loading="lazy" style="max-width:180px;max-height:120px;object-fit:contain;margin-top:8px;border-radius:9px">`:''}<button type="button" class="wy-v7-button ghost" style="background:#fff0f1;color:#991b1b;margin-top:8px" onclick="waeiV7.mediaRemove()">إزالة الصورة والعودة للرسم</button>`,async()=>{
      const file=$('wy-v7-media-file').files[0];const val=$('wy-v7-media-url').value.trim();let output='';
      if(file){if(!['image/jpeg','image/png','image/webp','image/gif'].includes(file.type))return toast('مسموح JPG أو PNG أو WebP أو GIF فقط.','error');if(file.size>12*1024*1024)return toast('الصورة كبيرة (الحد 12MB).','error');
        if(typeof uploadToSupabaseStorage!=='function')return toast('الرفع السحابي غير متاح.','error');
        if(file.type==='image/gif')output=await uploadToSupabaseStorage(file,'interactive-v7/gifs');
        else {const compressed=await compressImageFile(file,1150,.83);output=await uploadDataUrlToStorage(compressed,'interactive-v7/images',`illustration-${Date.now()}.webp`);}
      } else if(val) output=url(val);
      if(!output)return toast('أرفق صورة أو رابط HTTPS صالحاً.','error');
      const d=data();d.media[mediaKey]=output;if(await store(KEY,d))close();
    });
  }
  async function mediaRemove(){if(!isOwner()||!confirm('إزالة وسائط هذا المكان والرجوع للرسم الافتراضي؟'))return;const d=data();delete d.media[mediaKey];if(await store(KEY,d))close();}
  function mediaManager(){if(!isOwner())return;const keys=[...defaultData.story.map((_,i)=>[`story-${i}`,`رحلة آدم — ${defaultData.story[i].label}`]),...symptoms.map((x,i)=>[`symptom-${i}`,`الانسحاب — ${x.label}`]),...defaultData.chat.map((x,i)=>[`chat-scene-${i}`,`الموقف — ${x.label}`]),...['sami','adam'].flatMap(who=>['neutral','confident','question','happy','kind','surprised'].map(face=>[`chat-${who}-${face}`,`${who==='adam'?'آدم':'سامي'} — ${face}`])),['doctor-booth','دكتور وعي — ركن الحملة'],['doctor-person','دكتور وعي — الشخصية'],...defaultData.recovery.flatMap((p,i)=>Object.keys(organs).map(o=>[`recovery-${i}-${o}`,`${p.label} — ${organs[o].label}`]))];
    const box=$('wy-v7-admin-media');if(!box)return;box.innerHTML=keys.map(([k,label])=>`<div class="wy-v7-admin-item"><span>${esc(label)} ${asset(k)?'✅':'＋'}</span><button type="button" onclick="waeiV7.openMedia('${k}')"><i class="fa-solid fa-image"></i> ${asset(k)?'تغيير':'إرفاق'}</button></div>`).join('');}
  function admin(){if(!isOwner())return;const sections=$('wy-v7-admin-text');if(!sections)return;const d=data();
    const rows=[['story','رحلة آدم',d.story],['chat','مواقف مكان آدم',d.chat],['doctor','أسئلة دكتور وعي',d.doctor],['recovery','رحلة الجسم للتعافي',d.recovery]];
    sections.innerHTML=rows.map(([k,title,items])=>`<section><div class="flex flex-wrap items-center justify-between gap-2 mb-2"><h4 class="font-black font-cairo text-slate-800 text-sm">${esc(title)}</h4>${k==='doctor'?'<button class="wy-btn wy-btn-ghost" type="button" onclick="waeiV7.doctorAdd()">+ سؤال جديد</button>':''}</div><div class="wy-v7-admin-list">${items.map((x,i)=>`<div class="wy-v7-admin-item"><span>${esc(x.label||x.q||x.title||`#${i+1}`)}</span><span style="display:flex;gap:4px"><button type="button" onclick="waeiV7.edit('${k}',${i})">تعديل</button>${k==='doctor'?`<button type="button" onclick="waeiV7.doctorRemove(${i})">حذف</button>`:''}</span></div>`).join('')}</div></section>`).join('');
    mediaManager();litAdmin();
  }
  function litAdmin(){const target=$('wy-v7-admin-lit');if(!target||!isOwner())return;const x=lit();
    target.innerHTML=`<div class="flex flex-wrap gap-2 mb-3"><button class="wy-btn wy-btn-primary" type="button" onclick="waeiV7.litEdit()">+ إضافة عمل</button><button class="wy-btn wy-btn-ghost" type="button" onclick="waeiV7.litSettings()">عنوان القسم وألوانه</button></div><div class="wy-v7-admin-list">${x.items.map((row,i)=>`<div class="wy-v7-admin-item"><span><b>${esc(row.title)}</b><br>${esc(row.author)} • ${row.published===false?'مخفي':'منشور'}</span><span style="display:flex;gap:4px;flex-wrap:wrap"><button type="button" onclick="waeiV7.litEdit(${jsArg(row.id)})">تعديل</button><button type="button" onclick="waeiV7.litToggle(${jsArg(row.id)})">${row.published===false?'نشر':'إخفاء'}</button><button type="button" onclick="waeiV7.litMove(${jsArg(row.id)},-1)" aria-label="تحريك للأعلى">↑</button><button type="button" onclick="waeiV7.litMove(${jsArg(row.id)},1)" aria-label="تحريك للأسفل">↓</button><button type="button" onclick="waeiV7.litDelete(${jsArg(row.id)})">حذف</button></span></div>`).join('')}</div>`;
  }
  function litEdit(id=''){if(!isOwner())return;const c=lit(),record=c.items.find(x=>String(x.id)===String(id))||{},extra=`<div class="wy-v7-editor-grid"><label class="wy-v7-editor-field"><span>رابط العمل (HTTPS)</span><input type="url" name="linkUrl" value="${esc(record.linkUrl||'')}" placeholder="https://..."></label><label class="wy-v7-editor-field"><span>رابط صورة أو GIF (HTTPS)</span><input type="url" name="imageUrl" value="${esc(record.imageUrl||'')}" placeholder="https://..."></label><label class="wy-v7-editor-field"><span>رفع غلاف صورة / GIF</span><input type="file" name="cover" accept="image/jpeg,image/png,image/webp,image/gif"></label><label class="wy-v7-editor-field"><span>رفع ملف PDF اختياري</span><input type="file" name="pdf" accept="application/pdf"></label></div><label class="wy-v7-editor-field"><span>رابط الملف المرفق (HTTPS)</span><input type="url" name="fileUrl" value="${esc(record.fileUrl||'')}" placeholder="https://..."></label><label style="display:flex;gap:8px;margin-top:8px;align-items:center;font-size:.8rem"><input type="checkbox" name="published" ${record.published===false?'':'checked'}> إظهار للزوار</label>`;
    editor(record.id?'تعديل عمل أدبي':'إضافة عمل أدبي',fields([['title','عنوان العمل'],['author','اسم صاحب العمل'],['description','وصف قصير',true]],record)+extra,async e=>{
      const f=e.target, title=short(f.elements.namedItem('title').value,140),author=short(f.elements.namedItem('author').value,120);if(!title||!author)return toast('عنوان العمل واسم صاحبه مطلوبين.','error');
      const next={...record,id:record.id||newId(),title,author,description:short(f.elements.namedItem('description').value,850),published:f.elements.namedItem('published').checked,linkUrl:'',imageUrl:'',fileUrl:'',order:record.order??c.items.length};
      for(const field of ['linkUrl','imageUrl','fileUrl']){const raw=f.elements.namedItem(field).value.trim();if(raw&&!url(raw))return toast('الروابط لازم تبدأ بـ HTTPS.','error');next[field]=url(raw);}
      const cover=f.elements.namedItem('cover').files[0],pdf=f.elements.namedItem('pdf').files[0];
      if(cover){if(!['image/jpeg','image/png','image/webp','image/gif'].includes(cover.type)||cover.size>12*1024*1024)return toast('الغلاف لازم صورة أو GIF حتى 12MB.','error');next.imageUrl=cover.type==='image/gif'?await uploadToSupabaseStorage(cover,'literature/gifs'):await uploadDataUrlToStorage(await compressImageFile(cover,1000,.83),'literature/images',`cover-${Date.now()}.webp`);}
      if(pdf){if(pdf.type!=='application/pdf'||pdf.size>15*1024*1024)return toast('الملف لازم PDF حتى 15MB.','error');next.fileUrl=await uploadToSupabaseStorage(pdf,'literature/pdfs');}
      c.items=c.items.filter(x=>x.id!==next.id).concat(next);if(await store(LIT,c))close();
    });
  }
  function litSettings(){if(!isOwner())return;const x=lit();editor('تخصيص قسم أدبيات',fields([['title','عنوان القسم'],['description','وصف القسم',true]],x)+`<label class="wy-v7-editor-field"><span>لون الخلفية</span><select name="theme"><option value="navy" ${x.theme==='navy'?'selected':''}>أزرق غامق</option><option value="slate" ${x.theme==='slate'?'selected':''}>رمادي مزرق</option><option value="teal" ${x.theme==='teal'?'selected':''}>تركوازي</option></select></label>`,async e=>{const f=e.target;x.title=short(f.elements.namedItem('title').value,110)||'أدبيات';x.description=short(f.elements.namedItem('description').value,400);x.theme=['navy','slate','teal'].includes(f.elements.namedItem('theme').value)?f.elements.namedItem('theme').value:'navy';if(await store(LIT,x))close();});}
  async function litToggle(id){if(!isOwner())return;const x=lit(),item=x.items.find(z=>z.id===id);if(!item)return;item.published=item.published===false;await store(LIT,x);}
  async function litMove(id,d){if(!isOwner())return;const x=lit();x.items.sort((a,b)=>(Number(a.order)||0)-(Number(b.order)||0));const i=x.items.findIndex(z=>z.id===id),j=i+d;if(i<0||j<0||j>=x.items.length)return;[x.items[i],x.items[j]]=[x.items[j],x.items[i]];x.items.forEach((z,n)=>{z.order=n;});await store(LIT,x);}
  async function litDelete(id){if(!isOwner()||!confirm('حذف هذا العمل من أدبيات نهائياً؟'))return;const x=lit();x.items=x.items.filter(z=>z.id!==id);await store(LIT,x);}
  function install(){renderAll();
    // Lightly integrate into the existing login UI and admin tab system; no credentials in this module.
    const oldUI=window.applyActiveAdminUI;
    if(typeof oldUI==='function'&&!oldUI.__wyV7Wrapped){const f=function(...args){const result=oldUI.apply(this,args);renderAll();admin();return result;};f.__wyV7Wrapped=true;window.applyActiveAdminUI=f;}
    const oldTab=window.switchAdminTab;
    if(typeof oldTab==='function'&&!oldTab.__wyV7Wrapped){const f=function(t,...args){const v=oldTab.call(this,t,...args);if((t==='wyV7CMS'||t==='literatureCMS')&&isOwner())admin();return v;};f.__wyV7Wrapped=true;window.switchAdminTab=f;}
    const oldSwitch=window.switchMainScreen;
    if(typeof oldSwitch==='function'&&!oldSwitch.__wyV7Wrapped){const f=function(id,...args){const v=oldSwitch.call(this,id,...args);if(id==='screen-sayno')tab(tabIndex);else if(id==='screen-literature')renderLiterature();else if(id==='screen-anatomy')renderRecovery();return v;};f.__wyV7Wrapped=true;window.switchMainScreen=f;}
    const tabList=$('wy-refusal-v7')?.querySelector('[role=tablist]');
    tabList?.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?2:(tabIndex+(e.key==='ArrowLeft'?1:2))%3;tab(next);$(`wy-v7-tab-${next}`)?.focus();});
    const overlayBox=$('wy-v7-dialog');overlayBox?.addEventListener('click',e=>{if(e.target===overlayBox)close();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('wy-v7-dialog')?.hidden)close();});
  }
  window.waeiV7=Object.freeze({tab,storySet,storyMove,brainToggle,symptomSet,chatScene,chatChoose,chatReset,doctorChoose,ask,recoverySet,recoveryMove,recoveryOrgan,factToggle,edit,doctorAdd,doctorRemove,openMedia,mediaRemove,close,admin,litEdit,litSettings,litToggle,litMove,litDelete,render:renderAll,renderLiterature});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
