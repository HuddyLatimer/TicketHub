import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";
import { Badge } from "@/components/ui/Badge";
import { Ticket, AlertCircle, Clock, CheckCircle, Check } from "lucide-react";

export async function MemberDashboard() {
  const session = await getSession();
  if (!session?.user?.id || !session?.profile) return null;

  // Get member's assigned tickets
  const myTickets = await prisma.ticket.findMany({
    where: { assignedToId: session.user.id },
    include: {
      createdBy: true,
      assignedTo: true,
    },
  });

  const openTickets = myTickets.filter((t) => t.status === "OPEN").length;
  const inProgressTickets = myTickets.filter(
    (t) => t.status === "IN_PROGRESS"
  ).length;
  const completedTickets = myTickets.filter(
    (t) => t.status === "CLOSED"
  ).length;

  // Calculate completion rate
  const completionRate =
    myTickets.length > 0
      ? Math.round((completedTickets / myTickets.length) * 100)
      : 0;

  // Get high priority tickets
  const highPriorityTickets = myTickets
    .filter((t) => t.priority === "HIGH")
    .slice(0, 5);

  // Get recent activity
  const recentActivity = await prisma.activityLog.findMany({
    where: { userId: session.user.id },
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Welcome, {session.profile.fullName || session.profile.email}!
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Here's your ticket overview and activity
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Assigned Tickets */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                Assigned Tickets
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                {myTickets.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <Ticket className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

        {/* Open Tickets */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                Open
              </p>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-2">
                {openTickets}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-4">
            Not started
          </p>
        </div>

        {/* In Progress */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                In Progress
              </p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                {inProgressTickets}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-4">
            Being worked on
          </p>
        </div>

        {/* Completed */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                Completed
              </p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                {completedTickets}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-4">
            {completionRate}% completion
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Quick Stats
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Completion Rate
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {completionRate}%
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                <span className="font-semibold">Status Breakdown:</span>
              </p>
              <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <span className="font-medium">Open:</span> {openTickets}
                </li>
                <li>
                  <span className="font-medium">In Progress:</span>{" "}
                  {inProgressTickets}
                </li>
                <li>
                  <span className="font-medium">Completed:</span>{" "}
                  {completedTickets}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* High Priority Tickets */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            High Priority Tickets
          </h3>
          <div className="space-y-3">
            {highPriorityTickets.length > 0 ? (
              highPriorityTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {ticket.title}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        {ticket.description?.substring(0, 80)}...
                      </p>
                    </div>
                    <Badge variant="danger">{ticket.priority}</Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                No high priority tickets
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Your Recent Activity
        </h3>
        <div className="space-y-3">
          {recentActivity.length > 0 ? (
            recentActivity.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {log.action}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {log.resourceType}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                    {new Date(log.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              No recent activity
            </p>
          )}
        </div>
      </div>

      {/* All Tickets Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          All Your Tickets
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
                  Title
                </th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
                  Priority
                </th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
                  Created
                </th>
              </tr>
            </thead>
            <tbody>
              {myTickets.length > 0 ? (
                myTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <td className="py-3 px-4 text-slate-900 dark:text-white">
                      {ticket.title}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{ticket.status}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{ticket.priority}</Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="py-4 px-4 text-center text-slate-600 dark:text-slate-400"
                  >
                    No tickets assigned to you yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Member Info */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-800 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">
          Member Resources
        </h3>
        <ul className="space-y-2 text-sm text-green-800 dark:text-green-200">
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />View only your assigned tickets
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />Update ticket status and progress
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />Track your productivity metrics
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />View your activity history
          </li>
        </ul>
      </div>
    </div>
  );
}
