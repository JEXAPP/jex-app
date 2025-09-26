from rest_framework import serializers
from notifications.models.device import Device
from notifications.errors.device_messages import INVALID_TOKEN

class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = ["id", "expo_push_token", "created_at"]

    def validate_expo_push_token(self, value):
        if not value.startswith("ExponentPushToken["):
            raise serializers.ValidationError(INVALID_TOKEN)
        return value