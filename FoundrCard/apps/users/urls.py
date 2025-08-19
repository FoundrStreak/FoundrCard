from django.urls import path

from .views import (
    CheckEmailView,
    DeleteAccountView,
    UserDetailView,
    UserProfileView,
    UsernameCheckView,
)

urlpatterns = [
    # User Profile & Account Management
    # GET, PATCH - api/user/me/
    path("me/", UserProfileView.as_view(), name="user_profile"),
    # DELETE - api/user/delete/
    path("delete/", DeleteAccountView.as_view(), name="user_delete_account"),

    # GET, PATCH - api/user/<str:username>/
    path("<str:username>/", UserDetailView.as_view(), name="user_detail"),

    # Availability Checks
    # GET - api/user/check-email?email={str}
    path("check-email", CheckEmailView.as_view(), name="check_email"),
    # GET - api/user/check-username?username={str}
    path("check-username", UsernameCheckView.as_view(), name="check_username"),
]
