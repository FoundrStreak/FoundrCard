from django.db import models

# Create your models here.


class SubscriptionTier(models.Model):
    """Subscription tiers (Free, Pro, Elite)"""
    name = models.CharField(max_length=50, unique=True)
    price = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    features = models.JSONField(default=dict)  # Store feature flags
    max_links = models.IntegerField(default=5)
    max_cards = models.IntegerField(default=1)
    analytics_enabled = models.BooleanField(default=False)
    custom_themes = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} - ${self.price}"
