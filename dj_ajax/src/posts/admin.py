from django.contrib import admin
from .models import Post, Photo, Comment

# Register your models here.

admin.site.register(Post)
admin.site.register(Photo)
admin.site.register(Comment)