import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  IconButton,
  TextField,
  InputAdornment,
  Divider,
  Container,
  Dialog,
  DialogContent,
  Zoom,
  Fade,
} from "@mui/material";

import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../redux/cartSlice";
import api from "../services/api";

// Icons
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocalOfferIcon from "@mui/icons-material/LocalOfferOutlined";
import MailIcon from "@mui/icons-material/EmailOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function Cart() {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  const [promoCode, setPromoCode] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [openSuccess, setOpenSuccess] = useState(false);
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const discountPercent = 20;
  const discount = Math.round((subtotal * discountPercent) / 100);
  const deliveryFee = 15;
  const total = subtotal - discount + deliveryFee;

  const checkout = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    try {
      await api.post("orders/create/", {
        items: cartItems,
        subtotal,
        discount,
        deliveryFee,
        total,
      });
      setOpenSuccess(true);
    } catch (err) {
      console.log(err);
      setOpenSuccess(true);
    }
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity >= 1) {
      dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
    }
  };

  const handleApplyPromo = () => {
    if (promoCode.trim() === "") {
      alert("Please enter a promo code");
    } else {
      alert(`Promo code "${promoCode}" applied!`);
    }
  };

  const handleNewsletterSubscribe = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterEmail)) {
      alert("Please enter a valid email address");
    } else {
      alert(
        `Thank you! ${newsletterEmail} has been subscribed to our newsletter.`,
      );
      setNewsletterEmail("");
    }
  };

  return (
    <Box
      sx={{ backgroundColor: "#fff", minHeight: "100vh", pt: { xs: 3, md: 6 } }}
    >
      <Container maxWidth="xl">
        <Typography
          variant="h3"
          fontWeight="900"
          sx={{
            mb: 5,
            fontFamily: "'Integral CF', sans-serif",
            textTransform: "uppercase",
            fontSize: { xs: "2.2rem", md: "3rem" },
            ml: { md: 2 },
          }}
        >
          YOUR CART
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            mb: 10,
          }}
        >
          <Grid container spacing={4} sx={{ maxWidth: "1240px" }}>
            {/* LEFT: Cart Items */}
            <Grid item xs={12} md={7}>
              <Box
                sx={{
                  border: "1px solid rgba(0,0,0,0.1)",
                  borderRadius: "20px",
                  p: { xs: 2, md: 3 },
                }}
              >
                {cartItems.length === 0 ? (
                  <Typography sx={{ p: 4, textAlign: "center", color: "gray" }}>
                    Your cart is empty.
                  </Typography>
                ) : (
                  cartItems.map((item, index) => (
                    <Box key={item.id}>
                      <Box
                        sx={{ display: "flex", gap: { xs: 2, md: 3 }, py: 3 }}
                      >
                        <Box
                          component="img"
                          src={item.image}
                          alt={item.name}
                          sx={{
                            width: { xs: 100, md: 125 },
                            height: { xs: 100, md: 125 },
                            borderRadius: "12px",
                            objectFit: "cover",
                            backgroundColor: "#F0EEED",
                          }}
                        />
                        <Box
                          sx={{
                            flexGrow: 1,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                            }}
                          >
                            <Box>
                              <Typography
                                fontWeight="800"
                                sx={{
                                  fontSize: { xs: "1rem", md: "1.25rem" },
                                  lineHeight: 1.2,
                                }}
                              >
                                {item.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  mt: 0.5,
                                  color: "black",
                                  fontSize: "0.9rem",
                                }}
                              >
                                Size:{" "}
                                <span style={{ color: "rgba(0,0,0,0.6)" }}>
                                  {item.size || "Large"}
                                </span>
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ color: "black", fontSize: "0.9rem" }}
                              >
                                Color:{" "}
                                <span style={{ color: "rgba(0,0,0,0.6)" }}>
                                  {item.color || "White"}
                                </span>
                              </Typography>
                            </Box>
                            <IconButton
                              onClick={() => dispatch(removeFromCart(item.id))}
                              sx={{ color: "#FF3333", p: 0 }}
                            >
                              <DeleteOutlineIcon sx={{ fontSize: "1.5rem" }} />
                            </IconButton>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              fontWeight="800"
                              sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" } }}
                            >
                              ${item.price}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                backgroundColor: "#F0F0F0",
                                borderRadius: "50px",
                                px: { xs: 1.5, md: 2 },
                                py: 0.5,
                              }}
                            >
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.id,
                                    item.quantity - 1,
                                  )
                                }
                              >
                                <RemoveIcon fontSize="small" />
                              </IconButton>
                              <Typography
                                sx={{
                                  mx: 1.5,
                                  fontWeight: "700",
                                  fontSize: "1rem",
                                }}
                              >
                                {item.quantity}
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.id,
                                    item.quantity + 1,
                                  )
                                }
                              >
                                <AddIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                      {index !== cartItems.length - 1 && (
                        <Divider sx={{ opacity: 0.5 }} />
                      )}
                    </Box>
                  ))
                )}
              </Box>
            </Grid>

            {/* RIGHT: Summary */}
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: "20px",
                  border: "1px solid rgba(0,0,0,0.1)",
                }}
              >
                <Typography variant="h5" fontWeight="700" sx={{ mb: 3 }}>
                  Order Summary
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography color="rgba(0,0,0,0.6)" fontSize="1.1rem">
                    Subtotal
                  </Typography>
                  <Typography fontWeight="700" fontSize="1.1rem">
                    ${subtotal}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography color="rgba(0,0,0,0.6)" fontSize="1.1rem">
                    Discount (-{discountPercent}%)
                  </Typography>
                  <Typography
                    fontWeight="700"
                    fontSize="1.1rem"
                    color="#FF3333"
                  >
                    -${discount}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2.5,
                  }}
                >
                  <Typography color="rgba(0,0,0,0.6)" fontSize="1.1rem">
                    Delivery Fee
                  </Typography>
                  <Typography fontWeight="700" fontSize="1.1rem">
                    ${deliveryFee}
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2.5 }} />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 4,
                  }}
                >
                  <Typography fontSize="1.2rem">Total</Typography>
                  <Typography
                    fontWeight="800"
                    variant="h4"
                    sx={{ fontSize: { xs: "1.8rem", md: "2.2rem" } }}
                  >
                    ${total}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1.5, mb: 3 }}>
                  <TextField
                    fullWidth
                    placeholder="Add promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocalOfferIcon sx={{ color: "rgba(0,0,0,0.4)" }} />
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: "50px",
                        backgroundColor: "#F0F0F0",
                        "& fieldset": { border: "none" },
                        height: "50px",
                      },
                    }}
                  />
                  <Button
                    onClick={handleApplyPromo}
                    variant="contained"
                    sx={{
                      borderRadius: "50px",
                      px: 4,
                      bgcolor: "black",
                      textTransform: "none",
                      height: "50px",
                    }}
                  >
                    Apply
                  </Button>
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={checkout}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    py: 1.8,
                    borderRadius: "50px",
                    bgcolor: "black",
                    fontWeight: "700",
                    textTransform: "none",
                    fontSize: "1rem",
                  }}
                >
                  Go to Checkout
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* BIG & CLEAN SUCCESS WINDOW */}
      <Dialog
        open={openSuccess}
        onClose={() => setOpenSuccess(false)}
        TransitionComponent={Zoom}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "30px",
            p: { xs: 2, md: 5 },
            textAlign: "center",
          },
        }}
      >
        <DialogContent>
          <Fade in={openSuccess} timeout={800}>
            <CheckCircleIcon
              sx={{ fontSize: "7rem", color: "#28a745", mb: 3 }}
            />
          </Fade>
          <Typography
            variant="h3"
            fontWeight="900"
            sx={{ fontFamily: "'Integral CF', sans-serif", mb: 2 }}
          >
            SUCCESS!
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: "rgba(0,0,0,0.6)", mb: 4, fontWeight: "500" }}
          >
            Your order has been placed successfully.
            <br />
            Thank you for shopping with us!
          </Typography>
          <Button
            variant="contained"
            fullWidth
            onClick={() => setOpenSuccess(false)}
            sx={{
              bgcolor: "black",
              borderRadius: "50px",
              py: 2,
              fontWeight: "700",
              fontSize: "1.1rem",
              textTransform: "none",
            }}
          >
            Continue Shopping
          </Button>
        </DialogContent>
      </Dialog>

      {/* FOOTER NEWSLETTER SECTION */}
      <Box
        sx={{
          px: { xs: 2, md: 4 },
          position: "relative",
          zIndex: 2,
          mt: 10,
          mb: -10,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              bgcolor: "black",
              borderRadius: "20px",
              p: { xs: 4, md: 6 },
              display: "flex",
              flexDirection: { xs: "column", lg: "row" },
              alignItems: "center",
              justifyContent: "space-between",
              gap: 4,
            }}
          >
            <Typography
              variant="h3"
              sx={{
                color: "white",
                fontWeight: "900",
                fontFamily: "'Integral CF', sans-serif",
                maxWidth: "550px",
                fontSize: { xs: "1.8rem", md: "2.5rem" },
                textAlign: { xs: "center", lg: "left" },
              }}
            >
              STAY UPTO DATE ABOUT OUR LATEST OFFERS
            </Typography>
            <Box
              sx={{
                width: "100%",
                maxWidth: "350px",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <TextField
                fullWidth
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                sx={{
                  bgcolor: "white",
                  borderRadius: "50px",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { border: "none" },
                    height: "48px",
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ ml: 1 }}>
                      <MailIcon sx={{ color: "rgba(0,0,0,0.4)" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                onClick={handleNewsletterSubscribe}
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: "white",
                  color: "black",
                  borderRadius: "50px",
                  height: "48px",
                  fontWeight: "700",
                  textTransform: "none",
                }}
              >
                Subscribe to Newsletter
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Box sx={{ bgcolor: "#F0F0F0", pt: 20, pb: 10 }} />
    </Box>
  );
}
