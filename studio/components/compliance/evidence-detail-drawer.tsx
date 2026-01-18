"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Link2, ExternalLink, FileText, Image, File } from "lucide-react";
import { Evidence } from "@/lib/data/evidence";
import { EvidenceStatusBadge } from "./evidence-status-badge";
import { EvidenceSourceBadge } from "./evidence-source-badge";

interface EvidenceDetailDrawerProps {
  evidence: Evidence | null;
  open: boolean;
  onClose: () => void;
  onDownload?: (evidenceId: string) => void;
  onLinkControl?: (evidenceId: string) => void;
}

const getFileIcon = (fileType?: string) => {
  switch (fileType?.toLowerCase()) {
    case 'pdf':
      return FileText;
    case 'png':
    case 'jpg':
    case 'jpeg':
      return Image;
    default:
      return File;
  }
};

const formatFileSize = (bytes?: number) => {
  if (!bytes) return 'N/A';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export function EvidenceDetailDrawer({
  evidence,
  open,
  onClose,
  onDownload,
  onLinkControl,
}: EvidenceDetailDrawerProps) {
  if (!evidence) return null;

  const FileIcon = getFileIcon(evidence.fileType);
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleString();
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileIcon className="h-6 w-6 text-palette-primary" />
              <div>
                <SheetTitle className="text-2xl">{evidence.evidenceId}</SheetTitle>
                <SheetDescription className="text-base mt-1">
                  {evidence.name}
                </SheetDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <EvidenceStatusBadge status={evidence.status} />
              <EvidenceSourceBadge source={evidence.source} />
            </div>
          </div>
        </SheetHeader>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="controls">Controls</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-2">Description</h3>
                <p className="text-sm text-slate-600">
                  {evidence.description || 'No description provided.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">Source</h3>
                  <p className="text-sm text-slate-600">{evidence.sourceName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">Created</h3>
                  <p className="text-sm text-slate-600">{getTimeAgo(evidence.createdAt)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">File Type</h3>
                  <p className="text-sm text-slate-600 uppercase">{evidence.fileType || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">File Size</h3>
                  <p className="text-sm text-slate-600">{formatFileSize(evidence.fileSize)}</p>
                </div>
              </div>

              {evidence.expiresAt && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">Expiration</h3>
                  <p className="text-sm text-slate-600">
                    {new Date(evidence.expiresAt).toLocaleString()}
                  </p>
                </div>
              )}

              {evidence.tags && evidence.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {evidence.tags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {evidence.category && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">Category</h3>
                  <Badge variant="outline">{evidence.category}</Badge>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="controls" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">
                  Linked Controls ({evidence.controlNames.length})
                </h3>
                <div className="space-y-2">
                  {evidence.controlNames.map((name, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50"
                    >
                      <div>
                        <div className="font-medium text-slate-800">{name}</div>
                        <div className="text-xs text-slate-500">
                          {evidence.controlIds[idx]}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={`/workspace/compliance/controls?control=${evidence.controlIds[idx]}`}>
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">
                  Frameworks ({evidence.frameworkNames.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {evidence.frameworkNames.map((name, idx) => (
                    <Badge key={idx} variant="outline">
                      {name}
                    </Badge>
                  ))}
                </div>
              </div>

              {onLinkControl && (
                <Button
                  variant="outline"
                  className="w-full border-palette-primary text-palette-primary hover:bg-palette-accent-3"
                  onClick={() => onLinkControl(evidence.id)}
                >
                  <Link2 className="h-4 w-4 mr-2" />
                  Link to Additional Control
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="border rounded-lg p-6 bg-slate-50 text-center">
                <FileIcon className="h-16 w-16 mx-auto text-slate-400 mb-4" />
                <p className="text-sm text-slate-600 mb-2">
                  File preview not available for this file type.
                </p>
                <p className="text-xs text-slate-500">
                  {evidence.fileType?.toUpperCase()} • {formatFileSize(evidence.fileSize)}
                </p>
              </div>

              {evidence.content && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">Content</h3>
                  <pre className="text-xs bg-slate-50 p-4 rounded-lg overflow-auto max-h-96">
                    {evidence.content}
                  </pre>
                </div>
              )}

              <Button
                variant="outline"
                className="w-full border-palette-primary text-palette-primary hover:bg-palette-accent-3"
                onClick={() => onDownload?.(evidence.id)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Evidence
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="metadata" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">Evidence ID</h3>
                  <p className="text-sm text-slate-600 font-mono">{evidence.evidenceId}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">Internal ID</h3>
                  <p className="text-sm text-slate-600 font-mono">{evidence.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">Created By</h3>
                  <p className="text-sm text-slate-600">
                    {evidence.createdBy === 'system' ? 'System (Automated)' : evidence.createdBy || 'N/A'}
                  </p>
                </div>
                {evidence.uploadedBy && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-2">Uploaded By</h3>
                    <p className="text-sm text-slate-600">{evidence.uploadedBy}</p>
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">Source Type</h3>
                  <p className="text-sm text-slate-600">{evidence.sourceType}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">Validity Period</h3>
                  <p className="text-sm text-slate-600">
                    {evidence.validityPeriod ? `${evidence.validityPeriod} days` : 'N/A'}
                  </p>
                </div>
              </div>

              {evidence.auditLocked && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h3 className="text-sm font-semibold text-yellow-800 mb-1">Audit Locked</h3>
                  <p className="text-xs text-yellow-700">
                    This evidence is locked for audit: {evidence.auditId || 'N/A'}
                  </p>
                </div>
              )}

              {evidence.fileUrl && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">File URL</h3>
                  <p className="text-sm text-slate-600 break-all">{evidence.fileUrl}</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 pt-4 border-t flex gap-2">
          <Button
            variant="outline"
            className="flex-1 border-palette-primary text-palette-primary hover:bg-palette-accent-3"
            onClick={() => onDownload?.(evidence.id)}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          {onLinkControl && (
            <Button
              variant="outline"
              className="flex-1 border-palette-primary text-palette-primary hover:bg-palette-accent-3"
              onClick={() => onLinkControl(evidence.id)}
            >
              <Link2 className="h-4 w-4 mr-2" />
              Link Control
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

