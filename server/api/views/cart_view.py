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
    permission_classes = [IsAuthenticated]
    serializer_class = CartSerializer
    pagination_class = PageNumberPagination
    queryset = Cart.objects.all()

    def get_queryset(self):
        # Ensure users can only access their own courses
        return Cart.objects.filter(student=str(self.request.user))

    def post(self, request, *args, **kwargs):
        request.data['student'] = str(request.user)
        course_id = request.data.get('course')
        if Cart.objects.filter(student=request.user, course=course_id).exists() or UserCourse.objects.filter(student=str(request.user), course=course_id).exists():
            return Response(
                {"detail": "This course is already in your cart or you've already taken this course."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        serialized_course = CartSerializer(data=request.data)
        if serialized_course.is_valid():
            serialized_course.save()
            return Response(serialized_course.data, status=status.HTTP_201_CREATED)
        return Response(serialized_course.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        try:
            course = Cart.objects.get(id=request.data['course'])
            course.delete()
            return Response(True, status=status.HTTP_204_NO_CONTENT)
        except:
            return Response(False, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CourseInCartExists(APIView):
    def get(self, request, course_id, *args, **kwargs):
        if Cart.objects.filter(student=request.user, course=course_id).exists():
            return Response(True, status=status.HTTP_200_OK)
        return Response(False, status=status.HTTP_200_OK)


class CheckoutCourse(APIView):
    def post(self, request, *args, **kwargs):
        try:
            for item in request.data['cartItems']:
                print(item)
                course = Cart.objects.get(id=item['id'])
                print(course)
                course.delete()
                serialized_course = UserCourseSerializer(
                    data={"student": str(request.user), "course": item['course']['id']})
                if serialized_course.is_valid():
                    serialized_course.save()
            return Response(True, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response(False, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
