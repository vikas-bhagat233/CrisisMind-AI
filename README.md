# 🌪️ CrisisMind AI

**AI-powered Crisis Intelligence & Decision Support Platform.**

Type one sentence about what's happening — a flood, an earthquake, a wildfire, or even a cybersecurity incident — and a crew of seven cooperative AI agents will research it, evaluate local environmental parameters, calculate a risk profile, and generate a concrete action plan, checklists, and emergency communication drafts in seconds.

```
"There is a flood in Mumbai. What should I do?"
        │
        ▼
 Planner → Research (Weather & Location) → Risk → Response → Communication → Summary → Validator
        │
        ▼
   Full Interactive Crisis Report & Emergency Kit, Live
```

---

## ✨ Core Features & Enhancements

* 🤖 **Agentic Reasoning Pipeline**: Visualized live agent coordination (Planner → Research → Risk Assessment → Response Playbook → Communications → Summary → Validator).
* 🗺️ **Interactive Leaflet Mapping**: Auto-geocoding of epicenters and dynamic, deterministic mock shelter coordinates overlayed with custom pulsing SVG markers.
* 🌤️ **Real-Time Weather Widget**: Dynamic integration of meteorological forecasts (temperature, wind, precipitation, and conditions) via Open-Meteo.
* 🌐 **Dynamic Multilingual Support**: Instantly translate full crisis reports into **Spanish 🇪🇸**, **French 🇫🇷**, **Hindi 🇮🇳**, or **Chinese 🇨🇳** in parallel using the Fireworks LLM.
* 🔊 **Listen Briefing (TTS)**: Clean voice-synthesis engine that reads reports aloud with appropriate accents and translated transition headers based on the active language.
* 🎙️ **Voice Typing (STT)**: Speak into the hero search input on the Home page to transcribe and start your analysis hands-free.
* 🌍 **Live Emergency Alert Feed**: Connects to the USGS Earthquakes live API and features realistic fallback emergency warnings with single-click "Analyze" redirections.
* 📶 **Offline Emergency Response Kit**:
  - Registered Service Worker (`sw.js`) that caches pages and API calls for offline usage.
  - Export tools for **Markdown**, **JSON**, and a **standalone Offline HTML Kit** designed to be stored and run locally on any device during power or cellular outages.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React + TypeScript + Tailwind CSS (Vite) |
| **Backend** | FastAPI (Python 3.10+) |
| **Multi-agent Orchestration** | LangGraph |
| **LLM Inference** | Fireworks AI (`deepseek-v4-pro`) |
| **Search Engine** | Tavily |
| **Weather / Geocoding** | Open-Meteo API (Free, keyless) |
| **Database** | Supabase |
| **Mapping Engine** | Leaflet & React-Leaflet |
| **Service Worker** | Custom PWA Caching |

---

## 🚀 Quick Start (Local Setup)

### 1. Backend API
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   # Windows:
   .venv\Scripts\Activate.ps1
   # macOS/Linux:
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy the environment template and fill in your keys:
   ```bash
   cp .env.example .env
   ```
5. Spin up the server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   *API documentation will be available at `http://localhost:8000/docs`.*

> [!TIP]
> **No API keys?** The backend defaults cleanly to a mock mode when keys are missing. You can still test the entire system, maps, weather, voice reader, and translations offline.

---

### 2. Frontend Web App
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open your browser to `http://localhost:5173`.

---

### 3. Or both at once
If you prefer running everything in containerized services:
```bash
docker compose up --build
```

---

## 📂 Project Structure

```
CrisisMind-AI/
├── frontend/     # React + TS client (pages, components, PWA sw.js)
├── backend/      # FastAPI server (agents, workflow graph, database connections)
├── database/     # Supabase migrations and schema definitions
├── docs/         # System architecture, API structures, and prompts documentation
└── deployment/   # Deployment configurations (Vercel, Render configs)
```

---

## 📖 Deployment Walkthrough

To host the application live on the web:
1. **Database**: Use a free PostgreSQL instance on **Supabase**.
2. **Backend**: Host on **Render** (as a Web Service pointed to `/backend`).
3. **Frontend**: Host on **Vercel** (pointing to `/frontend` using Vite settings).

For a complete step-by-step tutorial, check out the saved [Deployment Guide](file:///C:/Users/Vikas/.gemini/antigravity/brain/45c0f5c9-6a40-47db-960d-995167ec421c/deployment_walkthrough.md).

---

## 📜 License
This project is licensed under the MIT License — see the `LICENSE` file for details.
