"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Report } from "@/lib/data/reports";
import { ReportStatusBadge } from "./report-status-badge";
import {
  BarChart3,
  Clock,
  User,
  Download,
  Share2,
  FileText,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon,
  Lock,
} from "lucide-react";

interface ReportDetailDrawerProps {
  report: Report | null;
  open: boolean;
  onClose: () => void;
  onDownload?: (reportId: string) => void;
  onShare?: (reportId: string) => void;
}

export function ReportDetailDrawer({
  report,
  open,
  onClose,
  onDownload,
  onShare,
}: ReportDetailDrawerProps) {
  if (!report) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString();
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      readiness: "Readiness Report",
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

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-3">
            <BarChart3 className="h-6 w-6 text-palette-primary" />
            <div className="flex-1">
              <SheetTitle className="text-2xl">{report.reportId}</SheetTitle>
              <SheetDescription className="text-base mt-1">{report.name}</SheetDescription>
            </div>
            <div className="flex gap-2">
              <ReportStatusBadge status={report.status} />
            </div>
          </div>
        </SheetHeader>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sharing">Sharing</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            {report.description && (
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Description</h3>
                <p className="text-sm text-slate-600">{report.description}</p>
              </div>
            )}

            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Frameworks</h3>
              <div className="flex flex-wrap gap-2">
                {report.frameworkNames.map((name, idx) => (
                  <Badge key={idx} variant="outline">
                    {name}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Type</h3>
                <p className="text-sm text-slate-600">{getTypeLabel(report.type)}</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">View</h3>
                <Badge variant="outline">{getViewLabel(report.view)}</Badge>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Status</h3>
                <ReportStatusBadge status={report.status} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Format</h3>
                <p className="text-sm text-slate-600 uppercase">{report.fileFormat}</p>
              </div>
            </div>

            {/* Summary Statistics */}
            {report.summary && (
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Summary Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  {report.summary.complianceScore !== undefined && (
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500 mb-1">Compliance Score</p>
                      <p className="text-2xl font-bold text-palette-primary">
                        {report.summary.complianceScore}%
                      </p>
                    </div>
                  )}
                  {report.summary.controlsTotal && (
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500 mb-1">Controls</p>
                      <p className="text-2xl font-bold text-slate-800">
                        {report.summary.controlsPassed} / {report.summary.controlsTotal}
                      </p>
                    </div>
                  )}
                  {report.summary.findingsCount !== undefined && (
                    <div className="p-3 bg-red-50 rounded-lg">
                      <p className="text-xs text-red-500 mb-1">Findings</p>
                      <p className="text-2xl font-bold text-red-600">
                        {report.summary.findingsCount}
                      </p>
                    </div>
                  )}
                  {report.summary.evidenceCount && (
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500 mb-1">Evidence Items</p>
                      <p className="text-2xl font-bold text-slate-800">
                        {report.summary.evidenceCount}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Content Includes */}
            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Report Contents</h3>
              <div className="space-y-2 text-sm">
                {report.includesControls && (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-slate-600">
                      Controls ({report.controlCount || 0} controls)
                    </span>
                  </div>
                )}
                {report.includesEvidence && (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-slate-600">
                      Evidence ({report.evidenceCount || 0} items)
                    </span>
                  </div>
                )}
                {report.includesPolicies && (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-slate-600">
                      Policies ({report.policyCount || 0} policies)
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* File Information */}
            <div>
              <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                File Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">File Size:</span>
                  <span className="font-medium">{formatFileSize(report.fileSize)}</span>
                </div>
                {report.generatedAt && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Generated:</span>
                    <span className="font-medium">{formatDate(report.generatedAt)}</span>
                  </div>
                )}
                {report.templateName && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Template:</span>
                    <span className="font-medium">{report.templateName}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Date Range */}
            {report.dateRangeStart && report.dateRangeEnd && (
              <div>
                <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date Range
                </h3>
                <div className="text-sm text-slate-600">
                  {formatDate(report.dateRangeStart)} - {formatDate(report.dateRangeEnd)}
                </div>
              </div>
            )}

            {/* Error Message */}
            {report.status === "failed" && report.errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <h3 className="font-semibold text-red-800">Error</h3>
                </div>
                <p className="text-sm text-red-700">{report.errorMessage}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              {report.status === "ready" && (
                <>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => onDownload?.(report.id)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" onClick={() => onShare?.(report.id)}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </>
              )}
            </div>
          </TabsContent>

          {/* Sharing Tab */}
          <TabsContent value="sharing" className="space-y-4 mt-4">
            {report.shares && report.shares.length > 0 ? (
              <div className="space-y-3">
                {report.shares.map((share) => (
                  <div key={share.id} className="p-4 border border-slate-200 rounded-lg bg-white">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <LinkIcon className="h-4 w-4 text-slate-500" />
                          <a
                            href={share.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline break-all"
                          >
                            {share.link}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          {share.passwordProtected && (
                            <Badge variant="outline" className="text-xs">
                              <Lock className="h-3 w-3 mr-1" />
                              Password Protected
                            </Badge>
                          )}
                          <span className="text-xs text-slate-500">
                            {share.accessCount} access{share.accessCount !== 1 ? "es" : ""}
                          </span>
                        </div>
                        {share.expiresAt && (
                          <p className="text-xs text-slate-500">
                            Expires: {formatDate(share.expiresAt)}
                          </p>
                        )}
                        <p className="text-xs text-slate-500 mt-1">
                          Created: {formatDate(share.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Share2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-sm text-slate-600">No shares created</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => onShare?.(report.id)}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Create Share Link
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-4 mt-4">
            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Report Scope</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Frameworks:</span>
                  <span className="font-medium">{report.frameworkNames.join(", ")}</span>
                </div>
                {report.dateRangeStart && report.dateRangeEnd && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Date Range:</span>
                    <span className="font-medium">
                      {formatDate(report.dateRangeStart)} - {formatDate(report.dateRangeEnd)}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">View Type:</span>
                  <span className="font-medium">{getViewLabel(report.view)}</span>
                </div>
              </div>
            </div>

            {report.templateName && (
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Template</h3>
                <p className="text-sm text-slate-600">{report.templateName}</p>
              </div>
            )}

            {report.status === "ready" && report.fileUrl && (
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Preview</h3>
                <p className="text-sm text-slate-600 mb-2">
                  Report is ready for download. Click the download button to view.
                </p>
              </div>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4 mt-4">
            <div className="space-y-3">
              <div className="p-3 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-800">Created</span>
                </div>
                <p className="text-xs text-slate-600">{formatDate(report.createdAt)}</p>
                {report.createdBy && (
                  <p className="text-xs text-slate-500 mt-1">By: {report.createdBy}</p>
                )}
              </div>
              {report.generatedAt && (
                <div className="p-3 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-slate-800">Generated</span>
                  </div>
                  <p className="text-xs text-slate-600">{formatDate(report.generatedAt)}</p>
                  {report.generatedBy && (
                    <p className="text-xs text-slate-500 mt-1">By: {report.generatedBy}</p>
                  )}
                </div>
              )}
              <div className="p-3 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-800">Last Updated</span>
                </div>
                <p className="text-xs text-slate-600">{formatDate(report.updatedAt)}</p>
                {report.updatedBy && (
                  <p className="text-xs text-slate-500 mt-1">By: {report.updatedBy}</p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

