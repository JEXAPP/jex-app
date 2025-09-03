from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.generics import RetrieveAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from applications.constants import OfferStates
from applications.errors.application_messages import ALREADY_APPLIED_ALL_SHIFTS, APPLICATIONS_CREATED_SUCCESS, NOT_FOUND_SHIFT
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

from django.db.models import Count, Q



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
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE]
    serializer_class = ApplicationDetailSerializer
    lookup_url_kwarg = "application_id"

    def get_object(self):
        application_id = self.kwargs.get(self.lookup_url_kwarg)
        return get_object_or_404(
            Application.objects.select_related(
                "employee__user__profile_image",
                "shift__vacancy__event",
                "shift__vacancy__job_type"
            ).prefetch_related(
                "employee__job_types",
                "shift__vacancy__requirements"
            ),
            id=application_id
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['user'] = self.request.user
        return context
    
    
class ListApplicationsByShiftView(RetrieveAPIView):
    serializer_class = ShiftWithApplicationsSerializer
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE]

    def get_object(self):
        vacancy_id = self.kwargs["vacancy_pk"]
        shift_id = self.kwargs["shift_pk"]

        applications_qs = Application.objects.select_related(
            "employee__user", "employee__user__profile_image"
        ).filter(shift_id=shift_id).order_by("-created_at")

        shift = get_object_or_404(
            Shift.objects.prefetch_related(
                Prefetch("applications", queryset=applications_qs)
            ).annotate(
                quantity_offers=Count(
                    "selected_offers",
                    filter=Q(
                        selected_offers__state__name__in=[
                            OfferStates.PENDING.value,
                            OfferStates.ACCEPTED.value,
                        ]
                    ),
                    distinct=True,
                )
            ),
            pk=shift_id,
            vacancy_id=vacancy_id
        )

        return shift