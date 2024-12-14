from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from ..models import Section, Course, CustomUser
from rest_framework.test import APIClient


class SectionViewTests(APITestCase):
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

    def test_get_sections(self):
        # Create a section under the course
        Section.objects.create(
            title="Section 1", position=1, course=self.course)
        Section.objects.create(
            title="Section 2", position=2, course=self.course)

        # Get all sections for the course
        url = reverse('sections', kwargs={'courseId': self.course.id})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # Expecting two sections

    def test_create_section(self):
        # Create a section under the course
        url = reverse('sections', kwargs={'courseId': self.course.id})
        data = {
            'title': 'New Section',
            'position': 1,
            'course': self.course.id
        }
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'New Section')


class SingleSectionViewTests(APITestCase):
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

    def test_get_section(self):
        # Create a section
        section = Section.objects.create(
            title="Section 1", position=1, course=self.course)

        # Get the section by its ID
        url = reverse(
            'single-section', kwargs={'courseId': self.course.id, 'sectionId': section.id})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Section 1')

    def test_update_section(self):
        # Create a section
        section = Section.objects.create(
            title="Section 1", position=1, course=self.course)

        # Update the section
        url = reverse(
            'single-section', kwargs={'courseId': self.course.id, 'sectionId': section.id})
        data = {'title': 'Updated Section', 'position': 1}
        response = self.client.put(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)
        self.assertEqual(response.data['title'], 'Updated Section')

    def test_patch_section_position(self):
        # Create sections
        section_1 = Section.objects.create(
            title="Section 1", position=1, course=self.course)
        section_2 = Section.objects.create(
            title="Section 2", position=2, course=self.course)

        # Change the position of the first section
        url = reverse(
            'single-section', kwargs={'courseId': self.course.id, 'sectionId': section_1.id})
        data = {'position': 2}  # Changing position to 2
        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['position'], 2)

    def test_delete_section(self):
        # Create a section
        section = Section.objects.create(
            title="Section to delete", position=1, course=self.course)

        # Delete the section
        url = reverse(
            'single-section', kwargs={'courseId': self.course.id, 'sectionId': section.id})
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Try to get the deleted section, should return 404
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
