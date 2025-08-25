from rest_framework import serializers
from .models import Card, Link, LinkType, CardTemplate


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

    class Meta:
        model = Card
        fields = [
            "id", "slug", "title", "subtitle", "bio",
            "avatar_type", "avatar_value", "primary_color", "secondary_color",
            "background_style", "template", "links"
        ]
