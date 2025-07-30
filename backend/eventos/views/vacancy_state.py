from rest_framework.views import APIView
from rest_framework import status, permissions
from rest_framework.response import Response
from eventos.models.vacancy import Vacancy
from eventos.models.vacancy_state import VacancyState
from eventos.serializers.vacancy_state import UpdateVacancyStateSerializer
from user_auth.permissions import IsInGroup
from user_auth.constants import EMPLOYER_ROLE


class UpdateVacancyStateView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE]

    def patch(self, request, pk):
        serializer = UpdateVacancyStateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            vacancy = Vacancy.objects.select_related('event').get(id=pk)
        except Vacancy.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if vacancy.event.owner != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        new_state_id = serializer.validated_data['state_id']
        new_state = VacancyState.objects.get(id=new_state_id)

        vacancy.state = new_state
        vacancy.save()

        return Response(status=status.HTTP_200_OK)