"""
URL configuration for leadtime_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from api.views import api

def test(request):
    return JsonResponse({"status": "ok"})

def root(request):
    return JsonResponse({"message": "Welcome to Lead Calculator API", "endpoints": ["/api/leadtime", "/test/", "/admin/"]})

# Django URL patterns
urlpatterns = [
    path("", root),
    path("admin/", admin.site.urls),
    path("test/", test),
]

# Add Django Ninja API routes
# api.urls is a tuple: (patterns, app_name, namespace)
# We need to manually add the patterns with the "api/" prefix
api_patterns, api_name, api_namespace = api.urls
urlpatterns += [
    path("api/", include((api_patterns, api_name), namespace=api_namespace))
]


