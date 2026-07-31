import type { User as BetterAuthUser } from "better-auth";

declare module "better-auth" {
  interface User extends BetterAuthUser {
    role: "USER" | "MODERATOR" | "ADMIN" | "OWNER";
    username: string | null;
    avatar: string | null;
    bio: string | null;
  }
}

declare module "better-auth/plugins" {
  interface AdminPluginOptions {
    defaultRole: "USER" | "MODERATOR" | "ADMIN" | "OWNER";
    adminRoles: ("ADMIN" | "OWNER")[];
  }
}