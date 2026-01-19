import React from "react";
import { cn } from "@/lib/utils/cn";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "success" | "error" | "warning" | "info";
  title?: string;
  icon?: React.ReactNode;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant = "info",
      title,
      children,
      icon,
      ...props
    },
    ref
  ) => {
    const variants = {
      success:
        "bg-green-50 border border-green-200 dark:bg-green-900 dark:border-green-800 text-green-800 dark:text-green-200",
      error:
        "bg-red-50 border border-red-200 dark:bg-red-900 dark:border-red-800 text-red-800 dark:text-red-200",
      warning:
        "bg-yellow-50 border border-yellow-200 dark:bg-yellow-900 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200",
      info: "bg-blue-50 border border-blue-200 dark:bg-blue-900 dark:border-blue-800 text-blue-800 dark:text-blue-200",
    };

    return (
      <div
        ref={ref}
        className={cn("rounded-lg p-4 flex gap-3", variants[variant], className)}
        {...props}
      >
        {icon && <div className="flex-shrink-0">{icon}</div>}
        <div className="flex-1">
          {title && <h3 className="font-semibold mb-1">{title}</h3>}
          {children}
        </div>
      </div>
    );
  }
);

Alert.displayName = "Alert";
