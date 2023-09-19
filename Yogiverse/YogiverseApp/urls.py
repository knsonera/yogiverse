from django.urls import path

# This is my code
from . import api
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # User routes
    path('users/', api.UserListCreateView.as_view(), name='user-list'),
    path('users/<int:pk>/', api.UserRetrieveUpdateDestroyView.as_view(), name='user-detail'),
    path('users/username/<str:username>/', api.UserRetrieveByUsernameView.as_view(), name='user-by-username'),
    path('users/id/<int:id>/', api.UserRetrieveByIdView.as_view(), name='user-by-id'),
    path('register/', api.RegisterUserView.as_view(), name='register'),
    path('me/', api.UserProfileView.as_view(), name='me'),
    path('logout/', api.LogoutView.as_view(), name='logout'),

    # Status updates
    path('users/<int:user_id>/status/', api.StatusUpdateListCreateView.as_view(), name='status-list'),
    path('status/<int:pk>/', api.StatusUpdateRetrieveUpdateDestroyView.as_view(), name='status-detail'),

    # MediaFile routes
    path('users/<int:user_id>/media/', api.MediaFileCreateView.as_view(), name='media-list'),
    path('media/<int:pk>/', api.MediaFileRetrieveUpdateDestroyView.as_view(), name='media-detail'),

    # Friendship routes
    path('users/<int:user_id>/friends/', api.FriendshipListCreateView.as_view(), name='friend-list'),
    path('friendship/<int:pk>/', api.FriendshipRetrieveUpdateDestroyView.as_view(), name='friend-detail'),

    # Chat routes
    path('chats/', api.ChatListCreateView.as_view(), name='chat-list'),
    path('chats/<int:pk>/', api.ChatRetrieveView.as_view(), name='chat-detail'),

    # Message routes
    path('chats/<int:chat_id>/messages/', api.MessageListCreateView.as_view(), name='message-list'),
    path('messages/<int:pk>/', api.MessageRetrieveView.as_view(), name='message-detail'),

    # JWT
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# End of my code