from django.urls import path, re_path
from .consumers import ChatConsumer

websocket_urlpatterns = [
    re_path(r'^ws/chat/(?P<room_name>[^/]+)/$', ChatConsumer.as_asgi()),
    # path('ws/chat/<str:room_name>/', ChatConsumer.as_asgi()),

]
# re_path(r'^ws/chat/(?P<room_name>[^/]+)/$', ChatConsumer.as_asgi()),
