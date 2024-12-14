from django.db import models
from .course import Course


class Section(models.Model):
    title = models.CharField(max_length=200)
    position = models.PositiveIntegerField()
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name="sections")

    def __str__(self):
        return str(self.id)
