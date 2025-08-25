from django.contrib import admin
from .models import SubscriptionTier

# Register your models here.


class SubscriptionTierAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'max_links', 'max_cards',
                    'analytics_enabled', 'custom_themes')
    list_filter = ('name', 'price', 'max_links', 'max_cards',
                   'analytics_enabled', 'custom_themes')
    search_fields = ('name', 'price', 'max_links', 'max_cards',
                     'analytics_enabled', 'custom_themes')
    ordering = ('name', 'price', 'max_links', 'max_cards',
                'analytics_enabled', 'custom_themes')


admin.site.register(SubscriptionTier, SubscriptionTierAdmin)
