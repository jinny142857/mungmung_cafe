/* 멍멍 카페 — 게임 상태, 저장/불러오기
   여러 학생이 한 기기(아이패드)를 같이 쓸 수 있게, 닉네임별로 따로 저장한다.
   닉네임·비밀번호는 이 기기 안에만 저장되고 서버로 보내지 않는다.
   서버(Firebase)에는 랭킹에 필요한 이름·레벨·코인만 올라간다(js/ranking.js). */
const SAVE_KEY = "mungmungCafe.v1"; // 예전(닉네임 구분 없던 시절) 저장 — 마이그레이션 읽기 전용
const PROFILES_KEY = "mungmungCafe.profiles.v1"; // 닉네임별 저장
const LAST_NAME_KEY = "mungmungCafe.lastName.v1"; // 로그인 칸에 미리 채워줄 마지막 닉네임

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
function customerSpawnRuleForLevel(level) {
  let best = CONFIG.CUSTOMER_SPAWN_RULES[0];
  for (const r of CONFIG.CUSTOMER_SPAWN_RULES) if (level >= r.minLevel) best = r;
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
    password: null, // 이 기기에만 저장된다(서버로 보내지 않음)
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

/* ---------- 닉네임별 저장(프로필) ---------- */
function loadProfiles() {
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) { return {}; }
}
function saveProfiles(profiles) {
  try { localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles)); } catch (e) {}
}
function getLastName() {
  try { return localStorage.getItem(LAST_NAME_KEY) || ""; } catch (e) { return ""; }
}
function setLastName(name) {
  try { localStorage.setItem(LAST_NAME_KEY, name); } catch (e) {}
}
function profileExists(name) {
  return !!loadProfiles()[name];
}
/* 비밀번호가 없는 프로필(예전 저장을 옮겨온 경우) — 로그인할 때 입력한 값을 새 비밀번호로 정한다. */
function profileNeedsNewPassword(name) {
  const p = loadProfiles()[name];
  return !!p && !p.password;
}
function forgetProfile(name) {
  const profiles = loadProfiles();
  delete profiles[name];
  saveProfiles(profiles);
}
/* 예전 버전(닉네임 구분 없이 혼자 쓰던 저장)이 있으면 그 이름의 프로필로 한 번만 옮긴다. */
function migrateLegacySave() {
  const profiles = loadProfiles();
  if (Object.keys(profiles).length) return;
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    const legacy = JSON.parse(raw);
    if (legacy && legacy.name) {
      profiles[legacy.name] = Object.assign(freshState(), legacy, { password: null });
      saveProfiles(profiles);
    }
  } catch (e) {}
}
function normalizeLoadedState() {
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
}

/* 로그인 시도. 성공하면 S를 그 친구의 저장 내용으로 바꾼다.
   결과: {ok:true, isNew} | {ok:true, isNew:false, passwordJustSet:true} | {ok:false} */
function tryLogin(name, password, grade, topics) {
  const profiles = loadProfiles();
  const existing = profiles[name];
  setLastName(name);
  if (!existing) {
    S = Object.assign(freshState(), { name, grade, topics: topics || null, password });
    profiles[name] = S;
    saveProfiles(profiles);
    return { ok: true, isNew: true };
  }
  if (!existing.password) {
    existing.password = password;
    S = Object.assign(freshState(), existing);
    normalizeLoadedState();
    saveProfiles(profiles);
    return { ok: true, isNew: false, passwordJustSet: true };
  }
  if (existing.password !== password) {
    return { ok: false };
  }
  S = Object.assign(freshState(), existing);
  normalizeLoadedState();
  return { ok: true, isNew: false };
}

function loadState() {
  migrateLegacySave();
  S = freshState(); // 로그인하기 전까지는 빈 상태 — 실제 데이터는 로그인할 때 tryLogin()이 채운다
  return S;
}

function saveState() {
  if (!S.name) return;
  try {
    const profiles = loadProfiles();
    profiles[S.name] = S;
    saveProfiles(profiles);
  } catch (e) {}
}
