import React, { Suspense } from "react";
import type { Metadata } from "next";
import { ProfileOverview } from "@/features/profile/components/profile-overview";
import { ProfileSkeleton } from "@/features/profile/components/profile-skeleton";

export const metadata: Metadata = {
  title: "My Profile",
  description:
    "Manage your developer profile, career aspirations, technical roadmap progress, and study preferences on CracksDE.",
};

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileOverview />
    </Suspense>
  );
}
