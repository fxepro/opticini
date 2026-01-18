"""
URLs for Compliance Evidence API
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ComplianceEvidenceViewSet

router = DefaultRouter()
router.register(r'evidence', ComplianceEvidenceViewSet, basename='compliance-evidence')

urlpatterns = [
    path('', include(router.urls)),
]

