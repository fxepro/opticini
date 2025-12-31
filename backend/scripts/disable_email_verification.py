#!/usr/bin/env python
"""
Quick script to disable email verification for testing
"""
import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from site_settings.models import SiteConfig

# Disable email verification
config = SiteConfig.get_config()
config.enable_email_verification = False
config.save()

print(f"✅ Email verification disabled")
print(f"   Current status: enable_email_verification = {config.enable_email_verification}")

