"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shield, Search, Download, RefreshCw, Filter, Table2, Grid3x3, List } from "lucide-react";
import { Control, ControlStatus, ControlSeverity } from "@/lib/data/controls";
import { ControlsTable } from "@/components/compliance/controls-table";
import { ControlCard } from "@/components/compliance/control-card";
import { ControlDetailDrawer } from "@/components/compliance/control-detail-drawer";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? (typeof window !== 'undefined' ? '' : 'http://localhost:8000');

export default function ComplianceControlsPage() {
  const [controls, setControls] = useState<Control[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [frameworkFilter, setFrameworkFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [selectedControls, setSelectedControls] = useState<string[]>([]);
  const [selectedControl, setSelectedControl] = useState<Control | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [frameworks, setFrameworks] = useState<Array<{id: string, name: string}>>([]);

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

  // Fetch controls from API
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
        let url = `${baseUrl}/api/compliance/controls/`;
        
        // Add query params
        const params = new URLSearchParams();
        if (frameworkFilter !== "all") {
          params.append('framework_id', frameworkFilter);
        }
        if (statusFilter !== "all") {
          params.append('status', statusFilter);
        }
        if (severityFilter !== "all") {
          params.append('severity', severityFilter);
        }
        if (searchQuery) {
          params.append('search', searchQuery);
        }
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
        console.log('Fetching controls from:', url);
        const response = await makeAuthenticatedRequest(url, token);
        
        console.log('Controls API response:', response.data);
        console.log('Response type:', typeof response.data, 'Is array:', Array.isArray(response.data));
        console.log('Response length:', Array.isArray(response.data) ? response.data.length : 'N/A');
        
        if (!Array.isArray(response.data)) {
          console.error('Invalid API response format:', response.data);
          throw new Error('Invalid API response format');
        }
        
        if (response.data.length === 0) {
          console.log('No controls found in API response - database may be empty');
        }

        // Map API response to Control interface
        // Note: ComplianceControlListSerializer returns frameworks as array of strings (names)
        const mappedControls: Control[] = response.data.map((c: any) => {
          // Handle frameworks - could be array of strings or array of objects
          let frameworkNames: string[] = [];
          let frameworkIds: string[] = [];
          
          if (Array.isArray(c.frameworks)) {
            if (c.frameworks.length > 0 && typeof c.frameworks[0] === 'string') {
              // Array of strings (from ComplianceControlListSerializer)
              frameworkNames = c.frameworks;
            } else if (c.frameworks.length > 0 && typeof c.frameworks[0] === 'object') {
              // Array of objects (from ComplianceControlSerializer)
              frameworkNames = c.frameworks.map((f: any) => f.name || f);
              frameworkIds = c.frameworks.map((f: any) => f.id || '');
            }
          }
          
          console.log(`Mapping control ${c.control_id}:`, {
            frameworks: c.frameworks,
            frameworkNames,
            frameworkIds
          });
          
          return {
            id: c.id,
            controlId: c.control_id || '',
            name: c.name || '',
            description: c.description || '',
            frameworks: frameworkIds,
            frameworkNames: frameworkNames,
            status: (c.status || 'not_evaluated') as ControlStatus,
            severity: (c.severity || 'medium') as ControlSeverity,
            lastEvaluated: c.last_evaluated,
            evaluatedBy: c.evaluated_by_username,
            evaluationMethod: (c.evaluation_method || 'automated') as any,
            failureReason: c.failure_reason,
            failingAssets: c.failing_assets || [],
            failingCount: c.failing_count || 0,
            evidenceCount: 0, // Will be fetched separately if needed
            evidenceIds: [],
            uptimePercentage: c.uptime_percentage,
            timeOutOfCompliance: c.time_out_of_compliance,
            fixRecommendations: c.fix_recommendations || [],
            relatedControls: c.related_control_ids?.map((id: string) => id) || [],
            category: c.category,
            controlType: (c.control_type || 'preventive') as any,
            frequency: (c.frequency || 'continuous') as any,
          };
        });
        
        console.log('Mapped controls count:', mappedControls.length);
        if (mappedControls.length > 0) {
          console.log('First mapped control:', mappedControls[0]);
        }
        setControls(mappedControls);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching controls:", err);
        console.error("Error details:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          url: err.config?.url
        });
        const errorMessage = err.response?.data?.error || err.response?.data?.detail || err.message || "Failed to load controls";
        setError(errorMessage);
        
        if (err.response?.status === 401 || err.response?.status === 403) {
          console.error("Authentication failed, redirecting to login");
          setTimeout(() => {
            window.location.href = '/workspace/login';
          }, 2000);
        } else if (err.code === 'ERR_NETWORK') {
          setError("Network error: Could not connect to backend. Please ensure the backend server is running.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [frameworkFilter, statusFilter, severityFilter, searchQuery]);

  // Get unique frameworks from controls
  const allFrameworks = useMemo(() => {
    const frameworkSet = new Set<string>();
    controls.forEach(control => {
      control.frameworkNames.forEach(name => frameworkSet.add(name));
    });
    return Array.from(frameworkSet).sort();
  }, [controls]);

  // Filter controls (client-side filtering for search)
  const filteredControls = useMemo(() => {
    return controls.filter((control) => {
      // Note: Most filtering is done server-side via API query params
      // This is just for client-side search refinement if needed
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          control.controlId.toLowerCase().includes(query) ||
          control.name.toLowerCase().includes(query) ||
          control.description.toLowerCase().includes(query) ||
          control.frameworkNames.some(name => name.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [controls, searchQuery]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = controls.length;
    const passing = controls.filter((c) => c.status === 'pass').length;
    const failing = controls.filter((c) => c.status === 'fail').length;
    const partial = controls.filter((c) => c.status === 'partial').length;
    const notEvaluated = controls.filter((c) => c.status === 'not_evaluated').length;
    const overallCompliance = total > 0 
      ? Math.round((passing / total) * 100)
      : 0;

    return {
      total,
      passing,
      failing,
      partial,
      notEvaluated,
      overallCompliance,
    };
  }, []);

  const handleSelectControl = (id: string) => {
    setSelectedControls(prev => 
      prev.includes(id) 
        ? prev.filter(c => c !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedControls.length === filteredControls.length) {
      setSelectedControls([]);
    } else {
      setSelectedControls(filteredControls.map(c => c.id));
    }
  };

  const handleViewDetails = (control: Control) => {
    setSelectedControl(control);
    setDrawerOpen(true);
  };

  const handleReEvaluate = (controlId: string) => {
    // TODO: Connect to backend API
    console.log(`Re-evaluate control ${controlId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-palette-primary mx-auto mb-4"></div>
          <p className="text-palette-secondary/80 font-medium">Loading controls...</p>
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
            <Shield className="h-5 w-5" />
            Compliance Controls
          </h1>
          <p className="text-palette-secondary/80 mt-2 font-medium">
            Monitor and manage compliance controls across all frameworks
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="border-palette-primary text-palette-primary"
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
              const url = `${baseUrl}/api/compliance/controls/`;
              try {
                const response = await makeAuthenticatedRequest(url, token);
                // Map API response to Control interface
                const mappedControls: Control[] = response.data.map((c: any) => {
                  // Handle frameworks - could be array of strings or array of objects
                  let frameworkNames: string[] = [];
                  let frameworkIds: string[] = [];
                  
                  if (Array.isArray(c.frameworks)) {
                    if (c.frameworks.length > 0 && typeof c.frameworks[0] === 'string') {
                      // Array of strings (from ComplianceControlListSerializer)
                      frameworkNames = c.frameworks;
                    } else if (c.frameworks.length > 0 && typeof c.frameworks[0] === 'object') {
                      // Array of objects (from ComplianceControlSerializer)
                      frameworkNames = c.frameworks.map((f: any) => f.name || f);
                      frameworkIds = c.frameworks.map((f: any) => f.id || '');
                    }
                  }
                  
                  return {
                    id: c.id,
                    controlId: c.control_id || '',
                    name: c.name || '',
                    description: c.description || '',
                    frameworks: frameworkIds,
                    frameworkNames: frameworkNames,
                    status: (c.status || 'not_evaluated') as ControlStatus,
                    severity: (c.severity || 'medium') as ControlSeverity,
                    lastEvaluated: c.last_evaluated,
                    evaluatedBy: c.evaluated_by_username,
                    evaluationMethod: (c.evaluation_method || 'automated') as any,
                    failureReason: c.failure_reason,
                    failingAssets: c.failing_assets || [],
                    failingCount: c.failing_count || 0,
                    evidenceCount: 0,
                    evidenceIds: [],
                    uptimePercentage: c.uptime_percentage,
                    timeOutOfCompliance: c.time_out_of_compliance,
                    fixRecommendations: c.fix_recommendations || [],
                    relatedControls: c.related_control_ids?.map((id: string) => id) || [],
                    category: c.category,
                    controlType: (c.control_type || 'preventive') as any,
                    frequency: (c.frequency || 'continuous') as any,
                  };
                });
                setControls(mappedControls);
              } catch (err: any) {
                setError(err.message || "Failed to refresh");
              } finally {
                setLoading(false);
              }
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" className="border-palette-primary text-palette-primary">
            <Download className="h-4 w-4 mr-2" />
            Export Report
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
              <div className="text-xl font-bold text-green-600">{stats.passing}</div>
              <p className="text-xs text-slate-600 mt-1">Passing</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <div className="text-xl font-bold text-red-600">{stats.failing}</div>
              <p className="text-xs text-slate-600 mt-1">Failing</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <div className="text-xl font-bold text-yellow-600">{stats.partial}</div>
              <p className="text-xs text-slate-600 mt-1">Partial</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-600">{stats.notEvaluated}</div>
              <p className="text-xs text-slate-600 mt-1">Not Evaluated</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <div className="text-xl font-bold text-palette-primary">{stats.overallCompliance}%</div>
              <p className="text-xs text-slate-600 mt-1">Compliance</p>
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
                  placeholder="Search by control ID, name, or framework..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Framework Filter */}
            <Select value={frameworkFilter} onValueChange={setFrameworkFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Framework" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Frameworks</SelectItem>
                {frameworks.map((framework) => (
                  <SelectItem key={framework.id} value={framework.id}>
                    {framework.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pass">Pass</SelectItem>
                <SelectItem value="fail">Fail</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="not_evaluated">Not Evaluated</SelectItem>
              </SelectContent>
            </Select>

            {/* Severity Filter */}
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="flex gap-1 border rounded-lg p-1">
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="flex-1"
              >
                <Table2 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "card" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("card")}
                className="flex-1"
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count & Bulk Actions */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          Showing <span className="font-semibold">{filteredControls.length}</span> of{" "}
          <span className="font-semibold">{controls.length}</span> controls
          {selectedControls.length > 0 && (
            <span className="ml-2 text-palette-primary">
              • {selectedControls.length} selected
            </span>
          )}
        </p>
        <div className="flex gap-2">
          {(searchQuery || frameworkFilter !== "all" || statusFilter !== "all" || severityFilter !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setFrameworkFilter("all");
                setStatusFilter("all");
                setSeverityFilter("all");
              }}
            >
              Clear Filters
            </Button>
          )}
          {selectedControls.length > 0 && (
            <Button variant="outline" size="sm">
              Bulk Actions ({selectedControls.length})
            </Button>
          )}
        </div>
      </div>

      {/* Controls Display */}
      {filteredControls.length > 0 ? (
        viewMode === "table" ? (
          <ControlsTable
            controls={filteredControls}
            selectedControls={selectedControls}
            onSelectControl={handleSelectControl}
            onSelectAll={handleSelectAll}
            onViewDetails={handleViewDetails}
            onReEvaluate={handleReEvaluate}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredControls.map((control) => (
              <ControlCard
                key={control.id}
                control={control}
                onViewDetails={handleViewDetails}
                onReEvaluate={handleReEvaluate}
              />
            ))}
          </div>
        )
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Shield className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No controls found</h3>
              <p className="text-slate-600 mb-4">
                Try adjusting your filters or search query
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setFrameworkFilter("all");
                  setStatusFilter("all");
                  setSeverityFilter("all");
                }}
              >
                Clear All Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Control Detail Drawer */}
      <ControlDetailDrawer
        control={selectedControl}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedControl(null);
        }}
        onReEvaluate={handleReEvaluate}
      />
    </div>
  );
}

