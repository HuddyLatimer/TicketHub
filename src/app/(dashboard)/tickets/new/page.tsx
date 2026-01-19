"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTicket } from "@/actions/tickets";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateTicketPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "MEDIUM" as const,
    category: "GENERAL" as const,
    customerName: "",
    customerEmail: "",
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await createTicket({
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        category: formData.category,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
      });

      if (result.success) {
        router.push("/tickets");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create ticket");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/tickets">
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Create New Ticket
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Submit a new support ticket
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Title */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-900 dark:text-white">
                Title
              </label>
              <span className="text-xs text-slate-600 dark:text-slate-400">
                {formData.title.length}/5 min
              </span>
            </div>
            <input
              type="text"
              required
              minLength={5}
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Brief description of the issue (min 5 characters)"
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-900 dark:text-white">
                Description
              </label>
              <span className="text-xs text-slate-600 dark:text-slate-400">
                {formData.description.length}/10 min
              </span>
            </div>
            <textarea
              required
              minLength={10}
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Detailed description of the issue (min 10 characters)"
              rows={5}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Customer Name */}
          <div>
            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
              Customer Name
            </label>
            <input
              type="text"
              required
              value={formData.customerName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  customerName: e.target.value,
                }))
              }
              placeholder="John Doe"
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Customer Email */}
          <div>
            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
              Customer Email
            </label>
            <input
              type="email"
              required
              value={formData.customerEmail}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  customerEmail: e.target.value,
                }))
              }
              placeholder="customer@example.com"
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Priority and Category - Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    priority: e.target.value as any,
                  }))
                }
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: e.target.value as any,
                  }))
                }
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="GENERAL">General</option>
                <option value="TECHNICAL">Technical</option>
                <option value="BILLING">Billing</option>
                <option value="FEATURE_REQUEST">Feature Request</option>
                <option value="BUG_REPORT">Bug Report</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
            <Link href="/tickets" className="flex-1">
              <Button variant="outline" className="w-full">
                Cancel
              </Button>
            </Link>
            <Button
              variant="primary"
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? "Creating..." : "Create Ticket"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
