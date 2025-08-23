from rest_framework import serializers
from applications.models.applications import Application
from applications.models.offers import Offer
from user_auth.models.employee import EmployeeProfile
from user_auth.models.employer import EmployerProfile
from rest_framework import serializers
from datetime import datetime
from django.utils import timezone



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
    expiration_time = serializers.TimeField(required=False)

    class Meta:
        model = Offer
        fields = ['additional_comments', 'expiration_date', 'expiration_time']

    def create(self, validated_data):
        user = self.context['user']
        application_id = self.context['application_id']

        try:
            application = Application.objects.select_related(
                'employee__user',
                'shift__vacancy__event',
                'shift__vacancy__job_type'
            ).get(id=application_id)
        except Application.DoesNotExist:
            raise serializers.ValidationError("La postulación no existe.")

        owner_user = application.shift.vacancy.event.owner
        if owner_user != user:
            raise serializers.ValidationError("No tenés permiso para crear esta oferta.")

        try:
            employer = EmployerProfile.objects.get(user=owner_user)
        except EmployerProfile.DoesNotExist:
            raise serializers.ValidationError("El empleador no tiene perfil asociado.")

        # Parsear fecha
        expiration_date_str = validated_data.get('expiration_date')
        expiration_date = None
        if expiration_date_str:
            try:
                expiration_date = datetime.strptime(expiration_date_str, '%d/%m/%Y').date()
            except ValueError:
                raise serializers.ValidationError({
                    'expiration_date': 'Formato inválido. Usá DD/MM/YYYY.'
                })

        shift = application.shift
        vacancy = shift.vacancy
        event = vacancy.event

        # Armar comentario con info del turno
        shift_info = f"Fecha: {shift.start_date.strftime('%d/%m/%Y')}, " \
                     f"Inicio: {shift.start_time.strftime('%H:%M')}, " \
                     f"Fin: {shift.end_time.strftime('%H:%M')}"
        user_comment = validated_data.get('additional_comments', '')
        combined_comments = f"{user_comment}\n{shift_info}".strip()

        # Armar resumen de requisitos (solo descripción)
        requirements = vacancy.requirements.all()
        requirements_list = [r.description for r in requirements] if requirements.exists() else []

        # Crear la oferta
        offer = Offer.objects.create(
            additional_comments=combined_comments,
            expiration_date=expiration_date,
            expiration_time=validated_data.get('expiration_time'),
            application=application,
            employee=application.employee,
            employer=employer,
            selected_shift=shift,
            job_type=vacancy.job_type.name if vacancy.job_type else None,
            shift_date=shift.start_date,
            start_time=shift.start_time,
            end_time=shift.end_time,
            location=event.location,
            latitude=event.latitude,
            longitude=event.longitude,
            salary=shift.payment,
            company_name=employer.company_name,
            requeriments=requirements_list,  # ← corregido
            status="pending"
)

        return offer

class OfferConsultSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = '__all__'  # ← incluye todos los campos definidos en el modelo

class OfferDecisionSerializer(serializers.ModelSerializer):
    rejected = serializers.BooleanField()
    rejection_reason = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Offer
        fields = ['rejected', 'rejection_reason']

    def validate(self, attrs):
        if attrs.get('rejected') and not attrs.get('rejection_reason'):
            raise serializers.ValidationError({
                'rejection_reason': 'Debés especificar un motivo de rechazo si rechazás la oferta.'
            })
        return attrs

    def update(self, instance, validated_data):
        user = self.context['user']
        rejected = validated_data.get('rejected')

        if instance.status != 'pending':
            raise serializers.ValidationError("Solo se pueden modificar ofertas en estado 'pending'.")

        instance.confirmed_by = user
        instance.confirmed_at = timezone.now()

        if rejected:
            instance.status = 'rejected'
            instance.rejection_reason = validated_data.get('rejection_reason', '')
        else:
            instance.status = 'confirmed'
            instance.rejection_reason = None

        instance.save()
        return instance 