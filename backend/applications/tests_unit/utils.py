from eventos.tests_unit.utils import create_event
from vacancies.models.vacancy import Vacancy
from vacancies.models.shifts import Shift
from applications.models.applications import Application

def create_application_with_shift(employee, employer, vacancy_state, job_type, category, event_state, event_name="Evento Test", vacancy_description="Vacante Test"):
    """
    Crea un Application con Vacancy y Shift asociados.
    
    Args:
        employee: instancia de EmployeeProfile o User con employee_profile.
        employer: instancia de User/EmployerProfile que será el dueño del evento.
        vacancy_state: instancia de VacancyState.
        job_type: instancia de JobType.
        category: instancia de Category.
        event_state: instancia de EventState.
        event_name: nombre del evento (opcional).
        vacancy_description: descripción de la vacante (opcional).
    
    Returns:
        tuple: (application, shift, vacancy, event)
    """
    
    # Crear evento
    event = create_event(
        owner=employer, 
        category=category, 
        state=event_state, 
        name=event_name, 
        description="Evento de prueba"
    )
    
    # Crear vacante
    vacancy = Vacancy.objects.create(
        event=event,
        job_type=job_type,
        state=vacancy_state,
        description=vacancy_description
    )
    
    # Crear shift
    shift = Shift.objects.create(
        vacancy=vacancy,
        start_date=event.start_date,
        end_date=event.end_date,
        start_time=event.start_time,
        end_time=event.end_time,
        payment=1500,
        quantity=1
    )
    
    # Crear application
    application = Application.objects.create(employee=employee.employee_profile, shift=shift)
    
    return application, shift, vacancy, event
