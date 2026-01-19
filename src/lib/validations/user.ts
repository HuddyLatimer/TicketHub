import { z } from "zod";

export const updateUserRoleSchema = z.object({
  role: z.enum(["ADMIN", "MANAGER", "MEMBER"]),
});

export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;

export const toggleUserActiveSchema = z.object({
  isActive: z.boolean(),
});

export type ToggleUserActiveInput = z.infer<typeof toggleUserActiveSchema>;
