export const ONBOARDING_STEPS = [
  { num: 1, title: "Subjects" },
  { num: 2, title: "Availability" },
  { num: 3, title: "Finalize" },
] as const;

export const CORE_SUBJECTS = [
  {
    slug: "dsa",
    name: "Data Structures & Algorithms",
    recommended: true,
    estimatedHours: 145.5,
    sprints: 5,
  },
  {
    slug: "dbms",
    name: "Database Management Systems",
    recommended: true,
    estimatedHours: 34.8,
    sprints: 2,
  },
  {
    slug: "operating-systems",
    name: "Operating Systems",
    recommended: true,
    estimatedHours: 24.5,
    sprints: 2,
  },
  {
    slug: "computer-networks",
    name: "Computer Networks",
    recommended: true,
    estimatedHours: 21.0,
    sprints: 2,
  },
  {
    slug: "oops",
    name: "Object Oriented Programming (OOPs)",
    recommended: true,
    estimatedHours: 15.0,
    sprints: 1,
  },
  {
    slug: "lld",
    name: "Low-Level Design (LLD)",
    recommended: true,
    estimatedHours: 30.0,
    sprints: 2,
  },
] as const;

export const TOTAL_ROADMAP_HOURS = 270.8;

export const DEFAULT_SELECTED_SUBJECTS: string[] = CORE_SUBJECTS.map((s) => s.slug);

export function getTodayDateString(): string {
  return new Date().toISOString().split("T")[0];
}

export function getTomorrowDateString(): string {
  return new Date(Date.now() + 86400000).toISOString().split("T")[0];
}

export function getSelectedSubjectsHours(selectedSlugs: string[]): number {
  if (!selectedSlugs || selectedSlugs.length === 0) return 0;
  const total = CORE_SUBJECTS.filter((s) => selectedSlugs.includes(s.slug)).reduce(
    (sum, s) => sum + s.estimatedHours,
    0
  );
  return Math.round(total * 10) / 10;
}

export function getSelectedSubjectsSprints(selectedSlugs: string[]): number {
  if (!selectedSlugs || selectedSlugs.length === 0) return 0;
  if (selectedSlugs.length >= CORE_SUBJECTS.length) return 9;

  const activeSprintSet = new Set<number>();
  for (const slug of selectedSlugs) {
    const s = slug.toLowerCase().trim();
    if (s === "dsa") [1, 2, 3, 4, 5].forEach((n) => activeSprintSet.add(n));
    if (s === "oops") [1, 2, 3].forEach((n) => activeSprintSet.add(n));
    if (s === "operating-systems" || s === "os") [4, 5].forEach((n) => activeSprintSet.add(n));
    if (s === "lld" || s === "system-design") [4, 5, 6, 7].forEach((n) => activeSprintSet.add(n));
    if (s === "computer-networks" || s === "cn") [6, 7].forEach((n) => activeSprintSet.add(n));
    if (s === "dbms") [8, 9].forEach((n) => activeSprintSet.add(n));
  }
  return Math.max(1, activeSprintSet.size);
}

