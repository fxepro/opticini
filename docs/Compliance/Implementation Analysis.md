# Current Implementation vs Technical Implementation Plan - Analysis

## Executive Summary

**Current State:** Basic data models and relationships exist, but missing critical automation and evaluation logic.

**Gap:** The system has the structure but lacks the "engine" that drives continuous compliance evaluation.

---

## 1. Framework → Control → Evidence Mapping

### ✅ CURRENT IMPLEMENTATION (What Exists)

**Framework → Control Mapping:**
- ✅ `ComplianceControlFrameworkMapping` table exists
- ✅ Many-to-many relationship: Controls can belong to multiple frameworks
- ✅ Junction table stores: `control_id`, `framework_id`, `framework_name`
- ✅ Proper indexes on framework_id and control_id

**Control → Evidence Mapping:**
- ✅ `ComplianceEvidenceControlMapping` table exists
- ✅ Many-to-many relationship: Evidence can satisfy multiple controls
- ✅ Junction table stores: `evidence_id`, `control_id`, `framework_id`, `framework_name`
- ✅ Proper indexes for lookups

**Structure:**
```
Framework (1) ←→ (M) ControlFrameworkMapping (M) ←→ (1) Control
Control (1) ←→ (M) EvidenceControlMapping (M) ←→ (1) Evidence
```

### ❌ MISSING FROM PLAN (Critical Gaps)

**1. ControlEvidenceRequirement Model (CRITICAL)**
- ❌ **NOT IMPLEMENTED** - No table defining what evidence is REQUIRED for each control
- Plan requires: `control_id`, `evidence_type`, `source_app`, `freshness_days`, `required`
- **Impact:** Cannot automate control evaluation. System doesn't know what evidence satisfies which controls.

**2. ControlStatus Model (Per-Tenant Evaluation State)**
- ❌ **NOT IMPLEMENTED** - Control status is stored directly on Control model (global, not tenant-scoped)
- Current: `status` field on `ComplianceControl` (pass/fail/partial/not_evaluated)
- Plan requires: Separate `ControlStatus` table with `tenant_id`, `control_id`, `status`, `confidence_score`, `reason`
- **Impact:** Cannot track per-customer compliance state. All tenants share same control status.

**3. Evidence Freshness Engine**
- ❌ **NOT IMPLEMENTED** - No scheduled job to mark evidence as fresh/expired/superseded
- Current: `status` field (fresh/expired/expiring_soon) but no automation
- Plan requires: Scheduled job that checks `expires_at` and updates status
- **Impact:** Evidence can be stale but system doesn't know it.

**4. Control Evaluation Engine**
- ❌ **NOT IMPLEMENTED** - No logic to evaluate controls based on evidence
- Current: Status is manually set or static
- Plan requires: Automated evaluation that:
  - Fetches required evidence for control
  - Checks freshness
  - Applies scoring rules
  - Updates ControlStatus
- **Impact:** Controls cannot be automatically evaluated. Manual process only.

**5. OPA Integration (Policy-as-Code)**
- ❌ **NOT IMPLEMENTED** - No Open Policy Agent integration
- Plan requires: Evidence → OPA → Decision → ControlStatus flow
- **Impact:** Evaluation logic is not transparent, auditable, or easily extensible.

---

## 2. Control Model Comparison

### ✅ CURRENT IMPLEMENTATION

**Has:**
- ✅ `control_id` (stable identifier like SOC2-CC6.1)
- ✅ `name` (title equivalent)
- ✅ `description`
- ✅ `category`
- ✅ `severity` (critical/high/medium/low)
- ✅ `control_type` (preventive/detective/corrective) - *similar to technical/procedural/hybrid*
- ✅ `evaluation_method` (automated/manual/hybrid) - *similar to automation_level*
- ✅ `status` (pass/fail/partial/not_evaluated)
- ✅ `last_evaluated`
- ✅ `evaluated_by`
- ✅ `frequency` (continuous/daily/weekly/monthly/annually)

**Missing:**
- ❌ `scoring_rule` - No field to define how control is scored
- ❌ `automation_level` - Has `evaluation_method` but not exactly the same concept
- ❌ Per-tenant evaluation state (status is global on Control model)

### 📊 COMPARISON TABLE

| Plan Requirement | Current Implementation | Status |
|-----------------|----------------------|--------|
| `control_id` | ✅ `control_id` | ✅ Match |
| `title` | ✅ `name` | ✅ Match |
| `description` | ✅ `description` | ✅ Match |
| `category` | ✅ `category` | ✅ Match |
| `severity` | ✅ `severity` | ✅ Match |
| `control_type` | ✅ `control_type` (preventive/detective/corrective) | ⚠️ Partial (different values) |
| `automation_level` | ✅ `evaluation_method` (automated/manual/hybrid) | ⚠️ Similar but not identical |
| `scoring_rule` | ❌ Missing | ❌ **GAP** |

---

## 3. Evidence Model Comparison

### ✅ CURRENT IMPLEMENTATION

**Has:**
- ✅ `evidence_id` (stable identifier)
- ✅ `tenant_id` → `organization_id` (multi-tenant support)
- ✅ `source_app` → `source` + `source_type` + `source_name`
- ✅ `evidence_type` → `source_type` (ai_monitor, dast, tls_scan, etc.)
- ✅ `raw_payload` → `content` (text-based) + `file_url` (for files)
- ✅ `collected_at` → `created_at`
- ✅ `expires_at`
- ✅ `integrity_hash` → *Not explicitly stored, but could use file_url*

**Missing:**
- ❌ `asset_id` - No direct link to assets
- ❌ `control_id` at ingest - Evidence is linked via junction table, not at creation
- ❌ Normalization layer - No adapters (ZAP, Trivy, SSLyze, etc.)
- ❌ Freshness automation - Status is manual, not automated

### 📊 COMPARISON TABLE

| Plan Requirement | Current Implementation | Status |
|-----------------|----------------------|--------|
| `id` | ✅ `id` (UUID) | ✅ Match |
| `tenant_id` | ✅ `organization_id` | ✅ Match |
| `asset_id` | ❌ Missing | ❌ **GAP** |
| `control_id` (optional) | ⚠️ Via junction table only | ⚠️ Different approach |
| `source_app` | ✅ `source` + `source_type` + `source_name` | ✅ Match |
| `evidence_type` | ✅ `source_type` | ✅ Match |
| `raw_payload` | ✅ `content` + `file_url` | ✅ Match |
| `collected_at` | ✅ `created_at` | ✅ Match |
| `expires_at` | ✅ `expires_at` | ✅ Match |
| `integrity_hash` | ⚠️ Not explicit | ⚠️ Could be added |

---

## 4. Critical Missing Components

### 🔴 HIGH PRIORITY GAPS

**1. ControlEvidenceRequirement Model**
```
MISSING TABLE:
- control_id
- evidence_type
- source_app
- freshness_days
- required (boolean)
```
**Why Critical:** Without this, the system cannot know:
- What evidence is required to satisfy a control
- How fresh evidence must be
- Which source apps provide valid evidence

**2. ControlStatus Model (Per-Tenant)**
```
MISSING TABLE:
- tenant_id
- control_id
- status
- last_evaluated_at
- confidence_score
- reason
```
**Why Critical:** Current implementation stores status globally on Control model. Cannot track:
- Different compliance states per customer
- Historical changes
- Confidence in evaluation

**3. Control Evaluation Engine**
```
MISSING LOGIC:
- Fetch required evidence for control
- Check evidence freshness
- Apply scoring rules
- Update ControlStatus
```
**Why Critical:** Controls are currently static. No automation to:
- Re-evaluate when evidence changes
- Detect drift
- Maintain continuous compliance

**4. Evidence Freshness Engine**
```
MISSING:
- Scheduled job/cron
- Automatic status updates (fresh → expired)
- Trigger control re-evaluation
```
**Why Critical:** Evidence can become stale but system doesn't know. Manual process only.

**5. Evidence Normalization Layer**
```
MISSING ADAPTERS:
- ZAP Adapter
- Trivy Adapter
- SSLyze Adapter
- AI Monitor Adapter
- Manual Upload Adapter
```
**Why Critical:** Each scanner outputs different formats. Need normalization to:
- Parse raw output
- Normalize fields
- Tag potential control matches

---

## 5. Framework Aggregation Logic

### ✅ CURRENT IMPLEMENTATION

**Framework Model Has:**
- ✅ `compliance_score` (0-100)
- ✅ `total_controls`
- ✅ `passing_controls`
- ✅ `failing_controls`
- ✅ `not_evaluated_controls`
- ✅ `last_evaluated`
- ✅ `next_audit_date`

**Status:** Fields exist but **calculation logic is missing**

### ❌ MISSING

**Aggregation Logic:**
- ❌ No code to calculate framework metrics from control statuses
- ❌ No scheduled job to update framework scores
- ❌ No API endpoint to get framework summary with aggregated data
- Plan requires: `GET /compliance/frameworks/{id}/summary`

**Current:** Metrics are stored but not automatically calculated from control states.

---

## 6. Mapping Flow Comparison

### PLAN FLOW (Ideal)
```
1. Evidence ingested → Normalized → Stored
2. ControlEvaluationEngine runs:
   - Fetch ControlEvidenceRequirement for control
   - Find matching evidence (by type, source, freshness)
   - Apply scoring rules (via OPA)
   - Update ControlStatus (per tenant)
3. Framework aggregation:
   - Query all ControlStatus for framework
   - Calculate compliance_score, passing_controls, etc.
   - Update Framework metrics
```

### CURRENT FLOW (Actual)
```
1. Evidence manually created/linked via EvidenceControlMapping
2. Control status manually set or static
3. Framework metrics manually set or static
4. No automation, no evaluation engine, no freshness checks
```

---

## 7. Implementation Priority Recommendations

### 🔴 PHASE 1 (Critical Foundation - Do First)

1. **Create ControlEvidenceRequirement Model**
   - Define what evidence satisfies each control
   - This is the foundation for automation

2. **Create ControlStatus Model (Per-Tenant)**
   - Separate evaluation state from control definition
   - Enable per-customer compliance tracking

3. **Implement Evidence Freshness Engine**
   - Scheduled job to check `expires_at`
   - Update evidence status automatically
   - Trigger control re-evaluation

### 🟡 PHASE 2 (Evaluation Engine)

4. **Implement Control Evaluation Engine**
   - Fetch required evidence from ControlEvidenceRequirement
   - Check freshness
   - Apply scoring logic
   - Update ControlStatus

5. **Implement Framework Aggregation**
   - Calculate framework metrics from ControlStatus
   - Scheduled job to update framework scores
   - API endpoint for framework summary

### 🟢 PHASE 3 (Enhancement)

6. **Add Evidence Normalization Layer**
   - Create adapters for each scanner type
   - Normalize evidence on ingestion

7. **Integrate OPA (Optional but Recommended)**
   - Move scoring rules to OPA
   - Make evaluation logic transparent and auditable

---

## 8. Summary: What Works vs What's Missing

### ✅ WORKS (Current State)
- Basic data models (Framework, Control, Evidence)
- Many-to-many relationships (Framework↔Control, Control↔Evidence)
- Multi-tenant support (`organization_id`)
- Basic status tracking
- Audit locking for evidence
- File storage for evidence

### ❌ MISSING (Critical Gaps)
- ControlEvidenceRequirement (defines what evidence satisfies controls)
- ControlStatus per-tenant (evaluation state)
- Control Evaluation Engine (automated scoring)
- Evidence Freshness Engine (automated status updates)
- Framework Aggregation Logic (calculate metrics from controls)
- Evidence Normalization Layer (scanner adapters)
- OPA Integration (policy-as-code)

### ⚠️ PARTIAL (Needs Enhancement)
- Control model has most fields but missing `scoring_rule`
- Evidence model has most fields but missing `asset_id` link
- Framework model has metric fields but no calculation logic

---

## 9. Next Steps (Recommended Order)

1. **Create ControlEvidenceRequirement model** - Foundation for automation
2. **Create ControlStatus model** - Per-tenant evaluation state
3. **Build Evidence Freshness Engine** - Automated status updates
4. **Build Control Evaluation Engine** - Automated control scoring
5. **Build Framework Aggregation** - Calculate framework metrics
6. **Add Evidence Normalization** - Scanner adapters
7. **Integrate OPA** - Policy-as-code (optional)

**Current implementation has the structure but needs the "engine" to make it work automatically.**

