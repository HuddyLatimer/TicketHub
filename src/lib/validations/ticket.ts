import { z } from "zod";

export const createTicketSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  customerName: z.string().min(2, "Customer name is required"),
  customerEmail: z.string().email("Invalid customer email"),
  category: z.enum([
    "GENERAL",
    "TECHNICAL",
    "BILLING",
    "FEATURE_REQUEST",
    "BUG_REPORT",
  ]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  assignedToId: z.string().uuid().optional().or(z.literal("")),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;

export const updateTicketSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum([
    "GENERAL",
    "TECHNICAL",
    "BILLING",
    "FEATURE_REQUEST",
    "BUG_REPORT",
  ]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  status: z.enum([
    "OPEN",
    "IN_PROGRESS",
    "WAITING_ON_CUSTOMER",
    "RESOLVED",
    "CLOSED",
  ]),
  assignedToId: z.string().uuid().optional().or(z.literal("")),
});

export type UpdateTicketInput = z.infer<typeof updateTicketSchema>;
