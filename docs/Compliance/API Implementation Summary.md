# Compliance API Implementation Summary

## Overview

This document summarizes the implementation of API endpoints and serializers to connect Frameworks → Controls → Evidence relationships.

---

## ✅ Completed Backend Implementation

### 1. Database Models

#### ControlEvidenceRequirement Model (NEW)
**Location:** `backend/compliance_controls/models.py`

**Purpose:** Defines what evidence is REQUIRED for each control (drives automation)

**Fields:**
- `control` (ForeignKey to ComplianceControl)
- `evidence_type` (choices: tls_scan, dast, security_scan, etc.)
- `source_app` (e.g., SSLyze, Nuclei)
- `freshness_days` (default: 30)
- `required` (boolean, default: True)
- `description` (optional)
- `organization_id` (for multi-tenancy)

**Migration:** `compliance_controls/migrations/0002_controlevidencerequirement.py`

---

### 2. Serializers

#### ComplianceControlSerializer
**Location:** `backend/compliance_controls/serializers.py`

**Features:**
- Includes nested `framework_mappings` (list of frameworks this control belongs to)
- Includes nested `evidence_requirements` (list of required evidence types)
- Computed `frameworks` field (simplified list)
- Includes user information (`evaluated_by_username`, `created_by_username`)

#### ComplianceControlListSerializer
**Lightweight serializer for list views:**
- Basic control info
- `frameworks` (list of framework names)
- `framework_count` (number of frameworks)

#### ComplianceEvidenceSerializer
**Location:** `backend/compliance_evidence/serializers.py`

**Features:**
- Includes nested `control_mappings` (list of controls this evidence satisfies)
- Computed `controls` field (simplified list with framework context)
- Includes user information (`created_by_username`, `uploaded_by_username`)
- Display fields for source types

#### ComplianceEvidenceListSerializer
**Lightweight serializer for list views:**
- Basic evidence info
- `controls` (list of control names)
- `control_count` (number of controls)

#### ComplianceFrameworkSerializer (UPDATED)
**Location:** `backend/compliance_frameworks/serializers.py`

**New Features:**
- Includes nested `controls` field (list of all controls for this framework)
- Uses `ComplianceControlListSerializer` for nested controls

---

### 3. API Views & Endpoints

#### Compliance Controls API
**Location:** `backend/compliance_controls/views.py`
**URLs:** `backend/compliance_controls/urls.py`

**Endpoints:**
- `GET /api/compliance/controls/` - List all controls
  - Query params: `framework_id`, `status`, `severity`, `search`
- `GET /api/compliance/controls/{id}/` - Get single control (with nested relationships)
- `GET /api/compliance/controls/{id}/evidence/` - Get all evidence for a control
- `GET /api/compliance/controls/by_framework/?framework_id={id}` - Get controls for a framework

**ViewSet:** `ComplianceControlViewSet`

#### Compliance Evidence API
**Location:** `backend/compliance_evidence/views.py`
**URLs:** `backend/compliance_evidence/urls.py`

**Endpoints:**
- `GET /api/compliance/evidence/` - List all evidence
  - Query params: `control_id`, `framework_id`, `source`, `status`, `search`
- `GET /api/compliance/evidence/{id}/` - Get single evidence (with nested relationships)
- `GET /api/compliance/evidence/{id}/controls/` - Get all controls for evidence
- `GET /api/compliance/evidence/by_control/?control_id={id}` - Get evidence for a control
- `GET /api/compliance/evidence/by_framework/?framework_id={id}` - Get evidence for a framework

**ViewSet:** `ComplianceEvidenceViewSet`

#### Compliance Frameworks API (EXISTING)
**Location:** `backend/compliance_frameworks/views.py`

**Updated:** Now includes nested `controls` in responses

**Endpoints:**
- `GET /api/compliance/frameworks/` - List all frameworks (now includes controls)
- `GET /api/compliance/frameworks/{id}/` - Get single framework (now includes controls)

---

### 4. URL Configuration

**Main URLs:** `backend/core/urls.py`

```python
# Compliance Module
path('', include('compliance_frameworks.urls')),  # Compliance Frameworks
path('api/compliance/', include('compliance_controls.urls')),  # Compliance Controls
path('api/compliance/', include('compliance_evidence.urls')),  # Compliance Evidence
path('api/compliance/tools/', include('compliance_tools.urls')),  # Compliance Tools
```

---

### 5. Admin Interface

**Updated Admin Files:**
- `backend/compliance_controls/admin.py` - Registered all models with proper admin interfaces
- `backend/compliance_evidence/admin.py` - Registered all models with proper admin interfaces

---

## ✅ Completed Frontend Updates

### 1. Framework Interface (UPDATED)
**Location:** `studio/lib/data/frameworks.ts`

**New Fields:**
- `controls?: Control[]` - Array of controls belonging to this framework

**New Interface:**
- `Control` interface defined

### 2. Frameworks Page (UPDATED)
**Location:** `studio/app/workspace/compliance/frameworks/page.tsx`

**Changes:**
- Now maps `controls` from API response to Framework objects
- Framework cards can display controls when available

---

## 🔄 Remaining Frontend Work

### 1. Controls Page
**Location:** `studio/app/workspace/compliance/controls/page.tsx`

**Needs:**
- Replace mock data with API calls to `/api/compliance/controls/`
- Display evidence for each control (use `/api/compliance/controls/{id}/evidence/`)
- Filter by framework using `?framework_id={id}` query param

### 2. Evidence Page
**Location:** `studio/app/workspace/compliance/evidence/page.tsx`

**Needs:**
- Replace mock data with API calls to `/api/compliance/evidence/`
- Display controls for each evidence (use `/api/compliance/evidence/{id}/controls/`)
- Filter by control using `?control_id={id}` query param
- Filter by framework using `?framework_id={id}` query param

### 3. Framework Card Component
**Location:** `studio/components/compliance/framework-card.tsx`

**Optional Enhancement:**
- Display a preview of controls if `framework.controls` exists
- Show control count and status breakdown

---

## 📊 API Response Examples

### Framework with Controls
```json
{
  "id": "uuid-123",
  "name": "SOC 2 Type I",
  "code": "SOC2-T1",
  "controls": [
    {
      "id": "uuid-control-1",
      "control_id": "SOC2-CC6.1",
      "name": "Logical Access Controls",
      "status": "pass",
      "severity": "high",
      "framework_count": 2
    }
  ]
}
```

### Control with Evidence
```json
{
  "id": "uuid-control-1",
  "control_id": "SOC2-CC6.1",
  "name": "Logical Access Controls",
  "framework_mappings": [
    {
      "framework_id": "uuid-framework-1",
      "framework_name": "SOC 2 Type I"
    }
  ],
  "evidence_requirements": [
    {
      "evidence_type": "tls_scan",
      "source_app": "SSLyze",
      "freshness_days": 30,
      "required": true
    }
  ]
}
```

### Evidence with Controls
```json
{
  "id": "uuid-evidence-1",
  "evidence_id": "EV-001",
  "name": "TLS Scan Results",
  "control_mappings": [
    {
      "control_id": "uuid-control-1",
      "control_name": "Logical Access Controls",
      "framework_id": "uuid-framework-1",
      "framework_name": "SOC 2 Type I"
    }
  ]
}
```

---

## 🔐 Permissions

All endpoints require:
- `IsAuthenticated` - User must be logged in
- `HasFeaturePermission` - User must have appropriate feature permission:
  - `compliance.frameworks.view` - For frameworks
  - `compliance.controls.view` - For controls
  - `compliance.evidence.view` - For evidence

---

## 🚀 Next Steps

1. **Apply Migration:**
   ```bash
   cd backend
   python manage.py migrate compliance_controls
   ```

2. **Update Frontend Controls Page:**
   - Replace mock data with API calls
   - Display evidence relationships

3. **Update Frontend Evidence Page:**
   - Replace mock data with API calls
   - Display control relationships

4. **Create Seed Data:**
   - Create management command to seed ControlEvidenceRequirement data
   - Create sample framework-control-evidence mappings

5. **Testing:**
   - Test API endpoints with Postman/curl
   - Test frontend integration
   - Test nested relationship queries

---

## 📝 Notes

- All relationships are **many-to-many** via junction tables
- Framework → Control mapping: `compliance_control_framework_mappings`
- Control → Evidence mapping: `compliance_evidence_control_mappings`
- Evidence mapping also stores `framework_id` for context
- All endpoints support filtering and search
- Serializers include both detailed and lightweight versions for performance

