/** Writes api/library.json from src/data/techniques.ts so the scanner server can ground its answers in it. */
import { writeFileSync } from "node:fs"
import { TECHNIQUES } from "../src/data/techniques"
import { exprLines } from "../src/lib/exprs"

const lib = TECHNIQUES.map((t) => ({
  id: t.id,
  name: t.name,
  category: t.category,
  recognize: t.recognize,
  useful: t.useful,
  notWhen: t.notWhen,
  desmosLines: exprLines(t.setup),
  lookFor: t.lookFor,
  algebraNote: t.algebraNote,
}))
writeFileSync(new URL("../api/library.json", import.meta.url), JSON.stringify(lib, null, 1))
console.log(`api/library.json: ${lib.length} techniques`)
