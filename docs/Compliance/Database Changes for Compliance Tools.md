# Database Changes for Compliance Tools

## Overview

The compliance tools added to the Tools Management UI need to be stored in the database to enable:
- Status tracking (configured/not_configured/error)
- API key management
- Configuration persistence
- Tool activation/deactivation
- Integration with compliance workflows

## Required Changes

### 1. Create New Compliance Tools App

**Create:** `backend/compliance_tools/` app

**Structure:**
```
backend/compliance_tools/
├── __init__.py
├── apps.py
├── admin.py
├── models.py
├── serializers.py
├── views.py
├── urls.py
├── management/
│   └── commands/
│       └── setup_compliance_tools.py
└── migrations/
    └── 0001_initial.py
```

### 2. Create ComplianceTool Model

**File:** `backend/compliance_tools/models.py`

**Model Definition:**
```python
from django.db import models
from django.contrib.auth.models import User

class ComplianceTool(models.Model):
    """
    Compliance tools configuration and management
    """
    TOOL_TYPES = [
        ('api', 'API Service'),
        ('library', 'Library'),
        ('external', 'External Tool'),
    ]
    
    STATUS_CHOICES = [
        ('configured', 'Configured'),
        ('not_configured', 'Not Configured'),
        ('error', 'Error'),
    ]
    
    SUB_CATEGORY_CHOICES = [
        ('frameworks', 'Frameworks'),
        ('automated-evidence', 'Automated Evidence'),
        ('manual-evidence', 'Manual Evidence'),
        ('policy-enforcement', 'Policy Enforcement'),
        ('audit-management', 'Audit Management'),
        ('reporting', 'Reporting'),
        ('continuous-compliance', 'Continuous Compliance'),
        ('ai-privacy', 'AI & Privacy'),
    ]
    
    # Basic Information
    name = models.CharField(max_length=100, unique=True)
    tool_type = models.CharField(max_length=20, choices=TOOL_TYPES)
    sub_category = models.CharField(max_length=50, choices=SUB_CATEGORY_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_configured')
    description = models.TextField(help_text='Tool description and purpose')
    
    # Service Details
    service = models.CharField(max_length=200, help_text='Service/Implementation name')
    endpoint = models.URLField(blank=True, help_text='API endpoint URL (if API service)')
    
    # Configuration
    api_key = models.CharField(max_length=500, blank=True, help_text='API key (if API service)')
    api_key_name = models.CharField(max_length=100, blank=True, help_text='Environment variable name for API key')
    configuration = models.JSONField(default=dict, help_text='Additional configuration')
    
    # Metadata
    license = models.CharField(max_length=50, blank=True, help_text='License type (Apache 2.0, MIT, etc.)')
    evidence_produced = models.CharField(max_length=200, blank=True, help_text='Type of evidence this tool produces')
    repo_url = models.URLField(blank=True, help_text='Repository URL for the tool')
    documentation_url = models.URLField(blank=True, help_text='Link to tool documentation')
    
    # Installation/Setup
    installation_instructions = models.TextField(blank=True, help_text='How to install/configure this tool')
    executable_path = models.CharField(max_length=500, blank=True, help_text='Path to executable (if external)')
    command_template = models.CharField(max_length=500, blank=True, help_text='Command template for execution')
    
    # Status Tracking
    is_active = models.BooleanField(default=False, help_text='Is this tool active and ready to use?')
    last_tested = models.DateTimeField(null=True, blank=True)
    test_result = models.TextField(blank=True, help_text='Result of last test')
    
    # Organization & User
    organization_id = models.UUIDField(null=True, blank=True, help_text='Organization ID for multi-tenancy')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='compliance_tools')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['sub_category', 'name']
        verbose_name = 'Compliance Tool'
        verbose_name_plural = 'Compliance Tools'
        indexes = [
            models.Index(fields=['sub_category', 'status']),
            models.Index(fields=['tool_type', 'is_active']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.get_sub_category_display()})"
```

### 3. Add App to Settings

**File:** `backend/core/settings.py`

**Add to INSTALLED_APPS:**
```python
INSTALLED_APPS = [
    # ... existing apps ...
    # Compliance Module
    'compliance_frameworks',
    'compliance_controls',
    'compliance_evidence',
    'compliance_policies',
    'compliance_audits',
    'compliance_reports',
    'compliance_tools',  # NEW
]
```

### 4. Create Migration

**Command:**
```bash
python manage.py makemigrations compliance_tools
```

This will create a migration file for the new ComplianceTool model.

### 5. Create Management Command to Seed Compliance Tools

**File:** `backend/compliance_tools/management/commands/setup_compliance_tools.py`

**Purpose:** Seed all 33 compliance tools into the database

**Structure:**
- Frameworks (5 tools)
- Automated Evidence (8 tools)
- Manual Evidence (3 tools)
- Policy Enforcement (3 tools)
- Audit Management (2 tools)
- Reporting (4 tools)
- Continuous Compliance (4 tools)
- AI & Privacy (4 tools)

### 6. Create API Endpoints

**File:** `backend/compliance_tools/views.py`

**Endpoints needed:**
- `GET /api/compliance/tools/` - List all compliance tools
- `GET /api/compliance/tools/?sub_category=frameworks` - Filter by sub-category
- `GET /api/compliance/tools/{id}/` - Get tool details
- `PATCH /api/compliance/tools/{id}/` - Update tool status, API keys, etc.
- `POST /api/compliance/tools/{id}/test/` - Test tool connection

**File:** `backend/compliance_tools/urls.py`
```python
from django.urls import path
from . import views

urlpatterns = [
    path('tools/', views.ComplianceToolListCreateView.as_view(), name='compliance-tool-list'),
    path('tools/<uuid:pk>/', views.ComplianceToolRetrieveUpdateDestroyView.as_view(), name='compliance-tool-detail'),
    path('tools/<uuid:pk>/test/', views.ComplianceToolTestView.as_view(), name='compliance-tool-test'),
]
```

**File:** `backend/core/urls.py`
```python
path('api/compliance/tools/', include('compliance_tools.urls')),
```

### 7. Update Frontend

**File:** `studio/app/workspace/tools-management/page.tsx`

**Changes:**
- Replace hardcoded arrays with API calls
- Fetch compliance tools from `/api/compliance/tools/`
- Group tools by sub_category for tabs
- Update tool status via API
- Handle API key management through new endpoints

## Implementation Steps

1. **Create the app:**
   ```bash
   cd backend
   python manage.py startapp compliance_tools
   ```

2. **Create the model:**
   - Add `ComplianceTool` model to `backend/compliance_tools/models.py`
   - Follow the model definition above

3. **Add app to settings:**
   - Add `'compliance_tools'` to `INSTALLED_APPS` in `backend/core/settings.py`

4. **Create migration:**
   ```bash
   python manage.py makemigrations compliance_tools
   ```

5. **Review migration file:**
   - Check that all fields are included
   - Verify field types and constraints

6. **Apply migration:**
   ```bash
   python manage.py migrate compliance_tools
   ```

7. **Create seed command:**
   - Create `setup_compliance_tools.py` management command
   - Populate all 33 compliance tools

8. **Run seed command:**
   ```bash
   python manage.py setup_compliance_tools
   ```

9. **Create API endpoints:**
   - Create serializers in `backend/compliance_tools/serializers.py`
   - Create views in `backend/compliance_tools/views.py`
   - Create URLs in `backend/compliance_tools/urls.py`
   - Add to main URLs in `backend/core/urls.py`

10. **Update frontend:**
    - Replace hardcoded arrays with API calls
    - Test tool status updates
    - Test API key management

## Database Schema Summary

### New App: compliance_tools

### New Model: ComplianceTool

**Fields:**
- `name` (CharField, max_length=100, unique=True)
- `tool_type` (CharField) - Choices: 'api', 'library', 'external'
- `sub_category` (CharField) - Choices: 'frameworks', 'automated-evidence', etc.
- `status` (CharField) - Choices: 'configured', 'not_configured', 'error'
- `description` (TextField)
- `service` (CharField, max_length=200)
- `endpoint` (URLField, blank=True)
- `api_key` (CharField, max_length=500, blank=True)
- `api_key_name` (CharField, max_length=100, blank=True)
- `configuration` (JSONField)
- `license` (CharField, max_length=50, blank=True)
- `evidence_produced` (CharField, max_length=200, blank=True)
- `repo_url` (URLField, blank=True)
- `documentation_url` (URLField, blank=True)
- `installation_instructions` (TextField, blank=True)
- `executable_path` (CharField, max_length=500, blank=True)
- `command_template` (CharField, max_length=500, blank=True)
- `is_active` (BooleanField, default=False)
- `last_tested` (DateTimeField, null=True, blank=True)
- `test_result` (TextField, blank=True)
- `organization_id` (UUIDField, null=True, blank=True)
- `created_by` (ForeignKey to User)
- `created_at` (DateTimeField, auto_now_add=True)
- `updated_at` (DateTimeField, auto_now=True)

## Example Tool Entry

```python
from compliance_tools.models import ComplianceTool

ComplianceTool.objects.create(
    name="OSCAL (NIST)",
    tool_type="api",
    sub_category="frameworks",
    status="not_configured",
    description="Canonical control schema for SP 800-53 and other frameworks",
    service="NIST OSCAL Content Repository",
    endpoint="https://github.com/usnistgov/oscal-content",
    documentation_url="https://github.com/usnistgov/OSCAL",
    repo_url="https://github.com/usnistgov/OSCAL",
    license="CC0",
    is_active=False,
)
```

## Benefits

1. **Persistence:** Tool configurations persist across sessions
2. **Status Tracking:** Track which tools are configured/active
3. **API Key Management:** Store and manage API keys securely
4. **Integration:** Tools can be referenced in compliance workflows
5. **Audit Trail:** Track tool usage and changes
6. **Multi-tenancy:** Each organization can have different tool configurations

## Testing Checklist

- [ ] App created successfully
- [ ] Model defined correctly
- [ ] App added to INSTALLED_APPS
- [ ] Migration runs successfully
- [ ] All 33 compliance tools are seeded
- [ ] API endpoints created and working
- [ ] API endpoints return compliance tools
- [ ] Frontend displays tools from API
- [ ] Tool status can be updated
- [ ] API keys can be saved/retrieved
- [ ] Tools can be filtered by sub_category
- [ ] Tools appear in correct tabs
- [ ] Multi-tenancy support works (organization_id)

