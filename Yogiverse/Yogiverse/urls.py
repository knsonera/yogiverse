"""
URL configuration for Yogiverse project.

"""

from django.contrib import admin
from django.urls import path, include
# This is my code
from django.conf import settings
from django.conf.urls.static import static
# End of my code

urlpatterns = [
    path('admin/', admin.site.urls), # admin panel
    path('api/', include('YogiverseApp.urls')),  # urls from YogiverseApp
]

# This is my code
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
# End of my code