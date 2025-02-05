from django.db import models
from .user import CustomUser


class Course(models.Model):
    title = models.CharField(max_length=200, unique=True)
    subtitle = models.CharField(max_length=200, blank=True, null=True)
    description = models.TextField()
    created_at = models.DateField(auto_now_add=True)
    last_updated_at = models.DateField(auto_now_add=True)
    published_at = models.DateField(null=True, blank=True)
    published = models.BooleanField(default=False)
    thumbnail = models.ImageField(
        null=True, blank=True, upload_to='thumbnails/',)
    creator = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="courses", null=True)
    students = models.ManyToManyField(CustomUser, through='UserCourse')
    category = models.CharField(max_length=100, blank=True, null=True)
    price = models.DecimalField(
        max_digits=6, decimal_places=2, null=True, blank=True, default=11.99)


def __str__(self):
    return str(self.title)
