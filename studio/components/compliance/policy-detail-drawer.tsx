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
import { Policy } from "@/lib/data/policies";
import { PolicyStatusBadge } from "./policy-status-badge";
import { PolicySyncStatus } from "./policy-sync-status";
import {
  FileText,
  Clock,
  User,
  History,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface PolicyDetailDrawerProps {
  policy: Policy | null;
  open: boolean;
  onClose: () => void;
  onRegenerate?: (policyId: string) => void;
}

export function PolicyDetailDrawer({
  policy,
  open,
  onClose,
  onRegenerate,
}: PolicyDetailDrawerProps) {
  if (!policy) return null;

  const getTimeAgo = (dateString?: string) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleString();
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

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-palette-primary" />
            <div className="flex-1">
              <SheetTitle className="text-2xl">{policy.policyId}</SheetTitle>
              <SheetDescription className="text-base mt-1">{policy.name}</SheetDescription>
            </div>
            <div className="flex gap-2">
              <PolicyStatusBadge status={policy.status} />
            </div>
          </div>
        </SheetHeader>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="versions">Versions</TabsTrigger>
            <TabsTrigger value="attestations">Attestations</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            {policy.description && (
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Description</h3>
                <p className="text-sm text-slate-600">{policy.description}</p>
              </div>
            )}

            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Frameworks</h3>
              <div className="flex flex-wrap gap-2">
                {policy.frameworkNames.map((name, idx) => (
                  <Badge key={idx} variant="outline">
                    {name}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Type</h3>
                <p className="text-sm text-slate-600">{getTypeLabel(policy.type, policy.category)}</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Version</h3>
                <p className="text-sm text-slate-600">v{policy.version}</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Status</h3>
                <PolicyStatusBadge status={policy.status} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Approval</h3>
                <Badge
                  variant={
                    policy.approvalStatus === "approved"
                      ? "default"
                      : policy.approvalStatus === "pending"
                      ? "secondary"
                      : "destructive"
                  }
                  className={
                    policy.approvalStatus === "approved"
                      ? "bg-green-100 text-green-800"
                      : policy.approvalStatus === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {policy.approvalStatus}
                </Badge>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Sync Status</h3>
              <PolicySyncStatus syncStatus={policy.syncStatus} syncIssues={policy.syncIssues} />
              {policy.syncStatus === "out_of_sync" && policy.syncIssues && policy.syncIssues.length > 0 && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm font-medium text-red-800 mb-2">Sync Issues:</p>
                  <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
                    {policy.syncIssues.map((issue, idx) => (
                      <li key={idx}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Owner
                </h3>
                <p className="text-sm text-slate-600">{policy.ownerName || "—"}</p>
                {policy.ownerEmail && (
                  <p className="text-xs text-slate-500">{policy.ownerEmail}</p>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Last Modified
                </h3>
                <p className="text-sm text-slate-600">{getTimeAgo(policy.updatedAt)}</p>
              </div>
            </div>

            {policy.generatedFrom && (
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Generated From</h3>
                <div className="text-sm text-slate-600 space-y-1">
                  {policy.generatedFrom.configs && policy.generatedFrom.configs.length > 0 && (
                    <p>Configs: {policy.generatedFrom.configs.join(", ")}</p>
                  )}
                  {policy.generatedFrom.evidence && policy.generatedFrom.evidence.length > 0 && (
                    <p>Evidence: {policy.generatedFrom.evidence.length} items</p>
                  )}
                  {policy.generatedFrom.controls && policy.generatedFrom.controls.length > 0 && (
                    <p>Controls: {policy.generatedFrom.controls.length} items</p>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              {policy.generationMethod === "auto_generated" && (
                <Button variant="outline" onClick={() => onRegenerate?.(policy.id)}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>
              )}
            </div>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-4 mt-4">
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-sm text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-200">
                {policy.content}
              </div>
            </div>
          </TabsContent>

          {/* Versions Tab */}
          <TabsContent value="versions" className="space-y-4 mt-4">
            <div className="space-y-3">
              {policy.versionHistory.map((version) => (
                <div
                  key={version.id}
                  className="p-4 border border-slate-200 rounded-lg bg-white"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">v{version.version}</Badge>
                      {version.isCurrent && (
                        <Badge className="bg-green-100 text-green-800">Current</Badge>
                      )}
                    </div>
                    <span className="text-xs text-slate-500">{getTimeAgo(version.createdAt)}</span>
                  </div>
                  {version.summary && (
                    <p className="text-sm font-medium text-slate-800 mb-1">{version.summary}</p>
                  )}
                  {version.changes && (
                    <p className="text-sm text-slate-600">{version.changes}</p>
                  )}
                  {version.approvedAt && (
                    <p className="text-xs text-slate-500 mt-2">
                      Approved {getTimeAgo(version.approvedAt)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Attestations Tab */}
          <TabsContent value="attestations" className="space-y-4 mt-4">
            {policy.attestationCount ? (
              <div>
                <p className="text-sm text-slate-600 mb-4">
                  {policy.attestationCount} user{policy.attestationCount !== 1 ? "s" : ""} have
                  attested to this policy
                </p>
                {policy.lastAttestationDate && (
                  <p className="text-xs text-slate-500">
                    Last attestation: {getTimeAgo(policy.lastAttestationDate)}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-600">No attestations yet</p>
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
                <p className="text-xs text-slate-600">{getTimeAgo(policy.createdAt)}</p>
                {policy.createdBy && (
                  <p className="text-xs text-slate-500 mt-1">By: {policy.createdBy}</p>
                )}
              </div>
              <div className="p-3 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-800">Last Updated</span>
                </div>
                <p className="text-xs text-slate-600">{getTimeAgo(policy.updatedAt)}</p>
                {policy.updatedBy && (
                  <p className="text-xs text-slate-500 mt-1">By: {policy.updatedBy}</p>
                )}
              </div>
              {policy.approvedAt && (
                <div className="p-3 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-slate-800">Approved</span>
                  </div>
                  <p className="text-xs text-slate-600">{getTimeAgo(policy.approvedAt)}</p>
                  {policy.approvedBy && (
                    <p className="text-xs text-slate-500 mt-1">By: {policy.approvedBy}</p>
                  )}
                </div>
              )}
              {policy.effectiveDate && (
                <div className="p-3 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-800">Effective Date</span>
                  </div>
                  <p className="text-xs text-slate-600">{getTimeAgo(policy.effectiveDate)}</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

