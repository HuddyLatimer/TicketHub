import { SignupForm } from "@/components/auth/SignupForm";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Create Account
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Join the RBAC Admin Panel
            </p>
          </div>

          <SignupForm />

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="flex gap-4 text-xs">
              <Link
                href="/login"
                className="flex-1 text-center px-2 py-2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
          <p>
            By signing up, you agree to our{" "}
            <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">
              Terms of Service
            </a>
            {" "}and{" "}
            <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
