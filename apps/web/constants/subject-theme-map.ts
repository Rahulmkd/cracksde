import React from "react";
import { Code2, Monitor, Layers, Database, Network, BookOpen } from "lucide-react";

export interface SubjectTheme {
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  iconBorder: string;
  badgeVariant: "cyan" | "amber" | "purple" | "blue" | "success" | "destructive";
}

export const SUBJECT_THEMES: Record<string, SubjectTheme> = {
  dsa: {
    icon: Code2,
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-500/10",
    iconBorder: "border-cyan-500/20",
    badgeVariant: "cyan",
  },
  lld: {
    icon: Monitor,
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/10",
    iconBorder: "border-amber-500/20",
    badgeVariant: "amber",
  },
  "system-design": {
    icon: Monitor,
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/10",
    iconBorder: "border-amber-500/20",
    badgeVariant: "amber",
  },
  "operating-systems": {
    icon: Layers,
    iconColor: "text-purple-400",
    iconBg: "bg-purple-500/10",
    iconBorder: "border-purple-500/20",
    badgeVariant: "purple",
  },
  os: {
    icon: Layers,
    iconColor: "text-purple-400",
    iconBg: "bg-purple-500/10",
    iconBorder: "border-purple-500/20",
    badgeVariant: "purple",
  },
  "core-subjects": {
    icon: Layers,
    iconColor: "text-purple-400",
    iconBg: "bg-purple-500/10",
    iconBorder: "border-purple-500/20",
    badgeVariant: "purple",
  },
  dbms: {
    icon: Database,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
    iconBorder: "border-emerald-500/20",
    badgeVariant: "success",
  },
  "computer-networks": {
    icon: Network,
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/10",
    iconBorder: "border-blue-500/20",
    badgeVariant: "blue",
  },
  cn: {
    icon: Network,
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/10",
    iconBorder: "border-blue-500/20",
    badgeVariant: "blue",
  },
  oops: {
    icon: BookOpen,
    iconColor: "text-rose-400",
    iconBg: "bg-rose-500/10",
    iconBorder: "border-rose-500/20",
    badgeVariant: "destructive",
  },
};

export const DEFAULT_SUBJECT_THEME: SubjectTheme = {
  icon: Code2,
  iconColor: "text-zinc-400",
  iconBg: "bg-zinc-800/40",
  iconBorder: "border-zinc-700/40",
  badgeVariant: "blue",
};

export function getSubjectTheme(slug: string): SubjectTheme {
  return SUBJECT_THEMES[slug.toLowerCase()] || DEFAULT_SUBJECT_THEME;
}

