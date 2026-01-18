# Policies Page Build Plan

## Overview
Build a comprehensive Compliance Policies page that auto-generates policies from system configurations, tracks versions and approvals, highlights policy-to-reality mismatches, and exports auditor-ready policy documents.

---

## 1. Purpose & Users

**Purpose:** Turn actual system behavior into formal documentation - ensure written policies match reality and stay up-to-date automatically.

**Primary Users:**
- Leadership / Executives
- Legal / Compliance teams
- Policy owners
- Auditors (read-only)

**Key Questions Answered:**
- "Do our written policies match reality?"
- "What policies need updating?"
- "Are we compliant with our own policies?"
- "What evidence supports our policies?"

---

## 2. Page Structure & Layout

### Header Section
- Page title: "Compliance Policies"
- Subtitle: "Auto-generate and manage policies that reflect your actual system state"
- Action buttons:
  - "Create Policy" (opens policy creation modal)
  - "Regenerate All" (regenerate all policies from current system state)
  - "Export All" (export all policies as ZIP)
  - "Bulk Actions" (bulk approval, archive, etc.)

### Summary Statistics (Top Bar)
- Total policies: X
- Active: Y
- Draft: Z
- Needs Review: W
- Out of Sync: V (policies that don't match reality)
- Approved: XX
- Overall policy compliance: XX%

### Filter & Search Bar
- Search by:
  - Policy name
  - Policy ID
  - Policy type
  - Framework name
  - Owner name
- Filter by:
  - Status (Draft / Active / Needs Review / Archived)
  - Policy Type (Security / Data Retention / Incident Response / AI Governance / Vendor Risk / Custom)
  - Framework (multi-select)
  - Sync Status (In Sync / Out of Sync / Unknown)
  - Approval Status (Approved / Pending / Rejected)
  - Last modified date range
  - Owner (multi-select)

### View Options
- **Table View** (default) - Compact list view
- **Card View** - Detailed card layout
- **Grouped View** - Group by policy type or framework

### Policies Table/List
- Sortable columns
- Expandable rows for details
- Bulk selection (checkboxes)
- Quick actions per row
- Sync status indicators

---

## 3. Policy Data Structure

### Policy Object
```typescript
interface Policy {
  id: string;
  policyId: string; // e.g., "POL-001", "SEC-001"
  name: string;
  description?: string;
  
  // Type & Category
  type: 'security' | 'data_retention' | 'incident_response' | 'ai_governance' | 'vendor_risk' | 'custom';
  category?: string; // Custom category if type is 'custom'
  
  // Framework mapping
  frameworks: string[]; // Framework IDs
  frameworkNames: string[]; // Display names
  
  // Status
  status: 'draft' | 'active' | 'needs_review' | 'archived';
  approvalStatus: 'approved' | 'pending' | 'rejected';
  
  // Versioning
  version: string; // e.g., "1.0", "2.3"
  versionHistory: PolicyVersion[];
  currentVersionId: string;
  
  // Ownership
  ownerId?: string;
  ownerName?: string;
  ownerEmail?: string;
  coOwners?: string[]; // User IDs
  
  // Generation
  generationMethod: 'auto_generated' | 'manual' | 'template_based';
  generatedFrom?: {
    configs?: string[]; // Config sources
    evidence?: string[]; // Evidence IDs
    controls?: string[]; // Control IDs
    observedBehavior?: string[]; // Behavioral observations
  };
  lastGenerated?: string; // ISO date
  generatedBy?: string; // User ID or 'system'
  
  // Sync Status
  syncStatus: 'in_sync' | 'out_of_sync' | 'unknown';
  lastSyncCheck?: string; // ISO date
  syncIssues?: string[]; // List of mismatches with reality
  
  // Content
  content: string; // Full policy text (markdown or HTML)
  summary?: string; // Executive summary
  sections?: PolicySection[];
  
  // Metadata
  createdAt: string; // ISO date
  createdBy?: string; // User ID
  updatedAt: string; // ISO date
  updatedBy?: string; // User ID
  approvedAt?: string; // ISO date
  approvedBy?: string; // User ID
  effectiveDate?: string; // ISO date
  reviewDate?: string; // ISO date (next scheduled review)
  
  // Attestations
  attestations?: PolicyAttestation[];
  attestationCount?: number;
  lastAttestationDate?: string;
  
  // Evidence & Controls
  evidenceIds?: string[]; // Evidence supporting this policy
  controlIds?: string[]; // Controls related to this policy
  
  // Export
  exportFormats?: ('pdf' | 'docx' | 'html' | 'markdown')[];
  
  // Tags
  tags?: string[];
}
```

### Policy Version Object
```typescript
interface PolicyVersion {
  id: string;
  version: string;
  content: string;
  summary?: string;
  changes?: string; // Changelog for this version
  createdAt: string;
  createdBy?: string;
  approvedAt?: string;
  approvedBy?: string;
  isCurrent: boolean;
}
```

### Policy Section Object
```typescript
interface PolicySection {
  id: string;
  title: string;
  content: string;
  order: number;
  generatedFrom?: string[]; // What this section was generated from
}
```

### Policy Attestation Object
```typescript
interface PolicyAttestation {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  role?: string;
  attestedAt: string;
  acknowledged: boolean;
  comments?: string;
}
```

---

## 4. Policy Types & Templates

### 1. Information Security Policy
- **Purpose:** Defines security controls, access management, encryption standards
- **Generated From:**
  - IAM configurations
  - Encryption settings
  - Access control policies
  - Security tool configurations
- **Key Sections:**
  - Access Control
  - Encryption Standards
  - Authentication Requirements
  - Network Security
  - Incident Response Procedures

### 2. Data Retention Policy
- **Purpose:** Defines how long data is retained and when it's deleted
- **Generated From:**
  - Database retention settings
  - Log retention configurations
  - Backup retention policies
  - Data classification logs
- **Key Sections:**
  - Data Classification
  - Retention Periods by Type
  - Deletion Procedures
  - Backup & Archive Policies

### 3. Incident Response Plan
- **Purpose:** Defines procedures for security incidents
- **Generated From:**
  - Incident history
  - Security tool configurations
  - Alerting systems
  - Response team configurations
- **Key Sections:**
  - Incident Classification
  - Response Procedures
  - Escalation Paths
  - Communication Plans
  - Post-Incident Review

### 4. AI Usage & Governance Policy
- **Purpose:** Defines how AI/ML systems are used and governed
- **Generated From:**
  - AI/ML system usage logs
  - Data classification for AI
  - Model deployment configurations
  - AI monitoring data
- **Key Sections:**
  - AI System Inventory
  - Data Usage Guidelines
  - Model Governance
  - Risk Assessment Procedures
  - Compliance Requirements

### 5. Vendor Risk Policy
- **Purpose:** Defines how third-party vendors are assessed and managed
- **Generated From:**
  - Vendor inventory
  - Vendor assessment data
  - Contract terms
  - Risk assessments
- **Key Sections:**
  - Vendor Classification
  - Assessment Procedures
  - Risk Management
  - Contract Requirements
  - Ongoing Monitoring

### 6. Custom Policies
- **Purpose:** Organization-specific policies
- **Generated From:**
  - Custom configurations
  - Manual input
  - Template-based

---

## 5. Policy Generation Features

### Auto-Generation from System State

#### Configuration-Based Generation
- **Source:** System configurations, IAM policies, security settings
- **Process:**
  1. Scan relevant system configurations
  2. Extract policy-relevant settings
  3. Map to policy sections
  4. Generate policy text
  5. Flag any missing configurations

#### Evidence-Based Generation
- **Source:** Existing evidence, control evaluations
- **Process:**
  1. Review evidence linked to controls
  2. Extract policy statements from evidence
  3. Generate policy sections based on evidence
  4. Ensure policy matches evidence

#### Behavior-Based Generation
- **Source:** Observed system behavior, logs, monitoring data
- **Process:**
  1. Analyze system behavior patterns
  2. Identify actual practices
  3. Generate policy that reflects reality
  4. Flag discrepancies with existing policies

### Template-Based Generation
- Pre-built templates for each policy type
- Customizable sections
- Framework-specific templates (SOC 2, ISO 27001, etc.)
- Variable substitution from system data

### Manual Policy Creation
- Rich text editor
- Section-based editing
- Template selection
- Framework mapping

---

## 6. Versioning & Approval Workflow

### Version Management
- **Automatic Versioning:** New version created on significant changes
- **Version History:** Full history of all versions
- **Version Comparison:** Diff view between versions
- **Rollback:** Ability to revert to previous version

### Approval Workflow
1. **Draft** → Policy created or regenerated
2. **Review** → Assigned to owner/reviewer
3. **Pending Approval** → Submitted for approval
4. **Approved** → Approved by authorized user
5. **Active** → Policy is live and effective
6. **Needs Review** → Scheduled review or triggered by sync issues
7. **Archived** → Policy no longer in use

### Approval Roles
- **Policy Owner:** Primary owner, can edit and submit for approval
- **Co-Owners:** Can edit but may need approval
- **Approvers:** Authorized to approve policies (typically leadership/legal)
- **Reviewers:** Can review and comment but not approve

### Attestation Tracking
- Track who has read/acknowledged policies
- Required attestations by role
- Attestation deadlines
- Reminder notifications

---

## 7. Policy-to-Reality Comparison

### Sync Status Indicators
- **In Sync:** Policy matches current system state
- **Out of Sync:** Discrepancies detected
- **Unknown:** Unable to verify (missing data/access)

### Mismatch Detection
- Compare policy statements to actual configurations
- Compare policy to observed behavior
- Compare policy to evidence
- Flag discrepancies automatically

### Sync Issues Display
- List of specific mismatches
- Severity of each mismatch
- Recommended actions
- "Fix Policy" vs "Fix System" recommendations

### Auto-Sync Options
- **Auto-update policy:** Update policy to match reality
- **Flag for review:** Mark policy as needing review
- **Generate alert:** Notify policy owner of mismatch

---

## 8. UI Components

### Policy List/Table View

#### Columns
- **Checkbox** (bulk selection)
- **Policy Name** (with type badge)
- **Type** (Security, Data Retention, etc.)
- **Status** (Draft, Active, Needs Review)
- **Sync Status** (In Sync, Out of Sync indicator)
- **Version** (current version number)
- **Owner** (owner name/avatar)
- **Frameworks** (framework badges)
- **Last Modified** (date with relative time)
- **Actions** (view, edit, export, regenerate)

#### Row Expansion
- Policy summary
- Quick sync status
- Recent changes
- Quick actions

### Policy Card View

#### Card Components
- Policy name and type badge
- Status indicators (status, sync, approval)
- Owner information
- Framework badges
- Sync status with issues count
- Version information
- Last modified date
- Quick actions (view, edit, export, regenerate)
- Preview of policy summary

### Policy Detail View/Modal

#### Tabs
1. **Overview**
   - Policy information
   - Status and approval
   - Owner and co-owners
   - Framework mapping
   - Sync status and issues
   - Attestations summary

2. **Content**
   - Full policy text (read-only or editable)
   - Section navigation
   - Generated from indicators
   - Edit mode toggle

3. **Versions**
   - Version history list
   - Version comparison
   - Rollback option
   - Version details

4. **Attestations**
   - List of attestations
   - Required vs completed
   - Attestation status by role
   - Send reminder option

5. **Evidence & Controls**
   - Linked evidence
   - Related controls
   - Supporting documentation

6. **History**
   - Change log
   - Approval history
   - Activity timeline

### Policy Creation/Edit Modal

#### Steps
1. **Basic Information**
   - Policy name
   - Type selection
   - Description
   - Framework mapping

2. **Generation Method**
   - Auto-generate from system state
   - Use template
   - Manual creation
   - Import from file

3. **Content**
   - Rich text editor
   - Section management
   - Template sections
   - Variable substitution

4. **Review & Publish**
   - Preview
   - Assign owner
   - Submit for approval

### Sync Status Component
- Visual indicator (icon + color)
- Issues count badge
- Expandable issues list
- Quick fix actions

### Policy Status Badge Component
- Color-coded status
- Status text
- Approval indicator

---

## 9. Integration Points

### Evidence Integration
- Link evidence to policies
- Show evidence supporting policy statements
- Auto-link evidence when generating policies

### Controls Integration
- Link controls to policies
- Show which controls enforce policy
- Policy compliance through control evaluation

### Framework Integration
- Map policies to frameworks
- Show framework requirements met by policies
- Framework-specific policy templates

### User Management Integration
- Policy owner assignment
- Approval workflow integration
- Attestation tracking by user

### System Configuration Integration
- Read system configurations for auto-generation
- Monitor configuration changes
- Alert on policy mismatches

---

## 10. Export Capabilities

### Export Formats
- **PDF:** Formatted policy document
- **DOCX:** Microsoft Word document
- **HTML:** Web-friendly format
- **Markdown:** Source format

### Export Options
- Single policy export
- Bulk export (multiple policies)
- Export all active policies
- Export by framework
- Export with evidence pack

### Export Customization
- Include/exclude sections
- Add cover page
- Include version history
- Include attestations
- Include evidence links

---

## 11. Mock Data Structure

### Sample Policies (15+ Policies)

#### Information Security Policies
1. **Access Control Policy** (Active, In Sync)
2. **Encryption Policy** (Active, Out of Sync - 2 issues)
3. **Authentication Policy** (Active, In Sync)
4. **Network Security Policy** (Draft, Unknown)

#### Data Retention Policies
5. **Data Retention Policy** (Active, In Sync)
6. **Backup & Archive Policy** (Active, In Sync)
7. **Log Retention Policy** (Needs Review, Out of Sync - 1 issue)

#### Incident Response Policies
8. **Incident Response Plan** (Active, In Sync)
9. **Security Incident Escalation Policy** (Active, In Sync)

#### AI Governance Policies
10. **AI Usage Policy** (Active, In Sync)
11. **AI Data Governance Policy** (Draft, Unknown)
12. **Model Deployment Policy** (Active, Out of Sync - 3 issues)

#### Vendor Risk Policies
13. **Vendor Risk Management Policy** (Active, In Sync)
14. **Third-Party Security Assessment Policy** (Needs Review, In Sync)

#### Custom Policies
15. **Remote Work Security Policy** (Active, In Sync)
16. **Cloud Usage Policy** (Active, In Sync)

---

## 12. API Endpoints (Backend Requirements)

### Policy Management
- `GET /api/compliance/policies` - List all policies
- `GET /api/compliance/policies/:id` - Get policy details
- `POST /api/compliance/policies` - Create policy
- `PUT /api/compliance/policies/:id` - Update policy
- `DELETE /api/compliance/policies/:id` - Archive policy

### Policy Generation
- `POST /api/compliance/policies/generate` - Generate policy from system state
- `POST /api/compliance/policies/:id/regenerate` - Regenerate specific policy
- `POST /api/compliance/policies/regenerate-all` - Regenerate all policies

### Versioning
- `GET /api/compliance/policies/:id/versions` - Get version history
- `GET /api/compliance/policies/:id/versions/:versionId` - Get specific version
- `POST /api/compliance/policies/:id/versions/:versionId/rollback` - Rollback to version

### Approval Workflow
- `POST /api/compliance/policies/:id/submit` - Submit for approval
- `POST /api/compliance/policies/:id/approve` - Approve policy
- `POST /api/compliance/policies/:id/reject` - Reject policy

### Sync Status
- `GET /api/compliance/policies/:id/sync-status` - Get sync status
- `POST /api/compliance/policies/:id/sync-check` - Trigger sync check
- `GET /api/compliance/policies/:id/sync-issues` - Get sync issues

### Attestations
- `GET /api/compliance/policies/:id/attestations` - Get attestations
- `POST /api/compliance/policies/:id/attest` - Create attestation
- `POST /api/compliance/policies/:id/attestations/remind` - Send reminder

### Export
- `GET /api/compliance/policies/:id/export` - Export policy
- `POST /api/compliance/policies/export-bulk` - Bulk export

---

## 13. Implementation Phases

### Phase 1: Basic Policy Management
- Policy list/table view
- Policy detail view
- Basic CRUD operations
- Status management
- Simple export (PDF)

### Phase 2: Versioning & Approval
- Version history
- Approval workflow
- Attestation tracking
- Policy owner management

### Phase 3: Auto-Generation
- Template-based generation
- Configuration-based generation
- Evidence-based generation
- Regenerate functionality

### Phase 4: Sync & Comparison
- Sync status detection
- Mismatch identification
- Sync issues display
- Auto-sync options

### Phase 5: Advanced Features
- Behavior-based generation
- Advanced export options
- Bulk operations
- Policy analytics

---

## 14. Success Metrics

### User Engagement
- Number of policies created/managed
- Policy update frequency
- Attestation completion rate

### Policy Quality
- Sync status (target: >90% in sync)
- Policy-to-reality alignment
- Approval time (target: <7 days)

### Operational Efficiency
- Time to generate policy (target: <5 minutes)
- Time to approve policy (target: <3 days)
- Reduction in manual policy updates

### Compliance Impact
- Framework coverage (policies mapped to frameworks)
- Evidence linkage (policies with supporting evidence)
- Audit readiness (policies ready for audit)

---

## 15. Design Considerations

### User Experience
- **Clear Status Indicators:** Visual sync status, approval status
- **Actionable Insights:** Clear recommendations for mismatches
- **Efficient Workflows:** Bulk operations, quick actions
- **Contextual Help:** Tooltips, guidance for policy creation

### Performance
- **Lazy Loading:** Load policy content on demand
- **Caching:** Cache policy content and sync status
- **Background Processing:** Generate policies asynchronously

### Security
- **Access Control:** Role-based access to policies
- **Audit Trail:** Log all policy changes
- **Approval Controls:** Enforce approval workflow

### Scalability
- **Pagination:** Handle large policy lists
- **Search Optimization:** Fast search across policies
- **Export Optimization:** Efficient bulk exports

---

## 16. Related Components to Build

### Policy Components
- `PolicyCard` - Card view component
- `PolicyTable` - Table view component
- `PolicyDetailDrawer` - Side drawer for policy details
- `PolicyStatusBadge` - Status indicator
- `PolicySyncStatus` - Sync status indicator
- `PolicyVersionHistory` - Version history viewer
- `PolicyAttestationList` - Attestation management
- `PolicyEditor` - Rich text editor for policies
- `PolicyGenerationModal` - Policy generation wizard
- `PolicyExportModal` - Export options modal

### Shared Components
- Reuse components from Controls and Evidence pages where applicable
- Status badges, filters, search bars, etc.

---

## 17. Next Steps

1. **Review & Approve Plan** - Get stakeholder approval
2. **Create Mock Data** - Generate sample policy data
3. **Build Phase 1** - Basic policy management
4. **User Testing** - Test with compliance team
5. **Iterate** - Refine based on feedback
6. **Phase 2+** - Implement advanced features

---

**Last Updated:** 2024
**Status:** Planning Phase

