"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/actions/auth";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/Button";
import type { Role } from "@prisma/client";

interface NavbarProps {
  user: {
    id: string;
    email: string;
    fullName?: string;
    role: Role;
    isActive: boolean;
  };
}

export function Navbar({ user }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    try {
      await logoutAction();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  const roleColors: Record<string, string> = {
    ADMIN: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",
    MANAGER: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
    MEMBER: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
  };

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  TicketHub
                </h1>
              </div>
            </div>
          </div>

          {/* Center - Title */}
          <div className="hidden md:flex flex-1 justify-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Support Ticket Management System
            </p>
          </div>

          {/* Right side - Theme and User Menu */}
          <div className="flex items-center gap-4">
            <ThemeToggle />

            {/* User Menu Dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-expanded={isOpen}
                aria-haspopup="true"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {user.fullName || user.email}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {user.role}
                  </p>
                </div>
                <div
                  className={`w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-sm transition-transform ${isOpen ? "ring-2 ring-primary-500" : ""
                    }`}
                  title={user.fullName || user.email}
                >
                  {(user.fullName || user.email)
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
              </button>

              {/* Dropdown Menu */}
              {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {user.fullName || user.email}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                      {user.email}
                    </p>
                    <div className="mt-2">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${roleColors[user.role]}`}
                      >
                        {user.role}
                      </span>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <button
                    onClick={() => {
                      router.push("/settings");
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    aria-label="Go to Settings"
                  >
                    Settings
                  </button>

                  <button
                    onClick={() => {
                      router.push("/activity");
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    aria-label="View Activity Logs"
                  >
                    Activity Logs
                  </button>

                  {/* Divider */}
                  <div className="border-t border-slate-200 dark:border-slate-700 my-1" />

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    aria-label="Logout"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle mobile menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
