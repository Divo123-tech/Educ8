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
    permission_classes = [IsAuthenticated]  # Ensure the user is logged in

    def get(self, request, *args, **kwargs):
        # Filter courses created by the logged-in user
        user_courses = Course.objects.filter(creator=request.user)

        # Get counts for published and unpublished courses
        stats = user_courses.aggregate(
            published_count=Count('id', filter=Q(published=True)),
            unpublished_count=Count('id', filter=Q(published=False)),
            total=Count('id')  # Total number of courses
        )

        # Serialize the data
        serializer = NumOfCoursesPublishedSerializer(stats)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CourseRevenueView(APIView):
    # Only accessible to authenticated users
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Filter courses created by the logged-in user
        user_courses = Course.objects.filter(creator=request.user).annotate(
            revenue=Coalesce(
                F('price') * Count('usercourse__student', distinct=True),
                # Explicitly set output_field
                Value(0, output_field=DecimalField()),
                output_field=DecimalField()  # Ensure the result is a Decimal
            ),
            total_students=Count('usercourse__student', distinct=True)
        )

        # Serialize the data
        serializer = CourseRevenueSerializer(user_courses, many=True)
        return Response(serializer.data)
