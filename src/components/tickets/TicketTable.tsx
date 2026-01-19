import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Ticket as TicketIcon } from "lucide-react";
import type { Ticket, UserProfile } from "@prisma/client";

interface TicketWithRelations extends Ticket {
  createdBy: UserProfile | null;
  assignedTo: UserProfile | null;
}

interface TicketTableProps {
  tickets: TicketWithRelations[];
  userRole: "ADMIN" | "MANAGER" | "MEMBER";
}

export function TicketTable({ tickets, userRole }: TicketTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200";
      case "IN_PROGRESS":
        return "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200";
      case "CLOSED":
        return "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200";
      default:
        return "bg-slate-100 dark:bg-slate-900/20 text-slate-800 dark:text-slate-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "text-red-600 dark:text-red-400 font-bold";
      case "MEDIUM":
        return "text-orange-600 dark:text-orange-400 font-semibold";
      case "LOW":
        return "text-green-600 dark:text-green-400";
      default:
        return "text-slate-600 dark:text-slate-400";
    }
  };

  return (
    <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
            <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
              Title
            </th>
            <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
              Status
            </th>
            <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
              Priority
            </th>
            {userRole === "ADMIN" && (
              <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
                Assigned To
              </th>
            )}
            <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
              Created By
            </th>
            <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
              Created
            </th>
            <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {tickets.length > 0 ? (
            tickets.map((ticket) => (
              <tr
                key={ticket.id}
                className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {ticket.title}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      #{ticket.id.substring(0, 8)}
                    </p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <Badge className={`${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  <span className={`font-medium ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                </td>
                {userRole === "ADMIN" && (
                  <td className="py-3 px-4">
                    <span className="text-slate-700 dark:text-slate-300">
                      {ticket.assignedTo?.fullName || (
                        <span className="text-slate-500 dark:text-slate-500 italic">
                          Unassigned
                        </span>
                      )}
                    </span>
                  </td>
                )}
                <td className="py-3 px-4">
                  <span className="text-slate-700 dark:text-slate-300">
                    {ticket.createdBy?.fullName}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  <Link
                    href={`/tickets/${ticket.id}`}
                    className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={userRole === "ADMIN" ? 7 : 6}
                className="py-8 px-4 text-center text-slate-600 dark:text-slate-400"
              >
                <div className="flex flex-col items-center gap-2">
                  <TicketIcon className="w-10 h-10 text-slate-400" />
                  <p>No tickets found</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
