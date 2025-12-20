# 🔮 SeoulScript

> **AI-powered K-drama fanfiction generator with a social feed**

SeoulScript lets you generate emotional, short-form K-drama scripts using AI, edit them, and share them in a beautiful social feed. Built with Next.js, FastAPI, and local LLMs.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-green)](https://fastapi.tiangolo.com/)
[![Ollama](https://img.shields.io/badge/Ollama-Mistral-purple)](https://ollama.ai/)

---

## ✨ Features

- 🎬 **AI Story Generation** - Generate unique K-drama scripts in 6 genres
- ✏️ **Story Editor** - Edit AI-generated content before publishing
- 📱 **Social Feed** - Browse stories with genre filtering and pagination
- 🔗 **Public Sharing** - Every story gets a shareable read-only URL
- 👤 **Anonymous Posting** - No sign-up required, browser-based user IDs
- 🌙 **Seoul Night Aesthetic** - Dark, cinematic UI with purple/blue gradients

---

## 🎯 Genres

- 💕 Romance
- 😢 Melodrama
- 😄 Comedy
- 🔪 Thriller
- ✨ Fantasy
- 🏛️ Historical

---

## 🚀 Quick Start

### Prerequisites

- Python 3.11+ ([Download](https://www.python.org/downloads/))
- Node.js 18+ ([Download](https://nodejs.org/))
- Ollama ([Download](https://ollama.com/download))

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/seoulscript.git
cd seoulscript
```

### 2. Setup Backend

```bash
cd backend

# Create virtual environment (Python 3.11)
py -3.11 -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn[standard] pydantic requests python-multipart

# Start backend server
python main.py
```

Backend runs on: **http://localhost:8000**

### 3. Setup Frontend

Open a **new terminal**:

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on: **http://localhost:3000**

### 4. Setup AI Model

Open a **third terminal**:

```bash
# Download Mistral model (~4GB)
ollama pull mistral

# Start Ollama (if not auto-started)
ollama serve
```

---

## 🎮 Usage

1. Open **http://localhost:3000** in your browser
2. Click **"Create"** button
3. Choose a genre (e.g., Romance 💕)
4. Wait 15-30 seconds for AI generation
5. Edit the story if desired
6. Click **"Publish Story"**
7. Share your story URL with friends!

---

## 📁 Project Structure

```
seoulscript/
├── backend/
│   ├── main.py              # FastAPI app
│   ├── database.py          # SQLite database layer
│   ├── llm_service.py       # AI story generator
│   ├── requirements.txt     # Python dependencies
│   └── data/
│       ├── structure.json   # Story structure templates
│       ├── tropes.json      # Genre-specific tropes
│       └── summaries.txt    # K-drama writing guide
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx         # Home feed
│   │   ├── create/          # Story creation
│   │   └── story/[id]/      # Story view
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── GenreSelector.tsx
│   │   ├── StoryCard.tsx
│   │   └── LoadingStars.tsx
│   └── package.json
│
└── README.md
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Styling:** TailwindCSS
- **Animations:** Framer Motion
- **Language:** TypeScript

### Backend
- **Framework:** FastAPI (Python)
- **Database:** SQLite
- **Validation:** Pydantic
- **Server:** Uvicorn

### AI/LLM
- **Platform:** Ollama (local inference)
- **Model:** Mistral 7B
- **Alternative:** Swappable to cloud APIs (Claude, GPT, etc.)

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/genres` | Get available genres |
| `POST` | `/api/generate` | Generate story from genre |
| `POST` | `/api/stories` | Save a story |
| `GET` | `/api/stories` | Get story feed (paginated) |
| `GET` | `/api/stories/:id` | Get single story (public) |

---

## 🎨 Design Philosophy

- **Seoul Night Vibes:** Dark navy/black backgrounds with violet/purple accents
- **Typography:** Playfair Display (serif titles) + JetBrains Mono (scripts)
- **Animations:** Subtle, smooth transitions - no clutter
- **Mobile-First:** Fully responsive design

---

## 🐛 Troubleshooting

### "Failed to generate story"
**Cause:** Ollama isn't running  
**Fix:** Run `ollama serve` in a terminal

### CORS errors
**Cause:** Backend/frontend on wrong ports  
**Fix:** Ensure backend on `:8000` and frontend on `:3000`

### Stories not saving
**Cause:** Database not initialized  
**Fix:** Restart backend - it auto-creates the database

### Slow generation
**Cause:** CPU inference is slower than GPU  
**Fix:** First generation takes ~30s, subsequent ones are faster (~15s)

---

## 🚧 Roadmap

- [ ] User accounts with authentication
- [ ] Story likes and bookmarks
- [ ] Comments system
- [ ] AI-generated cover images
- [ ] Export stories to PDF
- [ ] Genre remixing
- [ ] Premium features (longer stories, custom prompts)
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Inspiration:** Korean drama storytelling and Webtoon aesthetics
- **AI Model:** Mistral 7B via Ollama
- **Fonts:** Playfair Display, JetBrains Mono
- **UI Framework:** Next.js, TailwindCSS, Framer Motion

---

## 📧 Contact

**Project Maintainer:** jabir
**GitHub:** [@yourusername](https://github.com/jabirmb1)  


---

## 🌟 Show Your Support

If you like this project, please give it a ⭐ on GitHub!

---

**Built with ❤️ and inspired by Seoul nights 🌙**
