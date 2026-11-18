/* 멍멍 카페 — HUD, 말풍선, 토스트, 연출 */

function renderHud() {
  $("hudCoin").textContent = Math.floor(S.coins);
  $("hudLevel").textContent = "Lv." + S.level;
  const need = CONFIG.LEVEL_EXP_TO_NEXT[S.level];
  const expRatio = need ? Math.min(1, S.exp / need) : 1;
  $("hudExpFill").style.width = Math.round(expRatio * 100) + "%";
  $("hudEnergy").textContent = S.energy + "/" + CONFIG.ENERGY_MAX;
  $("btnEnergyPlus").classList.toggle("bounce", S.energy <= 5);
  $("hudToday").textContent = "오늘 " + S.today.solved + "/" + CONFIG.DAILY_GOAL + "문제";
}

function toast(msg) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = msg;
  $("toastLayer").appendChild(el);
  requestAnimationFrame(() => el.classList.add("show"));
  setTimeout(() => { el.classList.remove("show"); setTimeout(() => el.remove(), 300); }, 2200);
}

/* ---------- 바리스타 ---------- */
let baristaTimer = null;
function setBarista(state, duration) {
  clearTimeout(baristaTimer);
  $("baristaEl").src = assetUrl(`assets/barista/barista_${state}.png`);
  baristaTimer = setTimeout(() => { $("baristaEl").src = assetUrl("assets/barista/barista_idle.png"); }, duration * 1000);
}
function baristaGreet() { setBarista("greet", CONFIG.BARISTA_GREET_DURATION); }
function baristaServe() { setBarista("serve", CONFIG.BARISTA_SERVE_DURATION); }

/* ---------- 레벨업 배너 ---------- */
function showLevelUp() {
  baristaGreet();
  const el = $("levelUpBanner");
  el.textContent = "레벨 업! Lv." + S.level;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 1500);
}

/* ---------- 보드 연출 ---------- */
function playMergeEffect(row, col) {
  requestAnimationFrame(() => {
    const el = $("boardItems").querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if (el) { el.classList.add("merge-pop"); setTimeout(() => el.classList.remove("merge-pop"), 220); }
  });
}
function popGeneratedItem(row, col) {
  requestAnimationFrame(() => {
    const el = $("boardItems").querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if (el) { el.classList.add("spawn-pop"); setTimeout(() => el.classList.remove("spawn-pop"), 260); }
  });
}
function shakeGenerator(line) {
  const el = $("generators").querySelector(`[data-line="${line}"]`);
  if (!el) return;
  el.classList.remove("shake"); void el.offsetWidth; el.classList.add("shake");
}

/* ---------- 손님 연출 ---------- */
function floatTipBadge(cust) {
  const box = $(bubbleId(cust.id)); if (!box) return;
  const tip = document.createElement("div");
  tip.className = "tipBadge";
  tip.textContent = "팁!";
  box.appendChild(tip);
  setTimeout(() => tip.remove(), 1000);
}
