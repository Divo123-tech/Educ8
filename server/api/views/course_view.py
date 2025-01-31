from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from ..serializers import CourseSerializer
from ..models import Course, Section, SectionContent
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView
from django.db.models import Q
from rest_framework.pagination import PageNumberPagination
from datetime import date
from ..utils import is_user_creator
from rest_framework.parsers import MultiPartParser, FormParser


class CourseView(ListCreateAPIView):
    queryset = Course.objects.filter(published=True)
    serializer_class = CourseSerializer
    pagination_class = PageNumberPagination
    # permission_classes = [AllowAny]

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]  # Allow public access for GET
        return [IsAuthenticated()]  # Require authentication for POST

    def get_queryset(self):
        """
        Get courses with optional filtering
        """
        queryset = Course.objects.all()
        search_term = self.request.query_params.get('search', None)
        category = self.request.query_params.get(
            'category', None)  # Get category filter
        creator = self.request.query_params.get(
            'creator', None)  # Get category filter
        published = self.request.query_params.get(
            'published', False)  # Get category filter

        if published:
            queryset = queryset.filter(published=True)
        if creator:
            queryset = queryset.filter(
                # Filter by category (assuming category is a CharField or similar)
                Q(creator__id=creator)
            )
        if category:
            queryset = queryset.filter(
                # Filter by category (assuming category is a CharField or similar)
                Q(category__exact=category)
            )

        if search_term:
            queryset = queryset.filter(
                Q(title__icontains=search_term) |
                Q(creator__username__icontains=search_term)
            )

        return queryset

    def post(self, request, *args, **kwargs):
        try:
            request.data['creator'] = str(request.user)
            return self.create(request, *args, **kwargs)
        except Exception as e:
            print(e)
            return Response({"message": "An error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CoursesTaughtView(ListAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination

    def get_queryset(self):
        queryset = Course.objects.filter(creator=self.request.user)
        search_term = self.request.query_params.get('search', None)

        if search_term:
            queryset = queryset.filter(Q(title__icontains=search_term))

        return queryset


class SingleCourseView(RetrieveUpdateDestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]  # Allow public access for POST
        return [IsAuthenticated()]  # Require authentication for GET

    def destroy(self, request, pk, *args, **kwargs):
        is_user_creator(request, courseId=pk)
        return super().destroy(request, *args, **kwargs)

    def patch(self, request, pk, *args, **kwargs):
        course = Course.objects.get(id=pk)
        is_user_creator(request=request, courseId=pk)

        serializer = CourseSerializer(
            course, data=request.data, partial=True)  # Partial update
        if serializer.is_valid():
            serializer.save()  # Save the updated user
            return Response(serializer.data, status=status.HTTP_200_OK)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PublishCourseView(APIView):
    def patch(self, request, pk, *args, **kwargs):
        try:
            # Get the course instance
            course = Course.objects.get(id=pk)

            # Check if the requesting user is the creator of the course
            is_user_creator(request=request, courseId=pk)

            # Ensure at least one section exists before publishing
            sections = Section.objects.filter(course=pk)
            # Ensure at least one section exists
            if not sections.exists():
                return Response(
                    {"error": "A course must have at least one section before being published!"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Ensure every section has at least one section content
            for section in sections:
                if not SectionContent.objects.filter(section=section).exists():
                    return Response(
                        {"error": f"Section '{section.title}' must have at least one content before publishing!"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            # Make request.data mutable
            mutable_data = request.data.copy()  # <-- This makes it mutable

            # Modify `published_at` based on `published` field
            if mutable_data.get('published'):
                mutable_data['published_at'] = date.today()
            else:
                mutable_data['published_at'] = None

            # Partially update the course using the serializer
            serializer = CourseSerializer(
                course, data=mutable_data, partial=True)

            # Validate and save the serializer
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Course.DoesNotExist:
            return Response({"message": "Course not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(e)
            return Response({"message": "An error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
