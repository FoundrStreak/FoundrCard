# urls.py
from rest_framework.routers import DefaultRouter
from apps.cards.views import CardViewSet
from django.urls import path


card_list = CardViewSet.as_view({
    'get': 'list',
})

urlpatterns = [
    path("slug/", card_list, name="card_list"),
]
