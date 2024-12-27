from django.urls import path
from ..views import AllUsersView, UserView, UserCourseView, ChangePasswordView, FindUserView, FindUserCourseView, CartView, CourseInCartExists, CheckoutCourse, CourseInUserCourseExists

urlpatterns = [
    path("", UserView.as_view(), name="my-profile"),
    path("all", AllUsersView.as_view(), name="find-all-users"),
    path("cart", CartView.as_view(), name="cart"),
    path("cart/checkout", CheckoutCourse.as_view(), name="cart"),
    path("cart/<int:course_id>", CourseInCartExists.as_view(), name="cart"),
    path('<int:pk>', FindUserView.as_view(), name="users"),
    path('<int:pk>/courses', FindUserCourseView.as_view(), name="users-courses"),
    path('my-courses',
         UserCourseView.as_view(), name='my-courses'),
    path('my-courses/<int:course_id>',
         CourseInUserCourseExists.as_view(), name='my-courses-check'),
    path('change-password',
         ChangePasswordView.as_view(), name='change-password')

]
