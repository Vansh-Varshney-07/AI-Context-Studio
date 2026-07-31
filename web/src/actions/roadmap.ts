"use server";

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export interface RoadmapFilters {
  status?: "COMPLETED" | "IN_PROGRESS" | "PLANNED" | "FUTURE" | "CANCELLED";
  phase?: string;
}

export async function getRoadmapItems(filters: RoadmapFilters = {}) {
  const { status, phase } = filters;

  const where: Prisma.RoadmapItemWhereInput = {};
  if (status) where.status = status;
  if (phase) where.phase = phase;

  return prisma.roadmapItem.findMany({
    where,
    include: {
      votes: { select: { id: true, userId: true, type: true } },
      _count: { select: { votes: true } },
    },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}

export async function getRoadmapStats() {
  const [completed, inProgress, planned, future] = await Promise.all([
    prisma.roadmapItem.count({ where: { status: "COMPLETED" } }),
    prisma.roadmapItem.count({ where: { status: "IN_PROGRESS" } }),
    prisma.roadmapItem.count({ where: { status: "PLANNED" } }),
    prisma.roadmapItem.count({ where: { status: "FUTURE" } }),
  ]);

  return { completed, inProgress, planned, future, total: completed + inProgress + planned + future };
}

export async function voteRoadmapItem(itemId: string, userId: string, type: "UP" | "DOWN") {
  return prisma.roadmapVote.upsert({
    where: { itemId_userId: { itemId, userId } },
    create: { itemId, userId, type },
    update: { type },
  });
}

export async function removeRoadmapVote(itemId: string, userId: string) {
  return prisma.roadmapVote.delete({ where: { itemId_userId: { itemId, userId } } });
}