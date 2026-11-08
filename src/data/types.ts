export type Difficulty = "Easy" | "Medium" | "Hard"

/** One line (or table) to load into the real Desmos calculator through setExpressions. */
export interface DesmosExpr {
  latex?: string
  type?: "table"
  columns?: { latex: string; values: string[] }[]
  sliderBounds?: { min: string; max: string; step?: string }
  color?: string
  hidden?: boolean
  lines?: boolean
  points?: boolean
}

export interface DesmosSetup {
  expressions: DesmosExpr[]
  /** Switch Desmos to degree mode (trig problems). */
  degrees?: boolean
  /** Graph window. */
  bounds?: { left: number; right: number; bottom: number; top: number }
}

/** A single numeric or multiple-choice answer. */
export type Answer =
  | { kind: "mc"; choices: string[]; correct: number } // correct = index into choices
  | { kind: "num"; value: number; tol?: number; display?: string }

export interface Problem {
  id: string
  number: number
  topic: string
  difficulty: Difficulty
  question: string
  answer: Answer
  explanation: string
  /** Optional visualisation shown in a real Desmos calculator. */
  viz?: DesmosSetup
  vizNote?: string
}

export interface Technique {
  id: string
  name: string
  category: string
  what: string
  recognize: string
  useful: string
  notWhen: string
  example: { question: string; steps: string[]; answerText: string }
  setup: DesmosSetup
  lookFor: string
  mistakes: string[]
  algebraNote: string
  practice: { question: string; answer: Answer; explanation: string; setup?: DesmosSetup }
}

export interface ChallengeQ {
  id: string
  number: number
  question: string
  answer: Answer
  hints: [string, string, string]
  explanation: string
}

export interface RWStrategy {
  id: string
  name: string
  pattern: string
  doThis: string[]
  traps: string[]
  whenToUse: string
  practice: {
    passage: string
    question: string
    choices: string[]
    correct: number
    explanation: string
  }
}
