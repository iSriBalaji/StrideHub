# Person ↔ User link: Person.user (OneToOne to auth.User, reverse: user.person)

from django.urls import path
from .views import home_view, current_user_view
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

# --- Added imports for new endpoints ---
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from django.db.models import Q, Sum
from .models import Engagement, Utilization, Person  # Role, Project implicit via relations

# drf-spectacular (optional)
try:
    from drf_spectacular.utils import extend_schema
except ImportError:
    def extend_schema(*a, **k):
        def _w(f): return f
        return _w

# --- New endpoint: Person Overview (role + active engagements/projects) ---
@extend_schema(
    summary="Current person overview",
    description="Returns the authenticated person's role and all active engagements (current projects + role_on_project).",
    responses={200: dict},
)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def person_overview(request):
    user = request.user
    if not hasattr(user, "person"):
        return Response({"error": "No Person profile linked to this user."}, status=400)
    person: Person = user.person
    today = timezone.now().date()
    # Active = current date within [start_date, end_date] (inclusive); end_date NULL => still active
    engagements = (
        Engagement.objects
        .select_related("project_id")
        .filter(
            Q(person_id=person) &
            Q(start_date__lte=today) &
            (Q(end_date__isnull=True) | Q(end_date__gte=today))
        )
        .order_by("project_id__project_name")
    )

    engagements_payload = [
        {
            "project_id": e.project_id.project_id,
            "project_name": e.project_id.project_name,
            "role_on_project": e.role_on_project,
            "start_date": e.start_date,
            "end_date": e.end_date,
        }
        for e in engagements
    ]

    role = person.role_id
    payload = {
        "employee_id": person.employee_id,
        "username": user.username,
        "role": {
            "role_id": role.role_id if role else None,
            "role_name": role.role_name if role else None,
            "role_description": role.role_description if role else None,
        },
        "active_project_count": len(engagements_payload),
        "active_engagements": engagements_payload,
    }
    return Response(payload)

# --- New endpoint: Utilization stats (last 8 weeks) ---
@extend_schema(
    summary="Current person utilization stats",
    description="Returns utilization stats for the authenticated person over the last 8 weeks: weekly totals, type breakdown, total hours.",
    responses={200: dict},
)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def person_utilization(request):
    user = request.user
    if not hasattr(user, "person"):
        return Response({"error": "No Person profile linked to this user."}, status=400)
    person: Person = user.person
    today = timezone.now().date()
    window_end = today
    window_start = today - timedelta(weeks=8)

    qs = (
        Utilization.objects
        .select_related("utilization_type_id")
        .filter(person_id=person, week_start_date__gte=window_start, week_start_date__lte=window_end)
    )

    weekly = (
        qs.values("week_start_date")
        .annotate(total_hours=Sum("hours"))
        .order_by("week_start_date")
    )
    weekly_payload = [
        {"week_start_date": w["week_start_date"], "total_hours": float(w["total_hours"] or 0)}
        for w in weekly
    ]

    breakdown = (
        qs.values("utilization_type_id__utilization_type_name")
        .annotate(hours=Sum("hours"))
        .order_by("utilization_type_id__utilization_type_name")
    )
    breakdown_payload = [
        {"type": b["utilization_type_id__utilization_type_name"], "hours": float(b["hours"] or 0)}
        for b in breakdown
    ]

    total_hours_window = float(sum(w["total_hours"] for w in weekly))

    payload = {
        "employee_id": person.employee_id,
        "window_start": window_start,
        "window_end": window_end,
        "total_hours_window": total_hours_window,
        "weeks": weekly_payload,
        "breakdown_by_type": breakdown_payload,
    }
    return Response(payload)

urlpatterns = [
    path('home/', home_view, name='api-home'),  # Now DRF @api_view so it appears in schema
    path('auth/me/', current_user_view, name='api-auth-me'),
    path('person/overview/', person_overview, name='person-overview'),          # added
    path('person/utilization/', person_utilization, name='person-utilization'), # added
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
