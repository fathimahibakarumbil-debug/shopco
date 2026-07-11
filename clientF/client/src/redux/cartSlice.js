import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { getProducts } from "../services/api";

// ======================================================
// FETCH PRODUCTS
// ======================================================

export const fetchAllProducts = createAsyncThunk(
  "products/fetchAllProducts",

  async () => {
    const response = await getProducts();

    return response;
  },
);

// ======================================================
// SLICE
// ======================================================

const cartSlice = createSlice({
  name: "cart",

  initialState: {
    products: [],

    cartItems: [],

    status: "idle",
  },

  reducers: {
    // ======================================================
    // ADD TO CART
    // ======================================================

    addToCart: (state, action) => {
      const item = action.payload;

      const existingItem = state.cartItems.find(
        (product) =>
          product.id === item.id &&
          product.size === item.size &&
          product.color === item.color,
      );

      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        state.cartItems.push({
          ...item,
        });
      }
    },

    // ======================================================
    // REMOVE FROM CART
    // ======================================================

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== action.payload,
      );
    },

    // ======================================================
    // UPDATE QUANTITY
    // ======================================================

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find((product) => product.id === id);

      if (item && quantity >= 1) {
        item.quantity = quantity;
      }
    },
  },

  // ======================================================
  // EXTRA REDUCERS
  // ======================================================

  extraReducers: (builder) => {
    builder

      .addCase(
        fetchAllProducts.pending,

        (state) => {
          state.status = "loading";
        },
      )

      .addCase(
        fetchAllProducts.fulfilled,

        (state, action) => {
          state.products = action.payload;

          state.status = "success";
        },
      )

      .addCase(
        fetchAllProducts.rejected,

        (state) => {
          state.status = "failed";
        },
      );
  },
});

// ======================================================
// EXPORTS
// ======================================================

export const { addToCart, removeFromCart, updateQuantity } = cartSlice.actions;

export default cartSlice.reducer;
