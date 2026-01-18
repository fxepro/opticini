# Framework Loading Summary

**Date:** 2026-01-07  
**Command:** `python manage.py load_frameworks`

---

## ✅ Successfully Loaded Frameworks

### Updated Frameworks (2)
1. **SOC 2 Type I** (`SOC2-T1`)
   - Source: OpenControl (Apache 2.0)
   - Category: Security
   - Status: Updated with authoritative data

2. **SOC 2 Type II** (`SOC2-T2`)
   - Source: OpenControl (Apache 2.0)
   - Category: Security
   - Status: Updated with authoritative data

### Created Frameworks (2)
1. **PCI-DSS v4.0** (`PCI-DSS-4`)
   - Source: PCI SSC Quick Guide (Public)
   - Category: Industry
   - Status: Created from authoritative source

2. **ISO/IEC 27001:2022** (`ISO27001-2022`)
   - Source: ISO Annex A (Public Structure)
   - Category: Security
   - Status: Created from authoritative source

---

## Files Created

### 1. Data File
**Location:** `backend/compliance_frameworks/data/frameworks.yaml`

Contains framework definitions from authoritative sources:
- SOC 2 frameworks (OpenControl)
- PCI-DSS framework (PCI SSC)
- ISO 27001 framework (ISO Annex A)

### 2. Management Command
**Location:** `backend/compliance_frameworks/management/commands/load_frameworks.py`

Features:
- Loads frameworks from YAML file
- Idempotent (safe to run multiple times)
- Dry-run mode (`--dry-run`)
- Clear existing option (`--clear`)
- Validation and error handling

---

## Command Usage

### Load Frameworks
```bash
cd backend
python manage.py load_frameworks
```

### Dry Run (Preview Changes)
```bash
python manage.py load_frameworks --dry-run
```

### Clear and Reload
```bash
python manage.py load_frameworks --clear
```

### Custom File Path
```bash
python manage.py load_frameworks --file path/to/frameworks.yaml
```

---

## Data Sources

| Framework | Source | License | URL |
|-----------|--------|---------|-----|
| SOC 2 Type I/II | OpenControl | Apache 2.0 | https://github.com/opencontrol/compliance-masonry |
| PCI-DSS v4.0 | PCI SSC | Public | https://github.com/complytime/complytime-pci-dss |
| ISO/IEC 27001:2022 | ISO Annex A | Public | https://github.com/center-for-threat-informed-defense/attack-control-framework-mappings |

---

## Next Steps

1. ✅ **Frameworks loaded** - Complete
2. ⏳ **Controls loading** - Next step
   - Load controls from OpenControl (SOC 2)
   - Load controls from complytime-pci-dss (PCI-DSS)
   - Load controls from attack-control-framework-mappings (ISO 27001)
3. ⏳ **Framework-Control mappings** - After controls are loaded
4. ⏳ **Evidence requirements** - Must create (your IP)

---

## Verification

To verify frameworks were loaded correctly:

```bash
cd backend
python manage.py shell
```

```python
from compliance_frameworks.models import ComplianceFramework

# List all frameworks
frameworks = ComplianceFramework.objects.all()
for fw in frameworks:
    print(f"{fw.code}: {fw.name} - {fw.category} - {fw.status}")
```

---

**Status:** ✅ Complete  
**Frameworks Loaded:** 4  
**Source:** Authoritative data sources

