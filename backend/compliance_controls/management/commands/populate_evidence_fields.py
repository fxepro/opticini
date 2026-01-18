"""
Django management command to populate evidence_category and collection_method
from existing evidence_type data
"""
from django.core.management.base import BaseCommand
from compliance_controls.models import ControlEvidenceRequirement


class Command(BaseCommand):
    help = 'Populate evidence_category and collection_method from existing evidence_type data'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Preview changes without saving to database',
        )

    def handle(self, *args, **options):
        dry_run = options['dry_run']
        
        # Mapping from evidence_type to evidence_category
        # Note: policy_document is NOT evidence - it's a requirement
        # Manual uploads are evidence, categorized as 'document'
        evidence_category_mapping = {
            'tls_scan': 'tls_config',
            'dast': 'security_scan',
            'security_scan': 'security_scan',
            'config_scan': 'cloud_config',
            'system_log': 'system_log',
            'ai_monitor': 'access_log',
            'manual_upload': 'document',  # Manual uploads are document evidence
            'policy_document': 'document',  # Legacy: treat as document evidence (but policy docs belong in Policies app)
            'attestation': 'attestation',
        }
        
        # Mapping from evidence_type to collection_method
        automated_types = ['tls_scan', 'dast', 'security_scan', 'config_scan', 'system_log', 'ai_monitor']
        manual_types = ['manual_upload', 'policy_document', 'attestation']
        
        def get_collection_method(evidence_type):
            if evidence_type in automated_types:
                if evidence_type in ['system_log', 'ai_monitor']:
                    return 'automated_log'
                elif evidence_type in ['config_scan']:
                    return 'automated_config'
                else:
                    return 'automated_scan'
            elif evidence_type in manual_types:
                if evidence_type == 'attestation':
                    return 'manual_attestation'
                else:
                    return 'manual_upload'
            return 'manual_upload'
        
        # Get all requirements that need updating
        requirements = ControlEvidenceRequirement.objects.all()
        updated_count = 0
        
        for req in requirements:
            # Get evidence_category from mapping
            evidence_category = evidence_category_mapping.get(req.evidence_type, 'security_scan')
            
            # Get collection_method
            collection_method = get_collection_method(req.evidence_type)
            
            # Check if update is needed
            needs_update = False
            if not req.evidence_category or req.evidence_category != evidence_category:
                needs_update = True
            if not req.collection_method or req.collection_method != collection_method:
                needs_update = True
            
            if needs_update:
                if not dry_run:
                    req.evidence_category = evidence_category
                    req.collection_method = collection_method
                    req.save(update_fields=['evidence_category', 'collection_method'])
                
                updated_count += 1
                self.stdout.write(
                    f"{'[DRY RUN] ' if dry_run else ''}Updated {req.control.control_id}: "
                    f"evidence_type={req.evidence_type} -> "
                    f"evidence_category={evidence_category}, "
                    f"collection_method={collection_method}"
                )
        
        if dry_run:
            self.stdout.write(self.style.WARNING(f'\nDRY RUN: Would update {updated_count} requirements'))
        else:
            self.stdout.write(self.style.SUCCESS(f'\nSuccessfully updated {updated_count} requirements'))

