from rest_framework import serializers
from applications.models.offers import Offer
from rest_framework import serializers
from applications.utils import get_job_type_display
from eventos.formatters.date_time import CustomDateField, CustomTimeField
from eventos.models.event import Event
from payments.constants import PaymentStates
from payments.models.payments import Payment
from rating.models.rating import Rating
from vacancies.models.shifts import Shift


class EventForEmployeeJobsSerializer(serializers.ModelSerializer):
    state = serializers.CharField(source="state.name")
    category = serializers.CharField(source="category.name")
    event_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = ["id", "name", "state", "category", "event_image_url"]

    def get_event_image_url(self, obj):
        if obj.event_image:
            return obj.event_image.url
        return None


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
    job_id = serializers.IntegerField(source='id')

    class Meta:
        model = Offer
        fields = ["event", "shift", "job_id"]

    def get_event(self, obj):
        event = obj.selected_shift.vacancy.event
        return EventForEmployeeJobsSerializer(event).data

    def get_shift(self, obj):
        shift = obj.selected_shift
        return ShiftForEmployeeJobsSerializer(shift).data
    

class EmployeeAcceptedEventsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ["id", "name"]

class EmployeeJobsHistorySerializer(serializers.ModelSerializer):
    event_id = serializers.IntegerField(source="selected_shift.vacancy.event.id")
    event_name = serializers.CharField(source="selected_shift.vacancy.event.name")
    event_image_url = serializers.SerializerMethodField()

    start_date = CustomDateField(source="selected_shift.start_date")
    start_time = CustomTimeField(source="selected_shift.start_time")
    payment_amount = serializers.FloatField(source="selected_shift.payment")


    company_name = serializers.CharField(source="employer.company_name")

    employer_image_url = serializers.SerializerMethodField()
    job_type = serializers.SerializerMethodField()
    payment_date = serializers.SerializerMethodField()
    stars = serializers.SerializerMethodField()
    comment = serializers.SerializerMethodField()

    class Meta:
        model = Offer
        fields = [
            "event_id",
            "event_name",
            "event_image_url",
            "start_date",
            "start_time",
            "job_type",
            "payment_amount",
            "payment_date",
            "company_name",
            "employer_image_url",
            "stars",
            "comment",
        ]

    def get_job_type(self, obj):
        vacancy = obj.selected_shift.vacancy
        return get_job_type_display(vacancy)

    def get_payment_date(self, obj):
        payment = Payment.objects.filter(
            offer=obj,
            employee_id=obj.employee.user.id,
            state__name=PaymentStates.APPROVED.value
        ).order_by('-updated_at').first()

        if not payment:
            return None

        return payment.updated_at.strftime("%d/%m/%Y")


    def get_stars(self, obj):
        rating = Rating.objects.filter(
            rater=obj.employee.user,
            event=obj.selected_shift.vacancy.event
        ).first()
        return rating.rating if rating else None

    def get_comment(self, obj):
        rating = Rating.objects.filter(
            rater=obj.employee.user,
            event=obj.selected_shift.vacancy.event
        ).first()
        return rating.comments if rating else None

    def get_event_image_url(self, obj):
        if obj.selected_shift.vacancy.event.event_image:
            return obj.selected_shift.vacancy.event.event_image.url
        return None
    
    def get_employer_image_url(self, obj):
        owner = obj.selected_shift.vacancy.event.owner
        return owner.profile_image.url if owner.profile_image else None