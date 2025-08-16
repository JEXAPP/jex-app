from django.urls import path
from applications.views.applications import ApplicationCreateView

urlpatterns = [
    # Applications
    path('apply/', ApplicationCreateView.as_view(), name='apply'),   
]