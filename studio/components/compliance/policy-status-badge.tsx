"use client";

import { Badge } from "@/components/ui/badge";
import { PolicyStatus } from "@/lib/data/policies";
import { cn } from "@/lib/utils";

interface PolicyStatusBadgeProps {
  status: PolicyStatus;
  className?: string;
}

export function PolicyStatusBadge({ status, className }: PolicyStatusBadgeProps) {
  const variants: Record<PolicyStatus, { label: string; variant: "default" | "secondary" | "outline" | "destructive"; className: string }> = {
    active: {
      label: "Active",
      variant: "default",
      className: "bg-green-100 text-green-800 border-green-200",
    },
    draft: {
      label: "Draft",
      variant: "secondary",
      className: "bg-gray-100 text-gray-800 border-gray-200",
    },
    needs_review: {
      label: "Needs Review",
      variant: "outline",
      className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    archived: {
      label: "Archived",
      variant: "secondary",
      className: "bg-slate-100 text-slate-600 border-slate-200",
    },
  };

  const config = variants[status];

  return (
    <Badge
      variant={config.variant}
      className={cn("text-xs font-medium", config.className, className)}
    >
      {config.label}
    </Badge>
  );
}

