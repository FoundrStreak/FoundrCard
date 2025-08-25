from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import URLValidator
from django.utils.text import slugify
from apps.payments.models import SubscriptionTier
import uuid

User = get_user_model()


class CardTemplate(models.Model):
    """Different card layout templates"""
    TEMPLATE_CHOICES = [
        ('minimal', 'Minimal'),
        ('founder', 'Founder/Entrepreneur'),
        ('creator', 'Content Creator'),
        ('developer', 'Developer'),
        ('business', 'Business Professional'),
        ('artist', 'Artist/Designer'),
        ('startup', 'Startup Team'),
    ]

    name = models.CharField(
        max_length=50, choices=TEMPLATE_CHOICES, unique=True)
    display_name = models.CharField(max_length=100, blank=True, null=True)
    default_config = models.JSONField(default=dict)
    is_premium = models.BooleanField(default=False)
    is_elite_only = models.BooleanField(default=False)

    def __str__(self):
        return self.name


def generate_default_slug(user):
    """Generate a default slug based on the user's username"""
    return slugify(user.username)


class Card(models.Model):
    """Individual cards - users can have multiple"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    profile = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='cards')
    template = models.ForeignKey(
        CardTemplate, on_delete=models.PROTECT, null=True, blank=True)

    # Card Identity
    slug = models.SlugField(max_length=50, unique=True, null=True, blank=True)

    title = models.CharField(max_length=100)
    subtitle = models.CharField(max_length=200, blank=True)
    bio = models.TextField(max_length=500, blank=True)

    # Social Links
    startup_link = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    email = models.EmailField(blank=True)

    # Branding
    avatar_type = models.CharField(max_length=20, choices=[
        ('initials', 'Initials'),
        ('emoji', 'Emoji'),
        ('image', 'Image'),
    ], default='initials')
    # Initials, emoji, or image URL
    avatar_value = models.CharField(max_length=100, blank=True)
    primary_color = models.CharField(max_length=7, default="#9333EA")
    secondary_color = models.CharField(max_length=7, default="#3B82F6")
    background_style = models.CharField(max_length=20, default="solid")

    # Settings
    is_active = models.BooleanField(default=True)
    view_count = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_default_slug(self.profile)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} (@{self.slug})"


class LinkType(models.Model):
    """Available link types with metadata"""
    name = models.CharField(max_length=50, unique=True)
    display_name = models.CharField(max_length=50)
    category = models.CharField(max_length=20, choices=[
        ('social', 'Social Media'),
        ('contact', 'Contact'),
        ('work', 'Work'),
        ('creative', 'Creative'),
        ('other', 'Other'),
    ], default='other')

    def __str__(self):
        return self.display_name


class Link(models.Model):
    """Links within a card"""
    card = models.ForeignKey(
        Card, on_delete=models.CASCADE, related_name='links')
    link_type = models.ForeignKey(
        LinkType, on_delete=models.CASCADE, blank=True, null=True)

    # Custom title override
    title = models.CharField(max_length=100, blank=True)
    url = models.URLField(max_length=500)
    description = models.CharField(max_length=200, blank=True)

    # Styling
    custom_icon = models.CharField(max_length=10, blank=True)  # Emoji override
    custom_color = models.CharField(max_length=7, blank=True)

    # Behavior
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    click_count = models.PositiveIntegerField(default=0)
    order = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-is_featured', 'order', 'created_at']

    def get_display_title(self):
        return self.title

    def __str__(self):
        return f"{self.card.title} - {self.get_display_title()}"


class Analytics(models.Model):
    """Unified analytics model"""
    ACTION_CHOICES = [
        ('view', 'Profile View'),
        ('click', 'Link Click'),
    ]

    card = models.ForeignKey(
        Card, on_delete=models.CASCADE, related_name='analytics')
    link = models.ForeignKey(
        Link, on_delete=models.CASCADE, null=True, blank=True)
    action = models.CharField(max_length=10, choices=ACTION_CHOICES)

    # Request data
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField(blank=True)
    referrer = models.URLField(max_length=500, blank=True)

    # Geographic data (can be populated by IP lookup)
    country = models.CharField(max_length=2, blank=True)
    city = models.CharField(max_length=100, blank=True)

    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['card', 'action', '-timestamp']),
            models.Index(fields=['timestamp']),
        ]

    def __str__(self):
        if self.link:
            return f"{self.card.slug} - {self.action} - {self.link.get_display_title()}"
        return f"{self.card.slug} - {self.action}"


class CustomDomain(models.Model):
    """Custom domains for pro/elite users"""
    card = models.OneToOneField(
        Card, on_delete=models.CASCADE, related_name='custom_domain')
    domain = models.CharField(max_length=100, unique=True)
    is_verified = models.BooleanField(default=False)
    ssl_enabled = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.domain} -> {self.card.slug}"

# Pre-populate default data


def create_default_data():
    """Function to create default subscription tiers and link types"""

    # Create subscription tiers
    tiers = [
        {
            'name': 'Free',
            'price': 0.00,
            'features': {'custom_domain': False, 'analytics': False},
            'max_links': 5,
            'max_cards': 1,
            'analytics_enabled': False,
            'custom_themes': False,
        },
        {
            'name': 'Pro',
            'price': 5.99,
            'features': {'custom_domain': True, 'analytics': True, 'unlimited_links': True},
            'max_links': 15,
            'max_cards': 10,
            'analytics_enabled': True,
            'custom_themes': True,
        },
        {
            'name': 'Elite',
            'price': 7.99,
            'features': {'custom_domain': True, 'analytics': True, 'unlimited_links': True, 'white_label': True},
            'max_links': None,
            'max_cards': None,
            'analytics_enabled': True,
            'custom_themes': True,
        }
    ]

    for tier_data in tiers:
        SubscriptionTier.objects.get_or_create(
            name=tier_data['name'], defaults=tier_data)

    # Create card templates
    templates = [
        {
            'name': 'minimal',
            'display_name': 'Minimal',
            'description': 'Clean, simple design',
            'default_config': {'layout': 'centered', 'button_style': 'minimal'},
            'is_premium': False,
        },
        {
            'name': 'founder',
            'display_name': 'Founder',
            'description': 'Perfect for entrepreneurs and startup founders',
            'default_config': {'layout': 'showcase', 'button_style': 'rounded'},
            'is_premium': False,
        },
        {
            'name': 'creator',
            'display_name': 'Creator',
            'description': 'Ideal for content creators and influencers',
            'default_config': {'layout': 'grid', 'button_style': 'creative'},
            'is_premium': True,
        }
    ]

    for template_data in templates:
        CardTemplate.objects.get_or_create(
            name=template_data['name'], defaults=template_data)

    # Create link types
    link_types = [
        {'name': 'email', 'display_name': 'Email', 'icon_name': 'Mail',
            'category': 'contact', 'color': '#EF4444'},
        {'name': 'website', 'display_name': 'Website',
            'icon_name': 'Globe', 'category': 'work', 'color': '#3B82F6'},
        {'name': 'linkedin', 'display_name': 'LinkedIn',
            'icon_name': 'Linkedin', 'category': 'social', 'color': '#0A66C2'},
        {'name': 'twitter', 'display_name': 'X (Twitter)', 'icon_name': 'Twitter',
         'category': 'social', 'color': '#000000'},
        {'name': 'instagram', 'display_name': 'Instagram',
            'icon_name': 'Instagram', 'category': 'social', 'color': '#E4405F'},
        {'name': 'github', 'display_name': 'GitHub',
            'icon_name': 'Github', 'category': 'work', 'color': '#181717'},
        {'name': 'youtube', 'display_name': 'YouTube', 'icon_name': 'Youtube',
            'category': 'creative', 'color': '#FF0000'},
        {'name': 'tiktok', 'display_name': 'TikTok', 'icon_name': 'Music',
            'category': 'social', 'color': '#000000'},
        {'name': 'discord', 'display_name': 'Discord',
            'icon_name': 'MessageCircle', 'category': 'social', 'color': '#5865F2'},
        {'name': 'calendly', 'display_name': 'Calendly',
            'icon_name': 'Calendar', 'category': 'work', 'color': '#006BFF'},
        {'name': 'custom', 'display_name': 'Custom Link',
            'icon_name': 'ExternalLink', 'category': 'other', 'color': '#6B7280'},
    ]

    for link_data in link_types:
        LinkType.objects.get_or_create(
            name=link_data['name'], defaults=link_data)
