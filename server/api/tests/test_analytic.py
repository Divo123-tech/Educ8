from rest_framework.test import APIClient, APITestCase
from rest_framework import status
from django.urls import reverse
from api.models import Course, CustomUser, UserCourse


class CourseStatsAndRevenueTests(APITestCase):
    def setUp(self):
        self.client = APIClient()

        # Create user and authenticate
        self.user = CustomUser.objects.create_user(
            username='testuser', password='testpassword')
        url = reverse('token-request')  # Ensure this matches your token URL
        response = self.client.post(
            url, {'username': 'testuser', 'password': 'testpassword'}, format='json')
        self.token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

        # Create published and unpublished courses
        self.published_course = Course.objects.create(
            title="Published Course", creator=self.user, published=True, price=100)
        self.unpublished_course = Course.objects.create(
            title="Unpublished Course", creator=self.user, published=False, price=150)

        # Register another student for revenue testing
        self.student = CustomUser.objects.create_user(
            username='student', password='studentpassword')
        # Enroll student in published course
        UserCourse.objects.create(
            student=self.student, course=self.published_course)

        # Set URLs
        self.published_status_url = reverse(
            'courses-published')  # Adjust URL name if needed
        # Adjust URL name if needed
        self.revenue_url = reverse('course-revenue')

    def test_course_published_status_view(self):
        """Test the published and unpublished course count for the user."""
        response = self.client.get(self.published_status_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['published_count'], 1)
        self.assertEqual(response.data['unpublished_count'], 1)
        self.assertEqual(response.data['total'], 2)

    def test_unauthenticated_user_cannot_access_published_status(self):
        """Test that an unauthenticated user cannot access published status view."""
        self.client.force_authenticate(user=None)
        response = self.client.get(self.published_status_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_course_revenue_view(self):
        """Test revenue calculation for the user's courses."""
        response = self.client.get(self.revenue_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

        # Validate the revenue for published course
        published_course_data = next(
            course for course in response.data if course['title'] == "Published Course")
        # 1 student * 100 price
        self.assertEqual(published_course_data['revenue'], '100.00')
        self.assertEqual(published_course_data['total_students'], 1)

        # Validate the revenue for unpublished course (should be zero revenue)
        unpublished_course_data = next(
            course for course in response.data if course['title'] == "Unpublished Course")
        self.assertEqual(
            unpublished_course_data['revenue'], '0.00')  # No students
        self.assertEqual(unpublished_course_data['total_students'], 0)

    def test_unauthenticated_user_cannot_access_revenue(self):
        """Test that an unauthenticated user cannot access the revenue view."""
        self.client.force_authenticate(user=None)
        response = self.client.get(self.revenue_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
