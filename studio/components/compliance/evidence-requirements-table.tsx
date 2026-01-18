"use client";

import { useState, useMemo } from "react";
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
import { CheckCircle2, XCircle, Clock, AlertCircle, ChevronDown, ChevronRight } from "lucide-react";

export interface EvidenceRequirement {
  id: string;
  requirementKey?: string;
  controlDbId?: string;
  controlId: string;
  controlName: string;
  frameworkId: string;
  frameworkName: string;
  evidenceType: string;
  evidenceTypeDisplay: string;
  evidenceCategory: string;
  evidenceCategoryDisplay: string;
  collectionMethod: string;
  collectionMethodDisplay: string;
  sourceApp: string;
  freshnessDays: number;
  required: boolean;
  description: string;
  status?: 'collected' | 'missing' | 'expired' | 'expiring_soon';
  collectedEvidenceId?: string;
  collectedAt?: string;
  expiresAt?: string;
}

interface EvidenceRequirementsTableProps {
  requirements: EvidenceRequirement[];
  loading?: boolean;
}

interface GroupedControl {
  controlId: string;
  controlName: string;
  frameworkName: string;
  frameworkId: string;
  requirements: EvidenceRequirement[];
}

export function EvidenceRequirementsTable({ requirements, loading }: EvidenceRequirementsTableProps) {
  const [expandedControls, setExpandedControls] = useState<Set<string>>(new Set());

  // Group requirements by control_id
  const groupedControls = useMemo(() => {
    const groups = new Map<string, GroupedControl>();
    
    requirements.forEach((req) => {
      const key = req.controlId;
      if (!groups.has(key)) {
        groups.set(key, {
          controlId: req.controlId,
          controlName: req.controlName,
          frameworkName: req.frameworkName,
          frameworkId: req.frameworkId,
          requirements: [],
        });
      }
      groups.get(key)!.requirements.push(req);
    });
    
    return Array.from(groups.values());
  }, [requirements]);

  const toggleExpand = (controlId: string) => {
    setExpandedControls((prev) => {
      const next = new Set(prev);
      if (next.has(controlId)) {
        next.delete(controlId);
      } else {
        next.add(controlId);
      }
      return next;
    });
  };

  if (loading) {
    return (
      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm p-8 text-center">
        <p className="text-palette-secondary">Loading requirements...</p>
      </div>
    );
  }

  if (requirements.length === 0) {
    return (
      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm p-8 text-center">
        <p className="text-palette-secondary">No evidence requirements found.</p>
      </div>
    );
  }

  const getStatusBadge = (req: EvidenceRequirement) => {
    if (req.status === 'collected') {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Collected
        </Badge>
      );
    }
    if (req.status === 'expired') {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <XCircle className="h-3 w-3 mr-1" />
          Expired
        </Badge>
      );
    }
    if (req.status === 'expiring_soon') {
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <Clock className="h-3 w-3 mr-1" />
          Expiring Soon
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
        <AlertCircle className="h-3 w-3 mr-1" />
        Missing
      </Badge>
    );
  };

  const getEvidenceCategoryBadge = (category: string, display?: string) => {
    const colors: Record<string, string> = {
      'security_scan': 'bg-red-50 text-red-700 border-red-200',
      'tls_config': 'bg-purple-50 text-purple-700 border-purple-200',
      'cloud_config': 'bg-indigo-50 text-indigo-700 border-indigo-200',
      'access_log': 'bg-blue-50 text-blue-700 border-blue-200',
      'system_log': 'bg-gray-50 text-gray-700 border-gray-200',
      'document': 'bg-blue-50 text-blue-700 border-blue-200',
      'attestation': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'screenshot': 'bg-green-50 text-green-700 border-green-200',
    };
    const displayText = display || category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return (
      <Badge variant="outline" className={colors[category] || 'bg-slate-50 text-slate-700 border-slate-200'}>
        {displayText}
      </Badge>
    );
  };

  const getCollectionMethodBadge = (method: string, display?: string) => {
    const isAutomated = method.startsWith('automated');
    const displayText = display || method.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return (
      <Badge 
        variant="outline" 
        className={isAutomated 
          ? 'bg-green-50 text-green-700 border-green-200' 
          : 'bg-blue-50 text-blue-700 border-blue-200'
        }
      >
        {displayText}
      </Badge>
    );
  };

  // Calculate summary stats for a control
  const getControlSummary = (requirements: EvidenceRequirement[]) => {
    const total = requirements.length;
    const collected = requirements.filter(r => r.status === 'collected').length;
    const missing = requirements.filter(r => r.status === 'missing').length;
    const expired = requirements.filter(r => r.status === 'expired').length;
    const expiringSoon = requirements.filter(r => r.status === 'expiring_soon').length;
    
    return { total, collected, missing, expired, expiringSoon };
  };

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead className="w-32">Control ID</TableHead>
            <TableHead>Control Name</TableHead>
            <TableHead className="w-32">Framework</TableHead>
            <TableHead className="w-40">Evidence Requirements</TableHead>
            <TableHead className="w-32">Summary</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groupedControls.map((group) => {
            const isExpanded = expandedControls.has(group.controlId);
            const summary = getControlSummary(group.requirements);
            const hasIssues = summary.missing > 0 || summary.expired > 0 || summary.expiringSoon > 0;
            
            return (
              <>
                {/* Control Row */}
                <TableRow 
                  key={group.controlId}
                  className={`cursor-pointer hover:bg-slate-50 ${hasIssues ? 'bg-yellow-50/30' : ''}`}
                  onClick={() => toggleExpand(group.controlId)}
                >
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(group.controlId);
                      }}
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {group.controlId}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium text-palette-primary">
                      {group.controlName}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="text-sm text-palette-primary font-semibold">
                      {group.frameworkName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
                      {summary.total} requirement{summary.total !== 1 ? 's' : ''}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {summary.collected > 0 && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                          {summary.collected} collected
                        </Badge>
                      )}
                      {summary.missing > 0 && (
                        <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 text-xs">
                          {summary.missing} missing
                        </Badge>
                      )}
                      {summary.expired > 0 && (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
                          {summary.expired} expired
                        </Badge>
                      )}
                      {summary.expiringSoon > 0 && (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
                          {summary.expiringSoon} expiring
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
                
                {/* Expanded Requirements Rows */}
                {isExpanded && (
                  <>
                    {/* Header for requirements */}
                    <TableRow className="bg-slate-50/50">
                      <TableCell colSpan={6}>
                        <div className="px-4 py-2 text-xs font-semibold text-slate-600 uppercase tracking-wide border-b border-slate-200">
                          Evidence Requirements ({group.requirements.length})
                        </div>
                      </TableCell>
                    </TableRow>
                    {group.requirements.map((req) => (
                      <TableRow key={req.id} className="bg-slate-50/30 hover:bg-slate-50/50">
                        <TableCell></TableCell>
                        <TableCell colSpan={5} className="pl-8">
                          <div className="flex items-center gap-4 py-2 text-sm">
                            <div className="flex-1 min-w-[200px] text-slate-600">
                              {req.description || 'No description'}
                            </div>
                            <div className="w-32">
                              {getEvidenceCategoryBadge(req.evidenceCategory || req.evidenceType, req.evidenceCategoryDisplay)}
                            </div>
                            <div className="w-36">
                              {getCollectionMethodBadge(req.collectionMethod || 'manual_upload', req.collectionMethodDisplay)}
                            </div>
                            <div className="w-32 text-slate-600">
                              {req.sourceApp || 'N/A'}
                            </div>
                            <div className="w-24 text-slate-600">
                              {req.freshnessDays} days
                            </div>
                            <div className="w-24">
                              {req.required ? (
                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
                                  Required
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 text-xs">
                                  Optional
                                </Badge>
                              )}
                            </div>
                            <div className="w-32">
                              {getStatusBadge(req)}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                )}
              </>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

