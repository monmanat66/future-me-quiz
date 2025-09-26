// Starfield light
(function(){
  const c = document.getElementById('starfield'); const dpr = Math.max(1, devicePixelRatio||1); const ctx = c.getContext('2d');
  function size(){ c.width=innerWidth*dpr; c.height=innerHeight*dpr; c.style.width=innerWidth+'px'; c.style.height=innerHeight+'px'; }
  size(); addEventListener('resize', size);
  const N=120, stars=Array.from({length:N},()=>({x:Math.random()*c.width,y:Math.random()*c.height,r:Math.random()*1.2+.4,s:Math.random()*.02+.005}));
  (function loop(t){ ctx.clearRect(0,0,c.width,c.height); for(const s of stars){ const a=.6+Math.sin(t*s.s)*.35; ctx.fillStyle=`rgba(232,196,108,${a})`; ctx.beginPath(); ctx.arc(s.x,s.y,s.r*dpr,0,Math.PI*2); ctx.fill(); } requestAnimationFrame(loop); })();
})();

// Screens
const scr = n=>document.querySelector(`[data-screen="${n}"]`);
function show(n){ document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active')); scr(n).classList.add('active'); }

document.getElementById('startBtn').addEventListener('click', ()=>{ show('quiz'); initWizard(); });

// Wizard Data
const questions = [
  { type:'radio', title:'เพศของคุณคืออะไร?', hint:'เลือกเพียงข้อเดียว', choices:{A:'หญิง', B:'ชาย', C:'LGBT', D:null}, key:'gender' },
  { type:'number', title:'อายุของคุณ?', hint:'ตัวเลข 10–99 เท่านั้น', key:'age', min:10, max:99 },
  { type:'text', title:'อาชีพของคุณ?', hint:'เช่น นักศึกษา นักพัฒนา ฯลฯ (อย่างน้อย 2 อักษร)', key:'job', minLen:2 },

  { type:'abcd', title:'ถ้าคุณมองตัวเองในอีก 5 ปี คุณอยากเห็นภาพแบบไหน?', A:'มีงาน/ธุรกิจที่มั่นคง', B:'มีอิสระและได้ทำสิ่งที่รัก', C:'มีครอบครัว/คนรอบข้างที่อบอุ่น', D:'ได้ผจญภัยและเรียนรู้อะไรใหม่เสมอ' },
  { type:'abcd', title:'เมื่อเจออุปสรรค คุณจะ…', A:'วางแผนและค่อย ๆ แก้', B:'หาทางที่สร้างสรรค์และเร็วที่สุด', C:'ขอคำปรึกษาคนรอบตัว', D:'มองเป็นโอกาสเรียนรู้' },
  { type:'abcd', title:'คำที่ตรงกับคุณที่สุดคือ…', A:'เป้าหมาย', B:'ความฝัน', C:'ความรัก', D:'การค้นหา' },
  { type:'abcd', title:'ถ้ามีเวลาว่าง 1 วันเต็ม คุณจะ…', A:'วางแผนโปรเจกต์ใหม่', B:'ทำงานศิลปะ/คอนเทนต์/งานที่ชอบ', C:'ใช้เวลากับครอบครัว เพื่อน หรือสัตว์เลี้ยง', D:'ไปเที่ยว ลองทำอะไรใหม่ ๆ' },
  { type:'abcd', title:'คุณมักได้พลังใจจาก…', A:'ความสำเร็จเล็ก ๆ', B:'ไอเดียใหม่ ๆ', C:'คำพูดจากคนใกล้ชิด', D:'การเดินทาง/การเปลี่ยนแปลง' },
  { type:'abcd', title:'ถ้าได้ข้อความจาก “ตัวเองในอนาคต” คุณอยากได้เรื่องแนวไหน?', A:'กำลังใจให้สู้ต่อ', B:'ไอเดีย/แรงบันดาลใจ', C:'ความอบอุ่นและคำปลอบใจ', D:'การชี้ทางใหม่ ๆ' },
  { type:'abcd', title:'เมื่อคุณประสบความสำเร็จ คุณมักจะ…', A:'ตั้งเป้าหมายใหม่ที่ใหญ่ขึ้นทันที', B:'ใช้เป็นแรงบันดาลใจในการสร้างสิ่งใหม่', C:'แบ่งปันความสุขกับคนรอบข้าง', D:'ออกเดินทางหาประสบการณ์ใหม่ ๆ' },
];

const resultPack = {
  A:{ title:'PLANNER ACHIEVER', key:'ความพยายาม · ความมั่นคง · ความสำเร็จ',
      imgs:['assets/images/result_A1.jpg','assets/images/result_A2.jpg','assets/images/result_A3.jpg'],
      msg:[
        '“ในอีก 5 ปีข้างหน้า คุณจะมองย้อนกลับมาแล้วขอบคุณทุกคืนวันที่คุณไม่หยุดพยายาม แม้วันที่เหนื่อยที่สุดก็ยังเลือกที่จะก้าวต่อ ทุกการลงมือทำในวันนี้คือเส้นทางที่ค่อย ๆ สร้างความมั่นคง และในไม่ช้าคุณจะได้สัมผัสกับผลลัพธ์ที่ทำให้หัวใจคุณเต็มไปด้วยความภาคภูมิใจ”',
        '“อนาคตของคุณเต็มไปด้วยรางวัลจากความมุ่งมั่น ทุกเป้าหมายที่คุณวางไว้อาจไม่ได้เกิดขึ้นชั่วข้ามคืน แต่ทุกก้าวที่มั่นคงจะสะสมเป็นพลังยิ่งใหญ่ อย่าลืมว่าการเดินช้าแต่มั่นคงยังคงพาคุณไปถึงเส้นชัยได้เสมอ”',
        '“อีกไม่กี่ปีข้างหน้า คุณจะได้ยิ้มให้กับเส้นทางที่เลือกเดิน เพราะทุกการตัดสินใจ ทุกความทุ่มเท ไม่เคยสูญเปล่า คุณกำลังสร้างอนาคตที่มั่นคงและงดงามด้วยมือของคุณเอง”'
      ]},
  B:{ title:'DREAMER CREATOR', key:'ความคิดสร้างสรรค์ · จินตนาการ · แรงบันดาลใจ',
      imgs:['assets/images/result_B1.jpg','assets/images/result_B2.jpg','assets/images/result_B3.jpg'],
      msg:[
        '“อนาคตของคุณถูกแต้มสีด้วยจินตนาการและความคิดสร้างสรรค์ ทุกความฝันที่คุณเคยกล้าคิด จะค่อย ๆ กลายเป็นความจริงที่จับต้องได้ อย่าหยุดสร้าง อย่าหยุดเชื่อ เพราะแรงบันดาลใจของคุณคือพลังที่โลกกำลังรออยู่”',
        '“คุณจะพบว่าเส้นทางข้างหน้ามีแต่สิ่งใหม่ ๆ รอให้คุณค้นพบ ความคิดสร้างสรรค์จะเป็นสะพานที่พาคุณไปสู่โอกาสที่คาดไม่ถึง จงเชื่อมั่นว่าความเป็นตัวคุณคือของขวัญอันล้ำค่า”',
        '“ในอีกไม่กี่ปี คุณจะได้เห็นว่าความฝันที่เคยดูไกล กลับเข้ามาใกล้กว่าที่คิด เพราะคุณเลือกที่จะเชื่อในพลังของความคิดสร้างสรรค์ ความเชื่อมั่นในหัวใจของคุณจะกลายเป็นแรงดึงดูดให้โอกาสงดงามเข้ามาหาคุณอย่างไม่คาดฝัน”'
      ]},
  C:{ title:'CONNECTOR NURTURER', key:'ความสัมพันธ์ · การให้ · การสนับสนุน',
      imgs:['assets/images/result_C1.jpg','assets/images/result_C2.jpg','assets/images/result_C3.jpg'],
      msg:[
        '“อนาคตของคุณเต็มไปด้วยผู้คนที่รักและจริงใจกับคุณ ความอบอุ่นจากสายใยความสัมพันธ์จะเป็นพลังใจที่ทำให้คุณยืนหยัดได้ในวันที่ท้าทาย อย่าลืมรักษาความสัมพันธ์เหล่านี้ไว้ เพราะนี่คือขุมทรัพย์แท้จริงของชีวิต”',
        '“ในวันข้างหน้า คุณจะค้นพบว่าความสุขไม่ได้มาจากความสำเร็จเพียงลำพัง แต่มาจากการได้แบ่งปันรอยยิ้ม เสียงหัวเราะ และกำลังใจกับคนรอบข้าง จงรักษาความจริงใจของคุณไว้ เพราะนั่นคือสิ่งที่ทำให้คุณมีคุณค่าที่สุด”',
        '“อนาคตที่รออยู่คือการเดินทางที่ไม่เคยโดดเดี่ยว เพราะคุณจะรายล้อมด้วยมิตรภาพและความรักแท้จริง จงให้คุณค่ากับทุกความสัมพันธ์ เพราะสิ่งนี้คือรากฐานที่จะทำให้คุณเติบโตอย่างมั่นคงและมีความหมาย”'
      ]},
  D:{ title:'EXPLORER LEARNER', key:'การผจญภัย · การเรียนรู้ · ความกล้า',
      imgs:['assets/images/result_D1.jpg','assets/images/result_D2.jpg','assets/images/result_D3.jpg'],
      msg:[
        '“อนาคตคือการผจญภัยที่น่าตื่นเต้น ทุกความกล้าที่คุณเลือกจะก้าวออกจากกรอบเดิม ๆ จะพาคุณไปเจอกับบทเรียนใหม่ ๆ ที่เติมเต็มหัวใจ อย่ากลัวที่จะผิดพลาด เพราะทุกประสบการณ์จะหล่อหลอมให้คุณแข็งแกร่งและน่าภาคภูมิใจยิ่งขึ้น”',
        '“อีกไม่กี่ปีข้างหน้า คุณจะมองย้อนกลับมาแล้วพบว่าทุกความเสี่ยงที่กล้าลองคือของขวัญอันล้ำค่า โลกกว้างกำลังเปิดประตูรอให้คุณสำรวจ และทุกการเรียนรู้จะทำให้คุณเป็นตัวเองในเวอร์ชันที่ดีกว่าเดิมเสมอ”',
        '“เส้นทางข้างหน้าของคุณคือการเดินทางที่เต็มไปด้วยความท้าทายและความงดงาม จงเปิดใจรับสิ่งใหม่ ๆ ด้วยความกล้าและความอยากรู้ เพราะทุกก้าวที่คุณเลือกจะพาคุณไปพบกับโอกาสที่ไม่เคยจินตนาการมาก่อน”'
      ]}
};

const stepsEl = document.getElementById('steps');
const qTitle = document.getElementById('qTitle');
const choicesEl = document.getElementById('choices');
const inputWrap = document.getElementById('inputWrap');
const inputField = document.getElementById('inputField');
const hint = document.getElementById('hint');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressNow = document.getElementById('progressNow');

let idx = 0;
const answers = {}; // gender, age, job, and abcd picks (q3..q9 index wise)

function initWizard(){
  // build steps
  stepsEl.innerHTML = '';
  for (let i=0;i<10;i++){ const dot=document.createElement('div'); dot.className='step'+(i===0?' active':''); stepsEl.appendChild(dot); }
  idx = 0; Object.keys(answers).forEach(k=>delete answers[k]);
  render();
}

function render(){
  document.querySelectorAll('.step').forEach((d,i)=>d.classList.toggle('active', i===idx));
  progressNow.textContent = String(idx+1);
  nextBtn.disabled = true;
  inputWrap.classList.add('hidden');
  choicesEl.innerHTML = '';
  inputField.value = '';

  const q = questions[idx];
  qTitle.textContent = q.title;
  hint.textContent = q.hint || '';

  if (q.type==='abcd' || q.type==='radio'){
    const map = ['A','B','C','D'];
    for (const key of map){
      const label = q[key] || (q.choices ? q.choices[key] : null);
      if (!label) continue;
      const btn = document.createElement('button');
      btn.type='button';
      btn.className='choice';
      btn.innerHTML = `<span class="badge">${key}</span> <span>${label}</span>`;
      btn.addEventListener('click', ()=>{ select(key); });
      choicesEl.appendChild(btn);
    }
  } else if (q.type==='number' || q.type==='text'){
    inputWrap.classList.remove('hidden');
    inputField.type = q.type==='number' ? 'number' : 'text';
    inputField.placeholder = q.type==='number' ? 'เช่น 22' : 'พิมพ์คำตอบ';
    inputField.focus();
    inputField.addEventListener('input', validateInput);
  }

  prevBtn.disabled = idx===0;
}

function select(val){
  const q = questions[idx];
  if (q.type==='radio'){ // store actual value string
    const text = q.choices[val];
    answers[q.key] = text;
  } else { // abcd
    // store letter
    answers[`q${idx+1}`] = val;
  }
  document.querySelectorAll('.choice').forEach(c=>c.classList.remove('selected'));
  const last = Array.from(document.querySelectorAll('.choice')).find(el=>el.textContent.trim().startsWith(val));
  if (last) last.classList.add('selected');
  nextBtn.disabled = false;
}

function validateInput(){
  const q = questions[idx];
  const v = inputField.value.trim();
  let ok = false;
  if (q.type==='number'){
    const n = Number(v);
    ok = v!=='' && Number.isFinite(n) && n>=q.min && n<=q.max;
    if (ok) answers[q.key] = n;
  } else {
    ok = v.length >= (q.minLen||1);
    if (ok) answers[q.key] = v;
  }
  nextBtn.disabled = !ok;
}

prevBtn.addEventListener('click', ()=>{ if (idx>0){ idx--; render(); } });

nextBtn.addEventListener('click', ()=>{
  if (idx<9){ idx++; render(); }
  else { computeResult(); }
});

// Compute and show result (use only Q4..Q10 which are index 3..9)
function computeResult(){
  const counts = {A:0,B:0,C:0,D:0};
  for (let i=3;i<=9;i++){
    const v = answers[`q${i+1}`]; if (v) counts[v]++;
  }
  // winner with tiebreak A>B>C>D
  let top='A', max=-1; for (const k of ['A','B','C','D']){ if (counts[k]>max){max=counts[k]; top=k;} }
  const score = max; // 0..7
  const pk = resultPack[top];
  let imgIndex = 2; if (score>=6) imgIndex=0; else if (score===5) imgIndex=1; else if (score===4) imgIndex=2;
  // Bind result
  document.getElementById('resultImg').src = pk.imgs[Math.min(imgIndex, pk.imgs.length-1)];
  document.getElementById('resultTitle').textContent = pk.title;
  document.getElementById('resultKeywords').textContent = pk.key;
  document.getElementById('resultMessage').textContent = pk.msg[Math.min(imgIndex, pk.msg.length-1)];
  show('result');
}

// Share + Restart
document.getElementById('restartBtn').addEventListener('click', ()=>{ show('landing'); });
document.getElementById('shareBtn').addEventListener('click', async ()=>{
  const title='Future Me — ผลลัพธ์ของฉัน';
  const text = `${document.getElementById('resultTitle').textContent}\n${document.getElementById('resultMessage').textContent}\n— Future Me by OOOMarket`;
  try{
    if (navigator.share){ await navigator.share({title,text,url:location.href}); }
    else { await navigator.clipboard.writeText(`${title}\n${text}\n${location.href}`); alert('คัดลอกผลลัพธ์แล้ว'); }
  }catch(e){}
});
