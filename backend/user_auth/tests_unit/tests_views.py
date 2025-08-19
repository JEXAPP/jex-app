from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from user_auth.models.employee import EmployeeProfile
from user_auth.models.user import CustomUser
from user_auth.models.employer import EmployerProfile
from user_auth.tests_unit.fixtures.auth_fixtures import create_user_for_login
from user_auth.tests_unit.fixtures.employer_fixtures import create_employer_user

class EmployerRegisterViewTest(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.url = reverse("register-employer")

    def test_register_employer_success(self):
        payload = {
            "email": "employer@example.com",
            "password": "password123",
            "phone": "123456789",
            "company_name": "My Company"
        }
        response = self.client.post(self.url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["message"], "Employer registered")

        user = CustomUser.objects.get(email=payload["email"])
        self.assertEqual(user.role, "employer")
        self.assertTrue(user.check_password(payload["password"]))
        self.assertTrue(EmployerProfile.objects.filter(user=user).exists())

    def test_register_employer_duplicate_email(self):
        create_employer_user(email="dup@example.com", phone="111222333")
        payload = {
            "email": "dup@example.com",
            "password": "password123",
            "phone": "555666777",
            "company_name": "Other Company"
        }
        response = self.client.post(self.url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.json())

    def test_register_employer_duplicate_phone(self):
        create_employer_user(email="unique@example.com", phone="333444555")
        payload = {
            "email": "new@example.com",
            "password": "password123",
            "phone": "333444555",
            "company_name": "Another Company"
        }
        response = self.client.post(self.url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("phone", response.json())

    def test_register_employer_missing_fields(self):
        payload = {
            "email": "incomplete@example.com"
            # Falta password, phone y company_name
        }
        response = self.client.post(self.url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        data = response.json()
        self.assertIn("password", data)
        self.assertIn("phone", data)
        self.assertIn("company_name", data)


class EmployeeRegisterViewTest(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.url = reverse("register-employee")

    def test_register_employee_success(self):
        payload = {
            "email": "employee@example.com",
            "password": "password123",
            "phone": "123456789",
            "dni": "12345678"
        }
        response = self.client.post(self.url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["message"], "Employee registered successfully")
        user = CustomUser.objects.get(email=payload["email"])
        self.assertEqual(user.role, "employee")
        self.assertTrue(EmployeeProfile.objects.filter(user=user).exists())


class EmailTokenObtainPairViewTest(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.url = reverse("token_obtain_pair")
        self.user = create_user_for_login()

    def test_login_success(self):
        payload = {"email": "user@example.com", "password": "password123"}
        response = self.client.post(self.url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.json())
        self.assertIn("refresh", response.json())

    def test_login_invalid_password(self):
        payload = {"email": "user@example.com", "password": "wrongpassword"}
        response = self.client.post(self.url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_missing_fields(self):
        payload = {"email": "user@example.com"}
        response = self.client.post(self.url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)