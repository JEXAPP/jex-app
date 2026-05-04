from django.forms import ValidationError
from mercadopago.resources import Payment
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from applications.constants import ApplicationStates, OfferStates
from applications.models.applications import Application
from applications.models.offers import Offer
from notifications.models.notification import Notification
from payments.constants import PaymentStates
from rating.models.rating import Rating
from user_auth.constants import EMPLOYER_ROLE
from user_auth.models.employer import EmployerProfile
from user_auth.permissions import IsInGroup
from user_auth.serializers.employer import (
    CompleteEmployerSocialSerializer,
    EmployerProfileDescriptionSerializer,
    EmployerRegisterSerializer,
    UpdateEmployerProfileSerializer,
    ViewEmployerProfileDescriptionSerializer,
)
from django.db.models import F, Exists, OuterRef


class EmployerRegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = EmployerRegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Employer registered"}, status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CompleteEmployerSocialView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = CompleteEmployerSocialSerializer(
            data=request.data, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Employer profile completed"}, status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EmployerProfileDescriptionView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE]

    def put(self, request):
        try:
            profile = request.user.employer_profile
        except EmployerProfile.DoesNotExist:
            return Response(
                {"detail": "Perfil de empleador no encontrado."}, status=404
            )

        serializer = EmployerProfileDescriptionSerializer(
            profile, data=request.data, partial=True
        )
        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({"errors": e.detail}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"detail": f"Unexpected error: {str(e)}"}, status=500)


class ViewEmployerProfileDescription(APIView):
    permission_classes = [permissions.IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE]

    def get(self, request):
        try:
            profile = request.user.employer_profile
        except EmployerProfile.DoesNotExist:
            return Response(
                {"detail": "Perfil de empleador no encontrado."}, status=404
            )

        serializer = ViewEmployerProfileDescriptionSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UpdateEmployerProfileDescriptionView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE]

    def put(self, request):
        try:
            profile = request.user.employer_profile
        except EmployerProfile.DoesNotExist:
            return Response("Perfil de empleador no encontrado.", status=404)

        serializer = UpdateEmployerProfileSerializer(
            profile, data=request.data, partial=False, context={"user": request.user}
        )

        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        serializer.save()

        return Response({"detail": "Perfil actualizado correctamente."}, status=200)


class EmployerNotifyView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE]

    def get(self, request):
        user = request.user
        employer_profile = user.employer_profile

        # 1. Notificaciones no leídas
        has_unread_notifications = Notification.objects.filter(
            user=user, read=False
        ).exists()

        # 2. Pagos pendientes en sus eventos
        has_unpaid_events = Payment.objects.filter(
            offer__selected_shift__vacancy__event__owner=user,
            state__name=PaymentStates.PENDING.value,
        ).exists()

        # 3. Empleados sin calificar
        already_rated = Rating.objects.filter(
            rater=user,
            behavior__user=OuterRef("employee__user"),
            event=OuterRef("selected_shift__vacancy__event"),
        )
        has_pending_ratings = (
            Offer.objects.filter(
                employer=employer_profile,
                state__name__in=[
                    OfferStates.COMPLETED.value,
                    OfferStates.NOT_SHOWN.value,
                ],
            )
            .exclude(Exists(already_rated))
            .exists()
        )

        # 4. Postulaciones pendientes en sus vacantes
        has_pending_applications = Application.objects.filter(
            shift__vacancy__event__owner=user,
            state__name=ApplicationStates.PENDING.value,
        ).exists()

        return Response(
            {
                "has_unread_notifications": has_unread_notifications,
                "has_unpaid_events": has_unpaid_events,
                "has_pending_ratings": has_pending_ratings,
                "has_pending_applications": has_pending_applications,
            }
        )