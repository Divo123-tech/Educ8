from django.db import models
from .user import CustomUser


class Chat(models.Model):
    room_name = models.CharField(max_length=200, blank=True, null=True)
    message = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)
    sent_by = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.message
