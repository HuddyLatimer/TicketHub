"use server";

import { getSession, requireSession } from "@/lib/auth/session";
import {
  canAccessTicket,
  canEditTicket,
  canAssignTicket,
  canDeleteTicket,
  hasPermission,
} from "@/lib/auth/permissions";
import { prisma } from "@/lib/db/prisma";
import { logActivity } from "@/lib/utils/activity-logger";
import { createTicketSchema, updateTicketSchema } from "@/lib/validations/ticket";

interface GetTicketsParams {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  category?: string;
  search?: string;
}

export async function getTickets(params: GetTicketsParams) {
  try {
    const session = await requireSession();
    const page = params.page || 1;
    const limit = params.limit || 15;
    const skip = (page - 1) * limit;

    let where: any = {};

    // Apply search and filter parameters
    if (params.status) {
      where.status = params.status;
    }
    if (params.priority) {
      where.priority = params.priority;
    }
    if (params.category) {
      where.category = params.category;
    }
    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: "insensitive" } },
        { ticketNumber: parseInt(params.search) || 0 },
      ];
    }

    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        include: { assignedTo: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.ticket.count({ where }),
    ]);

    const canCreate =
      session.profile?.role === "ADMIN" ||
      session.profile?.role === "MANAGER";

    return {
      tickets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      canCreate,
    };
  } catch (error) {
    console.error("Error fetching tickets:", error);
    throw error;
  }
}

export async function getTicketById(id: string) {
  try {
    const session = await requireSession();

    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: { assignedTo: true },
    });

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    if (!canAccessTicket(session.profile, ticket)) {
      throw new Error("Access denied");
    }

    const canEdit = canEditTicket(session.profile, ticket);
    const canAssign = canAssignTicket(session.profile);

    return {
      ticket,
      canEdit,
      canAssign,
    };
  } catch (error) {
    console.error("Error fetching ticket:", error);
    throw error;
  }
}

export async function createTicket(data: any) {
  try {
    const session = await requireSession();

    if (!hasPermission(session.profile, "create_ticket")) {
      throw new Error("Permission denied");
    }

    const validatedData = createTicketSchema.parse(data);

    const ticket = await prisma.ticket.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        customerName: validatedData.customerName,
        customerEmail: validatedData.customerEmail,
        category: validatedData.category,
        priority: validatedData.priority,
        assignedToId: validatedData.assignedToId || null,
        createdById: session.user.id,
      },
      include: { assignedTo: true },
    });

    await logActivity({
      userId: session.user.id,
      action: "TICKET_CREATED",
      entityType: "Ticket",
      entityId: ticket.id,
      metadata: {
        ticketNumber: ticket.ticketNumber,
        title: ticket.title,
        priority: ticket.priority,
      },
    });

    return {
      success: true,
      ticket,
    };
  } catch (error) {
    console.error("Error creating ticket:", error);
    throw error;
  }
}

export async function updateTicket(id: string, data: any) {
  try {
    const session = await requireSession();

    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: { assignedTo: true },
    });

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    if (!canEditTicket(session.profile, ticket)) {
      throw new Error("Permission denied");
    }

    const validatedData = updateTicketSchema.parse(data);

    const updated = await prisma.ticket.update({
      where: { id },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        category: validatedData.category,
        priority: validatedData.priority,
        status: validatedData.status,
        assignedToId: validatedData.assignedToId || null,
        resolvedAt:
          validatedData.status === "RESOLVED" ||
          validatedData.status === "CLOSED"
            ? new Date()
            : ticket.resolvedAt,
      },
      include: { assignedTo: true },
    });

    await logActivity({
      userId: session.user.id,
      action: "TICKET_UPDATED",
      entityType: "Ticket",
      entityId: id,
      metadata: {
        ticketNumber: ticket.ticketNumber,
        changes: {
          status: [ticket.status, validatedData.status],
          priority: [ticket.priority, validatedData.priority],
        },
      },
    });

    return {
      success: true,
      ticket: updated,
    };
  } catch (error) {
    console.error("Error updating ticket:", error);
    throw error;
  }
}

export async function deleteTicket(id: string) {
  try {
    const session = await requireSession();

    if (!hasPermission(session.profile, "delete_ticket")) {
      throw new Error("Permission denied");
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id },
    });

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    await prisma.ticket.delete({
      where: { id },
    });

    await logActivity({
      userId: session.user.id,
      action: "TICKET_DELETED",
      entityType: "Ticket",
      entityId: id,
      metadata: {
        ticketNumber: ticket.ticketNumber,
        title: ticket.title,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting ticket:", error);
    throw error;
  }
}
