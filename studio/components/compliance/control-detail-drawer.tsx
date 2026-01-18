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
import { Control } from "@/lib/data/controls";
import { ControlStatusBadge } from "./control-status-badge";
import { ControlSeverityBadge } from "./control-severity-badge";
import { 
  FileText, 
  Shield, 
  Clock, 
  User, 
  Lightbulb, 
  History,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

interface ControlDetailDrawerProps {
  control: Control | null;
  open: boolean;
  onClose: () => void;
  onReEvaluate?: (controlId: string) => void;
}

export function ControlDetailDrawer({ 
  control, 
  open, 
  onClose, 
  onReEvaluate 
}: ControlDetailDrawerProps) {
  if (!control) return null;

  const getTimeAgo = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-palette-primary" />
            <div className="flex-1">
              <SheetTitle className="text-2xl">{control.controlId}</SheetTitle>
              <SheetDescription className="text-base mt-1">
                {control.name}
              </SheetDescription>
            </div>
            <div className="flex gap-2">
              <ControlStatusBadge status={control.status} />
              <ControlSeverityBadge severity={control.severity} />
            </div>
          </div>
        </SheetHeader>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="evidence">Evidence</TabsTrigger>
            <TabsTrigger value="assets">Assets</TabsTrigger>
            <TabsTrigger value="recommendations">Fix</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Description</h3>
              <p className="text-sm text-slate-600">{control.description}</p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Frameworks</h3>
              <div className="flex flex-wrap gap-2">
                {control.frameworkNames.map((name, idx) => (
                  <Badge key={idx} variant="outline">
                    {name}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Control Type</h3>
                <p className="text-sm text-slate-600 capitalize">{control.controlType}</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Frequency</h3>
                <p className="text-sm text-slate-600 capitalize">{control.frequency}</p>
              </div>
            </div>

            {control.category && (
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Category</h3>
                <p className="text-sm text-slate-600">{control.category}</p>
              </div>
            )}

            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Current Status</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ControlStatusBadge status={control.status} />
                  <span className="text-sm text-slate-600">
                    {control.status === 'pass' && 'All requirements met'}
                    {control.status === 'fail' && control.failureReason}
                    {control.status === 'partial' && 'Partially compliant'}
                    {control.status === 'not_evaluated' && 'Evaluation pending'}
                  </span>
                </div>
                {control.failureReason && (
                  <p className="text-sm text-red-700 bg-red-50 p-3 rounded-lg">
                    {control.failureReason}
                  </p>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Evaluation Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600">Last Evaluated:</span>
                  <span className="text-slate-800">{getTimeAgo(control.lastEvaluated)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600">Evaluated By:</span>
                  <span className="text-slate-800 capitalize">{control.evaluatedBy || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600">Method:</span>
                  <span className="text-slate-800 capitalize">{control.evaluationMethod}</span>
                </div>
              </div>
            </div>

            {control.uptimePercentage !== undefined && (
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Metrics</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Uptime Percentage:</span>
                    <span className="font-semibold text-slate-800">{control.uptimePercentage}%</span>
                  </div>
                  {control.timeOutOfCompliance && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Time Out of Compliance:</span>
                      <span className="font-semibold text-slate-800">
                        {control.timeOutOfCompliance} minutes
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Evidence Tab */}
          <TabsContent value="evidence" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">
                Evidence ({control.evidenceCount})
              </h3>
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <Link href={`/workspace/compliance/evidence?control=${control.id}`}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View All Evidence
                </Link>
              </Button>
            </div>

            {control.evidenceCount > 0 ? (
              <div className="space-y-2">
                {control.evidenceIds.slice(0, 10).map((evidenceId, idx) => (
                  <div
                    key={evidenceId}
                    className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-800">
                          Evidence #{evidenceId}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          Automated
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/workspace/compliance/evidence/${evidenceId}`}>
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
                {control.evidenceIds.length > 10 && (
                  <p className="text-sm text-slate-500 text-center">
                    +{control.evidenceIds.length - 10} more evidence items
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <FileText className="h-12 w-12 mx-auto mb-2 text-slate-300" />
                <p>No evidence linked to this control</p>
              </div>
            )}
          </TabsContent>

          {/* Assets Tab */}
          <TabsContent value="assets" className="space-y-4 mt-4">
            {control.failingAssets && control.failingAssets.length > 0 ? (
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">
                  Failing Assets ({control.failingCount || control.failingAssets.length})
                </h3>
                <div className="space-y-2">
                  {control.failingAssets.map((asset, idx) => (
                    <div
                      key={idx}
                      className="p-3 border border-red-200 bg-red-50 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-red-800">{asset}</span>
                        <Badge variant="outline" className="border-red-300 text-red-700">
                          Non-compliant
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <Shield className="h-12 w-12 mx-auto mb-2 text-slate-300" />
                <p>No failing assets</p>
                {control.status === 'pass' && (
                  <p className="text-sm mt-1">All assets are compliant</p>
                )}
              </div>
            )}
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-4 mt-4">
            {control.fixRecommendations && control.fixRecommendations.length > 0 ? (
              <div>
                <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  Fix Recommendations
                </h3>
                <div className="space-y-3">
                  {control.fixRecommendations.map((recommendation, idx) => (
                    <div
                      key={idx}
                      className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-200 text-yellow-800 flex items-center justify-center text-sm font-semibold">
                          {idx + 1}
                        </span>
                        <p className="text-sm text-slate-800">{recommendation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <Lightbulb className="h-12 w-12 mx-auto mb-2 text-slate-300" />
                <p>No recommendations available</p>
                {control.status === 'pass' && (
                  <p className="text-sm mt-1">Control is compliant</p>
                )}
              </div>
            )}

            {control.relatedControls && control.relatedControls.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h3 className="font-semibold text-slate-800 mb-2">Related Controls</h3>
                <div className="flex flex-wrap gap-2">
                  {control.relatedControls.map((relatedId) => (
                    <Badge key={relatedId} variant="outline" className="cursor-pointer hover:bg-slate-100">
                      {relatedId}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4 mt-4">
            <div className="text-center py-8 text-slate-500">
              <History className="h-12 w-12 mx-auto mb-2 text-slate-300" />
              <p>Evaluation history coming soon</p>
              <p className="text-sm mt-1">Track status changes over time</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onReEvaluate?.(control.id)}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Re-evaluate
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            asChild
          >
            <Link href={`/workspace/compliance/evidence?control=${control.id}`}>
              <FileText className="h-4 w-4 mr-2" />
              View Evidence
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

