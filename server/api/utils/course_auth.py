from rest_framework.response import Response
from rest_framework import status
from ..models import Course, Review, UserCourse, Cart


def is_user_creator(request, courseId):
    course = Course.objects.get(id=courseId)
    """Check if the requesting user is the creator of the course."""
    if str(course.creator.id) != str(request.user):
        return Response(
            {"message": "You are not authorized to update this course."},
            status=status.HTTP_403_FORBIDDEN
        )
    return True


def is_user_reviewer(request, reviewId):
    review = Review.objects.get(id=reviewId)
    """Check if the requesting user is the creator of the review."""
    if str(review.reviewed_by) != str(request.user):
        return Response(
            {"message": "You are not authorized to update this review."},
            status=status.HTTP_403_FORBIDDEN)
    return True


def is_user_registered_to_course(request, courseId):
    userRegistered = UserCourse.objects.filter(
        student=str(request.user), course=courseId)

    if userRegistered is None:
        return Response(
            {"message": "You are not authorized to see this content."},
            status=status.HTTP_403_FORBIDDEN
        )
    return True


def is_course_in_cart(request, courseId):
    course_in_cart = Cart.objects.filter(
        student=str(request.user), course=courseId)

    if course_in_cart is None:
        return Response(
            {"message": "You are not authorized to see this content."},
            status=status.HTTP_403_FORBIDDEN
        )
    return True
