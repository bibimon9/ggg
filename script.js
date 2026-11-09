// ===== 1) ข้อมูลทัวร์ (อยากเพิ่มทัวร์ใหม่ ให้ copy ก้อน { } แล้วแก้ข้อมูลได้เลย) =====
const tours = [
  {
    id: "japan", country: "ญี่ปุ่น", color: "#d4506b",
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
    id: "vietnam", country: "เวียดนาม", color: "#2f8050",
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
    id: "italy", country: "อิตาลี", color: "#b0710c",
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
    id: "swiss", country: "สวิตเซอร์แลนด์", color: "#3b78c9",
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

// กด "ดูตั๋ว" ในประวัติการจอง
historyList.addEventListener("click", event => {
  const code = event.target.dataset.ticket;
  if (code) openTicket(code);
});

// ปิดหน้าต่างล็อกอิน / ตั๋ว ด้วยปุ่มปิดหรือคลิกพื้นหลัง
[authDialog, ticketDialog].forEach(d => d.addEventListener("click", event => {
  if (event.target === d || event.target.dataset.close !== undefined) d.close();
}));
 
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
// ===== 3) สร้างปุ่มกรองประเทศ =====
function renderFilters() {
  const names = ["ทั้งหมด", ...tours.map(t => t.country)];
  filtersBox.innerHTML = names.map(name =>
    `<button class="chip ${name === currentFilter ? "active" : ""}" data-country="${name}">${name}</button>`
  ).join("");
}

// ===== 4) สร้างการ์ดทัวร์ตามประเทศที่เลือก =====
function renderTours() {
  const list = currentFilter === "ทั้งหมด"
    ? tours
    : tours.filter(t => t.country === currentFilter);

  tourGrid.innerHTML = list.map(t => `
    <article class="card" style="--theme:${t.color}">
      <div class="card-top">${t.country}</div>
      <div class="card-body">
        <h3>${t.title}</h3>
        <p>${t.summary}</p>
        <ul class="facts"><li>${t.days} วัน</li><li>${t.walk}</li></ul>
        <div class="card-bottom">
          <strong>${formatPrice(t.price)}</strong>
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
  updateTotal();
  renderAuth();
  renderHistory();
  openTicket(booking.code);
});

// ===== 8) เริ่มทำงานเมื่อเปิดหน้าเว็บ =====
renderFilters();
renderTours();
fillSelect();
updateTotal();
renderAuth();
renderHistory();
