import { requireSession, requireRole } from "@/lib/auth/session";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "TicketHub - Support Ticket Management",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Require authenticated session
  const session = await requireSession();

  // Ensure user profile exists
  if (!session.profile) {
    throw new Error("User profile not found");
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950">
      {/* Navbar */}
      <Navbar user={session.profile} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar user={session.profile} />

        {/* Main Content */}
        <main className="flex-1 md:ml-64 overflow-y-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
