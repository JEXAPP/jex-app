from rest_framework.generics import CreateAPIView
from rating.models import Rating
from rating.serializers.rating import RatingSerializer
from user_auth.constants import EMPLOYER_ROLE
from rest_framework.permissions import IsAuthenticated
from user_auth.permissions import IsInGroup

class CreateRatingView(CreateAPIView):
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE]
    serializer_class = RatingSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['employee_id'] = self.kwargs['employee_id']
        return context