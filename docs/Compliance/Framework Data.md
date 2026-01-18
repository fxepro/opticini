# Framework Data

**Purpose:** Understanding what "Framework Data" means and how to populate compliance frameworks, controls, and evidence requirements

**Date:** 2026-01-07

---

## 1. What "Framework Data" Actually Means

### Key Concept

A compliance framework is **not just a name** like SOC 2 or ISO 27001.

It is a **hierarchy of authoritative objects:**

```
Framework
  ├── Domains / Categories
  │     ├── Controls
  │     │     ├── Control requirements
  │     │     ├── Evidence expectations
  │     │     └── Implementation guidance
```

### Your Goal Right Now

Populate:

1. ✅ **Framework metadata**
2. ✅ **Control definitions**
3. ✅ **Evidence requirements** (not evidence itself)

---

## 2. Authoritative Data Sources (Critical)

### Important Note

**You cannot invent frameworks.** Auditors expect alignment to canonical sources.

Below are legally usable sources.

---

### A. SOC 2 (AICPA)

#### Source Reality

- ❌ SOC 2 full text is **copyrighted**
- ✅ BUT control structure & criteria mapping is **allowed**

#### What You CAN Store

- ✅ Trust Services Categories
- ✅ Control IDs (CC1.1, CC6.1, etc.)
- ✅ Control intent summaries
- ❌ Full verbatim text

#### Authoritative Public Sources

- AICPA Trust Services Criteria overview
- Public SOC2 mapping documents
- Vendor mappings (Vanta, Drata whitepapers)

#### Example Data You Store

```json
{
  "framework": "SOC2",
  "domain": "Common Criteria",
  "control_id": "CC6.1",
  "title": "Logical Access Controls",
  "description": "The entity implements logical access security measures to protect system resources.",
  "type": "technical"
}
```

---

### B. ISO/IEC 27001 & 27002

#### Source Reality

- ❌ ISO standards are **copyrighted**
- ✅ Control IDs and structure are **public**
- ✅ High-level summaries are **acceptable**

#### Publicly Available

- ✅ Annex A control list
- ✅ Control titles
- ✅ Control objectives

#### Example

```json
{
  "framework": "ISO27001",
  "domain": "A.9 Access Control",
  "control_id": "A.9.2.3",
  "title": "Management of privileged access rights",
  "description": "Privileged access rights must be restricted and controlled."
}
```

---

### C. GDPR

#### Source Reality

- ✅ GDPR is **EU law**
- ✅ **Fully public & free to use**

#### What You Can Store

- ✅ Articles
- ✅ Requirements
- ✅ Legal basis
- ✅ Evidence expectations

#### Example

```json
{
  "framework": "GDPR",
  "control_id": "Article 32",
  "title": "Security of Processing",
  "description": "Appropriate technical and organisational measures shall be implemented."
}
```

---

### D. HIPAA

#### Source Reality

- ✅ US Federal regulation
- ✅ **Fully public**

#### Structure

- Administrative
- Physical
- Technical safeguards

#### Example

```json
{
  "framework": "HIPAA",
  "domain": "Technical Safeguards",
  "control_id": "164.312(a)(1)",
  "title": "Access Control",
  "required": true
}
```

---

## 3. Where to Get Structured Data (Practically)

### Important Note

**You do not scrape PDFs manually.**

**Use open structured repositories:**

### Recommended GitHub Sources (Framework Definitions)

| Source | Frameworks | License |
|--------|------------|---------|
| **Compliance Masonry** | SOC2, ISO, NIST | Apache 2.0 |
| **OpenControl** | SOC2, FedRAMP | Apache 2.0 |
| **Awesome Compliance** | Mappings | Mixed |
| **NIST SP 800-53 (JSON)** | NIST | Public |
| **GovInfo** | HIPAA | Public |

**These provide machine-readable YAML/JSON.**

### Example: OpenControl Format

```yaml
name: CC6.1
family: Common Criteria
description: >
  The entity implements logical access security measures.
```

**You convert this into your DB schema.**

---

## 4. Opticini Compliance Canonical Data Model

### Important Note

**This is very important — do not overcomplicate.**

---

### A. Framework Table

**Table:** `frameworks`

**Fields:**
- `id`
- `name` (SOC2, ISO27001, GDPR)
- `version`
- `regulator`
- `description`
- `is_regulatory` (true/false)

---

### B. Domains / Categories

**Table:** `framework_domains`

**Fields:**
- `id`
- `framework_id`
- `code` (CC, A.9, Article)
- `name`
- `description`

---

### C. Controls (Core Table)

**Table:** `controls`

**Fields:**
- `id`
- `framework_id`
- `domain_id`
- `control_code` (CC6.1, A.9.2.3)
- `title`
- `description`
- `control_type` (technical / administrative / physical)
- `required` (boolean)

---

### D. Evidence Requirements (NOT evidence)

**Table:** `control_evidence_requirements`

**Fields:**
- `id`
- `control_id`
- `evidence_type` (policy, log, screenshot, config)
- `description`
- `collection_method` (manual / automated)

#### Example:

```json
{
  "control_id": "CC6.1",
  "evidence_type": "Access Control Policy",
  "collection_method": "manual"
}
```

---

### E. Policies Table (Generated Later)

**Note:** For now, store policy templates linked to controls.

**Table:** `policy_templates`

**Fields:**
- `id`
- `framework_id`
- `policy_name`
- `mapped_controls []`

---

## 5. How You Populate the Tables (Step-by-Step)

### Step 1: Import Framework Metadata

- SOC2
- ISO27001
- GDPR
- HIPAA

---

### Step 2: Import Domains

- **SOC 2:** CC1–CC9
- **ISO 27001:** Annex A sections
- **GDPR:** Articles
- **HIPAA:** Safeguards

---

### Step 3: Import Controls

**From:**
- OpenControl YAML
- Compliance Masonry JSON
- NIST JSON (if needed)

---

### Step 4: Add Evidence Expectations

**Using:**
- Auditor guidance
- Public audit checklists
- Industry mappings

---

## 6. What You Have After This Phase

✅ Fully populated Frameworks page  
✅ Controls visible & filterable  
✅ Evidence definitions ready  
✅ No scanners needed yet  
✅ Ready for UI sample pages  

**This becomes your compliance knowledge graph.**

---

## 7. What Comes NEXT (Only After This)

**Only after frameworks are populated do we:**

1. Attach scanner outputs
2. Attach manual uploads
3. Compute control status
4. Enable audits & reports

---

## Summary

### Framework Data Hierarchy

```
Framework
  ├── Domains / Categories
  │     ├── Controls
  │     │     ├── Control requirements
  │     │     ├── Evidence expectations
  │     │     └── Implementation guidance
```

### Authoritative Sources

| Framework | Source | What You Can Store |
|-----------|--------|-------------------|
| **SOC 2** | AICPA | Control IDs, intent summaries (not full text) |
| **ISO 27001** | ISO | Control IDs, titles, objectives (not full text) |
| **GDPR** | EU Law | Articles, requirements (fully public) |
| **HIPAA** | US Federal | Safeguards, requirements (fully public) |

### Data Model Tables

1. **frameworks** - Framework metadata
2. **framework_domains** - Domains/categories
3. **controls** - Control definitions
4. **control_evidence_requirements** - Evidence expectations
5. **policy_templates** - Policy templates (later)

### Population Steps

1. Import Framework Metadata
2. Import Domains
3. Import Controls
4. Add Evidence Expectations

### Outcome

- ✅ Fully populated Frameworks page
- ✅ Controls visible & filterable
- ✅ Evidence definitions ready
- ✅ Compliance knowledge graph ready

---

**Last Updated:** 2026-01-07  
**Status:** Implementation Guide

