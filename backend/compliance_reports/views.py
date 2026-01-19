"""
API Views for Compliance Reports
"""
import uuid
from django.conf import settings
from django.db.models import Q
from django.utils import timezone
from django.contrib.auth.hashers import make_password
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import (
    ComplianceReport,
    ComplianceReportFrameworkMapping,
    ComplianceReportShare,
)
from .serializers import ComplianceReportSerializer, ComplianceReportCreateSerializer
from compliance_frameworks.models import ComplianceFramework
from users.permission_classes import HasFeaturePermission


def generate_report_id() -> str:
    """
    Generate a unique report_id.
    """
    date_part = timezone.now().strftime("%Y%m%d")
    for _ in range(5):
        suffix = uuid.uuid4().hex[:6].upper()
        report_id = f"RPT-{date_part}-{suffix}"
        if not ComplianceReport.objects.filter(report_id=report_id).exists():
            return report_id
    return f"RPT-{date_part}-{uuid.uuid4().hex[:8].upper()}"


class ComplianceReportViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Compliance Reports.
    """
    queryset = ComplianceReport.objects.all().order_by('-created_at')

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'download', 'share']:
            permission_classes = [IsAuthenticated, HasFeaturePermission('compliance.reports.export')]
        else:
            permission_classes = [IsAuthenticated, HasFeaturePermission('compliance.reports.view')]
        return [permission() for permission in permission_classes]

    def get_serializer_class(self):
        if self.action == 'create':
            return ComplianceReportCreateSerializer
        return ComplianceReportSerializer

    def get_queryset(self):
        queryset = ComplianceReport.objects.all().prefetch_related(
            'framework_mappings',
            'shares',
        ).order_by('-created_at')

        search = (self.request.query_params.get('search') or '').strip()
        if search:
            queryset = queryset.filter(
                Q(report_id__icontains=search) |
                Q(name__icontains=search) |
                Q(description__icontains=search)
            )

        status_filter = (self.request.query_params.get('status') or '').strip()
        if status_filter and status_filter != 'all':
            queryset = queryset.filter(status=status_filter)

        type_filter = (self.request.query_params.get('type') or '').strip()
        if type_filter and type_filter != 'all':
            queryset = queryset.filter(type=type_filter)

        view_filter = (self.request.query_params.get('view') or '').strip()
        if view_filter and view_filter != 'all':
            queryset = queryset.filter(view=view_filter)

        framework_id = (self.request.query_params.get('framework_id') or '').strip()
        if framework_id:
            report_ids = ComplianceReportFrameworkMapping.objects.filter(
                framework_id=framework_id
            ).values_list('report_id', flat=True)
            queryset = queryset.filter(id__in=report_ids)

        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        framework_ids = data.pop('frameworks', [])

        report = ComplianceReport.objects.create(
            report_id=generate_report_id(),
            name=data['name'],
            description=data.get('description', ''),
            type=data['type'],
            view=data['view'],
            status='pending',
            date_range_start=data.get('date_range_start'),
            date_range_end=data.get('date_range_end'),
            includes_evidence=data.get('includes_evidence', False),
            includes_controls=data.get('includes_controls', False),
            includes_policies=data.get('includes_policies', False),
            file_format=data.get('file_format', 'pdf'),
            created_by=request.user,
            updated_by=request.user,
        )

        if framework_ids:
            frameworks = ComplianceFramework.objects.filter(id__in=framework_ids)
            mappings = [
                ComplianceReportFrameworkMapping(
                    report=report,
                    framework_id=framework.id,
                    framework_name=framework.name,
                )
                for framework in frameworks
            ]
            if mappings:
                ComplianceReportFrameworkMapping.objects.bulk_create(mappings)

        response_serializer = ComplianceReportSerializer(report)
        headers = self.get_success_headers(response_serializer.data)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        report = self.get_object()
        url = report.download_url or report.file_url
        if not url:
            return Response({'error': 'Report file not available'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'download_url': url}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def share(self, request, pk=None):
        report = self.get_object()
        password = (request.data.get('password') or '').strip()

        token = uuid.uuid4().hex
        base_url = getattr(settings, 'FRONTEND_URL', '').strip()
        if not base_url:
            base_url = request.build_absolute_uri('/').rstrip('/')
        share_link = f"{base_url}/reports/share/{token}"

        share = ComplianceReportShare.objects.create(
            report=report,
            link=share_link,
            password_protected=bool(password),
            password_hash=make_password(password) if password else '',
            created_by=request.user,
        )

        return Response({
            'id': str(share.id),
            'link': share.link,
            'password_protected': share.password_protected,
        }, status=status.HTTP_201_CREATED)
