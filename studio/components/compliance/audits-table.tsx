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
import { Audit } from "@/lib/data/audits";
import { AuditStatusBadge } from "./audit-status-badge";
import { MoreVertical, Eye, Download, Lock, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuditsTableProps {
  audits: Audit[];
  selectedAudits: string[];
  onSelectAudit: (id: string) => void;
  onSelectAll: () => void;
  onViewDetails: (audit: Audit) => void;
}

export function AuditsTable({
  audits,
  selectedAudits,
  onSelectAudit,
  onSelectAll,
  onViewDetails,
}: AuditsTableProps) {
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString();
  };

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

  const allSelected = audits.length > 0 && selectedAudits.length === audits.length;

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-100 border-b border-slate-200">
            <TableHead className="w-12">
              <Checkbox checked={allSelected} onCheckedChange={onSelectAll} />
            </TableHead>
            <TableHead>Audit ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Frameworks</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Controls</TableHead>
            <TableHead>Compliance</TableHead>
            <TableHead>Findings</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>Lead Auditor</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {audits.map((audit) => {
            const isExpanded = expandedRows.has(audit.id);
            const isSelected = selectedAudits.includes(audit.id);

            return (
              <React.Fragment key={audit.id}>
                <TableRow
                  className={cn(
                    "bg-white border-b border-slate-100 cursor-pointer hover:bg-slate-50",
                    isSelected && "bg-blue-50"
                  )}
                  onClick={() => toggleRow(audit.id)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onSelectAudit(audit.id)}
                    />
                  </TableCell>
                  <TableCell className="font-mono text-sm">{audit.auditId}</TableCell>
                  <TableCell className="font-medium">{audit.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {getTypeLabel(audit.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {audit.frameworkNames.slice(0, 2).map((name, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {name}
                        </Badge>
                      ))}
                      {audit.frameworkNames.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{audit.frameworkNames.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <AuditStatusBadge status={audit.status} />
                  </TableCell>
                  <TableCell className="text-sm">
                    {audit.controlsPassed} / {audit.totalControls}
                  </TableCell>
                  <TableCell className="text-sm font-semibold text-palette-primary">
                    {audit.complianceScore || 0}%
                  </TableCell>
                  <TableCell>
                    {audit.findingsCount > 0 ? (
                      <span className="text-sm font-semibold text-red-600">
                        {audit.findingsCount}
                      </span>
                    ) : (
                      <span className="text-sm text-slate-400">0</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-slate-500">
                    {formatDate(audit.startDate)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {audit.leadAuditor?.name || "—"}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewDetails(audit)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                {isExpanded && (
                  <TableRow className="bg-slate-50">
                    <TableCell colSpan={12} className="p-4">
                      <div className="space-y-3">
                        {audit.description && (
                          <div>
                            <p className="text-sm font-medium text-slate-700 mb-1">Description:</p>
                            <p className="text-sm text-slate-600">{audit.description}</p>
                          </div>
                        )}
                        {audit.evidenceLocked && (
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
                            <Lock className="h-4 w-4 text-blue-600" />
                            <div>
                              <p className="text-sm font-medium text-blue-800">Evidence Locked</p>
                              <p className="text-xs text-blue-600">
                                Frozen on {formatDate(audit.evidenceFreezeDate)}
                              </p>
                            </div>
                          </div>
                        )}
                        {audit.summary && (
                          <div>
                            <p className="text-sm font-medium text-slate-700 mb-1">Summary:</p>
                            <p className="text-sm text-slate-600">{audit.summary}</p>
                          </div>
                        )}
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          {audit.evidenceCount && (
                            <span>{audit.evidenceCount} evidence items</span>
                          )}
                          {audit.auditors.length > 0 && (
                            <span>{audit.auditors.length} auditor{audit.auditors.length !== 1 ? "s" : ""}</span>
                          )}
                          {audit.ownerName && <span>Owner: {audit.ownerName}</span>}
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

