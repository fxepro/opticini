"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, Eye, Download, Share2, FileText, Calendar, Lock } from "lucide-react";
import { Report } from "@/lib/data/reports";
import { ReportStatusBadge } from "./report-status-badge";
import { cn } from "@/lib/utils";

interface ReportCardProps {
  report: Report;
  onViewDetails?: (report: Report) => void;
  onDownload?: (reportId: string) => void;
  onShare?: (reportId: string) => void;
}

export function ReportCard({ report, onViewDetails, onDownload, onShare }: ReportCardProps) {
  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      readiness: "Readiness",
      gap_analysis: "Gap Analysis",
      continuous_monitoring: "Continuous Monitoring",
      executive_summary: "Executive Summary",
      technical_report: "Technical Report",
      auditor_report: "Auditor Report",
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

  return (
    <Card
      className={cn(
        "relative border-2 transition-all duration-200 hover:shadow-lg",
        report.status === "ready" && "border-green-200 hover:border-green-300",
        report.status === "generating" && "border-yellow-200 hover:border-yellow-300",
        report.status === "pending" && "border-gray-200 hover:border-gray-300",
        report.status === "failed" && "border-red-200 hover:border-red-300"
      )}
    >
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="h-5 w-5 text-palette-primary" />
              <h3 className="font-semibold text-lg text-slate-800">{report.reportId}</h3>
              <ReportStatusBadge status={report.status} />
            </div>
            <h4 className="font-medium text-slate-700 mb-2">{report.name}</h4>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                {getTypeLabel(report.type)}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {getViewLabel(report.view)} View
              </Badge>
              {report.frameworkNames.slice(0, 2).map((name, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {name}
                </Badge>
              ))}
              {report.frameworkNames.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{report.frameworkNames.length - 2} more
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {report.description && (
          <p className="text-sm text-slate-600 mb-4 line-clamp-2">{report.description}</p>
        )}

        {/* Summary Stats */}
        {report.summary && (
          <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-slate-50 rounded-lg">
            {report.summary.complianceScore !== undefined && (
              <div>
                <p className="text-xs text-slate-500 mb-1">Compliance</p>
                <p className="text-sm font-semibold text-palette-primary">
                  {report.summary.complianceScore}%
                </p>
              </div>
            )}
            {report.summary.controlsTotal && (
              <div>
                <p className="text-xs text-slate-500 mb-1">Controls</p>
                <p className="text-sm font-semibold text-slate-800">
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
                <p className="text-sm font-semibold text-slate-800">
                  {report.summary.evidenceCount}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
          <div className="flex items-center gap-4">
            {report.dateRangeStart && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(report.dateRangeStart)}</span>
              </div>
            )}
            {report.fileSize && (
              <div className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                <span>{formatFileSize(report.fileSize)}</span>
              </div>
            )}
          </div>
          {report.generatedAt && (
            <span>Generated {formatDate(report.generatedAt)}</span>
          )}
        </div>

        {/* Sharing Info */}
        {report.shareCount && report.shareCount > 0 && (
          <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
            <Share2 className="h-4 w-4 text-blue-600" />
            <div className="flex-1">
              <p className="text-xs font-medium text-blue-800">
                {report.shareCount} share{report.shareCount !== 1 ? "s" : ""} active
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onViewDetails?.(report)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          {report.status === "ready" && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDownload?.(report.id)}
                title="Download report"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onShare?.(report.id)}
                title="Share report"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

