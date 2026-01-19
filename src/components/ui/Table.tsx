import React from "react";
import { cn } from "@/lib/utils/cn";

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {}

interface TableHeaderProps
  extends React.HTMLAttributes<HTMLTableCellElement> {}

interface TableCellProps
  extends React.HTMLAttributes<HTMLTableCellElement> {}

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, ...props }, ref) => (
    <div className="w-full overflow-x-auto">
      <table
        ref={ref}
        className={cn("w-full border-collapse", className)}
        {...props}
      />
    </div>
  )
);

const TableHead = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      "bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700",
      className
    )}
    {...props}
  />
));

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("divide-y divide-slate-200 dark:divide-slate-700", className)}
    {...props}
  />
));

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        "hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors",
        className
      )}
      {...props}
    />
  )
);

const TableHeader = React.forwardRef<HTMLTableCellElement, TableHeaderProps>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        "px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-slate-100",
        className
      )}
      {...props}
    />
  )
);

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(
        "px-4 py-3 text-sm text-slate-700 dark:text-slate-300",
        className
      )}
      {...props}
    />
  )
);

Table.displayName = "Table";
TableHead.displayName = "TableHead";
TableBody.displayName = "TableBody";
TableRow.displayName = "TableRow";
TableHeader.displayName = "TableHeader";
TableCell.displayName = "TableCell";

export { Table, TableHead, TableBody, TableRow, TableHeader, TableCell };
