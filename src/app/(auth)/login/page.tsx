import { LoginForm } from "@/components/auth/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Sign In
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              RBAC Admin Panel
            </p>
          </div>

          <LoginForm />

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="flex gap-4 text-xs">
              <Link
                href="/signup"
                className="flex-1 text-center px-2 py-2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
          <p className="mb-4">
            <strong>Demo Credentials:</strong>
          </p>
          <ul className="space-y-1 text-xs">
            <li>Admin: admin@company.com / password123</li>
            <li>Manager: manager@company.com / password123</li>
            <li>Member: member@company.com / password123</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
