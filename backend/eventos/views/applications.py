# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from eventos.models.applications import Application
from user_auth.models.employee import EmployeeProfile
from eventos.serializers.applications import (
    ApplicationCreateSerializer,
    ApplicationResponseSerializer,
)
from user_auth.permissions import IsInGroup
from user_auth.constants import EMPLOYEE_ROLE
from eventos.models import Shift

class ApplicationCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYEE_ROLE]

    def post(self, request):
        serializer = ApplicationCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        employee = self.get_employee_profile(request.user)
        if not employee:
            return Response(
                {"detail": "Employee profile not found for the authenticated user."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        shifts_ids = serializer.validated_data['shifts']

        existing_shift_ids = set(
            Application.objects.filter(employee=employee, shift_id__in=shifts_ids)
            .values_list('shift_id', flat=True)
        )
        new_shift_ids = set(shifts_ids) - existing_shift_ids

        Application.objects.bulk_create([
            Application(employee=employee, shift_id=shift_id, status='PENDING')
            for shift_id in new_shift_ids
        ])

        shifts = Shift.objects.filter(id__in=new_shift_ids).select_related('vacancy')

        response_data = {
            "message": f"{len(new_shift_ids)} applications created successfully.",
            "applications": self.group_shifts_by_vacancy(shifts),
        }

        response_serializer = ApplicationResponseSerializer(response_data)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

    def get_employee_profile(self, user):
        try:
            return EmployeeProfile.objects.get(user=user)
        except EmployeeProfile.DoesNotExist:
            return None

    def group_shifts_by_vacancy(self, shifts):
        vacancy_map = {}
        for shift in shifts:
            vac_id = shift.vacancy.id
            if vac_id not in vacancy_map:
                vacancy_map[vac_id] = {
                    "vacancy_id": vac_id,
                    "vacancy_title": shift.vacancy.title,
                    "shifts": [],
                }
            vacancy_map[vac_id]["shifts"].append({"id": shift.id})
        return list(vacancy_map.values())