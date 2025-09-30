from django.http import JsonResponse
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.db import transaction

from .serializers import UserSerializer

try:
    from drf_spectacular.utils import extend_schema
except ImportError:
    # Fallback no-op decorator if drf-spectacular not installed
    def extend_schema(*args, **kwargs):
        def _wrap(fn):
            return fn
        return _wrap

@extend_schema(
    summary="Health / Welcome endpoint",
    description="Returns a simple status payload for the StrideHub API root (home).",
    responses={200: dict},
)
@api_view(["GET"])
@permission_classes([AllowAny])
def home_view(request):
    """
    Simple public endpoint to confirm API is running.
    """
    return Response({
        "message": "StrideHub API is running",
        "authenticated": request.user.is_authenticated,
    })

@extend_schema(
    summary="Current authenticated user",
    responses={200: UserSerializer},
)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def current_user_view(request):
    return Response(UserSerializer(request.user).data)
