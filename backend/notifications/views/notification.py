


from config.pagination import CustomPagination
from notifications.models.notification import Notification
from notifications.serializers.notification import ListNotificationSerializer, SetNotificationReadSerializer
from user_auth.constants import EMPLOYEE_ROLE, EMPLOYER_ROLE
from user_auth.permissions import IsInGroup
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListAPIView, UpdateAPIView
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView


class ListNotificationView(ListAPIView):
    serializer_class = ListNotificationSerializer
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYEE_ROLE, EMPLOYER_ROLE]
    pagination_class = CustomPagination


    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by("-created_at")


class SetNotificationReadView(APIView):
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYEE_ROLE, EMPLOYER_ROLE]
    queryset = Notification.objects.all()


    def post(self, request, pk):
        try:
            notification = Notification.objects.get(pk=pk, user=request.user)
        except Notification.DoesNotExist:
            return Response({"detail": "Notificación no encontrada."}, status=404)

        if notification.read:
            return Response({"detail": "Ya estaba leída."}, status=200)

        notification.read = True
        notification.save(update_fields=["read"])

        return Response({"detail": "Notificación marcada como leída."}, status=200)


class SetNotificationAllReadView(APIView):
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYEE_ROLE, EMPLOYER_ROLE]

    def post(self, request):
        user = request.user
        updated_count = Notification.objects.filter(user=user, read=False).update(read=True)
        
        return Response(
            {"message": f"Se marcaron {updated_count} notificaciones como leídas."},
            status=status.HTTP_200_OK
        )