import type { Prisma } from "@prisma/client";

/**
 * Mock Database Layer
 * Since we're using mock authentication, this provides mock data
 * For production, replace with real Prisma connected to a database
 */

// Use global to persist data across hot reloads in development
declare global {
  var mockDb: {
    tickets: any[];
    activityLogs: any[];
  };
}

// Initialize global mock database if not already done
if (!global.mockDb) {
  global.mockDb = {
    tickets: [],
    activityLogs: [],
  };
}

// Mock data
const MOCK_USERS = [
  {
    id: "admin-user-id",
    email: "admin@company.com",
    fullName: "Admin User",
    role: "ADMIN" as const,
    isActive: true,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: "manager-user-id",
    email: "manager@company.com",
    fullName: "Manager User",
    role: "MANAGER" as const,
    isActive: true,
    createdAt: new Date("2026-01-02"),
    updatedAt: new Date("2026-01-02"),
  },
  {
    id: "member-user-id",
    email: "member@company.com",
    fullName: "Member User",
    role: "MEMBER" as const,
    isActive: true,
    createdAt: new Date("2026-01-03"),
    updatedAt: new Date("2026-01-03"),
  },
];

// Reference global mock database
const MOCK_TICKETS = global.mockDb.tickets;
const MOCK_ACTIVITY_LOGS = global.mockDb.activityLogs;

// Create a mock Prisma-like object
export const prisma = {
  userProfile: {
    count: async (args?: any) => {
      let users = [...MOCK_USERS];
      if (args?.where?.isActive !== undefined) {
        users = users.filter((u) => u.isActive === args.where.isActive);
      }
      if (args?.where?.role) {
        users = users.filter((u) => u.role === args.where.role);
      }
      return users.length;
    },
    findMany: async (args?: any) => {
      let results = [...MOCK_USERS];
      // Handle where filters
      if (args?.where?.id?.in) {
        results = results.filter((u) => args.where.id.in.includes(u.id));
      }
      if (args?.orderBy?.createdAt === "desc") {
        results = results.reverse();
      }
      if (args?.skip) {
        results = results.slice(args.skip);
      }
      if (args?.take) {
        results = results.slice(0, args.take);
      }
      return results;
    },
    findUnique: async (args?: any) => {
      return MOCK_USERS.find((u) => u.id === args?.where?.id) || null;
    },
    update: async (args?: any) => {
      const user = MOCK_USERS.find((u) => u.id === args?.where?.id);
      if (!user) return null;
      const updated = { ...user, ...args?.data, updatedAt: new Date() };
      const index = MOCK_USERS.findIndex((u) => u.id === args?.where?.id);
      if (index >= 0) {
        MOCK_USERS[index] = updated;
      }
      return updated;
    },
    groupBy: async (args: any) => {
      if (args.by?.includes("role")) {
        const roles = ["ADMIN", "MANAGER", "MEMBER"];
        return roles.map((role) => ({
          role,
          _count: { id: MOCK_USERS.filter((u) => u.role === role).length },
        }));
      }
      return [];
    },
  },
  ticket: {
    count: async (args?: any) => {
      if (args?.where?.status) {
        return MOCK_TICKETS.filter((t) => t.status === args.where.status).length;
      }
      return MOCK_TICKETS.length;
    },
    findMany: async (args?: any) => {
      let results = [...MOCK_TICKETS];
      if (args?.include) {
        // Mock includes for createdBy and assignedTo
        return results.map((ticket) => ({
          ...ticket,
          createdBy: null,
          assignedTo: null,
        }));
      }
      return results;
    },
    findUnique: async (args?: any) => {
      const ticket = MOCK_TICKETS.find((t) => t.id === args?.where?.id);
      if (ticket) {
        return {
          ...ticket,
          createdBy: null,
          assignedTo: null,
        };
      }
      return null;
    },
    create: async (args: any) => {
      const newTicket = {
        id: `ticket-${Date.now()}`,
        ticketNumber: Math.floor(Math.random() * 10000) + 1000,
        title: args.data.title,
        description: args.data.description,
        status: "OPEN" as const,
        priority: args.data.priority,
        category: args.data.category,
        customerId: `customer-${Date.now()}`,
        customerName: args.data.customerName,
        customerEmail: args.data.customerEmail,
        createdById: args.data.createdById,
        assignedToId: args.data.assignedToId || null,
        createdAt: new Date(),
        updatedAt: new Date(),
        resolvedAt: null,
        createdBy: null,
        assignedTo: null,
      };
      MOCK_TICKETS.push(newTicket);
      return newTicket;
    },
    update: async (args: any) => {
      const ticketIndex = MOCK_TICKETS.findIndex((t) => t.id === args.where.id);
      if (ticketIndex >= 0) {
        const updatedTicket = {
          ...MOCK_TICKETS[ticketIndex],
          ...args.data,
          updatedAt: new Date(),
        };
        MOCK_TICKETS[ticketIndex] = updatedTicket;
        return { ...updatedTicket, createdBy: null, assignedTo: null };
      }
      return null;
    },
    delete: async (args: any) => {
      const ticketIndex = MOCK_TICKETS.findIndex((t) => t.id === args.where.id);
      if (ticketIndex >= 0) {
        const [deletedTicket] = MOCK_TICKETS.splice(ticketIndex, 1);
        return deletedTicket;
      }
      return null;
    },
    groupBy: async (args: any) => {
      if (args.by?.includes("priority")) {
        const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];
        return priorities.map((priority) => ({
          priority,
          _count: { id: MOCK_TICKETS.filter((t) => t.priority === priority).length },
        }));
      }
      if (args.by?.includes("status")) {
        const statuses = ["OPEN", "IN_PROGRESS", "CLOSED"];
        return statuses.map((status) => ({
          status,
          _count: { id: MOCK_TICKETS.filter((t) => t.status === status).length },
        }));
      }
      if (args.by?.includes("category")) {
        const categories = ["GENERAL", "TECHNICAL", "BILLING", "FEATURE_REQUEST", "BUG_REPORT"];
        return categories.map((category) => ({
          category,
          _count: { id: MOCK_TICKETS.filter((t) => t.category === category).length },
        }));
      }
      return [];
    },
  },
  activityLog: {
    count: async (args?: any) => {
      return MOCK_ACTIVITY_LOGS.length;
    },
    findMany: async (args?: any) => {
      let results = [...MOCK_ACTIVITY_LOGS];
      if (args?.take) {
        results = results.slice(0, args.take);
      }
      if (args?.orderBy?.createdAt === "desc") {
        results = results.reverse();
      }
      return results;
    },
    create: async (args: any) => {
      const newLog = {
        id: `activity-${Date.now()}`,
        userId: args.data.userId,
        action: args.data.action,
        entityType: args.data.entityType || null,
        entityId: args.data.entityId || null,
        metadata: args.data.metadata || null,
        ipAddress: args.data.ipAddress || null,
        userAgent: args.data.userAgent || null,
        createdAt: new Date(),
      };
      MOCK_ACTIVITY_LOGS.push(newLog);
      return newLog;
    },
    groupBy: async (args: any) => {
      if (args.by?.includes("userId")) {
        // Group by userId
        const grouped = new Map<string, number>();
        MOCK_ACTIVITY_LOGS.forEach((log) => {
          const userId = log.userId;
          grouped.set(userId, (grouped.get(userId) || 0) + 1);
        });
        return Array.from(grouped.entries())
          .map(([userId, count]) => ({
            userId,
            _count: { id: count },
          }))
          .sort((a, b) => b._count.id - a._count.id)
          .slice(0, args.take || 10);
      }
      if (args.by?.includes("action")) {
        // Group by action
        const grouped = new Map<string, number>();
        MOCK_ACTIVITY_LOGS.forEach((log) => {
          const action = log.action;
          grouped.set(action, (grouped.get(action) || 0) + 1);
        });
        return Array.from(grouped.entries()).map(([action, count]) => ({
          action,
          _count: { id: count },
        }));
      }
      return [];
    },
  },
};
