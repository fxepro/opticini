"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Eye, Download, Lock, Calendar } from "lucide-react";
import { Audit } from "@/lib/data/audits";
import { AuditStatusBadge } from "./audit-status-badge";
import { cn } from "@/lib/utils";

interface AuditCardProps {
  audit: Audit;
  onViewDetails?: (audit: Audit) => void;
}

export function AuditCard({ audit, onViewDetails }: AuditCardProps) {
  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      soc2_readiness: "SOC 2 Readiness",
      external_audit: "External Audit",
      internal_audit: "Internal Audit",
      customer_security_review: "Customer Review",
      annual_review: "Annual Review",
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card
      className={cn(
        "relative border-2 transition-all duration-200 hover:shadow-lg",
        audit.status === "completed" && "border-green-200 hover:border-green-300",
        audit.status === "in_progress" && "border-yellow-200 hover:border-yellow-300",
        audit.status === "planned" && "border-blue-200 hover:border-blue-300",
        audit.status === "under_review" && "border-orange-200 hover:border-orange-300",
        audit.status === "cancelled" && "border-red-200 hover:border-red-300"
      )}
    >
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Search className="h-5 w-5 text-palette-primary" />
              <h3 className="font-semibold text-lg text-slate-800">{audit.auditId}</h3>
              <AuditStatusBadge status={audit.status} />
            </div>
            <h4 className="font-medium text-slate-700 mb-2">{audit.name}</h4>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                {getTypeLabel(audit.type)}
              </Badge>
              {audit.frameworkNames.slice(0, 2).map((name, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {name}
                </Badge>
              ))}
              {audit.frameworkNames.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{audit.frameworkNames.length - 2} more
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {audit.description && (
          <p className="text-sm text-slate-600 mb-4 line-clamp-2">{audit.description}</p>
        )}

        {/* Evidence Lock Status */}
        {audit.evidenceLocked && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
            <Lock className="h-4 w-4 text-blue-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-800">Evidence Locked</p>
              <p className="text-xs text-blue-600">
                Frozen on {formatDate(audit.evidenceFreezeDate)}
              </p>
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <p className="text-xs text-slate-500 mb-1">Controls</p>
            <p className="text-sm font-semibold text-slate-800">
              {audit.controlsPassed} / {audit.totalControls} passed
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Compliance</p>
            <p className="text-sm font-semibold text-palette-primary">
              {audit.complianceScore || 0}%
            </p>
          </div>
          {audit.findingsCount > 0 && (
            <>
              <div>
                <p className="text-xs text-slate-500 mb-1">Findings</p>
                <p className="text-sm font-semibold text-red-600">{audit.findingsCount}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Evidence</p>
                <p className="text-sm font-semibold text-slate-800">
                  {audit.evidenceCount || 0} items
                </p>
              </div>
            </>
          )}
        </div>

        {/* Timeline */}
        <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Started: {formatDate(audit.startDate)}</span>
          </div>
          {audit.endDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Ended: {formatDate(audit.endDate)}</span>
            </div>
          )}
        </div>

        {/* Lead Auditor */}
        {audit.leadAuditor && (
          <div className="mb-4 p-2 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 mb-1">Lead Auditor</p>
            <p className="text-sm font-medium text-slate-800">{audit.leadAuditor.name}</p>
            {audit.leadAuditor.organization && (
              <p className="text-xs text-slate-600">{audit.leadAuditor.organization}</p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onViewDetails?.(audit)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          <Button variant="outline" size="sm" title="Export audit">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

