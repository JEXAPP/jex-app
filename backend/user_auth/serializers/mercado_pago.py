from rest_framework import serializers

from user_auth.models.user import MercadoPagoAccount


class MercadoPagoAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = MercadoPagoAccount
        fields = [
            "id",
            "user",
            "mp_user_id",
            "public_key",
            "live_mode",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "user", "created_at", "updated_at"]
