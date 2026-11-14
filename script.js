// รูปหน้าปกจากไฟล์ images.js (ถ้าไม่มีรูป จะใช้ภาพ SVG แทนอัตโนมัติ)
const photos = window.PHOTOS || {};
// ===== 1) ข้อมูลทัวร์ (อยากเพิ่มทัวร์ใหม่ ให้ copy ก้อน { } แล้วแก้ข้อมูลได้เลย) =====
const tours = [
  {
    id: "japan", photo: photos.japan,country: "ญี่ปุ่น", color: "#d4506b",
    title: "โตเกียว – ฟูจิ – เกียวโต", days: 6, price: 45900, walk: "เดินวันละ ~8,000 ก้าว",
    summary: "เมืองใหญ่ ภูเขาไฟ และวัดเก่า นั่งชินคันเซนระหว่างเมืองสบาย ๆ",
    plan: [
      { day: "วัน 1–2", text: "โตเกียว: อาซากุสะ ชิบูย่า และย่านช้อปปิ้ง" },
      { day: "วัน 3", text: "ภูเขาไฟฟูจิ: ล่องเรือทะเลสาบคาวากูจิโกะ" },
      { day: "วัน 4", text: "นั่งชินคันเซนไปเกียวโต: ศาลเจ้าฟูชิมิ อินาริ" },
      { day: "วัน 5–6", text: "เกียวโต–โอซาก้า: วัดคิโยมิสึ ปราสาทโอซาก้า แล้วบินกลับ" }
    ]
  },
  {
    id: "vietnam", photo: photos.vietnam, country: "เวียดนาม", color: "#2f8050",
    title: "ฮานอย – ฮาลอง – ดานัง", days: 5, price: 19900, walk: "เดินวันละ ~6,000 ก้าว",
    summary: "ทริปประหยัดงบ ได้ทั้งทะเล เมืองเก่า และอาหารอร่อย",
    plan: [
      { day: "วัน 1", text: "ฮานอย: ย่านเมืองเก่า ทะเลสาบคืนดาบ ชมหุ่นกระบอกน้ำ" },
      { day: "วัน 2", text: "อ่าวฮาลอง: ล่องเรือชมเกาะหินปูน พายคายัค" },
      { day: "วัน 3", text: "ดานัง: หาดหมีเคะ และสะพานมือ (บานาฮิลล์)" },
      { day: "วัน 4–5", text: "ฮอยอัน: เมืองเก่าและโคมไฟยามค่ำ แล้วเดินทางกลับ" }
    ]
  },
  {
    id: "italy", photo: photos.italy, country: "อิตาลี", color: "#b0710c",
    title: "โรม – ฟลอเรนซ์ – เวนิส", days: 8, price: 79900, walk: "เดินวันละ ~10,000 ก้าว",
    summary: "เมืองประวัติศาสตร์และศิลปะ เดินเยอะหน่อย แต่ทุกมุมคุ้มค่า",
    plan: [
      { day: "วัน 1–3", text: "โรม: โคลอสเซียม น้ำพุเทรวี และนครวาติกัน" },
      { day: "วัน 4–5", text: "ฟลอเรนซ์: มหาวิหารดูโอโม และพิพิธภัณฑ์อุฟฟิซี" },
      { day: "วัน 6–7", text: "เวนิส: ล่องเรือกอนโดลา และเกาะมูราโน" },
      { day: "วัน 8", text: "ตลาดริอัลโต ก่อนบินกลับ" }
    ]
  },
  {
    id: "swiss", photo: photos.swiss,  country: "สวิตเซอร์แลนด์", color: "#3b78c9",
    title: "ซูริก – ลูเซิร์น – ยุงเฟรา", days: 7, price: 89900, walk: "เดินวันละ ~7,000 ก้าว",
    summary: "ภูเขาหิมะและทะเลสาบ เดินทางด้วยรถไฟชมวิวตลอดทาง",
    plan: [
      { day: "วัน 1", text: "ซูริก: เดินเมืองเก่าและริมทะเลสาบ" },
      { day: "วัน 2–3", text: "ลูเซิร์น: สะพานชาเปล และขึ้นรถรางภูเขาริจิ" },
      { day: "วัน 4–5", text: "อินเทอร์ลาเคน: นั่งรถไฟขึ้นยอดเขายุงเฟรา" },
      { day: "วัน 6–7", text: "แบร์น: เมืองเก่ามรดกโลก ก่อนบินกลับ" }
    ]
  }
];

// ===== 2) เรียก element จากหน้า HTML มาเก็บในตัวแปร =====
const filtersBox   = document.getElementById("filters");
const tourGrid     = document.getElementById("tourGrid");
const dialog       = document.getElementById("tourDialog");
const dialogBox    = document.getElementById("dialogContent");
const tourSelect   = document.getElementById("tourSelect");
const peopleInput  = document.getElementById("peopleInput");
const totalPrice   = document.getElementById("totalPrice");
const bookingForm  = document.getElementById("bookingForm");
const message      = document.getElementById("message");

let currentFilter = "ทั้งหมด"; // ประเทศที่กำลังเลือกอยู่

// แปลงตัวเลขเป็นรูปแบบราคา เช่น 45,900 บาท
function formatPrice(n) {
  return n.toLocaleString("th-TH") + " บาท";
}

// ===== 2.5) ระบบสมาชิก / ประวัติการจอง / ตั๋ว (เก็บใน localStorage ของเบราว์เซอร์) =====
// ข้อมูลที่เก็บ: st_users = รายชื่อสมาชิก, st_session = อีเมลที่ล็อกอินอยู่, st_bookings = รายการจองทั้งหมด
const authDialog   = document.getElementById("authDialog");
const authForm     = document.getElementById("authForm");
const authTitle    = document.getElementById("authTitle");
const authError    = document.getElementById("authError");
const authSubmit   = document.getElementById("authSubmit");
const authSwitch   = document.getElementById("authSwitch");
const authArea     = document.getElementById("authArea");
const nameField    = document.getElementById("nameField");
const regName      = document.getElementById("regName");
const emailInput   = document.getElementById("emailInput");
const passInput    = document.getElementById("passInput");
const nameInput    = document.getElementById("nameInput");
const historyList  = document.getElementById("historyList");
const ticketDialog = document.getElementById("ticketDialog");
const ticketBox    = document.getElementById("ticketContent");
const cancelDialog = document.getElementById("cancelDialog");
const cancelBox    = document.getElementById("cancelContent");

let authMode = "login"; // "login" หรือ "register"

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
}
function save(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

// กันไม่ให้ชื่อที่ผู้ใช้พิมพ์ (เช่น <script>) ไปแทรกเป็น HTML
function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

const formatDate = iso => new Date(iso).toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" });

// เข้ารหัสรหัสผ่านก่อนเก็บ (ไม่เก็บรหัสผ่านจริง)
async function hashPassword(email, pass) {
  const text = email + ":" + pass;
  if (!crypto.subtle) return btoa(unescape(encodeURIComponent(text))); // สำรอง กรณีเปิดในโหมดที่ไม่ปลอดภัย
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}

function currentUser() {
  const email = localStorage.getItem("st_session");
  return load("st_users", []).find(u => u.email === email) || null;
}

// เปิดหน้าต่างเข้าสู่ระบบ / สมัครสมาชิก
function openAuth(mode, error = "") {
  authMode = mode;
  const reg = mode === "register";
  authForm.reset();
  authTitle.textContent = reg ? "สมัครสมาชิก" : "เข้าสู่ระบบ";
  authSubmit.textContent = reg ? "สมัครสมาชิก" : "เข้าสู่ระบบ";
  authSwitch.textContent = reg ? "มีบัญชีแล้ว? เข้าสู่ระบบ" : "ยังไม่มีบัญชี? สมัครสมาชิก";
  nameField.hidden = !reg;
  regName.required = reg;
  passInput.autocomplete = reg ? "new-password" : "current-password";
  authError.textContent = error;
  if (!authDialog.open) authDialog.showModal();
}

// แถบเมนู: แสดงปุ่มล็อกอิน หรือชื่อผู้ใช้ + ปุ่มออกจากระบบ
function renderAuth() {
  const user = currentUser();
  authArea.innerHTML = user
    ? `<span class="hello">สวัสดี ${esc(user.name)}</span><button class="link-btn" data-auth="logout">ออกจากระบบ</button>`
    : `<button class="link-btn" data-auth="login">เข้าสู่ระบบ</button><button class="btn small" data-auth="register">สมัครสมาชิก</button>`;
  if (user && !nameInput.value) nameInput.value = user.name; // เติมชื่อในฟอร์มจองให้
}

// ประวัติการจอง (เรียงจากใหม่ไปเก่า เฉพาะของคนที่ล็อกอินอยู่)
function renderHistory() {
  const user = currentUser();
  if (!user) {
    historyList.innerHTML = `<p class="empty"><button class="link-btn dark" data-auth="login">เข้าสู่ระบบ</button> เพื่อดูประวัติการจองและตั๋วของคุณ</p>`;
    return;
  }
  const mine = load("st_bookings", []).filter(b => b.email === user.email).reverse();
  historyList.innerHTML = mine.length ? mine.map(b => {
    const t = tours.find(item => item.id === b.tourId);
    return `
      <article class="history-item" style="--theme:${t.color}">
        <div>
          <strong>${t.country} – ${t.title}</strong>
          <small>รหัส ${b.code} · จองเมื่อ ${formatDate(b.date)} · ${b.people} คน · ${formatPrice(b.total)}</small>
        </div>
        <button class="btn small" data-ticket="${b.code}">ดูตั๋ว</button>
      </article>`;
  }).join("") : `<p class="empty">ยังไม่มีประวัติการจอง เลือกแพ็กเกจที่ชอบแล้วจองได้เลย</p>`;
}

// หน้าต่างตั๋ว (เปิดได้เฉพาะตั๋วของตัวเอง)
function openTicket(code) {
  const user = currentUser();
  const b = load("st_bookings", []).find(x => x.code === code);
  if (!user || !b || b.email !== user.email) return;
  const t = tours.find(item => item.id === b.tourId);
  ticketBox.innerHTML = `
    <p class="ticket-label">ตั๋วทัวร์${t.country}</p>
    <h3>${t.title}</h3>
    <div class="ticket-code">${b.code}</div>
    <div class="barcode" aria-hidden="true"></div>
    <dl class="ticket-info">
      <div><dt>ผู้จอง</dt><dd>${esc(b.name)}</dd></div>
      <div><dt>ผู้เดินทาง</dt><dd>${b.people} คน</dd></div>
      <div><dt>ระยะเวลา</dt><dd>${t.days} วัน</dd></div>
      <div><dt>ราคารวม</dt><dd>${formatPrice(b.total)}</dd></div>
      <div><dt>วันที่จอง</dt><dd>${formatDate(b.date)}</dd></div>
    </dl>
    <div class="dialog-actions"><button class="btn ghost" data-close>ปิด</button></div>
  `;
  ticketDialog.style.setProperty("--theme", t.color);
  if (!ticketDialog.open) ticketDialog.showModal();
}

// สมัครสมาชิก / เข้าสู่ระบบ
authForm.addEventListener("submit", async event => {
  event.preventDefault();
  const email = emailInput.value.trim().toLowerCase();
  const hash = await hashPassword(email, passInput.value);
  const users = load("st_users", []);

  if (authMode === "register") {
    if (users.some(u => u.email === email)) { authError.textContent = "อีเมลนี้สมัครสมาชิกไว้แล้ว ลองเข้าสู่ระบบแทน"; return; }
    users.push({ name: regName.value.trim(), email, hash });
    save("st_users", users);
  } else if (!users.some(u => u.email === email && u.hash === hash)) {
    authError.textContent = "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
    return;
  }

  localStorage.setItem("st_session", email);
  authDialog.close();
  renderAuth();
  renderHistory();
});

// ปุ่มที่มี data-auth: เข้าสู่ระบบ / สมัครสมาชิก / สลับโหมด / ออกจากระบบ
document.addEventListener("click", event => {
  const action = event.target.dataset.auth;
  if (!action) return;
  if (action === "logout") {
    localStorage.removeItem("st_session");
    nameInput.value = "";
    renderAuth();
    renderHistory();
  } else {
    openAuth(action === "switch" ? (authMode === "login" ? "register" : "login") : action);
  }
});

// กด "ดูตั๋ว" / "ยกเลิก" ในประวัติการจอง
historyList.addEventListener("click", event => {
  const { ticket, cancel } = event.target.dataset;
  if (ticket) openTicket(ticket);
  if (cancel) openCancel(cancel);
});

// ปิดหน้าต่างล็อกอิน / ตั๋ว / ยกเลิก ด้วยปุ่มปิดหรือคลิกพื้นหลัง
[authDialog, ticketDialog, cancelDialog].forEach(d => d.addEventListener("click", event => {
  if (event.target === d || event.target.dataset.close !== undefined) d.close();
}));
// กด "ยกเลิกการจอง" ในหน้าต่างตั๋ว
ticketDialog.addEventListener("click", event => {
  const code = event.target.dataset.cancelFromTicket;
  if (code) openCancel(code);
});

// กด "ยืนยันยกเลิก" ในหน้าต่างยกเลิก
cancelDialog.addEventListener("click", event => {
  const code = event.target.dataset.confirmCancel;
  if (code) confirmCancel(code);
});
 // ===== นโยบายยกเลิก: ยกเลิกก่อนวันเดินทางกี่วัน -> คืนเงินกี่ % (แก้ตัวเลขได้ตามต้องการ) =====
const REFUND_RULES = [
  { minDays: 30, percent: 100 },
  { minDays: 15, percent: 50 },
  { minDays: 1,  percent: 0 }
];
// คำนวณวันที่เหลือก่อนเดินทาง และยอดที่ได้คืน (ตั๋วเก่าที่ไม่มีวันเดินทางจะคืนเต็มจำนวน)
function refundInfo(b) {
  if (!b.travelDate) return { daysLeft: null, percent: 100, amount: b.total };
  const daysLeft = Math.round((parseDay(b.travelDate) - startOfToday()) / 86400000);
  const rule = REFUND_RULES.find(r => daysLeft >= r.minDays);
  const percent = rule ? rule.percent : 0;
  return { daysLeft, percent, amount: Math.round(b.total * percent / 100) };
}

// ยกเลิกได้เมื่อยังไม่ถูกยกเลิก และยังไม่ถึงวันเดินทาง
const canCancel = b => b.status !== "cancelled" && (!b.travelDate || refundInfo(b).daysLeft >= 1);

// ประวัติการจอง (เรียงจากใหม่ไปเก่า เฉพาะของคนที่ล็อกอินอยู่)
function renderHistory() {
  const user = currentUser();
  if (!user) {
    historyList.innerHTML = `<p class="empty"><button class="link-btn dark" data-auth="login">เข้าสู่ระบบ</button> เพื่อดูประวัติการจองและตั๋วของคุณ</p>`;
    return;
  }
  const mine = load("st_bookings", []).filter(b => b.email === user.email).reverse();
  historyList.innerHTML = mine.length ? mine.map(b => {
    const t = tours.find(item => item.id === b.tourId);
    const cancelled = b.status === "cancelled";
    return `
      <article class="history-item ${cancelled ? "cancelled" : ""}" style="--theme:${t.color}">
        <div>
          <strong>${t.country} – ${t.title}</strong>
          <small>รหัส ${b.code} · ${b.travelDate ? `เดินทาง ${formatDay(b.travelDate)}` : `จองเมื่อ ${formatDate(b.date)}`} · ${b.people} คน · ${formatPrice(b.total)}</small>
          ${cancelled ? `<small class="badge">ยกเลิกแล้ว ${formatDate(b.cancelledAt)} · คืนเงิน ${formatPrice(b.refund)}</small>` : ""}
        </div>
        ${cancelled ? "" : `<div class="history-actions">
          <button class="btn small" data-ticket="${b.code}">ดูตั๋ว</button>
          ${canCancel(b) ? `<button class="btn small ghost" data-cancel="${b.code}">ยกเลิก</button>` : ""}
        </div>`}
      </article>`;
  }).join("") : `<p class="empty">ยังไม่มีประวัติการจอง เลือกแพ็กเกจที่ชอบแล้วจองได้เลย</p>`;
}
// ===== ยกเลิกการจอง: กดยกเลิก -> หน้าต่างยืนยัน -> เปลี่ยนสถานะเป็น "ยกเลิกแล้ว" (ยังเก็บไว้ในประวัติ) =====
function openCancel(code) {
  const user = currentUser();
  const b = load("st_bookings", []).find(x => x.code === code);
  if (!user || !b || b.email !== user.email || !canCancel(b)) return;
  const t = tours.find(item => item.id === b.tourId);
  const r = refundInfo(b);
  cancelBox.innerHTML = `
    <h3>ยกเลิกการจอง?</h3>
    <p>${t.country} – ${t.title}<br>รหัส ${b.code}${b.travelDate ? ` · เดินทาง ${formatDay(b.travelDate)}` : ""}</p>
    <p class="refund-note">${r.daysLeft === null ? "" : `เหลืออีก ${r.daysLeft} วันก่อนเดินทาง · `}จะได้รับเงินคืน <strong>${formatPrice(r.amount)}</strong>${r.percent < 100 ? ` (${r.percent}% ของ ${formatPrice(b.total)})` : ""}</p>
    <p class="empty">ยกเลิกแล้วจะกู้คืนตั๋วไม่ได้</p>
    <div class="dialog-actions">
      <button class="btn danger" data-confirm-cancel="${b.code}">ยืนยันยกเลิก</button>
      <button class="btn ghost" data-close>ไม่ยกเลิก</button>
    </div>`;
  cancelDialog.style.setProperty("--theme", t.color);
  ticketDialog.close();
  if (!cancelDialog.open) cancelDialog.showModal();
}

function confirmCancel(code) {
  const user = currentUser();
  const all = load("st_bookings", []);
  const b = all.find(x => x.code === code);
  if (!user || !b || b.email !== user.email || !canCancel(b)) return;
  const r = refundInfo(b);
  b.status = "cancelled";
  b.cancelledAt = new Date().toISOString();
  b.refund = r.amount;
  save("st_bookings", all);
  renderHistory();
  cancelBox.innerHTML = `
    <h3>ยกเลิกเรียบร้อยแล้ว</h3>
    <p>การจองรหัส ${b.code} ถูกยกเลิก จะคืนเงิน <strong>${formatPrice(r.amount)}</strong></p>
    <div class="dialog-actions"><button class="btn" data-close>ตกลง</button></div>`;
}

// ===== 2.6) ปฏิทินเลือกวันเดินทาง (จองล่วงหน้าอย่างน้อย MIN_DAYS วัน ไม่เกิน MAX_DAYS วัน) =====
const MIN_DAYS = 7, MAX_DAYS = 365;
const calendarBox = document.getElementById("calendar");
const tripRange   = document.getElementById("tripRange");

const ymd       = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const parseDay  = s => new Date(s + "T00:00:00");
const addDays   = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const formatDay = s => parseDay(s).toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" });
const backDay   = (s, days) => ymd(addDays(parseDay(s), days - 1)); // วันกลับ = วันเดินทาง + (จำนวนวัน - 1)
function startOfToday() { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }

let selectedDate = "";                              // วันที่เลือก เช่น "2026-12-25"
let calMonth = addDays(startOfToday(), MIN_DAYS);   // เดือนที่กำลังแสดงในปฏิทิน
calMonth.setDate(1);

function renderCalendar() {
  const first = addDays(startOfToday(), MIN_DAYS), last = addDays(startOfToday(), MAX_DAYS);
  const y = calMonth.getFullYear(), m = calMonth.getMonth();
  let cells = "<span></span>".repeat(new Date(y, m, 1).getDay()); // ช่องว่างก่อนวันที่ 1
  for (let d = 1; d <= new Date(y, m + 1, 0).getDate(); d++) {
    const key = ymd(new Date(y, m, d));
    const open = key >= ymd(first) && key <= ymd(last); // เลือกได้เฉพาะช่วงที่จองล่วงหน้าได้
    cells += `<button type="button" class="day ${key === selectedDate ? "selected" : ""}" data-date="${key}" ${open ? "" : "disabled"}>${d}</button>`;
  }
  const weekdays = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"].map(w => `<b>${w}</b>`).join("");
  calendarBox.innerHTML = `
    <div class="cal-head">
      <button type="button" class="cal-nav" data-cal="-1" aria-label="เดือนก่อนหน้า" ${new Date(y, m, 0) < first ? "disabled" : ""}>‹</button>
      <strong>${calMonth.toLocaleDateString("th-TH", { month: "long", year: "numeric" })}</strong>
      <button type="button" class="cal-nav" data-cal="1" aria-label="เดือนถัดไป" ${new Date(y, m + 1, 1) > last ? "disabled" : ""}>›</button>
    </div>
    <div class="cal-grid">${weekdays}${cells}</div>`;
}

// ข้อความใต้ปฏิทิน: วันเดินทาง - วันกลับ ตามจำนวนวันของทัวร์ที่เลือก
function updateTrip() {
  const t = tours.find(item => item.id === tourSelect.value);
  tripRange.textContent = selectedDate
    ? `เดินทาง ${formatDay(selectedDate)} – กลับ ${formatDay(backDay(selectedDate, t.days))} (${t.days} วัน)`
    : `กรุณาเลือกวันเดินทางจากปฏิทิน (จองล่วงหน้าอย่างน้อย ${MIN_DAYS} วัน)`;
}

function resetCalendar() { selectedDate = ""; renderCalendar(); updateTrip(); }

calendarBox.addEventListener("click", event => {
  const { date, cal } = event.target.dataset;
  if (cal) calMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() + Number(cal), 1);
  if (date) { selectedDate = date; message.textContent = ""; updateTrip(); }
  if (cal || date) renderCalendar();
});
// ===== 2.7) ภาพประกอบประเทศ (SVG วาดเอง) =====
// อยากเปลี่ยนรูป: แก้ในไฟล์ images.js หรือใส่ photo: "ลิงก์รูป" ในข้อมูลทัวร์นั้น
const scene = body => `<svg viewBox="0 0 300 100" preserveAspectRatio="xMidYMax meet" aria-hidden="true"><rect x="-800" y="92" width="1900" height="30" fill="#fff" opacity=".22"/>${body}</svg>`;
const arch = (x, base, top) => `<path class="cut" d="M${x} ${base}V${top + 6}a6 6 0 0 1 12 0V${base}Z"/>`;
const scenes = {
  japan: scene(`<circle cx="236" cy="34" r="18" fill="#fff" opacity=".9"/><path d="M60 92 150 18 240 92Z" fill="#fff" opacity=".35"/><path d="M128 36 150 18 172 36 162 33 150 40 138 33Z" fill="#fff"/><path d="M22 92V62M50 92V62M16 60H56M20 68H52" stroke="#fff" stroke-width="4" fill="none"/>`),
  vietnam: scene(`<circle cx="70" cy="28" r="15" fill="#fff" opacity=".9"/><path d="M90 92C100 40 120 40 128 92ZM150 92C158 22 186 22 198 92ZM214 92C222 52 240 52 250 92Z" fill="#fff" opacity=".4"/><path d="M48 90V58L66 90Z" fill="#fff"/><path d="M38 90H74L69 98H43Z" fill="#fff"/>`),
  italy: scene(`<rect x="70" y="30" width="160" height="62" fill="#fff" opacity=".88"/>${[0, 1, 2, 3, 4, 5].map(i => arch(82 + i * 25, 60, 40) + arch(82 + i * 25, 92, 68)).join("")}`),
  swiss: scene(`<circle cx="42" cy="30" r="12" fill="#fff" opacity=".9"/><path d="M40 92 110 22 180 92Z" fill="#fff" opacity=".4"/><path d="M120 92 190 12 260 92Z" fill="#fff" opacity=".55"/><path d="M96 36 110 22 124 36 116 33 110 38 104 33Z" fill="#fff"/><path d="M176 30 190 12 204 30 196 27 190 34 184 27Z" fill="#fff"/>`)
};
const visual = t => t.photo ? `<img src="${t.photo}" alt="${t.country}" loading="lazy">` : (scenes[t.id] || "");

// ===== 3) สร้างปุ่มกรองประเทศ =====
function renderFilters() {
  const names = ["ทั้งหมด", ...tours.map(t => t.country)];
  filtersBox.innerHTML = names.map(name =>
    `<button class="chip ${name === currentFilter ? "active" : ""}" data-country="${name}">${name}</button>`
  ).join("");
}

// ===== 4) สร้างการ์ดทัวร์ตามประเทศที่เลือก =====
function renderTours() {
  const list = tours.filter(t =>
    (currentFilter === "ทั้งหมด" || t.country === currentFilter) &&
    (currentTag === "ทุกสไตล์" || t.tags.includes(currentTag))
  );

  if (!list.length) {
    tourGrid.innerHTML = `<p class="empty">ยังไม่มีทัวร์ที่ตรงกับตัวกรองนี้ ลองเลือกประเทศหรือสไตล์อื่นดูนะ</p>`;
    return;
  }

  tourGrid.innerHTML = list.map(t => `
    <article class="card" style="--theme:${t.color}">
      <div class="card-top">${visual(t)}<span class="card-country">${t.country}</span></div>
      <div class="card-body">
        <h3>${t.title}</h3>
        <p>${t.summary}</p>
        <div class="relax">${leaves(relaxFor(t))} <span>${RELAX_LABELS[relaxFor(t)]}</span></div>
        <ul class="facts"><li>${t.days} วัน</li>${t.tags.map(tag => `<li>${tagLabel(tag)}</li>`).join("")}</ul>
        <div class="card-bottom">
          <strong>${formatPrice(priceFor(t))}</strong>
          <button class="btn small" data-id="${t.id}">ดูรายละเอียด</button>
        </div>
      </div>
    </article>
  `).join("");
}
// ===== 5) เปิดหน้าต่างรายละเอียดทัวร์ =====
function openDetail(id) {
  const t = tours.find(item => item.id === id);
  const planHtml = t.plan.map(p => `<li><strong>${p.day}</strong> ${p.text}</li>`).join("");

  dialogBox.innerHTML = `
    <h3>${t.title}</h3>
    <ul class="plan">${planHtml}</ul>
    <div class="dialog-actions">
      <button class="btn" data-book="${t.id}">จองทัวร์นี้</button>
      <button class="btn ghost" data-close>ปิด</button>
    </div>
  `;
  dialog.style.setProperty("--theme", t.color); // เปลี่ยนสีขอบบนตามประเทศ
  dialog.showModal();
}

// ===== 6) ฟอร์มจอง: ใส่ตัวเลือกทัวร์ และคำนวณราคารวม =====
function fillSelect() {
  tourSelect.innerHTML = tours.map(t =>
    `<option value="${t.id}">${t.country} – ${t.title}</option>`
  ).join("");
}

function updateTotal() {
  const t = tours.find(item => item.id === tourSelect.value);
  const people = Number(peopleInput.value) || 0;
  totalPrice.textContent = formatPrice(t.price * people);
}

// ===== 7) ดักจับการคลิก / การกรอกฟอร์ม =====

// กดปุ่มประเทศ -> เปลี่ยนตัวกรองแล้วแสดงการ์ดใหม่
filtersBox.addEventListener("click", event => {
  const country = event.target.dataset.country;
  if (!country) return;
  currentFilter = country;
  renderFilters();
  renderTours();
});

// กดปุ่ม "ดูรายละเอียด" ในการ์ด
tourGrid.addEventListener("click", event => {
  const id = event.target.dataset.id;
  if (id) openDetail(id);
});

// กดปุ่มในหน้าต่างรายละเอียด (จอง / ปิด / คลิกพื้นหลัง)
dialog.addEventListener("click", event => {
  if (event.target === dialog || event.target.dataset.close !== undefined) {
    dialog.close();
  }
  if (event.target.dataset.book) {
    tourSelect.value = event.target.dataset.book;
    updateTotal();
    dialog.close();
    location.hash = "#booking";
  }
});

tourSelect.addEventListener("change", updateTotal);
peopleInput.addEventListener("input", updateTotal);

bookingForm.addEventListener("submit", event => {
  event.preventDefault(); // กันไม่ให้หน้าเว็บรีโหลด
  const user = currentUser();
  if (!user) { openAuth("login", "กรุณาเข้าสู่ระบบก่อนจองทัวร์"); return; }

  const t = tours.find(item => item.id === tourSelect.value);
  const people = Number(peopleInput.value);
  const booking = {
    code: "ST-" + Math.random().toString(36).slice(2, 8).toUpperCase(), // รหัสจอง เช่น ST-K3F9A2
    email: user.email, name: nameInput.value.trim(), tourId: t.id,
    people, total: t.price * people, date: new Date().toISOString()
  };
  save("st_bookings", [...load("st_bookings", []), booking]);

  message.textContent = `ขอบคุณคุณ${booking.name} รับจองทัวร์${t.country}เรียบร้อยแล้ว (${totalPrice.textContent})`;
  bookingForm.reset();
  paceSelect.value = currentPace; // reset() จะคืนค่า select ให้ต้องตั้งกลับเป็นจังหวะที่เลือกไว้
  updateTotal();
  renderAuth();
  renderHistory();
  resetCalendar();
  openTicket(booking.code);
});

// ===== 8) เริ่มทำงานเมื่อเปิดหน้าเว็บ =====
renderPace();
renderFilters();
renderTagFilters();
renderTours();
fillSelect();
updateTotal();
renderAuth();
renderHistory();
renderCalendar();
updateTrip();
