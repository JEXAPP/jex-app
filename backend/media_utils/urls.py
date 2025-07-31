from django.urls import path

from media_utils.views import CloudinarySignedUploadView


urlpatterns = [
    path('cloudinary/sign/', CloudinarySignedUploadView.as_view(), name='cloudinary-sign'),
]