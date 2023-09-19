# This is my code

from django.urls import re_path
from YogiverseApp.consumers import ChatConsumer

# Define the URL patterns for WebSocket routing
websocket_urlpatterns = [
    # Using re_path to define the URL pattern for WebSocket connections.
    # Here, it listens on the path 'ws/chat/' and routes it to ChatConsumer.
    re_path(r'ws/chat/$', ChatConsumer.as_asgi()), 
]
# End of my code