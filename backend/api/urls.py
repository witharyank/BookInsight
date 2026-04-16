from django.urls import path
from . import views

urlpatterns = [
    path('books/', views.BookList.as_view(), name='book-list'),
    path('books/<int:pk>/', views.BookDetail.as_view(), name='book-detail'),
    path('recommend/<int:pk>/', views.recommend_books, name='book-recommend'),
    path('upload/', views.upload_books, name='book-upload'),
    path('ask/', views.ask_question, name='book-ask'),
]
