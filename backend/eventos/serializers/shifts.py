from rest_framework import serializers
from eventos.models.shifts import Shift

class CreateShiftSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shift
        fields = ['start_time', 'end_time', 'start_date', 'end_date', 'payment', 'quantity']
    
    @staticmethod
    def bulk_create(vacancy, shifts_data):
        objs = [Shift(vacancy=vacancy, **data) for data in shifts_data]
        Shift.objects.bulk_create(objs)