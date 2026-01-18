"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Upload, Download, Package, Table2, Grid3x3, Search, ClipboardList } from "lucide-react";
import { Evidence, EvidenceSource, EvidenceStatus } from "@/lib/data/evidence";
import { EvidenceTable } from "@/components/compliance/evidence-table";
import { EvidenceCard } from "@/components/compliance/evidence-card";
import { EvidenceDetailDrawer } from "@/components/compliance/evidence-detail-drawer";
import { EvidenceRequirementsTable, EvidenceRequirement } from "@/components/compliance/evidence-requirements-table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? (typeof window !== 'undefined' ? '' : 'http://localhost:8000');

export default function ComplianceEvidencePage() {
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<EvidenceSource | "all">("all");
  const [statusFilter, setStatusFilter] = useState<EvidenceStatus | "all">("all");
  const [frameworkFilter, setFrameworkFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [frameworks, setFrameworks] = useState<Array<{id: string, name: string}>>([]);
  const [activeTab, setActiveTab] = useState<"requirements" | "collected">("requirements");
  const [evidenceRequirements, setEvidenceRequirements] = useState<EvidenceRequirement[]>([]);
  const [requirementsEvidence, setRequirementsEvidence] = useState<Evidence[]>([]);
  const [requirementsLoading, setRequirementsLoading] = useState(true);
  const [evidenceTypeFilter, setEvidenceTypeFilter] = useState<string>("all");
  const [sourceFilterReq, setSourceFilterReq] = useState<string>("all");
  const [requiredFilter, setRequiredFilter] = useState<string>("all");
  const [statusFilterReq, setStatusFilterReq] = useState<string>("all");
  const [freshnessFilter, setFreshnessFilter] = useState<string>("all");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadRequirementKey, setUploadRequirementKey] = useState<string>("");
  const [uploadName, setUploadName] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadTags, setUploadTags] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  // Helper function to refresh token
  const refreshAccessToken = async (): Promise<string | null> => {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      return null;
    }
    
    try {
      const baseUrl = API_BASE?.replace(/\/$/, '') || '';
      const res = await axios.post(`${baseUrl}/api/token/refresh/`, {
        refresh: refreshToken,
      });
      const newAccessToken = res.data.access;
      localStorage.setItem("access_token", newAccessToken);
      if (res.data.refresh) {
        localStorage.setItem("refresh_token", res.data.refresh);
      }
      return newAccessToken;
    } catch (err) {
      console.error("Token refresh failed:", err);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      return null;
    }
  };

  // Helper function to make authenticated request with retry
  const makeAuthenticatedRequest = async (url: string, currentToken: string) => {
    try {
      return await axios.get(url, {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
    } catch (err: any) {
      if (err.response?.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          return await axios.get(url, {
            headers: { Authorization: `Bearer ${newToken}` },
          });
        }
        throw err;
      }
      throw err;
    }
  };

  const mapEvidenceResponse = (data: any[]): Evidence[] => {
    return data.map((e: any) => ({
      id: e.id,
      evidenceId: e.evidence_id || '',
      name: e.name || '',
      description: e.description,
      source: (e.source || 'automated') as EvidenceSource,
      sourceType: (e.source_type || 'manual_upload') as any,
      sourceName: e.source_name || '',
      controlIds: e.controls?.map((c: any) => c.id).filter((id: string) => id) || [],
      controlNames: e.controls?.map((c: any) => c.name || c).filter((name: string) => name) || [],
      frameworkIds: e.controls?.map((c: any) => c.framework_id).filter((id: string) => id) || [],
      frameworkNames: e.controls?.map((c: any) => c.framework_name).filter((name: string) => name) || [],
      status: (e.status || 'fresh') as EvidenceStatus,
      validityPeriod: e.validity_period,
      expiresAt: e.expires_at,
      createdAt: e.created_at || new Date().toISOString(),
      createdBy: e.created_by_username,
      uploadedBy: e.uploaded_by_username,
      fileType: e.file_type,
      fileSize: e.file_size,
      fileUrl: e.file_url,
      previewUrl: e.preview_url,
      content: e.content,
      tags: e.tags || [],
      category: e.category,
      auditLocked: e.audit_locked || false,
      auditId: e.audit_id,
    }));
  };

  // Fetch frameworks for filter dropdown
  useEffect(() => {
    const fetchFrameworks = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        const baseUrl = API_BASE?.replace(/\/$/, '') || '';
        const url = `${baseUrl}/api/compliance/frameworks/`;
        
        const response = await makeAuthenticatedRequest(url, token);
        
        if (Array.isArray(response.data)) {
          setFrameworks(response.data.map((f: any) => ({
            id: f.id,
            name: f.name || '',
          })));
        }
      } catch (err) {
        console.error("Error fetching frameworks:", err);
      }
    };

    fetchFrameworks();
  }, []);

  // Fetch evidence requirements
  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        setRequirementsLoading(true);
        const token = localStorage.getItem("access_token");
        if (!token) {
          setRequirementsLoading(false);
          return;
        }

        const baseUrl = API_BASE?.replace(/\/$/, '') || '';
        let evidenceUrl = `${baseUrl}/api/compliance/evidence/`;
        const evidenceParams = new URLSearchParams();
        if (frameworkFilter !== "all") {
          evidenceParams.append('framework_id', frameworkFilter);
        }
        if (evidenceParams.toString()) {
          evidenceUrl += `?${evidenceParams.toString()}`;
        }
        const evidenceResponse = await makeAuthenticatedRequest(evidenceUrl, token);
        const mappedEvidence = Array.isArray(evidenceResponse.data)
          ? mapEvidenceResponse(evidenceResponse.data)
          : [];
        setRequirementsEvidence(mappedEvidence);
        let url = `${baseUrl}/api/compliance/controls/`;
        
        // Add framework filter if selected
        const params = new URLSearchParams();
        if (frameworkFilter !== "all") {
          params.append('framework_id', frameworkFilter);
        }
        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const response = await makeAuthenticatedRequest(url, token);
        
        if (!Array.isArray(response.data)) {
          setRequirementsLoading(false);
          return;
        }

        // Extract evidence requirements from controls
        // Use a Map to deduplicate by (control_id, evidence_type, source_app)
        const requirementsMap = new Map<string, EvidenceRequirement>();
        
        response.data.forEach((control: any) => {
          if (control.evidence_requirements && Array.isArray(control.evidence_requirements)) {
            // Get all frameworks for this control
            const frameworks = control.frameworks || [];
            const frameworkNames: string[] = frameworks.map((f: any) => 
              typeof f === 'string' ? f : f.name || ''
            ).filter((name: string) => name);
            const primaryFramework = frameworks.length > 0 
              ? (typeof frameworks[0] === 'string' ? { id: '', name: frameworks[0] } : frameworks[0])
              : { id: '', name: '' };
            
            control.evidence_requirements.forEach((req: any) => {
              // Create unique key: control_id + evidence_type + source_app
              const uniqueKey = `${control.control_id}::${req.evidence_type}::${req.source_app || ''}`;
              
              // Check if evidence exists for this requirement
              const matchingEvidence = mappedEvidence.find((ev) => {
                return ev.controlIds.includes(control.id) && 
                       ev.sourceType === req.evidence_type;
              });

              let status: 'collected' | 'missing' | 'expired' | 'expiring_soon' = 'missing';
              if (matchingEvidence) {
                if (matchingEvidence.status === 'expired') {
                  status = 'expired';
                } else if (matchingEvidence.status === 'expiring_soon') {
                  status = 'expiring_soon';
                } else {
                  status = 'collected';
                }
              }

              // If this requirement already exists, update framework names if needed
              if (requirementsMap.has(uniqueKey)) {
                const existing = requirementsMap.get(uniqueKey)!;
                // Merge framework names (show all frameworks this control is in)
                const allFrameworkNames = [...new Set([...frameworkNames, existing.frameworkName.split(', ').filter(n => n)].flat())];
                existing.frameworkName = allFrameworkNames.join(', ');
              } else {
                // Create new requirement entry
                requirementsMap.set(uniqueKey, {
                  id: req.id,
                  requirementKey: uniqueKey,
                  controlDbId: control.id,
                  controlId: control.control_id || '',
                  controlName: control.name || '',
                  frameworkId: primaryFramework.id || '',
                  frameworkName: frameworkNames.join(', ') || primaryFramework.name || '',
                  evidenceType: req.evidence_type || '',
                  evidenceTypeDisplay: req.evidence_type_display || req.evidence_type || '',
                  evidenceCategory: req.evidence_category || req.evidence_type || '',
                  evidenceCategoryDisplay: req.evidence_category_display || req.evidence_type_display || req.evidence_type || '',
                  collectionMethod: req.collection_method || 'manual_upload',
                  collectionMethodDisplay: req.collection_method_display || 'Manual Upload',
                  sourceApp: req.source_app || '',
                  freshnessDays: req.freshness_days || 30,
                  required: req.required !== false,
                  description: req.description || '',
                  status,
                  collectedEvidenceId: matchingEvidence?.id,
                  collectedAt: matchingEvidence?.createdAt,
                  expiresAt: matchingEvidence?.expiresAt,
                });
              }
            });
          }
        });
        
        // Convert map to array
        const requirements = Array.from(requirementsMap.values());

        setEvidenceRequirements(requirements);
        setRequirementsLoading(false);
      } catch (err: any) {
        console.error("Error fetching evidence requirements:", err);
        setRequirementsLoading(false);
      }
    };

    if (activeTab === "requirements") {
      fetchRequirements();
    }
  }, [activeTab, frameworkFilter]);

  // Fetch evidence from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("access_token");
        if (!token) {
          setError("Not authenticated");
          setLoading(false);
          return;
        }

        const baseUrl = API_BASE?.replace(/\/$/, '') || '';
        let url = `${baseUrl}/api/compliance/evidence/`;
        
        // Add query params
        const params = new URLSearchParams();
        if (frameworkFilter !== "all") {
          params.append('framework_id', frameworkFilter);
        }
        if (sourceFilter !== "all") {
          params.append('source', sourceFilter);
        }
        if (statusFilter !== "all") {
          params.append('status', statusFilter);
        }
        if (searchQuery) {
          params.append('search', searchQuery);
        }
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
        const response = await makeAuthenticatedRequest(url, token);
        
        if (!Array.isArray(response.data)) {
          throw new Error('Invalid API response format');
        }

        const mappedEvidence = mapEvidenceResponse(response.data);
        
        setEvidence(mappedEvidence);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching evidence:", err);
        const errorMessage = err.response?.data?.error || err.response?.data?.detail || err.message || "Failed to load evidence";
        setError(errorMessage);
        
        if (err.response?.status === 401 || err.response?.status === 403) {
          setTimeout(() => {
            window.location.href = '/workspace/login';
          }, 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [frameworkFilter, sourceFilter, statusFilter, searchQuery]);

  // Get unique frameworks from evidence
  const allFrameworks = useMemo(() => {
    const frameworkSet = new Set<string>();
    evidence.forEach((ev) => {
      ev.frameworkNames.forEach((name) => frameworkSet.add(name));
    });
    return Array.from(frameworkSet).sort();
  }, [evidence]);

  // Filter evidence (client-side filtering for search)
  const filteredEvidence = useMemo(() => {
    return evidence.filter((ev) => {
      // Note: Most filtering is done server-side via API query params
      // This is just for client-side search refinement if needed
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          ev.evidenceId.toLowerCase().includes(query) ||
          ev.name.toLowerCase().includes(query) ||
          (ev.description?.toLowerCase().includes(query) ?? false) ||
          ev.controlIds.some((id) => id.toLowerCase().includes(query)) ||
          ev.controlNames.some((name) => name.toLowerCase().includes(query)) ||
          ev.frameworkNames.some((name) => name.toLowerCase().includes(query)) ||
          ev.sourceName.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [evidence, searchQuery]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = evidence.length;
    const automated = evidence.filter((e) => e.source === "automated").length;
    const manual = evidence.filter((e) => e.source === "manual").length;
    const fresh = evidence.filter((e) => e.status === "fresh").length;
    const expired = evidence.filter((e) => e.status === "expired").length;
    const linkedToControls = evidence.filter((e) => e.controlIds.length > 0).length;

    return {
      total,
      automated,
      manual,
      fresh,
      expired,
      linkedToControls,
    };
  }, []);

  const handleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedIds(filteredEvidence.map((e) => e.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleViewDetails = (ev: Evidence) => {
    setSelectedEvidence(ev);
    setDrawerOpen(true);
  };

  const handleDownload = (evidenceId: string) => {
    // TODO: Implement download functionality
    console.log("Download evidence:", evidenceId);
  };

  const handleLinkControl = (evidenceId: string) => {
    // TODO: Implement link to control functionality
    console.log("Link evidence to control:", evidenceId);
  };

  const handleUpload = () => {
    setUploadError(null);
    setUploadOpen(true);
  };

  const selectedRequirement = evidenceRequirements.find(
    (req) => req.requirementKey === uploadRequirementKey
  );

  const handleUploadSubmit = async () => {
    if (!uploadFile) {
      setUploadError("Please select a file to upload.");
      return;
    }
    if (!selectedRequirement?.controlDbId) {
      setUploadError("Please select a requirement.");
      return;
    }
    if (!uploadName.trim()) {
      setUploadError("Please provide a name for the evidence.");
      return;
    }

    setUploadLoading(true);
    setUploadError(null);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Not authenticated");
      }
      const baseUrl = API_BASE?.replace(/\/$/, '') || '';
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("name", uploadName.trim());
      formData.append("description", uploadDescription.trim());
      formData.append("control_id", selectedRequirement.controlDbId);
      formData.append("evidence_type", selectedRequirement.evidenceType || "manual_upload");
      formData.append("source_name", selectedRequirement.sourceApp || "Manual Upload");
      formData.append("freshness_days", String(selectedRequirement.freshnessDays || 30));
      formData.append("category", selectedRequirement.evidenceCategory || "");
      if (uploadTags.trim()) {
        formData.append("tags", uploadTags.trim());
      }

      await axios.post(`${baseUrl}/api/compliance/evidence/manual-upload/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setUploadOpen(false);
      setUploadRequirementKey("");
      setUploadName("");
      setUploadDescription("");
      setUploadTags("");
      setUploadFile(null);

      const updatedEvidence = await makeAuthenticatedRequest(`${baseUrl}/api/compliance/evidence/`, token);
      if (Array.isArray(updatedEvidence.data)) {
        const mappedEvidence = mapEvidenceResponse(updatedEvidence.data);
        setEvidence(mappedEvidence);
        setRequirementsEvidence(mappedEvidence);
      }
    } catch (err: any) {
      setUploadError(err.response?.data?.error || err.message || "Upload failed.");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleBulkExport = () => {
    // TODO: Implement bulk export
    console.log("Bulk export:", selectedIds);
  };

  const handleGeneratePack = () => {
    // TODO: Implement evidence pack generation
    console.log("Generate evidence pack");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-palette-primary mx-auto mb-4"></div>
          <p className="text-palette-secondary/80 font-medium">Loading evidence...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button 
                onClick={() => window.location.reload()}
                className="bg-palette-primary hover:bg-palette-primary-hover text-white"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-h4-dynamic font-semibold flex items-center gap-2 text-palette-primary">
            <FileText className="h-5 w-5" />
            Compliance Evidence
          </h1>
          <p className="text-palette-secondary/80 mt-2 font-medium">
            Automatically collect and organize audit-ready evidence
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleUpload}
            className="bg-palette-primary hover:bg-palette-primary-hover text-white shadow-md"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Evidence
          </Button>
          <Button
            onClick={async () => {
              setLoading(true);
              setError(null);
              const token = localStorage.getItem("access_token");
              if (!token) {
                setError("Not authenticated");
                setLoading(false);
                return;
              }
              const baseUrl = API_BASE?.replace(/\/$/, '') || '';
              let url = `${baseUrl}/api/compliance/evidence/`;
              const params = new URLSearchParams();
              if (frameworkFilter !== "all") params.append('framework_id', frameworkFilter);
              if (sourceFilter !== "all") params.append('source', sourceFilter);
              if (statusFilter !== "all") params.append('status', statusFilter);
              if (searchQuery) params.append('search', searchQuery);
              if (params.toString()) url += `?${params.toString()}`;
              try {
                const response = await makeAuthenticatedRequest(url, token);
                const mappedEvidence = mapEvidenceResponse(response.data);
                setEvidence(mappedEvidence);
                setRequirementsEvidence(mappedEvidence);
              } catch (err: any) {
                setError(err.message || "Failed to refresh");
              } finally {
                setLoading(false);
              }
            }}
            variant="outline"
            className="border-palette-primary text-palette-primary"
          >
            <Download className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            onClick={handleBulkExport}
            variant="outline"
            className="border-palette-secondary text-palette-secondary hover:bg-palette-accent-3"
            disabled={selectedIds.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Bulk Export
          </Button>
          <Button
            onClick={handleGeneratePack}
            variant="outline"
            className="border-palette-secondary text-palette-secondary hover:bg-palette-accent-3"
          >
            <Package className="h-4 w-4 mr-2" />
            Generate Pack
          </Button>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <div className="text-xl font-bold text-slate-800">{stats.total}</div>
              <p className="text-xs text-slate-600 mt-1">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">{stats.automated}</div>
              <p className="text-xs text-slate-600 mt-1">Automated</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <div className="text-xl font-bold text-purple-600">{stats.manual}</div>
              <p className="text-xs text-slate-600 mt-1">Manual</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">{stats.fresh}</div>
              <p className="text-xs text-slate-600 mt-1">Fresh</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <div className="text-xl font-bold text-red-600">{stats.expired}</div>
              <p className="text-xs text-slate-600 mt-1">Expired</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <div className="text-xl font-bold text-palette-secondary">{stats.linkedToControls}</div>
              <p className="text-xs text-slate-600 mt-1">Linked</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "requirements" | "collected")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="requirements" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            Requirements
            {evidenceRequirements.length > 0 && (
              <Badge variant="outline" className="ml-2">
                {evidenceRequirements.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="collected" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Collected Evidence
            {evidence.length > 0 && (
              <Badge variant="outline" className="ml-2">
                {evidence.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Requirements Tab */}
        <TabsContent value="requirements" className="space-y-4">
          {/* Filters for Requirements */}
          <Card className="border-palette-accent-2/50 bg-palette-accent-3/30">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search requirements by control, framework, evidence type..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white border-slate-300 text-slate-800"
                  />
                </div>
                <Select
                  value={frameworkFilter}
                  onValueChange={(value: string) => setFrameworkFilter(value)}
                >
                  <SelectTrigger className="w-full md:w-[180px] bg-white border-slate-300 text-slate-800">
                    <SelectValue placeholder="Framework" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Frameworks</SelectItem>
                    {frameworks.map((fw) => (
                      <SelectItem key={fw.id} value={fw.id}>
                        {fw.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <Select
                  value={evidenceTypeFilter}
                  onValueChange={(value: string) => setEvidenceTypeFilter(value)}
                >
                  <SelectTrigger className="w-full md:w-[180px] bg-white border-slate-300 text-slate-800">
                    <SelectValue placeholder="Evidence Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="security_scan">Security Scan</SelectItem>
                    <SelectItem value="tls_config">TLS Configuration</SelectItem>
                    <SelectItem value="cloud_config">Cloud Configuration</SelectItem>
                    <SelectItem value="access_log">Access Log</SelectItem>
                    <SelectItem value="system_log">System Log</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="attestation">Attestation</SelectItem>
                    <SelectItem value="screenshot">Screenshot</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={sourceFilterReq}
                  onValueChange={(value: string) => setSourceFilterReq(value)}
                >
                  <SelectTrigger className="w-full md:w-[180px] bg-white border-slate-300 text-slate-800">
                    <SelectValue placeholder="Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    {Array.from(new Set(evidenceRequirements.map(r => r.sourceApp).filter(s => s))).sort().map((source) => (
                      <SelectItem key={source} value={source}>
                        {source}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={requiredFilter}
                  onValueChange={(value: string) => setRequiredFilter(value)}
                >
                  <SelectTrigger className="w-full md:w-[180px] bg-white border-slate-300 text-slate-800">
                    <SelectValue placeholder="Required" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="required">Required</SelectItem>
                    <SelectItem value="optional">Optional</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={statusFilterReq}
                  onValueChange={(value: string) => setStatusFilterReq(value)}
                >
                  <SelectTrigger className="w-full md:w-[180px] bg-white border-slate-300 text-slate-800">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="collected">Collected</SelectItem>
                    <SelectItem value="missing">Missing</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="expiring_soon">Expiring Soon</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={freshnessFilter}
                  onValueChange={(value: string) => setFreshnessFilter(value)}
                >
                  <SelectTrigger className="w-full md:w-[180px] bg-white border-slate-300 text-slate-800">
                    <SelectValue placeholder="Freshness" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Freshness</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="365">365 days</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Requirements Table */}
          <EvidenceRequirementsTable
            requirements={evidenceRequirements.filter((req) => {
              // Framework filter
              if (frameworkFilter !== "all" && !req.frameworkName.includes(frameworks.find(f => f.id === frameworkFilter)?.name || '')) {
                return false;
              }
              // Evidence Category filter
              if (evidenceTypeFilter !== "all" && req.evidenceCategory !== evidenceTypeFilter) {
                return false;
              }
              // Source filter
              if (sourceFilterReq !== "all" && req.sourceApp !== sourceFilterReq) {
                return false;
              }
              // Required filter
              if (requiredFilter !== "all") {
                if (requiredFilter === "required" && !req.required) return false;
                if (requiredFilter === "optional" && req.required) return false;
              }
              // Status filter
              if (statusFilterReq !== "all" && req.status !== statusFilterReq) {
                return false;
              }
              // Freshness filter
              if (freshnessFilter !== "all") {
                if (freshnessFilter === "other") {
                  // Show only non-standard freshness periods
                  if ([30, 90, 365].includes(req.freshnessDays)) {
                    return false;
                  }
                } else {
                  const freshnessDays = parseInt(freshnessFilter);
                  if (req.freshnessDays !== freshnessDays) {
                    return false;
                  }
                }
              }
              // Search filter
              if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return (
                  req.controlId.toLowerCase().includes(query) ||
                  req.controlName.toLowerCase().includes(query) ||
                  req.frameworkName.toLowerCase().includes(query) ||
                  req.evidenceCategoryDisplay.toLowerCase().includes(query) ||
                  req.collectionMethodDisplay.toLowerCase().includes(query) ||
                  req.sourceApp.toLowerCase().includes(query)
                );
              }
              return true;
            })}
            loading={requirementsLoading}
          />
        </TabsContent>

        {/* Collected Evidence Tab */}
        <TabsContent value="collected" className="space-y-4">
          {/* Filters and Search */}
          <Card className="border-palette-accent-2/50 bg-palette-accent-3/30">
            <CardContent className="pt-6 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search evidence by ID, name, control, framework..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border-slate-300 text-slate-800"
                />
              </div>
              <Select
                value={sourceFilter}
                onValueChange={(value: EvidenceSource | "all") => setSourceFilter(value)}
              >
                <SelectTrigger className="w-full md:w-[180px] bg-white border-slate-300 text-slate-800">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="automated">Automated</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={statusFilter}
                onValueChange={(value: EvidenceStatus | "all") => setStatusFilter(value)}
              >
                <SelectTrigger className="w-full md:w-[180px] bg-white border-slate-300 text-slate-800">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="fresh">Fresh</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="expiring_soon">Expiring Soon</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={frameworkFilter}
                onValueChange={(value: string) => setFrameworkFilter(value)}
              >
                <SelectTrigger className="w-full md:w-[180px] bg-white border-slate-300 text-slate-800">
                  <SelectValue placeholder="Framework" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Frameworks</SelectItem>
                  {frameworks.map((fw) => (
                    <SelectItem key={fw.id} value={fw.id}>
                      {fw.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "table" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className={viewMode === "table" ? "bg-palette-primary" : ""}
                >
                  <Table2 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "card" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("card")}
                  className={viewMode === "card" ? "bg-palette-primary" : ""}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Evidence List */}
          {filteredEvidence.length > 0 ? (
            viewMode === "table" ? (
              <EvidenceTable
                evidence={filteredEvidence}
                selectedIds={selectedIds}
                onSelect={handleSelect}
                onSelectAll={handleSelectAll}
                onViewDetails={handleViewDetails}
                onDownload={handleDownload}
                onLinkControl={handleLinkControl}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvidence.map((ev) => (
                  <EvidenceCard
                    key={ev.id}
                    evidence={ev}
                    onViewDetails={handleViewDetails}
                    onDownload={handleDownload}
                  />
                ))}
              </div>
            )
          ) : (
            <Card className="text-center p-8 border-dashed border-2 border-gray-300 bg-gray-50">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Evidence Found</h3>
              <p className="text-gray-500 mb-6">
                Adjust your filters or upload new evidence to get started.
              </p>
              <Button
                onClick={handleUpload}
                className="bg-palette-primary hover:bg-palette-primary-hover text-white"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Evidence
              </Button>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Detail Drawer */}
      <EvidenceDetailDrawer
        evidence={selectedEvidence}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedEvidence(null);
        }}
        onDownload={handleDownload}
        onLinkControl={handleLinkControl}
      />

      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Upload Evidence</DialogTitle>
            <DialogDescription>
              Upload a manual evidence file and attach it to a requirement.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Requirement</Label>
              <Select
                value={uploadRequirementKey}
                onValueChange={(value) => {
                  setUploadRequirementKey(value);
                  const req = evidenceRequirements.find((r) => r.requirementKey === value);
                  if (req && !uploadName) {
                    setUploadName(`${req.controlId} ${req.evidenceTypeDisplay}`);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a requirement" />
                </SelectTrigger>
                <SelectContent>
                  {evidenceRequirements.map((req) => (
                    <SelectItem key={req.requirementKey || req.id} value={req.requirementKey || req.id}>
                      {req.controlId} — {req.evidenceTypeDisplay}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Evidence Name</Label>
              <Input
                value={uploadName}
                onChange={(event) => setUploadName(event.target.value)}
                placeholder="Policy document, scan report, etc."
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={uploadDescription}
                onChange={(event) => setUploadDescription(event.target.value)}
                placeholder="Short description"
              />
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <Input
                value={uploadTags}
                onChange={(event) => setUploadTags(event.target.value)}
                placeholder="comma,separated,tags"
              />
            </div>

            <div className="space-y-2">
              <Label>File</Label>
              <Input
                type="file"
                onChange={(event) => setUploadFile(event.target.files?.[0] || null)}
              />
            </div>

            {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setUploadOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUploadSubmit} disabled={uploadLoading}>
              {uploadLoading ? "Uploading..." : "Upload Evidence"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

