import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";
import { Badge } from "@/components/ui/Badge";
import { Ticket, AlertCircle, Clock, Zap, Check } from "lucide-react";

type StatusStat = { status: string; _count: { id: number } };
type PriorityStat = { priority: string; _count: { id: number } };

export async function ManagerDashboard() {
  const session = await getSession();
  if (!session?.user?.id) return null;

  // Get manager's team tickets and statistics
  const totalTickets = await prisma.ticket.count();
  const openTickets = await prisma.ticket.count({
    where: { status: "OPEN" },
  });
  const inProgressTickets = await prisma.ticket.count({
    where: { status: "IN_PROGRESS" },
  });

  // Get team members (for context)
  const teamMembers = await prisma.userProfile.findMany({
    where: { role: "MEMBER" },
    take: 10,
  });

  // Get recent tickets assigned
  const recentTickets = await prisma.ticket.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      assignedTo: true,
      createdBy: true,
    },
  });

  // Get metrics
  const ticketsByPriority = await prisma.ticket.groupBy({
    by: ["priority"],
    _count: {
      id: true,
    },
  });

  const ticketsByStatus = await prisma.ticket.groupBy({
    by: ["status"],
    _count: {
      id: true,
    },
  });

  const avgResolutionTime = recentTickets.length > 0
    ? Math.round(
      recentTickets.reduce((acc, ticket) => {
        const created = new Date(ticket.createdAt).getTime();
        const updated = new Date(ticket.updatedAt).getTime();
        return acc + (updated - created);
      }, 0) / recentTickets.length / (1000 * 60 * 60) // Convert to hours
    )
    : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Manager Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Team performance and ticket management
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Tickets */}
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
        </div>

        {/* Open Tickets */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                Open Tickets
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
            Awaiting action
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

        {/* Avg Resolution Time */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                Avg Resolution
              </p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                {avgResolutionTime}h
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-4">
            Based on recent tickets
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket Status Distribution */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Ticket Status
          </h3>
          <div className="space-y-3">
            {ticketsByStatus.length > 0 ? (
              (ticketsByStatus as StatusStat[])
                .filter((item): item is StatusStat => 'status' in item)
                .map((item) => (
                  <div key={item.status} className="flex items-center justify-between">
                    <span className="text-slate-700 dark:text-slate-300">
                      {item.status.replace(/_/g, " ")}
                    </span>
                    <Badge variant="outline">{item._count.id}</Badge>
                  </div>
                ))
            ) : (
              <p className="text-slate-600 dark:text-slate-400">No tickets yet</p>
            )}
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            By Priority
          </h3>
          <div className="space-y-3">
            {ticketsByPriority.length > 0 ? (
              (ticketsByPriority as PriorityStat[])
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

        {/* Team Overview */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Team Members
          </h3>
          <div className="space-y-2">
            {teamMembers.length > 0 ? (
              teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700 last:border-0"
                >
                  <div className="text-sm">
                    <p className="font-medium text-slate-900 dark:text-white">
                      {member.fullName}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {member.email}
                    </p>
                  </div>
                  <Badge variant={member.isActive ? "primary" : "secondary"}>
                    {member.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-slate-600 dark:text-slate-400">No team members yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Tickets */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Recent Tickets
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
                  Title
                </th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
                  Assigned To
                </th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
                  Priority
                </th>
              </tr>
            </thead>
            <tbody>
              {recentTickets.length > 0 ? (
                recentTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <td className="py-3 px-4 text-slate-900 dark:text-white">
                      {ticket.title}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {ticket.assignedTo?.fullName || "Unassigned"}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{ticket.status}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{ticket.priority}</Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="py-4 px-4 text-center text-slate-600 dark:text-slate-400"
                  >
                    No tickets yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manager Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
          Manager Tools
        </h3>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />Monitor team ticket assignments and progress
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />View performance analytics and resolution metrics
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />Create and manage tickets across your team
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />Track team member activity and workload
          </li>
        </ul>
      </div>
    </div>
  );
}
