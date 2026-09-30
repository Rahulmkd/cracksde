"use client";

import React from "react";
import type { UserProfileDto } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Building2,
  MapPin,
  Code2,
  Calendar,
  CheckCircle2,
  Edit3,
  Globe,
  Github,
  Linkedin,
  ExternalLink,
  Sparkles,
} from "lucide-react";

interface ProfileHeaderProps {
  profile: UserProfileDto;
  onEditClick: () => void;
}

export function ProfileHeader({ profile, onEditClick }: ProfileHeaderProps) {
  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "U";

  const memberSince = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "Recently";

  return (
    <div className="relative rounded-2xl border border-zinc-800/80 bg-zinc-900/40 overflow-hidden shadow-subtle backdrop-blur-sm">
      {/* Dynamic Background Banner */}
      <div className="h-32 sm:h-36 w-full bg-gradient-to-r from-blue-950/60 via-indigo-950/40 to-zinc-950 border-b border-zinc-800/60 relative overflow-hidden">
        {/* Subtle Grid Accent Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 h-28 w-28 rounded-full bg-indigo-600/10 blur-2xl pointer-events-none" />
        
        {/* Top Right Badges */}
        <div className="absolute top-3.5 right-4 flex items-center gap-2">
          <Badge
            variant="outline"
            className="border-blue-500/30 bg-blue-500/10 text-blue-300 text-[11px] font-medium backdrop-blur-md"
          >
            <Sparkles className="h-3 w-3 mr-1 text-blue-400" />
            CrackSDE Member
          </Badge>
        </div>
      </div>

      {/* Profile Body */}
      <div className="p-5 sm:p-7 pt-0 relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-4">
          {/* Avatar and Basic Identifiers */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="relative group">
              {profile.image ? (
                <img
                  src={profile.image}
                  alt={profile.name}
                  className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl object-cover border-4 border-zinc-950 bg-zinc-900 shadow-xl"
                />
              ) : (
                <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl border-4 border-zinc-950 bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-500 text-white font-bold text-2xl sm:text-3xl flex items-center justify-center shadow-xl select-none">
                  {initials}
                </div>
              )}
              {/* Online / Active Indicator */}
              <div
                className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald-500 ring-4 ring-zinc-950"
                title="Active Account"
              />
            </div>

            <div className="space-y-1 sm:pb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100">
                  {profile.name}
                </h1>
                {profile.emailVerified && (
                  <span
                    className="inline-flex items-center text-blue-400"
                    title="Verified Email"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 font-normal">
                {profile.email}
              </p>
            </div>
          </div>

          {/* Edit Profile Action */}
          <div className="flex items-center gap-2 w-full sm:w-auto pt-2 sm:pt-0">
            <Button
              onClick={onEditClick}
              size="sm"
              className="w-full sm:w-auto h-9 px-4 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-600/20 active:scale-95 transition-all gap-1.5"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Headline & Bio */}
        <div className="space-y-3 pt-1">
          {profile.headline ? (
            <p className="text-sm font-medium text-zinc-200">
              {profile.headline}
            </p>
          ) : (
            <p className="text-xs text-zinc-400 italic font-normal">
              No headline added yet. Click &ldquo;Edit Profile&rdquo; to add your target role and bio.
            </p>
          )}

          {profile.bio && (
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal max-w-3xl">
              {profile.bio}
            </p>
          )}

          {/* Career & Role Metadata Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
            {profile.targetRole && (
              <Badge
                variant="secondary"
                className="bg-zinc-800/80 border-zinc-700/60 text-zinc-200 hover:bg-zinc-800 gap-1 px-2.5 py-1"
              >
                <Briefcase className="h-3 w-3 text-blue-400" />
                <span>Target: {profile.targetRole}</span>
              </Badge>
            )}

            {profile.experience && (
              <Badge
                variant="secondary"
                className="bg-zinc-800/80 border-zinc-700/60 text-zinc-300 hover:bg-zinc-800 gap-1 px-2.5 py-1"
              >
                <span>{profile.experience}</span>
              </Badge>
            )}

            {profile.targetCompany && (
              <Badge
                variant="secondary"
                className="bg-zinc-800/80 border-zinc-700/60 text-zinc-300 hover:bg-zinc-800 gap-1 px-2.5 py-1"
              >
                <Building2 className="h-3 w-3 text-amber-400" />
                <span>{profile.targetCompany}</span>
              </Badge>
            )}

            {profile.targetRegion && (
              <Badge
                variant="secondary"
                className="bg-zinc-800/80 border-zinc-700/60 text-zinc-300 hover:bg-zinc-800 gap-1 px-2.5 py-1"
              >
                <MapPin className="h-3 w-3 text-emerald-400" />
                <span>{profile.targetRegion}</span>
              </Badge>
            )}

            {profile.preferredLanguage && (
              <Badge
                variant="secondary"
                className="bg-zinc-800/80 border-zinc-700/60 text-zinc-300 hover:bg-zinc-800 gap-1 px-2.5 py-1"
              >
                <Code2 className="h-3 w-3 text-purple-400" />
                <span>{profile.preferredLanguage}</span>
              </Badge>
            )}

            <Badge
              variant="outline"
              className="border-zinc-800 bg-zinc-900/30 text-zinc-400 gap-1 px-2.5 py-1"
            >
              <Calendar className="h-3 w-3 text-zinc-500" />
              <span>Joined {memberSince}</span>
            </Badge>
          </div>

          {/* Social / Portfolio Links Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-zinc-800/60 text-xs">
            {profile.githubUrl && (
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-100 transition-colors font-medium hover:underline"
              >
                <Github className="h-3.5 w-3.5" />
                <span>GitHub</span>
                <ExternalLink className="h-2.5 w-2.5 opacity-60" />
              </a>
            )}

            {profile.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors font-medium hover:underline"
              >
                <Linkedin className="h-3.5 w-3.5" />
                <span>LinkedIn</span>
                <ExternalLink className="h-2.5 w-2.5 opacity-60" />
              </a>
            )}

            {profile.leetcodeUrl && (
              <a
                href={profile.leetcodeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors font-medium hover:underline"
              >
                <Code2 className="h-3.5 w-3.5" />
                <span>LeetCode</span>
                <ExternalLink className="h-2.5 w-2.5 opacity-60" />
              </a>
            )}

            {profile.websiteUrl && (
              <a
                href={profile.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors font-medium hover:underline"
              >
                <Globe className="h-3.5 w-3.5" />
                <span>Portfolio</span>
                <ExternalLink className="h-2.5 w-2.5 opacity-60" />
              </a>
            )}

            {!profile.githubUrl &&
              !profile.linkedinUrl &&
              !profile.leetcodeUrl &&
              !profile.websiteUrl && (
                <span className="text-[11px] text-zinc-400">
                  No public links connected yet. Add your GitHub or LinkedIn in Edit Profile.
                </span>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
