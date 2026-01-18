from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.utils import timezone
from .models import ComplianceTool
from .serializers import ComplianceToolSerializer
from users.permission_views import HasFeaturePermission


class ComplianceToolViewSet(viewsets.ModelViewSet):
    """
    ViewSet for ComplianceTool model
    Provides CRUD operations for compliance tools
    """
    queryset = ComplianceTool.objects.all()
    serializer_class = ComplianceToolSerializer
    permission_classes = [IsAuthenticated, HasFeaturePermission('compliance.tools.view')]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['tool_type', 'sub_category', 'status', 'is_active', 'organization_id']
    search_fields = ['name', 'description', 'service']
    ordering_fields = ['name', 'sub_category', 'status', 'created_at']
    ordering = ['sub_category', 'name']
    
    def get_queryset(self):
        """
        Filter queryset by organization_id if provided
        """
        queryset = super().get_queryset()
        organization_id = self.request.query_params.get('organization_id')
        if organization_id:
            queryset = queryset.filter(organization_id=organization_id)
        return queryset
    
    def perform_create(self, serializer):
        """Set created_by to current user"""
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, HasFeaturePermission('compliance.tools.edit')])
    def test(self, request, pk=None):
        """
        Test tool connection/configuration
        """
        tool = self.get_object()
        # TODO: Implement tool testing logic
        tool.last_tested = timezone.now()
        tool.test_result = "Test not yet implemented"
        tool.save()
        return Response({
            'status': 'success',
            'message': f'Tool {tool.name} test initiated',
            'test_result': tool.test_result
        })
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """
        Get statistics about compliance tools
        """
        queryset = self.get_queryset()
        
        stats = {
            'total': queryset.count(),
            'by_sub_category': {},
            'by_status': {},
            'by_tool_type': {},
            'configured': queryset.filter(status='configured').count(),
            'not_configured': queryset.filter(status='not_configured').count(),
            'active': queryset.filter(is_active=True).count(),
        }
        
        # Count by sub_category
        for choice in ComplianceTool.SUB_CATEGORY_CHOICES:
            stats['by_sub_category'][choice[0]] = queryset.filter(sub_category=choice[0]).count()
        
        # Count by status
        for choice in ComplianceTool.STATUS_CHOICES:
            stats['by_status'][choice[0]] = queryset.filter(status=choice[0]).count()
        
        # Count by tool_type
        for choice in ComplianceTool.TOOL_TYPES:
            stats['by_tool_type'][choice[0]] = queryset.filter(tool_type=choice[0]).count()
        
        return Response(stats)
