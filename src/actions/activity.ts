"use server";

import { requireSession } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/db/prisma";

interface GetActivityLogsParams {
  page?: number;
  limit?: number;
  action?: string;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
}

export async function getActivityLogs(params: GetActivityLogsParams) {
  try {
    const session = await requireSession();

    if (!hasPermission(session.profile, "view_activity_logs")) {
      throw new Error("Permission denied");
    }

    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    let where: any = {};

    if (params.action) {
      where.action = params.action;
    }
    if (params.userId) {
      where.userId = params.userId;
    }
    if (params.startDate || params.endDate) {
      where.createdAt = {};
      if (params.startDate) {
        where.createdAt.gte = params.startDate;
      }
      if (params.endDate) {
        where.createdAt.lte = params.endDate;
      }
    }

    const [logs, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        include: { user: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.activityLog.count({ where }),
    ]);

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    throw error;
  }
}
