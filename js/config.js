/* 멍멍 카페 — 밸런스·수치 설정
   가격, 시간, 확률 등은 모두 여기서만 바꾼다.
   화면 배치(무대 크기, 보드 좌표, 손님 자리)는 세로/가로 두 가지로 따로 둔다 — LAYOUTS 참고. */
const CONFIG = {
  // 그림 파일을 같은 이름으로 다시 올렸을 때 브라우저가 옛날 캐시를 쓰지 않도록 붙이는 숫자.
  // 그림을 바꿀 때마다 1씩 올린다.
  ASSET_V: 32,

  // 에너지
  ENERGY_MAX: 60,
  ENERGY_START: 10,
  ENERGY_CORRECT: 6,        // 수학 문제 정답 보상
  ENERGY_SECOND_WRONG: 2,   // 두 번째 오답 보상
  ENERGY_PER_TAP: 1,        // 생성기 한 번 누를 때 소모

  // 오늘의 학습 목표
  DAILY_GOAL: 10,
  DAILY_SERVE_GOAL: 5,        // 오늘의 미션: 손님 몇 명 서빙하면
  DAILY_SERVE_BONUS_COINS: 50, // 달성 보너스 코인

  // 난이도(단계) 조정 — 3학년은 단원 선택 방식이라 적용하지 않음
  TIER_UP_STREAK: 3,   // 연속 정답 n문제마다 단계 +1
  TIER_DOWN_WRONG: 2,  // 연속(두 번째) 오답 n번마다 단계 -1

  // 보드 (칸 수는 세로·가로 공통, 칸 크기·좌표는 LAYOUTS 참고)
  BOARD_ROWS: 7,
  BOARD_COLS: 7,

  // 생성기
  GEN_DROP_RATE: { 1: 0.70, 2: 0.30 }, // 나오는 아이템 단계별 확률(생성기 기본 단계 대비 +0/+1)

  // 생성기 업그레이드: 코인을 내면 생성기가 뱉는 재료의 기본 단계가 올라간다.
  // 레벨0(기본)=1단계, 레벨1=2단계, 레벨2=3단계. GEN_UPGRADE_COST[n]은 "레벨 n으로 올리는" 비용.
  GEN_UPGRADE_MAX: 2,
  GEN_UPGRADE_COST: { 1: 150, 2: 500 },

  // 라인마다 8종 그림 중 6개를 골라 1~6단계로 쓴다. 8단계는 만들어도 손님이 절대 주문하지
  // 않아 "장식용"이 되는 문제가 있어서, 6단계로 줄이고 그 대신 6단계까지는 반드시 주문에 쓰이게 했다.
  ITEM_MAX_TIER: 6,

  // 아이템 단계(1~6)별 칸 대비 표시 크기 — 라인 공통
  ITEM_SCALE: { 1: 0.60, 2: 0.60, 3: 0.75, 4: 0.75, 5: 0.90, 6: 0.90 },

  // 단계별 서빙 보상(코인/경험치) — 라인 공통. 1단계(원두 등 재료)만 완성 음료가 아니라 서빙 불가
  SERVE_COIN: { 2: 5, 3: 10, 4: 20, 5: 40, 6: 70 },
  SERVE_EXP:  { 2: 2, 3: 3,  4: 6,  5: 12, 6: 20 },

  // 팁
  TIP_PATIENCE_RATIO: 0.6, // 완료 순간 인내심이 이 비율을 넘으면
  TIP_BONUS_RATIO: 0.5,    // 코인 +50%

  // 레벨 — design-guide.md의 해금표를 따른다(Lv3 과일, Lv5 쿠키, Lv8 케이크). Lv9가 MVP 최고 레벨.
  LEVEL_MAX: 9,
  LEVEL_EXP_TO_NEXT: { 1: 40, 2: 120, 3: 220, 4: 380, 5: 600, 6: 850, 7: 1150, 8: 1500 },

  // 라인: 생성기 위치(행·열, 7x7 보드 기준)와 해금 레벨, 아이템 그림
  LINES: {
    coffee: {
      name: "커피", unlockLevel: 1, genRow: 6, genCol: 3,
      genFile: "assets/generators/gen_coffee_lv1.png",
      items: { // 커피콩 → 에스프레소 → 라떼 → 바닐라라떼 → 카라멜마키아토 → 시그니처(선생님이 고른 6단계)
        1: "assets/items/item_coffee_01_bean.png",
        2: "assets/items/item_coffee_03_espresso.png",
        3: "assets/items/item_coffee_05_latte.png",
        4: "assets/items/item_coffee_06_vanilla_latte.png",
        5: "assets/items/item_coffee_07_caramel_macchiato.png",
        6: "assets/items/item_coffee_08_signature_cloud_latte.png",
      },
    },
    fruit: {
      name: "과일음료", unlockLevel: 3, genRow: 6, genCol: 1,
      genFile: "assets/generators/gen_fruit_lv1.png",
      items: { // 과일바구니 → 딸기우유 → 오렌지주스 → 수박에이드 → 무지개에이드 → 유니콘소다
        1: "assets/items/item_fruit_02_basket.png",
        2: "assets/items/item_fruit_03_strawberry_milk.png",
        3: "assets/items/item_fruit_04_orange_juice.png",
        4: "assets/items/item_fruit_06_watermelon_ade.png",
        5: "assets/items/item_fruit_07_rainbow_ade.png",
        6: "assets/items/item_fruit_08_unicorn_soda.png",
      },
    },
    cookie: {
      name: "쿠키", unlockLevel: 5, genRow: 6, genCol: 5,
      genFile: "assets/generators/gen_cookie_lv1.png",
      items: { // 반죽 → 버터쿠키 → 초코칩쿠키 → 강아지발바닥쿠키 → 마카롱트레이 → 진저브레드하우스
        1: "assets/items/item_cookie_02_dough.png",
        2: "assets/items/item_cookie_03_butter_cookie.png",
        3: "assets/items/item_cookie_04_chocochip_stack.png",
        4: "assets/items/item_cookie_05_paw_cookie.png",
        5: "assets/items/item_cookie_06_macaron_tray.png",
        6: "assets/items/item_cookie_08_gingerbread_house.png",
      },
    },
    cake: {
      name: "케이크", unlockLevel: 8, genRow: 0, genCol: 3,
      genFile: "assets/generators/gen_cake_lv1.png",
      items: { // 반죽볼 → 컵케이크 → 케이크조각 → 초코드립케이크 → 강아지케이크 → 파티케이크
        1: "assets/items/item_cake_02_batter_bowl.png",
        2: "assets/items/item_cake_03_cupcake.png",
        3: "assets/items/item_cake_04_cake_slice.png",
        4: "assets/items/item_cake_06_choco_drip_cake.png",
        5: "assets/items/item_cake_07_shiba_cake.png",
        6: "assets/items/item_cake_08_party_cake.png",
      },
    },
  },

  // 라인이 새로 열렸을 때 보여줄 토스트 문구
  LINE_UNLOCK_MSG: {
    fruit: "🍓 과일음료 레시피가 열렸어요!",
    cookie: "🍪 쿠키 레시피가 열렸어요!",
    cake: "🎂 케이크 레시피가 열렸어요!",
  },

  // 카페 모습(배경)이 레벨에 따라 바뀐다 — design-guide.md 표와 같은 구간.
  // 파일: assets/bg/bg_cafe_{key}.png, bg_cafe_{key}_landscape.png
  // 아직 안 만든 레벨의 그림은 lv1으로 자동 대체된다(ui.js의 setCafeBgImg 참고).
  CAFE_BG_LEVELS: [
    { minLevel: 1, key: "lv1", desc: "기본 카페" },
    { minLevel: 2, key: "lv2", desc: "바다속 인어공주 카페" },
    { minLevel: 3, key: "lv3", desc: "할로윈 카페" },
    { minLevel: 4, key: "lv4", desc: "크리스마스 카페" },
    { minLevel: 5, key: "lv5", desc: "눈 내리는 겨울왕국 카페" },
    { minLevel: 6, key: "lv6", desc: "우주 은하수 카페" },
    { minLevel: 7, key: "lv7", desc: "미드나잇 테라스 카페(최고 레벨 — 8·9레벨도 이 배경 유지)" },
  ],

  // 레벨별 주문 규칙 — 해당 레벨 이상에서 적용되는 규칙 중 가장 높은 것을 쓴다.
  // counts: 주문 아이템 개수를 이 목록에서 고르게 뽑는다(예: [1,1,2] = 1개 2/3, 2개 1/3 확률).
  // tiers: 주문받을 음료 단계를 이 목록에서 고르게 뽑는다 — 낮은 단계를 여러 번 넣을수록 더 자주 나온다.
  // 레벨이 낮을수록 낮은 단계(쉬운 음료) 주문이 더 많이 나오도록 숫자를 여러 번 넣었다.
  ORDER_RULES: [
    { minLevel: 1, tiers: [2, 2, 2, 2, 3, 3, 4], counts: [1] },
    { minLevel: 3, tiers: [2, 3, 3, 3, 4, 4, 5], counts: [1, 1, 1, 2] },
    { minLevel: 5, tiers: [3, 3, 4, 4, 4, 5, 5, 6], counts: [1, 1, 2, 2] },
    { minLevel: 8, tiers: [3, 4, 4, 5, 5, 6, 6], counts: [1, 1, 2, 2, 3] },
  ],

  // 손님 — 처음엔 천천히 오다가 레벨이 오를수록 점점 자주 오게 한다(아이들이 너무 급하지 않게).
  // 해당 레벨 이상에서 적용되는 규칙 중 가장 높은 것을 쓴다(ORDER_RULES와 같은 방식).
  CUSTOMER_MAX: 3,
  CUSTOMER_SPAWN_RULES: [
    { minLevel: 1, firstDelay: 6,  respawnMin: 8, respawnMax: 12 },
    { minLevel: 3, firstDelay: 5,  respawnMin: 6, respawnMax: 10 },
    { minLevel: 5, firstDelay: 4,  respawnMin: 5, respawnMax: 8 },
    { minLevel: 8, firstDelay: 3,  respawnMin: 4, respawnMax: 6 },
  ],
  CUSTOMER_SPECIES: ["shiba", "creamshiba", "blackshiba"],
  PATIENCE_BASE: 75,           // 초
  PATIENCE_PER_EXTRA_ORDER: 15,
  FACE_ANGRY_RATIO: 0.4,       // 인내심이 이 비율 이하이면 angry 표정
  FACE_HAPPY_DURATION: 1.2,    // 서빙 완료 후 행복 표정 유지(초)

  // 바리스타 연출 시간(초)
  BARISTA_GREET_DURATION: 1.5,
  BARISTA_SERVE_DURATION: 1.0,

  // 시작 상태
  START_COINS: 0,
  START_LEVEL: 1,
  START_BOARD_ITEMS: { tier: 1, count: 4 }, // 생성기 외에 커피콩 4개로 시작
};

/* 화면 배치: 세로(phone/iPad 세로)와 가로(iPad landscape) 두 벌.
   아이패드 10세대를 세로로 들면 PORTRAIT, 가로로 들면 LANDSCAPE를 쓴다.
   칸 수(BOARD_ROWS/COLS)·생성기 위치는 위 CONFIG에서 공통으로 쓰고,
   무대 크기·보드 좌표·손님 자리처럼 화면에 그리는 좌표만 여기서 따로 둔다. */
CONFIG.LAYOUTS = {
  portrait: {
    STAGE_W: 1080,
    STAGE_H: 1920,
    BOARD_CELL: 136,
    BOARD_GAP: 6,
    BOARD_ORIGIN_X: 46,
    BOARD_ORIGIN_Y: 896,
    BOARD_PANEL_LEFT: 30,
    BOARD_PANEL_TOP: 880,
    BOARD_PANEL_RIGHT: 1050,
    BOARD_PANEL_BOTTOM: 1900,
    CUSTOMER_BODY_SIZE: 260,
    // 손님 자리: 가로 중심 x, 몸 그림 top y
    CUSTOMER_SLOTS: [{ x: 400, y: 351 }, { x: 640, y: 351 }, { x: 880, y: 351 }],
    CUSTOMER_HIT_HALF_WIDTH: 120,
    CUSTOMER_HIT_TOP: 180,
    CUSTOMER_HIT_BOTTOM: 611,
    CUSTOMER_BUBBLE_TOP: 235,
    CUSTOMER_BUBBLE_WIDTH: 300,
    CUSTOMER_SLIDE_OFFSET: 420, // 들어오고 나갈 때 미끄러지는 거리(px)
  },
  landscape: {
    STAGE_W: 1440,
    STAGE_H: 1000,
    BOARD_CELL: 100,
    BOARD_GAP: 8,
    BOARD_ORIGIN_X: 626,
    BOARD_ORIGIN_Y: 191,
    BOARD_PANEL_LEFT: 580,
    BOARD_PANEL_TOP: 170,
    BOARD_PANEL_RIGHT: 1420,
    BOARD_PANEL_BOTTOM: 960,
    CUSTOMER_BODY_SIZE: 150,
    CUSTOMER_SLOTS: [{ x: 95, y: 438 }, { x: 280, y: 438 }, { x: 465, y: 438 }],
    CUSTOMER_HIT_HALF_WIDTH: 90,
    CUSTOMER_HIT_TOP: 230,
    CUSTOMER_HIT_BOTTOM: 630,
    CUSTOMER_BUBBLE_TOP: 300,
    CUSTOMER_BUBBLE_WIDTH: 170,
    CUSTOMER_SLIDE_OFFSET: 380,
  },
};
