from rest_framework_simplejwt.tokens import RefreshToken
from user_auth.tests_unit.fixtures.employee_fixtures import create_employee_user
from user_auth.tests_unit.fixtures.employer_fixtures import create_employer_user
from eventos.models.event import Event
from datetime import date, time, timedelta, datetime

_user_counter = 0

def create_user_and_get_token(client, email=None, password="password123", role="employee", **kwargs):
    global _user_counter
    _user_counter += 1
    unique_suffix = f"{_user_counter}{int(datetime.now().timestamp())}"

    if role == "employee":
        email = email or f"employee{unique_suffix}@test.com"
        kwargs.setdefault("phone", f"10000000{_user_counter}")
        kwargs.setdefault("dni", f"{10000000 + _user_counter}")
        user = create_employee_user(email=email, password=password, **kwargs)
    else:
        email = email or f"employer{unique_suffix}@test.com"
        kwargs.setdefault("phone", f"20000000{_user_counter}")
        kwargs.setdefault("company_name", f"My Company {_user_counter}")
        user, _profile = create_employer_user(email=email, password=password, **kwargs)

    login_url = "/api/auth/login/jwt/"
    response = client.post(login_url, {
        "email": user.email,
        "password": password,
    }, format="json")

    assert response.status_code == 200, f"Login falló: {response.content}"
    token = response.data["access"]

    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    return user, token


def create_event(owner, category, state, **kwargs):
    return Event.objects.create(
        name=kwargs.get("name", "Concierto Test"),
        description=kwargs.get("description", "Evento de prueba"),
        start_date=kwargs.get("start_date", date.today() + timedelta(days=1)),
        end_date=kwargs.get("end_date", date.today() + timedelta(days=5)),
        start_time=kwargs.get("start_time", time(20, 0)),
        end_time=kwargs.get("end_time", time(23, 0)),
        location=kwargs.get("location", "Buenos Aires"),
        latitude=kwargs.get("latitude", 34.6037),
        longitude=kwargs.get("longitude", -58.3816),
        owner=owner,
        category=category,
        state=state,
    )
