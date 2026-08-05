# RAIL GENIUS — AI Railway Traffic Control System

> Real-time AI-powered railway traffic management for the Indian rail corridor network.

---

## Overview

**RAIL GENIUS** is an intelligent railway operations dashboard that uses AI to predict track conflicts, optimize train schedules, and dispatch real-time instructions. It monitors 100 active trains across 20 major Indian railway routes — keeping the entire corridor running at peak efficiency.

Built as a production-ready web application with a fully offline-capable mock data layer and optional Supabase real-time backend.

---

## Features

| Feature | Description |
|---|---|
| `Train` Live Train Map | Animated real-time positions of 100 trains across 20 Indian routes using Leaflet |
| `BrainCircuit` AI Conflict Prediction | Detects and resolves track conflicts before they occur |
| `Zap` Instant AI Dispatch | Auto-dispatch instructions with one-click override control |
| `BarChart2` Section Analytics | Throughput, delay distribution and performance scoring |
| `AlertTriangle` Conflict Predictions | Severity-ranked conflict list with auto-resolve via Supabase |
| `Radio` Real-Time GPS Tracking | Live position interpolation with framer-motion overlays |
| `Bell` Smart Notifications | Unread alert system with type-based priority indicators |
| `Settings` Configuration Panel | Environment-driven settings with no hardcoded credentials |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite 6.2.4 |
| Styling | Tailwind CSS + inline design tokens |
| Map | Leaflet + react-leaflet 4 |
| Animation | Framer Motion |
| Icons | Lucide React |
| Backend | Supabase (PostgreSQL + Realtime) |
| Auth/Env | `import.meta.env` VITE_ variables |

---

## Project Structure

```
src/
├── components/
│   ├── Layout/
│   │   ├── TopNav.tsx          # Sticky nav — logo left, nav right
│   │   ├── HeroPage.tsx        # Landing page with railway background
│   │   └── Sidebar.tsx         # Emptied — navigation moved to TopNav
│   ├── Dashboard/
│   │   ├── DashboardPage.tsx
│   │   ├── LiveTrainStatus.tsx
│   │   ├── ConflictAlerts.tsx
│   │   ├── AIRecommendations.tsx
│   │   └── ThroughputMetrics.tsx
│   ├── LiveMap/
│   │   ├── LiveTraffic.tsx     # 100 trains across 20 routes
│   │   └── TrainMap.tsx        # Leaflet map with animated overlays
│   ├── Conflicts/
│   │   └── ConflictPredictionsPage.tsx
│   ├── Recommendations/
│   │   └── AIRecommendationsPage.tsx
│   └── Settings/
│       └── SettingsPage.tsx
├── hooks/
│   ├── useTrains.ts            # Auto-seeds DB when empty
│   ├── useConflicts.ts
│   ├── useRecommendations.ts
│   └── useSystemLogs.ts
├── lib/
│   └── supabaseClient.ts       # Reads from .env, graceful fallback
├── data/
│   └── mockData.ts
└── types/
    └── index.ts                # Page, Train, Conflict, Recommendation types
```

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> Leave as placeholders to run fully offline with mock data.

### 3. Run development server

```bash
npm run dev
```

### 4. Production build

```bash
npm run build
```

---

## Supabase Setup (Optional)

The app works fully offline. To enable live backend:

### Create tables

```sql
create table trains (
  id text primary key,
  name text, type text, status text,
  current_station text, next_station text,
  delay int, speed int, priority text,
  updated_at timestamptz default now()
);

create table conflicts (
  id text primary key,
  train_id1 text, train_id2 text,
  train_name1 text, train_name2 text,
  location text, time_to_conflict int,
  severity text, created_at timestamptz default now()
);

create table recommendations (
  id text primary key,
  train_id text, train_name text,
  action text, explanation text,
  delay_reduction int,
  timestamp timestamptz default now()
);
```

### Enable Realtime

In Supabase dashboard → Table Editor → each table → Enable Realtime.

> When tables are empty on first connect, the app **auto-seeds** them with mock data.

---

## Design System

| Token | Value | Usage |
|---|---|---|
| Primary | `#1A1A2E` | Navy — backgrounds, text |
| Accent | `#C9A84C` | Gold — highlights, active states |
| Muted | `#6B6B7B` | Secondary text |
| Subtle | `#9B9BAB` | Timestamps, labels |
| Base BG | `#F5F4EF` | Page background |
| Card | `#FAFAF8` | Card surfaces |
| Border | `#E2E0D8` | Dividers, card borders |

### Icon Standard

All icons use `size={number}` and `strokeWidth={1.8}` props — never `className w-x h-x`.

```tsx
<Train size={15} strokeWidth={1.8} />
<BrainCircuit size={28} strokeWidth={1.8} />
```

---

## Live Map — 20 Routes

| Route | Trains |
|---|---|
| Mumbai – Delhi | 5 |
| Chennai – Bangalore | 5 |
| Kolkata – Patna | 5 |
| Hyderabad – Pune | 5 |
| Delhi – Amritsar | 5 |
| Bangalore – Trichy | 5 |
| Lucknow – Patna | 5 |
| Nagpur – Kolkata | 5 |
| Ahmedabad – Surat | 5 |
| Jaipur – Varanasi | 5 |
| + 10 more routes | 50 |

**Total: 100 active trains** — ~25% delayed, ~75% on time. Delayed trains show pulse rings on the map.

---

## Scripts

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # ESLint check
```

---

## Repository

**GitHub:** [https://github.com/Tejesh141/Railway-Scheduling-System](https://github.com/Tejesh141/Railway-Scheduling-System)

---

## License

MIT — built for hackathon demonstration purposes.
