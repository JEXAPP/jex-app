from rest_framework import serializers
from applications.models.offers_confirms import OfferConfirmation
from vacancies.serializers.requirements import RequirementSerializer
from user_auth.models.employer import EmployerProfile
from datetime import timedelta

class OfferConfirmationSerializer(serializers.ModelSerializer):
    rejected = serializers.BooleanField(required=True)
    requirements = serializers.SerializerMethodField()
    job_type = serializers.SerializerMethodField()
    fecha_turno = serializers.SerializerMethodField()
    hora_inicio = serializers.SerializerMethodField()
    hora_fin = serializers.SerializerMethodField()
    empresa = serializers.SerializerMethodField()
    vencimiento = serializers.SerializerMethodField()
    location = serializers.SerializerMethodField()
    latitude = serializers.SerializerMethodField()
    longitude = serializers.SerializerMethodField()
    additional_comments = serializers.SerializerMethodField()

    class Meta:
        model = OfferConfirmation
        fields = [
            'id', 'offer', 'confirmed_by', 'confirmed_at',
            'job_type', 'fecha_turno', 'hora_inicio', 'hora_fin',
            'empresa', 'vencimiento', 'location', 'latitude', 'longitude',
            'additional_comments', 'requirements', 'rejected'
        ]
        read_only_fields = [f for f in fields if f != 'rejected']

    def get_requirements(self, obj):
        return RequirementSerializer(obj.requirements.all(), many=True).data

    def get_job_type(self, obj):
        return obj.offer.selected_shift.vacancy.job_type.name if obj.offer.selected_shift else None

    def get_fecha_turno(self, obj):
        shift = obj.offer.selected_shift
        return shift.start_date.strftime('%d/%m/%Y') if shift and shift.start_date else None

    def get_hora_inicio(self, obj):
        shift = obj.offer.selected_shift
        return shift.start_time.strftime('%H:%M') if shift and shift.start_time else None

    def get_hora_fin(self, obj):
        shift = obj.offer.selected_shift
        return shift.end_time.strftime('%H:%M') if shift and shift.end_time else None

    def get_empresa(self, obj):
        event = obj.offer.selected_shift.vacancy.event if obj.offer.selected_shift else None
        profile = EmployerProfile.objects.filter(user_id=event.owner_id).first() if event else None
        return profile.company_name if profile else "Empresa desconocida"

    def get_vencimiento(self, obj):
        return obj.offer.expiration_date.strftime('%d/%m/%Y') if obj.offer.expiration_date else None

    def get_location(self, obj):
        event = obj.offer.selected_shift.vacancy.event if obj.offer.selected_shift else None
        return event.location if event else None

    def get_latitude(self, obj):
        event = obj.offer.selected_shift.vacancy.event if obj.offer.selected_shift else None
        return event.latitude if event else None

    def get_longitude(self, obj):
        event = obj.offer.selected_shift.vacancy.event if obj.offer.selected_shift else None
        return event.longitude if event else None

    def get_additional_comments(self, obj):
        return obj.offer.additional_comments or ""

    def create(self, validated_data):
        offer = self.context['offer']
        user = self.context['request'].user
        rejected = validated_data.get('rejected', False)

        shift = getattr(offer.application, 'shift', None)
        if not shift or not shift.start_date or not shift.start_time or not shift.end_time:
            raise serializers.ValidationError("La oferta no tiene un turno válido asignado.")

        event = shift.vacancy.event
        profile = EmployerProfile.objects.filter(user_id=event.owner_id).first()
        empresa = profile.company_name if profile else "Empresa desconocida"
        vencimiento = offer.expiration_date or (offer.created_at.date() + timedelta(days=3))

        confirmation = OfferConfirmation.objects.create(
            offer=offer,
            confirmed_by=user,
            job_type=shift.vacancy.job_type.name,
            fecha_turno=shift.start_date,
            hora_inicio=shift.start_time,
            hora_fin=shift.end_time,
            empresa=empresa,
            vencimiento=vencimiento,
            location=event.location,
            latitude=event.latitude,
            longitude=event.longitude,
            additional_comments=offer.additional_comments or "",
            rejected=rejected
        )

        confirmation.requirements.set(shift.vacancy.requirements.all())
        return confirmation