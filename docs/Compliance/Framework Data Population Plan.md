# Framework Data Population Plan

**Purpose:** Populate Opticini database with SOC 2, PCI-DSS, and ISO 27001 frameworks, controls, and evidence requirements from authoritative sources.

**Date:** 2026-01-06

---

## Overview

This plan outlines the step-by-step process to:
1. Extract data from authoritative sources
2. Transform data to match Opticini schema
3. Load frameworks, controls, and evidence requirements into the database
4. Create framework-control mappings
5. Validate and test the data

---

## Phase 1: Data Source Preparation

### 1.1 Data Sources to Use

#### SOC 2
- **Primary Source:** OpenControl schemas
  - GitHub: https://github.com/opencontrol/schemas
  - GitHub: https://github.com/opencontrol/compliance-masonry
- **Secondary Sources:** Vendor mapping docs (AWS, Azure, GCP) for summaries

#### PCI-DSS
- **Primary Source:** complytime-pci-dss
  - GitHub: https://github.com/complytime/complytime-pci-dss
- **Reference:** PCI SSC Quick Guide (public)

#### ISO 27001/27002
- **Primary Sources:**
  - GitHub: https://github.com/center-for-threat-informed-defense/attack-control-framework-mappings
  - GitHub: https://github.com/OWASP/ASVS
- **Reference:** NIST ↔ ISO mappings, ENISA summaries

### 1.2 Data Extraction Methods

**Option A: Manual Data Files (Recommended for MVP)**
- Create JSON/YAML data files with normalized control data
- Store in `backend/compliance_frameworks/fixtures/` or `backend/compliance_frameworks/data/`
- Manually curated from authoritative sources

**Option B: Automated Scraping (Future)**
- Create scripts to fetch from GitHub repos
- Parse YAML/JSON from OpenControl, complytime-pci-dss
- Transform and validate before loading

**For Initial Implementation:** Use Option A (manual data files)

---

## Phase 2: Database Schema Mapping

### 2.1 Framework Records

**Target Model:** `ComplianceFramework`

**Required Fields:**
```python
{
    "name": "SOC 2 Type I",  # Full name
    "code": "SOC2-T1",       # Unique code
    "category": "security",  # security/privacy/industry/regional
    "description": "...",    # Framework description
    "icon": "ShieldCheck",   # Lucide icon name
    "enabled": True,
    "status": "not_started",
}
```

**Frameworks to Create:**
1. SOC 2 Type I (`SOC2-T1`)
2. SOC 2 Type II (`SOC2-T2`)
3. PCI-DSS v4.0 (`PCI-DSS-4`)
4. ISO/IEC 27001:2022 (`ISO27001-2022`)

### 2.2 Control Records

**Target Model:** `ComplianceControl`

**Required Fields:**
```python
{
    "control_id": "CC6.1",           # Unique control ID
    "name": "Logical Access Controls",  # Control title
    "description": "...",            # Summarized description (legal)
    "category": "CC6",              # Domain/category
    "control_type": "preventive",   # preventive/detective/corrective
    "severity": "high",             # critical/high/medium/low
    "status": "not_evaluated",
    "evaluation_method": "automated",  # automated/manual/hybrid
    "frequency": "continuous",      # continuous/daily/weekly/monthly/annually
}
```

**Control ID Format:**
- SOC 2: `CC6.1`, `CC6.2`, etc. (Common Criteria format)
- PCI-DSS: `1.1.1`, `1.1.2`, etc. (Requirement format)
- ISO 27001: `A.9.2.3`, `A.8.28`, etc. (Annex A format)

### 2.3 Framework-Control Mappings

**Target Model:** `ComplianceControlFrameworkMapping`

**Required Fields:**
```python
{
    "control": <ComplianceControl instance>,
    "framework_id": <UUID>,
    "framework_name": "SOC 2 Type I",  # Denormalized for display
}
```

### 2.4 Evidence Requirements

**Target Model:** `ControlEvidenceRequirement`

**Required Fields:**
```python
{
    "control": <ComplianceControl instance>,
    "evidence_type": "tls_scan",      # From EVIDENCE_TYPE_CHOICES
    "source_app": "SSLyze",           # Tool that produces evidence
    "freshness_days": 30,             # Max age in days
    "required": True,                 # Required vs optional
    "description": "TLS certificate scan results",
}
```

---

## Phase 3: Data Structure Design

### 3.1 Data File Structure

**Location:** `backend/compliance_frameworks/data/`

**File Organization:**
```
data/
├── frameworks/
│   ├── soc2.yaml
│   ├── pci-dss.yaml
│   └── iso27001.yaml
├── controls/
│   ├── soc2-controls.yaml
│   ├── pci-dss-controls.yaml
│   └── iso27001-controls.yaml
└── evidence-requirements/
    ├── soc2-evidence.yaml
    ├── pci-dss-evidence.yaml
    └── iso27001-evidence.yaml
```

### 3.2 Framework Data Format (YAML)

**Example: `frameworks/soc2.yaml`**
```yaml
frameworks:
  - name: "SOC 2 Type I"
    code: "SOC2-T1"
    category: "security"
    description: "Service Organization Control 2 Type I - Point in time assessment"
    icon: "ShieldCheck"
    enabled: true
    status: "not_started"
    
  - name: "SOC 2 Type II"
    code: "SOC2-T2"
    category: "security"
    description: "Service Organization Control 2 Type II - Period of time assessment"
    icon: "ShieldCheck"
    enabled: true
    status: "not_started"
```

### 3.3 Control Data Format (YAML)

**Example: `controls/soc2-controls.yaml`**
```yaml
controls:
  - control_id: "CC6.1"
    name: "Logical Access Controls"
    description: "Logical access to systems is restricted based on role and responsibility."
    category: "CC6"
    control_type: "preventive"
    severity: "high"
    evaluation_method: "automated"
    frequency: "continuous"
    frameworks: ["SOC2-T1", "SOC2-T2"]  # Framework codes
    
  - control_id: "CC6.2"
    name: "Physical Access Controls"
    description: "Physical access to systems is restricted and monitored."
    category: "CC6"
    control_type: "preventive"
    severity: "high"
    evaluation_method: "hybrid"
    frequency: "continuous"
    frameworks: ["SOC2-T1", "SOC2-T2"]
```

**Example: `controls/pci-dss-controls.yaml`**
```yaml
controls:
  - control_id: "1.1.1"
    name: "Firewall and router configuration standards"
    description: "Network security controls must be defined and maintained."
    category: "1"
    control_type: "preventive"
    severity: "critical"
    evaluation_method: "automated"
    frequency: "continuous"
    frameworks: ["PCI-DSS-4"]
    
  - control_id: "1.1.2"
    name: "Firewall rule review"
    description: "Firewall rules are reviewed and updated regularly."
    category: "1"
    control_type: "detective"
    severity: "high"
    evaluation_method: "hybrid"
    frequency: "monthly"
    frameworks: ["PCI-DSS-4"]
```

**Example: `controls/iso27001-controls.yaml`**
```yaml
controls:
  - control_id: "A.9.2.3"
    name: "Management of privileged access rights"
    description: "Privileged access must be restricted and monitored."
    category: "A.9"
    control_type: "preventive"
    severity: "high"
    evaluation_method: "automated"
    frequency: "continuous"
    frameworks: ["ISO27001-2022"]
    
  - control_id: "A.8.28"
    name: "Secure Coding"
    description: "Secure coding principles must be applied during development."
    category: "A.8"
    control_type: "preventive"
    severity: "high"
    evaluation_method: "hybrid"
    frequency: "continuous"
    frameworks: ["ISO27001-2022"]
```

### 3.4 Evidence Requirements Format (YAML)

**Example: `evidence-requirements/soc2-evidence.yaml`**
```yaml
evidence_requirements:
  - control_id: "CC6.1"
    evidence_type: "policy_document"
    source_app: "Manual"
    freshness_days: 365
    required: true
    description: "Access Control Policy document"
    
  - control_id: "CC6.1"
    evidence_type: "system_log"
    source_app: "System"
    freshness_days: 90
    required: true
    description: "Access control logs showing enforcement"
    
  - control_id: "CC6.2"
    evidence_type: "config_scan"
    source_app: "Manual"
    freshness_days: 90
    required: true
    description: "Physical access control system configuration"
```

---

## Phase 4: Management Command Implementation

### 4.1 Command Structure

**Location:** `backend/compliance_frameworks/management/commands/load_frameworks.py`

**Command Usage:**
```bash
python manage.py load_frameworks --framework soc2
python manage.py load_frameworks --framework pci-dss
python manage.py load_frameworks --framework iso27001
python manage.py load_frameworks --all  # Load all frameworks
```

### 4.2 Command Implementation Steps

1. **Parse YAML data files**
2. **Create/update Framework records**
3. **Create/update Control records**
4. **Create Framework-Control mappings**
5. **Create Evidence Requirements**
6. **Update Framework metrics** (total_controls count)
7. **Validate data integrity**

### 4.3 Command Features

- **Idempotent:** Can run multiple times safely (uses `update_or_create`)
- **Dry-run mode:** `--dry-run` flag to preview changes
- **Verbose logging:** `--verbosity 2` for detailed output
- **Selective loading:** Load specific frameworks or all
- **Validation:** Check for missing required fields
- **Rollback:** Option to clear and reload

---

## Phase 5: Implementation Steps

### Step 1: Create Data Directory Structure

```bash
mkdir -p backend/compliance_frameworks/data/{frameworks,controls,evidence-requirements}
```

### Step 2: Create Data Files

**Priority Order:**
1. **SOC 2** (Start with this - most common)
   - Extract from OpenControl schemas
   - Create `soc2.yaml`, `soc2-controls.yaml`, `soc2-evidence.yaml`
   - Target: ~67 controls (SOC 2 Common Criteria)

2. **PCI-DSS** (Second priority)
   - Extract from complytime-pci-dss
   - Create `pci-dss.yaml`, `pci-dss-controls.yaml`, `pci-dss-evidence.yaml`
   - Target: ~12 requirements, ~300+ sub-requirements

3. **ISO 27001** (Third priority)
   - Extract from attack-control-framework-mappings, OWASP ASVS
   - Create `iso27001.yaml`, `iso27001-controls.yaml`, `iso27001-evidence.yaml`
   - Target: ~114 controls (Annex A)

### Step 3: Create Management Command

**File:** `backend/compliance_frameworks/management/commands/load_frameworks.py`

**Key Functions:**
- `load_frameworks()` - Main command handler
- `load_framework_data()` - Load framework records
- `load_controls()` - Load control records
- `create_mappings()` - Create framework-control mappings
- `load_evidence_requirements()` - Load evidence requirements
- `update_framework_metrics()` - Update control counts

### Step 4: Create Data Extraction Scripts (Optional)

**For automated extraction from GitHub:**
- `scripts/extract_soc2_from_opencontrol.py`
- `scripts/extract_pci_dss_from_complytime.py`
- `scripts/extract_iso27001_from_sources.py`

### Step 5: Testing & Validation

**Test Cases:**
1. Load SOC 2 framework and verify controls
2. Load PCI-DSS and verify mappings
3. Load ISO 27001 and verify evidence requirements
4. Test idempotency (run command twice)
5. Test dry-run mode
6. Validate data integrity (no orphaned records)

---

## Phase 6: Data Population Details

### 6.1 SOC 2 Controls

**Domains (Common Criteria):**
- CC1 – Control Environment (~10 controls)
- CC2 – Communication & Information (~5 controls)
- CC3 – Risk Assessment (~5 controls)
- CC4 – Monitoring (~5 controls)
- CC5 – Control Activities (~10 controls)
- CC6 – Logical & Physical Access (~15 controls)
- CC7 – System Operations (~10 controls)
- CC8 – Change Management (~5 controls)
- CC9 – Risk Mitigation (~2 controls)

**Total:** ~67 controls

**Source:** OpenControl schemas + vendor mapping summaries

### 6.2 PCI-DSS Controls

**Requirements:**
- Req 1 – Network Security Controls (~20 sub-requirements)
- Req 2 – Secure Configurations (~15 sub-requirements)
- Req 3 – Protect Stored Data (~20 sub-requirements)
- Req 4 – Encrypt Transmission (~10 sub-requirements)
- Req 5 – Anti-virus (~5 sub-requirements)
- Req 6 – Secure Systems (~30 sub-requirements)
- Req 7 – Restrict Access (~10 sub-requirements)
- Req 8 – Identify Users (~15 sub-requirements)
- Req 9 – Physical Access (~10 sub-requirements)
- Req 10 – Monitor Networks (~15 sub-requirements)
- Req 11 – Test Security (~15 sub-requirements)
- Req 12 – Security Policy (~10 sub-requirements)

**Total:** ~180+ sub-requirements

**Source:** complytime-pci-dss GitHub repo

### 6.3 ISO 27001 Controls

**Annex A Domains:**
- A.5 – Organizational controls (~37 controls)
- A.6 – People controls (~8 controls)
- A.7 – Physical controls (~14 controls)
- A.8 – Technological controls (~34 controls)
- A.9 – Access control (~14 controls)
- A.10 – Cryptography (~2 controls)
- A.11 – Physical/Environmental (~15 controls)
- A.12 – Operations security (~14 controls)
- A.13 – Communications security (~7 controls)
- A.14 – System acquisition (~8 controls)
- A.15 – Supplier relationships (~5 controls)
- A.16 – Incident management (~7 controls)
- A.17 – Business continuity (~14 controls)
- A.18 – Compliance (~8 controls)

**Total:** ~114 controls

**Source:** attack-control-framework-mappings, OWASP ASVS, ENISA summaries

---

## Phase 7: Evidence Requirements Mapping

### 7.1 Evidence Types by Control Category

**Access Controls (CC6, A.9):**
- Policy documents (manual)
- System logs (automated)
- Access review reports (manual)

**Network Security (PCI Req 1, A.13):**
- TLS scans (automated - SSLyze)
- Security headers scans (automated - SecurityHeaders)
- Firewall configs (manual)

**System Operations (CC7, A.12):**
- Security scans (automated - OWASP ZAP, Trivy)
- Config scans (automated - Cloud Custodian)
- System logs (automated)

**Change Management (CC8, A.14):**
- Change control logs (manual)
- Approval records (manual)
- Deployment records (automated)

### 7.2 Evidence Requirements Strategy

**For Each Control:**
1. Identify required evidence types (2-4 per control typical)
2. Determine if automated or manual
3. Map to source tools (SSLyze, OWASP ZAP, etc.)
4. Set freshness requirements (30-365 days)
5. Mark as required or optional

**This is YOUR IP** - Not copyrighted, safe to define.

---

## Phase 8: Implementation Checklist

### Pre-Implementation
- [ ] Review authoritative data sources
- [ ] Understand legal boundaries (IDs, titles, summaries OK)
- [ ] Set up data directory structure
- [ ] Review existing database models

### Data Preparation
- [ ] Extract SOC 2 controls from OpenControl
- [ ] Extract PCI-DSS controls from complytime-pci-dss
- [ ] Extract ISO 27001 controls from sources
- [ ] Create normalized YAML data files
- [ ] Validate data format and completeness

### Command Development
- [ ] Create `load_frameworks.py` management command
- [ ] Implement framework loading
- [ ] Implement control loading
- [ ] Implement mapping creation
- [ ] Implement evidence requirements loading
- [ ] Add dry-run mode
- [ ] Add validation logic
- [ ] Add error handling

### Testing
- [ ] Test SOC 2 loading
- [ ] Test PCI-DSS loading
- [ ] Test ISO 27001 loading
- [ ] Test idempotency
- [ ] Test dry-run mode
- [ ] Validate data integrity
- [ ] Test API endpoints return correct data

### Documentation
- [ ] Document data file format
- [ ] Document command usage
- [ ] Document data sources and legal status
- [ ] Create troubleshooting guide

---

## Phase 9: Command Usage Examples

### Load Single Framework
```bash
cd backend
python manage.py load_frameworks --framework soc2
```

### Load All Frameworks
```bash
python manage.py load_frameworks --all
```

### Dry Run (Preview Changes)
```bash
python manage.py load_frameworks --all --dry-run
```

### Verbose Output
```bash
python manage.py load_frameworks --framework soc2 --verbosity 2
```

### Clear and Reload
```bash
python manage.py load_frameworks --framework soc2 --clear
```

---

## Phase 10: Data Validation Rules

### Framework Validation
- ✅ `code` must be unique
- ✅ `name` is required
- ✅ `category` must be valid choice
- ✅ `status` must be valid choice

### Control Validation
- ✅ `control_id` must be unique
- ✅ `name` is required
- ✅ `description` is required (summarized, not full text)
- ✅ `control_type` must be valid choice
- ✅ `severity` must be valid choice
- ✅ Must map to at least one framework

### Mapping Validation
- ✅ Control must exist
- ✅ Framework must exist
- ✅ No duplicate mappings (control + framework)

### Evidence Requirement Validation
- ✅ Control must exist
- ✅ `evidence_type` must be valid choice
- ✅ `freshness_days` must be positive
- ✅ No duplicate requirements (control + evidence_type + source_app)

---

## Phase 11: Post-Loading Tasks

### 11.1 Update Framework Metrics

After loading controls, update framework metrics:
- `total_controls` - Count of controls for framework
- `not_evaluated_controls` - Set to total_controls initially
- `passing_controls` - 0 initially
- `failing_controls` - 0 initially

### 11.2 Create Indexes

Ensure database indexes are created:
- `control_id` index
- `framework_id` index in mappings
- Composite indexes for lookups

### 11.3 Verify API Endpoints

Test that API endpoints return correct data:
- `/api/compliance/frameworks/` - Should show loaded frameworks
- `/api/compliance/controls/?framework_id={id}` - Should show controls
- `/api/compliance/frameworks/{id}/` - Should include nested controls

---

## Phase 12: Maintenance & Updates

### 12.1 Updating Control Data

**When to Update:**
- New framework versions released
- Control descriptions updated (summaries only)
- New controls added to framework

**How to Update:**
1. Update YAML data files
2. Re-run management command
3. Command uses `update_or_create` to update existing records

### 12.2 Adding New Frameworks

**Process:**
1. Research authoritative data source
2. Create data files following same format
3. Add framework to command
4. Run load command
5. Verify in UI

---

## Estimated Effort

### Data Extraction & Preparation
- **SOC 2:** 4-6 hours (67 controls)
- **PCI-DSS:** 6-8 hours (180+ controls)
- **ISO 27001:** 6-8 hours (114 controls)
- **Total:** 16-22 hours

### Command Development
- **Management command:** 4-6 hours
- **Testing:** 2-3 hours
- **Total:** 6-9 hours

### Evidence Requirements
- **SOC 2:** 2-3 hours (2-4 per control)
- **PCI-DSS:** 3-4 hours
- **ISO 27001:** 3-4 hours
- **Total:** 8-11 hours

### **Grand Total:** 30-42 hours

---

## Risk Mitigation

### Legal Risks
- ✅ Only use control IDs, titles, and summaries (legal)
- ✅ Do NOT copy full control text (copyrighted)
- ✅ Evidence requirements are your IP (safe)
- ✅ Use only from authorized sources (OpenControl, complytime, etc.)

### Technical Risks
- ✅ Use `update_or_create` for idempotency
- ✅ Validate data before loading
- ✅ Backup database before bulk loads
- ✅ Test in development first

### Data Quality Risks
- ✅ Validate all required fields
- ✅ Check for duplicate control_ids
- ✅ Verify framework-control mappings
- ✅ Test API endpoints after loading

---

## Success Criteria

✅ **Frameworks loaded:**
- SOC 2 Type I & II
- PCI-DSS v4.0
- ISO/IEC 27001:2022

✅ **Controls loaded:**
- ~67 SOC 2 controls
- ~180 PCI-DSS controls
- ~114 ISO 27001 controls

✅ **Mappings created:**
- All controls mapped to frameworks
- No orphaned records

✅ **Evidence requirements defined:**
- 2-4 requirements per control
- Mapped to source tools

✅ **API endpoints working:**
- Frameworks return with nested controls
- Controls return with framework info
- Evidence requirements accessible

✅ **UI displays data:**
- Frameworks page shows loaded frameworks
- Controls page shows controls
- Relationships visible

---

## Next Steps

1. **Start with SOC 2** (most common, smaller dataset)
2. **Create data files** manually from OpenControl
3. **Build management command** with basic functionality
4. **Test with SOC 2** before expanding
5. **Iterate and improve** based on results
6. **Add PCI-DSS and ISO 27001** once SOC 2 works

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-06  
**Status:** Ready for Implementation

