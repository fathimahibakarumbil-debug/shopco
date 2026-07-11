
from django.urls import path
from . import views

urlpatterns = [
    path('products/', views.get_products),
    path('shop/products/', views.get_products),
    path('products/<int:id>/', views.get_product),
    path('dress-styles/', views.dress_styles), 
    path('dress-styles/<int:id>/', views.delete_dress_style), 
]