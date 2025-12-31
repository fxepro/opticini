"""
Test script to verify all analysis save endpoints are working correctly.

Usage:
    python manage.py shell < test_analysis_save.py
    OR
    python test_analysis_save.py (after setting DJANGO_SETTINGS_MODULE)
"""

import os
import sys
import django
import json
from datetime import datetime

# Setup Django
if 'DJANGO_SETTINGS_MODULE' not in os.environ:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
    django.setup()

from django.contrib.auth.models import User
from audit_reports.models import AuditReport
from dns_analysis.models import DNSAnalysis
from performance_analysis.models import PerformanceAnalysis
from ssl_analysis.models import SSLAnalysis
from sitemap_analysis.models import SitemapAnalysis
from api_analysis.models import APIAnalysis
from links_analysis.models import LinksAnalysis
from typography_analysis.models import TypographyAnalysis

# Test data
TEST_URL = "https://example.com"
TEST_USER = None  # Will use first user or None

def get_test_user():
    """Get a test user or None"""
    try:
        return User.objects.first()
    except:
        return None

def create_test_audit_report():
    """Create a test audit report"""
    user = get_test_user()
    report = AuditReport.objects.create(
        url=TEST_URL,
        user=user,
        tools_selected=['dns', 'performance', 'ssl', 'sitemap', 'api', 'links', 'typography'],
        status='running'
    )
    print(f"✅ Created AuditReport: {report.id}")
    return report

def test_dns_analysis(audit_report):
    """Test DNS analysis save"""
    print("\n" + "="*60)
    print("TESTING: DNS Analysis")
    print("="*60)
    
    from dns_analysis.views import save_dns_analysis
    from rest_framework.test import APIRequestFactory
    from rest_framework.request import Request
    
    factory = APIRequestFactory()
    
    test_data = {
        'url': TEST_URL,
        'audit_report_id': str(audit_report.id),
        'a_records': ['192.0.2.1', '192.0.2.2'],
        'aaaa_records': ['2001:db8::1'],
        'mx_records': [{'priority': 10, 'host': 'mail.example.com'}],
        'txt_records': ['v=spf1 include:_spf.example.com ~all'],
        'cname_records': ['www.example.com'],
        'ns_records': ['ns1.example.com', 'ns2.example.com'],
        'soa_record': {
            'mname': 'ns1.example.com',
            'rname': 'admin.example.com',
            'serial': 2024010101
        },
        'response_time_ms': 45.2,
        'dns_server': '8.8.8.8',
        'dns_server_ip': '8.8.8.8',
        'dns_health_score': 95,
        'issues': [],
        'recommendations': ['Consider adding IPv6 records'],
        'full_results': {'test': 'data'}
    }
    
    request = factory.post('/api/analysis/dns/', test_data, format='json')
    drf_request = Request(request)
    
    try:
        response = save_dns_analysis(drf_request)
        if response.status_code == 201:
            data = response.data
            print(f"✅ DNS Analysis saved successfully!")
            print(f"   - ID: {data.get('id')}")
            print(f"   - Message: {data.get('message')}")
            
            # Verify in database
            analysis = DNSAnalysis.objects.get(id=data['id'])
            print(f"   - URL: {analysis.url}")
            print(f"   - Audit Report: {analysis.audit_report_id}")
            print(f"   - A Records: {len(analysis.a_records)}")
            print(f"   - Health Score: {analysis.dns_health_score}")
            return True
        else:
            print(f"❌ Failed: {response.status_code}")
            print(f"   Error: {response.data}")
            return False
    except Exception as e:
        print(f"❌ Exception: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def test_performance_analysis(audit_report):
    """Test Performance analysis save"""
    print("\n" + "="*60)
    print("TESTING: Performance Analysis")
    print("="*60)
    
    from performance_analysis.views import save_performance_analysis
    from rest_framework.test import APIRequestFactory
    from rest_framework.request import Request
    
    factory = APIRequestFactory()
    
    test_data = {
        'url': TEST_URL,
        'audit_report_id': str(audit_report.id),
        'device': 'desktop',
        'performance_score': 85,
        'lcp': 2.5,
        'fid': 50,
        'cls': 0.1,
        'tti': 3.2,
        'tbt': 200,
        'fcp': 1.8,
        'speed_index': 2.1,
        'page_size_mb': 2.5,
        'request_count': 45,
        'load_time': 3.5,
        'dom_content_loaded': 2500,
        'first_paint': 1200,
        'accessibility_score': 90,
        'best_practices_score': 85,
        'seo_score': 95,
        'resources': [{'type': 'script', 'size': 100000}],
        'recommendations': ['Optimize images'],
        'full_results': {'test': 'data'}
    }
    
    request = factory.post('/api/analysis/performance/', test_data, format='json')
    drf_request = Request(request)
    
    try:
        response = save_performance_analysis(drf_request)
        if response.status_code == 201:
            data = response.data
            print(f"✅ Performance Analysis saved successfully!")
            print(f"   - ID: {data.get('id')}")
            print(f"   - Score: {test_data['performance_score']}")
            return True
        else:
            print(f"❌ Failed: {response.status_code}")
            print(f"   Error: {response.data}")
            return False
    except Exception as e:
        print(f"❌ Exception: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def test_ssl_analysis(audit_report):
    """Test SSL analysis save"""
    print("\n" + "="*60)
    print("TESTING: SSL Analysis")
    print("="*60)
    
    from ssl_analysis.views import save_ssl_analysis
    from rest_framework.test import APIRequestFactory
    from rest_framework.request import Request
    
    factory = APIRequestFactory()
    
    test_data = {
        'url': TEST_URL,
        'audit_report_id': str(audit_report.id),
        'is_valid': True,
        'expires_at': '2025-12-31T23:59:59Z',
        'days_until_expiry': 365,
        'issuer': 'Let\'s Encrypt',
        'subject': 'CN=example.com',
        'serial_number': '1234567890',
        'root_ca_valid': True,
        'intermediate_valid': True,
        'certificate_valid': True,
        'protocol': 'TLS 1.3',
        'cipher_suite': 'TLS_AES_256_GCM_SHA384',
        'certificate_chain': [],
        'san_domains': ['example.com', 'www.example.com'],
        'ssl_health_score': 100,
        'issues': [],
        'recommendations': [],
        'full_results': {'test': 'data'}
    }
    
    request = factory.post('/api/analysis/ssl/', test_data, format='json')
    drf_request = Request(request)
    
    try:
        response = save_ssl_analysis(drf_request)
        if response.status_code == 201:
            data = response.data
            print(f"✅ SSL Analysis saved successfully!")
            print(f"   - ID: {data.get('id')}")
            return True
        else:
            print(f"❌ Failed: {response.status_code}")
            print(f"   Error: {response.data}")
            return False
    except Exception as e:
        print(f"❌ Exception: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def test_sitemap_analysis(audit_report):
    """Test Sitemap analysis save"""
    print("\n" + "="*60)
    print("TESTING: Sitemap Analysis")
    print("="*60)
    
    from sitemap_analysis.views import save_sitemap_analysis
    from rest_framework.test import APIRequestFactory
    from rest_framework.request import Request
    
    factory = APIRequestFactory()
    
    test_data = {
        'url': TEST_URL,
        'audit_report_id': str(audit_report.id),
        'sitemap_found': True,
        'sitemap_url': f'{TEST_URL}/sitemap.xml',
        'sitemap_type': 'XML',
        'total_urls': 100,
        'last_modified': '2024-01-01T00:00:00Z',
        'change_frequency': 'weekly',
        'priority': 0.8,
        'urls': [f'{TEST_URL}/page1', f'{TEST_URL}/page2'],
        'is_sitemap_index': False,
        'sitemap_index_urls': [],
        'issues': [],
        'recommendations': [],
        'health_score': 90,
        'full_results': {'test': 'data'}
    }
    
    request = factory.post('/api/analysis/sitemap/', test_data, format='json')
    drf_request = Request(request)
    
    try:
        response = save_sitemap_analysis(drf_request)
        if response.status_code == 201:
            data = response.data
            print(f"✅ Sitemap Analysis saved successfully!")
            print(f"   - ID: {data.get('id')}")
            return True
        else:
            print(f"❌ Failed: {response.status_code}")
            print(f"   Error: {response.data}")
            return False
    except Exception as e:
        print(f"❌ Exception: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def test_api_analysis(audit_report):
    """Test API analysis save"""
    print("\n" + "="*60)
    print("TESTING: API Analysis")
    print("="*60)
    
    from api_analysis.views import save_api_analysis
    from rest_framework.test import APIRequestFactory
    from rest_framework.request import Request
    
    factory = APIRequestFactory()
    
    test_data = {
        'url': TEST_URL,
        'audit_report_id': str(audit_report.id),
        'endpoints': [
            {'url': f'{TEST_URL}/api/v1/users', 'method': 'GET', 'status_code': 200},
            {'url': f'{TEST_URL}/api/v1/posts', 'method': 'GET', 'status_code': 200}
        ],
        'total_endpoints': 2,
        'endpoints_by_method': {'GET': 2},
        'endpoints_by_status': {200: 2},
        'api_health_score': 95,
        'issues': [],
        'recommendations': [],
        'response_types': ['JSON'],
        'auth_methods': ['Bearer'],
        'requires_auth': True,
        'full_results': {'test': 'data'}
    }
    
    request = factory.post('/api/analysis/api/', test_data, format='json')
    drf_request = Request(request)
    
    try:
        response = save_api_analysis(drf_request)
        if response.status_code == 201:
            data = response.data
            print(f"✅ API Analysis saved successfully!")
            print(f"   - ID: {data.get('id')}")
            return True
        else:
            print(f"❌ Failed: {response.status_code}")
            print(f"   Error: {response.data}")
            return False
    except Exception as e:
        print(f"❌ Exception: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def test_links_analysis(audit_report):
    """Test Links analysis save"""
    print("\n" + "="*60)
    print("TESTING: Links Analysis")
    print("="*60)
    
    from links_analysis.views import save_links_analysis
    from rest_framework.test import APIRequestFactory
    from rest_framework.request import Request
    
    factory = APIRequestFactory()
    
    test_data = {
        'url': TEST_URL,
        'audit_report_id': str(audit_report.id),
        'links': [
            {'url': f'{TEST_URL}/page1', 'status': 200, 'is_internal': True, 'response_time': 100},
            {'url': f'{TEST_URL}/page2', 'status': 404, 'is_internal': True, 'response_time': 50},
            {'url': 'https://external.com', 'status': 200, 'is_external': True, 'response_time': 200}
        ],
        'total_links': 3,
        'internal_links': 2,
        'external_links': 1,
        'broken_links': 1,
        'redirect_links': 0,
        'links_by_status': {200: 2, 404: 1},
        'links_health_score': 67,
        'issues': ['1 broken link found'],
        'recommendations': ['Fix broken links'],
        'broken_links_list': [{'url': f'{TEST_URL}/page2', 'status': 404}],
        'avg_response_time': 116.67,
        'min_response_time': 50,
        'max_response_time': 200,
        'full_results': {'test': 'data'}
    }
    
    request = factory.post('/api/analysis/links/', test_data, format='json')
    drf_request = Request(request)
    
    try:
        response = save_links_analysis(drf_request)
        if response.status_code == 201:
            data = response.data
            print(f"✅ Links Analysis saved successfully!")
            print(f"   - ID: {data.get('id')}")
            return True
        else:
            print(f"❌ Failed: {response.status_code}")
            print(f"   Error: {response.data}")
            return False
    except Exception as e:
        print(f"❌ Exception: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def test_typography_analysis(audit_report):
    """Test Typography analysis save"""
    print("\n" + "="*60)
    print("TESTING: Typography Analysis")
    print("="*60)
    
    from typography_analysis.views import save_typography_analysis
    from rest_framework.test import APIRequestFactory
    from rest_framework.request import Request
    
    factory = APIRequestFactory()
    
    test_data = {
        'url': TEST_URL,
        'audit_report_id': str(audit_report.id),
        'fonts_used': ['Arial', 'Helvetica', 'Times New Roman'],
        'font_sizes': ['16px', '14px', '18px', '12px'],
        'font_weights': ['400', '700', '300'],
        'line_heights': ['1.5', '1.6', '1.4'],
        'font_families': ['Arial', 'Helvetica'],
        'total_fonts': 3,
        'total_font_sizes': 4,
        'min_font_size': 12,
        'max_font_size': 18,
        'avg_font_size': 15,
        'issues': ['Too many fonts (3)'],
        'recommendations': ['Limit to 2 font families'],
        'health_score': 75,
        'accessibility_issues': ['Small text found'],
        'full_results': {'test': 'data'}
    }
    
    request = factory.post('/api/analysis/typography/', test_data, format='json')
    drf_request = Request(request)
    
    try:
        response = save_typography_analysis(drf_request)
        if response.status_code == 201:
            data = response.data
            print(f"✅ Typography Analysis saved successfully!")
            print(f"   - ID: {data.get('id')}")
            return True
        else:
            print(f"❌ Failed: {response.status_code}")
            print(f"   Error: {response.data}")
            return False
    except Exception as e:
        print(f"❌ Exception: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def verify_audit_report_data(audit_report):
    """Verify all analyses are linked to the audit report"""
    print("\n" + "="*60)
    print("VERIFICATION: Audit Report Data")
    print("="*60)
    
    # Refresh from database
    audit_report.refresh_from_db()
    
    print(f"\nAudit Report ID: {audit_report.id}")
    print(f"URL: {audit_report.url}")
    
    # Check each analysis type
    checks = [
        ('Performance', audit_report.performance_analyses.count()),
        ('SSL', audit_report.ssl_analyses.count()),
        ('DNS', audit_report.dns_analyses.count()),
        ('Sitemap', audit_report.sitemap_analyses.count()),
        ('API', audit_report.api_analyses.count()),
        ('Links', audit_report.links_analyses.count()),
        ('Typography', audit_report.typography_analyses.count()),
    ]
    
    print("\nLinked Analyses:")
    total = 0
    for name, count in checks:
        status = "✅" if count > 0 else "❌"
        print(f"  {status} {name}: {count}")
        total += count
    
    print(f"\nTotal Analyses: {total}")
    return total == 7

def main():
    """Run all tests"""
    print("="*60)
    print("ANALYSIS SAVE ENDPOINT TEST SUITE")
    print("="*60)
    
    # Create test audit report
    audit_report = create_test_audit_report()
    
    # Run tests
    results = []
    results.append(('DNS', test_dns_analysis(audit_report)))
    results.append(('Performance', test_performance_analysis(audit_report)))
    results.append(('SSL', test_ssl_analysis(audit_report)))
    results.append(('Sitemap', test_sitemap_analysis(audit_report)))
    results.append(('API', test_api_analysis(audit_report)))
    results.append(('Links', test_links_analysis(audit_report)))
    results.append(('Typography', test_typography_analysis(audit_report)))
    
    # Verify audit report
    verify_audit_report_data(audit_report)
    
    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {name}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed!")
    else:
        print(f"\n⚠️  {total - passed} test(s) failed")

if __name__ == '__main__':
    main()

