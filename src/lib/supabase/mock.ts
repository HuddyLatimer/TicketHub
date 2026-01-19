/**
 * Mock Supabase Implementation
 * This is a placeholder for learning/demo purposes
 * Replace with real Supabase in production
 */

// Mock user sessions stored in memory
const sessions = new Map<string, { userId: string; email: string }>();

// Mock demo users
const mockUsers = {
  "admin@company.com": {
    id: "admin-user-id-12345",
    email: "admin@company.com",
    password: "password123",
  },
  "manager@company.com": {
    id: "manager-user-id-12345",
    email: "manager@company.com",
    password: "password123",
  },
  "member@company.com": {
    id: "member-user-id-12345",
    email: "member@company.com",
    password: "password123",
  },
};

export interface MockAuthUser {
  id: string;
  email: string;
}

export const mockAuth = {
  /**
   * Sign in user with email and password
   * Demo only - uses hardcoded credentials
   */
  signInWithPassword: async (email: string, password: string) => {
    const user = mockUsers[email as keyof typeof mockUsers];

    if (!user || user.password !== password) {
      return {
        data: null,
        error: { message: "Invalid email or password" },
      };
    }

    const sessionToken = `session-${Date.now()}-${Math.random()}`;
    sessions.set(sessionToken, { userId: user.id, email: user.email });

    return {
      data: {
        user: { id: user.id, email: user.email },
        session: { access_token: sessionToken },
      },
      error: null,
    };
  },

  /**
   * Sign up new user
   * Demo only - creates temporary user
   */
  signUp: async (email: string, password: string) => {
    // Check if user already exists
    if (email in mockUsers) {
      return {
        data: null,
        error: { message: "User already exists" },
      };
    }

    const userId = `user-${Date.now()}`;
    const newUser = { id: userId, email, password };

    // Store in mock users
    mockUsers[email as keyof typeof mockUsers] = newUser;

    return {
      data: {
        user: { id: userId, email },
      },
      error: null,
    };
  },

  /**
   * Get current user from session
   */
  getUser: async () => {
    // In a real app, this would read from request headers/cookies
    // For demo, we'll use a simple approach
    try {
      // Mock: return first session if exists, or null
      const firstSession = sessions.values().next().value;
      if (firstSession) {
        return {
          data: {
            user: {
              id: firstSession.userId,
              email: firstSession.email,
            },
          },
          error: null,
        };
      }
    } catch {
      // Silently fail
    }

    return { data: { user: null }, error: null };
  },

  /**
   * Sign out user
   */
  signOut: async () => {
    // Clear all sessions
    sessions.clear();
    return { error: null };
  },
};

/**
 * Mock database for storing data
 * In production, use Prisma + actual database
 */
export const mockDatabase = {
  users: new Map(),
  tickets: new Map(),
  activityLogs: new Map(),
};

export default mockAuth;
