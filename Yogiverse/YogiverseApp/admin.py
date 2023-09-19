from django.contrib import admin

# This is my code
from .models import User, MediaFile, StatusUpdate, Friendship

admin.site.register(User)
admin.site.register(MediaFile)
admin.site.register(StatusUpdate)
admin.site.register(Friendship)
# End of my code