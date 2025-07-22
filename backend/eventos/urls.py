from django.urls import path
from eventos.views.event import CreateEventView, EventDetailView, EventListView, UpcomingEventsView
from eventos.views.vacancy import CreateVacancyView
from eventos.views.category_events import CategoryListView
from eventos.views.job_types import JobTypeListView

urlpatterns = [

    # Eventos 
    path('events/create/', CreateEventView.as_view(), name='create-event'),
    path('events/categories/', CategoryListView.as_view(), name='list-categories'),
    path('events/list/', EventListView.as_view(), name='list-events'), # No corregido todavia
    path('events/list/upcoming/', UpcomingEventsView.as_view(), name='upcoming-events'), # No corregido todavia
    path('events/list/<int:pk>/', EventDetailView.as_view(), name='event-detail'), # No corregido todavia

    # Vacantes 
    path('vacancies/create/', CreateVacancyView.as_view(), name='create-vacancy'),
    # path('vacancies/list/', VacancyListView.as_view(), name='list-vacancies'),
    path('vacancies/job-types/', JobTypeListView.as_view(), name='list-job-types'),

]
