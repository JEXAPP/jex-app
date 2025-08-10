from django.urls import path
from eventos.views.applications import ApplicationCreateView
from eventos.views.event import CreateEventView
from eventos.views.vacancy import CreateVacancyView, ListVacancyShiftView, SearchVacancyView, UpdateVacancyView, VacancyDetailView
from eventos.views.category_events import ListCategoryView
from eventos.views.job_types import ListJobTypesView
from eventos.views.vacancy import EmployerEventsWithVacanciesView
from eventos.views.vacancy_state import UpdateVacancyStateView, VacancyStateListView


urlpatterns = [

    # Esta configurado para que se pueda listar la cantidade que se quiera de esta manera

    # vacancies/list/?limit=5&offset=0. Si no se especifica, trae 10!
    # Eventos 
    path('events/create/', CreateEventView.as_view(), name='create-event'),
    path('events/categories/', ListCategoryView.as_view(), name='list-categories'),

    # Vacantes 
    path('vacancies/create/', CreateVacancyView.as_view(), name='create-vacancy'),
    path('vacancies/<int:pk>/edit/', UpdateVacancyView.as_view(), name='edit-vacancy'),
    path('vacancies/list/', ListVacancyShiftView.as_view(), name='list-vacancies'),
    path('vacancies/<int:pk>/details', VacancyDetailView.as_view(), name='get-vacancy'),
    # path('vacancies/list/?category=soon'). RUTA DISPONIBLE
    # path('vacancies/list/?category=interests'). RUTA DISPONIBLE
    # path('vacancies/list/?category=nearby'). RUTA DISPONIBLE
    path('vacancies/search/', SearchVacancyView.as_view(), name='search-vacancies'),
    # path('api/vacancies/search/?choice=event&value=Tomorrowland') RUTA DISPONIBLE
    # path('api/vacancies/search/?choice=start_date&value=30/07/2025') RUTA DISPONIBLE
    # path('api/vacancies/search/?choice=role&value=Camarero') RUTA DISPONIBLE
    path('vacancies/job-types/', ListJobTypesView.as_view(), name='list-job-types'),
    path('vacancies/by-employer/', EmployerEventsWithVacanciesView.as_view(), name='vacantes-por-evento'),
    path('vacancies/<int:pk>/state/', UpdateVacancyStateView.as_view(), name='update-vacancy-state'),
    path('vacancy-states/', VacancyStateListView.as_view(), name='vacancy-states-list'),
    # Applications
    path('applications/apply/', ApplicationCreateView.as_view(), name='apply'),
    

]
