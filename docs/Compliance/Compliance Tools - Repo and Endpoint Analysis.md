# Compliance Tools - Repository and Endpoint Analysis Report

**Date:** 2026-01-06  
**Purpose:** Analyze all compliance tools' repository links and API endpoints to verify data sources

---

## Executive Summary

**Total Tools:** 33  
**Tools with GitHub Repos:** 30  
**Tools with Non-GitHub Repos:** 3  
**Tools with API Endpoints:** 2  
**Tools Missing Endpoints:** 31  

**Critical Issues:**
- Only 2 tools have actual API endpoints configured
- Most tools have GitHub repos but no API endpoints for live data
- "View" button shows tool details but doesn't connect to live data sources
- No integration with actual tool APIs for evidence collection

---

## Detailed Analysis by Category

### 1. Frameworks & Control Definitions (5 tools)

| Tool | Repo URL | Type | Endpoint | Status | Issue |
|------|----------|------|----------|--------|-------|
| **OSCAL (NIST)** | https://github.com/usnistgov/OSCAL | GitHub | `https://github.com/usnistgov/oscal-content` ❌ | Not Configured | Endpoint is GitHub URL, not API |
| **OSCAL Content** | https://github.com/usnistgov/oscal-content | GitHub | `https://api.github.com/repos/usnistgov/oscal-content` ✅ | Not Configured | **Valid GitHub API endpoint** |
| **OpenControl** | https://github.com/opencontrol/compliance-masonry | GitHub | None | Not Configured | No API endpoint |
| **Compliance Masonry** | https://github.com/opencontrol/compliance-masonry | GitHub | None | Not Configured | No API endpoint |
| **OSCAL CLI** | https://github.com/usnistgov/oscal-cli | GitHub | None | Not Configured | No API endpoint |

**Issues:**
- Only 1 tool (OSCAL Content) has a valid API endpoint
- OSCAL (NIST) endpoint is incorrectly set to GitHub URL instead of API
- Other tools are libraries/external binaries with no API endpoints

---

### 2. Automated Evidence Collection (9 tools)

| Tool | Repo URL | Type | Endpoint | Status | Issue |
|------|----------|------|----------|--------|-------|
| **SSLyze** | https://github.com/nabla-c0d3/sslyze | GitHub | None | Not Configured | No API endpoint (CLI tool) |
| **SecurityHeaders** | https://github.com/securityheaders/securityheaders | GitHub | None | Not Configured | No API endpoint (CLI tool) |
| **OWASP ZAP** | https://github.com/zaproxy/zaproxy | GitHub | None | Not Configured | No API endpoint (has REST API but not configured) |
| **Schemathesis** | https://github.com/schemathesis/schemathesis | GitHub | None | Not Configured | No API endpoint (Python library) |
| **Trivy** | https://github.com/aquasecurity/trivy | GitHub | None | Not Configured | No API endpoint (CLI tool) |
| **Gitleaks** | https://github.com/gitleaks/gitleaks | GitHub | None | Not Configured | No API endpoint (CLI tool) |
| **Prowler** | https://github.com/prowler-cloud/prowler | GitHub | None | Not Configured | No API endpoint (CLI tool) |
| **Cloud Custodian** | https://github.com/cloud-custodian/cloud-custodian | GitHub | None | Not Configured | No API endpoint (Python library) |

**Issues:**
- All tools are CLI tools or libraries with no API endpoints configured
- OWASP ZAP has a REST API but endpoint not configured
- Tools need to be executed via CLI or library calls, not HTTP APIs

---

### 3. Manual Evidence & File Handling (3 tools)

| Tool | Repo URL | Type | Endpoint | Status | Issue |
|------|----------|------|----------|--------|-------|
| **Docassemble** | https://github.com/jhpyle/docassemble | GitHub | None | Not Configured | No API endpoint (Python framework) |
| **LibreOffice** | https://www.libreoffice.org/download/download/ | Website | None | Not Configured | Not a GitHub repo (download page) |
| **MinIO** | https://github.com/minio/minio | GitHub | None | Not Configured | No API endpoint (S3-compatible service) |

**Issues:**
- LibreOffice repo URL points to download page, not GitHub
- MinIO is S3-compatible but endpoint not configured
- Docassemble is a framework, not an API service

---

### 4. Policy Generation & Enforcement (3 tools)

| Tool | Repo URL | Type | Endpoint | Status | Issue |
|------|----------|------|----------|--------|-------|
| **Open Policy Agent (OPA)** | https://github.com/open-policy-agent/opa | GitHub | None | Not Configured | No API endpoint (has REST API but not configured) |
| **Rego** | https://github.com/open-policy-agent/opa | GitHub | None | Not Configured | No API endpoint (language, bundled with OPA) |
| **PolicyKit** | https://github.com/polkit-org/polkit | GitHub | None | Not Configured | No API endpoint (system library) |

**Issues:**
- OPA has a REST API (typically `http://localhost:8181/v1`) but not configured
- Rego is a language, not a service
- PolicyKit is a system library

---

### 5. Audit Management & Evidence Packaging (2 tools)

| Tool | Repo URL | Type | Endpoint | Status | Issue |
|------|----------|------|----------|--------|-------|
| **oscal-cli** | https://github.com/usnistgov/oscal-cli | GitHub | None | Not Configured | No API endpoint (CLI tool) |
| **Auditree** | https://github.com/auditree/auditree-framework | GitHub | None | Not Configured | No API endpoint (Python framework) |

**Issues:**
- Both are CLI/framework tools with no API endpoints

---

### 6. Reporting & Exports (4 tools)

| Tool | Repo URL | Type | Endpoint | Status | Issue |
|------|----------|------|----------|--------|-------|
| **WeasyPrint** | https://github.com/Kozea/WeasyPrint | GitHub | None | Not Configured | No API endpoint (Python library) |
| **ReportLab** | https://www.reportlab.com/dev/install/ | Website | None | Not Configured | Not a GitHub repo (install page) |
| **Jinja2** | https://github.com/pallets/jinja | GitHub | None | Not Configured | No API endpoint (Python library) |
| **Pandoc** | https://github.com/jgm/pandoc | GitHub | None | Not Configured | No API endpoint (CLI tool) |

**Issues:**
- ReportLab repo URL points to install page, not GitHub
- All are libraries/CLI tools with no API endpoints

---

### 7. Continuous Compliance & Drift Detection (4 tools)

| Tool | Repo URL | Type | Endpoint | Status | Issue |
|------|----------|------|----------|--------|-------|
| **Prometheus** | https://github.com/prometheus/prometheus | GitHub | None | Not Configured | No API endpoint (has REST API but not configured) |
| **Falco** | https://github.com/falcosecurity/falco | GitHub | None | Not Configured | No API endpoint (has gRPC API but not configured) |
| **Elastic ECS** | https://github.com/elastic/ecs | GitHub | None | Not Configured | No API endpoint (schema definition) |
| **Celery** | https://github.com/celery/celery | GitHub | None | Not Configured | No API endpoint (Python library) |

**Issues:**
- Prometheus has REST API (typically `http://localhost:9090/api/v1`) but not configured
- Falco has gRPC API but not configured
- Elastic ECS is a schema, not a service

---

### 8. AI, Data & Privacy Compliance (4 tools)

| Tool | Repo URL | Type | Endpoint | Status | Issue |
|------|----------|------|----------|--------|-------|
| **Presidio** | https://github.com/microsoft/presidio | GitHub | None | Not Configured | No API endpoint (has REST API but not configured) |
| **OpenLineage** | https://github.com/OpenLineage/OpenLineage | GitHub | None | Not Configured | No API endpoint (specification) |
| **Marquez** | https://github.com/MarquezProject/marquez | GitHub | None | Not Configured | No API endpoint (has REST API but not configured) |
| **Great Expectations** | https://github.com/great-expectations/great_expectations | GitHub | None | Not Configured | No API endpoint (Python library) |

**Issues:**
- Presidio has REST API but not configured
- Marquez has REST API but not configured
- OpenLineage is a specification, not a service

---

## Summary of Issues

### Critical Issues

1. **Only 1 tool has a valid API endpoint configured:**
   - OSCAL Content: `https://api.github.com/repos/usnistgov/oscal-content` ✅

2. **1 tool has incorrect endpoint:**
   - OSCAL (NIST): Endpoint is GitHub URL instead of API endpoint

3. **31 tools have no API endpoints:**
   - Most are CLI tools, libraries, or frameworks
   - Some have APIs but endpoints not configured (OWASP ZAP, OPA, Prometheus, Falco, Presidio, Marquez)

4. **2 tools have non-GitHub repo URLs:**
   - LibreOffice: Points to download page
   - ReportLab: Points to install page

### Tools with Available APIs (Not Configured)

These tools have REST/gRPC APIs but endpoints are not configured:

1. **OWASP ZAP** - REST API (default: `http://localhost:8080`)
2. **Open Policy Agent (OPA)** - REST API (default: `http://localhost:8181/v1`)
3. **Prometheus** - REST API (default: `http://localhost:9090/api/v1`)
4. **Falco** - gRPC API (default: `unix:///var/run/falco.sock`)
5. **Presidio** - REST API (default: `http://localhost:3000`)
6. **Marquez** - REST API (default: `http://localhost:5000/api/v1`)
7. **MinIO** - S3-compatible API (default: `http://localhost:9000`)

---

## Recommendations

### Immediate Actions

1. **Fix OSCAL (NIST) endpoint:**
   - Change from: `https://github.com/usnistgov/oscal-content`
   - Change to: `https://api.github.com/repos/usnistgov/oscal-content` (or remove if not needed)

2. **Fix non-GitHub repo URLs:**
   - LibreOffice: Change to `https://github.com/LibreOffice/core` (if available) or keep as-is
   - ReportLab: Change to GitHub if available, or keep as-is

3. **Configure API endpoints for tools with APIs:**
   - OWASP ZAP: `http://localhost:8080` (or configured URL)
   - OPA: `http://localhost:8181/v1`
   - Prometheus: `http://localhost:9090/api/v1`
   - Falco: `unix:///var/run/falco.sock` (or HTTP endpoint)
   - Presidio: `http://localhost:3000`
   - Marquez: `http://localhost:5000/api/v1`
   - MinIO: `http://localhost:9000` (S3-compatible)

### Long-term Actions

1. **Create integration layer:**
   - For CLI tools: Create wrapper services that expose REST APIs
   - For libraries: Create microservices that use the libraries
   - For frameworks: Integrate directly into Opticini backend

2. **Implement data collection:**
   - Connect to configured API endpoints
   - Schedule periodic evidence collection
   - Store evidence in compliance_evidence table

3. **Update "View" button:**
   - For tools with APIs: Show live data from endpoint
   - For tools without APIs: Show tool documentation/status
   - For CLI tools: Show last execution results

4. **Add tool status monitoring:**
   - Check if API endpoints are reachable
   - Monitor tool health
   - Alert on failures

---

## Tools by Endpoint Type

### ✅ Has API Endpoint (1 tool)
- OSCAL Content

### ⚠️ Has API but Not Configured (7 tools)
- OWASP ZAP
- Open Policy Agent (OPA)
- Prometheus
- Falco
- Presidio
- Marquez
- MinIO

### ❌ No API (CLI/Library/Framework) (25 tools)
- All other tools

---

## Next Steps

1. **Update tool configurations** with correct endpoints
2. **Create integration services** for CLI tools
3. **Implement data collection** from configured APIs
4. **Add health checks** for tool endpoints
5. **Update UI** to show live data from endpoints

---

**Report Generated:** 2026-01-06  
**Total Tools Analyzed:** 33  
**Tools with Valid Endpoints:** 1  
**Tools Needing Configuration:** 7  
**Tools Requiring Integration:** 25

