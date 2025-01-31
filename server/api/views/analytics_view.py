from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Count
from rest_framework.permissions import IsAuthenticated
from ..models import Course
from ..serializers import NumOfCoursesPublishedSerializer, CourseRevenueSerializer
from django.db.models import Q, Sum, F, Value, DecimalField
from rest_framework import status
from django.db.models.functions import Coalesce

class CoursePublishedStatusView(APIView):
    # Ensure the user is logged in to access this view
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Get the courses created by the logged-in user (filtered by creator)
        user_courses = Course.objects.filter(creator=request.user)

        # Aggregate counts for the published and unpublished courses
        stats = user_courses.aggregate(
            # Count courses where published is True
            published_count=Count('id', filter=Q(published=True)),
            # Count courses where published is False
            unpublished_count=Count('id', filter=Q(published=False)),
            # Count total number of courses (published and unpublished)
            total=Count('id')
        )

        # Serialize the aggregated data using the NumOfCoursesPublishedSerializer
        serializer = NumOfCoursesPublishedSerializer(stats)
        # Return the response with the serialized data and HTTP 200 status
        return Response(serializer.data, status=status.HTTP_200_OK)

class CourseRevenueView(APIView):
    # Only accessible to authenticated users
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Get the courses created by the logged-in user
        # Annotate the courses with their revenue and total number of students
        user_courses = Course.objects.filter(creator=request.user).annotate(
            # Calculate revenue for each course as (price * number of enrolled students)
            revenue=Coalesce(
                # Multiply price by student count
                F('price') * Count('usercourse__student', distinct=True),
                # If the above calculation results in null, set the revenue to 0
                Value(0, output_field=DecimalField()),
                output_field=DecimalField()  # Ensure that the result is a Decimal type
            ),
            # Count the distinct number of students enrolled in each course
            total_students=Count('usercourse__student', distinct=True)
        )

        # Serialize the user courses with their revenue and student count
        serializer = CourseRevenueSerializer(user_courses, many=True)
        # Return the serialized data in the response
        return Response(serializer.data)
