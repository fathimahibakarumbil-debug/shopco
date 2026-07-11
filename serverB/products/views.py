
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q  

from .models import Product, DressStyle
from .serializers import ProductSerializer, DressStyleSerializer


def filter_products_queryset(request):
    category = request.GET.get('category')
    shop_category = request.GET.get('shop_category') 
    style = request.GET.get('style') or request.GET.get('dress_style') or request.GET.get('dress-style')                 
    color = request.GET.get('color') or request.GET.get('colors') or request.GET.get('color[]') or request.GET.get('colors[]')                
    size = request.GET.get('size') or request.GET.get('sizes') or request.GET.get('size[]') or request.GET.get('sizes[]')                  
    limit = request.GET.get('limit')
    exclude = request.GET.get('exclude')
    related_only = request.GET.get('related_only')

    products = Product.objects.all().order_by('-created_at', '-id')

    # 1. CATEGORY FILTER
    if category and str(category).lower() != 'all' and str(category).lower() != 'shop':
        products = products.filter(category__iexact=category)

    # 2. SHOP CATEGORY FILTER
    if shop_category and str(shop_category).lower() != 'all':
        sc_lower = str(shop_category).lower().strip()
        
        if sc_lower in ['t-shirts', 'tshirts', 't-shirt', 'tshirt', 't_shart', 'tishart', 'tishert']:
            products = products.filter(
                Q(shop_category__icontains="t-shirt") |
                Q(shop_category__icontains="t_shirt") |
                Q(shop_category__icontains="tshirt")
            )
        elif sc_lower in ['shirts', 'shirt']:
            products = products.filter(
                Q(shop_category__icontains="shirt")
            ).exclude(
                Q(shop_category__icontains="t-shirt") |
                Q(shop_category__icontains="t_shirt") |
                Q(shop_category__icontains="tshirt")
            )
        elif sc_lower in ['shorts', 'short']:
            products = products.filter(shop_category__icontains="short")
        elif sc_lower in ['hoodie', 'hoodies']:
            products = products.filter(shop_category__icontains="hoodie")
        elif sc_lower in ['jeans', 'jean']:
            products = products.filter(shop_category__icontains="jean")
        else:
            products = products.filter(shop_category__iexact=shop_category)

    # 3. DRESS STYLE FILTER
    if style and str(style).lower() != 'all':
        products = products.filter(dress_style__title__iexact=style)

    # 4. COLOR FILTER
    if color and str(color).lower() != 'all':
        products = products.filter(
            Q(colors__hex_code__iexact=color) | 
            Q(colors__name__iexact=color) |
            Q(colors__hex_code__icontains=color) |
            Q(colors__name__icontains=color)
        )

    # 5. SIZE FILTER
    if size and str(size).lower() != 'all':
        products = products.filter(sizes__name__iexact=size)

    # 6. RELATED PRODUCTS FILTER
    if related_only == 'true':
        products = products.filter(show_in_related=True)

    # 7. EXCLUDE
    if exclude:
        try:
            products = products.exclude(id=int(exclude))
        except ValueError:
            pass

    products = products.distinct()

    # 8. LIMIT
    if limit:
        try:
            products = products[:int(limit)]
        except ValueError:
            pass

    return products


# =====================================================
# 1. PRODUCTS - GET (/api/products/) & POST
# =====================================================
@api_view(['GET', 'POST'])
def get_products(request):
    if request.method == 'GET':
        products = filter_products_queryset(request)
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =====================================================
# 2. SHOP PRODUCTS - GET (/api/shop/products/)
# =====================================================
@api_view(['GET'])
def shop_products(request):
    if request.method == 'GET':
        products = filter_products_queryset(request)
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)


# =====================================================
# SINGLE PRODUCT - GET / PUT / DELETE
# =====================================================
@api_view(['GET', 'PUT', 'DELETE'])
def get_product(request, id):
    try:
        product = Product.objects.get(id=id)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ProductSerializer(product)
        related_products = Product.objects.filter(show_in_related=True).exclude(id=id).order_by('-created_at', '-id')[:4]
        related_serializer = ProductSerializer(related_products, many=True)
        data = serializer.data
        data['related_products'] = related_serializer.data
        return Response(data)

    elif request.method == 'PUT':
        serializer = ProductSerializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        product.delete()
        return Response({"message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


# =====================================================
# DRESS STYLES - GET / POST 
# =====================================================
@api_view(['GET', 'POST'])
def dress_styles(request):
    if request.method == 'GET':
        styles = DressStyle.objects.all()
        serializer = DressStyleSerializer(styles, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = DressStyleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =====================================================
# DRESS STYLES - DELETE
# =====================================================
@api_view(['DELETE'])
def delete_dress_style(request, id):
    try:
        style = DressStyle.objects.get(id=id)
        style.delete()
        return Response({"message": "Dress style deleted successfully"}, status=status.HTTP_200_OK)
    except DressStyle.DoesNotExist:
        return Response({"error": "Dress style not found"}, status=status.HTTP_404_NOT_FOUND)