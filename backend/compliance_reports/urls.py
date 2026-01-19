"""
URLs for Compliance Reports API
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ComplianceReportViewSet

router = DefaultRouter()
router.register(r'reports', ComplianceReportViewSet, basename='compliance-report')

urlpatterns = [
    path('', include(router.urls)),
]
