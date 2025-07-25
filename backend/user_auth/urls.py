from django.urls import path
from user_auth.views.auth import EmailTokenObtainPairView, CustomGoogleLoginView, LogoutView
from rest_framework_simplejwt.views import TokenRefreshView

from user_auth.views.employee import CompleteEmployeeSocialView, EmployeeAdditionalInfoView, EmployeeRegisterView
from user_auth.views.employer import CompleteEmployerSocialView, EmployerRegisterView
from user_auth.views.password_reset import PasswordResetCompleteView, PasswordResetRequestView, PasswordResetVerifyView
from user_auth.views.phone_verification import SendPhoneVerificationCodeView, VerifyPhoneCodeView
    
urlpatterns = [
    path('register/employer/', EmployerRegisterView.as_view(), name='register-employer'),
    path('register/employee/', EmployeeRegisterView.as_view(), name='register-employee'),
    path('register/employer/social/', CompleteEmployerSocialView.as_view(), name='register-employer-social'),
    path('register/employee/social/', CompleteEmployeeSocialView.as_view(), name='register-employee-social'),
    path('login/jwt/', EmailTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/jwt/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('login/google/', CustomGoogleLoginView.as_view(), name='google_login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset'),
    path('password-reset-verify/', PasswordResetVerifyView.as_view(), name='password_reset_verify'),
    path('password-reset-complete/', PasswordResetCompleteView.as_view(), name='password_reset_complete'),
    path('verify/send-code/', SendPhoneVerificationCodeView.as_view(), name='send-phone-code'),
    path('verify/check-code/', VerifyPhoneCodeView.as_view(), name='verify-phone-code'),
    path('employee/additional-info', EmployeeAdditionalInfoView.as_view(), name='employee-additional-info'),
]