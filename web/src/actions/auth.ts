"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface CustomUser {
  id: string;
  email: string;
  name: string | null;
  role: "USER" | "MODERATOR" | "ADMIN" | "OWNER";
  username: string | null;
  avatar: string | null;
  bio: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null;
}

interface CustomSession {
  user: CustomUser;
  session: {
    id: string;
    expiresAt: Date;
    token: string;
    userId: string;
  };
}

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session as CustomSession | null;
}

export async function getUser() {
  const session = await getSession();
  return session?.user ?? null;
}

export async function requireAuth() {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();
  if (session.user.role !== "ADMIN" && session.user.role !== "OWNER") {
    throw new Error("Forbidden: Admin access required");
  }
  return session;
}

export async function requireModerator() {
  const session = await requireAuth();
  if (!["MODERATOR", "ADMIN", "OWNER"].includes(session.user.role)) {
    throw new Error("Forbidden: Moderator access required");
  }
  return session;
}