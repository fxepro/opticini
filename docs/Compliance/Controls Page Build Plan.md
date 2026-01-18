# Controls Page Build Plan

## Overview
Build a comprehensive Compliance Controls page that displays all controls across frameworks with real-time status, failure explanations, evidence links, and detailed control information.

---

## 1. Purpose & Users

**Purpose:** The operational heart of compliance - shows real-time control status across all frameworks.

**Primary Users:**
- Security / DevOps teams
- Compliance leads
- Auditors (read-only)

---

## 2. Page Structure & Layout

### Header Section
- Page title: "Compliance Controls"
- Subtitle: "Monitor and manage compliance controls across all frameworks"
- Action buttons:
  - "Evaluate All" (trigger evaluation for all controls)
  - "Export Report" (export control status report)
  - "Bulk Actions" (bulk status updates, if permitted)

### Summary Statistics (Top Bar)
- Total controls: X
- Passing: Y
- Failing: Z
- Partial: W
- Not Evaluated: V
- Overall compliance: XX%

### Filter & Search Bar
- Search by:
  - Control ID (e.g., "SOC2-CC6.1")
  - Control name/description
  - Framework name
- Filter by:
  - Framework (multi-select)
  - Status (Pass / Fail / Partial / Not Evaluated)
  - Severity (Critical / High / Medium / Low)
  - Category (if applicable)
  - Last evaluated date range

### View Options
- **Table View** (default) - Compact list view
- **Card View** - Detailed card layout
- **Grouped View** - Group by framework

### Controls Table/List
- Sortable columns
- Expandable rows for details
- Bulk selection (checkboxes)
- Quick actions per row

---

## 3. Control Data Structure

### Control Object
```typescript
interface Control {
  id: string;
  controlId: string; // e.g., "SOC2-CC6.1", "ISO27001-A.9.1.1"
  name: string;
  description: string;
  
  // Framework mapping
  frameworks: string[]; // Framework IDs
  frameworkNames: string[]; // Display names
  
  // Status
  status: 'pass' | 'fail' | 'partial' | 'not_evaluated';
  severity: 'critical' | 'high' | 'medium' | 'low';
  
  // Evaluation
  lastEvaluated?: string; // ISO date
  evaluatedBy?: string; // User/system
  evaluationMethod: 'automated' | 'manual' | 'hybrid';
  
  // Failure details
  failureReason?: string;
  failingAssets?: string[]; // Asset IDs or names
  failingCount?: number; // Number of assets failing
  
  // Evidence
  evidenceCount: number;
  evidenceIds: string[]; // Links to evidence records
  
  // Metrics
  uptimePercentage?: number; // Control uptime over time period
  timeOutOfCompliance?: number; // Minutes/hours out of compliance
  
  // Recommendations
  fixRecommendations?: string[];
  relatedControls?: string[]; // Control IDs
  
  // Metadata
  category?: string;
  controlType: 'preventive' | 'detective' | 'corrective';
  frequency: 'continuous' | 'daily' | 'weekly' | 'monthly' | 'annually';
}
```

---

## 4. Table View Design

### Columns
1. **Checkbox** (for bulk actions)
2. **Control ID** (e.g., SOC2-CC6.1)
   - Clickable to open detail drawer
   - Framework badge(s) next to ID
3. **Control Name** (truncated with tooltip)
4. **Frameworks** (badges showing which frameworks)
5. **Status** (badge with icon)
   - Pass (green check)
   - Fail (red X)
   - Partial (yellow warning)
   - Not Evaluated (gray dash)
6. **Severity** (badge)
   - Critical (red)
   - High (orange)
   - Medium (yellow)
   - Low (blue)
7. **Last Evaluated** (relative time + date)
8. **Evidence** (count badge, clickable)
9. **Actions** (dropdown menu)
   - View Details
   - View Evidence
   - Re-evaluate
   - View Recommendations

### Row Expansion
When expanded, shows:
- Full description
- Failure reason (if failing)
- Failing assets list
- Evidence preview (last 3)
- Fix recommendations
- Related controls

---

## 5. Card View Design

Each card displays:

### Header
- Control ID (large, prominent)
- Framework badges
- Status badge (top right)
- Severity indicator

### Body
- Control name
- Description (truncated, expandable)
- Status details:
  - Pass: "All assets compliant"
  - Fail: Failure reason + failing assets count
  - Partial: Partial compliance details
  - Not Evaluated: "Evaluation pending"

### Evidence Section
- Evidence count badge
- Last evidence timestamp
- Quick preview of evidence types
- "View All Evidence" link

### Metrics (if available)
- Uptime percentage (sparkline chart)
- Time out of compliance
- Evaluation frequency

### Actions
- "View Details" button
- "View Evidence" button
- "Re-evaluate" button (if permitted)

---

## 6. Control Detail Drawer/Sidebar

### When opened (from table row or card):
- **Header**
  - Control ID and name
  - Status badge
  - Close button

- **Tabs:**
  1. **Overview**
     - Full description
     - Mapped frameworks (with links)
     - Control type and frequency
     - Current status and reason
     - Last evaluated timestamp
     - Evaluated by (user/system)
     
  2. **Evidence**
     - Evidence list (all linked evidence)
     - Evidence type (Automated/Manual)
     - Timestamp
     - Status (Fresh/Expired)
     - Preview/download links
     - "Add Evidence" button (if permitted)
     
  3. **Assets**
     - Failing assets list (if applicable)
     - Asset details
     - Compliance status per asset
     - "View Asset" links
     
  4. **Recommendations**
     - Fix recommendations list
     - Priority indicators
     - Implementation steps
     - Related documentation
     
  5. **History**
     - Evaluation history timeline
     - Status changes over time
     - Evidence additions
     - Notes/comments

- **Actions (footer)**
  - Re-evaluate control
  - Add manual evidence
  - Add note
  - Export control report

---

## 7. Sample Controls Data

### Example Controls (50+ controls across frameworks)

**SOC 2 Controls:**
- SOC2-CC1.1: Control Environment
- SOC2-CC2.1: Communication and Information
- SOC2-CC3.1: Risk Assessment
- SOC2-CC4.1: Monitoring Activities
- SOC2-CC5.1: Control Activities
- SOC2-CC6.1: Logical and Physical Access Controls
- SOC2-CC6.2: System Operations
- SOC2-CC6.3: Change Management
- SOC2-CC6.6: Logical Access Security
- SOC2-CC6.7: System Boundaries
- SOC2-CC7.1: System Operations
- SOC2-CC7.2: System Monitoring
- SOC2-CC7.3: Backup and Recovery
- SOC2-CC7.4: Incident Response
- SOC2-CC8.1: Change Management Process

**ISO 27001 Controls:**
- ISO27001-A.5.1.1: Policies for Information Security
- ISO27001-A.6.1.1: Information Security Roles
- ISO27001-A.7.1.1: Screening
- ISO27001-A.8.1.1: Inventory of Assets
- ISO27001-A.9.1.1: Access Control Policy
- ISO27001-A.9.2.1: User Registration
- ISO27001-A.9.4.2: Secure Log-on Procedures
- ISO27001-A.10.1.1: Cryptographic Controls
- ISO27001-A.12.1.1: Documented Operating Procedures
- ISO27001-A.12.2.1: Controls Against Malware
- ISO27001-A.12.3.1: Information Backup
- ISO27001-A.12.4.1: Event Logging
- ISO27001-A.12.6.1: Management of Technical Vulnerabilities
- ISO27001-A.13.1.1: Network Controls
- ISO27001-A.14.1.1: Information Security Requirements
- ISO27001-A.15.1.1: Information Security in Supplier Relationships
- ISO27001-A.16.1.1: Responsibilities and Procedures
- ISO27001-A.17.1.1: Planning Information Security Continuity
- ISO27001-A.18.1.1: Identification of Applicable Legislation

**GDPR Controls:**
- GDPR-Art.5: Principles of Processing
- GDPR-Art.6: Lawfulness of Processing
- GDPR-Art.7: Conditions for Consent
- GDPR-Art.12: Transparent Information
- GDPR-Art.13: Information to be Provided
- GDPR-Art.15: Right of Access
- GDPR-Art.17: Right to Erasure
- GDPR-Art.25: Data Protection by Design
- GDPR-Art.30: Records of Processing Activities
- GDPR-Art.32: Security of Processing
- GDPR-Art.33: Breach Notification
- GDPR-Art.35: Data Protection Impact Assessment

**HIPAA Controls:**
- HIPAA-164.308: Administrative Safeguards
- HIPAA-164.310: Physical Safeguards
- HIPAA-164.312: Technical Safeguards
- HIPAA-164.314: Organizational Requirements
- HIPAA-164.316: Policies and Procedures

**PCI DSS Controls:**
- PCI-1: Install and Maintain Firewall
- PCI-2: Do Not Use Vendor Defaults
- PCI-3: Protect Stored Cardholder Data
- PCI-4: Encrypt Transmission
- PCI-5: Use Antivirus Software
- PCI-6: Develop Secure Systems
- PCI-7: Restrict Access
- PCI-8: Assign Unique IDs
- PCI-9: Restrict Physical Access
- PCI-10: Track and Monitor Access
- PCI-11: Regularly Test Systems
- PCI-12: Maintain Security Policy

---

## 8. Components to Build

### Main Components
1. **ControlsPage** (`studio/app/workspace/compliance/controls/page.tsx`)
   - Main page container
   - State management
   - API calls
   - View switching (table/card/grouped)

2. **ControlsTable** (`studio/components/compliance/controls-table.tsx`)
   - Table view with sortable columns
   - Expandable rows
   - Bulk selection
   - Row actions

3. **ControlCard** (`studio/components/compliance/control-card.tsx`)
   - Card view layout
   - Status indicators
   - Evidence preview
   - Quick actions

4. **ControlDetailDrawer** (`studio/components/compliance/control-detail-drawer.tsx`)
   - Side drawer/sheet component
   - Tabbed interface
   - Evidence list
   - Recommendations
   - History timeline

5. **ControlsFilters** (`studio/components/compliance/controls-filters.tsx`)
   - Search input
   - Multi-select framework filter
   - Status filter
   - Severity filter
   - Date range picker

6. **ControlsSummary** (`studio/components/compliance/controls-summary.tsx`)
   - Statistics bar
   - Quick insights
   - Compliance trends

7. **ControlStatusBadge** (`studio/components/compliance/control-status-badge.tsx`)
   - Reusable status badge component
   - Color-coded
   - Icons

8. **EvidencePreview** (`studio/components/compliance/evidence-preview.tsx`)
   - Evidence list preview
   - Evidence type indicators
   - Timestamp display

### UI Components (reuse existing)
- Table, Card, Badge, Button, Dialog, Sheet (from shadcn/ui)
- Select, Input, Checkbox (for filters)
- Tabs (for detail drawer)
- Tooltip (for truncated text)

---

## 9. Features to Implement

### Phase 1: Core Display
- [ ] Controls table with all columns
- [ ] Status badges and indicators
- [ ] Framework badges
- [ ] Search functionality
- [ ] Basic filters (framework, status)
- [ ] Sortable columns
- [ ] Responsive design

### Phase 2: Filtering & Search
- [ ] Advanced search (control ID, name, description)
- [ ] Multi-select framework filter
- [ ] Status filter
- [ ] Severity filter
- [ ] Date range filter
- [ ] Clear filters button
- [ ] Filter persistence (URL params)

### Phase 3: Detail View
- [ ] Control detail drawer
- [ ] Tabbed interface (Overview, Evidence, Assets, Recommendations, History)
- [ ] Evidence list and preview
- [ ] Failure reason display
- [ ] Failing assets list
- [ ] Fix recommendations
- [ ] Evaluation history

### Phase 4: Actions
- [ ] Re-evaluate control
- [ ] View evidence (link to evidence page)
- [ ] Add manual evidence
- [ ] Export control report
- [ ] Bulk actions (re-evaluate, export)

### Phase 5: Advanced Features
- [ ] Card view option
- [ ] Grouped view (by framework)
- [ ] Control uptime charts
- [ ] Time out of compliance tracking
- [ ] Related controls suggestions
- [ ] Control dependencies mapping
- [ ] Real-time status updates (WebSocket/polling)

---

## 10. Backend Requirements

### API Endpoints Needed
1. `GET /api/compliance/controls/`
   - List all controls (with filtering)
   - Query params: framework, status, severity, search, date_range

2. `GET /api/compliance/controls/{id}/`
   - Get single control details

3. `GET /api/compliance/controls/{id}/evidence/`
   - Get evidence linked to control

4. `GET /api/compliance/controls/{id}/assets/`
   - Get assets related to control (if failing)

5. `GET /api/compliance/controls/{id}/recommendations/`
   - Get fix recommendations

6. `GET /api/compliance/controls/{id}/history/`
   - Get evaluation history

7. `POST /api/compliance/controls/{id}/evaluate/`
   - Trigger re-evaluation

8. `POST /api/compliance/controls/bulk-evaluate/`
   - Bulk re-evaluation

9. `GET /api/compliance/controls/stats/`
   - Get summary statistics

### Database Models (Django)
- `ComplianceControl` (master control definitions)
- `ControlEvaluation` (evaluation results)
- `ControlEvidence` (evidence links)
- `ControlRecommendation` (fix recommendations)
- `ControlHistory` (status change history)

---

## 11. Mock Data Strategy

### Initial Implementation
- Create mock data for 50+ controls across multiple frameworks
- Vary statuses (pass, fail, partial, not evaluated)
- Different severities
- Realistic failure reasons
- Sample evidence links
- Evaluation timestamps
- Fix recommendations

### Sample Control Data
```typescript
{
  id: "soc2-cc6.1",
  controlId: "SOC2-CC6.1",
  name: "Logical and Physical Access Controls",
  description: "The entity authorizes, develops, documents, and implements logical and physical access controls...",
  frameworks: ["soc2-type1", "soc2-type2"],
  frameworkNames: ["SOC 2 Type I", "SOC 2 Type II"],
  status: "fail",
  severity: "high",
  lastEvaluated: "2024-01-15T10:30:00Z",
  evaluatedBy: "system",
  evaluationMethod: "automated",
  failureReason: "Missing CSP header on 3 assets",
  failingAssets: ["asset-123", "asset-456", "asset-789"],
  failingCount: 3,
  evidenceCount: 2,
  evidenceIds: ["ev-001", "ev-002"],
  uptimePercentage: 92.5,
  timeOutOfCompliance: 180, // minutes
  fixRecommendations: [
    "Add Content-Security-Policy header to all web assets",
    "Configure CSP policy in web server configuration",
    "Test CSP policy using browser developer tools"
  ],
  relatedControls: ["soc2-cc6.2", "soc2-cc6.6"],
  category: "Access Control",
  controlType: "preventive",
  frequency: "continuous"
}
```

---

## 12. Styling & Design

### Color Scheme (using palette)
- **Pass status**: Green (`palette-accent-3` or green-500)
- **Fail status**: Red (`palette-accent-1` or red-500)
- **Partial status**: Yellow/Amber (`palette-accent-2` or yellow-500)
- **Not Evaluated**: Gray
- **Severity badges**:
  - Critical: Red
  - High: Orange
  - Medium: Yellow
  - Low: Blue

### Layout
- Consistent with Frameworks page
- Use same spacing, typography, card styles
- Match unified sidebar accent-1 background
- Table with alternating row colors for readability

### Responsive Breakpoints
- Mobile: Stacked layout, simplified table
- Tablet: 2-column card view, simplified table
- Desktop: Full table with all columns, 3-column card view

---

## 13. Implementation Steps

1. **Create mock data file** (`studio/lib/data/controls.ts`)
   - 50+ controls with sample data
   - Various statuses and severities
   - Framework mappings

2. **Build ControlStatusBadge component**
   - Reusable status indicator
   - Color-coded badges

3. **Build ControlsTable component**
   - Table layout with columns
   - Sortable functionality
   - Expandable rows
   - Row actions menu

4. **Build ControlCard component**
   - Card layout
   - Status display
   - Evidence preview

5. **Build ControlDetailDrawer component**
   - Sheet/drawer component
   - Tabbed interface
   - All detail sections

6. **Build main page**
   - Integrate table/card views
   - Add filters and search
   - Add summary statistics

7. **Add state management**
   - Filter state
   - Search state
   - View mode state
   - Selected controls state

8. **Add actions**
   - Re-evaluate handlers
   - Evidence navigation
   - Export functionality

9. **Connect to backend** (when ready)
   - Replace mock data with API calls
   - Add loading states
   - Error handling
   - Real-time updates

---

## 14. Testing Checklist

- [ ] All controls display correctly
- [ ] Filters work (framework, status, severity, search)
- [ ] Table sorting works
- [ ] Row expansion shows details
- [ ] Detail drawer opens and displays correctly
- [ ] Evidence links work
- [ ] Status badges display correctly
- [ ] Framework badges show correctly
- [ ] Search finds controls by ID, name, description
- [ ] Responsive on mobile/tablet/desktop
- [ ] Loading states display
- [ ] Empty states (no controls, no results)
- [ ] Bulk actions work
- [ ] Export functionality works
- [ ] Accessibility (keyboard navigation, screen readers)

---

## 15. Future Enhancements

- Control dependencies visualization
- Control compliance trends over time
- Automated remediation suggestions
- Control testing automation
- Integration with security tools
- Control risk scoring
- Control maturity assessment
- Custom control creation
- Control templates
- Control library/registry

