"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Role } from "@prisma/client";
import {
  LayoutDashboard,
  Ticket,
  Users,
  TrendingUp,
  FileText,
  Settings,
} from "lucide-react";

interface SidebarProps {
  user: {
    id: string;
    email: string;
    fullName?: string;
    role: Role;
    isActive: boolean;
  };
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: Array<"ADMIN" | "MANAGER" | "MEMBER">;
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  // Navigation items based on roles
  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      roles: ["ADMIN", "MANAGER", "MEMBER"],
    },
    {
      label: "Tickets",
      href: "/tickets",
      icon: <Ticket className="w-5 h-5" />,
      roles: ["ADMIN", "MANAGER", "MEMBER"],
    },
    {
      label: "Users",
      href: "/users",
      icon: <Users className="w-5 h-5" />,
      roles: ["ADMIN"],
    },
    {
      label: "Analytics",
      href: "/analytics",
      icon: <TrendingUp className="w-5 h-5" />,
      roles: ["ADMIN", "MANAGER"],
    },
    {
      label: "Activity Logs",
      href: "/activity",
      icon: <FileText className="w-5 h-5" />,
      roles: ["ADMIN"],
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <Settings className="w-5 h-5" />,
      roles: ["ADMIN"],
    },
  ];

  // Filter items based on user role
  const visibleItems = navItems.filter((item) => item.roles.includes(user.role));

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-16 md:left-0 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-y-auto">
      <nav className="flex-1 px-4 py-6 space-y-2">
        {visibleItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors ${isActive
                  ? "bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              aria-current={isActive ? "page" : undefined}
            >
              <div className="flex-shrink-0">{item.icon}</div>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Role indicator at bottom */}
      <div className="px-4 py-4 border-t border-slate-200 dark:border-slate-800">
        <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
            Current Role
          </p>
          <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
            {user.role}
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
            {user.role === "ADMIN" && "Full system access"}
            {user.role === "MANAGER" && "Team & analytics access"}
            {user.role === "MEMBER" && "Personal tickets only"}
          </p>
        </div>
      </div>
    </aside>
  );
}
