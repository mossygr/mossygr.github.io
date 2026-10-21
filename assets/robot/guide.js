
(()=>{
const WD={"1": {"c": "κόκκινο", "a": "Θήκη 3×18650 +", "b": "Ασφάλεια 5A (προς μπαταρία)", "t": "0.5mm² (22AWG)", "hex": "#d7263d"}, "2": {"c": "κόκκινο", "a": "Ασφάλεια 5A (προς διακόπτη)", "b": "Διακόπτης ON/OFF IN", "t": "0.5mm² (22AWG)", "hex": "#d7263d"}, "3": {"c": "κόκκινο", "a": "Διακόπτης ON/OFF OUT", "b": "WAGO A · θέση 1", "t": "0.5mm² (22AWG)", "hex": "#d7263d"}, "4": {"c": "κόκκινο", "a": "WAGO A · θέση 2", "b": "L298N 12V", "t": "0.5mm² (22AWG)", "hex": "#d7263d"}, "5": {"c": "κόκκινο", "a": "WAGO A · θέση 3", "b": "HW-468 IN+", "t": "0.5mm² (22AWG)", "hex": "#d7263d"}, "6": {"c": "μαύρο", "a": "Θήκη 3×18650 −", "b": "WAGO B · θέση 1", "t": "0.5mm² (22AWG)", "hex": "#2b2b2b"}, "7": {"c": "μαύρο", "a": "WAGO B · θέση 3", "b": "L298N GND", "t": "0.5mm² (22AWG)", "hex": "#2b2b2b"}, "8": {"c": "μαύρο", "a": "WAGO B · θέση 2", "b": "WAGO GND · θέση 4", "t": "0.5mm² (22AWG)", "hex": "#2b2b2b"}, "9": {"c": "μαύρο", "a": "HW-468 GND", "b": "WAGO GND · θέση 1", "t": "0.5mm² (22AWG)", "hex": "#2b2b2b"}, "10": {"c": "πορτοκαλί", "a": "HW-468 OUT+", "b": "WAGO 5V · θέση 1", "t": "0.5mm² (22AWG)", "hex": "#f28c18"}, "11": {"c": "πορτοκαλί", "a": "WAGO 5V · θέση 5", "b": "ESP32-CAM 5V", "t": "0.5mm² με θηλυκό Dupont (crimp), όσο πιο κοντό", "hex": "#f28c18"}, "12": {"c": "μαύρο", "a": "WAGO GND · θέση 5", "b": "ESP32-CAM GND", "t": "0.5mm² με θηλυκό Dupont (crimp), όσο πιο κοντό", "hex": "#2b2b2b"}, "13": {"c": "πορτοκαλί", "a": "WAGO 5V · θέση 4", "b": "DFPlayer Pro VIN", "t": "Dupont", "hex": "#f28c18"}, "14": {"c": "μαύρο", "a": "WAGO GND · θέση 3", "b": "DFPlayer Pro GND", "t": "Dupont", "hex": "#2b2b2b"}, "15": {"c": "πορτοκαλί", "a": "WAGO 5V · θέση 2", "b": "Ενισχυτής VCC", "t": "Dupont", "hex": "#f28c18"}, "16": {"c": "μαύρο", "a": "WAGO GND · θέση 2", "b": "Ενισχυτής GND", "t": "Dupont", "hex": "#2b2b2b"}, "17": {"c": "μπλε", "a": "ESP32-CAM IO14", "b": "L298N IN1", "t": "Dupont", "hex": "#2563eb"}, "18": {"c": "γαλάζιο", "a": "ESP32-CAM IO15", "b": "L298N IN2", "t": "Dupont", "hex": "#14b8c4"}, "19": {"c": "κίτρινο", "a": "ESP32-CAM IO13", "b": "L298N IN3", "t": "Dupont", "hex": "#e8c400"}, "20": {"c": "λευκό", "a": "ESP32-CAM IO12", "b": "L298N IN4", "t": "Dupont", "hex": "#f2f2f2"}, "21": {"c": "πράσινο", "a": "ESP32-CAM IO2", "b": "DFPlayer Pro RX", "t": "Dupont", "hex": "#16a34a"}, "22": {"c": "μωβ", "a": "DFPlayer Pro DACL", "b": "Ενισχυτής LIN", "t": "Dupont", "hex": "#9b45d9"}, "23": {"c": "μωβ", "a": "Ενισχυτής L+", "b": "Ηχείο +", "t": "Dupont", "hex": "#9b45d9"}, "24": {"c": "μωβ", "a": "Ενισχυτής L−", "b": "Ηχείο −", "t": "Dupont", "hex": "#9b45d9"}, "25": {"c": "καφέ", "a": "L298N OUT1", "b": "Μοτέρ αριστερό μπροστά +", "t": "0.5mm² / καλώδιο μοτέρ", "hex": "#8a5a2b"}, "26": {"c": "καφέ", "a": "L298N OUT2", "b": "Μοτέρ αριστερό μπροστά −", "t": "0.5mm² / καλώδιο μοτέρ", "hex": "#8a5a2b"}, "27": {"c": "καφέ", "a": "L298N OUT1", "b": "Μοτέρ αριστερό πίσω +", "t": "0.5mm² / καλώδιο μοτέρ", "hex": "#8a5a2b"}, "28": {"c": "καφέ", "a": "L298N OUT2", "b": "Μοτέρ αριστερό πίσω −", "t": "0.5mm² / καλώδιο μοτέρ", "hex": "#8a5a2b"}, "29": {"c": "καφέ", "a": "L298N OUT3", "b": "Μοτέρ δεξί μπροστά +", "t": "0.5mm² / καλώδιο μοτέρ", "hex": "#8a5a2b"}, "30": {"c": "καφέ", "a": "L298N OUT4", "b": "Μοτέρ δεξί μπροστά −", "t": "0.5mm² / καλώδιο μοτέρ", "hex": "#8a5a2b"}, "31": {"c": "καφέ", "a": "L298N OUT3", "b": "Μοτέρ δεξί πίσω +", "t": "0.5mm² / καλώδιο μοτέρ", "hex": "#8a5a2b"}, "32": {"c": "καφέ", "a": "L298N OUT4", "b": "Μοτέρ δεξί πίσω −", "t": "0.5mm² / καλώδιο μοτέρ", "hex": "#8a5a2b"}, "33": {"c": "πόδι", "a": "Πυκνωτής C1 470–1000µF/16V", "b": "ESP32-CAM 5V", "t": "κόλληση", "hex": "#9aa3ad"}, "34": {"c": "πόδι", "a": "Πυκνωτής C1 470–1000µF/16V", "b": "ESP32-CAM GND", "t": "κόλληση", "hex": "#9aa3ad"}, "35": {"c": "πόδι", "a": "Αντίσταση R1 10kΩ", "b": "ESP32-CAM IO12", "t": "κόλληση", "hex": "#9aa3ad"}, "36": {"c": "πόδι", "a": "Αντίσταση R1 10kΩ", "b": "ESP32-CAM GND", "t": "κόλληση", "hex": "#9aa3ad"}};
// The guide uses regular anchors and keeps every section visible.
function showTab(id,push){if(push)history.replaceState(null,'','#'+id);}
// ---------- zoom / pan (pointer events: ποντίκι, αφή, pinch) ----------
function PanZoom(viewer,svg){
 const vb=svg.viewBox.baseVal;const W=vb.width,H=vb.height;
 svg.setAttribute('width',W);svg.setAttribute('height',H);
 let s=1,tx=0,ty=0,fitted=false;
 const pts=new Map();let last=null,moved=0,pinch=null;
 function apply(){svg.style.transform=`translate(${tx}px,${ty}px) scale(${s})`;}
 function fit(){const r=viewer.getBoundingClientRect();if(!r.width)return;
  s=Math.min(r.width/W,r.height/H)*0.98;tx=(r.width-W*s)/2;ty=(r.height-H*s)/2;apply();fitted=true;}
 function zoomAt(f,cx,cy){const ns=Math.max(0.15,Math.min(8,s*f));f=ns/s;tx=cx-(cx-tx)*f;ty=cy-(cy-ty)*f;s=ns;apply();}
 viewer.addEventListener('wheel',e=>{e.preventDefault();const r=viewer.getBoundingClientRect();
  zoomAt(Math.exp(-e.deltaY*(e.deltaMode===1?0.05:0.0015)),e.clientX-r.left,e.clientY-r.top);},{passive:false});
 viewer.addEventListener('pointerdown',e=>{if(e.target.closest('.tools,.winfo'))return;
  viewer.setPointerCapture(e.pointerId);pts.set(e.pointerId,{x:e.clientX,y:e.clientY});moved=0;
  if(pts.size===2){const [a,b]=[...pts.values()];pinch={d:Math.hypot(a.x-b.x,a.y-b.y),mx:(a.x+b.x)/2,my:(a.y+b.y)/2};}
  else last={x:e.clientX,y:e.clientY};viewer.classList.add('drag');});
 viewer.addEventListener('pointermove',e=>{if(!pts.has(e.pointerId))return;pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
  const r=viewer.getBoundingClientRect();
  if(pts.size>=2&&pinch){const [a,b]=[...pts.values()];const d=Math.hypot(a.x-b.x,a.y-b.y);const mx=(a.x+b.x)/2,my=(a.y+b.y)/2;
   tx+=mx-pinch.mx;ty+=my-pinch.my;zoomAt(d/pinch.d,mx-r.left,my-r.top);pinch={d,mx,my};moved+=10;return;}
  if(last){const dx=e.clientX-last.x,dy=e.clientY-last.y;moved+=Math.abs(dx)+Math.abs(dy);tx+=dx;ty+=dy;last={x:e.clientX,y:e.clientY};apply();}});
 function up(e){if(!pts.has(e.pointerId))return;pts.delete(e.pointerId);
  if(pts.size<2)pinch=null;if(pts.size===1){const v=[...pts.values()][0];last={x:v.x,y:v.y};}
  if(pts.size===0){last=null;viewer.classList.remove('drag');
   if(moved<6&&e.type==='pointerup'){const el=document.elementFromPoint(e.clientX,e.clientY);tapAt(el);}}}
 viewer.addEventListener('pointerup',up);viewer.addEventListener('pointercancel',up);
 viewer.addEventListener('dblclick',e=>{const r=viewer.getBoundingClientRect();zoomAt(1.8,e.clientX-r.left,e.clientY-r.top);});
 viewer.addEventListener('keydown',e=>{
  if(e.target!==viewer)return;
  const r=viewer.getBoundingClientRect();
  if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-','Home'].includes(e.key))e.preventDefault();
  if(e.key==='ArrowLeft')tx+=40;
  if(e.key==='ArrowRight')tx-=40;
  if(e.key==='ArrowUp')ty+=40;
  if(e.key==='ArrowDown')ty-=40;
  if(e.key==='+'||e.key==='=')zoomAt(1.4,r.width/2,r.height/2);
  if(e.key==='-')zoomAt(1/1.4,r.width/2,r.height/2);
  if(e.key==='Home')fit();else apply();
 });
 const tools=viewer.querySelector('.tools');
 tools.querySelector('[data-z="in"]').onclick=()=>{const r=viewer.getBoundingClientRect();zoomAt(1.4,r.width/2,r.height/2)};
 tools.querySelector('[data-z="out"]').onclick=()=>{const r=viewer.getBoundingClientRect();zoomAt(1/1.4,r.width/2,r.height/2)};
 tools.querySelector('[data-z="fit"]').onclick=fit;
 new ResizeObserver(()=>{if(!fitted)fit();}).observe(viewer);
 function focusBox(b){const r=viewer.getBoundingClientRect();if(!r.width)return;
  const pad=60;const ns=Math.min(2.2,Math.max(s,Math.min(r.width/(b.width+pad*2),r.height/(b.height+pad*2))));
  const cx=b.x+b.width/2,cy=b.y+b.height/2;s=Math.min(ns,Math.max(s,ns));
  // κρατάμε το zoom όπως είναι αν το καλώδιο χωράει ήδη
  const vx0=(-tx)/s,vy0=(-ty)/s,vx1=vx0+r.width/s,vy1=vy0+r.height/s;
  if(b.x>=vx0&&b.y>=vy0&&b.x+b.width<=vx1&&b.y+b.height<=vy1)return;
  s=Math.min(r.width/(b.width+pad*2),r.height/(b.height+pad*2),s);s=Math.max(s,0.15);
  tx=r.width/2-cx*s;ty=r.height/2-cy*s;apply();}
 return {fit,fitIfNeeded(){if(!fitted)fit();},focusBox};
}
const views={};
const pv=document.getElementById('viewer-pict');
views.pict=PanZoom(pv,document.getElementById('pict'));
views.harness=PanZoom(document.getElementById('viewer-harness'),document.getElementById('harness'));
// ---------- highlight ----------
let cur=null;
const info=document.getElementById('info');
function selectWire(n,opts={}){
 n=n==null?null:String(n);
 if(cur===n&&!opts.force){n=null;}
 cur=n;
 document.querySelectorAll('svg#pict,svg#harness').forEach(svg=>{
  svg.classList.toggle('hl',!!n);
  svg.querySelectorAll('.sel').forEach(e=>e.classList.remove('sel'));
  svg.querySelectorAll('.selp').forEach(e=>e.classList.remove('selp'));
  if(n)svg.querySelectorAll(`[data-w="${n}"]`).forEach(e=>e.classList.add('sel'));});
 document.querySelectorAll('#conn tbody tr').forEach(r=>r.classList.toggle('sel',r.dataset.w===n));
 if(n){const d=WD[n];
  // φωτίζονται και τα εξαρτήματα των δύο άκρων
  (PARTS_OF[n]||[]).forEach(p=>document.querySelectorAll(`#pict [data-part="${p}"]`).forEach(e=>e.classList.add('selp')));
  info.innerHTML=`<button class="x" aria-label="Κλείσιμο">×</button><b class="n" style="background:${d.hex};color:${['λευκό','κίτρινο','γαλάζιο','πόδι'].includes(d.c)?'#111':'#fff'}">${n}</b><b>${d.c}</b> · ${d.t}<br>${d.a} → ${d.b}`;
  info.classList.add('on');info.querySelector('.x').onclick=e=>{e.stopPropagation();selectWire(null,{force:true})};
  if(opts.focus){const g=document.querySelector(`#pict .wire[data-w="${n}"]`);if(g){views.pict.focusBox(g.getBBox());}}
 } else info.classList.remove('on');
}
function tapAt(el){if(!el)return;const w=el.closest('[data-w]');if(w)selectWire(w.dataset.w);else if(!el.closest('.winfo'))selectWire(null,{force:true});}

document.querySelectorAll('#conn tbody tr').forEach(r=>{
 const go=()=>{selectWire(r.dataset.w,{force:true,focus:true});showTab('t-diag',true);
  document.getElementById('viewer-pict').scrollIntoView({behavior:'smooth',block:'center'});};
 r.addEventListener('click',go);r.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go();}});});
const PARTS_OF={"1": ["BAT", "F1"], "2": ["F1", "SW"], "3": ["SW", "WA"], "4": ["WA", "L298N"], "5": ["WA", "BUCK"], "6": ["BAT", "WB"], "7": ["WB", "L298N"], "8": ["WB", "WG"], "9": ["BUCK", "WG"], "10": ["BUCK", "W5"], "11": ["W5", "ESP"], "12": ["WG", "ESP"], "13": ["W5", "DFP"], "14": ["WG", "DFP"], "15": ["W5", "AMP"], "16": ["WG", "AMP"], "17": ["ESP", "L298N"], "18": ["ESP", "L298N"], "19": ["ESP", "L298N"], "20": ["ESP", "L298N"], "21": ["ESP", "DFP"], "22": ["DFP", "AMP"], "23": ["AMP", "SPK"], "24": ["AMP", "SPK"], "25": ["L298N", "M_LF"], "26": ["L298N", "M_LF"], "27": ["L298N", "M_LR"], "28": ["L298N", "M_LR"], "29": ["L298N", "M_RF"], "30": ["L298N", "M_RF"], "31": ["L298N", "M_RR"], "32": ["L298N", "M_RR"], "33": ["C1", "ESP"], "34": ["C1", "ESP"], "35": ["R1", "ESP"], "36": ["R1", "ESP"]};
const h=(location.hash||'').slice(1);if(h&&document.getElementById(h))showTab(h,false);
})();
