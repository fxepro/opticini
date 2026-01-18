"""
Compliance Policies Models
"""
from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField
import uuid


class CompliancePolicy(models.Model):
    """
    Represents a compliance policy
    """
    TYPE_CHOICES = [
        ('security', 'Security'),
        ('data_retention', 'Data Retention'),
        ('incident_response', 'Incident Response'),
        ('ai_governance', 'AI Governance'),
        ('vendor_risk', 'Vendor Risk'),
        ('custom', 'Custom'),
    ]
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('needs_review', 'Needs Review'),
        ('archived', 'Archived'),
    ]
    
    APPROVAL_STATUS_CHOICES = [
        ('approved', 'Approved'),
        ('pending', 'Pending'),
        ('rejected', 'Rejected'),
    ]
    
    GENERATION_METHOD_CHOICES = [
        ('auto_generated', 'Auto Generated'),
        ('manual', 'Manual'),
        ('template_based', 'Template Based'),
    ]
    
    SYNC_STATUS_CHOICES = [
        ('in_sync', 'In Sync'),
        ('out_of_sync', 'Out of Sync'),
        ('unknown', 'Unknown'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    policy_id = models.CharField(max_length=100, unique=True, help_text='Policy ID (e.g., POL-001, SEC-001)')
    name = models.CharField(max_length=300, help_text='Policy name')
    description = models.TextField(blank=True, help_text='Policy description')
    
    # Type & Category
    type = models.CharField(max_length=30, choices=TYPE_CHOICES, help_text='Policy type')
    category = models.CharField(max_length=100, blank=True, help_text='Custom category if type is custom')
    
    # Framework mapping (many-to-many via junction table)
    # Will be handled via CompliancePolicyFrameworkMapping
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft', help_text='Policy status')
    approval_status = models.CharField(max_length=20, choices=APPROVAL_STATUS_CHOICES, default='pending', help_text='Approval status')
    
    # Versioning
    version = models.CharField(max_length=20, default='1.0', help_text='Current version (e.g., 1.0, 2.3)')
    current_version_id = models.UUIDField(null=True, blank=True, help_text='Current version ID')
    
    # Ownership
    owner = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='owned_policies',
        help_text='Policy owner'
    )
    co_owners = models.ManyToManyField(User, blank=True, related_name='co_owned_policies', help_text='Co-owners')
    
    # Generation
    generation_method = models.CharField(max_length=20, choices=GENERATION_METHOD_CHOICES, default='manual', help_text='Generation method')
    generated_from = models.JSONField(default=dict, blank=True, help_text='What this policy was generated from (configs, evidence, controls, etc.)')
    last_generated = models.DateTimeField(null=True, blank=True, help_text='Last generation date')
    generated_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='generated_policies',
        help_text='User or system that generated this policy'
    )
    
    # Sync Status
    sync_status = models.CharField(max_length=20, choices=SYNC_STATUS_CHOICES, default='unknown', help_text='Sync status with reality')
    last_sync_check = models.DateTimeField(null=True, blank=True, help_text='Last sync check date')
    sync_issues = ArrayField(models.TextField(), default=list, blank=True, help_text='List of sync issues/mismatches')
    
    # Content
    content = models.TextField(help_text='Full policy text content')
    summary = models.TextField(blank=True, help_text='Executive summary')
    sections = models.JSONField(default=list, blank=True, help_text='Policy sections (structured content)')
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_policies')
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='updated_policies')
    approved_at = models.DateTimeField(null=True, blank=True, help_text='Approval date')
    approved_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='approved_policies',
        help_text='User who approved this policy'
    )
    effective_date = models.DateTimeField(null=True, blank=True, help_text='Effective date')
    review_date = models.DateTimeField(null=True, blank=True, help_text='Next scheduled review date')
    
    # Evidence & Controls (many-to-many via junction tables)
    evidence_ids = ArrayField(models.UUIDField(), default=list, blank=True, help_text='Related evidence IDs')
    control_ids = ArrayField(models.UUIDField(), default=list, blank=True, help_text='Related control IDs')
    
    # Export
    export_formats = ArrayField(models.CharField(max_length=20), default=list, blank=True, help_text='Available export formats')
    
    # Tags
    tags = ArrayField(models.CharField(max_length=100), default=list, blank=True, help_text='Policy tags')
    
    # Organization/Tenant
    organization_id = models.UUIDField(null=True, blank=True, help_text='Organization/tenant ID')
    
    class Meta:
        db_table = 'compliance_policies'
        ordering = ['policy_id']
        verbose_name = 'Compliance Policy'
        verbose_name_plural = 'Compliance Policies'
        indexes = [
            models.Index(fields=['policy_id']),
            models.Index(fields=['type', 'status']),
            models.Index(fields=['sync_status']),
            models.Index(fields=['approval_status']),
            models.Index(fields=['organization_id']),
        ]
    
    def __str__(self):
        return f"{self.policy_id}: {self.name}"


class CompliancePolicyVersion(models.Model):
    """
    Policy version history
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    policy = models.ForeignKey(
        CompliancePolicy,
        on_delete=models.CASCADE,
        related_name='versions',
        help_text='Policy this version belongs to'
    )
    version = models.CharField(max_length=20, help_text='Version number (e.g., 1.0, 2.3)')
    content = models.TextField(help_text='Policy content for this version')
    summary = models.TextField(blank=True, help_text='Version summary')
    changes = models.TextField(blank=True, help_text='Changelog for this version')
    
    is_current = models.BooleanField(default=False, help_text='Whether this is the current version')
    
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_policy_versions')
    approved_at = models.DateTimeField(null=True, blank=True, help_text='Approval date')
    approved_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='approved_policy_versions',
        help_text='User who approved this version'
    )
    
    class Meta:
        db_table = 'compliance_policy_versions'
        ordering = ['-created_at']
        unique_together = [['policy', 'version']]
        indexes = [
            models.Index(fields=['policy', 'is_current']),
            models.Index(fields=['policy', 'version']),
        ]
    
    def __str__(self):
        return f"{self.policy.policy_id} v{self.version}"


class CompliancePolicyAttestation(models.Model):
    """
    Policy attestations (user acknowledgments)
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    policy = models.ForeignKey(
        CompliancePolicy,
        on_delete=models.CASCADE,
        related_name='attestations',
        help_text='Policy being attested'
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='policy_attestations', help_text='User who attested')
    role = models.CharField(max_length=50, blank=True, help_text='User role at time of attestation')
    acknowledged = models.BooleanField(default=True, help_text='Whether user acknowledged the policy')
    comments = models.TextField(blank=True, help_text='User comments')
    
    attested_at = models.DateTimeField(auto_now_add=True, help_text='Attestation date')
    
    class Meta:
        db_table = 'compliance_policy_attestations'
        unique_together = [['policy', 'user']]
        ordering = ['-attested_at']
        indexes = [
            models.Index(fields=['policy', 'user']),
            models.Index(fields=['attested_at']),
        ]
    
    def __str__(self):
        return f"{self.policy.policy_id} - {self.user.username}"


class CompliancePolicyFrameworkMapping(models.Model):
    """
    Maps policies to frameworks (many-to-many relationship)
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    policy = models.ForeignKey(
        CompliancePolicy,
        on_delete=models.CASCADE,
        related_name='framework_mappings',
        help_text='Policy being mapped'
    )
    framework_id = models.UUIDField(help_text='Framework ID (references compliance_frameworks)')
    framework_name = models.CharField(max_length=200, help_text='Framework name for display')
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'compliance_policy_framework_mappings'
        unique_together = [['policy', 'framework_id']]
        indexes = [
            models.Index(fields=['framework_id']),
            models.Index(fields=['policy', 'framework_id']),
        ]
    
    def __str__(self):
        return f"{self.policy.policy_id} -> {self.framework_name}"
