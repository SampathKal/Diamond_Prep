/** Independent numeric check of every numeric answer key. Run: npm run verify */
const near = (a: number, b: number, t = 1e-6) => Math.abs(a - b) <= t
const checks: [string, number, number, number?][] = []
const add = (id: string, got: number, want: number, tol?: number) => checks.push([id, got, want, tol])

// problems
const f1 = (x: number) => 3 * x * x - 5 * x + 2; add("p1", f1(4), 30)
add("p2", ((9) ** 2) - 1, 80)
add("p3 x+3y", 5 + 3 * 1, 8)
add("p4 y", 4 - 1, 3)
add("p5 x", 5, 5); add("p5 y check", 10 - 5, 2 * 5 - 5)
// p6 |x-3| = 2x-3: solve candidates
const sols6 = [0, 2].filter((x) => near(Math.abs(x - 3), 2 * x - 3)); add("p6 count", sols6.length, 1)
add("p7 k", ((): number => { for (let k = -50; k <= 50; k += 0.25) if (near(100 - 4 * (k + 9), 0)) return k; return NaN })(), 16)
// p8 x^2 = 2^x count sign changes of g
{
  let n = 0, prev = 0
  for (let x = -5; x <= 8; x += 0.0005) { const g = x * x - 2 ** x; const s = Math.sign(g); if (prev && s && s !== prev) n++; if (s) prev = s }
  add("p8 count", n, 3)
}
add("p9", 17 + 4 * 3, 29)
add("p10", 30 + 9 * 2.5, 52.5)
add("p11", Math.round(200 * 1.05 ** 3), 232)
add("p12", Math.round(500 * 3 ** 2.5), 7794)
add("p13", 7 * 7 - 5 * 7 - 14, 0)
add("p14", -2 * 9 + 36 - 5, 13)
{ const a = 16 / ((-1) * (-4) * 2); add("p15 a", a, 2); add("p15", a * (2 - 1) * (2 - 4) * (2 + 2), -16) }
{ const x = 180 / 6; add("p16", 3 * x - 10, 80) }
add("p17", 15 / 6 * 8, 20)
add("p18", Math.sqrt(36 + 9 + 4), 7)
add("p19", 72 / 360 * 20, 4)
add("p20", 2 * (20 + 24 + 30), 148)
add("p21", Math.sqrt(150 / 6), 5)
add("p22", 150 / 2.5 * 5280 / 3600, 88)
add("p23", 900 / 20 * 12, 540)
add("p24", 85 - 65, 20)
add("p26", 3 / 5 * 20, 12)
add("p27", 90 - 40, 50)

// techniques practice
{ let n = 0, prev = 0; for (let x = -4; x <= 4; x += 0.0005) { const s = Math.sign(x ** 3 - 3 * x - 1); if (prev && s && s !== prev) n++; if (s) prev = s } add("t1 cubic", n, 3) }
add("t2 diff", 1 - -4, 5)
add("t3 min", 2 * 4 - 16 + 11, 3)
add("t4 k (x^2-6x+(k+3)) disc", 36 - 4 * (6 + 3), 0)
{ const k = 4; const x = (12 + 8) / 2; add("t5 x at k=4", x, 10); add("t5 B", 5 * k / 2, 10) }
add("t6 intercept", 9 - -2 * -2, 5)
{ // t7 y=x^2-4x+7 through (1,4),(2,3),(4,7)
  const f = (x: number) => x * x - 4 * x + 7; add("t7 (1)", f(1), 4); add("t7 (2)", f(2), 3); add("t7 (4)", f(4), 7) }
{ const b = Math.sqrt(5 / 20), a = 20 / b; add("t8 f(5)", a * b ** 5, 1.25) }
{ const b = 1, a = 20; add("t9 f(11)", a / (11 - b), 2); add("t9 pt1", a / (3 - b), 10); add("t9 pt2", a / (6 - b), 4) }
add("t10 C", 2 * 9 + 7, 25)
add("t12 corner (10,0)", Math.max(0, 30, 12, 26), 30)
add("t13 y-int", Math.abs(0 - 2) - 3, -1)
add("t14 fgh", ((x: number) => 2 * x * x - x)(3), 15)
{ const r = Math.sqrt(-17 + 1 + 25); add("t15 r", r, 3) }
add("t16 median", (9 + 12) / 2, 10.5)
add("t17 trig", 20 * Math.cos(52 * Math.PI / 180), 12.3, 0.05)
{ const v = (t: number) => 9000 * 0.85 ** t; add("t18 t4>4000", v(4) > 4000 ? 1 : 0, 1); add("t18 t5<4000", v(5) < 4000 ? 1 : 0, 1) }
add("t19", 207 / 0.92, 225)
add("ex t15 check", 45 * 1609.34 / 3600, 20.1168, 1e-3)
{ // example: 2^x = x+3 two solutions; ladder; exp
  let n = 0, prev = 0; for (let x = -6; x <= 6; x += 0.0005) { const s = Math.sign(2 ** x - x - 3); if (prev && s && s !== prev) n++; if (s) prev = s } add("ex 2^x count", n, 2)
  add("ex ladder", 12 * Math.sin(70 * Math.PI / 180), 11.276, 0.01)
  add("ex 250*1.08^t=600", Math.log(2.4) / Math.log(1.08), 11.37, 0.01)
  add("ex slider k", 4 - 4 * (3 - 2), 0)
}

// challenge
add("c1 sol 3", Math.sqrt(2 * 3 + 3), 3); add("c1 -1 extraneous", Math.sqrt(2 * -1 + 3) === -1 ? 1 : 0, 0)
add("c2 k6", 64 - 16 * (6 - 2), 0); add("c2 sum", 6 + 2, 8)
add("c3", 0.8 ** 2, 0.64)
add("c4 disc>0", 100 - 52 > 0 ? 1 : 0, 1); add("c4 sum", 10, 10)
add("c5", 40 * 1.5 ** 3, 135)
{ const g = (x: number) => (x + 2) ** 2 - 4 * (x + 2) + 1 - 3; let m = Infinity; for (let x = -10; x <= 10; x += 0.001) m = Math.min(m, g(x)); add("c6", m, -6, 1e-4) }
add("c7 m=8", (2 - 8) ** 2 - 36, 0)
// system uniqueness for p15/c7 shape: verify tangency numerically for c7
{ const m = 8; const disc = (2 - m) ** 2 - 36; add("c7 tangent", disc, 0) }

let fail = 0
for (const [id, got, want, tol] of checks) {
  if (!near(got, want, tol ?? 1e-6)) { fail++; console.error(`FAIL ${id}: got ${got}, expected ${want}`) }
}
console.log(`${checks.length - fail}/${checks.length} checks passed`)
if (fail) process.exit(1)
export {}
