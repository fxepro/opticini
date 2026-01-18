"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { ShieldCheck, FileText, ArrowRight, Shield, Lock, Globe, Building2 } from "lucide-react";
import Link from "next/link";
import { Framework } from "@/lib/data/frameworks";
import { cn } from "@/lib/utils";

interface FrameworkCardProps {
  framework: Framework;
  onToggle?: (id: string, enabled: boolean) => void;
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

export function FrameworkCard({ framework, onToggle, onGenerateReport }: FrameworkCardProps) {
  const CategoryIcon = categoryIcons[framework.category];
  const statusColor = getStatusColor(framework.status);
  const scoreColor = getScoreColor(framework.complianceScore);

  return (
    <Card className={cn(
      "relative border-2 transition-all duration-200 hover:shadow-lg",
      framework.enabled 
        ? "border-palette-primary/30 hover:border-palette-primary/60" 
        : "border-gray-200 hover:border-gray-300"
    )}>
      <CardContent className="p-6">
        {/* Header with Logo, Status, and Toggle */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-3 rounded-lg",
              framework.category === 'security' && "bg-blue-100",
              framework.category === 'privacy' && "bg-purple-100",
              framework.category === 'industry' && "bg-orange-100",
              framework.category === 'regional' && "bg-green-100",
            )}>
              <CategoryIcon className={cn(
                "h-6 w-6",
                framework.category === 'security' && "text-blue-600",
                framework.category === 'privacy' && "text-purple-600",
                framework.category === 'industry' && "text-orange-600",
                framework.category === 'regional' && "text-green-600",
              )} />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-800">{framework.name}</h3>
              <p className="text-xs text-slate-500">{framework.code}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={cn("text-xs", statusColor)}>
              {getStatusLabel(framework.status)}
            </Badge>
            <Switch
              checked={framework.enabled}
              onCheckedChange={(checked) => onToggle?.(framework.id, checked)}
            />
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 mb-4 line-clamp-2">{framework.description}</p>

        {/* Compliance Score */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Compliance Score</span>
            <span className={cn("text-2xl font-bold", scoreColor)}>
              {framework.complianceScore}%
            </span>
          </div>
          <Progress 
            value={framework.complianceScore} 
            className="h-2"
          />
        </div>

        {/* Controls Status */}
        <div className="mb-4 p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Controls</span>
            <span className="font-semibold text-slate-800">
              {framework.passingControls} / {framework.totalControls} passing
            </span>
          </div>
          <div className="flex gap-1 mt-2">
            <div 
              className="h-2 flex-1 bg-green-500 rounded"
              style={{ width: `${(framework.passingControls / framework.totalControls) * 100}%` }}
            />
            <div 
              className="h-2 flex-1 bg-red-500 rounded"
              style={{ width: `${(framework.failingControls / framework.totalControls) * 100}%` }}
            />
            <div 
              className="h-2 flex-1 bg-gray-300 rounded"
              style={{ width: `${(framework.notEvaluatedControls / framework.totalControls) * 100}%` }}
            />
          </div>
          <div className="flex gap-4 mt-2 text-xs text-slate-600">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded"></div>
              {framework.passingControls} passing
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded"></div>
              {framework.failingControls} failing
            </span>
            {framework.notEvaluatedControls > 0 && (
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-300 rounded"></div>
                {framework.notEvaluatedControls} not evaluated
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            asChild
            className="flex-1 bg-palette-primary hover:bg-palette-primary-hover text-white"
            size="sm"
          >
            <Link href={`/workspace/compliance/controls?framework=${framework.id}`}>
              <ShieldCheck className="h-4 w-4 mr-2" />
              View Controls
            </Link>
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-palette-primary text-palette-primary hover:bg-palette-accent-3"
            size="sm"
            onClick={() => onGenerateReport?.(framework.id)}
          >
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>

        {/* Metadata */}
        {framework.lastEvaluated && (
          <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-500">
            Last evaluated: {new Date(framework.lastEvaluated).toLocaleDateString()}
            {framework.nextAuditDate && (
              <> • Next audit: {new Date(framework.nextAuditDate).toLocaleDateString()}</>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

