export type PolicyType = 'security' | 'data_retention' | 'incident_response' | 'ai_governance' | 'vendor_risk' | 'custom';
export type PolicyStatus = 'draft' | 'active' | 'needs_review' | 'archived';
export type ApprovalStatus = 'approved' | 'pending' | 'rejected';
export type GenerationMethod = 'auto_generated' | 'manual' | 'template_based';
export type SyncStatus = 'in_sync' | 'out_of_sync' | 'unknown';

export interface PolicyVersion {
  id: string;
  version: string;
  content: string;
  summary?: string;
  changes?: string;
  createdAt: string;
  createdBy?: string;
  approvedAt?: string;
  approvedBy?: string;
  isCurrent: boolean;
}

export interface PolicySection {
  id: string;
  title: string;
  content: string;
  order: number;
  generatedFrom?: string[];
}

export interface PolicyAttestation {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  role?: string;
  attestedAt: string;
  acknowledged: boolean;
  comments?: string;
}

export interface Policy {
  id: string;
  policyId: string;
  name: string;
  description?: string;
  
  // Type & Category
  type: PolicyType;
  category?: string;
  
  // Framework mapping
  frameworks: string[];
  frameworkNames: string[];
  
  // Status
  status: PolicyStatus;
  approvalStatus: ApprovalStatus;
  
  // Versioning
  version: string;
  versionHistory: PolicyVersion[];
  currentVersionId: string;
  
  // Ownership
  ownerId?: string;
  ownerName?: string;
  ownerEmail?: string;
  coOwners?: string[];
  
  // Generation
  generationMethod: GenerationMethod;
  generatedFrom?: {
    configs?: string[];
    evidence?: string[];
    controls?: string[];
    observedBehavior?: string[];
  };
  lastGenerated?: string;
  generatedBy?: string;
  
  // Sync Status
  syncStatus: SyncStatus;
  lastSyncCheck?: string;
  syncIssues?: string[];
  
  // Content
  content: string;
  summary?: string;
  sections?: PolicySection[];
  
  // Metadata
  createdAt: string;
  createdBy?: string;
  updatedAt: string;
  updatedBy?: string;
  approvedAt?: string;
  approvedBy?: string;
  effectiveDate?: string;
  reviewDate?: string;
  
  // Attestations
  attestations?: PolicyAttestation[];
  attestationCount?: number;
  lastAttestationDate?: string;
  
  // Evidence & Controls
  evidenceIds?: string[];
  controlIds?: string[];
  
  // Export
  exportFormats?: ('pdf' | 'docx' | 'html' | 'markdown')[];
  
  // Tags
  tags?: string[];
}

export const policies: Policy[] = [
  // Information Security Policies
  {
    id: 'pol-001',
    policyId: 'SEC-001',
    name: 'Access Control Policy',
    description: 'Defines access control requirements, authentication standards, and authorization procedures',
    type: 'security',
    frameworks: ['soc2-type1', 'soc2-type2', 'iso27001'],
    frameworkNames: ['SOC 2 Type I', 'SOC 2 Type II', 'ISO 27001'],
    status: 'active',
    approvalStatus: 'approved',
    version: '2.1',
    currentVersionId: 'v-001-2.1',
    versionHistory: [
      {
        id: 'v-001-2.1',
        version: '2.1',
        content: 'Updated MFA requirements and added cloud access controls',
        summary: 'Enhanced authentication requirements',
        changes: 'Added mandatory MFA for all cloud services, updated access review frequency to quarterly',
        createdAt: '2024-01-15T10:00:00Z',
        createdBy: 'user-001',
        approvedAt: '2024-01-16T14:30:00Z',
        approvedBy: 'user-002',
        isCurrent: true,
      },
      {
        id: 'v-001-2.0',
        version: '2.0',
        content: 'Major revision to align with SOC 2 requirements',
        summary: 'SOC 2 alignment update',
        changes: 'Restructured policy to match SOC 2 CC6 controls, added role-based access section',
        createdAt: '2023-11-01T09:00:00Z',
        createdBy: 'user-001',
        approvedAt: '2023-11-05T16:00:00Z',
        approvedBy: 'user-002',
        isCurrent: false,
      },
    ],
    ownerName: 'Sarah Johnson',
    ownerEmail: 'sarah.johnson@company.com',
    generationMethod: 'auto_generated',
    generatedFrom: {
      configs: ['iam-policies', 'aws-iam-roles', 'azure-rbac'],
      evidence: ['ev-001', 'ev-005'],
      controls: ['ctrl-001', 'ctrl-012'],
    },
    lastGenerated: '2024-01-15T10:00:00Z',
    generatedBy: 'system',
    syncStatus: 'in_sync',
    lastSyncCheck: '2024-01-20T08:00:00Z',
    content: `# Access Control Policy

## 1. Purpose
This policy establishes requirements for access control, authentication, and authorization to ensure that only authorized individuals have access to company systems and data.

## 2. Scope
This policy applies to all employees, contractors, and third-party users who require access to company information systems and data.

## 3. Authentication Requirements
- All users must use multi-factor authentication (MFA) for accessing cloud services
- Passwords must meet complexity requirements (minimum 12 characters, mixed case, numbers, symbols)
- Password changes are required every 90 days
- Single sign-on (SSO) is mandatory for all cloud applications

## 4. Authorization
- Access is granted based on the principle of least privilege
- Role-based access control (RBAC) is implemented for all systems
- Access reviews are conducted quarterly
- Access is revoked immediately upon termination

## 5. Access Control
- Network access is restricted based on user roles
- Administrative access requires additional approval
- All access attempts are logged and monitored
- Failed authentication attempts trigger account lockout after 5 attempts

## 6. Review and Maintenance
- Access rights are reviewed quarterly
- Policy is reviewed annually or when significant changes occur
- Violations are reported to the security team immediately`,
    summary: 'Defines access control, authentication, and authorization requirements for all company systems',
    sections: [
      {
        id: 'sec-001-1',
        title: 'Purpose',
        content: 'This policy establishes requirements for access control...',
        order: 1,
        generatedFrom: ['iam-policies'],
      },
      {
        id: 'sec-001-2',
        title: 'Authentication Requirements',
        content: 'All users must use multi-factor authentication...',
        order: 2,
        generatedFrom: ['aws-iam-roles', 'azure-rbac'],
      },
    ],
    createdAt: '2023-06-01T00:00:00Z',
    createdBy: 'user-001',
    updatedAt: '2024-01-15T10:00:00Z',
    updatedBy: 'user-001',
    approvedAt: '2024-01-16T14:30:00Z',
    approvedBy: 'user-002',
    effectiveDate: '2024-01-16T00:00:00Z',
    reviewDate: '2025-01-16T00:00:00Z',
    attestationCount: 45,
    lastAttestationDate: '2024-01-20T00:00:00Z',
    evidenceIds: ['ev-001', 'ev-005', 'ev-012'],
    controlIds: ['ctrl-001', 'ctrl-012', 'ctrl-025'],
    exportFormats: ['pdf', 'docx', 'html'],
    tags: ['security', 'access-control', 'authentication'],
  },
  {
    id: 'pol-002',
    policyId: 'SEC-002',
    name: 'Encryption Policy',
    description: 'Defines encryption standards for data at rest and in transit',
    type: 'security',
    frameworks: ['soc2-type1', 'soc2-type2', 'iso27001', 'hipaa'],
    frameworkNames: ['SOC 2 Type I', 'SOC 2 Type II', 'ISO 27001', 'HIPAA'],
    status: 'active',
    approvalStatus: 'approved',
    version: '1.5',
    currentVersionId: 'v-002-1.5',
    versionHistory: [
      {
        id: 'v-002-1.5',
        version: '1.5',
        content: 'Updated encryption algorithms and key management requirements',
        summary: 'Enhanced encryption standards',
        changes: 'Added requirement for AES-256, updated TLS version requirements to TLS 1.3 minimum',
        createdAt: '2024-01-10T11:00:00Z',
        createdBy: 'user-003',
        approvedAt: '2024-01-12T10:00:00Z',
        approvedBy: 'user-002',
        isCurrent: true,
      },
    ],
    ownerName: 'Michael Chen',
    ownerEmail: 'michael.chen@company.com',
    generationMethod: 'auto_generated',
    generatedFrom: {
      configs: ['tls-configs', 'database-encryption', 's3-encryption'],
      evidence: ['ev-003', 'ev-008'],
      controls: ['ctrl-005', 'ctrl-018'],
    },
    lastGenerated: '2024-01-10T11:00:00Z',
    generatedBy: 'system',
    syncStatus: 'out_of_sync',
    lastSyncCheck: '2024-01-20T08:00:00Z',
    syncIssues: [
      'Policy requires TLS 1.3 minimum, but 3 services are still using TLS 1.2',
      'Database encryption at rest is not enabled for 2 databases',
    ],
    content: `# Encryption Policy

## 1. Purpose
This policy establishes encryption requirements to protect sensitive data both at rest and in transit.

## 2. Scope
All company data, systems, and communications are subject to this encryption policy.

## 3. Data in Transit
- All data transmitted over networks must use TLS 1.3 or higher
- VPN connections must use strong encryption protocols
- SSH connections must use key-based authentication with strong keys

## 4. Data at Rest
- All databases must use encryption at rest (AES-256)
- All file storage (S3, Azure Blob) must have encryption enabled
- Backup data must be encrypted before storage
- Encryption keys must be managed through a key management service (KMS)

## 5. Key Management
- Encryption keys must be rotated annually or when compromised
- Keys must be stored separately from encrypted data
- Key access must be logged and monitored
- Key recovery procedures must be documented

## 6. Compliance
- All encryption implementations must meet or exceed industry standards
- Regular audits of encryption configurations are required
- Violations must be reported immediately`,
    summary: 'Defines encryption standards for protecting data at rest and in transit',
    createdAt: '2023-07-15T00:00:00Z',
    createdBy: 'user-003',
    updatedAt: '2024-01-10T11:00:00Z',
    updatedBy: 'user-003',
    approvedAt: '2024-01-12T10:00:00Z',
    approvedBy: 'user-002',
    effectiveDate: '2024-01-12T00:00:00Z',
    reviewDate: '2025-01-12T00:00:00Z',
    attestationCount: 42,
    lastAttestationDate: '2024-01-18T00:00:00Z',
    evidenceIds: ['ev-003', 'ev-008', 'ev-015'],
    controlIds: ['ctrl-005', 'ctrl-018', 'ctrl-030'],
    exportFormats: ['pdf', 'docx'],
    tags: ['security', 'encryption', 'data-protection'],
  },
  {
    id: 'pol-003',
    policyId: 'SEC-003',
    name: 'Authentication Policy',
    description: 'Defines authentication requirements and password management',
    type: 'security',
    frameworks: ['soc2-type1', 'soc2-type2', 'iso27001'],
    frameworkNames: ['SOC 2 Type I', 'SOC 2 Type II', 'ISO 27001'],
    status: 'active',
    approvalStatus: 'approved',
    version: '1.2',
    currentVersionId: 'v-003-1.2',
    versionHistory: [
      {
        id: 'v-003-1.2',
        version: '1.2',
        content: 'Updated password requirements and MFA enforcement',
        summary: 'Enhanced authentication requirements',
        changes: 'Increased minimum password length to 12 characters, made MFA mandatory for all cloud services',
        createdAt: '2024-01-05T09:00:00Z',
        createdBy: 'user-001',
        approvedAt: '2024-01-07T15:00:00Z',
        approvedBy: 'user-002',
        isCurrent: true,
      },
    ],
    ownerName: 'Sarah Johnson',
    ownerEmail: 'sarah.johnson@company.com',
    generationMethod: 'auto_generated',
    generatedFrom: {
      configs: ['auth-configs', 'mfa-settings'],
      evidence: ['ev-002'],
      controls: ['ctrl-002'],
    },
    lastGenerated: '2024-01-05T09:00:00Z',
    generatedBy: 'system',
    syncStatus: 'in_sync',
    lastSyncCheck: '2024-01-20T08:00:00Z',
    content: `# Authentication Policy

## 1. Purpose
This policy defines authentication requirements to ensure secure access to company systems.

## 2. Password Requirements
- Minimum length: 12 characters
- Must contain uppercase, lowercase, numbers, and special characters
- Cannot contain dictionary words or personal information
- Must be changed every 90 days
- Cannot reuse last 5 passwords

## 3. Multi-Factor Authentication
- MFA is mandatory for all cloud services
- MFA must be enabled for administrative accounts
- MFA methods: TOTP apps, hardware tokens, SMS (backup only)

## 4. Account Management
- Accounts are locked after 5 failed login attempts
- Lockout duration: 30 minutes
- Password reset requires identity verification
- Inactive accounts are disabled after 90 days`,
    summary: 'Defines authentication requirements and password management standards',
    createdAt: '2023-08-01T00:00:00Z',
    createdBy: 'user-001',
    updatedAt: '2024-01-05T09:00:00Z',
    updatedBy: 'user-001',
    approvedAt: '2024-01-07T15:00:00Z',
    approvedBy: 'user-002',
    effectiveDate: '2024-01-07T00:00:00Z',
    reviewDate: '2025-01-07T00:00:00Z',
    attestationCount: 48,
    lastAttestationDate: '2024-01-19T00:00:00Z',
    evidenceIds: ['ev-002', 'ev-006'],
    controlIds: ['ctrl-002', 'ctrl-013'],
    exportFormats: ['pdf', 'docx'],
    tags: ['security', 'authentication', 'mfa'],
  },
  {
    id: 'pol-004',
    policyId: 'SEC-004',
    name: 'Network Security Policy',
    description: 'Defines network security controls and firewall requirements',
    type: 'security',
    frameworks: ['soc2-type1', 'iso27001'],
    frameworkNames: ['SOC 2 Type I', 'ISO 27001'],
    status: 'draft',
    approvalStatus: 'pending',
    version: '1.0',
    currentVersionId: 'v-004-1.0',
    versionHistory: [
      {
        id: 'v-004-1.0',
        version: '1.0',
        content: 'Initial draft of network security policy',
        summary: 'New policy draft',
        changes: 'Initial creation',
        createdAt: '2024-01-18T14:00:00Z',
        createdBy: 'user-004',
        isCurrent: true,
      },
    ],
    ownerName: 'David Kim',
    ownerEmail: 'david.kim@company.com',
    generationMethod: 'template_based',
    syncStatus: 'unknown',
    content: `# Network Security Policy

## 1. Purpose
This policy establishes network security requirements to protect company infrastructure.

## 2. Firewall Requirements
- All network traffic must pass through firewalls
- Default deny rule for all inbound traffic
- Only explicitly allowed ports and protocols are permitted
- Firewall rules are reviewed quarterly

## 3. Network Segmentation
- Production networks are isolated from development networks
- DMZ is required for public-facing services
- Network access controls are enforced at all network boundaries

## 4. Monitoring
- All network traffic is logged and monitored
- Intrusion detection systems are deployed
- Security alerts are reviewed daily`,
    summary: 'Defines network security controls and firewall requirements',
    createdAt: '2024-01-18T14:00:00Z',
    createdBy: 'user-004',
    updatedAt: '2024-01-18T14:00:00Z',
    updatedBy: 'user-004',
    exportFormats: ['pdf', 'docx'],
    tags: ['security', 'network', 'firewall'],
  },
  // Data Retention Policies
  {
    id: 'pol-005',
    policyId: 'DR-001',
    name: 'Data Retention Policy',
    description: 'Defines how long different types of data are retained and when they are deleted',
    type: 'data_retention',
    frameworks: ['soc2-type1', 'soc2-type2', 'iso27001', 'gdpr'],
    frameworkNames: ['SOC 2 Type I', 'SOC 2 Type II', 'ISO 27001', 'GDPR'],
    status: 'active',
    approvalStatus: 'approved',
    version: '1.3',
    currentVersionId: 'v-005-1.3',
    versionHistory: [
      {
        id: 'v-005-1.3',
        version: '1.3',
        content: 'Updated retention periods to comply with GDPR requirements',
        summary: 'GDPR compliance update',
        changes: 'Extended customer data retention to 7 years, added right to deletion procedures',
        createdAt: '2024-01-12T10:00:00Z',
        createdBy: 'user-005',
        approvedAt: '2024-01-15T11:00:00Z',
        approvedBy: 'user-002',
        isCurrent: true,
      },
    ],
    ownerName: 'Emily Rodriguez',
    ownerEmail: 'emily.rodriguez@company.com',
    generationMethod: 'auto_generated',
    generatedFrom: {
      configs: ['database-retention', 'log-retention', 'backup-retention'],
      evidence: ['ev-010'],
      controls: ['ctrl-020'],
    },
    lastGenerated: '2024-01-12T10:00:00Z',
    generatedBy: 'system',
    syncStatus: 'in_sync',
    lastSyncCheck: '2024-01-20T08:00:00Z',
    content: `# Data Retention Policy

## 1. Purpose
This policy defines how long different types of data are retained and the procedures for secure deletion.

## 2. Data Classification
- **Public Data:** No retention requirements
- **Internal Data:** Retained for 3 years
- **Confidential Data:** Retained for 7 years
- **Restricted Data:** Retained per regulatory requirements

## 3. Retention Periods
- **Customer Data:** 7 years after account closure
- **Employee Records:** 7 years after termination
- **Financial Records:** 7 years
- **Log Data:** 90 days (security logs), 1 year (audit logs)
- **Backup Data:** 30 days for daily backups, 1 year for monthly backups

## 4. Deletion Procedures
- Data is securely deleted using industry-standard methods
- Deletion is logged and verified
- Right to deletion requests are processed within 30 days (GDPR)
- Backup data is deleted according to retention schedules

## 5. Compliance
- Retention periods comply with applicable regulations (GDPR, SOC 2, ISO 27001)
- Regular audits ensure compliance with retention policies
- Exceptions require written approval from legal and compliance teams`,
    summary: 'Defines data retention periods and secure deletion procedures',
    createdAt: '2023-09-01T00:00:00Z',
    createdBy: 'user-005',
    updatedAt: '2024-01-12T10:00:00Z',
    updatedBy: 'user-005',
    approvedAt: '2024-01-15T11:00:00Z',
    approvedBy: 'user-002',
    effectiveDate: '2024-01-15T00:00:00Z',
    reviewDate: '2025-01-15T00:00:00Z',
    attestationCount: 38,
    lastAttestationDate: '2024-01-17T00:00:00Z',
    evidenceIds: ['ev-010', 'ev-018'],
    controlIds: ['ctrl-020', 'ctrl-035'],
    exportFormats: ['pdf', 'docx'],
    tags: ['data-retention', 'gdpr', 'compliance'],
  },
  {
    id: 'pol-006',
    policyId: 'DR-002',
    name: 'Backup & Archive Policy',
    description: 'Defines backup procedures and archive retention requirements',
    type: 'data_retention',
    frameworks: ['soc2-type1', 'soc2-type2', 'iso27001'],
    frameworkNames: ['SOC 2 Type I', 'SOC 2 Type II', 'ISO 27001'],
    status: 'active',
    approvalStatus: 'approved',
    version: '1.1',
    currentVersionId: 'v-006-1.1',
    versionHistory: [
      {
        id: 'v-006-1.1',
        version: '1.1',
        content: 'Updated backup frequency and retention periods',
        summary: 'Backup schedule update',
        changes: 'Changed daily backups to 30-day retention, monthly backups to 1-year retention',
        createdAt: '2024-01-08T09:00:00Z',
        createdBy: 'user-006',
        approvedAt: '2024-01-10T14:00:00Z',
        approvedBy: 'user-002',
        isCurrent: true,
      },
    ],
    ownerName: 'Robert Taylor',
    ownerEmail: 'robert.taylor@company.com',
    generationMethod: 'auto_generated',
    generatedFrom: {
      configs: ['backup-configs', 'archive-settings'],
      evidence: ['ev-011'],
      controls: ['ctrl-022'],
    },
    lastGenerated: '2024-01-08T09:00:00Z',
    generatedBy: 'system',
    syncStatus: 'in_sync',
    lastSyncCheck: '2024-01-20T08:00:00Z',
    content: `# Backup & Archive Policy

## 1. Purpose
This policy defines backup procedures, retention requirements, and recovery processes.

## 2. Backup Schedule
- **Daily Backups:** Full database backups, retained for 30 days
- **Weekly Backups:** Full system backups, retained for 12 weeks
- **Monthly Backups:** Complete system archives, retained for 1 year
- **Annual Backups:** Long-term archives, retained for 7 years

## 3. Backup Storage
- Backups are stored in geographically separate locations
- All backups are encrypted at rest
- Backup integrity is verified monthly
- Backup access is restricted to authorized personnel only

## 4. Recovery Procedures
- Recovery time objective (RTO): 4 hours
- Recovery point objective (RPO): 24 hours
- Recovery procedures are tested quarterly
- Recovery documentation is maintained and updated`,
    summary: 'Defines backup procedures and archive retention requirements',
    createdAt: '2023-09-15T00:00:00Z',
    createdBy: 'user-006',
    updatedAt: '2024-01-08T09:00:00Z',
    updatedBy: 'user-006',
    approvedAt: '2024-01-10T14:00:00Z',
    approvedBy: 'user-002',
    effectiveDate: '2024-01-10T00:00:00Z',
    reviewDate: '2025-01-10T00:00:00Z',
    attestationCount: 35,
    lastAttestationDate: '2024-01-16T00:00:00Z',
    evidenceIds: ['ev-011', 'ev-019'],
    controlIds: ['ctrl-022', 'ctrl-036'],
    exportFormats: ['pdf', 'docx'],
    tags: ['backup', 'archive', 'disaster-recovery'],
  },
  {
    id: 'pol-007',
    policyId: 'DR-003',
    name: 'Log Retention Policy',
    description: 'Defines log retention periods and access controls',
    type: 'data_retention',
    frameworks: ['soc2-type1', 'soc2-type2', 'iso27001'],
    frameworkNames: ['SOC 2 Type I', 'SOC 2 Type II', 'ISO 27001'],
    status: 'needs_review',
    approvalStatus: 'approved',
    version: '1.0',
    currentVersionId: 'v-007-1.0',
    versionHistory: [
      {
        id: 'v-007-1.0',
        version: '1.0',
        content: 'Initial log retention policy',
        summary: 'New policy',
        changes: 'Initial creation',
        createdAt: '2023-10-01T00:00:00Z',
        createdBy: 'user-007',
        approvedAt: '2023-10-05T12:00:00Z',
        approvedBy: 'user-002',
        isCurrent: true,
      },
    ],
    ownerName: 'Lisa Wang',
    ownerEmail: 'lisa.wang@company.com',
    generationMethod: 'auto_generated',
    generatedFrom: {
      configs: ['log-retention-configs'],
      evidence: ['ev-012'],
      controls: ['ctrl-024'],
    },
    lastGenerated: '2023-10-01T00:00:00Z',
    generatedBy: 'system',
    syncStatus: 'out_of_sync',
    lastSyncCheck: '2024-01-20T08:00:00Z',
    syncIssues: [
      'Policy requires 1-year retention for audit logs, but current configuration only retains for 90 days',
    ],
    content: `# Log Retention Policy

## 1. Purpose
This policy defines log retention periods and access controls for audit and security logs.

## 2. Log Types and Retention
- **Security Logs:** 90 days
- **Audit Logs:** 1 year
- **Application Logs:** 30 days
- **System Logs:** 90 days
- **Access Logs:** 1 year

## 3. Log Storage
- Logs are stored in centralized logging system
- Logs are encrypted at rest
- Log access is restricted and logged
- Log integrity is protected from tampering

## 4. Compliance
- Log retention meets regulatory requirements
- Logs are available for audit purposes
- Log deletion follows secure procedures`,
    summary: 'Defines log retention periods and access controls',
    createdAt: '2023-10-01T00:00:00Z',
    createdBy: 'user-007',
    updatedAt: '2023-10-01T00:00:00Z',
    updatedBy: 'user-007',
    approvedAt: '2023-10-05T12:00:00Z',
    approvedBy: 'user-002',
    effectiveDate: '2023-10-05T00:00:00Z',
    reviewDate: '2024-10-05T00:00:00Z',
    attestationCount: 32,
    lastAttestationDate: '2024-01-15T00:00:00Z',
    evidenceIds: ['ev-012'],
    controlIds: ['ctrl-024'],
    exportFormats: ['pdf', 'docx'],
    tags: ['logs', 'retention', 'audit'],
  },
  // Incident Response Policies
  {
    id: 'pol-008',
    policyId: 'IR-001',
    name: 'Incident Response Plan',
    description: 'Defines procedures for detecting, responding to, and recovering from security incidents',
    type: 'incident_response',
    frameworks: ['soc2-type1', 'soc2-type2', 'iso27001'],
    frameworkNames: ['SOC 2 Type I', 'SOC 2 Type II', 'ISO 27001'],
    status: 'active',
    approvalStatus: 'approved',
    version: '2.0',
    currentVersionId: 'v-008-2.0',
    versionHistory: [
      {
        id: 'v-008-2.0',
        version: '2.0',
        content: 'Major update to incident response procedures',
        summary: 'Enhanced incident response',
        changes: 'Added automated incident detection, updated escalation procedures, added communication templates',
        createdAt: '2024-01-03T10:00:00Z',
        createdBy: 'user-008',
        approvedAt: '2024-01-08T16:00:00Z',
        approvedBy: 'user-002',
        isCurrent: true,
      },
    ],
    ownerName: 'James Anderson',
    ownerEmail: 'james.anderson@company.com',
    generationMethod: 'auto_generated',
    generatedFrom: {
      configs: ['incident-response-configs', 'alerting-systems'],
      evidence: ['ev-013'],
      controls: ['ctrl-028'],
    },
    lastGenerated: '2024-01-03T10:00:00Z',
    generatedBy: 'system',
    syncStatus: 'in_sync',
    lastSyncCheck: '2024-01-20T08:00:00Z',
    content: `# Incident Response Plan

## 1. Purpose
This plan defines procedures for detecting, responding to, and recovering from security incidents.

## 2. Incident Classification
- **Critical:** Data breach, system compromise, service outage
- **High:** Unauthorized access, malware detection, suspicious activity
- **Medium:** Policy violations, failed access attempts
- **Low:** Informational alerts, minor policy deviations

## 3. Response Procedures
1. **Detection:** Automated detection and alerting
2. **Containment:** Isolate affected systems immediately
3. **Investigation:** Gather evidence and determine scope
4. **Eradication:** Remove threat and restore systems
5. **Recovery:** Restore normal operations
6. **Post-Incident:** Review and document lessons learned

## 4. Escalation
- Critical incidents: Immediate escalation to CISO and executive team
- High incidents: Escalate within 1 hour
- Medium incidents: Escalate within 4 hours
- Low incidents: Document and review weekly

## 5. Communication
- Internal notifications within 1 hour of detection
- External notifications per regulatory requirements
- Customer notifications for data breaches within 72 hours (GDPR)`,
    summary: 'Defines procedures for detecting, responding to, and recovering from security incidents',
    createdAt: '2023-07-01T00:00:00Z',
    createdBy: 'user-008',
    updatedAt: '2024-01-03T10:00:00Z',
    updatedBy: 'user-008',
    approvedAt: '2024-01-08T16:00:00Z',
    approvedBy: 'user-002',
    effectiveDate: '2024-01-08T00:00:00Z',
    reviewDate: '2025-01-08T00:00:00Z',
    attestationCount: 40,
    lastAttestationDate: '2024-01-18T00:00:00Z',
    evidenceIds: ['ev-013', 'ev-020'],
    controlIds: ['ctrl-028', 'ctrl-040'],
    exportFormats: ['pdf', 'docx'],
    tags: ['incident-response', 'security', 'crisis-management'],
  },
  {
    id: 'pol-009',
    policyId: 'IR-002',
    name: 'Security Incident Escalation Policy',
    description: 'Defines escalation procedures for security incidents',
    type: 'incident_response',
    frameworks: ['soc2-type1', 'iso27001'],
    frameworkNames: ['SOC 2 Type I', 'ISO 27001'],
    status: 'active',
    approvalStatus: 'approved',
    version: '1.1',
    currentVersionId: 'v-009-1.1',
    versionHistory: [
      {
        id: 'v-009-1.1',
        version: '1.1',
        content: 'Updated escalation timelines and contact information',
        summary: 'Escalation update',
        changes: 'Reduced escalation time for critical incidents to immediate, updated contact list',
        createdAt: '2024-01-06T11:00:00Z',
        createdBy: 'user-008',
        approvedAt: '2024-01-09T13:00:00Z',
        approvedBy: 'user-002',
        isCurrent: true,
      },
    ],
    ownerName: 'James Anderson',
    ownerEmail: 'james.anderson@company.com',
    generationMethod: 'manual',
    syncStatus: 'in_sync',
    lastSyncCheck: '2024-01-20T08:00:00Z',
    content: `# Security Incident Escalation Policy

## 1. Purpose
This policy defines escalation procedures and timelines for security incidents.

## 2. Escalation Levels
- **Level 1:** Security team (immediate)
- **Level 2:** Security manager (within 15 minutes)
- **Level 3:** CISO (within 30 minutes)
- **Level 4:** Executive team (within 1 hour)

## 3. Escalation Triggers
- Data breach or potential data breach
- System compromise or unauthorized access
- Service outage affecting customers
- Regulatory compliance violations

## 4. Communication Channels
- Primary: Slack #security-incidents channel
- Secondary: Email to security@company.com
- Emergency: Phone call to on-call security engineer`,
    summary: 'Defines escalation procedures and timelines for security incidents',
    createdAt: '2023-08-15T00:00:00Z',
    createdBy: 'user-008',
    updatedAt: '2024-01-06T11:00:00Z',
    updatedBy: 'user-008',
    approvedAt: '2024-01-09T13:00:00Z',
    approvedBy: 'user-002',
    effectiveDate: '2024-01-09T00:00:00Z',
    reviewDate: '2025-01-09T00:00:00Z',
    attestationCount: 28,
    lastAttestationDate: '2024-01-17T00:00:00Z',
    evidenceIds: ['ev-014'],
    controlIds: ['ctrl-029'],
    exportFormats: ['pdf', 'docx'],
    tags: ['incident-response', 'escalation'],
  },
  // AI Governance Policies
  {
    id: 'pol-010',
    policyId: 'AI-001',
    name: 'AI Usage Policy',
    description: 'Defines how AI and machine learning systems are used and governed',
    type: 'ai_governance',
    frameworks: ['soc2-type1', 'iso27001'],
    frameworkNames: ['SOC 2 Type I', 'ISO 27001'],
    status: 'active',
    approvalStatus: 'approved',
    version: '1.2',
    currentVersionId: 'v-010-1.2',
    versionHistory: [
      {
        id: 'v-010-1.2',
        version: '1.2',
        content: 'Added data privacy requirements for AI systems',
        summary: 'Privacy enhancement',
        changes: 'Added requirements for data anonymization, user consent, and data retention for AI training data',
        createdAt: '2024-01-14T09:00:00Z',
        createdBy: 'user-009',
        approvedAt: '2024-01-17T10:00:00Z',
        approvedBy: 'user-002',
        isCurrent: true,
      },
    ],
    ownerName: 'Patricia Martinez',
    ownerEmail: 'patricia.martinez@company.com',
    generationMethod: 'auto_generated',
    generatedFrom: {
      configs: ['ai-system-configs', 'ml-model-registry'],
      evidence: ['ev-015'],
      controls: ['ctrl-032'],
      observedBehavior: ['ai-usage-logs', 'model-deployments'],
    },
    lastGenerated: '2024-01-14T09:00:00Z',
    generatedBy: 'system',
    syncStatus: 'in_sync',
    lastSyncCheck: '2024-01-20T08:00:00Z',
    content: `# AI Usage Policy

## 1. Purpose
This policy defines how AI and machine learning systems are used, governed, and monitored.

## 2. AI System Inventory
- All AI/ML systems must be registered in the AI system inventory
- System details include: purpose, data sources, model type, deployment location
- Inventory is updated quarterly

## 3. Data Usage Guidelines
- Training data must be properly classified and labeled
- Personal data used for training requires explicit consent
- Data must be anonymized when possible
- Training data retention follows data retention policy

## 4. Model Governance
- All models must undergo security and bias reviews before deployment
- Model performance is monitored continuously
- Models are retrained or updated based on performance metrics
- Model versioning is tracked and documented

## 5. Risk Assessment
- AI systems are assessed for security, privacy, and ethical risks
- Risk assessments are conducted before deployment and annually thereafter
- High-risk systems require additional approval

## 6. Compliance
- AI usage complies with applicable regulations (GDPR, AI Act)
- User consent is obtained when required
- AI decisions affecting users are explainable and auditable`,
    summary: 'Defines how AI and machine learning systems are used and governed',
    createdAt: '2023-11-01T00:00:00Z',
    createdBy: 'user-009',
    updatedAt: '2024-01-14T09:00:00Z',
    updatedBy: 'user-009',
    approvedAt: '2024-01-17T10:00:00Z',
    approvedBy: 'user-002',
    effectiveDate: '2024-01-17T00:00:00Z',
    reviewDate: '2025-01-17T00:00:00Z',
    attestationCount: 25,
    lastAttestationDate: '2024-01-19T00:00:00Z',
    evidenceIds: ['ev-015', 'ev-021'],
    controlIds: ['ctrl-032', 'ctrl-042'],
    exportFormats: ['pdf', 'docx'],
    tags: ['ai', 'machine-learning', 'governance'],
  },
  {
    id: 'pol-011',
    policyId: 'AI-002',
    name: 'AI Data Governance Policy',
    description: 'Defines data governance requirements for AI systems',
    type: 'ai_governance',
    frameworks: ['iso27001', 'gdpr'],
    frameworkNames: ['ISO 27001', 'GDPR'],
    status: 'draft',
    approvalStatus: 'pending',
    version: '1.0',
    currentVersionId: 'v-011-1.0',
    versionHistory: [
      {
        id: 'v-011-1.0',
        version: '1.0',
        content: 'Initial draft of AI data governance policy',
        summary: 'New policy draft',
        changes: 'Initial creation',
        createdAt: '2024-01-19T10:00:00Z',
        createdBy: 'user-009',
        isCurrent: true,
      },
    ],
    ownerName: 'Patricia Martinez',
    ownerEmail: 'patricia.martinez@company.com',
    generationMethod: 'template_based',
    syncStatus: 'unknown',
    content: `# AI Data Governance Policy

## 1. Purpose
This policy defines data governance requirements for AI and machine learning systems.

## 2. Data Quality
- Training data must meet quality standards
- Data is validated before use in model training
- Data quality metrics are tracked and reported

## 3. Data Privacy
- Personal data is handled per GDPR requirements
- Data minimization principles are applied
- User consent is obtained when required

## 4. Data Security
- Training data is encrypted at rest and in transit
- Access to training data is restricted and logged
- Data is securely deleted when no longer needed`,
    summary: 'Defines data governance requirements for AI systems',
    createdAt: '2024-01-19T10:00:00Z',
    createdBy: 'user-009',
    updatedAt: '2024-01-19T10:00:00Z',
    updatedBy: 'user-009',
    exportFormats: ['pdf', 'docx'],
    tags: ['ai', 'data-governance', 'gdpr'],
  },
  {
    id: 'pol-012',
    policyId: 'AI-003',
    name: 'Model Deployment Policy',
    description: 'Defines requirements for deploying AI/ML models to production',
    type: 'ai_governance',
    frameworks: ['soc2-type1', 'iso27001'],
    frameworkNames: ['SOC 2 Type I', 'ISO 27001'],
    status: 'active',
    approvalStatus: 'approved',
    version: '1.0',
    currentVersionId: 'v-012-1.0',
    versionHistory: [
      {
        id: 'v-012-1.0',
        version: '1.0',
        content: 'Initial model deployment policy',
        summary: 'New policy',
        changes: 'Initial creation',
        createdAt: '2023-12-01T00:00:00Z',
        createdBy: 'user-009',
        approvedAt: '2023-12-05T14:00:00Z',
        approvedBy: 'user-002',
        isCurrent: true,
      },
    ],
    ownerName: 'Patricia Martinez',
    ownerEmail: 'patricia.martinez@company.com',
    generationMethod: 'auto_generated',
    generatedFrom: {
      configs: ['model-deployment-configs'],
      evidence: ['ev-016'],
      controls: ['ctrl-033'],
    },
    lastGenerated: '2023-12-01T00:00:00Z',
    generatedBy: 'system',
    syncStatus: 'out_of_sync',
    lastSyncCheck: '2024-01-20T08:00:00Z',
    syncIssues: [
      'Policy requires security review before deployment, but 2 models were deployed without review',
      'Model monitoring is not enabled for 1 production model',
      'Model versioning is not tracked for 1 model',
    ],
    content: `# Model Deployment Policy

## 1. Purpose
This policy defines requirements for deploying AI/ML models to production environments.

## 2. Pre-Deployment Requirements
- Security review and approval
- Bias and fairness assessment
- Performance validation on test data
- Documentation of model architecture and training process

## 3. Deployment Process
- Models are deployed through CI/CD pipeline
- Deployment requires approval from model owner and security team
- Rollback procedures are tested before deployment
- Deployment is logged and auditable

## 4. Post-Deployment Monitoring
- Model performance is monitored continuously
- Model predictions are logged for audit purposes
- Performance degradation triggers alerts
- Models are retrained or updated based on performance metrics

## 5. Version Control
- All model versions are tracked in model registry
- Model artifacts are versioned and stored securely
- Version history is maintained for audit purposes`,
    summary: 'Defines requirements for deploying AI/ML models to production',
    createdAt: '2023-12-01T00:00:00Z',
    createdBy: 'user-009',
    updatedAt: '2023-12-01T00:00:00Z',
    updatedBy: 'user-009',
    approvedAt: '2023-12-05T14:00:00Z',
    approvedBy: 'user-002',
    effectiveDate: '2023-12-05T00:00:00Z',
    reviewDate: '2024-12-05T00:00:00Z',
    attestationCount: 20,
    lastAttestationDate: '2024-01-16T00:00:00Z',
    evidenceIds: ['ev-016'],
    controlIds: ['ctrl-033'],
    exportFormats: ['pdf', 'docx'],
    tags: ['ai', 'model-deployment', 'ml-ops'],
  },
  // Vendor Risk Policies
  {
    id: 'pol-013',
    policyId: 'VR-001',
    name: 'Vendor Risk Management Policy',
    description: 'Defines how third-party vendors are assessed and managed',
    type: 'vendor_risk',
    frameworks: ['soc2-type1', 'soc2-type2', 'iso27001'],
    frameworkNames: ['SOC 2 Type I', 'SOC 2 Type II', 'ISO 27001'],
    status: 'active',
    approvalStatus: 'approved',
    version: '1.2',
    currentVersionId: 'v-013-1.2',
    versionHistory: [
      {
        id: 'v-013-1.2',
        version: '1.2',
        content: 'Enhanced vendor assessment requirements',
        summary: 'Assessment update',
        changes: 'Added requirement for annual security assessments, updated risk classification criteria',
        createdAt: '2024-01-11T09:00:00Z',
        createdBy: 'user-010',
        approvedAt: '2024-01-14T15:00:00Z',
        approvedBy: 'user-002',
        isCurrent: true,
      },
    ],
    ownerName: 'Thomas Brown',
    ownerEmail: 'thomas.brown@company.com',
    generationMethod: 'auto_generated',
    generatedFrom: {
      configs: ['vendor-assessment-configs'],
      evidence: ['ev-017'],
      controls: ['ctrl-034'],
    },
    lastGenerated: '2024-01-11T09:00:00Z',
    generatedBy: 'system',
    syncStatus: 'in_sync',
    lastSyncCheck: '2024-01-20T08:00:00Z',
    content: `# Vendor Risk Management Policy

## 1. Purpose
This policy defines how third-party vendors are assessed, approved, and managed to ensure security and compliance.

## 2. Vendor Classification
- **Critical Vendors:** Handle sensitive data or critical systems
- **High-Risk Vendors:** Access to company systems or data
- **Standard Vendors:** Limited access, standard security requirements
- **Low-Risk Vendors:** No access to systems or sensitive data

## 3. Assessment Requirements
- **Critical Vendors:** Annual security assessment, SOC 2 Type II report required
- **High-Risk Vendors:** Security questionnaire, annual review
- **Standard Vendors:** Basic security questionnaire
- **Low-Risk Vendors:** Minimal assessment

## 4. Contract Requirements
- Data processing agreements (DPA) for vendors handling personal data
- Security requirements and SLAs defined in contracts
- Right to audit clauses for critical vendors
- Incident notification requirements

## 5. Ongoing Monitoring
- Vendor security posture is monitored quarterly
- Security incidents involving vendors are tracked
- Vendor access is reviewed and updated as needed
- Vendor relationships are reviewed annually`,
    summary: 'Defines how third-party vendors are assessed and managed',
    createdAt: '2023-10-15T00:00:00Z',
    createdBy: 'user-010',
    updatedAt: '2024-01-11T09:00:00Z',
    updatedBy: 'user-010',
    approvedAt: '2024-01-14T15:00:00Z',
    approvedBy: 'user-002',
    effectiveDate: '2024-01-14T00:00:00Z',
    reviewDate: '2025-01-14T00:00:00Z',
    attestationCount: 30,
    lastAttestationDate: '2024-01-18T00:00:00Z',
    evidenceIds: ['ev-017', 'ev-022'],
    controlIds: ['ctrl-034', 'ctrl-041'],
    exportFormats: ['pdf', 'docx'],
    tags: ['vendor-risk', 'third-party', 'supply-chain'],
  },
  {
    id: 'pol-014',
    policyId: 'VR-002',
    name: 'Third-Party Security Assessment Policy',
    description: 'Defines security assessment procedures for third-party vendors',
    type: 'vendor_risk',
    frameworks: ['soc2-type1', 'iso27001'],
    frameworkNames: ['SOC 2 Type I', 'ISO 27001'],
    status: 'needs_review',
    approvalStatus: 'approved',
    version: '1.0',
    currentVersionId: 'v-014-1.0',
    versionHistory: [
      {
        id: 'v-014-1.0',
        version: '1.0',
        content: 'Initial third-party security assessment policy',
        summary: 'New policy',
        changes: 'Initial creation',
        createdAt: '2023-11-01T00:00:00Z',
        createdBy: 'user-010',
        approvedAt: '2023-11-05T11:00:00Z',
        approvedBy: 'user-002',
        isCurrent: true,
      },
    ],
    ownerName: 'Thomas Brown',
    ownerEmail: 'thomas.brown@company.com',
    generationMethod: 'manual',
    syncStatus: 'in_sync',
    lastSyncCheck: '2024-01-20T08:00:00Z',
    content: `# Third-Party Security Assessment Policy

## 1. Purpose
This policy defines security assessment procedures for evaluating third-party vendors.

## 2. Assessment Types
- **Security Questionnaire:** Standard security questions
- **Security Review:** Detailed review of vendor security practices
- **On-Site Assessment:** Physical security assessment (for critical vendors)
- **Penetration Testing:** Security testing (for high-risk vendors)

## 3. Assessment Criteria
- Security controls and practices
- Compliance certifications (SOC 2, ISO 27001)
- Incident response capabilities
- Data protection measures
- Business continuity planning

## 4. Assessment Process
1. Vendor completes security questionnaire
2. Security team reviews responses
3. Additional assessment if required
4. Risk rating assigned
5. Approval or rejection decision`,
    summary: 'Defines security assessment procedures for third-party vendors',
    createdAt: '2023-11-01T00:00:00Z',
    createdBy: 'user-010',
    updatedAt: '2023-11-01T00:00:00Z',
    updatedBy: 'user-010',
    approvedAt: '2023-11-05T11:00:00Z',
    approvedBy: 'user-002',
    effectiveDate: '2023-11-05T00:00:00Z',
    reviewDate: '2024-11-05T00:00:00Z',
    attestationCount: 22,
    lastAttestationDate: '2024-01-14T00:00:00Z',
    evidenceIds: ['ev-017'],
    controlIds: ['ctrl-034'],
    exportFormats: ['pdf', 'docx'],
    tags: ['vendor-risk', 'security-assessment'],
  },
  // Custom Policies
  {
    id: 'pol-015',
    policyId: 'CUST-001',
    name: 'Remote Work Security Policy',
    description: 'Defines security requirements for remote work environments',
    type: 'custom',
    category: 'Remote Work',
    frameworks: ['soc2-type1', 'iso27001'],
    frameworkNames: ['SOC 2 Type I', 'ISO 27001'],
    status: 'active',
    approvalStatus: 'approved',
    version: '1.1',
    currentVersionId: 'v-015-1.1',
    versionHistory: [
      {
        id: 'v-015-1.1',
        version: '1.1',
        content: 'Updated remote access requirements',
        summary: 'Remote access update',
        changes: 'Added requirement for company-managed devices, updated VPN requirements',
        createdAt: '2024-01-07T10:00:00Z',
        createdBy: 'user-011',
        approvedAt: '2024-01-10T13:00:00Z',
        approvedBy: 'user-002',
        isCurrent: true,
      },
    ],
    ownerName: 'Jennifer Lee',
    ownerEmail: 'jennifer.lee@company.com',
    generationMethod: 'manual',
    syncStatus: 'in_sync',
    lastSyncCheck: '2024-01-20T08:00:00Z',
    content: `# Remote Work Security Policy

## 1. Purpose
This policy defines security requirements for employees working remotely.

## 2. Device Requirements
- Company-managed devices are preferred
- Personal devices must meet security requirements
- All devices must have endpoint protection installed
- Devices must be encrypted

## 3. Network Security
- VPN is required for accessing company resources
- Public Wi-Fi must use VPN
- Home networks should be secured (WPA2/WPA3)

## 4. Access Controls
- Multi-factor authentication is required
- Access is granted based on job role
- Access is reviewed quarterly

## 5. Data Protection
- Sensitive data must not be stored on personal devices
- Data must be encrypted in transit and at rest
- Screen sharing requires approval for sensitive data`,
    summary: 'Defines security requirements for remote work environments',
    createdAt: '2023-09-01T00:00:00Z',
    createdBy: 'user-011',
    updatedAt: '2024-01-07T10:00:00Z',
    updatedBy: 'user-011',
    approvedAt: '2024-01-10T13:00:00Z',
    approvedBy: 'user-002',
    effectiveDate: '2024-01-10T00:00:00Z',
    reviewDate: '2025-01-10T00:00:00Z',
    attestationCount: 50,
    lastAttestationDate: '2024-01-20T00:00:00Z',
    evidenceIds: ['ev-023'],
    controlIds: ['ctrl-043'],
    exportFormats: ['pdf', 'docx'],
    tags: ['remote-work', 'security', 'vpn'],
  },
  {
    id: 'pol-016',
    policyId: 'CUST-002',
    name: 'Cloud Usage Policy',
    description: 'Defines requirements for using cloud services',
    type: 'custom',
    category: 'Cloud',
    frameworks: ['soc2-type1', 'soc2-type2', 'iso27001'],
    frameworkNames: ['SOC 2 Type I', 'SOC 2 Type II', 'ISO 27001'],
    status: 'active',
    approvalStatus: 'approved',
    version: '1.0',
    currentVersionId: 'v-016-1.0',
    versionHistory: [
      {
        id: 'v-016-1.0',
        version: '1.0',
        content: 'Initial cloud usage policy',
        summary: 'New policy',
        changes: 'Initial creation',
        createdAt: '2023-12-15T00:00:00Z',
        createdBy: 'user-012',
        approvedAt: '2023-12-20T10:00:00Z',
        approvedBy: 'user-002',
        isCurrent: true,
      },
    ],
    ownerName: 'Christopher White',
    ownerEmail: 'christopher.white@company.com',
    generationMethod: 'auto_generated',
    generatedFrom: {
      configs: ['cloud-service-configs', 'aws-accounts', 'azure-subscriptions'],
      evidence: ['ev-024'],
      controls: ['ctrl-044'],
    },
    lastGenerated: '2023-12-15T00:00:00Z',
    generatedBy: 'system',
    syncStatus: 'in_sync',
    lastSyncCheck: '2024-01-20T08:00:00Z',
    content: `# Cloud Usage Policy

## 1. Purpose
This policy defines requirements for using cloud services and platforms.

## 2. Approved Cloud Services
- AWS (primary cloud provider)
- Azure (secondary cloud provider)
- GCP (approved for specific use cases)
- Other services require approval

## 3. Security Requirements
- All cloud resources must be in approved accounts
- Encryption at rest and in transit is required
- Access controls follow least privilege principle
- All access is logged and monitored

## 4. Compliance
- Cloud services must meet compliance requirements (SOC 2, ISO 27001)
- Data residency requirements must be met
- Regular security assessments are conducted

## 5. Cost Management
- Cloud spending is monitored and budgeted
- Unused resources are identified and removed
- Cost optimization is performed quarterly`,
    summary: 'Defines requirements for using cloud services',
    createdAt: '2023-12-15T00:00:00Z',
    createdBy: 'user-012',
    updatedAt: '2023-12-15T00:00:00Z',
    updatedBy: 'user-012',
    approvedAt: '2023-12-20T10:00:00Z',
    approvedBy: 'user-002',
    effectiveDate: '2023-12-20T00:00:00Z',
    reviewDate: '2024-12-20T00:00:00Z',
    attestationCount: 35,
    lastAttestationDate: '2024-01-19T00:00:00Z',
    evidenceIds: ['ev-024'],
    controlIds: ['ctrl-044'],
    exportFormats: ['pdf', 'docx'],
    tags: ['cloud', 'aws', 'azure'],
  },
];

