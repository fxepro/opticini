#!/usr/bin/env python
"""Check recent audit reports"""
import os
import django
from datetime import datetime, timedelta
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from audit_reports.models import AuditReport
from performance_analysis.models import PerformanceAnalysis
from dns_analysis.models import DNSAnalysis

print("=" * 80)
print("RECENT AUDIT REPORTS (Last 2 Hours)")
print("=" * 80)

# Get recent reports
recent = AuditReport.objects.filter(
    created_at__gte=timezone.now() - timedelta(hours=2)
).order_by('-created_at')

if not recent.exists():
    print("\nNo audit reports in the last 2 hours.")
else:
    for r in recent:
        print(f"\n=== AuditReport ===")
        print(f"ID: {r.id}")
        print(f"URL: {r.url}")
        print(f"Status: {r.status}")
        print(f"Created: {r.created_at}")
        print(f"Tools: {r.tools_selected}")
        
        # Check linked analyses
        perf_count = r.performance_analyses.count()
        dns_count = r.dns_analyses.count()
        ssl_count = r.ssl_analyses.count()
        sitemap_count = r.sitemap_analyses.count()
        api_count = r.api_analyses.count()
        links_count = r.links_analyses.count()
        typo_count = r.typography_analyses.count()
        
        print(f"Linked: P={perf_count}, D={dns_count}, S={ssl_count}, Sitemap={sitemap_count}, API={api_count}, Links={links_count}, Typo={typo_count}")
        
        if perf_count == 0 and dns_count == 0:
            print("⚠️  NO ANALYSES LINKED - This report was created but analyses weren't saved!")

print("\n" + "=" * 80)
print("RECENT ANALYSES (Last 2 Hours) - Checking for unlinked")
print("=" * 80)

# Check for recent unlinked analyses
recent_perf = PerformanceAnalysis.objects.filter(
    analyzed_at__gte=timezone.now() - timedelta(hours=2)
).order_by('-analyzed_at')[:5]

recent_dns = DNSAnalysis.objects.filter(
    analyzed_at__gte=timezone.now() - timedelta(hours=2)
).order_by('-analyzed_at')[:5]

print(f"\nRecent Performance Analyses: {recent_perf.count()}")
for p in recent_perf:
    print(f"  ID: {p.id}, URL: {p.url}, AuditReport: {p.audit_report_id or 'NULL'}, Analyzed: {p.analyzed_at}")

print(f"\nRecent DNS Analyses: {recent_dns.count()}")
for d in recent_dns:
    print(f"  ID: {d.id}, URL: {d.url}, AuditReport: {d.audit_report_id or 'NULL'}, Analyzed: {d.analyzed_at}")

