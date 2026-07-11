import React from "react";
import { Box, Typography, Rating } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const title = product?.name || "Product";
  const image = product?.image || "https://via.placeholder.com/300x400";
  const price = product?.price || 0;
  const oldPrice = product?.old_price || null;
  const rating = Number(product?.rating) || 4;

  const discountPercent =
    oldPrice && oldPrice > price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : 0;

  return (
    <Box
      onClick={() => navigate(`/product/${product?.id}`)}
      sx={{
        width: "100%",
        cursor: "pointer",
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* IMAGE BOX - Updated for perfect fit */}
      <Box
        sx={{
          width: "100%",
          aspectRatio: "1 / 1.1",
          bgcolor: "#F0EEED",
          borderRadius: "20px",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
          "&:hover img": {
            transform: "scale(1.05)",
          },
        }}
      >
        <img
          src={image}
          alt={title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "0.4s ease",
          }}
        />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <Typography
          sx={{
            fontSize: { xs: "16px", md: "20px" },
            fontWeight: 700,
            mb: 0.5,
            height: { xs: "44px", md: "56px" },
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            lineHeight: 1.3,
          }}
        >
          {title}
        </Typography>

        {/* RATING */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 1,
            mt: "auto",
          }}
        >
          <Rating
            value={rating}
            precision={0.5}
            readOnly
            size="small"
            sx={{ color: "#FFC633" }}
          />
          <Typography sx={{ fontSize: "14px" }}>{rating}/5</Typography>
        </Box>

        {/* PRICE */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <Typography
            sx={{ fontSize: { xs: "20px", md: "24px" }, fontWeight: 700 }}
          >
            ${price}
          </Typography>

          {oldPrice && (
            <>
              <Typography
                sx={{
                  fontSize: { xs: "18px", md: "22px" },
                  fontWeight: 700,
                  color: "rgba(0,0,0,0.4)",
                  textDecoration: "line-through",
                }}
              >
                ${oldPrice}
              </Typography>

              {discountPercent > 0 && (
                <Box
                  sx={{
                    bgcolor: "rgba(255,51,51,0.1)",
                    color: "#FF3333",
                    px: 1,
                    py: 0.2,
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  -{discountPercent}%
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ProductCard;
