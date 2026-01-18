# Compliance Module Database Schema

## Overview

The compliance module consists of 6 separate Django apps, each with its own database tables:

1. **compliance_frameworks** - Framework definitions and metrics
2. **compliance_controls** - Control definitions and evaluations
3. **compliance_evidence** - Evidence collection and storage
4. **compliance_policies** - Policy management and versioning
5. **compliance_audits** - Audit sessions and findings
6. **compliance_reports** - Report generation and sharing

---

## Schema: compliance_frameworks

### Table: compliance_frameworks

**Purpose:** Stores compliance framework definitions and aggregated metrics

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| name | VARCHAR(200) | NOT NULL | Framework name (e.g., "SOC 2 Type I") |
| code | VARCHAR(50) | UNIQUE, NOT NULL | Framework code (e.g., "SOC2-T1") |
| category | VARCHAR(20) | NOT NULL | Category: security, privacy, industry, regional |
| description | TEXT | | Framework description |
| icon | VARCHAR(50) | | Lucide icon name |
| enabled | BOOLEAN | DEFAULT TRUE | Whether framework is enabled |
| status | VARCHAR(20) | DEFAULT 'not_started' | Status: ready, in_progress, at_risk, not_started |
| compliance_score | INTEGER | 0-100 | Compliance score percentage |
| total_controls | INTEGER | DEFAULT 0 | Total number of controls |
| passing_controls | INTEGER | DEFAULT 0 | Number of passing controls |
| failing_controls | INTEGER | DEFAULT 0 | Number of failing controls |
| not_evaluated_controls | INTEGER | DEFAULT 0 | Number of controls not evaluated |
| last_evaluated | TIMESTAMP | NULL | Last evaluation date |
| next_audit_date | TIMESTAMP | NULL | Next scheduled audit date |
| organization_id | UUID | NULL | Organization/tenant ID |
| created_at | TIMESTAMP | AUTO | Creation timestamp |
| updated_at | TIMESTAMP | AUTO | Last update timestamp |
| created_by_id | INTEGER | FK(User) | User who created |

**Indexes:**
- `code` (unique)
- `(category, status)`
- `(enabled, status)`
- `organization_id`

---

## Schema: compliance_controls

### Table: compliance_controls

**Purpose:** Stores compliance control definitions and evaluation results

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| control_id | VARCHAR(100) | UNIQUE, NOT NULL | Control ID (e.g., "SOC2-CC6.1") |
| name | VARCHAR(300) | NOT NULL | Control name |
| description | TEXT | NOT NULL | Control description |
| status | VARCHAR(20) | DEFAULT 'not_evaluated' | Status: pass, fail, partial, not_evaluated |
| severity | VARCHAR(20) | DEFAULT 'medium' | Severity: critical, high, medium, low |
| last_evaluated | TIMESTAMP | NULL | Last evaluation date |
| evaluated_by_id | INTEGER | FK(User), NULL | User who evaluated |
| evaluation_method | VARCHAR(20) | DEFAULT 'automated' | Method: automated, manual, hybrid |
| failure_reason | TEXT | | Reason for failure |
| failing_assets | ARRAY[VARCHAR(200)] | | List of failing asset IDs/names |
| failing_count | INTEGER | DEFAULT 0 | Number of failing assets |
| uptime_percentage | FLOAT | 0-100, NULL | Control uptime percentage |
| time_out_of_compliance | INTEGER | NULL | Time out of compliance (minutes) |
| fix_recommendations | ARRAY[TEXT] | | List of fix recommendations |
| related_control_ids | ARRAY[UUID] | | Related control IDs |
| category | VARCHAR(100) | | Control category |
| control_type | VARCHAR(20) | DEFAULT 'preventive' | Type: preventive, detective, corrective |
| frequency | VARCHAR(20) | DEFAULT 'continuous' | Frequency: continuous, daily, weekly, monthly, annually |
| organization_id | UUID | NULL | Organization/tenant ID |
| created_at | TIMESTAMP | AUTO | Creation timestamp |
| updated_at | TIMESTAMP | AUTO | Last update timestamp |
| created_by_id | INTEGER | FK(User), NULL | User who created |

**Indexes:**
- `control_id` (unique)
- `(status, severity)`
- `evaluation_method`
- `organization_id`

### Table: compliance_control_framework_mappings

**Purpose:** Maps controls to frameworks (many-to-many)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| control_id | UUID | FK(compliance_controls) | Control ID |
| framework_id | UUID | NOT NULL | Framework ID |
| framework_name | VARCHAR(200) | NOT NULL | Framework name for display |
| created_at | TIMESTAMP | AUTO | Creation timestamp |

**Indexes:**
- `(control_id, framework_id)` (unique)
- `framework_id`

---

## Schema: compliance_evidence

### Table: compliance_evidence

**Purpose:** Stores compliance evidence (automated and manual)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| evidence_id | VARCHAR(100) | UNIQUE, NOT NULL | Evidence ID (e.g., "EV-001") |
| name | VARCHAR(300) | NOT NULL | Evidence name |
| description | TEXT | | Evidence description |
| source | VARCHAR(20) | NOT NULL | Source: automated, manual |
| source_type | VARCHAR(30) | NOT NULL | Type: ai_monitor, dast, security_scan, tls_scan, config_scan, manual_upload, system_log |
| source_name | VARCHAR(200) | NOT NULL | Source name |
| status | VARCHAR(20) | DEFAULT 'fresh' | Status: fresh, expired, expiring_soon |
| validity_period | INTEGER | NULL | Validity period in days |
| expires_at | TIMESTAMP | NULL | Expiration date |
| created_at | TIMESTAMP | AUTO | Creation timestamp |
| created_by_id | INTEGER | FK(User), NULL | User who created |
| uploaded_by_id | INTEGER | FK(User), NULL | User who uploaded (manual) |
| file_type | VARCHAR(50) | | File type (pdf, png, json, etc.) |
| file_size | BIGINT | NULL | File size in bytes |
| file_url | VARCHAR(500) | | URL to evidence file |
| preview_url | VARCHAR(500) | | URL to preview/thumbnail |
| content | TEXT | | Evidence content (text-based) |
| tags | ARRAY[VARCHAR(100)] | | Evidence tags |
| category | VARCHAR(100) | | Evidence category |
| audit_locked | BOOLEAN | DEFAULT FALSE | Whether locked for audit |
| audit_id | UUID | NULL | Audit ID if locked |
| organization_id | UUID | NULL | Organization/tenant ID |

**Indexes:**
- `evidence_id` (unique)
- `(source, source_type)`
- `(status, expires_at)`
- `(audit_locked, audit_id)`
- `organization_id`

### Table: compliance_evidence_control_mappings

**Purpose:** Maps evidence to controls (many-to-many)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| evidence_id | UUID | FK(compliance_evidence) | Evidence ID |
| control_id | UUID | NOT NULL | Control ID |
| control_name | VARCHAR(300) | NOT NULL | Control name for display |
| framework_id | UUID | NOT NULL | Framework ID |
| framework_name | VARCHAR(200) | NOT NULL | Framework name for display |
| created_at | TIMESTAMP | AUTO | Creation timestamp |

**Indexes:**
- `(evidence_id, control_id)` (unique)
- `control_id`
- `framework_id`

---

## Schema: compliance_policies

### Table: compliance_policies

**Purpose:** Stores compliance policies with versioning and sync status

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| policy_id | VARCHAR(100) | UNIQUE, NOT NULL | Policy ID (e.g., "POL-001") |
| name | VARCHAR(300) | NOT NULL | Policy name |
| description | TEXT | | Policy description |
| type | VARCHAR(30) | NOT NULL | Type: security, data_retention, incident_response, ai_governance, vendor_risk, custom |
| category | VARCHAR(100) | | Custom category if type is custom |
| status | VARCHAR(20) | DEFAULT 'draft' | Status: draft, active, needs_review, archived |
| approval_status | VARCHAR(20) | DEFAULT 'pending' | Approval: approved, pending, rejected |
| version | VARCHAR(20) | DEFAULT '1.0' | Current version |
| current_version_id | UUID | NULL | Current version ID |
| owner_id | INTEGER | FK(User), NULL | Policy owner |
| generation_method | VARCHAR(20) | DEFAULT 'manual' | Method: auto_generated, manual, template_based |
| generated_from | JSONB | | What policy was generated from |
| last_generated | TIMESTAMP | NULL | Last generation date |
| generated_by_id | INTEGER | FK(User), NULL | User/system that generated |
| sync_status | VARCHAR(20) | DEFAULT 'unknown' | Sync: in_sync, out_of_sync, unknown |
| last_sync_check | TIMESTAMP | NULL | Last sync check date |
| sync_issues | ARRAY[TEXT] | | List of sync issues |
| content | TEXT | NOT NULL | Full policy text |
| summary | TEXT | | Executive summary |
| sections | JSONB | | Policy sections (structured) |
| created_at | TIMESTAMP | AUTO | Creation timestamp |
| created_by_id | INTEGER | FK(User), NULL | User who created |
| updated_at | TIMESTAMP | AUTO | Last update timestamp |
| updated_by_id | INTEGER | FK(User), NULL | User who updated |
| approved_at | TIMESTAMP | NULL | Approval date |
| approved_by_id | INTEGER | FK(User), NULL | User who approved |
| effective_date | TIMESTAMP | NULL | Effective date |
| review_date | TIMESTAMP | NULL | Next review date |
| evidence_ids | ARRAY[UUID] | | Related evidence IDs |
| control_ids | ARRAY[UUID] | | Related control IDs |
| export_formats | ARRAY[VARCHAR(20)] | | Available export formats |
| tags | ARRAY[VARCHAR(100)] | | Policy tags |
| organization_id | UUID | NULL | Organization/tenant ID |

**Indexes:**
- `policy_id` (unique)
- `(type, status)`
- `sync_status`
- `approval_status`
- `organization_id`

### Table: compliance_policy_versions

**Purpose:** Policy version history

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| policy_id | UUID | FK(compliance_policies) | Policy ID |
| version | VARCHAR(20) | NOT NULL | Version number |
| content | TEXT | NOT NULL | Policy content for this version |
| summary | TEXT | | Version summary |
| changes | TEXT | | Changelog |
| is_current | BOOLEAN | DEFAULT FALSE | Whether this is current version |
| created_at | TIMESTAMP | AUTO | Creation timestamp |
| created_by_id | INTEGER | FK(User), NULL | User who created |
| approved_at | TIMESTAMP | NULL | Approval date |
| approved_by_id | INTEGER | FK(User), NULL | User who approved |

**Indexes:**
- `(policy_id, version)` (unique)
- `(policy_id, is_current)`

### Table: compliance_policy_attestations

**Purpose:** Policy attestations (user acknowledgments)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| policy_id | UUID | FK(compliance_policies) | Policy ID |
| user_id | INTEGER | FK(User) | User who attested |
| role | VARCHAR(50) | | User role at time of attestation |
| acknowledged | BOOLEAN | DEFAULT TRUE | Whether user acknowledged |
| comments | TEXT | | User comments |
| attested_at | TIMESTAMP | AUTO | Attestation date |

**Indexes:**
- `(policy_id, user_id)` (unique)
- `attested_at`

### Table: compliance_policy_framework_mappings

**Purpose:** Maps policies to frameworks (many-to-many)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| policy_id | UUID | FK(compliance_policies) | Policy ID |
| framework_id | UUID | NOT NULL | Framework ID |
| framework_name | VARCHAR(200) | NOT NULL | Framework name for display |
| created_at | TIMESTAMP | AUTO | Creation timestamp |

**Indexes:**
- `(policy_id, framework_id)` (unique)
- `framework_id`

### Table: compliance_policies_co_owners

**Purpose:** Many-to-many relationship for policy co-owners

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK | Primary key |
| compliancepolicy_id | UUID | FK(compliance_policies) | Policy ID |
| user_id | INTEGER | FK(User) | Co-owner user ID |

**Indexes:**
- `(compliancepolicy_id, user_id)` (unique)

---

## Schema: compliance_audits

### Table: compliance_audits

**Purpose:** Stores audit sessions and metadata

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| audit_id | VARCHAR(100) | UNIQUE, NOT NULL | Audit ID (e.g., "AUD-001") |
| name | VARCHAR(300) | NOT NULL | Audit name |
| description | TEXT | | Audit description |
| type | VARCHAR(30) | NOT NULL | Type: soc2_readiness, external_audit, internal_audit, customer_security_review, annual_review |
| status | VARCHAR(20) | DEFAULT 'planned' | Status: planned, in_progress, under_review, completed, cancelled |
| start_date | TIMESTAMP | NOT NULL | Audit start date |
| end_date | TIMESTAMP | NULL | Audit end date |
| scheduled_start_date | TIMESTAMP | NULL | Scheduled start date |
| scheduled_end_date | TIMESTAMP | NULL | Scheduled end date |
| evidence_locked | BOOLEAN | DEFAULT FALSE | Whether evidence is locked |
| evidence_freeze_date | TIMESTAMP | NULL | When evidence was frozen |
| evidence_count | INTEGER | DEFAULT 0 | Number of evidence items |
| evidence_ids | ARRAY[UUID] | | Locked evidence IDs |
| total_controls | INTEGER | DEFAULT 0 | Total number of controls |
| controls_passed | INTEGER | DEFAULT 0 | Number of controls passed |
| controls_failed | INTEGER | DEFAULT 0 | Number of controls failed |
| controls_partial | INTEGER | DEFAULT 0 | Number of controls partially compliant |
| controls_not_evaluated | INTEGER | DEFAULT 0 | Number of controls not evaluated |
| compliance_score | INTEGER | 0-100, NULL | Compliance score percentage |
| findings_count | INTEGER | DEFAULT 0 | Total number of findings |
| critical_findings | INTEGER | DEFAULT 0 | Number of critical findings |
| high_findings | INTEGER | DEFAULT 0 | Number of high findings |
| medium_findings | INTEGER | DEFAULT 0 | Number of medium findings |
| low_findings | INTEGER | DEFAULT 0 | Number of low findings |
| owner_id | INTEGER | FK(User), NULL | Audit owner |
| notes | TEXT | | Audit notes |
| summary | TEXT | | Audit summary |
| conclusion | TEXT | | Audit conclusion |
| created_at | TIMESTAMP | AUTO | Creation timestamp |
| created_by_id | INTEGER | FK(User), NULL | User who created |
| updated_at | TIMESTAMP | AUTO | Last update timestamp |
| updated_by_id | INTEGER | FK(User), NULL | User who updated |
| completed_at | TIMESTAMP | NULL | Completion date |
| previous_audit_id | UUID | FK(self), NULL | Previous audit in sequence |
| organization_id | UUID | NULL | Organization/tenant ID |

**Indexes:**
- `audit_id` (unique)
- `(type, status)`
- `(start_date, end_date)`
- `evidence_locked`
- `organization_id`

### Table: compliance_audit_findings

**Purpose:** Audit findings

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| audit_id | UUID | FK(compliance_audits) | Audit ID |
| finding_id | VARCHAR(100) | NOT NULL | Finding ID (e.g., "F-001") |
| title | VARCHAR(300) | NOT NULL | Finding title |
| description | TEXT | NOT NULL | Finding description |
| severity | VARCHAR(20) | NOT NULL | Severity: critical, high, medium, low, informational |
| status | VARCHAR(20) | DEFAULT 'open' | Status: open, in_remediation, resolved, accepted |
| control_id | UUID | NULL | Related control ID |
| control_name | VARCHAR(300) | | Control name |
| framework_id | UUID | NULL | Framework ID |
| framework_name | VARCHAR(200) | | Framework name |
| evidence_ids | ARRAY[UUID] | | Related evidence IDs |
| remediation_plan | TEXT | | Remediation plan |
| assigned_to | VARCHAR(200) | | Assigned to (user/team) |
| due_date | TIMESTAMP | NULL | Remediation due date |
| resolved_at | TIMESTAMP | NULL | Resolution date |
| created_at | TIMESTAMP | AUTO | Creation timestamp |

**Indexes:**
- `(audit_id, severity)`
- `(audit_id, status)`
- `control_id`

### Table: compliance_audit_auditors

**Purpose:** Auditors assigned to audits

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| audit_id | UUID | FK(compliance_audits) | Audit ID |
| user_id | INTEGER | FK(User), NULL | User if internal auditor |
| name | VARCHAR(200) | NOT NULL | Auditor name |
| email | VARCHAR(255) | NOT NULL | Auditor email |
| role | VARCHAR(20) | NOT NULL | Role: lead_auditor, auditor, reviewer |
| organization | VARCHAR(200) | | Auditor organization |
| access_granted_at | TIMESTAMP | NULL | When access was granted |
| last_access_at | TIMESTAMP | NULL | Last access timestamp |
| created_at | TIMESTAMP | AUTO | Creation timestamp |

**Indexes:**
- `(audit_id, email)` (unique)
- `(audit_id, role)`
- `user_id`

### Table: compliance_audit_framework_mappings

**Purpose:** Maps audits to frameworks (many-to-many)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| audit_id | UUID | FK(compliance_audits) | Audit ID |
| framework_id | UUID | NOT NULL | Framework ID |
| framework_name | VARCHAR(200) | NOT NULL | Framework name for display |
| created_at | TIMESTAMP | AUTO | Creation timestamp |

**Indexes:**
- `(audit_id, framework_id)` (unique)
- `framework_id`

---

## Schema: compliance_reports

### Table: compliance_reports

**Purpose:** Stores compliance reports and generation metadata

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| report_id | VARCHAR(100) | UNIQUE, NOT NULL | Report ID (e.g., "RPT-001") |
| name | VARCHAR(300) | NOT NULL | Report name |
| description | TEXT | | Report description |
| type | VARCHAR(30) | NOT NULL | Type: readiness, gap_analysis, continuous_monitoring, executive_summary, technical_report, auditor_report |
| status | VARCHAR(20) | DEFAULT 'pending' | Status: pending, generating, ready, failed |
| view | VARCHAR(20) | NOT NULL | View: executive, technical, auditor |
| date_range_start | TIMESTAMP | NULL | Report date range start |
| date_range_end | TIMESTAMP | NULL | Report date range end |
| includes_evidence | BOOLEAN | DEFAULT FALSE | Whether report includes evidence |
| evidence_count | INTEGER | NULL | Number of evidence items |
| includes_controls | BOOLEAN | DEFAULT FALSE | Whether report includes controls |
| control_count | INTEGER | NULL | Number of controls |
| includes_policies | BOOLEAN | DEFAULT FALSE | Whether report includes policies |
| policy_count | INTEGER | NULL | Number of policies |
| template_id | VARCHAR(100) | | Template ID used |
| template_name | VARCHAR(200) | | Template name |
| generated_at | TIMESTAMP | NULL | Generation date |
| generated_by_id | INTEGER | FK(User), NULL | User who generated |
| file_format | VARCHAR(20) | DEFAULT 'pdf' | Format: pdf, docx, html, zip, readonly_link |
| file_size | BIGINT | NULL | File size in bytes |
| file_url | VARCHAR(500) | | URL to report file |
| download_url | VARCHAR(500) | | Download URL |
| summary | JSONB | | Report summary statistics |
| error_message | TEXT | | Error message if failed |
| retry_count | INTEGER | DEFAULT 0 | Number of retry attempts |
| created_at | TIMESTAMP | AUTO | Creation timestamp |
| created_by_id | INTEGER | FK(User), NULL | User who created |
| updated_at | TIMESTAMP | AUTO | Last update timestamp |
| updated_by_id | INTEGER | FK(User), NULL | User who updated |
| organization_id | UUID | NULL | Organization/tenant ID |

**Indexes:**
- `report_id` (unique)
- `(type, status)`
- `status`
- `generated_at`
- `organization_id`

### Table: compliance_report_shares

**Purpose:** Report sharing links

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| report_id | UUID | FK(compliance_reports) | Report ID |
| link | VARCHAR(500) | UNIQUE, NOT NULL | Share link URL |
| expires_at | TIMESTAMP | NULL | Link expiration date |
| password_protected | BOOLEAN | DEFAULT FALSE | Whether link is password protected |
| password_hash | VARCHAR(255) | | Hashed password if protected |
| access_count | INTEGER | DEFAULT 0 | Number of times accessed |
| created_at | TIMESTAMP | AUTO | Creation timestamp |
| created_by_id | INTEGER | FK(User), NULL | User who created |

**Indexes:**
- `link` (unique)
- `report_id`
- `expires_at`

### Table: compliance_report_framework_mappings

**Purpose:** Maps reports to frameworks (many-to-many)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| report_id | UUID | FK(compliance_reports) | Report ID |
| framework_id | UUID | NOT NULL | Framework ID |
| framework_name | VARCHAR(200) | NOT NULL | Framework name for display |
| created_at | TIMESTAMP | AUTO | Creation timestamp |

**Indexes:**
- `(report_id, framework_id)` (unique)
- `framework_id`

---

## Relationships Summary

### Framework Relationships
- **Frameworks** ↔ **Controls**: Many-to-many via `compliance_control_framework_mappings`
- **Frameworks** ↔ **Policies**: Many-to-many via `compliance_policy_framework_mappings`
- **Frameworks** ↔ **Audits**: Many-to-many via `compliance_audit_framework_mappings`
- **Frameworks** ↔ **Reports**: Many-to-many via `compliance_report_framework_mappings`

### Control Relationships
- **Controls** ↔ **Evidence**: Many-to-many via `compliance_evidence_control_mappings`
- **Controls** ↔ **Policies**: Referenced via `control_ids` array in policies
- **Controls** ↔ **Audits**: Referenced in audit findings

### Evidence Relationships
- **Evidence** ↔ **Controls**: Many-to-many via `compliance_evidence_control_mappings`
- **Evidence** ↔ **Policies**: Referenced via `evidence_ids` array in policies
- **Evidence** ↔ **Audits**: Locked via `audit_id` and `audit_locked` in evidence

### Policy Relationships
- **Policies** ↔ **Versions**: One-to-many via `compliance_policy_versions`
- **Policies** ↔ **Attestations**: One-to-many via `compliance_policy_attestations`
- **Policies** ↔ **Co-owners**: Many-to-many via `compliance_policies_co_owners`

### Audit Relationships
- **Audits** ↔ **Findings**: One-to-many via `compliance_audit_findings`
- **Audits** ↔ **Auditors**: One-to-many via `compliance_audit_auditors`
- **Audits** ↔ **Previous Audit**: Self-referential via `previous_audit_id`

### Report Relationships
- **Reports** ↔ **Shares**: One-to-many via `compliance_report_shares`

---

## Database Setup Commands

### 1. Add apps to INSTALLED_APPS

Add to `backend/core/settings.py`:

```python
INSTALLED_APPS = [
    # ... existing apps ...
    'compliance_frameworks',
    'compliance_controls',
    'compliance_evidence',
    'compliance_policies',
    'compliance_audits',
    'compliance_reports',
]
```

### 2. Create Migrations

```bash
cd backend
python manage.py makemigrations compliance_frameworks
python manage.py makemigrations compliance_controls
python manage.py makemigrations compliance_evidence
python manage.py makemigrations compliance_policies
python manage.py makemigrations compliance_audits
python manage.py makemigrations compliance_reports
```

### 3. Apply Migrations

```bash
python manage.py migrate compliance_frameworks
python manage.py migrate compliance_controls
python manage.py migrate compliance_evidence
python manage.py migrate compliance_policies
python manage.py migrate compliance_audits
python manage.py migrate compliance_reports
```

Or migrate all at once:

```bash
python manage.py migrate
```

---

## Notes

- All primary keys use UUID for better distribution and security
- All tables include `organization_id` for multi-tenant support
- Many-to-many relationships use junction tables for flexibility
- JSONB fields are used for flexible data structures (generated_from, sections, summary)
- Array fields are used for simple lists (tags, evidence_ids, control_ids)
- All tables include created_at/updated_at timestamps
- Foreign keys use SET_NULL on delete for audit trail preservation
- Indexes are optimized for common query patterns

