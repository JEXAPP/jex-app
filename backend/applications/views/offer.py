from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from applications.models.applications import Application
from applications.serializers.offer import ApplicationDetailSerializer, OfferCreateSerializer, OfferConsultSerializer, OfferDecisionSerializer
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from applications.models.offers import Offer

class ApplicationDetailView(APIView):
    def get(self, request, pk):
        try:
            application = Application.objects.select_related('employee__user').get(pk=pk)
        except Application.DoesNotExist:
            return Response({'detail': 'Application not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ApplicationDetailSerializer(application)
        return Response(serializer.data)
    
class OfferCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, application_id):
        serializer = OfferCreateSerializer(data=request.data, context={
            'user': request.user,
            'application_id': application_id
        })
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Oferta creada correctamente."}, status=status.HTTP_200_OK)


class OfferConsultView(APIView):
    def get(self, request):
        user = request.user

        # Traer todas las ofertas del empleado autenticado
        offers = Offer.objects.select_related(
            'application__shift__vacancy__event',
            'application__employee__user'
        ).filter(
            employee__user=user
        )

        # Filtrar manualmente según la fecha de inicio del evento
        active_offers = [
            offer for offer in offers
            if offer.application.shift.vacancy.event.start_date >= timezone.now().date()
        ]

        serializer = OfferConsultSerializer(active_offers, many=True)
        return Response(serializer.data)

class DecideOfferView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, offer_id):
        try:
            offer = Offer.objects.get(id=offer_id)
        except Offer.DoesNotExist:
            return Response({'error': 'La oferta no existe.'}, status=404)

        serializer = OfferDecisionSerializer(offer, data=request.data, context={'user': request.user}, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Decisión registrada correctamente.'})
        return Response(serializer.errors, status=400)