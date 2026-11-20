/* 멍멍 카페 — 초기화, 게임 루프
   화면이 가로(아이패드 landscape)인지 세로인지에 따라 다른 배치(CONFIG.LAYOUTS)를 쓴다. */

let paused = true;
function pauseGame() { paused = true; }
function resumeGame() { paused = false; }

function isLandscapeMode() { return window.innerWidth > window.innerHeight; }
let currentMode = null;
function layout() { return CONFIG.LAYOUTS[isLandscapeMode() ? "landscape" : "portrait"]; }

function clientToStage(clientX, clientY) {
  const rect = $("stage").getBoundingClientRect();
  const L = layout();
  return {
    x: (clientX - rect.left) / rect.width * L.STAGE_W,
    y: (clientY - rect.top) / rect.height * L.STAGE_H,
  };
}

function resizeStage() {
  const L = layout();
  const s = Math.min(window.innerWidth / L.STAGE_W, window.innerHeight / L.STAGE_H);
  $("stage").style.transform = `scale(${s})`;
}

function applyLayout() {
  const mode = isLandscapeMode() ? "landscape" : "portrait";
  const modeChanged = mode !== currentMode;
  currentMode = mode;
  const L = layout();
  const stage = $("stage");
  stage.style.width = L.STAGE_W + "px";
  stage.style.height = L.STAGE_H + "px";
  stage.classList.toggle("landscape", mode === "landscape");
  stage.classList.toggle("portrait", mode === "portrait");
  resizeStage();
  if (modeChanged) {
    initBoard();
    relayoutCustomers();
  }
}

window.addEventListener("resize", applyLayout);

let lastT = 0;
function loop(t) {
  const dt = Math.min(0.05, lastT ? (t - lastT) / 1000 : 0);
  lastT = t;
  tickCustomers(dt);
  requestAnimationFrame(loop);
}

/* 로그인에 성공한 뒤(또는 새 친구로 시작한 뒤) 그 친구의 저장 내용을 화면에 반영한다. */
function onLoggedIn() {
  migrateGeneratorCells();
  applyLayout();
  initBoard();
  updateCafeBackground();
  relayoutCustomers();
  renderHud();
  resumeGame();
}

function init() {
  loadState();
  readLinkSettings();
  applyLayout();
  initBoard();
  initCustomers();
  initMathUI();
  initRankingUI();
  initFirebase();
  renderHud();
  paused = true;
  openStart(); // 기기를 같이 쓰는 친구들을 구분하기 위해 매번 로그인 화면부터 보여준다
  requestAnimationFrame(loop);
}

document.addEventListener("DOMContentLoaded", init);
let skipAutosaveOnUnload = false;
window.addEventListener("beforeunload", () => { if (!skipAutosaveOnUnload) { try { saveState(); } catch (e) {} } });
