from rest_framework.response import Response
from rest_framework import status
from ..models import Course, Review, UserCourse, Cart


def is_user_creator(request, course_id):
    course = Course.objects.get(id=course_id)
    """Check if the requesting user is the creator of the course."""
    if str(course.creator.id) != str(request.user.id):
        return False
    return True


def is_user_reviewer(request, review_id):
    review = Review.objects.get(id=review_id)
    """Check if the requesting user is the creator of the review."""
    if str(review.reviewed_by) != str(request.user.id):
        return Response(
            {"message": "You are not authorized to update this review."},
            status=status.HTTP_403_FORBIDDEN)
    return True


def is_user_registered_to_course(request, course_id):
    userRegistered = UserCourse.objects.filter(
        student=str(request.user.id), course=course_id)

    if userRegistered is None:
        return False
    return True


def is_course_in_cart(request, course_id):
    course_in_cart = Cart.objects.filter(
        student=str(request.user.id), course=course_id)

    if course_in_cart is None:
        return Response(
            {"message": "You are not authorized to see this content."},
            status=status.HTTP_403_FORBIDDEN
        )
    return True
