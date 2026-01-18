from django.contrib import admin
from .models import ComplianceControl, ComplianceControlFrameworkMapping, ControlEvidenceRequirement


@admin.register(ComplianceControl)
class ComplianceControlAdmin(admin.ModelAdmin):
    list_display = ('control_id', 'name', 'status', 'severity', 'evaluation_method', 'organization_id', 'created_at')
    list_filter = ('status', 'severity', 'evaluation_method', 'control_type', 'organization_id')
    search_fields = ('control_id', 'name', 'description')
    readonly_fields = ('id', 'created_at', 'updated_at')
    fieldsets = (
        ('Basic Information', {
            'fields': ('control_id', 'name', 'description', 'category', 'control_type')
        }),
        ('Status', {
            'fields': ('status', 'severity', 'last_evaluated', 'evaluated_by', 'evaluation_method')
        }),
        ('Metrics', {
            'fields': ('uptime_percentage', 'time_out_of_compliance', 'failing_count', 'failing_assets')
        }),
        ('Metadata', {
            'fields': ('frequency', 'failure_reason', 'fix_recommendations', 'related_control_ids')
        }),
        ('Organization', {
            'fields': ('organization_id', 'created_by', 'created_at', 'updated_at')
        }),
    )


@admin.register(ComplianceControlFrameworkMapping)
class ComplianceControlFrameworkMappingAdmin(admin.ModelAdmin):
    list_display = ('control', 'framework_name', 'framework_id', 'created_at')
    list_filter = ('framework_name', 'created_at')
    search_fields = ('control__control_id', 'control__name', 'framework_name')
    readonly_fields = ('id', 'created_at')


@admin.register(ControlEvidenceRequirement)
class ControlEvidenceRequirementAdmin(admin.ModelAdmin):
    list_display = ('control', 'evidence_type', 'source_app', 'freshness_days', 'required', 'organization_id')
    list_filter = ('evidence_type', 'required', 'organization_id')
    search_fields = ('control__control_id', 'control__name', 'source_app', 'description')
    readonly_fields = ('id', 'created_at', 'updated_at')
