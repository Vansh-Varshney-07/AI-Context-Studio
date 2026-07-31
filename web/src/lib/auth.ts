import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: false,
    sendResetPassword: async ({ user, url }) => {
      // Email sending will be implemented
      console.log(`Password reset for ${user.email}: ${url}`);
    },
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },

  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }) => {
      console.log(`Verification email for ${user.email}: ${token}`);
    },
    autoSignInAfterVerification: true,
    expiresIn: 3600,
  },

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      scope: ["read:user", "user:email"],
      mapProfileToUser: (profile) => ({
        name: profile.name || profile.login,
        email: profile.email,
        username: profile.login,
        avatar: profile.avatar_url,
      }),
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      scope: ["openid", "email", "profile"],
      mapProfileToUser: (profile) => ({
        name: profile.name,
        email: profile.email,
        avatar: profile.picture,
      }),
    },
  },

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7,
    },
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
    freshAge: 60 * 5,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
        input: false,
      },
      username: {
        type: "string",
        unique: true,
        required: false,
        input: true,
      },
      avatar: {
        type: "string",
        required: false,
        input: true,
      },
      bio: {
        type: "string",
        required: false,
        input: true,
      },
    },
    changeEmail: {
      enabled: true,
    },
    deleteUser: {
      enabled: true,
    },
  },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["github", "google", "email-password"],
    },
  },

  advanced: {
    crossSubDomainCookies: {
      enabled: true,
      domain: process.env.NEXT_PUBLIC_APP_DOMAIN,
    },
    useSecureCookies: process.env.NODE_ENV === "production",
    defaultCookieAttributes: {
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    },
  },

  plugins: [],

  rateLimit: {
    window: 60 * 60,
    max: 100,
    customRules: {
      "/sign-up/email": { window: 60 * 60, max: 5 },
      "/sign-in/email": { window: 60 * 60, max: 10 },
      "/sign-in/social": { window: 60 * 60, max: 20 },
      "/forgot-password": { window: 60 * 60, max: 3 },
      "/reset-password": { window: 60 * 60, max: 5 },
    },
  },

  logger: {
    level: process.env.NODE_ENV === "development" ? "debug" : "error",
  },

  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL!,
    "http://localhost:3000",
    "http://localhost:3001",
  ],
});

// Export types manually to avoid issues
export interface SessionUser {
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

export interface SessionData {
  user: SessionUser;
  session: {
    id: string;
    expiresAt: Date;
    token: string;
    userId: string;
  };
}