


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


class SetNotificationReadView(UpdateAPIView):
    serializer_class = SetNotificationReadSerializer
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYEE_ROLE, EMPLOYER_ROLE]
    queryset = Notification.objects.all()

    def get_object(self):
        obj = super().get_object()
        if obj.user != self.request.user:
            raise PermissionDenied("No tienes permiso para modificar esta notificación.")
        return obj

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"detail": "Notificación actualizada correctamente."}, 
            status=status.HTTP_200_OK
        )

class SetNotificationReadBulkView(APIView):
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYEE_ROLE, EMPLOYER_ROLE]

    def patch(self, request, *args, **kwargs):
        notification_ids = request.data.get("notifications_ids", [])
        read_value = request.data.get("read", True)  # default True

        # Validaciones de formato
        if not isinstance(notification_ids, list) or not all(isinstance(i, int) for i in notification_ids):
            return Response(
                {"detail": "notifications_ids debe ser una lista de enteros."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not isinstance(read_value, bool):
            return Response(
                {"detail": "El campo 'read' debe ser booleano."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 🔹 Buscar notificaciones del usuario
        notifications = Notification.objects.filter(user=request.user, id__in=notification_ids)
        found_ids = set(notifications.values_list('id', flat=True))
        missing_ids = set(notification_ids) - found_ids

        if missing_ids:
            return Response(
                {"detail": "Notificación no encontrada"},  # constante de tu errors.py
                status=status.HTTP_400_BAD_REQUEST
            )

        # 🔹 Actualizar todas las que existen
        updated_count = notifications.update(read=read_value)

        return Response(
            {"detail": f"{updated_count} notificaciones actualizadas.", "read": read_value},
            status=status.HTTP_200_OK
        )