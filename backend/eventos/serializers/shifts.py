from rest_framework import serializers
from eventos.models.shifts import Shift

class ShiftSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shift
        fields = ['start_time', 'end_time', 'start_date', 'end_date', 'payment', 'quantity']