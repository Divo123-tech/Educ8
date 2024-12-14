from django.db import models
from .user import CustomUser
from .course import Course


class UserCourse(models.Model):
    student = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    joined_at = models.DateField(auto_now_add=True)
