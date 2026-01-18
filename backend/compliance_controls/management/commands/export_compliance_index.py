"""
Export compliance data to a JSONL file for indexing.

Usage:
    python manage.py export_compliance_index
    python manage.py export_compliance_index --output backend/exports/compliance_index.jsonl
    python manage.py export_compliance_index --org-id <uuid>
    python manage.py export_compliance_index --max-text 4000
"""

import json
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand

from compliance_frameworks.models import ComplianceFramework
from compliance_controls.models import (
    ComplianceControl,
    ComplianceControlFrameworkMapping,
    ControlEvidenceRequirement,
)
from compliance_evidence.models import ComplianceEvidence, ComplianceEvidenceControlMapping
from compliance_policies.models import CompliancePolicy, CompliancePolicyVersion
from compliance_audits.models import ComplianceAudit, ComplianceAuditFinding
from compliance_reports.models import ComplianceReport


def truncate_text(value: str, limit: int) -> str:
    if not value:
        return ""
    if len(value) <= limit:
        return value
    return value[: limit - 1] + "…"


def model_has_org(model) -> bool:
    return any(field.name == "organization_id" for field in model._meta.fields)


def filter_by_org(qs, model, org_id):
    if not org_id or not model_has_org(model):
        return qs
    return qs.filter(organization_id=org_id)


class Command(BaseCommand):
    help = "Export compliance database tables into JSONL for indexing"

    def add_arguments(self, parser):
        parser.add_argument(
            "--output",
            default=None,
            help="Output JSONL path (default: backend/exports/compliance_index.jsonl)",
        )
        parser.add_argument(
            "--org-id",
            default=None,
            help="Optional organization UUID to filter tenant data",
        )
        parser.add_argument(
            "--max-text",
            type=int,
            default=4000,
            help="Max characters per record text",
        )

    def handle(self, *args, **options):
        output_path = options["output"]
        org_id = options["org_id"]
        max_text = options["max_text"]

        if output_path:
            output_file = Path(output_path)
        else:
            output_file = Path(settings.BASE_DIR) / "exports" / "compliance_index.jsonl"

        output_file.parent.mkdir(parents=True, exist_ok=True)

        counts = {
            "frameworks": 0,
            "controls": 0,
            "evidence_requirements": 0,
            "evidence": 0,
            "policies": 0,
            "policy_versions": 0,
            "audits": 0,
            "findings": 0,
            "reports": 0,
        }

        with output_file.open("w", encoding="utf-8") as fh:
            # Frameworks
            frameworks = filter_by_org(ComplianceFramework.objects.all(), ComplianceFramework, org_id)
            for fw in frameworks:
                text = "\n".join(
                    [
                        f"Framework: {fw.name}",
                        f"Code: {fw.code}",
                        f"Category: {fw.category}",
                        f"Status: {fw.status}",
                        f"Enabled: {fw.enabled}",
                        f"Description: {fw.description or ''}",
                        f"Compliance score: {fw.compliance_score}",
                        f"Controls: total={fw.total_controls}, pass={fw.passing_controls}, fail={fw.failing_controls}, not_evaluated={fw.not_evaluated_controls}",
                        f"Last evaluated: {fw.last_evaluated or ''}",
                        f"Next audit date: {fw.next_audit_date or ''}",
                    ]
                )
                record = {
                    "type": "framework",
                    "id": str(fw.id),
                    "title": f"{fw.name} ({fw.code})",
                    "text": truncate_text(text, max_text),
                    "metadata": {
                        "code": fw.code,
                        "category": fw.category,
                        "status": fw.status,
                        "enabled": fw.enabled,
                        "organization_id": str(fw.organization_id) if fw.organization_id else None,
                    },
                }
                fh.write(json.dumps(record, ensure_ascii=False) + "\n")
                counts["frameworks"] += 1

            # Controls + evidence requirements
            controls = filter_by_org(
                ComplianceControl.objects.all().prefetch_related("evidence_requirements", "framework_mappings"),
                ComplianceControl,
                org_id,
            )
            for control in controls:
                frameworks_list = [
                    mapping.framework_name for mapping in control.framework_mappings.all()
                ]
                requirement_summaries = []
                for req in control.evidence_requirements.all():
                    requirement_summaries.append(
                        f"{req.evidence_type} ({req.source_app or 'Unknown'}) - {req.description or ''}".strip()
                    )
                text = "\n".join(
                    [
                        f"Control: {control.control_id} - {control.name}",
                        f"Description: {control.description}",
                        f"Category: {control.category or ''}",
                        f"Type: {control.control_type}",
                        f"Severity: {control.severity}",
                        f"Status: {control.status}",
                        f"Evaluation method: {control.evaluation_method}",
                        f"Frequency: {control.frequency}",
                        f"Failure reason: {control.failure_reason or ''}",
                        f"Recommendations: {', '.join(control.fix_recommendations or [])}",
                        f"Frameworks: {', '.join(frameworks_list)}",
                        f"Evidence requirements: {', '.join(requirement_summaries)}",
                    ]
                )
                record = {
                    "type": "control",
                    "id": str(control.id),
                    "title": f"{control.control_id} - {control.name}",
                    "text": truncate_text(text, max_text),
                    "metadata": {
                        "control_id": control.control_id,
                        "status": control.status,
                        "severity": control.severity,
                        "frameworks": frameworks_list,
                        "organization_id": str(control.organization_id) if control.organization_id else None,
                    },
                }
                fh.write(json.dumps(record, ensure_ascii=False) + "\n")
                counts["controls"] += 1

                for req in control.evidence_requirements.all():
                    req_text = "\n".join(
                        [
                            f"Control: {control.control_id} - {control.name}",
                            f"Evidence type: {req.evidence_type}",
                            f"Source app: {req.source_app or ''}",
                            f"Collection method: {req.collection_method or ''}",
                            f"Evidence category: {req.evidence_category or ''}",
                            f"Freshness (days): {req.freshness_days}",
                            f"Required: {req.required}",
                            f"Description: {req.description or ''}",
                        ]
                    )
                    record = {
                        "type": "evidence_requirement",
                        "id": str(req.id),
                        "title": f"{control.control_id} evidence requirement",
                        "text": truncate_text(req_text, max_text),
                        "metadata": {
                            "control_id": control.control_id,
                            "evidence_type": req.evidence_type,
                            "collection_method": req.collection_method,
                            "evidence_category": req.evidence_category,
                            "source_app": req.source_app,
                            "organization_id": str(req.organization_id) if req.organization_id else None,
                        },
                    }
                    fh.write(json.dumps(record, ensure_ascii=False) + "\n")
                    counts["evidence_requirements"] += 1

            # Evidence
            evidence_qs = filter_by_org(
                ComplianceEvidence.objects.all().prefetch_related("control_mappings"),
                ComplianceEvidence,
                org_id,
            )
            for evidence in evidence_qs:
                controls_list = [mapping.control_name for mapping in evidence.control_mappings.all()]
                frameworks_list = [mapping.framework_name for mapping in evidence.control_mappings.all()]
                text = "\n".join(
                    [
                        f"Evidence: {evidence.evidence_id} - {evidence.name}",
                        f"Description: {evidence.description or ''}",
                        f"Source: {evidence.source} / {evidence.source_type} / {evidence.source_name}",
                        f"Status: {evidence.status}",
                        f"Category: {evidence.category or ''}",
                        f"Tags: {', '.join(evidence.tags or [])}",
                        f"Controls: {', '.join(controls_list)}",
                        f"Frameworks: {', '.join(frameworks_list)}",
                        f"Content: {evidence.content or ''}",
                    ]
                )
                record = {
                    "type": "evidence",
                    "id": str(evidence.id),
                    "title": f"{evidence.evidence_id} - {evidence.name}",
                    "text": truncate_text(text, max_text),
                    "metadata": {
                        "evidence_id": evidence.evidence_id,
                        "source": evidence.source,
                        "source_type": evidence.source_type,
                        "status": evidence.status,
                        "file_url": evidence.file_url,
                        "organization_id": str(evidence.organization_id) if evidence.organization_id else None,
                    },
                }
                fh.write(json.dumps(record, ensure_ascii=False) + "\n")
                counts["evidence"] += 1

            # Policies + versions
            policies = filter_by_org(CompliancePolicy.objects.all().prefetch_related("versions"), CompliancePolicy, org_id)
            for policy in policies:
                text = "\n".join(
                    [
                        f"Policy: {policy.policy_id} - {policy.name}",
                        f"Description: {policy.description or ''}",
                        f"Type: {policy.type} ({policy.category or ''})",
                        f"Status: {policy.status} / Approval: {policy.approval_status}",
                        f"Version: {policy.version}",
                        f"Summary: {policy.summary or ''}",
                        f"Content: {policy.content or ''}",
                    ]
                )
                record = {
                    "type": "policy",
                    "id": str(policy.id),
                    "title": f"{policy.policy_id} - {policy.name}",
                    "text": truncate_text(text, max_text),
                    "metadata": {
                        "policy_id": policy.policy_id,
                        "type": policy.type,
                        "status": policy.status,
                        "approval_status": policy.approval_status,
                        "organization_id": str(policy.organization_id) if policy.organization_id else None,
                    },
                }
                fh.write(json.dumps(record, ensure_ascii=False) + "\n")
                counts["policies"] += 1

                for version in policy.versions.all():
                    version_text = "\n".join(
                        [
                            f"Policy: {policy.policy_id} - {policy.name}",
                            f"Version: {version.version}",
                            f"Summary: {version.summary or ''}",
                            f"Changes: {version.changes or ''}",
                            f"Content: {version.content or ''}",
                        ]
                    )
                    record = {
                        "type": "policy_version",
                        "id": str(version.id),
                        "title": f"{policy.policy_id} v{version.version}",
                        "text": truncate_text(version_text, max_text),
                        "metadata": {
                            "policy_id": policy.policy_id,
                            "version": version.version,
                            "organization_id": str(policy.organization_id) if policy.organization_id else None,
                        },
                    }
                    fh.write(json.dumps(record, ensure_ascii=False) + "\n")
                    counts["policy_versions"] += 1

            # Audits + findings
            audits = filter_by_org(ComplianceAudit.objects.all().prefetch_related("findings"), ComplianceAudit, org_id)
            for audit in audits:
                text = "\n".join(
                    [
                        f"Audit: {audit.audit_id} - {audit.name}",
                        f"Description: {audit.description or ''}",
                        f"Type: {audit.type}",
                        f"Status: {audit.status}",
                        f"Summary: {audit.summary or ''}",
                        f"Conclusion: {audit.conclusion or ''}",
                        f"Controls: total={audit.total_controls}, pass={audit.controls_passed}, fail={audit.controls_failed}, partial={audit.controls_partial}, not_evaluated={audit.controls_not_evaluated}",
                        f"Findings: {audit.findings_count} (critical={audit.critical_findings}, high={audit.high_findings}, medium={audit.medium_findings}, low={audit.low_findings})",
                    ]
                )
                record = {
                    "type": "audit",
                    "id": str(audit.id),
                    "title": f"{audit.audit_id} - {audit.name}",
                    "text": truncate_text(text, max_text),
                    "metadata": {
                        "audit_id": audit.audit_id,
                        "type": audit.type,
                        "status": audit.status,
                        "organization_id": str(audit.organization_id) if audit.organization_id else None,
                    },
                }
                fh.write(json.dumps(record, ensure_ascii=False) + "\n")
                counts["audits"] += 1

                for finding in audit.findings.all():
                    finding_text = "\n".join(
                        [
                            f"Audit: {audit.audit_id} - {audit.name}",
                            f"Finding: {finding.finding_id} - {finding.title}",
                            f"Severity: {finding.severity}",
                            f"Status: {finding.status}",
                            f"Description: {finding.description}",
                            f"Remediation: {finding.remediation_plan or ''}",
                            f"Control: {finding.control_name or ''}",
                            f"Framework: {finding.framework_name or ''}",
                        ]
                    )
                    record = {
                        "type": "audit_finding",
                        "id": str(finding.id),
                        "title": f"{finding.finding_id} - {finding.title}",
                        "text": truncate_text(finding_text, max_text),
                        "metadata": {
                            "audit_id": audit.audit_id,
                            "severity": finding.severity,
                            "status": finding.status,
                            "organization_id": str(audit.organization_id) if audit.organization_id else None,
                        },
                    }
                    fh.write(json.dumps(record, ensure_ascii=False) + "\n")
                    counts["findings"] += 1

            # Reports
            reports = filter_by_org(ComplianceReport.objects.all(), ComplianceReport, org_id)
            for report in reports:
                text = "\n".join(
                    [
                        f"Report: {report.report_id} - {report.name}",
                        f"Description: {report.description or ''}",
                        f"Type: {report.type}",
                        f"Status: {report.status}",
                        f"View: {report.view}",
                        f"Summary: {json.dumps(report.summary, ensure_ascii=False)}",
                    ]
                )
                record = {
                    "type": "report",
                    "id": str(report.id),
                    "title": f"{report.report_id} - {report.name}",
                    "text": truncate_text(text, max_text),
                    "metadata": {
                        "report_id": report.report_id,
                        "type": report.type,
                        "status": report.status,
                        "organization_id": str(report.organization_id) if report.organization_id else None,
                    },
                }
                fh.write(json.dumps(record, ensure_ascii=False) + "\n")
                counts["reports"] += 1

        self.stdout.write(self.style.SUCCESS(f"Exported compliance index to: {output_file}"))
        for key, value in counts.items():
            self.stdout.write(f"  {key}: {value}")
