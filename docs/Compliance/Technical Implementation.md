# Opticini Compliance – Technical Implementation Plan

## Starting Assumptions (Baseline)

You already have:

- Multi-tenant DB
- Users, roles, assets
- Scan engines / monitoring apps
- Framework metadata available

**So the next work begins at the control + evidence layer.**

---

## PHASE 1 — Control Engine (Foundation)

> ⚠️ **If this is wrong, everything breaks later.**

### 1. Define the Canonical Control Model (DO THIS FIRST)

**Core Tables / Models:**
- Framework
- Control
- FrameworkControl (many-to-many)

**Control MUST include:**
- `control_id` (stable, e.g. SOC2-CC6.1)
- `title`
- `description`
- `category`
- `severity`
- `control_type` (technical | procedural | hybrid)
- `automation_level` (auto | partial | manual)
- `scoring_rule`

**Why this comes next:**
- Everything (evidence, policies, audits) depends on controls
- This becomes your single source of truth

### 2. Control Evaluation State (Per Tenant)

Add tenant-scoped evaluation state, not global.

```
ControlStatus
- tenant_id
- control_id
- status (pass | fail | partial | unknown)
- last_evaluated_at
- confidence_score
- reason
```

**This allows:**
- Per-customer compliance
- Drift detection
- Historical tracking

### 3. Control → Evidence Requirements Mapping

Define what evidence satisfies each control.

```
ControlEvidenceRequirement
- control_id
- evidence_type
- source_app
- freshness_days
- required (true/false)
```

**Example:**
```
SOC2-CC6.1
- TLS Scan (required, 30 days)
- HTTP Headers Scan (required, 30 days)
```

> ⚠️ **This mapping is critical — it drives automation.**

---

## PHASE 2 — Evidence System (The Backbone)

### 4. Evidence Ingestion Pipeline

All scanners, monitors, and integrations must emit normalized evidence events.

**Evidence Event Schema:**
```
Evidence
- id
- tenant_id
- asset_id
- control_id (optional at ingest)
- source_app
- evidence_type
- raw_payload (JSON)
- collected_at
- expires_at
- integrity_hash
```

**Rule:**
> Scanners never decide compliance.  
> They only submit evidence.

### 5. Evidence Normalization Layer

Implement adapters:

- ZAP Adapter
- Trivy Adapter
- SSLyze Adapter
- AI Monitor Adapter
- Manual Upload Adapter

**Each adapter:**
- Parses raw output
- Normalizes fields
- Tags potential control matches

### 6. Evidence Freshness & Validity Engine

A scheduled job:

- Marks evidence as:
  - Fresh
  - Expired
  - Superseded
- Triggers re-evaluation of affected controls

**This enables continuous compliance.**

---

## PHASE 3 — Control Evaluation Engine

### 7. Control Scoring Logic

For each control:

1. Fetch required evidence
2. Check freshness
3. Apply scoring rules
4. Update ControlStatus

**Example logic:**
```
IF all required evidence fresh AND no critical findings
  → PASS
ELSE IF partial evidence
  → PARTIAL
ELSE
  → FAIL
```

### 8. Policy-as-Code Integration (OPA)

Integrate Open Policy Agent as the decision engine.

**Flow:**
```
Evidence → OPA → Decision → ControlStatus
```

**Benefits:**
- Transparent logic
- Auditable rules
- Easy framework expansion

---

## PHASE 4 — Compliance Apps Enablement

Now the six UI apps become thin layers over the engine.

### 9. Frameworks App (Aggregation)

**Backend:**
- Aggregate control statuses by framework
- Calculate readiness % and risk score

**APIs:**
- `GET /compliance/frameworks`
- `GET /compliance/frameworks/{id}/summary`

### 10. Controls App (Operations)

**Backend:**
- Control list
- Control detail
- Evidence linkage
- Remediation hints

**APIs:**
- `GET /compliance/controls`
- `GET /compliance/controls/{id}`

### 11. Evidence App (Proof)

**Backend:**
- Evidence search
- Upload
- Preview
- Locking (for audits)

**APIs:**
- `GET /compliance/evidence`
- `POST /compliance/evidence/upload`

### 12. Policies App (Generation)

**Implementation:**
- Policy templates (Jinja)
- Auto-populate from evidence + configs
- Version tracking

**APIs:**
- `GET /compliance/policies`
- `POST /compliance/policies/generate`

### 13. Audits App (Time-Bound Mode)

**Key concept: Evidence freeze**

```
Audit
- id
- framework_id
- start_date
- end_date
- frozen_evidence_snapshot
```

**During audit:**
- No evidence mutation
- Read-only access for auditors

### 14. Reports App (Output)

**Implementation:**
- HTML templates per framework
- Evidence inclusion
- PDF export

**APIs:**
- `POST /compliance/reports/generate`

---

## PHASE 5 — Integrations & Remote Software

### 15. Remote Scanners / Agents (Optional)

Install only when needed:

- Trivy (containers)
- Gitleaks (repos)
- Cloud read-only IAM (Prowler)

**All agents:**
- Push results
- Never store state locally

---

## PHASE 6 — Hardening & Production Readiness

### 16. RBAC Enforcement

- Admin
- Security Admin
- Auditor (read-only)

### 17. Integrity & Tamper Protection

- Evidence hashes
- Immutable audit logs

### 18. Performance

- Async evidence ingestion
- Batched control evaluations

---

## Implementation Order (Strict)

> ✅ **Do not skip order**

1. Control model
2. Evidence model
3. Evidence ingestion
4. Control evaluation
5. OPA integration
6. UI apps
7. Audits
8. Reports

