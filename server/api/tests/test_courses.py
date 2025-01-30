from django.urls import reverse
from django.test import TestCase
from rest_framework import status
from ..models import Course, CustomUser
from rest_framework.test import APIClient, APITestCase


class CourseViewTests(APITestCase):
    def setUp(self):
        print("running setup")
        # Create a user for authentication
        self.user = CustomUser.objects.create_user(
            username='testuser', password='testpassword')

        # Create a course for testing
        self.course = Course.objects.create(
            title="Test Course",
            subtitle="Test Course subtitle",
            description="Test description",
            creator=self.user
        )

        print("Created course:", self.course)

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

    def test_get_all_courses(self):
        url = reverse('courses')  # Use the correct name for your view
        response = self.client.get(url)
        # Ensure the course is listed
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], "Test Course")

    def test_create_course(self):
        url = reverse('courses')  # Correct view name
        data = {
            'title': 'New Course',
            "subtitle": "New Subtitle",
            'description': 'Description of the new course',
            'creator': self.user.id  # Creator is set to the user ID
        }
        response = self.client.post(url, data, format='json')

        # Ensure the course is created
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'New Course')
        self.assertEqual(response.data['subtitle'], 'New Subtitle')
        self.assertEqual(response.data['description'],
                         'Description of the new course')

    def test_course_detail(self):
        # Correct view name
        url = reverse('single-course', args=[self.course.id])
        response = self.client.get(url)

        # Ensure the course details are returned
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.course.title)
        self.assertEqual(response.data['subtitle'], self.course.subtitle)
        self.assertEqual(response.data['description'], self.course.description)

    def test_update_course(self):
        url = reverse('single-course', args=[self.course.id])
        updated_data = {
            'title': 'Updated Course Name',
            'subtitle': 'Updated Course Subtitle',
            'description': 'Updated Description',
        }
        response = self.client.patch(url, updated_data, format='multipart')

        # Ensure the course is updated
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Updated Course Name')
        self.assertEqual(response.data['subtitle'], 'Updated Course Subtitle')
        self.assertEqual(response.data['description'], 'Updated Description')

    def test_delete_course(self):
        url = reverse('single-course', args=[self.course.id])

        # # Ensure the course exists before deletion
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Delete the course
        response = self.client.delete(url)

        # Ensure the course is deleted
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # Try to retrieve the deleted course
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
