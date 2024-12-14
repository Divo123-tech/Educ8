from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from ..models import CustomUser
from rest_framework_simplejwt.tokens import RefreshToken


class UserViewTests(APITestCase):
    def setUp(self):
        # Create a user for testing
        self.user = CustomUser.objects.create_user(
            username='testuser', password='password123', email="testuser@example.com")

    def test_create_user(self):
        url = reverse('register-user')
        data = {'username': 'testuser2', 'password': 'password123',
                'email': 'testuser2@example.com'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['username'], 'testuser2')

    def test_user_login(self):
        # This should be the correct path for your TokenObtainPairView
        url = reverse('token-request')
        data = {'username': 'testuser', 'password': 'password123'}

        # Send the POST request to obtain the JWT token
        response = self.client.post(url, data, format='json')
        # Check that the response status code is 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Optionally, you can assert that the token is returned in the response data
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)


class FindUserViewTestCase(APITestCase):

    def setUp(self):
        # Create a test user
        self.user = CustomUser.objects.create_user(
            username="testuser",
            password="testpassword123",
            email="testuser@example.com"
        )
        # Adjust URL name and kwargs if needed
        self.url = reverse('users', kwargs={'pk': self.user.id})

    def test_get_user_found(self):
        """Test that the user is returned successfully"""
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.user.username)

    def test_get_user_not_found(self):
        """Test that when user doesn't exist, 404 is returned"""
        # Using a non-existent user ID
        url = reverse('users', kwargs={'pk': 9999})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class UserViewTestCase(APITestCase):

    def setUp(self):
        # Create a test user and generate token
        self.user = CustomUser.objects.create_user(
            username="testuser",
            password="testpassword123",
            email="testuser@example.com"

        )
        self.url = reverse('my-profile')  # Adjust URL name if necessary
        # Get JWT token for authentication
        self.token = RefreshToken.for_user(self.user).access_token

    def test_get_authenticated_user(self):
        """Test that authenticated user can get their own data"""
        self.client.credentials(
            HTTP_AUTHORIZATION='Bearer ' + str(self.token))  # Use JWT token
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.user.username)

    def test_get_unauthenticated_user(self):
        """Test that an unauthenticated user cannot access user data"""
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_patch_user(self):
        """Test that an authenticated user can update their data"""
        self.client.credentials(
            HTTP_AUTHORIZATION='Bearer ' + str(self.token))  # Use JWT token
        data = {'username': 'updateduser'}
        response = self.client.patch(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'updateduser')

    def test_patch_unauthenticated_user(self):
        """Test that an unauthenticated user cannot update user data"""
        data = {'username': 'updateduser'}
        response = self.client.patch(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_user(self):
        """Test that an authenticated user can delete their account"""
        self.client.credentials(
            HTTP_AUTHORIZATION='Bearer ' + str(self.token))  # Use JWT token
        response = self.client.delete(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Verify the user is deleted
        with self.assertRaises(CustomUser.DoesNotExist):
            CustomUser.objects.get(id=self.user.id)

    def test_delete_unauthenticated_user(self):
        """Test that an unauthenticated user cannot delete their account"""
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
