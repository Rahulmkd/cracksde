-- =====================================================================
-- PostgreSQL: Unified Schema (Roadmap Knowledge Tree & Study Sprints)
-- =====================================================================

-- =====================================================================
-- Domain 1: Authentication & Users (Better Auth)
-- =====================================================================

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT FALSE,
    image TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    "expiresAt" TIMESTAMPTZ NOT NULL,
    token TEXT UNIQUE NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS accounts (
    id TEXT PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMPTZ,
    "refreshTokenExpiresAt" TIMESTAMPTZ,
    scope TEXT,
    password TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS verifications (
    id TEXT PRIMARY KEY,
    identifier TEXT NOT NULL,
    value TEXT NOT NULL,
    "expiresAt" TIMESTAMPTZ NOT NULL,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- Domain 2: Roadmap Curriculum & Knowledge Hierarchy (Single Source of Truth)
-- =====================================================================

CREATE TABLE IF NOT EXISTS roadmap_subjects (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    estimated_hours NUMERIC(6, 2) DEFAULT 0,
    total_minutes INT DEFAULT 0,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS roadmap_topics (
    id SERIAL PRIMARY KEY,
    subject_id INT NOT NULL REFERENCES roadmap_subjects(id) ON DELETE CASCADE,
    slug VARCHAR(150) NOT NULL,
    name VARCHAR(255) NOT NULL,
    estimated_minutes INT DEFAULT 0,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_roadmap_topic_subject_slug UNIQUE (subject_id, slug)
);

CREATE TABLE IF NOT EXISTS roadmap_subtopics (
    id SERIAL PRIMARY KEY,
    topic_id INT NOT NULL REFERENCES roadmap_topics(id) ON DELETE CASCADE,
    slug VARCHAR(150) NOT NULL,
    name VARCHAR(255) NOT NULL,
    estimated_minutes INT DEFAULT 0,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_roadmap_subtopic_topic_slug UNIQUE (topic_id, slug)
);

CREATE TABLE IF NOT EXISTS roadmap_items (
    id SERIAL PRIMARY KEY,
    subject_id INT NOT NULL REFERENCES roadmap_subjects(id) ON DELETE CASCADE,
    topic_id INT NOT NULL REFERENCES roadmap_topics(id) ON DELETE CASCADE,
    subtopic_id INT REFERENCES roadmap_subtopics(id) ON DELETE CASCADE,
    item_no INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    type VARCHAR(50) DEFAULT 'Concept',
    difficulty VARCHAR(50),
    estimated_minutes INT DEFAULT 0,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_roadmap_topics_subject_id ON roadmap_topics(subject_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_subtopics_topic_id ON roadmap_subtopics(topic_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_items_subject_id ON roadmap_items(subject_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_items_topic_id ON roadmap_items(topic_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_items_subtopic_id ON roadmap_items(subtopic_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_items_type ON roadmap_items(type);
CREATE INDEX IF NOT EXISTS idx_roadmap_items_difficulty ON roadmap_items(difficulty);

-- =====================================================================
-- Domain 3: Study Sprints & Calendar Scheduling
-- =====================================================================

CREATE TABLE IF NOT EXISTS study_plans (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    source_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS study_sprints (
    sprint_id BIGINT PRIMARY KEY,
    plan_id INT NOT NULL REFERENCES study_plans(id) ON DELETE CASCADE,
    sprint_no INT NOT NULL,
    status VARCHAR(50) DEFAULT 'upcoming',
    planned_start_date DATE,
    planned_end_date DATE,
    initial_days_assigned INT DEFAULT 0,
    actual_days_taken INT DEFAULT 0,
    total_estimated_minutes INT DEFAULT 0,
    total_actual_minutes INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_study_plan_sprint_no UNIQUE (plan_id, sprint_no)
);

CREATE TABLE IF NOT EXISTS study_days (
    day_id BIGINT PRIMARY KEY,
    sprint_id BIGINT NOT NULL REFERENCES study_sprints(sprint_id) ON DELETE CASCADE,
    plan_day_no INT NOT NULL,
    sprint_day_no INT NOT NULL,
    calendar_date DATE,
    status VARCHAR(50) DEFAULT 'upcoming',
    estimated_minutes INT DEFAULT 0,
    actual_minutes INT DEFAULT 0,
    tasks_total INT DEFAULT 0,
    tasks_completed INT DEFAULT 0,
    is_catch_up_day BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS study_tasks (
    task_id BIGINT PRIMARY KEY,
    day_id BIGINT NOT NULL REFERENCES study_days(day_id) ON DELETE CASCADE,
    sprint_id BIGINT NOT NULL REFERENCES study_sprints(sprint_id) ON DELETE CASCADE,
    item_id INT REFERENCES roadmap_items(id) ON DELETE SET NULL,
    task_order INT NOT NULL DEFAULT 1,
    status VARCHAR(50) DEFAULT 'not_started',
    estimated_minutes INT DEFAULT 0,
    actual_minutes INT DEFAULT 0,
    is_carried_forward BOOLEAN DEFAULT FALSE,
    is_backlog BOOLEAN DEFAULT FALSE,
    is_revision BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_study_sprints_plan_id ON study_sprints(plan_id);
CREATE INDEX IF NOT EXISTS idx_study_days_sprint_id ON study_days(sprint_id);
CREATE INDEX IF NOT EXISTS idx_study_days_calendar_date ON study_days(calendar_date);
CREATE INDEX IF NOT EXISTS idx_study_tasks_day_id ON study_tasks(day_id);
CREATE INDEX IF NOT EXISTS idx_study_tasks_sprint_id ON study_tasks(sprint_id);
CREATE INDEX IF NOT EXISTS idx_study_tasks_item_id ON study_tasks(item_id);
CREATE INDEX IF NOT EXISTS idx_study_tasks_status ON study_tasks(status);

-- =====================================================================
-- Domain 4: User Progress & Mastery Tracking
-- =====================================================================

CREATE TABLE IF NOT EXISTS user_item_progress (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_id INT NOT NULL REFERENCES roadmap_items(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'not_started',
    notes TEXT,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_user_roadmap_item_progress UNIQUE (user_id, item_id)
);

CREATE INDEX IF NOT EXISTS idx_user_item_progress_user_id ON user_item_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_item_progress_item_id ON user_item_progress(item_id);

-- =====================================================================
-- Analytical SQL Views
-- =====================================================================

-- 1. Full Hierarchical View of Roadmap Curriculum
DROP VIEW IF EXISTS v_roadmap_hierarchy CASCADE;
CREATE VIEW v_roadmap_hierarchy AS
SELECT 
    sub.slug AS subject_slug,
    sub.name AS subject_name,
    sub.estimated_hours AS subject_estimated_hours,
    top.slug AS topic_slug,
    top.name AS topic_name,
    top.estimated_minutes AS topic_estimated_minutes,
    stop.slug AS subtopic_slug,
    stop.name AS subtopic_name,
    stop.estimated_minutes AS subtopic_estimated_minutes,
    i.id AS item_id,
    i.item_no,
    i.title AS item_title,
    i.slug AS item_slug,
    i.type AS item_type,
    i.difficulty AS item_difficulty,
    i.sort_order
FROM roadmap_items i
JOIN roadmap_subjects sub ON i.subject_id = sub.id
JOIN roadmap_topics top ON i.topic_id = top.id
LEFT JOIN roadmap_subtopics stop ON i.subtopic_id = stop.id
ORDER BY sub.sort_order, top.sort_order, COALESCE(stop.sort_order, 0), i.sort_order;

-- 2. Roadmap Rollup Summary View
DROP VIEW IF EXISTS v_roadmap_summary CASCADE;
CREATE VIEW v_roadmap_summary AS
SELECT 
    sub.id AS subject_id,
    sub.slug AS subject_slug,
    sub.name AS subject_name,
    sub.estimated_hours,
    sub.total_minutes,
    (SELECT COUNT(*) FROM roadmap_topics top WHERE top.subject_id = sub.id) AS total_topics,
    (SELECT COUNT(*) FROM roadmap_subtopics stop JOIN roadmap_topics top ON stop.topic_id = top.id WHERE top.subject_id = sub.id) AS total_subtopics,
    (SELECT COUNT(*) FROM roadmap_items i WHERE i.subject_id = sub.id) AS total_items
FROM roadmap_subjects sub
ORDER BY sub.sort_order;

-- 3. Study Sprints and Scheduled Tasks View
DROP VIEW IF EXISTS v_study_schedule CASCADE;
CREATE VIEW v_study_schedule AS
SELECT 
    p.name AS plan_name,
    s.sprint_no,
    s.status AS sprint_status,
    s.planned_start_date,
    s.planned_end_date,
    d.plan_day_no,
    d.sprint_day_no,
    d.calendar_date,
    d.is_catch_up_day,
    t.task_order,
    t.task_id,
    i.id AS item_id,
    i.title AS item_title,
    i.type AS item_type,
    i.difficulty AS item_difficulty,
    sub.name AS subject_name,
    sub.slug AS subject_slug,
    top.name AS topic_name,
    t.estimated_minutes,
    t.status AS task_status
FROM study_plans p
JOIN study_sprints s ON p.id = s.plan_id
JOIN study_days d ON s.sprint_id = d.sprint_id
LEFT JOIN study_tasks t ON d.day_id = t.day_id
LEFT JOIN roadmap_items i ON t.item_id = i.id
LEFT JOIN roadmap_subjects sub ON i.subject_id = sub.id
LEFT JOIN roadmap_topics top ON i.topic_id = top.id
ORDER BY s.sprint_no, d.sprint_day_no, t.task_order;
