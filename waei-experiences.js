/* Interactive educational experiences. Preserves original CMS, routes, IDs and timeline CRUD. */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const SCENES_KEY='wa3y_interactive_scenes_v1';
const A='./assets/';
const defaults={
 nicotine:{brain:A+'brain.webp',character:A+'nicotine.webp',stages:[
  {title:'النيكوتين يصل بسرعة',line:'بعد استنشاق الدخان، يصل النيكوتين إلى الدماغ خلال ثوانٍ.'},
  {title:'الدماغ يعتاد عليه',line:'مع تكرار التدخين، قد يعتمد الدماغ على النيكوتين.'},
  {title:'تعود الرغبة ثم تخفّ',line:'عند انخفاض النيكوتين قد تشعر بالرغبة مجددًا، لكنها تخف مع الوقت.'}
 ]},
 withdrawal:{images:[A+'student-sad.webp',A+'student-sad.webp',A+'student-sad.webp',A+'student.webp'],items:[
  {label:'الرغبة في التدخين',line:'قد تشعر برغبة قوية في التدخين، لكنها تخف مع الوقت.'},
  {label:'الصداع',line:'قد تشعر بصداع مؤقت بينما يعتاد الجسم غياب النيكوتين.'},
  {label:'العصبية',line:'قد تنزعج بسرعة لبعض الوقت. جرّب التنفس ببطء.'},
  {label:'التوتر',line:'قد تشعر بالتوتر. الحديث مع شخص تثق به يساعدك.'}
 ]},
 bravery:{images:{idle:A+'student.webp',good:A+'student-brave.webp',bad:A+'student-sad.webp',walk:A+'student-walk.webp'},stages:[
  {prompt:'زميلك يقول: «جرّب سيجارة واحدة فقط!»',right:'لا، شكرًا. أنا لا أدخّن.',wrong:'حسنًا، سأجرّب حتى لا أغضبك.',hint:'الرفض الواضح يحمي قرارك.'},
  {prompt:'زميلك يصرّ: «لماذا لا تريد أن تجرّب؟»',right:'ما رأيك أن نلعب كرة القدم؟',wrong:'سأستمر في الجدال معه.',hint:'تغيير الموضوع يخفف الضغط.'},
  {prompt:'زميلك لا يتوقف عن الضغط عليك.',right:'سأذهب الآن، أراكم لاحقًا.',wrong:'سأوافق حتى لا يسخروا مني.',hint:'يمكنك الابتعاد بهدوء وطلب المساعدة.'}
 ]}
};
function clone(x){return JSON.parse(JSON.stringify(x));}
function data(){let raw={};try{raw=getLocal(SCENES_KEY,{})||{};}catch(_){}; const result=clone(defaults);for(const type of ['nicotine','withdrawal','bravery']){if(raw[type]&&typeof raw[type]==='object'){
  if(type==='bravery'){if(raw[type].images)Object.assign(result[type].images,raw[type].images);}
  else if(type==='nicotine'){for(const key of ['brain','character'])if(typeof raw[type][key]==='string')result[type][key]=raw[type][key];}
  else if(Array.isArray(raw[type].images))result[type].images=raw[type].images.map((x,i)=>typeof x==='string'?x:result[type].images[i]);
  const name=type==='withdrawal'?'items':'stages';if(Array.isArray(raw[type][name])&&raw[type][name].length)result[type][name]=raw[type][name].map((row,i)=>({...((defaults[type][name]||[])[i]||{}),...row}));
 }}return result;}
function safeImage(url){if(typeof url!=='string')return '';const u=url.trim();if(u.startsWith('./assets/')&&/^[.\w/\-]+$/.test(u))return u;try{const p=new URL(u,location.href);return ['http:','https:'].includes(p.protocol)?p.href:'';}catch{return '';}}
function image(el,url,backup){if(el){const src=safeImage(url)||backup;if(src.startsWith('./assets/'))el.dataset.waeiArt=src.slice(9).replace(/\.webp$/,'');else delete el.dataset.waeiArt;const resolved=window.waeiV7?.resolveAsset(src)||src;if(resolved&&el.getAttribute('src')!==resolved)el.setAttribute('src',resolved);}}
const motion=el=>{if(!el)return;el.classList.remove('wy-jump','wy-boing','wy-jar-hop');void el.offsetWidth;const name=el.id==='wy-jar-scene'?'wy-jar-hop':el.id==='wy-nic-stage'?'wy-jump':'wy-boing';el.classList.add(name);setTimeout(()=>el.classList.remove(name),850);};
let nicotineIndex=0,withdrawalIndex=0,braveryIndex=0,braveryResult='idle';
function renderNicotine(){const root=$('wy-nicotine-journey');if(!root)return;const d=data().nicotine;nicotineIndex=Math.min(nicotineIndex,Math.max(0,d.stages.length-1));const scene=$('wy-nic-stage'),step=d.stages[nicotineIndex];if(!step)return;
 scene.dataset.step=String(Math.min(2,nicotineIndex));$('wy-nic-step-label').textContent=`${nicotineIndex+1} / ${d.stages.length}`;
 $('wy-nic-title').textContent=step.title;$('wy-nic-line').textContent=step.line;
 image(root.querySelector('.wy-nic-brain img'),d.brain,A+'brain.webp');image(root.querySelector('.wy-nic-character img'),d.character,A+'nicotine.webp');
 root.querySelectorAll('.wy-nic-marker span').forEach((el,i)=>el.classList.toggle('active',i===nicotineIndex));}
function nicotineNext(){const d=data().nicotine;nicotineIndex=(nicotineIndex+1)%Math.min(3,d.stages.length);renderNicotine();motion($('wy-nic-stage'));}
function renderWithdrawal(){const root=$('wy-withdrawal-card');if(!root)return;const d=data().withdrawal;withdrawalIndex=Math.min(withdrawalIndex,Math.max(0,d.items.length-1));const options=$('wy-withdrawal-options');if(!options)return;options.replaceChildren();
 d.items.forEach((item,i)=>{const b=document.createElement('button');b.type='button';b.textContent=item.label;b.setAttribute('aria-pressed',String(i===withdrawalIndex));b.onclick=()=>{withdrawalIndex=i;renderWithdrawal();motion($('wy-withdrawal-visual'));};options.append(b);});
 const item=d.items[withdrawalIndex];$('wy-withdrawal-line').textContent=item?.line||'';$('wy-withdrawal-visual').dataset.symptom=String(withdrawalIndex);image($('wy-withdrawal-student'),d.images[withdrawalIndex],A+'student-sad.webp');
 const symbols=['✧','✳','⚡','〰'];const star=root.querySelector('.wy-withdrawal-spark');if(star)star.textContent=symbols[withdrawalIndex]||'✦';}
function renderBravery(){const root=$('wy-bravery-game');if(!root)return;const d=data().bravery;const rounds=d.stages; if(!rounds.length)return;braveryIndex=Math.min(braveryIndex,rounds.length-1);const sc=rounds[braveryIndex];const stage=$('wy-bravery-scene');stage.dataset.result=braveryResult;
 image($('wy-bravery-img'),braveryResult==='bad'?d.images.bad:(braveryResult==='good'?(braveryIndex===rounds.length-1?d.images.walk:d.images.good):d.images.idle),A+'student.webp');
 image(stage.querySelector('.wy-bravery-friend img'),d.images.idle,A+'student.webp');
 $('wy-bravery-prompt').textContent=sc.prompt;
 const target=$('wy-bravery-choices');target.replaceChildren();[['right',true],['wrong',false]].forEach(([key,good])=>{const b=document.createElement('button');b.type='button';b.textContent=sc[key];b.disabled=braveryResult!=='idle';b.onclick=()=>braveryChoose(good);target.appendChild(b);});
 const f=$('wy-bravery-feedback');f.className='wy-bravery-feedback '+(braveryResult==='good'?'good':braveryResult==='bad'?'bad':'');f.textContent=braveryResult==='good'?'✨ أحسنت! '+sc.hint:braveryResult==='bad'?'🫧 جرّب مرة أخرى. '+sc.hint:'';
 $('wy-bravery-next').classList.toggle('hidden',braveryResult!=='good');$('wy-bravery-retry').classList.toggle('hidden',braveryResult!=='bad');
 $('wy-bravery-next').textContent=braveryIndex===rounds.length-1?'أعد التحدّي ↻':'الموقف التالي ←';$('wy-bravery-counter').textContent=`الموقف ${braveryIndex+1} من ${rounds.length}`;
}
function braveryChoose(good){if(braveryResult!=='idle')return;braveryResult=good?'good':'bad';renderBravery();const stage=$('wy-bravery-scene');const anim=stage.querySelector('.wy-bravery-player');if(anim){anim.style.animation='none';void anim.offsetWidth;anim.style.animation='';} // replay state animation on choice
}
function braveryRetry(){braveryResult='idle';renderBravery();}
function braveryNext(){braveryIndex=(braveryIndex+1)%Math.max(1,data().bravery.stages.length);braveryResult='idle';renderBravery();}
const fallbackHeal={
 'hm-20m':{organ:'القلب',title:'قلبك يبدأ يرتاح',impact:'يبدأ معدل نبض القلب وضغط الدم بالانخفاض نحو المستوى الطبيعي.',hint:'بداية صغيرة، لكنها مهمة.',img:'heart.webp'},
 'hm-8h':{organ:'الأكسجين',title:'أكسجين أكثر لجسمك',impact:'يقل أول أكسيد الكربون في الدم، ويبدأ مستوى الأكسجين بالتحسن.',hint:'كل ساعة بعيدًا عن الدخان تفيد جسمك.',img:'oxygen.webp'},
 'hm-48h':{organ:'الشم والتذوق',title:'الحواس تستيقظ',impact:'قد تبدأ حاستا الشم والتذوق بالتحسن تدريجيًا.',hint:'قد تشعر بالروائح والنكهات بوضوح أكبر.',img:'student.webp'},
 'hm-3m':{organ:'الرئتان',title:'التنفس يصبح أسهل',impact:'قد تتحسن الدورة الدموية والتنفس تدريجيًا خلال الأسابيع والأشهر الأولى.',hint:'التحسن يختلف من شخص إلى آخر.',img:'lungs.webp'},
 'hm-1y':{organ:'القلب',title:'قلبك أكثر حماية',impact:'تنخفض مخاطر أمراض القلب مقارنة بالاستمرار في التدخين.',hint:'الاستمرار دون تدخين يصنع فرقًا.',img:'heart.webp'},
 'hm-10y':{organ:'الصحة على المدى الطويل',title:'فوائد تستمر لسنوات',impact:'ينخفض خطر الوفاة بسرطان الرئة مقارنة بالاستمرار في التدخين.',hint:'الابتعاد عن التدخين يحمي صحتك مع الوقت.',img:'brain.webp'}
};
const originalHealingBaseline={"hm-20m":{"organ":"القلب والأوعية الدموية الطرفية","title":"استقرار الدورة الدموية وهبوط النبض المتسارع","impact":"ينخفض معدل ضربات القلب المتسارع وضغط الدم الشرياني نحو مستوياتهما الطبيعية، وتعود حرارة اليدين والقدمين لمعدلها بعد زوال التضيق الوعائي الفوري.","labMarker":"انخفاض النورأدرينالين والنيكوتين الحر في البلازما بمعدل 50%.","mediaUrl":"https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80"},"hm-8h":{"organ":"الهيموغلوبين ومجرى الدم","title":"طرد أول أكسيد الكربون الخانق وتشبع الأكسجين","impact":"ينخفض غاز أول أكسيد الكربون السام في الدم بمقدار النصف، مما يتيح لكريات الدم الحمراء التقاط الأكسجين ونقله بكفاءة عالية للدماغ والأنسجة.","labMarker":"هبوط كربوكسي هيموغلوبين (CO-Hb) في الدم إلى أقل من 2% وعودة الأكسجين لـ 98%.","mediaUrl":"https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80"},"hm-48h":{"organ":"النهايات العصبية والحواس","title":"انبعاث حاسة الشم والتذوق وزوال النيكوتين","impact":"يفرغ الجسم تماماً من النيكوتين المشتق من التدخين، وتبدأ النهايات العصبية المتضررة في اللسان والأنف بالنمو والتعافي لتعود الحواس لطبيعتها.","labMarker":"انعدام النيكوتين الحر من البول ومستقلب الكوتينين، وتحسن سرعة التوصيل الحسي.","mediaUrl":"https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80"},"hm-3m":{"organ":"الرئتان والشعب الهوائية","title":"تجدد الأهداب التنفسية وتراجع السعال والبلغم","impact":"تنمو أهداب الرئة المجهرية (Cilia) لتتولى تنظيف الرئتين بفاعلية، ويزول السعال الصباحي وضيق النفس، وتتحسن وظائف الرئة السريرية بنسبة 10-15%.","labMarker":"ارتفاع حجم الزفير القسري في الثانية الأولى (FEV1) بمعدل سريري ملحوظ.","mediaUrl":"https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80"},"hm-1y":{"organ":"الشرايين التاجية وعضلة القلب","title":"هبوط خطر النوبات القلبية بمقدار النصف","impact":"ينخفض خطر الإصابة بأمراض الشرايين التاجية والجلطات القلبية المفاجئة بنسبة 50% مقارنة بالمدخن المستمر، مع استعادة مرونة بطانة الشرايين.","labMarker":"انخفاض مؤشرات الالتهاب الوعائي المزمن الحساسة (hs-CRP) إلى النطاق الطبيعي.","mediaUrl":"https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80"},"hm-10y":{"organ":"الخلايا الجينية والحويصلات","title":"تراجع خطر سرطان الرئة واستبدال الخلايا المتضررة","impact":"يهبط خطر الوفاة بسرطان الرئة إلى نصف معدل المدخن، وتستبدل الخلايا السابقة للتسرطن بخلايا سليمة، وتتعافى بطانة القصبات تماماً.","labMarker":"انحسار الطفرات الطارئة وإصلاح أخطاء الـ DNA واستقرار مسار تثبيط الأورام (p53).","mediaUrl":"https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80"}};
let originalTimelineRender=null;
function renderTimeline(){if(!$('timelineHealingWidget'))return;try{originalTimelineRender?.();}catch(e){console.warn('timeline legacy render:',e);} // retain existing owner edit/upload controls
 const list=getLocal('wa3y_timeline_healing_v1',typeof defaultHealingMilestones!=='undefined'?defaultHealingMilestones:[]);const bar=$('healingMilestonesBar');if(!bar)return;if(!Array.isArray(list)||!list.length){bar.textContent='لا توجد مراحل للتعافي حاليًا.';return;}
 activeMilestoneIndex=Math.max(0,Math.min(activeMilestoneIndex,list.length-1));const m=list[activeMilestoneIndex],simple=fallbackHeal[m.id],legacy=originalHealingBaseline[m.id]||{};
 // Each field stays editable independently. An old technical default receives the shorter V7 wording.
 const text=(field,fallback)=>{const value=String(m[field]||'').trim();return !value||value===legacy[field]?fallback:value;};
 const show=simple?{time:m.timeLabel,organ:text('organ',simple.organ),title:text('title',simple.title),impact:text('impact',simple.impact),hint:text('labMarker',simple.hint)}:{time:m.timeLabel,organ:m.organ,title:m.title,impact:m.impact,hint:m.labMarker};
 $('milestoneTimeBadge').textContent=show.time||'';$('milestoneTargetOrgan').textContent=show.organ||'';$('milestoneTitle').textContent=show.title||'';$('milestoneClinicalImpact').textContent=show.impact||'';$('milestoneLabMarker').textContent=show.hint||'';
 let art=(m.mediaUrl||'');if(simple&&(!art||art===legacy.mediaUrl))art=A+simple.img;
 if(m.mediaType==='video'&&typeof extractYouTubeId==='function'&&extractYouTubeId(art)){$('wy-heal-character').classList.add('hidden');$('timelineMediaVideoBox').classList.remove('hidden');}
 else {$('timelineMediaVideoBox').classList.add('hidden');$('wy-heal-character').classList.remove('hidden');image($('timelineMediaImg'),art,simple?A+simple.img:A+'heart.webp');$('milestoneMediaLabel').textContent=m.mediaType==='gif'?'صورة متحركة':'المس الشخصية';}
 bar.replaceChildren();list.forEach((item,i)=>{const b=document.createElement('button');b.type='button';b.textContent=item.timeLabel||`المرحلة ${i+1}`;b.setAttribute('aria-current',i===activeMilestoneIndex?'step':'false');b.onclick=()=>{activeMilestoneIndex=i;renderTimeline();motion($('timelineMediaFrame'));};bar.appendChild(b);});
 const prev=$('wy-heal-prev'),next=$('wy-heal-next');prev.disabled=activeMilestoneIndex===0;next.innerHTML=activeMilestoneIndex===list.length-1?'أعد الرحلة ↻':'اكتشف التالي <i class="fa-solid fa-arrow-left"></i>';
 // Owner can also change the order of existing milestones; uses existing cloud key and validation.
 if(window.currentUserRole==='owner'){const owner=$('timelineOwnerControlsContainer');if(owner&&!owner.querySelector('.wy-heal-order')){const wrap=document.createElement('div');wrap.className='wy-heal-order flex gap-1';wrap.innerHTML='<button type="button" class="px-3 py-1.5 rounded-lg bg-white border border-emerald-200 font-bold text-xs" onclick="waeiExperiences.moveHeal(-1)">↑ ترتيب</button><button type="button" class="px-3 py-1.5 rounded-lg bg-white border border-emerald-200 font-bold text-xs" onclick="waeiExperiences.moveHeal(1)">↓ ترتيب</button>';owner.append(wrap);}}
}
function healNext(){const list=getLocal('wa3y_timeline_healing_v1',defaultHealingMilestones);if(!list.length)return;activeMilestoneIndex=(activeMilestoneIndex+1)%list.length;renderTimeline();motion($('timelineMediaFrame'));}
function healPrev(){if(activeMilestoneIndex<=0)return;activeMilestoneIndex--;renderTimeline();motion($('timelineMediaFrame'));}
function healAnimate(){motion($('timelineMediaFrame'));}
async function moveHeal(dx){if(window.currentUserRole!=='owner')return;const list=clone(getLocal('wa3y_timeline_healing_v1',defaultHealingMilestones)),j=activeMilestoneIndex+dx;if(j<0||j>=list.length)return;[list[activeMilestoneIndex],list[j]]=[list[j],list[activeMilestoneIndex]];const ok=await saveLocalConfirmed('wa3y_timeline_healing_v1',list);if(ok){activeMilestoneIndex=j;renderTimeline();}else notice('تعذر تأكيد الترتيب على السحابة',true);}
let period=30,selectedGoal='books';let previousJarRatio=-1;const format=n=>new Intl.NumberFormat('en-US',{maximumFractionDigits:2}).format(n);
function calcPeriod(n){period=[7,30,365].includes(+n)?+n:30;document.querySelectorAll('.wy-calc-period button').forEach(b=>{b.classList.toggle('active',+b.dataset.period===period);b.setAttribute('aria-pressed',String(+b.dataset.period===period));});window.updateFinancialCalc();}
function setGoal(name){selectedGoal=['books','headphones','bike'].includes(name)?name:'books';document.querySelectorAll('#wy-calc-goals button').forEach(b=>{b.classList.toggle('active',b.dataset.goal===selectedGoal);b.setAttribute('aria-pressed',String(b.dataset.goal===selectedGoal));});window.updateFinancialCalc();}
function setCalcPrice(n){const input=$('wy-calc-price');if(input)input.value=String(n);window.updateFinancialCalc();}
function updateCalc(){const slider=$('calcCigsSlider'),input=$('wy-calc-price');if(!slider||!input)return;const cigs=Math.max(0,Math.min(40,Number(slider.value)||0)),price=Math.max(0,Math.min(1000,Number(input.value)||0));$('calcCigsCountLabel').textContent=`${cigs} سيجارة`;
 document.querySelectorAll('.calc-price-btn').forEach(b=>{const isCurrent=+b.dataset.price===price;b.classList.toggle('active',isCurrent);b.setAttribute('aria-pressed',String(isCurrent));});
 const perDay=cigs*price,total=perDay*period,month=perDay*30,year=perDay*365;
 $('calcMonthlyWaste').textContent=format(month)+' ₪';$('calcYearlyWaste').textContent=format(year)+' ₪';$('wy-calc-total').textContent=format(total)+' ₪';$('wy-calc-period-label').textContent=`خلال ${period===7?'7 أيام':period===30?'30 يومًا':'365 يومًا'}`;
 const target=Math.max(1,Math.min(1000000,Number($('wy-calc-target').value)||500)),ratio=Math.min(1,total/target);
 $('wy-calc-goal-fill').style.width=(ratio*100).toFixed(1)+'%';$('wy-calc-goal-note').textContent=total===0?'ابدأ باختيار عدد السجائر وسعرها.':ratio>=1?'⭐ المبلغ يكفي لهدفك الذي حددته!':`أنت عند ${Math.round(ratio*100)}٪ من هدف الادخار.`;
 const count=Math.round(ratio*17);const box=$('wy-jar-coins');if(box&&box.children.length!==count){box.replaceChildren();for(let i=0;i<count;i++){const coin=document.createElement('img');coin.className='wy-jar-coin';coin.alt='';coin.dataset.waeiArt='coin';coin.src=window.waeiV7?.resolveAsset('./assets/coin.webp')||'./assets/coin.webp';coin.style.animationDelay=Math.min(i,12)*.028+'s';box.appendChild(coin);}}
 if(previousJarRatio>=0&&Math.abs(ratio-previousJarRatio)>.04)motion($('wy-jar-scene'));previousJarRatio=ratio;
}
const owner=()=>window.currentUserRole==='owner';
function notice(msg,bad=false){if(typeof showToast==='function')showToast(msg,bad?'error':'success');else alert(msg);}
let editingType='';
function pathSet(obj,path,value){const parts=path.split('.');let t=obj;for(let i=0;i<parts.length-1;i++){t=t[parts[i]];}t[parts[parts.length-1]]=value;}
function openEditor(type){if(!owner())return; if(!['nicotine','withdrawal','bravery'].includes(type))return;editingType=type;const all=data(),d=all[type];const modal=$('wy-exp-editor'),fields=$('wy-exp-fields');if(!modal||!fields)return;fields.replaceChildren();$('wy-exp-heading').textContent=({nicotine:'تحرير رحلة النيكوتين',withdrawal:'تحرير أعراض الانسحاب',bravery:'تحرير تحدي الشجاعة'})[type];
 const field=(title,path,value,isImage=false,multiline=false)=>{const wrap=document.createElement('label');wrap.textContent=title;const control=document.createElement(multiline?'textarea':'input');if(!multiline)control.type='text';control.value=value||'';control.dataset.field=path;control.maxLength=isImage?3000:500;wrap.append(control);if(isImage){const file=document.createElement('input');file.type='file';file.accept='image/*';file.className='wy-exp-upload';file.dataset.forField=path;wrap.append(file);}fields.append(wrap);};
 if(type==='nicotine'){field('صورة الدماغ (رابط أو رفع)','brain',d.brain,true);field('صورة النيكوتين (رابط أو رفع)','character',d.character,true);d.stages.forEach((x,i)=>{field('المحطة '+(i+1)+' — العنوان',`stages.${i}.title`,x.title);field('المحطة '+(i+1)+' — الشرح',`stages.${i}.line`,x.line,false,true);});}
 if(type==='withdrawal'){d.items.forEach((x,i)=>{field('العَرَض '+(i+1)+' — الاسم',`items.${i}.label`,x.label);field('العَرَض '+(i+1)+' — الشرح',`items.${i}.line`,x.line,false,true);field('العَرَض '+(i+1)+' — صورة الطالب',`images.${i}`,d.images[i],true);});}
 if(type==='bravery'){for(const name of ['idle','good','bad','walk'])field('صورة الطالب — '+name,`images.${name}`,d.images[name],true);d.stages.forEach((x,i)=>{field('موقف '+(i+1)+' — السؤال',`stages.${i}.prompt`,x.prompt);field('موقف '+(i+1)+' — الرد الصحيح',`stages.${i}.right`,x.right);field('موقف '+(i+1)+' — الرد غير المناسب',`stages.${i}.wrong`,x.wrong);field('موقف '+(i+1)+' — التشجيع',`stages.${i}.hint`,x.hint);});}
 modal.classList.remove('hidden');modal.querySelector('input,textarea')?.focus();}
function closeEditor(){$('wy-exp-editor')?.classList.add('hidden');editingType='';}
async function saveEditor(ev){ev.preventDefault();if(!owner()||!editingType)return;const modal=$('wy-exp-editor'),btn=$('wy-exp-save'),d=data(),current=d[editingType];btn.disabled=true;try{for(const el of $('wy-exp-fields').querySelectorAll('[data-field]')){const v=el.value.trim();if(!el.classList.contains('wy-exp-upload'))pathSet(current,el.dataset.field,v);}
 for(const el of $('wy-exp-fields').querySelectorAll('input[type=file]')){const file=el.files?.[0];if(!file)continue;if(!file.type.startsWith('image/')||file.size>7*1024*1024)throw Error('الصورة يجب أن تكون أقل من 7 ميغابايت');const url=await uploadToSupabaseStorage(file,'experience-art');pathSet(current,el.dataset.forField,url);}
 if(!Object.values(current).length)throw Error('المحتوى فارغ');const ok=await saveLocalConfirmed(SCENES_KEY,d);if(!ok)throw Error('تعذر تأكيد الحفظ السحابي');renderAll();closeEditor();notice('تم حفظ المحتوى والصور بنجاح');}catch(e){notice('تعذر الحفظ: '+(e.message||e),true);}finally{btn.disabled=false;}}
function setupEditor(){if($('wy-exp-editor'))return;const modal=document.createElement('div');modal.id='wy-exp-editor';modal.className='hidden fixed inset-0 z-[99999] bg-slate-950/65 overflow-y-auto p-3 wy-editor-dialog';modal.dir='rtl';modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-labelledby','wy-exp-heading');modal.innerHTML='<div class="bg-white max-w-2xl mx-auto my-6 rounded-3xl p-5 sm:p-7 shadow-2xl"><div class="flex items-center justify-between"><h3 id="wy-exp-heading" class="font-black text-lg text-slate-900">تحرير محتوى تفاعلي</h3><button type="button" id="wy-exp-close" aria-label="إغلاق" class="text-slate-600 text-lg">✕</button></div><p class="text-xs text-slate-500 mt-2">يمكن تغيير النصوص وصور الشخصيات. تُرفع الصور عبر التخزين السحابي الأصلي للموقع.</p><form id="wy-exp-form" class="mt-4"><div id="wy-exp-fields" class="space-y-2"></div><div class="flex gap-2 mt-5"><button type="submit" id="wy-exp-save" class="wy-editor-action">حفظ ومزامنة</button><button type="button" id="wy-exp-cancel" class="wy-editor-secondary">إلغاء</button></div></form></div>';document.body.append(modal);$('wy-exp-close').onclick=$('wy-exp-cancel').onclick=closeEditor;$('wy-exp-form').onsubmit=saveEditor;modal.addEventListener('click',e=>{if(e.target===modal)closeEditor();});}
function renderAll(){renderNicotine();renderWithdrawal();renderBravery();renderTimeline();window.waeiV7?.applyArt();}
function initialize(){setupEditor();originalTimelineRender=window.renderTimelineHealingBar;if(typeof originalTimelineRender==='function')window.renderTimelineHealingBar=renderTimeline;window.setCalcPrice=setCalcPrice;window.updateFinancialCalc=updateCalc;renderAll();calcPeriod(30);setGoal('books');
  // New buttons are present at first role update; update owner-only status after any login change.
  const originalRoleUI=window.updateAdminBarUI;
  if(typeof originalRoleUI==='function')window.updateAdminBarUI=function(...args){const value=originalRoleUI.apply(this,args);document.querySelectorAll('.wy-edit-scene').forEach(el=>el.classList.toggle('hidden',!owner()));renderTimeline();return value;};
  window.addEventListener('storage',e=>{if(e.key===SCENES_KEY)renderAll();});
}
window.waeiExperiences={renderAll,nicotineNext,braveryChoose,braveryRetry,braveryNext,healNext,healPrev,healAnimate,moveHeal,calcPeriod,setGoal,openEditor,closeEditor};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initialize,{once:true});else initialize();
})();
