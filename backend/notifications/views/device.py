from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from notifications.models.device import Device
from notifications.serializers.device import DeviceSerializer


class DeviceRegisterView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = DeviceSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        expo_token = serializer.validated_data["expo_push_token"]

        device, created = Device.objects.update_or_create(
            user=request.user,
            expo_push_token=expo_token,
            defaults={"expo_push_token": expo_token},
        )

        return Response(
            {
                "message": "Token registrado correctamente." if created else "Token actualizado.",
                "device": DeviceSerializer(device).data,
            },
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )