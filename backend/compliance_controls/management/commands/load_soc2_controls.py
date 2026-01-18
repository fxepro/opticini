"""
Django management command to load SOC 2 controls from authoritative sources
"""
import yaml
import os
from django.core.management.base import BaseCommand, CommandError
from compliance_controls.models import ComplianceControl, ComplianceControlFrameworkMapping
from compliance_frameworks.models import ComplianceFramework


class Command(BaseCommand):
    help = 'Load SOC 2 controls from authoritative data sources (YAML file)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--file',
            type=str,
            default='compliance_controls/data/soc2-controls.yaml',
            help='Path to YAML file containing control data (relative to app directory)',
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Preview changes without saving to database',
        )
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing SOC 2 controls before loading (use with caution)',
        )

    def handle(self, *args, **options):
        file_path = options['file']
        dry_run = options['dry_run']
        clear_existing = options['clear']

        # Get the app directory (compliance_controls)
        app_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
        # If file_path is relative, join with app_dir; otherwise use as-is
        if os.path.isabs(file_path):
            full_path = file_path
        else:
            full_path = os.path.join(app_dir, file_path)

        if not os.path.exists(full_path):
            raise CommandError(f'Control data file not found: {full_path}')

        self.stdout.write(self.style.SUCCESS(f'Loading SOC 2 controls from: {full_path}'))

        # Get SOC 2 frameworks
        soc2_frameworks = ComplianceFramework.objects.filter(code__in=['SOC2-T1', 'SOC2-T2'])
        if not soc2_frameworks.exists():
            raise CommandError('SOC 2 frameworks (SOC2-T1, SOC2-T2) not found. Please load frameworks first.')

        framework_map = {fw.code: fw for fw in soc2_frameworks}

        # Clear existing SOC 2 controls if requested
        if clear_existing:
            if dry_run:
                # Count controls that would be deleted
                soc2_control_ids = ComplianceControlFrameworkMapping.objects.filter(
                    framework_id__in=[fw.id for fw in soc2_frameworks]
                ).values_list('control_id', flat=True)
                count = ComplianceControl.objects.filter(id__in=soc2_control_ids).count()
                self.stdout.write(self.style.WARNING(f'[DRY RUN] Would delete {count} existing SOC 2 controls'))
            else:
                # Delete controls mapped to SOC 2 frameworks
                soc2_control_ids = ComplianceControlFrameworkMapping.objects.filter(
                    framework_id__in=[fw.id for fw in soc2_frameworks]
                ).values_list('control_id', flat=True)
                count = ComplianceControl.objects.filter(id__in=soc2_control_ids).count()
                ComplianceControl.objects.filter(id__in=soc2_control_ids).delete()
                self.stdout.write(self.style.WARNING(f'Deleted {count} existing SOC 2 controls'))

        # Load YAML file
        try:
            with open(full_path, 'r', encoding='utf-8') as f:
                data = yaml.safe_load(f)
        except yaml.YAMLError as e:
            raise CommandError(f'Error parsing YAML file: {e}')
        except Exception as e:
            raise CommandError(f'Error reading file: {e}')

        if 'controls' not in data:
            raise CommandError('YAML file must contain a "controls" key')

        controls_data = data['controls']
        if not isinstance(controls_data, list):
            raise CommandError('"controls" must be a list')

        created_count = 0
        updated_count = 0
        mappings_created = 0
        errors = []

        for control_data in controls_data:
            try:
                # Validate required fields
                required_fields = ['control_id', 'name', 'description', 'category']
                for field in required_fields:
                    if field not in control_data:
                        errors.append(f"Control missing required field '{field}': {control_data.get('control_id', 'Unknown')}")
                        continue

                # Prepare control data
                control_fields = {
                    'control_id': control_data['control_id'],
                    'name': control_data['name'],
                    'description': control_data['description'],
                    'category': control_data['category'],
                    'control_type': control_data.get('control_type', 'preventive'),
                    'severity': control_data.get('severity', 'medium'),
                    'evaluation_method': control_data.get('evaluation_method', 'hybrid'),
                    'frequency': control_data.get('frequency', 'continuous'),
                    'status': 'not_evaluated',  # Default status
                }

                # Get frameworks for this control
                framework_codes = control_data.get('frameworks', ['SOC2-T1', 'SOC2-T2'])
                frameworks_to_map = [framework_map[code] for code in framework_codes if code in framework_map]

                if not frameworks_to_map:
                    errors.append(f"Control {control_data['control_id']} has no valid framework mappings")
                    continue

                if dry_run:
                    # Check if control exists
                    exists = ComplianceControl.objects.filter(control_id=control_fields['control_id']).exists()
                    control_id = control_fields['control_id']
                    control_name = control_fields['name']
                    if exists:
                        self.stdout.write(
                            self.style.WARNING(f'[DRY RUN] Would update: {control_id} - {control_name}')
                        )
                        updated_count += 1
                    else:
                        self.stdout.write(
                            self.style.SUCCESS(f'[DRY RUN] Would create: {control_id} - {control_name}')
                        )
                        created_count += 1
                    
                    # Count mappings
                    mappings_created += len(frameworks_to_map)
                else:
                    # Create or update control
                    control, created = ComplianceControl.objects.update_or_create(
                        control_id=control_fields['control_id'],
                        defaults=control_fields
                    )
                    if created:
                        created_count += 1
                        self.stdout.write(
                            self.style.SUCCESS(f'Created: {control.control_id} - {control.name}')
                        )
                    else:
                        updated_count += 1
                        self.stdout.write(
                            self.style.WARNING(f'Updated: {control.control_id} - {control.name}')
                        )

                    # Create framework mappings
                    for framework in frameworks_to_map:
                        mapping, mapping_created = ComplianceControlFrameworkMapping.objects.update_or_create(
                            control=control,
                            framework_id=framework.id,
                            defaults={
                                'framework_name': framework.name,
                            }
                        )
                        if mapping_created:
                            mappings_created += 1

            except Exception as e:
                error_msg = f"Error processing control '{control_data.get('control_id', 'Unknown')}': {str(e)}"
                errors.append(error_msg)
                self.stdout.write(self.style.ERROR(error_msg))

        # Update framework metrics
        if not dry_run:
            for framework in soc2_frameworks:
                # Count controls for this framework
                control_count = ComplianceControlFrameworkMapping.objects.filter(
                    framework_id=framework.id
                ).count()
                
                # Update framework metrics
                framework.total_controls = control_count
                framework.not_evaluated_controls = control_count
                framework.passing_controls = 0
                framework.failing_controls = 0
                framework.save()
                
                self.stdout.write(
                    self.style.SUCCESS(f'Updated {framework.name}: {control_count} controls')
                )

        # Summary
        self.stdout.write('')
        if dry_run:
            self.stdout.write(
                self.style.SUCCESS(
                    f'[DRY RUN] Would create {created_count} controls, update {updated_count} controls, create {mappings_created} mappings'
                )
            )
        else:
            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully loaded controls: {created_count} created, {updated_count} updated, {mappings_created} mappings created'
                )
            )

        if errors:
            self.stdout.write('')
            self.stdout.write(self.style.ERROR(f'Errors encountered: {len(errors)}'))
            for error in errors[:10]:  # Show first 10 errors
                self.stdout.write(self.style.ERROR(f'  - {error}'))
            if len(errors) > 10:
                self.stdout.write(self.style.ERROR(f'  ... and {len(errors) - 10} more errors'))

