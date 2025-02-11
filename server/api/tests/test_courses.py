from datetime import date
from django.urls import reverse
from django.test import TestCase
from rest_framework import status

from ..models import Course, CustomUser, Section, SectionContent
from rest_framework.test import APIClient, APITestCase


class CourseViewTests(APITestCase):
    def setUp(self):
        # Create a user for authentication
        self.user = CustomUser.objects.create_user(
            username='testuser', password='testpassword', email="test@gmail.com")

        # Create a course for testing
        self.course = Course.objects.create(
            title="Test Course",
            subtitle="Test Course subtitle",
            description="Test description",
            creator=self.user
        )

        # Initialize APIClient instance for making requests
        self.client = APIClient()

        # Obtain a JWT token for the user
        url = reverse('token-request')  # TokenObtainPairView URL
        data = {
            'username': self.user.email,
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

    def test_publish_course_success(self):
        """Test successful course publishing when all conditions are met."""
        section = Section.objects.create(
            course=self.course, title="Section 1", position=1)
        SectionContent.objects.create(section=section, content="Content 1")

        url = reverse('publish-course', args=[self.course.id])
        response = self.client.patch(url, {'published': True}, format='json')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['published'], True)
        self.assertEqual(response.data['published_at'], str(date.today()))

    def test_publish_course_no_sections(self):
        """Test publishing fails when there are no sections."""
        url = reverse('publish-course', args=[self.course.id])
        response = self.client.patch(url, {'published': True}, format='json')

        self.assertEqual(response.status_code, 400)
        self.assertIn("A course must have at least one section",
                      response.data['error'])

    def test_publish_course_section_without_content(self):
        """Test publishing fails when a section has no content."""
        Section.objects.create(
            course=self.course, title="Empty Section", position=1)

        url = reverse('publish-course', args=[self.course.id])
        response = self.client.patch(url, {'published': True}, format='json')

        self.assertEqual(response.status_code, 400)
        self.assertIn("must have at least one content", response.data['error'])

    def test_publish_course_not_found(self):
        """Test publishing fails when the course does not exist."""
        url = reverse('publish-course', args=[999])  # Invalid ID
        response = self.client.patch(url, {'published': True}, format='json')

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data['message'], "Course not found")

class CoursesTaughtViewTests(APITestCase):
    def setUp(self):
        self.client = APIClient()

        # Create two users
        self.user1 = CustomUser.objects.create_user(
            username='user1', password='password1', email="user@gmail.com")
        self.user2 = CustomUser.objects.create_user(
            username='user2', password='password2', email="user2@gmail.com")

        # Authenticate user1
        url = reverse('token-request')
        response = self.client.post(
            url, {'username': 'user@gmail.com', 'password': 'password1'}, format='json')
        self.token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

        # Create courses for user1
        self.course1 = Course.objects.create(
            title="Django Course", creator=self.user1)
        self.course2 = Course.objects.create(
            title="React Course", creator=self.user1)

        # Create a course for user2 (should not appear in user1's results)
        self.course3 = Course.objects.create(
            title="Python Course", creator=self.user2)

    def test_get_courses_taught_by_user(self):
        """Test that the authenticated user sees only their own courses."""
        url = reverse('courses-taught')
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        # Only user1's courses
        self.assertEqual(len(response.data['results']), 2)
        self.assertEqual(response.data['results'][0]['title'], "Django Course")
        self.assertEqual(response.data['results'][1]['title'], "React Course")

    def test_search_courses_by_title(self):
        """Test searching for a course by title."""
        url = reverse('courses-taught') + "?search=django"
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], "Django Course")

    def test_user_cannot_see_other_users_courses(self):
        """Test that a user cannot see courses they did not create."""
        # Authenticate as user2
        self.client.force_authenticate(user=self.user2)

        url = reverse('courses-taught')
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        # Only user2's course
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], "Python Course")

    def test_unauthenticated_user_cannot_access_courses(self):
        """Test that an unauthenticated user gets a 401 error."""
        self.client.force_authenticate(user=None)  # Unauthenticate the client
        url = reverse('courses-taught')
        response = self.client.get(url)

        self.assertEqual(response.status_code, 401)  # Unauthorized
