from rest_framework.generics import CreateAPIView
from eventos.serializers.event import CreateEventSerializer, CreateEventResponseSerializer
from user_auth.constants import EMPLOYER_ROLE
from user_auth.permissions import IsInGroup
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


class CreateEventView(CreateAPIView):
    """
    Crea un evento para el empleador autenticado.
    """
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE]
    serializer_class = CreateEventSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['user'] = self.request.user
        return context

    def create(self, request, *args, **kwargs):
        """
        Sobrescribimos para devolver el serializer de salida.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        event = serializer.save(owner=request.user)

        response_serializer = CreateEventResponseSerializer(event)
        return Response(response_serializer.data, status=201)

    
