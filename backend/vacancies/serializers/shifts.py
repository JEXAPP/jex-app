from rest_framework import serializers
from applications.models.offers import Offer
from eventos.formatters.date_time import CustomDateField
from vacancies.formatters.date_time import CustomTimeField
from vacancies.models.shifts import Shift


class CreateShiftSerializer(serializers.ModelSerializer):

    start_date = CustomDateField()
    end_date = CustomDateField()
    start_time = CustomTimeField()
    end_time = CustomTimeField()

    class Meta:
        model = Shift
        fields = [
            "start_time",
            "end_time",
            "start_date",
            "end_date",
            "payment",
            "quantity",
        ]

    @staticmethod
    def bulk_create(vacancy, shifts_data):
        objs = [Shift(vacancy=vacancy, **data) for data in shifts_data]
        Shift.objects.bulk_create(objs)


class ShiftSerializer(serializers.ModelSerializer):

    start_date = CustomDateField()
    end_date = CustomDateField()
    start_time = CustomTimeField()
    end_time = CustomTimeField()
    already_applied = serializers.SerializerMethodField()

    class Meta:
        model = Shift
        fields = [
            "id",
            "start_date",
            "end_date",
            "start_time",
            "end_time",
            "payment",
            "quantity",
            "already_applied",
        ]

    def get_already_applied(self, obj):
        """
        Devuelve True si el empleado actual ya tiene una aplicación para este shift.
        """
        user = self.context.get("request").user
        try:
            employee_profile = user.employee_profile
        except AttributeError:
            return False

        return obj.applications.filter(employee=employee_profile).exists()


class ShiftDetailForOfferByStateSerializer(serializers.ModelSerializer):

    start_date = CustomDateField()
    end_date = CustomDateField()
    start_time = CustomTimeField()
    end_time = CustomTimeField()

    class Meta:
        model = Shift
        fields = ["id", "start_date", "end_date", "start_time", "end_time", "payment"]


class ShiftForApplicationSerializer(serializers.ModelSerializer):
    start_date = CustomDateField()
    end_date = CustomDateField()
    start_time = CustomTimeField()
    end_time = CustomTimeField()

    class Meta:
        model = Shift
        fields = ["start_date", "start_time", "end_date", "end_time", "payment"]


class ShiftForOfferSerializer(serializers.ModelSerializer):

    start_date = CustomDateField()
    end_date = CustomDateField()
    start_time = CustomTimeField()
    end_time = CustomTimeField()

    class Meta:
        model = Shift
        fields = ["id", "start_date", "end_date", "start_time", "end_time", "payment"]


class ListOfferEmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shift
        fields = ["id", "start_date", "end_date", "start_time", "end_time"]


class ListOffersByShiftSerializer(serializers.ModelSerializer):
    offer_id = serializers.IntegerField(source="id")
    shift_id = serializers.IntegerField(source="selected_shift_id")
    employee_id = serializers.IntegerField()
    first_name = serializers.SerializerMethodField()
    last_name = serializers.SerializerMethodField()
    profile_image_url = serializers.SerializerMethodField()
    profile_image_id = serializers.SerializerMethodField()
    offer_state = serializers.CharField(source="state.name")
    expiration_date = CustomDateField()
    expiration_time = CustomTimeField()

    class Meta:
        model = Offer
        fields = [
            "offer_id",
            "shift_id",
            "employee_id",
            "first_name",
            "last_name",
            "profile_image_url",
            "profile_image_id",
            "offer_state",
            "expiration_date",
            "expiration_time",
        ]


    def get_first_name(self, obj):
        return obj.employee.user.first_name
    
    def get_last_name(self, obj):
        return obj.employee.user.last_name

    def get_profile_image_url(self, obj):
        image = obj.employee.user.profile_image
        return image.url if image else None

    def get_profile_image_id(self, obj):
        image = obj.employee.user.profile_image
        return image.public_id if image else None
