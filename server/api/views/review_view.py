from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from ..serializers import CourseSerializer, ReviewSerializer
from ..models import Course, Review
from rest_framework.generics import RetrieveUpdateDestroyAPIView, ListCreateAPIView
from rest_framework.pagination import PageNumberPagination
from ..utils import is_user_reviewer


class ReviewView(ListCreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    pagination_class = PageNumberPagination

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]  # Allow public access for POST
        return [IsAuthenticated()]  # Require authentication for GET

    def get_queryset(self):
        # Get courseId from URL kwargs
        course_id = self.kwargs.get('course_id')
        queryset = Review.objects.filter(course_id=course_id)
        # Get rating from query parameters
        rating = self.request.query_params.get('rating')

        if rating is not None:
            try:
                rating = int(rating)  # Convert rating to an integer
                queryset = queryset.filter(rating=rating)
            except ValueError:
                # If rating is not a valid integer, return an empty queryset or handle gracefully
                queryset = queryset.none()
        # Filter by course ID
        return queryset

    def post(self, request, course_id, *args, **kwargs):
        try:
            request.data['course'] = course_id
            request.data['reviewed_by'] = str(request.user.id)
            print(request.data)
            review = ReviewSerializer(data=request.data)
            if not Review.objects.filter(reviewed_by=request.user, course=course_id).exists():
                if review.is_valid():
                    review.save()
                    return Response(review.data, status=status.HTTP_201_CREATED)
            return Response(review.error_messages, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"message": "Failed to create review"}, status=status.HTTP_400_BAD_REQUEST)


class SingleReviewView(RetrieveUpdateDestroyAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]  # Allow public access for POST
        return [IsAuthenticated()]  # Require authentication for GET

    def patch(self, request, pk, *args, **kwargs):
        try:
            is_user_reviewer(request, review_id=pk)
            review = self.get_object()
            serialized_review = ReviewSerializer(
                review, data=request.data, partial=True)
            if serialized_review.is_valid():
                serialized_review.save()
                return Response(serialized_review.data, status=status.HTTP_200_OK)
            return Response(serialized_review.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return Response({"message": "Unable to edit review"}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, * args, **kwargs):
        try:
            review = self.get_object()
            is_user_reviewer(request, review_id=pk)
            review.delete()
            return Response(True, status=status.HTTP_204_NO_CONTENT)
        except:
            return Response(False, status=status.HTTP_400_BAD_REQUEST)
