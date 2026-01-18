"""
Permission API Views for RBAC

API endpoints for permission checking and navigation.
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import Group
from .permission_utils import has_permission, get_user_permissions, filter_navigation_by_permissions
from .permission_classes import HasFeaturePermission
from .models import UserProfile


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_permissions(request):
    """
    Check if user has specific permissions.
    
    Query params:
        permissions: Comma-separated list of permission codes to check
    
    Returns:
        {
            "permissions": {
                "site_audit.view": true,
                "users.view": false
            }
        }
    """
    permission_codes = request.GET.get('permissions', '').split(',')
    permission_codes = [p.strip() for p in permission_codes if p.strip()]
    
    if not permission_codes:
        return Response(
            {'error': 'No permissions specified'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    results = {}
    for code in permission_codes:
        results[code] = has_permission(request.user, code)
    
    return Response({'permissions': results})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_permissions(request):
    """
    Get all permissions for the current user.
    
    Returns:
        {
            "permissions": ["site_audit.view", "performance.view", ...]
        }
    """
    permissions = get_user_permissions(request.user)
    return Response({'permissions': permissions})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_navigation(request):
    """
    Get navigation structure filtered by user's permissions.
    
    Returns:
        Navigation structure with sections and items filtered by permissions
    """
    import logging
    logger = logging.getLogger(__name__)
    
    # CRITICAL DEBUG: Log user info
    logger.info(f"=== NAVIGATION REQUEST ===")
    logger.info(f"User: {request.user.username}")
    logger.info(f"is_superuser: {request.user.is_superuser}")
    logger.info(f"is_staff: {request.user.is_staff}")
    logger.info(f"is_authenticated: {request.user.is_authenticated}")
    
    # Get user permissions
    user_permissions_list = get_user_permissions(request.user)
    logger.info(f"Permissions count: {len(user_permissions_list)}")
    
    # Define navigation structure
    # Using existing /dashboard and /admin routes - no new pages created
    navigation_structure = {
        "sections": [
            {
                "id": "workspace",
                "title": "Workspace",
                "icon": "Home",
                "items": [
                    {
                        "id": "overview",
                        "title": "Home",
                        "href": "/workspace/home",
                        "icon": "LayoutDashboard",
                        "permission": "workspace.overview.view"
                    }
                ]
            },
            {
                "id": "compliance",
                "title": "Compliance",
                "icon": "ShieldCheck",
                "items": [
                    {
                        "id": "compliance_overview",
                        "title": "Overview",
                        "href": "/workspace/compliance/overview",
                        "icon": "LayoutDashboard",
                        "permission": "compliance.overview.view"
                    },
                    {
                        "id": "compliance_chat",
                        "title": "Chat",
                        "href": "/workspace/compliance/chat",
                        "icon": "MessageSquare",
                        "permission": "compliance.chat.view"
                    },
                    {
                        "id": "compliance_frameworks",
                        "title": "Frameworks",
                        "href": "/workspace/compliance/frameworks",
                        "icon": "ShieldCheck",
                        "permission": "compliance.frameworks.view"
                    },
                    {
                        "id": "compliance_controls",
                        "title": "Controls",
                        "href": "/workspace/compliance/controls",
                        "icon": "Shield",
                        "permission": "compliance.controls.view"
                    },
                    {
                        "id": "compliance_evidence",
                        "title": "Evidence",
                        "href": "/workspace/compliance/evidence",
                        "icon": "FileText",
                        "permission": "compliance.evidence.view"
                    },
                    {
                        "id": "compliance_policies",
                        "title": "Policies",
                        "href": "/workspace/compliance/policies",
                        "icon": "FileText",
                        "permission": "compliance.policies.view"
                    },
                    {
                        "id": "compliance_audits",
                        "title": "Audits",
                        "href": "/workspace/compliance/audits",
                        "icon": "Search",
                        "permission": "compliance.audits.view"
                    },
                    {
                        "id": "compliance_reports",
                        "title": "Reports",
                        "href": "/workspace/compliance/reports",
                        "icon": "BarChart3",
                        "permission": "compliance.reports.view"
                    },
                    {
                        "id": "compliance_tools",
                        "title": "Tools",
                        "href": "/workspace/compliance/tools",
                        "icon": "Settings",
                        "permission": "compliance.tools.view"
                    }
                ]
            },
            {
                "id": "user_features",
                "title": "My Tools",
                "icon": "Tool",
                "items": [
                    {
                        "id": "user_features_overview",
                        "title": "Overview",
                        "href": "/workspace/tools/overview",
                        "icon": "LayoutDashboard",
                        "permission": "user_features.overview.view"
                    },
                    {
                        "id": "site_audit",
                        "title": "Site Audit",
                        "href": "/workspace/site-audit",
                        "icon": "Search",
                        "permission": "site_audit.view"
                    },
                    {
                        "id": "performance",
                        "title": "Performance",
                        "href": "/workspace/performance",
                        "icon": "Gauge",
                        "permission": "performance.view"
                    },
                    {
                        "id": "monitoring",
                        "title": "Monitoring",
                        "href": "/workspace/monitoring",
                        "icon": "TrendingUp",
                        "permission": "monitoring.view"
                    },
                    {
                        "id": "reports",
                        "title": "Reports",
                        "href": "/workspace/reports",
                        "icon": "BarChart3",
                        "permission": "reports.view"
                    },
                    {
                        "id": "ai_health",
                        "title": "AI Monitoring",
                        "href": "/workspace/ai-health",
                        "icon": "Cpu",
                        "permission": "ai_health.view"
                    },
                    {
                        "id": "database_monitoring",
                        "title": "Database Monitoring",
                        "href": "/workspace/database-monitoring",
                        "icon": "Database",
                        "permission": "database_monitoring.view"
                    },
                    {
                        "id": "security_monitoring",
                        "title": "Security Monitoring",
                        "href": "/workspace/security-monitoring",
                        "icon": "Shield",
                        "permission": "security_monitoring.view"
                    },
                    {
                        "id": "security_audit",
                        "title": "Security Audit",
                        "href": "/workspace/security-audit",
                        "icon": "ShieldCheck",
                        "permission": "security_monitoring.view"
                    },
                    {
                        "id": "api_monitoring_user",
                        "title": "API Monitoring",
                        "href": "/workspace/api-monitoring-user",
                        "icon": "Network",
                        "permission": "api_monitoring_user.view"
                    },
                    {
                        "id": "seo_monitoring",
                        "title": "SEO Monitoring",
                        "href": "/workspace/seo-monitoring",
                        "icon": "Globe",
                        "permission": "seo_monitoring.view"
                    },
                    {
                        "id": "settings",
                        "title": "Settings",
                        "href": "/workspace/settings",
                        "icon": "Settings",
                        "permission": "profile.edit"
                    }
                ]
            },
            {
                "id": "collateral",
                "title": "Collateral",
                "icon": "GraduationCap",
                "items": [
                    {
                        "id": "collateral_overview",
                        "title": "Overview",
                        "href": "/workspace/collateral/overview",
                        "icon": "LayoutDashboard",
                        "permission": "collateral.overview.view"
                    },
                    {
                        "id": "collateral_main",
                        "title": "Learning & Resources",
                        "href": "/workspace/collateral",
                        "icon": "GraduationCap",
                        "permission": "collateral.view"
                    }
                ]
            },
            {
                "id": "integrations",
                "title": "Integrations",
                "icon": "Plug",
                "items": [
                    {
                        "id": "integrations_overview",
                        "title": "Overview",
                        "href": "/workspace/integrations/overview",
                        "icon": "LayoutDashboard",
                        "permission": "integrations.overview.view"
                    },
                    {
                        "id": "google_analytics",
                        "title": "Google Analytics",
                        "href": "/workspace/google-analytics",
                        "icon": "TrendingUp",
                        "permission": "google_analytics.view"
                    },
                    {
                        "id": "wordpress",
                        "title": "WordPress",
                        "href": "/workspace/wordpress",
                        "icon": "Package",
                        "permission": "wordpress.view"
                    },
                    {
                        "id": "communication",
                        "title": "Communication",
                        "href": "/workspace/communication",
                        "icon": "MessageSquare",
                        "permission": "communication.view"
                    }
                ]
            },
            {
                "id": "admin_features",
                "title": "Administration",
                "icon": "Shield",
                "permission": "users.view",
                "items": [
                    {
                        "id": "admin_overview",
                        "title": "Overview",
                        "href": "/workspace/admin-overview",
                        "icon": "LayoutDashboard",
                        "permission": "admin_features.overview.view"
                    },
                    {
                        "id": "users",
                        "title": "User Management",
                        "href": "/workspace/users",
                        "icon": "Users",
                        "permission": "users.view"
                    },
                    {
                        "id": "roles",
                        "title": "Role Management",
                        "href": "/workspace/roles",
                        "icon": "Shield",
                        "permission": "roles.view"
                    },
                    {
                        "id": "analytics",
                        "title": "Analytics",
                        "href": "/workspace/analytics",
                        "icon": "BarChart3",
                        "permission": "analytics.view"
                    },
                    {
                        "id": "api_monitoring",
                        "title": "API Monitoring",
                        "href": "/workspace/api-monitoring",
                        "icon": "Network",
                        "permission": "api_monitoring.view"
                    },
                    {
                        "id": "tools_management",
                        "title": "Tools Management",
                        "href": "/workspace/tools-management",
                        "icon": "Wrench",
                        "permission": "tools.view"
                    },
                    {
                        "id": "themes",
                        "title": "Theme Manager",
                        "href": "/workspace/themes",
                        "icon": "Palette",
                        "permission": "themes.view"
                    },
                    {
                        "id": "feedback",
                        "title": "Feedback",
                        "href": "/workspace/feedback",
                        "icon": "MessageSquare",
                        "permission": "feedback.view"
                    },
                    {
                        "id": "financials",
                        "title": "Financials",
                        "href": "/workspace/financials",
                        "icon": "CreditCard",
                        "permission": "financials.view"
                    },
                    {
                        "id": "marketing",
                        "title": "Marketing & Deals",
                        "href": "/workspace/marketing",
                        "icon": "TrendingUp",
                        "permission": "marketing.view"
                    },
                    {
                        "id": "affiliates",
                        "title": "Affiliates",
                        "href": "/workspace/affiliates",
                        "icon": "Users",
                        "permission": "affiliates.view"
                    },
                    {
                        "id": "blogging",
                        "title": "Blogging",
                        "href": "/workspace/blogging",
                        "icon": "FileText",
                        "permission": "blog.view"
                    },
                    {
                        "id": "collateral_management",
                        "title": "Collateral",
                        "href": "/workspace/collateral-management",
                        "icon": "GraduationCap",
                        "permission": "users.view"
                    },
                    {
                        "id": "admin_settings",
                        "title": "System Settings",
                        "href": "/workspace/system-settings",
                        "icon": "Settings",
                        "permission": "settings.view"
                    },
                    {
                        "id": "multi_language",
                        "title": "Multi-Language",
                        "href": "/workspace/multi-language",
                        "icon": "Globe",
                        "permission": "users.view"
                    },
                    {
                        "id": "multi_currency",
                        "title": "Multi-Currency",
                        "href": "/workspace/multi-currency",
                        "icon": "CircleDollarSign",
                        "permission": "users.view"
                    },
                    {
                        "id": "multi_location",
                        "title": "Multi-Location",
                        "href": "/workspace/multi-location",
                        "icon": "MapPin",
                        "permission": "users.view"
                    },
                    {
                        "id": "security",
                        "title": "Site Security",
                        "href": "/workspace/security",
                        "icon": "Lock",
                        "permission": "users.view"
                    }
                ]
            },
            {
                "id": "account",
                "title": "Account",
                "icon": "User",
                "items": [
                    {
                        "id": "account_overview",
                        "title": "Overview",
                        "href": "/workspace/account/overview",
                        "icon": "LayoutDashboard",
                        "permission": "account.overview.view"
                    },
                    {
                        "id": "profile",
                        "title": "Profile",
                        "href": "/workspace/profile",
                        "icon": "User",
                        "permission": "profile.view"
                    }
                ]
            }
        ],
        "quickActions": [
            {
                "id": "new_audit",
                "title": "New Site Audit",
                "href": "/workspace/site-audit?new=true",
                "icon": "Plus",
                "permission": "site_audit.create"
            }
        ]
    }
    
    # Superusers bypass permission filtering - they see everything
    # CRITICAL: Always include compliance for superusers
    if request.user.is_superuser:
        filtered_navigation = navigation_structure
        compliance_section = next((s for s in filtered_navigation.get('sections', []) if s.get('id') == 'compliance'), None)
        logger.error(f"🔴 SUPERUSER DETECTED - User: {request.user.username}, is_superuser: {request.user.is_superuser}")
        logger.error(f"🔴 Returning full navigation: {len(filtered_navigation.get('sections', []))} sections")
        if compliance_section:
            logger.error(f"✅ Compliance section found with {len(compliance_section.get('items', []))} items")
        else:
            logger.error("❌❌❌ COMPLIANCE SECTION NOT FOUND IN NAVIGATION STRUCTURE! ❌❌❌")
            logger.error(f"Available sections: {[s.get('id') for s in filtered_navigation.get('sections', [])]}")
    else:
        logger.error(f"🔴 NOT SUPERUSER - User: {request.user.username}, is_superuser: {request.user.is_superuser}")
        # Filter navigation by permissions for regular users
        filtered_navigation = filter_navigation_by_permissions(
            navigation_structure, 
            user_permissions_list
        )
        
        # Debug logging (remove in production)
        logger.debug(f"Filtered navigation sections: {len(filtered_navigation.get('sections', []))}")
        for section in filtered_navigation.get('sections', []):
            logger.debug(f"Section: {section.get('id')}, Items: {len(section.get('items', []))}")
            for item in section.get('items', []):
                logger.debug(f"  Item: {item.get('id')} ({item.get('title')}) - Permission: {item.get('permission')}")
    
    # CRITICAL: Log what's actually being returned
    sections_returned = [s.get('id') for s in filtered_navigation.get('sections', [])]
    logger.error(f"🔴🔴🔴 FINAL RESPONSE - Sections being returned: {sections_returned}")
    compliance_in_response = 'compliance' in sections_returned
    logger.error(f"🔴 Compliance in final response: {compliance_in_response}")
    if not compliance_in_response:
        logger.error(f"🔴🔴🔴 COMPLIANCE MISSING FROM FINAL RESPONSE! 🔴🔴🔴")
        logger.error(f"🔴 All sections in navigation_structure: {[s.get('id') for s in navigation_structure.get('sections', [])]}")
        logger.error(f"🔴 All sections in filtered_navigation: {sections_returned}")
    
    return Response(filtered_navigation)


@api_view(['GET'])
@permission_classes([IsAuthenticated, HasFeaturePermission('roles.view')])
def get_sidebar_matrix(request):
    """
    Get sidebar matrix showing View/Edit/Both access for all roles.
    
    Returns matrix data with permission breakdown per role per sidebar item.
    """
    from django.contrib.auth.models import Group
    from .permission_models import FeaturePermission
    
    # Get all roles (system + custom)
    # Define role order by seniority: Admin, Agency, Executive, Director, Manager, Analyst, Auditor, Viewer
    ROLE_ORDER = ['Admin', 'Agency', 'Executive', 'Director', 'Manager', 'Analyst', 'Auditor', 'Viewer']
    
    def role_sort_key(group):
        if group.name in ROLE_ORDER:
            return (0, ROLE_ORDER.index(group.name))
        return (1, group.name.lower())
    
    all_groups = sorted(Group.objects.all(), key=role_sort_key)
    
    # Get navigation structure (same as get_navigation)
    navigation_structure = {
        "sections": [
            {
                "id": "workspace",
                "title": "Workspace",
                "icon": "Home",
                "items": [
                    {
                        "id": "overview",
                        "title": "Home",
                        "href": "/workspace/home",
                        "icon": "LayoutDashboard",
                        "permission": "workspace.overview.view"
                    }
                ]
            },
            {
                "id": "compliance",
                "title": "Compliance",
                "icon": "ShieldCheck",
                "items": [
                    {
                        "id": "compliance_overview",
                        "title": "Overview",
                        "href": "/workspace/compliance/overview",
                        "icon": "LayoutDashboard",
                        "permission": "compliance.overview.view"
                    },
                    {
                        "id": "compliance_chat",
                        "title": "Chat",
                        "href": "/workspace/compliance/chat",
                        "icon": "MessageSquare",
                        "permission": "compliance.chat.view"
                    },
                    {
                        "id": "compliance_frameworks",
                        "title": "Frameworks",
                        "href": "/workspace/compliance/frameworks",
                        "icon": "ShieldCheck",
                        "permission": "compliance.frameworks.view"
                    },
                    {
                        "id": "compliance_controls",
                        "title": "Controls",
                        "href": "/workspace/compliance/controls",
                        "icon": "Shield",
                        "permission": "compliance.controls.view"
                    },
                    {
                        "id": "compliance_evidence",
                        "title": "Evidence",
                        "href": "/workspace/compliance/evidence",
                        "icon": "FileText",
                        "permission": "compliance.evidence.view"
                    },
                    {
                        "id": "compliance_policies",
                        "title": "Policies",
                        "href": "/workspace/compliance/policies",
                        "icon": "FileText",
                        "permission": "compliance.policies.view"
                    },
                    {
                        "id": "compliance_audits",
                        "title": "Audits",
                        "href": "/workspace/compliance/audits",
                        "icon": "Search",
                        "permission": "compliance.audits.view"
                    },
                    {
                        "id": "compliance_reports",
                        "title": "Reports",
                        "href": "/workspace/compliance/reports",
                        "icon": "BarChart3",
                        "permission": "compliance.reports.view"
                    },
                    {
                        "id": "compliance_tools",
                        "title": "Tools",
                        "href": "/workspace/compliance/tools",
                        "icon": "Settings",
                        "permission": "compliance.tools.view"
                    }
                ]
            },
            {
                "id": "user_features",
                "title": "My Tools",
                "icon": "Tool",
                "items": [
                    {
                        "id": "user_features_overview",
                        "title": "Overview",
                        "href": "/workspace/tools/overview",
                        "icon": "LayoutDashboard",
                        "permission": "user_features.overview.view"
                    },
                    {
                        "id": "site_audit",
                        "title": "Site Audit",
                        "href": "/workspace/site-audit",
                        "icon": "Search",
                        "permission": "site_audit.view"
                    },
                    {
                        "id": "performance",
                        "title": "Performance",
                        "href": "/workspace/performance",
                        "icon": "Gauge",
                        "permission": "performance.view"
                    },
                    {
                        "id": "monitoring",
                        "title": "Monitoring",
                        "href": "/workspace/monitoring",
                        "icon": "TrendingUp",
                        "permission": "monitoring.view"
                    },
                    {
                        "id": "reports",
                        "title": "Reports",
                        "href": "/workspace/reports",
                        "icon": "BarChart3",
                        "permission": "reports.view"
                    },
                    {
                        "id": "ai_health",
                        "title": "AI Monitoring",
                        "href": "/workspace/ai-health",
                        "icon": "Cpu",
                        "permission": "ai_health.view"
                    },
                    {
                        "id": "database_monitoring",
                        "title": "Database Monitoring",
                        "href": "/workspace/database-monitoring",
                        "icon": "Database",
                        "permission": "database_monitoring.view"
                    },
                    {
                        "id": "security_monitoring",
                        "title": "Security Monitoring",
                        "href": "/workspace/security-monitoring",
                        "icon": "Shield",
                        "permission": "security_monitoring.view"
                    },
                    {
                        "id": "security_audit",
                        "title": "Security Audit",
                        "href": "/workspace/security-audit",
                        "icon": "ShieldCheck",
                        "permission": "security_monitoring.view"
                    },
                    {
                        "id": "api_monitoring_user",
                        "title": "API Monitoring",
                        "href": "/workspace/api-monitoring-user",
                        "icon": "Network",
                        "permission": "api_monitoring_user.view"
                    },
                    {
                        "id": "seo_monitoring",
                        "title": "SEO Monitoring",
                        "href": "/workspace/seo-monitoring",
                        "icon": "Globe",
                        "permission": "seo_monitoring.view"
                    },
                    {
                        "id": "settings",
                        "title": "Settings",
                        "href": "/workspace/settings",
                        "icon": "Settings",
                        "permission": "profile.edit"
                    }
                ]
            },
            {
                "id": "collateral",
                "title": "Collateral",
                "icon": "GraduationCap",
                "items": [
                    {
                        "id": "collateral_overview",
                        "title": "Overview",
                        "href": "/workspace/collateral/overview",
                        "icon": "LayoutDashboard",
                        "permission": "collateral.overview.view"
                    },
                    {
                        "id": "collateral_main",
                        "title": "Learning & Resources",
                        "href": "/workspace/collateral",
                        "icon": "GraduationCap",
                        "permission": "collateral.view"
                    }
                ]
            },
            {
                "id": "integrations",
                "title": "Integrations",
                "icon": "Plug",
                "items": [
                    {
                        "id": "integrations_overview",
                        "title": "Overview",
                        "href": "/workspace/integrations/overview",
                        "icon": "LayoutDashboard",
                        "permission": "integrations.overview.view"
                    },
                    {
                        "id": "google_analytics",
                        "title": "Google Analytics",
                        "href": "/workspace/google-analytics",
                        "icon": "TrendingUp",
                        "permission": "google_analytics.view"
                    },
                    {
                        "id": "wordpress",
                        "title": "WordPress",
                        "href": "/workspace/wordpress",
                        "icon": "Package",
                        "permission": "wordpress.view"
                    },
                    {
                        "id": "communication",
                        "title": "Communication",
                        "href": "/workspace/communication",
                        "icon": "MessageSquare",
                        "permission": "communication.view"
                    }
                ]
            },
            {
                "id": "admin_features",
                "title": "Administration",
                "icon": "Shield",
                "permission": "users.view",
                "items": [
                    {
                        "id": "admin_overview",
                        "title": "Overview",
                        "href": "/workspace/admin-overview",
                        "icon": "LayoutDashboard",
                        "permission": "admin_features.overview.view"
                    },
                    {
                        "id": "users",
                        "title": "User Management",
                        "href": "/workspace/users",
                        "icon": "Users",
                        "permission": "users.view"
                    },
                    {
                        "id": "roles",
                        "title": "Role Management",
                        "href": "/workspace/roles",
                        "icon": "Shield",
                        "permission": "roles.view"
                    },
                    {
                        "id": "analytics",
                        "title": "Analytics",
                        "href": "/workspace/analytics",
                        "icon": "BarChart3",
                        "permission": "analytics.view"
                    },
                    {
                        "id": "api_monitoring",
                        "title": "API Monitoring",
                        "href": "/workspace/api-monitoring",
                        "icon": "Network",
                        "permission": "api_monitoring.view"
                    },
                    {
                        "id": "tools_management",
                        "title": "Tools Management",
                        "href": "/workspace/tools-management",
                        "icon": "Wrench",
                        "permission": "tools.view"
                    },
                    {
                        "id": "themes",
                        "title": "Theme Manager",
                        "href": "/workspace/themes",
                        "icon": "Palette",
                        "permission": "themes.view"
                    },
                    {
                        "id": "feedback",
                        "title": "Feedback",
                        "href": "/workspace/feedback",
                        "icon": "MessageSquare",
                        "permission": "feedback.view"
                    },
                    {
                        "id": "financials",
                        "title": "Financials",
                        "href": "/workspace/financials",
                        "icon": "CreditCard",
                        "permission": "financials.view"
                    },
                    {
                        "id": "marketing",
                        "title": "Marketing & Deals",
                        "href": "/workspace/marketing",
                        "icon": "TrendingUp",
                        "permission": "marketing.view"
                    },
                    {
                        "id": "affiliates",
                        "title": "Affiliates",
                        "href": "/workspace/affiliates",
                        "icon": "Users",
                        "permission": "affiliates.view"
                    },
                    {
                        "id": "blogging",
                        "title": "Blogging",
                        "href": "/workspace/blogging",
                        "icon": "FileText",
                        "permission": "blog.view"
                    },
                    {
                        "id": "collateral_management",
                        "title": "Collateral",
                        "href": "/workspace/collateral-management",
                        "icon": "GraduationCap",
                        "permission": "users.view"
                    },
                    {
                        "id": "admin_settings",
                        "title": "System Settings",
                        "href": "/workspace/system-settings",
                        "icon": "Settings",
                        "permission": "settings.view"
                    },
                    {
                        "id": "multi_language",
                        "title": "Multi-Language",
                        "href": "/workspace/multi-language",
                        "icon": "Globe",
                        "permission": "users.view"
                    },
                    {
                        "id": "multi_currency",
                        "title": "Multi-Currency",
                        "href": "/workspace/multi-currency",
                        "icon": "CircleDollarSign",
                        "permission": "users.view"
                    },
                    {
                        "id": "multi_location",
                        "title": "Multi-Location",
                        "href": "/workspace/multi-location",
                        "icon": "MapPin",
                        "permission": "users.view"
                    },
                    {
                        "id": "security",
                        "title": "Site Security",
                        "href": "/workspace/security",
                        "icon": "Lock",
                        "permission": "users.view"
                    }
                ]
            },
            {
                "id": "account",
                "title": "Account",
                "icon": "User",
                "items": [
                    {
                        "id": "account_overview",
                        "title": "Overview",
                        "href": "/workspace/account/overview",
                        "icon": "LayoutDashboard",
                        "permission": "account.overview.view"
                    },
                    {
                        "id": "profile",
                        "title": "Profile",
                        "href": "/workspace/profile",
                        "icon": "User",
                        "permission": "profile.view"
                    }
                ]
            }
        ]
    }
    
    # System roles that cannot be modified
    # Ordered by seniority: Admin, Agency, Executive, Director, Manager, Analyst, Auditor, Viewer
    SYSTEM_ROLES = ['Admin', 'Agency', 'Executive', 'Director', 'Manager', 'Analyst', 'Auditor', 'Viewer']
    
    # Build roles list
    roles_data = []
    for group in all_groups:
        roles_data.append({
            "id": group.id,
            "name": group.name,
            "is_system_role": group.name in SYSTEM_ROLES
        })
    
    # Build sidebar items with role access
    sidebar_items = []
    
    # Debug: Log compliance section processing
    import logging
    logger = logging.getLogger(__name__)
    compliance_section_found = False
    
    for section in navigation_structure.get('sections', []):
        if section.get('id') == 'compliance':
            compliance_section_found = True
            logger.info(f"Processing compliance section with {len(section.get('items', []))} items")
        
        for item in section.get('items', []):
            # Get required permissions for this item
            item_permission = item.get('permission', '')
            
            # Determine what permissions this item needs (view, create, edit, delete)
            required_permissions = {}
            if item_permission:
                # Base permission (e.g., "site_audit.view")
                base_code = item_permission.rsplit('.', 1)[0] if '.' in item_permission else item_permission
                
                # Check what permission types exist for this feature
                feature_perms = FeaturePermission.objects.filter(code__startswith=base_code + '.')
                for fp in feature_perms:
                    if '.view' in fp.code:
                        required_permissions['view'] = fp.code
                    elif '.create' in fp.code:
                        required_permissions['create'] = fp.code
                    elif '.edit' in fp.code:
                        required_permissions['edit'] = fp.code
                    elif '.delete' in fp.code:
                        required_permissions['delete'] = fp.code
                
                # If no feature perms found, use the base permission
                if not required_permissions:
                    required_permissions['view'] = item_permission
            
            # Get role access for this item
            role_access = {}
            for group in all_groups:
                # Get all permissions for this role
                role_perms = group.permissions.all()
                role_permission_codes = []
                
                for perm in role_perms:
                    try:
                        fp = FeaturePermission.objects.get(django_permission=perm)
                        role_permission_codes.append(fp.code)
                    except FeaturePermission.DoesNotExist:
                        # Fallback
                        code = perm.codename.replace('_', '.')
                        role_permission_codes.append(code)
                
                # Check which permissions this role has for this item
                access = {
                    "view": False,
                    "create": False,
                    "edit": False,
                    "delete": False
                }
                
                for perm_type, perm_code in required_permissions.items():
                    if perm_code in role_permission_codes:
                        access[perm_type] = True
                
                # Generate display value
                display_parts = []
                if access['view']:
                    display_parts.append('V')
                if access['create']:
                    display_parts.append('C')
                if access['edit']:
                    display_parts.append('E')
                if access['delete']:
                    display_parts.append('D')
                
                display = '+'.join(display_parts) if display_parts else '-'
                
                role_access[str(group.id)] = {
                    **access,
                    "display": display
                }
            
            sidebar_items.append({
                "id": item.get('id'),
                "title": item.get('title'),
                "section": section.get('id'),
                "section_title": section.get('title'),
                "required_permissions": required_permissions,
                "href": item.get('href'),
                "role_access": role_access
            })
            
            # Debug: Log compliance items
            if section.get('id') == 'compliance':
                logger.info(f"Added compliance item: {item.get('id')} ({item.get('title')}) with {len(required_permissions)} required permissions")
    
    # Debug: Verify compliance items were added
    compliance_items_count = len([item for item in sidebar_items if item.get('section') == 'compliance'])
    logger.info(f"Total compliance items in sidebar_items: {compliance_items_count}")
    if compliance_section_found and compliance_items_count == 0:
        logger.warning("Compliance section found but no items were added!")
    
    # Calculate summary
    summary = {
        "total_items": len(sidebar_items),
        "role_counts": {}
    }
    
    for group in all_groups:
        accessible_count = 0
        for item in sidebar_items:
            access = item['role_access'].get(str(group.id), {})
            if access.get('display') != '-':
                accessible_count += 1
        
        summary["role_counts"][str(group.id)] = accessible_count
    
    return Response({
        "roles": roles_data,
        "sidebar_items": sidebar_items,
        "summary": summary
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated, HasFeaturePermission('roles.edit')])
def update_sidebar_matrix(request):
    """
    Update permissions for a role based on matrix changes.
    Expects: { role_id, permission_codes: [] }
    Allows updates for both system and custom roles (permissions can be changed, but system roles cannot be renamed/deleted).
    """
    from django.contrib.auth.models import Group, Permission
    from django.db import transaction
    from .permission_models import FeaturePermission
    
    role_id = request.data.get('role_id')
    permission_codes = request.data.get('permission_codes', [])
    
    if not role_id:
        return Response(
            {'error': 'role_id is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        role = Group.objects.get(id=role_id)
        
        # System roles CAN have their permissions edited, they just can't be renamed or deleted
        # This is the correct behavior - permissions should be editable for all roles
        
        # Get all FeaturePermissions for the provided codes
        feature_perms = FeaturePermission.objects.filter(code__in=permission_codes)
        
        # Get Django Permission objects linked to these FeaturePermissions
        django_perms = []
        from django.contrib.contenttypes.models import ContentType
        
        # Get content type for FeaturePermission
        content_type = ContentType.objects.get_for_model(FeaturePermission)
        
        for fp in feature_perms:
            if fp.django_permission:
                django_perms.append(fp.django_permission)
            else:
                # If no linked permission, try to find or create it
                codename = fp.code.replace('.', '_')
                perm, _ = Permission.objects.get_or_create(
                    codename=codename,
                    content_type=content_type,
                    defaults={'name': fp.name}
                )
                fp.django_permission = perm
                fp.save()
                django_perms.append(perm)
        
        # Update role permissions
        with transaction.atomic():
            role.permissions.set(django_perms)
            role.refresh_from_db()
        
        # Return updated role data
        return Response({
            'message': 'Permissions updated successfully',
            'role_id': role.id,
            'role_name': role.name,
            'permission_count': len(django_perms)
        })
        
    except Group.DoesNotExist:
        return Response(
            {'error': f'Role with id {role_id} not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': f'Error updating role: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

