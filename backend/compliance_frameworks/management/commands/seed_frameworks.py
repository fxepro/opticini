"""
Management command to seed initial compliance frameworks
"""
from django.core.management.base import BaseCommand
from compliance_frameworks.models import ComplianceFramework
from django.utils import timezone
from datetime import timedelta


class Command(BaseCommand):
    help = 'Seed initial compliance frameworks'

    def handle(self, *args, **options):
        frameworks_data = [
            {
                'name': 'SOC 2 Type I',
                'code': 'SOC2-T1',
                'category': 'security',
                'description': 'Service Organization Control 2 Type I - Point in time assessment',
                'icon': 'ShieldCheck',
                'enabled': True,
                'status': 'in_progress',
                'compliance_score': 68,
                'total_controls': 67,
                'passing_controls': 45,
                'failing_controls': 12,
                'not_evaluated_controls': 10,
                'last_evaluated': timezone.now() - timedelta(days=20),
                'next_audit_date': timezone.now() + timedelta(days=180),
            },
            {
                'name': 'SOC 2 Type II',
                'code': 'SOC2-T2',
                'category': 'security',
                'description': 'Service Organization Control 2 Type II - Period of time assessment',
                'icon': 'ShieldCheck',
                'enabled': True,
                'status': 'in_progress',
                'compliance_score': 72,
                'total_controls': 67,
                'passing_controls': 48,
                'failing_controls': 10,
                'not_evaluated_controls': 9,
                'last_evaluated': timezone.now() - timedelta(days=20),
                'next_audit_date': timezone.now() + timedelta(days=180),
            },
            {
                'name': 'ISO 27001',
                'code': 'ISO27001',
                'category': 'security',
                'description': 'Information Security Management System',
                'icon': 'Shield',
                'enabled': True,
                'status': 'in_progress',
                'compliance_score': 55,
                'total_controls': 114,
                'passing_controls': 63,
                'failing_controls': 28,
                'not_evaluated_controls': 23,
                'last_evaluated': timezone.now() - timedelta(days=25),
                'next_audit_date': timezone.now() + timedelta(days=150),
            },
            {
                'name': 'GDPR',
                'code': 'GDPR',
                'category': 'privacy',
                'description': 'General Data Protection Regulation',
                'icon': 'Lock',
                'enabled': True,
                'status': 'ready',
                'compliance_score': 85,
                'total_controls': 45,
                'passing_controls': 38,
                'failing_controls': 4,
                'not_evaluated_controls': 3,
                'last_evaluated': timezone.now() - timedelta(days=10),
                'next_audit_date': timezone.now() + timedelta(days=200),
            },
            {
                'name': 'HIPAA',
                'code': 'HIPAA',
                'category': 'industry',
                'description': 'Health Insurance Portability and Accountability Act',
                'icon': 'Heart',
                'enabled': True,
                'status': 'at_risk',
                'compliance_score': 42,
                'total_controls': 78,
                'passing_controls': 33,
                'failing_controls': 25,
                'not_evaluated_controls': 20,
                'last_evaluated': timezone.now() - timedelta(days=45),
                'next_audit_date': timezone.now() + timedelta(days=90),
            },
            {
                'name': 'PCI DSS',
                'code': 'PCI-DSS',
                'category': 'industry',
                'description': 'Payment Card Industry Data Security Standard',
                'icon': 'CreditCard',
                'enabled': True,
                'status': 'in_progress',
                'compliance_score': 60,
                'total_controls': 52,
                'passing_controls': 31,
                'failing_controls': 12,
                'not_evaluated_controls': 9,
                'last_evaluated': timezone.now() - timedelta(days=15),
                'next_audit_date': timezone.now() + timedelta(days=120),
            },
            {
                'name': 'NIST 800-53',
                'code': 'NIST-800-53',
                'category': 'security',
                'description': 'NIST Security and Privacy Controls',
                'icon': 'Shield',
                'enabled': True,
                'status': 'not_started',
                'compliance_score': 0,
                'total_controls': 200,
                'passing_controls': 0,
                'failing_controls': 0,
                'not_evaluated_controls': 200,
                'last_evaluated': None,
                'next_audit_date': timezone.now() + timedelta(days=365),
            },
            {
                'name': 'CIS Controls',
                'code': 'CIS',
                'category': 'security',
                'description': 'Center for Internet Security Critical Security Controls',
                'icon': 'ShieldCheck',
                'enabled': True,
                'status': 'ready',
                'compliance_score': 78,
                'total_controls': 18,
                'passing_controls': 14,
                'failing_controls': 2,
                'not_evaluated_controls': 2,
                'last_evaluated': timezone.now() - timedelta(days=5),
                'next_audit_date': timezone.now() + timedelta(days=180),
            },
        ]

        created_count = 0
        updated_count = 0

        for framework_data in frameworks_data:
            framework, created = ComplianceFramework.objects.update_or_create(
                code=framework_data['code'],
                defaults=framework_data
            )
            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f'Created: {framework.name}'))
            else:
                updated_count += 1
                self.stdout.write(self.style.WARNING(f'Updated: {framework.name}'))

        self.stdout.write(
            self.style.SUCCESS(
                f'\nSuccessfully seeded frameworks: {created_count} created, {updated_count} updated'
            )
        )

