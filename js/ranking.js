/* 멍멍 카페 — 카페 랭킹(레벨순·자산순)
   Firebase(Firestore)를 써서 여러 기기의 학생 기록을 한 곳에 모은다.
   선생님이 Firebase 프로젝트를 만들고 아래 firebaseConfig 값을 채워 넣어야 동작한다.
   값을 안 채우면(placeholder 그대로면) 조용히 꺼진 채로 동작한다 — 에러로 게임이 멈추지 않는다. */

const firebaseConfig = {
  apiKey: "AIzaSyCuJYEwRbqp2DVHMJ-mRvVbZaAsGTin4u0",
  authDomain: "class-58766.firebaseapp.com",
  projectId: "class-58766",
  storageBucket: "class-58766.firebasestorage.app",
  messagingSenderId: "1045417497771",
  appId: "1:1045417497771:web:1efe2009b7eaa0b30413ee",
};

const RANKING_COLLECTION = "mungmung_cafe_players"; // 기존 프로젝트의 다른 컬렉션과 안 겹치게 이름을 특정했다
const RANKING_LIMIT = 20;          // 랭킹에 보여줄 인원
const RANKING_SYNC_MIN_GAP = 8000; // 내 기록을 서버로 보내는 최소 간격(ms) — 너무 자주 보내지 않게

let fbUid = null;
let fbReady = false;
let lastSyncAt = 0;

function rankingConfigured() {
  return firebaseConfig.apiKey && firebaseConfig.apiKey !== "REPLACE_ME";
}

function initFirebase() {
  if (!rankingConfigured()) return; // 선생님이 아직 설정 안 하신 상태 — 조용히 넘어간다
  if (typeof firebase === "undefined") return; // SDK 로드 실패해도 게임은 계속되게
  try {
    firebase.initializeApp(firebaseConfig);
    firebase.auth().signInAnonymously()
      .then(cred => { fbUid = cred.user.uid; fbReady = true; syncMyRanking(true); })
      .catch(err => console.warn("[랭킹] 로그인 실패", err));
  } catch (err) {
    console.warn("[랭킹] 초기화 실패", err);
  }
}

/* 내 기록을 서버에 올린다. force가 아니면 너무 자주 호출돼도 일정 간격을 두고 보낸다. */
function syncMyRanking(force) {
  if (!fbReady || !S.name) return;
  const now = Date.now();
  if (!force && now - lastSyncAt < RANKING_SYNC_MIN_GAP) return;
  lastSyncAt = now;
  firebase.firestore().collection(RANKING_COLLECTION).doc(fbUid).set({
    name: String(S.name).slice(0, 10),
    level: S.level,
    coins: Math.floor(S.coins),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  }, { merge: true }).catch(err => console.warn("[랭킹] 저장 실패", err));
}

async function fetchRanking(field) {
  const snap = await firebase.firestore().collection(RANKING_COLLECTION)
    .orderBy(field, "desc").limit(RANKING_LIMIT).get();
  return snap.docs.map(d => d.data());
}

/* ---------- 랭킹 창 ---------- */
let rankingTab = "level";
function openRanking() {
  $("rankingOverlay").classList.add("show");
  pauseGame();
  renderRankingTabs();
  loadRankingTab();
}
function closeRanking() { $("rankingOverlay").classList.remove("show"); resumeGame(); }
function renderRankingTabs() {
  $("rankingTabs").querySelectorAll("button").forEach(b => b.classList.toggle("on", b.dataset.tab === rankingTab));
}
async function loadRankingTab() {
  const body = $("rankingBody");
  if (!rankingConfigured()) {
    body.innerHTML = `<div class="rankingMsg">아직 랭킹 서버가 연결되지 않았어요.<br>선생님께 설정을 요청해 주세요.</div>`;
    return;
  }
  if (!fbReady) {
    body.innerHTML = `<div class="rankingMsg">연결하는 중이에요...</div>`;
    return;
  }
  body.innerHTML = `<div class="rankingMsg">불러오는 중...</div>`;
  try {
    const field = rankingTab === "level" ? "level" : "coins";
    const rows = await fetchRanking(field);
    if (!rows.length) { body.innerHTML = `<div class="rankingMsg">아직 기록이 없어요. 첫 번째로 이름을 올려보세요!</div>`; return; }
    body.innerHTML = rows.map((r, i) => {
      const mine = r.name === S.name;
      const value = rankingTab === "level" ? "Lv." + r.level : Math.floor(r.coins) + "코인";
      return `<div class="rankRow${mine ? " mine" : ""}"><span class="rankNo">${i + 1}</span><span class="rankName">${escapeHtml(r.name)}</span><span class="rankVal">${value}</span></div>`;
    }).join("");
  } catch (err) {
    console.warn("[랭킹] 조회 실패", err);
    body.innerHTML = `<div class="rankingMsg">랭킹을 불러오지 못했어요.</div>`;
  }
}
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

/* DOM 준비된 뒤 main.js init()에서 호출 */
function initRankingUI() {
  $("btnOpenRanking").onclick = openRanking;
  $("btnCloseRanking").onclick = closeRanking;
  $("rankingOverlay").addEventListener("click", e => { if (e.target.id === "rankingOverlay") closeRanking(); });
  $("rankingTabs").querySelectorAll("button").forEach(b => b.onclick = () => { rankingTab = b.dataset.tab; renderRankingTabs(); loadRankingTab(); });
}
