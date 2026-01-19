"use server";

import { getSession, requireSession } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/db/prisma";
import { logActivity } from "@/lib/utils/activity-logger";
import { updateUserRoleSchema } from "@/lib/validations/user";

export async function getUsers(page: number = 1, limit: number = 10) {
  try {
    const session = await requireSession();

    if (!hasPermission(session.profile, "manage_users")) {
      throw new Error("Permission denied");
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.userProfile.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.userProfile.count(),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function getUserById(id: string) {
  try {
    const session = await requireSession();

    if (!hasPermission(session.profile, "manage_users")) {
      throw new Error("Permission denied");
    }

    const user = await prisma.userProfile.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

export async function updateUserRole(id: string, data: any) {
  try {
    const session = await requireSession();

    if (!hasPermission(session.profile, "manage_roles")) {
      throw new Error("Permission denied");
    }

    const validatedData = updateUserRoleSchema.parse(data);

    const user = await prisma.userProfile.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const oldRole = user.role;

    const updated = await prisma.userProfile.update({
      where: { id },
      data: {
        role: validatedData.role,
      },
    });

    await logActivity({
      userId: session.user.id,
      action: "USER_ROLE_CHANGED",
      entityType: "UserProfile",
      entityId: id,
      metadata: {
        email: user.email,
        oldRole,
        newRole: validatedData.role,
      },
    });

    return {
      success: true,
      user: updated,
    };
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
}

export async function toggleUserActive(id: string, isActive: boolean) {
  try {
    const session = await requireSession();

    if (!hasPermission(session.profile, "manage_users")) {
      throw new Error("Permission denied");
    }

    const user = await prisma.userProfile.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const updated = await prisma.userProfile.update({
      where: { id },
      data: { isActive },
    });

    await logActivity({
      userId: session.user.id,
      action: isActive ? "USER_ACTIVATED" : "USER_DEACTIVATED",
      entityType: "UserProfile",
      entityId: id,
      metadata: {
        email: user.email,
        isActive,
      },
    });

    return {
      success: true,
      user: updated,
    };
  } catch (error) {
    console.error("Error toggling user active status:", error);
    throw error;
  }
}
