from django.urls import path
from .views import EmailTokenObtainPairView, EmployeeRegisterView, EmployerRegisterView, GoogleLogin, LogoutView, PasswordResetConfirmView, PasswordResetRequestView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
    
urlpatterns = [
    path('register/employer/', EmployerRegisterView.as_view(), name='register-employer'),
    path('register/employee/', EmployeeRegisterView.as_view(), name='register-employee'),
    path('login/jwt/', EmailTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/jwt/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('login/google/', GoogleLogin.as_view(), name='google_login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    # path('assign-role/', AssignRoleView.as_view(), name='assign-role-no-login'),

]