"""
URL configuration for stridehub project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    # Helps editors with autocompletion once installed.
    from drf_spectacular.views import (  # type: ignore
        SpectacularAPIView,
        SpectacularSwaggerView,
        SpectacularRedocView,
    )

try:
    # Requires: pip install drf-spectacular
    from drf_spectacular.views import (
        SpectacularAPIView,
        SpectacularSwaggerView,
        SpectacularRedocView,
    )
    _SPECTACULAR_AVAILABLE = True
except ImportError:
    _SPECTACULAR_AVAILABLE = False  # Install to enable /docs and /redoc

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('home.api_urls')),
    path('api-auth/', include('rest_framework.urls')),
]

if _SPECTACULAR_AVAILABLE:
    urlpatterns += [
        path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
        path("docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
        path("redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
    ]

# NOTE:
# If /api/home is not in the docs, ensure its view is a DRF view:
# Example:
# from rest_framework.decorators import api_view
# @api_view(["GET"])
# def home_view(request):
#     return Response({"status": "ok"})
# Only DRF-based views appear in the schema.
# After updating, revisit /api/schema/ or /docs.
