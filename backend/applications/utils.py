from vacancies.constants import JobTypesEnum


def get_job_type_display(vacancy):
    """
    Devuelve solo el nombre del job_type de la vacante.
    - Si el job_type es 'Otro', retorna specific_job_type
    - Si es normal, retorna job_type.name
    """
    job_type = vacancy.job_type
    if job_type.name == JobTypesEnum.OTRO.value:
        return vacancy.specific_job_type
    return job_type.name