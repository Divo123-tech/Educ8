"""
ASGI config for server project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""
import os

from django.core.asgi import get_asgi_application
from api.ws_urls import websocket_urlpatterns
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from dotenv import load_dotenv

load_dotenv()  # Load .env file

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')

print("WebSocket URL patterns:", websocket_urlpatterns)

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    ),
})
