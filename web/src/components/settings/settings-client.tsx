"use client";

import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, AlertCircle, Check, Monitor, Smartphone, Trash2 } from "lucide-react";

interface Profile {
  id: string;
  displayName: string | null;
  headline: string | null;
  location: string | null;
  website: string | null;
  twitter: string | null;
  github: string | null;
  linkedin: string | null;
  skills: string[];
}

interface User {
  id: string;
  name: string | null;
  username: string | null;
  email: string;
  bio: string | null;
  avatar: string | null;
  emailVerified: boolean;
}

export function SettingsClient({ user, profile }: { user: User | null; profile: Profile | null }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [skillsInput, setSkillsInput] = useState("");

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    bio: user?.bio || "",
    avatar: user?.avatar || "",
    displayName: profile?.displayName || "",
    headline: profile?.headline || "",
    location: profile?.location || "",
    website: profile?.website || "",
    twitter: profile?.twitter || "",
    github: profile?.github || "",
    linkedin: profile?.linkedin || "",
    skills: profile?.skills || [],
  });

  const [emailData, setEmailData] = useState({
    email: user?.email || "",
    newEmail: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profileData.name,
          username: profileData.username,
          bio: profileData.bio,
          avatar: profileData.avatar,
          profile: {
            displayName: profileData.displayName,
            headline: profileData.headline,
            location: profileData.location,
            website: profileData.website,
            twitter: profileData.twitter,
            github: profileData.github,
            linkedin: profileData.linkedin,
            skills: profileData.skills,
          },
        }),
      });

      if (res.ok) {
        setSuccess(true);
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update profile");
      }
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  };

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailData.newEmail }),
      });

      if (res.ok) {
        setSuccess(true);
        setEmailData({ ...emailData, newEmail: "" });
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update email");
      }
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        const data = await res.json();
        setError(data.message || data.error || "Failed to change password");
      }
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    const skill = skillsInput.trim();
    if (skill && !profileData.skills.includes(skill)) {
      setProfileData({ ...profileData, skills: [...profileData.skills, skill] });
      setSkillsInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setProfileData({ ...profileData, skills: profileData.skills.filter((s) => s !== skill) });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-[var(--color-text-muted)] mb-4">You need to sign in to access settings</p>
          <Button onClick={() => router.push("/login")}>Sign In</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Settings</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">Manage your account settings and preferences</p>
      </header>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-500 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-3 rounded-lg border border-green-500/30 bg-green-500/10 text-green-600 text-sm">
          <Check className="h-4 w-4 shrink-0" />
          <span>Settings saved successfully</span>
        </div>
      )}

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <form onSubmit={handleProfileSubmit} className="space-y-4 p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
            <h2 className="font-semibold text-[var(--color-text-primary)]">Basic Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" value={profileData.username} onChange={(e) => setProfileData({ ...profileData, username: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" value={profileData.bio} onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })} rows={3} placeholder="Tell the world about yourself..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatar">Avatar URL</Label>
              <Input id="avatar" value={profileData.avatar} onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })} placeholder="https://..." />
            </div>

            <h2 className="font-semibold text-[var(--color-text-primary)] pt-4 border-t border-[var(--color-border)]">Professional</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input id="displayName" value={profileData.displayName} onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="headline">Headline</Label>
                <Input id="headline" value={profileData.headline} onChange={(e) => setProfileData({ ...profileData, headline: e.target.value })} placeholder="Software Engineer" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={profileData.location} onChange={(e) => setProfileData({ ...profileData, location: e.target.value })} placeholder="San Francisco, CA" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" value={profileData.website} onChange={(e) => setProfileData({ ...profileData, website: e.target.value })} placeholder="https://..." />
              </div>
            </div>

            <h2 className="font-semibold text-[var(--color-text-primary)] pt-4 border-t border-[var(--color-border)]">Social Links</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input id="twitter" value={profileData.twitter} onChange={(e) => setProfileData({ ...profileData, twitter: e.target.value })} placeholder="@username" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github">GitHub</Label>
                <Input id="github" value={profileData.github} onChange={(e) => setProfileData({ ...profileData, github: e.target.value })} placeholder="username" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input id="linkedin" value={profileData.linkedin} onChange={(e) => setProfileData({ ...profileData, linkedin: e.target.value })} placeholder="username" />
              </div>
            </div>

            <h2 className="font-semibold text-[var(--color-text-primary)] pt-4 border-t border-[var(--color-border)]">Skills</h2>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} placeholder="Add a skill..." onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())} />
                <Button type="button" variant="secondary" onClick={addSkill}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="cursor-pointer" onClick={() => removeSkill(skill)}>
                    {skill} ✕
                  </Badge>
                ))}
              </div>
            </div>

            <Button type="submit" disabled={saving} className="mt-4">
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save Changes
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="email" className="mt-4">
          <form onSubmit={handleEmailSubmit} className="space-y-4 p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
            <h2 className="font-semibold text-[var(--color-text-primary)]">Email Address</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--color-text-secondary)]">Current:</span>
              <span className="font-medium text-[var(--color-text-primary)]">{user.email}</span>
              {user.emailVerified ? (
                <Badge className="bg-green-500/20 text-green-500">Verified</Badge>
              ) : (
                <Badge className="bg-yellow-500/20 text-yellow-500">Unverified</Badge>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="newEmail">New Email Address</Label>
              <Input id="newEmail" type="email" value={emailData.newEmail} onChange={(e) => setEmailData({ ...emailData, newEmail: e.target.value })} required placeholder="new@example.com" />
            </div>
            <p className="text-xs text-[var(--color-text-muted)]">
              You'll need to verify the new email address before it becomes active.
            </p>
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Update Email
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="password" className="mt-4">
          <form onSubmit={handlePasswordSubmit} className="space-y-4 p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
            <h2 className="font-semibold text-[var(--color-text-primary)]">Change Password</h2>
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} required />
              </div>
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Change Password
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="sessions" className="mt-4">
          <div className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
            <h2 className="font-semibold text-[var(--color-text-primary)] mb-4">Active Sessions</h2>
            <p className="text-sm text-[var(--color-text-muted)] mb-4">Manage devices where you're currently signed in.</p>
            <div className="text-center text-[var(--color-text-muted)] text-sm py-8">
              Session management requires the authenticated session API
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
