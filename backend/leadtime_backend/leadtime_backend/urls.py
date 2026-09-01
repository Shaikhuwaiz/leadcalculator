"""
URL configuration for leadtime_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
"""
from django.contrib import admin
from django.urls import path
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
    path("api/", api.urls),  # Django Ninja API - api.urls is a 3-tuple (patterns, app_name, namespace)
]

