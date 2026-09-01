"use strict";

const SAVE_KEY = "hoshiakari_complete_v1";
const TILE = 32, COLS = 20, ROWS = 15;
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

const chapters = [
  {title:"隨ｬ荳遶�縲關ｽ縺｡縺滓弌", area:"譏溯ｦ区搗", quest:"譚鷹聞繧ｻ繝ｬ繧ｹ縺ｫ隧ｱ繧定◇縺薙≧", npc:"繧ｻ繝ｬ繧ｹ", color:"#429650",
    intro:["蜊�ｹｴ縺ｫ荳蠎ｦ縺ｮ豬∵弌逾ｭ縲ゅ◎縺ｮ螟懊∫ｩｺ縺九ｉ譏溘′豸医∴縺溘�","譚代�蟆大ｹｴ繧｢繧ｹ繝�Ν縺ｮ謇九↓縺ｯ縲√�縺ｨ縺､縺ｮ譏溽援縺�縺代′谿九＆繧後※縺�◆縲�"],
    talk:["繧｢繧ｹ繝�Ν繧医∝圏縺ｮ荳倥∈陦後″縺ｪ縺輔＞縲よ弌蝟ｰ縺��蠖ｱ縺檎樟繧後◆縺昴≧縺ｧ縺吶�","縺昴�譏溽援縺ｯ縲√″縺｣縺ｨ縺ゅ↑縺溘ｒ蟆弱￥縺ｧ縺励ｇ縺��"], enemy:"蠖ｱ繧ｹ繝ｩ繧､繝�", boss:"譏溷眠縺��迯｣", item:"阮ｬ闕�", reward:"譏溘�縺九￠繧峨�鮟取�"},
  {title:"隨ｬ莠檎ｫ�縲譛亥ｽｱ縺ｮ譽ｮ", area:"譛亥ｽｱ縺ｮ譽ｮ", quest:"譽ｮ逡ｪ繝ｪ繝･繝阪�隧ｱ繧定◇縺薙≧", npc:"繝ｪ繝･繝�", color:"#24654c",
    intro:["譛蛻昴�譏溘ｒ蜿悶ｊ謌ｻ縺励◆繧｢繧ｹ繝�Ν縺ｯ縲∵怦蠖ｱ縺ｮ譽ｮ縺ｸ蜷代°縺��","譽ｮ縺ｯ豺ｱ縺�悛繧翫↓豐医∩縲∫坤縺溘■縺ｮ蠢�ｂ髣�↓隕�ｏ繧後※縺�◆縲�"],
    talk:["譽ｮ縺ｮ螂･縺ｧ縲∫悛繧翫�鬲泌･ｳ縺梧弌繧貞ｰ√§縺ｦ縺�∪縺吶�","縺薙�譛磯愆繧呈戟縺｣縺ｦ縲ゅ″縺｣縺ｨ蟷ｻ繧堤�ｴ繧後ｋ縺ｯ縺壹�"], enemy:"螟｢隕九さ繧ｦ繝｢繝ｪ", boss:"逵�繧翫�鬲泌･ｳ繝弱け繧ｹ", item:"譛医�髮ｫ", reward:"譏溘�縺九￠繧峨�諷域�"},
  {title:"隨ｬ荳臥ｫ�縲遐よ凾險医�邇矩�", area:"遐ょ｡ｵ縺ｮ邇矩�", quest:"蟄ｦ閠�ヨ繧ｭ繧ｪ縺ｨ隧ｱ縺昴≧", npc:"繝医く繧ｪ", color:"#b28345",
    intro:["莠後▽縺ｮ譏溘�縲∵凾繧呈ｭ｢繧√◆遐よｼ�縺ｮ邇矩�繧呈欠縺礼､ｺ縺励◆縲�","縺昴％縺ｧ縺ｯ蜷後§荳譌･縺後∫卆蟷ｴ繧ゅ�髢薙￥繧願ｿ斐＆繧後※縺�◆縲�"],
    talk:["譎りｨ亥｡斐�荳ｻ縺後∵凾髢薙◎縺ｮ繧ゅ�繧帝｣溘∋縺ｦ縺�∪縺吶�","豁ｯ霆翫ｒ豁｣縺励∵ｭ｢縺ｾ縺｣縺滄据繧帝ｳｴ繧峨＠縺ｦ縺上□縺輔＞縲�"], enemy:"遐る延繧ｴ繝ｼ繝ｬ繝�", boss:"譎ょ眠繧峨＞繧ｯ繝ｭ繝弱せ", item:"譏溘�髴願脈", reward:"譏溘�縺九￠繧峨�譎�"},
  {title:"隨ｬ蝗帷ｫ�縲遨ｺ縺ｮ豬ｷ", area:"髮ｲ豬ｷ縺ｮ貂ｯ", quest:"闊ｹ髟ｷ繝溘Λ縺ｫ莨壹♀縺�", npc:"繝溘Λ", color:"#4f8db8",
    intro:["荳峨▽縺ｮ譏溘′螟ｩ縺ｫ驕薙ｒ謠上″縲�峇豬ｷ縺ｸ邯壹￥貂ｯ縺悟ｧｿ繧堤樟縺励◆縲�","譛蠕後�闊ｪ霍ｯ繧貞ｮ医ｋ遶懊�縲∵ご縺励＞諤偵ｊ縺ｫ蝗壹ｏ繧後※縺�ｋ縲�"],
    talk:["蠏舌�蜷代％縺�↓譏溘�逾樊ｮｿ縺後≠繧翫∪縺吶�","遶懊ｒ蛟偵☆縺�縺代〒縺ｯ縺�繧√ゅ◎縺ｮ蠢�↓縲∵弌轣ｯ繧翫ｒ隕九○縺ｦ縲�"], enemy:"髮ｲ豬ｷ繧ｯ繝ｩ繧ｲ", boss:"闥ｼ螟ｩ遶懊い繧ｺ繝ｼ繝ｫ", item:"遶懊�魍�", reward:"譏溘�縺九￠繧峨�蜍�ｰ�"},
  {title:"隨ｬ莠皮ｫ�縲譏溘↑縺榊､�", area:"譏溷ｽｱ縺ｮ蝓�", quest:"邇句ｺｧ縺ｸ騾ｲ繧ゅ≧", npc:"譏溘�險俶�", color:"#493c72",
    intro:["蝗帙▽縺ｮ譏溘′謠�▲縺溘→縺阪∽ｸ也阜繧定ｦ�≧螟懊�豁｣菴薙′譏弱ｉ縺九↓縺ｪ繧九�","譏溘ｒ螂ｪ縺｣縺溽視縺ｯ縲√°縺､縺ｦ莠ｺ縲�ｒ謨代♀縺�→縺励◆蜍��□縺｣縺溘�"],
    talk:["髣�視繝ｴ繧ｧ繧､繝ｫ繧ゅ∪縺溘∬ｪｰ縺九ｒ謨代＞縺溘°縺｣縺溘�","縺ゅ↑縺溘′髮�ａ縺溷�縺ｪ繧峨∝殴縺ｨ縺ｯ驕輔≧遲斐∴繧堤､ｺ縺帙ｋ縲�"], enemy:"陌夂┌縺ｮ鬨主｣ｫ", boss:"髣�視繝ｴ繧ｧ繧､繝ｫ", item:"荳也阜讓ｹ縺ｮ闡�", reward:"譛蠕後�譏�"}
];

const enemies = {
  "蠖ｱ繧ｹ繝ｩ繧､繝�":{hp:22,atk:5,def:1,xp:9,gold:6,color:"#68509c"}, "譏溷眠縺��迯｣":{hp:48,atk:8,def:2,xp:30,gold:24,color:"#804453"},
  "螟｢隕九さ繧ｦ繝｢繝ｪ":{hp:38,atk:9,def:3,xp:18,gold:12,color:"#54548f"}, "逵�繧翫�鬲泌･ｳ繝弱け繧ｹ":{hp:80,atk:13,def:5,xp:60,gold:45,color:"#714c8e"},
  "遐る延繧ｴ繝ｼ繝ｬ繝�":{hp:65,atk:15,def:7,xp:32,gold:24,color:"#9d744e"}, "譎ょ眠繧峨＞繧ｯ繝ｭ繝弱せ":{hp:125,atk:20,def:9,xp:100,gold:75,color:"#956044"},
  "髮ｲ豬ｷ繧ｯ繝ｩ繧ｲ":{hp:92,atk:22,def:9,xp:48,gold:35,color:"#5c91b0"}, "闥ｼ螟ｩ遶懊い繧ｺ繝ｼ繝ｫ":{hp:185,atk:28,def:12,xp:160,gold:110,color:"#427da8"},
  "陌夂┌縺ｮ鬨主｣ｫ":{hp:145,atk:31,def:14,xp:70,gold:55,color:"#4a4264"}, "髣�視繝ｴ繧ｧ繧､繝ｫ":{hp:280,atk:38,def:17,xp:300,gold:0,color:"#351f4c"}
};

const freshState = () => ({version:1,chapter:0,step:0,x:10,y:11,dir:"up",level:1,xp:0,nextXp:24,hp:34,maxHp:34,mp:12,maxMp:12,atk:8,def:4,gold:10,
  items:{"阮ｬ闕�":3,"譏溘�髴願脈":1,"荳也阜讓ｹ縺ｮ闡�":0},stars:[],drops:{},moves:0,lastEvent:"譏溯ｦ区搗縺ｧ逶ｮ繧定ｦ壹∪縺励◆",playTime:0,battles:0,started:Date.now(),settings:{sound:true,shake:true},flags:{},ending:false});
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
function save(silent=false){ try{state.savedAt=Date.now();localStorage.setItem(SAVE_KEY,JSON.stringify(state));if(!silent) toast("蜀帝匱縺ｮ險倬鹸繧剃ｿ晏ｭ倥＠縺ｾ縺励◆");return true}catch{toast("菫晏ｭ倥〒縺阪∪縺帙ｓ縺ｧ縺励◆");return false} }
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
function introChapter(){const ch=chapters[state.chapter];state.flags[`intro${state.chapter}`]=true;showDialog([{speaker:ch.title,text:ch.intro[0]},{speaker:"",text:ch.intro[1]},{speaker:"繧｢繧ｹ繝�Ν",text:state.chapter?"縺薙�譏溽援縺碁怫縺医※縺�ｋ縲ょ�縺ｸ騾ｲ繧ゅ≧縲�":"縺倥＞縺｡繧�ｓ縺ｮ蠖｢隕九′蜈峨▲縺ｦ繧銀ｦ窶ｦ譚鷹聞縺ｫ閨槭＞縺ｦ縺ｿ繧医≧縲�"}]);}

function showDialog(lines, done=null){ dialogQueue=[...lines];afterDialog=done;mode="dialog";$("#message-box").classList.remove("hidden");nextDialog(); }
function nextDialog(){
  if(dialogQueue.length){const l=dialogQueue.shift();$("#speaker").textContent=l.speaker||"";$("#message-text").textContent=l.text;return}
  $("#message-box").classList.add("hidden");mode="world";const fn=afterDialog;afterDialog=null;if(fn)fn();
}
function choose(options){mode="choice";const box=$("#choice-box");box.innerHTML="";options.forEach(o=>{const b=document.createElement("button");b.textContent=o.label;b.onclick=()=>{box.classList.add("hidden");o.action()};box.append(b)});box.classList.remove("hidden")}

function interact(){
  if(mode==="dialog")return nextDialog(); if(mode!=="world")return;
  const ch=chapters[state.chapter];
  if(near(10,7) && state.step===0){showDialog([{speaker:"繧｢繧ｹ繝�Ν",text:`${ch.npc}縺輔ｓ縲∵弌縺ｮ蜈峨ｒ蜿悶ｊ謌ｻ縺呎焔縺後°繧翫ｒ遏･繧翫∪縺帙ｓ縺具ｼ歔},...ch.talk.map(t=>({speaker:ch.npc,text:t}))],()=>{state.step=1;state.items[ch.item]=(state.items[ch.item]||0)+1;toast(`${ch.item}繧呈焔縺ｫ蜈･繧後◆`);updateUI();save(true)});return}
  if(near(4,4) && state.step===1){showDialog([{speaker:"繧｢繧ｹ繝�Ν",text:"譏溘�豌鈴�窶ｦ窶ｦ縺ｧ繧ゅ�ｭ皮黄縺悟ｮ医▲縺ｦ縺�ｋ��"}],()=>startBattle(ch.enemy,false));return}
  if(near(15,3) && state.step===2){showDialog([{speaker:"�滂ｼ滂ｼ�",text:state.chapter===4?"譏溘�莠ｺ繧呈舞繧上↑縺�ょｸ梧悍縺薙◎縺後√ｂ縺｣縺ｨ繧よｷｱ縺�ｵｶ譛帙ｒ逕溘�縲�":"縺薙％縺九ｉ蜈医∈縺ｯ陦後°縺帙〓縲よ弌縺ｮ蜈峨�謌代ｉ縺ｮ繧ゅ�縺�縲�"},{speaker:"繧｢繧ｹ繝�Ν",text:"縺ｿ繧薙↑縺悟ｾ�▲縺ｦ縺�ｋ縲よ弌轣ｯ繧翫ｒ縲∝ｿ�★蜿悶ｊ謌ｻ縺呻ｼ�"}],()=>startBattle(ch.boss,true));return}
  showDialog([{speaker:"繧｢繧ｹ繝�Ν",text:state.step===0?`${ch.npc}縺ｯ蠎��ｴ縺ｮ蛹励↓縺�ｋ縺ｯ縺壹□縲Ａ:state.step===1?"隘ｿ縺ｮ譏溽｢代°繧峨�ｭ皮黄縺ｮ豌鈴�縺後☆繧九�":state.step===2?"蛹玲擲縺ｮ逾ｭ螢�∈騾ｲ繧ゅ≧縲�":"譏溽援縺後∵ｬ｡縺ｮ驕薙ｒ遉ｺ縺励※縺�ｋ縲�"}]);
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
    return showDialog([{speaker:"髢逡ｪ",text:state.step===0?"譌�ｫ九▽蜑阪↓縲∵搗縺ｮ蛹励↓縺�ｋ莠ｺ縺九ｉ隧ｱ繧定◇縺�※縺上□縺輔＞縲�":state.step===1?"隘ｿ縺ｮ譏溽｢代↓縲∝ｼｷ縺�ｭ皮黄縺ｮ豌鈴�縺後≠繧翫∪縺吶�":state.step===2?"蛹玲擲縺ｮ逾ｭ螢�〒譏溘�蜈峨ｒ蜿悶ｊ謌ｻ縺帙�縲�摩繧帝幕縺代∪縺励ｇ縺��":"縺薙�蜈医�縲√∪縺�豺ｱ縺�裸縺ｫ髢峨＊縺輔ｌ縺ｦ縺�∪縺吶�"}]);
  }
  const nx=state.x+dx,ny=state.y+dy;if(!mapBlocked(nx,ny)){state.x=nx;state.y=ny;state.moves=(state.moves||0)+1;collectDrop();draw();if(state.moves%12===0){save(true);toast("縺薙％縺ｾ縺ｧ閾ｪ蜍輔そ繝ｼ繝悶＠縺ｾ縺励◆")}}
}

function draw(){
  const ch=chapters[state.chapter];ctx.fillStyle=ch.color;ctx.fillRect(0,0,640,480);
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){const even=(x+y)%2;ctx.fillStyle=even?"#ffffff08":"#00000008";ctx.fillRect(x*TILE,y*TILE,TILE,TILE)}
  ctx.fillStyle="#cbb481";ctx.fillRect(9*TILE,0,3*TILE,480);ctx.fillRect(0,6*TILE,640,3*TILE);
  ctx.fillStyle="#6f583d";[[2,2],[3,2],[17,2],[18,2],[2,11],[17,11],[7,5],[8,5],[12,9],[13,9],[6,12],[14,12]].forEach(([x,y])=>{ctx.fillRect(x*TILE+5,y*TILE+4,22,25);ctx.fillStyle="#254d32";ctx.fillRect(x*TILE,y*TILE,32,18);ctx.fillStyle="#6f583d"});
  drawMarker(10,7,ch.npc,"#f3d36b");drawMarker(4,4,state.step===1?"!":"譏溽｢�",state.step===1?"#ffde65":"#7f9eca");drawMarker(15,3,state.step===2?"!":"逾ｭ螢�",state.step===2?"#ef7680":"#ba9fe5");
  chapterDrops().forEach(([x,y])=>{if(state.drops[dropKey(x,y)])return;ctx.fillStyle="#fff7a2";ctx.font="18px serif";ctx.fillText("笨ｦ",x*TILE+16,y*TILE+22)});
  ctx.fillStyle=state.step===3?"#ffd866":"#d8d3bf";ctx.fillRect(9*TILE,14*TILE,3*TILE,8);ctx.fillStyle="#081024";ctx.fillRect(9*TILE+8,14*TILE,3*TILE-16,8);ctx.fillStyle="#fff";ctx.font="11px sans-serif";ctx.fillText("蜊鈴摩",10.5*TILE,13.75*TILE);
  drawHero(state.x,state.y);updateCamera();
}
function updateCamera(){requestAnimationFrame(()=>{if(innerWidth>760||innerWidth>innerHeight){canvas.style.removeProperty("--camera-x");return}const wrap=canvas.parentElement,renderWidth=canvas.getBoundingClientRect().width,viewWidth=wrap.clientWidth,heroX=(state.x+.5)/COLS*renderWidth;const left=Math.max(viewWidth-renderWidth,Math.min(0,viewWidth/2-heroX));canvas.style.setProperty("--camera-x",`${Math.round(left)}px`)})}
function drawMarker(x,y,label,color){ctx.fillStyle="#0008";ctx.fillRect(x*TILE-8,y*TILE-17,48,14);ctx.font="10px sans-serif";ctx.textAlign="center";ctx.fillStyle="#fff";ctx.fillText(label,x*TILE+16,y*TILE-7);ctx.fillStyle=color;ctx.fillRect(x*TILE+8,y*TILE+7,16,20);ctx.fillStyle="#fff";ctx.fillRect(x*TILE+11,y*TILE+10,4,4);ctx.fillRect(x*TILE+18,y*TILE+10,4,4)}
function drawHero(x,y){const px=x*TILE,py=y*TILE;ctx.fillStyle="#0005";ctx.fillRect(px+7,py+25,20,5);ctx.fillStyle="#f0c891";ctx.fillRect(px+9,py+4,14,10);ctx.fillStyle="#243f85";ctx.fillRect(px+7,py+14,18,15);ctx.fillStyle="#ffd866";ctx.fillRect(px+13,py+18,6,6);ctx.fillStyle="#172855";ctx.fillRect(px+8,py+29,7,3);ctx.fillRect(px+19,py+29,7,3)}
function chapterDrops(){return [[3,10],[16,8],[11,2]]}
function dropKey(x,y){return `${state.chapter}-${x}-${y}`}
function dropCount(){return chapterDrops().filter(([x,y])=>state.drops[dropKey(x,y)]).length}
function collectDrop(){const found=chapterDrops().find(([x,y])=>x===state.x&&y===state.y&&!state.drops[dropKey(x,y)]);if(!found)return;state.drops[dropKey(...found)]=true;state.gold+=5;state.lastEvent="譏溘�縺励★縺上ｒ隕九▽縺代◆";const count=dropCount();if(count===3){state.gold+=20;state.hp=state.maxHp;state.mp=state.maxMp;toast("譏溘�縺励★縺上′謠�▲縺滂ｼ� 蜈ｨ蝗槫ｾｩ��20譏溯ｲｨ")}else toast(`譏溘�縺励★縺� ${count}/3縲5譏溯ｲｨ繧貞�謇義);updateUI();save(true)}

function startBattle(name,boss){
  const base=enemies[name], scale=1; battle={name,boss,maxHp:Math.round(base.hp*scale),hp:Math.round(base.hp*scale),atk:base.atk,def:base.def,xp:base.xp,gold:base.gold,color:base.color,guard:false,busy:false,phase:0};
  mode="battle";showScreen("battle-screen");switchMusic(boss?"boss":"battle");$("#enemy-name").textContent=name;$("#enemy-sprite").style.setProperty("--enemy",base.color);battleLog(`${name}縺檎樟繧後◆�～);updateBattleUI();
}
function battleLog(text){$("#battle-log").textContent=text}
function updateBattleUI(){
  $("#enemy-hp-bar").style.width=`${Math.max(0,battle.hp/battle.maxHp*100)}%`;$("#battle-level").textContent=`Lv ${state.level}`;$("#battle-hp").textContent=`${state.hp}/${state.maxHp}`;$("#battle-mp").textContent=`${state.mp}/${state.maxMp}`;
  $$("#battle-actions button").forEach(b=>b.disabled=battle.busy);
}
function command(cmd){
  if(mode!=="battle"||battle.busy)return;battle.busy=true;let text="";
  if(cmd==="attack"){const dmg=Math.max(1,state.atk+rand(0,5)-battle.def);battle.hp-=dmg;text=`繧｢繧ｹ繝�Ν縺ｮ謾ｻ謦�ｼ� ${battle.name}縺ｫ${dmg}縺ｮ繝繝｡繝ｼ繧ｸ�～}
  else if(cmd==="star"){if(state.mp<4){battle.busy=false;battleLog("MP縺瑚ｶｳ繧翫↑縺�ｼ�");return}state.mp-=4;const dmg=Math.max(5,Math.round(state.atk*1.8)+rand(0,7)-Math.floor(battle.def/2));battle.hp-=dmg;text=`譏溷�譁ｬ�� ${dmg}縺ｮ繝繝｡繝ｼ繧ｸ�～}
  else if(cmd==="guard"){battle.guard=true;text="繧｢繧ｹ繝�Ν縺ｯ譏溽援繧偵°縺悶＠縺ｦ霄ｫ繧貞ｮ医▲縺溘�"}
  else if(cmd==="item"){battle.busy=false;openBattleItems();return}
  if(battle.boss&&battle.hp>0&&battle.phase===0&&battle.hp<=battle.maxHp/2){battle.phase=1;battle.atk+=2+state.chapter;text+=`\n${battle.name}縺ｯ髣��蜉帙ｒ隗｣縺肴叛縺｣縺滂ｼ～}
  if(battle.boss&&state.chapter===4&&battle.hp>0&&battle.phase===1&&battle.hp<=battle.maxHp/4){battle.phase=2;battle.atk+=4;text+="\n繝ｴ繧ｧ繧､繝ｫ縺ｮ閭ｸ縺ｧ縲∵怙蠕後�譏溘′豼縺励￥迸ｬ縺擾ｼ�"}
  battleLog(text);updateBattleUI();setTimeout(()=>battle.hp<=0?winBattle():enemyTurn(),650);
}
function openBattleItems(){
  const usable=[{name:"阮ｬ闕�",heal:35},{name:"譏溘�髴願脈",heal:999,mp:999},{name:"荳也阜讓ｹ縺ｮ闡�",heal:999}].filter(i=>(state.items[i.name]||0)>0);
  if(!usable.length){battleLog("菴ｿ縺医ｋ縺ｩ縺�＄縺後↑縺�ｼ�");return}
  choose(usable.map(i=>({label:`${i.name} ﾃ�${state.items[i.name]}`,action:()=>{mode="battle";state.items[i.name]--;state.hp=Math.min(state.maxHp,state.hp+i.heal);if(i.mp)state.mp=state.maxMp;battleLog(`${i.name}繧剃ｽｿ縺｣縺溘ょ鴨縺悟屓蠕ｩ縺励◆�～);battle.busy=true;updateBattleUI();setTimeout(enemyTurn,600)}})).concat({label:"繧ゅ←繧�",action:()=>{mode="battle";battle.busy=false;updateBattleUI()}}));
}
function enemyTurn(){
  const raw=Math.max(1,battle.atk+rand(0,5)-state.def),dmg=battle.guard?Math.ceil(raw/2):raw;battle.guard=false;state.hp-=dmg;battleLog(`${battle.name}縺ｮ謾ｻ謦�ｼ� ${dmg}縺ｮ繝繝｡繝ｼ繧ｸ�～);shake();updateBattleUI();
  setTimeout(()=>{if(state.hp<=0)gameOver();else{battle.busy=false;updateBattleUI();battleLog("縺ｩ縺�☆繧具ｼ�")}},700);
}
function winBattle(){
  state.battles++;state.xp+=battle.xp;state.gold+=battle.gold;const boss=battle.boss;battleLog(`${battle.name}繧貞偵＠縺滂ｼ� ${battle.xp} EXP繧堤佐蠕励Ａ);while(state.xp>=state.nextXp)levelUp();
  setTimeout(()=>{showScreen("game-screen");mode="world";switchMusic("world");state.hp=Math.min(state.maxHp,state.hp+Math.ceil(state.maxHp*.25));state.mp=Math.min(state.maxMp,state.mp+3);
    if(boss)finishChapter();else{state.step=2;state.lastEvent=`${battle.name}繧貞偵＠縺歔;showDialog([{speaker:"繧｢繧ｹ繝�Ν",text:"鬲皮黄縺ｮ蠖ｱ縺九ｉ譏溘�驕薙′迴ｾ繧後◆縲ょ圏譚ｱ縺ｮ逾ｭ螢�∈蜷代°縺翫≧縲�"}])}updateUI();draw();save(true)},1000);
}
function levelUp(){state.xp-=state.nextXp;state.level++;state.nextXp=Math.round(state.nextXp*1.45);state.maxHp+=10;state.maxMp+=4;state.atk+=3;state.def+=2;state.hp=state.maxHp;state.mp=state.maxMp}
function gameOver(){battleLog("繧｢繧ｹ繝�Ν縺ｯ蜉帛ｰｽ縺阪◆窶ｦ窶ｦ");setTimeout(()=>{state.hp=state.maxHp;state.mp=state.maxMp;state.gold=Math.max(0,state.gold-Math.floor(state.gold*.15));showScreen("game-screen");mode="world";switchMusic("world");resetPosition();updateUI();draw();showDialog([{speaker:"譏溘�螢ｰ",text:"縺ｾ縺�縲√≠縺ｪ縺溘�譌��邨ゅｏ縺｣縺ｦ縺�↑縺�ｦ窶ｦ縲�"}])},1100)}
function finishChapter(){
  const ch=chapters[state.chapter];state.stars.push(ch.reward);state.step=3;state.lastEvent=`${ch.reward}繧貞叙繧頑綾縺励◆`;
  if(state.chapter===4){state.ending=true;save(true);ending();return}
  showDialog([{speaker:"譏溘�螢ｰ",text:`${ch.reward}縺悟､懃ｩｺ縺ｸ驍�▲縺溘Ａ},{speaker:ch.npc,text:"縺ゅｊ縺後→縺�√い繧ｹ繝�Ν縲ょ漉髢縺碁幕縺阪∪縺励◆縲る摩繧呈栢縺代ｌ縺ｰ縲∵ｬ｡縺ｮ蝨ｰ縺ｸ騾ｲ繧√∪縺吶�"}],()=>{state.x=10;state.y=12;state.dir="down";updateUI();draw();save(true)});
}
function advanceChapter(){state.chapter++;state.step=0;state.lastEvent="蜊鈴摩繧呈栢縺代∵ｬ｡縺ｮ蝨ｰ縺ｸ逹縺�◆";resetPosition();state.hp=state.maxHp;state.mp=state.maxMp;updateUI();draw();save(true);introChapter()}
function ending(){
  showScreen("game-screen");mode="dialog";switchMusic("ending");showDialog([{speaker:"繝ｴ繧ｧ繧､繝ｫ",text:"縺昴≧縺銀ｦ窶ｦ譏溘�縲∫ｩｺ縺ｫ縺ゅｋ縺九ｉ霈昴￥縺ｮ縺ｧ縺ｯ縺ｪ縺�りｪｰ縺九ｒ諠ｳ縺�ｿ�↓轣ｯ繧九�縺九�"},{speaker:"繧｢繧ｹ繝�Ν",text:"荳邱偵↓蟶ｰ繧阪≧縲ょ､懊′縺ゅｋ縺九ｉ縲∵弌轣ｯ繧翫�隕九∴繧九ｓ縺�縲�"},{speaker:"",text:"莠斐▽縺ｮ譏溘�遨ｺ縺ｸ驍�ｊ縲�聞縺�､懊�譏弱￠縺溘ゆｺｺ縲��繧ゅ≧縲∵弌縺ｫ鬘倥≧縺�縺代〒縺ｯ縺ｪ縺�ゆｺ偵＞縺ｮ蠢�↓轣ｯ繧翫ｒ隕九▽縺代◆縲�"}],showEndingAnimation)}
let endingTimer=null;
function showEndingAnimation(){mode="ending";showScreen("ending-screen");$("#ending-line").textContent=`莠斐▽縺ｮ譏溘�縲√�縺溘◆縺ｳ螟懃ｩｺ縺ｸ縲ょ�髯ｺ譎る俣 ${fmtTime(totalTime())}`;clearTimeout(endingTimer);endingTimer=setTimeout(showEndingResult,10500)}
function showEndingResult(){clearTimeout(endingTimer);openModal(`<h2>譏溽�繧翫′謌ｻ縺｣縺�</h2><p>蜈ｨ5遶�繧ｯ繝ｪ繧｢縲√♀繧√〒縺ｨ縺�＃縺悶＞縺ｾ縺吶�</p><p>Lv ${state.level}縲蜀帝匱譎る俣 ${fmtTime(totalTime())}縲謌ｦ髣� ${state.battles}蝗�</p><div class="modal-buttons"><button id="epilogue">縺昴�蠕後�荳也阜繧呈ｭｩ縺�</button><button id="back-title">繧ｿ繧､繝医Ν縺ｸ</button></div>`);$("#epilogue").onclick=()=>{$("#modal").close();mode="world";showScreen("game-screen");switchMusic("world");state.step=3;draw();toast("譏溘�逾晉ｦ上〒貅縺｡縺滉ｸ也阜");};$("#back-title").onclick=()=>{$("#modal").close();returnTitle()}}
$("#skip-ending").onclick=showEndingResult;

function updateUI(){
  const ch=chapters[state.chapter];$("#area-name").textContent=ch.area;$("#chapter-label").textContent=ch.title.split("縲")[0];$("#hero-level").textContent=`Lv ${state.level}`;$("#hp-text").textContent=`${state.hp}/${state.maxHp}`;$("#mp-text").textContent=`${state.mp}/${state.maxMp}`;$("#hp-bar").style.width=`${state.hp/state.maxHp*100}%`;$("#mp-bar").style.width=`${state.mp/state.maxMp*100}%`;$("#atk-text").textContent=state.atk;$("#def-text").textContent=state.def;$("#gold-text").textContent=state.gold;$("#exp-text").textContent=state.xp;$("#quest-text").textContent=currentQuest();$("#quest-time").textContent=`逶ｮ螳� ${[3,5,5,1][state.step]||3}蛻�`;$("#side-quest").textContent=`蟇�ｊ驕難ｼ壽弌縺ｮ縺励★縺� ${dropCount()}/3`;
}
function currentQuest(){const ch=chapters[state.chapter];return [ch.quest,"隘ｿ縺ｮ譏溽｢代ｒ隱ｿ縺ｹ繧医≧","蛹玲擲縺ｮ逾ｭ螢�∈騾ｲ繧ゅ≧",state.chapter<4?"蜊鈴摩縺九ｉ谺｡縺ｮ蝨ｰ縺ｸ騾ｲ繧ゅ≧":"譏溽�繧翫ｒ隕句ｱ翫￠繧医≧"][state.step]||ch.quest}
function showRecap(){openModal(`<h2>縺翫°縺医ｊ縺ｪ縺輔＞</h2><p><strong>蜑榊屓��</strong>${state.lastEvent||"蜀帝匱縺ｮ騾比ｸｭ"}</p><p><strong>迴ｾ蝨ｨ蝨ｰ��</strong>${chapters[state.chapter].area}</p><p><strong>谺｡縺ｮ逶ｮ讓呻ｼ育ｴ�${[3,5,5,1][state.step]||3}蛻�ｼ会ｼ�</strong><br>${currentQuest()}</p><p>譏溘�縺励★縺� ${dropCount()}/3</p><div class="modal-buttons"><button id="resume-now">蜀帝匱繧貞�髢�</button></div>`);$("#resume-now").onclick=()=>{$("#modal").close();toast("遏ｭ縺�凾髢薙〒繧ゅ√ｈ縺�羅繧抵ｼ�")}}
function toast(text){const t=$("#toast");t.textContent=text;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),1800)}
function rand(a,b){return Math.floor(Math.random()*(b-a+1))+a}
function shake(){if(!state.settings.shake)return;$("#battle-screen").animate([{transform:"translateX(-5px)"},{transform:"translateX(5px)"},{transform:"none"}],{duration:180})}

function openMenu(tab="status"){$("#main-menu").showModal();renderMenu(tab)}
function renderMenu(tab){
  $$(".tabs button").forEach(b=>b.classList.toggle("active",b.dataset.tab===tab));const c=$("#menu-content");
  if(tab==="status")c.innerHTML=`<h3>繧｢繧ｹ繝�Ν縲Lv ${state.level}</h3><p>HP ${state.hp}/${state.maxHp}縲MP ${state.mp}/${state.maxMp}<br>謾ｻ謦� ${state.atk}縲螳亥ｙ ${state.def}<br>谺｡縺ｮ繝ｬ繝吶Ν縺ｾ縺ｧ ${state.nextXp-state.xp} EXP</p><p>髮�ａ縺滓弌��${state.stars.length}/5</p><div class="menu-actions"><button id="heal">莨第�縺吶ｋ��10譏溯ｲｨ��</button></div>`;
  if(tab==="items")c.innerHTML=`<div class="item-list">${Object.entries(state.items).map(([n,q])=>`<div class="item-row"><span>${n}</span><b>ﾃ�${q}</b></div>`).join("")||"縺ｩ縺�＄縺ｯ縺ゅｊ縺ｾ縺帙ｓ"}</div><p>阮ｬ闕峨�謌ｦ髣倅ｸｭ縺ｫHP繧�35蝗槫ｾｩ縲よ弌縺ｮ髴願脈縺ｯHP繝ｻMP繧貞�蝗槫ｾｩ縺励∪縺吶�</p>`;
  if(tab==="records")c.innerHTML=`<div class="records"><p>${chapters[state.chapter].title}</p><p>蜀帝匱譎る俣 ${fmtTime(totalTime())}縲謌ｦ髣� ${state.battles}蝗�</p><p>${state.stars.map(s=>`笘� ${s}`).join("<br>")||"譏溘�縺ｾ縺�隕九▽縺九▲縺ｦ縺�↑縺�"}</p></div><div class="menu-actions"><button id="save-now">險倬鹸縺吶ｋ</button><button id="to-title">繧ｿ繧､繝医Ν縺ｸ</button></div>`;
  if(tab==="settings")c.innerHTML=`<div class="settings-row"><span>BGM</span><button id="toggle-music">${state.settings.sound?"ON":"OFF"}</button></div><div class="settings-row"><span>逕ｻ髱｢縺ｮ謠ｺ繧�</span><button id="toggle-shake">${state.settings.shake?"ON":"OFF"}</button></div><div class="menu-actions"><button id="save-now">繧ｻ繝ｼ繝悶☆繧�</button><button id="to-title">繧ｿ繧､繝医Ν縺ｸ謌ｻ繧�</button></div><p>繧ｭ繝ｼ繝懊�繝会ｼ夂泙蜊ｰ/WASD縺ｧ遘ｻ蜍輔・nter/Space/Z縺ｧ豎ｺ螳壹・sc縺ｧ繝｡繝九Η繝ｼ縲�</p>`;
  $("#heal")?.addEventListener("click",()=>{if(state.gold<10)return toast("譏溯ｲｨ縺瑚ｶｳ繧翫∪縺帙ｓ");state.gold-=10;state.hp=state.maxHp;state.mp=state.maxMp;updateUI();renderMenu(tab)});
  $("#save-now")?.addEventListener("click",()=>save());$("#to-title")?.addEventListener("click",returnTitle);$("#toggle-music")?.addEventListener("click",()=>{toggleMusic();renderMenu(tab)});$("#toggle-shake")?.addEventListener("click",()=>{state.settings.shake=!state.settings.shake;renderMenu(tab)});
}
function returnTitle(){if(mode!=="title"){state.playTime=totalTime();state.started=Date.now();save(true)}$("#main-menu").close();mode="title";showScreen("title-screen");switchMusic("title");refreshTitle()}
function openModal(html){$("#modal-content").innerHTML=html;$("#modal").showModal()}
function refreshTitle(){$("#continue-game").disabled=!hasSave()}
const introLines=["縺九▽縺ｦ縲∝､懃ｩｺ縺ｫ縺ｯ莠斐▽縺ｮ譏溘′霈昴＞縺ｦ縺�◆縲�","縺�縺梧ｵ∵弌逾ｭ縺ｮ螟懊∵弌縺ｯ縺ｲ縺ｨ縺､谿九ｉ縺壽ｶ医∴縺溘�","蟆大ｹｴ縺ｮ謇九↓谿九＆繧後◆縺ｮ縺ｯ縲√°縺吶°縺ｪ譏溘�縺九￠繧峨�","縺�∪縲∽ｸ也阜縺ｫ譏溽�繧翫ｒ蜿悶ｊ謌ｻ縺呎羅縺悟ｧ九∪繧九�"];
let introTimer=null,introIndex=0;
function beginIntro(){unlockAudio();switchMusic("title");$("#intro-screen").classList.add("intro-playing");introIndex=0;$("#intro-text").textContent=introLines[0];clearInterval(introTimer);introTimer=setInterval(()=>{introIndex++;if(introIndex>=introLines.length)return finishIntro();const copy=$(".intro-copy");copy.style.animation="none";void copy.offsetWidth;copy.style.animation="";$("#intro-text").textContent=introLines[introIndex]},2400)}
function finishIntro(){clearInterval(introTimer);sessionStorage.setItem("hoshiakariIntroSeen","1");mode="title";showScreen("title-screen");refreshTitle();switchMusic("title")}
$("#begin-intro").onclick=beginIntro;$("#skip-intro").onclick=()=>{unlockAudio();finishIntro()};

$("#new-game").onclick=()=>{if(hasSave())openModal(`<h2>譁ｰ縺励＞蜀帝匱</h2><p>迴ｾ蝨ｨ縺ｮ險倬鹸縺ｫ荳頑嶌縺阪＠縺ｾ縺吶ゅｈ繧阪＠縺�〒縺吶°��</p><div class="modal-buttons"><button id="yes-new">縺ｯ縺倥ａ繧�</button><button id="no-new">繧ゅ←繧�</button></div>`),$("#yes-new").onclick=()=>{$("#modal").close();startGame(false)},$("#no-new").onclick=()=>$("#modal").close();else startGame(false)};
$("#continue-game").onclick=()=>{if(load())startGame(true)};
$("#chapter-select").onclick=()=>openModal(`<h2>遶�縺九ｉ驕翫�</h2><p>迚ｩ隱槭→謗ｨ螂ｨ閭ｽ蜉帙〒蜷�ｫ�繧帝幕蟋九＠縺ｾ縺吶�</p><div class="item-list">${chapters.map((c,i)=>`<button class="menu-button chapter" data-ch="${i}">${c.title}</button>`).join("")}</div><div class="modal-buttons"><button id="close-modal">繧ゅ←繧�</button></div>`);
$("#modal").addEventListener("click",e=>{if(e.target.id==="close-modal")$("#modal").close();const b=e.target.closest(".chapter");if(b){$("#modal").close();startGame(false,+b.dataset.ch)}});
$("#open-help").onclick=()=>openModal(`<h2>驕翫�縺九◆</h2><p>繝槭ャ繝励�莠ｺ迚ｩ繧�鯉ｼ√阪�荳豁ｩ謇句燕縺ｧ豎ｺ螳壹＠縺ｦ縺上□縺輔＞縲�</p><p>PC�夂泙蜊ｰ/WASD縺ｧ遘ｻ蜍輔・nter/Space/Z縺ｧ豎ｺ螳壹・sc/X縺ｧ繝｡繝九Η繝ｼ縲�<br>繧ｹ繝槭��夂判髱｢荳九�蜊∝ｭ励く繝ｼ縺ｨ荳ｭ螟ｮ縺ｮ縲梧ｱｺ螳壹阪く繝ｼ縲�</p><p>12豁ｩ縺斐→縺ｮ閾ｪ蜍輔そ繝ｼ繝悶↓蜉�縺医∝承蛛ｴ縺ｮ縲後そ繝ｼ繝悶阪°繧峨＞縺､縺ｧ繧りｨ倬鹸縺ｧ縺阪∪縺吶�</p><div class="modal-buttons"><button id="close-modal">縺ｨ縺倥ｋ</button></div>`);
$("#menu-toggle").onclick=()=>openMenu();$$('[data-close]').forEach(b=>b.onclick=()=>b.closest("dialog").close());$$('.tabs button').forEach(b=>b.onclick=()=>renderMenu(b.dataset.tab));
$$('#battle-actions button').forEach(b=>b.onclick=()=>command(b.dataset.command));
document.addEventListener("keydown",e=>{if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key))e.preventDefault();if(mode==="dialog"&&["Enter"," ","z","Z"].includes(e.key))return nextDialog();if(mode!=="world"){if(e.key==="Escape"&&$("#main-menu").open)$("#main-menu").close();return}const k=e.key.toLowerCase();if(k==="arrowup"||k==="w")move(0,-1,"up");else if(k==="arrowdown"||k==="s")move(0,1,"down");else if(k==="arrowleft"||k==="a")move(-1,0,"left");else if(k==="arrowright"||k==="d")move(1,0,"right");else if(["enter"," ","z"].includes(k))interact();else if(["escape","x"].includes(k))openMenu()});
$$('.mobile-controls button').forEach(b=>{const fire=e=>{e.preventDefault();if(b.dataset.key){const d={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[b.dataset.key];move(...d,b.dataset.key)}else if(b.dataset.action==="confirm")interact();else if(b.dataset.action==="save")save();else if(b.dataset.action==="settings")openMenu("settings")};b.addEventListener("pointerdown",fire)});
window.addEventListener("pagehide",()=>{if(mode!=="title")save(true)});document.addEventListener("visibilitychange",()=>{if(document.hidden&&mode!=="title")save(true)});window.addEventListener("resize",updateCamera);
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
document.addEventListener("pointerdown",()=>{unlockAudio();if(!musicTimer)switchMusic(mode==="title"?"title":mode==="battle"?(battle?.boss?"boss":"battle"):state.ending?"ending":"world")},{once:true});
if(sessionStorage.getItem("hoshiakariIntroSeen")){mode="title";showScreen("title-screen")}refreshTitle();draw();
