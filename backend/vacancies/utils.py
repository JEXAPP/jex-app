import math


def haversine_distance_km(lat1, lon1, lat2, lon2):
    """
    Calcula la distancia en km entre dos puntos geográficos.
    Usa la fórmula de Haversine.
    """
    R = 6371  # Radio de la Tierra en km
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = math.sin(delta_phi / 2.0) ** 2 + \
        math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2

    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return R * c

def is_event_near(employee_lat, employee_lon, event, max_distance_km=15):
    """
    Devuelve True si el evento está dentro del radio dado (en km) respecto al empleado.
    """
    if event.latitude is None or event.longitude is None:
        return False

    event_lat = float(event.latitude)
    event_lon = float(event.longitude)

    distance = haversine_distance_km(employee_lat, employee_lon, event_lat, event_lon)
    return distance <= max_distance_km