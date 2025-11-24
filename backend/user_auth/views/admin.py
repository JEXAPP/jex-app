from rest_framework.views import APIView
from rest_framework.response import Response
from rating.models import Penalty
from rating.serializers.penalty import PenaltySerializer
from user_auth.permissions import IsInGroup
from rest_framework.permissions import IsAuthenticated


class AdminInfoView(APIView):
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = ['Admin'] 

    def get(self, request):
        penalties = Penalty.objects.all()
        serializer = PenaltySerializer(penalties, many=True)
        return Response(serializer.data)
