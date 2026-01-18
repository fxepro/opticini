"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Settings,
  CheckCircle2,
  XCircle,
  Key,
  Code,
  Globe,
  Server,
  FileText,
  Link2,
  Eye,
  BookOpen,
  Database,
  Shield,
  Activity,
  Brain,
} from "lucide-react";
import { getApiBaseUrl } from "@/lib/api-config";
import { toast } from "sonner";
import axios from "axios";

// Compliance Tools Interface
interface ComplianceTool {
  id: string;
  name: string;
  service: string;
  type: "api" | "library" | "external";
  status: "configured" | "not_configured" | "error";
  description: string;
  apiKeyName?: string;
  endpoint?: string;
  repoUrl?: string;
  evidenceProduced?: string;
  license?: string;
}

// Tool Data Arrays
const OSCAL_FRAMEWORK_TOOLS: ComplianceTool[] = [
  {
    id: "oscal-nist",
    name: "OSCAL (NIST)",
    service: "NIST OSCAL Content Repository",
    type: "api",
    status: "not_configured",
    description: "Canonical control schema for SP 800-53 and other frameworks",
    apiKeyName: "",
    endpoint: "https://github.com/usnistgov/oscal-content",
    repoUrl: "https://github.com/usnistgov/OSCAL",
  },
  {
    id: "oscal-content",
    name: "OSCAL Content",
    service: "GitHub API / Direct Download",
    type: "api",
    status: "not_configured",
    description: "Official NIST control catalogs (SP 800-53 R4, R5) in OSCAL format",
    apiKeyName: "GITHUB_TOKEN",
    endpoint: "https://api.github.com/repos/usnistgov/oscal-content",
    repoUrl: "https://github.com/usnistgov/oscal-content",
  },
  {
    id: "opencontrol",
    name: "OpenControl",
    service: "Compliance-as-Code Framework",
    type: "library",
    status: "not_configured",
    description: "Control → evidence mapping and compliance-as-code patterns",
    repoUrl: "https://github.com/opencontrol/compliance-masonry",
  },
  {
    id: "compliance-masonry",
    name: "Compliance Masonry",
    service: "Control Catalog Builder",
    type: "library",
    status: "not_configured",
    description: "Import SOC2 / ISO mappings and control catalogs",
    repoUrl: "https://github.com/opencontrol/compliance-masonry",
  },
  {
    id: "oscal-cli",
    name: "OSCAL CLI",
    service: "Command Line Tool",
    type: "external",
    status: "not_configured",
    description: "OSCAL catalog validation, conversion, and audit packaging",
    repoUrl: "https://github.com/usnistgov/oscal-cli",
  },
];

const AUTOMATED_EVIDENCE_TOOLS: ComplianceTool[] = [
  {
    id: "sslyze",
    name: "SSLyze",
    service: "TLS/SSL Scanner",
    type: "external",
    status: "not_configured",
    description: "TLS/SSL certificate and cipher suite analysis",
    evidenceProduced: "Certs, ciphers, expiry",
    license: "Apache 2.0",
    repoUrl: "https://github.com/nabla-c0d3/sslyze",
  },
  {
    id: "security-headers",
    name: "SecurityHeaders",
    service: "HTTP Security Headers Scanner",
    type: "external",
    status: "not_configured",
    description: "HTTP security headers analysis (CSP, HSTS, XFO)",
    evidenceProduced: "CSP, HSTS, XFO",
    license: "Apache 2.0",
    repoUrl: "https://github.com/securityheaders/securityheaders",
  },
  {
    id: "owasp-zap",
    name: "OWASP ZAP",
    service: "Dynamic Application Security Testing",
    type: "external",
    status: "not_configured",
    description: "Web application vulnerability scanner",
    evidenceProduced: "Vuln scan reports",
    license: "Apache 2.0",
    repoUrl: "https://github.com/zaproxy/zaproxy",
  },
  {
    id: "schemathesis",
    name: "Schemathesis",
    service: "API Testing Framework",
    type: "library",
    status: "not_configured",
    description: "Property-based API testing and compliance validation",
    evidenceProduced: "API compliance",
    license: "MIT",
    repoUrl: "https://github.com/schemathesis/schemathesis",
  },
  {
    id: "trivy",
    name: "Trivy",
    service: "Container Security Scanner",
    type: "external",
    status: "not_configured",
    description: "Container vulnerability and misconfiguration scanner",
    evidenceProduced: "CVEs, misconfigs",
    license: "Apache 2.0",
    repoUrl: "https://github.com/aquasecurity/trivy",
  },
  {
    id: "gitleaks",
    name: "Gitleaks",
    service: "Secrets Detection",
    type: "external",
    status: "not_configured",
    description: "Detect secrets and credentials in code repositories",
    evidenceProduced: "Secret detection",
    license: "MIT",
    repoUrl: "https://github.com/gitleaks/gitleaks",
  },
  {
    id: "prowler",
    name: "Prowler",
    service: "AWS Security Scanner",
    type: "external",
    status: "not_configured",
    description: "AWS cloud security assessment and compliance checks",
    evidenceProduced: "IAM & cloud evidence",
    license: "Apache 2.0",
    repoUrl: "https://github.com/prowler-cloud/prowler",
  },
  {
    id: "cloud-custodian",
    name: "Cloud Custodian",
    service: "Policy-as-Code Engine",
    type: "library",
    status: "not_configured",
    description: "Cloud resource compliance and policy enforcement",
    evidenceProduced: "Resource compliance",
    license: "Apache 2.0",
    repoUrl: "https://github.com/cloud-custodian/cloud-custodian",
  },
];

const MANUAL_EVIDENCE_TOOLS: ComplianceTool[] = [
  {
    id: "docassemble",
    name: "Docassemble",
    service: "Evidence Intake Workflow",
    type: "library",
    status: "not_configured",
    description: "Automated evidence collection workflows and questionnaires",
    license: "MIT",
    repoUrl: "https://github.com/jhpyle/docassemble",
  },
  {
    id: "libreoffice",
    name: "LibreOffice (headless)",
    service: "Document Conversion",
    type: "external",
    status: "not_configured",
    description: "Headless document conversion for evidence file processing",
    license: "MPL",
    repoUrl: "https://www.libreoffice.org/download/download/",
  },
  {
    id: "minio",
    name: "MinIO",
    service: "Object Storage (S3-compatible)",
    type: "external",
    status: "not_configured",
    description: "S3-compatible object storage for evidence files (external service)",
    license: "AGPL",
    repoUrl: "https://github.com/minio/minio",
  },
];

const POLICY_ENFORCEMENT_TOOLS: ComplianceTool[] = [
  {
    id: "opa",
    name: "Open Policy Agent (OPA)",
    service: "Policy Engine",
    type: "library",
    status: "not_configured",
    description: "Core compliance logic and policy decision engine (MANDATORY)",
    license: "Apache 2.0",
    repoUrl: "https://github.com/open-policy-agent/opa",
  },
  {
    id: "rego",
    name: "Rego",
    service: "Policy Language",
    type: "library",
    status: "not_configured",
    description: "Policy language for control assertions (bundled with OPA)",
    license: "Apache 2.0",
    repoUrl: "https://github.com/open-policy-agent/opa",
  },
  {
    id: "polkit",
    name: "PolicyKit",
    service: "Authorization Framework",
    type: "library",
    status: "not_configured",
    description: "RBAC and authorization reference implementation",
    license: "LGPL",
    repoUrl: "https://github.com/polkit-org/polkit",
  },
];

const AUDIT_MANAGEMENT_TOOLS: ComplianceTool[] = [
  {
    id: "oscal-cli-audit",
    name: "oscal-cli",
    service: "Audit Packaging Tool",
    type: "external",
    status: "not_configured",
    description: "OSCAL-based evidence bundles and audit packaging",
    license: "Apache 2.0",
    repoUrl: "https://github.com/usnistgov/oscal-cli",
  },
  {
    id: "auditree",
    name: "Auditree",
    service: "Audit Workflow Framework",
    type: "library",
    status: "not_configured",
    description: "Automated audit workflow and evidence collection framework (reference)",
    license: "GPL",
    repoUrl: "https://github.com/auditree/auditree-framework",
  },
];

const REPORTING_TOOLS: ComplianceTool[] = [
  {
    id: "weasyprint",
    name: "WeasyPrint",
    service: "HTML to PDF Converter",
    type: "library",
    status: "not_configured",
    description: "Generate compliance reports in PDF format from HTML",
    license: "BSD",
    repoUrl: "https://github.com/Kozea/WeasyPrint",
  },
  {
    id: "reportlab",
    name: "ReportLab",
    service: "PDF Generation Engine",
    type: "library",
    status: "not_configured",
    description: "Custom PDF layouts and report generation",
    license: "BSD",
    repoUrl: "https://www.reportlab.com/dev/install/",
  },
  {
    id: "jinja2",
    name: "Jinja2",
    service: "Template Engine",
    type: "library",
    status: "not_configured",
    description: "Report templating and rendering engine",
    license: "BSD",
    repoUrl: "https://github.com/pallets/jinja",
  },
  {
    id: "pandoc",
    name: "Pandoc",
    service: "Document Converter",
    type: "external",
    status: "not_configured",
    description: "Universal document converter (optional)",
    license: "GPL",
    repoUrl: "https://github.com/jgm/pandoc",
  },
];

const CONTINUOUS_COMPLIANCE_TOOLS: ComplianceTool[] = [
  {
    id: "prometheus",
    name: "Prometheus",
    service: "Metrics & Monitoring",
    type: "external",
    status: "not_configured",
    description: "Evidence freshness monitoring and metrics collection",
    evidenceProduced: "Evidence freshness",
    license: "Apache 2.0",
    repoUrl: "https://github.com/prometheus/prometheus",
  },
  {
    id: "falco",
    name: "Falco",
    service: "Runtime Security",
    type: "external",
    status: "not_configured",
    description: "Runtime security monitoring and event detection",
    evidenceProduced: "Runtime events",
    license: "Apache 2.0",
    repoUrl: "https://github.com/falcosecurity/falco",
  },
  {
    id: "elastic-ecs",
    name: "Elastic ECS",
    service: "Event Schema",
    type: "library",
    status: "not_configured",
    description: "Event normalization and schema for compliance events",
    evidenceProduced: "Normalization",
    license: "Apache 2.0",
    repoUrl: "https://github.com/elastic/ecs",
  },
  {
    id: "celery",
    name: "Celery",
    service: "Background Job Engine",
    type: "library",
    status: "not_configured",
    description: "Asynchronous task processing for compliance re-evaluations",
    evidenceProduced: "Re-evaluations",
    license: "BSD",
    repoUrl: "https://github.com/celery/celery",
  },
];

const AI_PRIVACY_TOOLS: ComplianceTool[] = [
  {
    id: "presidio",
    name: "Presidio",
    service: "PII Detection",
    type: "library",
    status: "not_configured",
    description: "Privacy-preserving PII detection for GDPR and AI compliance",
    license: "Apache 2.0",
    repoUrl: "https://github.com/microsoft/presidio",
  },
  {
    id: "openlineage",
    name: "OpenLineage",
    service: "Data Lineage Tracking",
    type: "library",
    status: "not_configured",
    description: "AI traceability and data lineage for compliance",
    license: "Apache 2.0",
    repoUrl: "https://github.com/OpenLineage/OpenLineage",
  },
  {
    id: "marquez",
    name: "Marquez",
    service: "Lineage Backend",
    type: "external",
    status: "not_configured",
    description: "Data lineage backend for OpenLineage (optional)",
    license: "Apache 2.0",
    repoUrl: "https://github.com/MarquezProject/marquez",
  },
  {
    id: "great-expectations",
    name: "Great Expectations",
    service: "Data Quality Framework",
    type: "library",
    status: "not_configured",
    description: "Data quality validation for AI input compliance",
    license: "Apache 2.0",
    repoUrl: "https://github.com/great-expectations/great_expectations",
  },
];

export default function ComplianceToolsPage() {
  const [subTab, setSubTab] = useState("frameworks");
  const [toolApiKeys, setToolApiKeys] = useState<Record<string, string>>({});
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<ComplianceTool | null>(null);
  const [apiKeyValue, setApiKeyValue] = useState("");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewingTool, setViewingTool] = useState<ComplianceTool | null>(null);

  // Helper function to get icon for compliance tools
  const getToolIcon = (tool: ComplianceTool) => {
    const name = tool.name.toLowerCase();
    if (name.includes('oscal')) return Database;
    if (name.includes('opencontrol') || name.includes('masonry')) return BookOpen;
    if (name.includes('zap') || name.includes('prowler') || name.includes('trivy')) return Shield;
    if (name.includes('sslyze') || name.includes('security headers')) return Shield;
    if (name.includes('schemathesis') || name.includes('gitleaks')) return Code;
    if (name.includes('cloud custodian')) return Server;
    if (name.includes('docassemble') || name.includes('libreoffice')) return FileText;
    if (name.includes('minio')) return Database;
    if (name.includes('opa') || name.includes('rego') || name.includes('polkit')) return Shield;
    if (name.includes('weasyprint') || name.includes('reportlab') || name.includes('jinja') || name.includes('pandoc')) return FileText;
    if (name.includes('prometheus') || name.includes('falco') || name.includes('celery')) return Activity;
    if (name.includes('presidio') || name.includes('lineage') || name.includes('expectations')) return Brain;
    return Settings;
  };

  // Helper function to render tool table
  const renderToolTable = (tools: ComplianceTool[], emptyMessage: string) => {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tool</TableHead>
            <TableHead>Service/Implementation</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>API Key</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tools.map((tool) => {
            const Icon = getToolIcon(tool);
            
            const getTypeBadge = () => {
              if (tool.type === 'api') {
                return (
                  <Badge variant="outline" className="border-blue-500 text-blue-700">
                    <Globe className="h-3 w-3 mr-1" />
                    API Service
                  </Badge>
                );
              } else if (tool.type === 'library') {
                return (
                  <Badge variant="outline" className="border-purple-500 text-purple-700">
                    <Code className="h-3 w-3 mr-1" />
                    Library
                  </Badge>
                );
              } else {
                return (
                  <Badge variant="outline" className="border-green-500 text-green-700">
                    <Server className="h-3 w-3 mr-1" />
                    External Tool
                  </Badge>
                );
              }
            };

            const getStatusBadge = () => {
              if (tool.status === 'configured') {
                return (
                  <Badge variant="outline" className="border-green-500 text-green-700">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Configured
                  </Badge>
                );
              } else if (tool.status === 'error') {
                return (
                  <Badge variant="outline" className="border-red-500 text-red-700">
                    <XCircle className="h-3 w-3 mr-1" />
                    Error
                  </Badge>
                );
              } else {
                return (
                  <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                    <XCircle className="h-3 w-3 mr-1" />
                    Not Configured
                  </Badge>
                );
              }
            };

            const hasApiKey = tool.type === 'api' && tool.apiKeyName;
            const currentApiKey = toolApiKeys[tool.id] || '';

            return (
              <TableRow key={tool.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-palette-primary" />
                    <div>
                      <div className="font-medium text-slate-800">
                        {tool.name}
                      </div>
                      <div className="text-sm text-slate-500">
                        {tool.description}
                      </div>
                      {tool.evidenceProduced && (
                        <div className="text-xs text-slate-400 mt-1">
                          Evidence: {tool.evidenceProduced}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-slate-700">
                  {tool.service}
                  {tool.endpoint && (
                    <div className="text-xs text-slate-400 mt-1">
                      {tool.endpoint}
                    </div>
                  )}
                  {tool.license && (
                    <div className="text-xs text-slate-400 mt-1">
                      License: {tool.license}
                    </div>
                  )}
                </TableCell>
                <TableCell>{getTypeBadge()}</TableCell>
                <TableCell>{getStatusBadge()}</TableCell>
                <TableCell>
                  {hasApiKey ? (
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-slate-100 px-2 py-1 rounded">
                        {currentApiKey ? `${String(currentApiKey).substring(0, 8)}...` : 'Not Set'}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingTool(tool);
                          setApiKeyValue(currentApiKey);
                          setApiKeyModalOpen(true);
                        }}
                      >
                        <Key className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <span className="text-slate-400 text-sm">N/A</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {tool.repoUrl && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(tool.repoUrl, '_blank')}
                      >
                        <Link2 className="h-3 w-3 mr-1" />
                        Repo
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setViewingTool(tool);
                        setViewModalOpen(true);
                      }}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  };

  const handleSaveApiKey = async () => {
    if (!editingTool) return;

    try {
      const apiBase = getApiBaseUrl();
      const token = localStorage.getItem("access_token");
      
      // TODO: Replace with actual API endpoint when backend is ready
      // const response = await axios.patch(
      //   `${apiBase}/api/compliance/tools/${editingTool.id}/`,
      //   { api_key: apiKeyValue },
      //   { headers: { Authorization: `Bearer ${token}` } }
      // );
      
      setToolApiKeys(prev => ({ ...prev, [editingTool.id]: apiKeyValue }));
      toast.success(`${editingTool.name} API key saved successfully`);
      setApiKeyModalOpen(false);
      setEditingTool(null);
      setApiKeyValue("");
    } catch (error: any) {
      console.error("Error saving API key:", error);
      toast.error(error.message || "Failed to save API key");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-h4-dynamic font-semibold text-palette-primary">Compliance Tools</h1>
        <p className="text-palette-secondary/80 mt-2 font-medium">
          Configure and manage compliance tools for frameworks, evidence collection, policy enforcement, and reporting
        </p>
      </div>

      {/* Category Tabs with Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Compliance Tools</CardTitle>
          <CardDescription>Configure and manage tools organized by compliance category</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={subTab} onValueChange={setSubTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="frameworks">Frameworks ({OSCAL_FRAMEWORK_TOOLS.length})</TabsTrigger>
              <TabsTrigger value="automated-evidence">Automated Evidence ({AUTOMATED_EVIDENCE_TOOLS.length})</TabsTrigger>
              <TabsTrigger value="manual-evidence">Manual Evidence ({MANUAL_EVIDENCE_TOOLS.length})</TabsTrigger>
              <TabsTrigger value="policy-enforcement">Policy Enforcement ({POLICY_ENFORCEMENT_TOOLS.length})</TabsTrigger>
              <TabsTrigger value="audit-management">Audit Management ({AUDIT_MANAGEMENT_TOOLS.length})</TabsTrigger>
              <TabsTrigger value="reporting">Reporting ({REPORTING_TOOLS.length})</TabsTrigger>
              <TabsTrigger value="continuous-compliance">Continuous Compliance ({CONTINUOUS_COMPLIANCE_TOOLS.length})</TabsTrigger>
              <TabsTrigger value="ai-privacy">AI & Privacy ({AI_PRIVACY_TOOLS.length})</TabsTrigger>
            </TabsList>

            {/* Frameworks Sub-tab */}
            <TabsContent value="frameworks" className="space-y-4">
              {renderToolTable(OSCAL_FRAMEWORK_TOOLS, "No framework tools configured")}
              {OSCAL_FRAMEWORK_TOOLS.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No framework tools configured
                </div>
              )}
            </TabsContent>

            {/* Automated Evidence Sub-tab */}
            <TabsContent value="automated-evidence" className="space-y-4">
              {renderToolTable(AUTOMATED_EVIDENCE_TOOLS, "No automated evidence tools configured")}
              {AUTOMATED_EVIDENCE_TOOLS.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No automated evidence tools configured
                </div>
              )}
            </TabsContent>

            {/* Manual Evidence Sub-tab */}
            <TabsContent value="manual-evidence" className="space-y-4">
              {renderToolTable(MANUAL_EVIDENCE_TOOLS, "No manual evidence tools configured")}
              {MANUAL_EVIDENCE_TOOLS.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No manual evidence tools configured
                </div>
              )}
            </TabsContent>

            {/* Policy Enforcement Sub-tab */}
            <TabsContent value="policy-enforcement" className="space-y-4">
              {renderToolTable(POLICY_ENFORCEMENT_TOOLS, "No policy enforcement tools configured")}
              {POLICY_ENFORCEMENT_TOOLS.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No policy enforcement tools configured
                </div>
              )}
            </TabsContent>

            {/* Audit Management Sub-tab */}
            <TabsContent value="audit-management" className="space-y-4">
              {renderToolTable(AUDIT_MANAGEMENT_TOOLS, "No audit management tools configured")}
              {AUDIT_MANAGEMENT_TOOLS.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No audit management tools configured
                </div>
              )}
            </TabsContent>

            {/* Reporting Sub-tab */}
            <TabsContent value="reporting" className="space-y-4">
              {renderToolTable(REPORTING_TOOLS, "No reporting tools configured")}
              {REPORTING_TOOLS.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No reporting tools configured
                </div>
              )}
            </TabsContent>

            {/* Continuous Compliance Sub-tab */}
            <TabsContent value="continuous-compliance" className="space-y-4">
              {renderToolTable(CONTINUOUS_COMPLIANCE_TOOLS, "No continuous compliance tools configured")}
              {CONTINUOUS_COMPLIANCE_TOOLS.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No continuous compliance tools configured
                </div>
              )}
            </TabsContent>

            {/* AI & Privacy Sub-tab */}
            <TabsContent value="ai-privacy" className="space-y-4">
              {renderToolTable(AI_PRIVACY_TOOLS, "No AI & privacy tools configured")}
              {AI_PRIVACY_TOOLS.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No AI & privacy tools configured
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* API Key Modal */}
      <Dialog open={apiKeyModalOpen} onOpenChange={setApiKeyModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure API Key</DialogTitle>
            <DialogDescription>
              {editingTool && `Enter the API key for ${editingTool.name}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">API Key</label>
              <input
                type="password"
                value={apiKeyValue}
                onChange={(e) => setApiKeyValue(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter API key"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApiKeyModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveApiKey} className="bg-palette-primary hover:bg-palette-primary-hover text-white">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Tool Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{viewingTool?.name}</DialogTitle>
            <DialogDescription>{viewingTool?.description}</DialogDescription>
          </DialogHeader>
          {viewingTool && (
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Service</label>
                <p className="text-sm text-slate-800">{viewingTool.service}</p>
              </div>
              {viewingTool.endpoint && (
                <div>
                  <label className="text-sm font-medium text-slate-600">Endpoint</label>
                  <p className="text-sm text-slate-800 break-all">{viewingTool.endpoint}</p>
                </div>
              )}
              {viewingTool.license && (
                <div>
                  <label className="text-sm font-medium text-slate-600">License</label>
                  <p className="text-sm text-slate-800">{viewingTool.license}</p>
                </div>
              )}
              {viewingTool.evidenceProduced && (
                <div>
                  <label className="text-sm font-medium text-slate-600">Evidence Produced</label>
                  <p className="text-sm text-slate-800">{viewingTool.evidenceProduced}</p>
                </div>
              )}
              {viewingTool.repoUrl && (
                <div>
                  <label className="text-sm font-medium text-slate-600">Repository</label>
                  <a
                    href={viewingTool.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline break-all"
                  >
                    {viewingTool.repoUrl}
                  </a>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

