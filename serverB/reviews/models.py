
from django.db import models

class Review(models.Model):
    product = models.ForeignKey(
        "products.Product",
        on_delete=models.CASCADE,
        related_name="reviews",
        null=True,
        blank=True
    )

    name = models.CharField(max_length=100)
    rating = models.IntegerField(default=5)
    comment = models.TextField()
    verified = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name