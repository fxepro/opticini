"""
Serializers for Compliance Frameworks
"""
from rest_framework import serializers
from .models import ComplianceFramework
from compliance_controls.models import ComplianceControlFrameworkMapping
from compliance_controls.serializers import ComplianceControlListSerializer


class ComplianceFrameworkSerializer(serializers.ModelSerializer):
    """Serializer for ComplianceFramework model with nested controls"""
    
    last_evaluated = serializers.DateTimeField(format='%Y-%m-%dT%H:%M:%SZ', required=False, allow_null=True)
    next_audit_date = serializers.DateTimeField(format='%Y-%m-%dT%H:%M:%SZ', required=False, allow_null=True)
    controls = serializers.SerializerMethodField()
    
    class Meta:
        model = ComplianceFramework
        fields = [
            'id',
            'name',
            'code',
            'category',
            'description',
            'icon',
            'enabled',
            'status',
            'compliance_score',
            'total_controls',
            'passing_controls',
            'failing_controls',
            'not_evaluated_controls',
            'last_evaluated',
            'next_audit_date',
            'created_at',
            'updated_at',
            'controls',  # Nested controls
        ]
        read_only_fields = [
            'id',
            'created_at',
            'updated_at',
            'compliance_score',
            'total_controls',
            'passing_controls',
            'failing_controls',
            'not_evaluated_controls',
            'controls',
        ]
    
    def get_controls(self, obj):
        """Get all controls for this framework"""
        mappings = ComplianceControlFrameworkMapping.objects.filter(framework_id=obj.id)
        controls = [mapping.control for mapping in mappings]
        return ComplianceControlListSerializer(controls, many=True).data

