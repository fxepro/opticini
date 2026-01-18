"""
Compliance Frameworks Models
"""
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid


class ComplianceFramework(models.Model):
    """
    Represents a compliance framework (SOC 2, ISO 27001, GDPR, etc.)
    """
    CATEGORY_CHOICES = [
        ('security', 'Security'),
        ('privacy', 'Privacy'),
        ('industry', 'Industry'),
        ('regional', 'Regional'),
    ]
    
    STATUS_CHOICES = [
        ('ready', 'Ready'),
        ('in_progress', 'In Progress'),
        ('at_risk', 'At Risk'),
        ('not_started', 'Not Started'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200, help_text='Framework name (e.g., SOC 2 Type I)')
    code = models.CharField(max_length=50, unique=True, help_text='Framework code (e.g., SOC2-T1)')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, help_text='Framework category')
    description = models.TextField(blank=True, help_text='Framework description')
    icon = models.CharField(max_length=50, blank=True, help_text='Lucide icon name')
    
    # Status
    enabled = models.BooleanField(default=True, help_text='Whether framework is enabled for this organization')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started', help_text='Readiness status')
    
    # Metrics (calculated fields, updated via signals or tasks)
    compliance_score = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text='Compliance score (0-100)'
    )
    total_controls = models.IntegerField(default=0, help_text='Total number of controls in this framework')
    passing_controls = models.IntegerField(default=0, help_text='Number of passing controls')
    failing_controls = models.IntegerField(default=0, help_text='Number of failing controls')
    not_evaluated_controls = models.IntegerField(default=0, help_text='Number of controls not yet evaluated')
    
    # Metadata
    last_evaluated = models.DateTimeField(null=True, blank=True, help_text='Last evaluation date')
    next_audit_date = models.DateTimeField(null=True, blank=True, help_text='Next scheduled audit date')
    
    # Organization/Tenant (if multi-tenant)
    organization_id = models.UUIDField(null=True, blank=True, help_text='Organization/tenant ID')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_frameworks')
    
    class Meta:
        db_table = 'compliance_frameworks'
        ordering = ['name']
        verbose_name = 'Compliance Framework'
        verbose_name_plural = 'Compliance Frameworks'
        indexes = [
            models.Index(fields=['code']),
            models.Index(fields=['category', 'status']),
            models.Index(fields=['enabled', 'status']),
            models.Index(fields=['organization_id']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.code})"
