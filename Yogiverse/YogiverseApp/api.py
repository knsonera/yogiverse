# This is my code
# Django utility functions and classes
from django.shortcuts import get_object_or_404
from django.contrib.auth import logout
from django.db.models import Q
from django.db import IntegrityError
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as filters

# REST framework imports
from rest_framework import generics, mixins, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import MultiPartParser, FormParser

# Models and serializers
from .models import User, StatusUpdate, MediaFile, Friendship, Chat, Message
from .serializers import UserSerializer, StatusUpdateSerializer, MediaFileSerializer, FriendshipSerializer, ChatSerializer, MessageSerializer
from .serializers import UserRegisterSerializer

#############
# User CRUD
#############

class UserListCreateView(generics.ListCreateAPIView):
    """
    List all users or create a new user.
    Only authenticated users can perform these actions.
    GET: Fetch a list of all users.
    POST: Create a new user by submitting JSON data {"username": "Kate", "email": "kate@example.com"}.
    """
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

class RegisterUserView(generics.CreateAPIView):
    """
    Register a new user. 
    No authentication required.    
    POST: Register user by submitting JSON data {"username": "Kate", "email": "kate@example.com", "password": "password123"}.
    """
    authentication_classes = []  # No authentication for registration
    permission_classes = [AllowAny]  # Anyone can register
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            headers = self.get_success_headers(serializer.data)
            if user is None:
                return Response({'detail': 'User could not be created'}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'user_id': user.id, 'detail': 'User registered'}, status=status.HTTP_201_CREATED, headers=headers)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(generics.RetrieveAPIView):
    """
    Retrieve the profile of the current authenticated user.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user
    
class UserRetrieveByUsernameView(generics.RetrieveAPIView):
    """
    Retrieve a user by username.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        username = self.kwargs.get('username')
        user = get_object_or_404(User, username=username)
        return user
    
class UserRetrieveByIdView(generics.RetrieveAPIView):
    """
    Retrieve a user by id.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        id = self.kwargs.get('id')
        user = get_object_or_404(User, id=id)
        return user

class UserRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete a user.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
class LogoutView(APIView):
    """
    Log out the user by clearing the session.
    GET example: Submit a GET request to log out.
    """
    def get(self, request):
        logout(request)
        return Response({"message": "Logged out successfully!"}, status=200)


######################
# StatusUpdate CRUD
#####################

# Status update filter by the user
class StatusUpdateFilter(filters.FilterSet):
    class Meta:
        model = StatusUpdate
        fields = ['user']

# Status updates pagination
# (Not yet used)
class StatusUpdatePagination(PageNumberPagination):
    page_size = 10 
    page_size_query_param = 'page_size'
    max_page_size = 100

class StatusUpdateListCreateView(generics.ListCreateAPIView):
    """
    List all status updates for a specific user or create a new status update.
    GET: Fetch all status updates for user with ID 1.
    POST: Create a new status update {"text": "New status", "user_id": 1}.
    """
    queryset = StatusUpdate.objects.all()
    serializer_class = StatusUpdateSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = (DjangoFilterBackend,)
    filterset_class = StatusUpdateFilter

    # Filter objects by the user_id provided
    def get_queryset(self):
        return StatusUpdate.objects.filter(user_id=self.kwargs['user_id'])
    
    # Create status update and associate with user
    def perform_create(self, serializer):
        # Associate the status update with the user
        serializer.save(user=self.request.user)

class StatusUpdateRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete a status update.
    """
    queryset = StatusUpdate.objects.all()
    serializer_class = StatusUpdateSerializer

####################
# MediaFile CRUD
####################

# MediaFile filter by user and media_type
class MediaFileFilter(filters.FilterSet):
    class Meta:
        model = MediaFile
        fields = ['user', 'media_type']

class MediaFileCreateView(generics.CreateAPIView):
    """
    API endpoint for uploading media files and associating them with a user.
    """
    queryset = MediaFile.objects.all()
    serializer_class = MediaFileSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def create(self, request, *args, **kwargs):
        try:
            # Get the user ID from the authenticated user
            user_id = request.user.id

            # Get the media file from the form data
            media_file = request.data.get('media_file')

            # Get the media type (e.g., image, video) from the form data (if available)
            media_type = request.data.get('media_type', '')

            # TODO: Add validation or processing of the media file, check the file type, size, or other attributes.

            # Create a media file instance and associate it with the user
            media_file_instance = MediaFile(
                user_id=user_id,
                media_file=media_file,
                media_type=media_type  # Set the media type
            )

            # Save the media file instance to the database
            media_file_instance.save()

            # Get the ID of the newly created media file instance
            media_file_id = media_file_instance.id

            # Serialize the created media file instance along with its ID
            serializer = self.get_serializer(media_file_instance)
            response_data = serializer.data
            response_data['media_file_id'] = media_file_id

            return Response(response_data, status=status.HTTP_201_CREATED)

        except Exception as e:
            # Handle exceptions
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class MediaFileListCreateView(generics.ListCreateAPIView):
    """
    List all media files for a specific user or upload a new media file.
    GET: Fetch all media files for user with specific id.
    POST: Upload a new media file by submitting the file and associated user_id.
    """
    queryset = MediaFile.objects.all()
    serializer_class = MediaFileSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = MediaFileFilter

    def get_queryset(self):
        return MediaFile.objects.filter(user_id=self.kwargs['user_id'])

class MediaFileRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete a media file.
    """
    queryset = MediaFile.objects.all()
    serializer_class = MediaFileSerializer


####################
# Friendship CRUD
####################


class FriendshipListCreateView(generics.ListCreateAPIView):
    """
    List all friendships for a specific user or create a new friendship.
    GET: Fetch all friendships for user with specific id.
    POST: Create a new friendship by submitting JSON data {"user1_id": 1, "user2_id": 2}.
    """
    queryset = Friendship.objects.all()
    serializer_class = FriendshipSerializer

    # Custom method to create Friendship
    def create(self, request, *args, **kwargs):
        # Get ids of the users
        user1_id = request.data.get("user1_id")
        user2_id = request.data.get("user2_id")
        
        # Friendship status (not yet used)
        status_value = request.data.get("status", "pending")
        
        # Get user objects
        user1 = get_object_or_404(User, id=user1_id)
        user2 = get_object_or_404(User, id=user2_id)
        
        # Try to create Friendship instance
        try:
            friendship_instance = Friendship.objects.create(
                user1=user1,
                user2=user2,
                status=status_value
            )
        # Throw expection if Friendship already exists
        except IntegrityError:
            return Response({"detail": "Friendship already exists between these users."},
                            status=status.HTTP_400_BAD_REQUEST)
        
        serializer = FriendshipSerializer(friendship_instance)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # Get all friendships for the user, either user1 or user2
    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Friendship.objects.filter(Q(user1_id=user_id) | Q(user2_id=user_id))

class FriendshipRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete a friendship.
    """
    queryset = Friendship.objects.all()
    serializer_class = FriendshipSerializer

############
# Chat CRUD
############

class ChatListCreateView(generics.ListCreateAPIView):
    """
    List all chats for a specific user or create a new chat.
    GET: Fetch all chats for user with specific id.
    POST: Create a new chat by submitting JSON data {"user_id1": 1, "user_id2": 2}.
    """
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    
    def get_queryset(self):
        return Chat.objects.filter(user_id1=self.kwargs['user_id'])

class ChatRetrieveView(generics.RetrieveAPIView):
    """
    Retrieve a specific chat.
    """
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer


################
# Message CRUD
################

class MessageListCreateView(generics.ListCreateAPIView):
    """
    List all messages for a specific chat or create a new message.
    GET: Fetch all messages in chat with specific.
    POST: Create a new message in chat by submitting JSON data {"text": "Message", "chat_id": 1}.
    """
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    
    def get_queryset(self):
        return Message.objects.filter(chat_id=self.kwargs['chat_id'])

class MessageRetrieveView(generics.RetrieveAPIView):
    """
    Retrieve a specific message.
    """
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

# WS (Chat)
class UserById():
    def get_user(userId):
        return get_object_or_404(User, id=userId)
       
# End of my code