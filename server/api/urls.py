from django.urls import include, path
from .views import UserView, RegisterView, FetchMessagesView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('courses/', include('api.urls_folder.course')),
    path('users/', include('api.urls_folder.user')),
    path('messages/<str:room_name>/',
         FetchMessagesView.as_view(), name='fetch_messages'),
    path('analytics/', include('api.urls_folder.analytics')),
    path('register/', RegisterView.as_view(), name="register-user"),
    path("token/", TokenObtainPairView.as_view(), name="token-request"),
    path("token/refresh", TokenRefreshView.as_view(), name="token-refresh"),
    path("auth/", include("rest_framework.urls"))
]
