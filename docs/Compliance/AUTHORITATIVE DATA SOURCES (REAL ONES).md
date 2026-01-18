# Authoritative Data Sources (Real Ones)

A guide to legally compliant, open-source data sources for compliance frameworks.

---

## 1️⃣ SOC 2 – Practical Data Sources

### A. OpenControl (Canonical)

**GitHub Repositories:**
- https://github.com/opencontrol/schemas
- https://github.com/opencontrol/compliance-masonry

**License:** Apache 2.0

**Why Use This:**
- SOC 2 control structure
- Used by government & vendors
- Legally compliant

**What You Get:**
```yaml
control_key: CC6.1
family: Common Criteria
name: Logical Access Controls
description: >
  Controls ensure logical access to systems is restricted.
```

**That is 100% legal.**

---

### B. Vendor Mapping Docs (Industry Standard)

Used to derive summaries:

- **AWS SOC 2 Mapping**
- **Azure SOC 2 Mapping**
- **GCP SOC 2 Mapping**

These explicitly publish control intent summaries.

---

## 2️⃣ PCI-DSS (Best Open Source Source)

### PCI DSS Quick Guide (Public)

**PCI SSC allows:**
- Requirement numbers
- Requirement titles
- High-level descriptions

**Open GitHub Source (Used by Tools):**
- https://github.com/complytime/complytime-pci-dss

**Structure:**
```yaml
id: "1.1.1"
title: Firewall and router configuration standards
summary: Network security controls must be defined and maintained.
```

---

## 3️⃣ ISO 27001 / 27002 (Annex A)

### ISO Annex A is PUBLIC STRUCTURE

**You can legally store:**
- A.5 – A.18
- Control IDs
- Control titles
- Objectives (summarized)

**Open Sources:**
- https://github.com/center-for-threat-informed-defense/attack-control-framework-mappings
- https://github.com/OWASP/ASVS

**Plus:**
- NIST ↔ ISO mappings (public)
- ENISA summaries

**Example:**
```json
{
  "control_code": "A.9.2.3",
  "title": "Management of privileged access rights",
  "summary": "Privileged access must be restricted and monitored."
}
```

---

## HOW TO LOAD INTO OPTICINI (CONCRETE STEPS)

### Step 1: Create Framework Records

- SOC2
- PCI-DSS v4.0
- ISO/IEC 27001:2022

---

### Step 2: Load Domains

#### SOC 2
- CC1 – Control Environment
- CC2 – Communication & Information
- CC3 – Risk Assessment
- CC4 – Monitoring
- CC5 – Control Activities
- CC6 – Logical & Physical Access
- CC7 – System Operations
- CC8 – Change Management
- CC9 – Risk Mitigation

#### PCI
- 1 – Network Security Controls
- 2 – Secure Configurations
- 3 – Protect Stored Data
- ...

#### ISO
- A.5 – Organizational
- A.6 – People
- A.7 – Physical
- A.8 – Technological

---

### Step 3: Load Controls (Normalized)

#### Example SOC 2 Control
```json
{
  "framework": "SOC2",
  "domain": "CC6",
  "control_code": "CC6.1",
  "title": "Logical Access Controls",
  "description": "Logical access to systems is restricted based on role and responsibility.",
  "type": "technical"
}
```

#### Example PCI
```json
{
  "framework": "PCI-DSS",
  "control_code": "6.4.1",
  "title": "Change Control Procedures",
  "description": "Changes to system components follow documented approval processes."
}
```

#### Example ISO
```json
{
  "framework": "ISO27001",
  "control_code": "A.8.28",
  "title": "Secure Coding",
  "description": "Secure coding principles must be applied during development."
}
```

---

### Step 4: Evidence Definitions (Critical)

**This is your IP, not copyrighted.**

```json
{
  "control_code": "CC6.1",
  "evidence_type": "Access Control Policy",
  "collection": "manual"
}
```

**Auditors expect this, not text replication.**

---

## WHAT YOU WILL HAVE AFTER THIS

✅ SOC 2 / PCI / ISO frameworks populated  
✅ Controls rendered in UI  
✅ Evidence requirements defined  
✅ Auditor-safe  
✅ Scanner-ready later  

**This is exactly how Vanta & Drata do it.**

---

## Blunt Truth

**If someone tells you:**

> "We just imported SOC 2 from GitHub"

**They're lying or infringing.**

**This is the only viable path.**

---

## Summary

### Legal Data Sources

1. **SOC 2:**
   - OpenControl schemas (Apache 2.0)
   - Vendor mapping documents (AWS, Azure, GCP)

2. **PCI-DSS:**
   - PCI SSC Quick Guide (public)
   - GitHub: complytime-pci-dss

3. **ISO 27001/27002:**
   - Annex A structure (public)
   - GitHub: attack-control-framework-mappings, OWASP ASVS
   - NIST ↔ ISO mappings (public)
   - ENISA summaries

### Implementation Steps

1. Create framework records
2. Load domains/categories
3. Load controls (normalized structure)
4. Define evidence requirements (your IP)

### Key Points

- ✅ Control IDs, titles, and summaries are legal to use
- ✅ Full control text replication may be copyrighted
- ✅ Evidence definitions are your intellectual property
- ✅ This approach is used by industry leaders (Vanta, Drata)

---

**Last Updated:** 2026-01-06

