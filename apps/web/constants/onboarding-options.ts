export const ONBOARDING_STEPS = [
  { num: 1, title: "About You" },
  { num: 2, title: "Subjects" },
  { num: 3, title: "Levels" },
  { num: 4, title: "Review" },
  { num: 5, title: "Availability" },
  { num: 6, title: "Finalize" },
] as const;

export const ONBOARDING_ROLES = [
  "SDE Intern",
  "Software Engineer",
  "Senior SDE",
  "Engineering Lead",
] as const;

export const ONBOARDING_EXPERIENCES = [
  "0 - 2 years",
  "2 - 5 years",
  "5+ years",
] as const;

export const ONBOARDING_COMPANIES = [
  "Startups",
  "FAANG / Big Tech",
  "Product Based Companies",
  "Open to all",
] as const;

export const ONBOARDING_REGIONS = [
  "India",
  "US / Europe / Remote",
] as const;

export const CORE_SUBJECTS = [
  { slug: "dsa", name: "Data Structures & Algorithms", recommended: true },
  { slug: "dbms", name: "Database Management Systems", recommended: true },
  { slug: "operating-systems", name: "Operating Systems", recommended: true },
  { slug: "computer-networks", name: "Computer Networks", recommended: true },
] as const;

export const ADDITIONAL_SUBJECTS = [
  { slug: "oops", name: "Object Oriented Programming (OOPs)", recommended: true },
  { slug: "lld", name: "Low-Level Design (LLD)", recommended: false },
] as const;

export const TOTAL_ROADMAP_HOURS = 270.8;
