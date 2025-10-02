from django.urls import path
from rating.views.rating import BulkCreateRatingView

urlpatterns = [
    path('rate/', BulkCreateRatingView.as_view(), name='bulk-realize-rating')
]