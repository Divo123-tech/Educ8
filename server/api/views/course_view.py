from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from ..serializers import CourseSerializer
from ..models import Course
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
        queryset = Course.objects.filter(published=True)
        search_term = self.request.query_params.get('search', None)
        category = self.request.query_params.get(
            'category', None)  # Get category filter
        creator = self.request.query_params.get(
            'creator', None)  # Get category filter

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
            queryset = queryset.filter(Q(name__icontains=search_term))

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

            # Modify `published_date` based on `published` field
            if request.data['published']:
                request.data['published_at'] = date.today()
            else:
                request.data['published_at'] = None

            # # Partially update the course using the serializer
            serializer = CourseSerializer(
                course, data=request.data, partial=True)

            # Validate and save the serializer
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)

            # If serializer is not valid, return errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Course.DoesNotExist:
            return Response({"message": "Course not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(e)
            return Response({"message": "An error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
