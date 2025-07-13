from django.urls import path
from .views import CreateEventView, EventDetailView, EventListView, UpcomingEventsView

urlpatterns = [
    path('create/', CreateEventView.as_view(), name='create-event'),
    path('list/', EventListView.as_view(), name='list-events'),
    path('list/upcoming', UpcomingEventsView.as_view(), name='upcoming-events'),
    path('list/<int:pk>/', EventDetailView.as_view(), name='event-detail'),
]
