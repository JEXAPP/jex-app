from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from applications.models.offers_confirms import OfferConfirmation
from applications.models.offers import Offer
from applications.serializers.offers_confirms import OfferConfirmationSerializer
from rest_framework.exceptions import ValidationError

class OfferConfirmationCreateView(generics.CreateAPIView):
    serializer_class = OfferConfirmationSerializer
    permission_classes = [IsAuthenticated]

    def get_offer(self):
        offer_id = self.kwargs.get('offer_id')
        return get_object_or_404(Offer, id=offer_id)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['offer'] = self.get_offer()
        context['request'] = self.request
        return context

    def perform_create(self, serializer):
        offer = self.get_offer()
        if OfferConfirmation.objects.filter(offer=offer).exists():
            raise ValidationError("Esta oferta ya ha sido confirmada")
        serializer.save()

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)

            rejected = serializer.validated_data.get('rejected', False)
            mensaje = "Se confirmó la oferta" if rejected else "Se rechazó la oferta"

            return Response({
                'success': True,
                'message': mensaje,
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({
                'success': False,
                'message': str(e),
                'errors': getattr(e, 'detail', str(e))
            }, status=status.HTTP_400_BAD_REQUEST)