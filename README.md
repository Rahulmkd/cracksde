# Full-Stack Starter: Next.js + Express + PostgreSQL + Prisma + Better Auth + Tiptap

A clean, production-ready full-stack monorepo starter designed for rapid SaaS feature development with zero boilerplate friction.

---

## 🛠 Tech Stack

- **Frontend (`/apps/web`)**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, shadcn/ui, `next-themes` (Dark/Light mode).
- **Backend (`/apps/api`)**: Node.js, Express v5, TypeScript, Better Auth, Helmet, CORS.
- **Database (`/apps/api/prisma`)**: PostgreSQL, Prisma ORM.
- **State Management**:
  - **Server State**: TanStack Query (`@tanstack/react-query`)
  - **Client UI State**: Zustand (`zustand`)
- **Authentication**: Better Auth with session management, cookies, and protected routing.
- **Validation**: Zod for type-safe environment and API validation.
- **Rich Text Editor**: Tiptap (`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-underline`, `@tiptap/extension-link`).
- **UI / Visual Design**: Tiptap website aesthetic with violet/purple brand accents (`#7C3AED` / `#958DF1`), glassmorphic navbar, Bento grids, and shadcn/ui components.

---

## 📁 Monorepo Structure

```
.
├── apps/
│   ├── api/                     # Express + TypeScript backend
│   │   ├── prisma/              # Prisma schema & seed script
│   │   │   ├── schema.prisma    # PostgreSQL datasource & Better Auth models
│   │   │   └── seed.ts          # Demo user seeder
│   │   └── src/
│   │       ├── config/          # Zod-validated environment & CORS config
│   │       ├── controllers/     # Route controllers (Health, Auth, etc.)
│   │       ├── lib/             # Prisma client & Better Auth instance
│   │       ├── middleware/      # Error handling & Zod request validation
│   │       ├── routes/          # Aggregated Express API routes
│   │       ├── schemas/         # Zod schemas for request validation
│   │       ├── services/        # Business logic layer
│   │       └── index.ts         # Express server entry point
│   │
│   └── web/                     # Next.js App Router frontend
│       ├── app/
│       │   ├── globals.css      # Tailwind & Tiptap typography styles
│       │   ├── layout.tsx       # Root layout with Providers & Navbar
│       │   ├── page.tsx         # Landing page with Tiptap-inspired UI
│       │   ├── login/           # Sign in page + Instant Demo Login
│       │   ├── register/        # Sign up page
│       │   └── dashboard/       # Protected workspace page with Tiptap editor
│       ├── components/
│       │   ├── navbar.tsx       # Glassmorphic responsive navigation
│       │   ├── tiptap-editor.tsx# Reusable Tiptap editor component
│       │   ├── tiptap-toolbar.tsx # Toolbar (Bold, Italic, Underline, Headings, Lists, Link, Code, Quote, Undo/Redo)
│       │   └── ui/              # shadcn/ui components (Button, Card, Input, Label, Badge, Skeleton, Separator)
│       ├── hooks/               # useAuth hook
│       ├── lib/                 # Better Auth client & typed API client
│       ├── middleware.ts        # Next.js route protection & auth redirects
│       ├── providers/           # TanStack Query, Theme & Toaster providers
│       ├── store/               # Zustand UI store
│       └── types/               # Frontend TypeScript types
│
└── packages/
    └── shared/                  # Shared TypeScript interfaces & types
        └── src/
            └── index.ts         # Common user, session, and API contracts
```

---

## 🚀 Getting Started

### 1. Environment Configuration

Copy `.env.example` to `.env` in the project root:

```bash
cp .env.example .env
```

Ensure your PostgreSQL connection string is configured:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/starter_db

# Better Auth
BETTER_AUTH_SECRET=your-secure-random-secret-key-min-32-chars
BETTER_AUTH_URL=http://localhost:5001

# API Server
PORT=5001
CORS_ORIGIN=http://localhost:3000

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5001
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Migration & Seeding

Ensure your PostgreSQL server is running, then execute:

```bash
# Generate Prisma Client
npm run db:generate

# Apply database migrations
npm run db:migrate

# Seed the demo user
npm run db:seed
```

### 4. Start Development Servers

Run both the Next.js frontend (port 3000) and Express API (port 5001) concurrently:

```bash
npm run dev
```

Or run them in separate terminals:

```bash
# Terminal 1: Backend API (http://localhost:5001)
npm run dev:api

# Terminal 2: Web App (http://localhost:3000)
npm run dev:web
```

---

## 🔑 Demo Account Credentials

The database seeder automatically creates a demo account ready for immediate login:

- **Email**: `demo@example.com`
- **Password**: `Demo@123`

You can also use the **"Instant Demo Login"** button directly on the `/login` page.

---

## 🧭 Application Routes

| Path | Description | Access |
|---|---|---|
| `/` | Landing page featuring Tiptap-inspired Bento UI & sandbox | Public |
| `/login` | User login with email/password & instant demo button | Public (redirects if authenticated) |
| `/register` | User registration | Public (redirects if authenticated) |
| `/dashboard` | Protected dashboard with interactive Tiptap editor & live preview | Protected |
| `http://localhost:5001/api/health` | API health check endpoint | Public |
| `http://localhost:5001/api/auth/*` | Better Auth endpoints | Public/Protected |

---

## 📝 Tiptap Editor Component

The reusable `<TiptapEditor />` component is located at `apps/web/components/tiptap-editor.tsx`.

It comes equipped with:
- **Bold**, **Italic**, **Underline**, **Inline Code**
- **Headings (H1, H2, H3)**
- **Bullet List** (`<ul>`) & **Ordered List** (`<ol>`)
- **Blockquote** (`<blockquote>`)
- **Link insertion & deletion**
- **Undo & Redo** history controls
- SSR hydration safety (`immediatelyRender: false`)
- Live two-way HTML binding with Tailwind Typography styling

---

## 📦 Build & Typecheck

```bash
# Build all workspaces
npm run build

# Typecheck backend
npm run typecheck --workspace=@starter/api

# Typecheck frontend
npm run typecheck --workspace=@starter/web
```
