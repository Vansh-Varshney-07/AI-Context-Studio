"use server";

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { sendEmail } from "@/lib/resend";

export interface ContactMessageData {
  name: string;
  email: string;
  subject: string;
  message: string;
  type: "GENERAL" | "SUPPORT" | "BUG_REPORT" | "FEATURE_REQUEST" | "SECURITY" | "PARTNERSHIP" | "PRESS" | "ENTERPRISE";
}

export async function submitContactMessage(data: ContactMessageData, userId?: string) {
  // Validate
  if (!data.name || !data.email || !data.subject || !data.message) {
    return { success: false, error: "All fields are required" };
  }
  if (!data.email.includes("@")) {
    return { success: false, error: "Invalid email address" };
  }

  const contactMessage = await prisma.contactMessage.create({
    data: {
      name: data.name,
      email: data.email.toLowerCase(),
      subject: data.subject,
      message: data.message,
      type: data.type,
      userId: userId || null,
    },
  });

  // Send notification email to team
  await sendEmail({
    to: "support@ai-context-studio.dev",
    subject: `[Contact] ${data.type}: ${data.subject}`,
    html: `
      <h2>New Contact Message</h2>
      <p><strong>Type:</strong> ${data.type}</p>
      <p><strong>From:</strong> ${data.name} <${data.email}></p>
      <p><strong>Subject:</strong> ${data.subject}</p>
      <p><strong>Message:</strong></p>
      <pre>${data.message}</pre>
      <hr>
      <p>View in admin: <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/contacts/${contactMessage.id}">${contactMessage.id}</a></p>
    `,
  });

  // Send auto-reply
  await sendEmail({
    to: data.email,
    subject: `We received your message: ${data.subject}`,
    html: `
      <p>Hi ${data.name},</p>
      <p>Thank you for contacting AI Context Studio. We've received your message and will get back to you within 1-2 business days.</p>
      <p><strong>Your reference:</strong> ${contactMessage.id}</p>
      <hr>
      <p>Best regards,<br>The AI Context Studio Team</p>
    `,
  });

  return { success: true, message: "Message sent successfully", id: contactMessage.id };
}

export async function getContactMessages(params: {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
}) {
  const { page = 1, limit = 50, status, type } = params;
  const where: Prisma.ContactMessageWhereInput = {};

  if (status) where.status = status as "NEW" | "IN_PROGRESS" | "WAITING_USER" | "RESOLVED" | "CLOSED";
  if (type) where.type = type as "GENERAL" | "SUPPORT" | "BUG_REPORT" | "FEATURE_REQUEST" | "SECURITY" | "PARTNERSHIP" | "PRESS" | "ENTERPRISE";

  const [messages, totalCount] = await Promise.all([
    prisma.contactMessage.findMany({
      where,
      include: { user: { select: { id: true, name: true, username: true, email: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.contactMessage.count({ where }),
  ]);

  return { messages, totalCount, totalPages: Math.ceil(totalCount / limit), currentPage: page };
}

export async function getContactMessageById(id: string) {
  return prisma.contactMessage.findUnique({
    where: { id },
    include: { user: { select: { id: true, name: true, username: true, email: true } } },
  });
}

export async function updateContactMessage(id: string, data: {
  status?: "NEW" | "IN_PROGRESS" | "WAITING_USER" | "RESOLVED" | "CLOSED";
  assignedTo?: string;
  response?: string;
}) {
  return prisma.contactMessage.update({
    where: { id },
    data: {
      ...data,
      respondedAt: data.response ? new Date() : null,
    },
  });
}

export async function sendReply(id: string, reply: string, fromEmail: string) {
  const message = await prisma.contactMessage.findUnique({ where: { id } });
  if (!message) return { success: false, error: "Message not found" };

  await sendEmail({
    to: message.email,
    subject: `Re: ${message.subject}`,
    html: `
      <p>Hi ${message.name},</p>
      <p>${reply.replace(/\n/g, "<br>")}</p>
      <hr>
      <p>Best regards,<br>The AI Context Studio Team</p>
    `,
  });

  await prisma.contactMessage.update({
    where: { id },
    data: { response: reply, respondedAt: new Date(), status: "RESOLVED" },
  });

  return { success: true };
}