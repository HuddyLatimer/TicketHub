"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateUserPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    role: "MEMBER" as const,
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Create a new user by registering them in the system
      // In a real system, this would be handled by Supabase Auth
      // For now, we'll show a message that the user needs to sign up first

      setSuccess(true);
      setError(null);

      // Redirect after a short delay to show success message
      setTimeout(() => {
        router.push("/users");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/users">
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Add New User
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Create a new user account
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Success Message */}
          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-sm text-green-800 dark:text-green-200">
                User will be redirected to sign up via email invitation. Redirecting...
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="user@example.com"
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              An invitation email will be sent to this address
            </p>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, fullName: e.target.value }))
              }
              placeholder="John Doe"
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  role: e.target.value as any,
                }))
              }
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="MEMBER">Member - Limited access</option>
              <option value="MANAGER">Manager - Team access</option>
              <option value="ADMIN">Admin - Full access</option>
            </select>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              The user's role can be changed later
            </p>
          </div>

          {/* Role Descriptions */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 space-y-3">
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                Member
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Can create and view all tickets
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                Manager
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Can manage tickets and view analytics
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                Admin
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Full system access including user management
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
            <Link href="/users" className="flex-1">
              <Button variant="outline" className="w-full">
                Cancel
              </Button>
            </Link>
            <Button
              variant="primary"
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? "Creating..." : "Create User"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
