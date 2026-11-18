/* 멍멍 카페 — 게임 상태, 저장/불러오기 */
const SAVE_KEY = "mungmungCafe.v1";

function todayStr() {
  const d = new Date();
  return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
}

/* ---------- 여러 js 파일이 함께 쓰는 작은 도우미 ---------- */
function $(id) { return document.getElementById(id); }
function assetUrl(path) { return path + "?v=" + CONFIG.ASSET_V; }
function rand(a, b) { return a + Math.random() * (b - a); }
function ri(a, b) { return Math.floor(rand(a, b + 1)); }
function pick(a) { return a[ri(0, a.length - 1)]; }
function gcd(a, b) { return b ? gcd(b, a % b) : a; }
function hasB(w) {
  const c = w.charCodeAt(w.length - 1);
  if (c >= 0xAC00 && c <= 0xD7A3) return (c - 0xAC00) % 28 !== 0;
  return /[013678]$/.test(w);
}
function j(w, a, b) { return w + (hasB(w) ? a : b); }

/* ---------- 라인 해금 / 레벨별 주문 규칙 ---------- */
function unlockedLines(level) {
  return Object.keys(CONFIG.LINES).filter(id => CONFIG.LINES[id].unlockLevel <= level);
}
function orderRuleForLevel(level) {
  let best = CONFIG.ORDER_RULES[0];
  for (const r of CONFIG.ORDER_RULES) if (level >= r.minLevel) best = r;
  return best;
}

function freshState() {
  const grid = [];
  for (let r = 0; r < CONFIG.BOARD_ROWS; r++) {
    grid.push(new Array(CONFIG.BOARD_COLS).fill(null));
  }
  // 시작 보드: 생성기 칸을 뺀 빈칸 중 앞쪽부터 커피콩 4개
  const coffeeGen = CONFIG.LINES.coffee;
  let placed = 0;
  for (let r = 0; r < CONFIG.BOARD_ROWS && placed < CONFIG.START_BOARD_ITEMS.count; r++) {
    for (let c = 0; c < CONFIG.BOARD_COLS && placed < CONFIG.START_BOARD_ITEMS.count; c++) {
      if (r === coffeeGen.genRow && c === coffeeGen.genCol) continue;
      grid[r][c] = { line: "coffee", tier: CONFIG.START_BOARD_ITEMS.tier };
      placed++;
    }
  }
  return {
    name: "",
    grade: 0,
    tier: 0,          // 수학 난이도 단계 0~2
    topics: null,     // 3학년 단원 범위(교사 링크로 들어왔을 때만). null/빈 배열이면 3학년 전체
    coins: CONFIG.START_COINS,
    level: CONFIG.START_LEVEL,
    exp: 0,
    energy: CONFIG.ENERGY_START,
    board: grid,
    today: { date: todayStr(), solved: 0, correct: 0 },
    seenEnergyHint: false,
  };
}

let S = freshState();

function loadState() {
  let loaded = null;
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) loaded = JSON.parse(raw);
  } catch (e) {}
  if (loaded) {
    S = Object.assign(freshState(), loaded);
    if (!S.today || S.today.date !== todayStr()) {
      S.today = { date: todayStr(), solved: 0, correct: 0 };
    }
    // 라인 추가 전 저장 데이터 호환: {tier}만 있던 칸은 커피로 간주
    if (S.board) {
      for (const row of S.board) {
        for (const cell of row) {
          if (cell && !cell.line) cell.line = "coffee";
        }
      }
    }
  } else {
    S = freshState();
  }
  return S;
}

function saveState() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(S));
  } catch (e) {}
}
