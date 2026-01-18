"use client";

import { Badge } from "@/components/ui/badge";
import { AuditStatus } from "@/lib/data/audits";
import { cn } from "@/lib/utils";

interface AuditStatusBadgeProps {
  status: AuditStatus;
  className?: string;
}

export function AuditStatusBadge({ status, className }: AuditStatusBadgeProps) {
  const variants: Record<AuditStatus, { label: string; variant: "default" | "secondary" | "outline" | "destructive"; className: string }> = {
    planned: {
      label: "Planned",
      variant: "secondary",
      className: "bg-blue-100 text-blue-800 border-blue-200",
    },
    in_progress: {
      label: "In Progress",
      variant: "default",
      className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    under_review: {
      label: "Under Review",
      variant: "outline",
      className: "bg-orange-100 text-orange-800 border-orange-200",
    },
    completed: {
      label: "Completed",
      variant: "default",
      className: "bg-green-100 text-green-800 border-green-200",
    },
    cancelled: {
      label: "Cancelled",
      variant: "destructive",
      className: "bg-red-100 text-red-800 border-red-200",
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

