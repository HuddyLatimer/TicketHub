import { prisma } from "@/lib/db/prisma";
import { Badge } from "@/components/ui/Badge";
import { Users, Ticket, CheckCircle, Lock, Check } from "lucide-react";

type PriorityStat = { priority: string; _count: { id: number } };
type StatusStat = { status: string; _count: { id: number } };
type RoleStat = { role: string; _count: { id: number } };

export async function AdminDashboard() {
  // Fetch statistics
  const totalUsers = await prisma.userProfile.count();
  const activeUsers = await prisma.userProfile.count({
    where: { isActive: true },
  });

  const totalTickets = await prisma.ticket.count();
  const openTickets = await prisma.ticket.count({
    where: { status: "OPEN" },
  });

  const recentActivity = await prisma.activityLog.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
    },
  });

  const usersByRole = await prisma.userProfile.groupBy({
    by: ["role"],
    _count: {
      id: true,
    },
  });

  const priorityStats = await prisma.ticket.groupBy({
    by: ["priority"],
    _count: {
      id: true,
    },
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          System overview and management tools
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users Card */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                Total Users
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                {totalUsers}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-4">
            {activeUsers} active
          </p>
        </div>

        {/* Active Tickets Card */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                Total Tickets
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                {totalTickets}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <Ticket className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-4">
            {openTickets} open
          </p>
        </div>

        {/* System Health Card */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                System Status
              </p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                Healthy
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-4">
            All systems operational
          </p>
        </div>

        {/* Users by Role Card */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                User Roles
              </p>
              <div className="space-y-1 mt-2">
                {usersByRole.map((item) => (
                  <p
                    key={item.role}
                    className="text-sm text-slate-700 dark:text-slate-300"
                  >
                    <span className="font-semibold">{item.role}:</span>{" "}
                    {item._count.id}
                  </p>
                ))}
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Lock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority Distribution */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Tickets by Priority
          </h3>
          <div className="space-y-3">
            {priorityStats.length > 0 ? (
              (priorityStats as PriorityStat[])
                .filter((item): item is PriorityStat => 'priority' in item)
                .map((item) => (
                  <div key={item.priority} className="flex items-center justify-between">
                    <span className="text-slate-700 dark:text-slate-300">
                      {item.priority}
                    </span>
                    <Badge variant="outline">{item._count.id}</Badge>
                  </div>
                ))
            ) : (
              <p className="text-slate-600 dark:text-slate-400">No tickets yet</p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start justify-between pb-3 border-b border-slate-200 dark:border-slate-700 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {log.user?.fullName}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {log.action}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                      {new Date(log.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {log.resourceType}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-slate-600 dark:text-slate-400">No activity yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-xl border border-primary-200 dark:border-primary-800 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-3">
          Quick Actions
        </h3>
        <ul className="space-y-2 text-sm text-primary-800 dark:text-primary-200">
          <li>
            <Check className="inline w-4 h-4 mr-2 -mt-0.5" />Monitor system health and user activity in real-time
          </li>
          <li>
            <Check className="inline w-4 h-4 mr-2 -mt-0.5" />Manage users, roles, and permissions with granular control
          </li>
          <li>
            <Check className="inline w-4 h-4 mr-2 -mt-0.5" />View comprehensive analytics and activity logs
          </li>
          <li>
            <Check className="inline w-4 h-4 mr-2 -mt-0.5" />Configure system settings and security policies
          </li>
        </ul>
      </div>
    </div>
  );
}
