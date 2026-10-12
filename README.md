# 🌿 TouchQuest • Explore More. Scroll Less.

> A mobile-first, AI-powered nature exploration companion designed to break algorithmic dopamine loops, inspire real-world outdoor micro-adventures, identify local biodiversity, and record avian bioacoustics.

---

## 🌲 Vision & Problem Statement

Modern feeds and short-form algorithms are tuned for continuous retention. **TouchQuest flips the paradigm**: instead of keeping you on the glass screen, it gives you a tactile outdoor quest (15, 30, or 60 minutes), guides your attention toward local flora and birdsong, and asks you to pocket the phone.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14+ (App Router) with TypeScript & React 19
- **Design System:** Vanilla Tailwind CSS with custom nature palette (Forest green `#123324`, Muted sage `#88a38d`, Warm cream `#faf8f2`, Earth ochre `#c27d38`), responsive mobile-first bottom navigation, glassmorphism tokens
- **Icons:** `lucide-react`
- **Database & Auth:** Supabase (PostgreSQL with Row-Level Security, Auth, Storage)
- **Maps:** Leaflet & OpenStreetMap (Privacy-preserving local green space tiles)
- **AI Models (100% Genuine Open Weights via Hosted Inference):**
  - **Outdoor Missions:** Groq Cloud `qwen/qwen3.8-27b` (sub-second JSON generation) or Hugging Face Router v1 (`Qwen/Qwen2.5-7B-Instruct`)
  - **Nature Scanner:** Groq Cloud `qwen/qwen3.8-27b` (multimodal botanical and wildlife vision) or Hugging Face Router v1 (`Qwen/Qwen2.5-VL-72B-Instruct`)
  - **BirdCall AI:** Server-side route with 10MB upload limit and dedicated Cornell BirdNET endpoint hook (`HF_AUDIO_ENDPOINT`)
- **Deployment:** Vercel ready

---

## 🚀 Quickstart

1. **Clone and Install:**
   ```bash
   git clone https://github.com/parthbadgire-code/touchquest.git
   cd touchquest
   npm install
   ```

2. **Configure Environment:**
   ```bash
   cp .env.example .env.local
   ```
   Add your `GROQ_API_KEY` (100% free at [console.groq.com/keys](https://console.groq.com/keys), no credit card required) or `HF_API_TOKEN`.

3. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 📋 Core Capabilities
 
| Component | Status | Features |
|---|---|---|
| **Design System & Shell** | ✅ Production | Nature palette, typography, glassmorphism, mobile thumb navigation |
| **Explorer Dashboard** | ✅ Production | Streak counter, quick quests, sensory reminders, recent sightings |
| **AI Mission Generator** | ✅ Production | Sub-second outdoor quests customized by duration and terrain |
| **Nature Vision Scanner** | ✅ Production | Multimodal AI classification for plants, trees, fungi, and wildlife |
| **Interactive Nature Map** | ✅ Production | Leaflet + OpenStreetMap tiles, GPS geolocation, and Overpass API green spaces |
| **Field Nature Journal** | ✅ Production | Sensory note logging, offline minute tracking, search & tag filtering |
| **Auth & Data Security** | ✅ Production | Supabase Auth with PostgreSQL Row-Level Security and Guest fallback |

---

## 📜 License
MIT © TouchQuest Open-Source Contributors.
