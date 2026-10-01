export const ONBOARDING_STEPS = [
  { num: 1, title: "Subjects" },
  { num: 2, title: "Availability" },
  { num: 3, title: "Finalize" },
] as const;

export const CORE_SUBJECTS = [
  { slug: "dsa", name: "Data Structures & Algorithms", recommended: true },
  { slug: "dbms", name: "Database Management Systems", recommended: true },
  { slug: "operating-systems", name: "Operating Systems", recommended: true },
  { slug: "computer-networks", name: "Computer Networks", recommended: true },
  {
    slug: "oops",
    name: "Object Oriented Programming (OOPs)",
    recommended: true,
  },
  { slug: "lld", name: "Low-Level Design (LLD)", recommended: true },
] as const;

export const TOTAL_ROADMAP_HOURS = 270.8;
