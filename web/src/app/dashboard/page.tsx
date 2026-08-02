import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getMyProfile, getUserDashboardStats, getMyGeneratedFiles } from "@/actions/user";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export const metadata: Metadata = {
  title: "Dashboard | AI Context Studio",
  description: "Your personal dashboard",
};

export default async function DashboardPage() {
  const profile = await getMyProfile();
  if (!profile) redirect("/login?callbackUrl=/dashboard");

  const stats = await getUserDashboardStats();
  const recentFilesRaw = await getMyGeneratedFiles({ limit: 5 });
  // Serialize dates to ISO strings for client components
  const recentFiles = {
    ...recentFilesRaw,
    files: recentFilesRaw.files.map((f) => ({
      ...f,
      createdAt: f.createdAt.toISOString(),
      updatedAt: f.updatedAt.toISOString(),
    })),
  };

  return (
    <div className="container-app py-8 lg:py-12">
      <DashboardClient
        user={{
          id: profile.id,
          name: profile.name,
          username: profile.username,
          email: profile.email,
          avatar: profile.avatar,
          bio: profile.bio,
          emailVerified: profile.emailVerified,
        }}
        stats={stats}
        recentFiles={recentFiles}
      />
    </div>
  );
}
