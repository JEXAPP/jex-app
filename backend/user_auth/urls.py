from django.urls import path
from user_auth.views.admin import AdminInfoView
from user_auth.views.auth import EmailTokenObtainPairView, CustomGoogleLoginView, LogoutView
from rest_framework_simplejwt.views import TokenRefreshView

from user_auth.views.employee import CompleteEmployeeSocialView, EmployeeEducationView, EmployeeInterestsView, EmployeeProfileDescriptionView, EmployeeRegisterView, EmployeeValidateMailView, EmployeeWorkExperienceView, ViewEmployeeEducation, ViewEmployeeInterests, ViewEmployeeProfileDescription, ViewEmployeeWorkExperience
from user_auth.views.employer import CompleteEmployerSocialView, EmployerProfileDescriptionView, EmployerRegisterView, UpdateEmployerProfileDescriptionView, ViewEmployerProfileDescription
from user_auth.views.language import EmployeeLanguagesBulkUpdateView, EmployeeLanguagesView, LanguageLevelsView, LanguagesListView
from user_auth.views.password_reset import PasswordResetCompleteView, PasswordResetRequestView, PasswordResetVerifyView
from user_auth.views.phone_verification import SendPhoneVerificationCodeView, VerifyPhoneCodeView
from user_auth.views.user import UserProfileView, ViewMailAndPhone
    
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
    path('employee/profile-description/', EmployeeProfileDescriptionView.as_view(), name='employee-profile-description'),
    path('employee/work-experience/', EmployeeWorkExperienceView.as_view(), name='employee-work-experience'),
    path('employee/education/', EmployeeEducationView.as_view(), name='employee-education'),
    path('employee/interests/', EmployeeInterestsView.as_view(), name='employee-interests'),
    path('employer/profile-description/', EmployerProfileDescriptionView.as_view(), name='employer-profile-description'),
    path('validate-mail/', EmployeeValidateMailView.as_view(), name='employee-validate-mail'),
    path('user/profile/', UserProfileView.as_view(), name='user-profile'),
    path('employee/view-work-experience/', ViewEmployeeWorkExperience.as_view(), name='view-employee-work-experience'),
    path('employee/view-education/', ViewEmployeeEducation.as_view(), name='view-employee-education'),
    path('employee/view-interests/', ViewEmployeeInterests.as_view(), name='view-employee-interests'),
    path('employee/view-profile-description/', ViewEmployeeProfileDescription.as_view(), name='view-employee-profile-description'),
    path('employee/languages/', EmployeeLanguagesView.as_view(), name='employee-languages'),
    path('employer/view-profile-description/', ViewEmployerProfileDescription.as_view(), name='view-employer-profile-description'),
    path('language-levels/', LanguageLevelsView.as_view(), name='language-levels'),
    path('languages/', LanguagesListView.as_view(), name='languages-list'),
    path('employee/language/', EmployeeLanguagesBulkUpdateView.as_view(), name='employee-language-detail'),
    path('view-mail-and-phone/', ViewMailAndPhone.as_view(), name='view-mail-and-phone'),
    path('admin/info', AdminInfoView.as_view(), name='admin-info'),
    path('employer/update-profile-description/', UpdateEmployerProfileDescriptionView.as_view(), name='update-employer-profile-description'),
]