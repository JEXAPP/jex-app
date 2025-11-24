from django.forms import ValidationError
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from user_auth.constants import EMPLOYER_ROLE
from user_auth.models.employer import EmployerProfile
from user_auth.permissions import IsInGroup
from user_auth.serializers.employer import CompleteEmployerSocialSerializer, EmployerProfileDescriptionSerializer, EmployerRegisterSerializer, UpdateEmployerProfileSerializer, ViewEmployerProfileDescriptionSerializer

class EmployerRegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = EmployerRegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Employer registered'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CompleteEmployerSocialView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = CompleteEmployerSocialSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Employer profile completed'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class EmployerProfileDescriptionView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE]

    def put(self, request):
        try:
            profile = request.user.employer_profile
        except EmployerProfile.DoesNotExist:
            return Response({"detail": "Perfil de empleador no encontrado."}, status=404)

        serializer = EmployerProfileDescriptionSerializer(profile, data=request.data, partial=True)
        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({"errors": e.detail}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"detail": f"Unexpected error: {str(e)}"}, status=500)

class ViewEmployerProfileDescription(APIView):
    permission_classes = [permissions.IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE]

    def get(self, request):
        try:
            profile = request.user.employer_profile
        except EmployerProfile.DoesNotExist:
            return Response({"detail": "Perfil de empleador no encontrado."}, status=404)

        serializer = ViewEmployerProfileDescriptionSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class UpdateEmployerProfileDescriptionView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE]

    def put(self, request):
        try:
            profile = request.user.employer_profile
        except EmployerProfile.DoesNotExist:
            return Response("Perfil de empleador no encontrado.", status=404)

        serializer = UpdateEmployerProfileSerializer(
            profile,
            data=request.data,
            partial=False,
            context={'user': request.user}
        )

        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        serializer.save()

        return Response({"detail": "Perfil actualizado correctamente."}, status=200)