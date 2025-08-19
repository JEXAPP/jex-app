from django.test import TestCase
from user_auth.models.employee import EmployeeProfile
from user_auth.models.user import CustomUser
from user_auth.serializers.auth import EmailTokenObtainPairSerializer
from user_auth.serializers.employee import EmployeeRegisterSerializer
from user_auth.serializers.employer import EmployerRegisterSerializer
from user_auth.tests_unit.fixtures.auth_fixtures import create_user_for_login
from user_auth.tests_unit.fixtures.employer_fixtures import create_employer_user
from rest_framework.exceptions import AuthenticationFailed


class EmployerRegisterSerializerTest(TestCase):

    def test_valid_serializer_creates_user(self):
        data = {
            "email": "new_employer@example.com",
            "password": "password123",
            "phone": "987654321",
            "company_name": "My New Company"
        }
        serializer = EmployerRegisterSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        user = serializer.save()
        self.assertEqual(user.email, data["email"])
        self.assertEqual(user.role, "employer")

    def test_serializer_duplicate_email(self):
        create_employer_user(email="dup@example.com", phone="111222333")
        data = {
            "email": "dup@example.com",
            "password": "password123",
            "phone": "222333444",
            "company_name": "Other Company"
        }
        serializer = EmployerRegisterSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("email", serializer.errors)

    def test_serializer_duplicate_phone(self):
        create_employer_user(email="unique@example.com", phone="333444555")
        data = {
            "email": "new@example.com",
            "password": "password123",
            "phone": "333444555",
            "company_name": "Another Company"
        }
        serializer = EmployerRegisterSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("phone", serializer.errors)


class EmployeeRegisterSerializerTest(TestCase):

    def test_serializer_valid_data(self):
        data = {
            "email": "testemployee@example.com",
            "password": "password123",
            "phone": "987654321",
            "dni": "87654321"
        }
        serializer = EmployeeRegisterSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        user = serializer.save()
        self.assertEqual(user.role, "employee")
        self.assertTrue(user.check_password("password123"))
        self.assertTrue(EmployeeProfile.objects.filter(user=user).exists())

    def test_serializer_duplicate_email(self):
        CustomUser.objects.create_user(email="dup@example.com", password="password", phone="111222333", role="employee")
        data = {
            "email": "dup@example.com",
            "password": "password123",
            "phone": "444555666",
            "dni": "22233344"
        }
        serializer = EmployeeRegisterSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("email", serializer.errors)


class EmailTokenObtainPairSerializerTest(TestCase):

    def setUp(self):
        self.user = create_user_for_login()

    def test_serializer_valid_credentials(self):
        data = {"email": "user@example.com", "password": "password123"}
        serializer = EmailTokenObtainPairSerializer(data=data, context={"request": None})
        validated_data = serializer.validate(data)
        self.assertIn("access", validated_data)
        self.assertIn("refresh", validated_data)
        self.assertEqual(serializer.get_token(self.user)["email"], self.user.email)

    def test_serializer_invalid_password(self):
        data = {"email": "user@example.com", "password": "wrongpassword"}
        serializer = EmailTokenObtainPairSerializer(data=data, context={"request": None})
        with self.assertRaises(AuthenticationFailed):
            serializer.validate(data)

    def test_serializer_missing_fields(self):
        data = {"email": "user@example.com"}
        serializer = EmailTokenObtainPairSerializer(data=data, context={"request": None})
        with self.assertRaises(AuthenticationFailed):
            serializer.validate(data)