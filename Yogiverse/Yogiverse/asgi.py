# Imports
import os
#from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application

# This is my code
from channels.routing import ProtocolTypeRouter, URLRouter
from Yogiverse.jwtauthmiddleware import JwtAuthMiddleware
import Yogiverse.routing
# End of my code

# Set the default settings module for Django.
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Yogiverse.settings")

# This is my code
# ASGI application routing
application = ProtocolTypeRouter({
    "http": get_asgi_application(),  # Handle HTTP requests with Django's ASGI application
    "websocket": JwtAuthMiddleware(
        URLRouter(
            Yogiverse.routing.websocket_urlpatterns  # Handle WebSocket requests with these custom URL patterns
        )
    ),
})
# End of my code
