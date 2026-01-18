"""
API Views for Compliance Controls
"""
import json
from pathlib import Path

from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from django.conf import settings
from .models import ComplianceControl, ComplianceControlFrameworkMapping
from .serializers import ComplianceControlSerializer, ComplianceControlListSerializer
from users.permission_classes import HasFeaturePermission


def _tokenize_question(question: str) -> list[str]:
    tokens = []
    for raw in question.lower().split():
        cleaned = "".join(ch for ch in raw if ch.isalnum())
        if len(cleaned) >= 3:
            tokens.append(cleaned)
    return tokens


def _score_text(text: str, tokens: list[str]) -> int:
    if not text or not tokens:
        return 0
    lowered = text.lower()
    score = 0
    for token in tokens:
        if token in lowered:
            score += 1
    return score


def _load_index_records(org_id: str | None):
    index_path = Path(settings.BASE_DIR) / "exports" / "compliance_index.jsonl"
    if not index_path.exists():
        return []
    records = []
    with index_path.open("r", encoding="utf-8") as fh:
        for line in fh:
            try:
                record = json.loads(line)
            except json.JSONDecodeError:
                continue
            metadata = record.get("metadata") or {}
            record_org = metadata.get("organization_id")
            if org_id and record_org and record_org != org_id:
                continue
            records.append(record)
    return records


@api_view(["POST"])
@permission_classes([IsAuthenticated, HasFeaturePermission("compliance.chat.view")])
def compliance_chat(request):
    question = (request.data.get("question") or "").strip()
    if not question:
        return Response({"error": "Question is required."}, status=status.HTTP_400_BAD_REQUEST)

    org_id = request.data.get("organization_id")
    tokens = _tokenize_question(question)
    records = _load_index_records(org_id)

    if not records:
        return Response(
            {
                "answer": "Compliance index is empty. Run export_compliance_index to generate it.",
                "detailed_answer": "",
                "matches": [],
            }
        )

    scored = []
    for record in records:
        text = f"{record.get('title', '')}\n{record.get('text', '')}"
        score = _score_text(text, tokens)
        if score > 0:
            scored.append((score, record))

    scored.sort(key=lambda item: item[0], reverse=True)
    top = scored[:8]

    matches = []
    for score, record in top:
        snippet = record.get("text", "")
        snippet = snippet[:240] + ("…" if len(snippet) > 240 else "")
        matches.append(
            {
                "type": record.get("type"),
                "title": record.get("title"),
                "score": score,
                "snippet": snippet,
                "detail": record.get("text", ""),
                "metadata": record.get("metadata", {}),
            }
        )

    if top:
        answer = "Select a result to view details."
    else:
        answer = "No relevant records found for that question."

    return Response(
        {
            "answer": answer,
            "detailed_answer": "",
            "matches": matches,
        }
    )


class ComplianceControlViewSet(viewsets.ModelViewSet):
    """
    ViewSet for ComplianceControl CRUD operations
    """
    queryset = ComplianceControl.objects.all().order_by('control_id')
    permission_classes = [IsAuthenticated, HasFeaturePermission('compliance.controls.view')]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ComplianceControlListSerializer
        return ComplianceControlSerializer
    
    def get_queryset(self):
        """Filter by organization_id if present (multi-tenancy)"""
        queryset = ComplianceControl.objects.all().order_by('control_id')
        
        # Filter by framework_id if provided
        framework_id = self.request.query_params.get('framework_id', None)
        if framework_id:
            mapping_ids = ComplianceControlFrameworkMapping.objects.filter(
                framework_id=framework_id
            ).values_list('control_id', flat=True)
            queryset = queryset.filter(id__in=mapping_ids)
        
        # Filter by status
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filter by severity
        severity_filter = self.request.query_params.get('severity', None)
        if severity_filter:
            queryset = queryset.filter(severity=severity_filter)
        
        # Search
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(control_id__icontains=search) |
                Q(name__icontains=search) |
                Q(description__icontains=search)
            )
        
        return queryset
    
    @action(detail=True, methods=['get'])
    def evidence(self, request, pk=None):
        """Get all evidence for a specific control"""
        control = self.get_object()
        from compliance_evidence.models import ComplianceEvidenceControlMapping
        from compliance_evidence.serializers import ComplianceEvidenceListSerializer
        
        mappings = ComplianceEvidenceControlMapping.objects.filter(control_id=control.id)
        evidence_ids = [mapping.evidence_id for mapping in mappings]
        
        from compliance_evidence.models import ComplianceEvidence
        evidence = ComplianceEvidence.objects.filter(id__in=evidence_ids)
        
        serializer = ComplianceEvidenceListSerializer(evidence, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_framework(self, request):
        """Get all controls for a specific framework"""
        framework_id = request.query_params.get('framework_id')
        if not framework_id:
            return Response(
                {'error': 'framework_id parameter is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        mappings = ComplianceControlFrameworkMapping.objects.filter(framework_id=framework_id)
        controls = [mapping.control for mapping in mappings]
        
        serializer = ComplianceControlListSerializer(controls, many=True)
        return Response(serializer.data)
