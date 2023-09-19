# This is my code.
from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from django.conf import settings
import jwt

# Custom middleware for WebSockets and JWT tokens
class JwtAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        
        # Extract the JWT token from the query string in the WebSocket URL
        token = scope.get('query_string', b'').decode('utf-8').split("token=")[-1]
        
        if token:
            # If a token is found in the query string, attempt to get the user ID
            user_id = await self.get_user_id_from_token(token)
            if user_id:
                # If a user ID is found, add it to the scope
                scope['user_id'] = user_id
        else:
            print("JWT token not found")

        # Call the next middleware or consumer in the stack
        return await super().__call__(scope, receive, send)

    @database_sync_to_async
    def get_user_id_from_token(self, token):
        # Decode the JWT token using the SECRET_KEY from Django settings
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            # Extract the user ID from the payload
            user_id = payload['user_id']

            return user_id
        except:
            return None       
# End of my code