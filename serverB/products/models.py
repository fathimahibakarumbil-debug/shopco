
from django.db import models

# =========================================
# 1. PRODUCT COLOR MODEL
# =========================================
class ProductColor(models.Model):
    name = models.CharField(max_length=50, help_text="Example: Red, Blue, White")
    hex_code = models.CharField(max_length=7, help_text="Example: #F50606")

    def __str__(self):
        return self.name


# =========================================
# 2. PRODUCT SIZE MODEL
# =========================================
class ProductSize(models.Model):
  
    SIZE_CHOICES = (
        ("Small", "Small"),
        ("Medium", "Medium"),
        ("Large", "Large"),
        ("X-Large", "X-Large"),
    )
    name = models.CharField(max_length=20, choices=SIZE_CHOICES, unique=True)

    def __str__(self):
        return self.name


# =========================================
# 3. BROWSE BY DRESS STYLE MODEL
# =========================================
class DressStyle(models.Model):
    title = models.CharField(max_length=100)
    image = models.URLField()

    def __str__(self):
        return self.title


# =========================================
# 4. MAIN PRODUCT MODEL
# =========================================
class Product(models.Model):
    CATEGORY_CHOICES = (
        ("new_arrival", "New Arrival"),
        ("top_selling", "Top Selling"),
        ("shop", "Shop Only"), 
    )
    
    SHOP_CATEGORY_CHOICES = (
        ("T-shirts", "T-shirts"),
        ("Shirts", "Shirts"),
        ("Jeans", "Jeans"),
        ("Shorts", "Shorts"),
        ("Hoodie", "Hoodie"),
        ("Jackets", "Jackets"),      
        ("Dresses", "Dresses"),      
        ("Tops", "Tops"),            
        ("Activewear", "Activewear"),
        ("Blazers", "Blazers"),      
    )

    name = models.CharField(max_length=255)
    price = models.IntegerField()
    old_price = models.IntegerField(null=True, blank=True)
    image = models.URLField()
    rating = models.FloatField(default=4.5)
    description = models.TextField(blank=True, null=True)

  
    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        default="new_arrival"
    )
    
    
    shop_category = models.CharField(
        max_length=50,
        choices=SHOP_CATEGORY_CHOICES,
        default="T-shirts"
    )

    colors = models.ManyToManyField(ProductColor, blank=True)
    sizes = models.ManyToManyField(ProductSize, blank=True)

    dress_style = models.ForeignKey(
        DressStyle, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True
    )

    show_in_related = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name