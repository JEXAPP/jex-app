from django.urls import path
from eventos.views.event import CreateEventView, DeleteEventView, ListActiveEventsView, ListEventDetailView, ListEventVacanciesView, UpdateEventView
from eventos.views.category_events import ListCategoryView


urlpatterns = [

    # Eventos 
    path('create/', CreateEventView.as_view(), name='create-event'),
    path('categories/', ListCategoryView.as_view(), name='list-categories'),
    path('active/', ListActiveEventsView.as_view(), name='list-active-events'),
    path('delete/<int:pk>/', DeleteEventView.as_view(), name='delete-event'),
    path('update/<int:pk>/', UpdateEventView.as_view(), name='update-event'),
    path('detail/<int:pk>/', ListEventDetailView.as_view(), name='detail-event'),
    path('<int:pk>/vacancies/', ListEventVacanciesView.as_view(), name='event-vacancies'),

]
