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
  items:{"薬草":3,"星の霊薬":1,"世界樹の葉":0},stars:[],drops:{},moves:0,lastEvent:"星見村で目を覚ました",playTime:0,battles:0,started:Date.now(),settings:{sound:true,shake:true},flags:{},ending:false});
let state = freshState(), mode = "title", dialogQueue = [], afterDialog = null, battle = null, lastFrame = 0, toastTimer;
let audioCtx=null,musicTimer=null,musicKind="",musicStep=0;
const music={
  title:{tempo:320,lead:[64,67,71,76,71,67,64,null,62,66,69,74,69,66,62,null],bass:[40,null,40,null,43,null,43,null,38,null,38,null,43,null,43,null]},
  world:{tempo:185,lead:[64,64,67,69,71,69,67,64,62,62,64,67,69,67,64,null],bass:[40,null,47,null,45,null,47,null,38,null,45,null,43,null,47,null]},
  battle:{tempo:115,lead:[64,67,70,67,65,68,71,68,67,70,73,70,68,71,74,71],bass:[40,40,43,40,41,41,44,41,43,43,46,43,44,44,47,44]},
  boss:{tempo:100,lead:[52,55,58,61,55,58,61,64,54,57,60,63,57,60,63,66],bass:[28,28,31,31,30,30,33,33,28,28,35,35,30,30,37,37]},
  ending:{tempo:360,lead:[64,67,71,76,79,76,71,67,69,73,76,81,76,73,69,null],bass:[40,null,43,null,45,null,47,null,45,null,40,null,43,null,47,null]}
};

function unlockAudio(){if(!audioCtx)audioCtx=new (window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==="suspended")audioCtx.resume()}
function note(midi,duration=.12,type="square",volume=.025){if(!audioCtx||!state.settings.sound||midi==null)return;const o=audioCtx.createOscillator(),g=audioCtx.createGain(),now=audioCtx.currentTime;o.type=type;o.frequency.value=440*Math.pow(2,(midi-69)/12);g.gain.setValueAtTime(volume,now);g.gain.exponentialRampToValueAtTime(.0001,now+duration);o.connect(g).connect(audioCtx.destination);o.start(now);o.stop(now+duration)}
function switchMusic(kind){musicKind=kind;musicStep=0;clearInterval(musicTimer);musicTimer=null;if(!state.settings.sound||!audioCtx||!music[kind])return;const song=music[kind];const tick=()=>{note(song.lead[musicStep%song.lead.length],song.tempo/1250,"square",.022);note(song.bass[musicStep%song.bass.length],song.tempo/1100,"triangle",.028);musicStep++};tick();musicTimer=setInterval(tick,song.tempo)}
function toggleMusic(){state.settings.sound=!state.settings.sound;if(state.settings.sound){unlockAudio();switchMusic(mode==="battle"?(battle?.boss?"boss":"battle"):mode==="title"?"title":state.ending?"ending":"world")}else{clearInterval(musicTimer);musicTimer=null}save(true)}

const canvas = $("#game-canvas"), ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

function showScreen(id){ $$(".screen").forEach(s=>s.classList.toggle("active",s.id===id)); }
function hasSave(){ try{return !!localStorage.getItem(SAVE_KEY)}catch{return false} }
function save(silent=false){ try{state.savedAt=Date.now();localStorage.setItem(SAVE_KEY,JSON.stringify(state));if(!silent) toast("冒険の記録を保存しました");return true}catch{toast("保存できませんでした");return false} }
function load(){ try{const raw=localStorage.getItem(SAVE_KEY);if(!raw)return false;state={...freshState(),...JSON.parse(raw)};state.drops||={};state.started=Date.now();return true}catch{return false} }
function fmtTime(sec){return `${Math.floor(sec/3600)}:${String(Math.floor(sec/60)%60).padStart(2,"0")}`}
function totalTime(){return (state.playTime||0)+Math.floor((Date.now()-state.started)/1000)}

function startGame(isContinue=false, chapter=0){
  if(!isContinue){state=freshState();state.chapter=chapter;if(chapter){boostForChapter(chapter);state.stars=chapters.slice(0,chapter).map(c=>c.reward)} }
  mode="world";showScreen("game-screen");if(!isContinue)resetPosition();updateUI();draw();switchMusic("world");
  if(!isContinue || (state.step===0&&!state.flags[`intro${state.chapter}`])) introChapter(); else showRecap();
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
function move(dx,dy,dir){
  if(mode!=="world")return;state.dir=dir;
  if(dx===0&&dy===1&&state.x===10&&state.y===13){
    if(state.step===3&&state.chapter<4)return advanceChapter();
    return showDialog([{speaker:"門番",text:state.step===0?"旅立つ前に、村の北にいる人から話を聞いてください。":state.step===1?"西の星碑に、強い魔物の気配があります。":state.step===2?"北東の祭壇で星の光を取り戻せば、門を開けましょう。":"この先は、まだ深い闇に閉ざされています。"}]);
  }
  const nx=state.x+dx,ny=state.y+dy;if(!mapBlocked(nx,ny)){state.x=nx;state.y=ny;state.moves=(state.moves||0)+1;collectDrop();draw();if(state.moves%12===0){save(true);toast("ここまで自動セーブしました")}}
}

function draw(){
  const ch=chapters[state.chapter];ctx.fillStyle=ch.color;ctx.fillRect(0,0,640,480);
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){const even=(x+y)%2;ctx.fillStyle=even?"#ffffff08":"#00000008";ctx.fillRect(x*TILE,y*TILE,TILE,TILE);ctx.fillStyle=even?"#ffffff16":"#07152a18";ctx.fillRect(x*TILE+5+(y%2)*6,y*TILE+7+(x%3)*5,2,2);ctx.fillRect(x*TILE+23-(y%2)*5,y*TILE+22-(x%2)*6,2,2)}
  ctx.fillStyle="#cbb481";ctx.fillRect(9*TILE,0,3*TILE,480);ctx.fillRect(0,6*TILE,640,3*TILE);
  drawVillageWalls();
  ctx.fillStyle="#6f583d";[[2,2],[3,2],[17,2],[18,2],[2,11],[17,11],[7,5],[8,5],[12,9],[13,9],[6,12],[14,12]].forEach(([x,y])=>{ctx.fillRect(x*TILE+5,y*TILE+4,22,25);ctx.fillStyle="#254d32";ctx.fillRect(x*TILE,y*TILE,32,18);ctx.fillStyle="#6f583d"});
  drawMarker(10,7,ch.npc,"#f3d36b");drawMarker(4,4,state.step===1?"!":"星碑",state.step===1?"#ffde65":"#7f9eca");drawMarker(15,3,state.step===2?"!":"祭壇",state.step===2?"#ef7680":"#ba9fe5");
  chapterDrops().forEach(([x,y])=>{if(state.drops[dropKey(x,y)])return;ctx.fillStyle="#fff7a2";ctx.font="18px serif";ctx.fillText("✦",x*TILE+16,y*TILE+22)});
  ctx.fillStyle=state.step===3?"#ffd866":"#d8d3bf";ctx.fillRect(9*TILE,14*TILE,3*TILE,8);ctx.fillStyle="#081024";ctx.fillRect(9*TILE+8,14*TILE,3*TILE-16,8);ctx.fillStyle="#fff";ctx.font="11px sans-serif";ctx.fillText("南門",10.5*TILE,13.75*TILE);
  drawHero(state.x,state.y);updateCamera();
}
function updateCamera(){requestAnimationFrame(()=>{if(innerWidth>760||innerWidth>innerHeight){canvas.style.removeProperty("--camera-x");return}const wrap=canvas.parentElement,renderWidth=canvas.getBoundingClientRect().width,viewWidth=wrap.clientWidth,heroX=(state.x+.5)/COLS*renderWidth;const left=Math.max(viewWidth-renderWidth,Math.min(0,viewWidth/2-heroX));canvas.style.setProperty("--camera-x",`${Math.round(left)}px`)})}
function drawWallTile(x,y){const px=x*TILE,py=y*TILE;ctx.fillStyle="#30394c";ctx.fillRect(px,py,TILE,TILE);ctx.fillStyle="#596278";ctx.fillRect(px+2,py+2,28,6);ctx.fillStyle="#242b3b";ctx.fillRect(px+2,py+9,28,2);ctx.fillRect(px+2,py+21,28,2);ctx.fillStyle="#424b62";ctx.fillRect(px+3,py+12,12,8);ctx.fillRect(px+17,py+12,12,8);ctx.fillStyle="#7c87a2";ctx.fillRect(px+4,py+13,10,2);ctx.fillRect(px+18,py+13,10,2)}
function drawVillageWalls(){for(let x=0;x<COLS;x++){drawWallTile(x,0);if(x<9||x>11)drawWallTile(x,14)}for(let y=1;y<14;y++){drawWallTile(0,y);drawWallTile(19,y)}}
function facingToward(x,y){const dx=state.x-x,dy=state.y-y;return Math.abs(dx)>Math.abs(dy)?(dx<0?"left":"right"):(dy<0?"up":"down")}
function drawMarker(x,y,label,color){const px=x*TILE,py=y*TILE,dir=facingToward(x,y);ctx.fillStyle="#0008";ctx.fillRect(px-8,py-17,48,14);ctx.font="10px sans-serif";ctx.textAlign="center";ctx.fillStyle="#fff";ctx.fillText(label,px+16,py-7);ctx.fillStyle="#0005";ctx.fillRect(px+8,py+25,16,4);ctx.fillStyle="#f0c891";ctx.fillRect(px+10,py+5,12,10);ctx.fillStyle=color;ctx.fillRect(px+8,py+15,16,13);ctx.fillStyle="#fff";if(dir==="down"){ctx.fillRect(px+12,py+9,2,2);ctx.fillRect(px+18,py+9,2,2)}else if(dir==="left"){ctx.fillRect(px+10,py+9,2,2);ctx.fillRect(px+8,py+12,2,2)}else if(dir==="right"){ctx.fillRect(px+20,py+9,2,2);ctx.fillRect(px+22,py+12,2,2)}else{ctx.fillStyle="#5d3c28";ctx.fillRect(px+10,py+5,12,3)}}
function drawHero(x,y){const px=x*TILE,py=y*TILE,dir=state.dir;ctx.fillStyle="#0005";ctx.fillRect(px+6,py+27,20,4);ctx.fillStyle="#172855";if(dir==="left"||dir==="right"){ctx.fillRect(px+9,py+27,14,4)}else{ctx.fillRect(px+8,py+28,7,4);ctx.fillRect(px+19,py+28,7,4)}ctx.fillStyle="#243f85";ctx.fillRect(px+7,py+14,18,15);ctx.fillStyle="#1b2f70";ctx.fillRect(px+7,py+17,3,9);ctx.fillStyle="#ffd866";ctx.fillRect(px+13,py+18,6,6);ctx.fillStyle="#f0c891";ctx.fillRect(px+9,py+4,14,11);ctx.fillStyle="#67432d";ctx.fillRect(px+9,py+4,14,3);if(dir==="down"){ctx.fillStyle="#fff";ctx.fillRect(px+11,py+9,2,2);ctx.fillRect(px+19,py+9,2,2);ctx.fillStyle="#8c4d43";ctx.fillRect(px+15,py+13,3,1)}else if(dir==="left"){ctx.fillStyle="#fff";ctx.fillRect(px+10,py+9,2,2);ctx.fillStyle="#f0c891";ctx.fillRect(px+7,py+11,3,3)}else if(dir==="right"){ctx.fillStyle="#fff";ctx.fillRect(px+20,py+9,2,2);ctx.fillStyle="#f0c891";ctx.fillRect(px+22,py+11,3,3)}else{ctx.fillStyle="#67432d";ctx.fillRect(px+9,py+7,14,5)}}
function chapterDrops(){return [[3,10],[16,8],[11,2]]}
function dropKey(x,y){return `${state.chapter}-${x}-${y}`}
function dropCount(){return chapterDrops().filter(([x,y])=>state.drops[dropKey(x,y)]).length}
function collectDrop(){const found=chapterDrops().find(([x,y])=>x===state.x&&y===state.y&&!state.drops[dropKey(x,y)]);if(!found)return;state.drops[dropKey(...found)]=true;state.gold+=5;state.lastEvent="星のしずくを見つけた";const count=dropCount();if(count===3){state.gold+=20;state.hp=state.maxHp;state.mp=state.maxMp;toast("星のしずくが揃った！ 全回復＋20星貨")}else toast(`星のしずく ${count}/3　5星貨を入手`);updateUI();save(true)}

function startBattle(name,boss){
  const base=enemies[name], scale=1; battle={name,boss,maxHp:Math.round(base.hp*scale),hp:Math.round(base.hp*scale),atk:base.atk,def:base.def,xp:base.xp,gold:base.gold,color:base.color,guard:false,busy:false,phase:0};
  mode="battle";showScreen("battle-screen");switchMusic(boss?"boss":"battle");$("#enemy-name").textContent=name;$("#enemy-sprite").style.setProperty("--enemy",base.color);battleLog(`${name}が現れた！`);updateBattleUI();
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
  if(battle.boss&&battle.hp>0&&battle.phase===0&&battle.hp<=battle.maxHp/2){battle.phase=1;battle.atk+=2+state.chapter;text+=`\n${battle.name}は闇の力を解き放った！`}
  if(battle.boss&&state.chapter===4&&battle.hp>0&&battle.phase===1&&battle.hp<=battle.maxHp/4){battle.phase=2;battle.atk+=4;text+="\nヴェイルの胸で、最後の星が激しく瞬く！"}
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
  setTimeout(()=>{showScreen("game-screen");mode="world";switchMusic("world");state.hp=Math.min(state.maxHp,state.hp+Math.ceil(state.maxHp*.25));state.mp=Math.min(state.maxMp,state.mp+3);
    if(boss)finishChapter();else{state.step=2;state.lastEvent=`${battle.name}を倒した`;showDialog([{speaker:"アステル",text:"魔物の影から星の道が現れた。北東の祭壇へ向かおう。"}])}updateUI();draw();save(true)},1000);
}
function levelUp(){state.xp-=state.nextXp;state.level++;state.nextXp=Math.round(state.nextXp*1.45);state.maxHp+=10;state.maxMp+=4;state.atk+=3;state.def+=2;state.hp=state.maxHp;state.mp=state.maxMp}
function gameOver(){battleLog("アステルは力尽きた……");setTimeout(()=>{state.hp=state.maxHp;state.mp=state.maxMp;state.gold=Math.max(0,state.gold-Math.floor(state.gold*.15));showScreen("game-screen");mode="world";switchMusic("world");resetPosition();updateUI();draw();showDialog([{speaker:"星の声",text:"まだ、あなたの旅は終わっていない……。"}])},1100)}
function finishChapter(){
  const ch=chapters[state.chapter];state.stars.push(ch.reward);state.step=3;state.lastEvent=`${ch.reward}を取り戻した`;
  if(state.chapter===4){state.ending=true;save(true);ending();return}
  showDialog([{speaker:"星の声",text:`${ch.reward}が夜空へ還った。`},{speaker:ch.npc,text:"ありがとう、アステル。南門が開きました。門を抜ければ、次の地へ進めます。"}],()=>{state.x=10;state.y=12;state.dir="down";updateUI();draw();save(true)});
}
function advanceChapter(){state.chapter++;state.step=0;state.lastEvent="南門を抜け、次の地へ着いた";resetPosition();state.hp=state.maxHp;state.mp=state.maxMp;updateUI();draw();save(true);introChapter()}
function ending(){
  showScreen("game-screen");mode="dialog";switchMusic("ending");showDialog([{speaker:"ヴェイル",text:"そうか……星は、空にあるから輝くのではない。誰かを想う心に灯るのか。"},{speaker:"アステル",text:"一緒に帰ろう。夜があるから、星灯りは見えるんだ。"},{speaker:"",text:"五つの星は空へ還り、長い夜は明けた。人々はもう、星に願うだけではない。互いの心に灯りを見つけた。"}],showEndingAnimation)}
let endingTimer=null;
function showEndingAnimation(){mode="ending";showScreen("ending-screen");$("#ending-line").textContent=`五つの星は、ふたたび夜空へ。冒険時間 ${fmtTime(totalTime())}`;clearTimeout(endingTimer);endingTimer=setTimeout(showEndingResult,10500)}
function showEndingResult(){clearTimeout(endingTimer);openModal(`<h2>星灯りが戻った</h2><p>全5章クリア、おめでとうございます。</p><p>Lv ${state.level}　冒険時間 ${fmtTime(totalTime())}　戦闘 ${state.battles}回</p><div class="modal-buttons"><button id="epilogue">その後の世界を歩く</button><button id="back-title">タイトルへ</button></div>`);$("#epilogue").onclick=()=>{$("#modal").close();mode="world";showScreen("game-screen");switchMusic("world");state.step=3;draw();toast("星の祝福で満ちた世界");};$("#back-title").onclick=()=>{$("#modal").close();returnTitle()}}
$("#skip-ending").onclick=showEndingResult;

function updateUI(){
  const ch=chapters[state.chapter];$("#area-name").textContent=ch.area;$("#chapter-label").textContent=ch.title.split("　")[0];$("#hero-level").textContent=`Lv ${state.level}`;$("#hp-text").textContent=`${state.hp}/${state.maxHp}`;$("#mp-text").textContent=`${state.mp}/${state.maxMp}`;$("#hp-bar").style.width=`${state.hp/state.maxHp*100}%`;$("#mp-bar").style.width=`${state.mp/state.maxMp*100}%`;$("#atk-text").textContent=state.atk;$("#def-text").textContent=state.def;$("#gold-text").textContent=state.gold;$("#exp-text").textContent=state.xp;$("#quest-text").textContent=currentQuest();$("#quest-time").textContent=`目安 ${[3,5,5,1][state.step]||3}分`;$("#side-quest").textContent=`寄り道：星のしずく ${dropCount()}/3`;
}
function currentQuest(){const ch=chapters[state.chapter];return [ch.quest,"西の星碑を調べよう","北東の祭壇へ進もう",state.chapter<4?"南門から次の地へ進もう":"星灯りを見届けよう"][state.step]||ch.quest}
function showRecap(){openModal(`<h2>おかえりなさい</h2><p><strong>前回：</strong>${state.lastEvent||"冒険の途中"}</p><p><strong>現在地：</strong>${chapters[state.chapter].area}</p><p><strong>次の目標（約${[3,5,5,1][state.step]||3}分）：</strong><br>${currentQuest()}</p><p>星のしずく ${dropCount()}/3</p><div class="modal-buttons"><button id="resume-now">冒険を再開</button></div>`);$("#resume-now").onclick=()=>{$("#modal").close();toast("短い時間でも、よい旅を！")}}
function toast(text){const t=$("#toast");t.textContent=text;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),1800)}
function rand(a,b){return Math.floor(Math.random()*(b-a+1))+a}
function shake(){if(!state.settings.shake)return;$("#battle-screen").animate([{transform:"translateX(-5px)"},{transform:"translateX(5px)"},{transform:"none"}],{duration:180})}

function openMenu(tab="status"){$("#main-menu").showModal();renderMenu(tab)}
function renderMenu(tab){
  $$(".tabs button").forEach(b=>b.classList.toggle("active",b.dataset.tab===tab));const c=$("#menu-content");
  if(tab==="status")c.innerHTML=`<h3>アステル　Lv ${state.level}</h3><p>HP ${state.hp}/${state.maxHp}　MP ${state.mp}/${state.maxMp}<br>攻撃 ${state.atk}　守備 ${state.def}<br>次のレベルまで ${state.nextXp-state.xp} EXP</p><p>集めた星：${state.stars.length}/5</p><div class="menu-actions"><button id="heal">休息する（10星貨）</button></div>`;
  if(tab==="items")c.innerHTML=`<div class="item-list">${Object.entries(state.items).map(([n,q])=>`<div class="item-row"><span>${n}</span><b>×${q}</b></div>`).join("")||"どうぐはありません"}</div><p>薬草は戦闘中にHPを35回復。星の霊薬はHP・MPを全回復します。</p>`;
  if(tab==="records")c.innerHTML=`<div class="records"><p>${chapters[state.chapter].title}</p><p>冒険時間 ${fmtTime(totalTime())}　戦闘 ${state.battles}回</p><p>${state.stars.map(s=>`★ ${s}`).join("<br>")||"星はまだ見つかっていない"}</p></div><div class="menu-actions"><button id="save-now">記録する</button><button id="to-title">タイトルへ</button></div>`;
  if(tab==="settings")c.innerHTML=`<div class="settings-row"><span>BGM</span><button id="toggle-music">${state.settings.sound?"ON":"OFF"}</button></div><div class="settings-row"><span>画面の揺れ</span><button id="toggle-shake">${state.settings.shake?"ON":"OFF"}</button></div><div class="menu-actions"><button id="save-now">セーブする</button><button id="to-title">タイトルへ戻る</button></div><p>キーボード：矢印/WASDで移動、Enter/Space/Zで決定、Escでメニュー。</p>`;
  $("#heal")?.addEventListener("click",()=>{if(state.gold<10)return toast("星貨が足りません");state.gold-=10;state.hp=state.maxHp;state.mp=state.maxMp;updateUI();renderMenu(tab)});
  $("#save-now")?.addEventListener("click",()=>save());$("#to-title")?.addEventListener("click",returnTitle);$("#toggle-music")?.addEventListener("click",()=>{toggleMusic();renderMenu(tab)});$("#toggle-shake")?.addEventListener("click",()=>{state.settings.shake=!state.settings.shake;renderMenu(tab)});
}
function returnTitle(){if(mode!=="title"){state.playTime=totalTime();state.started=Date.now();save(true)}$("#main-menu").close();mode="title";showScreen("title-screen");switchMusic("title");refreshTitle()}
function openModal(html){$("#modal-content").innerHTML=html;$("#modal").showModal()}
function refreshTitle(){$("#continue-game").disabled=!hasSave()}
const introLines=["かつて、夜空には五つの星が輝いていた。","だが流星祭の夜、星はひとつ残らず消えた。","少年の手に残されたのは、かすかな星のかけら。","いま、世界に星灯りを取り戻す旅が始まる。"];
let introTimer=null,introIndex=0;
function beginIntro(){unlockAudio();switchMusic("title");$("#intro-screen").classList.add("intro-playing");introIndex=0;$("#intro-text").textContent=introLines[0];clearInterval(introTimer);introTimer=setInterval(()=>{introIndex++;if(introIndex>=introLines.length)return finishIntro();const copy=$(".intro-copy");copy.style.animation="none";void copy.offsetWidth;copy.style.animation="";$("#intro-text").textContent=introLines[introIndex]},2400)}
function finishIntro(){clearInterval(introTimer);sessionStorage.setItem("hoshiakariIntroSeen","1");mode="title";showScreen("title-screen");refreshTitle();switchMusic("title")}
$("#begin-intro").onclick=beginIntro;$("#skip-intro").onclick=()=>{unlockAudio();finishIntro()};

$("#new-game").onclick=()=>{if(hasSave())openModal(`<h2>新しい冒険</h2><p>現在の記録に上書きします。よろしいですか？</p><div class="modal-buttons"><button id="yes-new">はじめる</button><button id="no-new">もどる</button></div>`),$("#yes-new").onclick=()=>{$("#modal").close();startGame(false)},$("#no-new").onclick=()=>$("#modal").close();else startGame(false)};
$("#continue-game").onclick=()=>{if(load())startGame(true)};
$("#chapter-select").onclick=()=>openModal(`<h2>章から遊ぶ</h2><p>物語と推奨能力で各章を開始します。</p><div class="item-list">${chapters.map((c,i)=>`<button class="menu-button chapter" data-ch="${i}">${c.title}</button>`).join("")}</div><div class="modal-buttons"><button id="close-modal">もどる</button></div>`);
$("#modal").addEventListener("click",e=>{if(e.target.id==="close-modal")$("#modal").close();const b=e.target.closest(".chapter");if(b){$("#modal").close();startGame(false,+b.dataset.ch)}});
$("#open-help").onclick=()=>openModal(`<h2>遊びかた</h2><p>マップの人物や「！」の一歩手前で決定してください。</p><p>PC：矢印/WASDで移動、Enter/Space/Zで決定、Esc/Xでメニュー。<br>スマホ：画面下の十字キーと中央の「決定」キー。</p><p>12歩ごとの自動セーブに加え、右側の「セーブ」からいつでも記録できます。</p><div class="modal-buttons"><button id="close-modal">とじる</button></div>`);
$("#menu-toggle").onclick=()=>openMenu();$$('[data-close]').forEach(b=>b.onclick=()=>b.closest("dialog").close());$$('.tabs button').forEach(b=>b.onclick=()=>renderMenu(b.dataset.tab));
$$('#battle-actions button').forEach(b=>b.onclick=()=>command(b.dataset.command));
document.addEventListener("keydown",e=>{if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key))e.preventDefault();if(mode==="dialog"&&["Enter"," ","z","Z"].includes(e.key))return nextDialog();if(mode!=="world"){if(e.key==="Escape"&&$("#main-menu").open)$("#main-menu").close();return}const k=e.key.toLowerCase();if(k==="arrowup"||k==="w")move(0,-1,"up");else if(k==="arrowdown"||k==="s")move(0,1,"down");else if(k==="arrowleft"||k==="a")move(-1,0,"left");else if(k==="arrowright"||k==="d")move(1,0,"right");else if(["enter"," ","z"].includes(k))interact();else if(["escape","x"].includes(k))openMenu()});
let holdDelay=null,holdTimer=null;function stopHold(){clearTimeout(holdDelay);clearInterval(holdTimer);holdDelay=null;holdTimer=null}
$$('.mobile-controls button').forEach(b=>{const fire=e=>{if(e.button!==undefined&&e.button!==0)return;e.preventDefault();if(b.dataset.key){const d={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[b.dataset.key],step=()=>move(...d,b.dataset.key);stopHold();step();try{b.setPointerCapture(e.pointerId)}catch{}holdDelay=setTimeout(()=>{holdTimer=setInterval(step,115)},280)}else if(b.dataset.action==="confirm")interact();else if(b.dataset.action==="save")save();else if(b.dataset.action==="settings")openMenu("settings")};b.addEventListener("pointerdown",fire);["pointerup","pointercancel","lostpointercapture"].forEach(type=>b.addEventListener(type,stopHold))});document.addEventListener("pointerup",stopHold);
let lastTouchEnd=0;document.addEventListener("dblclick",e=>e.preventDefault(),{passive:false});document.addEventListener("gesturestart",e=>e.preventDefault(),{passive:false});document.addEventListener("touchend",e=>{const now=Date.now();if(now-lastTouchEnd<320)e.preventDefault();lastTouchEnd=now},{passive:false});
window.addEventListener("pagehide",()=>{if(mode!=="title")save(true)});document.addEventListener("visibilitychange",()=>{if(document.hidden&&mode!=="title")save(true)});window.addEventListener("resize",updateCamera);
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
document.addEventListener("pointerdown",()=>{unlockAudio();if(!musicTimer)switchMusic(mode==="title"?"title":mode==="battle"?(battle?.boss?"boss":"battle"):state.ending?"ending":"world")},{once:true});
if(sessionStorage.getItem("hoshiakariIntroSeen")){mode="title";showScreen("title-screen")}refreshTitle();draw();
