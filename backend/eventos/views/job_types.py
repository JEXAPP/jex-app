from rest_framework.generics import ListAPIView
from eventos.models.job_types import JobType
from eventos.serializers.job_types import ListJobTypesSerializer

class ListJobTypesView(ListAPIView):
    queryset = JobType.objects.all()
    serializer_class = ListJobTypesSerializer