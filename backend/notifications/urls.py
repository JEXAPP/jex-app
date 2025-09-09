from django.urls import path

from notifications.views.notification import ListNotificationView, SetNotificationReadBulkView, SetNotificationReadView


urlpatterns = [
    path('', ListNotificationView.as_view(), name='notification-list-create'),
    path('<int:pk>/read', SetNotificationReadView.as_view(), name='notification-detail'),
    path('read-bulk/', SetNotificationReadBulkView.as_view(), name='notification-read-bulk'),

]   