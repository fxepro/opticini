# Compliance Tools Architecture Decision

## Problem Statement

The Tools Management page is becoming complex with:
- Site Audit tools
- Security tools
- API tools
- Performance tools
- Compliance tools (new)

**Concerns:**
1. **Multi-tenancy**: Different organizations need different compliance tools
2. **Separation of concerns**: Compliance tools serve different purposes than security/performance tools
3. **Complexity**: Mixing all tools in one place may be confusing
4. **Context**: Compliance tools are used within compliance workflows, not general platform tools

## Current Architecture

### Tools Management Page (`/workspace/tools-management`)
- **Purpose**: Manage platform/system-level tools
- **Tools**: Site Audit, Security, API, Performance
- **Scope**: System-wide configuration
- **Users**: Platform administrators

### Compliance Module
- **Apps**: Frameworks, Controls, Evidence, Policies, Audits, Reports
- **Purpose**: Compliance workflow management
- **Scope**: Organization-specific compliance activities

## Architectural Options

### Option 1: Keep Compliance Tools in Tools Management (Current Plan)
**Pros:**
- Centralized tool management
- Single place to configure all tools
- Consistent UI/UX

**Cons:**
- Mixes system tools with compliance-specific tools
- Doesn't account for multi-tenancy differences
- Compliance tools need different configuration context
- Tools Management becomes too complex

### Option 2: Move Compliance Tools to Compliance Module
**Pros:**
- **Better context**: Tools are where they're used
- **Multi-tenancy**: Each org can have different compliance tool configurations
- **Separation**: Compliance tools separate from platform tools
- **Workflow integration**: Tools can be configured per compliance workflow
- **Simpler Tools Management**: Keeps platform tools focused

**Cons:**
- Duplicates some tool management logic
- Need to create tool management UI in compliance section

### Option 3: Hybrid Approach (Recommended)
**Pros:**
- **Tools Management**: System/platform tools only (Performance, Security, API, Site Audit)
- **Compliance Tools**: Managed within Compliance module
- **Clear separation**: Platform vs. Compliance tools
- **Multi-tenancy**: Compliance tools can be org-specific
- **Context-aware**: Tools configured where they're used

**Cons:**
- Two places to manage tools (but with clear purpose)

## Recommended Architecture: Option 3 (Hybrid)

### Tools Management (`/workspace/tools-management`)
**Purpose**: System/Platform tools
- Site Audit tools
- Security scanning tools
- API monitoring tools
- Performance analysis tools

**Characteristics:**
- System-wide configuration
- Platform-level tools
- Used across all features

### Compliance Tools (`/workspace/compliance/tools`)
**Purpose**: Compliance-specific tools
- OSCAL frameworks
- Automated evidence collection
- Policy enforcement
- Audit management
- Reporting tools
- Continuous compliance
- AI & Privacy tools

**Characteristics:**
- Organization-specific configuration
- Compliance workflow integration
- Evidence collection integration
- Framework-specific tool requirements

## Implementation Structure

### Database Models

**1. Keep `SecurityTool` model** (in `security_monitoring` app)
- For platform/system tools
- Used by Tools Management

**2. Create `ComplianceTool` model** (in `compliance_tools` app)
- For compliance-specific tools
- Organization-specific
- Linked to compliance workflows

### UI Structure

**1. Tools Management Page** (`/workspace/tools-management`)
```
Tabs:
- Site Audit
- Security
- API
- Performance
```

**2. Compliance Tools Page** (`/workspace/compliance/tools`)
```
Tabs:
- Frameworks (OSCAL, OpenControl, etc.)
- Automated Evidence (SSLyze, OWASP ZAP, Trivy, etc.)
- Manual Evidence (Docassemble, LibreOffice, MinIO)
- Policy Enforcement (OPA, Rego, PolicyKit)
- Audit Management (oscal-cli, Auditree)
- Reporting (WeasyPrint, ReportLab, Jinja2, Pandoc)
- Continuous Compliance (Prometheus, Falco, Celery, Elastic ECS)
- AI & Privacy (Presidio, OpenLineage, Great Expectations)
```

### Navigation Structure

**Sidebar:**
```
Compliance
├── Frameworks
├── Controls
├── Evidence
├── Policies
├── Audits
├── Reports
└── Tools  ← NEW: Compliance-specific tools
```

**Tools Management:**
```
Tools Management
├── Site Audit
├── Security
├── API
└── Performance
```

## Benefits of This Architecture

### 1. Clear Separation
- **Platform tools** = System-wide, infrastructure-level
- **Compliance tools** = Organization-specific, workflow-level

### 2. Multi-Tenancy Support
- Each organization can configure different compliance tools
- Compliance tools can be enabled/disabled per org
- Tool configurations are org-specific

### 3. Context-Aware Configuration
- Compliance tools configured within compliance context
- Can link tools to specific frameworks/controls
- Evidence collection tools tied to evidence workflows

### 4. Simplified Tools Management
- Tools Management focuses on platform tools only
- Less complexity, clearer purpose

### 5. Better Integration
- Compliance tools can be referenced in:
  - Framework configurations
  - Control evidence requirements
  - Audit workflows
  - Report generation

## Data Model Differences

### SecurityTool (Platform Tools)
```python
# System-wide tools
- No organization_id (system-level)
- Used across all features
- Platform administrators manage
```

### ComplianceTool (Compliance Tools)
```python
# Organization-specific tools
- organization_id (required)
- Used in compliance workflows
- Compliance managers configure
- Can be linked to frameworks/controls
```

## Migration Path

1. **Create `compliance_tools` app**
   - Model: `ComplianceTool`
   - Views: Tool management
   - URLs: `/api/compliance/tools/`

2. **Create Compliance Tools UI**
   - Page: `/workspace/compliance/tools`
   - Tabs: All 8 compliance tool categories
   - Integration with compliance workflows

3. **Remove Compliance tab from Tools Management**
   - Keep Tools Management focused on platform tools
   - Move compliance tools to compliance section

4. **Update Navigation**
   - Add "Tools" under Compliance section
   - Keep Tools Management separate

## Example Use Cases

### Use Case 1: Organization A needs SOC 2 compliance
- Configures OSCAL tools in Compliance → Tools
- Sets up OWASP ZAP for automated evidence
- Configures OPA for policy enforcement
- All tools are org-specific

### Use Case 2: Organization B needs ISO 27001
- Different compliance tools configuration
- Different evidence collection tools
- Different policy enforcement setup
- Independent from Organization A

### Use Case 3: Platform Administrator
- Manages system-wide tools in Tools Management
- Performance monitoring tools
- Security scanning infrastructure
- API monitoring services

## Conclusion

**Recommendation: Move Compliance Tools to Compliance Module**

This provides:
- ✅ Better separation of concerns
- ✅ Multi-tenancy support
- ✅ Context-aware configuration
- ✅ Simpler Tools Management
- ✅ Better workflow integration

**Implementation:**
- Create `compliance_tools` app
- Create `/workspace/compliance/tools` page
- Remove Compliance tab from Tools Management
- Add "Tools" to Compliance navigation

