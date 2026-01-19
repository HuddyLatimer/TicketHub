"use server";

import { loginSchema, signupSchema } from "@/lib/validations/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

/**
 * Mock Authentication Actions
 * This is a placeholder implementation for learning/demo purposes
 * For production, replace with real Supabase authentication
 */

// Demo users - replace with real authentication
const DEMO_USERS: Record<string, { id: string; password: string; fullName: string; role: string }> = {
  "admin@company.com": {
    id: "admin-user-id",
    password: "password123",
    fullName: "Admin User",
    role: "ADMIN",
  },
  "manager@company.com": {
    id: "manager-user-id",
    password: "password123",
    fullName: "Manager User",
    role: "MANAGER",
  },
  "member@company.com": {
    id: "member-user-id",
    password: "password123",
    fullName: "Member User",
    role: "MEMBER",
  },
};

// Mock session storage
const sessions = new Map<string, { userId: string; email: string; role: string }>();

export async function loginAction(email: string, password: string) {
  try {
    const validatedData = loginSchema.parse({ email, password });

    // Check demo users
    const user = DEMO_USERS[validatedData.email];
    if (!user || user.password !== validatedData.password) {
      return { error: "Invalid email or password" };
    }

    // Import setCurrentSession to update session
    const { setCurrentSession } = await import("@/lib/auth/session");
    setCurrentSession(user.id, validatedData.email, user.role as any);

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set("session", JSON.stringify({ userId: user.id, email: validatedData.email, role: user.role }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Redirect to dashboard
    redirect("/dashboard");
  } catch (error) {
    // Don't catch redirect errors
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error;
    }

    // Return other errors
    return {
      error: error instanceof Error ? error.message : "An error occurred during login",
    };
  }
}

export async function signupAction(
  email: string,
  password: string,
  fullName: string
) {
  try {
    const validatedData = signupSchema.parse({
      email,
      password,
      fullName,
    });

    // Check if user already exists in demo users
    if (validatedData.email in DEMO_USERS) {
      return { error: "User already exists" };
    }

    // Add new user to demo users
    DEMO_USERS[validatedData.email] = {
      id: `user-${Date.now()}`,
      password: validatedData.password,
      fullName: validatedData.fullName,
      role: "MEMBER",
    };

    // Redirect to login
    redirect("/login?message=Account created! Please sign in.");
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "An error occurred during signup",
    };
  }
}

export async function logoutAction() {
  try {
    // Clear session
    const { clearCurrentSession } = await import("@/lib/auth/session");
    clearCurrentSession();

    // Clear session cookie
    const cookieStore = await cookies();
    cookieStore.delete("session");

    redirect("/login");
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "An error occurred during logout",
    };
  }
}
