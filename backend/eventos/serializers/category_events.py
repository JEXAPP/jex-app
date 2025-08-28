from rest_framework import serializers
from eventos.models.category_events import Category

class ListCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']  # Agregá otros campos si lo necesitás