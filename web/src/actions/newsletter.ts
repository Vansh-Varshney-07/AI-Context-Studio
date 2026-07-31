"use server";

import { prisma } from "@/lib/prisma";
import { SubscriberStatus } from "@prisma/client";
import { sendVerificationEmail } from "@/lib/resend";
import { nanoid } from "nanoid";

export async function subscribeToNewsletter(email: string, name?: string, source = "website") {
  // Validate email
  if (!email || !email.includes("@")) {
    return { success: false, error: "Invalid email address" };
  }

  // Check if already subscribed
  const existing = await prisma.newsletterSubscriber.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existing) {
    if (existing.status === SubscriberStatus.CONFIRMED) {
      return { success: false, error: "Already subscribed" };
    }
    if (existing.status === SubscriberStatus.PENDING) {
      // Resend verification
      const token = nanoid(32);
      await prisma.newsletterSubscriber.update({
        where: { id: existing.id },
        data: { token, source, name: name || existing.name },
      });
      await sendVerificationEmail(email, token);
      return { success: true, message: "Verification email resent" };
    }
    if (existing.status === SubscriberStatus.UNSUBSCRIBED) {
      // Re-subscribe
      const token = nanoid(32);
      await prisma.newsletterSubscriber.update({
        where: { id: existing.id },
        data: { status: SubscriberStatus.PENDING, token, source, name: name || existing.name, confirmedAt: null, unsubscribedAt: null },
      });
      await sendVerificationEmail(email, token);
      return { success: true, message: "Re-subscribed! Check your email to confirm." };
    }
  }

  // Create new subscription
  const token = nanoid(32);
  await prisma.newsletterSubscriber.create({
    data: {
      email: email.toLowerCase(),
      name: name || null,
      status: SubscriberStatus.PENDING,
      token,
      source,
    },
  });

  // Send verification email
  await sendVerificationEmail(email, token);

  return { success: true, message: "Check your email to confirm subscription" };
}

export async function confirmNewsletterSubscription(token: string) {
  const subscriber = await prisma.newsletterSubscriber.findUnique({
    where: { token },
  });

  if (!subscriber) {
    return { success: false, error: "Invalid or expired token" };
  }

  if (subscriber.status === SubscriberStatus.CONFIRMED) {
    return { success: true, message: "Already confirmed" };
  }

  await prisma.newsletterSubscriber.update({
    where: { id: subscriber.id },
    data: { status: SubscriberStatus.CONFIRMED, confirmedAt: new Date(), token: null },
  });

  return { success: true, message: "Subscription confirmed!" };
}

export async function unsubscribeFromNewsletter(email: string) {
  const subscriber = await prisma.newsletterSubscriber.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!subscriber) {
    return { success: false, error: "Not found" };
  }

  await prisma.newsletterSubscriber.update({
    where: { id: subscriber.id },
    data: { status: SubscriberStatus.UNSUBSCRIBED, unsubscribedAt: new Date() },
  });

  return { success: true, message: "Unsubscribed successfully" };
}