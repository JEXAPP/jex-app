from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from applications.models.offers_confirms import OfferConfirmation
from applications.models.offers import Offer
from applications.serializers.offers_confirms import OfferConfirmationSerializer
from django.shortcuts import get_object_or_404

class OfferConfirmationCreateView(generics.CreateAPIView):
    serializer_class = OfferConfirmationSerializer
    permission_classes = [IsAuthenticated]

    def get_offer(self):
        offer_id = self.kwargs.get('offer_id')
        return get_object_or_404(Offer, id=offer_id)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['offer'] = self.get_offer()
        return context

    def perform_create(self, serializer):
        offer = self.get_offer()
        serializer.save(offer=offer, confirmed_by=self.request.user)