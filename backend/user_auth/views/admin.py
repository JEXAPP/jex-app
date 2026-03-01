from rest_framework.views import APIView
from rest_framework.response import Response
from rating.models import Penalty
from rating.models.penalty_story_state import PenaltyStateHistory
from rating.serializers.penalty import AdminPenaltySerializer
from user_auth.permissions import IsInGroup
from rest_framework.permissions import IsAuthenticated
from django.db.models import Prefetch



class AdminInfoView(APIView):
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = ["Admin"]

    def get(self, request):

        state_history_qs = (
            PenaltyStateHistory.objects
            .select_related("state", "changed_by")
            .order_by("-changed_at")
        )

        penalties = (
            Penalty.objects
            .select_related(
                "behavior__user",
                "punisher",
                "event",
                "penalty_state",
                "penalty_type",
            )
            .prefetch_related(
                Prefetch("state_history", queryset=state_history_qs)
            )
        )

        serializer = AdminPenaltySerializer(penalties, many=True)
        return Response(serializer.data)
