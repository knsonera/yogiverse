from django.db import models

# This is my code
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class UserManager(BaseUserManager):
    """
    Custom manager for the User model.
    """
    def create_user(self, username, email, password=None):
        """
        Creates and returns a standard user with the given username, email, and password.
        Args:
            username: A unique string identifier.
            email: A unique email address.
            password: A password.
        Returns:
            A user object.
        """
        if not username:
            raise ValueError("User MUST have a username")
        if not email:
            raise ValueError("User MUST have an email address")

        user = self.model(
            username=username,
            email=self.normalize_email(email),
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password):
        """
        Creates and returns a superuser with admin-level permissions.
        Args:
            username: A unique string identifier.
            email: A unique email address.
            password: A password.
        Returns:
            A user object with admin-level permissions.
        """
        user = self.create_user(
            username,
            email,
            password=password,
        )
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom User model.
    Fields:
      - username: unique string identifier.
      - fullname: user's full name.
      - email: user's email.
      - profile_picture: (optional) profile picture.
      - created_at: the timestamp when the user was created.
      - updated_at: the timestamp the last update.
      - is_staff: is the user staff or not (boolean).
    """
    username = models.CharField(max_length=50, unique=True)
    fullname = models.CharField(max_length=100, default='User')
    email = models.EmailField(unique=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

class MediaFile(models.Model):
    """
    Model to hold media files for users.
    Fields:
      - user: (foreign key) user who own the file.
      - file_path: path to the uploaded media file.
      - media_type: type of the media file, either 'image' or 'audio'.
      - created_at: the timestamp when the file was uploaded.
    """
    MEDIA_TYPES = [
        ('image', 'Image'),
        ('audio', 'Audio'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    media_file = models.FileField(upload_to='user_media/')
    media_type = models.CharField(max_length=10, choices=MEDIA_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)

class StatusUpdate(models.Model):
    """
    Model to hold status updates for users.
    Fields:
      - user: foreign key relation to the User model.
      - text_content: the actual status update text.
      - media_file: (optional) reference to associated media file.
      - created_at: the timestamp when the status was created.
      - updated_at: the timestamp of the last update.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text_content = models.TextField()
    media_file_id = models.IntegerField(null=True, blank=True)    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Friendship(models.Model):
    """
    Model to represent friendships between users.
    Fields:
      - user1: (foreign key) first user in the friendship.
      - user2: (foreign key) second user in the friendship.
      - status: the current status of the friendship, either 'pending' or 'accepted'.
      - created_at: the timestamp when the friendship was created.
    """
    STATUS = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
    ]
    user1 = models.ForeignKey(User, related_name='user1', on_delete=models.CASCADE)
    user2 = models.ForeignKey(User, related_name='user2', on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=STATUS, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user1', 'user2')

class Chat(models.Model):
    """
    Model to represent chat conversations between users.
    Fields:
      - user1: (foreign key) first user in the chat.
      - user2: (foreign key) second user in the chat.
      - created_at: the timestamp when the chat was created.
    """
    user1 = models.ForeignKey(User, related_name='chat_user1', on_delete=models.CASCADE)
    user2 = models.ForeignKey(User, related_name='chat_user2', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class Message(models.Model):
    """
    Model to hold individual messages within a chat.
    Fields:
      - chat: (foreign key) Chat model.
      - sender: (foreign key) user who sent the message.
      - text_content: message text.
      - created_at: the timestamp when the message was sent.
    """
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE)
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    text_content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

# End of my code