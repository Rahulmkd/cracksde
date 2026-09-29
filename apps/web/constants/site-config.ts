export const siteConfig = {
  name: "Crack SDE",
  shortName: "CrackSDE",
  title: "Crack SDE - Personalized Roadmap & Study Planner",
  description:
    "Production-ready personalized roadmap, day-by-day study sprints, and 847-problem practice engine for Software Engineering interview preparation.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://cracksde.com",
  ogImage: "https://cracksde.com/og.png",
  links: {
    github: "https://github.com/cracksde",
    twitter: "https://twitter.com/cracksde",
  },
  stats: {
    problemsCount: 847,
    sprintsCount: 9,
    curriculumHours: 270,
    sprintDays: 61,
  },
} as const;

export type SiteConfig = typeof siteConfig;
