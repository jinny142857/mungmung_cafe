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

function init() {
  loadState();
  readLinkSettings();
  if (pendingClassCode) { S.grade = pendingGrade; S.tier = 0; S.topics = pendingTopics; }
  migrateGeneratorCells();
  applyLayout();
  initBoard();
  updateCafeBackground();
  initCustomers();
  initMathUI();
  initRankingUI();
  initFirebase();
  renderHud();
  paused = !(S.name && S.grade);
  if (paused) openStart();
  requestAnimationFrame(loop);
}

document.addEventListener("DOMContentLoaded", init);
let skipAutosaveOnUnload = false;
window.addEventListener("beforeunload", () => { if (!skipAutosaveOnUnload) { try { saveState(); } catch (e) {} } });
