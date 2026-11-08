import type { Answer, Difficulty, Problem } from "@/data/types"
import { PROBLEMS } from "@/data/problems"
import { CHALLENGE } from "@/data/challenge"

/**
 * Procedural question generator for the Timed Exam.
 * Every template randomises its numbers and computes the answer in code.
 */

// ---------- helpers ----------
const num = (value: number, display?: string): Answer => ({ kind: "num", value, tol: 0, display })
const mc = (choices: string[], correct: number): Answer => ({ kind: "mc", choices, correct })
const ri = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1))
const pick = <T>(xs: readonly T[]): T => xs[ri(0, xs.length - 1)]
const shuffle = <T>(xs: readonly T[]): T[] => {
  const a = [...xs]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
const mn = (n: number) => String(n).replace("-", "−")
const sg = (n: number) => (n < 0 ? `− ${-n}` : `+ ${n}`)
function poly(terms: [number, string][]): string {
  let out = ""
  for (const [c, v] of terms) {
    if (c === 0) continue
    const abs = Math.abs(c)
    const coef = abs === 1 && v ? "" : String(abs)
    out += out === "" ? `${c < 0 ? "−" : ""}${coef}${v}` : ` ${c < 0 ? "−" : "+"} ${coef}${v}`
  }
  return out || "0"
}
const pt = (x: number, y: number) => `(${mn(x)}, ${mn(y)})`

// ---------- registry ----------
interface Result { q: string; a: Answer; e: string; alt: number }
export interface Gen { key: string; topic: string; difficulty: Difficulty; run: () => Result }
export const GENERATORS: Gen[] = []
const add = (key: string, topic: string, difficulty: Difficulty, run: () => Result) =>
  GENERATORS.push({ key, topic, difficulty, run })

// ================= Functions =================
add("fn-eval", "Functions", "Easy", () => {
  const a = ri(2, 5), b = ri(-9, 9), c = ri(-9, 9), k = ri(2, 6)
  const ans = a * k * k + b * k + c
  return {
    q: `The function f is defined by f(x) = ${poly([[a, "x²"], [b, "x"], [c, ""]])}. What is the value of f(${k})?`,
    a: num(ans),
    e: `Substitute ${k} for x: ${a}(${k * k}) ${sg(b * k)} ${sg(c)} = ${ans}.\n\nIn Desmos, define f(x) on one line and type f(${k}) on the next.`,
    alt: (a * k + b) * k + c,
  }
})

add("fn-comp", "Functions", "Medium", () => {
  const p = ri(2, 4), s = ri(-5, 8), r = ri(1, 9), k = ri(1, 4)
  const inner = p * k + s
  const ans = inner * inner - r
  return {
    q: `Let g(x) = ${poly([[p, "x"], [s, ""]])} and h(x) = x² ${sg(-r)}. What is the value of h(g(${k}))?`,
    a: num(ans),
    e: `Work from the inside out. g(${k}) = ${inner}. Then h(${inner}) = ${inner}² ${sg(-r)} = ${ans}.\n\nCommon mistake: computing g(h(${k})) instead. Desmos can check it: define both functions and type h(g(${k})).`,
    alt: (p * k + s) ** 2 - r,
  }
})

add("fn-zeros", "Functions", "Hard", () => {
  const r = ri(-4, 2), s = r + ri(1, 5)
  const a = pick([-3, -2, -1, 1, 2, 3])
  let t = ri(-3, 6); while (t === r || t === s) t = ri(-3, 6)
  let w = ri(-3, 7); while (w === r || w === s || w === t) w = ri(-3, 7)
  const v = a * (t - r) * (t - s)
  const ans = a * (w - r) * (w - s)
  return {
    q: `The quadratic function f has zeros at x = ${mn(r)} and x = ${s}. If f(${t}) = ${mn(v)}, what is the value of f(${w})?`,
    a: num(ans),
    e: `Write f(x) = a(x ${sg(-r)})(x ${sg(-s)}). Use f(${t}) = ${v}: a(${t - r})(${t - s}) = ${v}, so a = ${a}. Then f(${w}) = ${a}(${w - r})(${w - s}) = ${ans}.`,
    alt: (v / ((t - r) * (t - s))) * (w - r) * (w - s),
  }
})

// ================= Systems =================
add("sys-sum", "Systems of Equations & Inequalities", "Easy", () => {
  const x0 = ri(2, 9), y0 = ri(1, 8), a = ri(2, 4), m = ri(2, 4)
  const s1 = a * x0 + y0, d = x0 - y0
  const ans = x0 + m * y0
  return {
    q: `${a}x + y = ${s1}\nx − y = ${mn(d)}\n\nThe solution to the system of equations above is (x, y). What is the value of x + ${m}y?`,
    a: num(ans),
    e: `Add the equations: ${a + 1}x = ${s1 + d}, so x = ${x0}. Then y = x ${sg(-d)} = ${y0}. So x + ${m}y = ${x0} + ${m * y0} = ${ans}.\n\nThe question asks for x + ${m}y, not x or y, so finish the last step. In Desmos, graph both lines and click the intersection.`,
    alt: (() => { for (let x = -60; x <= 60; x++) for (let y = -60; y <= 60; y++) if (a * x + y === s1 && x - y === d) return x + m * y; return NaN })(),
  }
})

add("sys-parab-line", "Systems of Equations & Inequalities", "Medium", () => {
  const r = ri(-3, 3), s = r + ri(1, 5), b = ri(-6, 6), c = ri(-6, 6)
  const m = r + s + b, n = c - r * s
  const ans = m * s + n
  return {
    q: `y = ${poly([[1, "x²"], [b, "x"], [c, ""]])}\ny = ${poly([[m, "x"], [n, ""]])}\n\nThe system above has two solutions. What is the y-coordinate of the solution with the larger x-coordinate?`,
    a: num(ans),
    e: `Set the right sides equal: x² ${sg(b - m)}x ${sg(c - n)} = 0, which factors as (x ${sg(-r)})(x ${sg(-s)}) = 0. The larger x is ${s}, and y = ${poly([[m, "(" + s + ")"], [n, ""]])} = ${ans}.\n\nFastest method: Desmos. Graph both, click the two intersections, and read the one with the larger x (not the larger y by habit).`,
    alt: (() => { let best = NaN; for (let x = -40; x <= 40; x++) if (x * x + b * x + c === m * x + n) best = m * x + n; return best })(),
  }
})

add("sys-ineq", "Systems of Equations & Inequalities", "Medium", () => {
  const x0 = ri(3, 8), y0 = ri(2, 8), m = ri(2, 3)
  const t = m * x0 - y0, S = x0 + y0
  return {
    q: `A point (x, y) satisfies both x + y ≤ ${S} and y ≥ ${poly([[m, "x"], [-t, ""]])}. What is the greatest possible value of x?`,
    a: num(x0),
    e: `The region ends on the right where the boundary lines meet. Set ${S} − x = ${poly([[m, "x"], [-t, ""]])}: ${m + 1}x = ${S + t}, so x = ${x0}. Any larger x makes the two conditions impossible together.\n\nIn Desmos, shade both inequalities and click the right-most corner of the overlap.`,
    alt: (() => { let best = NaN; for (let x = -50; x <= 50; x++) if (m * x - t <= S - x) best = x; return best })(),
  }
})

add("sys-count-mc", "Systems of Equations & Inequalities", "Medium", () => {
  const B = 2 * ri(-4, 4), want = pick([0, 1, 2]), extra = ri(1, 6)
  const C = want === 1 ? B * B / 4 : want === 0 ? B * B / 4 + extra : B * B / 4 - extra
  const b = ri(-5, 5), c = ri(-5, 5)
  const m = b - B, n = c - C
  const disc = B * B - 4 * C
  const g = (x: number) => x * x + B * x + C
  let count = 0, prev = 0
  for (let x = -60; x <= 60; x += 0.25) {
    const v = g(x)
    if (v === 0) { count++; prev = 0 }
    else { const sgn = Math.sign(v); if (prev && sgn !== prev) count++; prev = sgn }
  }
  return {
    q: `y = ${poly([[1, "x²"], [b, "x"], [c, ""]])}\ny = ${poly([[m, "x"], [n, ""]])}\n\nHow many solutions (x, y) does the system above have?`,
    a: mc(["No real solutions", "Exactly one solution", "Exactly two solutions", "Infinitely many solutions"], want),
    e: `Set the right sides equal: x² ${sg(B)}x ${sg(C)} = 0. The discriminant is (${mn(B)})² − 4(${mn(C)}) = ${mn(disc)}. ${disc < 0 ? "It is negative, so the line misses the parabola." : disc === 0 ? "It is zero, so the line touches the parabola once." : "It is positive, so the line crosses the parabola twice."}\n\nDesmos: graph both and count the intersections.`,
    alt: count,
  }
})

add("sys-tangent-k", "Algebra with Desmos", "Hard", () => {
  const b = pick([2, 4, 6, 8, 10]), m = pick([2, 4, 6]), n = ri(-9, 9)
  const B = b + m, k = n + (B * B) / 4
  return {
    q: `y = x² − ${b}x + k\ny = ${poly([[m, "x"], [n, ""]])}\n\nIn the system above, k is a constant. If the system has exactly one solution, what is the value of k?`,
    a: num(k),
    e: `Set the right sides equal: x² − ${B}x + (k ${sg(-n)}) = 0. One solution means the discriminant is zero: ${B}² − 4(k ${sg(-n)}) = 0, so k ${sg(-n)} = ${B * B / 4} and k = ${k}.\n\nDesmos: make k a slider and drag until the line just touches the parabola once.`,
    alt: (() => { for (let kk = -300; kk <= 300; kk += 0.25) if (Math.abs(B * B - 4 * (kk - n)) < 1e-9) return kk; return NaN })(),
  }
})

add("abs-eq", "Algebra with Desmos", "Medium", () => {
  const a = ri(2, 9), c = ri(2, 6), d = ri(1, 5)
  const ask = pick(["sum", "greatest", "diff"] as const)
  const ans = ask === "sum" ? 2 * a : ask === "greatest" ? a + c + d : 2 * (c + d)
  const word = ask === "sum" ? "sum of the solutions" : ask === "greatest" ? "greatest solution" : "positive difference between the two solutions"
  const sols: number[] = []
  for (let x = -80; x <= 80; x++) if (Math.abs(x - a) - d === c) sols.push(x)
  const alt = ask === "sum" ? sols.reduce((p, q) => p + q, 0) : ask === "greatest" ? Math.max(...sols) : Math.max(...sols) - Math.min(...sols)
  return {
    q: `What is the ${word} of the equation |x − ${a}| − ${d} = ${c}?`,
    a: num(ans),
    e: `Isolate the absolute value: |x − ${a}| = ${c + d}. So x − ${a} = ${c + d} or x − ${a} = −${c + d}, giving x = ${a + c + d} or x = ${a - c - d}. Then the ${word} is ${ans}.\n\nDesmos: graph y = |x − ${a}| − ${d} and y = ${c} and read both intersections.`,
    alt,
  }
})

// ================= Linear =================
add("line-two-pts", "Linear Functions", "Medium", () => {
  const m = pick([-4, -3, -2, -1, 1, 2, 3, 4, 5]), x1 = ri(0, 3), dx = ri(1, 3)
  const x2 = x1 + dx, y1 = ri(-5, 10), y2 = y1 + m * dx, k = ri(5, 9)
  const ans = y1 + m * (k - x1)
  return {
    q: `A line in the xy-plane passes through the points ${pt(x1, y1)} and ${pt(x2, y2)}. What is the y-coordinate of the point on the line where x = ${k}?`,
    a: num(ans),
    e: `Slope = (${mn(y2)} − ${y1 < 0 ? `(${y1})` : y1}) / (${x2} − ${x1}) = ${mn(m)}. From ${pt(x1, y1)} move ${k - x1} units right: y = ${mn(y1)} ${sg(m * (k - x1))} = ${mn(ans)}.\n\nDesmos: plot the two points, graph the line through them, and read the value at x = ${k}.`,
    alt: y1 + ((y2 - y1) / (x2 - x1)) * (k - x1),
  }
})

add("flat-rate", "Linear Functions", "Medium", () => {
  const F = ri(4, 12) * 5, R = ri(15, 45), h1 = ri(2, 4), h2 = ri(5, 8)
  const T1 = F + R * h1, T2 = F + R * h2
  return {
    q: `A plumber charges a fixed fee plus a constant hourly rate. A ${h1}-hour job costs $${T1} and a ${h2}-hour job costs $${T2}. What is the fixed fee, in dollars?`,
    a: num(F),
    e: `The hourly rate is (${T2} − ${T1}) / (${h2} − ${h1}) = ${R}. Then the fixed fee is ${T1} − ${R}(${h1}) = ${F}.\n\nDesmos: plot (${h1}, ${T1}) and (${h2}, ${T2}), draw the line through them, and read the y-intercept.`,
    alt: (h2 * T1 - h1 * T2) / (h2 - h1),
  }
})

add("intercept-sum", "Linear Functions", "Medium", () => {
  const A = ri(2, 9), B = ri(2, 9), j = ri(1, 3), C = A * B * j
  return {
    q: `The graph of ${A}x + ${B}y = ${C} in the xy-plane has x-intercept (p, 0) and y-intercept (0, q). What is the value of p + q?`,
    a: num(j * (A + B)),
    e: `Set y = 0: p = ${C}/${A} = ${C / A}. Set x = 0: q = ${C}/${B} = ${C / B}. So p + q = ${C / A + C / B}.`,
    alt: C / A + C / B,
  }
})

// ================= Exponential =================
add("compound", "Exponential Growth", "Medium", () => {
  const o = pick([
    { r: 10, t: ri(2, 3), p: () => 1000 * ri(1, 5) },
    { r: 20, t: 2, p: () => 25 * ri(8, 40) },
    { r: 25, t: 2, p: () => 16 * ri(10, 50) },
  ])
  const P = o.p(), g = 1 + o.r / 100
  const ans = Math.round(P * g ** o.t)
  let alt = P; for (let i = 0; i < o.t; i++) alt *= 1 + o.r / 100
  return {
    q: `An account balance starts at $${P.toLocaleString("en-US")} and grows by ${o.r}% each year. What is the balance, in dollars, after ${o.t} years?`,
    a: num(ans),
    e: `Each year multiplies the balance by ${g}. So the balance is ${P}(${g})^${o.t} = ${ans}.\n\nDesmos: type ${P}*${g}^${o.t}. By hand, repeat the multiplication once per year.`,
    alt: Math.round(alt),
  }
})

add("doubling", "Exponential Growth", "Easy", () => {
  const N = ri(3, 20) * 10, d = ri(2, 5), k = ri(2, 5), t = d * k
  let alt = N; for (let i = 0; i < k; i++) alt *= 2
  return {
    q: `A bacteria culture doubles every ${d} hours. If it starts with ${N} bacteria, how many bacteria are there after ${t} hours?`,
    a: num(N * 2 ** k),
    e: `${t} hours is ${k} doubling periods. So the count is ${N} · 2^${k} = ${N * 2 ** k}.`,
    alt,
  }
})

add("half-life", "Exponential Growth", "Medium", () => {
  const A = 16 * ri(5, 25), h = pick([2, 3, 5, 6]), k = ri(2, 4), t = h * k
  let alt = A; for (let i = 0; i < k; i++) alt /= 2
  return {
    q: `A radioactive sample has a mass of ${A} grams and a half-life of ${h} days. How many grams remain after ${t} days?`,
    a: num(A / 2 ** k),
    e: `${t} days is ${k} half-lives, so the mass is halved ${k} times: ${A} / 2^${k} = ${A / 2 ** k}.\n\nAs a function: m(t) = ${A}(1/2)^(t/${h}). In Desmos, type ${A}*(1/2)^(${t}/${h}).`,
    alt,
  }
})

add("exp-two-values", "Exponential Growth", "Hard", () => {
  const b = pick([2, 3]), a = ri(2, 6)
  const p = a * b, q = a * b ** 3
  const ans = a * b ** 5
  const bb = Math.sqrt(q / p)
  return {
    q: `The exponential function f is defined by f(x) = a · b^x, where a and b are positive constants. If f(1) = ${p} and f(3) = ${q}, what is the value of f(5)?`,
    a: num(ans),
    e: `Divide: f(3)/f(1) = b² = ${q}/${p} = ${b * b}, so b = ${b}. Then a = ${p}/${b} = ${a}. So f(5) = ${a}(${b})^5 = ${ans}.\n\nShortcut: x increases by 2 each time, so f(5) = f(3) · b² = ${q} · ${b * b} = ${ans}.`,
    alt: (p / bb) * bb ** 5,
  }
})

// ================= Quadratics =================
add("roots-diff", "Quadratics & Polynomials", "Medium", () => {
  const r = ri(-6, 3), s = r + ri(1, 8), a = ri(1, 3)
  const eq = poly([[a, "x²"], [-a * (r + s), "x"], [a * r * s, ""]])
  const sols: number[] = []
  for (let x = -60; x <= 60; x++) if (a * x * x - a * (r + s) * x + a * r * s === 0) sols.push(x)
  return {
    q: `What is the positive difference between the solutions of the equation ${eq} = 0?`,
    a: num(s - r),
    e: `${a > 1 ? `Divide by ${a}: ` : ""}x² ${sg(-(r + s))}x ${sg(r * s)} = 0 factors as (x ${sg(-r)})(x ${sg(-s)}) = 0, so x = ${r} or x = ${s}. The positive difference is ${s - r}.\n\nDesmos: graph the left side and read the two x-intercepts.`,
    alt: Math.max(...sols) - Math.min(...sols),
  }
})

add("vertex-value", "Quadratics & Polynomials", "Medium", () => {
  const neg = Math.random() < 0.5
  const a = pick([1, 2, 3]) * (neg ? -1 : 1), h = ri(-5, 6), k = ri(-12, 10)
  const b = -2 * a * h, c = a * h * h + k
  let best = neg ? -Infinity : Infinity
  for (let x = -40; x <= 40; x += 0.5) { const v = a * x * x + b * x + c; best = neg ? Math.max(best, v) : Math.min(best, v) }
  return {
    q: `What is the ${neg ? "maximum" : "minimum"} value of the function f(x) = ${poly([[a, "x²"], [b, "x"], [c, ""]])}?`,
    a: num(k),
    e: `The vertex is at x = −b/(2a) = ${h}. Then f(${h}) = ${a}(${h * h}) ${sg(b * h)} ${sg(c)} = ${k}. Since a is ${neg ? "negative" : "positive"}, the parabola opens ${neg ? "down" : "up"}, so this is the ${neg ? "maximum" : "minimum"}.\n\nDesmos: graph it and click the vertex.`,
    alt: best,
  }
})

add("projectile", "Quadratics & Polynomials", "Hard", () => {
  const v = 8 * ri(1, 8), s = ri(2, 12)
  let best = -Infinity
  for (let t = 0; t <= v / 16 + 1; t += 1 / 32) best = Math.max(best, -16 * t * t + v * t + s)
  const tm = v / 32
  return {
    q: `A ball is thrown upward. Its height, in feet, t seconds after it is thrown is h(t) = −16t² + ${v}t + ${s}. What is the maximum height, in feet, that the ball reaches?`,
    a: num(s + (v * v) / 64),
    e: `The maximum occurs at t = −b/(2a) = ${v}/32 = ${tm}. Then h(${tm}) = ${s + (v * v) / 64}.\n\nDesmos: graph h(t) and click the vertex.`,
    alt: best,
  }
})

// ================= Angles & Triangles =================
add("polygon-angle", "Angles & Triangles", "Easy", () => {
  const n = pick([5, 6, 8, 9, 10, 12])
  return {
    q: `Each interior angle of a regular polygon with ${n} sides has the same measure. What is that measure, in degrees?`,
    a: num(((n - 2) * 180) / n),
    e: `The interior angles sum to (${n} − 2)(180°) = ${(n - 2) * 180}°. Dividing among ${n} equal angles gives ${((n - 2) * 180) / n}°.`,
    alt: 180 - 360 / n,
  }
})

add("polygon-missing", "Angles & Triangles", "Medium", () => {
  const n = pick([5, 6]), total = (n - 2) * 180
  let known: number[] = [], x = 0
  for (;;) {
    known = Array.from({ length: n - 1 }, () => ri(90, 150))
    x = total - known.reduce((p, q) => p + q, 0)
    if (x >= 60 && x <= 170) break
  }
  return {
    q: `The interior angles of a convex ${n === 5 ? "pentagon" : "hexagon"} measure ${known.map((k) => k + "°").join(", ")}, and x°. What is the value of x?`,
    a: num(x),
    e: `The interior angles of an ${n}-sided polygon sum to (${n} − 2)(180°) = ${total}°. The known angles add to ${known.reduce((p, q) => p + q, 0)}°, so x = ${total} − ${known.reduce((p, q) => p + q, 0)} = ${x}.`,
    alt: 180 * (n - 2) - known.reduce((p, q) => p + q, 0),
  }
})

add("angle-ratio", "Angles & Triangles", "Medium", () => {
  const tri = pick([[1, 2, 3], [2, 3, 4], [3, 4, 5], [1, 3, 5], [2, 3, 7], [1, 2, 6], [1, 1, 4]])
  const ratio = shuffle(tri), largest = Math.random() < 0.5, sum = tri.reduce((p, q) => p + q, 0)
  const unit = 180 / sum
  const ans = (largest ? Math.max(...tri) : Math.min(...tri)) * unit
  return {
    q: `The measures of the angles of a triangle are in the ratio ${ratio.join(":")}. What is the measure, in degrees, of the ${largest ? "largest" : "smallest"} angle?`,
    a: num(ans),
    e: `The ratio parts total ${sum}, and the angles sum to 180°, so each part is 180/${sum} = ${unit}°. The ${largest ? "largest" : "smallest"} angle has ${largest ? Math.max(...tri) : Math.min(...tri)} parts: ${ans}°.`,
    alt: (180 * (largest ? Math.max(...tri) : Math.min(...tri))) / sum,
  }
})

add("similar-area", "Angles & Triangles", "Medium", () => {
  const a = ri(2, 9), k = ri(2, 4), A = ri(5, 40)
  return {
    q: `Triangle DEF is similar to triangle ABC, where side DE corresponds to side AB. AB = ${a}, DE = ${a * k}, and the area of triangle ABC is ${A}. What is the area of triangle DEF?`,
    a: num(A * k * k),
    e: `The scale factor is DE/AB = ${k}. Areas scale by the square of the scale factor: ${A} · ${k}² = ${A * k * k}.\n\nCommon mistake: multiplying the area by ${k} instead of ${k * k}.`,
    alt: A * ((a * k) / a) ** 2,
  }
})

add("pythag-area", "Angles & Triangles", "Medium", () => {
  const [p, q, h] = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]])
  const m = ri(1, 2), [L, O] = Math.random() < 0.5 ? [p * m, q * m] : [q * m, p * m]
  const H = h * m
  return {
    q: `A right triangle has a hypotenuse of length ${H} and one leg of length ${L}. What is the area of the triangle?`,
    a: num((L * O) / 2),
    e: `The other leg is √(${H}² − ${L}²) = √${H * H - L * L} = ${O}. The area is (1/2)(${L})(${O}) = ${(L * O) / 2}.`,
    alt: (L * Math.round(Math.sqrt(H * H - L * L))) / 2,
  }
})

// ================= Circles =================
add("circle-complete", "Circles", "Hard", () => {
  const h = ri(-6, 6), k = ri(-6, 6), r = ri(3, 9)
  const B = -2 * h, C = -2 * k, D = r * r - h * h - k * k
  return {
    q: `The equation ${poly([[1, "x²"], [1, "y²"], [B, "x"], [C, "y"]])} = ${mn(D)} defines a circle in the xy-plane. What is the radius of the circle?`,
    a: num(r),
    e: `Complete the square in x and y: (x ${sg(-h)})² + (y ${sg(-k)})² = ${mn(D)} + ${h * h} + ${k * k} = ${r * r}. So the radius is √${r * r} = ${r}.\n\nCommon mistake: stopping at the right-hand side and reporting ${mn(D)} or its square root.`,
    alt: Math.sqrt(D + (B / 2) ** 2 + (C / 2) ** 2),
  }
})

add("circle-diameter", "Circles", "Medium", () => {
  const [dx0, dy0, hyp] = pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17]])
  const h = ri(-5, 5), k = ri(-5, 5)
  const dx = Math.random() < 0.5 ? dx0 : -dx0, dy = Math.random() < 0.5 ? dy0 : -dy0
  return {
    q: `A circle in the xy-plane has center ${pt(h, k)} and passes through the point ${pt(h + dx, k + dy)}. What is the diameter of the circle?`,
    a: num(2 * hyp),
    e: `The radius is the distance from the center to the point: √(${dx}² + ${dy}²) = ${hyp}. The diameter is twice that: ${2 * hyp}.\n\nCommon mistake: reporting the radius.`,
    alt: 2 * Math.hypot(dx, dy),
  }
})

add("arc-length", "Circles", "Medium", () => {
  const C = 24 * ri(1, 6), th = pick([45, 60, 90, 120, 150])
  const rad = C / (2 * Math.PI)
  return {
    q: `A circle has a circumference of ${C}. An arc of the circle has a central angle of ${th}°. What is the length of the arc?`,
    a: num((C * th) / 360),
    e: `The arc is ${th}/360 of the whole circumference: (${th}/360)(${C}) = ${(C * th) / 360}.`,
    alt: rad * ((th * Math.PI) / 180),
  }
})

// ================= Area / Volume =================
add("box-surface", "Area, Surface Area & Volume", "Medium", () => {
  const l = ri(2, 9), w = ri(2, 9), h = ri(2, 9), V = l * w * h
  const faces = [l * w, l * w, l * h, l * h, w * h, w * h]
  return {
    q: `A rectangular box has a length of ${l}, a width of ${w}, and a volume of ${V}. What is the total surface area of the box?`,
    a: num(2 * (l * w + l * h + w * h)),
    e: `Height = V/(l·w) = ${V}/${l * w} = ${h}. Surface area = 2(${l}·${w} + ${l}·${h} + ${w}·${h}) = 2(${l * w + l * h + w * h}) = ${2 * (l * w + l * h + w * h)}.`,
    alt: faces.reduce((p, q) => p + q, 0),
  }
})

// ================= Rates & Units =================
add("speed-conv", "Rates & Units", "Medium", () => {
  if (Math.random() < 0.5) {
    const v = pick([30, 45, 60, 75, 90, 105])
    return {
      q: `A train travels at a constant speed of ${v} miles per hour. There are 5,280 feet in a mile. What is the train's speed, in feet per second?`,
      a: num((v * 22) / 15),
      e: `${v} miles/hour × 5,280 feet/mile ÷ 3,600 seconds/hour = ${(v * 22) / 15} feet per second.`,
      alt: (v * 5280) / 3600,
    }
  }
  const v = pick([36, 54, 72, 90, 108])
  return {
    q: `A cyclist travels at a constant speed of ${v} kilometers per hour. What is the cyclist's speed, in meters per second?`,
    a: num((v * 5) / 18),
    e: `${v} km/hour × 1,000 meters/km ÷ 3,600 seconds/hour = ${(v * 5) / 18} meters per second.`,
    alt: (v * 1000) / 3600,
  }
})

add("tank-rate", "Rates & Units", "Medium", () => {
  const a = ri(12, 30), b = ri(2, 9), t = ri(10, 40), C = (a - b) * t
  let level = 0, mins = 0
  while (level < C) { level += a - b; mins++ }
  return {
    q: `An empty tank has a capacity of ${C} gallons. A pump adds water at ${a} gallons per minute while a leak loses ${b} gallons per minute. How many minutes will it take to fill the tank?`,
    a: num(t),
    e: `The net rate is ${a} − ${b} = ${a - b} gallons per minute. Time = ${C} / ${a - b} = ${t} minutes.\n\nCommon mistake: using only the pump rate and forgetting the leak.`,
    alt: mins,
  }
})

add("percent-chain", "Rates & Units", "Medium", () => {
  const p = pick([10, 20, 25, 50]), q = pick([10, 20, 25, 50]), P = 400 * ri(1, 5)
  let alt = P; alt *= 1 + p / 100; alt *= 1 - q / 100
  return {
    q: `The price of a jacket is $${P}. The store raises the price by ${p}%, and later lowers the new price by ${q}%. What is the final price, in dollars?`,
    a: num((P * (100 + p) * (100 - q)) / 10000),
    e: `Multiply by ${1 + p / 100}, then by ${1 - q / 100}: ${P} × ${1 + p / 100} × ${1 - q / 100} = ${(P * (100 + p) * (100 - q)) / 10000}.\n\nCommon mistake: adding and subtracting the percents (${p} − ${q}) as if they applied to the same price.`,
    alt: Math.round(alt),
  }
})

// ================= Statistics =================
add("mean-seventh", "Statistics", "Medium", () => {
  const M = ri(70, 80)
  let d = 0, x7 = 0
  do { d = pick([-3, -2, -1, 1, 2, 3]); x7 = M + 7 * d } while (x7 < 40 || x7 > 100)
  return {
    q: `The mean of 6 test scores is ${M}. When a seventh score is included, the mean of the 7 scores is ${M + d}. What is the seventh score?`,
    a: num(x7),
    e: `The first 6 scores total 6 × ${M} = ${6 * M}. All 7 scores total 7 × ${M + d} = ${7 * (M + d)}. The seventh score is ${7 * (M + d)} − ${6 * M} = ${x7}.`,
    alt: 7 * (M + d) - 6 * M,
  }
})

add("freq-median", "Statistics", "Medium", () => {
  const vals = pick([[1, 2, 3, 4, 5], [2, 3, 4, 5, 6], [0, 1, 2, 3, 4]])
  let freq: number[] = [], N = 0
  do { freq = vals.map(() => ri(1, 6)); N = freq.reduce((p, q) => p + q, 0) } while (N % 2 === 0)
  const expanded = vals.flatMap((v, i) => Array(freq[i]).fill(v))
  const med = expanded[(N - 1) / 2]
  let cum = 0, alt = NaN
  for (let i = 0; i < vals.length; i++) { cum += freq[i]; if (cum >= (N + 1) / 2) { alt = vals[i]; break } }
  return {
    q: `The table shows the number of books ${N} students read last month.\n\nBooks:      ${vals.join(", ")}\nStudents: ${freq.join(", ")}\n\nWhat is the median number of books read?`,
    a: num(med),
    e: `There are ${N} values, so the median is the value in position ${(N + 1) / 2}. Counting up through the frequencies (${freq.join(", ")}), position ${(N + 1) / 2} falls on ${med}.`,
    alt,
  }
})

// ================= Trigonometry =================
add("sin-side", "Trigonometry", "Medium", () => {
  const [o, ad, hy] = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]])
  const m = ri(2, 4), [opp, adj] = Math.random() < 0.5 ? [o, ad] : [ad, o]
  return {
    q: `In right triangle ABC, the right angle is at C, sin A = ${opp}/${hy}, and AB = ${hy * m}. What is the length of AC?`,
    a: num(adj * m),
    e: `sin A = BC/AB, so BC = ${opp}/${hy} · ${hy * m} = ${opp * m}. Then AC = √(${hy * m}² − ${opp * m}²) = ${adj * m}.\n\nIdentify the sides first: AB is the hypotenuse, and AC is the leg next to angle A, not the one opposite it.`,
    alt: Math.round(Math.sqrt((hy * m) ** 2 - (opp * m) ** 2)),
  }
})

add("trig-complement", "Trigonometry", "Easy", () => {
  const a = ri(10, 80), flip = Math.random() < 0.5
  return {
    q: `In the equation ${flip ? "cos" : "sin"}(x°) = ${flip ? "sin" : "cos"}(${a}°), x is a constant between 0 and 90. What is the value of x?`,
    a: num(90 - a),
    e: `Sine and cosine of complementary angles are equal, so x + ${a} = 90 and x = ${90 - a}.\n\nDesmos check (degree mode!): graph y = ${flip ? "cos" : "sin"}(x) and y = ${flip ? "sin" : "cos"}(${a}).`,
    alt: (() => { for (let x = 0.5; x < 90; x += 0.5) if (Math.abs((flip ? Math.cos : Math.sin)((x * Math.PI) / 180) - (flip ? Math.sin : Math.cos)((a * Math.PI) / 180)) < 1e-9) return x; return NaN })(),
  }
})

add("trig-multi", "Trigonometry", "Hard", () => {
  const [p, q] = pick([[2, 3], [1, 4], [4, 5], [1, 5], [5, 10], [3, 6], [7, 8], [2, 8]])
  const x = 90 / (p + q)
  return {
    q: `In the equation sin(${p}x°) = cos(${q}x°), the angles ${p}x° and ${q}x° are both acute. What is the value of x?`,
    a: num(x),
    e: `Sine and cosine are equal for complementary angles, so ${p}x + ${q}x = 90. That gives ${p + q}x = 90 and x = ${x}.\n\nDesmos check (degree mode!): graph y = sin(${p}x) and y = cos(${q}x) and find the intersection where both angles are acute.`,
    alt: (() => { for (let xx = 0.5; xx < 90; xx += 0.5) if (p * xx < 90 && q * xx < 90 && Math.abs(Math.sin((p * xx * Math.PI) / 180) - Math.cos((q * xx * Math.PI) / 180)) < 1e-9) return xx; return NaN })(),
  }
})

// ---------- public API ----------
let seq = 0
const stamp = Date.now().toString(36)

const BANK = new Set<string>([...PROBLEMS.map((p) => p.question), ...CHALLENGE.map((c) => c.question)])

export function generateProblem(g: Gen): Problem {
  // re-roll in the (very unlikely) case a random draw reproduces a bank question word for word
  let r = g.run()
  for (let i = 0; i < 20 && BANK.has(r.q); i++) r = g.run()
  return {
    id: `gen-${stamp}-${seq++}-${g.key}`,
    number: 0,
    topic: g.topic,
    difficulty: g.difficulty,
    question: r.q,
    answer: r.a,
    explanation: r.e,
  }
}

/** n fresh questions. Templates are shuffled so no template repeats until all have been used. */
export function generateExam(n: number): Problem[] {
  const out: Problem[] = []
  let deck: Gen[] = []
  while (out.length < n) {
    if (deck.length === 0) deck = shuffle(GENERATORS)
    const p = generateProblem(deck.pop()!)
    p.number = out.length + 1
    out.push(p)
  }
  return out
}