from rest_framework.generics import ListAPIView
from vacancies.models.job_types import JobType
from vacancies.serializers.job_types import ListJobTypesSerializer
from user_auth.permissions import IsInGroup
from rest_framework.permissions import IsAuthenticated
from user_auth.constants import EMPLOYEE_ROLE, EMPLOYER_ROLE

class ListJobTypesView(ListAPIView):
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE, EMPLOYEE_ROLE]

    queryset = JobType.objects.all()
    serializer_class = ListJobTypesSerializer