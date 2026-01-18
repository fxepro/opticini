# Frameworks Page Build Plan

## Overview
Build a comprehensive Compliance Frameworks page that displays 25+ frameworks with compliance scores, readiness status, and management capabilities.

---

## 1. Framework List (25+ Frameworks)

### Security & Audit Frameworks
1. **SOC 2 Type I**
2. **SOC 2 Type II**
3. **ISO 27001**
4. **ISO 27002**
5. **ISO 27017** (Cloud Security)
6. **ISO 27018** (Cloud Privacy)
7. **ISO 27701** (Privacy Management)
8. **NIST Cybersecurity Framework (CSF)**
9. **NIST SP 800-53**
10. **CIS Controls (CIS 20)**
11. **CIS Benchmarks**

### Privacy & Data Protection
12. **GDPR** (EU General Data Protection Regulation)
13. **CCPA** (California Consumer Privacy Act)
14. **PIPEDA** (Canada)
15. **LGPD** (Brazil)
16. **PDPA** (Singapore)

### Industry-Specific
17. **HIPAA** (Healthcare - US)
18. **HITECH Act** (Healthcare - US)
19. **PCI DSS** (Payment Card Industry)
20. **FedRAMP** (US Government Cloud)
21. **FISMA** (US Federal Information Security)
22. **GLBA** (Financial Services - US)
23. **SOX** (Sarbanes-Oxley)
24. **FTC Safeguards Rule**

### Regional & Emerging
25. **UK GDPR**
26. **Australian Privacy Principles (APP)**
27. **CMMC** (Cybersecurity Maturity Model Certification - US DoD)
28. **TISAX** (Automotive Industry)
29. **CSA STAR** (Cloud Security Alliance)
30. **OWASP Top 10** (Application Security)

---

## 2. Page Structure & Layout

### Header Section
- Page title: "Compliance Frameworks"
- Subtitle: "Manage and monitor your compliance posture across all frameworks"
- Action buttons:
  - "Enable Framework" (opens modal)
  - "Bulk Actions" (enable/disable multiple)
  - "Export Report" (all frameworks summary)

### Filter & Search Bar
- Search by framework name
- Filter by:
  - Category (Security, Privacy, Industry, Regional)
  - Status (Ready, In Progress, At Risk, Not Started)
  - Enabled/Disabled
  - Compliance Score range (slider)

### Framework Cards Grid
- Responsive grid: 1 column (mobile) → 2 columns (tablet) → 3 columns (desktop)
- Card layout (see section 3)

### Summary Statistics (Top Bar)
- Total frameworks: X
- Enabled: Y
- Ready: Z
- Average compliance: XX%

---

## 3. Framework Card Design

Each card displays:

### Visual Elements
- **Framework Logo** (left side, 64x64px)
  - Use official logos where available
  - Fallback: colored icon based on category
- **Status Badge** (top right)
  - Ready (green) - 80%+ compliant
  - In Progress (yellow) - 40-79% compliant
  - At Risk (red) - <40% compliant
  - Not Started (gray) - 0% compliant

### Key Metrics
- **Compliance Score** (large, prominent)
  - Percentage: "68%"
  - Circular progress indicator
  - Color-coded (green/yellow/red)
- **Controls Status**
  - "45 / 67 controls passing"
  - Visual breakdown: passing (green) / failing (red) / not evaluated (gray)

### Actions
- **"View Controls"** button (primary)
  - Links to `/workspace/compliance/controls?framework={id}`
- **"Generate Report"** button (secondary)
  - Opens report generation modal
- **Toggle Switch** (top right)
  - Enable/Disable framework for tenant

### Additional Info (on hover/expand)
- Framework description
- Last evaluated date
- Next audit date (if applicable)
- Related frameworks
- Compliance officer assigned

---

## 4. Data Structure

### Framework Object
```typescript
interface Framework {
  id: string;
  name: string;
  code: string; // e.g., "SOC2", "ISO27001"
  category: 'security' | 'privacy' | 'industry' | 'regional';
  description: string;
  logo?: string; // URL to logo image
  icon?: string; // Lucide icon name as fallback
  
  // Status
  enabled: boolean;
  status: 'ready' | 'in_progress' | 'at_risk' | 'not_started';
  
  // Metrics
  complianceScore: number; // 0-100
  totalControls: number;
  passingControls: number;
  failingControls: number;
  notEvaluatedControls: number;
  
  // Metadata
  lastEvaluated?: string; // ISO date
  nextAuditDate?: string; // ISO date
  complianceOfficer?: string; // User ID
  relatedFrameworks?: string[]; // Framework IDs
  
  // Tenant-specific
  tenantId: string;
  enabledAt?: string;
  enabledBy?: string;
}
```

---

## 5. Components to Build

### Main Components
1. **FrameworksPage** (`studio/app/workspace/compliance/frameworks/page.tsx`)
   - Main page container
   - State management
   - API calls

2. **FrameworkCard** (`studio/components/compliance/framework-card.tsx`)
   - Individual framework display
   - Click handlers
   - Status indicators

3. **FrameworkFilters** (`studio/components/compliance/framework-filters.tsx`)
   - Search input
   - Filter dropdowns
   - Category chips

4. **FrameworkSummary** (`studio/components/compliance/framework-summary.tsx`)
   - Top statistics bar
   - Quick insights

5. **EnableFrameworkModal** (`studio/components/compliance/enable-framework-modal.tsx`)
   - Modal to enable new framework
   - Framework selection
   - Configuration options

6. **ReportGenerationModal** (`studio/components/compliance/report-generation-modal.tsx`)
   - Report type selection
   - Date range picker
   - Export format options

### UI Components (reuse existing)
- Card, Button, Badge, Progress, Switch (from shadcn/ui)
- Table (for list view option)
- Dialog/Modal (for actions)

---

## 6. Features to Implement

### Phase 1: Core Display
- [ ] Framework cards grid layout
- [ ] Display 25+ frameworks with mock data
- [ ] Status badges and compliance scores
- [ ] Controls passing/failing display
- [ ] Responsive design (mobile/tablet/desktop)

### Phase 2: Filtering & Search
- [ ] Search by framework name
- [ ] Filter by category
- [ ] Filter by status
- [ ] Filter by enabled/disabled
- [ ] Sort options (score, name, last evaluated)

### Phase 3: Actions
- [ ] Enable/Disable toggle per framework
- [ ] "View Controls" navigation
- [ ] "Generate Report" modal
- [ ] Bulk enable/disable actions

### Phase 4: Statistics & Insights
- [ ] Summary statistics bar
- [ ] Compliance trend charts (if historical data)
- [ ] Framework comparison view
- [ ] Quick actions menu

### Phase 5: Advanced Features
- [ ] Framework details drawer/sidebar
- [ ] Related frameworks suggestions
- [ ] Compliance officer assignment
- [ ] Audit date tracking
- [ ] Export functionality

---

## 7. Backend Requirements

### API Endpoints Needed
1. `GET /api/compliance/frameworks/`
   - List all frameworks (with tenant filtering)
   - Query params: enabled, category, status

2. `GET /api/compliance/frameworks/{id}/`
   - Get single framework details

3. `POST /api/compliance/frameworks/{id}/enable/`
   - Enable framework for tenant

4. `POST /api/compliance/frameworks/{id}/disable/`
   - Disable framework for tenant

5. `GET /api/compliance/frameworks/{id}/metrics/`
   - Get compliance score, controls status

6. `POST /api/compliance/frameworks/{id}/report/`
   - Generate readiness report

### Database Models (Django)
- `ComplianceFramework` (master list)
- `TenantFramework` (tenant-specific enablement)
- `FrameworkMetrics` (scores, control counts)
- `FrameworkEvaluation` (evaluation history)

---

## 8. Mock Data Strategy

### Initial Implementation
- Create mock data for all 30 frameworks
- Vary compliance scores (30-95%)
- Mix of enabled/disabled
- Different statuses
- Realistic control counts

### Sample Framework Data
```typescript
{
  id: "soc2-type2",
  name: "SOC 2 Type II",
  code: "SOC2-T2",
  category: "security",
  enabled: true,
  status: "in_progress",
  complianceScore: 68,
  totalControls: 67,
  passingControls: 45,
  failingControls: 12,
  notEvaluatedControls: 10,
  lastEvaluated: "2024-01-15",
  nextAuditDate: "2024-07-01"
}
```

---

## 9. Styling & Design

### Color Scheme (using palette)
- **Ready status**: `palette-accent-3` (light green)
- **In Progress**: `palette-accent-2` (yellow/amber)
- **At Risk**: `palette-accent-1` (red/orange)
- **Not Started**: Gray
- **Card borders**: `palette-primary` on hover
- **Progress bars**: Use palette colors

### Layout
- Consistent with existing workspace pages
- Use same spacing, typography, card styles
- Match unified sidebar accent-1 background

### Responsive Breakpoints
- Mobile: 1 column, stacked filters
- Tablet: 2 columns, inline filters
- Desktop: 3 columns, full filter bar

---

## 10. Implementation Steps

1. **Create mock data file** (`studio/lib/data/frameworks.ts`)
   - All 30 frameworks with sample data

2. **Build FrameworkCard component**
   - Card layout with all elements
   - Status badges
   - Progress indicators
   - Action buttons

3. **Build main page**
   - Grid layout
   - Integrate FrameworkCard
   - Add filters and search

4. **Add state management**
   - Filter state
   - Search state
   - Enable/disable handlers

5. **Add modals**
   - Enable framework modal
   - Report generation modal

6. **Connect to backend** (when ready)
   - Replace mock data with API calls
   - Add loading states
   - Error handling

---

## 11. Testing Checklist

- [ ] All 30 frameworks display correctly
- [ ] Filters work (category, status, search)
- [ ] Enable/disable toggle works
- [ ] "View Controls" navigates correctly
- [ ] "Generate Report" opens modal
- [ ] Responsive on mobile/tablet/desktop
- [ ] Loading states display
- [ ] Empty states (no frameworks, no results)
- [ ] Accessibility (keyboard navigation, screen readers)

---

## 12. Future Enhancements

- Framework comparison view
- Compliance trend charts
- Automated framework recommendations
- Framework templates/custom frameworks
- Integration with external compliance tools
- Real-time compliance score updates
- Framework dependencies mapping

