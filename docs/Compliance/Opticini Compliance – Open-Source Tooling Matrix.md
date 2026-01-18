# Opticini Compliance – Open-Source Tools Matrix

A comprehensive guide to open-source tools for compliance automation, evidence collection, and policy enforcement.

---

## 1️⃣ Compliance Frameworks & Control Definitions

| Tool | Purpose | License | Download / Repo | How Opticini Uses It |
|------|---------|---------|-----------------|---------------------|
| **OSCAL (NIST)** | Canonical control schema | CC0 | [GitHub](https://github.com/usnistgov/OSCAL) | Internal control data model |
| **OpenControl** | Compliance-as-code | Apache 2.0 | [GitHub](https://github.com/opencontrol/compliance-masonry) | Control → evidence mapping |
| **Compliance Masonry** | Control catalogs | Apache 2.0 | [GitHub](https://github.com/opencontrol/compliance-masonry) | Import SOC2 / ISO mappings |
| **InSpec** | Control logic | Apache 2.0 | [GitHub](https://github.com/inspec/inspec) | Technical control checks |
| **GovReady-Q** | GRC workflows | AGPL | [GitHub](https://github.com/GovReady/govready-q) | Reference only (no embed) |

> ✅ **Recommended Core:** OSCAL + OpenControl patterns

---

## 2️⃣ Automated Evidence Collection (Security & Infrastructure)

### TLS / SSL

| Tool | License | Download / Repo | Evidence Produced |
|------|---------|-----------------|------------------|
| **SSLyze** | Apache 2.0 | [GitHub](https://github.com/nabla-c0d3/sslyze) | Certs, ciphers, expiry |

### HTTP Headers

| Tool | License | Download / Repo | Evidence Produced |
|------|---------|-----------------|------------------|
| **SecurityHeaders** | Apache 2.0 | [GitHub](https://github.com/securityheaders/securityheaders) | CSP, HSTS, XFO |

### DAST (Dynamic Application Security Testing)

| Tool | License | Download / Repo | Evidence Produced |
|------|---------|-----------------|------------------|
| **OWASP ZAP** | Apache 2.0 | [GitHub](https://github.com/zaproxy/zaproxy) | Vuln scan reports |

### API Testing

| Tool | License | Download / Repo | Evidence Produced |
|------|---------|-----------------|------------------|
| **Schemathesis** | MIT | [GitHub](https://github.com/schemathesis/schemathesis) | API compliance |

### Containers

| Tool | License | Download / Repo | Evidence Produced |
|------|---------|-----------------|------------------|
| **Trivy** | Apache 2.0 | [GitHub](https://github.com/aquasecurity/trivy) | CVEs, misconfigs |

### Secrets Detection

| Tool | License | Download / Repo | Evidence Produced |
|------|---------|-----------------|------------------|
| **Gitleaks** | MIT | [GitHub](https://github.com/gitleaks/gitleaks) | Secret detection |

### Cloud (AWS)

| Tool | License | Download / Repo | Evidence Produced |
|------|---------|-----------------|------------------|
| **Prowler** | Apache 2.0 | [GitHub](https://github.com/prowler-cloud/prowler) | IAM & cloud evidence |

### Policy-as-Code

| Tool | License | Download / Repo | Evidence Produced |
|------|---------|-----------------|------------------|
| **Cloud Custodian** | Apache 2.0 | [GitHub](https://github.com/cloud-custodian/cloud-custodian) | Resource compliance |

---

## 3️⃣ Manual Evidence & File Handling

| Tool | Purpose | License | Download / Repo | Use |
|------|---------|---------|-----------------|-----|
| **Docassemble** | Evidence intake | MIT | [GitHub](https://github.com/jhpyle/docassemble) | Evidence workflows |
| **LibreOffice (headless)** | Doc conversion | MPL | [Download](https://www.libreoffice.org/download/download/) | Convert uploads |
| **MinIO** | Object storage | AGPL | [GitHub](https://github.com/minio/minio) | S3-compatible evidence storage |

> ⚠️ **MinIO AGPL** → Safe if used as external service, not embedded.

---

## 4️⃣ Policy Generation & Enforcement (Critical)

| Tool | Purpose | License | Download / Repo | Opticini Role |
|------|---------|---------|-----------------|---------------|
| **Open Policy Agent (OPA)** | Policy engine | Apache 2.0 | [GitHub](https://github.com/open-policy-agent/opa) | Core compliance logic |
| **Rego** | Policy language | Apache 2.0 | (bundled with OPA) | Control assertions |
| **PolicyKit** | Authorization | LGPL | [GitHub](https://github.com/polkit-org/polkit) | RBAC reference |

> 🔥 **OPA is mandatory** — it is the backbone of compliance decisions.

---

## 5️⃣ Audit Management & Evidence Packaging

| Tool | Purpose | License | Download / Repo | Use |
|------|---------|---------|-----------------|-----|
| **oscal-cli** | Audit packaging | Apache 2.0 | [GitHub](https://github.com/usnistgov/oscal-cli) | Evidence bundles |
| **Auditree** | Audit workflows | GPL | [GitHub](https://github.com/auditree/auditree-framework) | Concept reference |
| **OpenAudit** | Asset audits | GPL | [GitHub](https://github.com/opmantek/open-audit) | Reference only |

---

## 6️⃣ Reporting & Exports

| Tool | Purpose | License | Download / Repo | Use |
|------|---------|---------|-----------------|-----|
| **WeasyPrint** | HTML → PDF | BSD | [GitHub](https://github.com/Kozea/WeasyPrint) | Compliance reports |
| **ReportLab** | PDF engine | BSD | [Install](https://www.reportlab.com/dev/install/) | Custom layouts |
| **Jinja2** | Templating | BSD | [GitHub](https://github.com/pallets/jinja) | Report rendering |
| **Pandoc** | Doc conversion | GPL | [GitHub](https://github.com/jgm/pandoc) | Optional |

---

## 7️⃣ Continuous Compliance & Drift Detection

| Tool | Purpose | License | Download / Repo | Evidence |
|------|---------|---------|-----------------|----------|
| **Prometheus** | Metrics | Apache 2.0 | [GitHub](https://github.com/prometheus/prometheus) | Evidence freshness |
| **Falco** | Runtime security | Apache 2.0 | [GitHub](https://github.com/falcosecurity/falco) | Runtime events |
| **Elastic ECS** | Event schema | Apache 2.0 | [GitHub](https://github.com/elastic/ecs) | Normalization |
| **Celery** | Job engine | BSD | [GitHub](https://github.com/celery/celery) | Re-evaluations |

---

## 8️⃣ AI, Data & Privacy Compliance (Opticini Advantage)

| Tool | Purpose | License | Download / Repo | Use |
|------|---------|---------|-----------------|-----|
| **Presidio** | PII detection | Apache 2.0 | [GitHub](https://github.com/microsoft/presidio) | GDPR / AI |
| **OpenLineage** | Data lineage | Apache 2.0 | [GitHub](https://github.com/OpenLineage/OpenLineage) | AI traceability |
| **Marquez** | Lineage backend | Apache 2.0 | [GitHub](https://github.com/MarquezProject/marquez) | Optional |
| **Great Expectations** | Data quality | Apache 2.0 | [GitHub](https://github.com/great-expectations/great_expectations) | AI input checks |

---

## 9️⃣ UI / Frontend Tooling

| Tool | Purpose | License | Download / Repo |
|------|---------|---------|-----------------|
| **React** | UI | MIT | [GitHub](https://github.com/facebook/react) |
| **Tailwind CSS** | Styling | MIT | [GitHub](https://github.com/tailwindlabs/tailwindcss) |
| **shadcn/ui** | Components | MIT | [GitHub](https://github.com/shadcn/ui) |
| **TanStack Table** | Tables | MIT | [GitHub](https://github.com/TanStack/table) |
| **Mermaid** | Diagrams | MIT | [GitHub](https://github.com/mermaid-js/mermaid) |

---

## License Safety Summary (Quick Reference)

| License | Safe to Embed? | Notes |
|---------|----------------|-------|
| **Apache / MIT / BSD** | ✅ Yes | Preferred |
| **MPL** | ⚠️ Yes | File-level copyleft |
| **LGPL** | ⚠️ Yes | Dynamic linking |
| **GPL / AGPL** | ❌ No | Use externally only |

---

## Final Architectural Guidance (Important)

### ✅ Do This:

1. **Wrap each tool as an Evidence Producer**
   - Each scanner/monitor becomes an evidence source
   - Normalize output to standard format

2. **Normalize output → Evidence Bus → Compliance Engine**
   - All evidence flows through central bus
   - Compliance engine evaluates based on evidence

3. **Use external services for AGPL/GPL tools**
   - Run as separate services
   - Communicate via API

### ❌ Never Do This:

1. **Let scanners talk directly to UI**
   - Always route through evidence bus
   - Maintain separation of concerns

2. **Embed AGPL/GPL code into Opticini core**
   - Violates license terms
   - Use as external services only

---

## Integration Architecture

```
┌─────────────────┐
│  Evidence       │
│  Producers      │
│  (Scanners)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Evidence Bus   │
│  (Normalizer)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Compliance     │
│  Engine (OPA)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Compliance     │
│  Apps (UI)      │
└─────────────────┘
```

---

## Recommended Tool Stack for Opticini

### Core Foundation
- **OSCAL** - Control definitions
- **OPA** - Policy engine
- **OpenControl** - Control mapping patterns

### Evidence Collection
- **SSLyze** - TLS/SSL evidence
- **OWASP ZAP** - DAST evidence
- **Trivy** - Container evidence
- **Prowler** - Cloud evidence (if AWS)

### Infrastructure
- **Celery** - Background jobs
- **MinIO** - Evidence storage (external)
- **Jinja2** - Report templating
- **WeasyPrint** - PDF generation

### Optional Enhancements
- **Presidio** - PII detection (GDPR/AI)
- **OpenLineage** - Data lineage (AI compliance)
- **Prometheus** - Evidence freshness monitoring

---

## Next Steps

1. **Evaluate license compatibility** for each tool
2. **Design Evidence Producer interface** for tool integration
3. **Build Evidence Bus** for normalization
4. **Integrate OPA** as compliance decision engine
5. **Create adapters** for each evidence-producing tool

