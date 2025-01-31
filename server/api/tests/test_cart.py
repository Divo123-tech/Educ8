from rest_framework.test import APIClient, APITestCase
from rest_framework import status
from django.urls import reverse
from api.models import Course, CustomUser, Cart, UserCourse


class CartViewTests(APITestCase):
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

        # Create a course
        self.course = Course.objects.create(
            title="Django Course", creator=self.user)

        # Create another user for testing unauthorized access
        self.other_user = CustomUser.objects.create_user(
            username='otheruser', password='otherpassword')

        # Create a cart entry
        self.cart = Cart.objects.create(student=self.user, course=self.course)
        self.courseUnadded = Course.objects.create(
            title="Python Course", creator=self.user)
        # Set URLs
        # Ensure this matches your URL patterns
        self.cart_url = reverse('cart')
        self.cart_exists_url = reverse(
            'cart-exists', args=[self.course.id])
        self.checkout_url = reverse('cart-checkout')

    def test_add_course_to_cart(self):
        """Test adding a course to the cart successfully."""
        data = {"course": self.courseUnadded.id}
        response = self.client.post(self.cart_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Cart.objects.filter(
            student=self.user, course=self.course).exists())

    def test_cannot_add_duplicate_course_to_cart(self):
        """Test that a course cannot be added twice to the cart."""
        data = {"course": self.course.id}
        self.client.post(self.cart_url, data, format='json')  # Add once
        response = self.client.post(
            self.cart_url, data, format='json')  # Try adding again
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_check_if_course_in_cart(self):
        """Test checking if a course is in the cart."""
        response = self.client.get(self.cart_exists_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, True)

    def test_check_if_course_not_in_cart(self):
        """Test checking if a course is not in the cart."""
        Cart.objects.filter(student=self.user, course=self.course).delete()
        response = self.client.get(self.cart_exists_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, False)

    def test_remove_course_from_cart(self):
        """Test removing a course from the cart."""
        data = {"course": self.course.id}
        response = self.client.delete(self.cart_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Cart.objects.filter(
            student=self.user, course=self.course).exists())

    def test_checkout_courses(self):
        """Test successful checkout of courses."""
        cart_item = {
            "id": self.cart.id,
            "course": {"id": self.course.id}
        }
        data = {"cartItems": [cart_item]}
        response = self.client.post(self.checkout_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(Cart.objects.filter(
            student=self.user, course=self.course).exists())
        self.assertTrue(UserCourse.objects.filter(
            student=self.user, course=self.course).exists())

    def test_checkout_fails_with_invalid_data(self):
        """Test checkout fails with invalid data."""
        data = {"cartItems": [
            {"id": 9999, "course": {"id": 9999}}]}  # Non-existent course
        response = self.client.post(self.checkout_url, data, format='json')
        self.assertEqual(response.status_code,
                         status.HTTP_500_INTERNAL_SERVER_ERROR)
