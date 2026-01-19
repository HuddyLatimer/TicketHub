import { Badge } from "@/components/ui/Badge";
import { Users as UsersIcon } from "lucide-react";
import type { UserProfile } from "@prisma/client";

interface UserTableProps {
  users: UserProfile[];
}

export function UserTable({ users }: UserTableProps) {
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200";
      case "MANAGER":
        return "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200";
      case "MEMBER":
        return "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200";
      default:
        return "bg-slate-100 dark:bg-slate-900/20 text-slate-800 dark:text-slate-200";
    }
  };

  return (
    <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
            <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
              Name
            </th>
            <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
              Email
            </th>
            <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
              Role
            </th>
            <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
              Status
            </th>
            <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
              Joined
            </th>
            <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
              Last Activity
            </th>
            <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {user.fullName}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      ID: {user.id.substring(0, 8)}
                    </p>
                  </div>
                </td>
                <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                  {user.email}
                </td>
                <td className="py-3 px-4">
                  <Badge className={`${getRoleBadgeVariant(user.role)}`}>
                    {user.role}
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  <Badge
                    variant={user.isActive ? "primary" : "secondary"}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                  {new Date(user.updatedAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button
                      className="text-primary-600 dark:text-primary-400 hover:underline font-medium text-xs"
                      aria-label={`Edit ${user.fullName}`}
                    >
                      Edit
                    </button>
                    <span className="text-slate-400 dark:text-slate-600">•</span>
                    <button
                      className="text-red-600 dark:text-red-400 hover:underline font-medium text-xs"
                      aria-label={`Delete ${user.fullName}`}
                    >
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={7}
                className="py-8 px-4 text-center text-slate-600 dark:text-slate-400"
              >
                <div className="flex flex-col items-center gap-2">
                  <UsersIcon className="w-10 h-10 text-slate-400" />
                  <p>No users found</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
