from rest_framework import serializers
from rating.utils import get_user_average_rating, get_user_rating_count
from user_auth.models.user import CustomUser


class UserPublicProfileSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()
    rating_count = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['user_name', 'description', 'rating', 'rating_count', 'image_url']

    def get_user_name(self, obj):
        if hasattr(obj, "employee_profile"):
            return f"{obj.first_name} {obj.last_name}".strip()
        elif hasattr(obj, "employer_profile"):
            return obj.employer_profile.company_name
        return obj.email

    def get_description(self, obj):
        if hasattr(obj, "employee_profile"):
            return obj.employee_profile.description
        elif hasattr(obj, "employer_profile"):
            return obj.employer_profile.description
        return None

    def get_rating(self, obj):
        return get_user_average_rating(obj)

    def get_rating_count(self, obj):
        return get_user_rating_count(obj)
    
    def get_image_url(self, obj):
        return obj.profile_image.url if obj.profile_image else None
    
class ViewMailAndPhoneSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    phone = serializers.CharField(allow_null=True)

    class Meta:
        model = CustomUser
        fields = ['email', 'phone']