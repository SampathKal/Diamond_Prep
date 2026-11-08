/**
 * Vercel serverless function: POST /api/scan
 * Body: { text?: string, image?: { mediaType: string, data: string (base64) } }
 * The OpenAI key stays on the server (OPENAI_API_KEY). It is never sent to the browser.
 * The model may only recommend techniques that exist in api/library.json (generated from src/data/techniques.ts).
 */
import { readFileSync } from "node:fs"
import { join } from "node:path"

interface Req { method?: string; body?: unknown }
interface Res { status(c: number): Res; json(b: unknown): void; setHeader(k: string, v: string): void }
interface LibItem { id: string; name: string; category: string; recognize: string; useful: string; notWhen: string; desmosLines: string[]; lookFor: string; algebraNote: string }

const MODEL = process.env.OPENAI_MODEL || "gpt-4o"
const MAX_B64 = 6_000_000
const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/gif"]

let LIB: LibItem[] = []
try {
  LIB = JSON.parse(readFileSync(join(process.cwd(), "api", "library.json"), "utf8")) as LibItem[]
} catch {
  LIB = []
}

const libraryText = () =>
  LIB.map((t) => `- id: ${t.id}\n  name: ${t.name}\n  recognize: ${t.recognize}\n  useful: ${t.useful}\n  NOT when: ${t.notWhen}\n  desmos: ${t.desmosLines.join(" ; ")}\n  look for: ${t.lookFor}`).join("\n")

const SYSTEM = () => `You are the question scanner inside Diamond, an SAT math study app. The student sends an SAT math question (text or a photo).

You have a curated LIBRARY of Desmos techniques. You may recommend ONLY techniques from this library, by their exact id. Never invent a Desmos trick that is not in the library.

LIBRARY
${libraryText() || "(library unavailable: recommend no techniques)"}

Rules
1. Do NOT force Desmos. If algebra or mental math is as fast or faster, say so and set use_desmos to "no" (or "either") and technique_ids to [].
2. Only recommend a library technique if the question really matches its "recognize" and does not hit its "NOT when". Explain exactly why it applies.
3. desmos_lines must be adapted to THIS question's actual numbers, in plain Desmos syntax (for example y=x^2-4x+3). Use [] when Desmos is not recommended. For a table technique write a line like "table: x1 = 3, 8 | y1 = 7, 22".
4. Also give a traditional (non-Desmos) solution.
5. If the image or text is unclear, incomplete, or you are not sure, set confidence to "low" and put one specific question in needs_clarification. Do not guess numbers that are not visible.
6. If it is not an SAT math question, set is_sat_math to false and explain briefly in "why".

Reply with ONLY a JSON object with these keys:
{"is_sat_math": boolean, "topic": string, "pattern": string, "structure": string,
 "technique_ids": string[], "use_desmos": "yes"|"no"|"either", "why": string,
 "desmos_lines": string[], "read_the_result": string, "method": string[],
 "algebra_version": string, "pitfalls": string[], "answer": string,
 "confidence": "high"|"medium"|"low", "needs_clarification": string}
"structure" is one sentence on how the question is built (what is given, what is asked). "read_the_result" says what to look for in Desmos and how to turn it into the answer ("" if no Desmos). "answer" is "" unless you are confident.`

const str = (v: unknown, max = 1200) => (typeof v === "string" ? v.slice(0, max) : "")
const strs = (v: unknown, n = 8) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string").slice(0, n).map((x) => x.slice(0, 400)) : [])

export default async function handler(req: Req, res: Res) {
  res.setHeader("Cache-Control", "no-store")
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST." })
  const key = process.env.OPENAI_API_KEY
  if (!key) return res.status(503).json({ error: "The scanner is not configured yet (missing OPENAI_API_KEY on the server)." })

  const body = (req.body ?? {}) as { text?: unknown; image?: { mediaType?: unknown; data?: unknown } }
  const text = typeof body.text === "string" ? body.text.trim().slice(0, 4000) : ""
  const img = body.image
  const content: unknown[] = []
  if (img) {
    const mt = typeof img.mediaType === "string" ? img.mediaType : ""
    const data = typeof img.data === "string" ? img.data : ""
    if (!ALLOWED.includes(mt)) return res.status(400).json({ error: "Image must be PNG, JPEG, WebP or GIF." })
    if (!data || data.length > MAX_B64) return res.status(413).json({ error: "Image is missing or too large (max about 4 MB)." })
    content.push({ type: "image_url", image_url: { url: `data:${mt};base64,${data}` } })
  }
  if (text) content.push({ type: "text", text })
  if (!content.length) return res.status(400).json({ error: "Send some text or an image of the question." })

  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1500,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM() },
          { role: "user", content },
        ],
      }),
    })
    if (!r.ok) {
      const msg = r.status === 401 ? "The server's OpenAI key was rejected. Check OPENAI_API_KEY." : r.status === 429 ? "OpenAI rate limit or no credit on this key. Check your OpenAI billing." : "The scanner service returned an error. Try again in a moment."
      return res.status(502).json({ error: msg })
    }
    const data = (await r.json()) as { choices?: { message?: { content?: string } }[] }
    const raw = data.choices?.[0]?.message?.content ?? ""
    const start = raw.indexOf("{")
    const end = raw.lastIndexOf("}")
    if (start < 0 || end < start) return res.status(502).json({ error: "Couldn't read the scanner's reply. Try again." })
    const m = JSON.parse(raw.slice(start, end + 1)) as Record<string, unknown>

    // Only techniques that really exist in the library survive. Anything else the model made up is dropped.
    const ids = strs(m.technique_ids, 4).filter((id) => LIB.some((t) => t.id === id))
    const techniques = ids.map((id) => {
      const t = LIB.find((x) => x.id === id)!
      return { id: t.id, name: t.name }
    })
    const ud = m.use_desmos === "yes" || m.use_desmos === "no" || m.use_desmos === "either" ? m.use_desmos : "either"
    const conf = m.confidence === "high" || m.confidence === "medium" || m.confidence === "low" ? m.confidence : "low"
    return res.status(200).json({
      is_sat_math: m.is_sat_math !== false,
      topic: str(m.topic, 120),
      pattern: str(m.pattern),
      structure: str(m.structure),
      techniques,
      use_desmos: techniques.length === 0 && ud === "yes" ? "either" : ud,
      why: str(m.why),
      desmos_lines: techniques.length ? strs(m.desmos_lines, 10) : [],
      read_the_result: techniques.length ? str(m.read_the_result) : "",
      method: strs(m.method, 8),
      algebra_version: str(m.algebra_version),
      pitfalls: strs(m.pitfalls, 4),
      answer: str(m.answer, 80),
      confidence: conf,
      needs_clarification: str(m.needs_clarification, 400),
    })
  } catch {
    return res.status(502).json({ error: "Couldn't reach the scanner service. Try again." })
  }
}
