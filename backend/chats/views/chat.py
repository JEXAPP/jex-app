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
        uid = upsert_user(request.user)
        token = create_user_token(request.user)

        if request.user.is_employer():
            company_name = getattr(request.user.employer_profile, "company_name", None)
            display_name = company_name
        else:
            display_name = f"{request.user.first_name} {request.user.last_name}".strip()

        user_data = {
            "id": uid,
            "name": display_name,
            "role": "employer" if request.user.is_employer() else "employee",
        }

        if getattr(request.user, "profile_image", None):
            user_data["image"] = request.user.profile_image.url


        return Response({
            "api_key": settings.STREAM_API_KEY,
            "user": user_data,
            "token": token,
        })