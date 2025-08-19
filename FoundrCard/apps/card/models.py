from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Card(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, help_text="User")
    badge = models.BooleanField(default=False, help_text="Badge")
    font = models.CharField(max_length=50, default="Arial", help_text="Font")
    gradient = models.CharField(
        max_length=50, default="", help_text="Gradient")
    background_color = models.CharField(
        max_length=50, default="", help_text="Background Color")
    text_color = models.CharField(
        max_length=50, default="", help_text="Text Color")
    border_color = models.CharField(
        max_length=50, default="", help_text="Border Color")
    border_width = models.IntegerField(
        default=0, help_text="Border Width")
    border_style = models.CharField(
        max_length=50, default="", help_text="Border Style")
    border_radius = models.IntegerField(
        default=0, help_text="Border Radius")
    shadow = models.CharField(
        max_length=50, default="", help_text="Shadow")
    created_at = models.DateTimeField(
        auto_now_add=True, help_text="Card Created At")
    updated_at = models.DateTimeField(
        auto_now=True, help_text="Card Updated At")

    def __str__(self):
        return f"{self.user.username}'s Card"


class Link(models.Model):
    card = models.ForeignKey(Card, on_delete=models.CASCADE, help_text="Card")
    name = models.CharField(max_length=50, help_text="Link Name")
    url = models.URLField(help_text="Link URL")
    icon = models.CharField(max_length=50, default="", help_text="Link Icon")
    color = models.CharField(max_length=50, default="", help_text="Link Color")
    views = models.IntegerField(default=0, help_text="Link Views")
    clicks = models.IntegerField(default=0, help_text="Link Clicks")
