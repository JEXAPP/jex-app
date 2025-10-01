from django.urls import path
from rating.views.rating import CreateRatingView

urlpatterns = [
    path('rating/<worker_id>/', CreateRatingView.as_view(), name='realize-rating'),

]