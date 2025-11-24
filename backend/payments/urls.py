

from django.urls import path
from payments.views.payments import GenerateMPStateView, GeneratePaymentLinkView, MercadoPagoAccountAssociatedView, MercadoPagoOAuthCallbackView, MercadoPagoWebhookView, PaymentCallbackView


urlpatterns = [
    path("mercadopago/callback/", MercadoPagoOAuthCallbackView.as_view(), name="mercadopago-callback"),
    path("mercadopago/generate-state/", GenerateMPStateView.as_view(), name="mercadopago-generate-state"),
    path('mercadopago/payments/<int:offer_id>/', GeneratePaymentLinkView.as_view(), name='mercadopago-generate-payment-link'),
    path("success/", PaymentCallbackView.as_view(), name="payment-success"),
    path("failure/", PaymentCallbackView.as_view(), name="payment-failure"),
    path("pending/", PaymentCallbackView.as_view(), name="payment-pending"),
    path("mercadopago/webhook/", MercadoPagoWebhookView.as_view(), name="mercadopago-webhook"),
    path("mercadopago/associated/", MercadoPagoAccountAssociatedView.as_view(), name="mercadopago-associated"),

]