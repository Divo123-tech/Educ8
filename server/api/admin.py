from django.contrib import admin
from .models import CustomUser, Course, Review, SectionContent, Section, UserCourse, Cart, Chat
# Register your models here.
admin.site.register(CustomUser)
admin.site.register(Course)
admin.site.register(Review)
admin.site.register(SectionContent)
admin.site.register(Section)
admin.site.register(Chat)
admin.site.register(Cart)
admin.site.register(UserCourse)
