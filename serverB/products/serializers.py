
from rest_framework import serializers
from .models import Product, ProductColor, ProductSize, DressStyle

class ProductColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductColor
        fields = '__all__'

class ProductSizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSize
        fields = '__all__'

class DressStyleSerializer(serializers.ModelSerializer):
    class Meta:
        model = DressStyle
        fields = '__all__'

# =========================================
# MAIN PRODUCT SERIALIZER
# =========================================
class ProductSerializer(serializers.ModelSerializer):
    colors = serializers.PrimaryKeyRelatedField(queryset=ProductColor.objects.all(), many=True)
    sizes = serializers.PrimaryKeyRelatedField(queryset=ProductSize.objects.all(), many=True)
    dress_style = serializers.PrimaryKeyRelatedField(queryset=DressStyle.objects.all(), allow_null=True, required=False)

    class Meta:
        model = Product
        fields = '__all__'