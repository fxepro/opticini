"""
Django management command to load compliance frameworks from authoritative sources
"""
import yaml
import os
from django.core.management.base import BaseCommand, CommandError
from django.conf import settings
from compliance_frameworks.models import ComplianceFramework


class Command(BaseCommand):
    help = 'Load compliance frameworks from authoritative data sources (YAML file)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--file',
            type=str,
            default='compliance_frameworks/data/frameworks.yaml',
            help='Path to YAML file containing framework data (relative to app directory)',
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Preview changes without saving to database',
        )
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing frameworks before loading (use with caution)',
        )

    def handle(self, *args, **options):
        file_path = options['file']
        dry_run = options['dry_run']
        clear_existing = options['clear']

        # Get the app directory
        app_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
        full_path = os.path.join(app_dir, file_path)

        if not os.path.exists(full_path):
            raise CommandError(f'Framework data file not found: {full_path}')

        self.stdout.write(self.style.SUCCESS(f'Loading frameworks from: {full_path}'))

        # Clear existing frameworks if requested
        if clear_existing:
            if dry_run:
                count = ComplianceFramework.objects.count()
                self.stdout.write(self.style.WARNING(f'[DRY RUN] Would delete {count} existing frameworks'))
            else:
                count = ComplianceFramework.objects.count()
                ComplianceFramework.objects.all().delete()
                self.stdout.write(self.style.WARNING(f'Deleted {count} existing frameworks'))

        # Load YAML file
        try:
            with open(full_path, 'r', encoding='utf-8') as f:
                data = yaml.safe_load(f)
        except yaml.YAMLError as e:
            raise CommandError(f'Error parsing YAML file: {e}')
        except Exception as e:
            raise CommandError(f'Error reading file: {e}')

        if 'frameworks' not in data:
            raise CommandError('YAML file must contain a "frameworks" key')

        frameworks_data = data['frameworks']
        if not isinstance(frameworks_data, list):
            raise CommandError('"frameworks" must be a list')

        created_count = 0
        updated_count = 0
        errors = []

        for framework_data in frameworks_data:
            try:
                # Validate required fields
                required_fields = ['name', 'code', 'category']
                for field in required_fields:
                    if field not in framework_data:
                        errors.append(f"Framework missing required field '{field}'")
                        continue

                # Prepare framework data (only include fields that exist in model)
                framework_fields = {
                    'name': framework_data['name'],
                    'code': framework_data['code'],
                    'category': framework_data['category'],
                    'description': framework_data.get('description', ''),
                    'icon': framework_data.get('icon', ''),
                    'enabled': framework_data.get('enabled', True),
                    'status': framework_data.get('status', 'not_started'),
                }

                # Set default metrics (will be updated when controls are loaded)
                framework_fields['compliance_score'] = 0
                framework_fields['total_controls'] = 0
                framework_fields['passing_controls'] = 0
                framework_fields['failing_controls'] = 0
                framework_fields['not_evaluated_controls'] = 0

                if dry_run:
                    # Check if framework exists
                    exists = ComplianceFramework.objects.filter(code=framework_fields['code']).exists()
                    if exists:
                        self.stdout.write(
                            self.style.WARNING(f'[DRY RUN] Would update: {framework_fields["name"]} ({framework_fields["code"]})')
                        )
                        updated_count += 1
                    else:
                        self.stdout.write(
                            self.style.SUCCESS(f'[DRY RUN] Would create: {framework_fields["name"]} ({framework_fields["code"]})')
                        )
                        created_count += 1
                else:
                    # Create or update framework
                    framework, created = ComplianceFramework.objects.update_or_create(
                        code=framework_fields['code'],
                        defaults=framework_fields
                    )
                    if created:
                        created_count += 1
                        self.stdout.write(
                            self.style.SUCCESS(f'Created: {framework.name} ({framework.code})')
                        )
                    else:
                        updated_count += 1
                        self.stdout.write(
                            self.style.WARNING(f'Updated: {framework.name} ({framework.code})')
                        )

            except Exception as e:
                error_msg = f"Error processing framework '{framework_data.get('name', 'Unknown')}': {str(e)}"
                errors.append(error_msg)
                self.stdout.write(self.style.ERROR(error_msg))

        # Summary
        self.stdout.write('')
        if dry_run:
            self.stdout.write(
                self.style.SUCCESS(
                    f'[DRY RUN] Would create {created_count} frameworks, update {updated_count} frameworks'
                )
            )
        else:
            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully loaded frameworks: {created_count} created, {updated_count} updated'
                )
            )

        if errors:
            self.stdout.write('')
            self.stdout.write(self.style.ERROR(f'Errors encountered: {len(errors)}'))
            for error in errors:
                self.stdout.write(self.style.ERROR(f'  - {error}'))

