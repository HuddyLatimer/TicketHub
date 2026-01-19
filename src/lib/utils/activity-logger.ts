import { prisma } from "@/lib/db/prisma";
import type { ActivityLog } from "@prisma/client";

export interface LogActivityParams {
  userId: string;
  action: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export async function logActivity(
  params: LogActivityParams
): Promise<ActivityLog> {
  return prisma.activityLog.create({
    data: {
      userId: params.userId,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      metadata: params.metadata || null,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
    },
  });
}
