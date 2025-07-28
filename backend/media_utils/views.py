from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.conf import settings
import time
import cloudinary.utils


class CloudinarySignedUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        timestamp = int(time.time())
        folder = request.query_params.get('folder', 'user_profiles')

        params_to_sign = {
            'timestamp': timestamp,
            'folder': folder,
        }

        signature = cloudinary.utils.api_sign_request(
            params_to_sign,
            settings.CLOUDINARY_API_SECRET
        )

        return Response({
            'timestamp': timestamp,
            'signature': signature,
            'api_key': settings.CLOUDINARY_API_KEY,
            'cloud_name': settings.CLOUDINARY_CLOUD_NAME,
            'folder': folder,
        })