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
import { Control } from "@/lib/data/controls";
import { ControlStatusBadge } from "./control-status-badge";
import { ControlSeverityBadge } from "./control-severity-badge";
import { MoreVertical, Eye, FileText, RefreshCw, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface ControlsTableProps {
  controls: Control[];
  selectedControls: string[];
  onSelectControl: (id: string) => void;
  onSelectAll: () => void;
  onViewDetails: (control: Control) => void;
  onReEvaluate?: (controlId: string) => void;
}

export function ControlsTable({
  controls,
  selectedControls,
  onSelectControl,
  onSelectAll,
  onViewDetails,
  onReEvaluate,
}: ControlsTableProps) {
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
    if (!dateString) return 'Never';
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

  const allSelected = controls.length > 0 && selectedControls.length === controls.length;

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-100 border-b border-slate-200">
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead>Control ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Frameworks</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Last Evaluated</TableHead>
            <TableHead>Evidence</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {controls.map((control) => {
            const isExpanded = expandedRows.has(control.id);
            const isSelected = selectedControls.includes(control.id);

            return (
              <React.Fragment key={control.id}>
                <TableRow
                  className={cn(
                    "bg-white cursor-pointer hover:bg-slate-50 border-b border-slate-100",
                    isSelected && "bg-palette-accent-3/20",
                    control.status === 'fail' && "bg-red-50/30",
                    control.status === 'partial' && "bg-yellow-50/30",
                  )}
                  onClick={() => toggleRow(control.id)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onSelectControl(control.id)}
                    />
                  </TableCell>
                  <TableCell className="font-mono text-sm font-semibold">
                    {control.controlId}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-md">
                      <p className="font-medium text-slate-800 truncate">{control.name}</p>
                      <p className="text-xs text-slate-500 truncate">{control.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {control.frameworkNames.slice(0, 2).map((name, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {name}
                        </Badge>
                      ))}
                      {control.frameworkNames.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{control.frameworkNames.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <ControlStatusBadge status={control.status} />
                  </TableCell>
                  <TableCell>
                    <ControlSeverityBadge severity={control.severity} />
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {getTimeAgo(control.lastEvaluated)}
                  </TableCell>
                  <TableCell>
                    {control.evidenceCount > 0 ? (
                      <Badge variant="outline" className="cursor-pointer hover:bg-slate-100">
                        {control.evidenceCount}
                      </Badge>
                    ) : (
                      <span className="text-slate-400 text-sm">—</span>
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
                        <DropdownMenuItem onClick={() => onViewDetails(control)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {control.evidenceCount > 0 && (
                          <DropdownMenuItem>
                            <FileText className="h-4 w-4 mr-2" />
                            View Evidence ({control.evidenceCount})
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => onReEvaluate?.(control.id)}>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Re-evaluate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                {isExpanded && (
                  <TableRow className="bg-slate-50 border-b border-slate-200">
                    <TableCell colSpan={9} className="p-4 bg-slate-50">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-sm text-slate-800 mb-2">Description</h4>
                          <p className="text-sm text-slate-600">{control.description}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-slate-800 mb-2">Status Details</h4>
                          {control.status === 'fail' && control.failureReason && (
                            <div className="space-y-1">
                              <p className="text-sm text-red-700 font-medium">Failure Reason:</p>
                              <p className="text-sm text-red-600">{control.failureReason}</p>
                              {control.failingCount && (
                                <p className="text-xs text-red-600">
                                  {control.failingCount} asset{control.failingCount !== 1 ? 's' : ''} affected
                                </p>
                              )}
                            </div>
                          )}
                          {control.status === 'partial' && control.failureReason && (
                            <div className="space-y-1">
                              <p className="text-sm text-yellow-700 font-medium">Partial Compliance:</p>
                              <p className="text-sm text-yellow-600">{control.failureReason}</p>
                            </div>
                          )}
                          {control.status === 'pass' && (
                            <p className="text-sm text-green-700">All requirements met</p>
                          )}
                        </div>
                        {control.fixRecommendations && control.fixRecommendations.length > 0 && (
                          <div className="col-span-2">
                            <h4 className="font-semibold text-sm text-slate-800 mb-2">Fix Recommendations</h4>
                            <ul className="list-disc list-inside space-y-1">
                              {control.fixRecommendations.slice(0, 3).map((rec, idx) => (
                                <li key={idx} className="text-sm text-slate-600">{rec}</li>
                              ))}
                            </ul>
                          </div>
                        )}
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

