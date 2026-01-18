"""
Serializers for Compliance Controls
"""
from rest_framework import serializers
from .models import ComplianceControl, ComplianceControlFrameworkMapping, ControlEvidenceRequirement


class FrameworkMappingSerializer(serializers.ModelSerializer):
    """Serializer for framework mapping (nested in control)"""
    class Meta:
        model = ComplianceControlFrameworkMapping
        fields = ['id', 'framework_id', 'framework_name', 'created_at']


class EvidenceRequirementSerializer(serializers.ModelSerializer):
    """Serializer for evidence requirements (nested in control)"""
    evidence_type_display = serializers.CharField(source='get_evidence_type_display', read_only=True)
    evidence_category_display = serializers.CharField(source='get_evidence_category_display', read_only=True)
    collection_method_display = serializers.CharField(source='get_collection_method_display', read_only=True)
    
    class Meta:
        model = ControlEvidenceRequirement
        fields = [
            'id', 'evidence_type', 'evidence_type_display', 'source_app',
            'evidence_category', 'evidence_category_display',
            'collection_method', 'collection_method_display',
            'freshness_days', 'required', 'description', 'created_at', 'updated_at'
        ]


class ComplianceControlSerializer(serializers.ModelSerializer):
    """Serializer for ComplianceControl with nested relationships"""
    framework_mappings = FrameworkMappingSerializer(many=True, read_only=True)
    evidence_requirements = EvidenceRequirementSerializer(many=True, read_only=True)
    frameworks = serializers.SerializerMethodField()
    evaluated_by_username = serializers.CharField(source='evaluated_by.username', read_only=True, allow_null=True)
    created_by_username = serializers.CharField(source='created_by.username', read_only=True, allow_null=True)
    
    class Meta:
        model = ComplianceControl
        fields = [
            'id',
            'control_id',
            'name',
            'description',
            'status',
            'severity',
            'last_evaluated',
            'evaluated_by',
            'evaluated_by_username',
            'evaluation_method',
            'failure_reason',
            'failing_assets',
            'failing_count',
            'uptime_percentage',
            'time_out_of_compliance',
            'fix_recommendations',
            'related_control_ids',
            'category',
            'control_type',
            'frequency',
            'organization_id',
            'created_at',
            'updated_at',
            'created_by',
            'created_by_username',
            'framework_mappings',
            'evidence_requirements',
            'frameworks',  # Computed field
        ]
        read_only_fields = [
            'id',
            'created_at',
            'updated_at',
            'framework_mappings',
            'evidence_requirements',
            'frameworks',
        ]
    
    def get_frameworks(self, obj):
        """Get list of frameworks this control belongs to"""
        return [
            {
                'id': str(mapping.framework_id),
                'name': mapping.framework_name,
            }
            for mapping in obj.framework_mappings.all()
        ]


class ComplianceControlListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views"""
    frameworks = serializers.SerializerMethodField()
    framework_count = serializers.SerializerMethodField()
    evidence_requirements = EvidenceRequirementSerializer(many=True, read_only=True)
    
    class Meta:
        model = ComplianceControl
        fields = [
            'id',
            'control_id',
            'name',
            'status',
            'severity',
            'category',
            'control_type',
            'evaluation_method',
            'last_evaluated',
            'frameworks',
            'framework_count',
            'evidence_requirements',  # Include evidence requirements
        ]
    
    def get_frameworks(self, obj):
        """Get list of framework names and IDs"""
        return [
            {
                'id': str(mapping.framework_id),
                'name': mapping.framework_name,
            }
            for mapping in obj.framework_mappings.all()
        ]
    
    def get_framework_count(self, obj):
        """Get count of frameworks"""
        return obj.framework_mappings.count()

