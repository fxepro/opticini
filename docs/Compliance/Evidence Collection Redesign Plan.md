# Evidence Collection Redesign Plan

## Problem Statement

**Current Issues:**
1. **Naming Confusion**: "Evidence Type" (e.g., "System Log") doesn't indicate if it's automated or manual
2. **Non-Actionable**: Page shows requirements but doesn't help users collect evidence
3. **Missing Workflow**: No way to trigger scans, track collection, or fill gaps
4. **Data Model Mismatch**: Requirements don't clearly map to collection methods

---

## Proposed Solution

### 1. Better Naming Convention

#### Current (Confusing):
- `evidence_type`: "tls_scan", "system_log", "manual_document"
- `source_app`: "SSLyze", "Manual"
- No clear indication of automation vs manual

#### Proposed (Clear):
- **Collection Method** (replaces `evidence_type`):
  - `automated_scan` - Automated security/infrastructure scans
  - `automated_log` - Automated system/application logs
  - `automated_config` - Automated configuration snapshots
  - `manual_upload` - Manual file/document uploads
  - `manual_attestation` - Manual attestations/approvals
  - `manual_screenshot` - Manual screenshots

- **Tool/Source** (replaces `source_app`):
  - For automated: Tool name (e.g., "SSLyze", "OWASP ZAP", "Prowler")
  - For manual: "Manual Upload", "User Attestation", etc.

- **Evidence Category** (new field):
  - `security_scan` - Security vulnerability scans
  - `tls_config` - TLS/SSL configuration
  - `cloud_config` - Cloud infrastructure configuration
  - `access_log` - Access and authentication logs
  - `system_log` - System operation logs
  - `attestation` - Attestations and approvals
  - `screenshot` - Screenshots
  - `document` - Document uploads (evidence documents, not policy documents themselves)
  
  **Note:** Policy documents are requirements/controls, NOT evidence. Evidence proves compliance with policies.

**Example Mapping:**
```
Old: evidence_type="system_log", source_app="Manual"
New: collection_method="automated_log", tool="System Logger", category="system_log"

Old: evidence_type="tls_scan", source_app="SSLyze"
New: collection_method="automated_scan", tool="SSLyze", category="tls_config"

Old: evidence_type="manual_document", source_app="Manual"
New: collection_method="manual_upload", tool="Manual Upload", category="document"
```

---

### 2. Enhanced Data Model

#### Update `ControlEvidenceRequirement` Model:

```python
class ControlEvidenceRequirement(models.Model):
    """
    Defines what evidence is required for a specific control.
    """
    COLLECTION_METHOD_CHOICES = [
        ('automated_scan', 'Automated Scan'),
        ('automated_log', 'Automated Log'),
        ('automated_config', 'Automated Config'),
        ('manual_upload', 'Manual Upload'),
        ('manual_attestation', 'Manual Attestation'),
        ('manual_screenshot', 'Manual Screenshot'),
    ]
    
    EVIDENCE_CATEGORY_CHOICES = [
        ('security_scan', 'Security Scan'),
        ('tls_config', 'TLS Configuration'),
        ('cloud_config', 'Cloud Configuration'),
        ('access_log', 'Access Log'),
        ('system_log', 'System Log'),
        ('policy_document', 'Policy Document'),
        ('attestation', 'Attestation'),
        ('screenshot', 'Screenshot'),
    ]
    
    # Existing fields
    control = models.ForeignKey(...)
    
    # NEW: Clear collection method
    collection_method = models.CharField(
        max_length=30,
        choices=COLLECTION_METHOD_CHOICES,
        help_text='How evidence is collected (automated vs manual)'
    )
    
    # NEW: Evidence category (what type of evidence)
    evidence_category = models.CharField(
        max_length=30,
        choices=EVIDENCE_CATEGORY_CHOICES,
        help_text='Category of evidence (security_scan, tls_config, etc.)'
    )
    
    # UPDATED: Tool name (for automated) or "Manual" (for manual)
    tool_name = models.CharField(
        max_length=100,
        help_text='Tool name for automated collection, or "Manual" for manual collection'
    )
    
    # NEW: Tool ID (links to ComplianceTool if automated)
    tool_id = models.UUIDField(
        null=True,
        blank=True,
        help_text='Link to ComplianceTool if automated collection'
    )
    
    # Existing fields
    freshness_days = models.IntegerField(default=30)
    required = models.BooleanField(default=True)
    description = models.TextField(blank=True)
```

---

### 3. Actionable Evidence Page Redesign

#### Page Structure:

**Tab 1: Evidence Requirements (Current → Enhanced)**
- Shows what evidence is needed
- **NEW**: Action buttons for each requirement:
  - "Run Scan" (if automated) → Triggers tool
  - "Upload Evidence" (if manual) → Opens upload dialog
  - "View Collected" → Shows existing evidence
- **NEW**: Status indicators:
  - ✅ Collected & Fresh
  - ⚠️ Collected & Expiring Soon
  - ❌ Collected & Expired
  - ⭕ Missing
- **NEW**: Bulk actions:
  - "Run All Automated Scans"
  - "Export Requirements List"

**Tab 2: Collected Evidence (Current → Enhanced)**
- Shows all collected evidence
- **NEW**: Link to requirements
- **NEW**: Evidence freshness dashboard
- **NEW**: Gap analysis (what's missing)

**Tab 3: Collection Jobs (NEW)**
- Shows scheduled/active scan jobs
- Status: Pending, Running, Completed, Failed
- Ability to retry failed scans
- View scan results

---

### 4. Evidence Collection Workflow

#### Automated Evidence Collection:

```
1. User views Requirements tab
2. Sees requirement: "CC6.6 needs TLS Scan (SSLyze)"
3. Clicks "Run Scan" button
4. System:
   - Creates EvidenceCollectionJob
   - Triggers SSLyze scan
   - Waits for results
   - Creates ComplianceEvidence record
   - Links to ControlEvidenceRequirement
   - Updates status to "Collected"
5. User sees updated status in Requirements tab
```

#### Manual Evidence Collection:

```
1. User views Requirements tab
2. Sees requirement: "CC1.1 needs Policy Document (Manual)"
3. Clicks "Upload Evidence" button
4. System:
   - Opens file upload dialog
   - User selects file
   - System creates ComplianceEvidence record
   - Links to ControlEvidenceRequirement
   - Updates status to "Collected"
5. User sees updated status in Requirements tab
```

---

### 5. New Models Needed

#### `EvidenceCollectionJob` Model:

```python
class EvidenceCollectionJob(models.Model):
    """
    Tracks automated evidence collection jobs
    """
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('running', 'Running'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    requirement = models.ForeignKey(
        ControlEvidenceRequirement,
        on_delete=models.CASCADE,
        related_name='collection_jobs'
    )
    tool = models.ForeignKey(
        ComplianceTool,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    evidence = models.ForeignKey(
        ComplianceEvidence,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='collection_job'
    )
    error_message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
```

---

### 6. Updated Table Columns

#### Requirements Table (Enhanced):

| Column | Data Source | Display Logic |
|--------|-------------|----------------|
| **Framework** | `ComplianceControlFrameworkMapping.framework_name` | Framework name(s) |
| **Control ID** | `ComplianceControl.control_id` | Control ID (e.g., CC6.6) |
| **Control Name** | `ComplianceControl.name` | Control name |
| **Collection Method** | `ControlEvidenceRequirement.collection_method` | Badge: "Automated" (green) or "Manual" (blue) |
| **Evidence Category** | `ControlEvidenceRequirement.evidence_category` | Badge: "TLS Config", "Security Scan", etc. |
| **Tool** | `ControlEvidenceRequirement.tool_name` | Tool name or "Manual Upload" |
| **Freshness** | `ControlEvidenceRequirement.freshness_days` | "30 days" |
| **Required** | `ControlEvidenceRequirement.required` | Badge: "Required" or "Optional" |
| **Status** | Computed from collected evidence | Badge: Collected/Fresh/Expired/Missing |
| **Last Collected** | `ComplianceEvidence.created_at` | Date/time of last collection |
| **Actions** | - | "Run Scan" / "Upload" / "View" buttons |

---

### 7. Implementation Steps

#### Phase 1: Data Model Updates
1. ✅ Create migration to update `ControlEvidenceRequirement`:
   - Add `collection_method` field
   - Add `evidence_category` field
   - Rename `source_app` → `tool_name`
   - Add `tool_id` field (nullable FK to ComplianceTool)
2. ✅ Update existing data:
   - Map old `evidence_type` values to new `collection_method` + `evidence_category`
   - Map old `source_app` values to new `tool_name`
   - Link to ComplianceTool records where applicable

#### Phase 2: Backend API Updates
1. ✅ Update `ControlEvidenceRequirement` serializer
2. ✅ Create `EvidenceCollectionJob` model and API
3. ✅ Create scan trigger endpoints:
   - `POST /api/compliance/evidence/collect/{requirement_id}/` - Trigger collection
   - `GET /api/compliance/evidence/jobs/` - List collection jobs
4. ✅ Update evidence status computation logic

#### Phase 3: Frontend Updates
1. ✅ Update Requirements table columns
2. ✅ Add action buttons (Run Scan / Upload)
3. ✅ Add Collection Jobs tab
4. ✅ Add bulk actions
5. ✅ Improve status indicators

#### Phase 4: Integration
1. ✅ Connect to actual scanner tools
2. ✅ Implement scan orchestration
3. ✅ Implement file upload for manual evidence
4. ✅ Add scheduling for automated scans

---

### 8. Example: Updated Requirements Data

#### Before (Confusing):
```yaml
- control_id: "CC6.6"
  evidence_type: "tls_scan"
  source_app: "SSLyze"
  freshness_days: 30
  required: true
```

#### After (Clear):
```yaml
- control_id: "CC6.6"
  collection_method: "automated_scan"
  evidence_category: "tls_config"
  tool_name: "SSLyze"
  tool_id: "<sslyze-tool-uuid>"
  freshness_days: 30
  required: true
```

---

### 9. Benefits

1. **Clear Intent**: Users immediately understand if evidence is automated or manual
2. **Actionable**: Users can trigger scans and upload evidence directly from requirements
3. **Traceable**: Collection jobs track what's been run and when
4. **Automated**: System can schedule and run scans automatically
5. **Gap Analysis**: Clear visibility into what's missing vs what's collected

---

## Migration Strategy

### Step 1: Add New Fields (Non-Breaking)
- Add `collection_method`, `evidence_category`, `tool_id` as nullable
- Keep `evidence_type` and `source_app` for backward compatibility

### Step 2: Data Migration
- Write script to populate new fields from old fields
- Map evidence types to collection methods + categories

### Step 3: Update Code
- Update serializers to use new fields
- Update frontend to display new fields

### Step 4: Remove Old Fields (Breaking)
- Remove `evidence_type` and `source_app` after migration complete

---

**Status**: Ready for Implementation  
**Priority**: High  
**Estimated Effort**: 2-3 days

