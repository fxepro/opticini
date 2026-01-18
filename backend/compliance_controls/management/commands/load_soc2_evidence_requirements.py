"""
Django management command to load SOC 2 evidence requirements
"""
import yaml
import os
from django.core.management.base import BaseCommand, CommandError
from compliance_controls.models import ComplianceControl, ControlEvidenceRequirement, ComplianceControlFrameworkMapping
from compliance_frameworks.models import ComplianceFramework


class Command(BaseCommand):
    help = 'Load SOC 2 evidence requirements from YAML file'

    def add_arguments(self, parser):
        parser.add_argument(
            '--file',
            type=str,
            default='compliance_controls/data/soc2-evidence-requirements.yaml',
            help='Path to YAML file containing evidence requirements (relative to app directory)',
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Preview changes without saving to database',
        )
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing SOC 2 evidence requirements before loading (use with caution)',
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
            raise CommandError(f'Evidence requirements file not found: {full_path}')

        self.stdout.write(self.style.SUCCESS(f'Loading SOC 2 evidence requirements from: {full_path}'))

        # Clear existing evidence requirements if requested
        if clear_existing:
            # Get all SOC 2 controls by finding controls mapped to SOC 2 frameworks
            soc2_frameworks = ComplianceFramework.objects.filter(code__in=['SOC2-T1', 'SOC2-T2'])
            if soc2_frameworks.exists():
                soc2_control_ids = ComplianceControlFrameworkMapping.objects.filter(
                    framework_id__in=[fw.id for fw in soc2_frameworks]
                ).values_list('control_id', flat=True)
                soc2_controls = ComplianceControl.objects.filter(id__in=soc2_control_ids)
            else:
                soc2_controls = ComplianceControl.objects.none()
            if dry_run:
                count = ControlEvidenceRequirement.objects.filter(
                    control__in=soc2_controls
                ).count()
                self.stdout.write(self.style.WARNING(f'[DRY RUN] Would delete {count} existing evidence requirements'))
            else:
                count = ControlEvidenceRequirement.objects.filter(
                    control__in=soc2_controls
                ).count()
                ControlEvidenceRequirement.objects.filter(control__in=soc2_controls).delete()
                self.stdout.write(self.style.WARNING(f'Deleted {count} existing evidence requirements'))

        # Load YAML file
        try:
            with open(full_path, 'r', encoding='utf-8') as f:
                data = yaml.safe_load(f)
        except yaml.YAMLError as e:
            raise CommandError(f'Error parsing YAML file: {e}')
        except Exception as e:
            raise CommandError(f'Error reading file: {e}')

        if 'evidence_requirements' not in data:
            raise CommandError('YAML file must contain a top-level "evidence_requirements" key.')

        evidence_requirements_data = data['evidence_requirements']
        created_count = 0
        updated_count = 0
        skipped_count = 0

        for req_data in evidence_requirements_data:
            control_id = req_data.get('control_id')
            if not control_id:
                self.stdout.write(self.style.WARNING(f'Skipping requirement with missing control_id'))
                skipped_count += 1
                continue

            # Find the control
            try:
                control = ComplianceControl.objects.get(control_id=control_id)
            except ComplianceControl.DoesNotExist:
                self.stdout.write(
                    self.style.WARNING(f'Control {control_id} not found. Skipping evidence requirement.')
                )
                skipped_count += 1
                continue
            except ComplianceControl.MultipleObjectsReturned:
                self.stdout.write(
                    self.style.WARNING(f'Multiple controls found for {control_id}. Skipping evidence requirement.')
                )
                skipped_count += 1
                continue

            # Prepare evidence requirement data
            evidence_type = req_data.get('evidence_type')
            if not evidence_type:
                self.stdout.write(
                    self.style.WARNING(f'Evidence requirement for {control_id} missing evidence_type. Skipping.')
                )
                skipped_count += 1
                continue

            # Validate evidence_type is in choices
            valid_types = [choice[0] for choice in ControlEvidenceRequirement.EVIDENCE_TYPE_CHOICES]
            if evidence_type not in valid_types:
                self.stdout.write(
                    self.style.WARNING(
                        f'Invalid evidence_type "{evidence_type}" for {control_id}. '
                        f'Valid types: {", ".join(valid_types)}. Skipping.'
                    )
                )
                skipped_count += 1
                continue

            requirement_fields = {
                'control': control,
                'evidence_type': evidence_type,
                'source_app': req_data.get('source_app', ''),
                'freshness_days': req_data.get('freshness_days', 30),
                'required': req_data.get('required', True),
                'description': req_data.get('description', ''),
            }

            if dry_run:
                # Check if requirement exists
                exists = ControlEvidenceRequirement.objects.filter(
                    control=control,
                    evidence_type=evidence_type,
                    source_app=requirement_fields['source_app']
                ).exists()
                if exists:
                    self.stdout.write(
                        self.style.WARNING(
                            f'[DRY RUN] Would update: {control_id} - {evidence_type} '
                            f'({requirement_fields["source_app"]})'
                        )
                    )
                    updated_count += 1
                else:
                    self.stdout.write(
                        self.style.SUCCESS(
                            f'[DRY RUN] Would create: {control_id} - {evidence_type} '
                            f'({requirement_fields["source_app"]})'
                        )
                    )
                    created_count += 1
            else:
                requirement, created = ControlEvidenceRequirement.objects.update_or_create(
                    control=control,
                    evidence_type=evidence_type,
                    source_app=requirement_fields['source_app'],
                    defaults={
                        'freshness_days': requirement_fields['freshness_days'],
                        'required': requirement_fields['required'],
                        'description': requirement_fields['description'],
                    }
                )
                if created:
                    created_count += 1
                    self.stdout.write(
                        self.style.SUCCESS(
                            f'Created: {control_id} - {evidence_type} ({requirement_fields["source_app"]})'
                        )
                    )
                else:
                    updated_count += 1
                    self.stdout.write(
                        self.style.WARNING(
                            f'Updated: {control_id} - {evidence_type} ({requirement_fields["source_app"]})'
                        )
                    )

        self.stdout.write(
            self.style.SUCCESS(
                f'\nSuccessfully loaded evidence requirements: '
                f'{created_count} created, {updated_count} updated, {skipped_count} skipped'
            )
        )

