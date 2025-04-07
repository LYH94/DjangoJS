from django.urls import path
from .views import (
  post_list_and_create,
  load_post_data_view,
  like_unlike_post,
  post_detail,
  post_detail_data_view,
  delete_post,
  update_post,
  image_upload_view,
  add_comment,
  load_comments,
)

app_name = 'posts'

urlpatterns = [
  path('', post_list_and_create, name='main-board'),
  path('like-unlike/', like_unlike_post, name='like-unlike'),
  path('upload/', image_upload_view, name='image-upload'),
  path('data/<int:num_posts>/', load_post_data_view, name='posts-data'),
  path('<int:pk>/', post_detail, name='post-detail'),
  path('<int:pk>/update/', update_post, name='post-update'),
  path('<int:pk>/delete/', delete_post, name='post-delete'),
  path('<int:pk>/add-comment/', add_comment, name='add-comment'),
  path('<int:pk>/comments/', load_comments, name='comments'),

  path('<int:pk>/data/', post_detail_data_view, name='post-detail-data'),
]