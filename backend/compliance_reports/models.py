"""
Compliance Reports Models
"""
from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField
import uuid


class ComplianceReport(models.Model):
    """
    Represents a compliance report
    """
    TYPE_CHOICES = [
        ('readiness', 'Readiness'),
        ('gap_analysis', 'Gap Analysis'),
        ('continuous_monitoring', 'Continuous Monitoring'),
        ('executive_summary', 'Executive Summary'),
        ('technical_report', 'Technical Report'),
        ('auditor_report', 'Auditor Report'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('generating', 'Generating'),
        ('ready', 'Ready'),
        ('failed', 'Failed'),
    ]
    
    FORMAT_CHOICES = [
        ('pdf', 'PDF'),
        ('docx', 'DOCX'),
        ('html', 'HTML'),
        ('zip', 'ZIP'),
        ('readonly_link', 'Read-only Link'),
    ]
    
    VIEW_CHOICES = [
        ('executive', 'Executive'),
        ('technical', 'Technical'),
        ('auditor', 'Auditor'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    report_id = models.CharField(max_length=100, unique=True, help_text='Report ID (e.g., RPT-001, SOC2-READINESS-2024-Q1)')
    name = models.CharField(max_length=300, help_text='Report name')
    description = models.TextField(blank=True, help_text='Report description')
    
    # Type & Framework
    type = models.CharField(max_length=30, choices=TYPE_CHOICES, help_text='Report type')
    # Framework mapping via ComplianceReportFrameworkMapping
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', help_text='Report status')
    
    # Content & Scope
    view = models.CharField(max_length=20, choices=VIEW_CHOICES, help_text='Report view type')
    date_range_start = models.DateTimeField(null=True, blank=True, help_text='Report date range start')
    date_range_end = models.DateTimeField(null=True, blank=True, help_text='Report date range end')
    includes_evidence = models.BooleanField(default=False, help_text='Whether report includes evidence')
    evidence_count = models.IntegerField(null=True, blank=True, help_text='Number of evidence items included')
    includes_controls = models.BooleanField(default=False, help_text='Whether report includes controls')
    control_count = models.IntegerField(null=True, blank=True, help_text='Number of controls included')
    includes_policies = models.BooleanField(default=False, help_text='Whether report includes policies')
    policy_count = models.IntegerField(null=True, blank=True, help_text='Number of policies included')
    
    # Generation
    template_id = models.CharField(max_length=100, blank=True, help_text='Template ID used')
    template_name = models.CharField(max_length=200, blank=True, help_text='Template name')
    generated_at = models.DateTimeField(null=True, blank=True, help_text='Generation date')
    generated_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='generated_reports',
        help_text='User who generated this report'
    )
    
    # File Information
    file_format = models.CharField(max_length=20, choices=FORMAT_CHOICES, default='pdf', help_text='Report file format')
    file_size = models.BigIntegerField(null=True, blank=True, help_text='File size in bytes')
    file_url = models.URLField(max_length=500, blank=True, help_text='URL to report file')
    download_url = models.URLField(max_length=500, blank=True, help_text='Download URL')
    
    # Summary stats (stored as JSON)
    summary = models.JSONField(default=dict, blank=True, help_text='Report summary statistics')
    
    # Error handling
    error_message = models.TextField(blank=True, help_text='Error message if generation failed')
    retry_count = models.IntegerField(default=0, help_text='Number of retry attempts')
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_reports')
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='updated_reports')
    
    # Organization/Tenant
    organization_id = models.UUIDField(null=True, blank=True, help_text='Organization/tenant ID')
    
    class Meta:
        db_table = 'compliance_reports'
        ordering = ['-created_at']
        verbose_name = 'Compliance Report'
        verbose_name_plural = 'Compliance Reports'
        indexes = [
            models.Index(fields=['report_id']),
            models.Index(fields=['type', 'status']),
            models.Index(fields=['status']),
            models.Index(fields=['generated_at']),
            models.Index(fields=['organization_id']),
        ]
    
    def __str__(self):
        return f"{self.report_id}: {self.name}"


class ComplianceReportShare(models.Model):
    """
    Report sharing links
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    report = models.ForeignKey(
        ComplianceReport,
        on_delete=models.CASCADE,
        related_name='shares',
        help_text='Report being shared'
    )
    link = models.URLField(max_length=500, unique=True, help_text='Share link URL')
    expires_at = models.DateTimeField(null=True, blank=True, help_text='Link expiration date')
    password_protected = models.BooleanField(default=False, help_text='Whether link is password protected')
    password_hash = models.CharField(max_length=255, blank=True, help_text='Hashed password if protected')
    access_count = models.IntegerField(default=0, help_text='Number of times link was accessed')
    
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_report_shares')
    
    class Meta:
        db_table = 'compliance_report_shares'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['report']),
            models.Index(fields=['link']),
            models.Index(fields=['expires_at']),
        ]
    
    def __str__(self):
        return f"Share for {self.report.report_id}"


class ComplianceReportFrameworkMapping(models.Model):
    """
    Maps reports to frameworks (many-to-many relationship)
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    report = models.ForeignKey(
        ComplianceReport,
        on_delete=models.CASCADE,
        related_name='framework_mappings',
        help_text='Report being mapped'
    )
    framework_id = models.UUIDField(help_text='Framework ID (references compliance_frameworks)')
    framework_name = models.CharField(max_length=200, help_text='Framework name for display')
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'compliance_report_framework_mappings'
        unique_together = [['report', 'framework_id']]
        indexes = [
            models.Index(fields=['framework_id']),
            models.Index(fields=['report', 'framework_id']),
        ]
    
    def __str__(self):
        return f"{self.report.report_id} -> {self.framework_name}"
