from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.conf import settings
import time
import cloudinary.utils
from rest_framework import serializers
from media_utils.errors.media_errors_messages import CLOUDINARY_CREDENTIALS_NOT_CONFIGURED, CLOUDINARY_INVALID_FOLDER, CLOUDINARY_MISSING_FOLDER_PARAM


class CloudinarySignedUploadView(APIView):
    permission_classes = [IsAuthenticated]

    ALLOWED_FOLDERS = {
        'events-images',
        'user-profiles-images',
        'certificates-docs',
        'work-experiences-docs',
    }

    def get(self, request):
        timestamp = int(time.time())
        folder = request.query_params.get('folder')

        if not folder:
            raise serializers.ValidationError(CLOUDINARY_MISSING_FOLDER_PARAM)

        if folder not in self.ALLOWED_FOLDERS:
            raise serializers.ValidationError(CLOUDINARY_INVALID_FOLDER)

        params_to_sign = {'timestamp': timestamp, 'folder': folder}

        api_secret = settings.CLOUDINARY_STORAGE.get('API_SECRET')
        api_key = settings.CLOUDINARY_STORAGE.get('API_KEY')
        cloud_name = settings.CLOUDINARY_STORAGE.get('CLOUD_NAME')

        if not all([api_secret, api_key, cloud_name]):
            raise serializers.ValidationError(CLOUDINARY_CREDENTIALS_NOT_CONFIGURED)

        signature = cloudinary.utils.api_sign_request(params_to_sign, api_secret)

        return Response({
            'timestamp': timestamp,
            'signature': signature,
            'api_key': api_key,
            'cloud_name': cloud_name,
            'folder': folder,
        })