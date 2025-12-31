#!/usr/bin/env python
"""Quick script to check audit report linking"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from audit_reports.models import AuditReport
from performance_analysis.models import PerformanceAnalysis
from dns_analysis.models import DNSAnalysis
from ssl_analysis.models import SSLAnalysis
from sitemap_analysis.models import SitemapAnalysis
from api_analysis.models import APIAnalysis
from links_analysis.models import LinksAnalysis
from typography_analysis.models import TypographyAnalysis

print("=" * 80)
print("AUDIT REPORT LINKING VERIFICATION")
print("=" * 80)

# Get latest 5 audit reports
print("\n=== LATEST 5 AUDIT REPORTS ===")
reports = AuditReport.objects.order_by('-created_at')[:5]
for r in reports:
    print(f"\nAuditReport ID: {r.id}")
    print(f"  URL: {r.url}")
    print(f"  Created: {r.created_at}")
    print(f"  Status: {r.status}")
    print(f"  Tools: {r.tools_selected}")

# Get latest 5 performance analyses
print("\n\n=== LATEST 5 PERFORMANCE ANALYSES ===")
perfs = PerformanceAnalysis.objects.order_by('-analyzed_at')[:5]
for p in perfs:
    print(f"\nPerformanceAnalysis ID: {p.id}")
    print(f"  URL: {p.url}")
    print(f"  Audit Report ID: {p.audit_report_id}")
    print(f"  Analyzed: {p.analyzed_at}")
    if p.audit_report_id:
        try:
            audit = AuditReport.objects.get(id=p.audit_report_id)
            print(f"  [OK] Linked to AuditReport: {audit.id} (URL: {audit.url})")
        except AuditReport.DoesNotExist:
            print(f"  [ERROR] AuditReport {p.audit_report_id} NOT FOUND!")

# Get latest 5 DNS analyses
print("\n\n=== LATEST 5 DNS ANALYSES ===")
dns_list = DNSAnalysis.objects.order_by('-analyzed_at')[:5]
for d in dns_list:
    print(f"\nDNSAnalysis ID: {d.id}")
    print(f"  URL: {d.url}")
    print(f"  Audit Report ID: {d.audit_report_id}")
    print(f"  Analyzed: {d.analyzed_at}")
    if d.audit_report_id:
        try:
            audit = AuditReport.objects.get(id=d.audit_report_id)
            print(f"  [OK] Linked to AuditReport: {audit.id} (URL: {audit.url})")
        except AuditReport.DoesNotExist:
            print(f"  [ERROR] AuditReport {d.audit_report_id} NOT FOUND!")

# Count unlinked analyses
print("\n\n=== UNLINKED ANALYSES COUNT ===")
print(f"Performance with NULL audit_report_id: {PerformanceAnalysis.objects.filter(audit_report__isnull=True).count()}")
print(f"DNS with NULL audit_report_id: {DNSAnalysis.objects.filter(audit_report__isnull=True).count()}")
print(f"SSL with NULL audit_report_id: {SSLAnalysis.objects.filter(audit_report__isnull=True).count()}")
print(f"Sitemap with NULL audit_report_id: {SitemapAnalysis.objects.filter(audit_report__isnull=True).count()}")
print(f"API with NULL audit_report_id: {APIAnalysis.objects.filter(audit_report__isnull=True).count()}")
print(f"Links with NULL audit_report_id: {LinksAnalysis.objects.filter(audit_report__isnull=True).count()}")
print(f"Typography with NULL audit_report_id: {TypographyAnalysis.objects.filter(audit_report__isnull=True).count()}")

# Check latest audit report's linked analyses
print("\n\n=== LATEST AUDIT REPORT'S LINKED ANALYSES ===")
if reports:
    latest = reports[0]
    print(f"\nAuditReport: {latest.id} ({latest.url})")
    print(f"  Performance: {latest.performance_analyses.count()}")
    print(f"  DNS: {latest.dns_analyses.count()}")
    print(f"  SSL: {latest.ssl_analyses.count()}")
    print(f"  Sitemap: {latest.sitemap_analyses.count()}")
    print(f"  API: {latest.api_analyses.count()}")
    print(f"  Links: {latest.links_analyses.count()}")
    print(f"  Typography: {latest.typography_analyses.count()}")

print("\n" + "=" * 80)

