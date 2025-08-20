"""
Django Admin configuration for the User and related models.

Designed for usability, safety, and powerful insight for non-developers.
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import CustomUser as User

import logging

logger = logging.getLogger(__name__)


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Admin panel for User model.
    - Non-sensitive data only.
    - Visual grouping of personal info, permissions, and activity.
    """
    list_display = (
        'email', 'username', 'first_name', 'last_name',
        'is_active', 'is_staff', 'is_superuser',
        'date_joined', 'last_login',
    )
    list_filter = ('is_active', 'is_staff', 'is_superuser', 'date_joined')
    search_fields = ('email', 'username', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    readonly_fields = (
        'email', 'date_joined', 'last_login', 'google_id', 'premium_expiry'
    )
    actions = ['activate_users', 'deactivate_users',
               'grant_staff', 'revoke_staff']
    filter_horizontal = ('groups', 'user_permissions')

    fieldsets = (
        (None, {'fields': ('email',)}),
        ('Personal Info', {
            'fields': (
                'username', 'first_name', 'last_name',
                'profile_picture',
            )
        }),
        ('Status & Premium', {
            'fields': ('is_premium', 'premium_expiry', 'google_id')
        }),
        ('Permissions', {
            'fields': (
                'is_active', 'is_staff', 'is_superuser',
                'groups', 'user_permissions'
            )
        }),
        ('Activity Stats', {
            'classes': ('collapse',),
            'fields': ('date_joined', 'last_login'),
        }),
    )

    @admin.action(description="Activate selected users")
    def activate_users(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f"{updated} users activated.")

    @admin.action(description="Deactivate selected users")
    def deactivate_users(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f"{updated} users deactivated.")

    @admin.action(description="Grant staff access")
    def grant_staff(self, request, queryset):
        updated = queryset.update(is_staff=True)
        self.message_user(request, f"{updated} users made staff.")

    @admin.action(description="Revoke staff access")
    def revoke_staff(self, request, queryset):
        updated = queryset.exclude(is_superuser=True).update(is_staff=False)
        self.message_user(
            request, f"Staff access revoked for {updated} users.")
