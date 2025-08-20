from django.urls import path
from eventos.views.event import CreateEventView, ListActiveEventsView
from eventos.views.category_events import ListCategoryView


urlpatterns = [

    # Eventos 
    path('create/', CreateEventView.as_view(), name='create-event'),
    path('categories/', ListCategoryView.as_view(), name='list-categories'),
    path('active/', ListActiveEventsView.as_view(), name='list-active-events'),
]
