#!/usr/bin/env python
"""Quick script to check if roles and permissions are in the database"""
import os
import django

# Try to find the correct settings module
import sys
if 'manage.py' in sys.argv[0] or len(sys.argv) == 0:
    # Running as script, need to find settings
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
else:
    # Let Django find it
    pass
django.setup()

from django.contrib.auth.models import Group, Permission
from users.permission_models import FeaturePermission

print("=" * 60)
print("ROLES AND PERMISSIONS DATABASE STATUS")
print("=" * 60)

# Check Roles
print("\n1. ROLES (Groups in auth_group table):")
groups = Group.objects.all()
print(f"   Total Groups: {groups.count()}")
if groups.count() > 0:
    print(f"   Group names: {[g.name for g in groups]}")
    print("   ✅ Roles are in database")
else:
    print("   ❌ No roles found - run migrations")

# Check FeaturePermissions
print("\n2. FEATURE PERMISSIONS (users_featurepermission table):")
fp_count = FeaturePermission.objects.count()
print(f"   Total FeaturePermissions: {fp_count}")
if fp_count > 0:
    print("   ✅ FeaturePermissions are seeded")
    # Show sample
    sample = FeaturePermission.objects.all()[:5]
    print(f"   Sample: {[p.code for p in sample]}")
else:
    print("   ❌ FeaturePermissions NOT seeded")
    print("   Run: python manage.py setup_permissions")

# Check Django Permissions
print("\n3. DJANGO PERMISSIONS (auth_permission table):")
perm_count = Permission.objects.count()
print(f"   Total Permissions: {perm_count}")
if perm_count > 0:
    print("   ✅ Django Permissions exist")
else:
    print("   ❌ No Django Permissions found")

# Check Role-Permission Links
print("\n4. ROLE-PERMISSION LINKS (auth_group_permissions table):")
if groups.count() > 0:
    for group in groups:
        perm_count = group.permissions.count()
        print(f"   {group.name}: {perm_count} permissions")
        if perm_count == 0:
            print(f"      ⚠️  No permissions assigned - run: python manage.py setup_permissions")

print("\n" + "=" * 60)
print("SUMMARY:")
print("=" * 60)
if groups.count() >= 5 and fp_count > 0:
    print("✅ Roles and permissions are in database")
    print("✅ System is ready to use")
else:
    print("⚠️  Setup incomplete:")
    if groups.count() < 5:
        print("   - Run migrations: python manage.py migrate")
    if fp_count == 0:
        print("   - Seed permissions: python manage.py setup_permissions")

