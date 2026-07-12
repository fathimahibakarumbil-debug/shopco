import React from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import heroImg from "../assets/image.png";

// --- STYLED COMPONENTS ---

const HeroRoot = styled(Box)(({ theme }) => ({
  backgroundColor: "#F2F0F1",
  position: "relative",
  overflow: "hidden",
  width: "100%",
  [theme.breakpoints.up("md")]: {
    minHeight: "663px",
    display: "flex",
    alignItems: "center",
  },
}));

const HeroHeading = styled(Typography)(({ theme }) => ({
  fontFamily: "Integral CF, sans-serif",
  fontWeight: 900,
  textTransform: "uppercase",
  lineHeight: 1,
  color: "black",
  letterSpacing: "-1px",
  marginBottom: theme.spacing(4),
  fontSize: "40px",
  [theme.breakpoints.up("sm")]: {
    fontSize: "56px",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "64px",
  },
}));

const HeroSubText = styled(Typography)(({ theme }) => ({
  color: "rgba(0, 0, 0, 0.6)",
  fontWeight: 400,
  lineHeight: 1.6,
  marginBottom: theme.spacing(4),
  maxWidth: "545px",
  fontSize: "14px",
  [theme.breakpoints.up("sm")]: {
    fontSize: "16px",
  },
}));

const ShopButton = styled(Button)(({ theme }) => ({
  backgroundColor: "black",
  color: "white",
  fontWeight: 500,
  fontSize: "16px",
  textTransform: "none",
  padding: "16px 64px",
  borderRadius: "60px",
  marginBottom: theme.spacing(6),
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    width: "auto",
  },
  "&:hover": {
    backgroundColor: "#333",
  },
}));

const StatNumber = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  color: "black",
  fontSize: "24px",
  [theme.breakpoints.up("sm")]: {
    fontSize: "40px",
  },
}));

const StatLabel = styled(Typography)(({ theme }) => ({
  color: "rgba(0, 0, 0, 0.6)",
  fontSize: "12px",
  [theme.breakpoints.up("sm")]: {
    fontSize: "14px",
  },
}));

const BrandBar = styled(Box)(() => ({
  backgroundColor: "black",
  color: "white",
  padding: "40px 0",
  width: "100%",
  position: "relative",
  zIndex: 3,
}));

const brandsConfig = [
  {
    name: "VERSACE",
    style: { fontFamily: "serif", fontWeight: "bold", letterSpacing: "2px" },
  },
  {
    name: "ZARA",
    style: { fontFamily: "serif", fontWeight: "900", letterSpacing: "-2px" },
  },
  {
    name: "GUCCI",
    style: { fontFamily: "serif", fontWeight: "bold", letterSpacing: "4px" },
  },
  {
    name: "PRADA",
    style: {
      fontFamily: "sans-serif",
      fontWeight: "900",
      letterSpacing: "1px",
    },
  },
  {
    name: "Calvin Klein",
    style: {
      fontFamily: "sans-serif",
      fontWeight: "400",
      letterSpacing: "1px",
    },
  },
];

const HeroSection = () => {

  const scrollToNewArrivals = () => {
    const element = document.getElementById("new-arrivals-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Box>
      <HeroRoot>
        <Container
          maxWidth="xl"
          sx={{ pt: { xs: 5, md: 0 }, position: "relative" }}
        >
          <Grid container alignItems="center">
            {/* Left Content */}

            <Grid
              item
              xs={12}
              md={6}
              sx={{ zIndex: 2, position: "relative", py: { xs: 4, md: 8 } }}
            >
              <HeroHeading>
                Find clothes
                <br />
                that matches
                <br />
                your style
              </HeroHeading>

              <HeroSubText>
                Browse through our diverse range of meticulously crafted
                garments, designed to bring out your individuality and cater to
                your sense of style.
              </HeroSubText>

              <ShopButton variant="contained" onClick={scrollToNewArrivals}>
                Shop Now
              </ShopButton>

              <Box
                sx={{
                  display: "flex",
                  gap: { xs: 2, sm: 4 },
                  flexWrap: "nowrap",
                  mb: { xs: 2, md: 0 },
                }}
              >
                <Box>
                  <StatNumber>200+</StatNumber>
                  <StatLabel>International Brands</StatLabel>
                </Box>
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ mx: { xs: 1, sm: 2 } }}
                />
                <Box>
                  <StatNumber>2,000+</StatNumber>
                  <StatLabel>High-Quality Products</StatLabel>
                </Box>
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{
                    mx: { xs: 1, sm: 2 },
                    display: { xs: "none", sm: "block" },
                  }}
                />
                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                  <StatNumber>30,000+</StatNumber>
                  <StatLabel>Happy Customers</StatLabel>
                </Box>
              </Box>

              <Box
                sx={{
                  display: { xs: "block", sm: "none" },
                  mt: 2,
                  textAlign: "center",
                }}
              >
                <StatNumber>30,000+</StatNumber>
                <StatLabel>Happy Customers</StatLabel>
              </Box>
            </Grid>

            {/* Right Image Container */}

            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-end",
                position: { xs: "relative", md: "absolute" },
                right: 0,
                bottom: 0,
                width: { xs: "100%", md: "50%" },
                height: { xs: "450px", md: "100%" },
                zIndex: 1,
              }}
            >
              <Box
                component="svg"
                viewBox="0 0 104 104"
                sx={{
                  position: "absolute",
                  right: { xs: "10px", md: "30px" },
                  top: { xs: "20px", md: "60px" },
                  width: { xs: "60px", md: "104px" },
                  height: { xs: "60px", md: "104px" },
                  zIndex: 2,
                }}
              >
                <path
                  d="M52 0C52 28.7183 28.7183 52 0 52C28.7183 52 52 75.2817 52 104C52 75.2817 75.2817 52 104 52C75.2817 52 52 28.7183 52 0Z"
                  fill="black"
                />
              </Box>

              <Box
                component="svg"
                viewBox="0 0 56 56"
                sx={{
                  position: "absolute",
                  left: { xs: "5%", md: "-40px" },
                  top: { xs: "40%", md: "50%" },
                  width: { xs: "32px", md: "56px" },
                  height: { xs: "32px", md: "56px" },
                  zIndex: 2,
                }}
              >
                <path
                  d="M28 0C28 15.464 15.464 28 0 28C15.464 28 28 40.536 28 56C28 40.536 40.536 28 56 28C40.536 28 28 15.464 28 0Z"
                  fill="black"
                />
              </Box>

              <img
                src={heroImg}
                alt="Fashion Models"
                style={{
                  height: "100%",
                  maxHeight: "100%",
                  width: "auto",
                  maxWidth: "100%",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </HeroRoot>

      {/* Brand Bar */}
      <BrandBar>
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: { xs: 3, md: 4 },
            }}
          >
            {brandsConfig.map((brand) => (
              <Typography
                key={brand.name}
                variant="h4"
                sx={{
                  ...brand.style,
                  fontSize: { xs: "24px", md: "32px" },
                  color: "white",
                }}
              >
                {brand.name}
              </Typography>
            ))}
          </Box>
        </Container>
      </BrandBar>
    </Box>
  );
};

export default HeroSection;
