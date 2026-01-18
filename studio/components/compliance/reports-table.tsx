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
import { Report } from "@/lib/data/reports";
import { ReportStatusBadge } from "./report-status-badge";
import { MoreVertical, Eye, Download, Share2, FileText, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReportsTableProps {
  reports: Report[];
  selectedReports: string[];
  onSelectReport: (id: string) => void;
  onSelectAll: () => void;
  onViewDetails: (report: Report) => void;
  onDownload?: (reportId: string) => void;
  onShare?: (reportId: string) => void;
}

export function ReportsTable({
  reports,
  selectedReports,
  onSelectReport,
  onSelectAll,
  onViewDetails,
  onDownload,
  onShare,
}: ReportsTableProps) {
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

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      readiness: "Readiness",
      gap_analysis: "Gap Analysis",
      continuous_monitoring: "Continuous",
      executive_summary: "Executive",
      technical_report: "Technical",
      auditor_report: "Auditor",
    };
    return labels[type] || type;
  };

  const getViewLabel = (view: string) => {
    const labels: Record<string, string> = {
      executive: "Executive",
      technical: "Technical",
      auditor: "Auditor",
    };
    return labels[view] || view;
  };

  const allSelected = reports.length > 0 && selectedReports.length === reports.length;

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-100 border-b border-slate-200">
            <TableHead className="w-12">
              <Checkbox checked={allSelected} onCheckedChange={onSelectAll} />
            </TableHead>
            <TableHead>Report ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Frameworks</TableHead>
            <TableHead>View</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Format</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Generated</TableHead>
            <TableHead>Shares</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => {
            const isExpanded = expandedRows.has(report.id);
            const isSelected = selectedReports.includes(report.id);

            return (
              <React.Fragment key={report.id}>
                <TableRow
                  className={cn(
                    "bg-white border-b border-slate-100 cursor-pointer hover:bg-slate-50",
                    isSelected && "bg-blue-50"
                  )}
                  onClick={() => toggleRow(report.id)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onSelectReport(report.id)}
                    />
                  </TableCell>
                  <TableCell className="font-mono text-sm">{report.reportId}</TableCell>
                  <TableCell className="font-medium">{report.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {getTypeLabel(report.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {report.frameworkNames.slice(0, 2).map((name, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {name}
                        </Badge>
                      ))}
                      {report.frameworkNames.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{report.frameworkNames.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {getViewLabel(report.view)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <ReportStatusBadge status={report.status} />
                  </TableCell>
                  <TableCell className="text-sm uppercase">{report.fileFormat}</TableCell>
                  <TableCell className="text-sm text-slate-500">
                    {formatFileSize(report.fileSize)}
                  </TableCell>
                  <TableCell className="text-sm text-slate-500">
                    {report.generatedAt ? formatDate(report.generatedAt) : "—"}
                  </TableCell>
                  <TableCell>
                    {report.shareCount && report.shareCount > 0 ? (
                      <div className="flex items-center gap-1">
                        <Share2 className="h-3 w-3 text-blue-600" />
                        <span className="text-sm font-semibold text-blue-600">
                          {report.shareCount}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400">0</span>
                    )}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewDetails(report)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {report.status === "ready" && (
                          <>
                            <DropdownMenuItem onClick={() => onDownload?.(report.id)}>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onShare?.(report.id)}>
                              <Share2 className="h-4 w-4 mr-2" />
                              Share
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                {isExpanded && (
                  <TableRow className="bg-slate-50">
                    <TableCell colSpan={12} className="p-4">
                      <div className="space-y-3">
                        {report.description && (
                          <div>
                            <p className="text-sm font-medium text-slate-700 mb-1">Description:</p>
                            <p className="text-sm text-slate-600">{report.description}</p>
                          </div>
                        )}
                        {report.summary && (
                          <div className="grid grid-cols-4 gap-4">
                            {report.summary.complianceScore !== undefined && (
                              <div>
                                <p className="text-xs text-slate-500 mb-1">Compliance Score</p>
                                <p className="text-sm font-semibold text-palette-primary">
                                  {report.summary.complianceScore}%
                                </p>
                              </div>
                            )}
                            {report.summary.controlsTotal && (
                              <div>
                                <p className="text-xs text-slate-500 mb-1">Controls</p>
                                <p className="text-sm font-semibold">
                                  {report.summary.controlsPassed} / {report.summary.controlsTotal}
                                </p>
                              </div>
                            )}
                            {report.summary.findingsCount !== undefined && (
                              <div>
                                <p className="text-xs text-slate-500 mb-1">Findings</p>
                                <p className="text-sm font-semibold text-red-600">
                                  {report.summary.findingsCount}
                                </p>
                              </div>
                            )}
                            {report.summary.evidenceCount && (
                              <div>
                                <p className="text-xs text-slate-500 mb-1">Evidence</p>
                                <p className="text-sm font-semibold">
                                  {report.summary.evidenceCount}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          {report.dateRangeStart && report.dateRangeEnd && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {formatDate(report.dateRangeStart)} - {formatDate(report.dateRangeEnd)}
                              </span>
                            </div>
                          )}
                          {report.templateName && <span>Template: {report.templateName}</span>}
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

