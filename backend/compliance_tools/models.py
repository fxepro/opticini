"""
Compliance Tools Models
"""
from django.db import models
from django.contrib.auth.models import User
import uuid


class ComplianceTool(models.Model):
    """
    Compliance tools configuration and management
    """
    TOOL_TYPES = [
        ('api', 'API Service'),
        ('library', 'Library'),
        ('external', 'External Tool'),
    ]
    
    STATUS_CHOICES = [
        ('configured', 'Configured'),
        ('not_configured', 'Not Configured'),
        ('error', 'Error'),
    ]
    
    SUB_CATEGORY_CHOICES = [
        ('frameworks', 'Frameworks'),
        ('automated-evidence', 'Automated Evidence'),
        ('manual-evidence', 'Manual Evidence'),
        ('policy-enforcement', 'Policy Enforcement'),
        ('audit-management', 'Audit Management'),
        ('reporting', 'Reporting'),
        ('continuous-compliance', 'Continuous Compliance'),
        ('ai-privacy', 'AI & Privacy'),
    ]
    
    # Primary Key
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Basic Information
    name = models.CharField(max_length=100, unique=True, help_text='Tool name (e.g., OSCAL (NIST), OWASP ZAP)')
    tool_type = models.CharField(max_length=20, choices=TOOL_TYPES, help_text='Type of tool')
    sub_category = models.CharField(max_length=50, choices=SUB_CATEGORY_CHOICES, help_text='Compliance tool sub-category')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_configured', help_text='Configuration status')
    description = models.TextField(help_text='Tool description and purpose')
    
    # Service Details
    service = models.CharField(max_length=200, help_text='Service/Implementation name')
    endpoint = models.URLField(blank=True, help_text='API endpoint URL (if API service)')
    
    # Configuration
    api_key = models.CharField(max_length=500, blank=True, help_text='API key (if API service)')
    api_key_name = models.CharField(max_length=100, blank=True, help_text='Environment variable name for API key')
    configuration = models.JSONField(default=dict, help_text='Additional configuration')
    
    # Metadata
    license = models.CharField(max_length=50, blank=True, help_text='License type (Apache 2.0, MIT, etc.)')
    evidence_produced = models.CharField(max_length=200, blank=True, help_text='Type of evidence this tool produces')
    repo_url = models.URLField(blank=True, help_text='Repository URL for the tool')
    documentation_url = models.URLField(blank=True, help_text='Link to tool documentation')
    
    # Installation/Setup
    installation_instructions = models.TextField(blank=True, help_text='How to install/configure this tool')
    executable_path = models.CharField(max_length=500, blank=True, help_text='Path to executable (if external)')
    command_template = models.CharField(max_length=500, blank=True, help_text='Command template for execution')
    
    # Status Tracking
    is_active = models.BooleanField(default=False, help_text='Is this tool active and ready to use?')
    last_tested = models.DateTimeField(null=True, blank=True, help_text='Last time tool was tested')
    test_result = models.TextField(blank=True, help_text='Result of last test')
    
    # Organization & User
    organization_id = models.UUIDField(null=True, blank=True, help_text='Organization ID for multi-tenancy')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='compliance_tools')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'compliance_tools'
        ordering = ['sub_category', 'name']
        verbose_name = 'Compliance Tool'
        verbose_name_plural = 'Compliance Tools'
        indexes = [
            models.Index(fields=['sub_category', 'status']),
            models.Index(fields=['tool_type', 'is_active']),
            models.Index(fields=['organization_id']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.get_sub_category_display()})"
