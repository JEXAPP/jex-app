from django.urls import path
from notifications.views.device import DeviceRegisterView
from notifications.views.notification import ListNotificationView, NewNotificationsAdviceView, SetNotificationAllReadView, SetNotificationReadView


urlpatterns = [
    path('', ListNotificationView.as_view(), name='notification-list-create'),
    path('<int:pk>/read/', SetNotificationReadView.as_view(), name='notification-detail'),
    path('mark-all-read/', SetNotificationAllReadView.as_view(), name='notification-mark-all-read'),
    path('devices/register/', DeviceRegisterView.as_view(), name='device-register'),
    path('are-new-notifications/', NewNotificationsAdviceView.as_view(), name='are-new-notifications'),
]   