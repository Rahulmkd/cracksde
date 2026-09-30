export const ROUTES = {
  // Public Marketing
  HOME: "/",
  
  // Authentication
  LOGIN: "/login",
  REGISTER: "/register",

  // Core App
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  PLANLY: "/planly",
  PREP_HUB: "/prep-hub",
  PRACTICE: "/practice",
  ONBOARDING: "/onboarding",
  NOTES: "/notes",
  CODESPACE: "/codespace",
  QUIZ_LOG: "/quiz-log",
  LISTS: "/lists",
  COMMUNITY: "/community",
  BLOGS: "/blogs",
  TOOLS: "/tools",
  UNLOCK: "/unlock",
} as const;

export type AppRoute = typeof ROUTES[keyof typeof ROUTES];

export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.PROFILE,
  ROUTES.PLANLY,
  ROUTES.PREP_HUB,
  ROUTES.PRACTICE,
  ROUTES.NOTES,
  ROUTES.CODESPACE,
  ROUTES.QUIZ_LOG,
  ROUTES.LISTS,
  ROUTES.COMMUNITY,
  ROUTES.BLOGS,
  ROUTES.TOOLS,
  ROUTES.UNLOCK,
] as const;

export const AUTH_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
] as const;
