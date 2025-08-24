from django.urls import path
from applications.views.applications import ApplicationCreateView, ListApplicationsByShiftView

urlpatterns = [
    # Applications
    path('apply/', ApplicationCreateView.as_view(), name='apply'),   
    path(
        "by-vacancy/<int:vacancy_pk>/shift/<int:shift_pk>/", ListApplicationsByShiftView.as_view(), name="applications-by-shift"),
]