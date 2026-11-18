# 멍멍 카페 — 머지 × 카페 타이쿤 기획 & 애셋 가이드

2026-11-17 기준. 구현 범위와 수치는 `mvp-spec.md`가 우선한다.

## 컨셉과 핵심 루프

강아지 바리스타가 되어 손님 주문을 머지로 만들어 내는 카페 타이쿤입니다. 멍멍 마을(dog_village)의 강아지 캐릭터를 손님으로 재활용해 전작과 세계관을 잇습니다.

1. 손님 입장: 강아지 손님이 카운터에 서고 말풍선에 주문(아이템 아이콘 + 개수)이 뜹니다. 머리 위 인내심 게이지가 줄어듭니다.
2. 수학 문제로 에너지 얻기: 에너지는 수학 문제를 맞혀야만 얻습니다(정답 1문제 = 에너지 6). 전작처럼 학년을 고르고, 맞힐수록 난이도가 오릅니다.
3. 재료 뽑기: 보드의 생성기(커피머신, 과일 바구니, 오븐 등)를 탭하면 1단계 재료가 빈칸에 나옵니다. 탭마다 에너지 1 소모.
4. 머지: 같은 아이템 2개를 겹치면 다음 단계가 됩니다. 단계가 오를수록 컵·접시가 커지고 토핑·장식이 붙습니다.
5. 서빙: 완성품을 손님에게 드래그합니다. 코인 + 경험치(별)를 받고, 빨리 내면 팁이 붙습니다.
6. 성장: 코인으로 생성기 업그레이드(더 높은 단계 재료 확률)와 인테리어를 사고, 경험치로 카페 레벨이 오르며 새 레시피가 열립니다.

교육용 확장(다음 버전): 수학 문제에 카페 상황 문제를 섞습니다. 예를 들어 결제 순간에 "3,500원짜리 2잔, 10,000원 내면 거스름돈은?" 같은 계산 문제를 띄우면 전작의 수학 학습 요소를 자연스럽게 유지할 수 있습니다. 맞히면 팁 2배.

## 머지 체인

라인마다 8단계, 소재(1단계) → 반제품 → 기본 메뉴 → 화려한 시그니처 순으로 발전합니다. 단계마다 눈에 보이는 요소를 하나씩 더하는 것이 원칙입니다(컵 크기 → 크림 → 시럽 → 토핑 → 반짝임).

| 단계 | 커피 라인 (Lv1) | 과일음료 라인 (Lv3) | 쿠키 라인 (Lv5) | 케이크 라인 (Lv8) |
| --- | --- | --- | --- | --- |
| 1 | 커피콩 한 알 | 딸기 한 알 | 밀가루 봉투 | 달걀 |
| 2 | 원두 한 줌(작은 자루) | 과일 바구니 | 반죽 덩어리 | 반죽 볼(거품기) |
| 3 | 에스프레소(작은 잔) | 딸기우유 | 동그란 버터쿠키 | 스펀지 시트 |
| 4 | 아메리카노(머그) | 딸기 스무디 | 초코칩 쿠키 | 생크림 케이크 조각 |
| 5 | 카페라떼(라떼아트 하트) | 딸기 프라페(휘핑) | 강아지 발바닥 아이싱 쿠키 | 딸기 쇼트케이크(홀) |
| 6 | 바닐라 라떼(시럽 드리즐) | 무지개 과일 에이드(층층이) | 마카롱 3종 세트 | 2단 케이크 |
| 7 | 카라멜 마키아토(휘핑+카라멜) | 크림 구름 파필우스 드링크 | 마카롱 타워 | 3단 축하 케이크 |
| 8 ✨ | 시그니처 구름 크림 라떼(휘핑·쿠키·별사탕·강아지 귀 장식) | 유니콘 버블 소다(솜사탕·별) | 진저브레드 강아지 하우스 | 멍멍 마을 웨딩 케이크(강아지 피규어) |

생성기: 커피머신(커피 1단계), 과일 냉장고(과일 1단계), 밀가루 포대(쿠키 1단계), 닭장 바구니(케이크 1단계). 생성기도 Lv1→Lv3로 외형이 바뀝니다.

## 카페 레벨과 손님 주문

손님 주문은 해금된 레시피 안에서만 나오고, 레벨이 오를수록 단계·개수·조합이 커집니다. 새 레시피가 열리면 보드에 새 생성기가 놓이고, 첫 주문은 꼭 그 레시피 낮은 단계로 나와 자연스럽게 튜토리얼이 됩니다.

| 카페 레벨 | 해금 | 손님 주문 예시 | 카페 모습 |
| --- | --- | --- | --- |
| 1–2 | 커피 라인, 커피머신 | 커피 3–4단계 1개 | 작은 포장마차 카페 |
| 3–4 | 과일음료 라인 | 음료 2개, 최대 5단계 | 작은 매장 + 테이블 2개 |
| 5–7 | 쿠키 라인, 밀가루 포대 | 음료 + 쿠키 세트 | 베이커리 진열장 추가 |
| 8–9 | 케이크 라인, 닭장 바구니 | 케이크 단독 또는 3개 세트 | 2층 테라스 카페 |
| 10+ | VIP · 단체 손님, 8단계 시그니처 | 시그니처 1개(팁 3배) 또는 4개 묶음 | 시그니처 카페(간판·조명) |

손님 종류: 일반 손님(강아지 6종), 급한 손님(인내심 짧고 팁 큼), VIP(왕관·선글라스, 시그니처만 주문). 손님은 표정 3개(기본·조급함·행복)로 인내심 상태를 보여줍니다.

## 아트 스타일과 파일 규격

스타일은 파스텔 카와이 + 두꺼운 둥근 외곽선 + 단순 셀 쉐이딩으로 통일합니다. 머지 게임은 작은 칸에서 단계를 구분해야 하므로 실루엣과 색이 한눈에 달라야 합니다.

- 시점: 아이템은 모두 살짝 위에서 내려다본 3/4 시점, 가운데 정렬, 같은 왼쪽 위 조명.
- 라인별 대표색: 커피 = 갈색·크림, 과일 = 핑크·민트, 쿠키 = 노랑·주황, 케이크 = 흰색·딸기빨강.
- 단계 구분: 1–2단계는 칸의 60% 크기, 3–5단계 75%, 6–8단계 90%. 8단계는 반짝이 이펙트를 코드로 덧입힙니다(그림에 넣지 않음).
- 글자 없음: 아이템·생성기 그림에는 텍스트를 넣지 않습니다. 글자는 게임에서 온글잎 박다현체로 넣습니다.

| 종류 | 크기(px) | 형식 | 파일명 예 |
| --- | --- | --- | --- |
| 머지 아이템 | 512×512 | PNG 투명 | item_coffee_04.png |
| 생성기 | 512×512 | PNG 투명 | gen_coffee_lv1.png |
| 손님 강아지 | 768×768 | PNG 투명 | cust_shiba_happy.png |
| 바리스타(플레이어) | 768×768 | PNG 투명 | barista_idle.png |
| 카페 배경 | 1080×1920(세로) | PNG/JPG | bg_cafe_lv1.png |
| UI 아이콘 | 256×256 | PNG 투명 | ui_coin.png |

Firefly는 투명 배경을 바로 못 만드니 흰 배경으로 뽑고 Adobe Express의 배경 제거로 투명 PNG를 만듭니다. 스타일을 맞추려면 처음 마음에 드는 결과 1장을 스타일 참조(Style reference) 이미지로 고정하고 나머지를 뽑으세요.

## 애셋 목록과 Firefly 프롬프트

첫 플레이 가능한 버전(MVP)에는 애셋 26개면 충분합니다. 커피 라인만으로 루프를 먼저 완성하고, 나머지 라인은 같은 프롬프트 틀에 재료만 바꿔 추가합니다.

| 우선 | 묶음 | 개수 | 내용 |
| --- | --- | --- | --- |
| 1 (MVP) | 커피 아이템 | 8 | 머지 체인 표의 커피 1–8단계 |
| 1 (MVP) | 커피머신 생성기 | 1 | Lv1 외형 |
| 1 (MVP) | 손님 | 9 | 시바·푸들·웰시코기 × 표정 3 |
| 1 (MVP) | 바리스타 | 1 | 앞치마 입은 강아지 |
| 1 (MVP) | 배경·UI | 7 | 카페 Lv1 배경, 보드 타일, 말풍선, 코인, 별, 에너지, 버튼 |
| 2 | 과일음료 | 9 | 아이템 8 + 과일 냉장고 |
| 3 | 쿠키 | 9 | 아이템 8 + 밀가루 포대 |
| 4 | 케이크 | 9 | 아이템 8 + 닭장 바구니 |
| 5 | 확장 | 약 20 | 손님 3종 추가, VIP, 카페 Lv2–Lv4 배경, 레벨업·해금 카드 |

### 공통 스타일 문구

모든 아이템 프롬프트 끝에 이 문구를 그대로 붙입니다.

```text
cute kawaii mobile game item icon, soft pastel colors, thick rounded dark-brown outline, simple cel shading, glossy highlight, 3/4 top-down view, single object centered, isolated on plain white background, no text, no shadow on background
```

### 커피 라인 프롬프트 (앞부분)

1. item_coffee_01: `a single shiny roasted coffee bean with a tiny smile,`
2. item_coffee_02: `a small burlap sack overflowing with coffee beans,`
3. item_coffee_03: `a tiny white espresso cup with dark espresso and golden crema,`
4. item_coffee_04: `a round cream-colored mug of black americano with gentle steam,`
5. item_coffee_05: `a wide cafe latte cup with heart latte art on milk foam,`
6. item_coffee_06: `a tall glass of vanilla latte with layered milk and vanilla syrup drizzle, vanilla flower on saucer,`
7. item_coffee_07: `a tall glass caramel macchiato topped with whipped cream and caramel drizzle, straw,`
8. item_coffee_08: `a fancy signature latte in a big glass with a fluffy cloud of whipped cream, puppy-ear cookies on top, star sprinkles, caramel drips, cute paw-print sleeve,`

### 그 밖의 프롬프트 틀

- 생성기: `a cute small pastel espresso machine with round buttons and a paw-print logo,` + 공통 문구
- 손님: `cute chibi shiba inu dog customer, upper body, facing slightly left, [happy smiling with sparkles | neutral waiting | impatient puffed cheeks with sweat drop], kawaii game character, soft pastel, thick rounded outline, plain white background, no text`
- 바리스타: `cute chibi dog barista wearing a brown apron and small cafe cap, holding a coffee cup, standing, kawaii game character, ...`
- 배경: `cozy tiny cafe interior seen from the front, wooden counter at the bottom third, pastel walls, plants and menu board without letters, warm light, kawaii mobile game background, vertical 9:16, no characters, no text`
- 다른 라인: 커피 프롬프트의 구조(그릇 + 내용물 + 장식)를 그대로 두고 머지 체인 표의 재료만 바꿉니다.

## 작업 순서

스타일을 가장 먼저 확정하는 것이 핵심입니다. 기준 이미지 한 장이 정해지면 나머지 25개는 빠르게 나옵니다.

- [ ] item_coffee_05(카페라떼)를 4–8장 뽑아 마음에 드는 1장을 스타일 기준으로 고르기
- [ ] 기준 이미지를 Style reference로 넣고 커피 1–8단계 뽑기
- [ ] 8개를 한 줄로 놓고 단계가 한눈에 구분되는지 확인(크기·장식이 계단처럼 늘어나는지)
- [ ] 커피머신·바리스타·손님 3종 × 표정 3
- [ ] 카페 Lv1 배경과 UI 6종
- [ ] Adobe Express로 배경 제거 → 규격 크기·파일명으로 저장 → dog_village 저장소 assets/ 폴더에 업로드
- [ ] MVP 코드(커피 라인만)로 플레이 테스트 후 과일·쿠키·케이크 애셋 제작

열린 질문: 카페 이름(가칭 '멍멍 카페'), 거스름돈 계산 문제를 넣을지, 화면 방향(세로 고정 가정).
