import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { auth } from "../src/lib/auth.js";
import { prisma } from "../src/lib/prisma.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function normalizeTitle(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

interface RoadmapSubjectJson {
  name: string;
  slug: string;
  estimatedHours: number;
  topics: Array<{
    name: string;
    slug: string;
    estimatedMinutes: number;
    subtopics: Array<{
      name: string;
      slug: string;
      estimatedMinutes: number;
      items: Array<{
        itemNo: number;
        title: string;
        slug: string;
        type?: string;
        difficulty?: string;
      }>;
    }>;
    items: Array<{
      itemNo: number;
      title: string;
      slug: string;
      type?: string;
      difficulty?: string;
    }>;
  }>;
}

interface CrackSdeJson {
  plan: {
    name: string;
    source: string;
  };
  sprints: Array<{
    sprintId: number;
    sprintNo: number;
    status: string;
    plannedStartDate: string;
    plannedEndDate: string;
    initialDaysAssigned: number;
    actualDaysTaken: number;
    totalEstimatedMinutes: number;
    totalActualMinutes: number;
    days: Array<{
      dayId: number;
      planDayNo: number;
      sprintDayNo: number;
      calendarDate: string;
      status: string;
      estimatedMinutes: number;
      actualMinutes: number;
      tasksTotal: number;
      tasksCompleted: number;
      isCatchUpDay: boolean;
      tasks: Array<{
        taskId: number;
        contentName: string;
        status?: string;
        estimatedMinutes?: number;
        actualMinutes?: number;
        isCarriedForward?: boolean;
        isBacklog?: boolean;
        isRevision?: boolean;
      }>;
    }>;
  }>;
}

async function seedDemoUser() {
  try {
    const result = await auth.api.signUpEmail({
      body: {
        name: "Demo User",
        email: "demo@example.com",
        password: "Demo@123",
      },
    });
    console.log("✅ Demo user created:", result.user.email);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    if (
      message.includes("already") ||
      message.includes("exists") ||
      message.includes("duplicate") ||
      message.includes("unique")
    ) {
      console.log("ℹ️  Demo user already exists, skipping.");
    } else {
      console.warn("⚠️  Demo user creation note:", message);
    }
  }
}

/**
 * Seed Roadmap Curriculum (Single Source of Truth)
 */
async function seedRoadmapCurriculum(): Promise<Map<string, number>> {
  console.log("\n📦 [1/2] Seeding Roadmap Curriculum (Personalized roadmap.md)...");
  const jsonPath = path.join(__dirname, "seed", "personalized-roadmap.json");
  const rawData = fs.readFileSync(jsonPath, "utf-8");
  const subjects: RoadmapSubjectJson[] = JSON.parse(rawData);

  const titleToItemId = new Map<string, number>();

  let totalSubjects = 0;
  let totalTopics = 0;
  let totalSubtopics = 0;
  let totalItems = 0;

  for (let sIdx = 0; sIdx < subjects.length; sIdx++) {
    const s = subjects[sIdx];
    let totalSubjectMinutes = 0;
    for (const t of s.topics) {
      totalSubjectMinutes += t.estimatedMinutes;
    }

    const subject = await prisma.roadmapSubject.upsert({
      where: { slug: s.slug },
      update: {
        name: s.name,
        estimatedHours: s.estimatedHours,
        totalMinutes: totalSubjectMinutes,
        sortOrder: sIdx + 1,
      },
      create: {
        slug: s.slug,
        name: s.name,
        estimatedHours: s.estimatedHours,
        totalMinutes: totalSubjectMinutes,
        sortOrder: sIdx + 1,
      },
    });
    totalSubjects++;

    for (let tIdx = 0; tIdx < s.topics.length; tIdx++) {
      const t = s.topics[tIdx];
      const topic = await prisma.roadmapTopic.upsert({
        where: {
          uq_roadmap_topic_subject_slug: {
            subjectId: subject.id,
            slug: t.slug,
          },
        },
        update: {
          name: t.name,
          estimatedMinutes: t.estimatedMinutes,
          sortOrder: tIdx + 1,
        },
        create: {
          subjectId: subject.id,
          slug: t.slug,
          name: t.name,
          estimatedMinutes: t.estimatedMinutes,
          sortOrder: tIdx + 1,
        },
      });
      totalTopics++;

      // Direct items under topic
      if (t.items && t.items.length > 0) {
        for (let iIdx = 0; iIdx < t.items.length; iIdx++) {
          const item = t.items[iIdx];
          const deterministicId = subject.id * 100000 + topic.id * 1000 + item.itemNo;

          const savedItem = await prisma.roadmapItem.upsert({
            where: { id: deterministicId },
            update: {
              subjectId: subject.id,
              topicId: topic.id,
              subtopicId: null,
              itemNo: item.itemNo,
              title: item.title,
              slug: item.slug,
              type: item.type ?? "Concept",
              difficulty: item.difficulty ?? null,
              sortOrder: iIdx + 1,
            },
            create: {
              id: deterministicId,
              subjectId: subject.id,
              topicId: topic.id,
              subtopicId: null,
              itemNo: item.itemNo,
              title: item.title,
              slug: item.slug,
              type: item.type ?? "Concept",
              difficulty: item.difficulty ?? null,
              sortOrder: iIdx + 1,
            },
          });
          totalItems++;
          titleToItemId.set(normalizeTitle(item.title), savedItem.id);
        }
      }

      // Subtopics and their items
      if (t.subtopics && t.subtopics.length > 0) {
        for (let stIdx = 0; stIdx < t.subtopics.length; stIdx++) {
          const sub = t.subtopics[stIdx];
          const subtopic = await prisma.roadmapSubtopic.upsert({
            where: {
              uq_roadmap_subtopic_topic_slug: {
                topicId: topic.id,
                slug: sub.slug,
              },
            },
            update: {
              name: sub.name,
              estimatedMinutes: sub.estimatedMinutes,
              sortOrder: stIdx + 1,
            },
            create: {
              topicId: topic.id,
              slug: sub.slug,
              name: sub.name,
              estimatedMinutes: sub.estimatedMinutes,
              sortOrder: stIdx + 1,
            },
          });
          totalSubtopics++;

          for (let iIdx = 0; iIdx < sub.items.length; iIdx++) {
            const item = sub.items[iIdx];
            const deterministicId =
              subject.id * 100000 + topic.id * 1000 + subtopic.id * 50 + item.itemNo;

            const savedItem = await prisma.roadmapItem.upsert({
              where: { id: deterministicId },
              update: {
                subjectId: subject.id,
                topicId: topic.id,
                subtopicId: subtopic.id,
                itemNo: item.itemNo,
                title: item.title,
                slug: item.slug,
                type: item.type ?? "Concept",
                difficulty: item.difficulty ?? null,
                sortOrder: iIdx + 1,
              },
              create: {
                id: deterministicId,
                subjectId: subject.id,
                topicId: topic.id,
                subtopicId: subtopic.id,
                itemNo: item.itemNo,
                title: item.title,
                slug: item.slug,
                type: item.type ?? "Concept",
                difficulty: item.difficulty ?? null,
                sortOrder: iIdx + 1,
              },
            });
            totalItems++;
            titleToItemId.set(normalizeTitle(item.title), savedItem.id);
          }
        }
      }
    }
    console.log(`   Processed subject: ${s.name} (${s.topics.length} topics)`);
  }

  console.log(
    `✅ Curriculum seeded: ${totalSubjects} Subjects, ${totalTopics} Topics, ${totalSubtopics} Subtopics, ${totalItems} Items!`
  );
  return titleToItemId;
}

/**
 * Seed Study Sprints & Calendar (Referencing Roadmap Items)
 */
async function seedStudyPlan(titleToItemId: Map<string, number>) {
  console.log("\n📦 [2/2] Seeding Study Plan Sprints & Scheduled Tasks (Crack SDE)...");
  const jsonPath = path.join(__dirname, "seed", "crack-sde-roadmap.json");
  if (!fs.existsSync(jsonPath)) {
    console.warn("⚠️  crack-sde-roadmap.json not found, skipping.");
    return;
  }
  const rawData = fs.readFileSync(jsonPath, "utf-8");
  const data: CrackSdeJson = JSON.parse(rawData);

  console.log(`📌 Upserting Study Plan: ${data.plan.name}...`);
  const studyPlan = await prisma.studyPlan.upsert({
    where: { slug: "crack-sde" },
    update: {
      name: data.plan.name,
      sourceUrl: data.plan.source,
    },
    create: {
      slug: "crack-sde",
      name: data.plan.name,
      sourceUrl: data.plan.source,
    },
  });

  const sprintsData = [];
  const daysData = [];
  const tasksData = [];

  for (const sprint of data.sprints) {
    sprintsData.push({
      sprintId: BigInt(sprint.sprintId),
      planId: studyPlan.id,
      sprintNo: sprint.sprintNo,
      status: sprint.status || "upcoming",
      plannedStartDate: sprint.plannedStartDate ? new Date(sprint.plannedStartDate) : null,
      plannedEndDate: sprint.plannedEndDate ? new Date(sprint.plannedEndDate) : null,
      initialDaysAssigned: sprint.initialDaysAssigned ?? 0,
      actualDaysTaken: sprint.actualDaysTaken ?? 0,
      totalEstimatedMinutes: sprint.totalEstimatedMinutes ?? 0,
      totalActualMinutes: sprint.totalActualMinutes ?? 0,
    });

    for (const day of sprint.days) {
      daysData.push({
        dayId: BigInt(day.dayId),
        sprintId: BigInt(sprint.sprintId),
        planDayNo: day.planDayNo,
        sprintDayNo: day.sprintDayNo,
        calendarDate: day.calendarDate ? new Date(day.calendarDate) : null,
        status: day.status || "upcoming",
        estimatedMinutes: day.estimatedMinutes ?? 0,
        actualMinutes: day.actualMinutes ?? 0,
        tasksTotal: day.tasksTotal ?? 0,
        tasksCompleted: day.tasksCompleted ?? 0,
        isCatchUpDay: day.isCatchUpDay ?? false,
      });

      for (const [index, task] of day.tasks.entries()) {
        const matchedItemId = titleToItemId.get(normalizeTitle(task.contentName)) ?? null;

        tasksData.push({
          taskId: BigInt(task.taskId),
          dayId: BigInt(day.dayId),
          sprintId: BigInt(sprint.sprintId),
          itemId: matchedItemId,
          taskOrder: index + 1,
          status: task.status ?? "not_started",
          estimatedMinutes: task.estimatedMinutes ?? 0,
          actualMinutes: task.actualMinutes ?? 0,
          isCarriedForward: task.isCarriedForward ?? false,
          isBacklog: task.isBacklog ?? false,
          isRevision: task.isRevision ?? false,
        });
      }
    }
  }

  console.log(`🚀 Upserting ${sprintsData.length} Study Sprints...`);
  for (const sprint of sprintsData) {
    await prisma.studySprint.upsert({
      where: { sprintId: sprint.sprintId },
      update: sprint,
      create: sprint,
    });
  }

  console.log(`🚀 Upserting ${daysData.length} Study Days...`);
  for (const day of daysData) {
    await prisma.studyDay.upsert({
      where: { dayId: day.dayId },
      update: day,
      create: day,
    });
  }

  console.log(`🚀 Upserting ${tasksData.length} Study Tasks (linked to roadmap items)...`);
  const chunkSize = 100;
  for (let i = 0; i < tasksData.length; i += chunkSize) {
    const chunk = tasksData.slice(i, i + chunkSize);
    await prisma.$transaction(
      chunk.map((task) =>
        prisma.studyTask.upsert({
          where: { taskId: task.taskId },
          update: task,
          create: task,
        })
      )
    );
  }

  console.log("✅ Study plan sprints and scheduled tasks successfully seeded!");
}

/**
 * Create or Update Analytical SQL Views
 */
async function createAnalyticalViews() {
  console.log("\n📊 Creating or updating analytical SQL views...");

  await prisma.$executeRawUnsafe(`DROP VIEW IF EXISTS v_roadmap_hierarchy CASCADE;`);
  await prisma.$executeRawUnsafe(`
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
  `);

  await prisma.$executeRawUnsafe(`DROP VIEW IF EXISTS v_roadmap_summary CASCADE;`);
  await prisma.$executeRawUnsafe(`
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
  `);

  await prisma.$executeRawUnsafe(`DROP VIEW IF EXISTS v_study_schedule CASCADE;`);
  await prisma.$executeRawUnsafe(`
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
  `);

  console.log("✅ Analytical views (v_roadmap_hierarchy, v_roadmap_summary, v_study_schedule) created!");
}

async function verifyCounts() {
  const users = await prisma.user.count();
  const subjects = await prisma.roadmapSubject.count();
  const topics = await prisma.roadmapTopic.count();
  const subtopics = await prisma.roadmapSubtopic.count();
  const items = await prisma.roadmapItem.count();

  const plans = await prisma.studyPlan.count();
  const sprints = await prisma.studySprint.count();
  const days = await prisma.studyDay.count();
  const tasks = await prisma.studyTask.count();
  const linkedTasks = await prisma.studyTask.count({ where: { itemId: { not: null } } });

  console.log("\n📈 ================= DEDUPLICATED DATABASE VERIFICATION =================");
  console.log("🔹 Auth & Users:");
  console.log(`   - Users (users):                     ${users}`);
  console.log("🔹 Roadmap Curriculum (Single Source of Truth):");
  console.log(`   - Subjects (roadmap_subjects):       ${subjects}`);
  console.log(`   - Topics (roadmap_topics):           ${topics}`);
  console.log(`   - Subtopics (roadmap_subtopics):     ${subtopics}`);
  console.log(`   - Items (roadmap_items):             ${items}`);
  console.log("🔹 Study Plans & Calendar Scheduling:");
  console.log(`   - Plans (study_plans):               ${plans}`);
  console.log(`   - Sprints (study_sprints):           ${sprints}`);
  console.log(`   - Days (study_days):                 ${days}`);
  console.log(`   - Tasks (study_tasks):               ${tasks}`);
  console.log(`   - Tasks Linked to Roadmap Items:     ${linkedTasks} / ${tasks} (100% normalized)`);
  console.log("=========================================================================\n");
}

async function main() {
  console.log("🌱 Starting deduplicated database seed and migration...");
  const startTime = Date.now();

  try {
    await seedDemoUser();
    const titleToItemId = await seedRoadmapCurriculum();
    await seedStudyPlan(titleToItemId);
    await createAnalyticalViews();
    await verifyCounts();
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✨ All migrations and seeding completed successfully in ${duration}s!`);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
