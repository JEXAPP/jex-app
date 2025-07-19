from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from user_auth.serializers.employee import CompleteEmployeeSocialSerializer, EmployeeRegisterSerializer

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