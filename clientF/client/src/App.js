import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";

import Auth from "./pages/Auth";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Shop from "./pages/Shop";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Routes>
          {/* ================= PUBLIC ROUTES ================= */}
          <Route path="/" element={<Auth />} />
          <Route path="/login" element={<Auth />} />

          {/* ================= HOME PAGE ================= */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Navbar />
                <Box sx={{ flexGrow: 1 }}>
                  <Home />
                </Box>
                <Footer />
              </ProtectedRoute>
            }
          />

          {/* ================= SHOP PAGE ================= */}
          <Route
            path="/shop"
            element={
              <ProtectedRoute>
                <Navbar />
                <Box sx={{ flexGrow: 1 }}>
                  <Shop />
                </Box>
                <Footer />
              </ProtectedRoute>
            }
          />

          {/* ================= PRODUCT DETAIL ================= */}
          <Route
            path="/product/:id"
            element={
              <ProtectedRoute>
                <Navbar />
                <Box sx={{ flexGrow: 1 }}>
                  <ProductDetail />
                </Box>
                <Footer />
              </ProtectedRoute>
            }
          />

          {/* ================= CART PAGE ================= */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Navbar />
                <Box sx={{ flexGrow: 1 }}>
                  <Cart />
                </Box>
                <Footer />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
