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
import { ShieldCheck, Search, Download, Plus, Filter, Table2, Grid3x3 } from "lucide-react";
import { Framework, FrameworkCategory, FrameworkStatus } from "@/lib/data/frameworks";
import { FrameworkCard } from "@/components/compliance/framework-card";
import { FrameworksTable } from "@/components/compliance/frameworks-table";
import { GenerateReportDialog } from "@/components/compliance/generate-report-dialog";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? (typeof window !== 'undefined' ? '' : 'http://localhost:8000');

export default function ComplianceFrameworksPage() {
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [enabledFilter, setEnabledFilter] = useState<string>("all");
  const [stats, setStats] = useState({
    total: 0,
    enabled: 0,
    ready: 0,
    avgCompliance: 0,
  });
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [selectedFrameworkForReport, setSelectedFrameworkForReport] = useState<string | undefined>(undefined);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");

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

  // Fetch frameworks and stats from API
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
        
        // Fetch frameworks
        const frameworksUrl = `${baseUrl}/api/compliance/frameworks/`;
        const statsUrl = `${baseUrl}/api/compliance/frameworks/stats/`;
        
        const [frameworksRes, statsRes] = await Promise.all([
          makeAuthenticatedRequest(frameworksUrl, token),
          makeAuthenticatedRequest(statsUrl, token),
        ]);

        // Check if response is an array
        if (!Array.isArray(frameworksRes.data)) {
          console.error('API response is not an array:', frameworksRes.data);
          throw new Error('Invalid API response format');
        }

        // Map API response to Framework interface
        const mappedFrameworks: Framework[] = frameworksRes.data.map((f: any) => {
          // Handle date strings - they might be in different formats
          let lastEvaluated: string | undefined;
          let nextAuditDate: string | undefined;
          
          if (f.last_evaluated) {
            try {
              const date = new Date(f.last_evaluated);
              if (!isNaN(date.getTime())) {
                lastEvaluated = date.toISOString().split('T')[0];
              }
            } catch (e) {
              console.warn('Invalid last_evaluated date:', f.last_evaluated);
            }
          }
          
          if (f.next_audit_date) {
            try {
              const date = new Date(f.next_audit_date);
              if (!isNaN(date.getTime())) {
                nextAuditDate = date.toISOString().split('T')[0];
              }
            } catch (e) {
              console.warn('Invalid next_audit_date:', f.next_audit_date);
            }
          }

          return {
            id: f.id,
            name: f.name || '',
            code: f.code || '',
            category: (f.category || 'security') as FrameworkCategory,
            description: f.description || '',
            icon: f.icon || '',
            enabled: f.enabled ?? true,
            status: (f.status || 'not_started') as FrameworkStatus,
            complianceScore: f.compliance_score || 0,
            totalControls: f.total_controls || 0,
            passingControls: f.passing_controls || 0,
            failingControls: f.failing_controls || 0,
            notEvaluatedControls: f.not_evaluated_controls || 0,
            lastEvaluated,
            nextAuditDate,
            controls: f.controls || [], // Include controls from API
          };
        });

        console.log('Frameworks API response:', frameworksRes.data);
        console.log('Mapped frameworks:', mappedFrameworks);
        console.log('Frameworks count:', mappedFrameworks.length);
        
        // Always update state, even if empty (to clear previous data)
        setFrameworks(mappedFrameworks);
        setStats({
          total: statsRes.data.total || 0,
          enabled: statsRes.data.enabled || 0,
          ready: statsRes.data.ready || 0,
          avgCompliance: statsRes.data.avgCompliance || 0,
        });
        setError(null);
      } catch (err: any) {
        console.error("Error fetching frameworks:", err);
        const errorMessage = err.response?.data?.error || err.response?.data?.detail || err.message || "Failed to load frameworks";
        setError(errorMessage);
        
        // If it's an auth error, try to redirect to login
        if (err.response?.status === 401 || err.response?.status === 403) {
          console.error("Authentication failed, redirecting to login");
          setTimeout(() => {
            window.location.href = '/workspace/login';
          }, 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty deps - only run once on mount

  // Filter frameworks
  const filteredFrameworks = useMemo(() => {
    if (!frameworks || frameworks.length === 0) {
      return [];
    }
    
    return frameworks.filter((framework) => {
      // Search filter
      if (searchQuery && !framework.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !framework.code.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !framework.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Category filter
      if (categoryFilter !== "all" && framework.category !== categoryFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== "all" && framework.status !== statusFilter) {
        return false;
      }

      // Enabled filter
      if (enabledFilter !== "all") {
        const isEnabled = enabledFilter === "enabled";
        if (framework.enabled !== isEnabled) {
          return false;
        }
      }

      return true;
    });
  }, [frameworks, searchQuery, categoryFilter, statusFilter, enabledFilter]);

  const handleToggle = async (id: string, enabled: boolean) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("Not authenticated");
        return;
      }

      const baseUrl = API_BASE?.replace(/\/$/, '') || '';
      const url = `${baseUrl}/api/compliance/frameworks/${id}/update/`;
      
      await axios.patch(
        url,
        { enabled },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update local state
      setFrameworks((prev) =>
        prev.map((f) => (f.id === id ? { ...f, enabled } : f))
      );
      
      // Update stats
      setStats((prev) => ({
        ...prev,
        enabled: enabled ? prev.enabled + 1 : prev.enabled - 1,
      }));
    } catch (err: any) {
      console.error("Error toggling framework:", err);
      alert(err.response?.data?.error || "Failed to update framework");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-palette-primary mx-auto mb-4"></div>
          <p className="text-palette-secondary/80 font-medium">Loading frameworks...</p>
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h4-dynamic font-semibold flex items-center gap-2 text-palette-primary">
            <ShieldCheck className="h-5 w-5" />
            Compliance Frameworks
          </h1>
          <p className="text-palette-secondary/80 mt-2 font-medium">
            Manage and monitor your compliance posture across all frameworks
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="border-palette-primary text-palette-primary hover:bg-palette-accent-3 transition-colors"
            onClick={async () => {
              setLoading(true);
              setError(null);
              const token = localStorage.getItem("access_token");
              if (!token) {
                setError("Not authenticated");
                setLoading(false);
                return;
              }

              try {
                const baseUrl = API_BASE?.replace(/\/$/, '') || '';
                const frameworksUrl = `${baseUrl}/api/compliance/frameworks/`;
                const statsUrl = `${baseUrl}/api/compliance/frameworks/stats/`;
                
                const [frameworksRes, statsRes] = await Promise.all([
                  makeAuthenticatedRequest(frameworksUrl, token),
                  makeAuthenticatedRequest(statsUrl, token),
                ]);

                if (!Array.isArray(frameworksRes.data)) {
                  throw new Error('Invalid API response format');
                }

                const mappedFrameworks: Framework[] = frameworksRes.data.map((f: any) => {
                  let lastEvaluated: string | undefined;
                  let nextAuditDate: string | undefined;
                  
                  if (f.last_evaluated) {
                    try {
                      const date = new Date(f.last_evaluated);
                      if (!isNaN(date.getTime())) {
                        lastEvaluated = date.toISOString().split('T')[0];
                      }
                    } catch (e) {}
                  }
                  
                  if (f.next_audit_date) {
                    try {
                      const date = new Date(f.next_audit_date);
                      if (!isNaN(date.getTime())) {
                        nextAuditDate = date.toISOString().split('T')[0];
                      }
                    } catch (e) {}
                  }

                  return {
                    id: f.id,
                    name: f.name || '',
                    code: f.code || '',
                    category: (f.category || 'security') as FrameworkCategory,
                    description: f.description || '',
                    icon: f.icon || '',
                    enabled: f.enabled ?? true,
                    status: (f.status || 'not_started') as FrameworkStatus,
                    complianceScore: f.compliance_score || 0,
                    totalControls: f.total_controls || 0,
                    passingControls: f.passing_controls || 0,
                    failingControls: f.failing_controls || 0,
                    notEvaluatedControls: f.not_evaluated_controls || 0,
                    lastEvaluated,
                    nextAuditDate,
                    controls: f.controls || [], // Include controls from API
                  };
                });

                console.log('Manual refresh - Frameworks count:', mappedFrameworks.length);
                setFrameworks(mappedFrameworks);
                setStats({
                  total: statsRes.data.total || 0,
                  enabled: statsRes.data.enabled || 0,
                  ready: statsRes.data.ready || 0,
                  avgCompliance: statsRes.data.avgCompliance || 0,
                });
                setError(null);
              } catch (err: any) {
                console.error("Error refreshing frameworks:", err);
                setError(err.response?.data?.error || err.message || "Failed to refresh frameworks");
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
          >
            <Search className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" className="border-palette-primary text-palette-primary hover:bg-palette-accent-3 transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            Enable Framework
          </Button>
          <Button 
            variant="outline" 
            className="border-palette-primary text-palette-primary hover:bg-palette-accent-3 transition-colors"
            onClick={() => {
              setSelectedFrameworkForReport(undefined);
              setReportDialogOpen(true);
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-palette-primary">{stats.total}</div>
              <p className="text-sm text-palette-secondary/70 mt-1 font-medium">Total Frameworks</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-palette-primary">{stats.enabled}</div>
              <p className="text-sm text-palette-secondary/70 mt-1 font-medium">Enabled</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats.ready}</div>
              <p className="text-sm text-palette-secondary/70 mt-1 font-medium">Ready</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-palette-accent-1">{stats.avgCompliance}%</div>
              <p className="text-sm text-palette-secondary/70 mt-1 font-medium">Avg Compliance</p>
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-palette-secondary/50" />
                <Input
                  placeholder="Search frameworks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="privacy">Privacy</SelectItem>
                <SelectItem value="industry">Industry</SelectItem>
                <SelectItem value="regional">Regional</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="at_risk">At Risk</SelectItem>
                <SelectItem value="not_started">Not Started</SelectItem>
              </SelectContent>
            </Select>

            {/* Enabled Filter */}
            <Select value={enabledFilter} onValueChange={setEnabledFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Enabled" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="enabled">Enabled</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
                className={viewMode === "table" ? "bg-palette-primary hover:bg-palette-primary-hover" : ""}
              >
                <Table2 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "card" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("card")}
                className={viewMode === "card" ? "bg-palette-primary hover:bg-palette-primary-hover" : ""}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-palette-secondary/80 font-medium">
          Showing <span className="font-bold text-palette-primary">{filteredFrameworks.length}</span> of{" "}
          <span className="font-bold text-palette-primary">{frameworks.length}</span> frameworks
        </p>
        {/* Debug info */}
        {process.env.NODE_ENV === 'development' && (
          <p className="text-xs text-palette-secondary/50">
            Debug: frameworks={frameworks.length}, filtered={filteredFrameworks.length}
          </p>
        )}
        {(searchQuery || categoryFilter !== "all" || statusFilter !== "all" || enabledFilter !== "all") && (
          <Button
            variant="ghost"
            size="sm"
            className="text-palette-secondary hover:text-palette-primary hover:bg-palette-accent-3"
            onClick={() => {
              setSearchQuery("");
              setCategoryFilter("all");
              setStatusFilter("all");
              setEnabledFilter("all");
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Framework Display */}
      {filteredFrameworks.length > 0 ? (
        viewMode === "table" ? (
          <FrameworksTable
            frameworks={filteredFrameworks}
            onToggle={handleToggle}
            onViewDetails={(framework) => {
              // Could open a detail drawer/modal in the future
              console.log("View details for:", framework);
            }}
            onGenerateReport={(frameworkId) => {
              setSelectedFrameworkForReport(frameworkId);
              setReportDialogOpen(true);
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFrameworks.map((framework) => (
              <FrameworkCard
                key={framework.id}
                framework={framework}
                onToggle={handleToggle}
                onGenerateReport={(frameworkId) => {
                  setSelectedFrameworkForReport(frameworkId);
                  setReportDialogOpen(true);
                }}
              />
            ))}
          </div>
        )
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <ShieldCheck className="h-12 w-12 text-palette-secondary/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-palette-primary mb-2">No frameworks found</h3>
              <p className="text-palette-secondary/80 mb-4 font-medium">
                Try adjusting your filters or search query
              </p>
              <Button
                variant="outline"
                className="border-palette-primary text-palette-primary hover:bg-palette-accent-3 transition-colors"
                onClick={() => {
                  setSearchQuery("");
                  setCategoryFilter("all");
                  setStatusFilter("all");
                  setEnabledFilter("all");
                }}
              >
                Clear All Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generate Report Dialog */}
      <GenerateReportDialog
        open={reportDialogOpen}
        onClose={() => {
          setReportDialogOpen(false);
          setSelectedFrameworkForReport(undefined);
        }}
        frameworks={frameworks}
        defaultFrameworkId={selectedFrameworkForReport}
        onReportGenerated={() => {
          // Optionally refresh data or show success message
          console.log("Report generated successfully");
        }}
      />
    </div>
  );
}
