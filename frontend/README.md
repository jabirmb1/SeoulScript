# SeoulScript Frontend (App Router)

Night-sky themed Next.js + TailwindCSS UI for generating AI K-drama scenes.

## Stack
- Next.js 14 (App Router)
- TailwindCSS
- Framer Motion

## Setup
1) Create `.env.local`:
```
NEXT_PUBLIC_API_BASE=http://localhost:8000
```

2) Install deps:
```
npm install
```

3) Run dev server:
```
npm run dev
```

Open http://localhost:3000

## Usage
- Pick a genre then click "🎬 Generate Scene".
- Copy to clipboard with the Copy button.
- Reset to clear the result.

## Notes
- Ensure the FastAPI backend is running and exposes POST /api/generate.
- CORS is enabled in the backend for http://localhost:3000.
