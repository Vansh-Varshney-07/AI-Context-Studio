import type { Metadata } from "next";
import { getMyProfile } from "@/actions/user";
import { SettingsClient } from "@/components/settings/settings-client";

export const metadata: Metadata = {
  title: "Settings | AI Context Studio",
  description: "Manage your account settings",
};

export default async function SettingsPage() {
  const myProfile = await getMyProfile();

  const user = myProfile
    ? {
        id: myProfile.id,
        name: myProfile.name,
        username: myProfile.username,
        email: myProfile.email,
        bio: myProfile.bio,
        avatar: myProfile.avatar,
        emailVerified: myProfile.emailVerified,
      }
    : null;

  const profileData = myProfile?.profile
    ? {
        id: myProfile.profile.id,
        displayName: myProfile.profile.displayName,
        headline: myProfile.profile.headline,
        location: myProfile.profile.location,
        website: myProfile.profile.website,
        twitter: myProfile.profile.twitter,
        github: myProfile.profile.github,
        linkedin: myProfile.profile.linkedin,
        skills: myProfile.profile.skills,
      }
    : null;

  return (
    <div className="container-app py-8 lg:py-12">
      <SettingsClient user={user} profile={profileData} />
    </div>
  );
}
