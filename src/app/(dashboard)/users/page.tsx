import { getSession, requireRole } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { UserTable } from "@/components/users/UserTable";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Users - RBAC Admin Panel",
};

export default async function UsersPage() {
  const session = await getSession();

  // Check if user is admin
  if (!session?.profile || session.profile.role !== "ADMIN") {
    redirect("/access-denied");
  }

  // Fetch all users
  const users = await prisma.userProfile.findMany({
    orderBy: { createdAt: "desc" },
  });

  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const managerCount = users.filter((u) => u.role === "MANAGER").length;
  const memberCount = users.filter((u) => u.role === "MEMBER").length;
  const activeCount = users.filter((u) => u.isActive).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            User Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Manage users, roles, and permissions
          </p>
        </div>
        <Link href="/users/new">
          <Button variant="primary">Add User</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Total Users
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {users.length}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Active
          </p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
            {activeCount}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Admins
          </p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
            {adminCount}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Managers
          </p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            {managerCount}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Members
          </p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
            {memberCount}
          </p>
        </div>
      </div>

      {/* Users Table */}
      <UserTable users={users} />

      {/* Admin Info */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">
          Admin Only
        </h3>
        <p className="text-sm text-red-800 dark:text-red-200">
          This page is only accessible to administrators. Use this panel to
          manage user accounts, assign roles, and control system access.
        </p>
      </div>
    </div>
  );
}
