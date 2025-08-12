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

        api_secret = settings.CLOUDINARY_STORAGE.get('API_SECRET')
        api_key = settings.CLOUDINARY_STORAGE.get('API_KEY')
        cloud_name = settings.CLOUDINARY_STORAGE.get('CLOUD_NAME')

        if not all([api_secret, api_key, cloud_name]):
            return Response({"error": "Cloudinary credentials not configured"}, status=500)

        signature = cloudinary.utils.api_sign_request(
            params_to_sign,
            api_secret
        )

        return Response({
            'timestamp': timestamp,
            'signature': signature,
            'api_key': api_key,
            'cloud_name': cloud_name,
            'folder': folder,
        })