from django.urls import path
from rating.views.rating import BulkCreateRatingView, ViewRatings, ListEmployerEventsView

urlpatterns = [
    path('rate/', BulkCreateRatingView.as_view(), name='bulk-realize-rating'),
    path('employers/torating/' , ListEmployerEventsView.as_view(), name='list-employers-to-rating'),
    path('viewratings/<int:user_id>/', ViewRatings.as_view(), name='list-participation-employee'),
]