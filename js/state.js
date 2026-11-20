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
/* 도감: 그 라인·단계를 처음 만들었으면 true로 표시한다. */
function markDiscovered(line, tier) {
  if (!S.dex[line]) return;
  if (!S.dex[line][tier - 1]) { S.dex[line][tier - 1] = true; return true; }
  return false;
}
function cafeBgKeyForLevel(level) {
  let best = CONFIG.CAFE_BG_LEVELS[0].key;
  for (const r of CONFIG.CAFE_BG_LEVELS) if (level >= r.minLevel) best = r.key;
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
    genUpgrade: { coffee: 0, fruit: 0, cookie: 0, cake: 0 }, // 생성기 업그레이드 단계(0~GEN_UPGRADE_MAX)
    dex: { // 라인별로 한 번이라도 만들어본 단계(도감)
      coffee: [true, false, false, false, false, false], // 시작할 때부터 보드에 1단계가 있어 발견 처리
      fruit: [false, false, false, false, false, false],
      cookie: [false, false, false, false, false, false],
      cake: [false, false, false, false, false, false],
    },
    today: { date: todayStr(), solved: 0, correct: 0, served: 0 },
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
      S.today = { date: todayStr(), solved: 0, correct: 0, served: 0 };
    }
    if (typeof S.today.served !== "number") S.today.served = 0; // 이 기능 전에 저장된 당일 기록 호환
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
