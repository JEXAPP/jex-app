from django.urls import path
from applications.views.applications import ApplicationCreateView, ApplicationStatusRejectedUpdateView, ListApplicationsByShiftView, ApplicationDetailView
from applications.views.attendance import AttendanceConfirmationView
from applications.views.jobs import EmployeeJobsView
from applications.views.jobs import EmployeeJobsView
from applications.views.offer import  EmployeeSearchDetailView, EmployeeSearchView, ListOfferEmployeeShiftsView, ListOfferEventByState, OfferAcceptedDetailView, OfferCreateView, OfferConsultView, DecideOfferView, OfferDetailView



urlpatterns = [
    path('apply/', ApplicationCreateView.as_view(), name='apply'),
    path('apply/<int:application_id>/detail/', ApplicationDetailView.as_view(), name='application-detail'),
    path('offers/', OfferCreateView.as_view(), name='offer-create'),
    path("by-vacancy/<int:vacancy_pk>/shift/<int:shift_pk>/", ListApplicationsByShiftView.as_view(), name="applications-by-shift"),
    path('offers/consult/', OfferConsultView.as_view(), name='offer-consult'),
    path('offers/<int:pk>/detail/', OfferDetailView.as_view(), name='offer-detail'),
    path('offers/<int:offer_id>/decide/', DecideOfferView.as_view(), name='offer-decision'),
    path('offers/<int:employee_id>/shifts', ListOfferEmployeeShiftsView.as_view(), name='offer-list-by-employee'),
    path('offers/<int:event_id>/state/<int:state_id>/', ListOfferEventByState.as_view(), name='offer-list-by-state'),
    path("offer-detail/<int:offer_id>/accepted/", OfferAcceptedDetailView.as_view(), name="accepted-offer-detail"),
    path("attendance-confirmation/<int:offer_id>/", AttendanceConfirmationView.as_view(), name="attendance-confirmation"),
    path("employees/search/", EmployeeSearchView.as_view(), name="employee-search"),
    path("employees/search/<int:employee_id>/", EmployeeSearchDetailView.as_view(), name="employee-search-detail"),
    # path("shift/<int:shift_id>/qr/<str:action>/", QRPermissionToggleView.as_view(), name="shift-qr-toggle"),
    # path("shifts/<int:shift_id>/qr/validate/", QRShiftValidationView.as_view(), name="shift-qr-validate"),
    path("employee-jobs/", EmployeeJobsView.as_view(), name="employee-jobs"),
    path('applications/rejected/<int:application_id>/', ApplicationStatusRejectedUpdateView.as_view(), name='application-status-update'),
]
