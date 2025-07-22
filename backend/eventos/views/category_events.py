from eventos.models.category_events import Category
from eventos.serializers.category_events import CategorySerializer
from rest_framework.generics import ListAPIView

class CategoryListView(ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer