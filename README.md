# ⚡ CrackSDE — Full-Stack SDE Preparation & Sprint Scheduling Platform

<div align="center">

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.1-black.svg?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB.svg?style=flat-square&logo=react)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-5.0-lightgrey.svg?style=flat-square&logo=express)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.0-2D3748.svg?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Better Auth](https://img.shields.io/badge/Better_Auth-1.0-orange.svg?style=flat-square)](https://www.better-auth.com/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED.svg?style=flat-square&logo=docker)](https://www.docker.com/)

**CrackSDE** is an end-to-end, production-grade learning platform designed for software engineers preparing for tech interviews. Combining structured CS curriculum tracks, sprint-based calendar scheduling, smart catch-up algorithms, spaced repetition revision cycles, interactive developer utilities, and gamified study streaks.

[Features](#-key-features) • [Tech Stack](#-tech-stack) • [Architecture](#-system-architecture) • [Database Schema](#-database-architecture) • [API Reference](#-rest-api-reference) • [Getting Started](#-getting-started) • [Deployment](#-docker--deployment)

</div>

---

## 📖 Table of Contents

1. [Overview](#-overview)
2. [Key Features](#-key-features)
3. [Tech Stack](#-tech-stack)
4. [Monorepo Structure](#-monorepo-structure)
5. [System Architecture](#-system-architecture)
6. [Database Architecture & Data Models](#-database-architecture)
7. [Spaced Repetition Engine](#-spaced-repetition-engine)
8. [REST API Reference](#-rest-api-reference)
9. [Getting Started](#-getting-started)
10. [Environment Variables](#-environment-variables)
11. [Available Workspace Scripts](#-available-workspace-scripts)
12. [Docker & Deployment](#-docker--deployment)

---

## 🌟 Overview

CrackSDE solves the problem of unstructured, overwhelming technical interview preparation. Instead of scattered bookmarks and ad-hoc problem solving, CrackSDE organizes computer science fundamentals into normalized curriculum hierarchies, schedules learning into manageable sprint timelines, tracks revision intervals scientifically, and provides a centralized suite of developer tools.

### Core Philosophy
- **Single Source of Truth**: Curriculums, topics, and problem banks are unified in a normalized database schema with analytical SQL views.
- **End-to-End Type Safety**: Shared validation schemas (Zod) and TypeScript DTOs guarantee contract integrity across client and server boundaries.
- **Active Recall & Spaced Repetition**: Scientifically proven revision intervals (1 → 3 → 7 → 14 → 30 days) prevent retention decay.
- **Adaptive Scheduling**: The **Smart Catch-Up** engine automatically balances overdue tasks into remaining sprint days without manual rescheduling.

---

## 🚀 Key Features

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                                    CrackSDE Ecosystem                                    │
├───────────────────┬───────────────────┬───────────────────┬──────────────────────────────┤
│    📅 Planly      │   🗺️ Prep Hub     │   🎯 Practice     │    🛠️ Dev Toolkit & Notes    │
│  Sprint Planner   │  Curriculum Tree  │   Question Bank   │  Big-O, Bitwise, TipTap Notes│
├───────────────────┼───────────────────┼───────────────────┼──────────────────────────────┤
│ 🔁 Smart Catch-Up │ 🧠 Spaced Repeat  │ 🔍 Multi-Filters  │ 🎮 Streak & Study Points     │
│ 📊 Sprint Metrics │ 📂 Topic Drawers  │ 🎲 Random Problem │ ⌘ Universal Command Palette  │
└───────────────────┴───────────────────┴───────────────────┴──────────────────────────────┘
```

### 📅 1. Planly — Sprint & Calendar Planner
- **Agile Study Sprints**: Break down interview prep into time-boxed sprints (e.g., 2-week DSA sprints, System Design deep-dives).
- **Day-by-Day Timeline**: View daily allocated tasks, estimated durations, and completion statuses.
- **Smart Catch-Up Engine**: Detects lagging sprint days and automatically rebalances unfinished tasks into future catch-up or lighter days with one click.
- **Task Management**: Supports carried-forward tasks, backlog tracking, and custom daily task creation.
- **Velocity Metrics**: Track completed vs. planned hours and completion rates in real time.

### 🗺️ 2. Prep Hub — Interactive Curriculum Knowledge Tree
- **Comprehensive Subject Tracks**:
  - **Data Structures & Algorithms (DSA)**: Arrays, Trees, Graphs, DP, Heaps, and pattern-based problem solving.
  - **Database Management Systems (DBMS)**: Indexing (B+ Trees), Transactions, ACID, MVCC, and Query Optimization.
  - **Operating Systems (OS)**: Process synchronization, Virtual Memory, Deadlocks, Mutex/Semaphores, and Linux internals.
  - **Computer Networks (CN)**: OSI model, TCP/IP 3-way handshakes, HTTP/2/3, DNS, and TLS.
  - **Object-Oriented Programming (OOP) & Low-Level Design (LLD)**: Design patterns, SOLID principles, and UML modeling.
  - **High-Level System Design (HLD)**: Scalability, Load Balancing, Caching, Sharding, and Distributed Systems.
- **Hierarchical Navigation**: Drill down from `Subject` ➔ `Topic` ➔ `Subtopic` ➔ `Roadmap Items / Questions`.
- **Interactive Question Solver Modal**: Mark questions as solved (Correct / Incorrect), log study notes, and immediately update revision schedules.

### 🎯 3. Practice Question Bank
- **Multi-Faceted Filtering**: Filter problems by Subject, Topic, Difficulty (`Easy`, `Medium`, `Hard`), Solved Status, and Spaced Repetition Due date.
- **Debounced Search & Pagination**: Fast query response times with optimized indexing.
- **Pick Random Problem**: Jump straight into a challenge when undecided.

### 🧠 4. Spaced Repetition Engine
- **Leitner-Inspired Schedule**:
  - `Solve 1`: +1 day interval
  - `Solve 2`: +3 days interval
  - `Solve 3`: +7 days interval
  - `Solve 4`: +14 days interval
  - `Solve 5+`: +30 days interval (Status promoted to **Mastered**)
- **Adaptive Failure Penalty**: When an answer is marked incorrect, the item resets to a 1-day revision window and is flagged as `needs_revision`.
- **Status Rollups**: Topics visually indicate overall health badges (`Revision Due`, `Due Tomorrow`, `Up to Date`, `Not Started`).

### 📝 5. Notespace & Rich-Text Workspace
- **TipTap WYSIWYG Editor**: Built-in rich-text editor with support for headings, bold/italic/underline, code blocks, lists, links, and blockquotes.
- **Persistent Notes**: Attach personal notes, solution walkthroughs, and edge cases to any problem or roadmap item.

### 🛠️ 6. Developer Tools & Interactive Visualizers
- **Big-O Cheat Sheet**: Interactive time and space complexity matrix for all common data structures and sorting algorithms.
- **Bitwise Visualizer**: Real-time bit-level visualizer for operations: `AND (&)`, `OR (|)`, `XOR (^)`, `NOT (~)`, `Left Shift (<<)`, and `Right Shift (>>)`.

### 🎮 7. Gamification & Universal Navigation
- **Study Points & Daily Streaks**: Earn **+15 points** per completed task and maintain consecutive daily activity streaks.
- **Universal Command Palette (`⌘K` / `Ctrl+K`)**: Instant fuzzy search across problems, roadmap tracks, tools, and application views.
- **Collapsible Daily Planner Widget**: Floating dockable sidebar to quickly manage today's checklist and Problem of the Day.

### 🧭 8. Personalized 6-Step Onboarding Wizard
- Collects user background, target companies/roles, subjects of interest, self-assessed skill levels, and automatically configures a tailored study sprint roadmap.

---

## 🛠 Tech Stack

### Monorepo & Core Technologies
| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Monorepo** | NPM Workspaces | Multi-package architecture with isolated builds and dependencies |
| **Language** | TypeScript (v5.6) | Strict type checking across API, Web, and Shared packages |
| **Runtime** | Node.js (>=20.9.0) | High-performance JavaScript runtime |

### Frontend (`/apps/web`)
| Package | Version | Usage |
| :--- | :--- | :--- |
| **Next.js** | `15.1.0` | App Router, Server/Client components, optimized builds |
| **React** | `19.0.0` | UI component rendering and reactive state |
| **Styling** | Tailwind CSS `3.4` + shadcn/ui | Modern, dark-mode optimized design system |
| **Data Fetching** | `@tanstack/react-query` `5.60` | Server state caching, optimistic updates, and background refetching |
| **State Management**| `zustand` `5.0` | Lightweight client state (Planner, UI, Onboarding) with `persist` middleware |
| **Rich Text** | `@tiptap/react` `2.11` | Headless, extensible WYSIWYG note editor |
| **Icons & Alerts** | `lucide-react`, `sonner` | Crisp vector icons and toast notifications |

### Backend API (`/apps/api`)
| Package | Version | Usage |
| :--- | :--- | :--- |
| **Framework** | Express `5.0.0` | Fast REST API with modern routing architecture |
| **ORM** | Prisma `6.0.0` | Type-safe SQL query builder and schema management |
| **Authentication** | Better Auth `1.0.0` | Session-based & OAuth-ready secure auth engine |
| **Security** | `helmet`, `cors` | HTTP header protection and CORS policy controls |
| **Validation** | `zod` `3.23` | Request payload and query parameter validation middleware |
| **Architecture** | Layered DDD | `Routes` ➔ `Controllers` ➔ `Services` ➔ `Repositories` |

### Database & Shared Contracts
| Layer | Technology | Usage |
| :--- | :--- | :--- |
| **Database** | PostgreSQL 16 / Neon DB | Relational data persistence with foreign keys and SQL analytical views |
| **Shared Package** | `@cracksde/shared` | Centralized TypeScript DTOs, Enums, Zod Schemas, and Constants |

---

## 📁 Monorepo Structure

```
cracksde-monorepo/
├── apps/
│   ├── api/                          # Express 5 REST API Server (@cracksde/api)
│   │   ├── prisma/
│   │   │   ├── schema.prisma         # Database schema & Better Auth models
│   │   │   └── seed.ts               # Database seeder & analytical views creator
│   │   └── src/
│   │       ├── config/               # Environment & CORS configuration
│   │       ├── lib/                  # Prisma client & Better Auth instance
│   │       ├── middleware/           # Zod validation & central error handlers
│   │       ├── modules/              # Domain-Driven Modules
│   │       │   ├── auth/             # Better Auth route handlers
│   │       │   ├── health/           # Liveness & readiness probes
│   │       │   ├── practice/         # Question bank querying & filtering
│   │       │   ├── repetition/       # Spaced repetition calculation service
│   │       │   ├── roadmap/          # Subject/topic hierarchy & solve tracking
│   │       │   └── study-plan/       # Sprints, days, and tasks scheduling
│   │       ├── routes/               # API routes aggregator
│   │       ├── shared/               # Custom AppError & response utilities
│   │       └── index.ts              # API server bootstrap
│   │
│   └── web/                          # Next.js 15 App Router (@starter/web)
│       ├── app/
│       │   ├── (app)/                # Authenticated App Shell & views
│       │   │   ├── dashboard/        # Velocity dashboard & metrics
│       │   │   ├── planly/           # Sprint planner & Smart Catch-Up
│       │   │   ├── prep-hub/         # Curriculum tracks & topic trees
│       │   │   ├── practice/         # Filterable practice problem bank
│       │   │   ├── quiz-log/         # Question ingestion & inventory
│       │   │   ├── notes/            # TipTap rich-text notespace
│       │   │   ├── tools/            # Big-O & Bitwise visualizers
│       │   │   ├── onboarding/       # 6-step curriculum wizard
│       │   │   ├── community/        # Community discussions feed
│       │   │   └── codespace/        # Interactive code editor
│       │   ├── (auth)/               # Login & Register pages
│       │   ├── (marketing)/          # Landing page & feature showcases
│       │   ├── globals.css           # Tailwind base styles & theme tokens
│       │   └── layout.tsx            # Root layout & providers
│       ├── components/
│       │   ├── editor/               # TipTap toolbar and editor components
│       │   ├── layout/               # AppShell, Header, Sidebar, DailyPlanner
│       │   ├── search/               # Command Palette (⌘K) search dialog
│       │   └── ui/                   # Reusable UI primitives (Button, Card, Dialog...)
│       ├── features/                 # Modular feature domains & components
│       ├── hooks/                    # TanStack Query & auth hooks
│       ├── providers/                # React Query, Theme, Toast providers
│       ├── services/                 # Frontend API client services
│       └── store/                    # Zustand stores (Planner, UI, Onboarding)
│
├── packages/
│   └── shared/                       # Shared Contracts & Schemas (@cracksde/shared)
│       └── src/
│           ├── constants/            # Application & Spaced Repetition constants
│           ├── dtos/                 # Auth, Roadmap, StudyPlan, Practice DTOs
│           ├── enums/                # Difficulty, ItemType, TaskStatus enums
│           ├── schemas/              # Zod validation schemas (Client & API)
│           └── index.ts              # Barrel export
│
├── .github/workflows/ci.yml          # Automated CI pipeline
├── docker-compose.yml                # Multi-container orchestration (Postgres, API, Web)
├── Dockerfile.api                    # Multi-stage Dockerfile for API
├── Dockerfile.web                    # Multi-stage Dockerfile for Web
├── package.json                      # Monorepo root package.json
└── tsconfig.base.json                # Shared TypeScript base configuration
```

---

## 🏛 System Architecture

```mermaid
flowchart TD
    subgraph Client["Frontend Client (Next.js 15)"]
        UI["Web App / Pages"]
        Store["Zustand Stores (Planner, UI)"]
        Query["TanStack Query (Cache & Sync)"]
        UI --> Store
        UI --> Query
    end

    subgraph Contracts["Shared Contracts (@cracksde/shared)"]
        ZodSchemas["Zod Validation Schemas"]
        DTOs["TypeScript DTOs & Interfaces"]
        Enums["Constants & Enums"]
    end

    subgraph Server["Backend API (Express 5)"]
        MW["Middleware (Auth, Helmet, Zod Validate)"]
        Controllers["Controllers (HTTP Binding)"]
        Services["Domain Services (Repetition, Sprints)"]
        Repos["Repositories (Prisma Queries)"]
        
        MW --> Controllers
        Controllers --> Services
        Services --> Repos
    end

    subgraph Database["PostgreSQL 16"]
        Prisma["Prisma ORM"]
        Tables[("Tables: Users, Roadmap, Sprints, Progress")]
        Views[("Analytical Views: v_roadmap_hierarchy, v_study_schedule")]
        Prisma --> Tables
        Prisma --> Views
    end

    Query <-->|REST API JSON| MW
    Contracts -.->|Shared Types & Schemas| Client
    Contracts -.->|Validation & Types| Server
    Repos --> Prisma
```

---

## 🗄 Database Architecture

The PostgreSQL schema is partitioned into 4 distinct domain clusters:

```mermaid
erDiagram
    users ||--o{ sessions : has
    users ||--o{ accounts : has
    users ||--o{ user_item_progress : tracks

    roadmap_subjects ||--o{ roadmap_topics : contains
    roadmap_topics ||--o{ roadmap_subtopics : contains
    roadmap_topics ||--o{ roadmap_items : contains
    roadmap_subtopics ||--o{ roadmap_items : contains

    study_plans ||--o{ study_sprints : schedules
    study_sprints ||--o{ study_days : divides
    study_days ||--o{ study_tasks : includes
    roadmap_items ||--o{ study_tasks : references
    roadmap_items ||--o{ user_item_progress : evaluates

    roadmap_items {
        int id PK
        int subject_id FK
        int topic_id FK
        int subtopic_id FK
        int item_no
        string title
        string slug
        string type
        string difficulty
        int estimated_minutes
    }

    user_item_progress {
        string id PK
        string user_id FK
        int item_id FK
        string status
        int solve_count
        datetime last_solved_at
        datetime next_revision_at
        boolean last_score
        text notes
    }

    study_tasks {
        bigint task_id PK
        bigint day_id FK
        bigint sprint_id FK
        int item_id FK
        int task_order
        string status
        int estimated_minutes
        boolean is_carried_forward
        boolean is_backlog
        boolean is_revision
    }
```

### Analytical SQL Views
The database includes pre-compiled analytical views for rapid reporting:
- **`v_roadmap_hierarchy`**: Flattens Subject ➔ Topic ➔ Subtopic ➔ Item relationships into a single queryable structure.
- **`v_roadmap_summary`**: Aggregates total hours, topics, subtopics, and questions per subject.
- **`v_study_schedule`**: Joins study plans, sprints, days, tasks, and roadmap items for complete calendar resolution.

---

## 🔁 Spaced Repetition Engine

The repetition service implements a mathematical decay model for active recall:

```mermaid
stateDiagram-v2
    [*] --> NotStarted: New Problem

    NotStarted --> Completed: First Correct Solve (Interval = 1d)
    NotStarted --> NeedsRevision: First Incorrect Solve (Interval = 1d)

    Completed --> Completed: Correct (Interval = 3d, 7d, 14d)
    Completed --> NeedsRevision: Incorrect (Reset Interval = 1d)

    Completed --> Mastered: 5+ Consecutive Solves (Interval = 30d)
    NeedsRevision --> Completed: Correct Solve (Interval = 1d)
    Mastered --> NeedsRevision: Incorrect Solve (Reset Interval = 1d)
```

| Solve Count | Interval Until Next Revision | Target Status |
| :---: | :---: | :---: |
| **0** | Not Solved | `not_started` |
| **1** | +1 Day | `completed` |
| **2** | +3 Days | `completed` |
| **3** | +7 Days | `completed` |
| **4** | +14 Days | `completed` |
| **5+** | +30 Days | `mastered` |
| **Incorrect Solve** | **+1 Day** | `needs_revision` |

---

## 🔌 REST API Reference

All backend endpoints are prefixed with `/api`.

### 1. Health Checks
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service liveness, readiness, timestamp, and environment |

### 2. Authentication (Better Auth)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/sign-up/email` | Register new user account |
| `POST` | `/api/auth/sign-in/email` | Email & password login |
| `POST` | `/api/auth/sign-out` | Invalidate current session |
| `GET` | `/api/auth/get-session` | Retrieve active session and user info |

### 3. Roadmap & Curriculum
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/roadmap/summary` | Get aggregated curriculum summary & total hours |
| `GET` | `/api/roadmap/subjects` | List all subjects with topic breakdown |
| `GET` | `/api/roadmap/subjects/:slug` | Get single subject detail with full topic tree |
| `GET` | `/api/roadmap/subjects/:slug/topics/:topicSlug/questions` | Get questions for a specific topic with user progress |
| `GET` | `/api/roadmap/user/revisions` | List items currently due for spaced repetition |
| `POST` | `/api/roadmap/items` | Create new roadmap item / question |
| `POST` | `/api/roadmap/items/:itemId/solve` | Record solve result (`isCorrect`, `notes`) and update revision schedule |
| `GET` | `/api/roadmap/items/:itemId/progress` | Get user solve count, score, and next revision date |

### 4. Practice Question Bank
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/roadmap/practice` | Query practice problems with multi-filtering (`subject`, `topic`, `difficulty`, `status`, `dueOnly`, `search`, `page`, `limit`) |

### 5. Study Plans & Sprints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/study-plans` | Retrieve default study plan with sprints and days |
| `GET` | `/api/study-plans/:slug` | Retrieve specific study plan by slug |
| `PATCH` | `/api/study-plans/:slug` | Update study plan details or sprint structure |
| `PATCH` | `/api/study-plans/tasks/:taskId` | Update task status (`completed`, `in_progress`, `not_started`), actual minutes, or carrying status |
| `GET` | `/api/study-plans/revision-list` | Get comprehensive revision task list |

---

## ⚡ Getting Started

### Prerequisites
- **Node.js**: `v20.9.0` or higher
- **NPM**: `v10.0.0` or higher
- **PostgreSQL**: `v16.0` (or run via Docker)

### 1. Clone the Repository
```bash
git clone https://github.com/Rahulmkd/cracksde.git
cd cracksde
```

### 2. Environment Configuration
Copy the example `.env.example` to `.env` in the root directory:
```bash
cp .env.example .env
```

Review the values in `.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cracksde_db"
BETTER_AUTH_SECRET="generate-a-secure-random-secret-key-32-chars-min"
BETTER_AUTH_URL="http://localhost:5001"
PORT=5001
NODE_ENV=development
CORS_ORIGIN="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:5001"
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Setup Database & Seed Initial Data
```bash
# Generate Prisma Client
npm run db:generate

# Apply Database Migrations
npm run db:migrate

# Seed Demo User & Curriculum Data
npm run db:seed
```

> **Default Demo Account**:
> - **Email**: `demo@example.com`
> - **Password**: `Demo@123`

### 5. Start Development Servers
```bash
# Launch API (port 5001) and Web App (port 3000) concurrently
npm run dev
```

You can also run packages individually:
```bash
npm run dev:api   # Backend Express server only
npm run dev:web   # Frontend Next.js app only
```

- **Frontend Application**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5001/api](http://localhost:5001/api)
- **API Health Check**: [http://localhost:5001/api/health](http://localhost:5001/api/health)

---

## ⚙️ Environment Variables

| Variable | Required | Default (Dev) | Description |
| :--- | :---: | :--- | :--- |
| `DATABASE_URL` | **Yes** | `postgresql://...` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET`| **Yes** | `32+ char secret` | Encryption key for Better Auth tokens & cookies |
| `BETTER_AUTH_URL` | **Yes** | `http://localhost:5001` | Canonical URL of the auth server |
| `PORT` | No | `5001` | HTTP port for the Express API server |
| `NODE_ENV` | No | `development` | Environment mode (`development` / `production`) |
| `CORS_ORIGIN` | No | `http://localhost:3000` | Allowed CORS origin for browser requests |
| `NEXT_PUBLIC_API_URL`| **Yes** | `http://localhost:5001` | Backend API URL reachable by the Next.js frontend |

---

## 📜 Available Workspace Scripts

Run from the root of the monorepo:

| Script | Command | Description |
| :--- | :--- | :--- |
| `npm run dev` | `concurrently "npm run dev:api" "npm run dev:web"` | Starts both API and Web servers in dev mode |
| `npm run dev:api` | `npm run dev --workspace=@cracksde/api` | Starts API watch mode with `tsx` |
| `npm run dev:web` | `npm run dev --workspace=@starter/web` | Starts Next.js development server on port 3000 |
| `npm run build` | Builds shared, api, and web packages | Compiles TypeScript contracts, API bundle, and Next.js static/SSR build |
| `npm run typecheck` | Runs `tsc --noEmit` across all workspaces | Validates full workspace TypeScript type safety |
| `npm run db:generate` | `prisma generate` | Generates Prisma client types |
| `npm run db:migrate` | `prisma migrate dev` | Creates and executes new SQL migrations |
| `npm run db:seed` | `tsx prisma/seed.ts` | Populates database with curriculum & sample accounts |
| `npm run db:studio` | `prisma studio` | Opens Prisma GUI database browser |
| `npm run db:reset` | `prisma migrate reset` | Drops database, reapplies migrations, and seeds fresh |

---

## 🐳 Docker & Deployment

CrackSDE includes production-ready, multi-stage Dockerfiles and a `docker-compose.yml` for unified local or production orchestration.

### Launch Complete Stack with Docker Compose
```bash
docker compose up --build -d
```

This starts:
1. **`postgres`** container (PostgreSQL 16 Alpine on port `5432` with automated healthcheck)
2. **`api`** container (Express 5 backend on port `5001`)
3. **`web`** container (Next.js 15 frontend on port `3000`)

### Stop Containers
```bash
docker compose down
```

### Production Multi-Stage Docker Builds
- **`Dockerfile.api`**: Uses lightweight `node:20-alpine`, installs workspace dependencies, compiles TypeScript, and runs pruned production artifacts.
- **`Dockerfile.web`**: Uses Next.js standalone output mode with optimized layer caching and unprivileged non-root execution.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Ensure type safety passes (`npm run typecheck`)
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
