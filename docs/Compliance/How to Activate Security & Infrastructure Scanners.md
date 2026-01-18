# How to Activate Security & Infrastructure Scanners

**Subtitle:** Populate Frameworks, Controls, Evidence in Opticini

**Purpose:** Guide for activating security scanners and automating compliance evidence collection

**Date:** 2026-01-07

---

## Prerequisites

This guide assumes:

- ✅ Your Compliance DB & framework tables already exist
- ✅ You want automated + provable evidence
- ✅ You are building something Vanta / Drata / Secureframe-like

---

## 1. The Core Mapping Concept (Very Important)

**Key Insight:** Scanners do NOT know about SOC2, ISO, HIPAA.

They only produce technical findings.

**Opticini must act as a translation layer.**

### Canonical Flow

```
Scanner Output
   ↓
Finding Normalization
   ↓
Control Mapping
   ↓
Evidence Object
   ↓
Framework Compliance Status
```

---

## 2. Scanner Categories You Actually Need

### A. Cloud & Infrastructure Configuration Scanners

**Used for:** SOC2 / ISO / HIPAA technical controls

| Scanner | Purpose | License |
|---------|---------|---------|
| **Prowler** | AWS CIS, SOC2, ISO checks | Apache 2.0 |
| **ScoutSuite** | Multi-cloud posture | BSD |
| **Cloud Custodian** | Policy-as-code | Apache 2.0 |
| **Trivy** | Container & IaC scanning | Apache 2.0 |

---

### B. Host & OS Security

**Used for:** System hardening evidence

| Scanner | Purpose | License |
|---------|---------|---------|
| **OpenSCAP** | CIS benchmarks | LGPL |
| **Lynis** | Linux security audit | GPL |
| **osquery** | Endpoint configuration | Apache 2.0 |

---

### C. Web & Application Security

**Used for:** Change management, vulnerability detection

| Scanner | Purpose | License |
|---------|---------|---------|
| **OWASP ZAP** | DAST scanning | Apache 2.0 |
| **Nikto** | Web server issues | GPL |
| **Nuclei** | Template-based vuln scans | MIT |

---

### D. CI/CD & Code Security

**Used for:** SDLC controls

| Scanner | Purpose | License |
|---------|---------|---------|
| **Semgrep** | Secure code checks | LGPL |
| **Trivy** | SCA + secrets | Apache 2.0 |
| **Gitleaks** | Secret detection | MIT |

---

## 3. How to ACTIVATE Each Scanner (Practically)

### Option 1: Centralized Scanner Engine (Recommended)

**Architecture:** You run scanners inside Opticini infrastructure.

```
opticini-scanner-service
  ├── prowler
  ├── trivy
  ├── nuclei
  ├── lynis
  └── osquery
```

**Triggered via:**
- Scheduled jobs
- Manual scan
- Audit window

---

### Option 2: Remote Agent (For Customers)

**Use Case:** For deeper evidence (SOC2 Type II)

**Architecture:**
```
Customer Server
  └── opticini-agent
        ├── lynis
        ├── osquery
        └── trivy
```

**Security:** Agent sends signed results back.

---

## 4. Scanner → Evidence Activation Flow

### Example: Prowler (AWS)

#### Step 1: Run
```bash
prowler aws --output json --output-file prowler.json
```

#### Step 2: Parse
```json
{
  "ControlId": "IAM-01",
  "Status": "PASS",
  "ResourceId": "arn:aws:iam::123456789:user/admin",
  "Severity": "HIGH"
}
```

#### Step 3: Map
```
IAM-01
→ SOC2 CC6.1
→ ISO 27001 A.9.2
→ Evidence Type: Automated Cloud Config
```

#### Step 4: Store
```sql
evidence (
  control_id,
  source,
  scan_type,
  result,
  raw_payload,
  collected_at
)
```

---

## 5. Evidence Normalization Layer (Critical)

### Standard Schema for ALL Scanners

Create a standard schema for ALL scanners:

```json
{
  "source": "prowler",
  "category": "cloud_security",
  "control_reference": "IAM-01",
  "result": "pass",
  "severity": "high",
  "resource": "iam:user/admin",
  "evidence_type": "automated",
  "timestamp": "2026-01-07T12:10:00Z",
  "raw": { ... }
}
```

### Benefits

This lets:
- ✅ Reports be uniform
- ✅ Auditors trust the data
- ✅ Frameworks auto-update

---

## 6. Control-to-Scanner Mapping Table (You MUST have this)

**This table drives everything.**

### Example Mapping

| Control | Framework | Evidence Source | Scanner |
|---------|-----------|----------------|---------|
| CC6.1 | SOC2 | IAM Policy Review | Prowler |
| A.9.2 | ISO | Access Control | Prowler |
| CC7.1 | SOC2 | Vulnerability Scan | Trivy |
| A.12.6 | ISO | Malware Protection | Lynis |

---

## 7. How Frameworks Get Populated Automatically

### Step-by-Step Flow

1. **Framework loaded** (SOC2)
2. **Controls expanded** (CC1–CC9)
3. **Each control linked to:**
   - Evidence types
   - Scanner(s)
4. **Scanner runs**
5. **Evidence auto-attached**
6. **Control status recalculated**
7. **Framework compliance score updated**

---

## 8. Evidence Confidence & Audit Readiness

### Required Evidence Attributes

Each evidence item should have:

- ✅ **Source** (tool name + version)
- ✅ **Timestamp**
- ✅ **Scope** (account, host, repo)
- ✅ **Integrity hash**
- ✅ **Retention policy**

**This is what auditors care about.**

---

## 9. What This Achieves (Outcome)

| Area | Result |
|------|--------|
| **Frameworks** | Auto-populated & live |
| **Controls** | Continuous monitoring |
| **Evidence** | Auditor-grade artifacts |
| **Audits** | 80–90% prep automated |
| **Reports** | One-click SOC2 / ISO |

---

## 10. Final Reality Check (Important)

### Key Insight

**No single open-source tool gives you compliance.**

**Compliance is:**
- Mapping + Evidence + Audit Workflow

**That's where Opticini is the product, and scanners are just sensors.**

---

## Next Steps

If you want next, I can:

1. Design Opticini Scanner Service architecture
2. Provide agent vs agentless decision tree
3. Build exact DB schemas
4. Create SOC2 control → scanner coverage matrix
5. Draft auditor-facing evidence report format

---

## Summary

### Core Principles

1. **Scanners produce technical findings** - Not compliance status
2. **Opticini translates** - Technical findings → Compliance controls
3. **Evidence normalization** - Standard schema for all scanners
4. **Control-to-scanner mapping** - Critical mapping table
5. **Automated workflow** - Framework → Controls → Evidence → Status

### Scanner Categories

- **Cloud & Infrastructure:** Prowler, ScoutSuite, Cloud Custodian, Trivy
- **Host & OS Security:** OpenSCAP, Lynis, osquery
- **Web & Application:** OWASP ZAP, Nikto, Nuclei
- **CI/CD & Code:** Semgrep, Trivy, Gitleaks

### Deployment Options

- **Centralized:** Scanners in Opticini infrastructure (Recommended)
- **Remote Agent:** Customer-deployed agents for deeper evidence

### Evidence Requirements

- Source (tool + version)
- Timestamp
- Scope
- Integrity hash
- Retention policy

---

**Last Updated:** 2026-01-07  
**Status:** Implementation Guide

