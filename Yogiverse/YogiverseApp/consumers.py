# This is my code
# Imports
from channels.generic.websocket import AsyncWebsocketConsumer
import json

connected_users = {}

# Define the ChatConsumer class
class ChatConsumer(AsyncWebsocketConsumer):
    # Handle incoming WebSocket connections
    async def connect(self):
        # Extract user id
        self.user_id = int(self.scope["user_id"])
        await self.accept()
        print("WebSocket connected, user_id: ", self.user_id, ", channel_name: ", self.channel_name)
        # Keep track of connected users
        connected_users[self.user_id] = self.channel_name

    # Handle disconnections
    async def disconnect(self, close_code):
        del connected_users[self.user_id]
        print("WebSocket disconnected")

    # Handle received messages from the WebSocket
    async def receive(self, text_data):
        print("[user ", self.scope["user_id"], "] Received WebSocket message:", text_data)
        # Extract message and recipient
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        to_user_id = int(text_data_json['to_user_id'])

        # Checking active channels for recipient
        to_channel = connected_users.get(to_user_id)
        print("Channel for user ", to_user_id, " found: ", to_channel)
        print("All channels: ", connected_users)

        # If channel is found, send a message to channel
        if to_channel:
            await self.channel_layer.send(to_channel, {
                "type": "chat_message",
                "message": message,
                "from_user_id": int(self.scope["user_id"])
            })

        # Repeating a message to myself:
        if to_channel != self.channel_name:
            await self.channel_layer.send(self.channel_name, {
                "type": "chat_message",
                "message": message,
                "from_user_id": int(self.scope["user_id"])
            })

    # Send message to the client
    async def chat_message(self, event):
        data = json.dumps({
            'message': event['message'],
            'from_user_id': event['from_user_id']
        })

        print("[user ", self.scope["user_id"], "] Sending WebSocket data:", data)
        await self.send(text_data=data)

# End of my code
