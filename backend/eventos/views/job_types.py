from rest_framework.generics import ListAPIView
from eventos.models.job_types import JobType
from eventos.serializers.job_types import JobTypeSerializer

class JobTypeListView(ListAPIView):
    queryset = JobType.objects.all()
    serializer_class = JobTypeSerializer