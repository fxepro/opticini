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
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, Download, Link2, MoreVertical, ChevronDown, ChevronRight } from "lucide-react";
import { Evidence } from "@/lib/data/evidence";
import { EvidenceStatusBadge } from "./evidence-status-badge";
import { EvidenceSourceBadge } from "./evidence-source-badge";
import { cn } from "@/lib/utils";

interface EvidenceTableProps {
  evidence: Evidence[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  onSelectAll: (selected: boolean) => void;
  onViewDetails: (evidence: Evidence) => void;
  onDownload: (evidenceId: string) => void;
  onLinkControl?: (evidenceId: string) => void;
}

const formatFileSize = (bytes?: number) => {
  if (!bytes) return 'N/A';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

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

export function EvidenceTable({
  evidence,
  selectedIds,
  onSelect,
  onSelectAll,
  onViewDetails,
  onDownload,
  onLinkControl,
}: EvidenceTableProps) {
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

  const allSelected = evidence.length > 0 && selectedIds.length === evidence.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < evidence.length;

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-100 border-b border-slate-200">
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                onCheckedChange={(checked) => onSelectAll(checked as boolean)}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead className="w-12"></TableHead>
            <TableHead className="w-32">Evidence ID</TableHead>
            <TableHead>Name / Description</TableHead>
            <TableHead className="w-32">Source</TableHead>
            <TableHead className="w-40">Controls</TableHead>
            <TableHead className="w-32">Status</TableHead>
            <TableHead className="w-32">Created</TableHead>
            <TableHead className="w-20">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {evidence.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-slate-500">
                No evidence found. Try adjusting your filters.
              </TableCell>
            </TableRow>
          ) : (
            evidence.map((item) => {
              const isExpanded = expandedRows.has(item.id);
              const isSelected = selectedIds.includes(item.id);

              return (
                <React.Fragment key={item.id}>
                  <TableRow
                    className={cn(
                      "bg-white hover:bg-slate-50 cursor-pointer border-b border-slate-100",
                      isSelected && "bg-palette-accent-3/30"
                    )}
                    onClick={() => toggleRow(item.id)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => onSelect(item.id)}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Select ${item.evidenceId}`}
                      />
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => toggleRow(item.id)}
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-palette-primary">
                          {item.evidenceId}
                        </span>
                        <EvidenceSourceBadge source={item.source} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-slate-800">{item.name}</div>
                        {item.description && (
                          <div className="text-sm text-slate-600 line-clamp-1">
                            {item.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{item.sourceName}</div>
                        <div className="text-xs text-slate-500 uppercase">
                          {item.fileType || 'N/A'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {item.controlNames.slice(0, 2).map((name, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {name}
                          </Badge>
                        ))}
                        {item.controlNames.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{item.controlNames.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <EvidenceStatusBadge status={item.status} />
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-slate-600">
                        {getTimeAgo(item.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onViewDetails(item)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onDownload(item.id)}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          {onLinkControl && (
                            <DropdownMenuItem onClick={() => onLinkControl(item.id)}>
                              <Link2 className="h-4 w-4 mr-2" />
                              Link to Control
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  {isExpanded && (
                    <TableRow className="bg-slate-50 border-b border-slate-200">
                      <TableCell colSpan={9} className="p-4 bg-slate-50">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-xs text-slate-500 mb-1">Full Description</div>
                            <div className="text-slate-700">{item.description || 'N/A'}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500 mb-1">File Details</div>
                            <div className="text-slate-700">
                              {item.fileType?.toUpperCase() || 'N/A'} • {formatFileSize(item.fileSize)}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500 mb-1">Expiration</div>
                            <div className="text-slate-700">
                              {item.expiresAt
                                ? new Date(item.expiresAt).toLocaleDateString()
                                : 'No expiration'}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500 mb-1">Tags</div>
                            <div className="flex flex-wrap gap-1">
                              {item.tags?.slice(0, 3).map((tag, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        {item.controlNames.length > 0 && (
                          <div className="mt-4">
                            <div className="text-xs text-slate-500 mb-2">Linked Controls</div>
                            <div className="flex flex-wrap gap-1">
                              {item.controlNames.map((name, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

