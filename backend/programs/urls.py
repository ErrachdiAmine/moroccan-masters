from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProgramViewSet, 
    ChecklistItemViewSet, 
    legacy_stats_view, 
    legacy_requests_view,
    ai_evaluate_eligibility,
    ai_generate_sop,
    ai_chat_assistant
)

router = DefaultRouter()
router.register(r'programs', ProgramViewSet, basename='program')
router.register(r'checklist', ChecklistItemViewSet, basename='checklist')

urlpatterns = [
    path('stats/', legacy_stats_view),
    path('requests/', legacy_requests_view),
    path('ai/evaluate_eligibility/', ai_evaluate_eligibility),
    path('ai/generate_sop/', ai_generate_sop),
    path('ai/chat/', ai_chat_assistant),
    path('', include(router.urls)),
]
