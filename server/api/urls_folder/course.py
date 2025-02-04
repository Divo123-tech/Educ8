from django.urls import path
from ..views import CourseView, SingleCourseView, SectionView, SingleSectionView, SectionContentView, SingleSectionContentView, ReviewView, SingleReviewView, CoursesTaughtView, PublishCourseView, DetailedSectionContentsView, FindStudentsTakingCourse

urlpatterns = [
    path('', CourseView.as_view(), name="courses"),
    path('<int:pk>/publish', PublishCourseView.as_view(), name="publish-course"),
    path('taught', CoursesTaughtView.as_view(), name="courses-taught"),
    path('<int:pk>', SingleCourseView.as_view(), name="single-course"),
    path('<int:course_id>/reviews',
         ReviewView.as_view(), name="reviews"),
    path('<int:course_id>/students',
         FindStudentsTakingCourse.as_view(), name="reviews"),
    path('<int:course_id>/reviews/<int:pk>',
         SingleReviewView.as_view(), name="single-review"),
    path('<int:course_id>/sections',
         SectionView.as_view(), name="sections"),
    path('<int:course_id>/sections/<int:section_id>',
         SingleSectionView.as_view(), name="single-section"),
    path('<int:course_id>/sections/<int:section_id>/contents',
         SectionContentView.as_view(), name="section-content"),
    path('<int:course_id>/sections/<int:section_id>/contents/detailed',
         DetailedSectionContentsView.as_view(), name="section-content-detailed"),
    path('<int:course_id>/sections/<int:section_id>/contents/<int:content_id>',
         SingleSectionContentView.as_view(), name="section-content"),
]
