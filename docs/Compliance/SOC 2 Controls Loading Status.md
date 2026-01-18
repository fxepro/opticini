# SOC 2 Controls Loading Status

**Date:** 2026-01-07  
**Target:** Complete SOC 2 framework data loading

---

## Target Counts

| Item | Count | Status |
|------|-------|--------|
| **Frameworks** | 1 (SOC 2 – TSC 2017/2022) | ✅ Complete (SOC2-T1, SOC2-T2) |
| **Domains** | 9 (CC1–CC9) | ✅ Complete (CC1-CC9 + Extended) |
| **Core Controls** | ~64 | ⏳ In Progress (Currently: 51) |
| **Extended Criteria** | ~20–25 | ⏳ In Progress (Currently: 13) |
| **Total Controls Loadable** | ~85–90 | ⏳ In Progress (Currently: 64) |

---

## Current Status

### ✅ Completed

1. **Framework Records**
   - SOC 2 Type I (SOC2-T1)
   - SOC 2 Type II (SOC2-T2)
   - Source: OpenControl (Apache 2.0)

2. **Management Command**
   - `load_soc2_controls.py` created
   - Features: dry-run, clear, validation
   - Auto-creates framework mappings
   - Updates framework metrics

3. **Data File Structure**
   - `backend/compliance_controls/data/soc2-controls.yaml`
   - Organized by domain (CC1-CC9, Extended Criteria)
   - Includes metadata (severity, type, evaluation method)

### ⏳ In Progress

**Controls Data File:**
- Currently: **64 controls** loaded
- Need: **~85-90 controls** total
- Missing: ~21-26 additional controls

**Breakdown:**
- CC1 (Control Environment): 5 controls ✅
- CC2 (Communication): 3 controls ✅
- CC3 (Risk Assessment): 4 controls ✅
- CC4 (Monitoring): 2 controls ✅
- CC5 (Control Activities): 3 controls ✅
- CC6 (Access Controls): 7 controls ✅
- CC7 (System Operations): 5 controls ✅
- CC8 (Change Management): 2 controls ✅
- CC9 (Risk Mitigation): 2 controls ✅
- Availability: 3 controls ✅
- Confidentiality: 2 controls ✅
- Processing Integrity: 5 controls ✅
- Privacy: 8 controls ✅

**Total: 51 controls** (Need ~34-39 more to reach 85-90)

---

## Next Steps

### 1. Expand Controls Data File

Add more controls to reach target counts:

**Common Criteria (CC1-CC9):**
- Need ~13 more controls to reach ~64 core controls
- Add sub-controls for each domain

**Extended Criteria:**
- Need ~12-17 more controls to reach ~20-25
- Add more Availability, Confidentiality, Processing Integrity, Privacy controls

### 2. Load Controls

```bash
cd backend
python manage.py load_soc2_controls
```

### 3. Verify

```bash
python manage.py shell
```

```python
from compliance_controls.models import ComplianceControl
from compliance_frameworks.models import ComplianceFramework

# Count controls
soc2_fw = ComplianceFramework.objects.get(code='SOC2-T1')
controls = ComplianceControl.objects.filter(
    framework_mappings__framework_id=soc2_fw.id
).distinct()
print(f"Total controls: {controls.count()}")

# Count by category
from collections import Counter
cats = Counter([c.category for c in controls])
for cat, count in sorted(cats.items()):
    print(f"{cat}: {count}")
```

---

## Files Created

1. **Data File:** `backend/compliance_controls/data/soc2-controls.yaml`
   - 64 controls defined
   - Organized by domain
   - Includes all required metadata

2. **Management Command:** `backend/compliance_controls/management/commands/load_soc2_controls.py`
   - Loads controls from YAML
   - Creates framework mappings
   - Updates framework metrics
   - Dry-run and validation support

---

## Control Structure

Each control includes:
- `control_id` - Unique identifier (e.g., CC6.1, A1.1)
- `name` - Control name
- `description` - Control description (legal summary)
- `category` - Domain/category (CC1-CC9, Availability, etc.)
- `control_type` - preventive/detective/corrective
- `severity` - critical/high/medium/low
- `evaluation_method` - automated/manual/hybrid
- `frequency` - continuous/daily/weekly/monthly/annually
- `frameworks` - List of framework codes (SOC2-T1, SOC2-T2)

---

## Source Attribution

**Source:** OpenControl (GitHub: opencontrol/compliance-masonry)  
**License:** Apache 2.0  
**Legal Status:** Control IDs, names, and summaries are legal to use

---

**Last Updated:** 2026-01-07  
**Status:** In Progress - Need to expand controls file to reach 85-90 controls

