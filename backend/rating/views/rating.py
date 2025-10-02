from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from user_auth.permissions import IsInGroup
from user_auth.constants import EMPLOYER_ROLE
from rating.serializers.rating import SingleRatingSerializer

class BulkCreateRatingView(APIView):
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE]

    def post(self, request, *args, **kwargs):
        data = request.data
        if not isinstance(data, list):
            return Response({"message": "El body debe ser un array de objetos."}, status=400)

        errors = []
        for item in data:
            serializer = SingleRatingSerializer(data=item, context={'request': request})
            if serializer.is_valid():
                serializer.save()
            else:
                errors.append(serializer.errors)

        if errors:
            return Response({"message": "Algunas calificaciones no se guardaron.", "errors": errors},
                            status=status.HTTP_400_BAD_REQUEST)
        return Response({"message": "Se guardaron las calificaciones correctamente."}, status=status.HTTP_201_CREATED)