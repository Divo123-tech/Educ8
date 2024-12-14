from django.db import models
from .course import Course
from .user import CustomUser


class Review(models.Model):
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name="reviews")
    title = models.CharField(max_length=200)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    rating = models.PositiveSmallIntegerField()
    reviewed_by = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="reviews", null=True)
