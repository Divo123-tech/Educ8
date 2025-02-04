from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import NotFound

from ..models import CustomUser, UserCourse, Course
from ..serializers import UserSerializer, UserCourseSerializer
from rest_framework.generics import CreateAPIView, ListAPIView, ListCreateAPIView, DestroyAPIView, get_object_or_404, RetrieveAPIView
from rest_framework.pagination import PageNumberPagination
from ..utils import is_user_registered_to_course, is_user_creator
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Q


class FindUserCourseView(ListAPIView):
    permission_classes = [AllowAny]
    queryset = UserCourse.objects.all()
    serializer_class = UserCourseSerializer
    pagination_class = PageNumberPagination

    def get_queryset(self):
        # Filter the courses based on the user (student) passed in the URL
        user_id = self.kwargs['pk']
        return UserCourse.objects.filter(student_id=user_id)


class FindStudentsTakingCourse(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserCourseSerializer
    pagination_class = PageNumberPagination

    def get_queryset(self):
        # Get course_id from the URL to filter users based on the course

        course_id = self.kwargs['course_id']

        queryset = UserCourse.objects.filter(course=course_id)
        search_term = self.request.query_params.get('search', None)

        if search_term:
            queryset = queryset.filter(
                # Filter based on the related student (CustomUser)
                Q(student__username__icontains=search_term) |
                # Filter based on email of the related student
                Q(student__email__icontains=search_term)
            )
        return queryset

class UserCourseView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserCourseSerializer
    pagination_class = PageNumberPagination

    def get_queryset(self):
        queryset = UserCourse.objects.filter(student=self.request.user)
        search_term = self.request.query_params.get('search', None)
        category = self.request.query_params.get(
            'category', None)  # Get category filter
        creator = self.request.query_params.get(
            'creator', None)  # Get category filter

        if creator:
            queryset = queryset.filter(
                # Filter by category (assuming category is a CharField or similar)
                Q(course__creator__id=creator)
            )
        if category:
            queryset = queryset.filter(
                # Filter by category (assuming category is a CharField or similar)
                Q(course__category__exact=category)
            )

        if search_term:
            # Use the double underscore to query related model fields
            queryset = queryset.filter(
                Q(course__title__icontains=search_term) |
                Q(course__creator__username__icontains=search_term)
            )
        return queryset

    def delete(self, request, *args, **kwargs):
        course = get_object_or_404(
            self.get_queryset(), course=request.data['course'])
        if (is_user_registered_to_course(request, course_id=request.data['course'])):
            course.delete()
            return Response(True, status=status.HTTP_204_NO_CONTENT)
        return Response(
            {"message": "You are not authorized to see this content."},
            status=status.HTTP_403_FORBIDDEN
        )


class RemoveStudentFromCourse(DestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_queryset(self):
        queryset = UserCourse.objects.filter(
            course=self.kwargs['course_id'])
        return queryset

    def delete(self, request, *args, **kwargs):
        student = get_object_or_404(
            self.get_queryset(), student=self.kwargs['user_id'])
        if (is_user_creator(request, course_id=self.kwargs['course_id'])):
            student.delete()
            return Response(True, status=status.HTTP_204_NO_CONTENT)
        return Response(
            {"message": "You are not authorized to remove this student."},
            status=status.HTTP_403_FORBIDDEN
        )

class CourseInUserCourseExists(APIView):
    def get(self, request, course_id, *args, **kwargs):
        if UserCourse.objects.filter(student=str(request.user), course=course_id).exists():
            return Response(True, status=status.HTTP_200_OK)
        return Response(False, status=status.HTTP_200_OK)




class RegisterView(CreateAPIView):
    permission_classes = [AllowAny]
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer


class FindUserView(RetrieveAPIView):
    permission_classes = [AllowAny]
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer


class AllUsersView(ListAPIView):
    permission_classes = [AllowAny]
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

    def get_queryset(self):
        """
        Get courses with optional filtering
        """
        queryset = CustomUser.objects.all()
        search_term = self.request.query_params.get('search', None)

        if search_term:
            queryset = queryset.filter(
                Q(username__icontains=search_term) |
                Q(email__icontains=search_term)
            )

        return queryset


class UserView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request, *args, **kwargs):
        try:
            users = CustomUser.objects.get(
                id=str(request.user), is_active=True, )

            serialized_users = UserSerializer(users)
            return Response(serialized_users.data, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            return Response({"message": "User Does Not Exist"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    def patch(self, request, *args, **kwargs):
        user = CustomUser.objects.get(id=str(request.user))
        serializer = UserSerializer(
            user, data=request.data, partial=True)  # Partial update
        if serializer.is_valid():
            serializer.save()  # Save the updated user
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        try:
            user = CustomUser.objects.get(id=str(request.user))
            user.delete()
            return Response(True, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            return Response(False, status=status.HTTP_404_NOT_FOUND)
        except:
            return Response(False, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        try:
            # get the user based on the current request's user
            user = CustomUser.objects.get(id=str(request.user))
            # check if they've included the right password
            if user.check_password(request.data['oldPassword']):
                user.set_password(request.data['newPassword'])
                user.save()
                return Response(True, status=status.HTTP_202_ACCEPTED)
            return Response(False, status=status.HTTP_403_FORBIDDEN)
        except CustomUser.DoesNotExist:
            return Response(False, status=status.HTTP_404_NOT_FOUND)
        except:
            return Response(False, status=status.HTTP_400_BAD_REQUEST)
