import React from "react";
import { cn } from "@/lib/utils/cn";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "outline";
  size?: "sm" | "md";
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary: "bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200",
      secondary: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
      success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      danger: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      outline: "border border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-300",
    };

    const sizes = {
      sm: "px-2 py-1 text-xs font-medium rounded",
      md: "px-3 py-1 text-sm font-medium rounded-md",
    };

    return (
      <span
        ref={ref}
        className={cn(variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";
