import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProfile } from "@/actions/user";
import { ProfileClient } from "@/components/profile/profile-client";

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const user = await getProfile(username);

  if (!user) {
    return { title: "User Not Found | AI Context Studio" };
  }

  return {
    title: `${user.name || user.username} | AI Context Studio`,
    description: user.bio || `Profile of ${user.name || user.username} on AI Context Studio`,
  };
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;
  const user = await getProfile(username);

  if (!user) {
    notFound();
  }

  const profileData = {
    id: user.id,
    name: user.name,
    username: user.username,
    email: undefined, // Don't expose email on public profile
    bio: user.bio,
    avatar: user.avatar,
    followers: user._count.followers,
    following: user._count.following,
    totalAssets: user._count.assets,
    totalPosts: user._count.posts,
    profile: user.profile
      ? {
          displayName: user.profile.displayName,
          headline: user.profile.headline,
          location: user.profile.location,
          website: user.profile.website,
          twitter: user.profile.twitter,
          github: user.profile.github,
          linkedin: user.profile.linkedin,
          skills: user.profile.skills,
        }
      : null,
  };

  return (
    <div className="container-app py-8 lg:py-12">
      <ProfileClient user={profileData} />
    </div>
  );
}
