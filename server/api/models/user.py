from django.db import models
from django.contrib.auth.models import User, AbstractUser
from django.forms import ValidationError


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)  # Ensure email is unique
    bio = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=150, null=True, blank=True)
    profile_picture = models.ImageField(
        null=True, blank=True, upload_to='profiles/')
    username = models.CharField(
        max_length=150,
        unique=True,
        error_messages={
            'unique': "A user with that username already exists.",
        },
    )
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return str(self.username)
