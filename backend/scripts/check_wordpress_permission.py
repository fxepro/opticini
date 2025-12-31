#!/usr/bin/env python
"""
Quick script to check if wordpress.view permission exists
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pagerodeo.settings')
django.setup()

from users.permission_models import FeaturePermission
from django.contrib.auth.models import Permission, ContentType

# Check if wordpress.view exists
wp_perm = FeaturePermission.objects.filter(code='wordpress.view').first()
if wp_perm:
    print(f"✓ WordPress permission exists: {wp_perm.code}")
    print(f"  Name: {wp_perm.name}")
    print(f"  Category: {wp_perm.category}")
    print(f"  Django Permission: {wp_perm.django_permission}")
else:
    print("✗ WordPress permission NOT found")
    print("  Run: python manage.py setup_permissions")

# Check Django Permission
content_type = ContentType.objects.get_for_model(FeaturePermission)
django_perm = Permission.objects.filter(codename='wordpress_view', content_type=content_type).first()
if django_perm:
    print(f"✓ Django Permission exists: {django_perm.codename}")
else:
    print("✗ Django Permission NOT found")

