from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.contrib.auth import get_user_model
from ..models import Course, Review, CustomUser
from api.serializers import ReviewSerializer
from rest_framework.test import APIClient


class ReviewViewTests(APITestCase):
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

    def test_create_review(self):
        url = reverse('reviews', kwargs={'courseId': self.course.id})
        data = {'rating': 5, 'title': 'Excellent course!',
                "description": 'description'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['rating'], 5)
        self.assertEqual(response.data['title'], 'Excellent course!')
        self.assertEqual(response.data['description'], 'description')
        self.assertEqual(response.data['course'], self.course.id)

    def test_get_reviews(self):
        # Create a review for the course
        Review.objects.create(
            course=self.course, reviewed_by=self.user, rating=4, title="Good course", description="description")
        url = reverse('reviews', kwargs={'courseId': self.course.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], 'Good course')


class SingleReviewViewTests(APITestCase):

    def setUp(self):
        # Create a user for authentication
        self.user = CustomUser.objects.create_user(
            username='testuser', password='testpassword')

        # Create a course for which the review will be created
        self.course = Course.objects.create(
            name="Test Course",
            description="Test description",
            creator=self.user
        )

        # Create a review for the course
        self.review = Review.objects.create(
            title="Good course",  # Use the title field from the model
            # Use description field
            description="This is a good course with lots of useful content.",
            rating=5,
            course=self.course,
            reviewed_by=self.user
        )

        # Initialize APIClient instance for making requests
        self.client = APIClient()

        # Obtain a JWT token for the user
        # TokenObtainPairView URL (adjust if needed)
        url = reverse('token-request')
        data = {
            'username': self.user.username,
            'password': 'testpassword'
        }
        response = self.client.post(url, data, format='json')

        # Ensure the response contains the token
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.token = response.data['access']  # Extract the access token

        # Set the Authorization header for all subsequent requests
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

    def test_get_single_review(self):
        url = reverse(
            'single-review', kwargs={'courseId': self.course.id, 'pk': self.review.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Good course')

    def test_update_review(self):
        url = reverse(
            'single-review', kwargs={'courseId': self.course.id, 'pk': self.review.id})
        data = {'rating': 5, 'title': 'Great course!',
                "description": "description"}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['rating'], 5)
        self.assertEqual(response.data['title'], 'Great course!')

    def test_delete_review(self):
        url = reverse(
            'single-review', kwargs={'courseId': self.course.id, 'pk': self.review.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Review.objects.filter(id=self.review.id).exists())

    def test_delete_review_not_found(self):
        # Invalid review ID
        url = reverse(
            'single-review', kwargs={'courseId': self.course.id, 'pk': 9999})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
