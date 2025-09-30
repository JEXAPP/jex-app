from django.urls import path

from chats.views.chat import StreamTokenView


url_patterns = [
    path('stream/token/', StreamTokenView.as_view(), name='stream_token'),
]