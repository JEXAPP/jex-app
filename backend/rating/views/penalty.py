from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView, CreateAPIView
from rating.models.penalty import Penalty
from rating.models.penalty_category import PenaltyCategory
from rating.serializers.penalty import CreatePenaltySerializer, PenaltyCategorySerializer
from user_auth.constants import EMPLOYER_ROLE


class ListPenaltyCategoriesView(ListAPIView):
    """
    Devuelve todas las categorías de penalización con sus tipos.
    """
    permission_classes = [IsAuthenticated]
    required_groups = [EMPLOYER_ROLE]
    serializer_class = PenaltyCategorySerializer
    queryset = PenaltyCategory.objects.prefetch_related('types').all()


class CreatePenaltyView(CreateAPIView):
    """
    Crea una nueva penalización para un usuario.
    """
    permission_classes = [IsAuthenticated]
    required_groups = [EMPLOYER_ROLE]
    serializer_class = CreatePenaltySerializer
    queryset = Penalty.objects.none() 