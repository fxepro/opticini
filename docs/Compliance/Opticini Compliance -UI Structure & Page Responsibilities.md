# Opticini Compliance – UI Structure & Page Responsibilities

## 1. Frameworks

**Purpose:** Entry point. High-level compliance posture.

### What this page does

- Shows all supported frameworks (SOC 2, ISO 27001, GDPR, HIPAA, etc.)
- Displays overall compliance score per framework
- Shows readiness status (Ready / In Progress / At Risk)
- Allows enabling/disabling frameworks per tenant

### Primary users

- Founder / Security Admin
- Compliance Manager

### Key UI components

- **Framework cards**
  - Logo
  - % compliant
  - controls passing / failing
  - "View controls" CTA
  - "Generate readiness report" CTA

### Sample data for mock UI

- SOC 2 → 68% ready
- ISO 27001 → 55% mapped
- GDPR → 72% technical compliance

---

## 2. Controls

**Purpose:** The operational heart of compliance.

### What this page does

- Lists all controls across frameworks
- Shows real-time status:
  - Pass / Fail / Partial / Not Evaluated
- Explains why a control is failing
- Links evidence automatically

### Primary users

- Security / DevOps
- Compliance lead

### Key UI components

- **Filter by:**
  - Framework
  - Status
  - Severity

- **Control detail drawer/page:**
  - Control description
  - Mapped frameworks
  - Evidence list
  - Last evaluated time
  - Fix recommendations

### Sample control

- **SOC2-CC6.1**
  - Status: FAIL
  - Reason: Missing CSP header on 3 assets
  - Evidence: Attack Surface Scan #2481

---

## 3. Evidence

**Purpose:** Audit-proof proof storage.

### What this page does

- Shows all collected evidence
- Distinguishes:
  - Automated
  - Manual uploads
- Tracks freshness and validity
- Allows uploads (screenshots, PDFs)

### Primary users

- Compliance team
- Auditor (read-only)

### Key UI components

- **Evidence table:**
  - Source (AI Monitor, DAST, Manual)
  - Control(s)
  - Timestamp
  - Status (Fresh / Expired)

- Upload modal
- Evidence preview panel

### Sample evidence

- TLS Scan Result (Auto)
- IAM Policy Screenshot (Manual)
- AI Data Flow Log (Auto)

---

## 4. Policies

**Purpose:** Turn reality into documented policy.

### What this page does

- Auto-generates policies based on:
  - Actual configs
  - Observed behavior
- Tracks policy acceptance
- Supports versioning

### Primary users

- Leadership
- Legal / Compliance

### Key UI components

- **Policy list:**
  - Security Policy
  - AI Usage Policy
  - Incident Response Plan

- **Status:**
  - Draft / Active / Needs Review

- "Regenerate from system state" button
- Export (PDF / DOCX)

### Sample policy preview

**AI Usage Policy**

Generated from:
- OpenAI API usage
- Data classification logs
- Retention configs

---

## 5. Audits

**Purpose:** Time-boxed compliance events.

### What this page does

- Creates audit sessions (SOC2 Type I, annual review)
- Locks evidence for the audit period
- Assigns auditors
- Tracks audit progress

### Primary users

- Compliance Manager
- External Auditor

### Key UI components

- Audit timeline
- Evidence freeze indicator
- Auditor access links
- Notes & findings

### Sample audit

- **Audit:** SOC2 Readiness – Q2 2026
- Status: In Progress
- Controls Passed: 61 / 92

---

## 6. Reports

**Purpose:** Executive & auditor outputs.

### What this page does

- Generates formatted compliance reports
- Supports:
  - Readiness
  - Gap analysis
  - Continuous monitoring
- Allows secure sharing

### Primary users

- Executives
- Auditors
- Investors

### Key UI components

- Report templates
- Date range selector
- **Export options:**
  - PDF
  - ZIP (evidence pack)
  - Read-only link

### Sample reports

- SOC 2 Readiness Report
- ISO 27001 Gap Analysis
- AI Compliance Summary

---

## Left Navigation (Recommended)

```
Compliance
 ├─ Overview (optional but recommended)
 ├─ Frameworks
 ├─ Controls
 ├─ Evidence
 ├─ Policies
 ├─ Audits
 └─ Reports
```

> **Tip:** "Overview" can be a synthesized dashboard pulling from all six.

---

## Important UX Principle (Do This)

- **Frameworks** = strategy
- **Controls** = operations
- **Evidence** = proof
- **Policies** = documentation
- **Audits** = events
- **Reports** = outputs

> If these lines stay clean, the product stays intuitive.

