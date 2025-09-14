# server.py
import os
import json
import time
from pathlib import Path
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware 

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv  ## for importing api keys from .env file

# Load .env if present
load_dotenv()

# --- OpenAI client ---
try:
    # new OpenAI Python SDK
    from openai import OpenAI
except Exception as e:
    OpenAI = None

# ---------- Config- API----------
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")  # change as needed

if OpenAI is None:
    raise RuntimeError("OpenAI SDK not installed. pip install openai>=1.40.0")

if not OPENAI_API_KEY:
    print("⚠️  OPENAI_API_KEY not set. The server will run but LLM calls will fail until you set the key.")

client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None

## ---------- Paths ----------
BASE = Path(__file__).parent
STRUCTURE_PATH = BASE / "structure.json"
TROPES_PATH = BASE / "tropes.json"
SUMMARIES_PATH = BASE / "summaries.txt"
OUTPUT_DIR = BASE / "outputs"
OUTPUT_DIR.mkdir(exist_ok=True)

# ---------- Load data ----------
def load_structure():
    if not STRUCTURE_PATH.exists():
        raise FileNotFoundError(f"{STRUCTURE_PATH} not found")
    with STRUCTURE_PATH.open("r", encoding="utf-8") as f:
        data = json.load(f)
    # Accept both {"structure": {...}} or {"genres": {...}}
    if "structure" in data and "genres" in data["structure"]:
        return data["structure"]
    if "genres" in data:
        return data
    raise ValueError("structure.json must contain 'structure.genres' or 'genres' top-level")

def load_tropes():
    if not TROPES_PATH.exists():
        raise FileNotFoundError(f"{TROPES_PATH} not found")
    with TROPES_PATH.open("r", encoding="utf-8") as f:
        return json.load(f)

def load_summaries():
    if not SUMMARIES_PATH.exists():
        return []
    with SUMMARIES_PATH.open("r", encoding="utf-8") as f:
        # each summary separated by blank line
        contents = f.read().strip()
        if not contents:
            return []
        return [s.strip() for s in contents.split("\n\n") if s.strip()]

structure = load_structure()
tropes_data = load_tropes()
summaries_list = load_summaries()

# ---------- Prompts ----------
STORYBOARD_PROMPT = """You are a seasoned K-drama head writer.
Using the provided episode brief and tropes, write a concise, production-friendly STORYBOARD.

Requirements:
- Keep it visual: 6–10 numbered beats (SCENE 1, SCENE 2, …).
- Each beat: 1–3 sentences.
- Weave in the tropes naturally.
- End with a mini-hook for the next episode.

Context:
Genre: {genre}
Episode Range: {ep_range}
Episode Brief: {description}
Tropes: {tropes}
Examples (optional): {examples}

Output as Markdown.
"""

SCRIPT_PROMPT = """You are a seasoned K-drama head writer.
Using the provided episode brief and tropes, write a short SCRIPT (3 scenes) suitable for a table read.

Requirements:
- Use screenplay-like formatting: INT./EXT., ACTION, CHARACTER, DIALOGUE.
- 3 short scenes (each scene ~8-16 lines).
- Keep dialogue natural and subtexty.
- Weave in the tropes naturally.
- End with a stinger.

Context:
Genre: {genre}
Episode Range: {ep_range}
Episode Brief: {description}
Tropes: {tropes}
Examples (optional): {examples}

Output as Markdown.
"""

# ---------- Helpers ----------
def get_ordered_episodes(episodes_dict):
    def key_fn(k):
        try:
            start = int(k.split("-")[0])
        except:
            start = 9999
        return start
    return [k for k in sorted(episodes_dict.keys(), key=key_fn)]

def make_title(description: str) -> str:
    if "–" in description:
        return description.split("–")[0].strip()
    if "-" in description:
        return description.split("-")[0].strip()
    return description[:60]

def build_prompt(mode: str, genre: str, ep_range: str, description: str, tropes: List[str], examples: Optional[List[str]] = None):
    examples_text = ""
    if examples:
        # include up to 3 short examples if present
        examples_text = " | ".join(examples[:3])
    tmpl = SCRIPT_PROMPT if mode == "script" else STORYBOARD_PROMPT
    return tmpl.format(
        genre=genre.replace("_", " "),
        ep_range=ep_range,
        description=description,
        tropes=", ".join(tropes) if tropes else "None",
        examples=examples_text
    )

def call_llm(prompt: str, model: str = OPENAI_MODEL, max_retries: int = 3, temperature: float = 0.9, max_tokens: int = 900):
    if client is None:
        raise RuntimeError("OPENAI_API_KEY not set. Cannot call LLM.")
    for attempt in range(max_retries):
        try:
            resp = client.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": prompt}],
                temperature=temperature,
                max_tokens=max_tokens
            )
            content = resp.choices[0].message.content
            if content is not None:
                return content.strip()
            else:
                return ""
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            time.sleep(1.5 * (attempt + 1))

# ---------- FastAPI app ----------
app = FastAPI(title="SeoulScript AI service")

class GenRequest(BaseModel):
    genre: str
    mode: Optional[str] = "storyboard"   # or "script"
    episode: Optional[str] = None       # e.g., "1-2" or None to generate all blocks
    examples: Optional[bool] = False    # include examples from summaries.txt

@app.get("/genres")
def list_genres():
    return {"genres": list(structure.get("genres", {}).keys())}

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://127.0.0.1",
    "http://127.0.0.1:5500", # Common for VS Code Live Server
    "null" # To allow opening the HTML file directly
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/generate")
def generate_endpoint(req: GenRequest):
    return generate(req)


def generate(req: GenRequest):
    if req.genre not in structure.get("genres", {}):
        raise HTTPException(status_code=400, detail=f"Genre '{req.genre}' not found")

    genre_obj = structure["genres"][req.genre]
    episodes = genre_obj.get("episodes", {})
    if not episodes:
        raise HTTPException(status_code=400, detail=f"No episodes defined for genre {req.genre}")

    ordered = get_ordered_episodes(episodes)
    if req.episode:
        if req.episode not in episodes:
            raise HTTPException(status_code=400, detail=f"Episode block {req.episode} not found")
        ordered = [req.episode]

    # choose examples if requested
    examples = summaries_list if (req.examples and summaries_list) else None

    result_sections = []
    for ep_range in ordered:
        ep_info = episodes[ep_range]
        if isinstance(ep_info, dict):
            desc = ep_info.get("description", "")
            tropes = ep_info.get("tropes", []) or genre_obj.get("optional_tropes", [])
        else:
            desc = str(ep_info)
            tropes = genre_obj.get("optional_tropes", [])

        prompt = build_prompt(req.mode if req.mode is not None else "storyboard", req.genre, ep_range, desc, tropes, examples)
        try:
            text = call_llm(prompt)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"LLM call failed: {e}")

        result_sections.append({
            "episode": ep_range,
            "description": desc,
            "tropes": tropes,
            "generated": text
        })

    # Save to file for review
    ts = int(time.time())
    out_path = OUTPUT_DIR / f"{req.genre}_{req.mode}_{ts}.json"
    out_path.write_text(json.dumps(result_sections, ensure_ascii=False, indent=2), encoding="utf-8")

    return {"status": "ok", "file": str(out_path), "result": result_sections}
