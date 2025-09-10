from rest_framework import serializers
from applications.models.offers import Offer
from rest_framework import serializers
from applications.utils import get_job_type_display
from eventos.formatters.date_time import CustomDateField, CustomTimeField
from eventos.models.event import Event
from vacancies.models.shifts import Shift


class EventForEmployeeJobsSerializer(serializers.ModelSerializer):
    state = serializers.CharField(source="state.name")
    category = serializers.CharField(source="category.name")

    class Meta:
        model = Event
        fields = ["id", "name", "state", "category"]


class ShiftForEmployeeJobsSerializer(serializers.ModelSerializer):
    start_date = CustomDateField()
    end_date = CustomDateField()
    start_time = CustomTimeField()
    end_time = CustomTimeField()
    job_type = serializers.SerializerMethodField()

    class Meta:
        model = Shift
        fields = ["start_date", "end_date", "start_time", "end_time", "job_type", "payment"]

    def get_job_type(self, obj):
        return get_job_type_display(obj.vacancy)


class EmployeeForSearchSerializer(serializers.ModelSerializer):
    event = serializers.SerializerMethodField()
    shift = serializers.SerializerMethodField()

    class Meta:
        model = Offer
        fields = ["event", "shift"]

    def get_event(self, obj):
        event = obj.selected_shift.vacancy.event
        return EventForEmployeeJobsSerializer(event).data

    def get_shift(self, obj):
        shift = obj.selected_shift
        return ShiftForEmployeeJobsSerializer(shift).data