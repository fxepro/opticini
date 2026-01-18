"use client";

import { useState, useMemo } from "react";
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
import { Report, reports, ReportStatus, ReportType, ReportView } from "@/lib/data/reports";
import { ReportsTable } from "@/components/compliance/reports-table";
import { ReportCard } from "@/components/compliance/report-card";
import { ReportDetailDrawer } from "@/components/compliance/report-detail-drawer";
import { GenerateReportDialog } from "@/components/compliance/generate-report-dialog";
import { Framework } from "@/lib/data/frameworks";
import { useEffect } from "react";
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

  // Get unique frameworks from reports
  const allFrameworks = useMemo(() => {
    const frameworks = new Set<string>();
    reports.forEach((report) => {
      report.frameworkNames.forEach((name) => frameworks.add(name));
    });
    return Array.from(frameworks).sort();
  }, []);

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
  }, [searchQuery, statusFilter, typeFilter, viewFilter, frameworkFilter]);

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
  }, []);

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

  const handleDownload = (reportId: string) => {
    // TODO: Connect to backend API
    console.log(`Download report ${reportId}`);
  };

  const handleShare = (reportId: string) => {
    // TODO: Connect to backend API
    console.log(`Share report ${reportId}`);
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
        {filteredReports.length === 0 ? (
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
          // Optionally refresh reports list
          console.log("Report generated successfully");
        }}
      />
    </div>
  );
}

