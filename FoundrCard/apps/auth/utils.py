"""
Utility functions for the user app.

This module provides helper functions for user authentication,
token handling, and user-related operations.
"""

import logging
from typing import Dict, Any, Tuple

from django.conf import settings
from django.core.cache import cache
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model

from google.auth.transport import requests
from google.oauth2 import id_token

from rest_framework.exceptions import AuthenticationFailed, ValidationError
from rest_framework_simplejwt.tokens import RefreshToken


logger = logging.getLogger(__name__)
UserModel = get_user_model()


def validate_google_token(token: str) -> Dict[str, Any]:
    """
    Verify Google ID token and return decoded payload.

    Raises:
        AuthenticationFailed: If token is invalid or unverifiable.
    """
    try:
        payload = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            settings.GOOGLE_OAUTH2_CLIENT_ID,
            clock_skew_in_seconds=10
        )

        if payload['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise AuthenticationFailed('Invalid issuer.')

        if payload['aud'] != settings.GOOGLE_OAUTH2_CLIENT_ID:
            raise AuthenticationFailed('Invalid audience.')

        return payload

    except Exception as e:
        logger.error("Token validation failed: %s", str(e), exc_info=True)
        raise AuthenticationFailed("Token is invalid or expired.") from e


def get_or_create_user(user_info: Dict[str, Any]) -> Tuple[UserModel, bool]:
    """
    Retrieve or create a user based on OAuth data.

    Returns:
        Tuple[User instance, created boolean]
    """
    email = user_info.get('email', '').lower().strip()
    if not email:
        raise ValidationError("Email is required")

    cache_key = f"user:{email}"
    user = cache.get(cache_key)

    if not user:
        try:
            user = UserModel.objects.get(email=email)
            cache.set(cache_key, user, USER_CACHE_TIMEOUT)
            created = False
        except UserModel.DoesNotExist:
            user = None
            created = True

    if user is None:
        user = UserModel.objects.create_user(
            email=email,
            first_name=user_info.get("given_name", ""),
            last_name=user_info.get("family_name", ""),
            profile_picture_url=user_info.get("picture", ""),
            is_active=user_info.get("email_verified", False),
        )
        logger.info("Created new user: %s", user.email)
        cache.set(cache_key, user, USER_CACHE_TIMEOUT)

    else:
        updated = False
        fields = ["first_name", "last_name", "profile_picture_url"]
        for field in fields:
            new_value = user_info.get(field.replace("_url", ""), "")
            if getattr(user, field) != new_value:
                setattr(user, field, new_value)
                updated = True

        if updated:
            user.save()
            cache.set(cache_key, user, USER_CACHE_TIMEOUT)

    return user, created


def get_user_info_from_id_token(token: str) -> Dict[str, Any]:
    """
    Decode and return Google user profile info from an ID token.
    """
    payload = validate_google_token(token)
    return {
        'email': payload.get('email', '').lower().strip(),
        'name': payload.get('name', ''),
        'given_name': payload.get('given_name', ''),
        'family_name': payload.get('family_name', ''),
        'sub': payload.get('sub', ''),
        'picture': payload.get('picture', ''),
        'email_verified': payload.get('email_verified', False),
        'locale': payload.get('locale', 'en')
    }


def get_tokens_for_user(user: Any) -> Dict[str, str]:
    """
    Generate JWT tokens for a given user or email string.
    """
    if not user:
        raise AuthenticationFailed("User is not provided")

    if isinstance(user, str):
        try:
            user = UserModel.objects.get(email=user)
        except UserModel.DoesNotExist:
            raise AuthenticationFailed("User not found")

    tokens = RefreshToken.for_user(user)
    return {
        'refresh': str(tokens),
        'access': str(tokens.access_token),
    }
