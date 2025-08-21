from rest_framework import serializers
from applications.models.applications import Application
from applications.models.offers import Offer
from user_auth.models.employee import EmployeeProfile
from user_auth.models.employer import EmployerProfile
from rest_framework import serializers
from datetime import timedelta
from datetime import datetime
from vacancies.models.requirements import Requirements


class EmployeeProfileDetailSerializer(serializers.ModelSerializer):
    is_user_active = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = EmployeeProfile
        fields = [
            'full_name',
            'is_user_active',
            'description',
        ]

    def get_is_user_active(self, obj):
        return obj.user.is_active

    def get_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"


class ApplicationDetailSerializer(serializers.ModelSerializer):
    employee = EmployeeProfileDetailSerializer()
    sueldo = serializers.SerializerMethodField()
    fecha_inicio = serializers.SerializerMethodField()
    hora_inicio = serializers.SerializerMethodField()
    fecha_fin = serializers.SerializerMethodField()
    hora_fin = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = [
            'employee',
            'sueldo', 'fecha_inicio', 'hora_inicio',
            'fecha_fin', 'hora_fin'
        ]

    def get_sueldo(self, obj):
        return obj.shift.payment

    def get_fecha_inicio(self, obj):
        return obj.shift.start_date.strftime('%d/%m/%Y')

    def get_hora_inicio(self, obj):
        return obj.shift.start_time.strftime('%H')

    def get_fecha_fin(self, obj):
        return obj.shift.end_date.strftime('%d/%m/%Y')

    def get_hora_fin(self, obj):
        return obj.shift.end_time.strftime('%H')
    
class OfferCreateSerializer(serializers.ModelSerializer):
    additional_comments = serializers.CharField(required=False)
    expiration_date = serializers.CharField(required=False)

    class Meta:
        model = Offer
        fields = ['additional_comments', 'expiration_date']

    def create(self, validated_data):
        user = self.context['user']
        application_id = self.context['application_id']

        try:
            application = Application.objects.select_related(
                'employee__user',
                'shift__vacancy__event'
            ).get(id=application_id)
        except Application.DoesNotExist:
            raise serializers.ValidationError("La postulación no existe.")

        owner_user = application.shift.vacancy.event.owner

        if owner_user != user:
            raise serializers.ValidationError("No tenés permiso para crear esta oferta.")

        try:
            employeer = EmployerProfile.objects.get(user=owner_user)
        except EmployerProfile.DoesNotExist:
            raise serializers.ValidationError("El empleador no tiene perfil asociado.")

        # Parsear la fecha si fue enviada
        expiration_date_str = validated_data.get('expiration_date')
        expiration_date = None
        if expiration_date_str:
            try:
                expiration_date = datetime.strptime(expiration_date_str, '%d/%m/%Y').date()
            except ValueError:
                raise serializers.ValidationError({
                    'expiration_date': 'Formato inválido. Usá DD/MM/YYYY.'
                })

        offer = Offer.objects.create(
            additional_comments=validated_data.get('additional_comments', ''),
            expiration_date=expiration_date,
            application=application,
            employee=application.employee,
            employer=employeer
        )

        # Asignar el turno de la aplicación como único turno de la oferta
        offer.shifts.add(application.shift)
        offer.selected_shift = application.shift
        offer.save()

        return offer

    


class OfferConsultSerializer(serializers.ModelSerializer):
    job_type = serializers.SerializerMethodField()
    fecha_turno = serializers.SerializerMethodField()
    hora_inicio = serializers.SerializerMethodField()
    hora_fin = serializers.SerializerMethodField()
    copant_name = serializers.SerializerMethodField()
    vencimiento = serializers.SerializerMethodField()
    location = serializers.SerializerMethodField()
    latitude = serializers.SerializerMethodField()
    longitude = serializers.SerializerMethodField()
    additional_comments = serializers.SerializerMethodField()
    requirements = serializers.SerializerMethodField()
    event_name = serializers.SerializerMethodField()

    class Meta:
        model = Offer
        fields = [
            'id',
            'job_type',
            'fecha_turno',
            'hora_inicio',
            'hora_fin',
            'copant_name',
            'vencimiento',
            'location',
            'latitude',
            'longitude',
            'additional_comments',
            'requirements',
            'event_name',
        ]

    def get_job_type(self, obj):
        try:
            return obj.application.shift.vacancy.job_type.name
        except AttributeError:
            return None

    def get_fecha_turno(self, obj):
        try:
            return obj.application.shift.start_date.strftime('%d/%m/%Y')
        except AttributeError:
            return None

    def get_hora_inicio(self, obj):
        try:
            return obj.application.shift.start_time.strftime('%H:%M')
        except AttributeError:
            return None

    def get_hora_fin(self, obj):
        try:
            return obj.application.shift.end_time.strftime('%H:%M')
        except AttributeError:
            return None


    def get_copant_name(self, obj):
        try:
            owner_id = obj.application.shift.vacancy.event.owner_id
            profile = EmployerProfile.objects.filter(user_id=owner_id).first()
            return profile.company_name if profile else None
        except AttributeError:
            return None

    
    def get_vencimiento(self, obj):
        try:
            fecha_creacion = obj.created_at.date()
            fecha_turno = obj.application.shift.start_date
            vencimiento_default = fecha_creacion + timedelta(days=3)
            vencimiento_final = min(vencimiento_default, fecha_turno)
            return vencimiento_final.strftime('%d/%m/%Y')
        except AttributeError:
            return None

    def get_location(self, obj):
        try:
            return obj.application.shift.vacancy.event.location
        except AttributeError:
            return None

    def get_latitude(self, obj):
        try:
            return obj.application.shift.vacancy.event.latitude
        except AttributeError:
            return None

    def get_longitude(self, obj):
        try:
            return obj.application.shift.vacancy.event.longitude
        except AttributeError:
            return None

    def get_additional_comments(self, obj):
        try:
            return obj.additional_comments
        except AttributeError:
            return None

    def get_requirements(self, obj):
        try:
            requirements = obj.application.shift.vacancy.requirements.all()
            return RequirementSerializer(requirements, many=True).data
        except AttributeError:
            return None

    def get_event_name(self, obj):
        try:
            return obj.application.shift.vacancy.event.name
        except AttributeError:
            return None
        

class RequirementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Requirements
        fields = ['id','description','vacancy_id']  # ajustá según tu modelo

