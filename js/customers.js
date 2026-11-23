/* 멍멍 카페 — 손님 생성, 주문, 인내심
   레이어 순서(배경→손님→카운터 덮개→바리스타→말풍선…) 때문에
   강아지 그림은 #customerLayer에, 말풍선은 더 위에 있는 #bubbleLayer에 따로 그린다.
   둘은 같은 x좌표로 함께 슬라이드되어 한 손님처럼 보인다. */

let customers = [];
let nextCustomerId = 1;
let spawnTimer = 0;

function spriteId(id) { return "custSprite-" + id; }
function bubbleId(id) { return "custBubble-" + id; }

function initCustomers() {
  $("customerLayer").innerHTML = "";
  $("bubbleLayer").innerHTML = "";
  customers = [];
  spawnTimer = customerSpawnRuleForLevel(S.level).firstDelay;
}

function customerSrc(species, face) { return assetUrl(`assets/customers/cust_${species}_${face}.png`); }
function patienceColor(ratio) {
  if (ratio > 0.6) return "#8BD3A0";
  if (ratio > 0.4) return "#F6D365";
  return "#F28B82";
}

function freeSlot() {
  const used = new Set(customers.map(c => c.slot));
  for (let i = 0; i < CONFIG.CUSTOMER_MAX; i++) if (!used.has(i)) return i;
  return -1;
}

function makeOrder() {
  const rule = orderRuleForLevel(S.level);
  const lines = unlockedLines(S.level);
  const count = pick(rule.counts);
  const items = [];
  for (let i = 0; i < count; i++) {
    const line = pick(lines);
    // 생성기를 업그레이드했으면 그 라인은 더 낮은 단계를 다시 만들 수 없다 — 그 단계는 주문에서 뺀다.
    const minTier = 1 + (S.genUpgrade[line] || 0);
    const avail = rule.tiers.filter(t => t >= minTier);
    const tier = pick(avail.length ? avail : [Math.max(...rule.tiers)]);
    items.push({ line, tier, delivered: false });
  }
  return items;
}

function spawnCustomer() {
  const slot = freeSlot();
  if (slot < 0) return;
  const isFirstEver = !S.seenEnergyHint;
  const species = pick(CONFIG.CUSTOMER_SPECIES);
  const order = makeOrder();
  const patienceMax = CONFIG.PATIENCE_BASE + CONFIG.PATIENCE_PER_EXTRA_ORDER * (order.length - 1);
  const cust = {
    id: nextCustomerId++, species, slot, order, patienceMax, patience: patienceMax,
    face: "normal", state: "entering",
  };
  customers.push(cust);
  renderCustomer(cust);
  baristaGreet();
  setTimeout(() => { if (cust.state === "entering") cust.state = "waiting"; }, 420);
  if (isFirstEver) {
    S.seenEnergyHint = true; saveState();
    setTimeout(() => toast("문제를 풀어 에너지를 모아요!"), 500);
  }
  const spawnRule = customerSpawnRuleForLevel(S.level);
  spawnTimer = rand(spawnRule.respawnMin, spawnRule.respawnMax);
}

function tickCustomers(dt) {
  if (paused) return;
  if (customers.length < CONFIG.CUSTOMER_MAX) {
    spawnTimer -= dt;
    if (spawnTimer <= 0) spawnCustomer();
  }
  customers.forEach(c => {
    if (c.state !== "waiting") return;
    c.patience -= dt;
    const ratio = Math.max(0, c.patience) / c.patienceMax;
    const newFace = ratio <= CONFIG.FACE_ANGRY_RATIO ? "angry" : "normal";
    if (newFace !== c.face) { c.face = newFace; updateCustomerFace(c); }
    updatePatienceBar(c, ratio);
    if (c.patience <= 0) leaveCustomer(c, "angry");
  });
}

function renderCustomer(cust) {
  const L = layout();
  const slot = L.CUSTOMER_SLOTS[cust.slot];

  const spriteBox = document.createElement("div");
  spriteBox.className = "customerSpriteBox";
  spriteBox.id = spriteId(cust.id);
  spriteBox.style.left = (slot.x - L.CUSTOMER_BODY_SIZE / 2) + "px";
  spriteBox.style.top = slot.y + "px";
  spriteBox.style.width = L.CUSTOMER_BODY_SIZE + "px";
  spriteBox.style.height = L.CUSTOMER_BODY_SIZE + "px";
  spriteBox.style.transform = `translateX(${L.CUSTOMER_SLIDE_OFFSET}px)`;
  spriteBox.innerHTML = `<img class="customerSprite" src="${customerSrc(cust.species, cust.face)}" alt="">`;
  $("customerLayer").appendChild(spriteBox);

  const bubbleBox = document.createElement("div");
  bubbleBox.className = "customerBubbleBox";
  bubbleBox.id = bubbleId(cust.id);
  bubbleBox.style.left = (slot.x - L.CUSTOMER_BUBBLE_WIDTH / 2) + "px";
  bubbleBox.style.top = L.CUSTOMER_BUBBLE_TOP + "px";
  bubbleBox.style.width = L.CUSTOMER_BUBBLE_WIDTH + "px";
  bubbleBox.style.transform = `translateX(${L.CUSTOMER_SLIDE_OFFSET}px)`;
  bubbleBox.innerHTML = `<div class="orderBubble"></div>`;
  $("bubbleLayer").appendChild(bubbleBox);

  renderOrderBubble(cust);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    spriteBox.style.transform = "translateX(0px)";
    bubbleBox.style.transform = "translateX(0px)";
  }));
}
/* 화면 방향이 바뀌었을 때, 있던 손님들을 새 배치의 자리로 다시 그린다(슬라이드 연출 없이 즉시 이동). */
function relayoutCustomers() {
  const L = layout();
  customers.forEach(cust => {
    const slot = L.CUSTOMER_SLOTS[cust.slot];
    const sBox = $(spriteId(cust.id)), bBox = $(bubbleId(cust.id));
    if (sBox) {
      sBox.style.left = (slot.x - L.CUSTOMER_BODY_SIZE / 2) + "px";
      sBox.style.top = slot.y + "px";
      sBox.style.width = L.CUSTOMER_BODY_SIZE + "px";
      sBox.style.height = L.CUSTOMER_BODY_SIZE + "px";
    }
    if (bBox) {
      bBox.style.left = (slot.x - L.CUSTOMER_BUBBLE_WIDTH / 2) + "px";
      bBox.style.top = L.CUSTOMER_BUBBLE_TOP + "px";
      bBox.style.width = L.CUSTOMER_BUBBLE_WIDTH + "px";
    }
  });
}
function updateCustomerFace(cust) {
  const box = $(spriteId(cust.id)); if (!box) return;
  const sprite = box.querySelector(".customerSprite");
  if (sprite) sprite.src = customerSrc(cust.species, cust.face);
}
function renderOrderBubble(cust) {
  const box = $(bubbleId(cust.id)); if (!box) return;
  const bubble = box.querySelector(".orderBubble");
  const icons = cust.order.map(o => `<div class="orderIcon${o.delivered ? " done" : ""}"><img src="${assetUrl(CONFIG.LINES[o.line].items[o.tier])}" alt=""></div>`).join("");
  const ratio = Math.max(0, cust.patience) / cust.patienceMax;
  bubble.innerHTML = `<div class="orderIcons">${icons}</div><div class="patienceBar"><div class="patienceFill" style="width:${Math.round(ratio * 100)}%;background:${patienceColor(ratio)}"></div></div>`;
}
function updatePatienceBar(cust, ratio) {
  const box = $(bubbleId(cust.id)); if (!box) return;
  const fill = box.querySelector(".patienceFill");
  if (fill) { fill.style.width = Math.round(ratio * 100) + "%"; fill.style.background = patienceColor(ratio); }
}

function markCustomerDropTarget(cust) {
  const s = $(spriteId(cust.id)), b = $(bubbleId(cust.id));
  if (s) s.classList.add("drop-target"); if (b) b.classList.add("drop-target");
}
function clearCustomerDropTarget() {
  document.querySelectorAll(".drop-target").forEach(el => el.classList.remove("drop-target"));
}
function shakeCustomerBubble(cust) {
  const box = $(bubbleId(cust.id)); if (!box) return;
  const bubble = box.querySelector(".orderBubble");
  bubble.classList.remove("shake"); void bubble.offsetWidth; bubble.classList.add("shake");
}

function hitTestCustomer(pt) {
  const L = layout();
  for (const c of customers) {
    if (c.state !== "waiting") continue;
    const slotX = L.CUSTOMER_SLOTS[c.slot].x;
    if (pt.x >= slotX - L.CUSTOMER_HIT_HALF_WIDTH && pt.x <= slotX + L.CUSTOMER_HIT_HALF_WIDTH &&
      pt.y >= L.CUSTOMER_HIT_TOP && pt.y <= L.CUSTOMER_HIT_BOTTOM) return c;
  }
  return null;
}

function tryServeCustomer(cust, line, tier) {
  const entry = cust.order.find(o => !o.delivered && o.line === line && o.tier === tier);
  if (!entry) return false;
  entry.delivered = true;
  renderOrderBubble(cust);
  if (cust.order.every(o => o.delivered)) completeOrder(cust);
  return true;
}

function gainExp(amount) {
  if (S.level >= CONFIG.LEVEL_MAX) return;
  const levelBefore = S.level;
  S.exp += amount;
  const unlocked = [];
  while (S.level < CONFIG.LEVEL_MAX && S.exp >= CONFIG.LEVEL_EXP_TO_NEXT[S.level]) {
    S.exp -= CONFIG.LEVEL_EXP_TO_NEXT[S.level];
    S.level++;
    showLevelUp();
    const justUnlocked = Object.keys(CONFIG.LINES).find(id => CONFIG.LINES[id].unlockLevel === S.level);
    if (justUnlocked) unlocked.push(justUnlocked);
  }
  if (unlocked.length) {
    migrateGeneratorCells(); // 새 생성기 칸 자리에 아이템이 있었다면 가까운 빈칸으로 옮긴다
    initBoard(); // 새로 열린 생성기 칸의 배경(gen-cell)까지 함께 다시 그린다
    unlocked.forEach((id, i) => setTimeout(() => toast(CONFIG.LINE_UNLOCK_MSG[id]), 1600 + i * 1500));
  }
  if (S.level !== levelBefore) { updateCafeBackground(); syncMyRanking(true); } // 레벨이 바뀌면 배경도, 랭킹도 바로 갱신
}

function completeOrder(cust) {
  cust.state = "served";
  let coins = 0, exp = 0;
  cust.order.forEach(o => { coins += CONFIG.SERVE_COIN[o.tier] || 0; exp += CONFIG.SERVE_EXP[o.tier] || 0; });
  const ratio = Math.max(0, cust.patience) / cust.patienceMax;
  let tipped = false;
  if (ratio > CONFIG.TIP_PATIENCE_RATIO) { coins = Math.round(coins * (1 + CONFIG.TIP_BONUS_RATIO)); tipped = true; }
  S.coins += coins;
  gainExp(exp);
  S.today.served++;
  if (S.today.served === CONFIG.DAILY_SERVE_GOAL) {
    S.coins += CONFIG.DAILY_SERVE_BONUS_COINS;
    setTimeout(() => toast(`🏅 오늘 손님 ${CONFIG.DAILY_SERVE_GOAL}명 서빙 달성! 코인 +${CONFIG.DAILY_SERVE_BONUS_COINS}`), 600);
  }
  cust.face = "happy"; updateCustomerFace(cust);
  if (tipped) floatTipBadge(cust);
  baristaServe();
  saveState(); renderHud();
  syncMyRanking();
  setTimeout(() => leaveCustomer(cust, "happy"), CONFIG.FACE_HAPPY_DURATION * 1000);
}

function leaveCustomer(cust, mood) {
  if (cust.state === "leaving") return;
  cust.state = "leaving";
  if (mood === "angry") { cust.face = "angry"; updateCustomerFace(cust); }
  const offset = layout().CUSTOMER_SLIDE_OFFSET;
  const sBox = $(spriteId(cust.id)), bBox = $(bubbleId(cust.id));
  if (sBox) sBox.style.transform = `translateX(${offset}px)`;
  if (bBox) bBox.style.transform = `translateX(${offset}px)`;
  setTimeout(() => {
    customers = customers.filter(c => c.id !== cust.id);
    if (sBox && sBox.parentNode) sBox.parentNode.removeChild(sBox);
    if (bBox && bBox.parentNode) bBox.parentNode.removeChild(bBox);
  }, 420);
}
