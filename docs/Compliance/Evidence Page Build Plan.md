# Evidence Page Build Plan

## Overview
Build a comprehensive Compliance Evidence page that displays all collected evidence (automated and manual), tracks freshness and validity, and allows evidence uploads for audit-proof proof storage.

---

## 1. Purpose & Users

**Purpose:** Audit-proof proof storage - automatically collect, organize, and maintain audit-ready evidence.

**Primary Users:**
- Compliance team
- Auditors (read-only)
- Security / DevOps teams (for uploading manual evidence)

---

## 2. Page Structure & Layout

### Header Section
- Page title: "Compliance Evidence"
- Subtitle: "Automatically collect and organize audit-ready evidence"
- Action buttons:
  - "Upload Evidence" (opens upload modal)
  - "Bulk Export" (export selected evidence)
  - "Generate Evidence Pack" (create ZIP for auditor)

### Summary Statistics (Top Bar)
- Total evidence: X
- Automated: Y
- Manual: Z
- Fresh: W (not expired)
- Expired: V
- Linked to controls: XX

### Filter & Search Bar
- Search by:
  - Evidence ID
  - Evidence name/description
  - Control ID
  - Framework name
  - Source name
- Filter by:
  - Source type (Automated / Manual / All)
  - Status (Fresh / Expired / All)
  - Framework (multi-select)
  - Control (multi-select)
  - Date range (created date)
  - Evidence type (Scan / Screenshot / Log / Document / All)

### View Options
- **Table View** (default) - Compact list view
- **Card View** - Detailed card layout
- **Timeline View** - Chronological timeline

### Evidence Table/List
- Sortable columns
- Bulk selection (checkboxes)
- Quick preview on hover/click
- Download/view actions per row

---

## 3. Evidence Data Structure

### Evidence Object
```typescript
interface Evidence {
  id: string;
  evidenceId: string; // e.g., "EV-001", "ev-004"
  name: string;
  description?: string;
  
  // Source
  source: 'automated' | 'manual';
  sourceType: 'ai_monitor' | 'dast' | 'security_scan' | 'tls_scan' | 'config_scan' | 'manual_upload' | 'system_log';
  sourceName: string; // e.g., "AI Monitor", "Attack Surface Scan", "Manual Upload"
  
  // Control mapping
  controlIds: string[]; // Control IDs this evidence supports
  controlNames: string[]; // Display names
  frameworkIds: string[]; // Framework IDs
  frameworkNames: string[]; // Display names
  
  // Status
  status: 'fresh' | 'expired' | 'expiring_soon';
  validityPeriod?: number; // Days until expiration
  expiresAt?: string; // ISO date
  
  // Metadata
  createdAt: string; // ISO date
  createdBy?: string; // User ID or 'system'
  uploadedBy?: string; // User ID for manual uploads
  fileType?: string; // 'pdf', 'png', 'jpg', 'json', 'txt', etc.
  fileSize?: number; // Bytes
  
  // File/Content
  fileUrl?: string; // URL to file (for manual uploads)
  previewUrl?: string; // Thumbnail/preview URL
  content?: string; // For text-based evidence (logs, JSON)
  
  // Tags/Categories
  tags?: string[];
  category?: string;
  
  // Audit info
  auditLocked?: boolean; // Locked for specific audit
  auditId?: string; // Associated audit session
}
```

---

## 4. Table View Design

### Columns
1. **Checkbox** (for bulk actions)
2. **Evidence ID** (e.g., EV-001)
   - Clickable to open preview/detail
   - Source badge next to ID
3. **Name/Description** (truncated with tooltip)
4. **Source** (badge)
   - Automated (green) / Manual (blue)
   - Source type icon
5. **Controls** (badges showing linked controls)
6. **Frameworks** (badges)
7. **Status** (Fresh / Expired / Expiring Soon)
   - Fresh (green)
   - Expiring Soon (yellow) - within 30 days
   - Expired (red)
8. **Created** (relative time + date)
9. **Actions** (dropdown menu)
   - View/Preview
   - Download
   - Link to Control
   - Delete (if permitted)

### Row Expansion
When expanded, shows:
- Full description
- File details (size, type)
- Linked controls list
- Expiration date
- Upload metadata
- Tags

---

## 5. Card View Design

Each card displays:

### Header
- Evidence ID (large, prominent)
- Source badge (Automated/Manual)
- Status badge (top right)
- File type icon

### Body
- Evidence name
- Description (truncated, expandable)
- Source information:
  - Source type and name
  - Created timestamp
  - Created by (user/system)

### Linked Controls Section
- Control badges (clickable)
- Framework badges
- "View Controls" link

### Status Section
- Freshness indicator
- Expiration date (if applicable)
- Days until expiration

### File Preview
- Thumbnail (for images/PDFs)
- File size
- File type
- Download button

### Actions
- "View" button
- "Download" button
- "Link to Control" button (if permitted)

---

## 6. Evidence Detail Modal/Drawer

### When opened:
- **Header**
  - Evidence ID and name
  - Source badge
  - Status badge
  - Close button

- **Tabs:**
  1. **Overview**
     - Full description
     - Source details (type, name, timestamp)
     - Created by / Uploaded by
     - File information (type, size, URL)
     - Tags and categories
     
  2. **Controls**
     - List of linked controls
     - Framework mapping
     - "Link to Control" button
     - "Unlink" action (if permitted)
     
  3. **Preview**
     - File preview (image viewer, PDF viewer, text viewer)
     - Download button
     - Full-screen view option
     
  4. **Metadata**
     - All metadata fields
     - Audit lock status
     - Associated audit session
     - Version history (if applicable)

- **Actions (footer)**
  - Download evidence
  - Link to control
  - Delete evidence (if permitted)
  - Export metadata

---

## 7. Upload Evidence Modal

### Modal Sections:
1. **Upload Method**
   - Drag & drop area
   - File browser button
   - Supported formats: PDF, PNG, JPG, JSON, TXT, DOCX

2. **Evidence Details**
   - Name (required)
   - Description (optional)
   - Tags (multi-select or free text)
   - Category (dropdown)

3. **Link to Controls**
   - Multi-select control picker
   - Search controls
   - Framework filter

4. **Validity Settings**
   - Expiration date (optional)
   - Validity period (days)
   - Auto-expire toggle

5. **Review & Upload**
   - Preview of selected file
   - Summary of details
   - Upload button

---

## 8. Sample Evidence Data

### Evidence Types (50+ items)

**Automated Evidence:**
- TLS Scan Results (from security scans)
- Attack Surface Scan Results
- Configuration Scan Results
- AI Data Flow Logs
- System Access Logs
- Firewall Rule Exports
- IAM Policy Exports
- Database Access Logs
- API Security Scan Results
- Vulnerability Scan Results
- Compliance Check Results
- Backup Verification Logs
- Encryption Status Reports
- Network Topology Maps
- System Health Reports

**Manual Evidence:**
- Policy Documents (PDF)
- IAM Policy Screenshots
- Employee Attestations
- Vendor Attestations
- Exception Approvals
- External Audit Artifacts
- Training Certificates
- Incident Response Reports
- Change Management Approvals
- Risk Assessment Documents

### Sample Evidence Objects
```typescript
{
  id: "ev-001",
  evidenceId: "EV-001",
  name: "TLS Scan Result - Production",
  description: "Automated TLS/SSL configuration scan for production environment",
  source: "automated",
  sourceType: "tls_scan",
  sourceName: "Security Scanner",
  controlIds: ["soc2-cc6.1", "iso27001-a.12.4.1"],
  controlNames: ["SOC2-CC6.1", "ISO27001-A.12.4.1"],
  frameworkIds: ["soc2-type2", "iso27001"],
  frameworkNames: ["SOC 2 Type II", "ISO 27001"],
  status: "fresh",
  validityPeriod: 90,
  expiresAt: "2024-04-15T10:30:00Z",
  createdAt: "2024-01-15T10:30:00Z",
  createdBy: "system",
  fileType: "json",
  fileSize: 45678,
  content: "{...scan results...}",
  tags: ["tls", "security", "automated"],
  category: "Security Scan"
}
```

---

## 9. Components to Build

### Main Components
1. **EvidencePage** (`studio/app/workspace/compliance/evidence/page.tsx`)
   - Main page container
   - State management
   - API calls

2. **EvidenceTable** (`studio/components/compliance/evidence-table.tsx`)
   - Table view with sortable columns
   - Expandable rows
   - Bulk selection
   - Row actions

3. **EvidenceCard** (`studio/components/compliance/evidence-card.tsx`)
   - Card view layout
   - File preview
   - Status indicators
   - Quick actions

4. **EvidenceDetailDrawer** (`studio/components/compliance/evidence-detail-drawer.tsx`)
   - Side drawer/sheet component
   - Tabbed interface
   - File preview
   - Control linking

5. **UploadEvidenceModal** (`studio/components/compliance/upload-evidence-modal.tsx`)
   - File upload interface
   - Drag & drop
   - Form for evidence details
   - Control linking interface

6. **EvidenceFilters** (`studio/components/compliance/evidence-filters.tsx`)
   - Search input
   - Multi-select filters
   - Date range picker
   - Source type filter

7. **EvidenceSummary** (`studio/components/compliance/evidence-summary.tsx`)
   - Statistics bar
   - Quick insights

8. **EvidenceStatusBadge** (`studio/components/compliance/evidence-status-badge.tsx`)
   - Fresh/Expired/Expiring Soon badges
   - Color-coded

9. **EvidenceSourceBadge** (`studio/components/compliance/evidence-source-badge.tsx`)
   - Automated/Manual badges
   - Source type icons

10. **FilePreview** (`studio/components/compliance/file-preview.tsx`)
    - Image preview
    - PDF viewer
    - Text viewer
    - JSON formatter

### UI Components (reuse existing)
- Table, Card, Badge, Button, Dialog, Sheet (from shadcn/ui)
- Select, Input, Checkbox, DatePicker (for filters)
- Tabs (for detail drawer)
- Tooltip (for truncated text)

---

## 10. Features to Implement

### Phase 1: Core Display
- [ ] Evidence table with all columns
- [ ] Source badges (Automated/Manual)
- [ ] Status badges (Fresh/Expired)
- [ ] Search functionality
- [ ] Basic filters (source, status)
- [ ] Sortable columns
- [ ] Responsive design

### Phase 2: Filtering & Search
- [ ] Advanced search (evidence ID, name, control, framework)
- [ ] Multi-select framework filter
- [ ] Multi-select control filter
- [ ] Source type filter
- [ ] Status filter
- [ ] Date range filter
- [ ] Evidence type filter
- [ ] Clear filters button
- [ ] Filter persistence (URL params)

### Phase 3: Detail View
- [ ] Evidence detail drawer
- [ ] Tabbed interface (Overview, Controls, Preview, Metadata)
- [ ] File preview (images, PDFs, text)
- [ ] Control linking interface
- [ ] Download functionality
- [ ] Metadata display

### Phase 4: Upload Functionality
- [ ] Upload modal
- [ ] Drag & drop file upload
- [ ] File type validation
- [ ] Evidence details form
- [ ] Control linking during upload
- [ ] Validity/expiration settings
- [ ] Upload progress indicator

### Phase 5: Advanced Features
- [ ] Card view option
- [ ] Timeline view
- [ ] Bulk export (ZIP)
- [ ] Evidence pack generation
- [ ] Audit lock functionality
- [ ] Evidence versioning
- [ ] Related evidence suggestions
- [ ] Evidence freshness alerts
- [ ] Auto-expiration handling

---

## 11. Backend Requirements

### API Endpoints Needed
1. `GET /api/compliance/evidence/`
   - List all evidence (with filtering)
   - Query params: source, status, framework, control, search, date_range

2. `GET /api/compliance/evidence/{id}/`
   - Get single evidence details

3. `POST /api/compliance/evidence/`
   - Upload new evidence
   - Multipart form data (file + metadata)

4. `GET /api/compliance/evidence/{id}/file/`
   - Download evidence file

5. `GET /api/compliance/evidence/{id}/preview/`
   - Get preview/thumbnail

6. `POST /api/compliance/evidence/{id}/link-control/`
   - Link evidence to control(s)

7. `POST /api/compliance/evidence/{id}/unlink-control/`
   - Unlink evidence from control

8. `DELETE /api/compliance/evidence/{id}/`
   - Delete evidence (if permitted)

9. `POST /api/compliance/evidence/bulk-export/`
   - Export multiple evidence items as ZIP

10. `GET /api/compliance/evidence/stats/`
    - Get summary statistics

### Database Models (Django)
- `ComplianceEvidence` (evidence records)
- `EvidenceFile` (file storage)
- `EvidenceControlLink` (many-to-many with controls)
- `EvidenceTag` (tagging system)
- `EvidenceVersion` (version history)

---

## 12. Mock Data Strategy

### Initial Implementation
- Create mock data for 50+ evidence items
- Mix of automated and manual
- Various file types (JSON, PDF, PNG, TXT)
- Different statuses (fresh, expired, expiring soon)
- Linked to various controls
- Realistic timestamps
- Sample file content/previews

### Sample Evidence Data
```typescript
{
  id: "ev-001",
  evidenceId: "EV-001",
  name: "TLS Scan Result - Production",
  source: "automated",
  sourceType: "tls_scan",
  sourceName: "Security Scanner",
  controlIds: ["soc2-cc6.1"],
  status: "fresh",
  createdAt: "2024-01-15T10:30:00Z",
  expiresAt: "2024-04-15T10:30:00Z",
  fileType: "json",
  fileSize: 45678
}
```

---

## 13. Styling & Design

### Color Scheme (using palette)
- **Fresh status**: Green (`palette-accent-3` or green-500)
- **Expiring Soon**: Yellow (`palette-accent-2` or yellow-500)
- **Expired**: Red (`palette-accent-1` or red-500)
- **Automated source**: Blue badge
- **Manual source**: Purple badge
- **File type icons**: Color-coded by type

### Layout
- Consistent with Frameworks and Controls pages
- Use same spacing, typography, card styles
- Match unified sidebar accent-1 background
- Table with alternating row colors

### Responsive Breakpoints
- Mobile: Stacked layout, simplified table
- Tablet: 2-column card view, simplified table
- Desktop: Full table with all columns, 3-column card view

---

## 14. Implementation Steps

1. **Create mock data file** (`studio/lib/data/evidence.ts`)
   - 50+ evidence items with sample data
   - Various sources and types
   - Different statuses
   - Control mappings

2. **Build EvidenceStatusBadge component**
   - Fresh/Expired/Expiring Soon indicators

3. **Build EvidenceSourceBadge component**
   - Automated/Manual badges with icons

4. **Build EvidenceTable component**
   - Table layout with columns
   - Sortable functionality
   - Expandable rows
   - Row actions menu

5. **Build EvidenceCard component**
   - Card layout
   - File preview
   - Status display

6. **Build FilePreview component**
   - Image viewer
   - PDF viewer (iframe or embed)
   - Text/JSON viewer
   - Download button

7. **Build UploadEvidenceModal component**
   - File upload (drag & drop)
   - Form fields
   - Control linking
   - Validation

8. **Build EvidenceDetailDrawer component**
   - Sheet/drawer component
   - Tabbed interface
   - File preview integration
   - Control management

9. **Build main page**
   - Integrate table/card views
   - Add filters and search
   - Add summary statistics
   - Upload modal integration

10. **Add state management**
    - Filter state
    - Search state
    - View mode state
    - Selected evidence state
    - Upload state

11. **Add actions**
    - Upload handlers
    - Download handlers
    - Control linking
    - Delete functionality
    - Export functionality

12. **Connect to backend** (when ready)
    - Replace mock data with API calls
    - Add loading states
    - Error handling
    - File upload progress

---

## 15. Testing Checklist

- [ ] All evidence displays correctly
- [ ] Filters work (source, status, framework, control, search)
- [ ] Table sorting works
- [ ] Row expansion shows details
- [ ] File preview works (images, PDFs, text)
- [ ] Upload modal works
- [ ] Drag & drop upload works
- [ ] File type validation works
- [ ] Control linking works
- [ ] Download functionality works
- [ ] Status badges display correctly
- [ ] Source badges show correctly
- [ ] Search finds evidence by ID, name, control, framework
- [ ] Responsive on mobile/tablet/desktop
- [ ] Loading states display
- [ ] Empty states (no evidence, no results)
- [ ] Bulk actions work
- [ ] Export functionality works
- [ ] Expiration warnings display
- [ ] Accessibility (keyboard navigation, screen readers)

---

## 16. Future Enhancements

- Evidence versioning and history
- Evidence templates
- Automated evidence collection scheduling
- Evidence freshness monitoring and alerts
- Evidence approval workflow
- Evidence sharing with external auditors
- Evidence retention policies
- Evidence search within file content (OCR for PDFs)
- Evidence relationships and dependencies
- Evidence analytics and insights
- Integration with external evidence sources
- Evidence compliance scoring

