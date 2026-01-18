# OSCAL Catalog Integration Plan

## Overview

Integrate NIST OSCAL (Open Security Controls Assessment Language) catalog format to systematize and automate compliance framework, control, and evidence management. This will enable automatic import of standardized control catalogs (SP 800-53, ISO 27002, etc.) and create a foundation for automated compliance evaluation.

**Reference:** [OSCAL Catalog Model](https://pages.nist.gov/OSCAL/learn/concepts/layer/control/catalog/)

---

## 1. OSCAL Data Sources

### Primary Sources

**NIST Official Catalogs:**
- **SP 800-53 Revision 5** - Available in OSCAL XML, JSON, YAML
- **SP 800-53 Revision 4** - Available in OSCAL XML, JSON, YAML
- **Location:** [OSCAL Content GitHub Repository](https://github.com/usnistgov/oscal-content)
- **Update Frequency:** Maintained by NIST, updated regularly
- **Formats:** XML, JSON, YAML (all equivalent, can convert between)

**Other Framework Catalogs:**
- **ISO/IEC 27002** - May have OSCAL representations (community or vendor)
- **COBIT 5** - May have OSCAL representations
- **Custom Catalogs** - Organizations can author their own OSCAL catalogs

### Data Format Structure

**OSCAL Catalog Contains:**
- **Metadata:** Title, version, publication date, OSCAL version, roles, parties, locations
- **Parameters:** Dynamic values applicable across controls
- **Controls:** 
  - Control ID (stable identifier)
  - Control definition (required functionality)
  - Control parameters (dynamic values)
  - Control guidance (implementation guidance)
  - Control objectives (what should be achieved)
  - Assessment methods (how to verify implementation)
  - Related controls (links to other controls)
  - References (supporting documentation)
- **Groups:** Related controls grouped together
- **Back Matter:** Attachments, citations, embedded content

---

## 2. Integration Architecture

### Data Flow

```
OSCAL Catalog (JSON/XML/YAML)
    ↓
OSCAL Parser/Importer
    ↓
Normalize to Opticini Models
    ↓
Framework (from catalog metadata)
Control (from control definitions)
ControlEvidenceRequirement (from assessment methods)
    ↓
Store in Database
    ↓
Available for Compliance Apps
```

### Key Integration Points

**1. Framework Creation:**
- Extract framework metadata from OSCAL catalog
- Create/update ComplianceFramework record
- Map catalog title → framework name
- Map catalog version → framework version

**2. Control Import:**
- Parse each control in OSCAL catalog
- Create ComplianceControl records
- Map OSCAL control ID → control_id
- Map OSCAL control definition → description
- Extract objectives, guidance, parameters

**3. Control-Framework Mapping:**
- Automatically create ComplianceControlFrameworkMapping
- Link controls to framework based on catalog source

**4. Evidence Requirements:**
- Parse assessment methods from OSCAL controls
- Create ControlEvidenceRequirement records
- Map assessment methods → evidence types
- Extract freshness requirements from guidance

---

## 3. OSCAL to Opticini Model Mapping

### Framework Mapping

| OSCAL Catalog | Opticini Model | Notes |
|--------------|----------------|-------|
| `metadata.title` | `ComplianceFramework.name` | Framework name |
| `metadata.version` | Framework version (new field) | Version tracking |
| `metadata.published` | `ComplianceFramework.created_at` | Publication date |
| Catalog UUID | Framework identifier | Unique catalog ID |
| Catalog type (SP 800-53, etc.) | `ComplianceFramework.code` | Framework code |

### Control Mapping

| OSCAL Control | Opticini Control | Notes |
|--------------|------------------|-------|
| `control.id` | `control_id` | Stable identifier (e.g., AC-1) |
| `control.title` | `name` | Control title |
| `control.props` (with name="label") | `category` | Control category/family |
| `control.params` | Control parameters (new field) | Dynamic values |
| `control.parts` (type="objective") | Control objectives (new field) | What should be achieved |
| `control.parts` (type="guidance") | Additional guidance (new field) | Implementation guidance |
| `control.parts` (type="assessment") | Assessment methods → Evidence requirements | Maps to ControlEvidenceRequirement |
| `control.links` | References (new field) | Supporting documentation |
| `control.controls` (sub-controls) | Related controls | Nested controls |

### Assessment Methods → Evidence Requirements

| OSCAL Assessment | Opticini EvidenceRequirement | Notes |
|-----------------|------------------------------|-------|
| `part.type="assessment"` | `evidence_type` | Type of evidence needed |
| Assessment description | `source_app` | Which scanner/monitor provides this |
| Assessment frequency | `freshness_days` | How often evidence must be refreshed |
| Assessment requirement | `required` | Whether evidence is mandatory |

---

## 4. New Tools Management Tab: "OSCAL Catalogs"

### Tab Purpose

Manage OSCAL catalog imports, updates, and synchronization. This becomes the central hub for systematizing compliance frameworks.

### Tab Features

**4.1 Catalog Library**
- List of available OSCAL catalogs
- Official NIST catalogs (SP 800-53 R4, R5)
- Custom uploaded catalogs
- Catalog metadata (version, publication date, control count)
- Status indicators (imported, outdated, needs update)

**4.2 Catalog Import**
- Upload OSCAL file (JSON/XML/YAML)
- URL import from GitHub/NIST sources
- Automatic format detection and conversion
- Preview before import
- Conflict resolution (if catalog already exists)

**4.3 Catalog Management**
- View catalog details
- Compare catalog versions
- Update existing catalog (merge new controls)
- Delete/archive catalog
- Export catalog to OSCAL format

**4.4 Framework Generation**
- Auto-generate ComplianceFramework from catalog
- Map catalog to existing framework (if already exists)
- Configure framework settings (category, icon, etc.)
- Preview framework before creation

**4.5 Control Import**
- Bulk import controls from catalog
- Preview controls before import
- Map OSCAL control IDs to existing controls
- Handle control updates (if control changed in catalog)
- Import control relationships (related controls)

**4.6 Evidence Requirements Extraction**
- Parse assessment methods from controls
- Auto-generate ControlEvidenceRequirement records
- Map assessment methods to evidence types
- Configure freshness requirements
- Preview requirements before creation

**4.7 Synchronization**
- Check for catalog updates (compare versions)
- Sync changes from updated catalogs
- Handle control modifications
- Handle control additions/removals
- Conflict resolution UI

**4.8 Validation**
- Validate OSCAL file format
- Check for required fields
- Verify control structure
- Report import errors
- Preview import statistics

---

## 5. Database Schema Changes

### New Models

**5.1 OSCALCatalog Model**
```
- id (UUID)
- catalog_id (stable identifier from OSCAL)
- title
- version
- oscal_version
- published_date
- last_modified
- source_url (where catalog came from)
- file_format (json/xml/yaml)
- file_path (stored file location)
- control_count
- imported_at
- imported_by (User FK)
- organization_id
- created_at
- updated_at
```

**5.2 OSCALControlImport Model**
```
- id (UUID)
- catalog (FK to OSCALCatalog)
- oscal_control_id
- control (FK to ComplianceControl, nullable)
- import_status (pending/imported/failed/skipped)
- import_errors
- imported_at
- imported_by (User FK)
```

**5.3 ControlParameter Model** (from OSCAL params)
```
- id (UUID)
- control (FK to ComplianceControl)
- param_id (from OSCAL)
- name
- value
- default_value
- options (JSON array)
- description
```

**5.4 ControlObjective Model** (from OSCAL objectives)
```
- id (UUID)
- control (FK to ComplianceControl)
- objective_id
- description
- order
```

**5.5 ControlGuidance Model** (from OSCAL guidance)
```
- id (UUID)
- control (FK to ComplianceControl)
- guidance_type
- content
- order
```

### Enhanced Models

**5.6 Add to ComplianceFramework:**
```
- oscal_catalog_id (FK to OSCALCatalog, nullable)
- catalog_version
- last_synced_at
```

**5.7 Add to ComplianceControl:**
```
- oscal_control_id (original OSCAL ID)
- oscal_catalog_id (which catalog it came from)
- control_objectives (JSON or related model)
- control_guidance (JSON or related model)
- control_parameters (JSON or related model)
- related_control_ids (from OSCAL links)
```

---

## 6. Implementation Phases

### Phase 1: OSCAL Parser Library (Foundation)

**Goal:** Build parser to read OSCAL catalogs

**Tasks:**
1. Install/import OSCAL JSON/XML/YAML parser library
2. Create OSCALCatalog parser class
3. Extract metadata, controls, groups, parameters
4. Handle OSCAL version differences (R4 vs R5)
5. Convert between formats (XML ↔ JSON ↔ YAML)
6. Validate OSCAL file structure

**Deliverables:**
- `backend/compliance_oscal/parsers.py`
- Unit tests for parser
- Sample OSCAL file handling

### Phase 2: Database Models & Migrations

**Goal:** Create database schema for OSCAL integration

**Tasks:**
1. Create OSCALCatalog model
2. Create OSCALControlImport model
3. Create ControlParameter, ControlObjective, ControlGuidance models
4. Add OSCAL fields to ComplianceFramework and ComplianceControl
5. Create migrations
6. Seed with initial NIST catalog metadata

**Deliverables:**
- Migration files
- Model definitions
- Admin interface for models

### Phase 3: Import Engine

**Goal:** Build logic to import OSCAL catalogs into Opticini models

**Tasks:**
1. Create catalog import service
2. Map OSCAL → ComplianceFramework
3. Map OSCAL → ComplianceControl
4. Map OSCAL → ComplianceControlFrameworkMapping
5. Extract assessment methods → ControlEvidenceRequirement
6. Handle conflicts (existing controls)
7. Handle updates (catalog version changes)
8. Error handling and rollback

**Deliverables:**
- `backend/compliance_oscal/importers.py`
- Import service class
- Error handling logic

### Phase 4: Tools Management UI Tab

**Goal:** Create UI for managing OSCAL catalogs

**Tasks:**
1. Create new tab in Tools Management app
2. Catalog library view (list of catalogs)
3. Catalog import form (upload/URL)
4. Catalog detail view
5. Import preview modal
6. Import progress indicator
7. Conflict resolution UI
8. Synchronization UI

**Deliverables:**
- `studio/app/workspace/tools-management/oscal/page.tsx`
- Catalog list component
- Import form component
- Detail view component

### Phase 5: API Endpoints

**Goal:** Expose OSCAL functionality via REST API

**Tasks:**
1. POST /api/compliance/oscal/catalogs/import
2. GET /api/compliance/oscal/catalogs/
3. GET /api/compliance/oscal/catalogs/{id}/
4. POST /api/compliance/oscal/catalogs/{id}/sync
5. GET /api/compliance/oscal/catalogs/{id}/preview
6. DELETE /api/compliance/oscal/catalogs/{id}/

**Deliverables:**
- URL routing
- View functions
- Serializers
- Permission classes

### Phase 6: Automation & Synchronization

**Goal:** Automate catalog updates and control synchronization

**Tasks:**
1. Scheduled job to check for catalog updates
2. Auto-sync mechanism (optional)
3. Notification system (catalog updates available)
4. Version comparison logic
5. Change detection (new controls, modified controls)
6. Automated ControlEvidenceRequirement generation

**Deliverables:**
- Celery tasks (or Django management commands)
- Notification system
- Sync service

---

## 7. Automation Benefits

### For Frameworks App

**Before OSCAL:**
- Manual framework creation
- Manual control entry
- Manual framework-control mapping

**After OSCAL:**
- Import SP 800-53 R5 → Auto-creates framework with 1000+ controls
- Import ISO 27002 → Auto-creates framework with controls
- Automatic framework-control mapping
- Version tracking and updates

### For Controls App

**Before OSCAL:**
- Manual control definition
- Manual control metadata entry
- No standardized control structure

**After OSCAL:**
- Controls imported with full metadata
- Standardized control IDs (AC-1, SI-2, etc.)
- Control objectives, guidance, parameters included
- Related controls automatically linked
- Assessment methods → Evidence requirements auto-generated

### For Evidence App

**Before OSCAL:**
- Manual evidence-control linking
- No systematic evidence requirements

**After OSCAL:**
- ControlEvidenceRequirement auto-generated from assessment methods
- Know exactly what evidence satisfies each control
- Know freshness requirements
- Know which source apps provide valid evidence

### For Policies App

**Before OSCAL:**
- Manual policy creation
- No framework alignment

**After OSCAL:**
- Policies can reference OSCAL control IDs
- Policies aligned with framework controls
- Standardized policy structure

### For Audits App

**Before OSCAL:**
- Manual audit setup
- Manual control selection

**After OSCAL:**
- Select framework → All controls automatically available
- Standardized audit scope
- Framework-specific audit templates

### For Reports App

**Before OSCAL:**
- Manual report templates
- Inconsistent control references

**After OSCAL:**
- Standardized report formats per framework
- Consistent control IDs across reports
- Framework-specific report templates

---

## 8. Data Sources & Formats

### Primary Data Sources

**1. NIST SP 800-53 Revision 5**
- **Source:** [OSCAL Content GitHub](https://github.com/usnistgov/oscal-content)
- **Path:** `nist.gov/SP800-53/rev5/json/`
- **Format:** JSON (also available XML, YAML)
- **Controls:** ~1000+ controls
- **Update:** Maintained by NIST

**2. NIST SP 800-53 Revision 4**
- **Source:** [OSCAL Content GitHub](https://github.com/usnistgov/oscal-content)
- **Path:** `nist.gov/SP800-53/rev4/json/`
- **Format:** JSON
- **Controls:** ~800+ controls
- **Status:** Legacy, but still used

**3. ISO/IEC 27002**
- **Source:** May require conversion or community OSCAL
- **Format:** May need to create OSCAL representation
- **Controls:** ~100+ controls

**4. Custom Catalogs**
- **Source:** User-uploaded
- **Format:** OSCAL JSON/XML/YAML
- **Use Case:** Organization-specific controls

### File Format Handling

**Supported Formats:**
- JSON (preferred, easiest to parse)
- XML (convert to JSON)
- YAML (convert to JSON)

**Conversion:**
- Use OSCAL-provided converters or Python libraries
- Convert to JSON for internal processing
- Store original format for reference

**Storage:**
- Store original OSCAL file in media storage
- Store parsed data in database
- Keep file for re-import/validation

---

## 9. Integration with Existing Models

### Framework Integration

**Current:** `ComplianceFramework` model exists
**Enhancement:** Add OSCAL catalog reference
- Link framework to source OSCAL catalog
- Track catalog version
- Enable sync/update functionality

### Control Integration

**Current:** `ComplianceControl` model exists
**Enhancement:** Add OSCAL control reference
- Store original OSCAL control ID
- Link to source catalog
- Import control metadata (objectives, guidance, parameters)
- Auto-generate ControlEvidenceRequirement from assessment methods

### Evidence Requirements Integration

**Current:** `ControlEvidenceRequirement` model (needs to be created)
**Enhancement:** Auto-generate from OSCAL
- Parse assessment methods from OSCAL controls
- Create evidence requirements automatically
- Map assessment methods to evidence types
- Extract freshness requirements

---

## 10. Tools Management Tab Structure

### Tab Location

**Path:** `/workspace/tools-management/oscal`

**Navigation:**
- Tools Management → OSCAL Catalogs tab
- Or direct link from Compliance section

### Tab Layout

**Header:**
- Title: "OSCAL Catalog Management"
- Description: "Import and manage standardized compliance control catalogs"
- Actions: "Import Catalog" button

**Main Content Areas:**

**1. Catalog Library (Default View)**
- Table/Grid of available catalogs
- Columns: Name, Version, Controls, Status, Last Updated, Actions
- Filters: Source (NIST/Custom), Status, Framework
- Search: By catalog name or control ID

**2. Import Wizard**
- Step 1: Select source (Upload file / URL / GitHub)
- Step 2: Preview catalog metadata
- Step 3: Configure import options
- Step 4: Preview controls to import
- Step 5: Review and confirm
- Step 6: Import progress

**3. Catalog Detail View**
- Catalog metadata
- Control list (with search/filter)
- Import history
- Sync status
- Actions: Sync, Export, Delete

**4. Control Import Preview**
- List of controls in catalog
- Show which are new vs existing
- Show conflicts
- Allow selection of controls to import
- Preview evidence requirements

**5. Synchronization View**
- Compare catalog versions
- Show changes (new, modified, removed controls)
- Preview sync impact
- Confirm sync

---

## 11. Technical Requirements

### Python Libraries

**OSCAL Parsing:**
- `oscal` Python library (if available)
- Or `json`, `xml.etree`, `yaml` for manual parsing
- OSCAL JSON Schema validation

**File Handling:**
- `requests` for URL imports
- `django-storages` for file storage (if using S3)
- File validation utilities

### Django Components

**New App:**
- `backend/compliance_oscal/`
- Models, serializers, views, URLs
- Management commands for imports
- Celery tasks for async imports

**Dependencies:**
- Link to `compliance_frameworks`
- Link to `compliance_controls`
- Link to `compliance_evidence` (for requirements)

### Frontend Components

**New Page:**
- `studio/app/workspace/tools-management/oscal/page.tsx`

**Components:**
- `CatalogLibrary` - List view
- `CatalogImportWizard` - Multi-step import
- `CatalogDetail` - Detail view
- `ControlImportPreview` - Preview before import
- `SyncComparison` - Version comparison

**API Integration:**
- Axios calls to OSCAL endpoints
- File upload handling
- Progress tracking
- Error handling

---

## 12. Success Metrics

### Automation Metrics

- **Framework Creation Time:** Reduce from hours to minutes
- **Control Import Time:** 1000 controls in < 5 minutes
- **Evidence Requirements:** Auto-generate 80%+ of requirements
- **Catalog Sync:** Automated version detection and updates

### Quality Metrics

- **Control Completeness:** 100% of OSCAL controls imported with metadata
- **Mapping Accuracy:** 100% framework-control mapping accuracy
- **Evidence Requirements:** 90%+ accuracy in auto-generated requirements
- **Data Consistency:** Standardized control IDs across all apps

### User Experience Metrics

- **Import Success Rate:** 95%+ successful imports
- **User Adoption:** 80%+ of frameworks imported via OSCAL
- **Time Savings:** 90% reduction in manual data entry

---

## 13. Risk Mitigation

### Data Quality Risks

**Risk:** Imported controls may have errors
**Mitigation:**
- Validation before import
- Preview before confirmation
- Rollback capability
- Manual override options

**Risk:** OSCAL catalog updates may break existing mappings
**Mitigation:**
- Version tracking
- Change detection
- Conflict resolution UI
- Manual review of changes

### Performance Risks

**Risk:** Large catalogs (1000+ controls) may slow import
**Mitigation:**
- Async import (Celery tasks)
- Batch processing
- Progress indicators
- Background jobs

### Compatibility Risks

**Risk:** OSCAL format changes between versions
**Mitigation:**
- Support multiple OSCAL versions
- Version detection
- Format conversion
- Fallback to manual import

---

## 14. Future Enhancements

### Phase 7: Profile Support
- Import OSCAL profiles (baselines)
- Control selection and tailoring
- Custom framework creation from profiles

### Phase 8: Component Definitions
- Import OSCAL component definitions
- Link components to controls
- System security plan integration

### Phase 9: Assessment Results
- Export assessment results in OSCAL format
- Import assessment results
- OSCAL-based reporting

### Phase 10: Multi-Catalog Support
- Import multiple catalogs
- Cross-catalog control mapping
- Unified control view across catalogs

---

## 15. Implementation Priority

### Must Have (MVP)
1. OSCAL parser library
2. Basic catalog import (JSON)
3. Framework creation from catalog
4. Control import from catalog
5. Tools Management tab UI
6. Basic API endpoints

### Should Have (Phase 2)
1. ControlEvidenceRequirement auto-generation
2. Catalog synchronization
3. Version comparison
4. Conflict resolution
5. XML/YAML format support

### Nice to Have (Phase 3)
1. Automated catalog updates
2. Profile support
3. Component definitions
4. Assessment results export

---

## 16. Dependencies

### External Dependencies
- OSCAL Content GitHub repository (public)
- OSCAL specification (NIST standard)
- Python OSCAL libraries (if available)

### Internal Dependencies
- ComplianceFramework model (exists)
- ComplianceControl model (exists)
- ControlEvidenceRequirement model (needs creation)
- Tools Management app structure (exists)
- File storage system (Django media)

### Prerequisites
- Database migrations for new models
- API authentication/permissions
- File upload handling
- Background job system (Celery or Django management commands)

---

## Summary

**Goal:** Systematize compliance apps by integrating OSCAL catalog standard, enabling automatic import of standardized control catalogs (SP 800-53, ISO 27002, etc.) and automated evidence requirement generation.

**Key Benefits:**
- Eliminate manual framework/control entry
- Standardize control definitions
- Auto-generate evidence requirements
- Enable framework updates via catalog sync
- Create foundation for automated compliance evaluation

**Implementation:** New "OSCAL Catalogs" tab in Tools Management app for catalog import, management, and synchronization.

