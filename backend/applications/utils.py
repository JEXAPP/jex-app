from vacancies.constants import JobTypesEnum


def get_job_type_display(vacancy):
    """
    Devuelve un diccionario con el job_type de la vacante.
    - Si el job_type es distinto de 'Otro' -> retorna {id, name}
    - Si el job_type es 'Otro' -> retorna {name: specific_job_type}
    """
    job_type = vacancy.job_type

    if job_type.name == JobTypesEnum.OTRO.value:
        return {"name": vacancy.specific_job_type}

    return {"id": job_type.id, "name": job_type.name}