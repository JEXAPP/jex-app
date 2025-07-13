from django.urls import path
from .views import AssignRoleView, GoogleLogin, LogoutView, UserRegistrationView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
    
urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/jwt/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/jwt/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('login/google/', GoogleLogin.as_view(), name='google_login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('assign-role/', AssignRoleView.as_view(), name='assign-role-no-login'),

]