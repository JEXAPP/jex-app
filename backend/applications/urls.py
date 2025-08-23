from django.urls import path
from applications.views.applications import ApplicationCreateView, ApplicationDetailView
from applications.views.offer import  OfferCreateView, OfferConsultView, DecideOfferView


urlpatterns = [
    path('apply/', ApplicationCreateView.as_view(), name='apply'),
    path('apply/<int:pk>/detail/', ApplicationDetailView.as_view(), name='application-detail'),
    path('<int:application_id>/offer/', OfferCreateView.as_view(), name='offer-create'),
    path('offers/consult/', OfferConsultView.as_view(), name='offer-consult'),
    path('offers/<int:offer_id>/decide/', DecideOfferView.as_view(), name='offer-decision'),
]
