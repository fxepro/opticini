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
import { FileText, Search, Download, RefreshCw, Filter, Table2, Grid3x3, Plus } from "lucide-react";
import { Policy, policies, PolicyStatus, PolicyType, SyncStatus } from "@/lib/data/policies";
import { PoliciesTable } from "@/components/compliance/policies-table";
import { PolicyCard } from "@/components/compliance/policy-card";
import { PolicyDetailDrawer } from "@/components/compliance/policy-detail-drawer";

export default function CompliancePoliciesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<PolicyStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<PolicyType | "all">("all");
  const [syncStatusFilter, setSyncStatusFilter] = useState<SyncStatus | "all">("all");
  const [frameworkFilter, setFrameworkFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Get unique frameworks from policies
  const allFrameworks = useMemo(() => {
    const frameworks = new Set<string>();
    policies.forEach((policy) => {
      policy.frameworkNames.forEach((name) => frameworks.add(name));
    });
    return Array.from(frameworks).sort();
  }, []);

  // Filter policies
  const filteredPolicies = useMemo(() => {
    return policies.filter((policy) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          policy.policyId.toLowerCase().includes(query) ||
          policy.name.toLowerCase().includes(query) ||
          (policy.description?.toLowerCase().includes(query) ?? false) ||
          policy.frameworkNames.some((name) => name.toLowerCase().includes(query)) ||
          (policy.ownerName?.toLowerCase().includes(query) ?? false);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (statusFilter !== "all" && policy.status !== statusFilter) {
        return false;
      }

      // Type filter
      if (typeFilter !== "all" && policy.type !== typeFilter) {
        return false;
      }

      // Sync status filter
      if (syncStatusFilter !== "all" && policy.syncStatus !== syncStatusFilter) {
        return false;
      }

      // Framework filter
      if (frameworkFilter !== "all" && !policy.frameworkNames.includes(frameworkFilter)) {
        return false;
      }

      return true;
    });
  }, [searchQuery, statusFilter, typeFilter, syncStatusFilter, frameworkFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = policies.length;
    const active = policies.filter((p) => p.status === "active").length;
    const draft = policies.filter((p) => p.status === "draft").length;
    const needsReview = policies.filter((p) => p.status === "needs_review").length;
    const outOfSync = policies.filter((p) => p.syncStatus === "out_of_sync").length;
    const approved = policies.filter((p) => p.approvalStatus === "approved").length;
    const inSync = policies.filter((p) => p.syncStatus === "in_sync").length;
    const overallCompliance = total > 0 ? Math.round((inSync / total) * 100) : 0;

    return {
      total,
      active,
      draft,
      needsReview,
      outOfSync,
      approved,
      overallCompliance,
    };
  }, []);

  const handleSelect = (id: string) => {
    setSelectedPolicies((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleSelectAll = () => {
    if (selectedPolicies.length === filteredPolicies.length) {
      setSelectedPolicies([]);
    } else {
      setSelectedPolicies(filteredPolicies.map((p) => p.id));
    }
  };

  const handleViewDetails = (policy: Policy) => {
    setSelectedPolicy(policy);
    setDrawerOpen(true);
  };

  const handleRegenerate = (policyId: string) => {
    // TODO: Connect to backend API
    console.log(`Regenerate policy ${policyId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h4-dynamic font-semibold flex items-center gap-2 text-palette-primary">
            <FileText className="h-5 w-5" />
            Compliance Policies
          </h1>
          <p className="text-palette-secondary/80 mt-2 font-medium">
            Auto-generate and manage policies that reflect your actual system state
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-palette-primary text-palette-primary">
            <Plus className="h-4 w-4 mr-2" />
            Create Policy
          </Button>
          <Button variant="outline" className="border-palette-primary text-palette-primary">
            <RefreshCw className="h-4 w-4 mr-2" />
            Regenerate All
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
              <div className="text-xl font-bold text-green-600">{stats.active}</div>
              <p className="text-xs text-slate-600 mt-1">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-600">{stats.draft}</div>
              <p className="text-xs text-slate-600 mt-1">Draft</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <div className="text-xl font-bold text-yellow-600">{stats.needsReview}</div>
              <p className="text-xs text-slate-600 mt-1">Needs Review</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <div className="text-xl font-bold text-red-600">{stats.outOfSync}</div>
              <p className="text-xs text-slate-600 mt-1">Out of Sync</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <div className="text-xl font-bold text-palette-primary">{stats.overallCompliance}%</div>
              <p className="text-xs text-slate-600 mt-1">In Sync</p>
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
                  placeholder="Search by policy ID, name, framework, or owner..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as PolicyStatus | "all")}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="needs_review">Needs Review</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as PolicyType | "all")}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="data_retention">Data Retention</SelectItem>
                <SelectItem value="incident_response">Incident Response</SelectItem>
                <SelectItem value="ai_governance">AI Governance</SelectItem>
                <SelectItem value="vendor_risk">Vendor Risk</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>

            {/* Sync Status Filter */}
            <Select
              value={syncStatusFilter}
              onValueChange={(v) => setSyncStatusFilter(v as SyncStatus | "all")}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Sync Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sync Status</SelectItem>
                <SelectItem value="in_sync">In Sync</SelectItem>
                <SelectItem value="out_of_sync">Out of Sync</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
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
        {filteredPolicies.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 font-medium">No policies found</p>
              <p className="text-sm text-slate-500 mt-2">
                Try adjusting your search or filter criteria
              </p>
            </CardContent>
          </Card>
        ) : viewMode === "table" ? (
          <PoliciesTable
            policies={filteredPolicies}
            selectedPolicies={selectedPolicies}
            onSelectPolicy={handleSelect}
            onSelectAll={handleSelectAll}
            onViewDetails={handleViewDetails}
            onRegenerate={handleRegenerate}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPolicies.map((policy) => (
              <PolicyCard
                key={policy.id}
                policy={policy}
                onViewDetails={handleViewDetails}
                onRegenerate={handleRegenerate}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail Drawer */}
      <PolicyDetailDrawer
        policy={selectedPolicy}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onRegenerate={handleRegenerate}
      />
    </div>
  );
}

