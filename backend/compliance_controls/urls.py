"""
URLs for Compliance Controls API
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ComplianceControlViewSet, compliance_chat

router = DefaultRouter()
router.register(r'controls', ComplianceControlViewSet, basename='compliance-control')

urlpatterns = [
    path('', include(router.urls)),
    path('chat/', compliance_chat, name='compliance_chat'),
]

