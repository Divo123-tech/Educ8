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
            title="Test Course",
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
        data = {'course': self.course.id, 'student': self.user.id}
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
            title="Test Course",
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
                         [0]['student']['id'], self.user.id)
        self.assertEqual(response.data['results']
                         [0]['course']['id'], self.course.id)

    def test_find_students_in_course(self):
        UserCourse.objects.create(
            student=self.user, course=self.course)
        url = reverse('students-in-course',
                      kwargs={'course_id': self.course.id})
        response = self.client.get(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results']
                         [0]['student']['id'], self.user.id)
        self.assertEqual(response.data['results']
                         [0]['course']['id'], self.course.id)

    def test_find_student_by_search(self):
        UserCourse.objects.create(
            student=self.user, course=self.course)
        url = reverse('students-in-course',
                      kwargs={'course_id': self.course.id}) + "?search=testuser"
        response = self.client.get(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results']
                         [0]['student']['id'], self.user.id)
        self.assertEqual(response.data['results']
                         [0]['student']['username'], self.user.username)


    def test_find_nonexistent_user_course(self):
        url = reverse('users-courses', kwargs={
                      'pk': 999999})  # Non-existent record
        response = self.client.get(url, format='json')
        self.assertEqual(len(response.data['results']), 0)


class UnregisterUserFromCourseViewTests(APITestCase):

    def setUp(self):
        self.client = APIClient()

        # Create user
        self.user = CustomUser.objects.create_user(
            username='testuser', password='testpassword')

        # Authenticate user
        url = reverse('token-request')  # Ensure this matches your token URL
        response = self.client.post(
            url, {'username': 'testuser', 'password': 'testpassword'}, format='json')
        self.token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

        # Create another user (to test unauthorized deletion)
        self.other_user = CustomUser.objects.create_user(
            username='otheruser', password='otherpassword')

        # Create a course
        self.course = Course.objects.create(
            title="Django Course", creator=self.user)

        # Enroll user in the course
        self.user_course = UserCourse.objects.create(
            student=self.user, course=self.course)

        # Set the delete URL (Ensure it matches your URL patterns)
        # Adjust name if needed
        self.delete_url = reverse('my-courses')
        self.remove_url = reverse("remove-student-from-course", kwargs={
                                  'course_id': self.course.id, 'user_id': self.other_user.id})

    def test_successful_course_unregistration(self):
        """Test that a user can successfully unregister from a course."""
        data = {"course": self.course.id}
        response = self.client.delete(self.delete_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(UserCourse.objects.filter(
            student=self.user, course=self.course).exists())

    def test_successful_student_removal(self):
        """Test that a user can successfully unregister from a course."""
        data = {"userId": self.other_user.id}
        UserCourse.objects.create(
            student=self.other_user, course=self.course)
        response = self.client.delete(self.remove_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(UserCourse.objects.filter(
            student=self.other_user, course=self.course).exists())

    def test_failed_student_removal(self):
        """Test that a user can successfully unregister from a course."""
        url = reverse('token-request')  # Ensure this matches your token URL
        response = self.client.post(
            url, {'username': 'otheruser', 'password': 'otherpassword'}, format='json')
        self.token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        data = {"userId": self.user.id}
        response = self.client.delete(self.remove_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertTrue(UserCourse.objects.filter(
            student=self.user, course=self.course).exists())
    def test_cannot_unregister_if_not_enrolled(self):
        """Test that a user cannot unregister from a course they are not enrolled in."""
        UserCourse.objects.filter(
            student=self.user, course=self.course).delete()  # Remove enrollment
        data = {"course": self.course.id}
        response = self.client.delete(self.delete_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_unauthenticated_user_cannot_unregister(self):
        """Test that an unauthenticated user cannot unregister from a course."""
        self.client.force_authenticate(user=None)
        data = {"course": self.course.id}
        response = self.client.delete(self.delete_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_other_user_cannot_unregister_another_user(self):
        """Test that another user cannot unregister someone else from a course."""
        self.client.force_authenticate(
            user=self.other_user)  # Authenticate as another user
        data = {"course": self.course.id}
        response = self.client.delete(self.delete_url, data, format='json')
        # Course not found for this user
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

