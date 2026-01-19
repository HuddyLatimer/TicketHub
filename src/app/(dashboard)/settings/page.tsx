import { getSession } from "@/lib/auth/session";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Settings - RBAC Admin Panel",
};

export default async function SettingsPage() {
  const session = await getSession();

  // Check if user is admin
  if (!session?.profile || session.profile.role !== "ADMIN") {
    redirect("/access-denied");
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Settings
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          System configuration and security settings
        </p>
      </div>

      {/* System Settings */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
          System Settings
        </h2>

        <div className="space-y-6">
          {/* System Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              System Name
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value="RBAC Admin Panel"
                disabled
                className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              />
              <Button variant="secondary" disabled>
                Save
              </Button>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
              The name displayed throughout the application
            </p>
          </div>

          {/* Support Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Support Email
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                value="support@company.com"
                disabled
                className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              />
              <Button variant="secondary" disabled>
                Save
              </Button>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
              Email address for support inquiries
            </p>
          </div>

          {/* System Status */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              System Status
            </label>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-green-50 dark:bg-green-900/20">
              <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-green-800 dark:text-green-300 font-medium">
                All Systems Operational
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
          Security Settings
        </h2>

        <div className="space-y-6">
          {/* Session Timeout */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Session Timeout (minutes)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={30}
                disabled
                className="w-24 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              />
              <Button variant="secondary" disabled>
                Save
              </Button>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
              Automatically log out users after this period of inactivity
            </p>
          </div>

          {/* Password Policy */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Password Policy
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked disabled />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Require at least 8 characters
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked disabled />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Require uppercase letters
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked disabled />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Require special characters
                </span>
              </label>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
              Security requirements for user passwords
            </p>
          </div>

          {/* Two-Factor Authentication */}
          <div className="pb-6 border-b border-slate-200 dark:border-slate-700">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Two-Factor Authentication
            </label>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Require 2FA for admin accounts
              </span>
              <Button variant="secondary" disabled>
                Enable
              </Button>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
              Additional security layer for privileged accounts
            </p>
          </div>
        </div>
      </div>

      {/* Data & Privacy */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
          Data & Privacy
        </h2>

        <div className="space-y-6">
          {/* Backup Settings */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Automatic Backups
            </label>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-blue-50 dark:bg-blue-900/20">
              <span className="text-sm text-blue-800 dark:text-blue-300">
                Daily at 2:00 AM UTC
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
              Last backup: 2 hours ago
            </p>
          </div>

          {/* Data Retention */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Activity Log Retention
            </label>
            <div className="flex gap-2">
              <select disabled className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm">
                <option>30 days</option>
                <option>90 days</option>
                <option>1 year</option>
              </select>
              <Button variant="secondary" disabled>
                Save
              </Button>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
              How long to keep activity logs before automatic deletion
            </p>
          </div>

          {/* GDPR Compliance */}
          <div className="pb-6 border-b border-slate-200 dark:border-slate-700">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              GDPR Compliance
            </label>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Enable right to be forgotten
              </span>
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-green-50 dark:bg-green-900/20">
                <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full" />
                <span className="text-xs text-green-800 dark:text-green-300 font-medium">
                  Enabled
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Integrations */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
          Integrations
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">
                Email Service
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                SMTP server for notifications
              </p>
            </div>
            <Button variant="secondary" disabled>
              Configure
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">
                Slack Integration
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Send alerts to Slack channels
              </p>
            </div>
            <Button variant="secondary" disabled>
              Connect
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">
                API Keys
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Manage external API access
              </p>
            </div>
            <Button variant="secondary" disabled>
              Manage
            </Button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-4">
          Danger Zone
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-lg border border-red-200 dark:border-red-800">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">
                Reset System
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Clear all data and restore defaults
              </p>
            </div>
            <Button variant="danger" disabled>
              Reset
            </Button>
          </div>

          <Alert variant="error">
            <p className="text-sm">
              Admin operations are disabled in this demo. Enable in production settings.
            </p>
          </Alert>
        </div>
      </div>
    </div>
  );
}
