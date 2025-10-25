from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

def custom_exception_handler(exc, context):
    """
    Handler global personalizado que transforma todos los errores al formato {error: message}
    """
    # Llama al exception handler por defecto de DRF
    response = exception_handler(exc, context)
    
    if response is not None:
        # Extrae el primer error y lo transforma al formato deseado
        error_message = extract_first_error_message(response.data)
                
        # Respuesta transformada
        custom_response_data = {"error": error_message}
        response.data = custom_response_data
    
    return response

def extract_first_error_message(data):
    """
    Extrae el primer mensaje de error de cualquier estructura de DRF
    
    Maneja casos como:
    - [{"shifts": "error message"}]                    -> "error message"
    - {"field_name": ["error message"]}               -> "error message" 
    - ["simple error"]                                -> "simple error"
    - "direct string error"                           -> "direct string error"
    - {"non_field_errors": ["global error"]}          -> "global error"
    - {"field1": ["error1"], "field2": ["error2"]}    -> "error1"
    """
    
    # Caso 1: Lista de objetos [{"campo": "error"}]
    if isinstance(data, list):
        if len(data) > 0:
            first_item = data[0]
            if isinstance(first_item, dict):
                # [{"shifts": "error message"}]
                return extract_from_dict(first_item)
            else:
                # ["simple error message"]
                return str(first_item)
        return "Error de validación"
    
    # Caso 2: Diccionario {"campo": ["error"]}
    elif isinstance(data, dict):
        return extract_from_dict(data)
    
    # Caso 3: String directo
    else:
        return str(data)

def extract_from_dict(error_dict):
    """
    Extrae el primer error de un diccionario de errores
    Prioriza non_field_errors si existe
    """
    if not error_dict:
        return "Error de validación"
    
    # Prioriza errores globales (non_field_errors)
    if 'non_field_errors' in error_dict:
        errors = error_dict['non_field_errors']
        if isinstance(errors, list) and len(errors) > 0:
            return str(errors[0])
        return str(errors)
    
    # Toma el primer campo disponible
    first_key = next(iter(error_dict))
    error_value = error_dict[first_key]
    
    if isinstance(error_value, list):
        return str(error_value[0]) if len(error_value) > 0 else "Error de validación"
    else:
        return str(error_value)
