from django.test import TestCase
from user_auth.models.employee import EmployeeProfile
from user_auth.tests_unit.fixtures.employee_fixtures import create_employee_user
from user_auth.tests_unit.fixtures.employer_fixtures import create_employer_user

class CustomUserModelTest(TestCase):

    def test_create_employer_user(self):
        user, _ = create_employer_user()
        self.assertEqual(user.email, "employer@example.com")
        self.assertTrue(user.check_password("password123"))
        self.assertEqual(user.role, "employer")

    def test_employer_profile_created(self):
        user, profile = create_employer_user(company_name="Tech Corp")
        self.assertEqual(profile.user.email, user.email)
        self.assertEqual(profile.company_name, "Tech Corp")


class EmployeeProfileModelTest(TestCase):

    def test_employee_creation(self):
        user = create_employee_user()
        profile = EmployeeProfile.objects.get(user=user)
        self.assertEqual(profile.dni, "12345678")
        self.assertEqual(profile.user.email, "employee@example.com"