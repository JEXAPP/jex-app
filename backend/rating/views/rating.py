from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from user_auth.permissions import IsInGroup
from user_auth.constants import EMPLOYER_ROLE, EMPLOYEE_ROLE
from rating.serializers.rating import SingleRatingSerializer, ViewRatingsSerializer
from rating.models import Behavior
from rating.errors.rating_menssage import BODY_MUST_BE_ARRAY, RATINGS_SAVED, SOME_RATINGS_NOT_SAVED
from rest_framework.generics import RetrieveAPIView

class BulkCreateRatingView(APIView):
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE]

    def post(self, request, *args, **kwargs):
        data = request.data
        if not isinstance(data, list):
            return Response({"message": BODY_MUST_BE_ARRAY}, status=400)

        errors = []
        for item in data:
            serializer = SingleRatingSerializer(data=item, context={'request': request})
            if serializer.is_valid():
                serializer.save()
            else:
                errors.append(serializer.errors)

        if errors:
            return Response(
                {"message": SOME_RATINGS_NOT_SAVED, "errors": errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        return Response(
            {"message": RATINGS_SAVED},
            status=status.HTTP_201_CREATED
        )

class ViewRatings(RetrieveAPIView):
    serializer_class = ViewRatingsSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'user_id'
    lookup_url_kwarg = 'user_id'

    def get_queryset(self):
        return Behavior.objects.all()

   





