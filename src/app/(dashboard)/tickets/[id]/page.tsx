import { getSession } from "@/lib/auth/session";
import { getTicketById } from "@/actions/tickets";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Ticket Details - TicketHub",
};

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();

  if (!session?.profile) {
    redirect("/login");
  }

  try {
    const result = await getTicketById(id);
    const ticket = result.ticket;

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
          return "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200";
        case "MEDIUM":
          return "bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200";
        case "LOW":
          return "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200";
        default:
          return "bg-slate-100 dark:bg-slate-900/20 text-slate-800 dark:text-slate-200";
      }
    };

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/tickets">
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                {ticket.title}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Ticket #{ticket.ticketNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Details Card */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="space-y-6">
              {/* Status and Priority */}
              <div className="flex flex-wrap gap-3">
                <Badge className={getStatusColor(ticket.status)}>
                  {ticket.status}
                </Badge>
                <Badge className={getPriorityColor(ticket.priority)}>
                  {ticket.priority} Priority
                </Badge>
                <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                  {ticket.category}
                </Badge>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase mb-2">
                  Description
                </h2>
                <p className="text-slate-900 dark:text-slate-100 whitespace-pre-wrap">
                  {ticket.description}
                </p>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-200 dark:border-slate-700" />

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-1">
                    Created By
                  </p>
                  <p className="text-slate-900 dark:text-white font-medium">
                    {ticket.createdBy?.fullName || "Unknown"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-1">
                    Assigned To
                  </p>
                  <p className="text-slate-900 dark:text-white font-medium">
                    {ticket.assignedTo?.fullName || "Unassigned"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-1">
                    Created Date
                  </p>
                  <p className="text-slate-900 dark:text-white font-medium">
                    {new Date(ticket.createdAt).toLocaleDateString()} at{" "}
                    {new Date(ticket.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-1">
                    Last Updated
                  </p>
                  <p className="text-slate-900 dark:text-white font-medium">
                    {new Date(ticket.updatedAt).toLocaleDateString()} at{" "}
                    {new Date(ticket.updatedAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Customer Info Card */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase mb-4">
                Customer
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Email
                  </p>
                  <p className="text-slate-900 dark:text-white break-all">
                    {ticket.customerEmail}
                  </p>
                </div>
                {ticket.customerId && (
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Customer ID
                    </p>
                    <p className="text-slate-900 dark:text-white font-mono text-sm">
                      {ticket.customerId}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Ticket Info Card */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase mb-4">
                Ticket Info
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Ticket Number
                  </p>
                  <p className="text-slate-900 dark:text-white font-mono font-bold text-lg">
                    #{ticket.ticketNumber}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Ticket ID
                  </p>
                  <p className="text-slate-900 dark:text-white font-mono text-xs break-all">
                    {ticket.id}
                  </p>
                </div>
                {ticket.resolvedAt && (
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Resolved Date
                    </p>
                    <p className="text-slate-900 dark:text-white">
                      {new Date(ticket.resolvedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Link href="/tickets" className="flex-1">
            <Button variant="outline" className="w-full">
              Back to Tickets
            </Button>
          </Link>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/tickets">
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <p className="text-red-800 dark:text-red-200">
            Failed to load ticket details
          </p>
          <Link href="/tickets">
            <Button variant="outline" className="mt-4">
              Back to Tickets
            </Button>
          </Link>
        </div>
      </div>
    );
  }
}
