import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { Badge } from "@/components/ui/Badge";
import { redirect } from "next/navigation";
import { FileText } from "lucide-react";

export const metadata = {
  title: "Activity Logs - TicketHub",
};

export default async function ActivityPage() {
  const session = await getSession();

  // Check if user is admin
  if (!session?.profile || session.profile.role !== "ADMIN") {
    redirect("/access-denied");
  }

  // Fetch activity logs
  const logs = await prisma.activityLog.findMany({
    include: {
      user: true,
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  // Group logs by resource type
  const resourceTypes = [...new Set(logs.map((l) => l.resourceType).filter(Boolean))];
  const actionTypes = [...new Set(logs.map((l) => l.action).filter(Boolean))];

  // Get today's activity
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayLogs = logs.filter((l) => new Date(l.createdAt) >= today);

  // Get this week's activity
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekLogs = logs.filter((l) => new Date(l.createdAt) >= weekAgo);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Activity Logs
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          System-wide audit trail and user activity
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Total Logs
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {logs.length}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Today
          </p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            {todayLogs.length}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            This Week
          </p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
            {weekLogs.length}
          </p>
        </div>
      </div>

      {/* Activity Filter Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
            Resource Types
          </h3>
          <div className="flex flex-wrap gap-2">
            {resourceTypes.map((type) => (
              <Badge key={type} variant="outline">
                {type}
              </Badge>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
            Action Types
          </h3>
          <div className="flex flex-wrap gap-2">
            {actionTypes.map((action) => (
              <Badge key={action} variant="outline">
                {action}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Logs Table */}
      <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
                User
              </th>
              <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
                Action
              </th>
              <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
                Resource Type
              </th>
              <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
                Details
              </th>
              <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
                Timestamp
              </th>
            </tr>
          </thead>
          <tbody>
            {logs.length > 0 ? (
              logs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {log.user?.fullName}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {log.user?.email}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline">{log.action}</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline">{log.resourceType}</Badge>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                    <span className="text-xs font-mono">
                      {log.resourceId?.substring(0, 12)}...
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                    <div className="text-xs">
                      <p>{new Date(log.createdAt).toLocaleDateString()}</p>
                      <p className="text-slate-500 dark:text-slate-500">
                        {new Date(log.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="py-8 px-4 text-center text-slate-600 dark:text-slate-400"
                >
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="w-10 h-10 text-slate-400" />
                    <p>No activity logs found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Admin Info */}
      <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg border border-yellow-200 dark:border-yellow-800 p-4">
        <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
          Audit Trail
        </h3>
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          This log maintains a complete record of all system activities for
          compliance and security purposes. Every user action is tracked,
          including logins, data modifications, and access changes.
        </p>
      </div>
    </div>
  );
}
