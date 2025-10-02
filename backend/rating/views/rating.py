from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from user_auth.permissions import IsInGroup
from user_auth.constants import EMPLOYER_ROLE
from rating.serializers.rating import SingleRatingSerializer, ViewRatingsSerializer
from rating.models import Behavior
from rating.constats import RatingMessages
from rest_framework.generics import RetrieveAPIView

class BulkCreateRatingView(APIView):
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE]

    def post(self, request, *args, **kwargs):
        data = request.data
        if not isinstance(data, list):
            return Response({"message": RatingMessages.BODY_MUST_BE_ARRAY}, status=400)

        errors = []
        for item in data:
            serializer = SingleRatingSerializer(data=item, context={'request': request})
            if serializer.is_valid():
                serializer.save()
            else:
                errors.append(serializer.errors)

        if errors:
            return Response(
                {"message": RatingMessages.SOME_RATINGS_NOT_SAVED, "errors": errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        return Response(
            {"message": RatingMessages.RATINGS_SAVED},
            status=status.HTTP_201_CREATED
        )

class ViewRatings(RetrieveAPIView):
    serializer_class = ViewRatingsSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'user_id'
    lookup_url_kwarg = 'user_id'

    def get_queryset(self):
        return Behavior.objects.all()

   





# class listEmployerToRatingView(APIView):
#     permission_classes = [IsAuthenticated, IsInGroup]
#     required_groups = [EMPLOYEE_ROLE]
#     serializer_class = ListParticipationEmployeeSerializer

#     def get(self, request, *args, **kwargs):
#         employee_id = request.user.id
#         offers = Offer.objects.filter(
#             employee__user_id=employee_id,
#             state__name=OfferStates.COMPLETED.value
#         ).select_related('event', 'event__owner').distinct()

#         employers = {}
#         for offer in offers:
#             employer = offer.event.owner
#             if employer.id not in employers:
#                 employers[employer.id] = {
#                     'id': employer.id,
#                     'name': employer.first_name + ' ' + employer.last_name,
#                     'email': employer.email
#                 }

#         return Response(list(employers.values()), status=status.HTTP_200_OK)