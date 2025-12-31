#!/usr/bin/env python
"""Check the latest audit report and its linked analyses"""
import os
import django
from datetime import datetime, timezone

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
print("LATEST AUDIT REPORT VERIFICATION")
print("=" * 80)

# Get the most recent audit report
latest_report = AuditReport.objects.order_by('-created_at').first()

if not latest_report:
    print("\nNo audit reports found in database.")
    exit(0)

print(f"\n=== LATEST AUDIT REPORT ===")
print(f"ID: {latest_report.id}")
print(f"URL: {latest_report.url}")
print(f"Status: {latest_report.status}")
print(f"Created: {latest_report.created_at}")
print(f"Tools Selected: {latest_report.tools_selected}")

# Calculate time since creation
if latest_report.created_at:
    now = datetime.now(timezone.utc)
    time_diff = now - latest_report.created_at
    minutes_ago = int(time_diff.total_seconds() / 60)
    seconds_ago = int(time_diff.total_seconds() % 60)
    print(f"Time Ago: {minutes_ago}m {seconds_ago}s")

# Check linked analyses
print(f"\n=== LINKED ANALYSES ===")
perf_count = latest_report.performance_analyses.count()
dns_count = latest_report.dns_analyses.count()
ssl_count = latest_report.ssl_analyses.count()
sitemap_count = latest_report.sitemap_analyses.count()
api_count = latest_report.api_analyses.count()
links_count = latest_report.links_analyses.count()
typo_count = latest_report.typography_analyses.count()

print(f"Performance: {perf_count}")
print(f"DNS: {dns_count}")
print(f"SSL: {ssl_count}")
print(f"Sitemap: {sitemap_count}")
print(f"API: {api_count}")
print(f"Links: {links_count}")
print(f"Typography: {typo_count}")

total_linked = perf_count + dns_count + ssl_count + sitemap_count + api_count + links_count + typo_count
print(f"\nTotal Linked: {total_linked}")

# Show details of each linked analysis
if perf_count > 0:
    perf = latest_report.performance_analyses.first()
    print(f"\n  Performance Analysis ID: {perf.id}")
    print(f"    Score: {perf.performance_score}")
    print(f"    Device: {perf.device}")
    print(f"    Analyzed: {perf.analyzed_at}")

if dns_count > 0:
    dns = latest_report.dns_analyses.first()
    print(f"\n  DNS Analysis ID: {dns.id}")
    print(f"    A Records: {len(dns.a_records)}")
    print(f"    Health Score: {dns.dns_health_score}")
    print(f"    Analyzed: {dns.analyzed_at}")

if ssl_count > 0:
    ssl = latest_report.ssl_analyses.first()
    print(f"\n  SSL Analysis ID: {ssl.id}")
    print(f"    Valid: {ssl.is_valid}")
    print(f"    Health Score: {ssl.ssl_health_score}")
    print(f"    Analyzed: {ssl.analyzed_at}")

# Check for any unlinked analyses (should be 0)
print(f"\n=== UNLINKED ANALYSES (should be 0) ===")
unlinked_perf = PerformanceAnalysis.objects.filter(audit_report__isnull=True).count()
unlinked_dns = DNSAnalysis.objects.filter(audit_report__isnull=True).count()
unlinked_ssl = SSLAnalysis.objects.filter(audit_report__isnull=True).count()
unlinked_sitemap = SitemapAnalysis.objects.filter(audit_report__isnull=True).count()
unlinked_api = APIAnalysis.objects.filter(audit_report__isnull=True).count()
unlinked_links = LinksAnalysis.objects.filter(audit_report__isnull=True).count()
unlinked_typo = TypographyAnalysis.objects.filter(audit_report__isnull=True).count()

print(f"Unlinked Performance: {unlinked_perf}")
print(f"Unlinked DNS: {unlinked_dns}")
print(f"Unlinked SSL: {unlinked_ssl}")
print(f"Unlinked Sitemap: {unlinked_sitemap}")
print(f"Unlinked API: {unlinked_api}")
print(f"Unlinked Links: {unlinked_links}")
print(f"Unlinked Typography: {unlinked_typo}")

print("\n" + "=" * 80)
print("VERIFICATION COMPLETE")
print("=" * 80)

