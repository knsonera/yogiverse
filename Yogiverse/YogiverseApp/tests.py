from django.test import TestCase
# This is my code
from rest_framework import status
from rest_framework.test import APIClient

from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.auth.models import User
from django.urls import reverse

from .models import User, StatusUpdate, MediaFile, Friendship


# ENDPONTS

# User endpoints
class UserTests(TestCase):
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', email='test@email.com', password='testpassword')
        self.client.force_authenticate(user=self.user)

    def test_create_user(self):
        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "newpassword"
        }
        response = self.client.post(reverse('user-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_retrieve_user(self):
        response = self.client.get(reverse('user-detail', args=[self.user.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.user.username)

    def test_update_user(self):
        new_data = {
            "username": "updateduser",
            "email": "updateduser@example.com",
        }
        response = self.client.put(reverse('user-detail', args=[self.user.id]), new_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'updateduser')

    def test_delete_user(self):
        response = self.client.delete(reverse('user-detail', args=[self.user.id]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        # Verify user deletion
        with self.assertRaises(User.DoesNotExist):
            User.objects.get(username='testuser')


# Status Update tests
class StatusUpdateTests(TestCase):
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', email='test@test.com', password='testpassword')
        self.client.force_authenticate(user=self.user)
        self.status_update = StatusUpdate.objects.create(text_content="Initial status", user=self.user)

    def test_list_status_updates(self):
        response = self.client.get(reverse('status-list', kwargs={'user_id': self.user.id}))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_create_status_update(self):
        data = {
            "text_content": "This is a new status",
            "user": self.user.id
        }
        response = self.client.post(reverse('status-list', kwargs={'user_id': self.user.id}), data, format='json')
        self.assertEqual(response.status_code, 201)

    def test_retrieve_status_update(self):
        response = self.client.get(reverse('status-detail', kwargs={'pk': self.status_update.id}))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['text_content'], "Initial status")

    def test_delete_status_update(self):
        response = self.client.delete(reverse('status-detail', kwargs={'pk': self.status_update.id}))
        self.assertEqual(response.status_code, 204)
        
        # Verify the status update no longer exists
        with self.assertRaises(StatusUpdate.DoesNotExist):
            StatusUpdate.objects.get(id=self.status_update.id)


class MediaFileTests(TestCase):

    def setUp(self):
        self.client = APIClient()
        
        self.user = User.objects.create_user(username='testuser', email='test@test.com', password='testpassword')
        self.client.force_authenticate(user=self.user)

        # Create a simple test file for upload
        self.test_file = SimpleUploadedFile(name='test_image.jpg', content=b'test content', content_type='image/jpeg')

        self.media_file = MediaFile.objects.create(
            user=self.user,
            media_file=self.test_file,
            media_type='image'
        )

    def test_create_media_file(self):
        with open('media-files/test_image.jpg', 'rb') as file:
            data = {
                "media_file": file,
                "media_type": "image",
                "user": self.user.id,
            }
            response = self.client.post(reverse('media-list', kwargs={'user_id': self.user.id}), data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_retrieve_media_file(self):
        response = self.client.get(reverse('media-detail', kwargs={'pk': self.media_file.id}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['media_type'], 'image')

    def test_delete_media_file(self):
        response = self.client.delete(reverse('media-detail', kwargs={'pk': self.media_file.id}))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        # Verify the media file no longer exists
        with self.assertRaises(MediaFile.DoesNotExist):
            MediaFile.objects.get(id=self.media_file.id)


# Friendship tests
class FriendshipTests(TestCase):
    
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(username='user1', email='user1@email.com', password='password1')
        self.user2 = User.objects.create_user(username='user2', email='user2@email.com', password='password2')
        self.client.force_authenticate(user=self.user1)

    def test_create_friendship(self):
        url = reverse('friend-list', kwargs={'user_id': self.user1.id})
        data = {'user1_id': self.user1.id, 'user2_id': self.user2.id}
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Friendship.objects.count(), 1)

    def test_list_friendships(self):
        Friendship.objects.create(user1=self.user1, user2=self.user2)
        url = reverse('friend-list', kwargs={'user_id': self.user1.id})
        
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_retrieve_update_delete_friendship(self):
        friendship = Friendship.objects.create(user1=self.user1, user2=self.user2)
        url = reverse('friend-detail', kwargs={'pk': friendship.id})
        
        # Retrieve
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Delete
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

# End of my code