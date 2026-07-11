import axios from "axios";

// ==============================================
// BASE URL
// ==============================================
const API_BASE_URL = "http://127.0.0.1:8000/api/";

// ==============================================
// AXIOS INSTANCE
// ==============================================
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ==============================================
// AUTO TOKEN ATTACH
// ==============================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ==============================================
// AUTH APIs
// ==============================================

// Register
export const registerUser = async (userData) => {
  const response = await api.post("auth/register/", userData);

  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }

  return response;
};

// Login
export const loginUser = async (credentials) => {
  const response = await api.post("auth/login/", credentials);

  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }

  return response;
};

// ==============================================
// PRODUCTS APIs
// ==============================================

// GET PRODUCTS
export const getProducts = async (category = "") => {
  try {
    let url = "products/";

    if (category && category !== "All") {
      url += `?category=${category}`;
    }

    const response = await api.get(url);

    console.log("Products API Response:", response.data);

    if (Array.isArray(response.data)) return response.data;
    if (response.data.results && Array.isArray(response.data.results))
      return response.data.results;
    if (response.data.products && Array.isArray(response.data.products))
      return response.data.products;
    if (response.data.data && Array.isArray(response.data.data))
      return response.data.data;

    return [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// GET RELATED PRODUCTS
export const getRelatedProducts = async (id) => {
  try {
    const response = await api.get("products/");
    let allItems = [];

    if (Array.isArray(response.data)) {
      allItems = response.data;
    } else if (Array.isArray(response.data.results)) {
      allItems = response.data.results;
    }

    const filtered = allItems
      .filter((item) => item.id !== Number(id))
      .slice(0, 4);

    return { data: filtered };
  } catch (error) {
    console.error("Error fetching related products:", error);
    return { data: [] };
  }
};

// GET NEW ARRIVALS
export const getNewArrivals = async () => {
  try {
    const response = await api.get("products/?category=new_arrival");
    return Array.isArray(response.data)
      ? response.data
      : response.data.results || [];
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    return [];
  }
};

// GET TOP SELLING
export const getTopSelling = async () => {
  try {
    const response = await api.get("products/?category=top_selling");
    return Array.isArray(response.data)
      ? response.data
      : response.data.results || [];
  } catch (error) {
    console.error("Error fetching top selling:", error);
    return [];
  }
};

export const getShopProducts = async (filters = {}) => {
  try {
    const response = await api.get("products/", {
      params: {
        category: "shop",
        ...filters,
      },
    });

    return Array.isArray(response.data)
      ? response.data
      : response.data.results || [];
  } catch (error) {
    console.error("Error fetching shop products:", error);
    return [];
  }
};

// GET SINGLE PRODUCT
export const getProduct = async (id) => {
  try {
    const response = await api.get(`products/${id}/`);
    return { data: response.data };
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

// ADD PRODUCT
export const addProduct = async (data) => {
  const response = await api.post("products/", data);
  return response.data;
};

// UPDATE PRODUCT
export const updateProduct = async (id, data) => {
  const response = await api.put(`products/${id}/`, data);
  return response.data;
};

// DELETE PRODUCT
export const deleteProduct = async (id) => {
  const response = await api.delete(`products/${id}/`);
  return response.data;
};

// DRESS STYLES APIs
export const getDressStyles = async () => {
  try {
    const response = await api.get("dress-styles/");
    if (Array.isArray(response.data)) return response.data;
    return response.data.results || response.data.styles || [];
  } catch (error) {
    console.error("Error fetching dress styles:", error);
    return [];
  }
};

// REVIEWS APIs
export const getReviews = async () => {
  try {
    const response = await api.get("reviews/");
    return Array.isArray(response.data)
      ? response.data
      : response.data.results || [];
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
};

// GET PRODUCT REVIEWS
export const getProductReviews = async (productId) => {
  try {
    const response = await api.get(`reviews/?product=${productId}`);
    return Array.isArray(response.data)
      ? response.data
      : response.data.results || [];
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    return [];
  }
};

// ADD REVIEW
export const addReview = async (data) => {
  const response = await api.post("reviews/", data);
  return response.data;
};

export default api;
