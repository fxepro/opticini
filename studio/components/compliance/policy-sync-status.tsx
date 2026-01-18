"use client";

import { Badge } from "@/components/ui/badge";
import { SyncStatus } from "@/lib/data/policies";
import { AlertCircle, CheckCircle2, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PolicySyncStatusProps {
  syncStatus: SyncStatus;
  syncIssues?: string[];
  className?: string;
}

export function PolicySyncStatus({ syncStatus, syncIssues, className }: PolicySyncStatusProps) {
  const getConfig = () => {
    switch (syncStatus) {
      case "in_sync":
        return {
          icon: CheckCircle2,
          label: "In Sync",
          className: "bg-green-100 text-green-800 border-green-200",
          iconClassName: "text-green-600",
        };
      case "out_of_sync":
        return {
          icon: AlertCircle,
          label: "Out of Sync",
          className: "bg-red-100 text-red-800 border-red-200",
          iconClassName: "text-red-600",
        };
      case "unknown":
        return {
          icon: HelpCircle,
          label: "Unknown",
          className: "bg-gray-100 text-gray-800 border-gray-200",
          iconClassName: "text-gray-600",
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;
  const issuesCount = syncIssues?.length || 0;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Badge
        variant="outline"
        className={cn("text-xs font-medium flex items-center gap-1", config.className)}
      >
        <Icon className={cn("h-3 w-3", config.iconClassName)} />
        {config.label}
      </Badge>
      {syncStatus === "out_of_sync" && issuesCount > 0 && (
        <span className="text-xs text-red-600 font-medium">
          {issuesCount} issue{issuesCount !== 1 ? "s" : ""}
        </span>
      )}
    </div>
  );
}

