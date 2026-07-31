import { Resend } from "resend";

let resend: Resend | null = null;

function getResend() {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("RESEND_API_KEY not set, email functionality disabled");
      return null;
    }
    resend = new Resend(apiKey);
  }
  return resend;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}) {
  const client = getResend();
  if (!client) {
    console.warn("Email sending skipped: RESEND_API_KEY not configured");
    return { success: false, error: "Email not configured" };
  }
  return client.emails.send({
    from: "AI Context Studio <noreply@aicontextstudio.dev>",
    to,
    subject,
    html,
    text,
  });
}

export async function sendVerificationEmail(email: string, otp: string) {
  return sendEmail({
    to: email,
    subject: "Verify your email address",
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h1 style="color: #4F7A5A; font-size: 24px; margin-bottom: 16px;">Verify your email</h1>
        <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
          Welcome! Please use the code below to verify your email address.
        </p>
        <div style="background: #F5F1E8; border: 1px solid #E7EFE6; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <span style="font-size: 32px; font-weight: bold; color: #4F7A5A; letter-spacing: 4px; font-family: monospace;">${otp}</span>
        </div>
        <p style="color: #6B7280; font-size: 14px; line-height: 1.5;">
          This code expires in 1 hour. If you didn't request this, please ignore this email.
        </p>
      </div>
    `,
  });
}

export async function sendSignInEmail(email: string, otp: string) {
  return sendEmail({
    to: email,
    subject: "Your sign-in code",
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h1 style="color: #4F7A5A; font-size: 24px; margin-bottom: 16px;">Sign in to AI Context Studio</h1>
        <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
          Use the code below to sign in to your account.
        </p>
        <div style="background: #F5F1E8; border: 1px solid #E7EFE6; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <span style="font-size: 32px; font-weight: bold; color: #4F7A5A; letter-spacing: 4px; font-family: monospace;">${otp}</span>
        </div>
        <p style="color: #6B7280; font-size: 14px; line-height: 1.5;">
          This code expires in 1 hour. If you didn't request this, please ignore this email.
        </p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  return sendEmail({
    to: email,
    subject: "Reset your password",
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h1 style="color: #4F7A5A; font-size: 24px; margin-bottom: 16px;">Reset your password</h1>
        <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
          You requested a password reset. Click the button below to set a new password.
        </p>
        <div style="text-align: center; margin-bottom: 24px;">
          <a href="${resetUrl}" style="background: #4F7A5A; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="color: #6B7280; font-size: 14px; line-height: 1.5;">
          This link expires in 1 hour. If you didn't request this, please ignore this email.
        </p>
      </div>
    `,
  });
}

export async function sendWelcomeEmail(email: string, name: string) {
  return sendEmail({
    to: email,
    subject: "Welcome to AI Context Studio!",
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h1 style="color: #4F7A5A; font-size: 24px; margin-bottom: 16px;">Welcome, ${name}!</h1>
        <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
          Thanks for joining AI Context Studio. You're now part of a community of developers building better AI workflows.
        </p>
        <div style="background: #E7EFE6; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
          <h2 style="color: #4F7A5A; font-size: 18px; margin-bottom: 12px;">Get started:</h2>
          <ul style="color: #374151; line-height: 2;">
            <li>Download the desktop app from <a href="${process.env.NEXT_PUBLIC_APP_URL}/download" style="color: #4F7A5A;">our download page</a></li>
            <li>Browse the <a href="${process.env.NEXT_PUBLIC_APP_URL}/marketplace" style="color: #4F7A5A;">Marketplace</a> for skills, personas, and templates</li>
            <li>Read the <a href="${process.env.NEXT_PUBLIC_APP_URL}/docs" style="color: #4F7A5A;">Documentation</a> to learn the basics</li>
            <li>Join our <a href="https://discord.gg/ai-context-studio" style="color: #4F7A5A;">Discord community</a></li>
          </ul>
        </div>
        <p style="color: #6B7280; font-size: 14px; line-height: 1.5;">
          Questions? Reply to this email — we'd love to hear from you.
        </p>
      </div>
    `,
  });
}