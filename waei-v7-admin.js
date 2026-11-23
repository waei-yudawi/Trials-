/* WAEI Yudawi V7: accessible navigation, cloud-backed image library/texts, and modest game feedback. */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const IMAGE_KEY='wa3y_cartoon_assets_v7', TEXT_KEY='wa3y_v7_ui_texts_v7';
const order=['screen-team-field','screen-anatomy','screen-lab','screen-calc','screen-sayno','screen-research','screen-community','screen-literature'];
const catalog=[
 ['heart','القلب الكرتوني','مسار التعافي'],['lungs','الرئتان الكرتونيتان','مسار التعافي'],['oxygen','شخصية الأكسجين','مسار التعافي'],
 ['brain','الدماغ الكرتوني','رحلة النيكوتين'],['nicotine','شخصية النيكوتين','رحلة النيكوتين'],
 ['student','الطالب الأساسي','أعراض الانسحاب / الشجاعة'],['student-sad','الطالب الحزين','أعراض الانسحاب / الشجاعة'],
 ['student-brave','الطالب الواثق','كيف تقول لا بشجاعة؟'],['student-walk','الطالب يمشي','كيف تقول لا بشجاعة؟'],
 ['jar','مرطبان الأحلام','الحاسبة'],['coin','العملة الذهبية','الحاسبة'],
 ['goal-books','هدف الكتب','الحاسبة'],['goal-headphones','هدف السماعات','الحاسبة'],['goal-bike','هدف الدراجة','الحاسبة']
];
const texts=[
 ['heal-kicker','مسار التعافي — الشارة','#timelineHealingWidget .wy-heal-kicker'],
 ['heal-title','مسار التعافي — العنوان','#timelineHealingWidget .wy-heal-head h3'],
 ['heal-summary','مسار التعافي — الوصف','#timelineHealingWidget .wy-heal-head p'],
 ['heal-hint','مسار التعافي — تعليمات لمس الشخصية','#timelineHealingWidget .wy-heal-tap'],
 ['heal-disclaimer','مسار التعافي — التنبيه الصحي','#timelineHealingWidget .wy-heal-disclaimer'],
 ['nic-heading','الإدمان — العنوان','#wy-nicotine-journey .wy-interactive-bar strong'],
 ['nic-instruction','رحلة النيكوتين — التعليمات','#wy-nicotine-journey small'],
 ['withdrawal-heading','أعراض الانسحاب — العنوان','#wy-withdrawal-card .wy-interactive-bar strong'],
 ['withdrawal-instruction','أعراض الانسحاب — التعليمات','#wy-withdrawal-card>p'],
 ['bravery-heading','كيف تقول لا — العنوان','#wy-bravery-game .wy-interactive-bar h4'],
 ['bravery-instruction','كيف تقول لا — التعليمات','#wy-bravery-game .wy-game-intro'],
 ['calc-kicker','الحاسبة — الشارة','#financialCalculatorCard .wy-calc-head>span'],
 ['calc-heading','الحاسبة — العنوان','#financialCalculatorCard .wy-calc-head h3'],
 ['calc-description','الحاسبة — الوصف','#financialCalculatorCard .wy-calc-head p'],
 ['calc-price-label','الحاسبة — عنوان السعر','#financialCalculatorCard .wy-calc-settings label[for="wy-calc-price"]'],
 ['calc-dream','الحاسبة — اختيار الحلم','#financialCalculatorCard .wy-calc-dream>p'],
 ['calc-footnote','الحاسبة — الملاحظة','#financialCalculatorCard .wy-calc-foot'],
 ['lit-heading','الأعمال الأدبية — العنوان','#screen-literature header h2'],
 ['lit-description','الأعمال الأدبية — الوصف','#screen-literature header p'],
 ['nav-research','تبويب الدراسات والأبحاث','#slimBentoTabsContainer [onclick="switchMainScreen(\'screen-research\')"] h3'],
 ['nav-calc','تبويب الحاسبة','#slimBentoTabsContainer [onclick="switchMainScreen(\'screen-calc\')"] h3'],
 ['nav-sayno','تبويب كيف تقول لا','#slimBentoTabsContainer [onclick="switchMainScreen(\'screen-sayno\')"] h3'],
 ['nav-literature','تبويب الأعمال الأدبية','#slimBentoTabsContainer [onclick="switchMainScreen(\'screen-literature\')"] h3']
];
const presetKeys=['preset-1','preset-2','preset-3'];
const defaults={};
const owner=()=>window.currentUserRole==='owner';
function storeData(key){try {const result=typeof window.getLocal==='function'?window.getLocal(key,{}):JSON.parse(localStorage.getItem(key)||'{}');return result&&typeof result==='object'&&!Array.isArray(result)?result:{};}catch{return {};}}
function safeURL(value){const v=String(value||'').trim();if(!v)return '';try{const url=new URL(v,location.href);return ['https:','http:'].includes(url.protocol)?url.href:'';}catch{return '';}}
function resolveAsset(url){const match=/^(?:\.\/)?assets\/([a-z-]+)\.webp$/.exec(String(url||''));if(!match)return url;const override=storeData(IMAGE_KEY)[match[1]];return safeURL(override)||url;}
function applyArt(){const saved=storeData(IMAGE_KEY);document.querySelectorAll('img').forEach(img=>{
 let key=img.dataset.waeiArt;const src=img.getAttribute('src')||'';
 const found=/^(?:\.\/)?assets\/([a-z-]+)\.webp$/.exec(src);
 if(found){key=found[1];img.dataset.waeiArt=key;}
 if(!key||!catalog.some(c=>c[0]===key))return;
 const wanted=safeURL(saved[key])||'./assets/'+key+'.webp';
 if(img.getAttribute('src')!==wanted)img.setAttribute('src',wanted);
 });}
function applyTexts(){const saved=storeData(TEXT_KEY);document.querySelectorAll('#financialCalculatorCard .calc-price-btn').forEach((btn,i)=>{const key=presetKeys[i];if(!key)return;if(!(key in defaults))defaults[key]=btn.dataset.price;const n=Number(saved[key]||defaults[key]);if(Number.isFinite(n)&&n>=0&&n<=1000){btn.dataset.price=String(n);btn.textContent=n+' ₪';}});texts.forEach(([key,,selector])=>{
  const el=document.querySelector(selector);if(!el)return;
  if(!(key in defaults))defaults[key]=el.textContent.trim();
  if(typeof saved[key]==='string'&&saved[key].trim()){if(el.textContent!==saved[key])el.textContent=saved[key];}
  else if(el.dataset.waeiCustomText==='true'){el.textContent=defaults[key]||'';}
  el.dataset.waeiCustomText=typeof saved[key]==='string'&&!!saved[key].trim()?'true':'false';
 });}
function organizeNav(){const grid=$('slimBentoTabsContainer'),drawer=$('drawerNavLinks');if(!grid||!drawer)return;
 // Literary tile is created here if the earlier lazy-initializer could not locate the community tile.
 if(!document.querySelector('.bento-tab-stripe[onclick*=\"screen-literature\"]')){
  const lit=document.createElement('div');lit.className='bento-tab-stripe';lit.setAttribute('onclick',"switchMainScreen('screen-literature')");lit.innerHTML='<div class=\"flex items-center gap-3\"><span class=\"w-9 h-9 rounded-xl bg-rose-50 text-crimson flex items-center justify-center text-sm\"><i class=\"fa-solid fa-book-open\"></i></span><div class=\"text-right\"><h3 class=\"text-sm font-bold text-slate-800 font-cairo\">أعمال أدبية</h3><p class=\"text-[11px] text-brandGray-500 font-plex\">إبداعات أكاديمية وثقافية</p></div></div><i class=\"fa-solid fa-chevron-left text-xs text-brandGray-400\"></i>';grid.appendChild(lit);
 }
 order.forEach(screen=>{
  const item=document.querySelector('#screen-home .bento-tab-stripe[onclick="switchMainScreen(\''+screen+'\')"]');
  if(item){grid.appendChild(item);if(!item.hasAttribute('tabindex'))item.setAttribute('tabindex','0');item.setAttribute('role','button');if(!item.hasAttribute('onkeydown'))item.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();window.switchMainScreen(screen);}});}
  const link=drawer.querySelector('button[onclick="switchMainScreen(\''+screen+'\')"]');if(link)drawer.appendChild(link);
 });
 // The original section visibility controls continue to act on direct grid children.
}
function toast(message,bad=false){if(typeof showToast==='function')showToast(message,bad?'error':'success');else console.info(message);}
function createAdmin(){if($('panel-visualMediaCMS'))return;
 const after=$('tabBtn-textEditorCMS');if(!after)return;
 const tab=document.createElement('button');tab.type='button';tab.id='tabBtn-visualMediaCMS';tab.className='admin-tab-btn owner-only-btn hidden px-3.5 py-2 rounded-xl text-slate-300 hover:bg-white/5 font-bold flex items-center gap-2 shrink-0 transition';tab.innerHTML='<i class="fa-solid fa-images text-red-400"></i> صور الرسوم الجديدة والنصوص';tab.onclick=()=>{window.switchAdminTab('visualMediaCMS');renderAdmin();};after.insertAdjacentElement('afterend',tab);
 const panel=document.createElement('section');panel.id='panel-visualMediaCMS';panel.className='hidden space-y-5';panel.dir='rtl';panel.innerHTML=`<header class="space-y-1 border-b border-slate-200 pb-3"><h3 class="font-black text-xl text-slate-900">إدارة صور الشخصيات والنصوص الجديدة</h3><p class="text-xs text-slate-600 leading-6">كل صورة ترفعها هنا تُستبدل في الموقع بعد تأكيد الحفظ السحابي. ويمكن استرجاع الصورة الأصلية بأي وقت.</p></header>
 <div class="wy-v7-manager-panel"><h4>تعديل القصص التفاعلية ومراحل التعافي</h4><div class="wy-v7-quick-links">
 <button type="button" data-open="nicotine">🧠 رحلة النيكوتين</button><button type="button" data-open="withdrawal">🙂 أعراض الانسحاب</button><button type="button" data-open="bravery">✋ تحدّي الشجاعة</button><button type="button" data-open="literature">📖 الأعمال الأدبية</button><button type="button" data-open="certificate">🏅 الشهادات والصور</button><button type="button" data-open="healing">🌿 مراحل التعافي</button></div>
 <p class="wy-v7-help">من هذه الأزرار تستطيع تعديل الحوار، الصور الخاصة بكل مشهد، العنوان، ترتيب مراحل التعافي، وإظهار/إخفاء الأعمال.</p></div>
 <section class="wy-v7-manager-panel"><h4>مكتبة الصور الكرتونية — ارفع واستبدل</h4><p class="wy-v7-help">تدعم JPG / PNG / WebP / GIF حتى 7 MB. استعمل صورة مخصصة لكل شخصية، أو الصق رابط HTTPS موثوقًا.</p><div id="wy-v7-art-list" class="wy-v7-art-grid"></div></section>
 <section class="wy-v7-manager-panel"><h4>تعديل العناوين والعبارات الثابتة المضافة</h4><p class="wy-v7-help">أما حوارات المواقف، مراحل الرحلة، وأوصاف التعافي فتُعدل من المحررات أعلاه؛ والنصوص الأصلية من «محرر النصوص الشامل».</p><div id="wy-v7-text-list" class="wy-v7-text-grid"></div><button type="button" id="wy-v7-save-texts" class="wy-v7-save">حفظ العبارات ومزامنتها ☁️</button></section>`;
 const textPanel=$('panel-textEditorCMS');if(textPanel)textPanel.insertAdjacentElement('afterend',panel);
 panel.addEventListener('click',event=>{const target=event.target.closest('button');if(!target)return;
  const kind=target.dataset.open;
  if(kind==='nicotine'||kind==='withdrawal'||kind==='bravery')window.waeiExperiences?.openEditor(kind);
  if(kind==='literature')window.waeiLiterature?.openManager();
  if(kind==='certificate'){window.switchAdminTab('communityCMS');window.waeiCommunity?.edit('certificate');}
  if(kind==='healing'){window.closeAdminMasterModal?.();window.switchMainScreen('screen-anatomy');document.getElementById('timelineHealingWidget')?.scrollIntoView({block:'start',behavior:'smooth'});toast('افتح أدوات المالك فوق مراحل التعافي لتغيير نص كل مرحلة وصورتها.');}
 });
 $('wy-v7-save-texts').onclick=saveTexts;
 const originalSwitch=window.switchAdminTab;
 if(typeof originalSwitch==='function')window.switchAdminTab=function(id,...args){const out=originalSwitch.call(this,id,...args);if(id==='visualMediaCMS'&&owner())renderAdmin();return out;};
 const originalRoleUI=window.updateAdminBarUI;
 if(typeof originalRoleUI==='function')window.updateAdminBarUI=function(...args){const out=originalRoleUI.apply(this,args);tab.classList.toggle('hidden',!owner());return out;};
 tab.classList.toggle('hidden',!owner());
}
function createEl(tag,className,text){const el=document.createElement(tag);if(className)el.className=className;if(text!==undefined)el.textContent=text;return el;}
function renderAdmin(){if(!owner())return;const art=$('wy-v7-art-list'),items=$('wy-v7-text-list');if(!art||!items)return;
 const data=storeData(IMAGE_KEY);art.replaceChildren();for(const [key,label,section] of catalog){const card=createEl('div','wy-v7-art-card');const img=createEl('img');img.src=safeURL(data[key])||'./assets/'+key+'.webp';img.alt=label;img.loading='lazy';card.append(img);
 const body=createEl('div','wy-v7-art-body');body.append(createEl('strong','',label));body.append(createEl('small','',section));
 const input=createEl('input','wy-v7-url');input.type='url';input.placeholder='رابط الصورة (https://...)';input.value=data[key]||'';input.setAttribute('aria-label','رابط صورة '+label);body.append(input);
 const upload=createEl('input','wy-v7-file');upload.type='file';upload.accept='image/png,image/jpeg,image/webp,image/gif';upload.setAttribute('aria-label','رفع '+label);body.append(upload);
 const buttons=createEl('div','wy-v7-art-actions');const save=createEl('button','wy-v7-save','حفظ الصورة');const reset=createEl('button','wy-v7-reset','استعادة الأصل');save.type=reset.type='button';save.onclick=()=>saveImage(key,input,upload,save);reset.onclick=()=>resetImage(key,reset);buttons.append(save,reset);body.append(buttons);card.append(body);art.append(card);}
 items.replaceChildren();const stored=storeData(TEXT_KEY);for(const [i,key] of presetKeys.entries()){const label=createEl('label','wy-v7-text-item');label.append(createEl('span','','سعر السيجارة — الخيار '+(i+1)+' (₪)'));const fld=createEl('input','wy-v7-url');fld.type='number';fld.min='0';fld.max='1000';fld.step='0.5';fld.value=stored[key]||defaults[key]||'2';fld.dataset.waeiTextField=key;label.append(fld);items.append(label);}for(const [key,label,selector] of texts){const el=document.querySelector(selector);if(!el)continue;
 const wrap=createEl('label','wy-v7-text-item'),title=createEl('span','',label),control=createEl('textarea','');control.rows=2;control.maxLength=500;control.dataset.waeiTextField=key;
 control.value=typeof stored[key]==='string'?stored[key]:(defaults[key]??el.textContent.trim());wrap.append(title,control);items.append(wrap);
 }}
async function confirmSaved(key,data){if(!owner())throw Error('هذه الأداة مخصصة للمالك فقط');if(typeof window.saveLocalConfirmed!=='function')throw Error('المزامنة السحابية غير جاهزة');const ok=await window.saveLocalConfirmed(key,data);if(!ok)throw Error('الخادم لم يؤكد الحفظ السحابي');render();return true;}
async function saveImage(key,input,fileInput,button){if(!owner())return;button.disabled=true;try{
 let url=safeURL(input.value);
 if(input.value.trim()&&!url)throw Error('الرابط غير صالح؛ استخدم https://');
 const file=fileInput.files?.[0];if(file){if(!['image/png','image/jpeg','image/webp','image/gif'].includes(file.type)||file.size>7*1024*1024)throw Error('اختر صورة JPG/PNG/WebP/GIF أقل من 7 MB');
 if(typeof window.uploadToSupabaseStorage!=='function')throw Error('خدمة رفع الملفات غير متاحة');url=await window.uploadToSupabaseStorage(file,'cartoon-assets');}
 if(!url)throw Error('اختر ملف صورة أو أدخل رابطًا صحيحًا');const next={...storeData(IMAGE_KEY),[key]:url};await confirmSaved(IMAGE_KEY,next);input.value=url;fileInput.value='';toast('تم تغيير الصورة ومزامنتها ✓');
 }catch(err){toast('لم تُحفظ الصورة: '+(err.message||err),true);}finally{button.disabled=false;}}
async function resetImage(key,button){if(!owner())return;button.disabled=true;try{const data={...storeData(IMAGE_KEY)};delete data[key];await confirmSaved(IMAGE_KEY,data);toast('استُعيدت الصورة الأصلية ✓');}catch(err){toast('تعذر الاستعادة: '+(err.message||err),true);}finally{button.disabled=false;}}
async function saveTexts(){if(!owner())return;const btn=$('wy-v7-save-texts');btn.disabled=true;try{const next={...storeData(TEXT_KEY)};document.querySelectorAll('[data-waei-text-field]').forEach(field=>{const key=field.dataset.waeiTextField,val=field.value.trim();if(val&&val!==(defaults[key]||''))next[key]=val;else delete next[key];});await confirmSaved(TEXT_KEY,next);toast('تم حفظ النصوص وتأكيد المزامنة ✓');}catch(err){toast('تعذر حفظ النصوص: '+(err.message||err),true);}finally{btn.disabled=false;}}
function bubble(target,good,neutral=false){if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return;if(document.querySelectorAll('.wy-v7-float').length>6)return;
 const rect=target.getBoundingClientRect();if(!rect.width)return;const icons=neutral?['✦','✨']:good?['✓','😊']:['✕','😟'];
 icons.forEach((icon,i)=>{const node=createEl('span','wy-v7-float '+(neutral?'neutral':good?'positive':'negative'),icon);node.setAttribute('aria-hidden','true');node.style.left=Math.round(Math.max(12,Math.min(innerWidth-56,rect.left+rect.width*(i?0.7:0.3))))+'px';node.style.top=Math.round(Math.max(22,rect.top+rect.height/2+(i?5:-12)))+'px';document.body.append(node);setTimeout(()=>node.remove(),900);});
 if(!good&&!neutral){target.classList.add('wy-v7-soft-shake');setTimeout(()=>target.classList.remove('wy-v7-soft-shake'),460);}}
function feedback(event){const button=event.target.closest('button');if(!button||button.disabled)return;
 if(button.closest('#wy-bravery-choices')){const index=[...button.parentElement.querySelectorAll('button')].indexOf(button);bubble(button,index===0);return;}
 if(button.id==='wy-bravery-player'||button.closest('#wy-bravery-player')){bubble(button,true);return;}
 if(button.closest('#scenarioChoicesContainer,#clashOptionsContainer')){
  const clash=!!button.closest('#clashOptionsContainer'),group=button.parentElement,index=[...group.querySelectorAll('button')].indexOf(button);
  let stage=0;if(clash){stage=Math.max(0,(Number((document.getElementById('clashStageTag')?.textContent||'').match(/موقف\s+(\d+)/)?.[1])||1)-1);}
  else{stage=Math.max(0,(Number((document.getElementById('scenarioIndexLabel')?.textContent||'').match(/\d+/)?.[0])||1)-1);}
  const scenes=typeof getLocal==='function'?getLocal('wa3y_scenarios_data_v1',typeof defaultPeerScenarios!=='undefined'?defaultPeerScenarios:[]):[];
  const choice=scenes?.[stage]?.choices?.[index];const score=choice?.score;
  bubble(button,score==='good',!score||score==='neutral');return;
 }
 // Light effects appear only on game controls; not on navigation, administration or forms.
 if(button.matches('#wy-nic-character,#wy-heal-character,#wy-heal-next,#wy-heal-prev')||button.closest('#wy-withdrawal-options,#wy-calc-goals,#wy-calc-period,#healingMilestonesBar')){bubble(button,true,true);return;}
}
function render(){applyTexts();applyArt();if(owner()&&!$('panel-visualMediaCMS')?.classList.contains('hidden'))renderAdmin();}
function boot(){organizeNav();applyTexts();createAdmin();render();document.addEventListener('click',feedback,true);
 window.addEventListener('storage',e=>{if(e.key===IMAGE_KEY||e.key===TEXT_KEY)render();});}
window.waeiV7={render,applyArt,resolveAsset,organizeNav,renderAdmin};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
