
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):

    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response(
            {'error': 'Username and password required'},
            status=400
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {'error': 'User already exists'},
            status=400
        )

    user = User.objects.create_user(
        username=username,
        password=password
    )

    token = Token.objects.create(user=user)

    return Response({
        'token': token.key,
        'username': user.username
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):

    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(
        username=username,
        password=password
    )

    if user is None:
        return Response(
            {'error': 'Invalid credentials'},
            status=401
        )

    token, created = Token.objects.get_or_create(user=user)

    return Response({
        'token': token.key,
        'username': user.username
    })