from rest_framework import serializers
from applications.models.offers_confirms import OfferConfirmation
from user_auth.models.employer import EmployerProfile  # ajustá el import si es necesario
from vacancies.serializers.requirements import RequirementSerializer  # si lo tenés separado
from datetime import timedelta

class OfferConfirmationSerializer(serializers.ModelSerializer):
    requirements = serializers.SerializerMethodField()

    class Meta:
        model = OfferConfirmation
        fields = [
            'id',
            'offer',
            'confirmed_by',
            'confirmed_at',
            'job_type',
            'fecha_turno',
            'hora_inicio',
            'hora_fin',
            'empresa',
            'vencimiento',
            'location',
            'latitude',
            'longitude',
            'additional_comments',
            'requirements',
        ]
        read_only_fields = fields  # todos los campos se generan internamente

    def validate(self, attrs):
        offer = self.context['offer']
        user = self.context['request'].user
        if OfferConfirmation.objects.filter(offer=offer, confirmed_by=user).exists():
            raise serializers.ValidationError("Ya confirmaste esta oferta.")
        return attrs

    def get_requirements(self, obj):
        return RequirementSerializer(obj.requirements.all(), many=True).data


def create(self, validated_data):
    offer = self.context['offer']
    user = self.context['request'].user

    shift = getattr(offer.application, 'shift', None)
    if not shift or not shift.start_date or not shift.start_time or not shift.end_time:
        raise serializers.ValidationError("La oferta no tiene un turno válido asignado.")

    event = shift.vacancy.event
    profile = EmployerProfile.objects.filter(user_id=event.owner_id).first()
    empresa = profile.company_name if profile else "Empresa desconocida"

    # Si no hay fecha de vencimiento, usar 3 días después de creación
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
    )

    confirmation.requirements.set(shift.vacancy.requirements.all())
    return confirmation
