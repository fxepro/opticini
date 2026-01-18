from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ComplianceToolViewSet

router = DefaultRouter()
router.register(r'', ComplianceToolViewSet, basename='compliance-tool')

urlpatterns = [
    path('', include(router.urls)),
]
