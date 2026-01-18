"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Policy } from "@/lib/data/policies";
import { PolicyStatusBadge } from "./policy-status-badge";
import { PolicySyncStatus } from "./policy-sync-status";
import { MoreVertical, Eye, Download, RefreshCw, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PoliciesTableProps {
  policies: Policy[];
  selectedPolicies: string[];
  onSelectPolicy: (id: string) => void;
  onSelectAll: () => void;
  onViewDetails: (policy: Policy) => void;
  onRegenerate?: (policyId: string) => void;
}

export function PoliciesTable({
  policies,
  selectedPolicies,
  onSelectPolicy,
  onSelectAll,
  onViewDetails,
  onRegenerate,
}: PoliciesTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
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
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getTypeLabel = (type: string, category?: string) => {
    const labels: Record<string, string> = {
      security: "Security",
      data_retention: "Data Retention",
      incident_response: "Incident Response",
      ai_governance: "AI Governance",
      vendor_risk: "Vendor Risk",
      custom: category || "Custom",
    };
    return labels[type] || type;
  };

  const allSelected = policies.length > 0 && selectedPolicies.length === policies.length;

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-100 border-b border-slate-200">
            <TableHead className="w-12">
              <Checkbox checked={allSelected} onCheckedChange={onSelectAll} />
            </TableHead>
            <TableHead>Policy ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Frameworks</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Sync Status</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Last Modified</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {policies.map((policy) => {
            const isExpanded = expandedRows.has(policy.id);
            const isSelected = selectedPolicies.includes(policy.id);

            return (
              <React.Fragment key={policy.id}>
                <TableRow
                  className={cn(
                    "bg-white border-b border-slate-100 cursor-pointer hover:bg-slate-50",
                    isSelected && "bg-blue-50"
                  )}
                  onClick={() => toggleRow(policy.id)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onSelectPolicy(policy.id)}
                    />
                  </TableCell>
                  <TableCell className="font-mono text-sm">{policy.policyId}</TableCell>
                  <TableCell className="font-medium">{policy.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {getTypeLabel(policy.type, policy.category)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {policy.frameworkNames.slice(0, 2).map((name, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {name}
                        </Badge>
                      ))}
                      {policy.frameworkNames.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{policy.frameworkNames.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <PolicyStatusBadge status={policy.status} />
                  </TableCell>
                  <TableCell>
                    <PolicySyncStatus
                      syncStatus={policy.syncStatus}
                      syncIssues={policy.syncIssues}
                    />
                  </TableCell>
                  <TableCell className="text-sm">v{policy.version}</TableCell>
                  <TableCell className="text-sm">{policy.ownerName || "—"}</TableCell>
                  <TableCell className="text-sm text-slate-500">
                    {getTimeAgo(policy.updatedAt)}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewDetails(policy)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </DropdownMenuItem>
                        {policy.generationMethod === "auto_generated" && (
                          <DropdownMenuItem onClick={() => onRegenerate?.(policy.id)}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Regenerate
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                {isExpanded && (
                  <TableRow className="bg-slate-50">
                    <TableCell colSpan={11} className="p-4">
                      <div className="space-y-3">
                        {policy.description && (
                          <div>
                            <p className="text-sm font-medium text-slate-700 mb-1">Description:</p>
                            <p className="text-sm text-slate-600">{policy.description}</p>
                          </div>
                        )}
                        {policy.syncStatus === "out_of_sync" && policy.syncIssues && policy.syncIssues.length > 0 && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm font-medium text-red-800 mb-2">Sync Issues:</p>
                            <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
                              {policy.syncIssues.map((issue, idx) => (
                                <li key={idx}>{issue}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span>Approval: {policy.approvalStatus}</span>
                          {policy.attestationCount && (
                            <span>{policy.attestationCount} attestations</span>
                          )}
                          {policy.evidenceIds && policy.evidenceIds.length > 0 && (
                            <span>{policy.evidenceIds.length} evidence items</span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

