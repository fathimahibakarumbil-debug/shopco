import React, { useState, useEffect } from "react";

import axios from "axios";

import { useNavigate, useLocation } from "react-router-dom";

import {
  Box,
  Typography,
  Slider,
  Button,
  Divider,
  Card,
  Rating,
  Chip,
  InputBase,
} from "@mui/material";

import {
  Tune as TuneIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Check as CheckIcon,
  MailOutlined as MailOutlineIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";

const colorList = [
  { name: "Green", code: "#00C12B" },

  { name: "Red", code: "#F50606" },

  { name: "Yellow", code: "#F5DD06" },

  { name: "Orange", code: "#F57906" },

  { name: "Blue", code: "#06CAF5" },

  { name: "Dark Blue", code: "#063AF5" },

  { name: "Purple", code: "#7D06F5" },

  { name: "Pink", code: "#F506A4" },

  { name: "White", code: "#FFFFFF" },

  { name: "Black", code: "#000000" },
];

const Shop = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const [products, setProducts] = useState([]);

  const [category, setCategory] = useState("All");

  const [priceRange, setPriceRange] = useState([0, 5000]);

  const [selectedColor, setSelectedColor] = useState(null);

  const [selectedSize, setSelectedSize] = useState("All");

  const [selectedStyle, setSelectedStyle] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 9;

  const [showApply, setShowApply] = useState(true);

  const [showColors, setShowColors] = useState(true);

  const [showSize, setShowSize] = useState(true);

  const [showStyle, setShowStyle] = useState(true);

  const queryParams = new URLSearchParams(location.search);

  const searchQuery = queryParams.get("search") || "";

  const fetchProducts = async () => {
    try {
      let url = "https://shopco-1.onrender.com/api/shop/products/";

      const response = await axios.get(url);

      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else if (response.data && response.data.results) {
        setProducts(response.data.results);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    category,

    priceRange,

    selectedColor,

    selectedSize,

    selectedStyle,

    searchQuery,
  ]);

  const handleCategoryChange = (catItem) => setCategory(catItem);

  const handleStyleChange = (style) => setSelectedStyle(style);

  const filteredProducts = products.filter((product) => {
    if (!product) return false;

    // 1. PRICE FILTER

    const productPrice = parseFloat(product.price || 0);

    const matchesPrice =
      productPrice >= priceRange[0] && productPrice <= priceRange[1];

    // 2. SEARCH FILTER

    let matchesSearch = true;

    if (searchQuery) {
      const nameText = String(product.name || "").toLowerCase();

      const categoryText = String(product.shop_category || "").toLowerCase();

      matchesSearch =
        nameText.includes(searchQuery.toLowerCase()) ||
        categoryText.includes(searchQuery.toLowerCase());
    }

    // 3. CATEGORY FILTER

    let matchesCategory = true;

    if (category && category !== "All") {
      const prodCat = String(product.shop_category || "")
        .toLowerCase()
        .trim();

      const selectedCat = category.toLowerCase().trim();

      if (selectedCat === "t-shirts") {
        matchesCategory = ["t-shirts", "tshirts", "t-shirt", "tshirt"].includes(
          prodCat,
        );
      } else if (selectedCat === "shirts") {
        matchesCategory = ["shirts", "shirt"].includes(prodCat);
      } else if (selectedCat === "shorts") {
        matchesCategory = ["shorts", "short"].includes(prodCat);
      } else if (selectedCat === "hoodie") {
        matchesCategory = ["hoodie", "hoodies"].includes(prodCat);
      } else if (selectedCat === "jeans") {
        matchesCategory = ["jeans", "jean"].includes(prodCat);
      } else {
        matchesCategory = prodCat === selectedCat;
      }
    }

    // 4. COLOR FILTER

    let matchesColor = true;

    if (selectedColor) {
      if (
        product.colors &&
        Array.isArray(product.colors) &&
        product.colors.length > 0
      ) {
        const targetColorObj = colorList.find((c) => c.name === selectedColor);

        const targetHex = targetColorObj
          ? targetColorObj.code.toLowerCase().trim()
          : "";

        matchesColor = product.colors.some((c) => {
          if (!c) return false;

          const cName = String(c.name || "")
            .toLowerCase()
            .trim();

          const cHex = String(c.hex_code || "")
            .toLowerCase()
            .trim();

          return (
            cName.includes(selectedColor.toLowerCase().trim()) ||
            (targetHex && cHex === targetHex)
          );
        });
      } else {
        matchesColor = true;
      }
    }

    // 5. SIZE FILTER

    let matchesSize = true;

    if (selectedSize && selectedSize !== "All") {
      if (
        product.sizes &&
        Array.isArray(product.sizes) &&
        product.sizes.length > 0
      ) {
        matchesSize = product.sizes.some((s) => {
          if (!s) return false;

          const sName = String(s.name || "")
            .toLowerCase()
            .trim();

          return sName === selectedSize.toLowerCase().trim();
        });
      } else {
        matchesSize = true;
      }
    }

    // 6. STYLE FILTER

    let matchesStyle = true;

    if (selectedStyle && selectedStyle !== "All") {
      if (product.dress_style) {
        let prodStyle = "";

        if (typeof product.dress_style === "object") {
          prodStyle = String(product.dress_style.title || "")
            .toLowerCase()
            .trim();
        } else {
          prodStyle = String(product.dress_style).toLowerCase().trim();
        }

        const currentSelectedStyle = selectedStyle.toLowerCase().trim();

        matchesStyle = prodStyle.includes(currentSelectedStyle);
      } else {
        matchesStyle = true;
      }
    }

    return (
      matchesCategory &&
      matchesPrice &&
      matchesColor &&
      matchesSize &&
      matchesStyle &&
      matchesSearch
    );
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;

  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);

      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <Button
          key={i}
          onClick={() => handlePageChange(i)}
          sx={{
            minWidth: "40px",

            height: "40px",

            borderRadius: "8px",

            mx: 0.5,

            bgcolor: currentPage === i ? "rgba(0,0,0,0.06)" : "transparent",

            color: currentPage === i ? "black" : "rgba(0,0,0,0.5)",

            fontWeight: currentPage === i ? 700 : 500,

            textTransform: "none",

            "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
          }}
        >
          {i}
        </Button>,
      );
    }

    return pageNumbers;
  };

  return (
    <Box
      sx={{
        maxWidth: "1280px",
        mx: "auto",
        px: { xs: 2, md: 3 },
        pt: 4,
        pb: 0,
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 4,
          alignItems: "flex-start",
          flexDirection: { xs: "column", md: "row" },
          mb: 8,
        }}
      >
        {/* ================= FILTER SIDEBAR ================= */}

        <Box
          sx={{
            width: { xs: "100%", md: "295px" },
            flexShrink: 0,
            border: "1px solid #E5E5E5",
            borderRadius: "20px",
            p: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography sx={{ fontWeight: 700, fontSize: "20px" }}>
              Filters
            </Typography>

            <TuneIcon sx={{ color: "gray" }} />
          </Box>

          <Divider />

          {/* Categories */}

          <Box sx={{ py: 1 }}>
            {["All", "T-shirts", "Shorts", "Shirts", "Hoodie", "Jeans"].map(
              (item) => (
                <Box
                  key={item}
                  onClick={() => handleCategoryChange(item)}
                  sx={{
                    py: 1,

                    px: 1.5,

                    my: 0.5,

                    display: "flex",

                    justifyContent: "space-between",

                    alignItems: "center",

                    cursor: "pointer",

                    borderRadius: "10px",

                    bgcolor:
                      category === item ? "rgba(0, 0, 0, 0.08)" : "transparent",

                    "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "15px",
                      fontWeight: category === item ? 700 : 400,
                      color: category === item ? "black" : "rgba(0,0,0,0.6)",
                    }}
                  >
                    {item}
                  </Typography>

                  <KeyboardArrowRightIcon
                    sx={{
                      color: category === item ? "black" : "rgba(0,0,0,0.4)",
                    }}
                  />
                </Box>
              ),
            )}
          </Box>

          <Divider />

          {/* Price Filter */}

          <Box sx={{ py: 3 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography fontWeight={700}>Price</Typography>

              <Box
                onClick={() => setShowApply(!showApply)}
                sx={{ cursor: "pointer" }}
              >
                {showApply ? (
                  <KeyboardArrowUpIcon />
                ) : (
                  <KeyboardArrowDownIcon />
                )}
              </Box>
            </Box>

            {showApply && (
              <>
                <Slider
                  value={priceRange}
                  onChange={(e, val) => setPriceRange(val)}
                  min={0}
                  max={5000}
                  sx={{ color: "black" }}
                />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography fontWeight={600}>${priceRange[0]}</Typography>

                  <Typography fontWeight={600}>${priceRange[1]}</Typography>
                </Box>
              </>
            )}
          </Box>

          <Divider />

          {/* Colors Filter */}

          <Box sx={{ py: 3 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography fontWeight={700}>Colors</Typography>

              <Box
                onClick={() => setShowColors(!showColors)}
                sx={{ cursor: "pointer" }}
              >
                {showColors ? (
                  <KeyboardArrowUpIcon />
                ) : (
                  <KeyboardArrowDownIcon />
                )}
              </Box>
            </Box>

            {showColors && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.2 }}>
                {colorList.map((color) => (
                  <Box
                    key={color.name}
                    onClick={() =>
                      setSelectedColor(
                        selectedColor === color.name ? null : color.name,
                      )
                    }
                    sx={{
                      width: 37,

                      height: 37,

                      borderRadius: "50%",

                      bgcolor: color.code,

                      border: "1px solid #ddd",

                      display: "flex",

                      alignItems: "center",

                      justifyContent: "center",

                      cursor: "pointer",

                      boxShadow:
                        selectedColor === color.name
                          ? "0px 0px 8px rgba(0,0,0,0.4)"
                          : "none",
                    }}
                  >
                    {selectedColor === color.name && (
                      <CheckIcon
                        sx={{
                          color: color.code === "#FFFFFF" ? "black" : "white",
                          fontSize: "18px",
                        }}
                      />
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          <Divider />

          {/* Size Filter */}

          <Box sx={{ py: 3 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography fontWeight={700}>Size</Typography>

              <Box
                onClick={() => setShowSize(!showSize)}
                sx={{ cursor: "pointer" }}
              >
                {showSize ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </Box>
            </Box>

            {showSize && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {["All", "Small", "Medium", "Large", "X-Large"].map((size) => (
                  <Chip
                    key={size}
                    label={size}
                    onClick={() => setSelectedSize(size)}
                    sx={{
                      bgcolor: selectedSize === size ? "black" : "#F0F0F0",

                      color: selectedSize === size ? "white" : "black",

                      fontWeight: selectedSize === size ? 700 : 400,

                      cursor: "pointer",

                      "&:hover": {
                        bgcolor: selectedSize === size ? "black" : "#e0e0e0",
                      },
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>

          <Divider />

          {/* Dress Style Filter */}

          <Box sx={{ py: 3 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography fontWeight={700}>Dress Style</Typography>

              <Box
                onClick={() => setShowStyle(!showStyle)}
                sx={{ cursor: "pointer" }}
              >
                {showStyle ? (
                  <KeyboardArrowUpIcon />
                ) : (
                  <KeyboardArrowDownIcon />
                )}
              </Box>
            </Box>

            {showStyle && (
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                {["All", "Casual", "Formal", "Party", "Gym"].map((style) => (
                  <Box
                    key={style}
                    onClick={() => handleStyleChange(style)}
                    sx={{
                      py: 1,

                      px: 1.5,

                      my: 0.5,

                      display: "flex",

                      justifyContent: "space-between",

                      alignItems: "center",

                      cursor: "pointer",

                      borderRadius: "10px",

                      bgcolor:
                        selectedStyle === style
                          ? "rgba(0, 0, 0, 0.08)"
                          : "transparent",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: selectedStyle === style ? 700 : 400,
                        color:
                          selectedStyle === style ? "black" : "rgba(0,0,0,0.6)",
                        fontSize: "15px",
                      }}
                    >
                      {style}
                    </Typography>

                    <KeyboardArrowRightIcon
                      sx={{
                        color:
                          selectedStyle === style ? "black" : "rgba(0,0,0,0.4)",
                      }}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              setCategory("All");

              setSelectedColor(null);

              setSelectedStyle("All");

              setSelectedSize("All");

              setPriceRange([0, 5000]);
            }}
            sx={{
              bgcolor: "black",
              borderRadius: "50px",
              py: 1.5,
              textTransform: "none",
              mt: 2,
              "&:hover": { bgcolor: "#333" },
            }}
          >
            Reset Filters
          </Button>
        </Box>

        {/* ================= PRODUCTS GRID ================= */}

        <Box sx={{ flex: 1, width: "100%" }}>
          <Typography sx={{ fontSize: "32px", fontWeight: 900, mb: 4 }}>
            {searchQuery
              ? `Search Results for "${searchQuery}"`
              : category !== "All"
                ? category
                : "Products"}
          </Typography>

          <Box
            sx={{
              display: "grid",

              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },

              gap: 3,

              mb: 6,
            }}
          >
            {currentItems.map((p) => (
              <Card
                key={p.id}
                onClick={() => navigate(`/product/${p.id}`)}
                sx={{
                  boxShadow: "none",
                  bgcolor: "transparent",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: "280px",
                    bgcolor: "#F0EEED",
                    borderRadius: "20px",
                    overflow: "hidden",
                    mb: 2,
                  }}
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>

                <Box
                  sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
                >
                  <Typography
                    fontWeight={700}
                    fontSize="18px"
                    sx={{
                      height: "54px",

                      overflow: "hidden",

                      textOverflow: "ellipsis",

                      display: "-webkit-box",

                      WebkitLineClamp: 2,

                      WebkitBoxOrient: "vertical",

                      lineHeight: 1.3,

                      mb: 0.5,
                    }}
                  >
                    {p.name}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mt: "auto",
                      mb: 1,
                    }}
                  >
                    <Rating
                      value={parseFloat(p.rating) || 0}
                      precision={0.5}
                      readOnly
                      size="small"
                      sx={{ color: "#FFC633" }}
                    />
                  </Box>

                  <Typography fontWeight={700} fontSize="20px">
                    ${p.price}
                  </Typography>
                </Box>
              </Card>
            ))}
          </Box>

          {filteredProducts.length === 0 && (
            <Typography
              sx={{
                textAlign: "center",
                mt: 10,
                color: "gray",
                mb: 10,
                fontSize: "18px",
              }}
            >
              Sorry, no products found matching your filters.
            </Typography>
          )}

          {filteredProducts.length > 0 && (
            <>
              <Divider sx={{ mb: 3 }} />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 4,
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  sx={{
                    color: "black",

                    borderColor: "#E5E5E5",

                    borderRadius: "8px",

                    textTransform: "none",

                    fontWeight: 600,

                    "&:disabled": {
                      color: "rgba(0,0,0,0.2)",
                      borderColor: "#E5E5E5",
                    },
                  }}
                >
                  Previous
                </Button>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {renderPageNumbers()}
                </Box>

                <Button
                  variant="outlined"
                  endIcon={<ArrowForwardIcon />}
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  sx={{
                    color: "black",

                    borderColor: "#E5E5E5",

                    borderRadius: "8px",

                    textTransform: "none",

                    fontWeight: 600,

                    "&:disabled": {
                      color: "rgba(0,0,0,0.2)",
                      borderColor: "#E5E5E5",
                    },
                  }}
                >
                  Next
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Box>

      {/* =====================================================

      // 🟢 NEWSLETTER BOX

      // ===================================================== */}

      <Box
        sx={{
          bgcolor: "black",

          borderRadius: "20px",

          p: { xs: 4, md: "40px 64px" },

          display: "flex",

          flexDirection: { xs: "column", md: "row" },

          justifyContent: "space-between",

          alignItems: "center",

          gap: { xs: 3, md: 6 },

          mt: 8,

          mb: -6,

          position: "relative",

          zIndex: 2,
        }}
      >
        <Typography
          sx={{
            color: "white",

            fontSize: { xs: "32px", md: "40px" },

            fontWeight: 900,

            lineHeight: { xs: 1.2, md: 1.1 },

            fontFamily: '"Integral CF", sans-serif',

            letterSpacing: "0.5px",

            maxWidth: { xs: "100%", md: "550px" },

            textAlign: { xs: "center", md: "left" },

            textTransform: "uppercase",
          }}
        >
          STAY UP TO DATE ABOUT OUR LATEST OFFERS
        </Typography>

        <Box
          sx={{
            display: "flex",

            flexDirection: "column",

            gap: 1.5,

            width: { xs: "100%", sm: "350px" },
          }}
        >
          {/* Email Input Field */}

          <Box
            sx={{
              bgcolor: "white",

              borderRadius: "62px",

              display: "flex",

              alignItems: "center",

              px: 2.5,

              py: 1.2,

              width: "100%",
            }}
          >
            <MailOutlineIcon
              sx={{ color: "rgba(0, 0, 0, 0.4)", mr: 1.5, fontSize: "22px" }}
            />

            <InputBase
              placeholder="Enter your email address"
              fullWidth
              sx={{
                color: "black",

                fontSize: "16px",

                "& input::placeholder": {
                  color: "rgba(0, 0, 0, 0.4)",

                  opacity: 1,
                },
              }}
            />
          </Box>

          {/* Subscribe Button */}

          <Button
            variant="contained"
            fullWidth
            sx={{
              bgcolor: "white",

              color: "black",

              borderRadius: "62px",

              py: 1.5,

              fontSize: "16px",

              fontWeight: 600,

              textTransform: "none",

              fontFamily: "sans-serif",

              "&:hover": {
                bgcolor: "#f0f0f0",
              },
            }}
          >
            Subscribe to Newsletter
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Shop;
