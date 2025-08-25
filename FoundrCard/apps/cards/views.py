
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import Card
from apps.cards.serializers import CardSerializer


class CardViewSet(viewsets.ReadOnlyModelViewSet):
    authentication_classes = []
    permission_classes = [AllowAny]
    queryset = Card.objects.filter(is_active=True,)
    serializer_class = CardSerializer
    lookup_field = "slug"
