from django.contrib import admin
from .models import Post
from .models import Photo

# Register your models here.

admin.site.register(Post)
admin.site.register(Photo)