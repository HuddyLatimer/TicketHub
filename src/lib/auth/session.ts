import type { Role } from "@prisma/client";
import { cookies } from "next/headers";

/**
 * Mock Session Management
 * For production, replace with real Supabase authentication
 */

// Mock user profiles
const MOCK_PROFILES: Record<string, { id: string; email: string; fullName: string; role: Role; isActive: boolean }> = {
  "admin-user-id": {
    id: "admin-user-id",
    email: "admin@company.com",
    fullName: "Admin User",
    role: "ADMIN",
    isActive: true,
  },
  "manager-user-id": {
    id: "manager-user-id",
    email: "manager@company.com",
    fullName: "Manager User",
    role: "MANAGER",
    isActive: true,
  },
  "member-user-id": {
    id: "member-user-id",
    email: "member@company.com",
    fullName: "Member User",
    role: "MEMBER",
    isActive: true,
  },
};

// Store current session in memory (in production, use secure cookies)
let currentSession: { userId: string; email: string; role: Role } | null = null;

export interface Session {
  user: {
    id: string;
    email: string;
  };
  profile?: {
    id: string;
    email: string;
    fullName?: string;
    role: Role;
    isActive: boolean;
  };
}

/**
 * Get current user session
 */
export async function getSession(): Promise<Session | null> {
  try {
    // Try to get session from cookie first
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (sessionCookie?.value) {
      try {
        const sessionData = JSON.parse(sessionCookie.value);
        const profile = MOCK_PROFILES[sessionData.userId];
        if (profile) {
          return {
            user: {
              id: sessionData.userId,
              email: sessionData.email,
            },
            profile: {
              id: profile.id,
              email: profile.email,
              fullName: profile.fullName,
              role: profile.role,
              isActive: profile.isActive,
            },
          };
        }
      } catch (e) {
        console.error("Error parsing session cookie:", e);
      }
    }

    // Fall back to in-memory session
    if (currentSession) {
      const profile = MOCK_PROFILES[currentSession.userId];
      if (profile) {
        return {
          user: {
            id: currentSession.userId,
            email: currentSession.email,
          },
          profile: {
            id: profile.id,
            email: profile.email,
            fullName: profile.fullName,
            role: profile.role,
            isActive: profile.isActive,
          },
        };
      }
    }
    return null;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

/**
 * Set current session
 */
export function setCurrentSession(userId: string, email: string, role: Role) {
  currentSession = { userId, email, role };
}

/**
 * Clear current session
 */
export function clearCurrentSession() {
  currentSession = null;
}

/**
 * Require active session or throw error
 */
export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) {
    throw new Error("Not authenticated");
  }
  return session;
}

/**
 * Check if session user has one of the specified roles
 */
export function hasRole(session: Session | null, roles: Role[]): boolean {
  if (!session?.profile) return false;
  return roles.includes(session.profile.role);
}

/**
 * Require user to have one of the specified roles
 */
export function requireRole(session: Session | null, roles: Role[]): void {
  if (!hasRole(session, roles)) {
    throw new Error("Unauthorized: insufficient permissions");
  }
}
