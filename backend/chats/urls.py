from django.urls import path

from chats.views.chat import StreamTokenView


urlpatterns = [
    path('stream/token/', StreamTokenView.as_view(), name='stream_token'),
]