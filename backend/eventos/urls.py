from django.urls import path
from .views import CreateEventView, EventDetailView, EventListView

urlpatterns = [
    path('create/', CreateEventView.as_view(), name='create-event'),
    path('list/', EventListView.as_view(), name='list-events'),
    path('<int:pk>/', EventDetailView.as_view(), name='event-detail'),
]
