import {
  Box,
  Container,
  Grid,
  Typography,
  Divider,
  IconButton,
  Link,
  Stack,
} from "@mui/material";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import GitHubIcon from "@mui/icons-material/GitHub";

export default function Footer() {
  const footerSections = [
    { title: "Company", links: ["About", "Features", "Works", "Career"] },
    {
      title: "Help",
      links: [
        "Customer Support",
        "Delivery Details",
        "Terms & Conditions",
        "Privacy Policy",
      ],
    },
    {
      title: "FAQ",
      links: ["Account", "Manage Deliveries", "Orders", "Payments"],
    },
    {
      title: "Resources",
      links: [
        "Free eBooks",
        "Development Tutorial",
        "How to - Blog",
        "Youtube Playlist",
      ],
    },
  ];

  const paymentLogos = [
    "https://cdn-icons-png.flaticon.com/512/196/196578.png",
    "https://cdn-icons-png.flaticon.com/512/196/196561.png",
    "https://cdn-icons-png.flaticon.com/512/196/196565.png",
    "https://cdn-icons-png.flaticon.com/512/5968/5968411.png",
    "https://cdn-icons-png.flaticon.com/512/6124/6124994.png",
  ];

  return (
    <Box sx={{ bgcolor: "#F0F0F0", pt: 10, pb: 4, mt: 10 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Info */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "900",
                mb: 3,
                fontFamily: '"Integral CF", sans-serif',
                fontSize: "2.2rem",
              }}
            >
              SHOP.CO
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(0,0,0,0.6)",
                mb: 4,
                lineHeight: 1.8,
                fontSize: "1rem",
                maxWidth: "280px",
              }}
            >
              We have clothes that suits your style and which you're proud to
              wear. From women to men.
            </Typography>
            <Stack direction="row" spacing={1.5}>
              <IconButton
                size="small"
                sx={{ bgcolor: "white", border: "1px solid #ddd" }}
              >
                <TwitterIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{ bgcolor: "black", color: "white" }}
              >
                <FacebookIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{ bgcolor: "white", border: "1px solid #ddd" }}
              >
                <InstagramIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{ bgcolor: "white", border: "1px solid #ddd" }}
              >
                <GitHubIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Grid>

          {/* Links Sections */}
          <Grid item xs={12} md={8}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: "40px",
                flexWrap: "wrap",
              }}
            >
              {footerSections.map((section) => (
                <Box key={section.title} sx={{ minWidth: "150px" }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "700",
                      mb: 3,
                      textTransform: "uppercase",
                      fontSize: "1.1rem",
                    }}
                  >
                    {section.title}
                  </Typography>
                  <Stack spacing={2.5}>
                    {section.links.map((link) => (
                      <Link
                        key={link}
                        href="#"
                        underline="none"
                        sx={{
                          color: "rgba(0,0,0,0.6)",
                          fontSize: "1rem",
                          "&:hover": { color: "black" },
                        }}
                      >
                        {link}
                      </Link>
                    ))}
                  </Stack>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 6, borderColor: "rgba(0,0,0,0.1)" }} />

        {/* Bottom Section: Copyright and Logos */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: "rgba(0,0,0,0.6)", fontSize: "0.95rem" }}
          >
            Shop.co © 2000-2023, All Rights Reserved
          </Typography>

          <Stack direction="row" spacing={1.5}>
            {paymentLogos.map((url, index) => (
              <Box
                key={index}
                component="img"
                src={url}
                alt="payment method"
                sx={{
                  height: 32,
                  width: 52,
                  bgcolor: "white",
                  px: 1.2,
                  py: 0.6,
                  borderRadius: "6px",
                  border: "1px solid #f0f0f0",
                  boxShadow: "0px 1px 3px rgba(0,0,0,0.05)",
                  objectFit: "contain",
                }}
              />
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
