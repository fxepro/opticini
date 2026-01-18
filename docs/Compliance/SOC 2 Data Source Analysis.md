# SOC 2 Data Source Analysis

**Purpose:** Analyze what data is available from SOC 2 authoritative sources (OpenControl, vendor mappings)

**Date:** 2026-01-06

---

## Executive Summary

### Available Data from Sources

**OpenControl (Primary Source):**
- ✅ Control structure (Common Criteria format)
- ✅ Control IDs (CC1.1, CC6.1, etc.)
- ✅ Control names/titles
- ✅ Control descriptions (summarized)
- ✅ Domain/family mapping (CC1-CC9)
- ❌ No pre-defined evidence mappings
- ❌ No framework-to-framework mappings

**Vendor Mappings (Secondary Sources):**
- ✅ Control intent summaries
- ✅ Cloud service mappings (AWS, Azure, GCP)
- ❌ No structured control data
- ❌ No evidence definitions

---

## SOC 2 Framework Structure

### Trust Services Criteria (TSC)

SOC 2 has **5 Trust Services Criteria**, but **Security (Common Criteria) is mandatory** for all reports:

1. **Security (CC)** - Mandatory, 9 sub-criteria
2. **Availability (A)** - Optional, 3 sub-criteria
3. **Processing Integrity (PI)** - Optional, 5 sub-criteria
4. **Confidentiality (C)** - Optional, 2 sub-criteria
5. **Privacy (P)** - Optional, 18 sub-criteria

**Total if all 5 included:** 61 sub-criteria

### Common Criteria (CC) - Security (Mandatory)

**9 Sub-Criteria (Domains):**
1. **CC1** – Control Environment (~10-15 controls)
2. **CC2** – Communication & Information (~5-8 controls)
3. **CC3** – Risk Assessment (~5-8 controls)
4. **CC4** – Monitoring Activities (~5-8 controls)
5. **CC5** – Control Activities (~10-15 controls)
6. **CC6** – Logical & Physical Access Controls (~15-20 controls)
7. **CC7** – System Operations (~10-15 controls)
8. **CC8** – Change Management (~5-8 controls)
9. **CC9** – Risk Mitigation (~2-5 controls)

**Total Common Criteria Controls:** ~67-100 controls (varies by organization)

**Points of Focus:** ~200 points of focus for Security criterion alone

---

## What OpenControl Provides

### 1. Control Structure

**Format:**
```yaml
control_key: CC6.1
family: Common Criteria
name: Logical Access Controls
description: >
  Controls ensure logical access to systems is restricted.
```

**Available Fields:**
- `control_key` - Control ID (e.g., CC6.1, CC1.2)
- `family` - Domain/category (e.g., "Common Criteria", "CC6")
- `name` - Control title/name
- `description` - Summarized description (legal to use)

### 2. Number of Frameworks

**OpenControl provides:**
- ✅ SOC 2 Type I structure
- ✅ SOC 2 Type II structure (same controls, different evaluation period)
- ❌ Not separate frameworks - same control set

**In Opticini, we should create:**
- 2 Framework records: "SOC 2 Type I" and "SOC 2 Type II"
- Same controls mapped to both frameworks
- Different evaluation periods/requirements

### 3. Number of Controls

**From OpenControl:**
- **Common Criteria (CC1-CC9):** ~67-100 controls (varies)
- **Availability (A):** ~10-15 controls (if included)
- **Processing Integrity (PI):** ~15-20 controls (if included)
- **Confidentiality (C):** ~5-10 controls (if included)
- **Privacy (P):** ~30-40 controls (if included)

**Most Common (Security Only):**
- **~67 controls** for Common Criteria alone
- **~80-110 controls** typical for full Security TSC implementation

**Note:** Exact count varies because:
- Controls are organization-specific
- Some controls may be combined
- Points of focus can become separate controls

### 4. Evidence Points

**OpenControl does NOT provide:**
- ❌ Pre-defined evidence requirements
- ❌ Evidence-to-control mappings
- ❌ Evidence types or sources

**This is YOUR IP to define:**
- ✅ Evidence requirements per control
- ✅ Evidence types (policy_document, system_log, tls_scan, etc.)
- ✅ Source tools (SSLyze, OWASP ZAP, etc.)
- ✅ Freshness requirements

**Typical Evidence per Control:**
- **2-4 evidence items** per control
- **Mix of automated and manual** evidence
- **Varies by control type:**
  - Access controls: Policy + Logs + Reviews
  - Network security: Scans + Configs + Policies
  - Change management: Logs + Approvals + Documentation

**Example for CC6.1 (Logical Access Controls):**
```yaml
evidence_requirements:
  - evidence_type: "policy_document"
    source_app: "Manual"
    freshness_days: 365
    required: true
    description: "Access Control Policy document"
    
  - evidence_type: "system_log"
    source_app: "System"
    freshness_days: 90
    required: true
    description: "Access control logs showing enforcement"
    
  - evidence_type: "manual_upload"
    source_app: "Manual"
    freshness_days: 90
    required: true
    description: "Access review reports"
```

### 5. Mappings

**OpenControl provides:**
- ✅ Control-to-domain mapping (CC1, CC2, etc.)
- ❌ No framework-to-framework mappings
- ❌ No control-to-control relationships
- ❌ No evidence mappings

**Vendor Mappings provide:**
- ✅ SOC 2 ↔ AWS service mappings
- ✅ SOC 2 ↔ Azure service mappings
- ✅ SOC 2 ↔ GCP service mappings
- ❌ Not structured control data
- ❌ Not machine-readable

**What you need to create:**
- ✅ Framework-to-framework mappings (SOC 2 ↔ ISO 27001, etc.)
- ✅ Control relationships (related_control_ids)
- ✅ Evidence-to-control mappings (your IP)

---

## Data Availability Summary

### ✅ Available from OpenControl

| Data Type | Available | Count/Structure |
|-----------|-----------|----------------|
| **Frameworks** | Partial | Structure only (not separate frameworks) |
| **Controls** | ✅ Yes | ~67-100 controls (Common Criteria) |
| **Control IDs** | ✅ Yes | CC1.1, CC6.1, etc. |
| **Control Names** | ✅ Yes | "Logical Access Controls", etc. |
| **Control Descriptions** | ✅ Yes | Summarized (legal) |
| **Domain Mapping** | ✅ Yes | CC1-CC9 mapping |
| **Evidence Requirements** | ❌ No | Must create yourself |
| **Framework Mappings** | ❌ No | Must create yourself |

### ❌ NOT Available (Must Create)

1. **Evidence Requirements**
   - What evidence satisfies each control
   - Evidence types and sources
   - Freshness requirements
   - **This is YOUR IP**

2. **Framework-to-Framework Mappings**
   - SOC 2 ↔ ISO 27001
   - SOC 2 ↔ PCI-DSS
   - SOC 2 ↔ NIST 800-53
   - **Must research and create**

3. **Control Relationships**
   - Related controls
   - Dependencies
   - **Must analyze and create**

4. **Control Metadata**
   - Severity levels
   - Control types (preventive/detective/corrective)
   - Evaluation methods
   - **Must assign based on analysis**

---

## OpenControl Repository Structure

### GitHub: opencontrol/schemas
**Purpose:** Schema definitions for OpenControl format

**Contains:**
- YAML schema definitions
- Control structure templates
- Not actual control data

### GitHub: opencontrol/compliance-masonry
**Purpose:** Compliance-as-code framework and examples

**Contains:**
- Example control definitions
- Control catalog structures
- Reference implementations
- **May contain SOC 2 examples** (need to verify)

**What to look for:**
- `standards/` directory - Framework definitions
- `certifications/` directory - Control catalogs
- YAML files with control definitions

---

## Recommended Data Extraction Approach

### Step 1: Extract Control Structure

**From OpenControl:**
1. Clone `opencontrol/compliance-masonry` repository
2. Look for SOC 2 examples in `standards/` or `certifications/`
3. Extract control IDs, names, descriptions
4. Map to domains (CC1-CC9)

**Expected Output:**
```yaml
controls:
  - control_id: "CC6.1"
    name: "Logical Access Controls"
    description: "Logical access to systems is restricted based on role and responsibility."
    domain: "CC6"
    family: "Common Criteria"
```

### Step 2: Create Framework Records

**Create 2 frameworks:**
- SOC 2 Type I
- SOC 2 Type II

**Same controls, different evaluation:**
- Type I: Point-in-time assessment
- Type II: Period-of-time assessment

### Step 3: Create Evidence Requirements (Your IP)

**For each control, define:**
- 2-4 evidence requirements
- Evidence types
- Source tools
- Freshness requirements

**Example:**
```yaml
evidence_requirements:
  - control_id: "CC6.1"
    evidence_type: "policy_document"
    source_app: "Manual"
    freshness_days: 365
    required: true
```

### Step 4: Create Framework Mappings (Research Required)

**Research mappings:**
- SOC 2 ↔ ISO 27001 (many controls overlap)
- SOC 2 ↔ PCI-DSS (some overlap)
- SOC 2 ↔ NIST 800-53 (AICPA provides mappings)

**Sources:**
- AICPA mapping documents
- Vendor mapping docs (AWS, Azure, GCP)
- Industry research

---

## Estimated Data Counts

### Frameworks
- **2 frameworks:** SOC 2 Type I, SOC 2 Type II

### Controls
- **Common Criteria (CC1-CC9):** ~67 controls
- **Full Security TSC:** ~80-110 controls
- **All 5 TSCs:** ~150-200 controls (if all included)

**For MVP, focus on:**
- **Common Criteria only:** ~67 controls
- **Most common implementation**

### Evidence Requirements
- **Per control:** 2-4 evidence requirements
- **For 67 controls:** ~134-268 evidence requirements
- **Must create yourself** (not in OpenControl)

### Mappings
- **Framework-Control mappings:** 67 controls × 2 frameworks = 134 mappings
- **Framework-to-Framework mappings:** Must research (SOC 2 ↔ ISO, etc.)
- **Control relationships:** Must analyze

---

## What You'll Need to Create

### 1. Evidence Requirements (Critical - Your IP)

**For each of ~67 controls:**
- Define 2-4 evidence requirements
- Map to evidence types
- Assign source tools
- Set freshness requirements

**Estimated effort:** 2-3 hours per 10 controls = **13-20 hours for 67 controls**

### 2. Control Metadata

**For each control, assign:**
- Severity (critical/high/medium/low)
- Control type (preventive/detective/corrective)
- Evaluation method (automated/manual/hybrid)
- Frequency (continuous/daily/weekly/monthly/annually)

**Estimated effort:** 1 hour per 10 controls = **7 hours for 67 controls**

### 3. Framework Mappings

**Research and create:**
- SOC 2 ↔ ISO 27001 mappings
- SOC 2 ↔ PCI-DSS mappings
- SOC 2 ↔ NIST 800-53 mappings

**Estimated effort:** **4-6 hours** (research + data entry)

---

## Data Source URLs

### OpenControl
- **Schemas:** https://github.com/opencontrol/schemas
- **Compliance Masonry:** https://github.com/opencontrol/compliance-masonry

### Vendor Mappings (Reference)
- **AWS SOC 2 Mapping:** AWS Well-Architected Framework
- **Azure SOC 2 Mapping:** Azure Compliance documentation
- **GCP SOC 2 Mapping:** GCP Compliance documentation

### Framework Mappings (Research)
- **AICPA SOC 2 ↔ NIST 800-53:** AICPA mapping documents
- **SOC 2 ↔ ISO 27001:** Industry research, vendor docs

---

## Summary

### What OpenControl Gives You

✅ **Control Structure:**
- ~67 controls (Common Criteria)
- Control IDs (CC1.1, CC6.1, etc.)
- Control names
- Control descriptions (summarized)
- Domain mapping (CC1-CC9)

❌ **What OpenControl Does NOT Provide:**
- Evidence requirements (your IP)
- Framework-to-framework mappings
- Control metadata (severity, type, etc.)
- Control relationships

### What You Must Create

1. **Evidence Requirements** (~134-268 requirements for 67 controls)
2. **Control Metadata** (severity, type, evaluation method)
3. **Framework Mappings** (SOC 2 ↔ other frameworks)
4. **Control Relationships** (related controls)

### Estimated Data

- **Frameworks:** 2 (SOC 2 Type I, Type II)
- **Controls:** ~67 (Common Criteria)
- **Evidence Requirements:** ~134-268 (2-4 per control)
- **Mappings:** 134 (67 controls × 2 frameworks)

---

**Last Updated:** 2026-01-06  
**Status:** Ready for Data Extraction

