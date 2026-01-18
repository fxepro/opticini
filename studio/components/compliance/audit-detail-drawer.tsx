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
import { Audit, AuditFinding } from "@/lib/data/audits";
import { AuditStatusBadge } from "./audit-status-badge";
import {
  Search,
  Clock,
  User,
  History,
  Download,
  Lock,
  Calendar,
  AlertCircle,
  CheckCircle2,
  FileText,
} from "lucide-react";

interface AuditDetailDrawerProps {
  audit: Audit | null;
  open: boolean;
  onClose: () => void;
}

export function AuditDetailDrawer({ audit, open, onClose }: AuditDetailDrawerProps) {
  if (!audit) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString();
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      soc2_readiness: "SOC 2 Readiness",
      external_audit: "External Audit",
      internal_audit: "Internal Audit",
      customer_security_review: "Customer Security Review",
      annual_review: "Annual Review",
    };
    return labels[type] || type;
  };

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      critical: "bg-red-100 text-red-800 border-red-200",
      high: "bg-orange-100 text-orange-800 border-orange-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      low: "bg-blue-100 text-blue-800 border-blue-200",
      informational: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[severity] || "bg-gray-100 text-gray-800";
  };

  const getFindingStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      open: "bg-red-100 text-red-800",
      in_remediation: "bg-yellow-100 text-yellow-800",
      resolved: "bg-green-100 text-green-800",
      accepted: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-3">
            <Search className="h-6 w-6 text-palette-primary" />
            <div className="flex-1">
              <SheetTitle className="text-2xl">{audit.auditId}</SheetTitle>
              <SheetDescription className="text-base mt-1">{audit.name}</SheetDescription>
            </div>
            <div className="flex gap-2">
              <AuditStatusBadge status={audit.status} />
            </div>
          </div>
        </SheetHeader>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="findings">Findings</TabsTrigger>
            <TabsTrigger value="auditors">Auditors</TabsTrigger>
            <TabsTrigger value="evidence">Evidence</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            {audit.description && (
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Description</h3>
                <p className="text-sm text-slate-600">{audit.description}</p>
              </div>
            )}

            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Frameworks</h3>
              <div className="flex flex-wrap gap-2">
                {audit.frameworkNames.map((name, idx) => (
                  <Badge key={idx} variant="outline">
                    {name}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Type</h3>
                <p className="text-sm text-slate-600">{getTypeLabel(audit.type)}</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Status</h3>
                <AuditStatusBadge status={audit.status} />
              </div>
            </div>

            {/* Evidence Lock Status */}
            {audit.evidenceLocked && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="h-4 w-4 text-blue-600" />
                  <h3 className="font-semibold text-blue-800">Evidence Locked</h3>
                </div>
                <p className="text-sm text-blue-700">
                  Evidence was frozen on {formatDate(audit.evidenceFreezeDate)}
                </p>
              </div>
            )}

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <h3 className="font-semibold text-slate-800 mb-2">Controls</h3>
                <p className="text-2xl font-bold text-slate-800">
                  {audit.controlsPassed} / {audit.totalControls}
                </p>
                <p className="text-xs text-slate-500 mt-1">Controls passed</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <h3 className="font-semibold text-slate-800 mb-2">Compliance Score</h3>
                <p className="text-2xl font-bold text-palette-primary">
                  {audit.complianceScore || 0}%
                </p>
              </div>
              {audit.findingsCount > 0 && (
                <div className="p-3 bg-red-50 rounded-lg">
                  <h3 className="font-semibold text-red-800 mb-2">Findings</h3>
                  <p className="text-2xl font-bold text-red-600">{audit.findingsCount}</p>
                  <p className="text-xs text-red-500 mt-1">
                    {audit.criticalFindings} critical, {audit.highFindings} high
                  </p>
                </div>
              )}
              {audit.evidenceCount && (
                <div className="p-3 bg-slate-50 rounded-lg">
                  <h3 className="font-semibold text-slate-800 mb-2">Evidence</h3>
                  <p className="text-2xl font-bold text-slate-800">{audit.evidenceCount}</p>
                  <p className="text-xs text-slate-500 mt-1">Evidence items</p>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div>
              <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Timeline
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Start Date:</span>
                  <span className="font-medium">{formatDate(audit.startDate)}</span>
                </div>
                {audit.endDate && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">End Date:</span>
                    <span className="font-medium">{formatDate(audit.endDate)}</span>
                  </div>
                )}
                {audit.scheduledEndDate && !audit.endDate && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Scheduled End:</span>
                    <span className="font-medium">{formatDate(audit.scheduledEndDate)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Owner */}
            {audit.ownerName && (
              <div>
                <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Owner
                </h3>
                <p className="text-sm text-slate-600">{audit.ownerName}</p>
                {audit.ownerEmail && (
                  <p className="text-xs text-slate-500">{audit.ownerEmail}</p>
                )}
              </div>
            )}

            {/* Summary */}
            {audit.summary && (
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Summary</h3>
                <p className="text-sm text-slate-600">{audit.summary}</p>
              </div>
            )}

            {/* Conclusion */}
            {audit.conclusion && (
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Conclusion</h3>
                <p className="text-sm text-slate-600">{audit.conclusion}</p>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </TabsContent>

          {/* Findings Tab */}
          <TabsContent value="findings" className="space-y-4 mt-4">
            {audit.findings.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-sm text-slate-600">No findings</p>
              </div>
            ) : (
              <div className="space-y-3">
                {audit.findings.map((finding) => (
                  <div
                    key={finding.id}
                    className="p-4 border border-slate-200 rounded-lg bg-white"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-sm font-medium">{finding.findingId}</span>
                          <Badge
                            variant="outline"
                            className={cn("text-xs", getSeverityColor(finding.severity))}
                          >
                            {finding.severity}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={cn("text-xs", getFindingStatusColor(finding.status))}
                          >
                            {finding.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <h4 className="font-semibold text-slate-800 mb-1">{finding.title}</h4>
                        <p className="text-sm text-slate-600">{finding.description}</p>
                      </div>
                    </div>
                    {finding.controlName && (
                      <div className="mt-2 text-xs text-slate-500">
                        Control: {finding.controlName} ({finding.controlId})
                      </div>
                    )}
                    {finding.assignedTo && (
                      <div className="mt-2 text-xs text-slate-500">
                        Assigned to: {finding.assignedTo}
                      </div>
                    )}
                    {finding.dueDate && (
                      <div className="mt-2 text-xs text-slate-500">
                        Due: {formatDate(finding.dueDate)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Auditors Tab */}
          <TabsContent value="auditors" className="space-y-4 mt-4">
            {audit.auditors.length === 0 ? (
              <p className="text-sm text-slate-600">No auditors assigned</p>
            ) : (
              <div className="space-y-3">
                {audit.auditors.map((auditor) => (
                  <div
                    key={auditor.id}
                    className="p-4 border border-slate-200 rounded-lg bg-white"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-slate-800">{auditor.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {auditor.role.replace("_", " ")}
                          </Badge>
                          {auditor.role === "lead_auditor" && (
                            <Badge className="bg-blue-100 text-blue-800 text-xs">
                              Lead
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-600">{auditor.email}</p>
                        {auditor.organization && (
                          <p className="text-xs text-slate-500 mt-1">{auditor.organization}</p>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-slate-500 space-y-1">
                      {auditor.accessGrantedAt && (
                        <p>Access granted: {formatDate(auditor.accessGrantedAt)}</p>
                      )}
                      {auditor.lastAccessAt && (
                        <p>Last access: {formatDate(auditor.lastAccessAt)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Evidence Tab */}
          <TabsContent value="evidence" className="space-y-4 mt-4">
            {audit.evidenceLocked && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-blue-600" />
                  <p className="text-sm font-medium text-blue-800">Evidence is locked</p>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  Frozen on {formatDate(audit.evidenceFreezeDate)}
                </p>
              </div>
            )}
            <div>
              <p className="text-sm text-slate-600">
                {audit.evidenceCount || 0} evidence item{audit.evidenceCount !== 1 ? "s" : ""}{" "}
                {audit.evidenceLocked ? "locked" : "available"} for this audit
              </p>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4 mt-4">
            <div className="space-y-3">
              <div className="p-3 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-800">Created</span>
                </div>
                <p className="text-xs text-slate-600">{formatDate(audit.createdAt)}</p>
                {audit.createdBy && (
                  <p className="text-xs text-slate-500 mt-1">By: {audit.createdBy}</p>
                )}
              </div>
              <div className="p-3 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-800">Last Updated</span>
                </div>
                <p className="text-xs text-slate-600">{formatDate(audit.updatedAt)}</p>
                {audit.updatedBy && (
                  <p className="text-xs text-slate-500 mt-1">By: {audit.updatedBy}</p>
                )}
              </div>
              {audit.completedAt && (
                <div className="p-3 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-slate-800">Completed</span>
                  </div>
                  <p className="text-xs text-slate-600">{formatDate(audit.completedAt)}</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

