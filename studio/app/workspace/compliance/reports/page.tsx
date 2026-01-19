"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart3, Search, Filter, Table2, Grid3x3, Plus, Download } from "lucide-react";
import { Report, ReportStatus, ReportType, ReportView } from "@/lib/data/reports";
import { ReportsTable } from "@/components/compliance/reports-table";
import { ReportCard } from "@/components/compliance/report-card";
import { ReportDetailDrawer } from "@/components/compliance/report-detail-drawer";
import { GenerateReportDialog } from "@/components/compliance/generate-report-dialog";
import { Framework } from "@/lib/data/frameworks";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? (typeof window !== 'undefined' ? '' : 'http://localhost:8000');

export default function ComplianceReportsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<ReportType | "all">("all");
  const [viewFilter, setViewFilter] = useState<ReportView | "all">("all");
  const [frameworkFilter, setFrameworkFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportsError, setReportsError] = useState<string | null>(null);

  // Get unique frameworks from reports
  const allFrameworks = useMemo(() => {
    const frameworks = new Set<string>();
    reports.forEach((report) => {
      report.frameworkNames.forEach((name) => frameworks.add(name));
    });
    return Array.from(frameworks).sort();
  }, [reports]);

  // Filter reports
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          report.reportId.toLowerCase().includes(query) ||
          report.name.toLowerCase().includes(query) ||
          (report.description?.toLowerCase().includes(query) ?? false) ||
          report.frameworkNames.some((name) => name.toLowerCase().includes(query)) ||
          (report.templateName?.toLowerCase().includes(query) ?? false);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (statusFilter !== "all" && report.status !== statusFilter) {
        return false;
      }

      // Type filter
      if (typeFilter !== "all" && report.type !== typeFilter) {
        return false;
      }

      // View filter
      if (viewFilter !== "all" && report.view !== viewFilter) {
        return false;
      }

      // Framework filter
      if (frameworkFilter !== "all" && !report.frameworkNames.includes(frameworkFilter)) {
        return false;
      }

      return true;
    });
  }, [reports, searchQuery, statusFilter, typeFilter, viewFilter, frameworkFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = reports.length;
    const ready = reports.filter((r) => r.status === "ready").length;
    const generating = reports.filter((r) => r.status === "generating").length;
    const pending = reports.filter((r) => r.status === "pending").length;
    const failed = reports.filter((r) => r.status === "failed").length;
    const totalShares = reports.reduce((sum, r) => sum + (r.shareCount || 0), 0);

    return {
      total,
      ready,
      generating,
      pending,
      failed,
      totalShares,
    };
  }, [reports]);

  const handleSelect = (id: string) => {
    setSelectedReports((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleSelectAll = () => {
    if (selectedReports.length === filteredReports.length) {
      setSelectedReports([]);
    } else {
      setSelectedReports(filteredReports.map((r) => r.id));
    }
  };

  const handleViewDetails = (report: Report) => {
    setSelectedReport(report);
    setDrawerOpen(true);
  };

  const handleDownload = async (reportId: string) => {
    const existing = reports.find((r) => r.id === reportId);
    const existingUrl = existing?.downloadUrl || existing?.fileUrl;
    if (existingUrl) {
      window.open(existingUrl, "_blank", "noopener,noreferrer");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Not authenticated");
      const baseUrl = API_BASE?.replace(/\/$/, '') || '';
      const url = `${baseUrl}/api/compliance/reports/${reportId}/download/`;
      const response = await makeAuthenticatedRequest(url, token);
      if (response?.data?.download_url) {
        window.open(response.data.download_url, "_blank", "noopener,noreferrer");
      } else {
        alert("Report file is not available yet");
      }
    } catch (err: any) {
      console.error("Download failed:", err);
      alert(err.response?.data?.error || err.message || "Download failed");
    }
  };

  const handleShare = async (reportId: string) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Not authenticated");
      const baseUrl = API_BASE?.replace(/\/$/, '') || '';
      const url = `${baseUrl}/api/compliance/reports/${reportId}/share/`;
      const response = await makeAuthenticatedPost(url, token, {});
      if (response?.data?.link) {
        await navigator.clipboard.writeText(response.data.link);
        alert("Share link copied to clipboard");
      } else {
        alert("Share link not available");
      }
    } catch (err: any) {
      console.error("Share failed:", err);
      alert(err.response?.data?.error || err.message || "Share failed");
    }
  };

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
      // Update refresh token if a new one is provided (token rotation)
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
      // If 401, try to refresh token and retry
      if (err.response?.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          return await axios.get(url, {
            headers: { Authorization: `Bearer ${newToken}` },
          });
        }
        throw err; // Re-throw if refresh failed
      }
      throw err;
    }
  };

  const makeAuthenticatedPost = async (url: string, currentToken: string, payload: any) => {
    try {
      return await axios.post(url, payload, {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
    } catch (err: any) {
      if (err.response?.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          return await axios.post(url, payload, {
            headers: { Authorization: `Bearer ${newToken}` },
          });
        }
        throw err;
      }
      throw err;
    }
  };

  const mapReport = (report: any): Report => ({
    id: report.id,
    reportId: report.report_id,
    name: report.name,
    description: report.description || undefined,
    type: report.type,
    frameworks: report.framework_ids || [],
    frameworkNames: report.framework_names || [],
    status: report.status,
    view: report.view,
    dateRangeStart: report.date_range_start || undefined,
    dateRangeEnd: report.date_range_end || undefined,
    includesEvidence: report.includes_evidence ?? false,
    evidenceCount: report.evidence_count ?? undefined,
    includesControls: report.includes_controls ?? false,
    controlCount: report.control_count ?? undefined,
    includesPolicies: report.includes_policies ?? false,
    policyCount: report.policy_count ?? undefined,
    templateId: report.template_id || undefined,
    templateName: report.template_name || undefined,
    generatedAt: report.generated_at || undefined,
    generatedBy: report.generated_by || undefined,
    fileFormat: report.file_format || "pdf",
    fileSize: report.file_size ?? undefined,
    fileUrl: report.file_url || undefined,
    downloadUrl: report.download_url || undefined,
    shares: report.shares?.map((share: any) => ({
      id: share.id,
      link: share.link,
      expiresAt: share.expires_at || undefined,
      passwordProtected: share.password_protected ?? false,
      accessCount: share.access_count ?? 0,
      createdAt: share.created_at,
      createdBy: share.created_by || undefined,
    })),
    shareCount: report.share_count ?? 0,
    isPublic: report.is_public ?? false,
    createdAt: report.created_at,
    createdBy: report.created_by || undefined,
    updatedAt: report.updated_at,
    updatedBy: report.updated_by || undefined,
    errorMessage: report.error_message || undefined,
    retryCount: report.retry_count ?? undefined,
    summary: report.summary || undefined,
  });

  const fetchReports = async () => {
    try {
      setReportsLoading(true);
      setReportsError(null);
      const token = localStorage.getItem("access_token");
      if (!token) return;
      const baseUrl = API_BASE?.replace(/\/$/, '') || '';
      const url = `${baseUrl}/api/compliance/reports/`;
      const response = await makeAuthenticatedRequest(url, token);
      if (Array.isArray(response.data)) {
        setReports(response.data.map(mapReport));
      } else {
        setReports([]);
      }
    } catch (err: any) {
      console.error("Error fetching reports:", err);
      setReportsError(err.response?.data?.error || err.message || "Failed to fetch reports");
    } finally {
      setReportsLoading(false);
    }
  };

  // Fetch frameworks for report generation
  useEffect(() => {
    const fetchFrameworks = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        const baseUrl = API_BASE?.replace(/\/$/, '') || '';
        const url = `${baseUrl}/api/compliance/frameworks/`;
        
        const response = await makeAuthenticatedRequest(url, token);

        if (Array.isArray(response.data)) {
          const mappedFrameworks: Framework[] = response.data.map((f: any) => ({
            id: f.id,
            name: f.name || '',
            code: f.code || '',
            category: (f.category || 'security') as any,
            description: f.description || '',
            icon: f.icon || '',
            enabled: f.enabled ?? true,
            status: (f.status || 'not_started') as any,
            complianceScore: f.compliance_score || 0,
            totalControls: f.total_controls || 0,
            passingControls: f.passing_controls || 0,
            failingControls: f.failing_controls || 0,
            notEvaluatedControls: f.not_evaluated_controls || 0,
            lastEvaluated: f.last_evaluated,
            nextAuditDate: f.next_audit_date,
          }));
          setFrameworks(mappedFrameworks);
        }
      } catch (err) {
        console.error("Error fetching frameworks:", err);
      }
    };

    fetchFrameworks();
    fetchReports();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h4-dynamic font-semibold flex items-center gap-2 text-palette-primary">
            <BarChart3 className="h-5 w-5" />
            Compliance Reports
          </h1>
          <p className="text-palette-secondary/80 mt-2 font-medium">
            Generate and share formatted compliance reports for stakeholders
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="border-palette-primary text-palette-primary hover:bg-palette-accent-3 transition-colors"
            onClick={() => setReportDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button variant="outline" className="border-palette-primary text-palette-primary">
            <Download className="h-4 w-4 mr-2" />
            Export All
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
              <div className="text-xl font-bold text-green-600">{stats.ready}</div>
              <p className="text-xs text-slate-600 mt-1">Ready</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <div className="text-xl font-bold text-yellow-600">{stats.generating}</div>
              <p className="text-xs text-slate-600 mt-1">Generating</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-600">{stats.pending}</div>
              <p className="text-xs text-slate-600 mt-1">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <div className="text-xl font-bold text-red-600">{stats.failed}</div>
              <p className="text-xs text-slate-600 mt-1">Failed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">{stats.totalShares}</div>
              <p className="text-xs text-slate-600 mt-1">Active Shares</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by report ID, name, framework, or template..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ReportStatus | "all")}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="generating">Generating</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as ReportType | "all")}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="readiness">Readiness</SelectItem>
                <SelectItem value="gap_analysis">Gap Analysis</SelectItem>
                <SelectItem value="continuous_monitoring">Continuous</SelectItem>
                <SelectItem value="executive_summary">Executive Summary</SelectItem>
                <SelectItem value="technical_report">Technical</SelectItem>
                <SelectItem value="auditor_report">Auditor</SelectItem>
              </SelectContent>
            </Select>

            {/* View Filter */}
            <Select value={viewFilter} onValueChange={(v) => setViewFilter(v as ReportView | "all")}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="View" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Views</SelectItem>
                <SelectItem value="executive">Executive</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="auditor">Auditor</SelectItem>
              </SelectContent>
            </Select>

            {/* Framework Filter */}
            <Select value={frameworkFilter} onValueChange={setFrameworkFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Framework" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Frameworks</SelectItem>
                {allFrameworks.map((framework) => (
                  <SelectItem key={framework} value={framework}>
                    {framework}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
              >
                <Table2 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "card" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("card")}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div>
        {reportsLoading ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-4 animate-pulse" />
              <p className="text-slate-600 font-medium">Loading reports...</p>
            </CardContent>
          </Card>
        ) : reportsError ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 font-medium">Unable to load reports</p>
              <p className="text-sm text-slate-500 mt-2">{reportsError}</p>
            </CardContent>
          </Card>
        ) : filteredReports.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 font-medium">No reports found</p>
              <p className="text-sm text-slate-500 mt-2">
                Try adjusting your search or filter criteria
              </p>
            </CardContent>
          </Card>
        ) : viewMode === "table" ? (
          <ReportsTable
            reports={filteredReports}
            selectedReports={selectedReports}
            onSelectReport={handleSelect}
            onSelectAll={handleSelectAll}
            onViewDetails={handleViewDetails}
            onDownload={handleDownload}
            onShare={handleShare}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onViewDetails={handleViewDetails}
                onDownload={handleDownload}
                onShare={handleShare}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail Drawer */}
      <ReportDetailDrawer
        report={selectedReport}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onDownload={handleDownload}
        onShare={handleShare}
      />

      {/* Generate Report Dialog */}
      <GenerateReportDialog
        open={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
        frameworks={frameworks}
        onReportGenerated={() => {
          fetchReports();
        }}
      />
    </div>
  );
}

