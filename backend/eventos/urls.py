from django.urls import path
from eventos.views.event import CreateEventView, DeleteEventView, ListEventsByEmployerView, ListActiveEventsView, ListEventDetailView, ListEventVacanciesView, ListEventsWithVacanciesView, UpdateEventStateView, UpdateEventView
from eventos.views.category_events import ListCategoryView


urlpatterns = [

    # Eventos 
    path('create/', CreateEventView.as_view(), name='create-event'),
    path('categories/', ListCategoryView.as_view(), name='list-categories'),
    path('active/', ListActiveEventsView.as_view(), name='list-active-events'),
    path('update/<int:pk>/', UpdateEventView.as_view(), name='update-event'),
    path('update/<int:pk>/state/', UpdateEventStateView.as_view(), name='update-vacancy-state'),
    path('delete/<int:pk>/', DeleteEventView.as_view(), name='delete-event'),
    path('detail/<int:pk>/', ListEventDetailView.as_view(), name='detail-event'),
    path('vacancies/', ListEventVacanciesView.as_view(), name='event-vacancies'),
    path('by-employer/', ListEventsByEmployerView.as_view(), name='list-active-events-by-employer'),
    path('with-vacancies-availables/', ListEventsWithVacanciesView.as_view(), name='list-events-with-vacancies'),

]
