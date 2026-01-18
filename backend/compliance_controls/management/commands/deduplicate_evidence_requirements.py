"""
Deduplicate evidence requirements in the YAML file
"""
import yaml
import os
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = 'Remove duplicate evidence requirements from YAML file'

    def handle(self, *args, **options):
        file_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))),
            'compliance_controls', 'data', 'soc2-evidence-requirements.yaml'
        )
        
        with open(file_path, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f)
        
        requirements = data['evidence_requirements']
        
        # Deduplicate based on (control_id, evidence_type, source_app)
        seen = {}
        unique_requirements = []
        duplicates_removed = 0
        
        for req in requirements:
            key = (
                req['control_id'],
                req['evidence_type'],
                req.get('source_app', '')
            )
            
            if key not in seen:
                seen[key] = req
                unique_requirements.append(req)
            else:
                duplicates_removed += 1
                self.stdout.write(
                    self.style.WARNING(
                        f"Removed duplicate: {req['control_id']} - {req['evidence_type']} ({req.get('source_app', 'N/A')})"
                    )
                )
        
        # Update data
        data['evidence_requirements'] = unique_requirements
        
        # Write back
        with open(file_path, 'w', encoding='utf-8') as f:
            yaml.dump(data, f, default_flow_style=False, sort_keys=False, allow_unicode=True)
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Removed {duplicates_removed} duplicates. '
                f'Total unique requirements: {len(unique_requirements)}'
            )
        )

