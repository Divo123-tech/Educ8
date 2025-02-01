from django.urls import path
from ..views import CourseView, SingleCourseView, SectionView, SingleSectionView, SectionContentView, SingleSectionContentView, ReviewView, SingleReviewView, CoursesTaughtView, PublishCourseView, DetailedSectionContentsView

urlpatterns = [
    path('', CourseView.as_view(), name="courses"),
    path('<int:pk>/publish', PublishCourseView.as_view(), name="publish-course"),
    path('taught', CoursesTaughtView.as_view(), name="courses-taught"),
    path('<int:pk>', SingleCourseView.as_view(), name="single-course"),
    path('<int:courseId>/reviews',
         ReviewView.as_view(), name="reviews"),
    path('<int:courseId>/reviews/<int:pk>',
         SingleReviewView.as_view(), name="single-review"),
    path('<int:courseId>/sections',
         SectionView.as_view(), name="sections"),
    path('<int:courseId>/sections/<int:sectionId>',
         SingleSectionView.as_view(), name="single-section"),
    path('<int:courseId>/sections/<int:sectionId>/contents',
         SectionContentView.as_view(), name="section-content"),
    path('<int:courseId>/sections/<int:sectionId>/contents/detailed',
         DetailedSectionContentsView.as_view(), name="section-content-detailed"),
    path('<int:courseId>/sections/<int:sectionId>/contents/<int:contentId>',
         SingleSectionContentView.as_view(), name="section-content"),
]
