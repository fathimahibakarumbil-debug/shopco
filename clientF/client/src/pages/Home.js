import React, { useState, useRef, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import ProductsGrid from "../components/ProductsGrid";
import ReviewCard from "../components/ReviewCard";
import { getReviews, getDressStyles } from "../services/api";
import { useLocation } from "react-router-dom";

import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

/* ---------------- STYLE CARD ---------------- */
const StyleCard = ({ title, img }) => (
  <Box
    sx={{
      height: { xs: "190px", md: "289px" },
      borderRadius: "20px",
      overflow: "hidden",
      position: "relative",
      bgcolor: "white",
      cursor: "pointer",
      width: "100%",
    }}
  >
    <Typography
      variant="h4"
      sx={{
        position: "absolute",
        top: 25,
        left: 36,
        fontWeight: "bold",
        zIndex: 1,
        fontSize: { xs: "1.5rem", md: "2.2rem" },
        color: "#000",
      }}
    >
      {title}
    </Typography>

    <Box
      component="img"
      src={img}
      alt={title}
      sx={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "center",
      }}
    />
  </Box>
);

/* ---------------- HOME COMPONENT ---------------- */
const Home = () => {
  const [showAllNew, setShowAllNew] = useState(false);
  const [showAllTop, setShowAllTop] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [styles, setStyles] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const swiperRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    fetchReviews();
    fetchStyles();
  }, []);

  useEffect(() => {
    if (location.hash === "#new-arrivals") {
      setTimeout(() => {
        const element = document.getElementById("new-arrivals-section");
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else if (location.hash === "#top-selling") {
      setTimeout(() => {
        const element = document.getElementById("top-selling-section");
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, [location]);

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const data = await getReviews();
      setReviews(Array.isArray(data) ? data : data?.data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  const fetchStyles = async () => {
    try {
      const data = await getDressStyles();
      setStyles(Array.isArray(data) ? data : data?.data || []);
    } catch (error) {
      console.error("Error fetching dress styles:", error);
      setStyles([]);
    }
  };

  const getStyleByTitle = (titleKey) => {
    return (
      styles.find((s) => s.title?.toLowerCase() === titleKey.toLowerCase()) ||
      styles.find((s) => s.slug?.toLowerCase() === titleKey.toLowerCase())
    );
  };

  const casualStyle = getStyleByTitle("casual") || styles[0];
  const formalStyle = getStyleByTitle("formal") || styles[1];
  const partyStyle = getStyleByTitle("party") || styles[2];
  const gymStyle = getStyleByTitle("gym") || styles[3];

  return (
    <Box sx={{ position: "relative" }}>
      <HeroSection />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box id="new-arrivals-section" sx={{ pt: 2 }} />

        {/* NEW ARRIVALS */}
        <Typography
          variant="h3"
          align="center"
          sx={{
            fontWeight: "900",
            mb: 4,
            fontFamily: '"Integral CF", sans-serif',
          }}
        >
          NEW ARRIVALS
        </Typography>

        <ProductsGrid type="new" limit={showAllNew ? null : 4} />

        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Button
            variant="outlined"
            onClick={() => setShowAllNew(!showAllNew)}
            sx={{
              borderRadius: "25px",
              px: 5,
              color: "black",
              borderColor: "#e0e0e0",
              textTransform: "none",
            }}
          >
            {showAllNew ? "Show Less" : "View All"}
          </Button>
        </Box>

        <Box sx={{ my: 4, borderBottom: "1px solid #e0e0e0" }} />

        <Box id="top-selling-section" sx={{ pt: 2 }} />

        {/* TOP SELLING */}
        <Typography
          variant="h3"
          align="center"
          sx={{
            fontWeight: "900",
            mb: 4,
            fontFamily: '"Integral CF", sans-serif',
          }}
        >
          TOP SELLING
        </Typography>

        <ProductsGrid type="top" limit={showAllTop ? null : 4} />

        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Button
            variant="outlined"
            onClick={() => setShowAllTop(!showAllTop)}
            sx={{
              borderRadius: "25px",
              px: 5,
              color: "black",
              borderColor: "#e0e0e0",
              textTransform: "none",
            }}
          >
            {showAllTop ? "Show Less" : "View All"}
          </Button>
        </Box>

        {/* BROWSE BY STYLE */}
        <Paper
          elevation={0}
          sx={{
            bgcolor: "#F0F0F0",
            borderRadius: "40px",
            p: { xs: 3, md: 6 },
            mt: 6,
          }}
        >
          <Typography
            variant="h3"
            align="center"
            sx={{
              fontWeight: "900",
              mb: 5,
              fontFamily: '"Integral CF", sans-serif',
              fontSize: { xs: "1.8rem", md: "3rem" },
            }}
          >
            BROWSE BY DRESS STYLE
          </Typography>

          <Grid container spacing={2.5} columns={12}>
            {styles && styles.length > 0 ? (
              <>
                {/* 1. Casual - md={4} */}
                {casualStyle && (
                  <Grid item xs={12} md={4}>
                    <StyleCard
                      title={casualStyle.title || "Casual"}
                      img={casualStyle.image}
                    />
                  </Grid>
                )}

                {/* 2. Formal - md={8} */}
                {formalStyle && (
                  <Grid item xs={12} md={8}>
                    <StyleCard
                      title={formalStyle.title || "Formal"}
                      img={formalStyle.image}
                    />
                  </Grid>
                )}

                {/* 3. Party - md={8} */}
                {partyStyle && (
                  <Grid item xs={12} md={8}>
                    <StyleCard
                      title={partyStyle.title || "Party"}
                      img={partyStyle.image}
                    />
                  </Grid>
                )}

                {/* 4. Gym - md={4} */}
                {gymStyle && (
                  <Grid item xs={12} md={4}>
                    <StyleCard
                      title={gymStyle.title || "Gym"}
                      img={gymStyle.image}
                    />
                  </Grid>
                )}
              </>
            ) : (
              <Typography sx={{ width: "100%", textAlign: "center", py: 2 }}>
                No styles found.
              </Typography>
            )}
          </Grid>
        </Paper>

        {/* OUR HAPPY CUSTOMERS */}
        <Box sx={{ mt: 8, mb: { xs: 4, md: 6 } }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: "900",
                fontFamily: '"Integral CF", sans-serif',
                fontSize: { xs: "1.8rem", md: "2.8rem" },
              }}
            >
              OUR HAPPY CUSTOMERS
            </Typography>

            <Box>
              <IconButton
                onClick={() => swiperRef.current?.slidePrev()}
                sx={{ color: "black" }}
              >
                <ArrowBackIcon />
              </IconButton>

              <IconButton
                onClick={() => swiperRef.current?.slideNext()}
                sx={{ color: "black" }}
              >
                <ArrowForwardIcon />
              </IconButton>
            </Box>
          </Box>

          {reviewsLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
              <CircularProgress />
            </Box>
          ) : reviews?.length > 0 ? (
            <Swiper
              modules={[Navigation]}
              onBeforeInit={(swiper) => {
                swiperRef.current = swiper;
              }}
              spaceBetween={20}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              style={{ display: "flex" }}
            >
              {reviews.map((review) => (
                <SwiperSlide
                  key={review.id}
                  style={{ display: "flex", height: "auto" }}
                >
                  <ReviewCard
                    review={review}
                    sx={{
                      flexGrow: 1,
                      height: "100%",
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <Typography align="center" sx={{ py: 4, color: "text.secondary" }}>
              No reviews available.
            </Typography>
          )}
        </Box>
      </Container>

      {/* NEWSLETTER SECTION */}
      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 2,
          mb: -10,
        }}
      >
        <Box
          sx={{
            bgcolor: "black",
            borderRadius: "20px",
            p: { xs: 4, md: 5 },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Typography
            variant="h3"
            sx={{
              color: "white",
              fontWeight: "900",
              fontFamily: '"Integral CF", sans-serif',
              width: { xs: "100%", md: "50%" },
              fontSize: { xs: "1.8rem", md: "2.5rem" },
            }}
          >
            STAY UPTO DATE ABOUT OUR LATEST OFFERS
          </Typography>

          <Box
            sx={{
              width: { xs: "100%", md: "350px" },
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              placeholder="Enter your email address"
              sx={{
                bgcolor: "white",
                borderRadius: "30px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "30px",
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon sx={{ color: "gray" }} />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              fullWidth
              variant="contained"
              sx={{
                bgcolor: "white",
                color: "black",
                borderRadius: "30px",
                py: 1.5,
                fontWeight: "bold",
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#f5f5f5",
                },
              }}
            >
              Subscribe to Newsletter
            </Button>
          </Box>
        </Box>
      </Container>

      <Box sx={{ height: "100px" }} />
    </Box>
  );
};

export default Home;
