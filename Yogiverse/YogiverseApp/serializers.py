from rest_framework import serializers

# This is my code
from django.conf import settings
from django.contrib.auth import get_user_model

from .models import User, StatusUpdate, MediaFile, Friendship, Chat, Message
import logging

# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'fullname', 'email', 'profile_picture', 'created_at', 'updated_at')

# Serializer for User Registration, JWT tokens
class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'fullname', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        try:
            password = validated_data.pop('password')  # Remove the password field
            user = User.objects.create(**validated_data)  # Create a new user object
            user.set_password(password)  # Set the password (with encryption)
            user.save()  # Save the user object to the database
        except Exception as e:
            logging.error(f"Error in user creation: {e}")
            return None
        return user  # Return created user object

# StatusUpdate Serializer
class StatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = StatusUpdate
        fields = ('id', 'user', 'text_content', 'media_file_id', 'created_at', 'updated_at')

# MediaFile Serializer
class MediaFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaFile
        fields = ('user_id', 'media_file', 'media_type', 'created_at')
        read_only_fields = ('user_id', 'created_at')

# Friendship Serializer
class FriendshipSerializer(serializers.ModelSerializer):
    user1 = UserSerializer(read_only=True)
    user2 = UserSerializer(read_only=True)
    user1_id = serializers.IntegerField(write_only=True)
    user2_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Friendship
        fields = ('id', 'user1', 'user1_id', 'user2', 'user2_id', 'status', 'created_at')

# Chat Serializer
class ChatSerializer(serializers.ModelSerializer):
    user1 = UserSerializer()
    user2 = UserSerializer()
    user1_id = serializers.IntegerField(write_only=True)
    user2_id = serializers.IntegerField(write_only=True)
    class Meta:
        model = Chat
        fields = ('id', 'user1', 'user1_id', 'user2', 'user2_id', 'created_at')

# Message Serializer
class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ('id', 'chat_id', 'sender_id', 'text_content', 'created_at')

# End of my code