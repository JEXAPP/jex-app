from rest_framework import serializers
from eventos.formatters.date_time import CustomDateField
from vacancies.formatters.date_time import CustomTimeField
from vacancies.models.shifts import Shift
from vacancies.models.vacancy import Vacancy

class CreateShiftSerializer(serializers.ModelSerializer):

    start_date = CustomDateField()
    end_date = CustomDateField()
    start_time = CustomTimeField()
    end_time = CustomTimeField()
    
    class Meta:
        model = Shift
        fields = ['start_time', 'end_time', 'start_date', 'end_date', 'payment', 'quantity']
    
    @staticmethod
    def bulk_create(vacancy, shifts_data):
        objs = [Shift(vacancy=vacancy, **data) for data in shifts_data]
        Shift.objects.bulk_create(objs)


class ShiftSerializer(serializers.ModelSerializer):

    start_date = CustomDateField()
    end_date = CustomDateField()
    start_time = CustomTimeField()
    end_time = CustomTimeField()

    class Meta:
        model = Shift
        fields = ['id', 'start_date', 'end_date', 'start_time', 'end_time', 'payment', 'quantity']

class ShiftDetailForOfferByStateSerializer(serializers.ModelSerializer):

    start_date = CustomDateField()
    end_date = CustomDateField()
    start_time = CustomTimeField()    
    end_time = CustomTimeField()

    class Meta:
        model = Shift
        fields = ['id', 'start_date', 'end_date', 'start_time', 'end_time', 'payment']

class VacancyForApplicationSerializer(serializers.ModelSerializer):
    job_type = serializers.CharField(source='job_type.name', read_only=True)
    requirements = serializers.SerializerMethodField()

    class Meta:
        model = Vacancy
        fields = ["job_type", "description", "requirements"]

    def get_requirements(self, obj):
        return [r.description for r in obj.requirements.all()]

class ShiftForApplicationSerializer(serializers.ModelSerializer):
    vacancy = VacancyForApplicationSerializer(read_only=True)

    start_date = CustomDateField()
    end_date = CustomDateField()
    start_time = CustomTimeField()
    end_time = CustomTimeField()


    class Meta:
        model = Shift
        fields = ["start_date", "start_time", "end_date", "end_time", "payment", "vacancy"]

class ShiftForOfferSerializer(serializers.ModelSerializer):

    start_date = CustomDateField()
    end_date = CustomDateField()
    start_time = CustomTimeField()
    end_time = CustomTimeField()

    class Meta:
        model = Shift
        fields = ['id', 'start_date', 'end_date', 'start_time', 'end_time', 'payment']

class ListOfferEmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shift
        fields = ["id", "start_date", "end_date", "start_time", "end_time"]