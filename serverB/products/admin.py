
from django.contrib import admin
from .models import Product, ProductColor, ProductSize, DressStyle

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'price', 'category', 'shop_category', 'created_at']
    search_fields = ['name', 'shop_category']
    list_filter = ['category', 'shop_category']
    filter_horizontal = ['colors', 'sizes']

@admin.register(ProductColor)
class ProductColorAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'hex_code']

@admin.register(ProductSize)
class ProductSizeAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']

@admin.register(DressStyle)
class DressStyleAdmin(admin.ModelAdmin):
    list_display = ['id', 'title']