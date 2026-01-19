"use client";

import { useState } from "react";
import { loginAction } from "@/actions/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import Link from "next/link";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await loginAction(email, password);
      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during login"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="error">
          <p>{error}</p>
        </Alert>
      )}

      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="admin@company.com"
        required
      />

      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="password123"
        required
      />

      <Button type="submit" variant="primary" isLoading={isLoading} className="w-full">
        Sign In
      </Button>

      <div className="text-center text-sm">
        <p className="text-slate-600 dark:text-slate-400">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
          Demo Credentials:
        </p>
        <div className="space-y-2 text-xs">
          <p>
            <strong>Admin:</strong> admin@company.com / password123
          </p>
          <p>
            <strong>Manager:</strong> manager@company.com / password123
          </p>
          <p>
            <strong>Member:</strong> member@company.com / password123
          </p>
        </div>
      </div>
    </form>
  );
}
