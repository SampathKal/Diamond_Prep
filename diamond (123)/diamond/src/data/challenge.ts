import type { ChallengeQ, Answer } from "./types"

const num = (value: number, tol = 0, display?: string): Answer => ({ kind: "num", value, tol, display })

/**
 * Exactly seven hard, original questions. No technique names and no suggested method are
 * ever shown with them. Topics were chosen from commonly missed digital-SAT areas:
 * extraneous solutions, constants that change the type of an equation, percent change,
 * completing the square with Vieta, volume scaling, transformations, and tangent systems.
 */
export const CHALLENGE: ChallengeQ[] = [
  {
    id: "c1", number: 1,
    question: "What is the sum of all real solutions to the equation √(2x + 3) = x?",
    answer: num(3),
    hints: [
      "Squaring both sides can create answers that do not work in the original equation.",
      "After squaring you get a quadratic with two roots. Substitute each back into the original equation.",
      "x² − 2x − 3 = 0 gives x = 3 and x = −1. A square root cannot equal a negative number, so only one of them survives.",
    ],
    explanation: "Square both sides: 2x + 3 = x², so x² − 2x − 3 = 0, which factors as (x − 3)(x + 1) = 0. Check x = 3: √9 = 3 ✓. Check x = −1: √1 = 1, but the right side is −1, so x = −1 is extraneous. The only solution is 3, and the sum of all real solutions is 3.\n\nThe trap is adding 3 + (−1) = 2. Always test solutions after squaring.",
  },
  {
    id: "c2", number: 2,
    question: "The equation (k − 2)x² + 8x + 4 = 0 has exactly one real solution for x, where k is a constant. What is the sum of all possible values of k?",
    answer: num(8),
    hints: [
      "Think about what kind of equation you get for different values of k, not only the generic case.",
      "A quadratic has exactly one real solution when its discriminant is zero. But the equation is only quadratic if k − 2 ≠ 0.",
      "The discriminant case gives k = 6. Now check what happens when k = 2: the equation loses its x² term.",
    ],
    explanation: "Case 1: k ≠ 2, so the equation is quadratic. Exactly one real solution means the discriminant is 0: 8² − 4(k − 2)(4) = 64 − 16(k − 2) = 0, so k − 2 = 4 and k = 6. Check: 4x² + 8x + 4 = 4(x + 1)² has the single solution x = −1.\n\nCase 2: k = 2. The equation becomes 8x + 4 = 0, which is linear and has exactly one solution, x = −1/2.\n\nBoth k = 6 and k = 2 give exactly one solution, so the sum is 8. Many students find only k = 6 and miss the case where the quadratic term disappears.",
  },
  {
    id: "c3", number: 3,
    question: "The value of a certain machine decreases by the same percent each year. After 2 years, its value is 36% less than its original value. By what percent does its value decrease each year?",
    answer: num(20),
    hints: [
      "Percent decreases that repeat multiply; they do not add.",
      "After 2 years the value is 64% of the original. How is that related to the yearly factor?",
      "If the yearly factor is r, then r² = 0.64.",
    ],
    explanation: "Let the yearly factor be r (the fraction kept each year). After 2 years the value is r² times the original, and it is 36% less, so r² = 0.64. Then r = 0.8, so each year the machine keeps 80% of its value and loses 20%.\n\nTrap: dividing 36% by 2 to get 18%. Check: 0.82² = 0.6724, which is not 0.64.",
  },
  {
    id: "c4", number: 4,
    question: "The circle with equation x² + y² − 10x + 4y + 13 = 0 intersects the x-axis at two points. What is the sum of the x-coordinates of these two points?",
    answer: num(10),
    hints: [
      "Points on the x-axis have y = 0.",
      "Substitute y = 0 and look at the resulting equation in x.",
      "x² − 10x + 13 = 0 has two real roots. You do not need to find them to find their sum.",
    ],
    explanation: "On the x-axis, y = 0, so x² − 10x + 13 = 0. The discriminant is 100 − 52 = 48 > 0, so there are two real roots. For ax² + bx + c = 0 the roots sum to −b/a = 10.\n\nNo need to complete the square or find the circle's center. Check: the roots are 5 ± 2√3, which sum to 10.",
  },
  {
    id: "c5", number: 5,
    question: "Two right circular cones are similar. The height of the larger cone is 1.5 times the height of the smaller cone. The volume of the smaller cone is 40π cubic centimeters. The volume of the larger cone is kπ cubic centimeters. What is the value of k?",
    answer: num(135),
    hints: [
      "The ratio of heights tells you the scale factor between the cones.",
      "Lengths scale by the factor, areas scale by the factor squared, and volumes scale by something else.",
      "Volumes scale by the cube of the scale factor: 1.5³ = 3.375.",
    ],
    explanation: "The scale factor is 1.5. Volumes of similar solids scale by the cube of the factor: 1.5³ = 3.375. So the larger volume is 40π · 3.375 = 135π, and k = 135.\n\nTrap: using 1.5² (the area scale) or 1.5 itself.",
  },
  {
    id: "c6", number: 6,
    question: "The function f is defined by f(x) = x² − 4x + 1. The function g is defined by g(x) = f(x + 2) − 3. What is the minimum value of g?",
    answer: num(-6),
    hints: [
      "Think about how replacing x with x + 2 changes the graph, and how subtracting 3 changes it.",
      "A horizontal shift moves where the minimum happens but not how low it is.",
      "The minimum of f is f(2) = −3. The vertical shift of −3 lowers the minimum by 3.",
    ],
    explanation: "Write f in vertex form: f(x) = (x − 2)² − 3, so its minimum value is −3 (at x = 2). The graph of g is the graph of f shifted left 2 and down 3. A horizontal shift does not change the minimum value; the vertical shift lowers it by 3, so the minimum of g is −3 − 3 = −6.\n\nCheck by expanding: g(x) = (x + 2)² − 4(x + 2) + 1 − 3 = x² + 4x + 4 − 4x − 8 − 2 = x² − 6. The minimum is −6.",
  },
  {
    id: "c7", number: 7,
    question: "y = x² + 2x + 10\ny = mx + 1\n\nIn the system above, m is a positive constant. If the system has exactly one solution, what is the value of m?",
    answer: num(8),
    hints: [
      "One solution means the line touches the parabola at exactly one point.",
      "Set the two expressions for y equal and collect all terms on one side.",
      "x² + (2 − m)x + 9 = 0 must have a zero discriminant: (2 − m)² − 36 = 0.",
    ],
    explanation: "Set the right sides equal: x² + 2x + 10 = mx + 1, so x² + (2 − m)x + 9 = 0. For exactly one solution the discriminant is zero: (2 − m)² − 4(1)(9) = 0, so (2 − m)² = 36 and 2 − m = ±6. That gives m = −4 or m = 8. The problem says m is positive, so m = 8.\n\nA good alternative: graph both with a slider for m and drag until the line touches the parabola once. It lands at m = 8 (the negative value m = −4 also touches, which is why 'positive' is in the question).",
  },
]
