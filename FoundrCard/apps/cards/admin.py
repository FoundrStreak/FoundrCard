from django.contrib import admin
from .models import Card, CardTemplate, Link, LinkType, CustomDomain, Analytics

admin.site.register(Card)
admin.site.register(CardTemplate)
admin.site.register(Link)
admin.site.register(LinkType)
admin.site.register(CustomDomain)
admin.site.register(Analytics)
