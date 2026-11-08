# Diamond: SAT prep that teaches method choice

Vite + React + TypeScript + Tailwind v4. No database; progress lives in localStorage.

## Run
    npm install
    npm run dev        # http://localhost:5173
    npm run verify     # re-checks every numeric answer key with an independent script
    npm run build

## Deploy to Vercel
1. Unzip, push to GitHub (or run `vercel` in this folder). Framework preset: Vite. Build `npm run build`, output `dist`.
2. Environment variables (Project Settings):
   - `OPENAI_API_KEY`  server only. Powers /api/scan (Scan a Question). Without it the page shows a friendly "not configured" message.
   - `VITE_DESMOS_API_KEY` your own key from https://www.desmos.com/api (a demo key is used if unset: fine for testing).
3. Add your music file at `public/audio/radiant-foundry-kaino.mp3` (see the README there).

## Gem images
Levels are Stone, Quartz, Jade, Ruby, Diamond. Paste your image link for each one in `src/data/gems.ts`
(a full https:// URL, or a path like `/gems/ruby.png` for a file in `public/gems/`). Any gem left empty uses a small drawn gem.

## Scanner and the technique library
`npm run build` runs `npm run library` first, which writes `api/library.json` from `src/data/techniques.ts`.
The scanner can only recommend techniques from that file. If you edit techniques, run `npm run library` (or just build).
Locally the scanner needs `npx vercel dev`; `npm run dev` cannot run `/api`.

## Timed exam
`/exam` picks random problems, runs a countdown, pauses and locks the music while the clock runs, and gives a review at the end.

## Content
- `src/data/problems.ts`    27 practice problems (easy → hard)
- `src/data/techniques.ts`  22 Desmos techniques with "when NOT to use it"
- `src/data/challenge.ts`   the 7 hard questions (no method hints)
- `src/data/rw.ts`          10 Reading & Writing strategies, each with an original practice item
- `src/data/toolkit.ts`     math toolkit

All questions are original. Not affiliated with the College Board or Desmos.
