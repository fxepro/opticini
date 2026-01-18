from django.contrib import admin
from .models import ComplianceEvidence, ComplianceEvidenceControlMapping


@admin.register(ComplianceEvidence)
class ComplianceEvidenceAdmin(admin.ModelAdmin):
    list_display = ('evidence_id', 'name', 'source', 'source_type', 'status', 'expires_at', 'organization_id', 'created_at')
    list_filter = ('source', 'source_type', 'status', 'organization_id', 'audit_locked')
    search_fields = ('evidence_id', 'name', 'description', 'source_name')
    readonly_fields = ('id', 'created_at')
    fieldsets = (
        ('Basic Information', {
            'fields': ('evidence_id', 'name', 'description', 'category', 'tags')
        }),
        ('Source', {
            'fields': ('source', 'source_type', 'source_name')
        }),
        ('Status', {
            'fields': ('status', 'validity_period', 'expires_at')
        }),
        ('File/Content', {
            'fields': ('file_type', 'file_size', 'file_url', 'preview_url', 'content')
        }),
        ('Audit', {
            'fields': ('audit_locked', 'audit_id')
        }),
        ('Organization', {
            'fields': ('organization_id', 'created_by', 'uploaded_by', 'created_at')
        }),
    )


@admin.register(ComplianceEvidenceControlMapping)
class ComplianceEvidenceControlMappingAdmin(admin.ModelAdmin):
    list_display = ('evidence', 'control_name', 'control_id', 'framework_name', 'framework_id', 'created_at')
    list_filter = ('framework_name', 'created_at')
    search_fields = ('evidence__evidence_id', 'evidence__name', 'control_name', 'framework_name')
    readonly_fields = ('id', 'created_at')
