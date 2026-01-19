import { getSession } from "@/lib/auth/session";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { ManagerDashboard } from "@/components/dashboard/ManagerDashboard";
import { MemberDashboard } from "@/components/dashboard/MemberDashboard";

export const metadata = {
  title: "Dashboard - TicketHub",
};

export default async function DashboardPage() {
  const session = await getSession();

  if (!session?.profile) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">User profile not found</p>
      </div>
    );
  }

  const profile = session.profile;

  // Render role-specific dashboard
  const renderDashboard = () => {
    switch (profile.role) {
      case "ADMIN":
        return <AdminDashboard />;
      case "MANAGER":
        return <ManagerDashboard />;
      case "MEMBER":
        return <MemberDashboard />;
      default:
        return (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">
              Unknown user role
            </p>
          </div>
        );
    }
  };

  return renderDashboard();
}
