from django.urls import path
from .views import GoogleLogin, UserRegistrationView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
    
urlpatterns = [
    path('auth/register/', UserRegistrationView.as_view(), name='register'),
    path('auth/login/jwt/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/login/jwt/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/login/google/', GoogleLogin.as_view(), name='google_login'),

]