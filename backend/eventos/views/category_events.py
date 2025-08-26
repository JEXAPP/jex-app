from eventos.models.category_events import Category
from eventos.serializers.category_events import ListCategorySerializer
from rest_framework.generics import ListAPIView
from user_auth.permissions import IsInGroup
from rest_framework.permissions import IsAuthenticated
from user_auth.constants import EMPLOYEE_ROLE, EMPLOYER_ROLE

class ListCategoryView(ListAPIView):
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE, EMPLOYEE_ROLE]
    serializer_class = ListCategorySerializer
    
    queryset = Category.objects.all()
