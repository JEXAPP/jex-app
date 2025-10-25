from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
from user_auth.constants import EMPLOYEE_ROLE
from user_auth.errors.user_errors_messages import EMAIL_REQUIRED
from user_auth.models.employee import EmployeeProfile
from user_auth.permissions import IsInGroup
from user_auth.serializers.employee import CompleteEmployeeSocialSerializer, EmployeeAdditionalInfoSerializer, EmployeeEducationSerializer, EmployeeInterestsSerializer, EmployeeProfileDescriptionSerializer, EmployeeRegisterSerializer, EmployeeWorkExperienceSerializer
from user_auth.models.user import CustomUser
from rest_framework import serializers
from django.db import transaction

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
        
class EmployeeProfileDescriptionView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYEE_ROLE]

    def put(self, request):

        try:
            profile = request.user.employee_profile
        except EmployeeProfile.DoesNotExist:
            return Response({"detail": "Perfil de empleado no encontrado."}, status=404)
        

        serializer = EmployeeProfileDescriptionSerializer(profile, data=request.data, partial=True)
        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({"errors": e.detail}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"detail": f"Unexpected error: {str(e)}"}, status=500)
        
class EmployeeWorkExperienceView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYEE_ROLE]

    def post(self, request):
        data = request.data
        saved_items = []

        with transaction.atomic():
            for item in data:
                serializer = EmployeeWorkExperienceSerializer(data=item, context={'request': request})
                serializer.is_valid(raise_exception=True)
                saved_items.append(serializer.save())

        return Response(status=status.HTTP_201_CREATED)
    
class EmployeeEducationView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYEE_ROLE]

    def post(self, request):
        data = request.data
        saved_items = []

        with transaction.atomic():
            for item in data:
                serializer = EmployeeEducationSerializer(data=item, context={'request': request})
                serializer.is_valid(raise_exception=True)
                saved_items.append(serializer.save())

        return Response(status=status.HTTP_201_CREATED)
        
class EmployeeInterestsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYEE_ROLE]

    def put(self, request):
        try:
            profile = request.user.employee_profile
        except EmployeeProfile.DoesNotExist:
            return Response({"detail": "Perfil de empleado no encontrado."}, status=404)

        serializer = EmployeeInterestsSerializer(profile, data=request.data, partial=True)

        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        except ValidationError as e:
            return Response({"errors": e.detail}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"detail": f"Unexpected error: {str(e)}"}, status=500)

class EmployeeValidateMailView(APIView):

    def post(self, request):
        email = request.data.get("email")

        if not email:
            raise serializers.ValidationError(EMAIL_REQUIRED)

        exists = CustomUser.objects.filter(email__iexact=email).exists()

        return Response({"message": exists}, status=status.HTTP_200_OK)