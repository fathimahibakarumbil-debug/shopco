import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  Box,
  Badge,
  IconButton,
} from "@mui/material";

import {
  Search,
  ShoppingCartOutlined,
  AccountCircleOutlined,
} from "@mui/icons-material";

import { styled } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const SearchContainer = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "20px",
  backgroundColor: "#F0F0F0",
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "40%",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justify: "center",
  color: "#808080",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: "100%",
  },
}));

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTxt, setSearchTxt] = useState("");

  const { cartItems } = useSelector((state) => state.cart);

  const totalItems =
    cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const isCartPage = location.pathname === "/cart";

  useEffect(() => {
    if (!location.pathname.includes("/shop")) {
      setSearchTxt("");
    } else {
      const queryParams = new URLSearchParams(location.search);
      setSearchTxt(queryParams.get("search") || "");
    }
  }, [location.pathname, location.search]);

  const handleNewArrivalsClick = () => {
    if (location.pathname === "/home" || location.pathname === "/") {
      const element = document.getElementById("new-arrivals-section");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/home#new-arrivals");
    }
  };

  const handleTopSellingClick = () => {
    if (location.pathname === "/home" || location.pathname === "/") {
      const element = document.getElementById("top-selling-section");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/home#top-selling");
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      const trimmedQuery = searchTxt.trim();
      if (trimmedQuery) {
        navigate(`/shop?search=${encodeURIComponent(trimmedQuery)}`);
      } else {
        navigate("/shop");
      }
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTxt(value);

    if (location.pathname.includes("/shop")) {
      if (value.trim()) {
        navigate(`/shop?search=${encodeURIComponent(value.trim())}`, {
          replace: true,
        });
      } else {
        navigate("/shop", { replace: true });
      }
    }
  };

  return (
    <AppBar
      position="static"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: "1px solid #e0e0e0",
        padding: "10px 5%",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* LOGO */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            fontFamily: "Integral CF, sans-serif",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          SHOP.CO
        </Typography>

        {/* NAV ITEMS */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
          <Typography
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/shop")}
          >
            Shop
          </Typography>

          <Typography
            sx={{ cursor: "pointer" }}
            onClick={handleNewArrivalsClick}
          >
            New Arrivals
          </Typography>

          <Typography
            sx={{ cursor: "pointer" }}
            onClick={handleTopSellingClick}
          >
            Top Selling
          </Typography>
        </Box>

        {/* SEARCH */}
        <SearchContainer>
          <SearchIconWrapper>
            <Search />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search for products..."
            value={searchTxt}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
          />
        </SearchContainer>

        {/* ICONS */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton onClick={() => navigate("/cart")}>
            <Badge
              badgeContent={isCartPage ? 0 : totalItems}
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: "black",
                  color: "white",
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                },
              }}
            >
              <ShoppingCartOutlined />
            </Badge>
          </IconButton>

          <IconButton>
            <AccountCircleOutlined />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
