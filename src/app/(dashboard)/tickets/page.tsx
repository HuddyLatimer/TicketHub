import { getSession, requireRole } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { TicketTable } from "@/components/tickets/TicketTable";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export const metadata = {
  title: "Tickets - TicketHub",
};

export default async function TicketsPage() {
  const session = await getSession();

  if (!session?.user?.id || !session?.profile) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">
          Session not found. Please log in again.
        </p>
      </div>
    );
  }

  // Get all tickets for all authenticated users
  const tickets = await prisma.ticket.findMany({
    include: {
      createdBy: true,
      assignedTo: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Tickets
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            All support tickets
          </p>
        </div>
        {session.profile.role !== "MEMBER" && (
          <Link href="/tickets/new">
            <Button variant="primary">Create Ticket</Button>
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Total Tickets
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {tickets.length}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Open
          </p>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-1">
            {tickets.filter((t) => t.status === "OPEN").length}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            In Progress
          </p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            {tickets.filter((t) => t.status === "IN_PROGRESS").length}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Closed
          </p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
            {tickets.filter((t) => t.status === "CLOSED").length}
          </p>
        </div>
      </div>

      {/* Tickets Table */}
      <TicketTable tickets={tickets} userRole={session.profile.role} />

      {/* Info Box */}
      {session.profile.role === "MEMBER" && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            As a member, you can only view tickets assigned to you. Contact a
            manager to create new tickets or request assignments.
          </p>
        </div>
      )}
    </div>
  );
}
