# ⚡ Crack SDE — Full-Stack Production Architecture

A high-performance, modular full-stack monorepo designed for tech interview preparation, sprint scheduling, spaced repetition, and computer science curriculum mastery.

---

## 🛠 Tech Stack

- **Frontend (`/apps/web`)**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, shadcn/ui, TanStack Query, Zustand, Lucide Icons, Sonner.
- **Backend (`/apps/api`)**: Node.js, Express v5, TypeScript, Better Auth, Helmet, CORS, Zod Validation Middleware, Layered Architecture (`Routes -> Controllers -> Services -> Repositories`).
- **Database (`/apps/api/prisma`)**: PostgreSQL, Prisma ORM, Neon DB.
- **Shared Contracts (`/packages/shared`)**: DTOs, Enums, Zod Schemas, Domain Constants.
- **DevOps & Containers**: Multi-stage Dockerfiles, Docker Compose, GitHub Actions CI.

---

## 📁 Monorepo Folder Structure

```
.
├── apps/
│   ├── api/                          # Express 5 REST API
│   │   ├── prisma/                   # Prisma ORM Schema & Seed scripts
│   │   │   ├── schema.prisma         # Data models & Better Auth
│   │   │   └── seed.ts               # Curriculum & Demo Seeder
│   │   └── src/
│   │       ├── config/               # Environment & CORS configuration
│   │       ├── lib/                  # Prisma client & Better Auth instance
│   │       ├── middleware/           # Zod validation & Central Error Handler
│   │       ├── modules/              # Domain-Driven Modules
│   │       │   ├── health/           # Liveness & Readiness checks
│   │       │   ├── roadmap/          # Subjects, Topics, Knowledge Tree
│   │       │   ├── study-plan/       # Sprints, Days, Tasks scheduling
│   │       │   ├── practice/         # Problem querying & multi-facet filtering
│   │       │   └── repetition/       # Spaced Repetition calculation engine
│   │       ├── shared/               # AppError classes & standard responses
│   │       └── index.ts              # Server bootstrap entry point
│   │
│   └── web/                          # Next.js 15 App Router Frontend
│       ├── app/                      # Thin App Router page wrappers
│       │   ├── (auth)/               # Login & Register routes
│       │   ├── dashboard/            # Overview dashboard & workspace
│       │   ├── planly/               # Sprint planner & timeline calendar
│       │   ├── prep-hub/             # Curriculum tracks & topics tree
│       │   ├── practice/             # Practice problems repository
│       │   ├── quiz-log/             # Question directory & ingestion
│       │   ├── onboarding/           # Personalized curriculum wizard
│       │   └── layout.tsx            # Global providers & App Shell
│       ├── features/                 # Modular Feature Modules
│       │   ├── planly/               # Sprint views, day tasks, calendar, modals
│       │   ├── prep-hub/             # Subject cards, topic accordions, solve modals
│       │   ├── practice/             # Filter toolbar, problem tables, pagination
│       │   ├── onboarding/           # 6-step curriculum generation wizard
│       │   └── quiz-log/             # Question forms & directory table
│       ├── components/
│       │   ├── layout/               # Header, Sidebar, DailyPlanner, AppShell
│       │   ├── shared/               # RevisionBadge, StatusChip
│       │   └── ui/                   # Reusable UI primitives (shadcn)
│       ├── hooks/                    # TanStack Query & Auth hooks
│       ├── providers/                # Query, Theme & Toast providers
│       └── store/                    # Zustand stores (Planner, Onboarding, UI)
│
├── packages/
│   └── shared/                       # Shared TypeScript types & validation schemas
│       └── src/
│           ├── constants/            # Application & Spaced Repetition constants
│           ├── dtos/                 # Auth, Roadmap, StudyPlan, Practice DTOs
│           ├── enums/                # Difficulty, ItemType, TaskStatus enums
│           ├── schemas/              # Zod validation schemas for API & UI
│           └── index.ts              # Tree-shakable barrel export
│
├── .github/workflows/ci.yml          # GitHub Actions Automated CI Pipeline
├── Dockerfile.api                    # Multi-stage production Dockerfile for API
├── Dockerfile.web                    # Multi-stage production Dockerfile for Web
└── docker-compose.yml                # Full local stack with PostgreSQL, API & Web
```

---

## 🚀 Quick Start Guide

### 1. Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Migration & Seeding

```bash
# Generate Prisma Client
npm run db:generate

# Apply migrations
npm run db:migrate

# Seed demo account & curriculum data
npm run db:seed
```

### 4. Start Development Servers

```bash
# Concurrently launch API (port 5001) and Web App (port 3000)
npm run dev
```

Or run individually:
```bash
# Backend only
npm run dev:api

# Frontend only
npm run dev:web
```

---

## 🧪 Build & Typecheck Commands

```bash
# Run full workspace TypeScript typecheck
npm run typecheck

# Build all workspaces (Shared -> API -> Web)
npm run build
```

---

## 🐳 Docker Deployment

To launch the complete production stack (PostgreSQL + Express API + Next.js Web):

```bash
docker compose up --build -d
```
