"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProfileClientProps {
  user: {
    id: string;
    name: string | null;
    username: string | null;
    bio: string | null;
    avatar: string | null;
    followers: number;
    following: number;
    totalAssets: number;
    totalPosts: number;
    profile: {
      displayName: string | null;
      headline: string | null;
      location: string | null;
      website: string | null;
      twitter: string | null;
      github: string | null;
      linkedin: string | null;
      skills: string[];
    } | null;
  };
}

export function ProfileClient({ user }: ProfileClientProps) {
  const displayName = user.profile?.displayName || user.name || user.username || "Anonymous";
  const profile = user.profile;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-8">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="h-24 w-24 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} alt={displayName} className="h-24 w-24 rounded-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-[var(--color-accent)]">
                {displayName[0]?.toUpperCase() || "?"}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{displayName}</h1>
            {user.username && <p className="text-sm text-[var(--color-text-muted)]">@{user.username}</p>}
            {profile?.headline && <p className="text-base text-[var(--color-text-secondary)] mt-2">{profile.headline}</p>}
            {profile?.location && <p className="text-sm text-[var(--color-text-muted)] mt-1">{profile.location}</p>}

            {user.bio && (
              <p className="text-sm text-[var(--color-text-secondary)] mt-4 max-w-2xl">{user.bio}</p>
            )}

            {/* Social Links */}
            <div className="flex flex-wrap gap-3 mt-4">
              {profile?.website && (
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--color-accent)] hover:underline">
                  Website ↗
                </a>
              )}
              {profile?.twitter && (
                <a href={`https://twitter.com/${profile.twitter.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--color-accent)] hover:underline">
                  Twitter ↗
                </a>
              )}
              {profile?.github && (
                <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--color-accent)] hover:underline">
                  GitHub ↗
                </a>
              )}
              {profile?.linkedin && (
                <a href={`https://linkedin.com/in/${profile.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--color-accent)] hover:underline">
                  LinkedIn ↗
                </a>
              )}
            </div>

            {/* Skills */}
            {profile?.skills && profile.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {profile.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[var(--color-border)]">
          <div className="text-center">
            <p className="text-2xl font-bold text-[var(--color-text-primary)]">{user.totalAssets}</p>
            <p className="text-xs text-[var(--color-text-muted)]">Assets</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[var(--color-text-primary)]">{user.totalPosts}</p>
            <p className="text-xs text-[var(--color-text-muted)]">Posts</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[var(--color-text-primary)]">{user.followers}</p>
            <p className="text-xs text-[var(--color-text-muted)]">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[var(--color-text-primary)]">{user.following}</p>
            <p className="text-xs text-[var(--color-text-muted)]">Following</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <Button variant="outline">
          <Link href="/dashboard">My Dashboard</Link>
        </Button>
        <Button variant="outline">
          <Link href="/generate">Generate File</Link>
        </Button>
      </div>
    </div>
  );
}

interface PromiseLike<T> {
  then: (onfulfilled: (value: T) => unknown) => unknown;
}
