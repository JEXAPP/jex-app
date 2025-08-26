from rest_framework.views import APIView
from rest_framework.generics import RetrieveAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from applications.errors.application_messages import ALREADY_APPLIED_ALL_SHIFTS, APPLICATIONS_CREATED_SUCCESS
from applications.models.applications import Application
from applications.serializers.applications import (
    ApplicationCreateSerializer,
    ApplicationDetailSerializer,
    ShiftWithApplicationsSerializer,
)
from user_auth.permissions import IsInGroup
from user_auth.constants import EMPLOYEE_ROLE, EMPLOYER_ROLE
from rest_framework.generics import RetrieveAPIView
from django.db.models import Prefetch

from vacancies.models.vacancy import Vacancy
from applications.models.applications import Application
from vacancies.models.shifts import Shift
from rest_framework.exceptions import NotFound


class ApplicationCreateView(APIView):
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYEE_ROLE]

    def post(self, request):
        serializer = ApplicationCreateSerializer(data=request.data, context={'user': request.user})
        serializer.is_valid(raise_exception=True)
        created = serializer.save()

        if created is False:
            return Response({"message": ALREADY_APPLIED_ALL_SHIFTS}, status=status.HTTP_200_OK)

        return Response({"message": APPLICATIONS_CREATED_SUCCESS}, status=status.HTTP_201_CREATED)


class ApplicationDetailView(RetrieveAPIView):
    queryset = Application.objects.select_related('employee__user', 'shift')
    serializer_class = ApplicationDetailSerializer 
    
class ListApplicationsByShiftView(RetrieveAPIView):
    serializer_class = ShiftWithApplicationsSerializer
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE]

    def get_object(self):
        vacancy_id = self.kwargs["vacancy_pk"]
        shift_id = self.kwargs["shift_pk"]

        try:
            vacancy = Vacancy.objects.get(pk=vacancy_id)
        except Vacancy.DoesNotExist:
            raise NotFound("Vacante no encontrada")

        applications_qs = Application.objects.select_related(
            "employee__user", "employee__user__profile_image"
        ).filter(shift_id=shift_id).order_by("-created_at")

        try:
            shift = Shift.objects.prefetch_related(
                Prefetch("applications", queryset=applications_qs)
            ).get(pk=shift_id, vacancy_id=vacancy_id)
        except Shift.DoesNotExist:
            raise NotFound("Turno no encontrado para esta vacante")

        return shift