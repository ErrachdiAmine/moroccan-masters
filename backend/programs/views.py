from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django.db.models import Q
import datetime

from .models import Program, ChecklistItem
from .serializers import ProgramSerializer, ChecklistItemSerializer
from .scraper_service import run_morocco_scraper
from .detail_extractor import extract_program_details
from .local_ai_service import (
    ai_evaluate_eligibility as evaluate_ai, 
    ai_generate_sop as generate_sop_ai, 
    ai_chat_assistant as chat_ai
)

class ProgramViewSet(viewsets.ModelViewSet):
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        search = self.request.query_params.get('search', None)
        city = self.request.query_params.get('city', None)
        spec = self.request.query_params.get('specialization', None)
        source = self.request.query_params.get('source', None)
        is_saved = self.request.query_params.get('is_saved', None)

        if search:
            qs = qs.filter(
                Q(title__icontains=search) | 
                Q(university__icontains=search) | 
                Q(city__icontains=search) |
                Q(specialization__icontains=search)
            )
        if city and city != 'ALL':
            qs = qs.filter(city__iexact=city)
        if spec and spec != 'ALL':
            qs = qs.filter(specialization__iexact=spec)
        if source and source != 'ALL':
            qs = qs.filter(source__icontains=source)
        if is_saved is not None:
            qs = qs.filter(is_saved=is_saved.lower() == 'true')
        return qs

    @action(detail=False, methods=['post'])
    def trigger_scrape(self, request):
        count = run_morocco_scraper()
        return Response({"status": "success", "new_items": count, "message": f"Successfully scraped {count} new Master listings."})

    @action(detail=False, methods=['get'])
    def summary_stats(self, request):
        today = datetime.date(2026, 8, 31)
        total_programs = Program.objects.count()
        closing_soon = Program.objects.filter(deadline__gte=today, deadline__lte=today + datetime.timedelta(days=15)).count()
        saved_count = Program.objects.filter(is_saved=True).count()
        
        total_checklist = ChecklistItem.objects.count()
        done_checklist = ChecklistItem.objects.filter(is_completed=True).count()
        readiness_pct = int((done_checklist / total_checklist * 100)) if total_checklist > 0 else 0

        return Response({
            "total_programs": total_programs,
            "closing_soon": closing_soon,
            "saved_count": saved_count,
            "dossier_readiness": readiness_pct,
            "checklist_completed": done_checklist,
            "checklist_total": total_checklist
        })

    @action(detail=True, methods=['get'])
    def fetch_details(self, request, pk=None):
        program = self.get_object()
        details = extract_program_details(program.portal_url, program.title, program.university, program.city, program.specialization)
        return Response(details)


class ChecklistItemViewSet(viewsets.ModelViewSet):
    queryset = ChecklistItem.objects.all()
    serializer_class = ChecklistItemSerializer

    @action(detail=True, methods=['post'])
    def toggle(self, request, pk=None):
        item = self.get_object()
        item.is_completed = not item.is_completed
        item.save()
        return Response(ChecklistItemSerializer(item).data)


@api_view(['POST'])
def ai_evaluate_eligibility(request):
    data = request.data or {}
    gpa = data.get('gpa', 13.5)
    mentions = data.get('mentions', 2)
    retakes = data.get('retakes', 0)
    target_title = data.get('program_title', 'Master in Applied Linguistics')
    target_univ = data.get('university', 'FLSH Rabat')
    
    result = evaluate_ai(gpa, mentions, retakes, target_title, target_univ)
    return Response(result)

@api_view(['POST'])
def ai_generate_sop(request):
    data = request.data or {}
    name = data.get('candidate_name', 'Student')
    target_title = data.get('program_title', 'Master in Applied Linguistics')
    target_univ = data.get('university', 'FLSH Rabat')
    interest = data.get('research_interest', 'TEFL and Educational Methodology')
    
    sop_text = generate_sop_ai(name, target_title, target_univ, interest)
    return Response({"sop_text": sop_text, "model": "Omniroute Alucard"})

@api_view(['POST'])
def ai_chat_assistant(request):
    data = request.data or {}
    user_msg = data.get('message', 'What documents are required for master concours?')
    reply = chat_ai(user_msg)
    return Response({"response": reply, "model": "Omniroute Alucard"})


@api_view(['GET'])
def legacy_stats_view(request):
    today = datetime.date(2026, 8, 31)
    total_programs = Program.objects.count()
    closing_soon = Program.objects.filter(deadline__gte=today, deadline__lte=today + datetime.timedelta(days=15)).count()
    saved_count = Program.objects.filter(is_saved=True).count()
    
    total_checklist = ChecklistItem.objects.count()
    done_checklist = ChecklistItem.objects.filter(is_completed=True).count()
    readiness_pct = int((done_checklist / total_checklist * 100)) if total_checklist > 0 else 0

    return Response({
        "total_programs": total_programs,
        "closing_soon": closing_soon,
        "saved_count": saved_count,
        "dossier_readiness": readiness_pct,
        "checklist_completed": done_checklist,
        "checklist_total": total_checklist
    })

@api_view(['GET', 'POST'])
def legacy_requests_view(request):
    return Response({"status": "ok", "message": "Requests API active", "results": []})
