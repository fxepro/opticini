# Compliance Module Database Setup Summary

## Created Apps

Following the project convention of separate apps per feature, the following 6 Django apps were created:

1. **compliance_frameworks** - Framework definitions and metrics
2. **compliance_controls** - Control definitions and evaluations  
3. **compliance_evidence** - Evidence collection and storage
4. **compliance_policies** - Policy management and versioning
5. **compliance_audits** - Audit sessions and findings
6. **compliance_reports** - Report generation and sharing

## Database Tables Created

### compliance_frameworks
- `compliance_frameworks` (1 table)

### compliance_controls
- `compliance_controls` (1 table)
- `compliance_control_framework_mappings` (junction table)

### compliance_evidence
- `compliance_evidence` (1 table)
- `compliance_evidence_control_mappings` (junction table)

### compliance_policies
- `compliance_policies` (1 table)
- `compliance_policy_versions` (version history)
- `compliance_policy_attestations` (user attestations)
- `compliance_policy_framework_mappings` (junction table)
- `compliance_policies_co_owners` (many-to-many for co-owners)

### compliance_audits
- `compliance_audits` (1 table)
- `compliance_audit_findings` (audit findings)
- `compliance_audit_auditors` (assigned auditors)
- `compliance_audit_framework_mappings` (junction table)

### compliance_reports
- `compliance_reports` (1 table)
- `compliance_report_shares` (share links)
- `compliance_report_framework_mappings` (junction table)

**Total: 15 tables**

## Key Features

### UUID Primary Keys
All tables use UUID primary keys for better distribution and security.

### Multi-Tenant Support
All main tables include `organization_id` for multi-tenant isolation.

### Many-to-Many Relationships
Junction tables for:
- Controls ↔ Frameworks
- Evidence ↔ Controls
- Policies ↔ Frameworks
- Audits ↔ Frameworks
- Reports ↔ Frameworks

### JSON Fields
- `generated_from` (policies) - What policy was generated from
- `sections` (policies) - Structured policy sections
- `summary` (reports) - Report summary statistics

### Array Fields
- `failing_assets` (controls) - List of failing assets
- `fix_recommendations` (controls) - List of recommendations
- `related_control_ids` (controls) - Related control IDs
- `evidence_ids` (policies) - Related evidence IDs
- `control_ids` (policies) - Related control IDs
- `tags` (evidence, policies) - Tags
- `export_formats` (policies) - Available export formats
- `sync_issues` (policies) - List of sync issues
- `evidence_ids` (audits, findings) - Related evidence IDs

### Audit Trail
- All tables include `created_at`, `updated_at`
- User tracking via `created_by`, `updated_by`, `approved_by`, etc.
- Foreign keys use `SET_NULL` to preserve audit trail

### Indexes
Optimized indexes for:
- Unique constraints (IDs, codes)
- Common query patterns (status, type, organization)
- Foreign key lookups
- Date range queries

## Next Steps

### 1. Create Migrations

```bash
cd backend
python manage.py makemigrations compliance_frameworks
python manage.py makemigrations compliance_controls
python manage.py makemigrations compliance_evidence
python manage.py makemigrations compliance_policies
python manage.py makemigrations compliance_audits
python manage.py makemigrations compliance_reports
```

### 2. Apply Migrations

```bash
python manage.py migrate
```

### 3. Verify Tables

```bash
python manage.py dbshell
# Then in PostgreSQL:
\dt compliance_*
```

### 4. Create Admin Interfaces

Update `admin.py` files in each app to register models for Django admin.

### 5. Create API Endpoints

Create serializers and views for each app following the existing pattern.

## Dependencies

- **PostgreSQL** - Required for ArrayField and JSONField
- **Django 5.2+** - For latest features
- **django.contrib.postgres** - For ArrayField and JSONField support

## Notes

- All models follow Django best practices
- Foreign keys properly cascade or set null
- Indexes optimized for query performance
- Multi-tenant ready with organization_id
- Audit trail preserved with timestamps and user tracking

