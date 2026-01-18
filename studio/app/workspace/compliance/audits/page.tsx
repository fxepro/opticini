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
import { Search, Filter, Table2, Grid3x3, Plus, Download } from "lucide-react";
import { Audit, audits, AuditStatus, AuditType } from "@/lib/data/audits";
import { AuditsTable } from "@/components/compliance/audits-table";
import { AuditCard } from "@/components/compliance/audit-card";
import { AuditDetailDrawer } from "@/components/compliance/audit-detail-drawer";

export default function ComplianceAuditsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<AuditStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<AuditType | "all">("all");
  const [frameworkFilter, setFrameworkFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [selectedAudits, setSelectedAudits] = useState<string[]>([]);
  const [selectedAudit, setSelectedAudit] = useState<Audit | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Get unique frameworks from audits
  const allFrameworks = useMemo(() => {
    const frameworks = new Set<string>();
    audits.forEach((audit) => {
      audit.frameworkNames.forEach((name) => frameworks.add(name));
    });
    return Array.from(frameworks).sort();
  }, []);

  // Filter audits
  const filteredAudits = useMemo(() => {
    return audits.filter((audit) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          audit.auditId.toLowerCase().includes(query) ||
          audit.name.toLowerCase().includes(query) ||
          (audit.description?.toLowerCase().includes(query) ?? false) ||
          audit.frameworkNames.some((name) => name.toLowerCase().includes(query)) ||
          (audit.leadAuditor?.name.toLowerCase().includes(query) ?? false) ||
          (audit.ownerName?.toLowerCase().includes(query) ?? false);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (statusFilter !== "all" && audit.status !== statusFilter) {
        return false;
      }

      // Type filter
      if (typeFilter !== "all" && audit.type !== typeFilter) {
        return false;
      }

      // Framework filter
      if (frameworkFilter !== "all" && !audit.frameworkNames.includes(frameworkFilter)) {
        return false;
      }

      return true;
    });
  }, [searchQuery, statusFilter, typeFilter, frameworkFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = audits.length;
    const inProgress = audits.filter((a) => a.status === "in_progress").length;
    const completed = audits.filter((a) => a.status === "completed").length;
    const planned = audits.filter((a) => a.status === "planned").length;
    const underReview = audits.filter((a) => a.status === "under_review").length;
    const totalFindings = audits.reduce((sum, a) => sum + a.findingsCount, 0);

    return {
      total,
      inProgress,
      completed,
      planned,
      underReview,
      totalFindings,
    };
  }, []);

  const handleSelect = (id: string) => {
    setSelectedAudits((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleSelectAll = () => {
    if (selectedAudits.length === filteredAudits.length) {
      setSelectedAudits([]);
    } else {
      setSelectedAudits(filteredAudits.map((a) => a.id));
    }
  };

  const handleViewDetails = (audit: Audit) => {
    setSelectedAudit(audit);
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h4-dynamic font-semibold flex items-center gap-2 text-palette-primary">
            <Search className="h-5 w-5" />
            Compliance Audits
          </h1>
          <p className="text-palette-secondary/80 mt-2 font-medium">
            Manage time-bound compliance events and track audit progress
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-palette-primary text-palette-primary">
            <Plus className="h-4 w-4 mr-2" />
            Create Audit
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
              <div className="text-xl font-bold text-yellow-600">{stats.inProgress}</div>
              <p className="text-xs text-slate-600 mt-1">In Progress</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">{stats.completed}</div>
              <p className="text-xs text-slate-600 mt-1">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">{stats.planned}</div>
              <p className="text-xs text-slate-600 mt-1">Planned</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <div className="text-xl font-bold text-orange-600">{stats.underReview}</div>
              <p className="text-xs text-slate-600 mt-1">Under Review</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <div className="text-xl font-bold text-red-600">{stats.totalFindings}</div>
              <p className="text-xs text-slate-600 mt-1">Total Findings</p>
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
                  placeholder="Search by audit ID, name, framework, auditor, or owner..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as AuditStatus | "all")}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as AuditType | "all")}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="soc2_readiness">SOC 2 Readiness</SelectItem>
                <SelectItem value="external_audit">External Audit</SelectItem>
                <SelectItem value="internal_audit">Internal Audit</SelectItem>
                <SelectItem value="customer_security_review">Customer Review</SelectItem>
                <SelectItem value="annual_review">Annual Review</SelectItem>
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
        {filteredAudits.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <Search className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 font-medium">No audits found</p>
              <p className="text-sm text-slate-500 mt-2">
                Try adjusting your search or filter criteria
              </p>
            </CardContent>
          </Card>
        ) : viewMode === "table" ? (
          <AuditsTable
            audits={filteredAudits}
            selectedAudits={selectedAudits}
            onSelectAudit={handleSelect}
            onSelectAll={handleSelectAll}
            onViewDetails={handleViewDetails}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAudits.map((audit) => (
              <AuditCard key={audit.id} audit={audit} onViewDetails={handleViewDetails} />
            ))}
          </div>
        )}
      </div>

      {/* Detail Drawer */}
      <AuditDetailDrawer
        audit={selectedAudit}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}

