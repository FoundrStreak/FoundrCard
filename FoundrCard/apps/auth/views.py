"""
User views for the User API v1.

This module contains all the view classes that handle user-related API endpoints,
including authentication, profile management, and user interactions.
"""

import logging
from typing import Any, Dict

from django.contrib.auth import get_user_model
from django.db.models import Count, Q

from rest_framework import status
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListAPIView, RetrieveUpdateAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView


from apps.auth.serializers import (
    UserPublicProfileSerializer,
    UserSerializer,
)
from apps.auth.utils import get_or_create_user, get_tokens_for_user, get_user_info_from_id_token

# Initialize logger for this module
logger = logging.getLogger(__name__)

# Get the custom User model
User = get_user_model()


class GoogleAuthAPIView(APIView):
    """
    API endpoint for Google OAuth2 authentication.

    Accepts Google ID token or access token, verifies it, creates or retrieves
    the user, and returns JWT tokens.
    """

    permission_classes = [AllowAny]
    throttle_scope = 'auth'

    def post(self, request) -> Response:
        """
        Handles POST requests for Google authentication.

        Retrieves the ID token or access token from the request,
        authenticates the user with Google, and returns JWT tokens.

        Args:
            request: The HTTP request object.

        Returns:
            Response: A DRF Response object containing JWT tokens and user data
                      on success, or an error message on failure.
        """
        token: str = request.data.get(
            "id_token") or request.data.get("access_token")

        if not token:
            logger.warning("Google auth attempt without token.")
            return Response(
                {"error": "Missing required token parameter."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user_info: Dict[str, Any] = get_user_info_from_id_token(token)
            user, created = get_or_create_user(user_info)
            tokens: Dict[str, str] = get_tokens_for_user(user)

            logger.info(
                f"Google authentication successful for user: {user.email} (created={created})."
            )

            return Response(
                {
                    "access": tokens["access"],
                    "refresh": tokens["refresh"],
                    "user": UserPublicProfileSerializer(user, context={"request": request}).data,
                    "created": created,
                },
                status=status.HTTP_200_OK,
            )

        except ValueError as e:
            error_message = str(e)
            if "invalid" in error_message.lower() or "expired" in error_message.lower():
                logger.warning(
                    f"Invalid or expired Google token: {error_message}.")
                return Response(
                    {"error": "Invalid or expired token."},
                    status=status.HTTP_401_UNAUTHORIZED,
                )
            else:
                logger.error(
                    f"Unexpected ValueError during Google auth: {error_message}.", exc_info=True
                )
                return Response(
                    {"error": "Authentication failed. Please try again."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        except Exception as e:
            logger.error(
                f"Unhandled error during Google authentication: {str(e)}.", exc_info=True
            )
            return Response(
                {"error": "An unexpected error occurred during authentication."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class DeleteAccountView(APIView):
    """
    API endpoint for authenticated users to delete their own account.

    Authentication:
        - Requires a valid JWT token.
    Permissions:
        - Only the authenticated user can delete their own account.
    Rate Limiting:
        - Throttled to prevent abuse.
    Methods:
        DELETE: Delete the authenticated user's account.
    """

    permission_classes = [IsAuthenticated]
    throttle_scope = 'user_delete_account'

    def delete(self, request, *args, **kwargs) -> Response:
        """
        Handles DELETE requests to delete the authenticated user's account.

        Args:
            request: The HTTP request object.
            *args: Variable length argument list.
            **kwargs: Arbitrary keyword arguments.

        Returns:
            Response: A DRF Response object indicating success (204 No Content)
                      or an error.
        """
        user = request.user
        try:
            user_email = user.email  # Store email before deletion for logging
            user.delete()
            logger.info(f"User account deleted: {user_email}.")
            return Response(
                {'detail': 'Account deleted successfully.'},
                status=status.HTTP_204_NO_CONTENT,
            )
        except Exception as e:
            logger.error(
                f"Error deleting account for user {user.email}: {str(e)}.", exc_info=True
            )
            return Response(
                {"error": "Failed to delete account. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class UserProfileView(RetrieveUpdateAPIView):
    """
    API endpoint for retrieving and updating the authenticated user's profile.

    This view allows users to view and modify their own profile information.
    It supports both retrieving the full profile (GET) and partial updates (PATCH).

    Authentication:
        - Requires a valid JWT token in the Authorization header.
    Permissions:
        - User must be authenticated.
    Methods:
        GET: Retrieve the authenticated user's profile.
        PATCH: Update the authenticated user's profile.
    """

    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'patch', 'head', 'options']
    throttle_scope = 'user_profile'

    def get_object(self) -> User:
        """
        Return the user associated with the current request.

        Returns:
            User: The authenticated user instance.
        """
        return self.request.user

    def get_serializer_context(self) -> Dict[str, Any]:
        """
        Add the request to the serializer context.

        This ensures the serializer has access to the current request,
        which can be useful for various purposes (e.g., generating absolute URLs).

        Returns:
            dict: The serializer context with the request object.
        """
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def update(self, request, *args, **kwargs) -> Response:
        """
        Handle PATCH requests for partial updates of the user profile.

        Args:
            request: The HTTP request object.
            *args: Variable length argument list.
            **kwargs: Arbitrary keyword arguments.

        Returns:
            Response: The updated user data or an error message.
        """
        try:
            return super().update(request, *args, **kwargs)
        except Exception as e:
            logger.error(
                f"Error updating user profile for user {request.user.email}: {str(e)}.",
                exc_info=True,
            )
            return Response(
                {"error": "Failed to update profile. Please try again."},
                status=status.HTTP_400_BAD_REQUEST,
            )


class UserDetailView(RetrieveUpdateAPIView):
    """
    API endpoint for retrieving and (partially) updating a user's public profile.

    This view allows users to view any active user's public profile
    and allows an authenticated user to update their *own* profile.
    """

    serializer_class = UserPublicProfileSerializer
    lookup_field = 'username'
    lookup_url_kwarg = 'username'
    http_method_names = ['get', 'patch', 'head', 'options']
    throttle_scope = 'user_detail'

    def get_queryset(self):
        """
        Get the queryset of active users, prefetching related streak information.

        Returns:
            QuerySet: A queryset of active User objects.
        """
        return User.objects.filter(is_active=True).select_related('streak')

    def get_serializer_context(self) -> Dict[str, Any]:
        """
        Add the request to the serializer context.

        Returns:
            dict: The serializer context with the request object.
        """
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def get_permissions(self):
        """
        Set permissions based on the HTTP method.

        - PATCH requests require authentication.
        - GET requests (for viewing profiles) are allowed for any user.

        Returns:
            list: A list of permission instances.
        """
        if self.request.method == 'PATCH':
            return [IsAuthenticated()]
        return [AllowAny()]

    def update(self, request, *args, **kwargs) -> Response:
        """
        Handle PATCH requests to update a user's profile.

        Ensures that only the owner of the profile can update it.

        Args:
            request: The HTTP request object.
            *args: Variable length argument list.
            **kwargs: Arbitrary keyword arguments (should contain 'username').

        Returns:
            Response: The updated user data or an error message.
        """
        if request.user.username != kwargs.get('username'):
            return Response(
                {"error": "You do not have permission to perform this action."},
                status=status.HTTP_403_FORBIDDEN,
            )
        try:
            return super().update(request, *args, **kwargs)
        except Exception as e:
            logger.error(
                f"Error updating user profile for {kwargs.get('username')}: {e}.", exc_info=True)
            return Response(
                {"error": "Failed to update profile. Please try again."},
                status=status.HTTP_400_BAD_REQUEST,
            )


class CheckEmailView(APIView):
    """
    API endpoint to check if an email is available for registration.

    Allows unauthenticated users to check email availability.
    """

    permission_classes = [AllowAny]
    throttle_scope = 'email_check'

    def get(self, request, *args, **kwargs) -> Response:
        """
        Handles GET requests to check email availability.

        Expects an 'email' query parameter.

        Args:
            request: The HTTP request object.
            *args: Variable length argument list.
            **kwargs: Arbitrary keyword arguments.

        Returns:
            Response: JSON indicating if the email is available and a message.
        """
        email: str = request.query_params.get('email', '').strip().lower()

        if not email:
            return Response(
                {'available': False, 'message': 'Email parameter is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            is_available: bool = not User.objects.filter(
                email__iexact=email).exists()
            return Response(
                {
                    'available': is_available,
                    'message': 'Email is available.'
                    if is_available
                    else 'Email is already registered.',
                }
            )
        except Exception as e:
            logger.error(
                f"Error checking email availability for '{email}': {e}.", exc_info=True
            )
            return Response(
                {
                    'available': False,
                    'message': 'An error occurred while checking email availability.',
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class UsernameCheckView(APIView):
    """
    API endpoint to check if a username is available.

    This view simply checks if a username is already taken.
    It does not provide suggestions.
    """

    permission_classes = [IsAuthenticated]
    throttle_scope = 'username_check'

    def get(self, request, *args, **kwargs) -> Response:
        """
        Check if a username is available.

        Expects a 'username' query parameter. Performs basic validation.

        Args:
            request: The HTTP request object.
            *args: Variable length argument list.
            **kwargs: Arbitrary keyword arguments.

        Returns:
            Response: JSON with availability status and a message.
        """
        username: str = request.query_params.get('username', '').strip()

        if not username:
            return Response(
                {'available': False, 'message': 'Username parameter is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(username) < 3:
            return Response(
                {'available': False,
                    'message': 'Username must be at least 3 characters long.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not username.replace('_', '').isalnum():
            return Response(
                {
                    'available': False,
                    'message': 'Username can only contain letters, numbers, and underscores.',
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            is_available: bool = not User.objects.filter(
                username__iexact=username
            ).exclude(pk=request.user.pk).exists()

            response_data: Dict[str, Any] = {
                'available': is_available,
                'message': 'Username is available.'
                if is_available
                else 'Username is already taken.',
            }

            return Response(response_data)

        except Exception as e:
            logger.error(
                f"Error checking username availability: {str(e)}.", exc_info=True)
            return Response(
                {
                    'available': False,
                    'message': 'An error occurred while checking username availability.',
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
