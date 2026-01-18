from rest_framework import serializers
from .models import ComplianceTool


class ComplianceToolSerializer(serializers.ModelSerializer):
    """
    Serializer for ComplianceTool model
    """
    sub_category_display = serializers.CharField(source='get_sub_category_display', read_only=True)
    tool_type_display = serializers.CharField(source='get_tool_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = ComplianceTool
        fields = [
            'id',
            'name',
            'tool_type',
            'tool_type_display',
            'sub_category',
            'sub_category_display',
            'status',
            'status_display',
            'description',
            'service',
            'endpoint',
            'api_key',
            'api_key_name',
            'configuration',
            'license',
            'evidence_produced',
            'repo_url',
            'documentation_url',
            'installation_instructions',
            'executable_path',
            'command_template',
            'is_active',
            'last_tested',
            'test_result',
            'organization_id',
            'created_by',
            'created_by_username',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate(self, data):
        """Validate that API key is provided for API service type"""
        if data.get('tool_type') == 'api' and not data.get('api_key') and not data.get('api_key_name'):
            raise serializers.ValidationError({
                'api_key': 'API key or API key name is required for API service type'
            })
        return data

