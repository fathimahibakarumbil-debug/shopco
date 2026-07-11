from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

from .models import Order, OrderItem
from .serializers import OrderSerializer

from products.models import Product


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):

    cart_items = request.data.get('items', [])

    order = Order.objects.create(
        user=request.user,
        total_price=request.data.get('total')
    )

    for item in cart_items:

        product = Product.objects.get(
            id=item['id']
        )

        OrderItem.objects.create(
            order=order,
            product=product,
            quantity=item['quantity']
        )

    return Response({
        'message': 'Order placed successfully'
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_orders(request):

    orders = Order.objects.filter(
        user=request.user
    )

    serializer = OrderSerializer(
        orders,
        many=True
    )

    return Response(serializer.data)