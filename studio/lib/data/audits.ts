export type AuditType = 'soc2_readiness' | 'external_audit' | 'internal_audit' | 'customer_security_review' | 'annual_review';
export type AuditStatus = 'planned' | 'in_progress' | 'under_review' | 'completed' | 'cancelled';
export type AuditSeverity = 'critical' | 'high' | 'medium' | 'low' | 'informational';

export interface AuditFinding {
  id: string;
  findingId: string;
  title: string;
  description: string;
  severity: AuditSeverity;
  status: 'open' | 'in_remediation' | 'resolved' | 'accepted';
  controlId?: string;
  controlName?: string;
  frameworkId?: string;
  frameworkName?: string;
  evidenceIds?: string[];
  remediationPlan?: string;
  assignedTo?: string;
  dueDate?: string;
  resolvedAt?: string;
  createdAt: string;
}

export interface AuditAuditor {
  id: string;
  userId?: string;
  name: string;
  email: string;
  role: 'lead_auditor' | 'auditor' | 'reviewer';
  organization?: string;
  accessGrantedAt?: string;
  lastAccessAt?: string;
}

export interface Audit {
  id: string;
  auditId: string; // e.g., "AUD-001", "SOC2-2024-Q2"
  name: string;
  description?: string;
  
  // Type & Framework
  type: AuditType;
  frameworks: string[];
  frameworkNames: string[];
  
  // Status
  status: AuditStatus;
  
  // Timeline
  startDate: string; // ISO date
  endDate?: string; // ISO date
  evidenceFreezeDate?: string; // ISO date - when evidence was frozen
  scheduledStartDate?: string; // ISO date
  scheduledEndDate?: string; // ISO date
  
  // Evidence
  evidenceLocked: boolean;
  evidenceFreezeDate?: string; // ISO date
  evidenceCount?: number;
  evidenceIds?: string[];
  
  // Controls
  totalControls: number;
  controlsPassed: number;
  controlsFailed: number;
  controlsPartial: number;
  controlsNotEvaluated: number;
  complianceScore?: number; // 0-100
  
  // Findings
  findings: AuditFinding[];
  findingsCount: number;
  criticalFindings: number;
  highFindings: number;
  mediumFindings: number;
  lowFindings: number;
  
  // Auditors
  auditors: AuditAuditor[];
  leadAuditor?: AuditAuditor;
  
  // Ownership
  ownerId?: string;
  ownerName?: string;
  ownerEmail?: string;
  
  // Notes & Findings
  notes?: string;
  summary?: string;
  conclusion?: string;
  
  // Metadata
  createdAt: string;
  createdBy?: string;
  updatedAt: string;
  updatedBy?: string;
  completedAt?: string;
  
  // Related
  previousAuditId?: string; // Link to previous audit
  nextAuditId?: string; // Link to next audit
}

export const audits: Audit[] = [
  {
    id: 'aud-001',
    auditId: 'SOC2-2024-Q2',
    name: 'SOC 2 Type II Readiness - Q2 2024',
    description: 'Annual SOC 2 Type II readiness assessment for Q2 2024',
    type: 'soc2_readiness',
    frameworks: ['soc2-type2'],
    frameworkNames: ['SOC 2 Type II'],
    status: 'in_progress',
    startDate: '2024-01-15T00:00:00Z',
    scheduledEndDate: '2024-03-31T00:00:00Z',
    evidenceLocked: true,
    evidenceFreezeDate: '2024-01-15T00:00:00Z',
    evidenceCount: 245,
    totalControls: 92,
    controlsPassed: 61,
    controlsFailed: 12,
    controlsPartial: 8,
    controlsNotEvaluated: 11,
    complianceScore: 66,
    findings: [
      {
        id: 'find-001',
        findingId: 'F-001',
        title: 'Missing MFA for administrative accounts',
        description: 'Three administrative accounts do not have MFA enabled',
        severity: 'high',
        status: 'in_remediation',
        controlId: 'ctrl-001',
        controlName: 'MFA Enforcement',
        frameworkId: 'soc2-type2',
        frameworkName: 'SOC 2 Type II',
        assignedTo: 'security-team',
        dueDate: '2024-02-15T00:00:00Z',
        createdAt: '2024-01-20T10:00:00Z',
      },
      {
        id: 'find-002',
        findingId: 'F-002',
        title: 'Incomplete access review documentation',
        description: 'Q4 2023 access review documentation is missing for 5 departments',
        severity: 'medium',
        status: 'open',
        controlId: 'ctrl-012',
        controlName: 'Access Review',
        frameworkId: 'soc2-type2',
        frameworkName: 'SOC 2 Type II',
        assignedTo: 'compliance-team',
        dueDate: '2024-02-20T00:00:00Z',
        createdAt: '2024-01-22T14:00:00Z',
      },
    ],
    findingsCount: 2,
    criticalFindings: 0,
    highFindings: 1,
    mediumFindings: 1,
    lowFindings: 0,
    auditors: [
      {
        id: 'auditor-001',
        name: 'John Smith',
        email: 'john.smith@auditfirm.com',
        role: 'lead_auditor',
        organization: 'ABC Audit Firm',
        accessGrantedAt: '2024-01-15T09:00:00Z',
        lastAccessAt: '2024-01-25T16:30:00Z',
      },
      {
        id: 'auditor-002',
        name: 'Jane Doe',
        email: 'jane.doe@auditfirm.com',
        role: 'auditor',
        organization: 'ABC Audit Firm',
        accessGrantedAt: '2024-01-15T09:00:00Z',
        lastAccessAt: '2024-01-24T11:00:00Z',
      },
    ],
    leadAuditor: {
      id: 'auditor-001',
      name: 'John Smith',
      email: 'john.smith@auditfirm.com',
      role: 'lead_auditor',
      organization: 'ABC Audit Firm',
      accessGrantedAt: '2024-01-15T09:00:00Z',
      lastAccessAt: '2024-01-25T16:30:00Z',
    },
    ownerName: 'Sarah Johnson',
    ownerEmail: 'sarah.johnson@company.com',
    notes: 'Focus on CC6 controls this quarter. Evidence collection is progressing well.',
    summary: 'SOC 2 Type II readiness assessment in progress. 66% compliance score with 2 open findings.',
    createdAt: '2024-01-10T00:00:00Z',
    createdBy: 'user-001',
    updatedAt: '2024-01-25T16:30:00Z',
    updatedBy: 'user-001',
  },
  {
    id: 'aud-002',
    auditId: 'ISO27001-2024',
    name: 'ISO 27001 Annual Audit 2024',
    description: 'Annual ISO 27001 compliance audit',
    type: 'external_audit',
    frameworks: ['iso27001'],
    frameworkNames: ['ISO 27001'],
    status: 'completed',
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-01-31T00:00:00Z',
    evidenceLocked: true,
    evidenceFreezeDate: '2024-01-01T00:00:00Z',
    evidenceCount: 312,
    totalControls: 114,
    controlsPassed: 98,
    controlsFailed: 8,
    controlsPartial: 5,
    controlsNotEvaluated: 3,
    complianceScore: 86,
    findings: [
      {
        id: 'find-003',
        findingId: 'F-003',
        title: 'Encryption key rotation not documented',
        description: 'Key rotation procedures exist but documentation is incomplete',
        severity: 'medium',
        status: 'resolved',
        controlId: 'ctrl-005',
        controlName: 'Encryption Key Management',
        frameworkId: 'iso27001',
        frameworkName: 'ISO 27001',
        resolvedAt: '2024-02-10T00:00:00Z',
        createdAt: '2024-01-15T10:00:00Z',
      },
    ],
    findingsCount: 1,
    criticalFindings: 0,
    highFindings: 0,
    mediumFindings: 1,
    lowFindings: 0,
    auditors: [
      {
        id: 'auditor-003',
        name: 'Michael Chen',
        email: 'michael.chen@iso-audit.com',
        role: 'lead_auditor',
        organization: 'ISO Audit Services',
        accessGrantedAt: '2024-01-01T08:00:00Z',
        lastAccessAt: '2024-01-31T17:00:00Z',
      },
    ],
    leadAuditor: {
      id: 'auditor-003',
      name: 'Michael Chen',
      email: 'michael.chen@iso-audit.com',
      role: 'lead_auditor',
      organization: 'ISO Audit Services',
      accessGrantedAt: '2024-01-01T08:00:00Z',
      lastAccessAt: '2024-01-31T17:00:00Z',
    },
    ownerName: 'Emily Rodriguez',
    ownerEmail: 'emily.rodriguez@company.com',
    summary: 'ISO 27001 audit completed successfully with 86% compliance score. One medium finding resolved.',
    conclusion: 'Audit completed successfully. Certificate issued. Next audit scheduled for Q1 2025.',
    createdAt: '2023-12-15T00:00:00Z',
    createdBy: 'user-002',
    updatedAt: '2024-01-31T17:00:00Z',
    updatedBy: 'user-002',
    completedAt: '2024-01-31T17:00:00Z',
    previousAuditId: 'aud-005',
  },
  {
    id: 'aud-003',
    auditId: 'CUSTOMER-ACME-2024',
    name: 'Acme Corp Security Review - 2024',
    description: 'Customer security review for Acme Corp procurement process',
    type: 'customer_security_review',
    frameworks: ['soc2-type2', 'iso27001'],
    frameworkNames: ['SOC 2 Type II', 'ISO 27001'],
    status: 'completed',
    startDate: '2024-01-05T00:00:00Z',
    endDate: '2024-01-12T00:00:00Z',
    evidenceLocked: true,
    evidenceFreezeDate: '2024-01-05T00:00:00Z',
    evidenceCount: 156,
    totalControls: 67,
    controlsPassed: 64,
    controlsFailed: 2,
    controlsPartial: 1,
    controlsNotEvaluated: 0,
    complianceScore: 96,
    findings: [],
    findingsCount: 0,
    criticalFindings: 0,
    highFindings: 0,
    mediumFindings: 0,
    lowFindings: 0,
    auditors: [
      {
        id: 'auditor-004',
        name: 'Robert Taylor',
        email: 'robert.taylor@acmecorp.com',
        role: 'reviewer',
        organization: 'Acme Corp',
        accessGrantedAt: '2024-01-05T09:00:00Z',
        lastAccessAt: '2024-01-12T15:00:00Z',
      },
    ],
    leadAuditor: {
      id: 'auditor-004',
      name: 'Robert Taylor',
      email: 'robert.taylor@acmecorp.com',
      role: 'reviewer',
      organization: 'Acme Corp',
      accessGrantedAt: '2024-01-05T09:00:00Z',
      lastAccessAt: '2024-01-12T15:00:00Z',
    },
    ownerName: 'Thomas Brown',
    ownerEmail: 'thomas.brown@company.com',
    summary: 'Customer security review completed successfully. Acme Corp approved for procurement.',
    conclusion: 'Review passed. Acme Corp procurement approved.',
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: 'user-003',
    updatedAt: '2024-01-12T15:00:00Z',
    updatedBy: 'user-003',
    completedAt: '2024-01-12T15:00:00Z',
  },
  {
    id: 'aud-004',
    auditId: 'INTERNAL-Q1-2024',
    name: 'Internal Compliance Review - Q1 2024',
    description: 'Quarterly internal compliance review',
    type: 'internal_audit',
    frameworks: ['soc2-type1', 'iso27001'],
    frameworkNames: ['SOC 2 Type I', 'ISO 27001'],
    status: 'under_review',
    startDate: '2024-02-01T00:00:00Z',
    scheduledEndDate: '2024-02-29T00:00:00Z',
    evidenceLocked: false,
    evidenceCount: 189,
    totalControls: 78,
    controlsPassed: 65,
    controlsFailed: 7,
    controlsPartial: 4,
    controlsNotEvaluated: 2,
    complianceScore: 83,
    findings: [
      {
        id: 'find-004',
        findingId: 'F-004',
        title: 'Policy update overdue',
        description: 'Data retention policy has not been updated in 18 months',
        severity: 'low',
        status: 'open',
        controlId: 'ctrl-020',
        controlName: 'Policy Management',
        frameworkId: 'iso27001',
        frameworkName: 'ISO 27001',
        assignedTo: 'compliance-team',
        dueDate: '2024-02-28T00:00:00Z',
        createdAt: '2024-02-10T11:00:00Z',
      },
    ],
    findingsCount: 1,
    criticalFindings: 0,
    highFindings: 0,
    mediumFindings: 0,
    lowFindings: 1,
    auditors: [
      {
        id: 'auditor-005',
        name: 'Lisa Wang',
        email: 'lisa.wang@company.com',
        role: 'lead_auditor',
        organization: 'Internal Audit',
        accessGrantedAt: '2024-02-01T08:00:00Z',
        lastAccessAt: '2024-02-15T14:00:00Z',
      },
    ],
    leadAuditor: {
      id: 'auditor-005',
      name: 'Lisa Wang',
      email: 'lisa.wang@company.com',
      role: 'lead_auditor',
      organization: 'Internal Audit',
      accessGrantedAt: '2024-02-01T08:00:00Z',
      lastAccessAt: '2024-02-15T14:00:00Z',
    },
    ownerName: 'David Kim',
    ownerEmail: 'david.kim@company.com',
    notes: 'Internal review focusing on policy compliance and evidence completeness.',
    summary: 'Q1 internal review in progress. 83% compliance with 1 low-severity finding.',
    createdAt: '2024-01-25T00:00:00Z',
    createdBy: 'user-004',
    updatedAt: '2024-02-15T14:00:00Z',
    updatedBy: 'user-004',
  },
  {
    id: 'aud-005',
    auditId: 'SOC2-2023-Q4',
    name: 'SOC 2 Type II Readiness - Q4 2023',
    description: 'Q4 2023 SOC 2 Type II readiness assessment',
    type: 'soc2_readiness',
    frameworks: ['soc2-type2'],
    frameworkNames: ['SOC 2 Type II'],
    status: 'completed',
    startDate: '2023-10-01T00:00:00Z',
    endDate: '2023-12-31T00:00:00Z',
    evidenceLocked: true,
    evidenceFreezeDate: '2023-10-01T00:00:00Z',
    evidenceCount: 238,
    totalControls: 92,
    controlsPassed: 85,
    controlsFailed: 4,
    controlsPartial: 2,
    controlsNotEvaluated: 1,
    complianceScore: 92,
    findings: [
      {
        id: 'find-005',
        findingId: 'F-005',
        title: 'Backup verification incomplete',
        description: 'Monthly backup verification was not completed for November',
        severity: 'medium',
        status: 'resolved',
        controlId: 'ctrl-022',
        controlName: 'Backup Verification',
        frameworkId: 'soc2-type2',
        frameworkName: 'SOC 2 Type II',
        resolvedAt: '2023-12-15T00:00:00Z',
        createdAt: '2023-11-20T10:00:00Z',
      },
    ],
    findingsCount: 1,
    criticalFindings: 0,
    highFindings: 0,
    mediumFindings: 1,
    lowFindings: 0,
    auditors: [
      {
        id: 'auditor-001',
        name: 'John Smith',
        email: 'john.smith@auditfirm.com',
        role: 'lead_auditor',
        organization: 'ABC Audit Firm',
        accessGrantedAt: '2023-10-01T09:00:00Z',
        lastAccessAt: '2023-12-31T16:00:00Z',
      },
    ],
    leadAuditor: {
      id: 'auditor-001',
      name: 'John Smith',
      email: 'john.smith@auditfirm.com',
      role: 'lead_auditor',
      organization: 'ABC Audit Firm',
      accessGrantedAt: '2023-10-01T09:00:00Z',
      lastAccessAt: '2023-12-31T16:00:00Z',
    },
    ownerName: 'Sarah Johnson',
    ownerEmail: 'sarah.johnson@company.com',
    summary: 'Q4 2023 SOC 2 readiness completed with 92% compliance. One finding resolved.',
    conclusion: 'Audit completed successfully. Ready for formal SOC 2 Type II audit.',
    createdAt: '2023-09-15T00:00:00Z',
    createdBy: 'user-001',
    updatedAt: '2023-12-31T16:00:00Z',
    updatedBy: 'user-001',
    completedAt: '2023-12-31T16:00:00Z',
    nextAuditId: 'aud-001',
  },
  {
    id: 'aud-006',
    auditId: 'HIPAA-2024',
    name: 'HIPAA Compliance Review 2024',
    description: 'Annual HIPAA compliance review',
    type: 'annual_review',
    frameworks: ['hipaa'],
    frameworkNames: ['HIPAA'],
    status: 'planned',
    scheduledStartDate: '2024-03-01T00:00:00Z',
    scheduledEndDate: '2024-03-31T00:00:00Z',
    evidenceLocked: false,
    totalControls: 45,
    controlsPassed: 0,
    controlsFailed: 0,
    controlsPartial: 0,
    controlsNotEvaluated: 45,
    complianceScore: 0,
    findings: [],
    findingsCount: 0,
    criticalFindings: 0,
    highFindings: 0,
    mediumFindings: 0,
    lowFindings: 0,
    auditors: [],
    ownerName: 'Patricia Martinez',
    ownerEmail: 'patricia.martinez@company.com',
    notes: 'Scheduled for March 2024. Preparing evidence collection.',
    summary: 'HIPAA compliance review scheduled for Q1 2024.',
    createdAt: '2024-01-20T00:00:00Z',
    createdBy: 'user-005',
    updatedAt: '2024-01-20T00:00:00Z',
    updatedBy: 'user-005',
  },
];

