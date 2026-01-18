"use client";

import { Badge } from "@/components/ui/badge";
import { ControlSeverity } from "@/lib/data/controls";
import { cn } from "@/lib/utils";

interface ControlSeverityBadgeProps {
  severity: ControlSeverity;
  className?: string;
}

export function ControlSeverityBadge({ severity, className }: ControlSeverityBadgeProps) {
  const severityConfig = {
    critical: {
      label: 'Critical',
      className: 'bg-red-100 text-red-800 border-red-200',
    },
    high: {
      label: 'High',
      className: 'bg-orange-100 text-orange-800 border-orange-200',
    },
    medium: {
      label: 'Medium',
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    },
    low: {
      label: 'Low',
      className: 'bg-blue-100 text-blue-800 border-blue-200',
    },
  };

  const config = severityConfig[severity];

  return (
    <Badge className={cn("border", config.className, className)}>
      {config.label}
    </Badge>
  );
}

