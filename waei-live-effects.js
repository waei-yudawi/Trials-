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
      {label:'الاعتماد',title:'دورة الإدمان',speech:'صرت أفكر فيها كثير.',text:'مع التكرار، ممكن يصير الدماغ يطلب النيكوتين من جديد. فهم الدورة بيساعدك تختار وتطلب الدعم.',note:'مش كل تجربة بتؤدي للإدمان، لكن الأفضل ما تبدأ.'}
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
      {label:'أول يوم',tag:'البداية',message:'جسمك بلّش يتأقلم مع غياب النيكوتين.',brain:'يبدأ الدماغ بالتأقلم مع غياب النيكوتين.',heart:'بعد ترك التدخين، نبض القلب ببلّش ينخفض باتجاه مستواه المعتاد خلال وقت قصير.',lungs:'إذا كنت بتدخّن، مستوى أول أكسيد الكربون بالدم ببلّش ينخفض خلال الساعات الأولى.'},
      {label:'أول أسبوع',tag:'التحدّي',message:'الأيام الأولى ممكن تكون صعبة، بس كل يوم إله قيمة.',brain:'يستمر الدماغ في التأقلم مع التوقف.',heart:'البعد عن دخان السجائر بيقلّل تعرّض القلب والأوعية لمواد ضارّة.',lungs:'بعد ترك التدخين، ممكن تتحسّن حاسة الشم والتذوق، وتبلّش رئتك تستعيد قدرتها على التنظيف.'},
      {label:'بعد شهر',tag:'التقدّم',message:'جسمك مستمر بالتأقلم حتى لو ما بتحس بكل تغيير.',brain:'مع الوقت يتأقلم الدماغ أكثر مع غياب النيكوتين.',heart:'خلال أسابيع إلى أشهر، الدورة الدموية بتتحسّن عند كثير من اللي تركوا التدخين.',lungs:'خلال أسابيع إلى أشهر بعد الإقلاع عن التدخين، ممكن تصير الحركة والتنفس أسهل تدريجياً.'},
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
      if(group==='doctor')base[group]=source[group].filter(x=>x&&typeof x==='object').slice(0,40);
      else for(let i=0;i<Math.min(40,Math.max(base[group].length,source[group].length));i++)if(source[group][i]&&typeof source[group][i]==='object'){
        const item=source[group][i],fallback=base[group][i]||{};base[group][i]={...fallback,...item};
        if(group==='chat'&&Array.isArray(item.replies))base[group][i].replies=item.replies.slice(0,3).map((x,j)=>({...fallback.replies?.[j],...(x&&typeof x==='object'?x:{})}));
      }
    }
    if(source.media&&typeof source.media==='object'&&!Array.isArray(source.media))base.media=source.media;
    return base;
  }
  function shown(group,d=data()){return d[group].map((x,i)=>({x,i})).filter(({x})=>x&&x.visible!==false&&!x.removed).sort((a,b)=>(Number(a.x.order)||0)-(Number(b.x.order)||0)).map(({i})=>i);}
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
    const coat=who==='doctor', sami=who==='sami', base=sami?'#B7A5A6':coat?'#F4F5F7':'#982B2B';
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
    return `<svg role="img" aria-label="رسم تفاعلي للجسم يبرز ${esc(organs[type].label)}" viewBox="0 0 310 280"><circle cx="155" cy="139" r="114" fill="#c1b4b4" opacity=".07"/><circle cx="155" cy="51" r="29" fill="#E5BEA5" stroke="#E5EAF8" stroke-width="2"/><path d="M126 50 Q125 20 155 20 Q184 19 186 50 Q168 39 148 41 Z" fill="#27374C"/><path d="M126 88 Q103 91 95 131 L86 214 Q94 226 107 216 L122 150 L124 273 L186 273 L189 150 L204 216 Q215 227 226 214 L216 131 Q209 90 184 88 Z" fill="#d7dbe1" stroke="#9ca5b2" stroke-width="2"/><path d="M144 46 Q138 37 133 47 Q130 57 142 61 Q152 69 158 61 Q171 71 181 60 Q192 51 181 45 Q175 37 164 45Z" fill="${type==='brain'?'#FFE0EB':'#D6A9BD'}" stroke="#FDE1F0" stroke-width="2"/><path d="M154 44 Q146 54 158 57 M169 44 Q163 56 174 60" fill="none" stroke="#B078A0" stroke-width="2"/><path d="M151 123 Q129 110 121 135 Q115 157 147 178 Z" fill="${type==='lungs'?'#b96d76':'#d7a3aa'}" stroke="#f5d6d9" stroke-width="2"/><path d="M164 123 Q186 110 194 135 Q200 157 168 178 Z" fill="${type==='lungs'?'#b96d76':'#d7a3aa'}" stroke="#f5d6d9" stroke-width="2"/><path d="M157 118V145 M157 145L141 153 M157 145L174 153" stroke="#f8eeee" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M157 153 C148 141 136 152 157 174 C178 154 167 142 157 153Z" fill="${type==='heart'?'#FF9CAD':'#DE7C93'}" stroke="#FFE4E7" stroke-width="2"/><circle class="wy-v7-organ-glow" cx="${cx}" cy="${cy}" r="25" fill="#e5b7b7" opacity=".15" stroke="#b97070" stroke-width="2" stroke-dasharray="4 5"/><rect x="10" y="12" width="94" height="28" rx="12" fill="#982b2b"/><text x="57" y="30" text-anchor="middle" fill="#ffffff" font-size="12">${esc(organs[type].label)}</text></svg>`;
  }
  function oldDoctorSvg(){return `<svg role="img" aria-label="دكتور وعي كرتوني في ركن حملة وعي يداوي" viewBox="0 0 310 260"><rect x="6" y="8" width="298" height="245" rx="18" fill="#365675" stroke="#82AACC" stroke-width="1"/><rect x="49" y="18" width="212" height="35" rx="10" fill="#BDE0EF"/><text x="155" y="42" text-anchor="middle" font-weight="bold" font-size="17" fill="#244259">حملة وعي يداوي</text><g transform="translate(55 35) scale(.98)">${personSvg('doctor','kind').replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'')}</g><rect x="18" y="125" width="72" height="86" rx="8" fill="#82B1C9"/><text x="54" y="156" font-size="12" font-weight="bold" text-anchor="middle" fill="#183C55">قرارك</text><text x="54" y="177" font-size="14" font-weight="bold" text-anchor="middle" fill="#183C55">بإيدك</text><rect x="221" y="125" width="72" height="86" rx="8" fill="#82B1C9"/><text x="257" y="156" font-size="12" font-weight="bold" text-anchor="middle" fill="#183C55">اسأل</text><text x="257" y="177" font-size="14" font-weight="bold" text-anchor="middle" fill="#183C55">الدكتور</text></svg>`;}
  function renderTabs(){if($(`wy-v7-tab-${tabIndex}`)?.disabled){tabIndex=[0,1,2,3].find(i=>!$(`wy-v7-tab-${i}`)?.disabled)??-1;}for(let i=0;i<4;i++){const btn=$(`wy-v7-tab-${i}`), panel=$(`wy-v7-panel-${i}`);if(btn){btn.classList.toggle('is-active',tabIndex===i);btn.setAttribute('aria-selected',String(i===tabIndex));btn.tabIndex=i===tabIndex?0:-1;}if(panel)panel.hidden=i!==tabIndex;}}
  function tab(i){if(!Number.isInteger(i)||i<0||i>3)return;tabIndex=i;renderTabs();i=tabIndex;if(i===0)renderStory();if(i===1)window.waeiV8?.mirror();if(i===2)renderChat();if(i===3)renderDoctor();}
  function renderStory(){if(!$('wy-v7-story-steps'))return;const all=data().story,ids=shown('story');if(!ids.includes(storyIndex))storyIndex=ids[0]??0;const s=all[storyIndex]||all[0];
    $('wy-v7-story-steps').innerHTML=ids.map(i=>all[i]).map((x,pos)=>{const i=ids[pos];return `<button type="button" class="wy-v7-step ${i===storyIndex?'is-active':''}" aria-pressed="${i===storyIndex}" onclick="waeiV7.storySet(${i})"><span class="wy-v7-step-dot"></span><span data-wy7-text="story.${i}.label">${esc(x.label)}</span></button>`;}).join('');
    $('wy-v7-story-number').textContent=`المشهد ${ids.indexOf(storyIndex)+1}`;$('wy-v7-story-title').textContent=s.title||'';$('wy-v7-story-speech').textContent='«'+(s.speech||'')+'»';$('wy-v7-story-text').textContent=s.text||'';
    const k=`story-${storyIndex}`,custom=mediaImg(k,s.title);
    const fallback=(storyIndex===1||storyIndex===2)?brainSvg():personSvg('adam',storyIndex===3?'question':'kind');
    $('wy-v7-story-visual').innerHTML=`<span class="wy-v7-visual-key">${esc(s.label)}</span>${custom||fallback}${ownerMedia(k,'صورة / GIF للمشهد')}${!custom&&(storyIndex===1||storyIndex===2)?`<button type="button" class="wy-v7-toy-btn" onclick="waeiV7.brainToggle()"><i class="fa-solid fa-bolt"></i> ${brainPlaying?'أوقف الإشارات':'شغّل الإشارات'}</button>`:''}`;
    $('wy-v7-story-extra').innerHTML=`<div class="wy-v7-callout" data-wy7-text="story.${storyIndex}.note">${esc(s.note||'')}</div>`+(storyIndex===ids[ids.length-1]?'<button type="button" class="wy-v7-button" onclick="waeiV7.tab(1)">اكتشف أعراض الانسحاب</button>':'');
    for(const [id,field] of [['wy-v7-story-title','title'],['wy-v7-story-speech','speech'],['wy-v7-story-text','text']])$(id).dataset.wy7Text=`story.${storyIndex}.${field}`;
    $('wy-v7-story-count').textContent=`${ids.indexOf(storyIndex)+1} / ${ids.length}`;$('wy-v7-story-prev').disabled=storyIndex===ids[0];$('wy-v7-story-next').innerHTML=storyIndex===ids[ids.length-1]?'أعد الرحلة <i class="fa-solid fa-arrows-rotate"></i>':'المشهد التالي <i class="fa-solid fa-arrow-left"></i>';
  }
  function storySet(i){if(shown('story').includes(i)){storyIndex=i;renderStory();}}
  function storyMove(d){const ids=shown('story');if(ids.length)storySet(ids[(ids.indexOf(storyIndex)+d+ids.length)%ids.length]);}
  function brainToggle(){brainPlaying=!brainPlaying;renderStory();}
  function symptomSet(i){symptomIndex=i;renderStory();}
  function faceMarkup(who,face){const key=`chat-${who}-${face}`,custom=mediaImg(key,`الشخصية ${who==='adam'?'آدم':'سامي'}`);
    const label=({neutral:'طبيعي',confident:'واثق',question:'مستغرب',happy:'مبسوط',kind:'متفهّم',surprised:'متفاجئ'})[face]||'طبيعي';
    return `<div class="wy-v7-person">${custom||personSvg(who,face)}<strong class="wy-v7-person-name">${who==='adam'?'آدم':'سامي'}</strong><span class="wy-v7-person-face">${esc(label)}</span>${ownerMedia(key,'صورتك / GIF')}</div>`; }
  function renderChat(){if(!$('wy-v7-chat-scenes'))return;const list=data().chat,ids=shown('chat');if(!ids.includes(chatIndex)){chatIndex=ids[0]??0;chatAnswer=-1;}const s=list[chatIndex];
    $('wy-v7-chat-scenes').innerHTML=ids.map(i=>list[i]).map((x,pos)=>{const i=ids[pos];return `<button type="button" class="wy-v7-step ${i===chatIndex?'is-active':''}" aria-pressed="${i===chatIndex}" onclick="waeiV7.chatScene(${i})"><span data-wy7-text="chat.${i}.label">${esc(x.label)}</span></button>`;}).join('');
    const selected=chatAnswer>=0?s.replies[chatAnswer]:null;
    const sceneKey=`chat-scene-${chatIndex}`,sceneImg=mediaImg(sceneKey,s.label,'wy-v7-scene-media');
    $('wy-v7-chat-characters').innerHTML=(sceneImg||isOwner()?`<div class="wy-v7-chat-scene-media">${sceneImg}${ownerMedia(sceneKey,'صورة / GIF للموقف')}</div>`:'')+faceMarkup('sami',selected?.sami||'neutral')+faceMarkup('adam',selected?.adam||'neutral');
    $('wy-v7-chat-bubbles').innerHTML=`<div class="wy-v7-bubble peer"><small>سامي</small><span data-wy7-text="chat.${chatIndex}.prompt">${esc(s.prompt)}</span></div>`+(selected?`<div class="wy-v7-bubble adam"><small>أنت</small><span data-wy7-text="chat.${chatIndex}.replies.${chatAnswer}.text">${esc(selected.text)}</span></div><div class="wy-v7-bubble peer"><small>سامي</small><span data-wy7-text="chat.${chatIndex}.replies.${chatAnswer}.response">${esc(selected.response)}</span></div>`:'');
    $('wy-v7-chat-choices').innerHTML=selected?`<div class="wy-v7-callout"><span data-wy7-text="chat.${chatIndex}.replies.${chatAnswer}.tip">${esc(selected.tip)}</span></div>`:s.replies.map((r,i)=>`<button type="button" class="wy-v7-choice" onclick="waeiV7.chatChoose(${i})"><span data-wy7-text="chat.${chatIndex}.replies.${i}.text">${esc(r.text)}</span></button>`).join('');
    $('wy-v7-chat-tip').textContent=selected?'ممتاز إنك جرّبت. بتقدر تغيّر جوابك وتشوف رد مختلف.':s.context;
  }
  function chatScene(i){if(!shown('chat').includes(i))return;chatIndex=i;chatAnswer=-1;renderChat();}
  function chatChoose(i){if(!data().chat[chatIndex]?.replies[i])return;chatAnswer=i;renderChat();if(typeof window.waeiEffects?.correct==='function')window.waeiEffects.correct($('wy-v7-chat-characters'));}
  function chatReset(){chatAnswer=-1;renderChat();}
  function renderDoctor(){if(!$('wy-v7-doctor-chips'))return;const items=data().doctor;
    const booth=mediaImg('doctor-booth','ركن حملة وعي يداوي'),face=mediaImg('doctor-person','دكتور وعي');
    $('wy-v7-doctor-visual').innerHTML=booth||personSvg('doctor','kind');if(face){const wrap=document.createElement('div');wrap.style.width='min(100%,170px)';wrap.innerHTML=face;$('wy-v7-doctor-visual').append(wrap);}$('wy-v7-doctor-visual').insertAdjacentHTML('beforeend',ownerMedia('doctor-booth','صورة / GIF للركن')+ownerMedia('doctor-person','صورة / GIF للدكتور'));
    $('wy-v7-doctor-chips').innerHTML=shown('doctor').map(i=>items[i]).map((x,pos)=>{const i=shown('doctor')[pos];return `<button type="button" class="wy-v7-question-chip" onclick="waeiV7.doctorChoose(${i})"><span data-wy7-text="doctor.${i}.q">${esc(x.q)}</span></button>`;}).join('');
    if(doctorQuestion>=0&&shown('doctor').includes(doctorQuestion))answerDoctor(items[doctorQuestion].a);else if(doctorQuestion>=0){doctorQuestion=-1;$('wy-v7-doctor-response').hidden=true;}
  }
  function doctorChoose(i){const x=data().doctor[i];if(!x||!shown('doctor').includes(i))return;doctorQuestion=i;$('wy-v7-doctor-input').value=x.q;answerDoctor(x.a);}
  function answerDoctor(a){const box=$('wy-v7-doctor-response');box.hidden=false;box.textContent='دكتور وعي: '+a;if(doctorQuestion>=0)box.dataset.wy7Text=`doctor.${doctorQuestion}.a`;else delete box.dataset.wy7Text;}
  function ask(e){e.preventDefault();const v=short($('wy-v7-doctor-input').value,250).toLocaleLowerCase('ar').normalize('NFKC');if(!v)return;
    const items=shown('doctor').map(i=>data().doctor[i]);
    let match=items.find(x=>short(x.q,250).toLocaleLowerCase('ar')===v);
    if(!match){let score=0;for(const d of items){const words=String(d.keywords||'').split(',').map(s=>s.trim().toLocaleLowerCase('ar')).filter(s=>s.length>=2);const n=words.filter(w=>v.includes(w)).length;if(n>score){match=d;score=n;}}}
    doctorQuestion=match?shown('doctor')[items.indexOf(match)]:-1;answerDoctor(match?match.a:'سؤالك مهم، بس ما عندي إله جواب مُراجع لهذا السؤال حالياً. إذا الموضوع بخص صحتك أو في ضغط عليك، احكي مع مختص صحي أو شخص كبير بتثق فيه.');
  }
  function renderRecovery(){if(!$('wy-v7-recovery-phases'))return;const list=data().recovery,ids=shown('recovery');if(!ids.includes(recoveryIndex))recoveryIndex=ids[0]??0;const p=list[recoveryIndex];
    $('wy-v7-recovery-phases').innerHTML=ids.map(i=>list[i]).map((x,pos)=>{const i=ids[pos];return `<button type="button" class="wy-v7-step ${i===recoveryIndex?'is-active':''}" aria-pressed="${i===recoveryIndex}" onclick="waeiV7.recoverySet(${i})"><span class="wy-v7-step-dot"></span>${esc(x.label)}</button>`;}).join('');
    $('wy-v7-recovery-tag').textContent=p.tag||'';$('wy-v7-recovery-tag').dataset.wy7Text=`recovery.${recoveryIndex}.tag`;$('wy-v7-recovery-title').textContent=p.label||'';$('wy-v7-recovery-message').textContent=p.message||'';
    $('wy-v7-recovery-organs').innerHTML=Object.keys(organs).map(k=>`<button type="button" class="wy-v7-organ ${k===organ?'is-active':''}" aria-pressed="${k===organ}" onclick="waeiV7.recoveryOrgan('${k}')"><i class="fa-solid ${organs[k].icon}"></i> ${esc(organs[k].label)}</button>`).join('');
    $('wy-v7-recovery-detail').textContent=p[organ]||''; $('wy-v7-recovery-detail').dataset.wy7Text=`recovery.${recoveryIndex}.${organ}`; $('wy-v7-recovery-message').dataset.wy7Text=`recovery.${recoveryIndex}.message`; $('wy-v7-recovery-title').dataset.wy7Text=`recovery.${recoveryIndex}.label`;
    const key=`recovery-${recoveryIndex}-${organ}`,custom=mediaImg(key,`تعافي ${organs[organ].label}`);
    $('wy-v7-recovery-visual').innerHTML=`<span class="wy-v7-visual-key">${esc(organs[organ].label)}</span>${custom||recoverySvg(organ)}${ownerMedia(key,'صورة / GIF للعضو')}`;
    $('wy-v7-recovery-count').textContent=`${ids.indexOf(recoveryIndex)+1} / ${ids.length}`;$('wy-v7-recovery-prev').disabled=recoveryIndex===ids[0];$('wy-v7-recovery-fact').hidden=!fact;$('wy-v7-fact-label').textContent=fact?'إخفاء المعلومة':'معلومة بتفيدك';
  }
  function recoverySet(i){if(!shown('recovery').includes(i))return;recoveryIndex=i;fact=false;renderRecovery();}
  function recoveryMove(d){const ids=shown('recovery');if(ids.length)recoverySet(ids[(ids.indexOf(recoveryIndex)+d+ids.length)%ids.length]);}
  function recoveryOrgan(k){if(!organs[k])return;organ=k;renderRecovery();}
  function factToggle(){fact=!fact;renderRecovery();}
  function renderLiterature(){const box=$('wy-lit-items'),config=lit();if(!box)return;
    $('wy-lit-title').textContent=config.title||'أدبيات';$('wy-lit-description').textContent=config.description||'';$('wy-lit-title').dataset.wyCore='lit:0:title';$('wy-lit-description').dataset.wyCore='lit:0:description';$('wy-literature-section').dataset.theme=['navy','slate','teal'].includes(config.theme)?config.theme:'navy';
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
    editor(`تعديل ${section==='story'?'رحلة آدم':section==='chat'?'موقف الرفض':section==='doctor'?'إجابة دكتور وعي':'رحلة الجسم'} • ${targetIndex+1}`,fields(schemas[section],item)+replySchema+`<div class="wy-v7-editor-grid"><label>ترتيب العنصر <input type="number" name="order" value="${Number(item.order)||0}"></label><label><input type="checkbox" name="visible" ${item.visible!==false&&!item.removed?'checked':''}> إظهار للزوار</label></div>`,async e=>{
      const form=e.target;const row={...item};for(const [key] of schemas[section])row[key]=short(form.elements.namedItem(key)?.value,1100);
      if(section==='chat')row.replies=item.replies.map((r,i)=>{const x={...r};for(const key of ['text','response','tip'])x[key]=short(form.elements.namedItem(`r${i}_${key}`)?.value,350);return x;});
      if(section==='doctor'&&!row.q)return toast('السؤال مطلوب.','error');
      row.order=Number(form.elements.order.value)||0;row.visible=form.elements.visible.checked;row.removed=false;if(!row.visible&&shown(section,config).length<=1&&shown(section,config).includes(targetIndex)&&section!=='doctor')return toast('يمكنك إخفاء التجربة كاملة من تخصيص التبويبات.','error');config[section][targetIndex]=row;
      if(await store(KEY,config))close();
    });
  }
  async function itemAdd(group){if(!isOwner()||!schemas[group])return;const d=data();if(d[group].length>=40)return toast('الحد الأقصى 40 عنصراً.','error');const row=structuredClone(defaultData[group][0]||{});row.visible=false;row.order=d[group].length;if(group==='doctor'){row.q='سؤال جديد';row.a='';row.keywords='';}else{row.label='مرحلة جديدة';if(group==='story'){row.title='مشهد جديد';row.text='';row.speech='';row.note='';}if(group==='chat'){row.context='';row.prompt='';}if(group==='recovery'){row.message='';row.brain='';row.heart='';row.lungs='';}}const index=d[group].length;d[group].push(row);if(await store(KEY,d))edit(group,index);}
  async function itemRemove(group,i){if(!isOwner()||!schemas[group]||!confirm('حذف العنصر من العرض؟ يمكن استعادته من التعديل.'))return;const d=data();if(!d[group][i])return;if(group!=='doctor'&&shown(group,d).includes(i)&&shown(group,d).length<=1)return toast('يمكنك إخفاء التجربة كاملة بدلاً من حذف المرحلة الأخيرة.','error');d[group][i].removed=true;d[group][i].visible=false;await store(KEY,d);}
  function doctorAdd(){if(!isOwner())return;const d=data();if(d.doctor.length>=16)return toast('الحد الأقصى 16 سؤالاً.','error');d.doctor.push({q:'سؤال جديد',a:'إجابة قصيرة ومراجعة',keywords:''});return store(KEY,d);}
  async function doctorRemove(i){if(!isOwner()||!confirm('حذف السؤال المحدد؟'))return;const d=data();d.doctor.splice(i,1);await store(KEY,d);}
  function openMedia(k){if(!isOwner())return;if(!/^(story-\d+|chat-scene-\d+|chat-(adam|sami)-(neutral|confident|question|happy|kind|surprised)|doctor-(person|booth)|recovery-\d+-(brain|heart|lungs))$/.test(k))return;mediaKey=k;
    const existing=asset(k);
    editor('إرفاق صورة أو GIF أو SVG — '+k,`<p class="wy-v7-admin-note">ارفع صورة JPG/PNG/WebP أو GIF متحرك (حتى 12MB)، أو استخدم رابط HTTPS مباشر. صورة المشهد الافتراضية بتظل ظاهرة إذا ما أرفقت صورة.</p><div class="wy-v7-editor-grid"><label class="wy-v7-editor-field wide"><span>ملف من جهازك</span><input type="file" id="wy-v7-media-file" accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"></label><label class="wy-v7-editor-field wide"><span>أو رابط HTTPS للصورة / GIF</span><input id="wy-v7-media-url" type="url" placeholder="https://..." value="${esc(existing)}"></label></div>${existing?`<img alt="الوسائط الحالية" src="${esc(existing)}" loading="lazy" style="max-width:180px;max-height:120px;object-fit:contain;margin-top:8px;border-radius:9px">`:''}<button type="button" class="wy-v7-button ghost" style="background:#fff0f1;color:#991b1b;margin-top:8px" onclick="waeiV7.mediaRemove()">إزالة الصورة والعودة للرسم</button>`,async()=>{
      const file=$('wy-v7-media-file').files[0];const val=$('wy-v7-media-url').value.trim();let output='';
      if(file){if(!['image/jpeg','image/png','image/webp','image/gif','image/svg+xml'].includes(file.type))return toast('مسموح JPG أو PNG أو WebP أو GIF أو SVG فقط.','error');if(file.size>12*1024*1024)return toast('الصورة كبيرة (الحد 12MB).','error');
        if(typeof uploadToSupabaseStorage!=='function')return toast('الرفع السحابي غير متاح.','error');
        if(file.type==='image/svg+xml')output=await window.waeiV8.uploadMedia(file);else if(file.type==='image/gif')output=await uploadToSupabaseStorage(file,'interactive-v7/gifs');
        else {const compressed=await compressImageFile(file,1150,.83);output=await uploadDataUrlToStorage(compressed,'interactive-v7/images',`illustration-${Date.now()}.webp`);}
      } else if(val) output=url(val);
      if(!output)return toast('أرفق صورة أو رابط HTTPS صالحاً.','error');
      const d=data();d.media[mediaKey]=output;if(await store(KEY,d))close();
    });
  }
  async function mediaRemove(){if(!isOwner()||!confirm('إزالة وسائط هذا المكان والرجوع للرسم الافتراضي؟'))return;const d=data();delete d.media[mediaKey];if(await store(KEY,d))close();}
  function mediaManager(){if(!isOwner())return;const keys=[...data().story.map((x,i)=>[`story-${i}`,`رحلة آدم — ${x.label}`]),...data().chat.map((x,i)=>[`chat-scene-${i}`,`الموقف — ${x.label}`]),...['sami','adam'].flatMap(who=>['neutral','confident','question','happy','kind','surprised'].map(face=>[`chat-${who}-${face}`,`${who==='adam'?'آدم':'سامي'} — ${face}`])),['doctor-booth','دكتور وعي — ركن الحملة'],['doctor-person','دكتور وعي — الشخصية'],...data().recovery.flatMap((p,i)=>Object.keys(organs).map(o=>[`recovery-${i}-${o}`,`${p.label} — ${organs[o].label}`]))];
    const box=$('wy-v7-admin-media');if(!box)return;box.innerHTML=keys.map(([k,label])=>`<div class="wy-v7-admin-item"><span>${esc(label)} ${asset(k)?'✅':'＋'}</span><button type="button" onclick="waeiV7.openMedia('${k}')"><i class="fa-solid fa-image"></i> ${asset(k)?'تغيير':'إرفاق'}</button></div>`).join('');}
  function admin(){if(!isOwner())return;const sections=$('wy-v7-admin-text');if(!sections)return;const d=data();
    const rows=[['story','رحلة آدم',d.story],['chat','مواقف مكان آدم',d.chat],['doctor','أسئلة دكتور وعي',d.doctor],['recovery','رحلة الجسم للتعافي',d.recovery]];
    sections.innerHTML=rows.map(([k,title,items])=>`<section><div class="flex flex-wrap items-center justify-between gap-2 mb-2"><h4 class="font-black font-cairo text-slate-800 text-sm">${esc(title)}</h4><button class="wy-btn wy-btn-ghost" type="button" onclick="waeiV7.itemAdd('${k}')">+ إضافة</button></div><div class="wy-v7-admin-list">${items.map((x,i)=>`<div class="wy-v7-admin-item"><span>${esc(x.label||x.q||x.title||`#${i+1}`)} ${x.removed?'(محذوف)':x.visible===false?'(مخفي)':''}</span><span style="display:flex;gap:4px"><button type="button" onclick="waeiV7.edit('${k}',${i})">تعديل</button><button type="button" onclick="waeiV7.itemRemove('${k}',${i})">حذف</button></span></div>`).join('')}</div></section>`).join('');
    mediaManager();litAdmin();
  }
  function litAdmin(){const target=$('wy-v7-admin-lit');if(!target||!isOwner())return;const x=lit();
    target.innerHTML=`<div class="flex flex-wrap gap-2 mb-3"><button class="wy-btn wy-btn-primary" type="button" onclick="waeiV7.litEdit()">+ إضافة عمل</button><button class="wy-btn wy-btn-ghost" type="button" onclick="waeiV7.litSettings()">عنوان القسم وألوانه</button></div><div class="wy-v7-admin-list">${x.items.map((row,i)=>`<div class="wy-v7-admin-item"><span><b>${esc(row.title)}</b><br>${esc(row.author)} • ${row.published===false?'مخفي':'منشور'}</span><span style="display:flex;gap:4px;flex-wrap:wrap"><button type="button" onclick="waeiV7.litEdit(${jsArg(row.id)})">تعديل</button><button type="button" onclick="waeiV7.litToggle(${jsArg(row.id)})">${row.published===false?'نشر':'إخفاء'}</button><button type="button" onclick="waeiV7.litMove(${jsArg(row.id)},-1)" aria-label="تحريك للأعلى">↑</button><button type="button" onclick="waeiV7.litMove(${jsArg(row.id)},1)" aria-label="تحريك للأسفل">↓</button><button type="button" onclick="waeiV7.litDelete(${jsArg(row.id)})">حذف</button></span></div>`).join('')}</div>`;
  }
  function litEdit(id=''){if(!isOwner())return;const c=lit(),record=c.items.find(x=>String(x.id)===String(id))||{},extra=`<div class="wy-v7-editor-grid"><label class="wy-v7-editor-field"><span>رابط العمل (HTTPS)</span><input type="url" name="linkUrl" value="${esc(record.linkUrl||'')}" placeholder="https://..."></label><label class="wy-v7-editor-field"><span>رابط صورة أو GIF (HTTPS)</span><input type="url" name="imageUrl" value="${esc(record.imageUrl||'')}" placeholder="https://..."></label><label class="wy-v7-editor-field"><span>رفع غلاف صورة / GIF</span><input type="file" name="cover" accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"></label><label class="wy-v7-editor-field"><span>رفع ملف PDF اختياري</span><input type="file" name="pdf" accept="application/pdf"></label></div><label class="wy-v7-editor-field"><span>رابط الملف المرفق (HTTPS)</span><input type="url" name="fileUrl" value="${esc(record.fileUrl||'')}" placeholder="https://..."></label><label style="display:flex;gap:8px;margin-top:8px;align-items:center;font-size:.8rem"><input type="checkbox" name="published" ${record.published===false?'':'checked'}> إظهار للزوار</label>`;
    editor(record.id?'تعديل عمل أدبي':'إضافة عمل أدبي',fields([['title','عنوان العمل'],['author','اسم صاحب العمل'],['description','وصف قصير',true]],record)+extra,async e=>{
      const f=e.target, title=short(f.elements.namedItem('title').value,140),author=short(f.elements.namedItem('author').value,120);if(!title||!author)return toast('عنوان العمل واسم صاحبه مطلوبين.','error');
      const next={...record,id:record.id||newId(),title,author,description:short(f.elements.namedItem('description').value,850),published:f.elements.namedItem('published').checked,linkUrl:'',imageUrl:'',fileUrl:'',order:record.order??c.items.length};
      for(const field of ['linkUrl','imageUrl','fileUrl']){const raw=f.elements.namedItem(field).value.trim();if(raw&&!url(raw))return toast('الروابط لازم تبدأ بـ HTTPS.','error');next[field]=url(raw);}
      const cover=f.elements.namedItem('cover').files[0],pdf=f.elements.namedItem('pdf').files[0];
      if(cover){if(!['image/jpeg','image/png','image/webp','image/gif','image/svg+xml'].includes(cover.type)||cover.size>12*1024*1024)return toast('الغلاف لازم صورة أو GIF حتى 12MB.','error');next.imageUrl=cover.type==='image/svg+xml'?await window.waeiV8.uploadMedia(cover):cover.type==='image/gif'?await uploadToSupabaseStorage(cover,'literature/gifs'):await uploadDataUrlToStorage(await compressImageFile(cover,1000,.83),'literature/images',`cover-${Date.now()}.webp`);}
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
    tabList?.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?3:(tabIndex+(e.key==='ArrowLeft'?1:3))%4;tab(next);$(`wy-v7-tab-${next}`)?.focus();});
    const overlayBox=$('wy-v7-dialog');overlayBox?.addEventListener('click',e=>{if(e.target===overlayBox)close();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('wy-v7-dialog')?.hidden)close();});
  }
  window.waeiV7=Object.freeze({readText(path){const v=path.split(".").reduce((o,k)=>o?.[k],data());return typeof v==="string"?v:"";},async writeText(path,value){if(!isOwner()||! /^(story|chat|doctor|recovery)\.\d+\.(label|title|speech|text|note|context|prompt|q|a|keywords|tag|message|brain|heart|lungs|replies\.\d+\.(text|response|tip))$/.test(path))return false;const d=data(),parts=path.split("."),last=parts.pop(),obj=parts.reduce((o,k)=>o?.[k],d);if(!obj||typeof obj[last]!=="string")return false;obj[last]=short(value,1100);return store(KEY,d);},tab,storySet,storyMove,brainToggle,symptomSet,chatScene,chatChoose,chatReset,doctorChoose,ask,recoverySet,recoveryMove,recoveryOrgan,factToggle,edit,itemAdd,itemRemove,doctorAdd,doctorRemove,openMedia,mediaRemove,close,admin,litEdit,litSettings,litToggle,litMove,litDelete,render:renderAll,renderLiterature});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();

/* V8: one source of truth for the new experiences; existing Supabase adapter retained. */
(()=>{
'use strict';
const $=id=>document.getElementById(id),esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),owner=()=>window.currentUserRole==='owner',KEY='wa3y_v8_controls_v1';
const safeURL=v=>{try{const u=new URL(String(v));return u.protocol==='https:'&&u.href.length<2200?u.href:''}catch{return ''}},hex=(v,f='#982b2b')=>/^#[0-9a-f]{6}$/i.test(v||'')?v:f,icon=v=>/^fa-[a-z0-9-]{1,60}$/.test(v||'')?v:'fa-circle-info';
const nav={ 'team-field':{title:'فريقنا والميدان',icon:'fa-users-gear'},anatomy:{title:'تأثير التدخين على جسمك',icon:'fa-lungs'},lab:{title:'مختبر السيجارة الإلكترونية',icon:'fa-flask-vial'},sayno:{title:'كيف تقول «لا»؟',icon:'fa-hand'},calc:{title:'احسبها صح',icon:'fa-calculator'},research:{title:'الدراسات والأبحاث',icon:'fa-book-medical'},literature:{title:'أدبيات',icon:'fa-book-open-reader'},community:{title:'شكر وتقدير وآراء التجربة',icon:'fa-award'}};
const defaults={nav,mirror:{title:'مرآة آدم',subtitle:'مش كل شعور رح يدوم. اختار شو بحس آدم بعد ما يوقف.'},symptoms:{anger:{title:'العصبية',speech:'بتعصب بسرعة حتى على أشياء صغيرة.',text:'ممكن تصير سريع الانفعال بعد التوقف.',tip:'غيّر المكان أو اطلع امشِ شوي.',icon:'fa-bolt',mood:'anger'},craving:{title:'الرغبة بالتدخين',speech:'كل شوي بحس إني بدي أرجع أدخّن.',text:'الرغبة ممكن تكون قوية، لكنها بتخف مع الوقت.',tip:'اشرب مي ببطء، امضغ علكة أو اشغل حالك بنشاط.',icon:'fa-brain',mood:'craving'},focus:{title:'ضعف التركيز',speech:'بفتح الكتاب وبحس إني مش قادر أركّز.',text:'التركيز بالدراسة ممكن يصير أصعب لفترة مؤقتة.',tip:'قسّم الدراسة لمهام قصيرة وخذ استراحات.',icon:'fa-bullseye',mood:'focus'},sleep:{title:'اضطراب النوم',speech:'صار نومي متلخبط من وقت ما وقفت.',text:'ممكن يتغير نومك لفترة بعد الإقلاع.',tip:'حافظ على وقت نوم منتظم.',icon:'fa-moon',mood:'sleep'},stress:{title:'التوتر',speech:'بحس حالي متوتر حتى بدون سبب واضح.',text:'الجسم والدماغ عم يتأقلموا مع غياب النيكوتين.',tip:'تنفّس ببطء واحكي مع شخص بتثق فيه.',icon:'fa-wave-square',mood:'stress'},headache:{title:'الصداع',speech:'راسي بوجعني من وقت ما وقفت.',text:'ممكن يظهر الصداع عند بعض الأشخاص.',tip:'اشرب مي واهتم بالنوم. إذا استمر أو كان شديداً، اسأل مختصاً.',icon:'fa-head-side-virus',mood:'headache'}},lab:{title:'مختبر السيجارة الإلكترونية',intro:'اكتشف شو جوا الفيب.',note:'محاكاة توعوية رمزية؛ الألوان والحركة ليست قياساً مخبرياً.'},tabs:{parts:{title:'المكونات',icon:'fa-layer-group',text:'السائل وقطعة التسخين والبطارية أجزاء من الفيب.'},liquid:{title:'السائل',icon:'fa-droplet',text:'اختار مادة من رف المختبر لتستكشفها بشكل رمزي.'},heat:{title:'التسخين',icon:'fa-fire',text:'لما يسخن السائل، بيتكوّن رذاذ. مش مجرد بخار مي؛ ممكن يحمل مواد ضارة وجزيئات دقيقة.'},battery:{title:'البطارية',icon:'fa-battery-half',text:'أحياناً ممكن تفشل البطارية وتسخن بشكل خطير، وتسبب حريقاً أو انفجاراً وحروقاً. إذا ظهر دخان أو سخونة غير طبيعية، ابتعد وأخبر شخصاً بالغاً.'}},materials:{nicotine:{title:'النيكوتين',text:'مادة ممكن تسبب الإدمان. قد تؤثر على نمو دماغ المراهق.',icon:'fa-brain',color:'#b07942',effect:'brain'},flavor:{title:'المنكهات',text:'النكهات الحلوة مش دليل على الأمان. بعضها قد يضر مجرى التنفس عند الاستنشاق، مثل الداياسيتيل.',icon:'fa-lungs',color:'#a95e78',effect:'lungs'},pg:{title:'البروبيلين غليكول',text:'مادة موجودة في بعض السوائل، وقد تسبب تهيج الحلق والمجاري التنفسية.',icon:'fa-droplet',color:'#668ca2',effect:'throat'},vg:{title:'الغليسرين',text:'يساهم في تكوين الرذاذ. وقد ينتج عن التسخين مواد ضارة.',icon:'fa-cloud',color:'#92869d',effect:'cloud'}},aerosol:{metals:{title:'معادن ثقيلة',text:'قد تنتقل معادن مثل النيكل والرصاص من أجزاء الجهاز إلى الرذاذ.',icon:'fa-atom',effect:'metal'},aldehyde:{title:'الفورمالديهايد',text:'قد يتكوّن أثناء تسخين بعض السوائل، وهو مادة ضارة ومسرطنة.',icon:'fa-triangle-exclamation',effect:'molecule'}},goals:{phone:{title:'هاتف',price:'2000',icon:'fa-mobile-screen'},bike:{title:'دراجة',price:'800',icon:'fa-bicycle'},laptop:{title:'حاسوب',price:'3000',icon:'fa-laptop'}},experience:{story:{title:'رحلة الإدمان',icon:'fa-brain'},mirror:{title:'مرآة آدم',icon:'fa-face-meh'},chat:{title:'القرار إلك',icon:'fa-comments'},doctor:{title:'استشر دكتور وعي يُداوي',icon:'fa-user-doctor'},recovery:{title:'جسمك من الداخل',icon:'fa-heart-pulse'}},design:{accent:'#982b2b',shape:'square',motion:true},removed:{}};
const groups=['nav','symptoms','tabs','materials','aerosol','goals','experience'];
function config(){let raw=getLocal(KEY,{});if(!raw||typeof raw!=='object'||Array.isArray(raw))raw={};const d=structuredClone(defaults);for(const g of groups){for(const [k,v] of Object.entries(raw[g]||{})){if(!['__proto__','constructor','prototype'].includes(k)&&/^[a-zA-Z0-9_-]{1,60}$/.test(k)&&v&&typeof v==='object'&&!Array.isArray(v))d[g][k]={...(d[g][k]||{}),...v};}}for(const g of ['mirror','lab','design','removed'])if(raw[g]&&typeof raw[g]==='object')for(const [k,v] of Object.entries(raw[g]))if(!['__proto__','constructor','prototype'].includes(k))d[g][k]=v;return d;}
function get(path,d=config()){return path.split('.').reduce((o,k)=>o?.[k],d);}
function assign(d,path,v){const a=path.split('.');if(a.some(k=>['__proto__','prototype','constructor'].includes(k)))return false;const key=a.pop(),o=a.reduce((x,k)=>x?.[k],d);if(!o||!Object.hasOwn(o,key))return false;o[key]=v;return true;}
function entries(g,d=config()){return Object.entries(d[g]||{}).filter(([k,x])=>!d.removed[`${g}.${k}`]&&x.visible!==false).sort((a,b)=>(Number(a[1].order)||0)-(Number(b[1].order)||0));}
function text(path,v,tag='span'){return `<${tag} data-wy8-text="${esc(path)}">${esc(v)}</${tag}>`;}
function img(src,alt,cls=''){src=safeURL(src);return src?`<img class="${cls}" src="${esc(src)}" alt="${esc(alt)}" loading="lazy" referrerpolicy="no-referrer">`:'';}
function ico(x){return img(x.iconMedia,x.title,'wy8-icon-img')||`<i class="fa-solid ${icon(x.icon)}" aria-hidden="true"></i>`;}
async function persist(d){if(!owner())return false;const ok=await saveLocalConfirmed(KEY,d);if(ok){refresh();showToast('تم حفظ التعديل وتأكيده سحابياً ✓');}else showToast('لم يؤكد الخادم الحفظ','error');return !!ok;}
let sym='anger',labTab='parts',material='',aero='',playing=false,goal='phone',daily=0,labTimer=0;
function adam(mood){const a=mood==='anger',s=mood==='sleep',t=mood==='stress',f=mood==='focus',h=mood==='headache';return `<svg viewBox="0 0 340 290" class="wy8-adam" role="img" aria-label="آدم، رسم توضيحي"><defs><linearGradient id="wy8shirt" x2="1" y2="1"><stop stop-color="#bb5558"/><stop offset="1" stop-color="#671c28"/></linearGradient><linearGradient id="wy8skin" x2="1" y2="1"><stop stop-color="#f1d4be"/><stop offset="1" stop-color="#d5a28a"/></linearGradient></defs><circle cx="170" cy="132" r="111" fill="#f4e6e6"/><circle cx="170" cy="132" r="97" stroke="#d9b3b3" stroke-dasharray="2 7" fill="none"/><ellipse cx="170" cy="270" rx="90" ry="9" fill="#c7b5b5" opacity=".35"/><path d="M143 164Q99 170 85 209L70 264Q170 286 270 264L255 209Q241 170 197 164Z" fill="url(#wy8shirt)"/><path d="M141 166Q170 198 199 166" stroke="#d89b9d" stroke-width="2" fill="#7b2935"/><path d="M151 145V166Q170 184 189 166V145" fill="url(#wy8skin)"/><ellipse cx="120" cy="114" rx="10" ry="14" fill="#dcb19b"/><ellipse cx="220" cy="114" rx="10" ry="14" fill="#dcb19b"/><path d="M119 77Q170 44 221 77L216 127Q211 153 170 167Q129 153 124 127Z" fill="url(#wy8skin)"/><path d="M119 104Q99 64 126 48Q150 28 187 39Q232 40 224 103L210 91L204 68Q163 95 132 72L130 100Z" fill="#252d3a"/><path d="M130 55Q165 37 204 57" fill="none" stroke="#4d5360" stroke-width="4" stroke-linecap="round"/><path d="${a?'M139 98L157 104 M183 104L201 98':t||h?'M139 102L157 94 M183 94L201 102':'M139 98Q148 94 157 98 M183 98Q192 94 201 98'}" stroke="#303542" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="${s?'M141 112Q149 116 157 112 M183 112Q191 116 199 112':'M149 111h.1 M191 111h.1'}" stroke="#303542" stroke-width="${s?2:6}" stroke-linecap="round"/><path d="M170 105L166 125L174 127" stroke="#b5806d" stroke-width="1.5" fill="none"/><path d="${a?'M156 141H184':'M156 145Q170 133 184 145'}" fill="none" stroke="#975e58" stroke-width="2.5" stroke-linecap="round"/><path d="M148 197L145 239M192 197L195 239" stroke="#f4cecb" stroke-width="2" stroke-linecap="round"/>${h||a?'<g stroke="#b34c4c" stroke-width="2" fill="none"><path d="M92 54L82 39M104 42L99 22M246 55L258 39"/></g>':s?'<g fill="#7b8294" font-size="19"><text x="238" y="65">Z</text><text x="260" y="40">Z</text></g>':f?'<g fill="#8c6d75" font-size="22"><text x="244" y="72">؟</text><text x="84" y="60">؟</text></g>':t?'<g stroke="#a65959" stroke-width="2" fill="none"><path d="M83 100Q71 83 83 65M253 100Q265 83 253 65"/></g>':'<circle class="wy8-pulse" cx="170" cy="114" r="61" fill="none" stroke="#b46a6a" stroke-dasharray="4 6"/>'}</svg>`;}
function mirror(){const root=$('wy8-mirror');if(!root)return;const d=config(),list=entries('symptoms',d);$('wy8-mirror-title').textContent=d.mirror.title;$('wy8-mirror-subtitle').textContent=d.mirror.subtitle;$('wy8-mirror-title').dataset.wy8Text='mirror.title';$('wy8-mirror-subtitle').dataset.wy8Text='mirror.subtitle';if(!list.length){root.textContent='لا توجد أعراض معروضة حالياً.';return;}if(!list.some(([k])=>k===sym))sym=list[0][0];const x=d.symptoms[sym];root.innerHTML=`<div class="wy8-mirror-scene"><div class="wy8-mirror-portrait">${img(x.media,x.title,'wy8-scene-image')||adam(x.mood)}</div><div class="wy8-orbit">${list.map(([k,v])=>`<button type="button" class="wy8-orbit-node ${k===sym?'active':''}" aria-pressed="${k===sym}" data-action="sym" data-key="${esc(k)}" style="--node-color:${hex(v.color,d.design.accent)}"><span class="wy8-symbol">${ico(v)}</span>${text(`symptoms.${k}.title`,v.title)}</button>`).join('')}</div></div><div class="wy8-speech"><b>آدم يحكي</b>${text(`symptoms.${sym}.speech`,x.speech,'p')}</div><div class="wy8-detail"><h4>${text(`symptoms.${sym}.title`,x.title)}</h4>${text(`symptoms.${sym}.text`,x.text,'p')}<hr><b><i class="fa-solid fa-stethoscope"></i> دكتور وعي ينصحك</b>${text(`symptoms.${sym}.tip`,x.tip,'p')}${sym==='craving'?'<button type="button" class="wy-v7-button ghost" data-action="breath">تمرين تنفس بسيط</button><div class="wy8-breathe" hidden><span></span><p>تنفّس ببطء وبراحة، دون إجبار نفسك.</p></div>':''}</div><p class="wy-v7-disclaimer">الأعراض بتختلف من شخص لآخر، وغالباً بتخف مع الوقت. إذا كانت شديدة أو مستمرة، اطلب مساعدة مختص.</p>`;}
function device(d){let x=d.materials[material],fill=labTab==='liquid'&&x?hex(x.color):'#c6a6ab';return `<svg viewBox="0 0 340 300" role="img" aria-label="رسم توضيحي لسيجارة إلكترونية" class="wy8-device"><defs><linearGradient id="wy8case"><stop stop-color="#17212b"/><stop offset=".16" stop-color="#495563"/><stop offset=".5" stop-color="#a5aeb6"/><stop offset=".63" stop-color="#44515f"/><stop offset="1" stop-color="#202a34"/></linearGradient><linearGradient id="wy8glass"><stop stop-color="#a3b6c6" stop-opacity=".55"/><stop offset=".48" stop-color="#fff" stop-opacity=".65"/><stop offset="1" stop-color="#8fa3b4" stop-opacity=".65"/></linearGradient><linearGradient id="wy8cell"><stop stop-color="#7c8994"/><stop offset=".42" stop-color="#edf1f4"/><stop offset="1" stop-color="#8b97a2"/></linearGradient><radialGradient id="wy8fire"><stop stop-color="#ffe1a1"/><stop offset=".4" stop-color="#de793d"/><stop offset="1" stop-color="#b92e2e" stop-opacity="0"/></radialGradient><clipPath id="wy8tank"><rect x="134" y="67" width="72" height="78" rx="9"/></clipPath></defs><ellipse cx="170" cy="280" rx="68" ry="9" fill="#a3aeb9" opacity=".25"/><g class="wy8-vape-body"><path d="M147 22Q147 13 158 12H182Q193 13 193 22L200 49H140Z" fill="#24303b"/><path d="M154 20H186" stroke="#697583" stroke-width="2" stroke-linecap="round"/><rect x="121" y="47" width="98" height="225" rx="24" fill="url(#wy8case)" stroke="#202a34"/><rect x="129" y="57" width="82" height="204" rx="18" fill="#e9edf0" stroke="#75828f"/><rect x="134" y="67" width="72" height="78" rx="9" fill="url(#wy8glass)" stroke="#8497a6"/><g clip-path="url(#wy8tank)"><path class="wy8-fill ${labTab==='liquid'&&x?'fill-active':''}" d="M133 96Q153 90 170 96T207 96V148H133Z" fill="${fill}" opacity="${labTab==='liquid'&&!x?0:.8}"/>${labTab==='liquid'&&x?`<path class="wy8-droplet" d="M170 15Q159 31 170 34Q181 31 170 15Z" fill="${fill}"/><g class="wy8-bubbles" fill="#fff">${[0,1,2,3,4].map(i=>`<circle cx="${143+i*13}" cy="${128-i%2*8}" r="${2+i%3}"/>`).join('')}</g>`:''}</g><rect x="165" y="64" width="10" height="95" rx="4" fill="#f7f9fb" opacity=".85"/><rect x="139" y="152" width="62" height="23" rx="5" fill="#9ca7b2"/><path class="wy8-coil" d="M145 157H195L145 163H195L145 169H195" fill="none" stroke="#6b7785" stroke-width="2.7"/><rect x="139" y="185" width="62" height="65" rx="8" fill="url(#wy8cell)" stroke="#7e8a95"/><rect class="wy8-cellhot" x="139" y="185" width="62" height="65" rx="8" fill="#d64a2d" opacity="0"/><path d="M173 193L157 220H170L164 240L186 211H173Z" fill="#fff"/><path d="M133 76V129M133 190V244" stroke="#fff" stroke-width="2" opacity=".75"/></g><g class="wy8-heat-halo" opacity="0"><circle cx="170" cy="215" r="93" fill="url(#wy8fire)"/></g><g class="wy8-radiate" opacity="0"><path d="M170 178L157 204L170 219L153 245L181 255" fill="none" stroke="#5d2930" stroke-width="4"/><path d="M170 162L155 194L119 171L139 207L103 217L145 228L132 259L161 247L170 276L184 247L207 259L196 230L236 217L201 207L221 171L184 194Z" fill="#dc8151" opacity=".45"/></g><g class="wy8-smoke" opacity="0" fill="#8a929c">${[0,1,2,3,4,5,6].map(i=>`<circle cx="${145+(i*23)%57}" cy="${34+(i*17)%70}" r="${12+i%3*7}" style="--i:${i}"/>`).join('')}</g><g class="wy8-battery-smoke" opacity="0" fill="#727881">${[0,1,2,3,4,5].map(i=>`<circle cx="${143+i*11}" cy="${174-(i*23)%94}" r="${20+i%3*7}" style="--i:${i}"/>`).join('')}</g>${labTab==='parts'?'<g font-size="11" fill="#475569"><path d="M207 101H269M139 162H67M201 216H268" fill="none" stroke="#9c7777" stroke-dasharray="3 3"/><text x="268" y="94" text-anchor="middle">السائل</text><text x="68" y="154" text-anchor="middle">التسخين</text><text x="267" y="208" text-anchor="middle">البطارية</text></g>':''}</svg>`;}
function effectVisual(x){const color=hex(x.color,'#982b2b');const shapes=x.effect==='brain'?'<path d="M39 12C19 0 8 18 13 29C1 39 10 57 25 54Q35 66 40 53Q50 66 58 54C73 58 80 37 67 29C72 12 52 2 40 12Z" fill="#dbaeb4" stroke="#9b5058"/><path d="M40 14V52M20 24L32 36L18 45M60 24L48 36L62 45" stroke="#fff" stroke-width="2" fill="none"/><circle class="wy8-pulse" cx="40" cy="35" r="8" fill="#982b2b"/>':x.effect==='lungs'?'<path d="M37 8V29L24 40M43 8V29L56 40" fill="none" stroke="#a65359" stroke-width="4"/><path d="M34 23C17 15 7 47 13 56Q22 65 34 55ZM46 23C63 15 73 47 67 56Q58 65 46 55Z" fill="#d89da3" stroke="#a65359"/><g fill="#982b2b"><circle class="wy8-pulse" cx="23" cy="45" r="4"/><circle class="wy8-pulse" cx="56" cy="43" r="4"/></g>':x.effect==='throat'?'<path d="M25 9Q54 6 52 29L61 39L50 43V66H32V45Q21 36 25 9Z" fill="#e2c6b6"/><path d="M51 39H40V63" stroke="#aa4141" stroke-width="5" fill="none" class="wy8-pulse"/>':'<g fill="'+color+'">'+[0,1,2,3,4,5,6,7].map(i=>`<circle class="wy8-pulse" cx="${14+i*23%54}" cy="${13+i*17%48}" r="${4+i%3*3}"/>`).join('')+'</g>';return img(x.media,x.title,'wy8-effect-img')||`<svg viewBox="0 0 80 72" class="wy8-effect-svg" aria-hidden="true">${shapes}</svg>`;}
function lab(){const root=$('wy8-lab');if(!root)return;const d=config(),list=entries('tabs',d);if(!list.some(([k])=>k===labTab))labTab=list[0]?.[0]||'';for(const [id,path] of [['wy8-lab-title','lab.title'],['wy8-lab-intro','lab.intro'],['wy8-lab-note','lab.note']]){const el=$(id);el.textContent=get(path,d);el.dataset.wy8Text=path;} $('wy8-lab-tabs').innerHTML=list.map(([k,v])=>`<button type="button" role="tab" aria-selected="${labTab===k}" class="wy-v7-tab ${labTab===k?'is-active':''}" data-action="lab" data-key="${esc(k)}">${ico(v)}${text('tabs.'+k+'.title',v.title)}</button>`).join('');const t=d.tabs[labTab];const stage=$('wy8-lab-stage');stage.className='wy8-lab-stage'+(playing?' is-playing '+(labTab==='battery'?'battery-run':'heat-run'):'');stage.innerHTML=img(t?.media,t?.title,'wy8-lab-media')||device(d);if(!t){$('wy8-lab-controls').textContent='لا توجد تبويبات معروضة.';return;}
let content=`<div class="wy8-detail">${text(`tabs.${labTab}.text`,t.text,'p')}</div>`;
if(labTab==='liquid'){const list=entries('materials',d);if(!list.some(([k])=>k===material))material='';content+=`<div class="wy8-shelf">${list.map(([k,v])=>`<button type="button" data-action="material" data-key="${esc(k)}" aria-pressed="${material===k}" class="${material===k?'active':''}">${img(v.iconMedia,v.title,'wy8-vial-img')||`<svg viewBox="0 0 40 53" aria-hidden="true"><rect x="12" y="3" width="16" height="10" rx="2" fill="#4d5562"/><rect x="7" y="13" width="26" height="37" rx="5" fill="${hex(v.color)}"/><rect x="9" y="25" width="22" height="16" rx="2" fill="#fff"/><path d="M13 30H27M13 35H23" stroke="#b6b9bd"/></svg>`}${text('materials.'+k+'.title',v.title)}</button>`).join('')}</div>`;if(material){const x=d.materials[material];content+=`<div class="wy8-detail wy8-effect">${effectVisual(x)}<div><h4>${text('materials.'+material+'.title',x.title)}</h4>${text('materials.'+material+'.text',x.text,'p')}</div></div>`;}}
if(labTab==='heat'||labTab==='battery'){content+=`<button type="button" class="wy-v7-button wy8-run" data-action="run">${playing?'إيقاف / إعادة العرض':labTab==='heat'?'شاهد التسخين':'شاهد خطر تلف البطارية'}</button>`;if(labTab==='heat'){content+=`<div class="wy8-aero">${entries('aerosol',d).map(([k,v])=>`<button class="wy-v7-step ${aero===k?'is-active':''}" type="button" data-action="aero" data-key="${esc(k)}">${ico(v)}${text('aerosol.'+k+'.title',v.title)}</button>`).join('')}</div>`;if(aero&&d.aerosol[aero]){const x=d.aerosol[aero];content+=`<div class="wy8-detail wy8-effect">${effectVisual(x)}<div>${text('aerosol.'+aero+'.text',x.text,'p')}</div></div>`;}}else if(playing)content+='<div class="wy8-warning" role="status">قد يحدث حريق أو تمزق. ابتعد عن أي جهاز يظهر عليه دخان أو تلف.</div>';}
$('wy8-lab-controls').innerHTML=content;}
function stopLab(){playing=false;clearTimeout(labTimer);$('wy8-lab-stage')?.classList.remove('is-playing','heat-run','battery-run');}
function calc(v=daily){daily=Math.max(0,Number(v)||0);const root=$('wy8-calc-goal');if(!root)return;const d=config(),list=entries('goals',d);if(!list.some(([k])=>k===goal))goal=list[0]?.[0];if(!root.querySelector('#wy8-price'))root.innerHTML='<label class="wy8-calc-label">سعر سيجارة واحدة (شيكل) <input id="wy8-price" type="number" min="0" step="0.1" inputmode="decimal" placeholder="سعر مخصص"></label><div id="wy8-goal-inner"></div>';$('wy8-goal-inner').innerHTML=`<div class="wy8-detail"><b>توفيرك المتوقع</b><div class="wy8-calc-nums"><span>يومياً <strong>${daily.toLocaleString()} ₪</strong></span><span>أسبوعياً <strong>${(daily*7).toLocaleString()} ₪</strong></span></div><h4>شو هدفك؟</h4><div class="wy8-aero">${list.map(([k,x])=>`<button type="button" class="wy-v7-step ${goal===k?'is-active':''}" data-action="goal" data-key="${esc(k)}">${ico(x)}${text('goals.'+k+'.title',x.title)}</button>`).join('')}</div>${goal?`<label class="wy8-calc-label">سعر الهدف (تقديري) <input type="number" id="wy8-goal-price" min="1" value="${Math.max(1,Number(d.goals[goal].price)||1)}"></label><p id="wy8-goal-result"></p><div class="wy8-progress"><span id="wy8-goal-bar"></span></div>`:''}</div>`;goalResult();}
function goalResult(){let p=Number($('wy8-goal-price')?.value)||0;if(!$('wy8-goal-result'))return;$('wy8-goal-result').textContent=daily>0&&p>0?`ممكن توصل لهدفك خلال حوالي ${Math.ceil(p/daily)} يوم إذا وفرت هذا المبلغ يومياً.`:'أدخل مصروفك وسعر هدفك.';$('wy8-goal-bar').style.width=(p>0?Math.min(100,daily*30/p*100):0)+'%';}
function navArt(k,v){if(v.icon!==nav[k]?.icon)return ico(v);const art={anatomy:'<path d="M29 10V27L18 40M35 10V27L46 40" stroke="#a95656" stroke-width="4" fill="none"/><path d="M27 21C16 14 5 39 9 49Q12 58 27 50ZM37 21C48 14 59 39 55 49Q52 58 37 50Z" fill="#cf9090" stroke="#a95656"/><path d="M27 29L17 42M37 29L47 42" stroke="#fff" stroke-width="2"/>',lab:'<g transform="rotate(17 32 32)"><rect x="21" y="7" width="22" height="50" rx="7" fill="#354152"/><rect x="24" y="3" width="16" height="12" rx="4" fill="#151d2d"/><rect x="25" y="19" width="14" height="15" rx="3" fill="#c7d1d9"/><path d="M25 27H39V34H25Z" fill="#c78686"/><rect x="25" y="38" width="14" height="15" rx="3" fill="#aebac8"/><path d="M33 39L28 46H33L30 52L37 44H32Z" fill="white"/></g>',sayno:'<circle cx="25" cy="24" r="12" fill="#ddb59d"/><path d="M13 23Q10 7 25 9Q40 7 37 23L31 16Q23 22 13 17" fill="#293243"/><path d="M8 57V47Q8 37 25 37Q42 37 42 47V57" fill="#982b2b"/><circle cx="21" cy="24" r="1.5"/><circle cx="29" cy="24" r="1.5"/><rect x="38" y="8" width="24" height="21" rx="6" fill="white" stroke="#c68c8c"/><path d="M44 14L55 24M55 14L44 24" stroke="#982b2b" stroke-width="2"/>',calc:'<rect x="10" y="9" width="30" height="46" rx="5" fill="#354152"/><rect x="15" y="15" width="20" height="11" rx="2" fill="#e5eaef"/><path d="M16 34H34M16 41H34M16 48H34" stroke="#a7b2c0" stroke-width="4"/><ellipse cx="48" cy="51" rx="11" ry="5" fill="#c6a36d"/><ellipse cx="48" cy="43" rx="11" ry="5" fill="#e7cca0"/><ellipse cx="48" cy="35" rx="11" ry="5" fill="#c6a36d"/>',research:'<rect x="12" y="8" width="35" height="47" rx="4" fill="#fff" stroke="#b1bbc8"/><path d="M18 48V36H23V48M27 48V26H32V48M36 48V18H41V48" stroke="#982b2b" stroke-width="3"/><circle cx="44" cy="43" r="10" fill="#fff" fill-opacity=".8" stroke="#64748b" stroke-width="3"/><path d="M51 51L60 60" stroke="#64748b" stroke-width="4"/>',literature:'<path d="M5 16Q19 10 32 20Q45 10 59 16V52Q45 46 32 56Q19 46 5 52Z" fill="#982b2b"/><path d="M9 12Q20 8 32 17Q44 8 55 12V46Q44 42 32 51Q20 42 9 46Z" fill="white" stroke="#cbd5e1"/><path d="M32 17V51M14 22L26 25M38 25L50 22M14 31L26 34M38 34L50 31" stroke="#b1bbc8" stroke-width="2"/>',community:'<rect x="5" y="9" width="54" height="38" rx="4" fill="#fff" stroke="#c6a36d" stroke-width="2"/><path d="M14 19H49M17 26H46M17 34H39" stroke="#a4aab3" stroke-width="2"/><path d="M36 42L34 60L43 54L51 60L49 42" fill="#982b2b"/><circle cx="43" cy="42" r="10" fill="#c6a36d"/>','team-field':'<circle cx="32" cy="15" r="9" fill="#ddb59d"/><path d="M16 52V40Q16 29 32 29Q48 29 48 40V52" fill="#982b2b"/><circle cx="10" cy="25" r="7" fill="#ddb59d"/><circle cx="54" cy="25" r="7" fill="#ddb59d"/><path d="M1 55V43Q1 35 10 35Q19 35 19 43V55M45 55V43Q45 35 54 35Q63 35 63 43V55" fill="#c99e9e"/>'};return art[k]?`<svg viewBox="0 0 64 64" width="29" height="29" aria-hidden="true">${art[k]}</svg>`:ico(v);}
function navRender(){const d=config();for(const [k,v] of Object.entries(d.nav)){const el=$('wy8-nav-'+k);if(!el)continue;const title=$('wy8-nav-title-'+k);if(title)title.textContent=v.title;el.classList.toggle('wy8-disabled-tab',v.visible===false);if(!el.classList.contains('wy8-wide'))el.style.order=Number(v.order)||0;const target=el.querySelector('[data-wy8-icon]');if(target){target.innerHTML=img(v.iconMedia||v.media,v.title,'wy8-icon-img')||navArt(k,v);target.classList.toggle('circle',v.shape==='circle'||(!v.shape&&d.design.shape==='circle'));target.style.color=hex(v.color,d.design.accent);} }const t=['story','mirror','chat','doctor'];t.forEach((k,i)=>{const b=$('wy-v7-tab-'+i),x=d.experience[k];if(!b||!x)return;const name=b.querySelector('span');if(name){name.textContent=x.title;name.dataset.wy8Text='experience.'+k+'.title';}const old=b.querySelector(':scope > i,:scope > img');if(old){const frag=document.createElement('template');frag.innerHTML=ico(x);old.replaceWith(frag.content);}b.classList.toggle('wy8-disabled-tab',x.visible===false);b.disabled=x.visible===false;b.style.order=Number(x.order)||0;});const selected=t.findIndex((_,i)=>$('wy-v7-tab-'+i)?.getAttribute('aria-selected')==='true');if(selected>=0&&$('wy-v7-tab-'+selected)?.disabled)window.waeiV7?.tab(selected);const rec=$('timelineHealingWidget');if(rec)rec.classList.toggle('wy8-disabled-tab',d.experience.recovery.visible===false);document.documentElement.style.setProperty('--wy8-accent',hex(d.design.accent));document.documentElement.classList.toggle('wy8-no-motion',d.design.motion===false);}
// SVG upload: reconstruct from an allowlist, no scripts, links, foreign objects or external references.
async function uploadMedia(file){if(!owner())throw Error('متاح للمالك فقط');if(!file||file.size>12*1024*1024)throw Error('الحد الأقصى 12MB');if(!['image/png','image/jpeg','image/webp','image/gif','image/svg+xml'].includes(file.type))throw Error('نوع الملف غير مسموح');if(file.type==='image/svg+xml'){const doc=new DOMParser().parseFromString(await file.text(),'image/svg+xml');if(doc.querySelector('parsererror')||doc.documentElement.localName!=='svg')throw Error('SVG غير صالح');const allowed=new Set('svg g path rect circle ellipse line polyline polygon text tspan defs linearGradient radialGradient stop clipPath title desc'.split(' ')),attrs=new Set('viewBox width height x y x1 x2 y1 y2 cx cy r rx ry d points transform fill stroke stroke-width stroke-linecap stroke-linejoin stroke-dasharray opacity fill-opacity stroke-opacity fill-rule clip-rule clip-path id offset stop-color stop-opacity gradientUnits gradientTransform font-size font-weight text-anchor dominant-baseline preserveAspectRatio'.split(' '));let count=0;const ns='http://www.w3.org/2000/svg';function clean(n){if(n.nodeType===3)return document.createTextNode(n.textContent.slice(0,3000));if(n.nodeType!==1||!allowed.has(n.localName))return null;if(++count>3000)throw Error('SVG معقد جداً');const e=document.createElementNS(ns,n.localName);for(const a of n.attributes){if(!attrs.has(a.name)||a.value.length>30000||/(?:javascript|data:|https?:|@import|expression)/i.test(a.value))continue;if(/url\(/i.test(a.value)&&!/^url\(#[A-Za-z0-9_-]+\)$/.test(a.value))continue;e.setAttribute(a.name,a.value);}for(const c of n.childNodes){const out=clean(c);if(out)e.append(out);}return e;}const cleaned=clean(doc.documentElement);cleaned.setAttribute('xmlns',ns);const safe=new File([new XMLSerializer().serializeToString(cleaned)],'illustration.svg',{type:'image/svg+xml'});return uploadToSupabaseStorage(safe,'interactive-v8/svg');}return uploadToSupabaseStorage(file,'interactive-v8/media');}
function formField(name,value,label,multi=false){return `<label class="wy-v7-editor-field"><span>${esc(label)}</span>${multi?`<textarea name="${name}" maxlength="1500">${esc(value)}</textarea>`:`<input name="${name}" value="${esc(value)}" maxlength="350">`}</label>`;}
let editRef='';
function edit(group,key=''){if(!owner()||!([...groups,'mirror','lab','design'].includes(group)))return;const d=config(),x=key?d[group]?.[key]:d[group];if(!x)return;editRef=key?group+'.'+key:group;const target=$('wy-v7-dialog-content');const fields=Object.entries(x).filter(([k,v])=>typeof v==='string'&&!['media','iconMedia','mood','effect','icon','color','accent','shape'].includes(k));target.innerHTML=`<h3>تخصيص ${esc(x.title||group)}</h3><form id="wy8-form"><div class="wy-v7-editor-grid">${fields.map(([k,v])=>formField(k,v,({title:'العنوان',subtitle:'النص التوضيحي',intro:'المقدمة',note:'ملاحظة',text:'الشرح',speech:'كلام آدم',tip:'النصيحة',price:'السعر الافتراضي'})[k]||k,['text','speech','tip','note','intro','subtitle'].includes(k))).join('')}${group==='design'?`<label>لون الهوية <input name="accent" type="color" value="${hex(x.accent)}"></label><label>شكل الأيقونة <select name="shape"><option value="square">مربع</option><option value="circle" ${x.shape==='circle'?'selected':''}>دائرة</option></select></label><label><input type="checkbox" name="motion" ${x.motion!==false?'checked':''}> المؤثرات الحركية</label>`:key?`<label class="wy-v7-editor-field"><span>اسم الأيقونة (Font Awesome)</span><input name="icon" value="${esc(icon(x.icon))}" placeholder="fa-brain"></label><label>اللون <input name="color" type="color" value="${hex(x.color,d.design.accent)}"></label><label>شكل الأيقونة <select name="shape"><option value="square">مربع</option><option value="circle" ${x.shape==='circle'?'selected':''}>دائرة</option></select></label><label>ترتيب العنصر <input name="order" type="number" value="${Number(x.order)||0}"></label><label><input name="visible" type="checkbox" ${x.visible!==false?'checked':''}> إظهار العنصر</label><label class="wy-v7-editor-field wide"><span>صورة / GIF / SVG للمشهد (أو رابط HTTPS)</span><input name="media" value="${esc(x.media||'')}" type="url"><input name="file" type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"></label><label class="wy-v7-editor-field wide"><span>صورة / GIF / SVG للأيقونة</span><input name="iconMedia" value="${esc(x.iconMedia||'')}" type="url"><input name="iconFile" type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"></label>`:''}</div><div class="wy-v7-editor-actions"><button type="submit">حفظ</button><button type="button" class="secondary" data-action="close">إلغاء</button></div></form>`;const f=$('wy8-form');f.addEventListener('submit',async e=>{e.preventDefault();if(!owner())return;const b=f.querySelector('[type=submit]');b.disabled=true;try{const latest=config(),obj=key?latest[group][key]:latest[group];for(const [k] of fields)obj[k]=String(f.elements[k].value).trim().slice(0,1500);if(group==='design'){obj.accent=hex(f.elements.accent.value);obj.shape=f.elements.shape.value==='circle'?'circle':'square';obj.motion=f.elements.motion.checked;}else if(key){obj.icon=icon(f.elements.icon.value);obj.color=hex(f.elements.color.value);obj.shape=f.elements.shape.value==='circle'?'circle':'square';obj.order=Number(f.elements.order.value)||0;obj.visible=f.elements.visible.checked;for(const [k,fn] of [['media','file'],['iconMedia','iconFile']]){const val=f.elements[k].value.trim();if(val&&!safeURL(val))throw Error('رابط HTTPS مطلوب');obj[k]=f.elements[fn].files[0]?await uploadMedia(f.elements[fn].files[0]):safeURL(val);}}if(await persist(latest))close();}catch(err){showToast('تعذر الحفظ: '+err.message,'error');}finally{b.disabled=false;}});$('wy-v7-dialog').hidden=false;f.querySelector('input,textarea,select')?.focus();}
function close(){$('wy-v7-dialog').hidden=true;}
async function toggle(group,k,remove=false){if(!owner()||!groups.includes(group))return;const d=config(),x=d[group][k];if(!x)return;if(remove){if(!confirm('إزالة العنصر من العرض؟ يمكن استعادة الإعدادات الأصلية.'))return;d.removed[group+'.'+k]=true;}else{x.visible=x.visible===false;}await persist(d);}
async function add(group){if(!owner()||!['symptoms','materials','aerosol','goals'].includes(group))return;const d=config(),k='item-'+(crypto.randomUUID?.()||Date.now());d[group][k]={title:'عنصر جديد',text:'شرح مختصر',icon:'fa-circle-info',visible:false,...(group==='symptoms'?{speech:'',tip:'',mood:'stress'}:group==='goals'?{price:'100'}:{effect:'cloud',color:'#982b2b'})};if(await persist(d))edit(group,k);}
function admin(){const root=$('wy8-admin');if(!root||!owner())return;const d=config();root.innerHTML=`<section class="wy8-admin-panel"><h3>تخصيص التجارب والواجهة</h3><button type="button" data-action="edit" data-group="design">الألوان والأيقونات والحركة</button><button type="button" data-action="edit" data-group="mirror">عناوين مرآة آدم</button><button type="button" data-action="edit" data-group="lab">عناوين المختبر</button>${groups.map(g=>`<details><summary>${({nav:'أيقونات الواجهة',symptoms:'مرآة آدم — الأعراض والوسائط',tabs:'تبويبات المختبر',materials:'مواد السائل',aerosol:'مواد الرذاذ',goals:'أهداف التوفير',experience:'عناوين وأيقونات التجارب'})[g]}</summary>${['symptoms','materials','aerosol','goals'].includes(g)?`<button type="button" data-action="add" data-group="${g}">+ إضافة عنصر</button>`:''}${Object.entries(d[g]).map(([k,x])=>`<div class="wy-v7-admin-item"><span>${esc(x.title)} ${d.removed[g+'.'+k]?'(محذوف)':x.visible===false?'(مخفي)':''}</span><div><button type="button" data-action="edit" data-group="${g}" data-key="${esc(k)}">تعديل / وسائط</button>${['symptoms','materials','aerosol','goals'].includes(g)?`<button type="button" data-action="toggle" data-group="${g}" data-key="${esc(k)}">إظهار / إخفاء</button><button type="button" data-action="delete" data-group="${g}" data-key="${esc(k)}">حذف</button>`:''}</div></div>`).join('')}</details>`).join('')}<button type="button" data-action="restore">استعادة إعدادات V8 الافتراضية</button></section>`;}
function freeCMS(){const root=$('wy8-free-cms');if(!root||!owner())return;const vals=getLocal(KEY_INLINE_TEXT_EDITS,{});root.innerHTML=`<details class="wy8-admin-panel"><summary>التعديلات المباشرة المحفوظة</summary>${Object.entries(vals||{}).map(([k,v],i)=>`<div class="wy8-free-row"><small>${esc(k)}</small><textarea data-free-key="${esc(k)}">${esc(v)}</textarea><button type="button" data-action="free-save" data-key="${esc(k)}">حفظ</button><button type="button" data-action="free-remove" data-key="${esc(k)}">استعادة</button></div>`).join('')||'<p>لا توجد تعديلات مباشرة محفوظة.</p>'}<p>حقول التجارب الجديدة تُحفظ في نفس إعدادات التجربة وتظهر في تبويب تخصيص التجارب، دون نسخ مكررة.</p></details>`;}
const universal={topAnnouncementText:'topAnnounce',topTargetText:'topTarget',topFacultyText:'topFaculty',headerMainTitle:'headerMain',headerSubTitle:'headerSub',heroHeadline:'heroHeadline',heroSubtitle:'heroSubtitle'};
async function saveUniversal(el,value){if(!owner()||!universal[el.id])return false;const d=getLocal(KEY_UNIVERSAL_TEXTS,{});d[universal[el.id]]=value;if(await saveLocalConfirmed(KEY_UNIVERSAL_TEXTS,d)){applyUniversalTexts();loadUniversalTextsCMS();}return true;}
function coreEdit(el,event){if(!owner()||!window.inlineTextEditMode)return false;event.preventDefault();event.stopImmediatePropagation();const [g,k,f]=el.dataset.wyCore.split(':');let key,d,row,render;switch(g){case'myth':key=KEY_MYTH_DATA;d=structuredClone(getLocal(key,defaultMythData));row=d[k];render=()=>{switchMythBusterTab(k);loadMythDataIntoModal(k);};break;case'organ':key=KEY_ORGANS;d=structuredClone(getLocal(key,defaultOrgans));row=d.find(o=>String(o.id)===k);render=()=>{selectAnatomyOrgan(k);renderAdminOrgansManagementList();};break;case'toxin':key=KEY_TOXINS;d=structuredClone(getLocal(key,defaultToxins));row=d[Number(k)];render=()=>{renderToxinsCards();renderAdminToxinsList();};break;case'research':key=KEY_RESEARCH;d=structuredClone(getLocal(key,defaultResearch));row=d[Number(k)];render=()=>{renderResearchCards();renderAdminResearchList();};break;case'lit':key=KEY_WY_LITERATURE;d=structuredClone(getLocal(key,{title:'أدبيات',description:'كتابات وأعمال ومساهمات نعتزّ فيها.',theme:'navy',items:[]}));row=d;render=()=>{window.waeiV7.renderLiterature();window.waeiV7.admin();};break;case'faq':key=KEY_PUBLIC_FAQ;d=structuredClone(getLocal(key,defaultFaqList));row=d.find(x=>String(x.id)===k);render=()=>{renderPublicFaq();renderAdminFaqPublishedList();};break;case'faqsettings':key=KEY_FAQ_SETTINGS;d=getFaqSettings();row=d;render=()=>{renderPublicFaq();loadFaqSettingsIntoAdmin();};break;case'stats':key=KEY_STATS;d=getLocal(key,{header:'إنجازات وأرقام حملة «وعي يداوي»',items:defaultStatsItems});row=k==='header'?d:d.items[Number(k)];render=()=>{renderClientStatsGrid();renderStatsEditorRows(d.items);};break;default:return true;}if(!row||!Object.hasOwn(row,f))return true;const v=prompt('تعديل النص الظاهر للزوار:',String(row[f]??''));if(v!==null){row[f]=v.slice(0,1500);saveLocalConfirmed(key,d).then(ok=>{if(ok){render();showToast('تم تحديث النص ولوحة التحكم');}});}return true;}
function inlineEdit(el,event){if(!owner()||!window.inlineTextEditMode)return false;event.preventDefault();event.stopImmediatePropagation();const path=el.dataset.wy8Text||el.dataset.wy7Text;const old=el.dataset.wy7Text?window.waeiV7.readText(path):get(path);const value=prompt('تعديل النص الظاهر للزوار:',String(old??''));if(value!==null){if(el.dataset.wy7Text)window.waeiV7.writeText(path,value);else{const d=config();if(assign(d,path,String(value).slice(0,1500)))persist(d);}}return true;}
function refresh(){navRender();mirror();stopLab();lab();calc(daily);admin();freeCMS();}
function install(){refresh();document.addEventListener('click',async e=>{const b=e.target.closest('[data-action]');if(!b||!b.closest('#wy8-mirror,#wy8-lab,#wy8-calc-goal,#wy8-admin,#wy-v7-dialog,#wy8-free-cms'))return;const {action:a,key:k,group:g}=b.dataset;if(a==='sym'){sym=k;mirror();}else if(a==='lab'){stopLab();labTab=k;material='';aero='';lab();}else if(a==='material'){material=k;lab();}else if(a==='aero'){aero=k;lab();}else if(a==='run'){if(playing){stopLab();lab();}else{playing=true;lab();}}else if(a==='goal'){goal=k;calc();}else if(a==='breath'){const panel=b.parentElement.querySelector('.wy8-breathe');panel.hidden=!panel.hidden;}else if(a==='edit')edit(g,k);else if(a==='close')close();else if(a==='add')await add(g);else if(a==='toggle'||a==='delete')await toggle(g,k,a==='delete');else if(a==='restore'&&owner()&&confirm('استعادة إعدادات V8 الافتراضية؟ بيانات الأقسام الأصلية لن تتغير.'))await persist(structuredClone(defaults));else if((a==='free-save'||a==='free-remove')&&owner()){const vals=getLocal(KEY_INLINE_TEXT_EDITS,{});if(a==='free-remove')delete vals[k];else vals[k]=b.parentElement.querySelector('textarea').value;if(await saveLocalConfirmed(KEY_INLINE_TEXT_EDITS,vals)){applyInlineTextEdits();freeCMS();if(a==='free-remove')showToast('تم الحفظ؛ أعد تحميل الصفحة لرؤية النص الأصلي.');}}});document.addEventListener('input',e=>{if(e.target.id==='wy8-price'){const n=Number(e.target.value);if(e.target.value!==''&&Number.isFinite(n)&&n>=0){currentPricePerCig=n;document.querySelectorAll('.calc-price-btn').forEach(b=>b.classList.remove('active'));window.updateFinancialCalc();}}if(e.target.id==='wy8-goal-price')goalResult();});const original=window.switchMainScreen;window.switchMainScreen=function(id,...a){stopLab();const r=original.call(this,id,...a);if(id==='screen-lab')lab();if(id==='screen-calc')window.updateFinancialCalc();return r;};const oldAdmin=window.switchAdminTab;window.switchAdminTab=function(id,...a){const r=oldAdmin.call(this,id,...a);if(id==='wyV7CMS')admin();if(id==='textEditorCMS')freeCMS();return r;};const oldUI=window.applyActiveAdminUI;window.applyActiveAdminUI=function(...a){const r=oldUI.apply(this,a);if(!owner()){close();window.inlineTextEditMode=false;document.body.classList.remove('inline-text-edit-mode');}refresh();return r;};const observer=new MutationObserver(()=>{const modal=document.querySelector('#adminMasterModal:not(.hidden),.wy-community-overlay:not([hidden]),#wy-v7-dialog:not([hidden])');$('floatingPoweredByLink')?.classList.toggle('wy8-modal-open',!!modal);});observer.observe(document.body,{subtree:true,attributes:true,attributeFilter:['hidden','class']});}
window.waeiV8=Object.freeze({refresh,mirror,calc,uploadMedia,inlineEdit,coreEdit,saveUniversal,freeCMS,admin});if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
