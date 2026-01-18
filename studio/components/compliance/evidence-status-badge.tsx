"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { EvidenceStatus } from "@/lib/data/evidence";
import { cn } from "@/lib/utils";

interface EvidenceStatusBadgeProps {
  status: EvidenceStatus;
  className?: string;
}

export function EvidenceStatusBadge({ status, className }: EvidenceStatusBadgeProps) {
  const statusConfig = {
    fresh: {
      label: 'Fresh',
      icon: CheckCircle2,
      className: 'bg-green-100 text-green-800 border-green-200',
      iconClassName: 'text-green-600',
    },
    expired: {
      label: 'Expired',
      icon: XCircle,
      className: 'bg-red-100 text-red-800 border-red-200',
      iconClassName: 'text-red-600',
    },
    expiring_soon: {
      label: 'Expiring Soon',
      icon: AlertTriangle,
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      iconClassName: 'text-yellow-600',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge className={cn("flex items-center gap-1.5 border", config.className, className)}>
      <Icon className={cn("h-3.5 w-3.5", config.iconClassName)} />
      <span>{config.label}</span>
    </Badge>
  );
}

