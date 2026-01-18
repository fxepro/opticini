"use client";

import { Badge } from "@/components/ui/badge";
import { Bot, Upload } from "lucide-react";
import { EvidenceSource } from "@/lib/data/evidence";
import { cn } from "@/lib/utils";

interface EvidenceSourceBadgeProps {
  source: EvidenceSource;
  className?: string;
}

export function EvidenceSourceBadge({ source, className }: EvidenceSourceBadgeProps) {
  const sourceConfig = {
    automated: {
      label: 'Automated',
      icon: Bot,
      className: 'bg-blue-100 text-blue-800 border-blue-200',
      iconClassName: 'text-blue-600',
    },
    manual: {
      label: 'Manual',
      icon: Upload,
      className: 'bg-purple-100 text-purple-800 border-purple-200',
      iconClassName: 'text-purple-600',
    },
  };

  const config = sourceConfig[source];
  const Icon = config.icon;

  return (
    <Badge className={cn("flex items-center gap-1.5 border", config.className, className)}>
      <Icon className={cn("h-3.5 w-3.5", config.iconClassName)} />
      <span>{config.label}</span>
    </Badge>
  );
}

