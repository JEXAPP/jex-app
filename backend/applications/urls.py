from django.urls import path
from applications.views.applications import ApplicationCreateView, ListApplicationsByShiftView, ApplicationDetailView
from applications.views.attendance import AttendanceValidationView
from applications.views.offer import  ListOfferEventByState, OfferAcceptedDetailView, OfferCreateView, OfferConsultView, DecideOfferView, OfferDetailView



urlpatterns = [
    path('apply/', ApplicationCreateView.as_view(), name='apply'),
    path('apply/<int:pk>/detail/', ApplicationDetailView.as_view(), name='application-detail'),
    path('<int:application_id>/offer/', OfferCreateView.as_view(), name='offer-create'),
    path("by-vacancy/<int:vacancy_pk>/shift/<int:shift_pk>/", ListApplicationsByShiftView.as_view(), name="applications-by-shift"),
    path('offers/consult/', OfferConsultView.as_view(), name='offer-consult'),
    path('offers/<int:pk>/detail/', OfferDetailView.as_view(), name='offer-detail'),
    path('offers/<int:offer_id>/decide/', DecideOfferView.as_view(), name='offer-decision'),
    path('offers/<int:event_id>/state/<int:state_id>/', ListOfferEventByState.as_view(), name='offer-list-by-state'),
    path("offer-detail/<int:shift_id>/accepted/", OfferAcceptedDetailView.as_view(), name="accepted-offer-detail"),
    path("validate/<int:shift_id>/user/<int:user_id>/", AttendanceValidationView.as_view(), name="attendance-validate"),
]
