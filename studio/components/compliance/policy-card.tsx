"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Download, RefreshCw } from "lucide-react";
import { Policy } from "@/lib/data/policies";
import { PolicyStatusBadge } from "./policy-status-badge";
import { PolicySyncStatus } from "./policy-sync-status";
import { cn } from "@/lib/utils";

interface PolicyCardProps {
  policy: Policy;
  onViewDetails?: (policy: Policy) => void;
  onRegenerate?: (policyId: string) => void;
}

export function PolicyCard({ policy, onViewDetails, onRegenerate }: PolicyCardProps) {
  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      security: "Security",
      data_retention: "Data Retention",
      incident_response: "Incident Response",
      ai_governance: "AI Governance",
      vendor_risk: "Vendor Risk",
      custom: policy.category || "Custom",
    };
    return labels[type] || type;
  };

  const getTimeAgo = (dateString?: string) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <Card
      className={cn(
        "relative border-2 transition-all duration-200 hover:shadow-lg",
        policy.status === "active" && "border-green-200 hover:border-green-300",
        policy.status === "draft" && "border-gray-200 hover:border-gray-300",
        policy.status === "needs_review" && "border-yellow-200 hover:border-yellow-300",
        policy.status === "archived" && "border-slate-200 hover:border-slate-300"
      )}
    >
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="h-5 w-5 text-palette-primary" />
              <h3 className="font-semibold text-lg text-slate-800">{policy.policyId}</h3>
              <PolicyStatusBadge status={policy.status} />
            </div>
            <h4 className="font-medium text-slate-700 mb-2">{policy.name}</h4>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                {getTypeLabel(policy.type)}
              </Badge>
              {policy.frameworkNames.slice(0, 2).map((name, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {name}
                </Badge>
              ))}
              {policy.frameworkNames.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{policy.frameworkNames.length - 2} more
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {policy.description && (
          <p className="text-sm text-slate-600 mb-4 line-clamp-2">{policy.description}</p>
        )}

        {/* Sync Status */}
        <div className="mb-4">
          <PolicySyncStatus syncStatus={policy.syncStatus} syncIssues={policy.syncIssues} />
        </div>

        {/* Sync Issues Preview */}
        {policy.syncStatus === "out_of_sync" && policy.syncIssues && policy.syncIssues.length > 0 && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm font-medium text-red-800 mb-1">Sync Issues:</p>
            <ul className="text-sm text-red-700 list-disc list-inside">
              {policy.syncIssues.slice(0, 2).map((issue, idx) => (
                <li key={idx} className="text-xs">
                  {issue}
                </li>
              ))}
              {policy.syncIssues.length > 2 && (
                <li className="text-xs text-red-600">
                  +{policy.syncIssues.length - 2} more issue{policy.syncIssues.length - 2 !== 1 ? "s" : ""}
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
          <div className="flex items-center gap-4">
            <span>Version {policy.version}</span>
            {policy.ownerName && <span>Owner: {policy.ownerName}</span>}
          </div>
          <span>Updated {getTimeAgo(policy.updatedAt)}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onViewDetails?.(policy)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          {policy.generationMethod === "auto_generated" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRegenerate?.(policy.id)}
              title="Regenerate from system state"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          <Button variant="outline" size="sm" title="Export policy">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

