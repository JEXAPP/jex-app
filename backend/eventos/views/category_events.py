from eventos.models.category_events import Category
from eventos.serializers.category_events import ListCategorySerializer
from rest_framework.generics import ListAPIView

class ListCategoryView(ListAPIView):
    queryset = Category.objects.all()
    serializer_class = ListCategorySerializer