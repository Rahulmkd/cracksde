"use client";

import React, { useState } from "react";
import type { UserProfileDto } from "../types";
import { profileFormSchema, type ProfileFormData } from "../schemas/profile-schema";
import { useUpdateProfile } from "../hooks/use-profile";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  User,
  Briefcase,
  Code2,
  Share2,
  Bell,
  Save,
  RotateCcw,
  Loader2,
  Image as ImageIcon,
  Check,
} from "lucide-react";

interface ProfileEditFormProps {
  profile: UserProfileDto;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const TARGET_ROLE_OPTIONS = [
  "Software Engineer",
  "Senior Software Engineer",
  "Frontend Engineer",
  "Backend Engineer",
  "Full Stack Engineer",
  "System Software Engineer",
  "DevOps / SRE Engineer",
  "Engineering Manager",
];

const TARGET_COMPANY_OPTIONS = [
  "Open to all",
  "FAANG / Tier 1 Big Tech",
  "High-Growth Startups / Unicorns",
  "FinTech & Quant Firms",
  "Enterprise Software Companies",
];

const EXPERIENCE_OPTIONS = [
  "College Student",
  "0 - 2 years",
  "2 - 5 years",
  "5 - 8 years",
  "8+ years",
];

const REGION_OPTIONS = [
  "India",
  "United States / North America",
  "Europe",
  "United Kingdom",
  "Singapore / Asia-Pacific",
  "Remote / Global",
];

const LANGUAGE_OPTIONS = [
  "TypeScript",
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "Go",
  "Rust",
  "C#",
];

export function ProfileEditForm({
  profile,
  onSuccess,
  onCancel,
}: ProfileEditFormProps) {
  const updateMutation = useUpdateProfile();

  const [formData, setFormData] = useState<ProfileFormData>({
    name: profile.name || "",
    image: profile.image || "",
    headline: profile.headline || "",
    bio: profile.bio || "",
    targetRole: profile.targetRole || "Software Engineer",
    targetCompany: profile.targetCompany || "Open to all",
    experience: profile.experience || "0 - 2 years",
    targetRegion: profile.targetRegion || "India",
    preferredLanguage: profile.preferredLanguage || "TypeScript",
    dailyGoalMinutes: profile.dailyGoalMinutes || 60,
    githubUrl: profile.githubUrl || "",
    linkedinUrl: profile.linkedinUrl || "",
    leetcodeUrl: profile.leetcodeUrl || "",
    websiteUrl: profile.websiteUrl || "",
    emailNotifications: profile.emailNotifications ?? true,
    weeklyDigest: profile.weeklyDigest ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeSection, setActiveSection] = useState<
    "basic" | "career" | "study" | "social" | "notifications"
  >("basic");

  const handleChange = (
    field: keyof ProfileFormData,
    value: string | number | boolean | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = profileFormSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of validation.error.issues) {
        const path = issue.path[0] as string;
        fieldErrors[path] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    try {
      await updateMutation.mutateAsync({
        name: formData.name.trim(),
        image: formData.image ? formData.image.trim() : null,
        headline: formData.headline ? formData.headline.trim() : null,
        bio: formData.bio ? formData.bio.trim() : null,
        targetRole: formData.targetRole,
        targetCompany: formData.targetCompany,
        experience: formData.experience,
        targetRegion: formData.targetRegion,
        preferredLanguage: formData.preferredLanguage,
        dailyGoalMinutes: Number(formData.dailyGoalMinutes),
        githubUrl: formData.githubUrl ? formData.githubUrl.trim() : null,
        linkedinUrl: formData.linkedinUrl ? formData.linkedinUrl.trim() : null,
        leetcodeUrl: formData.leetcodeUrl ? formData.leetcodeUrl.trim() : null,
        websiteUrl: formData.websiteUrl ? formData.websiteUrl.trim() : null,
        emailNotifications: formData.emailNotifications,
        weeklyDigest: formData.weeklyDigest,
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch {
      // Handled by onError in useUpdateProfile
    }
  };

  const handleReset = () => {
    setFormData({
      name: profile.name || "",
      image: profile.image || "",
      headline: profile.headline || "",
      bio: profile.bio || "",
      targetRole: profile.targetRole || "Software Engineer",
      targetCompany: profile.targetCompany || "Open to all",
      experience: profile.experience || "0 - 2 years",
      targetRegion: profile.targetRegion || "India",
      preferredLanguage: profile.preferredLanguage || "TypeScript",
      dailyGoalMinutes: profile.dailyGoalMinutes || 60,
      githubUrl: profile.githubUrl || "",
      linkedinUrl: profile.linkedinUrl || "",
      leetcodeUrl: profile.leetcodeUrl || "",
      websiteUrl: profile.websiteUrl || "",
      emailNotifications: profile.emailNotifications ?? true,
      weeklyDigest: profile.weeklyDigest ?? true,
    });
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <button
          type="button"
          onClick={() => setActiveSection("basic")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            activeSection === "basic"
              ? "bg-blue-600/15 text-blue-400 border border-blue-500/30"
              : "text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200 border border-transparent"
          }`}
        >
          <User className="h-3.5 w-3.5" />
          Basic Info
        </button>

        <button
          type="button"
          onClick={() => setActiveSection("career")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            activeSection === "career"
              ? "bg-blue-600/15 text-blue-400 border border-blue-500/30"
              : "text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200 border border-transparent"
          }`}
        >
          <Briefcase className="h-3.5 w-3.5" />
          Career &amp; Role
        </button>

        <button
          type="button"
          onClick={() => setActiveSection("study")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            activeSection === "study"
              ? "bg-blue-600/15 text-blue-400 border border-blue-500/30"
              : "text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200 border border-transparent"
          }`}
        >
          <Code2 className="h-3.5 w-3.5" />
          Study &amp; Coding
        </button>

        <button
          type="button"
          onClick={() => setActiveSection("social")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            activeSection === "social"
              ? "bg-blue-600/15 text-blue-400 border border-blue-500/30"
              : "text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200 border border-transparent"
          }`}
        >
          <Share2 className="h-3.5 w-3.5" />
          Portfolio &amp; Links
        </button>

        <button
          type="button"
          onClick={() => setActiveSection("notifications")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            activeSection === "notifications"
              ? "bg-blue-600/15 text-blue-400 border border-blue-500/30"
              : "text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200 border border-transparent"
          }`}
        >
          <Bell className="h-3.5 w-3.5" />
          Preferences
        </button>
      </div>

      {/* SECTION 1: BASIC INFO */}
      {activeSection === "basic" && (
        <Card className="border-zinc-800/80 bg-zinc-900/40">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-zinc-100 flex items-center gap-2">
              <User className="h-4 w-4 text-blue-400" />
              Personal Details &amp; Bio
            </CardTitle>
            <p className="text-xs text-zinc-400 font-normal">
              Manage your display name, avatar, headline, and bio
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-medium text-zinc-300">
                  Full Name <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="e.g. Rahul Mahakud"
                  className="bg-zinc-950/60 border-zinc-800 text-zinc-100 focus:border-blue-500 text-xs"
                />
                {errors.name && (
                  <p className="text-[11px] text-red-400">{errors.name}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-medium text-zinc-400">
                  Email Address (Associated with Better Auth)
                </Label>
                <Input
                  id="email"
                  value={profile.email}
                  disabled
                  className="bg-zinc-950/30 border-zinc-850 text-zinc-400 text-xs cursor-not-allowed"
                />
                <p className="text-[11px] text-zinc-400">
                  Email changes are managed through account security settings.
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="image" className="text-xs font-medium text-zinc-300">
                Avatar Image URL
              </Label>
              <div className="flex gap-3 items-center">
                <div className="flex-1">
                  <Input
                    id="image"
                    value={formData.image || ""}
                    onChange={(e) => handleChange("image", e.target.value)}
                    placeholder="https://images.unsplash.com/... or https://github.com/username.png"
                    className="bg-zinc-950/60 border-zinc-800 text-zinc-100 focus:border-blue-500 text-xs"
                  />
                </div>
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="h-9 w-9 rounded-lg object-cover border border-zinc-700 bg-zinc-900"
                    onError={() => handleChange("image", "")}
                  />
                ) : (
                  <div className="h-9 w-9 rounded-lg border border-dashed border-zinc-700 flex items-center justify-center text-zinc-500">
                    <ImageIcon className="h-4 w-4" />
                  </div>
                )}
              </div>
              {errors.image && (
                <p className="text-[11px] text-red-400">{errors.image}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="headline" className="text-xs font-medium text-zinc-300">
                Professional Headline
              </Label>
              <Input
                id="headline"
                value={formData.headline || ""}
                onChange={(e) => handleChange("headline", e.target.value)}
                placeholder="e.g. SDE Aspirant | Backend & Distributed Systems Enthusiast"
                maxLength={255}
                className="bg-zinc-950/60 border-zinc-800 text-zinc-100 focus:border-blue-500 text-xs"
              />
              <div className="flex justify-between text-[11px] text-zinc-400">
                <span>Brief summary shown on your profile card</span>
                <span>{(formData.headline || "").length}/255</span>
              </div>
              {errors.headline && (
                <p className="text-[11px] text-red-400">{errors.headline}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bio" className="text-xs font-medium text-zinc-300">
                About / Bio
              </Label>
              <textarea
                id="bio"
                rows={4}
                value={formData.bio || ""}
                onChange={(e) => handleChange("bio", e.target.value)}
                placeholder="Share your background, current focus, target dream companies, or learning roadmap goals..."
                maxLength={2000}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 p-3 text-xs text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <div className="flex justify-between text-[11px] text-zinc-400">
                <span>Markdown formatting supported</span>
                <span>{(formData.bio || "").length}/2000</span>
              </div>
              {errors.bio && (
                <p className="text-[11px] text-red-400">{errors.bio}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* SECTION 2: CAREER & ROLE */}
      {activeSection === "career" && (
        <Card className="border-zinc-800/80 bg-zinc-900/40">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-zinc-100 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-amber-400" />
              Career Aspirations &amp; Level
            </CardTitle>
            <p className="text-xs text-zinc-400 font-normal">
              Tailors interview practice recommendations and sprint schedules
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="targetRole" className="text-xs font-medium text-zinc-300">
                  Target Role <span className="text-red-400">*</span>
                </Label>
                <select
                  id="targetRole"
                  value={formData.targetRole}
                  onChange={(e) => handleChange("targetRole", e.target.value)}
                  className="w-full h-9 rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 text-xs text-zinc-100 focus:border-blue-500 focus:outline-none"
                >
                  {TARGET_ROLE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className="bg-zinc-900 text-zinc-100">
                      {opt}
                    </option>
                  ))}
                </select>
                {errors.targetRole && (
                  <p className="text-[11px] text-red-400">{errors.targetRole}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="experience" className="text-xs font-medium text-zinc-300">
                  Experience Level <span className="text-red-400">*</span>
                </Label>
                <select
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => handleChange("experience", e.target.value)}
                  className="w-full h-9 rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 text-xs text-zinc-100 focus:border-blue-500 focus:outline-none"
                >
                  {EXPERIENCE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className="bg-zinc-900 text-zinc-100">
                      {opt}
                    </option>
                  ))}
                </select>
                {errors.experience && (
                  <p className="text-[11px] text-red-400">{errors.experience}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="targetCompany" className="text-xs font-medium text-zinc-300">
                  Target Company Type <span className="text-red-400">*</span>
                </Label>
                <select
                  id="targetCompany"
                  value={formData.targetCompany}
                  onChange={(e) => handleChange("targetCompany", e.target.value)}
                  className="w-full h-9 rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 text-xs text-zinc-100 focus:border-blue-500 focus:outline-none"
                >
                  {TARGET_COMPANY_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className="bg-zinc-900 text-zinc-100">
                      {opt}
                    </option>
                  ))}
                </select>
                {errors.targetCompany && (
                  <p className="text-[11px] text-red-400">{errors.targetCompany}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="targetRegion" className="text-xs font-medium text-zinc-300">
                  Target Job Market / Region <span className="text-red-400">*</span>
                </Label>
                <select
                  id="targetRegion"
                  value={formData.targetRegion}
                  onChange={(e) => handleChange("targetRegion", e.target.value)}
                  className="w-full h-9 rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 text-xs text-zinc-100 focus:border-blue-500 focus:outline-none"
                >
                  {REGION_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className="bg-zinc-900 text-zinc-100">
                      {opt}
                    </option>
                  ))}
                </select>
                {errors.targetRegion && (
                  <p className="text-[11px] text-red-400">{errors.targetRegion}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* SECTION 3: STUDY & CODING */}
      {activeSection === "study" && (
        <Card className="border-zinc-800/80 bg-zinc-900/40">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-zinc-100 flex items-center gap-2">
              <Code2 className="h-4 w-4 text-purple-400" />
              Coding &amp; Study Routine
            </CardTitle>
            <p className="text-xs text-zinc-400 font-normal">
              Configure your primary programming language and daily preparation targets
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">
                Primary Programming Language <span className="text-red-400">*</span>
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {LANGUAGE_OPTIONS.map((lang) => {
                  const isSelected = formData.preferredLanguage === lang;
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => handleChange("preferredLanguage", lang)}
                      className={`flex items-center justify-between p-2.5 rounded-lg border text-xs font-medium transition-all ${
                        isSelected
                          ? "border-blue-500/60 bg-blue-500/15 text-blue-300 shadow-sm"
                          : "border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                      }`}
                    >
                      <span>{lang}</span>
                      {isSelected && <Check className="h-3.5 w-3.5 text-blue-400" />}
                    </button>
                  );
                })}
              </div>
              {errors.preferredLanguage && (
                <p className="text-[11px] text-red-400">{errors.preferredLanguage}</p>
              )}
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="dailyGoalMinutes" className="text-xs font-medium text-zinc-300">
                  Daily Study Target
                </Label>
                <span className="text-xs font-mono font-semibold text-blue-400">
                  {formData.dailyGoalMinutes} minutes / day ({Math.round((formData.dailyGoalMinutes / 60) * 10) / 10} hrs)
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-1">
                {[30, 60, 90, 120].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => handleChange("dailyGoalMinutes", mins)}
                    className={`py-1.5 text-xs rounded-md border text-center transition-colors ${
                      formData.dailyGoalMinutes === mins
                        ? "border-blue-500/60 bg-blue-500/15 text-blue-300 font-semibold"
                        : "border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:bg-zinc-800"
                    }`}
                  >
                    {mins} mins
                  </button>
                ))}
              </div>

              <Input
                id="dailyGoalMinutes"
                type="number"
                min={5}
                max={1440}
                value={formData.dailyGoalMinutes}
                onChange={(e) =>
                  handleChange("dailyGoalMinutes", parseInt(e.target.value) || 0)
                }
                className="bg-zinc-950/60 border-zinc-800 text-zinc-100 focus:border-blue-500 text-xs mt-2"
              />
              {errors.dailyGoalMinutes && (
                <p className="text-[11px] text-red-400">{errors.dailyGoalMinutes}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* SECTION 4: PORTFOLIO & SOCIAL LINKS */}
      {activeSection === "social" && (
        <Card className="border-zinc-800/80 bg-zinc-900/40">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-zinc-100 flex items-center gap-2">
              <Share2 className="h-4 w-4 text-emerald-400" />
              Portfolio &amp; Social Profiles
            </CardTitle>
            <p className="text-xs text-zinc-400 font-normal">
              Connect your GitHub, LinkedIn, LeetCode, and personal portfolio
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="githubUrl" className="text-xs font-medium text-zinc-300">
                GitHub Profile URL
              </Label>
              <Input
                id="githubUrl"
                value={formData.githubUrl || ""}
                onChange={(e) => handleChange("githubUrl", e.target.value)}
                placeholder="https://github.com/username"
                className="bg-zinc-950/60 border-zinc-800 text-zinc-100 focus:border-blue-500 text-xs"
              />
              {errors.githubUrl && (
                <p className="text-[11px] text-red-400">{errors.githubUrl}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="linkedinUrl" className="text-xs font-medium text-zinc-300">
                LinkedIn Profile URL
              </Label>
              <Input
                id="linkedinUrl"
                value={formData.linkedinUrl || ""}
                onChange={(e) => handleChange("linkedinUrl", e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="bg-zinc-950/60 border-zinc-800 text-zinc-100 focus:border-blue-500 text-xs"
              />
              {errors.linkedinUrl && (
                <p className="text-[11px] text-red-400">{errors.linkedinUrl}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="leetcodeUrl" className="text-xs font-medium text-zinc-300">
                LeetCode Profile URL
              </Label>
              <Input
                id="leetcodeUrl"
                value={formData.leetcodeUrl || ""}
                onChange={(e) => handleChange("leetcodeUrl", e.target.value)}
                placeholder="https://leetcode.com/username"
                className="bg-zinc-950/60 border-zinc-800 text-zinc-100 focus:border-blue-500 text-xs"
              />
              {errors.leetcodeUrl && (
                <p className="text-[11px] text-red-400">{errors.leetcodeUrl}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="websiteUrl" className="text-xs font-medium text-zinc-300">
                Personal Portfolio / Website URL
              </Label>
              <Input
                id="websiteUrl"
                value={formData.websiteUrl || ""}
                onChange={(e) => handleChange("websiteUrl", e.target.value)}
                placeholder="https://yourportfolio.dev"
                className="bg-zinc-950/60 border-zinc-800 text-zinc-100 focus:border-blue-500 text-xs"
              />
              {errors.websiteUrl && (
                <p className="text-[11px] text-red-400">{errors.websiteUrl}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* SECTION 5: NOTIFICATIONS */}
      {activeSection === "notifications" && (
        <Card className="border-zinc-800/80 bg-zinc-900/40">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-zinc-100 flex items-center gap-2">
              <Bell className="h-4 w-4 text-blue-400" />
              Notifications &amp; Digest
            </CardTitle>
            <p className="text-xs text-zinc-400 font-normal">
              Manage email notifications and spaced repetition reminders
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-950/40">
              <Checkbox
                id="emailNotifications"
                checked={formData.emailNotifications}
                onCheckedChange={(checked) =>
                  handleChange("emailNotifications", !!checked)
                }
                className="mt-0.5"
              />
              <div className="space-y-0.5">
                <Label
                  htmlFor="emailNotifications"
                  className="text-xs font-medium text-zinc-200 cursor-pointer"
                >
                  Spaced Repetition &amp; Daily Due Reminders
                </Label>
                <p className="text-[11px] text-zinc-400 font-normal">
                  Receive notifications when scheduled concept revisions or sprint tasks are due.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-950/40">
              <Checkbox
                id="weeklyDigest"
                checked={formData.weeklyDigest}
                onCheckedChange={(checked) =>
                  handleChange("weeklyDigest", !!checked)
                }
                className="mt-0.5"
              />
              <div className="space-y-0.5">
                <Label
                  htmlFor="weeklyDigest"
                  className="text-xs font-medium text-zinc-200 cursor-pointer"
                >
                  Weekly Prep Performance Digest
                </Label>
                <p className="text-[11px] text-zinc-400 font-normal">
                  Get a summary email of questions solved, streak status, and points earned every Sunday.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form Action Controls */}
      <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/60">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          size="sm"
          className="w-full sm:w-auto h-8 text-xs border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 gap-1.5"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset Values
        </Button>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              size="sm"
              className="w-full sm:w-auto h-8 text-xs border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:text-zinc-100"
            >
              Cancel
            </Button>
          )}

          <Button
            type="submit"
            disabled={updateMutation.isPending}
            size="sm"
            className="w-full sm:w-auto h-8 px-4 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-600/20 gap-1.5"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                Save Profile
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </form>
  );
}
