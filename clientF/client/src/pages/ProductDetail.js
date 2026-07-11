import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Rating,
  Divider,
  Chip,
  IconButton,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Menu,
  MenuItem,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  getProduct,
  getProductReviews,
  getRelatedProducts,
} from "../services/api";
import { addToCart } from "../redux/cartSlice";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import TuneIcon from "@mui/icons-material/Tune";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CheckIcon from "@mui/icons-material/Check";
import ReviewCard from "../components/ReviewCard";

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [visibleReviews, setVisibleReviews] = useState(6);

  const [sortBy, setSortBy] = useState("Latest");
  const [filterRating, setFilterRating] = useState("All");
  const [anchorElSort, setAnchorElSort] = useState(null);
  const [anchorElFilter, setAnchorElFilter] = useState(null);

  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
    user: "You",
  });

  const colors = ["#4F4631", "#314F4A", "#31344F", "#000000", "#FF3333"];
  const sizes = ["Small", "Medium", "Large", "X-Large"];

  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedSize, setSelectedSize] = useState("Large");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await getProduct(id);
        setProduct(productRes.data);

        if (productRes.data && colors.length > 0) {
          setSelectedColor(colors[0]);
        }

        try {
          const relatedRes = await getRelatedProducts(id);
          setRelatedProducts(relatedRes.data);
        } catch (err) {
          console.log("Error fetching related products:", err);
        }

        const reviewsData = await getProductReviews(id);
        const savedLocalReviews = localStorage.getItem(`local_reviews_${id}`);
        const localParsed = savedLocalReviews
          ? JSON.parse(savedLocalReviews)
          : [];

        setReviews([...localParsed, ...reviewsData]);
        setVisibleReviews(6);
      } catch (err) {
        console.log("Error fetching product details:", err);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  const processedReviews = useMemo(() => {
    let result = [...reviews];
    if (filterRating !== "All") {
      result = result.filter(
        (r) => Math.floor(r.rating) === Number(filterRating),
      );
    }
    if (sortBy === "Latest") {
      result.sort(
        (a, b) => new Date(b.date || b.id) - new Date(a.date || a.id),
      );
    } else if (sortBy === "Oldest") {
      result.sort(
        (a, b) => new Date(a.date || a.id) - new Date(b.date || b.id),
      );
    } else if (sortBy === "Highest Rating") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "Lowest Rating") {
      result.sort((a, b) => (a.rating || 0) - (b.rating || 0));
    }
    return result;
  }, [reviews, sortBy, filterRating]);

  const handleSortOpen = (event) => setAnchorElSort(event.currentTarget);
  const handleSortClose = (sortOption) => {
    if (sortOption) setSortBy(sortOption);
    setAnchorElSort(null);
  };

  const handleFilterOpen = (event) => setAnchorElFilter(event.currentTarget);
  const handleFilterClose = (ratingOption) => {
    if (ratingOption !== undefined) setFilterRating(ratingOption);
    setAnchorElFilter(null);
  };

  const handleAddToCart = () => {
    if (product) {
      dispatch(
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
          color: selectedColor,
          size: selectedSize,
        }),
      );
      alert(`${product.name} added to cart!`);
    }
  };

  const handleSubmitReview = () => {
    if (newReview.comment.trim() === "") {
      alert("Please write a comment!");
      return;
    }
    const reviewData = {
      id: Date.now(),
      rating: newReview.rating,
      comment: newReview.comment,
      name: newReview.user,
      date: new Date().toISOString(),
    };
    const updatedReviews = [reviewData, ...reviews];
    setReviews(updatedReviews);
    const currentLocalReviews = JSON.parse(
      localStorage.getItem(`local_reviews_${id}`) || "[]",
    );
    localStorage.setItem(
      `local_reviews_${id}`,
      JSON.stringify([reviewData, ...currentLocalReviews]),
    );
    setOpenReviewModal(false);
    setNewReview({ rating: 5, comment: "", user: "You" });
  };

  if (!product) {
    return <Typography sx={{ p: 5 }}>Loading...</Typography>;
  }

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 4, md: 8 },
        py: 5,
        maxWidth: "1440px",
        mx: "auto",
      }}
    >
      {/* --- TOP SECTION --- */}
      <Box
        sx={{
          display: "flex",
          gap: { xs: 3, md: 5 },
          flexDirection: { xs: "column", md: "row" },
          alignItems: "stretch",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flex: 1.2,
            minWidth: { xs: "100%", md: 400 },
          }}
        >
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              flexDirection: "column",
              gap: 2,
            }}
          >
            {[1, 2, 3].map((_, index) => (
              <Box
                key={index}
                component="img"
                src={product.image}
                alt={product.name}
                sx={{
                  width: { sm: 100, md: 120 },
                  height: { sm: 120, md: 150 },
                  borderRadius: 4,
                  objectFit: "cover",
                  backgroundColor: "#F0EEED",
                  border: index === 0 ? "1px solid black" : "none",
                  cursor: "pointer",
                }}
              />
            ))}
          </Box>
          <Box
            sx={{
              flex: 1,
              backgroundColor: "#F0EEED",
              borderRadius: 5,
              overflow: "hidden",
              display: "flex",
            }}
          >
            <Box
              component="img"
              src={product.image}
              alt={product.name}
              sx={{
                width: "100%",
                height: "auto",
                maxHeight: { md: "600px" },
                objectFit: "cover",
              }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              textTransform: "uppercase",
              fontSize: { xs: "2rem", md: "3rem" },
              lineHeight: 1,
            }}
          >
            {product.name}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1.5 }}>
            <Rating
              value={Number(product.rating) || 0}
              precision={0.5}
              readOnly
              size="small"
              sx={{ color: "#FFC633" }}
            />
            <Typography variant="body2">{product.rating || 0}/5</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2.5 }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              ${product.price}
            </Typography>
            {product.old_price && (
              <Typography
                variant="h4"
                sx={{
                  color: "rgba(0,0,0,0.3)",
                  textDecoration: "line-through",
                  fontWeight: 700,
                }}
              >
                ${product.old_price}
              </Typography>
            )}
            <Chip
              label="-40%"
              size="small"
              sx={{
                bgcolor: "rgba(255,51,51,0.1)",
                color: "#FF3333",
                fontWeight: "bold",
                px: 1,
              }}
            />
          </Box>
          <Typography
            sx={{
              mt: 2,
              color: "rgba(0,0,0,0.6)",
              lineHeight: 1.6,
              fontSize: "1rem",
            }}
          >
            {product.description ||
              "Premium quality product crafted for comfort and style."}
          </Typography>
          <Divider sx={{ my: 3 }} />
          <Typography sx={{ color: "rgba(0,0,0,0.6)", mb: 1.5 }}>
            Select Colors
          </Typography>
          <Box sx={{ display: "flex", gap: 1.5, mb: 3 }}>
            {colors.map((color) => (
              <Box
                key={color}
                onClick={() => setSelectedColor(color)}
                sx={{
                  width: 37,
                  height: 37,
                  borderRadius: "50%",
                  bgcolor: color,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border:
                    selectedColor === color
                      ? "2px solid #000"
                      : "1px solid rgba(0,0,0,0.1)",
                }}
              >
                {selectedColor === color && (
                  <CheckIcon sx={{ color: "white", fontSize: 18 }} />
                )}
              </Box>
            ))}
          </Box>
          <Divider sx={{ my: 3 }} />
          <Typography sx={{ color: "rgba(0,0,0,0.6)", mb: 1.5 }}>
            Choose Size
          </Typography>
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", mb: 4 }}>
            {sizes.map((size) => (
              <Button
                key={size}
                variant="contained"
                onClick={() => setSelectedSize(size)}
                sx={{
                  bgcolor: selectedSize === size ? "black" : "#F0EEED",
                  color: selectedSize === size ? "white" : "rgba(0,0,0,0.6)",
                  borderRadius: 10,
                  textTransform: "none",
                  boxShadow: "none",
                  px: 3.5,
                  py: 1.2,
                  "&:hover": {
                    bgcolor: selectedSize === size ? "#222" : "#E7E7E7",
                    boxShadow: "none",
                  },
                }}
              >
                {size}
              </Button>
            ))}
          </Box>
          <Divider sx={{ my: 4 }} />
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: "#F0EEED",
                borderRadius: 10,
                px: 2,
              }}
            >
              <IconButton
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <RemoveIcon />
              </IconButton>
              <Typography sx={{ mx: 2, fontWeight: "bold" }}>
                {quantity}
              </Typography>
              <IconButton onClick={() => setQuantity((q) => q + 1)}>
                <AddIcon />
              </IconButton>
            </Box>
            <Button
              variant="contained"
              fullWidth
              onClick={handleAddToCart}
              sx={{
                bgcolor: "black",
                borderRadius: 10,
                py: 1.8,
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1rem",
                "&:hover": { bgcolor: "#222" },
              }}
            >
              Add to Cart
            </Button>
          </Box>
        </Box>
      </Box>

      {/* --- REVIEW SECTION --- */}
      <Box sx={{ mt: 10, width: "100%", maxWidth: "1280px", mx: "auto" }}>
        <Box
          sx={{
            display: "flex",
            borderBottom: "1px solid rgba(0,0,0,0.1)",
            mb: 5,
          }}
        >
          {["Product Details", "Rating & Reviews", "FAQs"].map((tab) => (
            <Box
              key={tab}
              sx={{
                flex: 1,
                textAlign: "center",
                pb: 2,
                cursor: "pointer",
                borderBottom:
                  tab === "Rating & Reviews" ? "2px solid black" : "none",
                color:
                  tab === "Rating & Reviews" ? "black" : "rgba(0,0,0,0.45)",
                fontWeight: tab === "Rating & Reviews" ? 600 : 400,
              }}
            >
              <Typography sx={{ fontSize: { xs: "0.9rem", md: "1.1rem" } }}>
                {tab}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
            mb: 4,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
            <Typography
              sx={{ fontWeight: 700, fontSize: { xs: "1.7rem", md: "2rem" } }}
            >
              All Reviews
            </Typography>
            <Typography sx={{ color: "rgba(0,0,0,0.4)" }}>
              ({processedReviews.length})
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              onClick={handleFilterOpen}
              sx={{ bgcolor: "#F0EEED", width: 48, height: 48 }}
            >
              <TuneIcon />
            </IconButton>
            <Menu
              anchorEl={anchorElFilter}
              open={Boolean(anchorElFilter)}
              onClose={() => handleFilterClose()}
            >
              <MenuItem onClick={() => handleFilterClose("All")}>
                All Ratings
              </MenuItem>
              <MenuItem onClick={() => handleFilterClose("5")}>
                5 Stars Only
              </MenuItem>
              <MenuItem onClick={() => handleFilterClose("4")}>
                4 Stars Only
              </MenuItem>
              <MenuItem onClick={() => handleFilterClose("3")}>
                3 Stars Only
              </MenuItem>
              <MenuItem onClick={() => handleFilterClose("2")}>
                2 Stars Only
              </MenuItem>
              <MenuItem onClick={() => handleFilterClose("1")}>
                1 Stars Only
              </MenuItem>
            </Menu>
            <Button
              variant="contained"
              endIcon={<ArrowDropDownIcon />}
              onClick={handleSortOpen}
              sx={{
                bgcolor: "#F0EEED",
                color: "black",
                borderRadius: 10,
                textTransform: "none",
                px: 3,
                py: 1.2,
                boxShadow: "none",
              }}
            >
              {sortBy}
            </Button>
            <Menu
              anchorEl={anchorElSort}
              open={Boolean(anchorElSort)}
              onClose={() => handleSortClose()}
            >
              <MenuItem onClick={() => handleSortClose("Latest")}>
                Latest
              </MenuItem>
              <MenuItem onClick={() => handleSortClose("Oldest")}>
                Oldest
              </MenuItem>
              <MenuItem onClick={() => handleSortClose("Highest Rating")}>
                Highest Rating
              </MenuItem>
              <MenuItem onClick={() => handleSortClose("Lowest Rating")}>
                Lowest Rating
              </MenuItem>
              k
            </Menu>
            <Button
              variant="contained"
              onClick={() => setOpenReviewModal(true)}
              sx={{
                bgcolor: "black",
                borderRadius: 10,
                textTransform: "none",
                px: 4,
                py: 1.2,
              }}
            >
              Write a Review
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
            gap: "20px",
          }}
        >
          {processedReviews.length > 0 ? (
            processedReviews
              .slice(0, visibleReviews)
              .map((review) => <ReviewCard key={review.id} review={review} />)
          ) : (
            <Typography
              sx={{
                gridColumn: "1 / -1",
                textAlign: "center",
                color: "rgba(0,0,0,0.5)",
                py: 4,
              }}
            >
              No reviews found for this selection.
            </Typography>
          )}
        </Box>

        {visibleReviews < processedReviews.length && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
            <Button
              variant="outlined"
              onClick={() => setVisibleReviews((prev) => prev + 6)}
              sx={{
                borderColor: "rgba(0,0,0,0.1)",
                color: "black",
                borderRadius: 10,
                px: 5,
                py: 1.3,
                textTransform: "none",
                fontWeight: 600,
                "&:hover": {
                  bgcolor: "#f5f5f5",
                  borderColor: "rgba(0,0,0,0.2)",
                },
              }}
            >
              Load More Reviews
            </Button>
          </Box>
        )}
      </Box>

      {/* --- YOU MIGHT ALSO LIKE SECTION (Dynamic) --- */}
      <Box
        sx={{
          mt: 12,
          width: "100%",
          maxWidth: "1280px",
          mx: "auto",
          px: { xs: 1, sm: 0 },
        }}
      >
        <Typography
          sx={{
            fontWeight: 900,
            textAlign: "center",
            textTransform: "uppercase",
            mb: 5,
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            letterSpacing: "-0.02em",
          }}
        >
          You Might Also Like
        </Typography>
        <Grid
          container
          spacing={3}
          sx={{ flexWrap: "nowrap", overflowX: "auto", pb: 1 }}
        >
          {relatedProducts.length > 0 ? (
            relatedProducts.map((item) => (
              <Grid
                item
                key={item.id}
                sx={{ width: { xs: "220px", md: "25%" }, flexShrink: 0 }}
              >
                <Box
                  sx={{ cursor: "pointer" }}
                  onClick={() => navigate(`/product/${item.id}`)}
                >
                  <Box
                    sx={{
                      width: "100%",
                      aspectRatio: "1 / 1.1",
                      backgroundColor: "#F0EEED",
                      borderRadius: "20px",
                      overflow: "hidden",
                      mb: 2,
                    }}
                  >
                    <Box
                      component="img"
                      src={item.image}
                      alt={item.name}
                      sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: "0.85rem", md: "1rem" },
                      mb: 0.5,
                    }}
                  >
                    {item.name}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: { xs: "1rem", md: "1.25rem" },
                      }}
                    >
                      ${item.price}
                    </Typography>
                    {item.old_price && (
                      <Typography
                        sx={{
                          color: "rgba(0,0,0,0.4)",
                          textDecoration: "line-through",
                          fontWeight: 700,
                        }}
                      >
                        ${item.old_price}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Grid>
            ))
          ) : (
            <Typography
              sx={{ textAlign: "center", width: "100%", py: 4, color: "gray" }}
            >
              No similar products found.
            </Typography>
          )}
        </Grid>

        {/* --- NEWSLETTER --- */}
        <Box
          sx={{
            mt: 8,
            bgcolor: "#000",
            borderRadius: "20px",
            px: { xs: 3, md: 6 },
            py: { xs: 4, md: 5 },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Typography
            sx={{
              color: "#fff",
              fontWeight: 900,
              textTransform: "uppercase",
              lineHeight: 1.1,
              fontSize: { xs: "1.6rem", md: "2.5rem" },
              maxWidth: "600px",
            }}
          >
            Stay Up To Date About Our Latest Offers
          </Typography>
          <Box
            sx={{
              width: "100%",
              maxWidth: 350,
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            <Box
              component="input"
              placeholder="Enter your email address"
              sx={{
                width: "100%",
                height: 48,
                borderRadius: "999px",
                border: "none",
                outline: "none",
                px: 3,
                fontSize: "0.95rem",
                boxSizing: "border-box",
              }}
            />
            <Button
              fullWidth
              variant="contained"
              sx={{
                bgcolor: "#fff",
                color: "#000",
                borderRadius: "999px",
                py: 1.4,
                fontWeight: 600,
                textTransform: "none",
                boxShadow: "none",
                "&:hover": { bgcolor: "#f5f5f5" },
              }}
            >
              Subscribe to Newsletter
            </Button>
          </Box>
        </Box>
      </Box>

      {/* --- MODAL --- */}
      <Dialog
        open={openReviewModal}
        onClose={() => setOpenReviewModal(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Write a Review</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
            <Box>
              <Typography sx={{ mb: 1, fontWeight: 600 }}>
                Overall Rating
              </Typography>
              <Rating
                size="large"
                value={newReview.rating}
                onChange={(e, val) =>
                  setNewReview({ ...newReview, rating: val })
                }
              />
            </Box>
            <TextField
              label="Review Comment"
              multiline
              rows={4}
              fullWidth
              placeholder="What did you like or dislike?"
              value={newReview.comment}
              onChange={(e) =>
                setNewReview({ ...newReview, comment: e.target.value })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setOpenReviewModal(false)}
            sx={{ color: "gray", textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitReview}
            sx={{
              bgcolor: "black",
              borderRadius: 10,
              px: 4,
              textTransform: "none",
              "&:hover": { bgcolor: "#333" },
            }}
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
