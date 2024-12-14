from django.urls import path
from ..views import CoursePublishedStatusView, CourseRevenueView
urlpatterns = [
    path('published-status', CoursePublishedStatusView.as_view(), name="courses"),
    path('course-revenue', CourseRevenueView.as_view(), name='course-revenue'),

]
