import type { UserProfile, Role, Ticket } from "@prisma/client";

export type Permission =
  | "manage_users"
  | "manage_roles"
  | "view_all_tickets"
  | "create_ticket"
  | "edit_ticket"
  | "delete_ticket"
  | "assign_ticket"
  | "view_analytics"
  | "view_activity_logs"
  | "manage_settings";

const rolePermissions: Record<Role, Permission[]> = {
  ADMIN: [
    "manage_users",
    "manage_roles",
    "view_all_tickets",
    "create_ticket",
    "edit_ticket",
    "delete_ticket",
    "assign_ticket",
    "view_analytics",
    "view_activity_logs",
    "manage_settings",
  ],
  MANAGER: [
    "view_all_tickets",
    "create_ticket",
    "edit_ticket",
    "assign_ticket",
    "view_analytics",
  ],
  MEMBER: [],
};

export function hasPermission(
  user: Partial<UserProfile> | null | undefined,
  permission: Permission
): boolean {
  if (!user || !user.role) return false;
  const permissions = rolePermissions[user.role];
  return permissions.includes(permission);
}

export function canAccessTicket(
  user: Partial<UserProfile> | null | undefined,
  ticket: Ticket
): boolean {
  if (!user) return false;

  // All authenticated users can access all tickets
  return true;
}

export function canEditTicket(
  user: Partial<UserProfile> | null | undefined,
  ticket: Ticket
): boolean {
  if (!user || !user.role) return false;

  // Admins can edit any ticket
  if (user.role === "ADMIN") return true;

  // Managers can edit any ticket
  if (user.role === "MANAGER") return true;

  // Members cannot edit tickets
  return false;
}

export function canAssignTicket(
  user: Partial<UserProfile> | null | undefined
): boolean {
  if (!user || !user.role) return false;
  return user.role === "ADMIN" || user.role === "MANAGER";
}

export function canDeleteTicket(
  user: Partial<UserProfile> | null | undefined
): boolean {
  if (!user || !user.role) return false;
  return user.role === "ADMIN";
}

export function canViewAnalytics(
  user: Partial<UserProfile> | null | undefined
): boolean {
  if (!user || !user.role) return false;
  return user.role === "ADMIN" || user.role === "MANAGER";
}

export function canViewActivityLogs(
  user: Partial<UserProfile> | null | undefined
): boolean {
  if (!user || !user.role) return false;
  return user.role === "ADMIN";
}

export function canManageUsers(
  user: Partial<UserProfile> | null | undefined
): boolean {
  if (!user || !user.role) return false;
  return user.role === "ADMIN";
}
