from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from ..models import CustomUser, Course, UserCourse
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient


class UserCourseViewTests(APITestCase):

    def setUp(self):
        # Create a user for authentication
        self.user = CustomUser.objects.create_user(
            username='testuser', password='testpassword')

        # Create a course for testing
        self.course = Course.objects.create(
            name="Test Course",
            description="Test description",
            creator=self.user
        )

        # Initialize APIClient instance for making requests
        self.client = APIClient()

        # Obtain a JWT token for the user
        url = reverse('token-request')  # TokenObtainPairView URL
        data = {
            'username': self.user.username,
            'password': 'testpassword'
        }
        response = self.client.post(url, data, format='json')
        self.token = response.data['access']  # Extract the access token

        # Set the Authorization header for all subsequent requests
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

    def test_create_user_course(self):
        data = {'course': self.course.id, 'user': self.user.id}
        url = reverse('my-courses')
        response = self.client.post(
            url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(UserCourse.objects.count(), 1)

    def test_get_user_courses(self):
        UserCourse.objects.create(
            student=self.user, course=self.course)
        url = reverse('my-courses')  # Assuming it's a List view
        response = self.client.get(
            url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # The current user is enrolled in one course
        self.assertEqual(len(response.data['results']), 1)


class FindUserCourseViewTests(APITestCase):

    def setUp(self):
        # Create a user for authentication
        self.user = CustomUser.objects.create_user(
            username='testuser', password='testpassword')

        # Create a course for testing
        self.course = Course.objects.create(
            name="Test Course",
            description="Test description",
            creator=self.user
        )

        # Initialize APIClient instance for making requests
        self.client = APIClient()

        # Obtain a JWT token for the user
        url = reverse('token-request')  # TokenObtainPairView URL
        data = {
            'username': self.user.username,
            'password': 'testpassword'
        }
        response = self.client.post(url, data, format='json')
        self.token = response.data['access']  # Extract the access token

        # Set the Authorization header for all subsequent requests
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

    def test_find_user_course(self):
        UserCourse.objects.create(
            student=self.user, course=self.course)
        url = reverse('users-courses', kwargs={'pk': self.user.id})
        response = self.client.get(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check if the course data matches the user's enrollment
        # Assuming only one course
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results']
                         [0]['student'], self.user.id)
        self.assertEqual(response.data['results'][0]['course'], self.course.id)

    def test_find_nonexistent_user_course(self):
        url = reverse('users-courses', kwargs={
                      'pk': 999999})  # Non-existent record
        response = self.client.get(url, format='json')
        self.assertEqual(len(response.data['results']), 0)


class UnregisterUserFromCourseViewTests(APITestCase):

    def setUp(self):
        # Create a user for authentication
        self.user = CustomUser.objects.create_user(
            username='testuser', password='testpassword')

        # Create a course for testing
        self.course = Course.objects.create(
            name="Test Course",
            description="Test description",
            creator=self.user
        )

        # Initialize APIClient instance for making requests
        self.client = APIClient()

        # Obtain a JWT token for the user
        url = reverse('token-request')  # TokenObtainPairView URL
        data = {
            'username': self.user.username,
            'password': 'testpassword'
        }
        response = self.client.post(url, data, format='json')
        self.token = response.data['access']  # Extract the access token

        # Set the Authorization header for all subsequent requests
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

    def test_unregister_user_from_course(self):
        UserCourse.objects.create(
            student=self.user, course=self.course)
        url = reverse('my-courses-delete', kwargs={"pk": self.course.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        # The user should no longer be enrolled in the course
        self.assertEqual(UserCourse.objects.count(), 0)

    def test_unregister_user_from_course_without_auth(self):
        url = reverse('my-courses-delete', kwargs={"pk": self.course.id})

        response = self.client.delete(url)  # No token
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_unregister_user_from_nonexistent_course(self):
        url = reverse('my-courses-delete',
                      kwargs={'pk': 999999})  # Non-existent course
        response = self.client.delete(
            url, )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_unregister_user_from_other_user_course(self):
        # Create another user and course relation
        other_user = CustomUser.objects.create_user(
            username='otheruser', password='otherpassword')
        other_user_course = UserCourse.objects.create(
            student=other_user, course=self.course)

        url = reverse('my-courses-delete', kwargs={'pk': self.course.id})
        response = self.client.delete(
            url)
        # Shouldn't be able to unregister another user
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
