import {
  LayoutDashboard,
  Compass,
  Code2,
  GitBranch,
  Users,
  BookOpen,
  Lock,
  Wrench,
  FileText,
  ListTodo,
  FolderCode,
  HelpCircle,
} from "lucide-react";
import { ROUTES } from "./routes";
import type { NavItem } from "@/types/navigation";

export const PREP_NAV_ITEMS: NavItem[] = [
  { name: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { name: "Prep Hub", href: ROUTES.PREP_HUB, icon: Compass },
  { name: "Practice", href: ROUTES.PRACTICE, icon: Code2 },
  { name: "Planly", href: ROUTES.PLANLY, icon: GitBranch },
  { name: "Community", href: ROUTES.COMMUNITY, icon: Users },
];

export const EXPLORE_NAV_ITEMS: NavItem[] = [
  { name: "Blogs", href: ROUTES.BLOGS, icon: BookOpen },
  { name: "Unlock", href: ROUTES.UNLOCK, icon: Lock },
  { name: "Dev Tools", href: ROUTES.TOOLS, icon: Wrench },
];

export const SPACES_NAV_ITEMS: NavItem[] = [
  { name: "NoteSpace", href: ROUTES.NOTES, icon: FileText },
  { name: "All Lists", href: ROUTES.LISTS, icon: ListTodo },
  { name: "CodeSpace", href: ROUTES.CODESPACE, icon: FolderCode },
  { name: "Quiz Log", href: ROUTES.QUIZ_LOG, icon: HelpCircle },
];

export const MARKETING_NAV_LINKS = [
  { title: "Build Roadmap", href: ROUTES.ONBOARDING },
  { title: "Study Dashboard", href: ROUTES.DASHBOARD },
  { title: "Prep Hub", href: ROUTES.PREP_HUB },
] as const;
