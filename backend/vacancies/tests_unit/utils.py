from datetime import timedelta

def create_vacancy_data(event, job_type, state=None, specific_job_type=None):
    """
    Genera un diccionario con los datos de una vacante listo para POST.
    - event: instancia de Event
    - job_type: instancia de JobType
    - state: instancia de VacancyState (opcional)
    """
    state_id = state.id if state else None

    # Turnos dinámicos: dentro del rango del evento
    shifts = []
    num_days = (event.end_date - event.start_date).days + 1
    for i, qty in enumerate([2, 3]):
        day_offset = i % num_days
        shift_date = event.start_date + timedelta(days=day_offset)
        shifts.append({
            "start_date": shift_date.strftime("%d/%m/%Y"),
            "end_date": shift_date.strftime("%d/%m/%Y"),
            "start_time": event.start_time.strftime("%H:%M"),
            "end_time": event.end_time.strftime("%H:%M"),
            "payment": "1500.00",
            "quantity": qty
        })

    requirements = [
        {"description": "Experiencia mínima 2 años"},
        {"description": "Disponibilidad nocturna"}
    ]

    return {
        "description": "Camarero para concierto",
        "event": event.id,
        "job_type": job_type.id,
        "specific_job_type": specific_job_type,
        "state": state_id,
        "shifts": shifts,
        "requirements": requirements
    }