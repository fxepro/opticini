"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertTriangle, Minus } from "lucide-react";
import { ControlStatus } from "@/lib/data/controls";
import { cn } from "@/lib/utils";

interface ControlStatusBadgeProps {
  status: ControlStatus;
  className?: string;
}

export function ControlStatusBadge({ status, className }: ControlStatusBadgeProps) {
  const statusConfig = {
    pass: {
      label: 'Pass',
      icon: CheckCircle2,
      className: 'bg-green-100 text-green-800 border-green-200',
      iconClassName: 'text-green-600',
    },
    fail: {
      label: 'Fail',
      icon: XCircle,
      className: 'bg-red-100 text-red-800 border-red-200',
      iconClassName: 'text-red-600',
    },
    partial: {
      label: 'Partial',
      icon: AlertTriangle,
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      iconClassName: 'text-yellow-600',
    },
    not_evaluated: {
      label: 'Not Evaluated',
      icon: Minus,
      className: 'bg-gray-100 text-gray-800 border-gray-200',
      iconClassName: 'text-gray-600',
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

