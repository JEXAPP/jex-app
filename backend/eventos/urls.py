from django.urls import path
from eventos.views.event import CreateEventView
from eventos.views.vacancy import CreateVacancyView, ListVacancyShiftView
from eventos.views.category_events import ListCategoryView
from eventos.views.job_types import ListJobTypesView
from eventos.views.list_vacancy import EventVacanciesView

urlpatterns = [

    # Esta configurado para que se pueda listar la cantidade que se quiera de esta manera

    # vacancies/list/?limit=5&offset=0. Si no se especifica, trae 10!
    # Eventos 
    path('events/create/', CreateEventView.as_view(), name='create-event'),
    path('events/categories/', ListCategoryView.as_view(), name='list-categories'),

    # Vacantes 
    path('vacancies/create/', CreateVacancyView.as_view(), name='create-vacancy'),
    path('vacancies/list/', ListVacancyShiftView.as_view(), name='list-vacancies'),
    # path('vacancies/list/?category=soon'). RUTA DISPONIBLE
    # path('vacancies/list/?category=interests'). RUTA DISPONIBLE
    path('vacancies/job-types/', ListJobTypesView.as_view(), name='list-job-types'),
    path('vacancies/by-employer/<int:event_id>/', EventVacanciesView.as_view(), name='vacantes-por-evento'),

]
