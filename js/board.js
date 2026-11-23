/* 멍멍 카페 — 보드, 드래그, 머지
   드래그로 옮기는 것 말고, 아이템을 톡 눌러서 고른 뒤(선택 표시) 다른 칸을 또 눌러서
   머지·이동·서빙하는 "순차 터치" 방식도 된다. 손가락으로 드래그가 서툰 아이들을 위한 것. */

let dragState = null;
let selectedCell = null; // {row,col,line,tier} — 순차 터치로 고른 아이템
const TAP_MOVE_PX = 12;  // 이 거리 이하로 움직이면 드래그가 아니라 "톡 누르기"로 본다

function cellLeft(col) { const L = layout(); return L.BOARD_ORIGIN_X + col * (L.BOARD_CELL + L.BOARD_GAP); }
function cellTop(row) { const L = layout(); return L.BOARD_ORIGIN_Y + row * (L.BOARD_CELL + L.BOARD_GAP); }
function itemSize(tier) { return Math.round(layout().BOARD_CELL * CONFIG.ITEM_SCALE[tier]); }

/* 현재 레벨에서 해금된 생성기 중, (row,col)에 있는 라인을 찾는다. 없으면 null. */
function generatorLineAt(row, col) {
  for (const id of unlockedLines(S.level)) {
    const g = CONFIG.LINES[id];
    if (g.genRow === row && g.genCol === col) return id;
  }
  return null;
}
function isGeneratorCell(row, col) { return generatorLineAt(row, col) !== null; }

/* 저장된 보드에 생성기 칸 자리를 차지한 아이템이 있으면 가까운 빈칸으로 옮긴다(불러올 때 한 번). */
function migrateGeneratorCells() {
  unlockedLines(S.level).forEach(id => {
    const g = CONFIG.LINES[id];
    const occupied = S.board[g.genRow][g.genCol];
    if (!occupied) return;
    const dest = nearestEmptyCellToGenerator(id);
    if (dest) { S.board[dest.row][dest.col] = occupied; S.board[g.genRow][g.genCol] = null; }
  });
}

function initBoard() {
  selectedCell = null; // 보드를 통째로 다시 그릴 때는 눈에 안 보이는 선택이 남지 않게 한다
  const L = layout();
  const panel = $("boardPanel");
  panel.style.left = L.BOARD_PANEL_LEFT + "px";
  panel.style.top = L.BOARD_PANEL_TOP + "px";
  panel.style.width = (L.BOARD_PANEL_RIGHT - L.BOARD_PANEL_LEFT) + "px";
  panel.style.height = (L.BOARD_PANEL_BOTTOM - L.BOARD_PANEL_TOP) + "px";
  const cellsWrap = $("boardCells");
  cellsWrap.innerHTML = "";
  for (let r = 0; r < CONFIG.BOARD_ROWS; r++) {
    for (let c = 0; c < CONFIG.BOARD_COLS; c++) {
      const cell = document.createElement("div");
      cell.className = "cell" + (isGeneratorCell(r, c) ? " gen-cell" : "");
      cell.style.left = cellLeft(c) + "px";
      cell.style.top = cellTop(r) + "px";
      cell.style.width = L.BOARD_CELL + "px";
      cell.style.height = L.BOARD_CELL + "px";
      cell.dataset.row = r; cell.dataset.col = c;
      cellsWrap.appendChild(cell);
    }
  }
  renderGenerators();
  renderBoardItems();
}

/* 해금된 생성기들을 다시 그린다 (레벨업으로 새 라인이 열릴 때도 호출).
   생성기 오른쪽 위에 업그레이드 배지(🪙가격)를 같이 그려서, 설정 화면을 몰라도
   생성기 자리에서 바로 업그레이드할 수 있게 한다. */
function renderGenerators() {
  const L = layout();
  const wrap = $("generators");
  wrap.innerHTML = "";
  unlockedLines(S.level).forEach(id => {
    const g = CONFIG.LINES[id];
    const el = document.createElement("img");
    el.src = assetUrl(g.genFile);
    el.alt = "";
    el.className = "generatorImg";
    el.dataset.line = id;
    el.style.left = cellLeft(g.genCol) + "px";
    el.style.top = cellTop(g.genRow) + "px";
    el.style.width = L.BOARD_CELL + "px";
    el.style.height = L.BOARD_CELL + "px";
    el.onpointerdown = e => onGeneratorPointerDown(e, id);
    wrap.appendChild(el);

    const badge = document.createElement("button");
    badge.type = "button";
    badge.className = "genBadge";
    badge.dataset.line = id;
    badge.style.left = (cellLeft(g.genCol) + L.BOARD_CELL - 30) + "px";
    badge.style.top = (cellTop(g.genRow) - 16) + "px";
    badge.onpointerdown = e => { e.preventDefault(); e.stopPropagation(); onGenBadgeTap(id); };
    wrap.appendChild(badge);
  });
  updateGenBadges();
}
/* 생성기 업그레이드 배지 — 코인·업그레이드 단계가 바뀔 때마다 다시 부른다(renderHud에서 호출). */
function updateGenBadges() {
  $("generators").querySelectorAll(".genBadge").forEach(b => {
    const line = b.dataset.line;
    if (!canUpgradeGenerator(line)) { b.style.display = "none"; return; }
    const cost = upgradeGeneratorCost(line);
    b.style.display = "flex";
    b.textContent = "🪙" + cost;
    b.classList.toggle("afford", S.coins >= cost);
  });
}
function onGenBadgeTap(line) {
  if (!canUpgradeGenerator(line)) return;
  const cost = upgradeGeneratorCost(line);
  if (S.coins < cost) { toast("코인이 더 필요해요 (🪙" + cost + ")"); return; }
  if (upgradeGenerator(line)) {
    toast(CONFIG.LINES[line].name + " 생성기를 업그레이드했어요! 이제 더 완성된 재료가 나와요.");
    updateGenBadges();
  }
}

function positionItemInCell(el, row, col, size) {
  const pad = (layout().BOARD_CELL - size) / 2;
  el.style.left = (cellLeft(col) + pad) + "px";
  el.style.top = (cellTop(row) + pad) + "px";
}

function makeItemEl(row, col, item) {
  const size = itemSize(item.tier);
  const el = document.createElement("img");
  el.src = assetUrl(CONFIG.LINES[item.line].items[item.tier]);
  el.alt = "";
  el.className = "boardItem" + (item.tier === CONFIG.ITEM_MAX_TIER ? " glow" : "");
  el.style.width = size + "px";
  el.style.height = size + "px";
  positionItemInCell(el, row, col, size);
  el.dataset.row = row; el.dataset.col = col; el.dataset.line = item.line; el.dataset.tier = item.tier;
  el.addEventListener("pointerdown", onItemPointerDown);
  return el;
}

function renderBoardItems() {
  const wrap = $("boardItems");
  wrap.innerHTML = "";
  for (let r = 0; r < CONFIG.BOARD_ROWS; r++) {
    for (let c = 0; c < CONFIG.BOARD_COLS; c++) {
      const it = S.board[r][c];
      if (!it) continue;
      wrap.appendChild(makeItemEl(r, c, it));
    }
  }
}

/* ---------- 드래그 + 순차 터치 ---------- */
function onItemPointerDown(e) {
  if (mathOpen || dragState) return;
  const el = e.currentTarget;
  const row = +el.dataset.row, col = +el.dataset.col, line = el.dataset.line, tier = +el.dataset.tier;

  // 이미 고른(선택된) 아이템이 있는 상태에서 다른 칸을 눌렀다 — 바로 머지·이동·교체를 시도한다.
  if (selectedCell) {
    e.preventDefault(); e.stopPropagation();
    const drag = selectedCell;
    clearSelection();
    if (drag.row === row && drag.col === col) return; // 같은 아이템을 다시 누르면 선택 해제
    if (selectionStillValid(drag)) resolveDrop(drag, clientToStage(e.clientX, e.clientY));
    return;
  }

  e.preventDefault();
  const pt = clientToStage(e.clientX, e.clientY);
  dragState = {
    row, col, line, tier, el,
    offsetX: pt.x - parseFloat(el.style.left),
    offsetY: pt.y - parseFloat(el.style.top),
    startX: e.clientX, startY: e.clientY,
  };
  el.classList.add("dragging");
  el.style.zIndex = 60;
  try { el.setPointerCapture(e.pointerId); } catch (err) {}
  el.addEventListener("pointermove", onItemPointerMove);
  el.addEventListener("pointerup", onItemPointerUp);
  el.addEventListener("pointercancel", onItemPointerUp);
}
function onItemPointerMove(e) {
  if (!dragState) return;
  const pt = clientToStage(e.clientX, e.clientY);
  const el = dragState.el;
  el.style.left = (pt.x - dragState.offsetX) + "px";
  el.style.top = (pt.y - dragState.offsetY) + "px";
  highlightDropTarget(pt);
}
function onItemPointerUp(e) {
  if (!dragState) return;
  const drag = dragState; dragState = null;
  const el = drag.el;
  el.removeEventListener("pointermove", onItemPointerMove);
  el.removeEventListener("pointerup", onItemPointerUp);
  el.removeEventListener("pointercancel", onItemPointerUp);
  el.classList.remove("dragging");
  el.style.zIndex = "";
  clearDropHighlight();
  const moved = Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) > TAP_MOVE_PX;
  if (!moved) { selectItem(drag.row, drag.col, drag.line, drag.tier); return; } // 움직이지 않았으면 드래그가 아니라 "고르기"
  const pt = clientToStage(e.clientX, e.clientY);
  resolveDrop(drag, pt);
}

/* 아이템을 톡 눌러서 고른다. 다음에 다른 칸을 누르면 그 칸으로 머지·이동·서빙된다. */
function selectItem(row, col, line, tier) {
  clearSelectionHighlight();
  selectedCell = { row, col, line, tier };
  const el = $("boardItems").querySelector(`[data-row="${row}"][data-col="${col}"]`);
  if (el) el.classList.add("selected");
}
function clearSelectionHighlight() {
  $("boardItems").querySelectorAll(".selected").forEach(el => el.classList.remove("selected"));
}
function clearSelection() {
  clearSelectionHighlight();
  selectedCell = null;
}
/* 그 사이 보드가 바뀌어서(레벨업 등) 고른 아이템이 더 이상 그 자리에 없으면 무시한다. */
function selectionStillValid(drag) {
  const cell = S.board[drag.row] && S.board[drag.row][drag.col];
  return !!cell && cell.line === drag.line && cell.tier === drag.tier;
}
/* 빈칸이나 손님처럼 자기 pointerdown이 없는 자리를 눌렀을 때(버블링으로 stage까지 올라옴) 처리한다. */
function onStageTapForSelection(e) {
  if (!selectedCell || paused || mathOpen) return;
  const pt = clientToStage(e.clientX, e.clientY);
  if (!hitTestCustomer(pt) && !hitTestCell(pt)) return;
  const drag = selectedCell;
  clearSelection();
  if (selectionStillValid(drag)) resolveDrop(drag, pt);
}
function initBoardTapSelect() {
  $("stage").addEventListener("pointerdown", onStageTapForSelection);
}

function hitTestCell(pt) {
  const L = layout();
  if (pt.x < L.BOARD_PANEL_LEFT || pt.x > L.BOARD_PANEL_RIGHT || pt.y < L.BOARD_PANEL_TOP || pt.y > L.BOARD_PANEL_BOTTOM) return null;
  const step = L.BOARD_CELL + L.BOARD_GAP;
  let col = Math.floor((pt.x - L.BOARD_ORIGIN_X) / step);
  let row = Math.floor((pt.y - L.BOARD_ORIGIN_Y) / step);
  col = Math.max(0, Math.min(CONFIG.BOARD_COLS - 1, col));
  row = Math.max(0, Math.min(CONFIG.BOARD_ROWS - 1, row));
  return { row, col };
}
function highlightDropTarget(pt) {
  clearDropHighlight();
  const cust = hitTestCustomer(pt);
  if (cust) { markCustomerDropTarget(cust); return; }
  const cell = hitTestCell(pt);
  if (!cell || isGeneratorCell(cell.row, cell.col)) return;
  const el = $("boardCells").querySelector(`[data-row="${cell.row}"][data-col="${cell.col}"]`);
  if (el) el.classList.add("drop-target");
}
function clearDropHighlight() {
  $("boardCells").querySelectorAll(".drop-target").forEach(el => el.classList.remove("drop-target"));
  clearCustomerDropTarget();
}

function resolveDrop(drag, pt) {
  const cust = hitTestCustomer(pt);
  if (cust) {
    if (tryServeCustomer(cust, drag.line, drag.tier)) {
      S.board[drag.row][drag.col] = null;
      saveState(); renderBoardItems(); renderHud();
      return;
    }
    shakeCustomerBubble(cust);
    renderBoardItems();
    return;
  }
  const cell = hitTestCell(pt);
  if (!cell || (cell.row === drag.row && cell.col === drag.col) || isGeneratorCell(cell.row, cell.col)) {
    renderBoardItems();
    return;
  }
  const target = S.board[cell.row][cell.col];
  if (!target) {
    S.board[cell.row][cell.col] = { line: drag.line, tier: drag.tier };
    S.board[drag.row][drag.col] = null;
  } else if (target.line === drag.line && target.tier === drag.tier && drag.tier < CONFIG.ITEM_MAX_TIER) {
    const newTier = drag.tier + 1;
    S.board[cell.row][cell.col] = { line: drag.line, tier: newTier };
    S.board[drag.row][drag.col] = null;
    playMergeEffect(cell.row, cell.col);
    if (markDiscovered(drag.line, newTier)) toast("📖 도감에 새 메뉴가 추가됐어요!");
  } else {
    const tmp = S.board[cell.row][cell.col];
    S.board[cell.row][cell.col] = S.board[drag.row][drag.col];
    S.board[drag.row][drag.col] = tmp;
  }
  saveState(); renderBoardItems();
}

/* ---------- 생성기 업그레이드 ---------- */
function canUpgradeGenerator(line) { return (S.genUpgrade[line] || 0) < CONFIG.GEN_UPGRADE_MAX; }
function upgradeGeneratorCost(line) { return CONFIG.GEN_UPGRADE_COST[(S.genUpgrade[line] || 0) + 1]; }
function upgradeGenerator(line) {
  if (!canUpgradeGenerator(line)) return false;
  const cost = upgradeGeneratorCost(line);
  if (S.coins < cost) return false;
  S.coins -= cost;
  S.genUpgrade[line] = (S.genUpgrade[line] || 0) + 1;
  saveState(); renderHud();
  return true;
}

/* ---------- 생성기 ---------- */
function nearestEmptyCellToGenerator(line) {
  const g = CONFIG.LINES[line];
  let best = null, bestDist = Infinity;
  for (let r = 0; r < CONFIG.BOARD_ROWS; r++) {
    for (let c = 0; c < CONFIG.BOARD_COLS; c++) {
      if (isGeneratorCell(r, c) || S.board[r][c]) continue;
      const d = Math.hypot(r - g.genRow, c - g.genCol);
      if (d < bestDist) { bestDist = d; best = { row: r, col: c }; }
    }
  }
  return best;
}
function onGeneratorPointerDown(e, line) {
  e.preventDefault();
  if (mathOpen) return;
  if (S.energy <= 0) { toast("문제를 풀면 에너지가 생겨요!"); openMath(); return; }
  const cell = nearestEmptyCellToGenerator(line);
  if (!cell) { toast("보드가 가득 찼어요"); shakeGenerator(line); return; }
  S.energy -= CONFIG.ENERGY_PER_TAP;
  const base = 1 + (S.genUpgrade[line] || 0);
  const tier = Math.random() < CONFIG.GEN_DROP_RATE[1] ? base : base + 1;
  S.board[cell.row][cell.col] = { line, tier };
  if (markDiscovered(line, tier)) toast("📖 도감에 새 메뉴가 추가됐어요!");
  saveState(); renderBoardItems(); renderHud();
  popGeneratedItem(cell.row, cell.col);
}
