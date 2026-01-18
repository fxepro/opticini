"""
URLs for Compliance Frameworks
"""
from django.urls import path
from .views import (
    list_frameworks,
    get_framework,
    create_framework,
    update_framework,
    framework_stats,
)

urlpatterns = [
    path('api/compliance/frameworks/', list_frameworks, name='list_frameworks'),
    path('api/compliance/frameworks/stats/', framework_stats, name='framework_stats'),
    path('api/compliance/frameworks/create/', create_framework, name='create_framework'),
    path('api/compliance/frameworks/<uuid:framework_id>/', get_framework, name='get_framework'),
    path('api/compliance/frameworks/<uuid:framework_id>/update/', update_framework, name='update_framework'),
]

