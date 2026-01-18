"""
Compliance Evidence Models
"""
from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField
import uuid


class ComplianceEvidence(models.Model):
    """
    Represents compliance evidence (automated or manual)
    """
    SOURCE_CHOICES = [
        ('automated', 'Automated'),
        ('manual', 'Manual'),
    ]
    
    SOURCE_TYPE_CHOICES = [
        ('ai_monitor', 'AI Monitor'),
        ('dast', 'DAST'),
        ('security_scan', 'Security Scan'),
        ('tls_scan', 'TLS Scan'),
        ('config_scan', 'Config Scan'),
        ('manual_upload', 'Manual Upload'),
        ('system_log', 'System Log'),
    ]
    
    STATUS_CHOICES = [
        ('fresh', 'Fresh'),
        ('expired', 'Expired'),
        ('expiring_soon', 'Expiring Soon'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    evidence_id = models.CharField(max_length=100, unique=True, help_text='Evidence ID (e.g., EV-001)')
    name = models.CharField(max_length=300, help_text='Evidence name')
    description = models.TextField(blank=True, help_text='Evidence description')
    
    # Source
    source = models.CharField(max_length=20, choices=SOURCE_CHOICES, help_text='Evidence source type')
    source_type = models.CharField(max_length=30, choices=SOURCE_TYPE_CHOICES, help_text='Specific source type')
    source_name = models.CharField(max_length=200, help_text='Source name (e.g., AI Monitor, Attack Surface Scan)')
    
    # Control mapping (many-to-many via junction table)
    # Will be handled via ComplianceEvidenceControlMapping
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='fresh', help_text='Evidence status')
    validity_period = models.IntegerField(null=True, blank=True, help_text='Validity period in days')
    expires_at = models.DateTimeField(null=True, blank=True, help_text='Expiration date')
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_evidence')
    uploaded_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='uploaded_evidence',
        help_text='User who uploaded (for manual evidence)'
    )
    file_type = models.CharField(max_length=50, blank=True, help_text='File type (pdf, png, json, etc.)')
    file_size = models.BigIntegerField(null=True, blank=True, help_text='File size in bytes')
    
    # File/Content
    file_url = models.URLField(max_length=500, blank=True, help_text='URL to evidence file')
    preview_url = models.URLField(max_length=500, blank=True, help_text='URL to preview/thumbnail')
    content = models.TextField(blank=True, help_text='Evidence content (for text-based evidence)')
    
    # Tags/Categories
    tags = ArrayField(models.CharField(max_length=100), default=list, blank=True, help_text='Evidence tags')
    category = models.CharField(max_length=100, blank=True, help_text='Evidence category')
    
    # Audit info
    audit_locked = models.BooleanField(default=False, help_text='Whether evidence is locked for an audit')
    audit_id = models.UUIDField(null=True, blank=True, help_text='Audit ID if locked')
    
    # Organization/Tenant
    organization_id = models.UUIDField(null=True, blank=True, help_text='Organization/tenant ID')
    
    class Meta:
        db_table = 'compliance_evidence'
        ordering = ['-created_at']
        verbose_name = 'Compliance Evidence'
        verbose_name_plural = 'Compliance Evidence'
        indexes = [
            models.Index(fields=['evidence_id']),
            models.Index(fields=['source', 'source_type']),
            models.Index(fields=['status', 'expires_at']),
            models.Index(fields=['audit_locked', 'audit_id']),
            models.Index(fields=['organization_id']),
        ]
    
    def __str__(self):
        return f"{self.evidence_id}: {self.name}"


class ComplianceEvidenceControlMapping(models.Model):
    """
    Maps evidence to controls (many-to-many relationship)
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    evidence = models.ForeignKey(
        ComplianceEvidence,
        on_delete=models.CASCADE,
        related_name='control_mappings',
        help_text='Evidence being mapped'
    )
    control_id = models.UUIDField(help_text='Control ID (references compliance_controls)')
    control_name = models.CharField(max_length=300, help_text='Control name for display')
    framework_id = models.UUIDField(help_text='Framework ID')
    framework_name = models.CharField(max_length=200, help_text='Framework name for display')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'compliance_evidence_control_mappings'
        unique_together = [['evidence', 'control_id']]
        indexes = [
            models.Index(fields=['control_id']),
            models.Index(fields=['framework_id']),
            models.Index(fields=['evidence', 'control_id']),
        ]
    
    def __str__(self):
        return f"{self.evidence.evidence_id} -> {self.control_name}"
