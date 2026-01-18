"use client";

import React from "react";
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
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Framework } from "@/lib/data/frameworks";
import { ShieldCheck, MoreVertical, Eye, FileText, ExternalLink, Shield, Lock, Globe, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface FrameworksTableProps {
  frameworks: Framework[];
  onToggle?: (id: string, enabled: boolean) => void;
  onViewDetails?: (framework: Framework) => void;
  onGenerateReport?: (frameworkId: string) => void;
}

const categoryIcons = {
  security: Shield,
  privacy: Lock,
  industry: Building2,
  regional: Globe,
};

const getStatusColor = (status: Framework['status']) => {
  switch (status) {
    case 'ready':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'in_progress':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'at_risk':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'not_started':
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusLabel = (status: Framework['status']) => {
  switch (status) {
    case 'ready':
      return 'Ready';
    case 'in_progress':
      return 'In Progress';
    case 'at_risk':
      return 'At Risk';
    case 'not_started':
      return 'Not Started';
  }
};

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 40) return 'text-yellow-600';
  return 'text-red-600';
};

export function FrameworksTable({
  frameworks,
  onToggle,
  onViewDetails,
  onGenerateReport,
}: FrameworksTableProps) {
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

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-100 border-b border-slate-200">
            <TableHead>Framework</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Compliance Score</TableHead>
            <TableHead>Controls</TableHead>
            <TableHead>Last Evaluated</TableHead>
            <TableHead>Enabled</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {frameworks.map((framework) => {
            const CategoryIcon = categoryIcons[framework.category];
            const statusColor = getStatusColor(framework.status);
            const scoreColor = getScoreColor(framework.complianceScore);

            return (
              <TableRow
                key={framework.id}
                className={cn(
                  "hover:bg-slate-50 transition-colors",
                  !framework.enabled && "opacity-60"
                )}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-lg",
                      framework.category === 'security' && "bg-blue-100",
                      framework.category === 'privacy' && "bg-purple-100",
                      framework.category === 'industry' && "bg-orange-100",
                      framework.category === 'regional' && "bg-green-100",
                    )}>
                      <CategoryIcon className={cn(
                        "h-4 w-4",
                        framework.category === 'security' && "text-blue-600",
                        framework.category === 'privacy' && "text-purple-600",
                        framework.category === 'industry' && "text-orange-600",
                        framework.category === 'regional' && "text-green-600",
                      )} />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{framework.name}</div>
                      <div className="text-xs text-slate-500">{framework.code}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {framework.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={cn("text-xs", statusColor)}>
                    {getStatusLabel(framework.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 min-w-[120px]">
                    <Progress 
                      value={framework.complianceScore} 
                      className="h-2 flex-1"
                    />
                    <span className={cn("text-sm font-semibold min-w-[40px] text-right", scoreColor)}>
                      {framework.complianceScore}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-slate-600">Total:</span>
                      <span className="font-semibold text-slate-900">{framework.totalControls}</span>
                    </div>
                    <div className="flex gap-1">
                      {framework.passingControls > 0 && (
                        <div 
                          className="h-1.5 bg-green-500 rounded flex-1"
                          style={{ 
                            width: `${(framework.passingControls / framework.totalControls) * 100}%`,
                            minWidth: framework.passingControls > 0 ? '4px' : '0'
                          }}
                          title={`${framework.passingControls} passing`}
                        />
                      )}
                      {framework.failingControls > 0 && (
                        <div 
                          className="h-1.5 bg-red-500 rounded flex-1"
                          style={{ 
                            width: `${(framework.failingControls / framework.totalControls) * 100}%`,
                            minWidth: framework.failingControls > 0 ? '4px' : '0'
                          }}
                          title={`${framework.failingControls} failing`}
                        />
                      )}
                      {framework.notEvaluatedControls > 0 && (
                        <div 
                          className="h-1.5 bg-gray-300 rounded flex-1"
                          style={{ 
                            width: `${(framework.notEvaluatedControls / framework.totalControls) * 100}%`,
                            minWidth: framework.notEvaluatedControls > 0 ? '4px' : '0'
                          }}
                          title={`${framework.notEvaluatedControls} not evaluated`}
                        />
                      )}
                    </div>
                    <div className="flex gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded"></div>
                        {framework.passingControls}
                      </span>
                      <span className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded"></div>
                        {framework.failingControls}
                      </span>
                      {framework.notEvaluatedControls > 0 && (
                        <span className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-gray-300 rounded"></div>
                          {framework.notEvaluatedControls}
                        </span>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-slate-600">
                    {framework.lastEvaluated ? (
                      <div>
                        <div>{getTimeAgo(framework.lastEvaluated)}</div>
                        {framework.nextAuditDate && (
                          <div className="text-xs text-slate-400 mt-1">
                            Next: {new Date(framework.nextAuditDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400">Never</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={framework.enabled}
                    onCheckedChange={(checked) => onToggle?.(framework.id, checked)}
                  />
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onViewDetails?.(framework)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/workspace/compliance/controls?framework=${framework.id}`}>
                          <ShieldCheck className="h-4 w-4 mr-2" />
                          View Controls
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onGenerateReport?.(framework.id)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Report
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

