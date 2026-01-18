"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, FileText, RefreshCw, Eye } from "lucide-react";
import { Control } from "@/lib/data/controls";
import { ControlStatusBadge } from "./control-status-badge";
import { ControlSeverityBadge } from "./control-severity-badge";
import { cn } from "@/lib/utils";

interface ControlCardProps {
  control: Control;
  onViewDetails?: (control: Control) => void;
  onReEvaluate?: (controlId: string) => void;
}

export function ControlCard({ control, onViewDetails, onReEvaluate }: ControlCardProps) {
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
    return `${diffDays}d ago`;
  };

  return (
    <Card className={cn(
      "relative border-2 transition-all duration-200 hover:shadow-lg",
      control.status === 'pass' && "border-green-200 hover:border-green-300",
      control.status === 'fail' && "border-red-200 hover:border-red-300",
      control.status === 'partial' && "border-yellow-200 hover:border-yellow-300",
      control.status === 'not_evaluated' && "border-gray-200 hover:border-gray-300",
    )}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-5 w-5 text-palette-primary" />
              <h3 className="font-semibold text-lg text-slate-800">{control.controlId}</h3>
              <ControlStatusBadge status={control.status} />
            </div>
            <h4 className="font-medium text-slate-700 mb-2">{control.name}</h4>
            <div className="flex flex-wrap gap-2 mb-2">
              {control.frameworkNames.map((name, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {name}
                </Badge>
              ))}
            </div>
          </div>
          <ControlSeverityBadge severity={control.severity} />
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 mb-4 line-clamp-2">{control.description}</p>

        {/* Status Details */}
        {control.status === 'fail' && control.failureReason && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm font-medium text-red-800 mb-1">Failure Reason:</p>
            <p className="text-sm text-red-700">{control.failureReason}</p>
            {control.failingCount && (
              <p className="text-xs text-red-600 mt-1">
                {control.failingCount} asset{control.failingCount !== 1 ? 's' : ''} affected
              </p>
            )}
          </div>
        )}

        {control.status === 'partial' && control.failureReason && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm font-medium text-yellow-800 mb-1">Partial Compliance:</p>
            <p className="text-sm text-yellow-700">{control.failureReason}</p>
          </div>
        )}

        {/* Evidence & Metrics */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Evidence</span>
            <span className="font-semibold text-slate-800">
              {control.evidenceCount} {control.evidenceCount === 1 ? 'item' : 'items'}
            </span>
          </div>
          {control.uptimePercentage !== undefined && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Uptime</span>
              <span className="font-semibold text-slate-800">{control.uptimePercentage}%</span>
            </div>
          )}
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Last Evaluated</span>
            <span className="text-slate-700">{getTimeAgo(control.lastEvaluated)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 border-palette-primary text-palette-primary hover:bg-palette-accent-3"
            size="sm"
            onClick={() => onViewDetails?.(control)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          {control.evidenceCount > 0 && (
            <Button
              variant="outline"
              className="flex-1 border-palette-primary text-palette-primary hover:bg-palette-accent-3"
              size="sm"
            >
              <FileText className="h-4 w-4 mr-2" />
              Evidence ({control.evidenceCount})
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onReEvaluate?.(control.id)}
            title="Re-evaluate control"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

