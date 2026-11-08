export interface ToolkitItem {
  title: string
  formula: string[]
  relationships?: string
  recognize: string
  whenToUse: string
  example: { problem: string; solution: string }
  mistakes: string[]
}
export interface ToolkitSection {
  id: string
  name: string
  items: ToolkitItem[]
}

export const TOOLKIT: ToolkitSection[] = [
  {
    id: "algebra",
    name: "Algebra",
    items: [
      {
        title: "Slope and linear equations",
        formula: ["slope m = (y₂ − y₁)/(x₂ − x₁)", "slope-intercept: y = mx + b", "point-slope: y − y₁ = m(x − x₁)", "standard: Ax + By = C, slope = −A/B"],
        relationships: "Parallel lines have equal slopes. Perpendicular lines have slopes that multiply to −1.",
        recognize: "Two points, a rate of change, 'increases by … per …'.",
        whenToUse: "Any time something changes at a constant rate.",
        example: { problem: "A line passes through (1, 5) and (4, 14). What is its equation?", solution: "m = 9/3 = 3. Then y − 5 = 3(x − 1), so y = 3x + 2." },
        mistakes: ["Subtracting the y-values in one order and the x-values in the other.", "Confusing the slope with the y-intercept in a word problem."],
      },
      {
        title: "Systems of linear equations: number of solutions",
        formula: ["a₁x + b₁y = c₁, a₂x + b₂y = c₂", "one solution: a₁/a₂ ≠ b₁/b₂", "no solution: a₁/a₂ = b₁/b₂ ≠ c₁/c₂", "infinitely many: a₁/a₂ = b₁/b₂ = c₁/c₂"],
        relationships: "Same slope and different intercepts = parallel lines = no solution. Same slope and same intercept = same line.",
        recognize: "'No solution', 'infinitely many solutions', and an unknown constant in one equation.",
        whenToUse: "When the question asks about the number of solutions rather than their values.",
        example: { problem: "For what value of k does 2x + 3y = 7 and 4x + 6y = k have infinitely many solutions?", solution: "The second equation must be 2 times the first: k = 14." },
        mistakes: ["Matching only the x and y coefficients and forgetting the constants.", "Assuming 'no solution' when only one ratio fails."],
      },
      {
        title: "Linear inequalities and absolute value",
        formula: ["flip the sign when multiplying or dividing by a negative", "|x − a| < b means a − b < x < a + b", "|x − a| > b means x < a − b or x > a + b"],
        recognize: "Inequality symbols, 'at least', 'at most', absolute value bars.",
        whenToUse: "Constraints (at most, no more than), tolerance and distance problems.",
        example: { problem: "Solve |x − 4| ≤ 3.", solution: "−3 ≤ x − 4 ≤ 3, so 1 ≤ x ≤ 7." },
        mistakes: ["Forgetting to flip the inequality for a negative multiplier.", "Missing that |x| = −2 has no solution."],
      },
    ],
  },
  {
    id: "advanced",
    name: "Advanced Math",
    items: [
      {
        title: "Quadratic forms and the vertex",
        formula: ["standard: y = ax² + bx + c, vertex x = −b/(2a)", "vertex: y = a(x − h)² + k, vertex (h, k)", "factored: y = a(x − r)(x − s), zeros r and s", "quadratic formula: x = (−b ± √(b² − 4ac)) / (2a)"],
        relationships: "Sum of roots = −b/a. Product of roots = c/a. The axis of symmetry is halfway between the zeros.",
        recognize: "Parabola, maximum/minimum, zeros, 'when does the ball hit the ground'.",
        whenToUse: "Standard form for the y-intercept, vertex form for the max/min, factored form for zeros.",
        example: { problem: "What is the minimum value of y = x² − 6x + 14?", solution: "Vertex x = 3, y = 9 − 18 + 14 = 5." },
        mistakes: ["Forgetting that a negative a opens downward (maximum, not minimum).", "Giving the x-coordinate when the question asks for the value."],
      },
      {
        title: "Discriminant: how many real solutions",
        formula: ["D = b² − 4ac", "D > 0: two real solutions", "D = 0: one real solution", "D < 0: no real solutions"],
        recognize: "'Exactly one solution', 'no real solutions', 'for what value of k'.",
        whenToUse: "A quadratic with a constant, or a line and a parabola with a parameter.",
        example: { problem: "For which k does x² + 6x + k = 0 have exactly one solution?", solution: "36 − 4k = 0, so k = 9." },
        mistakes: ["Forgetting to move all terms to one side before reading a, b, c.", "Forgetting that if the x² coefficient could be 0, the equation may be linear."],
      },
      {
        title: "Exponential growth and decay",
        formula: ["y = a·bˣ", "growth by r% per period: y = a(1 + r)ᵗ", "decay by r% per period: y = a(1 − r)ᵗ", "every p periods the quantity multiplies by f: y = a·f^(t/p)"],
        relationships: "Percent changes multiply. 20% up then 20% down is not back to start (1.2 × 0.8 = 0.96).",
        recognize: "'Increases by 5% each year', 'doubles every', 'half-life'.",
        whenToUse: "Constant percent change or constant multiplication per period.",
        example: { problem: "A population of 400 doubles every 3 years. How many after 9 years?", solution: "9 years is 3 doublings: 400 × 2³ = 3,200." },
        mistakes: ["Using 5 instead of 1.05.", "Confusing the period in the exponent (t/p, not t·p)."],
      },
      {
        title: "Polynomials, remainders, and composition",
        formula: ["if p(r) = 0 then (x − r) is a factor", "remainder when p(x) is divided by (x − r) is p(r)", "(f∘g)(x) = f(g(x)): evaluate g first", "completing the square: x² + bx + (b/2)² = (x + b/2)²"],
        recognize: "'A factor of the polynomial', 'remainder', 'f(g(x))'.",
        whenToUse: "Questions about zeros, factors, or nested functions.",
        example: { problem: "What is the remainder when x² + 3x − 5 is divided by x − 2?", solution: "p(2) = 4 + 6 − 5 = 5." },
        mistakes: ["Using p(−2) instead of p(2) for division by (x − 2).", "Evaluating the outer function first in a composition."],
      },
    ],
  },
  {
    id: "geometry",
    name: "Geometry",
    items: [
      {
        title: "Triangles and similarity",
        formula: ["angles sum to 180°", "Pythagorean theorem: a² + b² = c²", "special right triangles: 45-45-90 sides 1 : 1 : √2, and 30-60-90 sides 1 : √3 : 2", "similar triangles: corresponding sides are proportional"],
        relationships: "Scale factor k: lengths ×k, areas ×k², volumes ×k³.",
        recognize: "Parallel lines cutting a triangle, 'similar', shadows and heights.",
        whenToUse: "Any triangle with a missing side or angle.",
        example: { problem: "In similar triangles, sides 4 and 10 correspond. If a side of the smaller is 6, what is the matching side of the larger?", solution: "Scale factor 10/4 = 2.5, so 6 × 2.5 = 15." },
        mistakes: ["Matching sides in the wrong order.", "Using the area scale for a length question."],
      },
      {
        title: "Circles",
        formula: ["circumference = 2πr", "area = πr²", "arc length = (θ/360)·2πr", "sector area = (θ/360)·πr²", "equation: (x − h)² + (y − k)² = r²"],
        relationships: "Central angle equals its arc in degrees. An inscribed angle is half the arc it intercepts.",
        recognize: "Arcs, sectors, central angles, and an equation with x² and y² both present.",
        whenToUse: "Questions on circle measurement or a circle's equation.",
        example: { problem: "What is the radius of x² + y² + 6x − 8y = 0?", solution: "(x + 3)² + (y − 4)² = 25, so r = 5." },
        mistakes: ["Giving r² as the radius.", "Wrong sign for the center: (x + 3) means h = −3."],
      },
      {
        title: "Area, surface area, and volume",
        formula: ["rectangle: lw; triangle: ½bh; trapezoid: ½(b₁ + b₂)h", "box volume: lwh", "cylinder volume: πr²h; cone: ⅓πr²h; sphere: ⁴⁄₃πr³", "cylinder lateral area: 2πrh", "cone lateral area: πr·slant"],
        recognize: "3D solids, 'how much water', 'paint needed'.",
        whenToUse: "Any 2D or 3D measurement question. The SAT reference sheet gives many of these, but memorize the common ones.",
        example: { problem: "A cylinder has radius 3 and height 10. What is its volume?", solution: "π(9)(10) = 90π." },
        mistakes: ["Mixing volume and surface area.", "Using the diameter as the radius."],
      },
    ],
  },
  {
    id: "trig",
    name: "Trigonometry",
    items: [
      {
        title: "Right-triangle ratios",
        formula: ["sin θ = opposite / hypotenuse", "cos θ = adjacent / hypotenuse", "tan θ = opposite / adjacent", "SOH-CAH-TOA"],
        relationships: "sin θ = cos(90° − θ) for complementary angles.",
        recognize: "A right triangle with an angle and one side, or 'sine of angle A'.",
        whenToUse: "Finding a side or ratio in a right triangle.",
        example: { problem: "If sin A = 5/13 in a right triangle, what is cos A?", solution: "Sides 5, 12, 13 give cos A = 12/13." },
        mistakes: ["Mislabeling opposite and adjacent (they depend on the angle).", "Leaving the calculator in radians when the angle is in degrees."],
      },
      {
        title: "Radians and the unit circle",
        formula: ["180° = π radians", "degrees to radians: multiply by π/180", "radians to degrees: multiply by 180/π", "sin 30° = ½, cos 60° = ½, sin 45° = √2/2, sin 60° = √3/2"],
        relationships: "On the unit circle, (cos θ, sin θ) is the point at angle θ.",
        recognize: "An angle in π form, or 'in radians'.",
        whenToUse: "Questions that give angles in radians or ask about the coordinates on a circle.",
        example: { problem: "What is sin(π/6)?", solution: "π/6 = 30°, so the value is ½." },
        mistakes: ["Mixing degree and radian values.", "Forgetting the sign in other quadrants."],
      },
    ],
  },
]
