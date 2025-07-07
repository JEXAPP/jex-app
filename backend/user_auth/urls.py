from django.urls import path
from .views import UserRegistrationView
from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login-jwt/', TokenObtainPairView.as_view(), name='token_obtain_pair'),

]