from rest_framework.views import APIView
from rest_framework import status, permissions
from rest_framework.response import Response
from vacancies.errors.vacancies_messages import VACANCY_NOT_FOUND, NO_PERMISSION_EVENT, STATE_UPDATED_SUCCESS
from vacancies.models.vacancy import Vacancy
from vacancies.models.vacancy_state import VacancyState
from vacancies.serializers.vacancy_state import ListsVacancyStates, UpdateVacancyStateSerializer
from user_auth.permissions import IsInGroup
from user_auth.constants import EMPLOYER_ROLE

class VacancyStateListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        states = VacancyState.objects.all()
        serializer = ListsVacancyStates(states, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UpdateVacancyStateView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE]

    def patch(self, request, pk):
        serializer = UpdateVacancyStateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            vacancy = Vacancy.objects.select_related('event').get(id=pk)
        except Vacancy.DoesNotExist:
            return Response({"detail": VACANCY_NOT_FOUND}, status=status.HTTP_404_NOT_FOUND)

        if vacancy.event.owner != request.user:
            return Response({"detail": NO_PERMISSION_EVENT}, status=status.HTTP_403_FORBIDDEN)

        new_state_id = serializer.validated_data['state_id']
        new_state = VacancyState.objects.get(id=new_state_id)

        vacancy.state = new_state
        vacancy.save()

        return Response({"detail": STATE_UPDATED_SUCCESS}, status=status.HTTP_200_OK)