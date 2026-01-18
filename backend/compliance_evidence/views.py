"""
API Views for Compliance Evidence
"""
import uuid
from datetime import timedelta

from django.utils import timezone
from django.core.files.storage import default_storage
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from .models import ComplianceEvidence, ComplianceEvidenceControlMapping
from .serializers import ComplianceEvidenceSerializer, ComplianceEvidenceListSerializer
from users.permission_classes import HasFeaturePermission
from compliance_controls.models import ComplianceControl, ComplianceControlFrameworkMapping


class ComplianceEvidenceViewSet(viewsets.ModelViewSet):
    """
    ViewSet for ComplianceEvidence CRUD operations
    """
    queryset = ComplianceEvidence.objects.all().order_by('-created_at')
    permission_classes = [IsAuthenticated, HasFeaturePermission('compliance.evidence.view')]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ComplianceEvidenceListSerializer
        return ComplianceEvidenceSerializer
    
    def get_queryset(self):
        """Filter by organization_id if present (multi-tenancy)"""
        queryset = ComplianceEvidence.objects.all().order_by('-created_at')
        
        # Filter by control_id if provided
        control_id = self.request.query_params.get('control_id', None)
        if control_id:
            mapping_ids = ComplianceEvidenceControlMapping.objects.filter(
                control_id=control_id
            ).values_list('evidence_id', flat=True)
            queryset = queryset.filter(id__in=mapping_ids)
        
        # Filter by framework_id if provided (via control mappings)
        framework_id = self.request.query_params.get('framework_id', None)
        if framework_id:
            mapping_ids = ComplianceEvidenceControlMapping.objects.filter(
                framework_id=framework_id
            ).values_list('evidence_id', flat=True)
            queryset = queryset.filter(id__in=mapping_ids)
        
        # Filter by source
        source_filter = self.request.query_params.get('source', None)
        if source_filter:
            queryset = queryset.filter(source=source_filter)
        
        # Filter by status
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Search
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(evidence_id__icontains=search) |
                Q(name__icontains=search) |
                Q(description__icontains=search) |
                Q(source_name__icontains=search)
            )
        
        return queryset
    
    @action(detail=True, methods=['get'])
    def controls(self, request, pk=None):
        """Get all controls for a specific evidence"""
        evidence = self.get_object()
        mappings = ComplianceEvidenceControlMapping.objects.filter(evidence_id=evidence.id)
        
        from compliance_controls.models import ComplianceControl
        from compliance_controls.serializers import ComplianceControlListSerializer
        
        control_ids = [mapping.control_id for mapping in mappings]
        controls = ComplianceControl.objects.filter(id__in=control_ids)
        
        serializer = ComplianceControlListSerializer(controls, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_control(self, request):
        """Get all evidence for a specific control"""
        control_id = request.query_params.get('control_id')
        if not control_id:
            return Response(
                {'error': 'control_id parameter is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        mappings = ComplianceEvidenceControlMapping.objects.filter(control_id=control_id)
        evidence_ids = [mapping.evidence_id for mapping in mappings]
        evidence = ComplianceEvidence.objects.filter(id__in=evidence_ids)
        
        serializer = ComplianceEvidenceListSerializer(evidence, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_framework(self, request):
        """Get all evidence for a specific framework (via controls)"""
        framework_id = request.query_params.get('framework_id')
        if not framework_id:
            return Response(
                {'error': 'framework_id parameter is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        mappings = ComplianceEvidenceControlMapping.objects.filter(framework_id=framework_id)
        evidence_ids = [mapping.evidence_id for mapping in mappings]
        evidence = ComplianceEvidence.objects.filter(id__in=evidence_ids).distinct()
        
        serializer = ComplianceEvidenceListSerializer(evidence, many=True)
        return Response(serializer.data)

    @action(
        detail=False,
        methods=['post'],
        url_path='manual-upload',
        permission_classes=[IsAuthenticated, HasFeaturePermission('compliance.evidence.create')],
    )
    def manual_upload(self, request):
        """
        Manual evidence upload workflow.
        Expects multipart/form-data:
          - file (required)
          - name (required)
          - description (optional)
          - control_id (required, UUID of ComplianceControl)
          - evidence_type (optional, defaults to manual_upload)
          - source_name (optional)
          - freshness_days (optional, default 30)
          - category (optional)
          - tags (optional, comma-separated)
        """
        uploaded_file = request.FILES.get('file')
        name = (request.data.get('name') or '').strip()
        description = (request.data.get('description') or '').strip()
        control_id = (request.data.get('control_id') or '').strip()
        evidence_type = (request.data.get('evidence_type') or 'manual_upload').strip()
        source_name = (request.data.get('source_name') or 'Manual Upload').strip()
        freshness_days_raw = request.data.get('freshness_days') or '30'
        category = (request.data.get('category') or '').strip()
        tags_raw = (request.data.get('tags') or '').strip()

        if not uploaded_file:
            return Response({'error': 'file is required'}, status=status.HTTP_400_BAD_REQUEST)
        if not name:
            return Response({'error': 'name is required'}, status=status.HTTP_400_BAD_REQUEST)
        if not control_id:
            return Response({'error': 'control_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            freshness_days = int(freshness_days_raw)
        except ValueError:
            return Response({'error': 'freshness_days must be an integer'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            control = ComplianceControl.objects.get(id=control_id)
        except ComplianceControl.DoesNotExist:
            return Response({'error': 'control_id not found'}, status=status.HTTP_404_NOT_FOUND)

        # Generate a unique evidence_id
        evidence_id = None
        for _ in range(5):
            candidate = f"EV-{uuid.uuid4().hex[:8].upper()}"
            if not ComplianceEvidence.objects.filter(evidence_id=candidate).exists():
                evidence_id = candidate
                break
        if not evidence_id:
            return Response({'error': 'Unable to generate evidence_id'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Save file to media storage
        upload_path = f"evidence/{evidence_id}/{uploaded_file.name}"
        saved_path = default_storage.save(upload_path, uploaded_file)
        file_url = default_storage.url(saved_path)

        expires_at = timezone.now() + timedelta(days=freshness_days)
        tags = [tag.strip() for tag in tags_raw.split(',') if tag.strip()]

        evidence = ComplianceEvidence.objects.create(
            evidence_id=evidence_id,
            name=name,
            description=description,
            source='manual',
            source_type=evidence_type if evidence_type else 'manual_upload',
            source_name=source_name,
            status='fresh',
            validity_period=freshness_days,
            expires_at=expires_at,
            file_type=uploaded_file.content_type or '',
            file_size=uploaded_file.size,
            file_url=file_url,
            category=category,
            tags=tags,
            created_by=request.user,
            uploaded_by=request.user,
            organization_id=control.organization_id,
        )

        framework_mapping = ComplianceControlFrameworkMapping.objects.filter(control=control).first()
        if not framework_mapping:
            evidence.delete()
            return Response(
                {'error': 'Control is not mapped to a framework.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        ComplianceEvidenceControlMapping.objects.create(
            evidence=evidence,
            control_id=control.id,
            control_name=control.name,
            framework_id=framework_mapping.framework_id,
            framework_name=framework_mapping.framework_name,
        )

        serializer = ComplianceEvidenceSerializer(evidence)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
