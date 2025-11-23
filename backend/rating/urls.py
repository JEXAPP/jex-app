from django.urls import path
from rating.views.penalty import CreatePenaltyView, ListPenaltyCategoriesView
from rating.views.rating import BulkCreateRatingView, EmployeeRatingDetailView, ViewRatings, ListEmployersEventsView, BulkCreateEmployerRatingView

urlpatterns = [
    path('rate/', BulkCreateRatingView.as_view(), name='bulk-realize-rating'),
    path('employers/torating/', ListEmployersEventsView.as_view(), name='list-employers-to-rating'),
    path('viewratings/<int:user_id>/', ViewRatings.as_view(), name='list-participation-employee'),
    path('rate-employer/', BulkCreateEmployerRatingView.as_view(), name='bulk-realize-employer-rating'),
    path('penalty/categories/', ListPenaltyCategoriesView.as_view(), name='list-penalty-categories'),
    path('penalty/create/', CreatePenaltyView.as_view(), name='create-penalty'),
    path('employee/<int:user_id>/ratings/', EmployeeRatingDetailView.as_view(), name='employee-rating-detail'),
]