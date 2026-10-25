(function(){
"use strict";
var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var TZ = "Asia/Ho_Chi_Minh";
var $ = function(id){ return document.getElementById(id); };
var $$ = function(sel, root){ return Array.prototype.slice.call((root||document).querySelectorAll(sel)); };
var isDesk = function(){ return window.innerWidth > 900; };
function clamp(v,a,b){ return Math.max(a, Math.min(b, v)); }
function pad(n){ return (n<10?"0":"")+n; }
function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }

/* =====================================================================
   CONTENT — edit text here
   ===================================================================== */
/* Discord status via Lanyard (api.lanyard.rest). Put your numeric Discord user ID here,
   and join the Lanyard Discord server once so Lanyard can see your status. */
var DISCORD_ID = "1076862941837676594";

/* GoatCounter account (tranduclongg.goatcounter.com). The visit count in the footer only shows
   after ticking "Allow adding visitor counts on your website" in GoatCounter settings. */
var GOATCOUNTER = "tranduclongg";
/* number added on top of the real GoatCounter count shown on the page (0 = real number only) */
var VIEW_BONUS = 673;

/* src: a music file you own (in music/). Leave it empty to use the Spotify player for the track id below. */
/* cover: an image shown in the middle of the spinning disc, e.g. "assets/cover.jpg" (leave empty for the plain pink label) */
var MUSIC = { title: "Nếu Như Ta Chẳng Còn", artist: "RPT MCK, A$AP Ướt Mi", src: "music/song.mp3", spotify: "6BnPsHZv1jPbPAsQsm0s5b", dur: 83, cover: "music/cover.jpg" };/* subject names only: no rooms, times or lecturers */
var SCHEDULE = {
  1:{vi:["Kỹ năng làm việc nhóm"],en:["Teamwork Skills"]},
  2:{vi:["Xác suất thống kê","Kiến trúc máy tính và hệ điều hành"],en:["Probability & Statistics","Computer Architecture & OS"]},
  5:{vi:["Cơ sở an toàn thông tin","Cấu trúc dữ liệu và giải thuật"],en:["Information Security Basics","Data Structures & Algorithms"]}
};

var EDU = { start:"2018-09-01", ptit:"2025-09-01", grad:"2030-03-01" };

var PROJECTS = [
  { file:"orb-clash/", color:"var(--card-b)",
    meta:{vi:"Dự án cá nhân · làm cho vui · 2026", en:"Side project · for fun · 2026"},
    title:{vi:"Orb Clash", en:"Orb Clash"},
    desc:{vi:"Game đấu bóng vật lý chơi offline với bot. Viết bằng HTML canvas và JavaScript thuần, không dùng thư viện.",
          en:"An offline physics ball-duel game against a bot. Plain HTML canvas and JavaScript, no libraries."},
    feats:{vi:["Nhiều loại bóng, bóng càng hiếm thì kỹ năng càng dị.","Bot không chọn trùng bóng với bạn.","Đang tính làm thêm chế độ giải đấu qua mạng LAN."],
           en:["Lots of ball types; the rarer the ball, the weirder its skill.","The bot never picks the same ball as you.","Planning a LAN tournament mode next."]},
    tags:["JavaScript","Canvas","Game"],
    links:[{label:{vi:"Chơi ngay",en:"Play now"}, href:"/orbclash/", icon:"i-play"},
           {label:{vi:"Repo trên GitHub",en:"Repo on GitHub"}, href:"https://github.com/Kokonut-Original/orb-clash"}],
    gallery:[{src:"assets/orb-1.jpg", w:1400, h:908, alt:{vi:"Một trận Orb Clash với bot",en:"An Orb Clash match against the bot"}},
             {src:"assets/orb-2.jpg", w:1400, h:675, alt:{vi:"Hợp thể ra bóng thần thoại Abyss",en:"Fusing into the mythic ball Abyss"}},
             {src:"assets/orb-3.jpg", w:1400, h:664, alt:{vi:"Mở được 5 quả bóng mới",en:"Unlocking 5 new balls"}}] }
];

var SKILLS = [
  { name:{vi:"Bảo mật & mạng",en:"Security & networking"}, items:[["Wazuh",52],["Suricata",47],["Wireshark",43],["TCP/IP",49],["Firewall",41]] },
  { name:{vi:"Hệ thống & công cụ",en:"Systems & tools"}, items:[["Git",70],["Linux",48],["Docker",44],["Python",46]] }
];

var ABOUT = {
  then:{vi:["none...."], en:["none...."]},
  now:{vi:["none...."], en:["none...."]},
  next:{vi:["none...."], en:["none...."]}
};

var STR = {
  vi:{h1a:"Chào, mình là Long.",h1b:'Đang học ở <span class="u">cao đẳng bưu điện</span> PTIT.',
      lead:'Đã có <b class="vc">…</b> người ghé trang.',visitsSome:"kha khá",
      status:"Hiện đang tắc đường ở Hà Nội",listening:"Đang nghe",sample:"số liệu mẫu",
      schedTitle:"Lịch học hôm nay",noteTitle:"Việc tuần này",t1:"Ngủ full time",t2:"Đi gym",t3:"Học bài",t4:"Học tiếng Trung",
      lazy:"Không thể tick do rất lười đi tập =)))",
      desk:"Desktop",nEdu:"Học vấn",nProj:"Dự án",nSkill:"Kỹ năng",nPlay:"Playground",nAbout:"about-me.txt",nContact:"Liên hệ",
      eduH:"Đang cài đặt.",eduSub:"Chẳng mấy chốc mà cưới vợ có con. Còn vài bước nữa là cài xong.",
      instTitle:"Cài đặt Trần Đức Long",instNow:"Đang cài đặt: Đại học",back:"Quay lại",cont:"Tiếp tục",
      left:function(y,m){ return "Còn khoảng "+y+" năm "+m+" tháng"; },
      side:["Cấp 2","Cấp 3","Đại học","Tốt nghiệp","Đi làm","Cưới vợ"],
      log:[["THCS Việt Nam – Angiêri","Cấp 2"],["THPT Trần Hưng Đạo – Thanh Xuân","Cấp 3 · Hà Nội"],["PTIT · Học viện Công nghệ Bưu chính Viễn thông","An toàn thông tin · năm "],["Tốt nghiệp","dự kiến 2030"],["Đi làm","chưa biết ở đâu"],["Cưới vợ rồi đẻ con","chẳng mấy chốc"]],
      projH:"Mấy thứ mình đã làm.",
      skillH:"Đang học, chưa giỏi.",skillSub:"Thanh nào chưa đầy là còn đang cày.",
      ielts:"IELTS · Tiếng Anh",ieltsD:"Tiếng Anh, đã có chứng chỉ.",hsk:"HSK 3 · đang học",hskD:"Tiếng Trung, đang ôn để thi.",
      selfScore:"Phần trăm là tự chấm, và chấm hơi gắt.",
      playH:"Chỗ để nghịch.",playSub:"Terminal này gõ được thật. Bắt đầu bằng help, hoặc bấm một lệnh bên cạnh.",
      gSoon:"Sắp có",tryTitle:"Thử gõ",tryDesc:"Bấm để chạy luôn. Có một file ẩn ở đâu đó.",orbDesc:"Game đấu bóng vật lý với bot.",viewRepo:"Chơi thử ↗",
      valDesc:"Rank thì xem trên tracker, đừng hỏi.",openTracker:"Tracker ↗",
      teTitle:"about-me.txt — Đã sửa",tabThen:"Trước đây",tabNow:"Bây giờ",tabNext:"Sắp tới",
      contactH:"Nói chuyện với mình.",contactSub:"Email là nhanh nhất. Discord cũng được, bấm là copy tên.",
      mainMail:"Email chính",altMail:"Email phụ",copy:"Copy",madeWith:"Viết bằng HTML, CSS, JS thuần. Không dùng cookie.",
      session:"đã ở đây ",home:"Trang chính",toDark:"Chuyển sang nền tối",toLight:"Chuyển sang nền sáng",
      dc:{online:"Đang online",idle:"Đang treo máy",dnd:"Đừng làm phiền",offline:"Đang offline",none:"Chưa kết nối"},
      dcPlay:"Đang chơi",dcListen:"Đang nghe",dcMin:" phút",dcHr:" giờ",dcIdleLine:"Không làm gì cả, chắc đang ngủ full time",dcSetup:"Thêm Discord ID trong app.js để hiện trạng thái",
      days:["Chủ nhật","Thứ 2","Thứ 3","Thứ 4","Thứ 5","Thứ 6","Thứ 7"],short:["CN","T2","T3","T4","T5","T6","T7"],
      prep:"Chuẩn bị học",then:"rồi",free:"Hôm nay không có lịch học. Nạp lại năng lượng.",next:"Tiếp theo",today:"Nay",
      copied:"Đã copy",play:"Phát",pause:"Tạm dừng",blocked:"Trình duyệt chặn phát nhạc, thử bấm lại",
      wx:{sun:"Nắng",cloud:"Nhiều mây",rain:"Có mưa"}},
  en:{h1a:"Hi, I'm Long.",h1b:'Studying at the <span class="u">PTIT post office</span> college.',
      lead:'So far <b class="vc">…</b> people have dropped by.',visitsSome:"quite a few",
      status:"Currently stuck in Hanoi traffic",listening:"Now playing",sample:"sample data",
      schedTitle:"Today's classes",noteTitle:"This week",t1:"Sleep full time",t2:"Go to the gym",t3:"Study",t4:"Learn Chinese",
      lazy:"Can't tick this, way too lazy to work out =)))",
      desk:"Desktop",nEdu:"Education",nProj:"Projects",nSkill:"Skills",nPlay:"Playground",nAbout:"about-me.txt",nContact:"Contact",
      eduH:"Installing.",eduSub:"Before you know it: married with kids. A few more steps until it's done.",
      instTitle:"Install Trần Đức Long",instNow:"Now installing: University",back:"Back",cont:"Continue",
      left:function(y,m){ return "About "+y+" yr "+m+" mo left"; },
      side:["Middle school","High school","University","Graduation","Work","Marriage"],
      log:[["Việt Nam – Angiêri Secondary School","Middle school"],["Trần Hưng Đạo – Thanh Xuân High School","High school · Hanoi"],["PTIT · Posts and Telecommunications Institute of Technology","Information Security · year "],["Graduation","expected 2030"],["Start working","somewhere, TBD"],["Get married, have kids","sooner than you think"]],
      projH:"Things I've made.",
      skillH:"Still learning.",skillSub:"Any bar that isn't full is still in progress.",
      ielts:"IELTS · English",ieltsD:"English, certified.",hsk:"HSK 3 · in progress",hskD:"Chinese, studying for the exam.",
      selfScore:"Self-graded, and graded strictly.",
      playH:"Playground.",playSub:"This terminal really works. Start with help, or tap a command on the side.",
      gSoon:"Coming soon",tryTitle:"Try these",tryDesc:"Tap to run. There's a hidden file somewhere.",orbDesc:"Physics ball duels against a bot.",viewRepo:"Play ↗",
      valDesc:"The rank is on the tracker. Don't ask.",openTracker:"Tracker ↗",
      teTitle:"about-me.txt — Edited",tabThen:"Before",tabNow:"Now",tabNext:"Next",
      contactH:"Say hi.",contactSub:"Email is fastest. Discord works too, tap to copy the name.",
      mainMail:"Main email",altMail:"Backup email",copy:"Copy",madeWith:"Plain HTML, CSS and JS. No cookies.",
      session:"been here ",home:"Home",toDark:"Switch to dark",toLight:"Switch to light",
      dc:{online:"Online",idle:"Idle",dnd:"Do not disturb",offline:"Offline",none:"Not connected"},
      dcPlay:"Playing",dcListen:"Listening to",dcMin:" min",dcHr:" h",dcIdleLine:"Doing nothing, probably sleeping full time",dcSetup:"Add a Discord ID in app.js to show live status",
      days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],short:["Su","Mo","Tu","We","Th","Fr","Sa"],
      prep:"Getting ready for",then:"then",free:"No classes today. Recharging.",next:"Next",today:"Today",
      copied:"Copied",play:"Play",pause:"Pause",blocked:"The browser blocked playback, try again",
      wx:{sun:"Sunny",cloud:"Cloudy",rain:"Rain"}}
};

/* =====================================================================
   i18n
   ===================================================================== */
/* "Tiếng Bát Nin": the "mèn mén" meme, generated from the Vietnamese text.
   Rules: ngã → sắc, ô → o, final m → n, final ng/nh → n, final c/ch → t, consonant + y → i.
   Names, brands, acronyms, links and numbers are left alone. */
var BN_KEEP = {"Long":1,"Đức":1,"Trần":1,"Kokonut":1,"Côn":1,"Ti":1,"Bát":1,"Nin":1,"Orb":1,"Clash":1,"Wazuh":1,"Suricata":1,"Docker":1,"Linux":1,
  "Git":1,"GitHub":1,"Python":1,"Valorant":1,"Spotify":1,"Discord":1,"Facebook":1,"Instagram":1,"Wireshark":1,"Firewall":1,"Desktop":1,"Playground":1,"Copy":1,"Angiêri":1,"gym":1,"full":1,"time":1,"tick":1,"Canvas":1,"Game":1};
function bnWord(w){
  if (BN_KEEP[w] || /[A-Z].*[A-Z]/.test(w) || /[fjwz]/i.test(w)) return w;
  var d = w.normalize("NFD");
  d = d.replace(/̃/g, "́");                 /* ngã → sắc */
  d = d.replace(/([oO])(̣?)̂/g, "$1$2");    /* ô → o */
  d = d.replace(/([bcdđghklmnpqrstvx])([yY])([̀-̣]*)$/i, function(_,c,y,t){ return c + (y==="Y"?"I":"i") + t; });
  d = d.replace(/(ng|nh)$/i, function(m){ return m.charAt(0); })
       .replace(/ch$/i, function(m){ return m.charAt(0)==="C" ? "T" : "t"; })
       .replace(/m$/, "n").replace(/M$/, "N")
       .replace(/([^c])c$/i, function(_,v){ return v+"t"; });
  return d.normalize("NFC");
}
function bnText(str){
  return String(str).split(/(<[^>]*>|&[a-z]+;|[\w.\-]+@[\w.\-]+|https?:\/\/\S+)/).map(function(part, i){
    if (i % 2) return part;
    return part.replace(/[A-Za-zÀ-ỹĐđ]+/g, bnWord);
  }).join("");
}
function bnDeep(v){
  if (typeof v === "string") return bnText(v);
  if (typeof v === "function") return function(){ return bnText(v.apply(null, arguments)); };
  if (Array.isArray(v)) return v.map(bnDeep);
  if (v && typeof v === "object"){ var o = {}; Object.keys(v).forEach(function(k){ o[k] = bnDeep(v[k]); }); return o; }
  return v;
}
STR.bn = bnDeep(STR.vi);
STR.bn.desk = "Desktop";

var lang = "vi";
try { var saved = localStorage.getItem("lang"); if (saved === "en" || saved === "vi" || saved === "bn") lang = saved; } catch(e){}
function t(k){ return STR[lang][k]; }
function L(o){ if (lang === "bn"){ if (!o.__bn) o.__bn = bnDeep(o.vi); return o.__bn; } return o[lang]; }
var renderers = [];

/* theme: light by default, dark from the button in the menu bar */
var theme = "light";
try { if (localStorage.getItem("theme") === "dark") theme = "dark"; } catch(e){}
var MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>';
var SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></svg>';
function applyTheme(){
  document.documentElement.setAttribute("data-theme", theme);
  var b = $("themeBtn"), dark = theme === "dark";
  b.innerHTML = dark ? SUN : MOON;
  b.setAttribute("aria-pressed", dark);
  b.setAttribute("aria-label", t(dark ? "toLight" : "toDark")); b.title = t(dark ? "toLight" : "toDark");
  var mc = document.querySelector('meta[name="theme-color"]'); if (mc) mc.setAttribute("content", dark ? "#141114" : "#F6F4F5");
}
$("themeBtn").addEventListener("click", function(){ theme = theme === "dark" ? "light" : "dark"; try{ localStorage.setItem("theme", theme); }catch(e){} applyTheme(); });
renderers.push(applyTheme);
function applyLang(){
  document.documentElement.lang = lang === "en" ? "en" : "vi";
  $$("[data-i18n]").forEach(function(el){
    var v = STR[lang][el.getAttribute("data-i18n")];
    if (typeof v === "string") el.innerHTML = v;
  });
  $("langVi").setAttribute("aria-pressed", lang === "vi");
  $("langEn").setAttribute("aria-pressed", lang === "en");
  $("langBn").setAttribute("aria-pressed", lang === "bn");
  renderers.forEach(function(fn){ fn(); });
}
function setLang(l){ lang = l; try{ localStorage.setItem("lang", l); }catch(e){} applyLang(); }
$("langVi").onclick = function(){ setLang("vi"); };
$("langEn").onclick = function(){ setLang("en"); };
$("langBn").onclick = function(){ setLang("bn"); };

/* =====================================================================
   time (Hà Nội)
   ===================================================================== */
function hnNow(){
  var p = new Intl.DateTimeFormat("en-US",{timeZone:TZ,year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"numeric",second:"numeric",hour12:false,weekday:"short"}).formatToParts(new Date());
  var o = {}; p.forEach(function(x){ o[x.type]=x.value; });
  return {y:+o.year,m:+o.month,d:+o.day,h:(+o.hour)%24,mi:+o.minute,s:+o.second,wd:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].indexOf(o.weekday)};
}
function tickMenu(){
  var n = hnNow();
  var date = lang!=="en" ? (t("short")[n.wd]+", "+n.d+" thg "+n.m) : (["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][n.wd]+", "+["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][n.m-1]+" "+n.d);
  $("mbClock").innerHTML = '<span class="d">'+date+'&nbsp;&nbsp;</span>'+pad(n.h)+":"+pad(n.mi);
  var s = Math.floor((Date.now()-T0)/1000);
  $("lastLogin").textContent = t("session")+pad(Math.floor(s/3600))+":"+pad(Math.floor(s/60)%60)+":"+pad(s%60);
}
var T0 = Date.now();
renderers.push(tickMenu);

/* clock */
(function(){
  var s = "";
  for (var i=0;i<12;i++){ var a=i*30*Math.PI/180, r1=i%3===0?56:59, r2=64;
    s += '<line class="tick" x1="'+(70+r1*Math.sin(a)).toFixed(2)+'" y1="'+(70-r1*Math.cos(a)).toFixed(2)+'" x2="'+(70+r2*Math.sin(a)).toFixed(2)+'" y2="'+(70-r2*Math.cos(a)).toFixed(2)+'" stroke-width="'+(i%3===0?2:1.2)+'" stroke-linecap="round"/>'; }
  $("ticks").innerHTML = s;
})();
function drawClock(){
  var n = hnNow(), sec = n.s + (reduce ? 0 : new Date().getMilliseconds()/1000);
  var m = n.mi + sec/60, h = (n.h%12) + m/60;
  $("hS").setAttribute("transform","rotate("+(sec*6)+" 70 70)");
  $("hM").setAttribute("transform","rotate("+(m*6)+" 70 70)");
  $("hH").setAttribute("transform","rotate("+(h*30)+" 70 70)");
}

/* calendar */
function renderCal(){
  var n = hnNow();
  $("calDay").textContent = t("days")[n.wd];
  $("calNum").textContent = n.d;
  var first = new Date(Date.UTC(n.y, n.m-1, 1)).getUTCDay(), days = new Date(Date.UTC(n.y, n.m, 0)).getUTCDate(), h = "";
  t("short").forEach(function(x){ h += '<span class="h">'+x.charAt(0)+'</span>'; });
  for (var i=0;i<first;i++) h += "<span></span>";
  for (var d=1; d<=days; d++) h += '<span'+(d===n.d?' class="t"':'')+'>'+d+'</span>';
  $("calGrid").innerHTML = h;
}
renderers.push(renderCal);

/* schedule */
function renderSched(){
  var n = hnNow(), today = SCHEDULE[n.wd];
  $("scDay").textContent = t("days")[n.wd];
  if (today){ var s = L(today); $("scMain").innerHTML = t("prep")+" <b>"+s[0]+"</b>"+(s[1]?" "+t("then")+" "+s[1]:"")+"."; }
  else $("scMain").textContent = t("free");
  for (var k=1;k<=7;k++){ var wd=(n.wd+k)%7; if (SCHEDULE[wd]){ $("scNext").textContent = t("next")+" · "+t("days")[wd]+": "+L(SCHEDULE[wd])[0]; break; } }
}
renderers.push(renderSched);

/* weather: live from Open-Meteo, sample data if the request is blocked */
var WX = { live:false, now:26, kind:"cloud", days:[["sun",29,22],["cloud",27,22],["rain",25,21],["cloud",26,21],["sun",28,22],["sun",29,23]] };
var WXI = {
  sun:'<svg viewBox="0 0 24 24" fill="none" stroke="#E9A23B" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2" fill="#F5C04A" stroke="none"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/></svg>',
  cloud:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 18h10a4 4 0 0 0 .4-8 5.5 5.5 0 0 0-10.6 1.5A3.3 3.3 0 0 0 7 18z" fill="#B9B6BE"/></svg>',
  rain:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 15h10a4 4 0 0 0 .4-8 5.5 5.5 0 0 0-10.6 1.5A3.3 3.3 0 0 0 7 15z" fill="#A9B4C6"/><path d="M9 18l-1 2.5M13 18l-1 2.5M17 18l-1 2.5" stroke="#5B8FD8" stroke-width="1.6" stroke-linecap="round"/></svg>'
};
function wmo(c){ return c<=1 ? "sun" : (c<=48 ? "cloud" : "rain"); }
function renderWeather(){
  var n = hnNow(), h = "";
  $("wxNow").textContent = WX.now+"°";
  $("wxCond").textContent = t("wx")[WX.kind];
  $("wxSample").hidden = WX.live;
  WX.days.forEach(function(w,i){ h += '<div>'+(i===0?t("today"):t("short")[(n.wd+i)%7])+WXI[w[0]]+'<b>'+w[1]+'°</b> '+w[2]+'°</div>'; });
  $("wxDays").innerHTML = h;
}
renderers.push(renderWeather);
function loadWeather(){
  try {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=21.03&longitude=105.85&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Asia%2FBangkok&forecast_days=6")
      .then(function(r){ if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function(j){
        WX = { live:true, now:Math.round(j.current.temperature_2m), kind:wmo(j.current.weather_code),
          days:j.daily.time.map(function(_,i){ return [wmo(j.daily.weather_code[i]), Math.round(j.daily.temperature_2m_max[i]), Math.round(j.daily.temperature_2m_min[i])]; }).slice(0,6) };
        renderWeather();
      }).catch(function(){});
  } catch(e){}
}

/* sticky note */
["t1","t3","t4"].forEach(function(id){
  var el = $(id);
  try { var v = localStorage.getItem("todo-"+id); if (v!==null) el.checked = v==="1"; } catch(e){}
  el.addEventListener("change", function(){ try{ localStorage.setItem("todo-"+id, el.checked?"1":"0"); }catch(e){} });
});
$("t2").addEventListener("click", function(e){
  e.preventDefault();
  var n = $("w-note"); n.classList.remove("shake"); void n.offsetWidth; n.classList.add("shake");
  toast(t("lazy"));
});
$("w-note").addEventListener("animationend", function(){ this.classList.remove("shake"); });

/* toast + copy */
var toastT;
function toast(msg){ var el=$("toast"); el.textContent=msg; el.classList.add("show"); clearTimeout(toastT); toastT=setTimeout(function(){ el.classList.remove("show"); },2000); }
function copy(text){
  var ok = function(){ toast(t("copied")+": "+text); };
  try { navigator.clipboard.writeText(text).then(ok, function(){ toast(text); }); } catch(e){ toast(text); }
}
$$("[data-copy]").forEach(function(b){ b.addEventListener("click", function(){ copy(b.getAttribute("data-copy")); }); });
$("dkMail").addEventListener("click", function(){ copy("contact@tranduclong.id.vn"); });

/* =====================================================================
   spring
   ===================================================================== */
function spring(o){
  var x=o.from, v=o.velocity||0, last=performance.now(), id, k=o.stiffness||220, c=o.damping||24, done=false;
  if (reduce){ o.onUpdate(o.to); o.onDone && o.onDone(); return function(){}; }
  function step(now){
    var dt = Math.min(.032,(now-last)/1000); last = now;
    for (var i=0;i<4;i++){ var f = -k*(x-o.to) - c*v; v += f*dt/4; x += v*dt/4; }
    o.onUpdate(x);
    if (Math.abs(v)<(o.rest||.002) && Math.abs(x-o.to)<(o.rest||.002)){ done=true; o.onUpdate(o.to); o.onDone && o.onDone(); return; }
    id = requestAnimationFrame(step);
  }
  id = requestAnimationFrame(step);
  return function(){ if (!done){ cancelAnimationFrame(id); } };
}

/* dock magnification */
(function(){
  var dock = $("dock"), items = $$(".dk", dock);
  var st = items.map(function(){ return {x:1,v:0,target:1}; }), mouseX = null, running = false, base = 52;
  function frame(){
    var still = true;
    items.forEach(function(it,i){
      var s = st[i];
      if (mouseX === null || !isDesk()) s.target = 1;
      else { var r = it.getBoundingClientRect(), d = Math.abs(mouseX-(r.left+r.width/2)); s.target = 1 + .55*Math.max(0, Math.cos(Math.min(1,d/150)*Math.PI/2)); }
      if (reduce) s.x = 1; else { var f = -180*(s.x-s.target) - 15*s.v; s.v += f*.016; s.x += s.v*.016; }
      if (Math.abs(s.v)>.001 || Math.abs(s.x-s.target)>.001) still=false;
      var size = isDesk() ? (base*s.x).toFixed(2)+"px" : ""; it.style.width = size; it.style.height = size;
    });
    if (!still) requestAnimationFrame(frame); else running=false;
  }
  function kick(){ if (!running){ running=true; requestAnimationFrame(frame); } }
  dock.addEventListener("mousemove", function(e){ mouseX=e.clientX; kick(); });
  dock.addEventListener("mouseleave", function(){ mouseX=null; kick(); });
})();

/* =====================================================================
   music
   ===================================================================== */
/* drop music/song.mp3 (and music/cover.jpg) into the repo and the widget plays it; without the file it falls back to Spotify */
var audio = new Audio(), hasFile = false; audio.preload = "metadata";
audio.addEventListener("loadedmetadata", function(){ hasFile = true; });
audio.addEventListener("error", function(){ hasFile = false; });
if (MUSIC.src) audio.src = MUSIC.src;
$("spArtist").textContent = MUSIC.artist || "";
if (MUSIC.cover){ var coverImg = new Image(); coverImg.onload = function(){ $("spLabel").classList.add("has-img"); $("spLabel").style.setProperty("--cover", 'url("'+MUSIC.cover+'")'); }; coverImg.src = MUSIC.cover; }
$("spTitle").textContent = MUSIC.title;
var PLAY = '<path d="M7 4.5v15l13-7.5z" fill="currentColor"/>', PAUSE = '<path d="M6.5 4.5h4v15h-4zM13.5 4.5h4v15h-4z" fill="currentColor"/>';
function fmt(s){ s = Math.max(0, Math.floor(s||0)); return Math.floor(s/60)+":"+pad(s%60); }
function tickSpot(){
  var d = audio.duration || MUSIC.dur || 83, c = audio.currentTime || 0, p = Math.min(1, c/d);
  $("spBar").style.width = (p*100).toFixed(2)+"%";
  $("spTime").textContent = fmt(c)+" / "+fmt(d);
  $("spSeek").setAttribute("aria-valuenow", Math.round(p*100));
}
function setPlaying(on){
  $("spIcon").innerHTML = on ? PAUSE : PLAY;
  $("spPlay").setAttribute("aria-label", on ? t("pause") : t("play"));
  $("spDisc").classList.toggle("playing", on);
}
function embedSpotify(){
  var w = $("w-spot");
  w.classList.add("embed");
  w.innerHTML = '<iframe title="Spotify: '+esc(MUSIC.title)+'" src="https://open.spotify.com/embed/track/'+MUSIC.spotify+'?utm_source=generator&theme=0" width="100%" height="152" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>';
}
$("spPlay").addEventListener("click", function(){
  if (!MUSIC.src){ embedSpotify(); return; }
  if (!audio.paused){ audio.pause(); return; }
  audio.play().catch(function(){ if (hasFile) toast(t("blocked")); else embedSpotify(); });
});
audio.addEventListener("play", function(){ setPlaying(true); });
audio.addEventListener("pause", function(){ setPlaying(false); });
audio.addEventListener("ended", function(){ audio.currentTime = 0; setPlaying(false); tickSpot(); });
audio.addEventListener("timeupdate", tickSpot);
audio.addEventListener("loadedmetadata", tickSpot);
function seekTo(x){ var r = $("spSeek").getBoundingClientRect(), p = clamp((x-r.left)/r.width,0,1); if (audio.duration) audio.currentTime = p*audio.duration; tickSpot(); }
$("spSeek").addEventListener("pointerdown", function(e){ seekTo(e.clientX); var mv=function(ev){ seekTo(ev.clientX); }, up=function(){ window.removeEventListener("pointermove",mv); window.removeEventListener("pointerup",up); }; window.addEventListener("pointermove",mv); window.addEventListener("pointerup",up); });
$("spSeek").addEventListener("keydown", function(e){ if (!audio.duration) return; if (e.key==="ArrowRight"){ audio.currentTime=Math.min(audio.duration,audio.currentTime+5); e.preventDefault(); } if (e.key==="ArrowLeft"){ audio.currentTime=Math.max(0,audio.currentTime-5); e.preventDefault(); } });
renderers.push(function(){ if ($("spIcon")) setPlaying(!audio.paused); });

/* =====================================================================
   education: installer
   ===================================================================== */
var DAY = 86400000;
function renderEdu(){
  var now = Date.now(), s = Date.parse(EDU.start), p0 = Date.parse(EDU.ptit), g = Date.parse(EDU.grad);
  var pct = clamp((now-s)/(g-s)*100, 0, 100), ptPct = clamp((now-p0)/(g-p0)*100, 0, 100);
  var year = clamp(Math.floor((now-p0)/(365.25*DAY))+1, 1, 5), graduated = now >= g;
  var months = Math.max(0, Math.round((g-now)/(30.44*DAY)));
  $("instLeft").textContent = graduated ? "" : t("left")(Math.floor(months/12), months%12);
  $("instPct").textContent = Math.round(pct)+"%"; $("instPct").setAttribute("data-v", Math.round(pct));
  var bar = $("instBar"); bar.style.setProperty("--p", pct.toFixed(1)+"%"); bar.setAttribute("aria-valuenow", Math.round(pct)); bar.setAttribute("aria-label", t("instNow"));
  var states = ["done","done", graduated?"done":"active", graduated?"done":"todo", graduated?"active":"todo","todo"];
  var ICON = {done:'<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2 5.2l2 2 4-4.4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>', active:"", todo:""};
  $("instSide").innerHTML = t("side").map(function(n,i){ return '<li class="'+states[i]+'"'+(states[i]==="active"?' aria-current="step"':'')+'><span class="st">'+ICON[states[i]]+'</span>'+n+'</li>'; }).join("");
  var yrs = ["2018–2022","2022–2025","2025–2030","2030","—","—"];
  $("instLog").innerHTML = t("log").map(function(r,i){
    var sub = r[1] + (i===2 ? year : "");
    var right = yrs[i] + (i===2 && !graduated ? '<span class="mini" aria-hidden="true"><i style="--p:'+ptPct.toFixed(1)+'%"></i></span>' : "");
    return '<li class="'+states[i]+'"><span class="st">'+ICON[states[i]]+'</span><span><span class="nm">'+r[0]+'</span><span class="sub">'+sub+'</span></span><span class="yr">'+right+'</span></li>';
  }).join("");
}
renderers.push(renderEdu);

/* visit counter in the hero line (GoatCounter public count).
   null = still loading ("…"), false = not available (blocked or not enabled) → "kha khá" */
var VISITS = null;
function renderVisits(){ $$(".vc").forEach(function(el){ el.textContent = VISITS===null ? "…" : VISITS===false ? t("visitsSome") : VISITS.replace(/\B(?=(\d{3})+$)/g, lang==="en" ? "," : "."); }); }
renderers.push(renderVisits);
if (GOATCOUNTER && window.fetch && !/^(localhost|127\.)/.test(location.hostname)){
  fetch("https://"+GOATCOUNTER+".goatcounter.com/counter/TOTAL.json")
    .then(function(r){ return r.ok ? r.json() : null; })
    .then(function(d){ var n = d && d.count ? parseInt(String(d.count).replace(/\D/g, ""), 10) : NaN; VISITS = isNaN(n) ? false : String(n + (VIEW_BONUS||0)); renderVisits(); })
    .catch(function(){ VISITS = false; renderVisits(); });
} else VISITS = false;

/* =====================================================================
   projects: stacked folders
   ===================================================================== */
var FOLDER_ICON = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M1.5 4.5a1 1 0 0 1 1-1h3.4l1.4 1.5h6.2a1 1 0 0 1 1 1v6.5a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1z"/></svg>';
var IMG_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2.5"/><circle cx="9" cy="10" r="2"/><path d="m4 18 5-5 4 4 3-3 4 4"/></svg>';
function visibleProjects(){ return PROJECTS.filter(function(p){ return !p.hidden; }); }
function renderProjects(){
  var list = visibleProjects(), n = list.length;
  $("du-an").style.setProperty("--n", n);
  $("du-an").classList.toggle("single", n < 2);
  $("projDeck").innerHTML = list.map(function(p,i){
    var mid = p.steps ? '<ol class="steps">'+L(p.steps).map(function(x){ return '<li><b>'+x[0]+'</b>'+x[1]+'</li>'; }).join("")+'</ol>'
            : (p.feats ? '<ul class="feats">'+L(p.feats).map(function(f){ return '<li>'+f+'</li>'; }).join("")+'</ul>' : "");
    var right = p.gallery
      ? '<div class="gal"><figure class="gal-main"><img src="'+p.gallery[0].src+'" alt="'+esc(L(p.gallery[0].alt))+'" width="'+p.gallery[0].w+'" height="'+p.gallery[0].h+'"></figure>'+
        '<div class="gal-thumbs">'+p.gallery.map(function(g,k){ return '<button type="button" class="gal-th" data-k="'+k+'" aria-pressed="'+(k===0)+'" aria-label="'+esc(L(g.alt))+'"><img src="'+g.src+'" alt="" width="'+g.w+'" height="'+g.h+'"></button>'; }).join("")+'</div></div>'
      : '<div class="shot"><div>'+IMG_ICON+L(p.shot)+'</div></div>';
    return '<article class="proj-card" style="--cc:'+p.color+';top:'+(i*14)+'px;z-index:'+(i+1)+'" aria-label="'+esc(L(p.title))+'" data-i="'+PROJECTS.indexOf(p)+'">'+
      '<div class="tab">'+FOLDER_ICON+p.file+'</div>'+
      '<div class="body"><div>'+
        '<div class="pc-meta">'+L(p.meta)+'</div>'+
        '<h3 class="pc-title">'+L(p.title)+'</h3>'+
        '<p class="pc-desc">'+L(p.desc)+'</p>'+ mid +
        (p.role ? '<p class="role">'+L(p.role)+'</p>' : "")+
        '<div class="tags">'+p.tags.map(function(x){ return '<span class="chip">'+x+'</span>'; }).join("")+'</div>'+
        '<div class="pc-links">'+p.links.map(function(l,j){ return '<a class="btn'+(j===0?' primary':'')+'" href="'+l.href+'" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><use href="#'+(l.icon||"i-gh")+'"/></svg>'+L(l.label)+'</a>'; }).join("")+'</div>'+
      '</div>'+right+'</div>'+
    '</article>';
  }).join("");
  $$(".proj-card").forEach(function(card){
    var p = PROJECTS[+card.getAttribute("data-i")];
    $$(".gal-th", card).forEach(function(b){ b.addEventListener("click", function(){
      var g = p.gallery[+b.getAttribute("data-k")], img = card.querySelector(".gal-main img");
      img.src = g.src; img.alt = L(g.alt); img.width = g.w; img.height = g.h;
      $$(".gal-th", card).forEach(function(x){ x.setAttribute("aria-pressed", x === b); });
    }); });
  });
  updateDeck();
}
renderers.push(renderProjects);
function updateDeck(){
  var sec = $("du-an"), cards = $$(".proj-card", sec), n = cards.length;
  if (!isDesk()){ cards.forEach(function(c){ c.style.transform=""; c.style.filter=""; }); $("projCount").textContent = ""; return; }
  var vh = window.innerHeight, p = (window.scrollY - (sec.getBoundingClientRect().top + window.scrollY)) / vh;
  var deckH = $("projDeck").clientHeight;
  cards.forEach(function(c,i){
    var ty = 0, cover = clamp(p - i, 0, 1);
    if (i > 0){ var tIn = clamp(p - (i-1), 0, 1); ty = (1 - tIn) * (vh + 40); }
    var sc = 1 - .045*cover;
    c.style.transform = "translateY("+ty.toFixed(1)+"px) scale("+sc.toFixed(4)+")";
    c.style.filter = cover > 0 ? "brightness("+(1 - .1*cover).toFixed(3)+")" : "";
  });
  var idx = clamp(Math.round(p), 0, n-1) + 1;
  $("projCount").innerHTML = n > 1 ? "<b>"+pad(idx)+"</b> / "+pad(n) : "";
}

/* =====================================================================
   skills
   ===================================================================== */
function renderSkills(){
  $("skillPanel").innerHTML = SKILLS.map(function(g){
    return '<div class="grp"><div class="grp-h">'+L(g.name)+'</div>'+g.items.map(function(s){
      return '<div class="sk"><span class="nm">'+s[0]+'</span><div class="pbar" style="--p:'+s[1]+'%" role="progressbar" aria-label="'+s[0]+'" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+s[1]+'"><i></i></div><span class="pc" data-v="'+s[1]+'">'+s[1]+'%</span></div>';
    }).join("")+'</div>';
  }).join("");
}
renderers.push(renderSkills);

/* progress bars fill up each time their section comes into view */
function replayBars(root){
  $$(".sk .pc", root).forEach(function(el){ countUp(el, +el.getAttribute("data-v") || 0, "%"); });
  var ip = root.querySelector("#instPct"); if (ip) countUp(ip, +ip.getAttribute("data-v") || 0, "%");
  if (reduce) return;
  $$(".pbar", root).forEach(function(b){
    var target = b.style.getPropertyValue("--p");
    b.classList.remove("anim"); b.style.setProperty("--p","0%"); void b.offsetWidth;
    b.classList.add("anim"); b.style.setProperty("--p", target);
  });
}

/* =====================================================================
   about-me.txt
   ===================================================================== */
var aboutTab = "now";
function renderAbout(){
  var ps = L(ABOUT[aboutTab]);
  $("tePaper").innerHTML = ps.map(function(x,i){ return '<p'+(i===ps.length-1?' class="caret"':'')+'>'+x+'</p>'; }).join("")+'<p class="sig">— Long</p>';
  $$(".seg [role=tab]").forEach(function(b){ var on = b.getAttribute("data-tab")===aboutTab; b.setAttribute("aria-selected", on); b.tabIndex = on ? 0 : -1; if (on) $("tePaper").setAttribute("aria-labelledby", b.id); });
}
renderers.push(renderAbout);
$$(".seg [role=tab]").forEach(function(b, i, all){
  b.addEventListener("click", function(){ aboutTab = b.getAttribute("data-tab"); renderAbout(); });
  b.addEventListener("keydown", function(e){
    var d = e.key==="ArrowRight" ? 1 : e.key==="ArrowLeft" ? -1 : 0; if (!d) return;
    var nb = all[(i+d+all.length)%all.length]; aboutTab = nb.getAttribute("data-tab"); renderAbout(); nb.focus(); e.preventDefault();
  });
});

/* =====================================================================
   shell: a fake zsh over a small virtual filesystem
   ===================================================================== */
var FS = {type:"dir", c:{
  "about.txt":{type:"file", text:"Trần Đức Long (aka Not Kokonut)\nSinh viên năm 2, An toàn thông tin, PTIT.\nRất biết sợ và không muốn bị ăn đòn.\nĐang làm ở Côn Ti Bát Nin.\nHiện đang tắc đường ở Hà Nội."},
  "hoc-van.txt":{type:"file", text:"[✓] THCS Việt Nam – Angiêri          2018–2022\n[✓] THPT Trần Hưng Đạo – Thanh Xuân    2022–2025\n[~] PTIT · An toàn thông tin           2025–2030\n[ ] Tốt nghiệp\n[ ] Đi làm\n[ ] Cưới vợ rồi đẻ con"},
  "ky-nang.txt":{type:"file", text:SKILLS.map(function(g){ return g.items.map(function(x){ var n = Math.round(x[1]/5); return (x[0]+"          ").slice(0,11)+"["+"█".repeat(n)+"░".repeat(20-n)+"] "+x[1]+"%"; }).join("\n"); }).join("\n")+"\n\nNgôn ngữ: IELTS 6.5 · HSK 3 (đang học)"},
  "lien-he.txt":{type:"file", text:"email    contact@tranduclong.id.vn\nemail    longt3384@gmail.com\ngithub   github.com/Kokonut-Original\ndiscord  kokonut_original\nfb       facebook.com/backislayer\nig       instagram.com/anhdangxuy_"},
  "du-an":{type:"dir", c:{
    "orb-clash.md":{type:"file", text:"# Orb Clash\nGame đấu bóng vật lý offline với bot (HTML canvas + JS thuần).\nBóng càng hiếm kỹ năng càng dị.\n→ gõ: open orb"}
  }},
  "todo.txt":{type:"file", text:"[x] ngủ full time\n[ ] đi gym   <- không tick được, lười\n[ ] học bài\n[ ] học tiếng Trung"},
  ".secret":{type:"file", text:"Tìm được file ẩn rồi đấy. Dân bảo mật có khác.\nflag{sakura_khong_phai_cookie}"}
}};
var LINKS = {github:"https://github.com/Kokonut-Original", orb:"https://tranduclong.id.vn/orbclash/", orbrepo:"https://github.com/Kokonut-Original/orb-clash",
  spotify:"https://open.spotify.com/user/b25kq5xy99t3igprvzmsh23uw", valorant:"https://tracker.gg/valorant/profile/riot/C%C3%A0%20Ph%C3%AA%20S%E1%BB%AFa%20D%E1%BB%ABa%23nut/overview"};
var GOTO = ["top","hoc-van","du-an","ky-nang","playground","about","lien-he"];
var CMDS = ["help","ls","cd","pwd","cat","tree","clear","whoami","echo","history","date","uname","neofetch","open","goto","sudo","rm","nmap","man","exit"];

function makeShell(o){
  var cwd = [], hist = [], hIdx = 0, out = o.out, input = o.input;
  function pathStr(){ return "~" + (cwd.length ? "/"+cwd.join("/") : ""); }
  function resolve(arg){
    arg = arg || "";
    var abs = arg.charAt(0)==="/" || arg==="~" || arg.indexOf("~/")===0;
    var parts = arg.split("/").filter(Boolean); if (arg.indexOf("~")===0) parts = parts.slice(1);
    var p = abs ? [] : cwd.slice();
    parts.forEach(function(x){ if (x===".") return; if (x==="..") p.pop(); else p.push(x); });
    var node = FS; for (var j=0;j<p.length;j++){ if (!node.c || !node.c[p[j]]) return null; node = node.c[p[j]]; }
    return {node:node, path:p};
  }
  function print(html){ var d=document.createElement("pre"); d.innerHTML=html; out.appendChild(d); }
  function prompt(){ return '<span class="p">long@tranduclong:'+esc(pathStr())+'$</span> '; }
  function scroll(){ o.scroller.scrollTop = o.scroller.scrollHeight; }
  function boot(){
    var n = hnNow();
    print('<span class="d">Last login: '+t("short")[n.wd]+' '+pad(n.d)+'/'+pad(n.m)+' '+pad(n.h)+':'+pad(n.mi)+' on ttys000</span>');
    print(lang!=="en" ? 'Chào bạn. Gõ <span class="ok">help</span> để xem lệnh, hoặc thử <span class="ok">neofetch</span>.' : 'Hi. Type <span class="ok">help</span> to list commands, or try <span class="ok">neofetch</span>.');
  }
  function run(raw){
    var line = raw.trim();
    print(prompt()+esc(raw));
    if (line){ hist.push(line); hIdx = hist.length; exec(line); }
    o.promptEl.textContent = "long@tranduclong:"+pathStr()+"$";
    scroll();
  }
  function exec(line){
    var a = line.split(/\s+/), cmd = a[0], args = a.slice(1), vi = lang!=="en", r;
    switch(cmd){
      case "help": print(vi ?
        'Lệnh có sẵn:\n  <span class="ok">ls</span> [-a]      xem file          <span class="ok">cd</span> &lt;thư mục&gt;   đổi thư mục\n  <span class="ok">cat</span> &lt;file&gt;    đọc file          <span class="ok">tree</span>           cây thư mục\n  <span class="ok">whoami</span>        mình là ai        <span class="ok">neofetch</span>       thông tin máy\n  <span class="ok">open</span> &lt;tên&gt;    github · orb · spotify · valorant\n  <span class="ok">goto</span> &lt;phần&gt;   hoc-van · du-an · ky-nang · playground · about · lien-he\n  <span class="ok">history</span> · <span class="ok">date</span> · <span class="ok">uname</span> · <span class="ok">echo</span> · <span class="ok">clear</span> · <span class="ok">exit</span>\n<span class="d">Mẹo: Tab để tự hoàn thành, ↑ ↓ để xem lệnh cũ, Ctrl+L để xóa màn hình.</span>' :
        'Commands:\n  <span class="ok">ls</span> [-a]   <span class="ok">cd</span> &lt;dir&gt;   <span class="ok">cat</span> &lt;file&gt;   <span class="ok">tree</span>   <span class="ok">whoami</span>   <span class="ok">neofetch</span>\n  <span class="ok">open</span> &lt;name&gt;   github · orb · spotify · valorant\n  <span class="ok">goto</span> &lt;part&gt;   hoc-van · du-an · ky-nang · playground · about · lien-he\n  <span class="ok">history</span> · <span class="ok">date</span> · <span class="ok">uname</span> · <span class="ok">echo</span> · <span class="ok">clear</span> · <span class="ok">exit</span>\n<span class="d">Tip: Tab completes, ↑ ↓ for history, Ctrl+L clears.</span>'); break;
      case "ls":
        var all = args.some(function(x){ return /^-[a-z]*a/.test(x); }), target = args.filter(function(x){ return x.charAt(0)!=="-"; })[0];
        r = resolve(target);
        if (!r) { print('<span class="e">ls: '+esc(target)+': No such file or directory</span>'); break; }
        if (r.node.type==="file") { print(esc(target)); break; }
        print(Object.keys(r.node.c).filter(function(k){ return all || k.charAt(0)!=="."; }).map(function(k){ return r.node.c[k].type==="dir" ? '<span class="dir">'+esc(k)+'/</span>' : esc(k); }).join("   ")); break;
      case "cd":
        if (!args[0] || args[0]==="~"){ cwd=[]; break; }
        r = resolve(args[0]);
        if (!r) print('<span class="e">cd: no such file or directory: '+esc(args[0])+'</span>');
        else if (r.node.type!=="dir") print('<span class="e">cd: not a directory: '+esc(args[0])+'</span>');
        else cwd = r.path; break;
      case "pwd": print("/home/long"+(cwd.length?"/"+cwd.map(esc).join("/"):"")); break;
      case "cat":
        if (!args[0]) { print('<span class="e">cat: '+(vi?"thiếu tên file":"missing file name")+'</span>'); break; }
        r = resolve(args[0]);
        if (!r) print('<span class="e">cat: '+esc(args[0])+': No such file or directory</span>');
        else if (r.node.type==="dir") print('<span class="e">cat: '+esc(args[0])+': Is a directory</span>');
        else print(esc(r.node.text)); break;
      case "tree":
        var lines = ["."];
        (function walk(node, pre){ var ks = Object.keys(node.c).filter(function(k){ return k.charAt(0)!=="."; });
          ks.forEach(function(k,i){ var last=i===ks.length-1, ch=node.c[k];
            lines.push(pre+(last?"└── ":"├── ")+(ch.type==="dir"?'<span class="dir">'+esc(k)+'</span>':esc(k)));
            if (ch.type==="dir") walk(ch, pre+(last?"    ":"│   ")); }); })(resolve("").node, "");
        print(lines.join("\n")); break;
      case "clear": out.innerHTML=""; break;
      case "whoami": print('tran_duc_long  <span class="d"># aka notkokonut</span>'); break;
      case "echo": print(esc(args.join(" "))); break;
      case "history": print(hist.map(function(h,i){ return "  "+(i+1)+"  "+esc(h); }).join("\n")); break;
      case "date": var n=hnNow(); print(t("days")[n.wd]+" "+pad(n.d)+"/"+pad(n.m)+"/"+n.y+" "+pad(n.h)+":"+pad(n.mi)+":"+pad(n.s)+" ICT (Hà Nội)"); break;
      case "uname": print(args[0]==="-a" ? "SakuraOS 1.0 tranduclong.id.vn hanoi-build x86_64 PTIT/ATTT" : "SakuraOS"); break;
      case "neofetch": print(
'<span class="p">   ✿   ✿     </span>  <span class="ok">long</span>@<span class="ok">tranduclong</span>\n'+
'<span class="p">  ✿ ❀ ✿ ✿    </span>  ----------------\n'+
'<span class="p">   ✿ ❀ ✿     </span>  <span class="p">OS</span>      SakuraOS (Hà Nội build)\n'+
'<span class="d">     ║       </span>  <span class="p">Host</span>    PTIT · An toàn thông tin\n'+
'<span class="d">     ║       </span>  <span class="p">Uptime</span>  '+(vi?"năm 2 / 4,5":"year 2 / 4.5")+'\n'+
'<span class="d">    ═╩═      </span>  <span class="p">Shell</span>   zsh ('+(vi?"giả lập":"simulated")+')\n'+
'             <span class="p">Lang</span>    Tiếng Việt · English (IELTS 6.5) · 中文 (HSK 3)\n'+
'             <span class="p">Tools</span>   Wazuh · Suricata · Wireshark · Docker · Git\n'+
'             <span class="p">Status</span>  '+(vi?"tắc đường ở Hà Nội":"stuck in Hanoi traffic")); break;
      case "open":
        var key = (args[0]||"").toLowerCase();
        if (LINKS[key]) print('→ <a href="'+LINKS[key]+'" target="_blank" rel="noopener">'+esc(LINKS[key])+'</a>  <span class="d">'+(vi?"(bấm để mở)":"(click to open)")+'</span>');
        else print('<span class="e">open: '+(vi?"không biết":"unknown")+' "'+esc(args[0]||"")+'". '+(vi?"Thử":"Try")+': github, orb, spotify, valorant</span>'); break;
      case "goto":
        var g = (args[0]||"").toLowerCase();
        if (GOTO.indexOf(g) > -1){ print('<span class="d">→ '+g+'</span>'); if (o.onGoto) o.onGoto(); goSection(g); }
        else print('<span class="e">goto: '+(vi?"thử":"try")+': '+GOTO.slice(1).join(", ")+'</span>'); break;
      case "sudo": print('<span class="e">long is not in the sudoers file. This incident will be reported.</span>'); break;
      case "rm": print(args.join(" ").indexOf("-rf")>-1 ? '<span class="e">rm: '+(vi?"thao tác bị chặn. Đã ghi log sự kiện #":"blocked. Event logged as #")+(1000+Math.floor(Math.random()*9000))+'.</span>' : '<span class="e">rm: permission denied</span>'); break;
      case "nmap": print('Starting Nmap ('+(vi?"giả lập":"simulated")+')\nNmap scan report for tranduclong.id.vn\nPORT    STATE  SERVICE\n22/tcp  <span class="e">closed</span> ssh\n80/tcp  <span class="ok">open</span>   http\n443/tcp <span class="ok">open</span>   https\n<span class="d">'+(vi?"Đùa thôi, đây là trang tĩnh trên GitHub Pages.":"Just kidding, this is a static page on GitHub Pages.")+'</span>'); break;
      case "man": print(vi?'Không có trang man nào cả. Thử <span class="ok">help</span>.':'No manual entry. Try <span class="ok">help</span>.'); break;
      case "exit": if (o.onExit) o.onExit(); else print('<span class="d">'+(vi?"Không thoát được đâu, đây là playground.":"Nice try. This is the playground.")+'</span>'); break;
      default: print('<span class="e">zsh: command not found: '+esc(cmd)+'</span>');
    }
  }
  o.scroller.addEventListener("mousedown", function(e){ if (!e.target.closest("a") && !window.getSelection().toString()) setTimeout(function(){ input.focus({preventScroll:true}); },0); });
  input.addEventListener("keydown", function(e){
    if (e.key==="Enter"){ run(input.value); input.value=""; e.preventDefault(); }
    else if (e.key==="ArrowUp"){ if (hIdx>0){ hIdx--; input.value=hist[hIdx]; } e.preventDefault(); }
    else if (e.key==="ArrowDown"){ if (hIdx<hist.length-1){ hIdx++; input.value=hist[hIdx]; } else { hIdx=hist.length; input.value=""; } e.preventDefault(); }
    else if (e.key==="l" && e.ctrlKey){ out.innerHTML=""; e.preventDefault(); }
    else if (e.key==="c" && e.ctrlKey && !window.getSelection().toString()){ print(prompt()+esc(input.value)+"^C"); input.value=""; e.preventDefault(); scroll(); }
    else if (e.key==="Tab"){
      e.preventDefault();
      var v = input.value, parts = v.split(/\s+/);
      if (parts.length<=1){ var m = CMDS.filter(function(c){ return c.indexOf(parts[0])===0; }); if (m.length===1) input.value = m[0]+" "; else if (m.length>1) print(prompt()+esc(v)+"\n"+m.join("   ")); }
      else if (parts[0]==="goto" || parts[0]==="open"){
        var pool = parts[0]==="goto" ? GOTO : Object.keys(LINKS), fr = parts[parts.length-1], mm = pool.filter(function(x){ return x.indexOf(fr)===0; });
        if (mm.length===1){ parts[parts.length-1]=mm[0]; input.value = parts.join(" "); } else if (mm.length>1) print(prompt()+esc(v)+"\n"+mm.join("   "));
      } else {
        var last = parts[parts.length-1], slash = last.lastIndexOf("/"), dir = slash>-1 ? last.slice(0,slash+1) : "", frag = last.slice(slash+1);
        var r = resolve(dir||"."); if (!r || r.node.type!=="dir") return;
        var ms = Object.keys(r.node.c).filter(function(k){ return k.indexOf(frag)===0 && (frag.charAt(0)==="." || k.charAt(0)!=="."); });
        if (ms.length===1){ parts[parts.length-1] = dir+ms[0]+(r.node.c[ms[0]].type==="dir"?"/":""); input.value = parts.join(" "); }
        else if (ms.length>1) print(prompt()+esc(v)+"\n"+ms.join("   "));
      }
      scroll();
    }
  });
  return { run:run, boot:boot, clear:function(){ out.innerHTML=""; cwd=[]; o.promptEl.textContent="long@tranduclong:~$"; } };
}

/* terminal window from the dock */
var win = $("win"), dkTerm = $("dkTerm"), stopWin = null, winOpen = false, winMoved = false;
var shell1 = makeShell({ out:$("tout1"), input:$("tin1"), promptEl:$("tprompt1"), scroller:$("term1"), onExit:function(){ closeWin(false); }, onGoto:function(){ closeWin(true); } });
function placeWin(){ if (!winMoved){ win.style.left="50%"; win.style.top="50%"; win.style.marginLeft=(-win.offsetWidth/2)+"px"; win.style.marginTop=(-win.offsetHeight/2-20)+"px"; } }
function genie(p){
  var ir = dkTerm.getBoundingClientRect(), wr = win.getBoundingClientRect();
  var dx = (ir.left+ir.width/2) - (wr.left+wr.width/2), dy = (ir.top+ir.height/2) - (wr.top+wr.height/2);
  win.style.transform = "translate("+(dx*(1-p)).toFixed(1)+"px,"+(dy*(1-p)).toFixed(1)+"px) scale("+(.06+.94*p).toFixed(4)+")";
  win.style.opacity = clamp(p*1.8,0,1).toFixed(3);
}
function openWin(){
  if (winOpen){ $("tin1").focus(); return; }
  winOpen = true; win.hidden = false; win.style.transform=""; placeWin(); dkTerm.classList.add("open");
  genie(0); stopWin && stopWin();
  stopWin = spring({from:0,to:1,stiffness:260,damping:22,onUpdate:genie,onDone:function(){ win.style.transform=""; }});
  if (!$("tout1").childNodes.length) shell1.boot();
  setTimeout(function(){ $("tin1").focus({preventScroll:true}); }, 60);
}
function closeWin(keep){
  if (!winOpen) return; winOpen = false; stopWin && stopWin();
  stopWin = spring({from:1,to:0,stiffness:300,damping:32,onUpdate:function(p){ genie(Math.max(0,p)); },onDone:function(){ win.hidden = true; win.style.transform=""; }});
  if (!keep){ dkTerm.classList.remove("open"); setTimeout(shell1.clear, 400); }
  dkTerm.focus({preventScroll:true});
}
dkTerm.onclick = function(){ if (!isDesk()) openApp("playground", dkTerm.querySelector(".ic")); else openWin(); };
$("tlClose").onclick = function(){ closeWin(false); };
$("tlMin").onclick = function(){ closeWin(true); };
$("tlZoom").onclick = function(){ win.classList.toggle("zoomed"); placeWin(); };
(function(){
  var bar = $("winBar"), sx, sy, ox, oy, on=false;
  bar.addEventListener("pointerdown", function(e){ if (e.target.closest("button")) return; on=true; var r=win.getBoundingClientRect(); sx=e.clientX; sy=e.clientY; ox=r.left; oy=r.top; bar.setPointerCapture(e.pointerId); bar.style.cursor="grabbing"; });
  bar.addEventListener("pointermove", function(e){ if(!on) return; winMoved=true; win.style.marginLeft="0"; win.style.marginTop="0";
    win.style.left = clamp(ox+e.clientX-sx, -win.offsetWidth+80, window.innerWidth-80)+"px";
    win.style.top = clamp(oy+e.clientY-sy, 34, window.innerHeight-40)+"px"; });
  var end=function(){ on=false; bar.style.cursor=""; };
  bar.addEventListener("pointerup", end); bar.addEventListener("pointercancel", end);
})();

/* inline terminal in the playground */
var shell2 = makeShell({ out:$("tout2"), input:$("tin2"), promptEl:$("tprompt2"), scroller:$("term2") });
$("tin2").setAttribute("aria-label", "Terminal");
$("tin1").setAttribute("aria-label", "Terminal");
var CHIPS = ["help","neofetch","ls -a","tree","cat todo.txt","sudo rm -rf /","nmap localhost","goto lien-he"];
$("cmdChips").innerHTML = CHIPS.map(function(c){ return '<button type="button">'+esc(c)+'</button>'; }).join("");
$$("#cmdChips button").forEach(function(b){ b.addEventListener("click", function(){ shell2.run(b.textContent); $("tin2").focus({preventScroll:true}); }); });

/* =====================================================================
   section navigation: normal scrolling; dots, folders and buttons jump smoothly
   ===================================================================== */
var SECS = $$("[data-stop]"), stops = [], cur = 0, animating = false;
function buildStops(){
  var vh = window.innerHeight, max = document.documentElement.scrollHeight - vh;
  stops = [];
  SECS.forEach(function(sec){
    var top = sec.getBoundingClientRect().top + window.scrollY;
    if (sec.id === "du-an"){ for (var i=0;i<visibleProjects().length;i++) stops.push({y:top+i*vh, sec:sec}); }
    else stops.push({y:top, sec:sec});
  });
  stops.forEach(function(s){ s.y = clamp(Math.round(s.y), 0, Math.max(0, max)); });
}
function nearestStop(){ var y = window.scrollY, best = 0; stops.forEach(function(s,i){ if (Math.abs(s.y-y) < Math.abs(stops[best].y-y)) best = i; }); return best; }
function goTo(i){
  buildStops();
  cur = clamp(i, 0, stops.length-1);
  window.scrollTo({top: stops[cur].y, behavior: reduce ? "auto" : "smooth"});
}
function goSection(id){
  if (!isDesk()){ if (id === "top") closeApp(); else openApp(id); return; }
  var el = $(id); if (!el) return;
  buildStops();
  for (var i=0;i<stops.length;i++){ if (stops[i].sec === el){ goTo(i); return; } }
}
document.addEventListener("keydown", function(e){ if (e.key==="Escape" && winOpen) closeWin(true); });

/* dots, folders, buttons */
$("dots").innerHTML = SECS.map(function(s){ return '<button type="button" data-go="'+s.id+'" aria-label=""></button>'; }).join("");
function labelDots(){ $$("#dots button").forEach(function(b,i){ b.setAttribute("aria-label", t(SECS[i].getAttribute("data-name"))); b.title = t(SECS[i].getAttribute("data-name")); }); }
renderers.push(labelDots);
$$("[data-go]").forEach(function(b){ b.addEventListener("click", function(){ goSection(b.getAttribute("data-go")); }); });
$$("[data-step]").forEach(function(b){ b.addEventListener("click", function(){
  var d = +b.getAttribute("data-step");
  if (isDesk()) goTo(nearestStop() + d);
  else { var ids = SECS.map(function(x){ return x.id; }), i = ids.indexOf(appOpen ? appOpen.id : "top"); goSection(ids[clamp(i+d, 0, ids.length-1)]); }
}); });
$("homeLink").addEventListener("click", function(e){ e.preventDefault(); goTo(0); });

var curSec = null, seen = {};
function updateUI(sec){
  if (sec === curSec) return;
  curSec = sec;
  var name = sec.getAttribute("data-name");
  $("mbSec").textContent = name === "desk" ? "" : t(name);
  document.body.classList.toggle("away", sec.id !== "top");
  $$("#dots button").forEach(function(b){ b.setAttribute("aria-current", b.getAttribute("data-go") === sec.id ? "true" : "false"); });
  if (sec.id === "hoc-van" || sec.id === "ky-nang") replayBars(sec);
}
renderers.push(function(){ var s = curSec; curSec = null; if (s) updateUI(s); });

var ticking = false;
window.addEventListener("scroll", function(){
  if (ticking) return; ticking = true;
  requestAnimationFrame(function(){
    ticking = false;
    updateDeck();
    if (isDesk() && !reduce) bc.style.transform = "translateY("+(-Math.min(90, window.scrollY*.05)).toFixed(1)+"px)";
    if (!stops.length || !isDesk()) return;
    if (isDesk()){
      if (!animating) cur = nearestStop();
      var probe = window.scrollY + window.innerHeight*.45, s = stops[0].sec;
      stops.forEach(function(st){ if (st.y <= probe) s = st.sec; });
      updateUI(s);
    } else {
      var mid = window.innerHeight*.4, found = SECS[0];
      SECS.forEach(function(sec){ if (sec.getBoundingClientRect().top <= mid) found = sec; });
      updateUI(found);
    }
  });
}, {passive:true});
var rzT;
window.addEventListener("resize", function(){
  clearTimeout(rzT);
  rzT = setTimeout(function(){
    if (isDesk() && appOpen){ var s = appOpen; appOpen = null; s.classList.remove("open"); s.style.transform = s.style.opacity = s.style.borderRadius = ""; document.body.classList.remove("app-open"); $("appbar").hidden = true; $("homebar").hidden = true; }
    buildStops(); drawBranches(); sizePetals(); updateDeck();
  }, 150);
});



/* =====================================================================
   Discord presence (Lanyard)
   ===================================================================== */
var DC = null;
function ago(ts){ var m = Math.max(1, Math.round((Date.now()-ts)/60000)); return m < 60 ? m+t("dcMin") : Math.floor(m/60)+t("dcHr")+" "+(m%60)+t("dcMin"); }
function renderDiscord(){
  var st = DC ? DC.discord_status : "none", line = "";
  if (!DISCORD_ID) line = t("dcSetup");
  else if (DC){
    var acts = (DC.activities||[]).filter(function(a){ return a.type !== 4; }), custom = (DC.activities||[]).filter(function(a){ return a.type === 4 && a.state; })[0];
    if (DC.listening_to_spotify && DC.spotify) line = t("dcListen")+": "+esc(DC.spotify.song)+" – "+esc(DC.spotify.artist);
    else if (acts[0]) line = t("dcPlay")+" "+esc(acts[0].name)+(acts[0].timestamps && acts[0].timestamps.start ? " · "+ago(acts[0].timestamps.start) : "");
    else if (custom) line = esc(custom.state);
    else line = t("dcIdleLine");
    var u = DC.discord_user || {};
    if (u.avatar){ $("dcAva").src = "https://cdn.discordapp.com/avatars/"+u.id+"/"+u.avatar+".png?size=128"; $("dcAva").hidden = false; $("dcInit").hidden = true; }
    if (u.global_name) $("dcName").textContent = u.global_name;
  }
  $("dcStatus").textContent = t("dc")[st] || t("dc").offline;
  $("dcLine").innerHTML = line;
  var cls = {online:"online",idle:"idle",dnd:"dnd"}[st] || "off";
  $("dcDot").className = "dc-dot " + cls;
  var hd = document.querySelector(".status .dot"); if (hd && DISCORD_ID) hd.className = "dot " + (cls === "online" ? "" : cls);
}
renderers.push(renderDiscord);
function loadDiscord(){
  if (!DISCORD_ID) return;
  try {
    fetch("https://api.lanyard.rest/v1/users/"+DISCORD_ID)
      .then(function(r){ return r.json(); })
      .then(function(j){ if (j && j.success){ DC = j.data; renderDiscord(); } })
      .catch(function(){});
  } catch(e){}
}
setInterval(loadDiscord, 30000);
setInterval(renderDiscord, 60000);

/* =====================================================================
   motion: reveal on scroll, count-up numbers, tilt, magnetic buttons, parallax
   ===================================================================== */
function countUp(el, to, suffix){
  if (!el) return;
  if (reduce){ el.textContent = to + suffix; return; }
  var t0 = performance.now(), dur = 1300;
  (function step(now){ var k = clamp((now - t0)/dur, 0, 1), e = 1 - Math.pow(1-k, 3); el.textContent = Math.round(to*e) + suffix; if (k < 1) requestAnimationFrame(step); })(t0);
}
function setupReveal(){
  if (reduce || !("IntersectionObserver" in window)) return;
  var io = new IntersectionObserver(function(es){
    es.forEach(function(en){ if (!en.isIntersecting) return; var el = en.target; el.classList.add("in"); io.unobserve(el);
      setTimeout(function(){ el.classList.remove("rv","in"); el.style.removeProperty("--d"); }, 1400); });
  }, {threshold:.12, rootMargin:"0px 0px -6% 0px"});
  $$(".sec-head,.inst,.proj-deck,.skills > *,.footnote,.play > *,.textedit,.mails > *,.socials > *,.foot").forEach(function(el){
    var r = el.getBoundingClientRect();
    if (isDesk() && r.height && r.top < window.innerHeight) return;
    var i = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
    el.classList.add("rv"); el.style.setProperty("--d", Math.min(i, 6)*80 + "ms"); io.observe(el);
  });
}
(function(){
  var TILT = ".gal-main,.lcard,.mail", MAG = ".btn,.sp-play", lt = null, lm = null;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  document.addEventListener("pointermove", function(e){
    if (reduce || !e.target.closest) return;
    var tl = e.target.closest(TILT), mg = e.target.closest(MAG);
    if (lt && lt !== tl){ lt.style.transform = ""; lt = null; }
    if (lm && lm !== mg){ lm.style.transform = ""; lm = null; }
    if (tl){ var r = tl.getBoundingClientRect(), x = (e.clientX-r.left)/r.width - .5, y = (e.clientY-r.top)/r.height - .5;
      tl.style.transform = "perspective(900px) rotateX("+(-y*7).toFixed(2)+"deg) rotateY("+(x*9).toFixed(2)+"deg) translateY(-2px)"; lt = tl; }
    if (mg){ var q = mg.getBoundingClientRect(), mx = e.clientX-(q.left+q.width/2), my = e.clientY-(q.top+q.height/2);
      mg.style.transform = "translate("+(mx*.18).toFixed(1)+"px,"+(my*.25).toFixed(1)+"px)"; lm = mg; }
  }, {passive:true});
  document.addEventListener("pointerleave", function(){ if (lt) lt.style.transform = ""; if (lm) lm.style.transform = ""; lt = lm = null; });
})();

/* =====================================================================
   phone: iPhone-style home screen, sections open as full-screen apps
   ===================================================================== */
var appOpen = null, appFrom = null, stopSheet = null;
function sheetFrame(sec, p){
  var W = window.innerWidth, H = window.innerHeight, r = appFrom ? appFrom.getBoundingClientRect() : null;
  if (!r || !r.width) r = {left:W/2-30, top:H/2-30, width:60, height:60};
  var sx = r.width/W, sy = r.height/H, dx = (r.left+r.width/2) - W/2, dy = (r.top+r.height/2) - H/2;
  sec.style.transform = "translate("+(dx*(1-p)).toFixed(1)+"px,"+(dy*(1-p)).toFixed(1)+"px) scale("+(sx+(1-sx)*p).toFixed(4)+","+(sy+(1-sy)*p).toFixed(4)+")";
  sec.style.borderRadius = Math.max(0, (1-p)*40).toFixed(1)+"px";
  sec.style.opacity = clamp(p*2.5, 0, 1).toFixed(3);
}
function animateSheet(sec, from, to, done){
  stopSheet && stopSheet();
  stopSheet = spring({from:from, to:to, stiffness:300, damping:30, onUpdate:function(p){ sheetFrame(sec, clamp(p, 0, 1.03)); },
    onDone:function(){ if (to === 1){ sec.style.transform = ""; sec.style.borderRadius = ""; sec.style.opacity = ""; } done && done(); }});
}
function openApp(id, from){
  var sec = $(id); if (!sec || !sec.classList.contains("sec")) return;
  if (appOpen === sec) return;
  if (appOpen){ appOpen.classList.remove("open"); appOpen.style.transform = appOpen.style.opacity = appOpen.style.borderRadius = ""; }
  appOpen = sec; appFrom = from || null;
  sec.classList.add("open"); sec.scrollTop = 0;
  document.body.classList.add("app-open");
  $("appbar").hidden = false; $("homebar").hidden = false;
  $("appTitle").textContent = t(sec.getAttribute("data-name"));
  try { if (history.state && history.state.app) history.replaceState({app:id}, ""); else history.pushState({app:id}, ""); } catch(e){}
  sheetFrame(sec, 0); animateSheet(sec, 0, 1);
  if (id === "hoc-van" || id === "ky-nang") replayBars(sec);
}
function closeApp(fromPop){
  if (!appOpen) return;
  var sec = appOpen; appOpen = null;
  document.body.classList.remove("app-open");
  $("appbar").hidden = true; $("homebar").hidden = true;
  animateSheet(sec, 1, 0, function(){ sec.classList.remove("open"); sec.style.transform = sec.style.opacity = sec.style.borderRadius = ""; });
  if (!fromPop){ try { if (history.state && history.state.app) history.back(); } catch(e){} }
}
window.addEventListener("popstate", function(){ if (appOpen) closeApp(true); });
$("appBack").addEventListener("click", function(){ closeApp(); });
renderers.push(function(){ if (appOpen) $("appTitle").textContent = t(appOpen.getAttribute("data-name")); });
(function(){
  var hb = $("homebar"), y0 = null;
  hb.addEventListener("pointerdown", function(e){ y0 = e.clientY; hb.setPointerCapture(e.pointerId); });
  hb.addEventListener("pointerup", function(){ y0 = null; closeApp(); });
  hb.addEventListener("pointercancel", function(){ y0 = null; });
})();
document.addEventListener("keydown", function(e){ if (e.key === "Escape" && appOpen) closeApp(); });
$$("[data-open]").forEach(function(b){ b.addEventListener("click", function(){ openApp(b.getAttribute("data-open"), b.querySelector(".app-ic") || b); }); });
(function(){
  var desk = $("top"), dots = $$("#pdots i");
  desk.addEventListener("scroll", function(){
    var i = Math.round(desk.scrollLeft / Math.max(1, desk.clientWidth));
    dots.forEach(function(d, k){ d.classList.toggle("on", k === i); });
  }, {passive:true});
})();

/* =====================================================================
   wallpaper: sakura branches (static) + falling petals
   ===================================================================== */
var bc = $("branches"), bx = bc.getContext("2d"), pc = $("petals"), px = pc.getContext("2d"), DPR = Math.min(2, window.devicePixelRatio||1);
function rng(seed){ return function(){ seed = (seed*16807) % 2147483647; return (seed-1)/2147483646; }; }
function drawBranches(){
  var W = window.innerWidth, H = window.innerHeight;
  bc.width = W*DPR; bc.height = H*DPR; bx.setTransform(DPR,0,0,DPR,0,0); bx.clearRect(0,0,W,H);
  var R = rng(7), wood = getComputedStyle(document.documentElement).getPropertyValue("--branch").trim(), blooms = [];
  function branch(x,y,ang,len,w,depth){
    var x2 = x + Math.cos(ang)*len, y2 = y + Math.sin(ang)*len, cx = (x+x2)/2 + (R()-.5)*len*.35, cy = (y+y2)/2 + (R()-.5)*len*.35;
    bx.strokeStyle = wood; bx.lineCap="round"; bx.lineWidth = w;
    bx.beginPath(); bx.moveTo(x,y); bx.quadraticCurveTo(cx,cy,x2,y2); bx.stroke();
    if (depth>0){ var n = depth>3 ? 2 : 2 + (R()<.5?1:0); for (var i=0;i<n;i++) branch(x2,y2, ang + (R()-.5)*1.1, len*(.62+R()*.2), Math.max(.8,w*.62), depth-1); }
    if (depth<3){ var k = 3 + Math.floor(R()*4); for (var j=0;j<k;j++){ var tt=R(); blooms.push([x+(x2-x)*tt+(R()-.5)*14, y+(y2-y)*tt+(R()-.5)*14, 3.2+R()*4.2, R()]); } }
  }
  var sc = clamp(W/1440, .7, 1.25);
  branch(W+20, 40*sc, Math.PI*0.84, 180*sc, 12*sc, 5);
  branch(W+30, H*.7, Math.PI*1.03, 110*sc, 9*sc, 3);
  branch(-20, H+10, -Math.PI*0.32, 110*sc, 8*sc, 3);
  var pinks = ["#F8C8D5","#F4B1C4","#FBDCE5","#EFA0B6","#FFE9EF"];
  blooms.forEach(function(b){
    var x=b[0], y=b[1], r=b[2]*sc, rot=b[3]*Math.PI*2;
    bx.fillStyle = pinks[Math.floor(b[3]*pinks.length)];
    for (var p=0;p<5;p++){ var a = rot + p*Math.PI*2/5; bx.beginPath(); bx.ellipse(x+Math.cos(a)*r*.62, y+Math.sin(a)*r*.62, r*.62, r*.42, a, 0, Math.PI*2); bx.fill(); }
    bx.fillStyle = "#D9637F"; bx.beginPath(); bx.arc(x,y,Math.max(1,r*.22),0,Math.PI*2); bx.fill();
  });
  if (W > 900){
    var cy0 = (250 + H - 100)/2, rad = Math.max(360, W*.36), g = bx.createRadialGradient(W/2, cy0, rad*.35, W/2, cy0, rad);
    g.addColorStop(0, "rgba(0,0,0,1)"); g.addColorStop(1, "rgba(0,0,0,0)");
    bx.save(); bx.globalCompositeOperation = "destination-out"; bx.fillStyle = g; bx.fillRect(0,0,W,H); bx.restore();
  }
}
var petals = [];
function Petal(init){ this.reset(init); }
Petal.prototype.reset = function(init){
  var W = window.innerWidth, H = window.innerHeight;
  this.x = Math.random()*W*1.1; this.y = init ? Math.random()*H : -12;
  this.s = Math.random()*4 + 3; this.vy = Math.random()*.6 + .35; this.vx = Math.random()*.5 - .1;
  this.o = Math.random()*.35 + .45; this.f = Math.random()*6; this.fs = Math.random()*.025 + .01; this.sw = Math.random()*40+40;
};
Petal.prototype.step = function(){ this.y += this.vy; this.x += this.vx - .25 + Math.sin(this.y/this.sw)*.45; this.f += this.fs; if (this.y > window.innerHeight+12 || this.x < -20) this.reset(false); };
Petal.prototype.draw = function(){
  px.save(); px.translate(this.x,this.y); px.rotate(this.f*.6); px.scale(1, Math.abs(Math.cos(this.f))*.9+.1);
  px.fillStyle = "rgba(244,170,192,"+this.o+")"; var s=this.s;
  px.beginPath(); px.moveTo(0,-s); px.bezierCurveTo(s,-s,s,s,0,s*.9); px.bezierCurveTo(-s,s,-s,-s,0,-s); px.fill();
  px.restore();
};
function sizePetals(){ pc.width = window.innerWidth*DPR; pc.height = window.innerHeight*DPR; px.setTransform(DPR,0,0,DPR,0,0); if (reduce) drawPetals(); }
function drawPetals(){ px.clearRect(0,0,window.innerWidth,window.innerHeight); petals.forEach(function(p){ if (!reduce) p.step(); p.draw(); }); }
for (var i=0, N = reduce ? 10 : (window.innerWidth < 900 ? 16 : 30); i<N; i++) petals.push(new Petal(true));
function loop(){ drawPetals(); if (!document.hidden) requestAnimationFrame(loop); }
document.addEventListener("visibilitychange", function(){ if (!document.hidden && !reduce) requestAnimationFrame(loop); });
new MutationObserver(drawBranches).observe(document.documentElement, {attributes:true, attributeFilter:["data-theme"]});

/* =====================================================================
   boot
   ===================================================================== */
applyLang();
shell2.boot();
drawBranches(); sizePetals(); if (!reduce) loop(); else drawPetals();
(function every(){ drawClock(); requestAnimationFrame(every); })();
setInterval(tickMenu, 1000); tickSpot();
setInterval(function(){ renderCal(); renderSched(); }, 60000);
loadWeather();
loadDiscord();
setupReveal();
function settle(){ buildStops(); cur = nearestStop(); updateDeck(); var s = stops[cur] ? stops[cur].sec : SECS[0]; curSec = null; updateUI(s); }
settle();
window.addEventListener("load", settle);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(settle);
})();
