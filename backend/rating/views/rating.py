from rest_framework.generics import CreateAPIView
from rating.models import Rating
from rating.serializers.rating import RatingSerializer

class CreateRatingView(CreateAPIView):
    serializer_class = RatingSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['worker_id'] = self.kwargs['worker_id']
        return context