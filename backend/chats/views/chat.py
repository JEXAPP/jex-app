from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.conf import settings
from chats.services.stream_chat_service import stream_user_id, upsert_user, create_user_token
from user_auth.constants import EMPLOYEE_ROLE, EMPLOYER_ROLE
from user_auth.permissions import IsInGroup

class StreamTokenView(APIView):
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE, EMPLOYEE_ROLE]

    def get(self, request):
        upsert_user(request.user)
        token = create_user_token(request.user)
        return Response({
            "api_key": settings.STREAM_API_KEY,
            "user_id": stream_user_id(request.user),
            "token": token,
        })