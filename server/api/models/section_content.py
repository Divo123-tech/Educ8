from django.db import models
from .section import Section


class SectionContent(models.Model):
    title = models.CharField(max_length=200)
    contentType = models.CharField(max_length=100, blank=True, null=True)
    media = models.FileField(blank=True, null=True, upload_to="content/")
    content = models.TextField(null=True, blank=True)
    section = models.ForeignKey(
        Section, on_delete=models.CASCADE, related_name="contents")
