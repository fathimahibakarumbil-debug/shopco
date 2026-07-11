
from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from .models import Review
from .serializers import ReviewSerializer


# GET ALL + CREATE REVIEW
class ReviewListCreateView(ListCreateAPIView):
    serializer_class = ReviewSerializer

    def get_queryset(self):
        return Review.objects.all().order_by("-created_at")


#  GET ONE + UPDATE + DELETE REVIEW
class ReviewDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer