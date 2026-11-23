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
