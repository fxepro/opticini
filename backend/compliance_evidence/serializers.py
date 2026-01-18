"""
Serializers for Compliance Evidence
"""
from rest_framework import serializers
from .models import ComplianceEvidence, ComplianceEvidenceControlMapping


class ControlMappingSerializer(serializers.ModelSerializer):
    """Serializer for control mapping (nested in evidence)"""
    class Meta:
        model = ComplianceEvidenceControlMapping
        fields = [
            'id',
            'control_id',
            'control_name',
            'framework_id',
            'framework_name',
            'created_at'
        ]


class ComplianceEvidenceSerializer(serializers.ModelSerializer):
    """Serializer for ComplianceEvidence with nested relationships"""
    control_mappings = ControlMappingSerializer(many=True, read_only=True)
    controls = serializers.SerializerMethodField()
    created_by_username = serializers.CharField(source='created_by.username', read_only=True, allow_null=True)
    uploaded_by_username = serializers.CharField(source='uploaded_by.username', read_only=True, allow_null=True)
    source_display = serializers.CharField(source='get_source_display', read_only=True)
    source_type_display = serializers.CharField(source='get_source_type_display', read_only=True)
    
    class Meta:
        model = ComplianceEvidence
        fields = [
            'id',
            'evidence_id',
            'name',
            'description',
            'source',
            'source_display',
            'source_type',
            'source_type_display',
            'source_name',
            'status',
            'validity_period',
            'expires_at',
            'file_type',
            'file_size',
            'file_url',
            'preview_url',
            'content',
            'tags',
            'category',
            'audit_locked',
            'audit_id',
            'organization_id',
            'created_at',
            'created_by',
            'created_by_username',
            'uploaded_by',
            'uploaded_by_username',
            'control_mappings',
            'controls',  # Computed field
        ]
        read_only_fields = [
            'id',
            'created_at',
            'control_mappings',
            'controls',
        ]
    
    def get_controls(self, obj):
        """Get list of controls this evidence satisfies"""
        return [
            {
                'id': str(mapping.control_id),
                'name': mapping.control_name,
                'framework_id': str(mapping.framework_id),
                'framework_name': mapping.framework_name,
            }
            for mapping in obj.control_mappings.all()
        ]


class ComplianceEvidenceListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views"""
    controls = serializers.SerializerMethodField()
    control_count = serializers.SerializerMethodField()
    source_display = serializers.CharField(source='get_source_display', read_only=True)
    
    class Meta:
        model = ComplianceEvidence
        fields = [
            'id',
            'evidence_id',
            'name',
            'source',
            'source_display',
            'source_type',
            'source_name',
            'status',
            'expires_at',
            'file_type',
            'category',
            'created_at',
            'controls',
            'control_count',
        ]
    
    def get_controls(self, obj):
        """Get list of controls linked to this evidence"""
        return [
            {
                'id': str(mapping.control_id),
                'name': mapping.control_name,
                'framework_id': str(mapping.framework_id),
                'framework_name': mapping.framework_name,
            }
            for mapping in obj.control_mappings.all()
        ]
    
    def get_control_count(self, obj):
        """Get count of controls"""
        return obj.control_mappings.count()

