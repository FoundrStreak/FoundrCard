"""
────────────────────────────────────────────────────────────────────────────
 User Serializers - FoundrStreak API v1
────────────────────────────────────────────────────────────────────────────
 Includes:
 - CustomRegisterSerializer: registration logic
"""

import logging
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.utils import timezone
from rest_framework import serializers
from dj_rest_auth.serializers import UserDetailsSerializer as BaseUserDetailsSerializer
from dj_rest_auth.registration.serializers import RegisterSerializer as BaseRegisterSerializer
from .models import (
    CustomUser as User
)

logger = logging.getLogger(__name__)


class CustomRegisterSerializer(BaseRegisterSerializer):
    """
    Override registration to enforce allowed statuses.
    """
    username = None  # disable custom username input


class UserEmailSerializer(serializers.ModelSerializer):
    """
    Serializer exposing only validated email.
    """
    class Meta:
        model = User
        fields = ['email']
        read_only_fields = ['email']

    def validate_email(self, value: str) -> str:
        val = value.lower().strip()
        if not val or '@' not in val:
            raise ValidationError("Enter a valid email address.")
        if User.objects.filter(email=val).exists():
            raise ValidationError("Email already in use.")
        return val


class UserPublicProfileSerializer(serializers.ModelSerializer):
    """
    Read-only public profile of a user.
    """

    class Meta:
        model = User
        fields = [
            'id', 'username', 'first_name', 'last_name',
            'profile_picture', "profile_picture_url", 'is_premium',
            'date_joined',
        ]
        read_only_fields = fields

    def to_representation(self, instance):
        try:
            data = super().to_representation(instance)
            if self.context.get('show_email', False):
                data['email'] = instance.email
            return data
        except Exception as e:
            logger.error(
                f"UserPublicProfileSerializer error for user {instance.pk}: {e}")
            raise ValidationError("Could not serialize user profile.")


class UserSerializer(BaseUserDetailsSerializer):
    """
    Full authenticated user data with streak and settings.
    """
    class Meta:
        model = User
        fields = tuple(BaseUserDetailsSerializer.Meta.fields) + (
            'username', 'profile_picture', "profile_picture_url",
            'is_premium', 'premium_expiry', 'google_id', 'stripe_customer_id',
            'subscription_tier', 'date_joined', 'last_login',

        )
        read_only_fields = (
            'email', 'is_active', 'is_staff',
            'is_premium', 'premium_expiry', 'google_id', 'subscription_user',
            'date_joined', 'last_login', 'stripe_customer_id'

        )

    def to_representation(self, instance):
        try:
            data = super().to_representation(instance)
            data['has_active_premium'] = instance.has_active_premium()
            return data
        except Exception as e:
            logger.error(
                f"UserSerializer to_rep error user {instance.id}: {e}")
            raise ValidationError("Unable to serialize user details.")

    def update(self, instance, validated_data):
        try:
            user = super().update(instance, validated_data)
            return user

        except IntegrityError as e:
            if 'username' in str(e):
                raise ValidationError({
                    'username': 'This username is already taken. Please choose a different one.'
                })
            logger.error(
                f"Database error during user update for {instance.id}: {e}")
            raise ValidationError(
                "A database error occurred while updating your profile.")
        except Exception as e:
            logger.error(f"User update failed for {instance.id}: {e}")
            raise ValidationError(
                "An unexpected error occurred while updating your profile.")
