from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
from user_auth.constants import EMPLOYEE_ROLE
from user_auth.models.employee import EmployeeProfile
from user_auth.permissions import IsInGroup
from user_auth.serializers.employee import CompleteEmployeeSocialSerializer, EmployeeAdditionalInfoSerializer, EmployeeRegisterSerializer

class EmployeeRegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = EmployeeRegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user) if request.user.is_authenticated else serializer.save()
            return Response({'message': 'Employee registered successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CompleteEmployeeSocialView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = CompleteEmployeeSocialSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Employee profile completed'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EmployeeAdditionalInfoView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYEE_ROLE]

    def put(self, request):
        try:
            profile = request.user.employee_profile
        except EmployeeProfile.DoesNotExist:
            return Response({"detail": "Perfil de empleado no encontrado."}, status=404)

        serializer = EmployeeAdditionalInfoSerializer(profile, data=request.data, partial=True)

        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        except ValidationError as e:
            return Response({"errors": e.detail}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"detail": f"Unexpected error: {str(e)}"}, status=500)
        