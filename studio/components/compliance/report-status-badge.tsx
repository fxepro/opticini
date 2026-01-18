"use client";

import { Badge } from "@/components/ui/badge";
import { ReportStatus } from "@/lib/data/reports";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ReportStatusBadgeProps {
  status: ReportStatus;
  className?: string;
}

export function ReportStatusBadge({ status, className }: ReportStatusBadgeProps) {
  const variants: Record<ReportStatus, { label: string; variant: "default" | "secondary" | "outline" | "destructive"; className: string; icon?: React.ReactNode }> = {
    pending: {
      label: "Pending",
      variant: "secondary",
      className: "bg-gray-100 text-gray-800 border-gray-200",
    },
    generating: {
      label: "Generating",
      variant: "outline",
      className: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: <Loader2 className="h-3 w-3 animate-spin mr-1" />,
    },
    ready: {
      label: "Ready",
      variant: "default",
      className: "bg-green-100 text-green-800 border-green-200",
    },
    failed: {
      label: "Failed",
      variant: "destructive",
      className: "bg-red-100 text-red-800 border-red-200",
    },
  };

  const config = variants[status];

  return (
    <Badge
      variant={config.variant}
      className={cn("text-xs font-medium flex items-center gap-1", config.className, className)}
    >
      {config.icon}
      {config.label}
    </Badge>
  );
}

