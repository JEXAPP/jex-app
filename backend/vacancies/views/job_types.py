from rest_framework.generics import ListAPIView
from vacancies.models.job_types import JobType
from vacancies.serializers.job_types import ListJobTypesSerializer

class ListJobTypesView(ListAPIView):
    queryset = JobType.objects.all()
    serializer_class = ListJobTypesSerializer