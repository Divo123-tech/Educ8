from django.urls import include, path
from .views import RegisterView, FetchMessagesView, CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

urlpatterns = [
    path('courses/', include('api.urls_folder.course')),
    path('users/', include('api.urls_folder.user')),
    path('messages/<str:room_name>/',
         FetchMessagesView.as_view(), name='fetch_messages'),
    path('analytics/', include('api.urls_folder.analytics')),
    path('register/', RegisterView.as_view(), name="register-user"),
    path("token/", CustomTokenObtainPairView.as_view(), name="token-request"),
    path("token/refresh", TokenRefreshView.as_view(), name="token-refresh"),
    path("auth/", include("rest_framework.urls")),
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
