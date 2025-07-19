import re
from rest_framework import serializers

class SendCodeSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=15)

    def validate_phone_number(self, value):
        if not re.match(r'^\+[1-9]\d{1,14}$', value):
            raise serializers.ValidationError("Phone format invalid. Use international format (+5491234567890)")
        return value

class VerifyCodeSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=15)
    code = serializers.CharField(max_length=6)