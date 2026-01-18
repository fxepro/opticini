"""
Compliance Audits Models
"""
from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid


class ComplianceAudit(models.Model):
    """
    Represents a compliance audit session
    """
    TYPE_CHOICES = [
        ('soc2_readiness', 'SOC 2 Readiness'),
        ('external_audit', 'External Audit'),
        ('internal_audit', 'Internal Audit'),
        ('customer_security_review', 'Customer Security Review'),
        ('annual_review', 'Annual Review'),
    ]
    
    STATUS_CHOICES = [
        ('planned', 'Planned'),
        ('in_progress', 'In Progress'),
        ('under_review', 'Under Review'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    audit_id = models.CharField(max_length=100, unique=True, help_text='Audit ID (e.g., AUD-001, SOC2-2024-Q2)')
    name = models.CharField(max_length=300, help_text='Audit name')
    description = models.TextField(blank=True, help_text='Audit description')
    
    # Type & Framework
    type = models.CharField(max_length=30, choices=TYPE_CHOICES, help_text='Audit type')
    # Framework mapping via ComplianceAuditFrameworkMapping
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planned', help_text='Audit status')
    
    # Timeline
    start_date = models.DateTimeField(help_text='Audit start date')
    end_date = models.DateTimeField(null=True, blank=True, help_text='Audit end date')
    scheduled_start_date = models.DateTimeField(null=True, blank=True, help_text='Scheduled start date')
    scheduled_end_date = models.DateTimeField(null=True, blank=True, help_text='Scheduled end date')
    
    # Evidence
    evidence_locked = models.BooleanField(default=False, help_text='Whether evidence is locked for this audit')
    evidence_freeze_date = models.DateTimeField(null=True, blank=True, help_text='When evidence was frozen')
    evidence_count = models.IntegerField(default=0, help_text='Number of evidence items')
    evidence_ids = ArrayField(models.UUIDField(), default=list, blank=True, help_text='Locked evidence IDs')
    
    # Controls
    total_controls = models.IntegerField(default=0, help_text='Total number of controls')
    controls_passed = models.IntegerField(default=0, help_text='Number of controls passed')
    controls_failed = models.IntegerField(default=0, help_text='Number of controls failed')
    controls_partial = models.IntegerField(default=0, help_text='Number of controls partially compliant')
    controls_not_evaluated = models.IntegerField(default=0, help_text='Number of controls not evaluated')
    compliance_score = models.IntegerField(
        null=True, blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text='Compliance score (0-100)'
    )
    
    # Findings (stored as separate model)
    findings_count = models.IntegerField(default=0, help_text='Total number of findings')
    critical_findings = models.IntegerField(default=0, help_text='Number of critical findings')
    high_findings = models.IntegerField(default=0, help_text='Number of high findings')
    medium_findings = models.IntegerField(default=0, help_text='Number of medium findings')
    low_findings = models.IntegerField(default=0, help_text='Number of low findings')
    
    # Ownership
    owner = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='owned_audits',
        help_text='Audit owner'
    )
    
    # Notes & Findings
    notes = models.TextField(blank=True, help_text='Audit notes')
    summary = models.TextField(blank=True, help_text='Audit summary')
    conclusion = models.TextField(blank=True, help_text='Audit conclusion')
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_audits')
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='updated_audits')
    completed_at = models.DateTimeField(null=True, blank=True, help_text='Completion date')
    
    # Related audits
    previous_audit = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='next_audits',
        help_text='Previous audit in sequence'
    )
    
    # Organization/Tenant
    organization_id = models.UUIDField(null=True, blank=True, help_text='Organization/tenant ID')
    
    class Meta:
        db_table = 'compliance_audits'
        ordering = ['-start_date']
        verbose_name = 'Compliance Audit'
        verbose_name_plural = 'Compliance Audits'
        indexes = [
            models.Index(fields=['audit_id']),
            models.Index(fields=['type', 'status']),
            models.Index(fields=['start_date', 'end_date']),
            models.Index(fields=['evidence_locked']),
            models.Index(fields=['organization_id']),
        ]
    
    def __str__(self):
        return f"{self.audit_id}: {self.name}"


class ComplianceAuditFinding(models.Model):
    """
    Audit findings
    """
    SEVERITY_CHOICES = [
        ('critical', 'Critical'),
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
        ('informational', 'Informational'),
    ]
    
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_remediation', 'In Remediation'),
        ('resolved', 'Resolved'),
        ('accepted', 'Accepted'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    audit = models.ForeignKey(
        ComplianceAudit,
        on_delete=models.CASCADE,
        related_name='findings',
        help_text='Audit this finding belongs to'
    )
    finding_id = models.CharField(max_length=100, help_text='Finding ID (e.g., F-001)')
    title = models.CharField(max_length=300, help_text='Finding title')
    description = models.TextField(help_text='Finding description')
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, help_text='Finding severity')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open', help_text='Finding status')
    
    # Control mapping
    control_id = models.UUIDField(null=True, blank=True, help_text='Related control ID')
    control_name = models.CharField(max_length=300, blank=True, help_text='Control name')
    framework_id = models.UUIDField(null=True, blank=True, help_text='Framework ID')
    framework_name = models.CharField(max_length=200, blank=True, help_text='Framework name')
    
    # Evidence
    evidence_ids = ArrayField(models.UUIDField(), default=list, blank=True, help_text='Related evidence IDs')
    
    # Remediation
    remediation_plan = models.TextField(blank=True, help_text='Remediation plan')
    assigned_to = models.CharField(max_length=200, blank=True, help_text='Assigned to (user/team)')
    due_date = models.DateTimeField(null=True, blank=True, help_text='Remediation due date')
    resolved_at = models.DateTimeField(null=True, blank=True, help_text='Resolution date')
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'compliance_audit_findings'
        ordering = ['-severity', '-created_at']
        indexes = [
            models.Index(fields=['audit', 'severity']),
            models.Index(fields=['audit', 'status']),
            models.Index(fields=['control_id']),
        ]
    
    def __str__(self):
        return f"{self.finding_id}: {self.title}"


class ComplianceAuditAuditor(models.Model):
    """
    Auditors assigned to audits
    """
    ROLE_CHOICES = [
        ('lead_auditor', 'Lead Auditor'),
        ('auditor', 'Auditor'),
        ('reviewer', 'Reviewer'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    audit = models.ForeignKey(
        ComplianceAudit,
        on_delete=models.CASCADE,
        related_name='auditors',
        help_text='Audit this auditor is assigned to'
    )
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='audit_assignments',
        help_text='User if internal auditor'
    )
    name = models.CharField(max_length=200, help_text='Auditor name')
    email = models.EmailField(help_text='Auditor email')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, help_text='Auditor role')
    organization = models.CharField(max_length=200, blank=True, help_text='Auditor organization')
    
    access_granted_at = models.DateTimeField(null=True, blank=True, help_text='When access was granted')
    last_access_at = models.DateTimeField(null=True, blank=True, help_text='Last access timestamp')
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'compliance_audit_auditors'
        unique_together = [['audit', 'email']]
        indexes = [
            models.Index(fields=['audit', 'role']),
            models.Index(fields=['user']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.role}) - {self.audit.audit_id}"


class ComplianceAuditFrameworkMapping(models.Model):
    """
    Maps audits to frameworks (many-to-many relationship)
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    audit = models.ForeignKey(
        ComplianceAudit,
        on_delete=models.CASCADE,
        related_name='framework_mappings',
        help_text='Audit being mapped'
    )
    framework_id = models.UUIDField(help_text='Framework ID (references compliance_frameworks)')
    framework_name = models.CharField(max_length=200, help_text='Framework name for display')
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'compliance_audit_framework_mappings'
        unique_together = [['audit', 'framework_id']]
        indexes = [
            models.Index(fields=['framework_id']),
            models.Index(fields=['audit', 'framework_id']),
        ]
    
    def __str__(self):
        return f"{self.audit.audit_id} -> {self.framework_name}"
