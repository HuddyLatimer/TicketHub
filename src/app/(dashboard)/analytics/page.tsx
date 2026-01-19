import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { Badge } from "@/components/ui/Badge";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Analytics - RBAC Admin Panel",
};

export default async function AnalyticsPage() {
  const session = await getSession();

  // Check if user is admin or manager
  if (!session?.profile || !["ADMIN", "MANAGER"].includes(session.profile.role)) {
    redirect("/access-denied");
  }

  // Fetch analytics data
  const totalTickets = await prisma.ticket.count();
  const totalUsers = await prisma.userProfile.count();

  // Tickets by status
  const ticketsByStatus = await prisma.ticket.groupBy({
    by: ["status"],
    _count: {
      id: true,
    },
  });

  // Tickets by priority
  const ticketsByPriority = await prisma.ticket.groupBy({
    by: ["priority"],
    _count: {
      id: true,
    },
  });

  // Users by role
  const usersByRole = await prisma.userProfile.groupBy({
    by: ["role"],
    _count: {
      id: true,
    },
  });

  // Active users (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const activityLastMonth = await prisma.activityLog.groupBy({
    by: ["createdAt"],
    _count: {
      id: true,
    },
  });

  // Most active users
  const mostActiveUsers = await prisma.activityLog.groupBy({
    by: ["userId"],
    _count: {
      id: true,
    },
    orderBy: {
      _count: {
        id: "desc",
      },
    },
    take: 10,
  });

  // Fetch user details for most active users
  const mostActiveUserIds = mostActiveUsers
    .filter((u: any) => u.userId)
    .map((u: any) => u.userId) as string[];
  const activeUsersDetails = await prisma.userProfile.findMany({
    where: { id: { in: mostActiveUserIds } },
  });

  // Create a map for easy lookup
  const userMap = new Map(activeUsersDetails.map((u) => [u.id, u]));

  // Average resolution time
  const closedTickets = await prisma.ticket.findMany({
    where: { status: "CLOSED" },
    select: {
      createdAt: true,
      updatedAt: true,
    },
  });

  const avgResolutionTime =
    closedTickets.length > 0
      ? Math.round(
          closedTickets.reduce((acc, ticket) => {
            const created = new Date(ticket.createdAt).getTime();
            const updated = new Date(ticket.updatedAt).getTime();
            return acc + (updated - created);
          }, 0) /
            closedTickets.length /
            (1000 * 60 * 60) // Convert to hours
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Analytics
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          System performance and usage metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Total Tickets
          </p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
            {totalTickets}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Total Users
          </p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
            {totalUsers}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Closed Tickets
          </p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">
            {closedTickets.length}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Avg Resolution
          </p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            {avgResolutionTime}h
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets by Status */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Tickets by Status
          </h3>
          <div className="space-y-3">
            {ticketsByStatus.length > 0 ? (
              ticketsByStatus.map((item: any) => {
                const percentage =
                  totalTickets > 0
                    ? Math.round((item._count.id / totalTickets) * 100)
                    : 0;
                return (
                  <div key={item.status}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {item.status}
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {item._count.id}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      {percentage}%
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-slate-600 dark:text-slate-400">
                No ticket data
              </p>
            )}
          </div>
        </div>

        {/* Tickets by Priority */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Tickets by Priority
          </h3>
          <div className="space-y-3">
            {ticketsByPriority.length > 0 ? (
              ticketsByPriority.map((item: any) => {
                const percentage =
                  totalTickets > 0
                    ? Math.round((item._count.id / totalTickets) * 100)
                    : 0;
                return (
                  <div key={item.priority}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {item.priority}
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {item._count.id}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          item.priority === "HIGH"
                            ? "bg-red-500"
                            : item.priority === "MEDIUM"
                              ? "bg-orange-500"
                              : "bg-green-500"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      {percentage}%
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-slate-600 dark:text-slate-400">
                No priority data
              </p>
            )}
          </div>
        </div>

        {/* Users by Role */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Users by Role
          </h3>
          <div className="space-y-3">
            {usersByRole.length > 0 ? (
              usersByRole.map((item: any) => {
                const percentage =
                  totalUsers > 0
                    ? Math.round((item._count.id / totalUsers) * 100)
                    : 0;
                return (
                  <div key={item.role}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {item.role}
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {item._count.id}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          item.role === "ADMIN"
                            ? "bg-red-500"
                            : item.role === "MANAGER"
                              ? "bg-blue-500"
                              : "bg-green-500"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      {percentage}%
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-slate-600 dark:text-slate-400">
                No user data
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Most Active Users */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Most Active Users
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
                  User
                </th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
                  Role
                </th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
                  Actions
                </th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
                  Activity %
                </th>
              </tr>
            </thead>
            <tbody>
              {mostActiveUsers.length > 0 ? (
                mostActiveUsers
                  .filter((item): item is { userId: string; _count: { id: number } } => 'userId' in item)
                  .map((item, index) => {
                  const user = userMap.get(item.userId);
                  const totalActivity = mostActiveUsers.reduce((acc, u) => acc + u._count.id, 0);
                  const percentage =
                    totalActivity > 0
                      ? Math.round((item._count.id / totalActivity) * 100)
                      : 0;

                  return (
                    <tr
                      key={item.userId}
                      className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {user?.fullName || "Unknown"}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            {user?.email}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{user?.role}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {item._count.id}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium">
                            {percentage}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="py-4 px-4 text-center text-slate-600 dark:text-slate-400">
                    No activity data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Analytics Information
        </h3>
        <p className="text-sm text-blue-800 dark:text-blue-200">
          This dashboard provides real-time insights into system usage, ticket
          distribution, user activity, and performance metrics. Use these
          insights to optimize operations and identify trends.
        </p>
      </div>
    </div>
  );
}
