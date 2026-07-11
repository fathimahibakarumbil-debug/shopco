import React, { useEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "./ProductCard";
import { fetchAllProducts } from "../redux/cartSlice";

const ProductsGrid = ({ type, limit }) => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.cart.products) || [];
  const status = useSelector((state) => state.cart.status);

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  const filteredProducts = products.filter((item) => {
    if (type === "new") return item.category === "new_arrival";
    if (type === "top") return item.category === "top_selling";
    return false;
  });

  const finalProducts = limit
    ? filteredProducts.slice(0, limit)
    : filteredProducts;

  if (status === "loading") {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <Typography align="center" sx={{ py: 5 }}>
        No products found
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "repeat(2, 1fr)",
          sm: "repeat(2, 1fr)",
          md: "repeat(4, 1fr)",
        },
        gap: { xs: 2, md: 3 },
        width: "100%",
        maxWidth: "1240px",
        mx: "auto",
        mb: 5,
      }}
    >
      {finalProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </Box>
  );
};

export default ProductsGrid;
