# SeoulScript — MVP Setup

This is a minimal full-stack MVP for generating short K-drama scenes.

- Backend: FastAPI (Python) — exposes POST /api/generate
- Frontend: Next.js + Tailwind (web/)

## 1) Backend

Requirements (already in repo): `fastapi`, `uvicorn`, `python-dotenv`, `openai>=1.40.0`

Create `.env` in project root with:

```
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_MVP_MODEL=gpt-4o-mini
```

Run server:

```
python -m uvicorn main:app --reload --port 8000
```

Test:

```
curl -X POST http://localhost:8000/api/generate -H "Content-Type: application/json" -d '{"genre":"romcom"}'
```

## 2) Frontend (web/)

Create a `.env.local` in `web/`:

```
NEXT_PUBLIC_API_BASE=http://localhost:8000
```

Install and run:

```
cd web
npm install
npm run dev
```

Open http://localhost:3000 and generate a scene.

## Deploy

- Frontend: Vercel — set env `NEXT_PUBLIC_API_BASE` to your backend URL.
- Backend: Render/Railway — expose `/api/generate` public endpoint.
