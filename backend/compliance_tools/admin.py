from django.contrib import admin
from .models import ComplianceTool


@admin.register(ComplianceTool)
class ComplianceToolAdmin(admin.ModelAdmin):
    list_display = ('name', 'tool_type', 'sub_category', 'status', 'is_active', 'organization_id', 'created_at')
    list_filter = ('tool_type', 'sub_category', 'status', 'is_active', 'created_at')
    search_fields = ('name', 'description', 'service')
    readonly_fields = ('id', 'created_at', 'updated_at')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'tool_type', 'sub_category', 'status', 'description')
        }),
        ('Service Details', {
            'fields': ('service', 'endpoint')
        }),
        ('Configuration', {
            'fields': ('api_key', 'api_key_name', 'configuration')
        }),
        ('Metadata', {
            'fields': ('license', 'evidence_produced', 'repo_url', 'documentation_url')
        }),
        ('Installation/Setup', {
            'fields': ('installation_instructions', 'executable_path', 'command_template')
        }),
        ('Status Tracking', {
            'fields': ('is_active', 'last_tested', 'test_result')
        }),
        ('Organization & User', {
            'fields': ('organization_id', 'created_by')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'id')
        }),
    )
