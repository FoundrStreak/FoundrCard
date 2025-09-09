from rest_framework import serializers
from .models import Card, Link, LinkType
from apps.users.serializers import UserPublicProfileSerializer


class LinkTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LinkType
        fields = ["id", "name", "display_name",
                  "icon_name", "color", "category"]


class LinkSerializer(serializers.ModelSerializer):
    link_type = LinkTypeSerializer()

    class Meta:
        model = Link
        fields = ["id", "title", "url", "description", "custom_icon",
                  "custom_color", "is_featured", "order", "link_type"]


class CardSerializer(serializers.ModelSerializer):
    links = LinkSerializer(many=True, read_only=True)
    template = serializers.SlugRelatedField(slug_field="name", read_only=True)
    profile = UserPublicProfileSerializer(read_only=True)

    class Meta:
        model = Card
        fields = '__all__'
