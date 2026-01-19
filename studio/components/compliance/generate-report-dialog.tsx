"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ReportType, ReportView, ReportFormat } from "@/lib/data/reports";
import { Framework } from "@/lib/data/frameworks";
import { FileText, Loader2 } from "lucide-react";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? (typeof window !== 'undefined' ? '' : 'http://localhost:8000');

interface GenerateReportDialogProps {
  open: boolean;
  onClose: () => void;
  frameworks?: Framework[];
  defaultFrameworkId?: string;
  onReportGenerated?: () => void;
}

export function GenerateReportDialog({
  open,
  onClose,
  frameworks = [],
  defaultFrameworkId,
  onReportGenerated,
}: GenerateReportDialogProps) {
  const [loading, setLoading] = useState(false);
  const [reportName, setReportName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>(defaultFrameworkId ? [defaultFrameworkId] : []);
  const [reportType, setReportType] = useState<ReportType>("readiness");
  const [reportView, setReportView] = useState<ReportView>("executive");
  const [fileFormat, setFileFormat] = useState<ReportFormat>("pdf");
  const [includeEvidence, setIncludeEvidence] = useState(true);
  const [includeControls, setIncludeControls] = useState(true);
  const [includePolicies, setIncludePolicies] = useState(true);
  const [dateRangeStart, setDateRangeStart] = useState("");
  const [dateRangeEnd, setDateRangeEnd] = useState("");

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      if (defaultFrameworkId) {
        setSelectedFrameworks([defaultFrameworkId]);
      } else {
        setSelectedFrameworks([]);
      }
      setReportName("");
      setDescription("");
      setReportType("readiness");
      setReportView("executive");
      setFileFormat("pdf");
      setIncludeEvidence(true);
      setIncludeControls(true);
      setIncludePolicies(true);
      setDateRangeStart("");
      setDateRangeEnd("");
    }
  }, [open, defaultFrameworkId]);

  const handleFrameworkToggle = (frameworkId: string) => {
    setSelectedFrameworks((prev) =>
      prev.includes(frameworkId)
        ? prev.filter((id) => id !== frameworkId)
        : [...prev, frameworkId]
    );
  };

  const handleGenerate = async () => {
    if (selectedFrameworks.length === 0) {
      alert("Please select at least one framework");
      return;
    }

    if (!reportName.trim()) {
      alert("Please enter a report name");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Not authenticated");
      }

      const baseUrl = API_BASE?.replace(/\/$/, '') || '';
      const url = `${baseUrl}/api/compliance/reports/`;

      const payload = {
        name: reportName,
        description: description || undefined,
        type: reportType,
        view: reportView,
        frameworks: selectedFrameworks,
        file_format: fileFormat,
        includes_evidence: includeEvidence,
        includes_controls: includeControls,
        includes_policies: includePolicies,
        date_range_start: dateRangeStart || undefined,
        date_range_end: dateRangeEnd || undefined,
      };

      // If 401, try to refresh token
      let response;
      try {
        response = await axios.post(url, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err: any) {
        if (err.response?.status === 401) {
          // Try to refresh token
          const refreshToken = localStorage.getItem("refresh_token");
          if (refreshToken) {
            const refreshRes = await axios.post(`${baseUrl}/api/token/refresh/`, {
              refresh: refreshToken,
            });
            const newToken = refreshRes.data.access;
            localStorage.setItem("access_token", newToken);
            
            response = await axios.post(url, payload, {
              headers: { Authorization: `Bearer ${newToken}` },
            });
          } else {
            throw err;
          }
        } else {
          throw err;
        }
      }

      console.log("Report generated:", response.data);
      onReportGenerated?.();
      onClose();
    } catch (err: any) {
      console.error("Error generating report:", err);
      alert(err.response?.data?.error || err.message || "Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const reportTypeOptions: { value: ReportType; label: string; description: string }[] = [
    { value: "readiness", label: "Readiness Assessment", description: "Evaluate readiness for a specific framework" },
    { value: "gap_analysis", label: "Gap Analysis", description: "Identify gaps between current state and requirements" },
    { value: "continuous_monitoring", label: "Continuous Monitoring", description: "Ongoing compliance monitoring report" },
    { value: "executive_summary", label: "Executive Summary", description: "High-level summary for executives" },
    { value: "technical_report", label: "Technical Report", description: "Detailed technical compliance report" },
    { value: "auditor_report", label: "Auditor Report", description: "Report formatted for external auditors" },
  ];

  const reportViewOptions: { value: ReportView; label: string; description: string }[] = [
    { value: "executive", label: "Executive", description: "High-level overview for leadership" },
    { value: "technical", label: "Technical", description: "Detailed technical information" },
    { value: "auditor", label: "Auditor", description: "Formatted for external auditors" },
  ];

  const fileFormatOptions: { value: ReportFormat; label: string }[] = [
    { value: "pdf", label: "PDF" },
    { value: "docx", label: "Word (DOCX)" },
    { value: "html", label: "HTML" },
    { value: "zip", label: "ZIP Archive" },
    { value: "readonly_link", label: "Read-only Link" },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-palette-primary">
            <FileText className="h-5 w-5" />
            Generate Compliance Report
          </DialogTitle>
          <DialogDescription className="text-palette-secondary/80">
            Create a formatted compliance report for stakeholders. Select frameworks, report type, and format.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Report Name */}
          <div className="space-y-2">
            <Label htmlFor="reportName" className="text-palette-secondary font-medium">
              Report Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="reportName"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              placeholder="e.g., SOC 2 Readiness Assessment Q1 2024"
              className="border-palette-secondary/30 focus:border-palette-primary"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-palette-secondary font-medium">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description for this report..."
              rows={3}
              className="border-palette-secondary/30 focus:border-palette-primary"
            />
          </div>

          {/* Framework Selection */}
          <div className="space-y-2">
            <Label className="text-palette-secondary font-medium">
              Frameworks <span className="text-red-500">*</span>
            </Label>
            <div className="border border-palette-secondary/30 rounded-md p-4 max-h-48 overflow-y-auto">
              {frameworks.length === 0 ? (
                <p className="text-sm text-palette-secondary/60">No frameworks available</p>
              ) : (
                <div className="space-y-2">
                  {frameworks.map((framework) => (
                    <div key={framework.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`framework-${framework.id}`}
                        checked={selectedFrameworks.includes(framework.id)}
                        onCheckedChange={() => handleFrameworkToggle(framework.id)}
                      />
                      <label
                        htmlFor={`framework-${framework.id}`}
                        className="text-sm font-medium text-palette-secondary cursor-pointer flex-1"
                      >
                        {framework.name} ({framework.code})
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Report Type */}
          <div className="space-y-2">
            <Label htmlFor="reportType" className="text-palette-secondary font-medium">
              Report Type <span className="text-red-500">*</span>
            </Label>
            <Select value={reportType} onValueChange={(v) => setReportType(v as ReportType)}>
              <SelectTrigger className="border-palette-secondary/30 focus:border-palette-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {reportTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-palette-secondary/60">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Report View */}
          <div className="space-y-2">
            <Label htmlFor="reportView" className="text-palette-secondary font-medium">
              Report View <span className="text-red-500">*</span>
            </Label>
            <Select value={reportView} onValueChange={(v) => setReportView(v as ReportView)}>
              <SelectTrigger className="border-palette-secondary/30 focus:border-palette-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {reportViewOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-palette-secondary/60">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* File Format */}
          <div className="space-y-2">
            <Label htmlFor="fileFormat" className="text-palette-secondary font-medium">
              File Format <span className="text-red-500">*</span>
            </Label>
            <Select value={fileFormat} onValueChange={(v) => setFileFormat(v as ReportFormat)}>
              <SelectTrigger className="border-palette-secondary/30 focus:border-palette-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fileFormatOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Include Options */}
          <div className="space-y-3">
            <Label className="text-palette-secondary font-medium">Include in Report</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeEvidence"
                  checked={includeEvidence}
                  onCheckedChange={(checked) => setIncludeEvidence(checked as boolean)}
                />
                <label htmlFor="includeEvidence" className="text-sm font-medium text-palette-secondary cursor-pointer">
                  Evidence
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeControls"
                  checked={includeControls}
                  onCheckedChange={(checked) => setIncludeControls(checked as boolean)}
                />
                <label htmlFor="includeControls" className="text-sm font-medium text-palette-secondary cursor-pointer">
                  Controls
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includePolicies"
                  checked={includePolicies}
                  onCheckedChange={(checked) => setIncludePolicies(checked as boolean)}
                />
                <label htmlFor="includePolicies" className="text-sm font-medium text-palette-secondary cursor-pointer">
                  Policies
                </label>
              </div>
            </div>
          </div>

          {/* Date Range (Optional) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateStart" className="text-palette-secondary font-medium">
                Start Date (Optional)
              </Label>
              <Input
                id="dateStart"
                type="date"
                value={dateRangeStart}
                onChange={(e) => setDateRangeStart(e.target.value)}
                className="border-palette-secondary/30 focus:border-palette-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateEnd" className="text-palette-secondary font-medium">
                End Date (Optional)
              </Label>
              <Input
                id="dateEnd"
                type="date"
                value={dateRangeEnd}
                onChange={(e) => setDateRangeEnd(e.target.value)}
                className="border-palette-secondary/30 focus:border-palette-primary"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-palette-secondary text-palette-secondary hover:bg-palette-accent-3"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={loading || selectedFrameworks.length === 0 || !reportName.trim()}
            className="bg-palette-primary hover:bg-palette-primary-hover text-white"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

