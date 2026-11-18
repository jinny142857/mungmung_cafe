/* 멍멍 카페 — 수학 문제 생성, 난이도 조절, 채점, 문제 창
   전작 「멍멍 수학 마을」(reference/dog_village_game.html)의 수학 코드를 그대로 옮긴 부분이다.
   문제 내용과 힌트 문구는 바꾸지 않았다. 바뀐 것은 보상(간식 → 에너지)과 문제 창 UI뿐이다. */

/* ---------- 학년별 문제 (1,2,4,5,6학년) ---------- */
function makeProblem(grade, tier) {
  let a, b, c, q, ans, hint;
  switch (grade) {
   case 1:
    if (tier === 0) { a = ri(1, 9); b = ri(1, 10 - a); if (Math.random() < .5) { q = `${a} + ${b}`; ans = a + b; hint = "손가락으로 하나씩 세어 봐요."; } else { const s = a + b; q = `${s} - ${b}`; ans = a; hint = `${s}에서 ${b}만큼 거꾸로 세어 봐요.`; } }
    else if (tier === 1) { a = ri(5, 9); b = ri(10 - a, 9); if (Math.random() < .5) { q = `${a} + ${b}`; ans = a + b; hint = `${a}에 ${j(String(10 - a), "을", "를")} 더하면 10이 돼요. 남은 수를 더해요.`; } else { const s = a + b; q = `${s} - ${a}`; ans = b; hint = "10을 만들어서 빼 보세요."; } }
    else { a = ri(11, 40); b = ri(1, 9); if (Math.random() < .5) { q = `${a} + ${b}`; ans = a + b; hint = "일의 자리끼리 먼저 더해요."; } else { q = `${a} - ${b}`; ans = a - b; hint = "일의 자리끼리 먼저 빼요."; } }
    break;
   case 2:
    if (tier === 0) { a = ri(1, 4) * 10 + ri(0, 4); b = ri(1, 4) * 10 + ri(0, 4); q = `${a} + ${b}`; ans = a + b; hint = "십의 자리끼리, 일의 자리끼리 더해요."; }
    else if (tier === 1) { a = ri(25, 89); b = ri(13, a - 5); if (Math.random() < .5) { a = ri(15, 69); b = ri(15, 29); q = `${a} + ${b}`; ans = a + b; hint = "일의 자리 합이 10을 넘으면 받아올림해요."; } else { q = `${a} - ${b}`; ans = a - b; hint = "일의 자리를 뺄 수 없으면 십의 자리에서 10을 빌려와요."; } }
    else { a = ri(2, 9); b = ri(2, 9); q = `${a} × ${b}`; ans = a * b; hint = `${a}단을 차례로 외워 봐요.`; }
    break;
   case 3:
    if (tier === 0) { a = ri(120, 599); b = ri(110, 399); if (Math.random() < .5) { q = `${a} + ${b}`; ans = a + b; hint = "일의 자리부터 차례로 더해요."; } else { a = a + b; q = `${a} - ${b}`; ans = a - b; hint = "일의 자리부터 차례로 빼요."; } }
    else if (tier === 1) { a = ri(12, 49); b = ri(2, 9); q = `${a} × ${b}`; ans = a * b; hint = `${j(String(a), "을", "를")} 십의 자리와 일의 자리로 나누어 각각 ${b}를 곱해요.`; }
    else { b = ri(2, 9); ans = ri(3, 12); a = b * ans; q = `${a} ÷ ${b}`; hint = `${b}단에서 곱이 ${j(String(a), "이", "가")} 되는 수를 찾아요.`; }
    break;
   case 4:
    if (tier === 0) { a = ri(12, 39); b = ri(11, 29); q = `${a} × ${b}`; ans = a * b; hint = `${a} × ${b % 10}과 ${a} × ${b - b % 10}을 따로 구해 더해요.`; }
    else if (tier === 1) { b = ri(3, 9); ans = ri(12, 99); a = b * ans; q = `${a} ÷ ${b}`; hint = "높은 자리부터 차례로 나누어요."; }
    else { a = ri(105, 399); b = ri(12, 35); q = `${a} × ${b}`; ans = a * b; hint = "곱하는 수를 십의 자리와 일의 자리로 나누어 계산해요."; }
    break;
   case 5:
    if (tier === 0) { a = ri(10, 40); b = ri(2, 9); c = ri(2, 9); if (Math.random() < .5) { q = `${a} + ${b} × ${c}`; ans = a + b * c; } else { a = Math.max(a, b * c + 1); q = `${a} - ${b} × ${c}`; ans = a - b * c; } hint = "곱셈을 덧셈·뺄셈보다 먼저 계산해요."; }
    else if (tier === 1) { const g = ri(2, 9); a = g * ri(2, 7); b = g * ri(2, 7); while (a === b) b = g * ri(2, 7); q = `${j(String(a), "과", "와")} ${b}의 최대공약수는?`; ans = gcd(a, b); hint = "두 수를 모두 나누어떨어지게 하는 가장 큰 수예요."; }
    else { a = ri(2, 12); b = ri(2, 12); while (a === b) b = ri(2, 12); q = `${j(String(a), "과", "와")} ${b}의 최소공배수는?`; ans = a * b / gcd(a, b); hint = `${Math.max(a, b)}의 배수를 차례로 써 보세요.`; }
    break;
   default:
    if (tier === 0) { a = ri(11, 59) / 10; b = ri(101, 399) / 100; if (Math.random() < .5) { q = `${a} + ${b}`; ans = Math.round((a + b) * 100) / 100; } else { const s = Math.round((a + b) * 100) / 100; q = `${s} - ${b}`; ans = a; } hint = "소수점 자리를 맞추어 계산해요."; }
    else if (tier === 1) { const base = pick([100, 200, 300, 400, 500, 600, 800]); const p = pick([10, 20, 25, 50, 75]); q = `${base}의 ${p}%는?`; ans = base * p / 100; hint = `${p}%는 ${p}/100이에요. ${base} × ${p} ÷ 100`; }
    else { a = ri(2, 7); b = ri(2, 9); while (gcd(a, b) !== 1) b = ri(2, 9); const k = ri(2, 8); q = `${a} : ${b} = ${a * k} : □`; ans = b * k; hint = `앞의 수가 ${k}배가 되었으니 뒤의 수도 ${k}배 해요.`; }
  }
  return { q: q + (/[□?]/.test(q) ? "" : " = ?"), a: ans, hint };
}

/* 3학년 단원·차시 데이터(STD3/UNITS3/TOPIC3/ALL3)는 js/curriculum.js에 있다(교사 페이지와 공유). */
function ro(w) { return w + (/[178]$/.test(w) || !hasB(w) ? "로" : "으로"); }
/* 분수 html 도우미 */
function frH(n, d) { return `<span class="frac"><span>${n}</span><span>${d}</span></span>`; }
function mixH(w, n, d) { return `<span class="mixed">${w}${frH(n, d)}</span>`; }
const NAMES = ["하늘", "바다", "도담", "나래", "보람", "새롬", "한결", "가온"];
const ITEMS = [["간식", "개"], ["쿠키", "개"], ["공", "개"], ["사탕", "개"], ["색종이", "장"], ["구슬", "개"]];
const VILL = ["햇살", "달빛", "별빛", "구름"];

/* svg 그림 */
function svgBar(n, k) {
  const w = Math.min(420, n * 52), cw = w / n;
  let r = ""; for (let i = 0; i < n; i++) r += `<rect x="${4 + i * cw}" y="4" width="${cw}" height="56" fill="${i < k ? "#f3c95c" : "#fffdf6"}" stroke="#6b5a2a" stroke-width="2"/>`;
  return `<svg viewBox="0 0 ${w + 8} 64" width="${w + 8}" height="64">${r}</svg>`;
}
function svgLine(kind) {
  const L = 60, R = 360, y = 40; let s = `<svg viewBox="0 0 420 70" width="420" height="70"><line x1="${kind === "seg" || kind === "ray" ? L : 20}" y1="${y}" x2="${kind === "seg" ? R : 400}" y2="${y}" stroke="#3b4a35" stroke-width="4"/>`;
  const arrow = (x, dir) => `<path d="M${x} ${y} l${-14 * dir} -9 l0 18 z" fill="#3b4a35"/>`;
  if (kind === "line") s += arrow(20, -1) + arrow(400, 1); if (kind === "ray") s += arrow(400, 1);
  s += `<circle cx="${L}" cy="${y}" r="6" fill="#e0607e"/><circle cx="${R}" cy="${y}" r="6" fill="#e0607e"/><text x="${L}" y="${y + 28}" font-size="18" text-anchor="middle" fill="#3b4a35">ㄱ</text><text x="${R}" y="${y + 28}" font-size="18" text-anchor="middle" fill="#3b4a35">ㄴ</text></svg>`;
  return s;
}
function svgCircle(label) { return `<svg viewBox="0 0 220 150" width="220" height="150"><circle cx="110" cy="75" r="62" fill="#fffdf6" stroke="#3b4a35" stroke-width="3"/><circle cx="110" cy="75" r="4" fill="#3b4a35"/><line x1="110" y1="75" x2="172" y2="75" stroke="#e0607e" stroke-width="3"/><text x="141" y="66" font-size="15" text-anchor="middle" fill="#e0607e">${label}</text></svg>`; }
function svgCircles(n) {
  const r = Math.min(34, 180 / n), w = n * 2 * r + 40; let s = `<svg viewBox="0 0 ${w} ${2 * r + 40}" width="${w}" height="${2 * r + 40}">`;
  for (let i = 0; i < n; i++) s += `<circle cx="${20 + r + i * 2 * r}" cy="${r + 14}" r="${r}" fill="none" stroke="#3b4a35" stroke-width="2.5"/>`;
  s += `<line x1="20" y1="${r + 14}" x2="${20 + n * 2 * r}" y2="${r + 14}" stroke="#e0607e" stroke-width="3"/><text x="16" y="${2 * r + 34}" font-size="15" fill="#3b4a35">ㄱ</text><text x="${14 + n * 2 * r}" y="${2 * r + 34}" font-size="15" fill="#3b4a35">ㄴ</text></svg>`; return s;
}
function svgPicGraph(vals) {
  const rows = vals.length, h = rows * 44 + 60; let s = `<svg viewBox="0 0 440 ${h}" width="440" height="${h}" font-family="OngleipParkDahyeon, sans-serif">`;
  s += `<rect x="1" y="1" width="438" height="${rows * 44 + 2}" fill="#fffdf6" stroke="#6b5a2a"/><line x1="90" y1="1" x2="90" y2="${rows * 44 + 3}" stroke="#6b5a2a"/>`;
  vals.forEach((v, i) => {
    const y = i * 44 + 30; s += `<text x="45" y="${y}" font-size="15" text-anchor="middle" fill="#3b4a35">${VILL[i]}</text>`;
    let x = 104; for (let k = 0; k < Math.floor(v / 10); k++) { s += `<circle cx="${x + 12}" cy="${y - 6}" r="13" fill="#c98b4a" stroke="#6b4426" stroke-width="2"/>`; x += 30; }
    for (let k = 0; k < v % 10; k++) { s += `<circle cx="${x + 6}" cy="${y - 3}" r="7" fill="#e8b878" stroke="#6b4426" stroke-width="1.5"/>`; x += 18; }
    if (i < rows - 1) s += `<line x1="1" y1="${i * 44 + 46}" x2="439" y2="${i * 44 + 46}" stroke="#e6dcc0"/>`;
  });
  s += `<circle cx="20" cy="${rows * 44 + 28}" r="11" fill="#c98b4a" stroke="#6b4426" stroke-width="2"/><text x="38" y="${rows * 44 + 33}" font-size="14" fill="#3b4a35">10마리</text><circle cx="120" cy="${rows * 44 + 28}" r="6" fill="#e8b878" stroke="#6b4426" stroke-width="1.5"/><text x="132" y="${rows * 44 + 33}" font-size="14" fill="#3b4a35">1마리</text></svg>`;
  return s;
}

function num(html, a, hint, o = {}) { return Object.assign({ type: "num", html, a, hint, show: String(a) }, o); }
function multi(html, fields, hint, o = {}) { return Object.assign({ type: "multi", html, fields, hint, show: fields.map(f => (f.pre || "") + f.a + f.lab).join(" ") }, o); }
function fracQ(html, ans, hint, o = {}) { const show = ans.w ? mixH(ans.w, ans.n, ans.d) : frH(ans.n, ans.d); return Object.assign({ type: "frac", html, ans, whole: !!ans.w, hint, show }, o); }
function mc(html, choices, ans, hint, o = {}) { return Object.assign({ type: "mc", html, choices, ans, hint, show: choices[ans] }, o); }
function cmpAns(a, b) { return a > b ? 0 : a === b ? 1 : 2; }

const GEN3 = {
 a1() { const a = ri(100, 899), b = ri(100, 999 - a); return num(`${a} + ${b} = ?`, a + b, "일의 자리부터 차례로 더하고, 10이 넘으면 윗자리로 받아올려요."); },
 a2() { const a = ri(300, 999), b = ri(100, a - 60); return num(`${a} − ${b} = ?`, a - b, "일의 자리부터 빼요. 뺄 수 없으면 윗자리에서 10을 받아내려요."); },
 a3() {
   const v = ri(0, 2), nm = pick(NAMES), [it, un] = pick(ITEMS);
   if (v === 0) { const a = ri(120, 560), b = ri(110, 380); return num(`<div class="story">${nm}네 강아지 마을에 ${j(it, "이", "가")} ${a}${un} 있어요. ${b}${j(un, "을", "를")} 더 가져왔어요. ${j(it, "은", "는")} 모두 몇 ${un}일까요?</div>`, a + b, "'모두'는 더하기예요.", { unit: un }); }
   if (v === 1) { const a = ri(400, 950), b = ri(120, a - 50); return num(`<div class="story">${it} ${a}${un} 중에서 ${b}${j(un, "을", "를")} 친구들에게 나누어 주었어요. 남은 ${j(it, "은", "는")} 몇 ${un}일까요?</div>`, a - b, "'남은'은 빼기예요.", { unit: un }); }
   const x = ri(120, 600), b = ri(110, 390), s = x + b; return num(`□ + ${b} = ${s}`, x, `□ = ${s} − ${b} 로 구할 수 있어요.`);
 },
 g1() { const k = ri(0, 2), kinds = ["seg", "line", "ray"]; return mc(`그림과 같은 곧은 선의 이름은?<div class="fig">${svgLine(kinds[k])}</div>`, ["선분", "직선", "반직선"], k, "양쪽이 끝나면 선분, 양쪽으로 끝없이 늘이면 직선, 한쪽으로만 끝없이 늘이면 반직선이에요."); },
 g2() {
   const qs = [["삼각형에는 각이 몇 개 있을까요?", 3], ["사각형에는 각이 몇 개 있을까요?", 4], ["직사각형에는 직각이 몇 개 있을까요?", 4], ["정사각형에는 직각이 몇 개 있을까요?", 4], ["직각삼각형에는 직각이 몇 개 있을까요?", 1], ["오각형에는 꼭짓점이 몇 개 있을까요?", 5], ["육각형에는 각이 몇 개 있을까요?", 6]];
   const [q, a] = pick(qs); return num(q, a, "꼭짓점의 수만큼 각이 있어요. 직각은 종이를 반듯하게 두 번 접은 모양의 각이에요.");
 },
 g3() {
   const qs = [["네 각이 모두 직각인 사각형을 무엇이라고 할까요?", ["직사각형", "직각삼각형", "원"], 0],
   ["네 각이 모두 직각이고 네 변의 길이가 모두 같은 사각형은?", ["정사각형", "직사각형", "직각삼각형"], 0],
   ["한 각이 직각인 삼각형을 무엇이라고 할까요?", ["직각삼각형", "정사각형", "직사각형"], 0],
   ["정사각형은 직사각형이라고 할 수 있을까요?", ["예", "아니요"], 0],
   ["직사각형은 항상 정사각형이라고 할 수 있을까요?", ["예", "아니요"], 1]];
   const [q, c, a] = pick(qs); return mc(q, c, a, "직사각형은 네 각이 모두 직각, 정사각형은 거기에 네 변의 길이까지 모두 같아요.");
 },
 d1() { const b = ri(2, 9), q = ri(2, 9); return num(`${b * q} ÷ ${b} = ?`, q, `${b}단 곱셈구구에서 곱이 ${b * q}인 것을 찾아요.`); },
 d2() {
   const b = ri(2, 9), q = ri(2, 9), a = b * q, v = ri(0, 1);
   if (v === 0) return num(`□ × ${b} = ${a}`, q, `□ = ${a} ÷ ${b} 예요.`);
   return num(`${a} ÷ ${b} = ${q} 이면 ${b} × ${q} = □`, a, "나눗셈식은 곱셈식으로 바꿀 수 있어요.");
 },
 d3() {
   const b = ri(2, 9), q = ri(2, 9), a = b * q, [it, un] = pick(ITEMS), v = ri(0, 1);
   if (v === 0) return num(`<div class="story">${it} ${a}${j(un, "을", "를")} 강아지 ${b}마리에게 똑같이 나누어 주면, 한 마리에게 몇 ${un}씩 줄 수 있을까요?</div>`, q, `${a} ÷ ${b} 를 계산해요.`, { unit: un });
   return num(`<div class="story">${it} ${a}${j(un, "을", "를")} 한 봉지에 ${b}${un}씩 담으면 몇 봉지가 될까요?</div>`, q, `${a} ÷ ${b} 를 계산해요.`, { unit: "봉지" });
 },
 m1() { const a = ri(1, 9) * 10, b = ri(2, 9); return num(`${a} × ${b} = ?`, a * b, `${a / 10} × ${b} 를 계산하고 0을 하나 붙여요.`); },
 m2() { const a = ri(12, 98), b = ri(2, 9); return num(`${a} × ${b} = ?`, a * b, `${j(String(a), "을", "를")} ${j(String(a - a % 10), "과", "와")} ${ro(String(a % 10))} 나누어 각각 ${b}를 곱한 뒤 더해요.`); },
 l1() {
   const v = ri(0, 1);
   if (v === 0) { const c = ri(1, 29), m = ri(1, 9); return num(`${c} cm ${m} mm = □ mm`, c * 10 + m, "1 cm = 10 mm 예요.", { unit: "mm" }); }
   const x = ri(11, 299); if (x % 10 === 0) return GEN3.l1(); return multi(`${x} mm = □ cm □ mm`, [{ lab: "cm", a: Math.floor(x / 10) }, { lab: "mm", a: x % 10 }], "10 mm 가 1 cm 예요.");
 },
 l2() {
   const v = ri(0, 1);
   if (v === 0) { const k = ri(1, 9), m = ri(1, 999); return num(`${k} km ${m} m = □ m`, k * 1000 + m, "1 km = 1000 m 예요.", { unit: "m" }); }
   const x = ri(1001, 9999); if (x % 1000 === 0) return GEN3.l2(); return multi(`${x} m = □ km □ m`, [{ lab: "km", a: Math.floor(x / 1000) }, { lab: "m", a: x % 1000 }], "1000 m 가 1 km 예요.");
 },
 l3() {
   const v = ri(0, 1);
   if (v === 0) { const m = ri(1, 9), s = ri(1, 59); return num(`${m}분 ${s}초 = □초`, m * 60 + s, "1분 = 60초 예요.", { unit: "초" }); }
   const x = ri(61, 599); if (x % 60 === 0) return GEN3.l3(); return multi(`${x}초 = □분 □초`, [{ lab: "분", a: Math.floor(x / 60) }, { lab: "초", a: x % 60 }], "60초가 1분이에요.");
 },
 l4() {
   const toS = (h, m, s) => h * 3600 + m * 60 + s, v = ri(0, 1);
   let A = [ri(1, 5), ri(5, 55), ri(5, 55)], B = [ri(1, 3), ri(5, 55), ri(5, 55)], ta = toS(...A), tb = toS(...B);
   if (v === 1 && ta <= tb) { [A, B] = [B, A]; [ta, tb] = [tb, ta]; } if (v === 1 && ta === tb) return GEN3.l4();
   const r = v === 0 ? ta + tb : ta - tb, f = [{ lab: "시간", a: Math.floor(r / 3600) }, { lab: "분", a: Math.floor(r % 3600 / 60) }, { lab: "초", a: r % 60 }];
   const fmtT = t => `${t[0]}시간 ${t[1]}분 ${t[2]}초`;
   return multi(`${fmtT(A)} ${v === 0 ? "+" : "−"} ${fmtT(B)}<br>= □시간 □분 □초`, f, v === 0 ? "초끼리, 분끼리, 시간끼리 더하고 60이 넘으면 받아올려요." : "초끼리, 분끼리, 시간끼리 빼고 모자라면 60을 받아내려요.");
 },
 f1() { const n = ri(3, 8), k = ri(1, n - 1); return fracQ(`색칠한 부분은 전체의 얼마일까요? 분수로 나타내세요.<div class="fig">${svgBar(n, k)}</div>`, { n: k, d: n }, `전체를 똑같이 ${n}으로 나눈 것 중 ${k}이에요.`); },
 f2() {
   let A, B, hint;
   if (ri(0, 1) === 0) { const d = ri(4, 12), a = ri(1, d - 1); let b = ri(1, d - 1); if (Math.random() < .15) b = a; A = [a, d]; B = [b, d]; hint = "분모가 같으면 분자가 클수록 큰 분수예요."; }
   else { const x = ri(2, 12); let y = ri(2, 12); if (Math.random() < .12) y = x; A = [1, x]; B = [1, y]; hint = "단위분수는 분모가 작을수록 큰 분수예요."; }
   return mc(`크기를 비교하세요.<div class="cmp">${frH(...A)}<span class="box">○</span>${frH(...B)}</div>`, [">", "=", "<"], cmpAns(A[0] / A[1], B[0] / B[1]), hint, { mcBig: true });
 },
 f3() {
   const v = ri(0, 2), k = ri(1, 99);
   if (v === 0) { const t = ri(1, 9); return num(`0.1이 ${t}개인 수는?`, t / 10, "0.1이 10개면 1이에요.", { dec: true }); }
   if (v === 1) { const t = ri(1, 9); return num(`${frH(t, 10)} 를 소수로 나타내면?`, t / 10, "분모가 10인 분수는 소수 한 자리 수로 나타낼 수 있어요.", { dec: true }); }
   if (k % 10 === 0) return GEN3.f3(); return num(`${(k / 10).toFixed(1)} 은 0.1이 몇 개인 수일까요?`, k, "소수점을 없앤 수만큼 0.1이 있어요.");
 },
 m3() { const a = ri(102, 899), b = ri(2, 9); return num(`${a} × ${b} = ?`, a * b, "일의 자리, 십의 자리, 백의 자리 순서로 곱하고 받아올림을 더해요."); },
 m4() {
   if (ri(0, 3) === 0) { const a = ri(2, 9) * 10, b = ri(2, 9) * 10; return num(`${a} × ${b} = ?`, a * b, `${a / 10} × ${b / 10} 을 하고 0을 두 개 붙여요.`); }
   const a = ri(12, 98), b = ri(12, 98); return num(`${a} × ${b} = ?`, a * b, `${a} × ${b % 10} 과 ${a} × ${b - b % 10} 을 따로 구해 더해요.`);
 },
 d4() { const b = ri(2, 9), q = ri(10, Math.floor(99 / b)); if (q < 10) return GEN3.d4(); return num(`${b * q} ÷ ${b} = ?`, q, "십의 자리부터 나누어요."); },
 d5() {
   const b = ri(3, 9), q = ri(4, ri(0, 2) === 0 ? 110 : 30), r = ri(1, b - 1), a = b * q + r; if (a > 999) return GEN3.d5();
   return multi(`${a} ÷ ${b} = □ ⋯ □`, [{ lab: "", a: q, pre: "몫 " }, { lab: "", a: r, pre: "나머지 " }], `나머지는 나누는 수 ${b}보다 작아야 해요.`, { labels: ["몫", "나머지"] });
 },
 d6() { const b = ri(2, 9), q = ri(Math.ceil(100 / b), Math.floor(999 / b)); return num(`${b * q} ÷ ${b} = ?`, q, "백의 자리부터 차례로 나누어요."); },
 c1() {
   if (ri(0, 1) === 0) { const r = ri(2, 15); return num(`반지름이 ${r} cm인 원의 지름은 몇 cm일까요?<div class="fig">${svgCircle(r + " cm")}</div>`, r * 2, "지름은 반지름의 2배예요.", { unit: "cm" }); }
   const d = ri(2, 15) * 2; return num(`지름이 ${d} cm인 원의 반지름은 몇 cm일까요?`, d / 2, "반지름은 지름의 반이에요.", { unit: "cm" });
 },
 c2() { const r = ri(2, 8), n = ri(2, 5); return num(`반지름이 ${r} cm인 원 ${n}개를 겹치지 않게 이어 그렸어요. 선분 ㄱㄴ의 길이는 몇 cm일까요?<div class="fig">${svgCircles(n)}</div>`, 2 * r * n, `원 하나의 지름은 ${2 * r} cm 예요. 지름이 ${n}개 있어요.`, { unit: "cm" }); },
 f4() {
   const d = ri(3, 9), v = ri(0, 2); let h;
   if (v === 0) h = frH(ri(1, d - 1), d); else if (v === 1) h = frH(ri(d, d * 3), d); else h = mixH(ri(1, 5), ri(1, d - 1), d);
   return mc(`다음 분수는 어떤 분수일까요?<div class="cmp">${h}</div>`, ["진분수", "가분수", "대분수"], v, "분자가 분모보다 작으면 진분수, 같거나 크면 가분수, 자연수와 진분수로 된 것은 대분수예요.");
 },
 f5() { const d = ri(2, 9), w = ri(1, 6), n = ri(1, d - 1); return fracQ(`${mixH(w, n, d)} → 가분수`, { n: w * d + n, d }, `${w} = ${frH(w * d, d)} 이에요. 분자끼리 더해요.`); },
 f6() { const d = ri(2, 9); let N = ri(d + 1, d * 9); if (N % d === 0) N++; return fracQ(`${frH(N, d)} → 대분수`, { w: Math.floor(N / d), n: N % d, d }, `${N} ÷ ${d} 의 몫이 자연수, 나머지가 분자가 돼요.`); },
 f7() {
   const d = pick([2, 3, 4, 5, 6, 8]), k = ri(1, d - 1), m = ri(2, 6), T = d * m, [it, un] = pick(ITEMS);
   return num(`<div class="story">${it} ${T}${un}의 ${frH(k, d)} 은 몇 ${un}일까요?</div>`, m * k, `${T}${j(un, "을", "를")} 똑같이 ${d}묶음으로 나누면 한 묶음은 ${m}${un}예요.`, { unit: un });
 },
 f8() {
   const d = ri(3, 9), w = ri(1, 4), n = ri(1, d - 1); let N = w * d + n + pick([-2, -1, 0, 1, 2]); if (N <= d) N = d + 1;
   const A = mixH(w, n, d), B = frH(N, d), flip = ri(0, 1) === 1, va = (w * d + n) / d, vb = N / d;
   return mc(`크기를 비교하세요.<div class="cmp">${flip ? B : A}<span class="box">○</span>${flip ? A : B}</div>`, [">", "=", "<"], flip ? cmpAns(vb, va) : cmpAns(va, vb), "대분수를 가분수로 바꾸어 분자끼리 비교해요.", { mcBig: true });
 },
 u1() {
   if (ri(0, 1) === 0) { const l = ri(1, 9), m = ri(1, 999); return num(`${l} L ${m} mL = □ mL`, l * 1000 + m, "1 L = 1000 mL 예요.", { unit: "mL" }); }
   const x = ri(1001, 9999); if (x % 1000 === 0) return GEN3.u1(); return multi(`${x} mL = □ L □ mL`, [{ lab: "L", a: Math.floor(x / 1000) }, { lab: "mL", a: x % 1000 }], "1000 mL 가 1 L 예요.");
 },
 u2() {
   const v = ri(0, 1); let a = ri(1500, 6900), b = ri(1200, 3900); if (v === 1 && a <= b) [a, b] = [b + ri(300, 2000), a]; const r = v === 0 ? a + b : a - b;
   const f = x => `${Math.floor(x / 1000)} L ${x % 1000} mL`;
   return multi(`${f(a)} ${v === 0 ? "+" : "−"} ${f(b)} = □ L □ mL`, [{ lab: "L", a: Math.floor(r / 1000) }, { lab: "mL", a: r % 1000 }], v === 0 ? "mL끼리 더해서 1000이 넘으면 1 L로 받아올려요." : "mL끼리 뺄 수 없으면 1 L를 1000 mL로 받아내려요.");
 },
 u3() {
   const v = ri(0, 2);
   if (v === 0) { const k = ri(1, 9), g = ri(1, 999); return num(`${k} kg ${g} g = □ g`, k * 1000 + g, "1 kg = 1000 g 이에요.", { unit: "g" }); }
   if (v === 1) { const x = ri(1001, 9999); if (x % 1000 === 0) return GEN3.u3(); return multi(`${x} g = □ kg □ g`, [{ lab: "kg", a: Math.floor(x / 1000) }, { lab: "g", a: x % 1000 }], "1000 g 이 1 kg 이에요."); }
   const t = ri(1, 9); return num(`${t} t = □ kg`, t * 1000, "1 t = 1000 kg 이에요.", { unit: "kg" });
 },
 u4() {
   const v = ri(0, 1); let a = ri(1500, 7900), b = ri(1200, 3900); if (v === 1 && a <= b) [a, b] = [b + ri(300, 2000), a]; const r = v === 0 ? a + b : a - b;
   const f = x => `${Math.floor(x / 1000)} kg ${x % 1000} g`;
   return multi(`${f(a)} ${v === 0 ? "+" : "−"} ${f(b)} = □ kg □ g`, [{ lab: "kg", a: Math.floor(r / 1000) }, { lab: "g", a: r % 1000 }], v === 0 ? "g끼리 더해서 1000이 넘으면 1 kg으로 받아올려요." : "g끼리 뺄 수 없으면 1 kg을 1000 g으로 받아내려요.");
 },
 p1() {
   const vals = VILL.map(() => ri(12, 48)); const fig = `<div class="fig">${svgPicGraph(vals)}</div>`, v = ri(0, 2);
   if (v === 0) { const i = ri(0, 3); return num(`마을별 강아지 수를 그림그래프로 나타냈어요. ${VILL[i]} 마을의 강아지는 몇 마리일까요?${fig}`, vals[i], "큰 그림은 10마리, 작은 그림은 1마리예요.", { unit: "마리" }); }
   if (v === 1) { const s = vals.reduce((a, b) => a + b, 0); return num(`네 마을의 강아지는 모두 몇 마리일까요?${fig}`, s, "마을마다 수를 읽고 모두 더해요.", { unit: "마리" }); }
   const mx = Math.max(...vals), mn = Math.min(...vals); return num(`강아지가 가장 많은 마을과 가장 적은 마을의 차는 몇 마리일까요?${fig}`, mx - mn, "가장 큰 수에서 가장 작은 수를 빼요.", { unit: "마리" });
 },
};
function makeProblem3() {
  const pool = (S.topics && S.topics.length ? S.topics : ALL3).filter(id => GEN3[id]);
  let id = pick(pool); if (pool.length > 1 && id === makeProblem3.last) id = pick(pool); makeProblem3.last = id;
  const p = GEN3[id](); p.topic = id; p.label = TOPIC3[id].unit.sem + " " + TOPIC3[id].unit.name.replace(/^\d+\.\s*/, "") + " · " + TOPIC3[id].name; return p;
}

/* ---------- 문제 창 ---------- */
let mathOpen = false, P = null, F = [], act = 0, tries = 0, streak = 0, wrongStreak = 0, earned = 0, lastWrongAt = 0, quickWrong = 0, locked = false, advanceTimer = null;

function legacy(p) { return { type: "num", html: p.q, a: p.a, hint: p.hint, show: String(p.a), dec: !Number.isInteger(p.a) || S.grade === 6 }; }
function genProblem() { return S.grade === 3 ? makeProblem3() : legacy(makeProblem(S.grade, S.tier)); }
function nFields() { return P.type === "num" ? 1 : P.type === "multi" ? P.fields.length : P.type === "frac" ? (P.whole ? 3 : 2) : 0; }

function openMath() {
  if (!S.grade) return;
  mathOpen = true; earned = 0;
  $("earnedCount").textContent = "0";
  $("mathRewardBadge").textContent = "⚡ +" + CONFIG.ENERGY_CORRECT;
  nextProblem();
  $("mathOverlay").classList.add("show");
  pauseGame();
}
function closeMath() {
  mathOpen = false;
  clearTimeout(advanceTimer);
  $("mathOverlay").classList.remove("show");
  resumeGame();
}
function nextProblem() {
  clearTimeout(advanceTimer);
  P = genProblem(); tries = 0; locked = false; act = 0; F = Array(nFields()).fill("");
  $("qLabel").textContent = P.label || ("초등 " + S.grade + "학년");
  $("qText").innerHTML = P.html;
  $("qText").className = "q" + ((/<div|<svg/.test(P.html) || P.html.replace(/<[^>]+>/g, "").length > 26) ? " long" : "");
  $("ansArea").className = "ansArea"; buildAns(); buildKeys();
  $("mathMsg").textContent = P.type === "mc" ? "알맞은 답을 골라요." : nFields() > 1 ? "칸을 눌러 고르고 숫자를 넣어요. 다음 칸을 누르면 칸이 넘어가요." : "답을 누르고 확인을 눌러요.";
  $("mathMeta").textContent = "초등 " + S.grade + "학년" + (S.grade === 3 ? "" : " · 단계 " + (S.tier + 1)) + " · 연속 정답 " + streak;
  $("btnMathMore").style.display = "none";
}
function fld(i, ph, cls = "") { return `<div class="fld ${cls} ${i === act && !locked ? "on" : ""}" data-i="${i}" data-ph="${ph}">${F[i]}</div>`; }
function buildAns() {
  let h = "";
  if (P.type === "num") h = fld(0, "답", "wide") + (P.unit ? `<span class="lab">${P.unit}</span>` : "");
  else if (P.type === "multi") h = P.fields.map((f, i) => `${f.pre ? `<span class="pre">${f.pre.trim()}</span>` : ""}${fld(i, "")}${f.lab ? `<span class="lab">${f.lab}</span>` : ""}`).join("");
  else if (P.type === "frac") {
    const o = P.whole ? 1 : 0;
    h = `<div class="fracin">${P.whole ? `<div class="wcol"><small>자연수</small>${fld(0, "자연수", "w")}</div>` : ""}<div class="fcol">${fld(o, "분자")}<div class="fbar"></div>${fld(o + 1, "분모")}</div></div>`;
  } else h = `<div class="mcs ${P.mcBig ? "mbig" : ""}">${P.choices.map((c, i) => `<button data-c="${i}" class="${P.picked && P.picked[i] || ""}">${c}</button>`).join("")}</div>`;
  $("ansArea").innerHTML = h;
  $("ansArea").querySelectorAll(".fld").forEach(e => e.onclick = () => { if (locked) return; act = +e.dataset.i; buildAns(); });
  $("ansArea").querySelectorAll("[data-c]").forEach(b => b.onclick = () => pickMC(+b.dataset.c));
  $("fracNote").style.display = P.type === "frac" ? "block" : "none";
  $("fracNote").textContent = P.whole ? "자연수 칸에는 자연수를, 아래 칸에는 분자와 분모를 넣어요." : "분자와 분모를 넣어요. 가분수는 가분수 그대로 적어요.";
}
function buildKeys() {
  if (P.type === "mc") { $("keys").innerHTML = ""; $("keys").style.display = "none"; return; }
  $("keys").style.display = "grid";
  const extra = nFields() > 1 ? "⇥" : (P.dec ? "." : "");
  $("keys").innerHTML = ["7", "8", "9", "4", "5", "6", "1", "2", "3", extra, "0", "←", "확인"].map(k => k === "" ? `<span></span>` : `<button class="${k === "확인" ? "ok" : ""}" data-k="${k}">${k === "⇥" ? "다음 칸 ⇥" : k}</button>`).join("");
  $("keys").querySelectorAll("button").forEach(b => b.onclick = () => keyIn(b.dataset.k));
}
function keyIn(k) {
  if (!mathOpen || locked || !P || P.type === "mc") return;
  const n = nFields();
  if (k === "확인") return check();
  if (k === "⇥") { act = (act + 1) % n; }
  else if (k === "←") { if (F[act] === "" && act > 0) act--; else F[act] = F[act].slice(0, -1); }
  else if (k === ".") { if (P.dec && !F[act].includes(".") && F[act].length) F[act] += "."; }
  else if (/^[0-9]$/.test(k) && F[act].length < 7) { if (F[act] === "0") F[act] = k; else F[act] += k; }
  $("ansArea").className = "ansArea"; buildAns();
}
function isRight() {
  if (P.type === "num") return Math.abs(parseFloat(F[0]) - P.a) < 1e-9;
  if (P.type === "multi") return P.fields.every((f, i) => +F[i] === f.a);
  const a = P.ans; return P.whole ? (+F[0] === a.w && +F[1] === a.n && +F[2] === a.d) : (+F[0] === a.n && +F[1] === a.d);
}
function check() {
  const empty = F.findIndex(v => v === "");
  if (empty >= 0) { act = empty; buildAns(); $("mathMsg").textContent = "빈 칸을 채워 주세요."; return; }
  if (isRight()) correct(); else wrong();
}
function pickMC(i) {
  if (locked) return; P.picked = P.picked || {};
  if (i === P.ans) { P.picked[i] = "good"; buildAns(); correct(); }
  else { P.picked[i] = "bad"; buildAns(); wrong(); }
}
function revealAnswer() {
  if (P.type === "num") F = [String(P.a)];
  else if (P.type === "multi") F = P.fields.map(f => String(f.a));
  else if (P.type === "frac") F = P.whole ? [P.ans.w, P.ans.n, P.ans.d].map(String) : [P.ans.n, P.ans.d].map(String);
  else { P.picked = P.picked || {}; P.picked[P.ans] = "good"; }
  buildAns();
}
function addEnergy(amount) {
  const before = S.energy;
  S.energy = Math.min(CONFIG.ENERGY_MAX, S.energy + amount);
  return S.energy - before;
}
function correct() {
  locked = true; streak++; wrongStreak = 0; quickWrong = 0;
  const wasFull = S.energy >= CONFIG.ENERGY_MAX;
  const gained = addEnergy(CONFIG.ENERGY_CORRECT);
  earned += gained;
  S.today.solved++; S.today.correct++;
  $("ansArea").className = "ansArea good"; buildAns();
  const praise = pick(["정답! 🎉", "잘했어요! ⭐", "멋져요! 🐾", "딩동댕! 💯"]);
  $("mathMsg").innerHTML = wasFull ? praise + " 에너지가 가득 찼어요!" : praise + ` 에너지 +${gained}`;
  $("earnedCount").textContent = String(earned);
  if (streak % CONFIG.TIER_UP_STREAK === 0 && S.grade !== 3 && S.tier < 2) { S.tier++; $("mathMsg").innerHTML += "<br>한 단계 어려운 문제에 도전해요!"; }
  if (S.today.solved === CONFIG.DAILY_GOAL) { setTimeout(() => toast("🌟 오늘 목표 " + CONFIG.DAILY_GOAL + "문제 달성!"), 400); }
  saveState(); renderHud();
  $("btnMathMore").style.display = "inline-block";
  advanceTimer = setTimeout(() => { if (mathOpen) nextProblem(); }, 1100);
}
function wrong() {
  const now = Date.now(); if (now - lastWrongAt < 2000) quickWrong++; else quickWrong = 0; lastWrongAt = now;
  tries++; streak = 0; $("ansArea").className = "ansArea bad";
  if (tries === 1) {
    $("mathMsg").innerHTML = (quickWrong >= 1 ? "천천히 풀어 보자! " : "") + "아깝다! 💡 " + P.hint;
    if (P.type !== "mc") { F = F.map(() => ""); act = 0; setTimeout(() => { if (!locked) { $("ansArea").className = "ansArea"; buildAns(); } }, 450); }
  } else {
    locked = true; wrongStreak++;
    if (S.grade !== 3 && wrongStreak >= CONFIG.TIER_DOWN_WRONG && S.tier > 0) { S.tier--; wrongStreak = 0; }
    const gained = addEnergy(CONFIG.ENERGY_SECOND_WRONG);
    earned += gained;
    S.today.solved++;
    setTimeout(() => { $("ansArea").className = "ansArea shown"; revealAnswer(); }, 300);
    $("mathMsg").innerHTML = `괜찮아요! 정답은 <b>${P.show}</b>${P.unit ? " " + P.unit : ""}이에요.<br>에너지 +${gained} · 다음 문제에서 다시 해 봐요.`;
    $("earnedCount").textContent = String(earned);
    $("btnMathMore").style.display = "inline-block";
    renderHud();
    advanceTimer = setTimeout(() => { if (mathOpen) nextProblem(); }, 2800);
  }
  saveState();
}
document.addEventListener("keydown", e => {
  if (!mathOpen) return;
  if (e.key === "Escape") return closeMath();
  if (!P) return;
  if (P.type === "mc") { if (/^[1-9]$/.test(e.key) && +e.key <= P.choices.length) pickMC(+e.key - 1); return; }
  if (/^[0-9.]$/.test(e.key)) keyIn(e.key);
  else if (e.key === "Backspace") keyIn("←");
  else if (e.key === "Enter") keyIn("확인");
  else if (e.key === "Tab" || e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); keyIn("⇥"); }
  else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); act = (act - 1 + nFields()) % nFields(); buildAns(); }
});

/* ---------- 학년 선택 & 시작 화면 ---------- */
function cleanName(v) { return v.replace(/[<>&"']/g, "").trim().slice(0, 10); }
function buildGrades(id, onPick) {
  const el = $(id);
  el.innerHTML = [1, 2, 3, 4, 5, 6].map(g => `<button class="${S.grade === g ? "on" : ""}" data-g="${g}">${g}학년</button>`).join("");
  el.querySelectorAll("button").forEach(b => b.onclick = () => {
    el.querySelectorAll("button").forEach(x => x.classList.toggle("on", x === b));
    onPick(+b.dataset.g);
  });
}
let startGrade = 0;
/* 교사 페이지에서 만든 링크(?g=학년&t=단원1,단원2,...)로 들어왔는지 확인한다. */
let pendingGrade = null, pendingTopics = null, pendingClassCode = false;
function readLinkSettings() {
  const q = new URLSearchParams(location.search);
  const g = +q.get("g");
  if (g >= 1 && g <= 6) {
    pendingGrade = g;
    pendingTopics = (q.get("t") || "").split(",").map(s => s.trim()).filter(Boolean);
    pendingClassCode = true;
  }
}
function openStart() {
  $("startNameInput").value = S.name || "";
  startGrade = pendingClassCode ? pendingGrade : (S.grade || 0);
  $("gradeLabel").style.display = pendingClassCode ? "none" : "";
  $("startGrades").style.display = pendingClassCode ? "none" : "flex";
  $("gradeLockMsg").style.display = pendingClassCode ? "block" : "none";
  if (pendingClassCode) {
    $("gradeLockMsg").textContent = "📚 선생님이 정해주신 " + pendingGrade + "학년 범위로 시작해요";
  } else {
    buildGrades("startGrades", g => { startGrade = g; $("btnStartEnter").disabled = false; });
  }
  $("btnStartEnter").disabled = !startGrade;
  $("startOverlay").classList.add("show");
  setTimeout(() => { try { $("startNameInput").focus(); } catch (e) {} }, 100);
}
function openSettings() {
  buildGrades("gradeSettings", g => { S.grade = g; S.tier = 0; saveState(); toast(g + "학년 문제로 바꿨어요."); });
  $("resetConfirmBox").style.display = "none";
  $("settingsOverlay").classList.add("show");
  pauseGame();
}
function closeSettings() { $("settingsOverlay").classList.remove("show"); resumeGame(); }

/* DOM이 준비된 뒤 main.js의 init()에서 호출 */
function initMathUI() {
  $("btnStartEnter").onclick = () => {
    const name = cleanName($("startNameInput").value);
    if (!name || !startGrade) return;
    const isNew = !S.name;
    S.name = name; S.grade = startGrade; S.tier = 0;
    if (pendingClassCode) S.topics = pendingTopics;
    saveState();
    $("startOverlay").classList.remove("show");
    resumeGame();
    renderHud();
    toast(j(name, "아", "야") + (isNew ? ", 어서 와! 수학 문제를 풀어서 첫 에너지를 모아 볼까?" : ", 다시 만나서 반가워!"));
  };
  $("startNameInput").addEventListener("input", () => { $("btnStartEnter").disabled = !(cleanName($("startNameInput").value) && startGrade); });
  $("startNameInput").addEventListener("keydown", e => { if (e.key === "Enter" && !$("btnStartEnter").disabled) $("btnStartEnter").click(); });

  $("btnOpenSettings").onclick = openSettings;
  $("btnCloseSettings").onclick = closeSettings;
  $("btnReset").onclick = () => { $("resetConfirmBox").style.display = "block"; };
  $("btnResetCancel").onclick = () => { $("resetConfirmBox").style.display = "none"; };
  $("btnResetConfirm").onclick = () => {
    skipAutosaveOnUnload = true; // beforeunload가 지우기 전 상태를 되살려 저장하지 않도록
    try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
    location.reload();
  };
  $("btnMathClose").onclick = closeMath;
  $("btnMathMore").onclick = () => { if (mathOpen) nextProblem(); };
  $("btnEnergyPlus").onclick = openMath;
  $("mathOverlay").addEventListener("click", e => { if (e.target.id === "mathOverlay") closeMath(); });
  $("settingsOverlay").addEventListener("click", e => { if (e.target.id === "settingsOverlay") closeSettings(); });
}
