from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import RetrieveAPIView, ListAPIView

from notifications.constants import NotificationTypes
from notifications.services.send_notification import send_notification
from rating.models.users_connections import UserConnection
from user_auth.permissions import IsInGroup
from user_auth.constants import EMPLOYER_ROLE, EMPLOYEE_ROLE

from rating.serializers.rating import (
    EmployeeRatingDetailSerializer,
    ViewRatingsSerializer,
    ListEmployerEventsSerializer,
    SingleEmployerRatingSerializer,
    SingleRatingSerializer,
)
from rating.models import Behavior, Rating
from django.db import transaction
from user_auth.models import CustomUser
from eventos.models.event import Event

from rating.errors.rating_menssage import (
    BODY_MUST_BE_ARRAY,
    EVENT_NOT_FOUND,
    RATINGS_SAVED,
    SOME_RATINGS_NOT_SAVED,
    RATING_ALREADY_EXISTS,
)

from applications.models import Offer
from applications.constants import OfferStates
from applications.models.offer_state import OfferState

import logging
logger = logging.getLogger(__name__)


class BulkCreateRatingView(APIView):
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE]

    def post(self, request, *args, **kwargs):
        data = request.data
        if not isinstance(data, list):
            return Response({"message": BODY_MUST_BE_ARRAY}, status=400)
        validated_items, errors = self._validate_and_prepare_employee(data, request)

        if not validated_items:
            return Response({"message": SOME_RATINGS_NOT_SAVED, "errors": errors}, status=status.HTTP_400_BAD_REQUEST)

        try:
            self._create_ratings_from_employees(validated_items, request.user)
        except Exception as exc:
            return Response({"message": SOME_RATINGS_NOT_SAVED, "errors": [str(exc)]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if errors:
            return Response({"message": SOME_RATINGS_NOT_SAVED, "errors": errors}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": RATINGS_SAVED}, status=status.HTTP_201_CREATED)

    def _validate_and_prepare_employee(self, data, request):
        errors = []
        validated_items = []
        seen_pairs = set()

        for item in data:
            serializer = SingleRatingSerializer(data=item, context={'request': request})
            if not serializer.is_valid():
                for val in serializer.errors.values():
                    if isinstance(val, (list, tuple)):
                        for msg in val:
                            errors.append(str(msg))
                    else:
                        errors.append(str(val))
                continue

            v = serializer.validated_data
            key = (v['employee'], v['event'])
            if key in seen_pairs:
                errors.append(RATING_ALREADY_EXISTS)
            else:
                seen_pairs.add(key)
                validated_items.append(v)

        if errors:
            return [], errors

        return validated_items, []

    def _create_ratings_from_employees(self, validated_items, rater):
        rating_objs = []
        affected_behaviors = set()

        for v in validated_items:
            employee_user = v.get('employee_user')
            event_obj = v.get('event_obj')
            link = v.get('link', False)  # valor booleano del frontend

            if not employee_user or not event_obj:
                continue

            # --- manejar vinculación ---
            if link:
                # crear la relación si no existe
                UserConnection.objects.get_or_create(
                    employee=employee_user,
                    employer=rater
                )
            else:
                # eliminar la relación si existe
                UserConnection.objects.filter(
                    employee=employee_user,
                    employer=rater
                ).delete()

            # --- crear rating ---
            behavior, _ = Behavior.objects.get_or_create(user=employee_user)
            affected_behaviors.add(behavior)
            rating_objs.append(Rating(
                behavior=behavior,
                rater=rater,
                event=event_obj,
                rating=v['rating'],
                comments=v.get('comments', ""),
            ))

            try:
                send_notification(
                    user=employee_user,
                        title="¡Calificación recibida!",
                        message=f"{rater.employer_profile.company_name} te calificó por tu trabajo en '{event_obj.name}'.",
                    notification_type_name=NotificationTypes.JOBS.value,
                    data={
                        "event_id": event_obj.id,
                        "rating_value": v['rating'],
                        "rater_name": rater.employer_profile.company_name
                    }
                )
            except Exception as e:
                logger.error("Error enviando notificación:", e)

        if rating_objs:
            with transaction.atomic():
                Rating.objects.bulk_create(rating_objs)
                for behavior in affected_behaviors:
                    behavior.update_average_rating()

class ViewRatings(RetrieveAPIView):
    serializer_class = ViewRatingsSerializer
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE, EMPLOYEE_ROLE]
    lookup_field = 'user_id'
    lookup_url_kwarg = 'user_id'

    def get_queryset(self):
        return Behavior.objects.all()

    def get_object(self):

        user_id = self.kwargs.get(self.lookup_url_kwarg)
        qs = Behavior.objects.filter(user_id=user_id)
        obj = qs.first()

        return obj
    
class ListEmployersEventsView(ListAPIView):
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYEE_ROLE]
    serializer_class = ListEmployerEventsSerializer

    def get_queryset(self):
        offer_completed_state = OfferState.objects.get(name=OfferStates.COMPLETED.value)
        employee_profile = self.request.user.employee_profile
        employee_user = self.request.user

        # Todos los Offers completados
        qs = Offer.objects.filter(
            employee=employee_profile,
            state=offer_completed_state
        ).select_related(
            "selected_shift",
            "selected_shift__vacancy",
            "selected_shift__vacancy__event",
            "selected_shift__vacancy__event__owner",
        )

        # IDs de eventos ya calificados por este empleado al empleador de ese evento
        rated_event_ids = Rating.objects.filter(
            rater=employee_user
        ).values_list('event_id', flat=True)

        # Excluir Offers de eventos ya calificados
        qs = qs.exclude(selected_shift__vacancy__event_id__in=rated_event_ids)

        return qs


class BulkCreateEmployerRatingView(APIView):
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYEE_ROLE]

    def post(self, request, *args, **kwargs):
        data = request.data
        if not isinstance(data, list):
            return Response(BODY_MUST_BE_ARRAY, status=400)

        validated_items, errors = self._validate_and_prepare(data, request)

        if not validated_items:
            return Response({"message": SOME_RATINGS_NOT_SAVED, "errors": errors}, status=status.HTTP_400_BAD_REQUEST)

        try:
            self._create_ratings(validated_items, request.user)
        except Exception as exc:
            # If the DB operation fails we return a server error and ensure
            # nothing was partially committed thanks to transaction.atomic()
            return Response(
                {"message": SOME_RATINGS_NOT_SAVED, "errors": [str(exc)]},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        if errors:
            return Response({"message": SOME_RATINGS_NOT_SAVED, "errors": errors}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": RATINGS_SAVED}, status=status.HTTP_201_CREATED)

    def _validate_and_prepare(self, data, request):
        """Validate batch items using the serializer and return validated_data list
        and a flat list of error messages.
        """
        errors = []
        validated_items = []
        seen_pairs = set()

        # Validate each item individually and collect errors
        for item in data:
            serializer = SingleEmployerRatingSerializer(data=item, context={'request': request})
            if not serializer.is_valid():
                for val in serializer.errors.values():
                    if isinstance(val, (list, tuple)):
                        for msg in val:
                            errors.append(str(msg))
                    else:
                        errors.append(str(val))
                continue

            v = serializer.validated_data
            key = (v['employer'], v['event'])
            if key in seen_pairs:
                # duplicate within the same batch
                errors.append(RATING_ALREADY_EXISTS)
            else:
                seen_pairs.add(key)
                validated_items.append(v)

        # If any errors found, return empty validated_items so the view does not create anything
        if errors:
            return [], errors

        return validated_items, []

    def _create_ratings(self, validated_items, rater):
        """Bulk create Rating objects from validated_data and update behaviors.
        """
        rating_objs = []
        affected_behaviors = set()

        for v in validated_items:
            employer_user = v.get('employer_user')
            event_obj = v.get('event_obj')
            if not employer_user or not event_obj:
                continue

            behavior, _ = Behavior.objects.get_or_create(user=employer_user)
            affected_behaviors.add(behavior)
            rating_objs.append(Rating(
                behavior=behavior,
                rater=rater,
                event=event_obj,
                rating=v['rating'],
                comments=v.get('comments', ""),
            ))

        if rating_objs:
            # Ensure all DB changes happen atomically
            with transaction.atomic():
                Rating.objects.bulk_create(rating_objs)
                for behavior in affected_behaviors:
                    behavior.update_average_rating()

class EmployeeRatingDetailView(ListAPIView):
    serializer_class = EmployeeRatingDetailSerializer
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYEE_ROLE]

    def get_queryset(self):
        user_employee_id = self.kwargs.get('user_id')
        return Rating.objects.filter(
            behavior__user_id=user_employee_id
        ).select_related('rater', 'behavior')

