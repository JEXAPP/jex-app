from rest_framework import serializers
from notifications.models.notification import Notification
from notifications.models.notification_type import NotificationType

class NotificationTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationType
        fields = ["id", "name"]

class ListNotificationSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(
        format="%d/%m/%Y %H:%M",
        read_only=True
    )    
    notification_type = NotificationTypeSerializer(read_only=True)

    class Meta:
        model = Notification
        fields = [
            "id", 
            "title", 
            "message", 
            "read", 
            "notification_type", 
            "created_at"
        ]

