"""
API Views for Compliance Frameworks
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from .models import ComplianceFramework
from .serializers import ComplianceFrameworkSerializer
from users.permission_classes import HasFeaturePermission


@api_view(['GET'])
@permission_classes([IsAuthenticated, HasFeaturePermission('compliance.frameworks.view')])
def list_frameworks(request):
    """
    List all compliance frameworks with optional filtering
    
    Query params:
        - search: Search in name, code, description
        - category: Filter by category (security, privacy, industry, regional)
        - status: Filter by status (ready, in_progress, at_risk, not_started)
        - enabled: Filter by enabled status (true/false)
    """
    queryset = ComplianceFramework.objects.all()
    
    # Search filter
    search = request.GET.get('search', '').strip()
    if search:
        queryset = queryset.filter(
            Q(name__icontains=search) |
            Q(code__icontains=search) |
            Q(description__icontains=search)
        )
    
    # Category filter
    category = request.GET.get('category', '').strip()
    if category and category != 'all':
        queryset = queryset.filter(category=category)
    
    # Status filter
    status_filter = request.GET.get('status', '').strip()
    if status_filter and status_filter != 'all':
        queryset = queryset.filter(status=status_filter)
    
    # Enabled filter
    enabled_filter = request.GET.get('enabled', '').strip()
    if enabled_filter and enabled_filter != 'all':
        enabled_bool = enabled_filter.lower() == 'true' or enabled_filter.lower() == 'enabled'
        queryset = queryset.filter(enabled=enabled_bool)
    
    # Order by name
    queryset = queryset.order_by('name')
    
    # Debug: Log queryset count
    count = queryset.count()
    print(f"[DEBUG] Compliance Frameworks API: Found {count} frameworks")
    
    serializer = ComplianceFrameworkSerializer(queryset, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated, HasFeaturePermission('compliance.frameworks.view')])
def get_framework(request, framework_id):
    """
    Get a single compliance framework by ID
    """
    try:
        framework = ComplianceFramework.objects.get(id=framework_id)
        serializer = ComplianceFrameworkSerializer(framework)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except ComplianceFramework.DoesNotExist:
        return Response(
            {'error': 'Framework not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated, HasFeaturePermission('compliance.frameworks.edit')])
def create_framework(request):
    """
    Create a new compliance framework
    """
    serializer = ComplianceFrameworkSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(created_by=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated, HasFeaturePermission('compliance.frameworks.edit')])
def update_framework(request, framework_id):
    """
    Update a compliance framework
    """
    try:
        framework = ComplianceFramework.objects.get(id=framework_id)
        serializer = ComplianceFrameworkSerializer(
            framework,
            data=request.data,
            partial=request.method == 'PATCH'
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except ComplianceFramework.DoesNotExist:
        return Response(
            {'error': 'Framework not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated, HasFeaturePermission('compliance.frameworks.view')])
def framework_stats(request):
    """
    Get summary statistics for compliance frameworks
    """
    total = ComplianceFramework.objects.count()
    enabled = ComplianceFramework.objects.filter(enabled=True).count()
    ready = ComplianceFramework.objects.filter(status='ready').count()
    
    # Calculate average compliance score for enabled frameworks
    enabled_frameworks = ComplianceFramework.objects.filter(
        enabled=True,
        compliance_score__gt=0
    )
    avg_compliance = 0
    if enabled_frameworks.exists():
        total_score = sum(f.compliance_score for f in enabled_frameworks)
        avg_compliance = round(total_score / enabled_frameworks.count())
    
    return Response({
        'total': total,
        'enabled': enabled,
        'ready': ready,
        'avgCompliance': avg_compliance,
    }, status=status.HTTP_200_OK)
