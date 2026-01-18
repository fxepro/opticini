# Database Relationships: Frameworks → Controls → Evidence

## Overview

The relationships exist in **Django models** and are stored in **PostgreSQL database tables** via **junction/mapping tables**.

---

## 1. Framework → Control Relationship

### Database Table: `compliance_control_framework_mappings`

**Location:** `backend/compliance_controls/models.py` (lines 115-141)

**Structure:**
```python
class ComplianceControlFrameworkMapping(models.Model):
    id = UUIDField(primary_key=True)
    control = ForeignKey(ComplianceControl)  # Links to compliance_controls table
    framework_id = UUIDField()                # References compliance_frameworks.id
    framework_name = CharField()              # Denormalized for display
    created_at = DateTimeField()
```

**Database Schema:**
```
┌─────────────────────────────────────────────┐
│ compliance_frameworks                       │
├─────────────────────────────────────────────┤
│ id (UUID, PK)                               │
│ name                                        │
│ code                                        │
│ ...                                         │
└─────────────────────────────────────────────┘
                    │
                    │ (referenced by framework_id)
                    │
┌─────────────────────────────────────────────┐
│ compliance_control_framework_mappings       │
├─────────────────────────────────────────────┤
│ id (UUID, PK)                               │
│ control_id (FK → compliance_controls.id)   │
│ framework_id (UUID, references frameworks) │
│ framework_name (denormalized)               │
│ created_at                                  │
└─────────────────────────────────────────────┘
                    │
                    │ (ForeignKey)
                    │
┌─────────────────────────────────────────────┐
│ compliance_controls                         │
├─────────────────────────────────────────────┤
│ id (UUID, PK)                               │
│ control_id (unique)                         │
│ name                                        │
│ description                                 │
│ ...                                         │
└─────────────────────────────────────────────┘
```

**How it works:**
- One **Framework** can have many **Controls** (via multiple mapping rows)
- One **Control** can belong to many **Frameworks** (via multiple mapping rows)
- The `compliance_control_framework_mappings` table is the **junction table** that creates the many-to-many relationship

**Example Data:**
```
compliance_control_framework_mappings:
┌─────────────────────┬──────────────────┬──────────────────────┐
│ control_id          │ framework_id      │ framework_name       │
├─────────────────────┼──────────────────┼──────────────────────┤
│ uuid-123            │ uuid-soc2         │ SOC 2 Type I         │
│ uuid-123            │ uuid-iso27001     │ ISO 27001            │
│ uuid-456            │ uuid-soc2         │ SOC 2 Type I         │
└─────────────────────┴──────────────────┴──────────────────────┘
```

**Indexes (for fast lookups):**
- `framework_id` - Find all controls for a framework
- `(control, framework_id)` - Composite index for unique constraint

---

## 2. Control → Evidence Relationship

### Database Table: `compliance_evidence_control_mappings`

**Location:** `backend/compliance_evidence/models.py` (lines 100-129)

**Structure:**
```python
class ComplianceEvidenceControlMapping(models.Model):
    id = UUIDField(primary_key=True)
    evidence = ForeignKey(ComplianceEvidence)  # Links to compliance_evidence table
    control_id = UUIDField()                   # References compliance_controls.id
    control_name = CharField()                 # Denormalized for display
    framework_id = UUIDField()                 # Also stores framework for context
    framework_name = CharField()               # Denormalized for display
    created_at = DateTimeField()
```

**Database Schema:**
```
┌─────────────────────────────────────────────┐
│ compliance_controls                         │
├─────────────────────────────────────────────┤
│ id (UUID, PK)                               │
│ control_id (unique)                         │
│ name                                        │
│ ...                                         │
└─────────────────────────────────────────────┘
                    │
                    │ (referenced by control_id)
                    │
┌─────────────────────────────────────────────┐
│ compliance_evidence_control_mappings        │
├─────────────────────────────────────────────┤
│ id (UUID, PK)                               │
│ evidence_id (FK → compliance_evidence.id) │
│ control_id (UUID, references controls)     │
│ control_name (denormalized)                 │
│ framework_id (UUID, for context)            │
│ framework_name (denormalized)               │
│ created_at                                  │
└─────────────────────────────────────────────┘
                    │
                    │ (ForeignKey)
                    │
┌─────────────────────────────────────────────┐
│ compliance_evidence                        │
├─────────────────────────────────────────────┤
│ id (UUID, PK)                               │
│ evidence_id (unique)                        │
│ name                                        │
│ source                                      │
│ ...                                         │
└─────────────────────────────────────────────┘
```

**How it works:**
- One **Control** can have many **Evidence** items (via multiple mapping rows)
- One **Evidence** can satisfy many **Controls** (via multiple mapping rows)
- The `compliance_evidence_control_mappings` table is the **junction table** that creates the many-to-many relationship
- **Bonus:** Also stores `framework_id` and `framework_name` for context (so you know which framework the control belongs to)

**Example Data:**
```
compliance_evidence_control_mappings:
┌──────────────┬──────────────┬──────────────┬──────────────────────┐
│ evidence_id  │ control_id   │ framework_id │ framework_name        │
├──────────────┼──────────────┼──────────────┼──────────────────────┤
│ uuid-ev1     │ uuid-123      │ uuid-soc2    │ SOC 2 Type I         │
│ uuid-ev2     │ uuid-123      │ uuid-soc2    │ SOC 2 Type I         │
│ uuid-ev1     │ uuid-456      │ uuid-iso27001│ ISO 27001            │
└──────────────┴──────────────┴──────────────┴──────────────────────┘
```

**Indexes (for fast lookups):**
- `control_id` - Find all evidence for a control
- `framework_id` - Find all evidence for a framework (via controls)
- `(evidence, control_id)` - Composite index for unique constraint

---

## 3. Complete Relationship Chain

```
┌──────────────────────┐
│ ComplianceFramework  │
│ (compliance_frameworks)
└──────────────────────┘
         │
         │ (many-to-many via mapping table)
         │
         ▼
┌──────────────────────────────────────────┐
│ ComplianceControlFrameworkMapping        │
│ (compliance_control_framework_mappings)  │
│ - control_id (FK)                        │
│ - framework_id (UUID ref)                │
└──────────────────────────────────────────┘
         │
         │ (one-to-many)
         │
         ▼
┌──────────────────────┐
│ ComplianceControl    │
│ (compliance_controls)
└──────────────────────┘
         │
         │ (many-to-many via mapping table)
         │
         ▼
┌──────────────────────────────────────────┐
│ ComplianceEvidenceControlMapping        │
│ (compliance_evidence_control_mappings) │
│ - evidence_id (FK)                      │
│ - control_id (UUID ref)                  │
│ - framework_id (UUID ref, for context)   │
└──────────────────────────────────────────┘
         │
         │ (one-to-many)
         │
         ▼
┌──────────────────────┐
│ ComplianceEvidence    │
│ (compliance_evidence)
└──────────────────────┘
```

---

## 4. How to Query These Relationships

### In Django ORM:

**Get all controls for a framework:**
```python
framework_id = uuid.UUID("...")
mappings = ComplianceControlFrameworkMapping.objects.filter(
    framework_id=framework_id
)
controls = [mapping.control for mapping in mappings]
```

**Get all evidence for a control:**
```python
control_id = uuid.UUID("...")
mappings = ComplianceEvidenceControlMapping.objects.filter(
    control_id=control_id
)
evidence = [mapping.evidence for mapping in mappings]
```

**Get all evidence for a framework (via controls):**
```python
framework_id = uuid.UUID("...")
# Step 1: Get all controls for framework
control_mappings = ComplianceControlFrameworkMapping.objects.filter(
    framework_id=framework_id
)
control_ids = [m.control.id for m in control_mappings]

# Step 2: Get all evidence for those controls
evidence_mappings = ComplianceEvidenceControlMapping.objects.filter(
    control_id__in=control_ids
)
evidence = [m.evidence for m in evidence_mappings]
```

### In Raw SQL:

**Get all controls for a framework:**
```sql
SELECT c.*
FROM compliance_controls c
INNER JOIN compliance_control_framework_mappings m
    ON c.id = m.control_id
WHERE m.framework_id = 'uuid-here';
```

**Get all evidence for a control:**
```sql
SELECT e.*
FROM compliance_evidence e
INNER JOIN compliance_evidence_control_mappings m
    ON e.id = m.evidence_id
WHERE m.control_id = 'uuid-here';
```

---

## 5. Key Points

✅ **Relationships exist** - Database tables and foreign keys are created  
✅ **Indexes exist** - Fast lookups are possible  
✅ **Many-to-many supported** - Controls can belong to multiple frameworks, evidence can satisfy multiple controls  
✅ **Denormalized fields** - `framework_name` and `control_name` stored for quick display without joins  

❌ **API endpoints missing** - No REST API to query these relationships  
❌ **Serializers missing** - No way to expose nested relationships in JSON  
❌ **Frontend not connected** - Frontend uses mock data, not database  

---

## 6. Migration Files

The relationships were created via Django migrations:

- **Controls:** `backend/compliance_controls/migrations/0001_initial.py`
  - Creates `compliance_controls` table
  - Creates `compliance_control_framework_mappings` table
  - Creates indexes

- **Evidence:** `backend/compliance_evidence/migrations/0001_initial.py`
  - Creates `compliance_evidence` table
  - Creates `compliance_evidence_control_mappings` table
  - Creates indexes

These migrations have been **applied to the database**, so the tables exist in PostgreSQL.

