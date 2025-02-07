from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from ..models import Cart, UserCourse
from ..serializers import CartSerializer, UserCourseSerializer
from rest_framework.generics import ListCreateAPIView, DestroyAPIView, get_object_or_404
from rest_framework.pagination import PageNumberPagination
from ..utils import is_course_in_cart
from rest_framework.views import APIView


class CartView(ListCreateAPIView):
    # Only authenticated users can access the cart
    permission_classes = [IsAuthenticated]
    # Serializer to validate and format data for Cart objects
    serializer_class = CartSerializer
    # Pagination for listing Cart objects
    pagination_class = PageNumberPagination
    # Default queryset to get all Cart objects
    queryset = Cart.objects.all()

    def get_queryset(self):
        # Override to ensure users can only access their own cart
        return Cart.objects.filter(student=str(self.request.user.id))

    def post(self, request, *args, **kwargs):
        # Assign the authenticated user to the 'student' field in the request
        request.data['student'] = str(request.user.id)
        # Get the course ID from the request data
        course_id = request.data.get('course')

        # Check if the course is already in the cart or if the user is already enrolled in the course
        if Cart.objects.filter(student=request.user.id, course=course_id).exists() or UserCourse.objects.filter(student=str(request.user.id), course=course_id).exists():
            # If so, return a 400 response indicating the error
            return Response(
                {"detail": "This course is already in your cart or you've already taken this course."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Serialize the data for the Cart object
        serialized_course = CartSerializer(data=request.data)
        if serialized_course.is_valid():
            # If valid, save the Cart object and return it with a 201 Created status
            serialized_course.save()
            return Response(serialized_course.data, status=status.HTTP_201_CREATED)

        # If the data is invalid, return the errors with a 400 Bad Request status
        return Response(serialized_course.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        try:
            # Get the Cart object based on the provided course ID
            course = Cart.objects.get(id=request.data['course'])
            # Delete the Cart object from the database
            course.delete()
            # Return a 204 No Content response after successfully deleting
            return Response(True, status=status.HTTP_204_NO_CONTENT)
        except:
            # In case of any errors, return a 500 Internal Server Error response
            return Response(False, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CourseInCartExists(APIView):
    def get(self, request, course_id, *args, **kwargs):
        # Check if the course is in the authenticated user's cart
        if Cart.objects.filter(student=request.user, course=course_id).exists():
            # If it exists, return a 200 OK response
            return Response(True, status=status.HTTP_200_OK)
        # If it doesn't exist, return a 200 OK response with False
        return Response(False, status=status.HTTP_200_OK)


class CheckoutCourse(APIView):
    def post(self, request, *args, **kwargs):
        try:
            # Loop through the cartItems from the request data
            for item in request.data['cartItems']:
                # Print the item (for debugging purposes)
                print(item)
                # Get the Cart object by its ID
                course = Cart.objects.get(id=item['id'])
                # Print the course object (for debugging purposes)
                # Delete the course from the Cart
                course.delete()
                # Serialize the course data for creating a UserCourse
                serialized_course = UserCourseSerializer(
                    data={"student": str(request.user.id), "course": item['course']['id']})
                if serialized_course.is_valid():
                    # If valid, save the UserCourse object (register the student for the course)
                    serialized_course.save()
            # Return a 200 OK response after processing the checkout
            return Response(True, status=status.HTTP_200_OK)
        except Exception as e:
            # Print the error (for debugging purposes)
            print(e)
            # In case of any errors, return a 500 Internal Server Error response
            return Response(False, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
