    
from django.urls import path

from vacancies.views.job_types import ListJobTypesView
from vacancies.views.vacancy import CreateVacancyView, EmployerEventsWithVacanciesView, ListVacancyShiftView, SearchVacancyView, UpdateVacancyView, VacancyDetailView
from vacancies.views.vacancy_state import UpdateVacancyStateView, VacancyStateListView

urlpatterns = [ 
    path('create/', CreateVacancyView.as_view(), name='create-vacancy'),
    path('<int:pk>/edit/', UpdateVacancyView.as_view(), name='edit-vacancy'),
    path('<int:pk>/details', VacancyDetailView.as_view(), name='get-vacancy'),
    path('list/', ListVacancyShiftView.as_view(), name='list-vacancies'),
    # path('list/?category=soon'). RUTA DISPONIBLE
    # path('list/?category=interests'). RUTA DISPONIBLE
    # path('list/?category=nearby'). RUTA DISPONIBLE
    path('search/', SearchVacancyView.as_view(), name='search-vacancies'),
    # path('api/search/?choice=event&value=Tomorrowland') RUTA DISPONIBLE
    # path('api/search/?choice=start_date&value=30/07/2025') RUTA DISPONIBLE
    # path('api/search/?choice=role&value=Camarero') RUTA DISPONIBLE
    path('job-types/', ListJobTypesView.as_view(), name='list-job-types'),
    path('by-employer/', EmployerEventsWithVacanciesView.as_view(), name='vacantes-por-evento'),
    path('<int:pk>/state/', UpdateVacancyStateView.as_view(), name='update-vacancy-state'),
    path('vacancy-states/', VacancyStateListView.as_view(), name='vacancy-states-list')
]