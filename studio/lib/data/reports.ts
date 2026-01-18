export type ReportType = 'readiness' | 'gap_analysis' | 'continuous_monitoring' | 'executive_summary' | 'technical_report' | 'auditor_report';
export type ReportStatus = 'pending' | 'generating' | 'ready' | 'failed';
export type ReportFormat = 'pdf' | 'docx' | 'html' | 'zip' | 'readonly_link';
export type ReportView = 'executive' | 'technical' | 'auditor';

export interface ReportShare {
  id: string;
  link: string;
  expiresAt?: string;
  passwordProtected: boolean;
  accessCount: number;
  createdAt: string;
  createdBy?: string;
}

export interface Report {
  id: string;
  reportId: string; // e.g., "RPT-001", "SOC2-READINESS-2024-Q1"
  name: string;
  description?: string;
  
  // Type & Framework
  type: ReportType;
  frameworks: string[];
  frameworkNames: string[];
  
  // Status
  status: ReportStatus;
  
  // Content & Scope
  view: ReportView;
  dateRangeStart?: string; // ISO date
  dateRangeEnd?: string; // ISO date
  includesEvidence: boolean;
  evidenceCount?: number;
  includesControls: boolean;
  controlCount?: number;
  includesPolicies: boolean;
  policyCount?: number;
  
  // Generation
  templateId?: string;
  templateName?: string;
  generatedAt?: string; // ISO date
  generatedBy?: string;
  
  // File Information
  fileFormat: ReportFormat;
  fileSize?: number; // bytes
  fileUrl?: string;
  downloadUrl?: string;
  
  // Sharing
  shares?: ReportShare[];
  shareCount?: number;
  isPublic: boolean;
  
  // Metadata
  createdAt: string;
  createdBy?: string;
  updatedAt: string;
  updatedBy?: string;
  
  // Error handling
  errorMessage?: string;
  retryCount?: number;
  
  // Summary stats (for display)
  summary?: {
    complianceScore?: number;
    controlsPassed?: number;
    controlsTotal?: number;
    findingsCount?: number;
    evidenceCount?: number;
  };
}

export const reports: Report[] = [
  {
    id: 'rpt-001',
    reportId: 'SOC2-READINESS-2024-Q1',
    name: 'SOC 2 Type II Readiness Report - Q1 2024',
    description: 'Comprehensive readiness assessment for SOC 2 Type II certification',
    type: 'readiness',
    frameworks: ['soc2-type2'],
    frameworkNames: ['SOC 2 Type II'],
    status: 'ready',
    view: 'executive',
    dateRangeStart: '2024-01-01T00:00:00Z',
    dateRangeEnd: '2024-03-31T00:00:00Z',
    includesEvidence: true,
    evidenceCount: 245,
    includesControls: true,
    controlCount: 92,
    includesPolicies: true,
    policyCount: 12,
    templateId: 'soc2-readiness-executive',
    templateName: 'SOC 2 Readiness - Executive Summary',
    generatedAt: '2024-03-31T16:00:00Z',
    generatedBy: 'user-001',
    fileFormat: 'pdf',
    fileSize: 5242880, // 5 MB
    fileUrl: '/reports/soc2-readiness-2024-q1.pdf',
    downloadUrl: '/api/reports/rpt-001/download',
    shares: [
      {
        id: 'share-001',
        link: 'https://opticini.com/reports/share/abc123xyz',
        expiresAt: '2024-04-30T23:59:59Z',
        passwordProtected: true,
        accessCount: 3,
        createdAt: '2024-03-31T16:30:00Z',
        createdBy: 'user-001',
      },
    ],
    shareCount: 1,
    isPublic: false,
    createdAt: '2024-03-31T15:00:00Z',
    createdBy: 'user-001',
    updatedAt: '2024-03-31T16:00:00Z',
    updatedBy: 'system',
    summary: {
      complianceScore: 66,
      controlsPassed: 61,
      controlsTotal: 92,
      findingsCount: 2,
      evidenceCount: 245,
    },
  },
  {
    id: 'rpt-002',
    reportId: 'ISO27001-GAP-2024',
    name: 'ISO 27001 Gap Analysis Report',
    description: 'Detailed gap analysis identifying compliance gaps and remediation recommendations',
    type: 'gap_analysis',
    frameworks: ['iso27001'],
    frameworkNames: ['ISO 27001'],
    status: 'ready',
    view: 'technical',
    dateRangeStart: '2024-01-01T00:00:00Z',
    dateRangeEnd: '2024-01-31T00:00:00Z',
    includesEvidence: true,
    evidenceCount: 312,
    includesControls: true,
    controlCount: 114,
    includesPolicies: false,
    templateId: 'iso27001-gap-technical',
    templateName: 'ISO 27001 Gap Analysis - Technical',
    generatedAt: '2024-01-31T17:00:00Z',
    generatedBy: 'user-002',
    fileFormat: 'pdf',
    fileSize: 8388608, // 8 MB
    fileUrl: '/reports/iso27001-gap-2024.pdf',
    downloadUrl: '/api/reports/rpt-002/download',
    shares: [],
    shareCount: 0,
    isPublic: false,
    createdAt: '2024-01-31T16:00:00Z',
    createdBy: 'user-002',
    updatedAt: '2024-01-31T17:00:00Z',
    updatedBy: 'system',
    summary: {
      complianceScore: 86,
      controlsPassed: 98,
      controlsTotal: 114,
      findingsCount: 1,
      evidenceCount: 312,
    },
  },
  {
    id: 'rpt-003',
    reportId: 'GDPR-TECH-2024',
    name: 'GDPR Technical Compliance Report',
    description: 'Technical compliance assessment for GDPR requirements',
    type: 'technical_report',
    frameworks: ['gdpr'],
    frameworkNames: ['GDPR'],
    status: 'ready',
    view: 'technical',
    dateRangeStart: '2024-01-01T00:00:00Z',
    dateRangeEnd: '2024-03-31T00:00:00Z',
    includesEvidence: true,
    evidenceCount: 189,
    includesControls: true,
    controlCount: 67,
    includesPolicies: true,
    policyCount: 8,
    templateId: 'gdpr-technical',
    templateName: 'GDPR Technical Compliance',
    generatedAt: '2024-03-31T14:00:00Z',
    generatedBy: 'user-003',
    fileFormat: 'pdf',
    fileSize: 3145728, // 3 MB
    fileUrl: '/reports/gdpr-tech-2024.pdf',
    downloadUrl: '/api/reports/rpt-003/download',
    shares: [
      {
        id: 'share-002',
        link: 'https://opticini.com/reports/share/def456uvw',
        passwordProtected: false,
        accessCount: 12,
        createdAt: '2024-03-31T14:30:00Z',
        createdBy: 'user-003',
      },
    ],
    shareCount: 1,
    isPublic: false,
    createdAt: '2024-03-31T13:00:00Z',
    createdBy: 'user-003',
    updatedAt: '2024-03-31T14:00:00Z',
    updatedBy: 'system',
    summary: {
      complianceScore: 72,
      controlsPassed: 48,
      controlsTotal: 67,
      findingsCount: 0,
      evidenceCount: 189,
    },
  },
  {
    id: 'rpt-004',
    reportId: 'AI-GOVERNANCE-2024',
    name: 'AI Governance Summary Report',
    description: 'Executive summary of AI governance and compliance posture',
    type: 'executive_summary',
    frameworks: ['soc2-type1', 'iso27001'],
    frameworkNames: ['SOC 2 Type I', 'ISO 27001'],
    status: 'ready',
    view: 'executive',
    dateRangeStart: '2024-01-01T00:00:00Z',
    dateRangeEnd: '2024-03-31T00:00:00Z',
    includesEvidence: false,
    includesControls: true,
    controlCount: 45,
    includesPolicies: true,
    policyCount: 3,
    templateId: 'ai-governance-executive',
    templateName: 'AI Governance - Executive Summary',
    generatedAt: '2024-03-31T12:00:00Z',
    generatedBy: 'user-004',
    fileFormat: 'pdf',
    fileSize: 2097152, // 2 MB
    fileUrl: '/reports/ai-governance-2024.pdf',
    downloadUrl: '/api/reports/rpt-004/download',
    shares: [],
    shareCount: 0,
    isPublic: false,
    createdAt: '2024-03-31T11:00:00Z',
    createdBy: 'user-004',
    updatedAt: '2024-03-31T12:00:00Z',
    updatedBy: 'system',
    summary: {
      complianceScore: 78,
      controlsPassed: 35,
      controlsTotal: 45,
      findingsCount: 0,
    },
  },
  {
    id: 'rpt-005',
    reportId: 'CONTINUOUS-2024-Q1',
    name: 'Continuous Compliance Report - Q1 2024',
    description: 'Quarterly continuous compliance monitoring report',
    type: 'continuous_monitoring',
    frameworks: ['soc2-type1', 'soc2-type2', 'iso27001'],
    frameworkNames: ['SOC 2 Type I', 'SOC 2 Type II', 'ISO 27001'],
    status: 'ready',
    view: 'executive',
    dateRangeStart: '2024-01-01T00:00:00Z',
    dateRangeEnd: '2024-03-31T00:00:00Z',
    includesEvidence: true,
    evidenceCount: 456,
    includesControls: true,
    controlCount: 156,
    includesPolicies: true,
    policyCount: 16,
    templateId: 'continuous-monitoring-executive',
    templateName: 'Continuous Compliance - Executive',
    generatedAt: '2024-03-31T18:00:00Z',
    generatedBy: 'user-001',
    fileFormat: 'pdf',
    fileSize: 10485760, // 10 MB
    fileUrl: '/reports/continuous-2024-q1.pdf',
    downloadUrl: '/api/reports/rpt-005/download',
    shares: [
      {
        id: 'share-003',
        link: 'https://opticini.com/reports/share/ghi789rst',
        expiresAt: '2024-06-30T23:59:59Z',
        passwordProtected: true,
        accessCount: 8,
        createdAt: '2024-03-31T18:30:00Z',
        createdBy: 'user-001',
      },
    ],
    shareCount: 1,
    isPublic: false,
    createdAt: '2024-03-31T17:00:00Z',
    createdBy: 'user-001',
    updatedAt: '2024-03-31T18:00:00Z',
    updatedBy: 'system',
    summary: {
      complianceScore: 75,
      controlsPassed: 117,
      controlsTotal: 156,
      findingsCount: 3,
      evidenceCount: 456,
    },
  },
  {
    id: 'rpt-006',
    reportId: 'SOC2-AUDITOR-2024-Q2',
    name: 'SOC 2 Type II Auditor Report',
    description: 'Detailed auditor report for SOC 2 Type II audit',
    type: 'auditor_report',
    frameworks: ['soc2-type2'],
    frameworkNames: ['SOC 2 Type II'],
    status: 'generating',
    view: 'auditor',
    dateRangeStart: '2024-01-15T00:00:00Z',
    dateRangeEnd: '2024-03-31T00:00:00Z',
    includesEvidence: true,
    evidenceCount: 245,
    includesControls: true,
    controlCount: 92,
    includesPolicies: true,
    policyCount: 12,
    templateId: 'soc2-auditor',
    templateName: 'SOC 2 Type II - Auditor Report',
    fileFormat: 'zip',
    shares: [],
    shareCount: 0,
    isPublic: false,
    createdAt: '2024-03-31T19:00:00Z',
    createdBy: 'user-001',
    updatedAt: '2024-03-31T19:00:00Z',
    updatedBy: 'system',
    summary: {
      complianceScore: 66,
      controlsPassed: 61,
      controlsTotal: 92,
      findingsCount: 2,
      evidenceCount: 245,
    },
  },
  {
    id: 'rpt-007',
    reportId: 'HIPAA-GAP-2024',
    name: 'HIPAA Gap Analysis Report',
    description: 'HIPAA compliance gap analysis and remediation plan',
    type: 'gap_analysis',
    frameworks: ['hipaa'],
    frameworkNames: ['HIPAA'],
    status: 'pending',
    view: 'technical',
    dateRangeStart: '2024-01-01T00:00:00Z',
    dateRangeEnd: '2024-03-31T00:00:00Z',
    includesEvidence: true,
    evidenceCount: 0,
    includesControls: true,
    controlCount: 45,
    includesPolicies: false,
    templateId: 'hipaa-gap',
    templateName: 'HIPAA Gap Analysis',
    fileFormat: 'pdf',
    shares: [],
    shareCount: 0,
    isPublic: false,
    createdAt: '2024-03-31T20:00:00Z',
    createdBy: 'user-005',
    updatedAt: '2024-03-31T20:00:00Z',
    updatedBy: 'user-005',
  },
  {
    id: 'rpt-008',
    reportId: 'EXEC-SUMMARY-2024-Q1',
    name: 'Executive Compliance Summary - Q1 2024',
    description: 'High-level executive summary of overall compliance posture',
    type: 'executive_summary',
    frameworks: ['soc2-type1', 'soc2-type2', 'iso27001', 'gdpr'],
    frameworkNames: ['SOC 2 Type I', 'SOC 2 Type II', 'ISO 27001', 'GDPR'],
    status: 'ready',
    view: 'executive',
    dateRangeStart: '2024-01-01T00:00:00Z',
    dateRangeEnd: '2024-03-31T00:00:00Z',
    includesEvidence: false,
    includesControls: true,
    controlCount: 238,
    includesPolicies: false,
    templateId: 'executive-summary',
    templateName: 'Executive Compliance Summary',
    generatedAt: '2024-03-31T21:00:00Z',
    generatedBy: 'user-001',
    fileFormat: 'pdf',
    fileSize: 1572864, // 1.5 MB
    fileUrl: '/reports/exec-summary-2024-q1.pdf',
    downloadUrl: '/api/reports/rpt-008/download',
    shares: [
      {
        id: 'share-004',
        link: 'https://opticini.com/reports/share/jkl012mno',
        passwordProtected: false,
        accessCount: 25,
        createdAt: '2024-03-31T21:30:00Z',
        createdBy: 'user-001',
      },
    ],
    shareCount: 1,
    isPublic: false,
    createdAt: '2024-03-31T20:30:00Z',
    createdBy: 'user-001',
    updatedAt: '2024-03-31T21:00:00Z',
    updatedBy: 'system',
    summary: {
      complianceScore: 74,
      controlsPassed: 176,
      controlsTotal: 238,
      findingsCount: 5,
    },
  },
];

