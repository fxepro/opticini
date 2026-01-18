"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye, Link2, Image, File } from "lucide-react";
import { Evidence } from "@/lib/data/evidence";
import { EvidenceStatusBadge } from "./evidence-status-badge";
import { EvidenceSourceBadge } from "./evidence-source-badge";
import { cn } from "@/lib/utils";

interface EvidenceCardProps {
  evidence: Evidence;
  onViewDetails?: (evidence: Evidence) => void;
  onDownload?: (evidenceId: string) => void;
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

export function EvidenceCard({ evidence, onViewDetails, onDownload }: EvidenceCardProps) {
  const FileIcon = getFileIcon(evidence.fileType);
  const getTimeAgo = (dateString: string) => {
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

  const getDaysUntilExpiration = () => {
    if (!evidence.expiresAt) return null;
    const expires = new Date(evidence.expiresAt);
    const now = new Date();
    const diffMs = expires.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / 86400000);
    return diffDays;
  };

  const daysUntilExpiration = getDaysUntilExpiration();

  return (
    <Card className={cn(
      "relative border-2 transition-all duration-200 hover:shadow-lg",
      evidence.status === 'fresh' && "border-green-200 hover:border-green-300",
      evidence.status === 'expired' && "border-red-200 hover:border-red-300",
      evidence.status === 'expiring_soon' && "border-yellow-200 hover:border-yellow-300",
    )}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <FileIcon className="h-5 w-5 text-palette-primary" />
              <h3 className="font-semibold text-lg text-slate-800">{evidence.evidenceId}</h3>
              <EvidenceSourceBadge source={evidence.source} />
            </div>
            <h4 className="font-medium text-slate-700 mb-2">{evidence.name}</h4>
            {evidence.description && (
              <p className="text-sm text-slate-600 line-clamp-2 mb-2">{evidence.description}</p>
            )}
          </div>
          <EvidenceStatusBadge status={evidence.status} />
        </div>

        {/* Source Info */}
        <div className="mb-4 p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-slate-600">Source:</span>
            <span className="font-semibold text-slate-800">{evidence.sourceName}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Created:</span>
            <span className="text-slate-700">{getTimeAgo(evidence.createdAt)}</span>
          </div>
          {evidence.expiresAt && (
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-slate-600">Expires:</span>
              <span className={cn(
                "font-semibold",
                daysUntilExpiration !== null && daysUntilExpiration < 30 && "text-yellow-700",
                daysUntilExpiration !== null && daysUntilExpiration < 0 && "text-red-700",
                "text-slate-800"
              )}>
                {new Date(evidence.expiresAt).toLocaleDateString()}
                {daysUntilExpiration !== null && (
                  <span className="ml-1 text-xs">
                    ({daysUntilExpiration > 0 ? `${daysUntilExpiration}d left` : 'expired'})
                  </span>
                )}
              </span>
            </div>
          )}
        </div>

        {/* Linked Controls */}
        <div className="mb-4">
          <p className="text-xs text-slate-600 mb-2">Linked to Controls:</p>
          <div className="flex flex-wrap gap-1">
            {evidence.controlNames.slice(0, 3).map((name, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {name}
              </Badge>
            ))}
            {evidence.controlNames.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{evidence.controlNames.length - 3}
              </Badge>
            )}
          </div>
        </div>

        {/* File Info */}
        <div className="mb-4 p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">File Type:</span>
            <span className="font-semibold text-slate-800 uppercase">{evidence.fileType || 'N/A'}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-slate-600">Size:</span>
            <span className="text-slate-700">{formatFileSize(evidence.fileSize)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 border-palette-primary text-palette-primary hover:bg-palette-accent-3"
            size="sm"
            onClick={() => onViewDetails?.(evidence)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-palette-primary text-palette-primary hover:bg-palette-accent-3"
            size="sm"
            onClick={() => onDownload?.(evidence.id)}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button
            variant="ghost"
            size="sm"
            title="Link to control"
          >
            <Link2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

