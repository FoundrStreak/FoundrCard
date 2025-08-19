from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
    BaseUserManager,
    Group,
    Permission,
)
import random
import string
from django.utils import timezone

# Create your models here.


def generate_username(length: int = 8) -> str:
    if length < 4:
        raise ValueError("Username must be at least 4 characters long.")
    suffix = ''.join(random.choices(
        string.ascii_lowercase + string.digits, k=length))
    return f"User-{suffix}"


def profile_picture_upload_to(instance: 'CustomUser', filename: str) -> str:
    return f"profile_pictures/{instance.id}/{filename}"


class CustomUserManager(BaseUserManager):
    def create_user(self, email: str, password: str = None, **extra_fields: any) -> 'CustomUser':
        if not email:
            raise ValueError("Email address is required.")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email: str, password: str = None, **extra_fields: any) -> 'CustomUser':
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if not extra_fields.get("is_staff"):
            raise ValueError("Superuser must have is_staff=True.")
        if not extra_fields.get("is_superuser"):
            raise ValueError("Superuser must have is_superuser=True.")
        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(
        unique=True, help_text="Required. Valid email address.")
    username = models.CharField(
        max_length=50,
        unique=True,
        default=generate_username,
        help_text="Unique username (auto-generated if blank)."
    )
    first_name = models.CharField(
        max_length=30, blank=True, help_text="First name.")
    last_name = models.CharField(
        max_length=30, blank=True, help_text="Last name.")
    profile_picture = models.ImageField(
        upload_to=profile_picture_upload_to,
        blank=True,
        null=True,
        help_text="Uploaded profile picture."
    )
    profile_picture_url = models.URLField(
        blank=True, null=True, help_text="OAuth profile picture URL.")
    is_active = models.BooleanField(
        default=True, help_text="Designates if the user is active.")
    is_staff = models.BooleanField(
        default=False, help_text="Designates access to admin site.")
    is_premium = models.BooleanField(
        default=False, help_text="Active premium subscription.")
    premium_expiry = models.DateTimeField(
        blank=True, null=True, help_text="Premium subscription end date.")
    google_id = models.CharField(
        max_length=128, unique=True, blank=True, null=True, help_text="Google OAuth ID.")
    email_notifications = models.BooleanField(
        default=True, help_text="Email notifications enabled.")

    date_joined = models.DateTimeField(
        auto_now_add=True, db_index=True, help_text="Account creation timestamp.")
    last_login = models.DateTimeField(
        auto_now=True, help_text="Last login timestamp.")

    USERNAME_FIELD = 'email'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    groups = models.ManyToManyField(
        Group,
        related_name='custom_users',
        related_query_name='custom_user',
        blank=True,
        help_text=("Groups this user belongs to."),
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='custom_user_permissions',
        related_query_name='custom_user',
        blank=True,
        help_text=("Specific permissions for this user."),
    )

    class Meta:
        verbose_name = "user"
        verbose_name_plural = "users"
        ordering = ['-date_joined']
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['-date_joined']),
        ]

    def __str__(self) -> str:
        return self.email

    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}".strip()

    def get_full_name(self) -> str:
        return self.full_name

    def get_short_name(self) -> str:
        return self.first_name

    def has_active_premium(self) -> bool:
        now = timezone.now()
        if self.is_premium and (self.premium_expiry is None or self.premium_expiry > now):
            return True
        return False
