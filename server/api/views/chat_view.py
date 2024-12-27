from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from ..models import Chat  # Assuming your Chat model is in the same app
# Assuming you have a serializer for Chat
from ..serializers import ChatSerializer


class FetchMessagesView(APIView):
    # Ensure the user is authenticated
    permission_classes = [IsAuthenticated]

    def get(self, request, room_name, *args, **kwargs):
        """
        Fetch all messages in the given room, only if the user is authenticated.
        """
        # Debug print to confirm the function is triggered
        print("here 1")

        # Fetch messages from the database filtered by room_name
        messages = Chat.objects.filter(room_name=room_name).order_by('sent_at')

        # Serialize the messages using a ChatSerializer (you need to create it)
        # Assuming you have a serializer for the Chat model
        serializer = ChatSerializer(messages, many=True)

        # Return the serialized data
        return Response(serializer.data, status=status.HTTP_200_OK)
