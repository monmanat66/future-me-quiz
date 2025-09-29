/* =========================
   Future Me - app.js (no-module)
   ========================= */

/* ---------- Firebase App + Analytics (dynamic import) ---------- */
const firebaseConfig = {
  apiKey: "AIzaSyAuH6dwSVkgLHrzPjeXOd_pfLM674cZkj8",
  authDomain: "future-me-quiz.firebaseapp.com",
  projectId: "future-me-quiz",
  storageBucket: "future-me-quiz.firebasestorage.app",
  messagingSenderId: "382872960355",
  appId: "1:382872960355:web:b74060970a3b3810f1e756",
  measurementId: "G-M4L0D5PFWY"
};

// init แบบไดนามิก (ใช้ได้กับ <script> ปกติ)
(async () => {
  try {
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
    const { getAnalytics, isSupported } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js');

    const app = initializeApp(firebaseConfig);
    window._firebaseApp = app; // ให้สคริปต์อื่นเรียกใช้ได้

    // analytics บน http/file: อาจไม่รองรับ → เช็คก่อน
    try { if (await isSupported()) { getAnalytics(app); } } catch { }
    console.log('[Firebase] initialized');
  } catch (e) {
    console.error('[Firebase] init error:', e);
  }
})();

// helper: รอให้มี window._firebaseApp (กัน race condition)
async function ensureFirebaseApp(timeoutMs = 5000) {
  const start = Date.now();
  while (!window._firebaseApp) {
    await new Promise(r => setTimeout(r, 50));
    if (Date.now() - start > timeoutMs) throw new Error('Firebase app not initialized in time');
  }
  return window._firebaseApp;
}

/* ---------- Starfield (slow twinkle + slow shooting stars) ---------- */
(function () {
  const c = document.getElementById('starfield'); if (!c) return;
  const ctx = c.getContext('2d');
  let dpr = Math.max(1, window.devicePixelRatio || 1);

  function resize() {
    dpr = Math.max(1, window.devicePixelRatio || 1);
    c.width = innerWidth * dpr;
    c.height = innerHeight * dpr;
    c.style.width = innerWidth + 'px';
    c.style.height = innerHeight + 'px';
    makeStars();
  }
  addEventListener('resize', resize);

  // ดาวพื้นหลัง: กระพริบช้าลง
  let stars = [];
  function makeStars() {
    const area = innerWidth * innerHeight;
    let N = Math.round(area / 9000);
    N = Math.max(80, Math.min(N, 220));
    stars = Array.from({ length: N }, () => ({
      x: Math.random() * c.width,
      y: Math.random() * c.height,
      r: Math.random() * 1.1 + 0.5,
      s: Math.random() * (0.003 - 0.0008) + 0.0008,
      p: Math.random() * Math.PI * 2
    }));
  }

  // ดาวตกช้า ๆ
  const meteors = [];
  let nextSpawn = 0;

  function spawnMeteor(now) {
    const fromTop = Math.random() < 0.6;
    const margin = 40 * dpr;
    let x, y, angle;
    if (fromTop) {
      x = Math.random() * c.width * 0.8;
      y = -margin;
      angle = Math.random() * 0.35 + 0.6;
    } else {
      x = -margin;
      y = Math.random() * c.height * 0.5;
      angle = Math.random() * 0.25 + 0.75;
    }

    const speed = (Math.random() * 0.20 + 0.10) * dpr;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    const len = (Math.random() * 140 + 120) * dpr;
    const ttl = Math.random() * 2000 + 2200;
    const width = (Math.random() * 1.5 + 0.8) * dpr;

    meteors.push({ x, y, vx, vy, len, ttl, born: now, w: width });
  }

  resize();

  let last = performance.now();
  (function loop(now) {
    const dt = now - last; last = now;
    ctx.clearRect(0, 0, c.width, c.height);

    // ดาวพื้นหลัง
    for (const s of stars) {
      const alpha = 0.5 + Math.sin(now * s.s + s.p) * 0.35;
      ctx.fillStyle = `rgba(232,196,108,${alpha})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * dpr, 0, Math.PI * 2);
      ctx.fill();
    }

    // spawn ดาวตก (2–6s, สูงสุด 2 ดวง)
    if (now > nextSpawn && meteors.length < 2) {
      spawnMeteor(now);
      nextSpawn = now + (Math.random() * 4000 + 2000);
    }

    // อัปเดต/วาดดาวตก
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      m.x += m.vx * dt;
      m.y += m.vy * dt;

      const life = now - m.born;
      const over = life > m.ttl || m.x > c.width + 100 * dpr || m.y > c.height + 100 * dpr;
      if (over) { meteors.splice(i, 1); continue; }

      const nx = -m.vx, ny = -m.vy;
      const trail = m.len * (1 - life / m.ttl * 0.6);
      const tx = m.x + nx * trail;
      const ty = m.y + ny * trail;

      const grad = ctx.createLinearGradient(m.x, m.y, tx, ty);
      grad.addColorStop(0, 'rgba(255,240,200,0.9)');
      grad.addColorStop(0.2, 'rgba(255,220,160,0.65)');
      grad.addColorStop(1, 'rgba(255,200,120,0)');

      ctx.lineWidth = m.w;
      ctx.strokeStyle = grad;
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(tx, ty);
      ctx.stroke();

      ctx.shadowBlur = 12 * dpr;
      ctx.shadowColor = 'rgba(255,230,180,0.9)';
      ctx.fillStyle = 'rgba(255,240,200,0.95)';
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.w * 1.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    ctx.restore();

    requestAnimationFrame(loop);
  })(last);
})();

/* ---------- Screens ---------- */
const scr = n => document.querySelector(`[data-screen="${n}"]`);
function show(n) { document.querySelectorAll('.panel').forEach(p => p.classList.remove('active')); const el = scr(n); if (el) el.classList.add('active'); }
const startBtnEl = document.getElementById('startBtn');
if (startBtnEl) { startBtnEl.addEventListener('click', () => { show('quiz'); initWizard(); }); }

/* ---------- Wizard Data ---------- */
const questions = [
  { type: 'radio', title: 'เพศของคุณคืออะไร?', hint: 'เลือกเพียงข้อเดียว', choices: { A: 'หญิง', B: 'ชาย', C: 'LGBT', D: null }, key: 'gender' },
  { type: 'number', title: 'อายุของคุณ?', hint: 'ตัวเลข 10–99 เท่านั้น', key: 'age', min: 10, max: 99 },
  { type: 'text', title: 'อาชีพของคุณ?', hint: 'เช่น นักศึกษา นักพัฒนา ฯลฯ (อย่างน้อย 2 อักษร)', key: 'job', minLen: 2 },

  { type: 'abcd', title: 'ถ้าคุณมองตัวเองในอีก 5 ปี คุณอยากเห็นภาพแบบไหน?', A: 'มีงาน/ธุรกิจที่มั่นคง', B: 'มีอิสระและได้ทำสิ่งที่รัก', C: 'มีครอบครัว/คนรอบข้างที่อบอุ่น', D: 'ได้ผจญภัยและเรียนรู้อะไรใหม่เสมอ' },
  { type: 'abcd', title: 'เมื่อเจออุปสรรค คุณจะ…', A: 'วางแผนและค่อย ๆ แก้', B: 'หาทางที่สร้างสรรค์และเร็วที่สุด', C: 'ขอคำปรึกษาคนรอบตัว', D: 'มองเป็นโอกาสเรียนรู้' },
  { type: 'abcd', title: 'คำที่ตรงกับคุณที่สุดคือ…', A: 'เป้าหมาย', B: 'ความฝัน', C: 'ความรัก', D: 'การค้นหา' },
  { type: 'abcd', title: 'ถ้ามีเวลาว่าง 1 วันเต็ม คุณจะ…', A: 'วางแผนโปรเจกต์ใหม่', B: 'ทำงานศิลปะ/คอนเทนต์/งานที่ชอบ', C: 'ใช้เวลากับครอบครัว เพื่อน หรือสัตว์เลี้ยง', D: 'ไปเที่ยว ลองทำอะไรใหม่ ๆ' },
  { type: 'abcd', title: 'คุณมักได้พลังใจจาก…', A: 'ความสำเร็จเล็ก ๆ', B: 'ไอเดียใหม่ ๆ', C: 'คำพูดจากคนใกล้ชิด', D: 'การเดินทาง/การเปลี่ยนแปลง' },
  { type: 'abcd', title: 'ถ้าได้ข้อความจาก “ตัวเองในอนาคต” คุณอยากได้เรื่องแนวไหน?', A: 'กำลังใจให้สู้ต่อ', B: 'ไอเดีย/แรงบันดาลใจ', C: 'ความอบอุ่นและคำปลอบใจ', D: 'การชี้ทางใหม่ ๆ' },
  { type: 'abcd', title: 'เมื่อคุณประสบความสำเร็จ คุณมักจะ…', A: 'ตั้งเป้าหมายใหม่ที่ใหญ่ขึ้นทันที', B: 'ใช้เป็นแรงบันดาลใจในการสร้างสิ่งใหม่', C: 'แบ่งปันความสุขกับคนรอบข้าง', D: 'ออกเดินทางหาประสบการณ์ใหม่ ๆ' },

  // 11–13: Feedback (ไม่ใช้คำนวณบุคลิก)
  { type: 'abcd', title: 'งานวันนี้ให้คุณรู้สึกอย่างไร?', A: 'สนุกและมีสีสัน', B: 'ได้ความรู้/แรงบันดาลใจ', C: 'รู้สึกอบอุ่น/เจอเพื่อนใหม่', D: 'ตื่นเต้นและอยากมาร่วมอีก' },
  { type: 'abcd', title: 'ส่วนที่คุณชอบที่สุดในงานคือ?', A: 'Workshop/กิจกรรม', B: 'บรรยากาศ/การตกแต่ง', C: 'ร้านค้า/บูธ', D: 'การดูดวง/กิจกรรมสายมู' },
  { type: 'abcd', title: 'คุณอยากให้ปรับปรุงอะไรในครั้งต่อไป?', A: 'พื้นที่/การจัดโซน', B: 'เวลากิจกรรม', C: 'การประชาสัมพันธ์', D: 'อยากให้มีร้าน/กิจกรรมมากขึ้น' },
];

const resultPack = {
  A: {
    title: 'PLANNER ACHIEVER',
    imgs: ['assets/images/result_A1.jpg', 'assets/images/result_A2.jpg', 'assets/images/result_A3.jpg'],
    msg: [
      { key: 'ความพยายาม', text: '“ในอีก 5 ปีข้างหน้า คุณจะมองย้อนกลับมาแล้วขอบคุณทุกคืนวันที่คุณไม่หยุดพยายาม แม้วันที่เหนื่อยที่สุดก็ยังเลือกที่จะก้าวต่อ ทุกการลงมือทำในวันนี้คือเส้นทางที่ค่อย ๆ สร้างความมั่นคง และในไม่ช้าคุณจะได้สัมผัสกับผลลัพธ์ที่ทำให้หัวใจคุณเต็มไปด้วยความภาคภูมิใจ”' },
      { key: 'ความมั่นคง', text: '“อนาคตของคุณเต็มไปด้วยรางวัลจากความมุ่งมั่น ทุกเป้าหมายที่คุณวางไว้อาจไม่ได้เกิดขึ้นชั่วข้ามคืน แต่ทุกก้าวที่มั่นคงจะสะสมเป็นพลังยิ่งใหญ่ อย่าลืมว่าการเดินช้าแต่มั่นคงยังคงพาคุณไปถึงเส้นชัยได้เสมอ”' },
      { key: 'ความสำเร็จที่จับต้องได้', text: '“อีกไม่กี่ปีข้างหน้า คุณจะได้ยิ้มให้กับเส้นทางที่เลือกเดิน เพราะทุกการตัดสินใจ ทุกความทุ่มเท ไม่เคยสูญเปล่า คุณกำลังสร้างอนาคตที่มั่นคงและงดงามด้วยมือของคุณเอง”' }
    ]
  },
  B: {
    title: 'DREAMER CREATOR',
    imgs: ['assets/images/result_B1.jpg', 'assets/images/result_B2.jpg', 'assets/images/result_B3.png'],
    msg: [
      { key: 'ความคิดสร้างสรรค์', text: '“อนาคตของคุณถูกแต้มสีด้วยจินตนาการและความคิดสร้างสรรค์ ทุกความฝันที่คุณเคยกล้าคิด จะค่อย ๆ กลายเป็นความจริงที่จับต้องได้ อย่าหยุดสร้าง อย่าหยุดเชื่อ เพราะแรงบันดาลใจของคุณคือพลังที่โลกกำลังรออยู่”' },
      { key: 'จินตนาการ', text: '“คุณจะพบว่าเส้นทางข้างหน้ามีแต่สิ่งใหม่ ๆ รอให้คุณค้นพบ ความคิดสร้างสรรค์จะเป็นสะพานที่พาคุณไปสู่โอกาสที่คาดไม่ถึง จงเชื่อมั่นว่าความเป็นตัวคุณคือของขวัญอันล้ำค่า”' },
      { key: 'แรงบันดาลใจ', text: '“ในอีกไม่กี่ปี คุณจะได้เห็นว่าความฝันที่เคยดูไกล กลับเข้ามาใกล้กว่าที่คิด เพราะคุณเลือกที่จะเชื่อในพลังของความคิดสร้างสรรค์ ความเชื่อมั่นในหัวใจของคุณจะกลายเป็นแรงดึงดูดให้โอกาสงดงามเข้ามาหาคุณอย่างไม่คาดฝัน”' }
    ]
  },
  C: {
    title: 'CONNECTOR NURTURER',
    imgs: ['assets/images/result_C1.jpg', 'assets/images/result_C2.jpg', 'assets/images/result_C3.jpg'],
    msg: [
      { key: 'ความสัมพันธ์', text: '“อนาคตของคุณเต็มไปด้วยผู้คนที่รักและจริงใจกับคุณ ความอบอุ่นจากสายใยความสัมพันธ์จะเป็นพลังใจที่ทำให้คุณยืนหยัดได้ในวันที่ท้าทาย อย่าลืมรักษาความสัมพันธ์เหล่านี้ไว้ เพราะนี่คือขุมทรัพย์แท้จริงของชีวิต”' },
      { key: 'การให้', text: '“ในวันข้างหน้า คุณจะค้นพบว่าความสุขไม่ได้มาจากความสำเร็จเพียงลำพัง แต่มาจากการได้แบ่งปันรอยยิ้ม เสียงหัวเราะ และกำลังใจกับคนรอบข้าง จงรักษาความจริงใจของคุณไว้ เพราะนั่นคือสิ่งที่ทำให้คุณมีคุณค่าที่สุด”' },
      { key: 'การสนับสนุน', text: '“อนาคตที่รออยู่คือการเดินทางที่ไม่เคยโดดเดี่ยว เพราะคุณจะรายล้อมด้วยมิตรภาพและความรักแท้จริง จงให้คุณค่ากับทุกความสัมพันธ์ เพราะสิ่งนี้คือรากฐานที่จะทำให้คุณเติบโตอย่างมั่นคงและมีความหมาย”' }
    ]
  },
  D: {
    title: 'EXPLORER LEARNER',
    imgs: ['assets/images/result_D1.jpg', 'assets/images/result_D2.jpg', 'assets/images/result_D3.jpg'],
    msg: [
      { key: 'การผจญภัย', text: '“อนาคตคือการผจญภัยที่น่าตื่นเต้น ทุกความกล้าที่คุณเลือกจะก้าวออกจากกรอบเดิม ๆ จะพาคุณไปเจอกับบทเรียนใหม่ ๆ ที่เติมเต็มหัวใจ อย่ากลัวที่จะผิดพลาด เพราะทุกประสบการณ์จะหล่อหลอมให้คุณแข็งแกร่งและน่าภาคภูมิใจยิ่งขึ้น”' },
      { key: 'การเรียนรู้', text: '“อีกไม่กี่ปีข้างหน้า คุณจะมองย้อนกลับมาแล้วพบว่าทุกความเสี่ยงที่กล้าลองคือของขวัญอันล้ำค่า โลกกว้างกำลังเปิดประตูรอให้คุณสำรวจ และทุกการเรียนรู้จะทำให้คุณเป็นตัวเองในเวอร์ชันที่ดีกว่าเดิมเสมอ”' },
      { key: 'ความกล้า', text: '“เส้นทางข้างหน้าของคุณคือการเดินทางที่เต็มไปด้วยความท้าทายและความงดงาม จงเปิดใจรับสิ่งใหม่ ๆ ด้วยความกล้าและความอยากรู้ เพราะทุกก้าวที่คุณเลือกจะพาคุณไปพบกับโอกาสที่ไม่เคยจินตนาการมาก่อน”' }
    ]
  }
};

/* ---------- Wizard Elements ---------- */
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
const answers = {}; // gender, age, job, และคำตอบ abcd ทั้งหมด

function initWizard() {
  if (!stepsEl) return;
  stepsEl.innerHTML = '';
  for (let i = 0; i < questions.length; i++) {
    const dot = document.createElement('div');
    dot.className = 'step' + (i === 0 ? ' active' : '');
    stepsEl.appendChild(dot);
  }
  idx = 0; Object.keys(answers).forEach(k => delete answers[k]);
  render();
}

function render() {
  if (!qTitle) return;
  document.querySelectorAll('.step').forEach((d, i) => d.classList.toggle('active', i === idx));
  if (progressNow) progressNow.textContent = String(idx + 1);
  if (nextBtn) nextBtn.disabled = true;
  if (inputWrap) inputWrap.classList.add('hidden');
  if (choicesEl) choicesEl.innerHTML = '';
  if (inputField) { inputField.value = ''; inputField.oninput = null; }

  const q = questions[idx];
  qTitle.textContent = q.title;
  hint && (hint.textContent = q.hint || '');

  if (q.type === 'abcd' || q.type === 'radio') {
    const map = ['A', 'B', 'C', 'D'];
    for (const key of map) {
      const label = q[key] || (q.choices ? q.choices[key] : null);
      if (!label) continue;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'choice';
      btn.innerHTML = `<span class="badge">${key}</span> <span>${label}</span>`;
      btn.addEventListener('click', () => { select(key); });
      choicesEl && choicesEl.appendChild(btn);
    }
  } else if (q.type === 'number' || q.type === 'text') {
    inputWrap && inputWrap.classList.remove('hidden');
    if (inputField) {
      inputField.type = q.type === 'number' ? 'number' : 'text';
      inputField.placeholder = q.type === 'number' ? 'เช่น 22' : 'พิมพ์คำตอบ';
      inputField.focus();
      inputField.oninput = validateInput;
    }
  }

  if (prevBtn) prevBtn.disabled = idx === 0;
}

function select(val) {
  const q = questions[idx];
  if (q.type === 'radio') {
    const text = q.choices[val];
    answers[q.key] = text;
  } else {
    answers[`q${idx + 1}`] = val;
  }
  document.querySelectorAll('.choice').forEach(c => c.classList.remove('selected'));
  const last = Array.from(document.querySelectorAll('.choice')).find(el => el.textContent.trim().startsWith(val));
  if (last) last.classList.add('selected');
  if (nextBtn) nextBtn.disabled = false;
}

function validateInput() {
  const q = questions[idx];
  const v = (inputField?.value || '').trim();
  let ok = false;
  if (q.type === 'number') {
    const n = Number(v);
    ok = v !== '' && Number.isFinite(n) && n >= q.min && n <= q.max;
    if (ok) answers[q.key] = n;
  } else {
    ok = v.length >= (q.minLen || 1);
    if (ok) answers[q.key] = v;
  }
  if (nextBtn) nextBtn.disabled = !ok;
}

prevBtn && prevBtn.addEventListener('click', () => { if (idx > 0) { idx--; render(); } });
nextBtn && nextBtn.addEventListener('click', () => { if (idx < questions.length - 1) { idx++; render(); } else { computeResult(); } });

/* ---------- Firestore init helper (long-poll fallback) ---------- */
let _dbPromise = null;
async function getDB() {
  if (_dbPromise) return _dbPromise;
  _dbPromise = (async () => {
    const app = await ensureFirebaseApp();
    const { initializeFirestore, setLogLevel } =
      await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');

    try {
      const db = initializeFirestore(app, {
        experimentalAutoDetectLongPolling: true,
        useFetchStreams: false
      });
      try { setLogLevel('error'); } catch { }
      return db;
    } catch (e) {
      const { getFirestore, setLogLevel: sl } =
        await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
      try { sl('error'); } catch { }
      return getFirestore(app);
    }
  })();
  return _dbPromise;
}

/* ---------- Firestore Save (Q1,2,3 & Q11,12,13) ---------- */
async function saveToFirestoreMinimal(pk, top, score, msgKey, msgText) {
  try {
    const db = await getDB();
    const { collection, addDoc, serverTimestamp } =
      await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');

    const docData = {
      // Q1–Q3
      gender: answers.gender ?? null,
      age: (typeof answers.age === 'number') ? answers.age : null,
      job: answers.job ?? null,
      // Q11–Q13
      q11: answers.q11 ?? null,
      q12: answers.q12 ?? null,
      q13: answers.q13 ?? null,
      // meta (ระวัง undefined)
      result: {
        title: pk?.title ?? null,
        key: msgKey ?? null,         // ใช้หัวข้อของข้อความผลลัพธ์
        text: msgText ?? null,       // เก็บตัวข้อความด้วย
        topLetter: top ?? null,
        score: (typeof score === 'number') ? score : null
      },
      ua: navigator.userAgent ?? null,
      ts: serverTimestamp()
    };

    const ref = await addDoc(collection(db, 'quiz_responses'), docData);
    console.log('[Firestore] saved:', ref.id, docData);
  } catch (err) {
    console.error('[Firestore] save error:', err);
    alert('บันทึกลงฐานข้อมูลไม่สำเร็จ:\n' + (err?.message || err));
  }
}

/* ---------- Compute result & show ---------- */
function computeResult() {
  const counts = { A: 0, B: 0, C: 0, D: 0 };
  for (let i = 3; i <= 9; i++) { const v = answers[`q${i + 1}`]; if (v) counts[v]++; }

  let top = 'A', max = -1;
  for (const k of ['A', 'B', 'C', 'D']) { if (counts[k] > max) { max = counts[k]; top = k; } }

  const score = max;
  const pk = resultPack[top];

  let imgIndex = 2;  // 0..2
  if (score >= 6) imgIndex = 0;
  else if (score === 5) imgIndex = 1;

  const m = pk.msg[Math.min(imgIndex, pk.msg.length - 1)] || { key: '', text: '' };

  // bind UI
  const resultImg = document.getElementById('resultImg');
  const rt = document.getElementById('resultTitle');
  const rk = document.getElementById('resultKeywords');   // ใช้เป็น subtitle/keyword
  const rmt = document.getElementById('resultMsgTitle');
  const rmx = document.getElementById('resultMsgText');
  const rmLegacy = document.getElementById('resultMessage'); // fallback โครงสร้างเก่า

  if (resultImg) resultImg.src = pk.imgs[Math.min(imgIndex, pk.imgs.length - 1)];
  if (rt) rt.textContent = pk.title;

  // แสดงหัวข้อของข้อความไว้ที่ keywords (หรือจะว่างก็ได้)
  if (rk) rk.textContent = m.key || '';

  if (rmt && rmx) {
    rmt.textContent = m.key || '';
    rmx.textContent = m.text || '';
  } else if (rmLegacy) {
    // หน้าเดิมมีแค่ <article id="resultMessage">
    rmLegacy.textContent = m.text || '';
  }

  show('result');

  // บันทึก Firestore (ส่ง m.key, m.text ไปด้วย)
  saveToFirestoreMinimal(pk, top, score, m.key, m.text)
    .then(() => console.log('[Firestore] done'))
    .catch(() => {/* error แสดงไปแล้วในฟังก์ชัน */ });
}


/* ---------- Share + Restart ---------- */
const restartBtn = document.getElementById('restartBtn');
restartBtn && restartBtn.addEventListener('click', () => { show('landing'); });

(function () {
  const shareBtn = document.getElementById('shareBtn');
  const imgEl = document.getElementById('resultImg');
  const tEl = document.getElementById('resultTitle');
  const kEl = document.getElementById('resultKeywords');
  const mEl = document.getElementById('resultMessage');
  if (!shareBtn) return;

  const PAGE_URL = location.href.split('#')[0];

  function getShareTexts() {
    const title = 'Future Me — ผลลัพธ์ของฉัน';
    const text = `${tEl?.textContent || ''}\n${kEl?.textContent || ''}\n${mEl?.textContent || ''}\n— Future Me by OOOMarket`;
    return { title, text };
  }

  async function getImageFile() {
    const url = imgEl?.currentSrc || imgEl?.src;
    if (!url) return null;
    const blob = await fetch(url, { cache: 'no-store' }).then(r => r.blob());
    return new File([blob], 'future-me.png', { type: 'image/png' });
  }

  function openLineIntent() {
    const { text } = getShareTexts();
    const msg = encodeURIComponent(`${text}\n${PAGE_URL}`);
    window.open(`https://line.me/R/msg/text/?${msg}`, '_blank');
  }

  function openTwitterIntent() {
    const { title, text } = getShareTexts();
    const t = encodeURIComponent(`${title}\n${text}`);
    const u = encodeURIComponent(PAGE_URL);
    window.open(`https://twitter.com/intent/tweet?text=${t}&url=${u}&hashtags=FutureMe`, '_blank');
  }

  async function copyFallback() {
    try {
      const { title, text } = getShareTexts();
      await navigator.clipboard.writeText(`${title}\n${text}\n${PAGE_URL}`);
      alert('คัดลอกข้อความผลลัพธ์แล้ว ✓');
      return true;
    } catch { return false; }
  }

  shareBtn.addEventListener('click', async () => {
    const { title, text } = getShareTexts();
    try {
      if (navigator.canShare) {
        try {
          const file = await getImageFile();
          if (file && navigator.canShare({ files: [file] })) {
            await navigator.share({ title, text, files: [file] });
            return;
          }
        } catch {/* fallback */ }
      }
      if (navigator.share) {
        await navigator.share({ title, text, url: PAGE_URL });
        return;
      }
      const ok = await copyFallback();
      openLineIntent();
      if (!ok) openTwitterIntent();
    } catch (e) {
      openTwitterIntent();
    }
  });
})();
