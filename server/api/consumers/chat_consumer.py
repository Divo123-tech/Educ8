import os
from django.conf import settings

# Set the Django settings module environment variable
if not settings.configured:
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "server.settings")
    import django
    django.setup()
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from ..models import Chat, CustomUser


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):

        # Retrieve room_name from URL kwargs
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        print("CONNECTED", self.room_group_name)

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        print("DISCONNETED")

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        user_id = text_data_json['user']

        # Save the message to the database
        user = await sync_to_async(CustomUser.objects.get)(id=user_id)
        chat_message = await sync_to_async(Chat.objects.create)(
            room_name=self.room_name,
            sent_by=user,
            message=message
        )

        # Send message to the room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sent_by': user_id,
                'sent_at': chat_message.sent_at.isoformat()
            }
        )

    async def chat_message(self, event):
        message = event['message']
        sent_by = event['sent_by']
        sent_at = event['sent_at']  # Extract sent_at from the event

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'sent_by': sent_by,
            'sent_at': sent_at  # Include sent_at in the response
        }))
