"use strict";

const SAVE_KEY = "hoshiakari_complete_v1";
const TILE = 32, COLS = 20, ROWS = 15;
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

const chapters = [
  {title:"第一章　落ちた星", area:"星見村", quest:"村長セレスに話を聞こう", npc:"セレス", color:"#429650",
    intro:["千年に一度の流星祭。その夜、空から星が消えた。","村の少年アステルの手には、ひとつの星片だけが残されていた。"],
    talk:["アステルよ、北の丘へ行きなさい。星喰いの影が現れたそうです。","その星片は、きっとあなたを導くでしょう。"], enemy:"影スライム", boss:"星喰いの獣", item:"薬草", reward:"星のかけら・黎明"},
  {title:"第二章　月影の森", area:"月影の森", quest:"森番リュネの話を聞こう", npc:"リュネ", color:"#24654c",
    intro:["最初の星を取り戻したアステルは、月影の森へ向かう。","森は深い眠りに沈み、獣たちの心も闇に覆われていた。"],
    talk:["森の奥で、眠りの魔女が星を封じています。","この月露を持って。きっと幻を破れるはず。"], enemy:"夢見コウモリ", boss:"眠りの魔女ノクス", item:"月の雫", reward:"星のかけら・慈愛"},
  {title:"第三章　砂時計の王都", area:"砂塵の王都", quest:"学者トキオと話そう", npc:"トキオ", color:"#b28345",
    intro:["二つの星は、時を止めた砂漠の王都を指し示した。","そこでは同じ一日が、百年もの間くり返されていた。"],
    talk:["時計塔の主が、時間そのものを食べています。","歯車を正し、止まった鐘を鳴らしてください。"], enemy:"砂鉄ゴーレム", boss:"時喰らいクロノス", item:"星の霊薬", reward:"星のかけら・時"},
  {title:"第四章　空の海", area:"雲海の港", quest:"船長ミラに会おう", npc:"ミラ", color:"#4f8db8",
    intro:["三つの星が天に道を描き、雲海へ続く港が姿を現した。","最後の航路を守る竜は、悲しい怒りに囚われている。"],
    talk:["嵐の向こうに星の神殿があります。","竜を倒すだけではだめ。その心に、星灯りを見せて。"], enemy:"雲海クラゲ", boss:"蒼天竜アズール", item:"竜の鱗", reward:"星のかけら・勇気"},
  {title:"第五章　星なき夜", area:"星影の城", quest:"王座へ進もう", npc:"星の記憶", color:"#493c72",
    intro:["四つの星が揃ったとき、世界を覆う夜の正体が明らかになる。","星を奪った王は、かつて人々を救おうとした勇者だった。"],
    talk:["闇王ヴェイルもまた、誰かを救いたかった。","あなたが集めた光なら、剣とは違う答えを示せる。"], enemy:"虚無の騎士", boss:"闇王ヴェイル", item:"世界樹の葉", reward:"最後の星"}
];

const enemies = {
  "影スライム":{hp:22,atk:5,def:1,xp:9,gold:6,color:"#68509c"}, "星喰いの獣":{hp:48,atk:8,def:2,xp:30,gold:24,color:"#804453"},
  "夢見コウモリ":{hp:38,atk:9,def:3,xp:18,gold:12,color:"#54548f"}, "眠りの魔女ノクス":{hp:80,atk:13,def:5,xp:60,gold:45,color:"#714c8e"},
  "砂鉄ゴーレム":{hp:65,atk:15,def:7,xp:32,gold:24,color:"#9d744e"}, "時喰らいクロノス":{hp:125,atk:20,def:9,xp:100,gold:75,color:"#956044"},
  "雲海クラゲ":{hp:92,atk:22,def:9,xp:48,gold:35,color:"#5c91b0"}, "蒼天竜アズール":{hp:185,atk:28,def:12,xp:160,gold:110,color:"#427da8"},
  "虚無の騎士":{hp:145,atk:31,def:14,xp:70,gold:55,color:"#4a4264"}, "闇王ヴェイル":{hp:280,atk:38,def:17,xp:300,gold:0,color:"#351f4c"}
};

const freshState = () => ({version:1,chapter:0,step:0,x:10,y:11,dir:"up",level:1,xp:0,nextXp:24,hp:34,maxHp:34,mp:12,maxMp:12,atk:8,def:4,gold:10,
  items:{"薬草":3,"星の霊薬":1,"世界樹の葉":0},stars:[],playTime:0,battles:0,started:Date.now(),settings:{sound:true,shake:true},flags:{},ending:false});
let state = freshState(), mode = "title", dialogQueue = [], afterDialog = null, battle = null, lastFrame = 0, toastTimer;

const canvas = $("#game-canvas"), ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

function showScreen(id){ $$(".screen").forEach(s=>s.classList.toggle("active",s.id===id)); }
function hasSave(){ try{return !!localStorage.getItem(SAVE_KEY)}catch{return false} }
function save(silent=false){ try{state.savedAt=Date.now();localStorage.setItem(SAVE_KEY,JSON.stringify(state));if(!silent) toast("冒険の記録を保存しました");return true}catch{toast("保存できませんでした");return false} }
function load(){ try{const raw=localStorage.getItem(SAVE_KEY);if(!raw)return false;state={...freshState(),...JSON.parse(raw)};state.started=Date.now();return true}catch{return false} }
function fmtTime(sec){return `${Math.floor(sec/3600)}:${String(Math.floor(sec/60)%60).padStart(2,"0")}`}
function totalTime(){return (state.playTime||0)+Math.floor((Date.now()-state.started)/1000)}

function startGame(isContinue=false, chapter=0){
  if(!isContinue){state=freshState();state.chapter=chapter;if(chapter){boostForChapter(chapter);state.stars=chapters.slice(0,chapter).map(c=>c.reward)} }
  mode="world"; showScreen("game-screen"); resetPosition(); updateUI(); draw();
  if(!isContinue || (state.step===0&&!state.flags[`intro${state.chapter}`])) introChapter(); else toast("冒険を再開しました");
}
function boostForChapter(ch){ state.level=1+ch*3;state.maxHp=34+ch*24;state.hp=state.maxHp;state.maxMp=12+ch*9;state.mp=state.maxMp;state.atk=8+ch*8;state.def=4+ch*5;state.gold=10+ch*40; }
function resetPosition(){state.x=10;state.y=11;state.dir="up"}
function introChapter(){const ch=chapters[state.chapter];state.flags[`intro${state.chapter}`]=true;showDialog([{speaker:ch.title,text:ch.intro[0]},{speaker:"",text:ch.intro[1]},{speaker:"アステル",text:state.chapter?"この星片が震えている。先へ進もう。":"じいちゃんの形見が光ってる……村長に聞いてみよう。"}]);}

function showDialog(lines, done=null){ dialogQueue=[...lines];afterDialog=done;mode="dialog";$("#message-box").classList.remove("hidden");nextDialog(); }
function nextDialog(){
  if(dialogQueue.length){const l=dialogQueue.shift();$("#speaker").textContent=l.speaker||"";$("#message-text").textContent=l.text;return}
  $("#message-box").classList.add("hidden");mode="world";const fn=afterDialog;afterDialog=null;if(fn)fn();
}
function choose(options){mode="choice";const box=$("#choice-box");box.innerHTML="";options.forEach(o=>{const b=document.createElement("button");b.textContent=o.label;b.onclick=()=>{box.classList.add("hidden");o.action()};box.append(b)});box.classList.remove("hidden")}

function interact(){
  if(mode==="dialog")return nextDialog(); if(mode!=="world")return;
  const ch=chapters[state.chapter];
  if(near(10,7) && state.step===0){showDialog([{speaker:"アステル",text:`${ch.npc}さん、星の光を取り戻す手がかりを知りませんか？`},...ch.talk.map(t=>({speaker:ch.npc,text:t}))],()=>{state.step=1;state.items[ch.item]=(state.items[ch.item]||0)+1;toast(`${ch.item}を手に入れた`);updateUI();save(true)});return}
  if(near(4,4) && state.step===1){showDialog([{speaker:"アステル",text:"星の気配……でも、魔物が守っている！"}],()=>startBattle(ch.enemy,false));return}
  if(near(15,3) && state.step===2){showDialog([{speaker:"？？？",text:state.chapter===4?"星は人を救わない。希望こそが、もっとも深い絶望を生む。":"ここから先へは行かせぬ。星の光は我らのものだ。"},{speaker:"アステル",text:"みんなが待っている。星灯りを、必ず取り戻す！"}],()=>startBattle(ch.boss,true));return}
  showDialog([{speaker:"アステル",text:state.step===0?`${ch.npc}は広場の北にいるはずだ。`:state.step===1?"西の星碑から、魔物の気配がする。":state.step===2?"北東の祭壇へ進もう。":"星片が、次の道を示している。"}]);
}
function near(x,y){return Math.abs(state.x-x)+Math.abs(state.y-y)<=1}

function mapBlocked(x,y){
  if(x<1||y<1||x>18||y>13)return true;
  const obstacles=[[2,2],[3,2],[17,2],[18,2],[2,11],[17,11],[7,5],[8,5],[12,9],[13,9],[6,12],[14,12]];
  return obstacles.some(p=>p[0]===x&&p[1]===y)|| (x===10&&y===7)||(x===4&&y===4)||(x===15&&y===3);
}
function move(dx,dy,dir){if(mode!=="world")return;state.dir=dir;const nx=state.x+dx,ny=state.y+dy;if(!mapBlocked(nx,ny)){state.x=nx;state.y=ny;draw()} }

function draw(){
  const ch=chapters[state.chapter];ctx.fillStyle=ch.color;ctx.fillRect(0,0,640,480);
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){const even=(x+y)%2;ctx.fillStyle=even?"#ffffff08":"#00000008";ctx.fillRect(x*TILE,y*TILE,TILE,TILE)}
  ctx.fillStyle="#cbb481";ctx.fillRect(9*TILE,0,3*TILE,480);ctx.fillRect(0,6*TILE,640,3*TILE);
  ctx.fillStyle="#6f583d";[[2,2],[3,2],[17,2],[18,2],[2,11],[17,11],[7,5],[8,5],[12,9],[13,9],[6,12],[14,12]].forEach(([x,y])=>{ctx.fillRect(x*TILE+5,y*TILE+4,22,25);ctx.fillStyle="#254d32";ctx.fillRect(x*TILE,y*TILE,32,18);ctx.fillStyle="#6f583d"});
  drawMarker(10,7,ch.npc,"#f3d36b");drawMarker(4,4,state.step===1?"!":"星碑",state.step===1?"#ffde65":"#7f9eca");drawMarker(15,3,state.step===2?"!":"祭壇",state.step===2?"#ef7680":"#ba9fe5");
  drawHero(state.x,state.y); 
}
function drawMarker(x,y,label,color){ctx.fillStyle="#0008";ctx.fillRect(x*TILE-8,y*TILE-17,48,14);ctx.font="10px sans-serif";ctx.textAlign="center";ctx.fillStyle="#fff";ctx.fillText(label,x*TILE+16,y*TILE-7);ctx.fillStyle=color;ctx.fillRect(x*TILE+8,y*TILE+7,16,20);ctx.fillStyle="#fff";ctx.fillRect(x*TILE+11,y*TILE+10,4,4);ctx.fillRect(x*TILE+18,y*TILE+10,4,4)}
function drawHero(x,y){const px=x*TILE,py=y*TILE;ctx.fillStyle="#0005";ctx.fillRect(px+7,py+25,20,5);ctx.fillStyle="#f0c891";ctx.fillRect(px+9,py+4,14,10);ctx.fillStyle="#243f85";ctx.fillRect(px+7,py+14,18,15);ctx.fillStyle="#ffd866";ctx.fillRect(px+13,py+18,6,6);ctx.fillStyle="#172855";ctx.fillRect(px+8,py+29,7,3);ctx.fillRect(px+19,py+29,7,3)}

function startBattle(name,boss){
  const base=enemies[name], scale=1; battle={name,boss,maxHp:Math.round(base.hp*scale),hp:Math.round(base.hp*scale),atk:base.atk,def:base.def,xp:base.xp,gold:base.gold,color:base.color,guard:false,busy:false};
  mode="battle";showScreen("battle-screen");$("#enemy-name").textContent=name;$("#enemy-sprite").style.setProperty("--enemy",base.color);battleLog(`${name}が現れた！`);updateBattleUI();
}
function battleLog(text){$("#battle-log").textContent=text}
function updateBattleUI(){
  $("#enemy-hp-bar").style.width=`${Math.max(0,battle.hp/battle.maxHp*100)}%`;$("#battle-level").textContent=`Lv ${state.level}`;$("#battle-hp").textContent=`${state.hp}/${state.maxHp}`;$("#battle-mp").textContent=`${state.mp}/${state.maxMp}`;
  $$("#battle-actions button").forEach(b=>b.disabled=battle.busy);
}
function command(cmd){
  if(mode!=="battle"||battle.busy)return;battle.busy=true;let text="";
  if(cmd==="attack"){const dmg=Math.max(1,state.atk+rand(0,5)-battle.def);battle.hp-=dmg;text=`アステルの攻撃！ ${battle.name}に${dmg}のダメージ！`}
  else if(cmd==="star"){if(state.mp<4){battle.busy=false;battleLog("MPが足りない！");return}state.mp-=4;const dmg=Math.max(5,Math.round(state.atk*1.8)+rand(0,7)-Math.floor(battle.def/2));battle.hp-=dmg;text=`星光斬！ ${dmg}のダメージ！`}
  else if(cmd==="guard"){battle.guard=true;text="アステルは星片をかざして身を守った。"}
  else if(cmd==="item"){battle.busy=false;openBattleItems();return}
  battleLog(text);updateBattleUI();setTimeout(()=>battle.hp<=0?winBattle():enemyTurn(),650);
}
function openBattleItems(){
  const usable=[{name:"薬草",heal:35},{name:"星の霊薬",heal:999,mp:999},{name:"世界樹の葉",heal:999}].filter(i=>(state.items[i.name]||0)>0);
  if(!usable.length){battleLog("使えるどうぐがない！");return}
  choose(usable.map(i=>({label:`${i.name} ×${state.items[i.name]}`,action:()=>{mode="battle";state.items[i.name]--;state.hp=Math.min(state.maxHp,state.hp+i.heal);if(i.mp)state.mp=state.maxMp;battleLog(`${i.name}を使った。力が回復した！`);battle.busy=true;updateBattleUI();setTimeout(enemyTurn,600)}})).concat({label:"もどる",action:()=>{mode="battle";battle.busy=false;updateBattleUI()}}));
}
function enemyTurn(){
  const raw=Math.max(1,battle.atk+rand(0,5)-state.def),dmg=battle.guard?Math.ceil(raw/2):raw;battle.guard=false;state.hp-=dmg;battleLog(`${battle.name}の攻撃！ ${dmg}のダメージ！`);shake();updateBattleUI();
  setTimeout(()=>{if(state.hp<=0)gameOver();else{battle.busy=false;updateBattleUI();battleLog("どうする？")}},700);
}
function winBattle(){
  state.battles++;state.xp+=battle.xp;state.gold+=battle.gold;const boss=battle.boss;battleLog(`${battle.name}を倒した！ ${battle.xp} EXPを獲得。`);while(state.xp>=state.nextXp)levelUp();
  setTimeout(()=>{showScreen("game-screen");mode="world";state.hp=Math.min(state.maxHp,state.hp+Math.ceil(state.maxHp*.25));state.mp=Math.min(state.maxMp,state.mp+3);
    if(boss)finishChapter();else{state.step=2;showDialog([{speaker:"アステル",text:"魔物の影から星の道が現れた。北東の祭壇へ向かおう。"}])}updateUI();draw();save(true)},1000);
}
function levelUp(){state.xp-=state.nextXp;state.level++;state.nextXp=Math.round(state.nextXp*1.45);state.maxHp+=10;state.maxMp+=4;state.atk+=3;state.def+=2;state.hp=state.maxHp;state.mp=state.maxMp}
function gameOver(){battleLog("アステルは力尽きた……");setTimeout(()=>{state.hp=state.maxHp;state.mp=state.maxMp;state.gold=Math.max(0,state.gold-Math.floor(state.gold*.15));showScreen("game-screen");mode="world";resetPosition();updateUI();draw();showDialog([{speaker:"星の声",text:"まだ、あなたの旅は終わっていない……。"}])},1100)}
function finishChapter(){
  const ch=chapters[state.chapter];state.stars.push(ch.reward);state.step=3;
  if(state.chapter===4){state.ending=true;save(true);ending();return}
  showDialog([{speaker:"星の声",text:`${ch.reward}が夜空へ還った。`},{speaker:ch.npc,text:"ありがとう、アステル。あなたの光は、次の地でも道を照らすでしょう。"}],()=>{state.chapter++;state.step=0;resetPosition();state.hp=state.maxHp;state.mp=state.maxMp;updateUI();draw();save(true);introChapter()});
}
function ending(){
  showScreen("game-screen");mode="dialog";showDialog([{speaker:"ヴェイル",text:"そうか……星は、空にあるから輝くのではない。誰かを想う心に灯るのか。"},{speaker:"アステル",text:"一緒に帰ろう。夜があるから、星灯りは見えるんだ。"},{speaker:"",text:"五つの星は空へ還り、長い夜は明けた。人々はもう、星に願うだけではない。互いの心に灯りを見つけた。"},{speaker:"星灯りの勇者",text:`THE END　冒険時間 ${fmtTime(totalTime())}　戦闘 ${state.battles}回`}],()=>{mode="ending";openModal(`<h2>星灯りが戻った</h2><p>全5章クリア、おめでとうございます。</p><p>Lv ${state.level}　冒険時間 ${fmtTime(totalTime())}</p><div class="modal-buttons"><button id="epilogue">その後の世界を歩く</button><button id="back-title">タイトルへ</button></div>`);$("#epilogue").onclick=()=>{$("#modal").close();mode="world";state.step=3;draw();toast("星の祝福で満ちた世界");};$("#back-title").onclick=()=>{$("#modal").close();returnTitle()}})}

function updateUI(){
  const ch=chapters[state.chapter];$("#area-name").textContent=ch.area;$("#chapter-label").textContent=ch.title.split("　")[0];$("#hero-level").textContent=`Lv ${state.level}`;$("#hp-text").textContent=`${state.hp}/${state.maxHp}`;$("#mp-text").textContent=`${state.mp}/${state.maxMp}`;$("#hp-bar").style.width=`${state.hp/state.maxHp*100}%`;$("#mp-bar").style.width=`${state.mp/state.maxMp*100}%`;$("#atk-text").textContent=state.atk;$("#def-text").textContent=state.def;$("#gold-text").textContent=state.gold;$("#exp-text").textContent=state.xp;$("#quest-text").textContent=[ch.quest,"西の星碑を調べよう","北東の祭壇へ進もう","次の星へ向かおう"][state.step]||ch.quest;
}
function toast(text){const t=$("#toast");t.textContent=text;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),1800)}
function rand(a,b){return Math.floor(Math.random()*(b-a+1))+a}
function shake(){if(!state.settings.shake)return;$("#battle-screen").animate([{transform:"translateX(-5px)"},{transform:"translateX(5px)"},{transform:"none"}],{duration:180})}

function openMenu(tab="status"){$("#main-menu").showModal();renderMenu(tab)}
function renderMenu(tab){
  $$(".tabs button").forEach(b=>b.classList.toggle("active",b.dataset.tab===tab));const c=$("#menu-content");
  if(tab==="status")c.innerHTML=`<h3>アステル　Lv ${state.level}</h3><p>HP ${state.hp}/${state.maxHp}　MP ${state.mp}/${state.maxMp}<br>攻撃 ${state.atk}　守備 ${state.def}<br>次のレベルまで ${state.nextXp-state.xp} EXP</p><p>集めた星：${state.stars.length}/5</p><div class="menu-actions"><button id="heal">休息する（10星貨）</button></div>`;
  if(tab==="items")c.innerHTML=`<div class="item-list">${Object.entries(state.items).map(([n,q])=>`<div class="item-row"><span>${n}</span><b>×${q}</b></div>`).join("")||"どうぐはありません"}</div><p>薬草は戦闘中にHPを35回復。星の霊薬はHP・MPを全回復します。</p>`;
  if(tab==="records")c.innerHTML=`<div class="records"><p>${chapters[state.chapter].title}</p><p>冒険時間 ${fmtTime(totalTime())}　戦闘 ${state.battles}回</p><p>${state.stars.map(s=>`★ ${s}`).join("<br>")||"星はまだ見つかっていない"}</p></div><div class="menu-actions"><button id="save-now">記録する</button><button id="to-title">タイトルへ</button></div>`;
  if(tab==="settings")c.innerHTML=`<div class="settings-row"><span>画面の揺れ</span><button id="toggle-shake">${state.settings.shake?"ON":"OFF"}</button></div><p>キーボード：矢印/WASDで移動、Enter/Space/Zで決定、Escでメニュー。</p>`;
  $("#heal")?.addEventListener("click",()=>{if(state.gold<10)return toast("星貨が足りません");state.gold-=10;state.hp=state.maxHp;state.mp=state.maxMp;updateUI();renderMenu(tab)});
  $("#save-now")?.addEventListener("click",()=>save());$("#to-title")?.addEventListener("click",returnTitle);$("#toggle-shake")?.addEventListener("click",()=>{state.settings.shake=!state.settings.shake;renderMenu(tab)});
}
function returnTitle(){if(mode!=="title"){state.playTime=totalTime();state.started=Date.now();save(true)}$("#main-menu").close();mode="title";showScreen("title-screen");refreshTitle()}
function openModal(html){$("#modal-content").innerHTML=html;$("#modal").showModal()}
function refreshTitle(){$("#continue-game").disabled=!hasSave()}

$("#new-game").onclick=()=>{if(hasSave())openModal(`<h2>新しい冒険</h2><p>現在の記録に上書きします。よろしいですか？</p><div class="modal-buttons"><button id="yes-new">はじめる</button><button id="no-new">もどる</button></div>`),$("#yes-new").onclick=()=>{$("#modal").close();startGame(false)},$("#no-new").onclick=()=>$("#modal").close();else startGame(false)};
$("#continue-game").onclick=()=>{if(load())startGame(true)};
$("#chapter-select").onclick=()=>openModal(`<h2>章から遊ぶ</h2><p>物語と推奨能力で各章を開始します。</p><div class="item-list">${chapters.map((c,i)=>`<button class="menu-button chapter" data-ch="${i}">${c.title}</button>`).join("")}</div><div class="modal-buttons"><button id="close-modal">もどる</button></div>`);
$("#modal").addEventListener("click",e=>{if(e.target.id==="close-modal")$("#modal").close();const b=e.target.closest(".chapter");if(b){$("#modal").close();startGame(false,+b.dataset.ch)}});
$("#open-help").onclick=()=>openModal(`<h2>遊びかた</h2><p>マップの人物や「！」の一歩手前で決定してください。</p><p>PC：矢印/WASDで移動、Enter/Space/Zで決定、Esc/Xでメニュー。<br>スマホ：画面下の十字キーとAボタン。</p><p>進行はメニューの「記録する」と章クリア時に保存されます。</p><div class="modal-buttons"><button id="close-modal">とじる</button></div>`);
$("#menu-toggle").onclick=()=>openMenu();$$('[data-close]').forEach(b=>b.onclick=()=>b.closest("dialog").close());$$('.tabs button').forEach(b=>b.onclick=()=>renderMenu(b.dataset.tab));
$$('#battle-actions button').forEach(b=>b.onclick=()=>command(b.dataset.command));
document.addEventListener("keydown",e=>{if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key))e.preventDefault();if(mode==="dialog"&&["Enter"," ","z","Z"].includes(e.key))return nextDialog();if(mode!=="world"){if(e.key==="Escape"&&$("#main-menu").open)$("#main-menu").close();return}const k=e.key.toLowerCase();if(k==="arrowup"||k==="w")move(0,-1,"up");else if(k==="arrowdown"||k==="s")move(0,1,"down");else if(k==="arrowleft"||k==="a")move(-1,0,"left");else if(k==="arrowright"||k==="d")move(1,0,"right");else if(["enter"," ","z"].includes(k))interact();else if(["escape","x"].includes(k))openMenu()});
$$('.mobile-controls button').forEach(b=>{const fire=e=>{e.preventDefault();if(b.dataset.key){const d={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[b.dataset.key];move(...d,b.dataset.key)}else if(b.dataset.action==="confirm")interact();else openMenu()};b.addEventListener("pointerdown",fire)});
window.addEventListener("pagehide",()=>{if(mode!=="title")save(true)});document.addEventListener("visibilitychange",()=>{if(document.hidden&&mode!=="title")save(true)});
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
refreshTitle();draw();
