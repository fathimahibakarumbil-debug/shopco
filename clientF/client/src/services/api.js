import axios from "axios";

// ==============================================
// BASE URL
// ==============================================

// Local Development
// const API_BASE_URL = "http://127.0.0.1:8000/api/";

// Render Production
const API_BASE_URL = "https://shopco-1.onrender.com/api/";

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
  (error) => Promise.reject(error)
);

// ==============================================
// AUTH APIs
// ==============================================

export const registerUser = async (userData) => {
  const response = await api.post("auth/register/", userData);

  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }

  return response;
};

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

export const getProducts = async (category = "") => {
  try {
    let url = "products/";

    if (category && category !== "All") {
      url += `?category=${category}`;
    }

    const response = await api.get(url);

    if (Array.isArray(response.data)) return response.data;
    if (response.data.results && Array.isArray(response.data.results))
      return response.data.results;
    if (response.data.products && Array.isArray(response.data.products))
      return response.data.products;
    if (response.data.data && Array.isArray(response.data.data))
      return response.data.data;

    return [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getRelatedProducts = async (id) => {
  try {
    const response = await api.get("products/");

    let allItems = [];

    if (Array.isArray(response.data)) {
      allItems = response.data;
    } else if (Array.isArray(response.data.results)) {
      allItems = response.data.results;
    }

    return {
      data: allItems.filter((item) => item.id !== Number(id)).slice(0, 4),
    };
  } catch (error) {
    console.error(error);
    return { data: [] };
  }
};

export const getNewArrivals = async () => {
  try {
    const response = await api.get("products/?category=new_arrival");
    return Array.isArray(response.data)
      ? response.data
      : response.data.results || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getTopSelling = async () => {
  try {
    const response = await api.get("products/?category=top_selling");
    return Array.isArray(response.data)
      ? response.data
      : response.data.results || [];
  } catch (error) {
    console.error(error);
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
    console.error(error);
    return [];
  }
};

export const getProduct = async (id) => {
  const response = await api.get(`products/${id}/`);
  return { data: response.data };
};

export const addProduct = async (data) => {
  const response = await api.post("products/", data);
  return response.data;
};

export const updateProduct = async (id, data) => {
  const response = await api.put(`products/${id}/`, data);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`products/${id}/`);
  return response.data;
};

// ==============================================
// DRESS STYLES
// ==============================================

export const getDressStyles = async () => {
  try {
    const response = await api.get("dress-styles/");
    if (Array.isArray(response.data)) return response.data;
    return response.data.results || response.data.styles || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

// ==============================================
// REVIEWS
// ==============================================

export const getReviews = async () => {
  try {
    const response = await api.get("reviews/");
    return Array.isArray(response.data)
      ? response.data
      : response.data.results || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getProductReviews = async (productId) => {
  try {
    const response = await api.get(`reviews/?product=${productId}`);
    return Array.isArray(response.data)
      ? response.data
      : response.data.results || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const addReview = async (data) => {
  const response = await api.post("reviews/", data);
  return response.data;
};

export default api;










