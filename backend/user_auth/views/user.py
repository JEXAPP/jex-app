from rest_framework.response import Response
from rest_framework import permissions
from rest_framework.views import APIView
from user_auth.constants import EMPLOYEE_ROLE, EMPLOYER_ROLE
from user_auth.permissions import IsInGroup

from user_auth.serializers.user import UserPublicProfileSerializer


class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYEE_ROLE, EMPLOYER_ROLE]

    def get(self, request):
        serializer = UserPublicProfileSerializer(request.user)
        return Response(serializer.data, status=200)