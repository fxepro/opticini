"""
Serializers for Compliance Reports
"""
from rest_framework import serializers
from .models import ComplianceReport, ComplianceReportShare


class ComplianceReportShareSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComplianceReportShare
        fields = [
            'id',
            'link',
            'expires_at',
            'password_protected',
            'access_count',
            'created_at',
            'created_by',
        ]


class ComplianceReportSerializer(serializers.ModelSerializer):
    framework_ids = serializers.SerializerMethodField()
    framework_names = serializers.SerializerMethodField()
    shares = ComplianceReportShareSerializer(many=True, read_only=True)
    share_count = serializers.SerializerMethodField()
    is_public = serializers.SerializerMethodField()

    class Meta:
        model = ComplianceReport
        fields = [
            'id',
            'report_id',
            'name',
            'description',
            'type',
            'status',
            'view',
            'date_range_start',
            'date_range_end',
            'includes_evidence',
            'evidence_count',
            'includes_controls',
            'control_count',
            'includes_policies',
            'policy_count',
            'template_id',
            'template_name',
            'generated_at',
            'generated_by',
            'file_format',
            'file_size',
            'file_url',
            'download_url',
            'summary',
            'error_message',
            'retry_count',
            'created_at',
            'created_by',
            'updated_at',
            'updated_by',
            'organization_id',
            'framework_ids',
            'framework_names',
            'shares',
            'share_count',
            'is_public',
        ]

    def get_framework_ids(self, obj):
        return [str(mapping.framework_id) for mapping in obj.framework_mappings.all()]

    def get_framework_names(self, obj):
        return [mapping.framework_name for mapping in obj.framework_mappings.all()]

    def get_share_count(self, obj):
        return obj.shares.count()

    def get_is_public(self, obj):
        return False


class ComplianceReportCreateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=300)
    description = serializers.CharField(required=False, allow_blank=True)
    type = serializers.ChoiceField(choices=ComplianceReport.TYPE_CHOICES)
    view = serializers.ChoiceField(choices=ComplianceReport.VIEW_CHOICES)
    file_format = serializers.ChoiceField(choices=ComplianceReport.FORMAT_CHOICES, required=False)
    includes_evidence = serializers.BooleanField(required=False)
    includes_controls = serializers.BooleanField(required=False)
    includes_policies = serializers.BooleanField(required=False)
    date_range_start = serializers.DateTimeField(required=False)
    date_range_end = serializers.DateTimeField(required=False)
    frameworks = serializers.ListField(
        child=serializers.UUIDField(),
        required=False,
    )
