"""
Compliance Controls Models
"""
from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid


class ComplianceControl(models.Model):
    """
    Represents a compliance control that can map to multiple frameworks
    """
    STATUS_CHOICES = [
        ('pass', 'Pass'),
        ('fail', 'Fail'),
        ('partial', 'Partial'),
        ('not_evaluated', 'Not Evaluated'),
    ]
    
    SEVERITY_CHOICES = [
        ('critical', 'Critical'),
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
    ]
    
    CONTROL_TYPE_CHOICES = [
        ('preventive', 'Preventive'),
        ('detective', 'Detective'),
        ('corrective', 'Corrective'),
    ]
    
    EVALUATION_METHOD_CHOICES = [
        ('automated', 'Automated'),
        ('manual', 'Manual'),
        ('hybrid', 'Hybrid'),
    ]
    
    FREQUENCY_CHOICES = [
        ('continuous', 'Continuous'),
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('annually', 'Annually'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    control_id = models.CharField(max_length=100, unique=True, help_text='Control ID (e.g., SOC2-CC6.1)')
    name = models.CharField(max_length=300, help_text='Control name')
    description = models.TextField(help_text='Control description')
    
    # Framework mapping (many-to-many via junction table)
    # Will be handled via ComplianceControlFrameworkMapping
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_evaluated', help_text='Control status')
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default='medium', help_text='Control severity')
    
    # Evaluation
    last_evaluated = models.DateTimeField(null=True, blank=True, help_text='Last evaluation date')
    evaluated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='evaluated_controls')
    evaluation_method = models.CharField(max_length=20, choices=EVALUATION_METHOD_CHOICES, default='automated', help_text='Evaluation method')
    
    # Failure details
    failure_reason = models.TextField(blank=True, help_text='Reason for failure if status is fail')
    failing_assets = ArrayField(models.CharField(max_length=200), default=list, blank=True, help_text='List of failing asset IDs or names')
    failing_count = models.IntegerField(default=0, help_text='Number of assets failing this control')
    
    # Metrics
    uptime_percentage = models.FloatField(
        null=True, blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text='Control uptime percentage over time period'
    )
    time_out_of_compliance = models.IntegerField(
        null=True, blank=True,
        help_text='Time out of compliance in minutes'
    )
    
    # Recommendations
    fix_recommendations = ArrayField(models.TextField(), default=list, blank=True, help_text='List of fix recommendations')
    related_control_ids = ArrayField(models.UUIDField(), default=list, blank=True, help_text='Related control IDs')
    
    # Metadata
    category = models.CharField(max_length=100, blank=True, help_text='Control category')
    control_type = models.CharField(max_length=20, choices=CONTROL_TYPE_CHOICES, default='preventive', help_text='Type of control')
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES, default='continuous', help_text='Evaluation frequency')
    
    # Organization/Tenant
    organization_id = models.UUIDField(null=True, blank=True, help_text='Organization/tenant ID')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_controls')
    
    class Meta:
        db_table = 'compliance_controls'
        ordering = ['control_id']
        verbose_name = 'Compliance Control'
        verbose_name_plural = 'Compliance Controls'
        indexes = [
            models.Index(fields=['control_id']),
            models.Index(fields=['status', 'severity']),
            models.Index(fields=['evaluation_method']),
            models.Index(fields=['organization_id']),
        ]
    
    def __str__(self):
        return f"{self.control_id}: {self.name}"


class ComplianceControlFrameworkMapping(models.Model):
    """
    Maps controls to frameworks (many-to-many relationship)
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    control = models.ForeignKey(
        ComplianceControl,
        on_delete=models.CASCADE,
        related_name='framework_mappings',
        help_text='Control being mapped'
    )
    framework_id = models.UUIDField(help_text='Framework ID (references compliance_frameworks)')
    framework_name = models.CharField(max_length=200, help_text='Framework name for display')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'compliance_control_framework_mappings'
        unique_together = [['control', 'framework_id']]
        indexes = [
            models.Index(fields=['framework_id']),
            models.Index(fields=['control', 'framework_id']),
        ]
    
    def __str__(self):
        return f"{self.control.control_id} -> {self.framework_name}"


class ControlEvidenceRequirement(models.Model):
    """
    Defines what evidence is REQUIRED for each control (drives automation)
    """
    EVIDENCE_TYPE_CHOICES = [
        ('tls_scan', 'TLS Scan'),
        ('dast', 'DAST'),
        ('security_scan', 'Security Scan'),
        ('config_scan', 'Config Scan'),
        ('ai_monitor', 'AI Monitor'),
        ('system_log', 'System Log'),
        ('manual_upload', 'Manual Upload'),
        ('policy_document', 'Policy Document'),
        ('attestation', 'Attestation'),
    ]
    
    EVIDENCE_CATEGORY_CHOICES = [
        ('security_scan', 'Security Scan'),
        ('tls_config', 'TLS Configuration'),
        ('cloud_config', 'Cloud Configuration'),
        ('access_log', 'Access Log'),
        ('system_log', 'System Log'),
        ('attestation', 'Attestation'),
        ('screenshot', 'Screenshot'),
        ('document', 'Document Upload'),  # For uploaded documents that serve as evidence (not policy docs themselves)
    ]
    
    COLLECTION_METHOD_CHOICES = [
        ('automated_scan', 'Automated Scan'),
        ('automated_log', 'Automated Log'),
        ('automated_config', 'Automated Config'),
        ('manual_upload', 'Manual Upload'),
        ('manual_attestation', 'Manual Attestation'),
        ('manual_screenshot', 'Manual Screenshot'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    control = models.ForeignKey(
        ComplianceControl,
        on_delete=models.CASCADE,
        related_name='evidence_requirements',
        help_text='Control that requires this evidence'
    )
    evidence_type = models.CharField(
        max_length=50,
        choices=EVIDENCE_TYPE_CHOICES,
        help_text='Type of evidence required (legacy field)'
    )
    source_app = models.CharField(
        max_length=100,
        blank=True,
        help_text='Source application/tool that produces this evidence (e.g., SSLyze, Nuclei)'
    )
    # New fields for better clarity
    evidence_category = models.CharField(
        max_length=30,
        choices=EVIDENCE_CATEGORY_CHOICES,
        blank=True,
        help_text='Category of evidence (security_scan, tls_config, etc.)'
    )
    collection_method = models.CharField(
        max_length=30,
        choices=COLLECTION_METHOD_CHOICES,
        blank=True,
        help_text='How evidence is collected (automated vs manual)'
    )
    freshness_days = models.IntegerField(
        default=30,
        help_text='Maximum age of evidence in days before it expires'
    )
    required = models.BooleanField(
        default=True,
        help_text='Whether this evidence is required (True) or optional (False)'
    )
    description = models.TextField(
        blank=True,
        help_text='Description of what evidence is expected'
    )
    
    # Organization/Tenant (if requirements differ per tenant)
    organization_id = models.UUIDField(null=True, blank=True, help_text='Organization/tenant ID')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'compliance_control_evidence_requirements'
        unique_together = [['control', 'evidence_type', 'source_app']]
        indexes = [
            models.Index(fields=['control']),
            models.Index(fields=['evidence_type']),
            models.Index(fields=['organization_id']),
        ]
        verbose_name = 'Control Evidence Requirement'
        verbose_name_plural = 'Control Evidence Requirements'
    
    def get_evidence_category(self):
        """Get evidence category from DB field, or compute from evidence_type if not set"""
        # Use DB field if it exists and has a value
        if hasattr(self, 'evidence_category') and self.evidence_category:
            return self.evidence_category
        
        # Fallback: compute from evidence_type
        # Note: policy_document is NOT evidence - it's a requirement
        # Manual uploads of documents are evidence, categorized as 'document'
        mapping = {
            'tls_scan': 'tls_config',
            'dast': 'security_scan',
            'security_scan': 'security_scan',
            'config_scan': 'cloud_config',
            'system_log': 'system_log',
            'ai_monitor': 'access_log',
            'manual_upload': 'document',  # Manual uploads are document evidence
            'policy_document': 'document',  # Legacy: treat as document evidence (but policy docs should be in Policies app)
            'attestation': 'attestation',
        }
        return mapping.get(self.evidence_type, 'security_scan')
    
    def get_collection_method(self):
        """Get collection method from DB field, or compute from evidence_type if not set"""
        # Use DB field if it exists and has a value
        if hasattr(self, 'collection_method') and self.collection_method:
            return self.collection_method
        
        # Fallback: compute from evidence_type
        automated_types = ['tls_scan', 'dast', 'security_scan', 'config_scan', 'system_log', 'ai_monitor']
        manual_types = ['manual_upload', 'policy_document', 'attestation']
        
        if self.evidence_type in automated_types:
            if self.evidence_type in ['system_log', 'ai_monitor']:
                return 'automated_log'
            elif self.evidence_type in ['config_scan']:
                return 'automated_config'
            else:
                return 'automated_scan'
        elif self.evidence_type in manual_types:
            if self.evidence_type == 'attestation':
                return 'manual_attestation'
            else:
                return 'manual_upload'
        
        return 'manual_upload'  # Default
    
    def get_evidence_category_display(self):
        """Get evidence category display name"""
        category = self.get_evidence_category()
        choices_dict = dict([(choice[0], choice[1]) for choice in self.EVIDENCE_CATEGORY_CHOICES])
        return choices_dict.get(category, category.replace('_', ' ').title())
    
    def get_collection_method_display(self):
        """Get collection method display name"""
        method = self.get_collection_method()
        choices_dict = dict([(choice[0], choice[1]) for choice in self.COLLECTION_METHOD_CHOICES])
        return choices_dict.get(method, method.replace('_', ' ').title())
    
    def __str__(self):
        return f"{self.control.control_id} requires {self.get_evidence_type_display()}"
