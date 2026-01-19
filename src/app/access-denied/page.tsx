import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function AccessDenied() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Access Denied
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
          You don't have permission to access this page.
        </p>
        <Link href="/dashboard">
          <Button variant="primary">Return to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
