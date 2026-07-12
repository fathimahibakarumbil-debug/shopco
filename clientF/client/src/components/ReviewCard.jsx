import React from "react";
import { Box, Typography, Rating} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function ReviewCard({ review }) {
  return (
    <Box
      sx={{
        border: "1px solid rgba(0,0,0,0.1)",
        borderRadius: "20px",
        p: { xs: 3, md: 4 },
        backgroundColor: "#fff",
        position: "relative",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        transition: "0.3s",
        "&:hover": {
          boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
        },
      }}
    >
      {/* RATING */}
      <Rating
        value={review.rating}
        precision={0.5}
        readOnly
        size="small"
        sx={{
          color: "#FFC633",
          mb: 1.5,
        }}
      />

      {/* NAME */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.7,
          mb: 1,
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "1.1rem",
            color: "#000",
          }}
        >
          {review.name}
        </Typography>

        {review.verified && (
          <CheckCircleIcon
            sx={{
              color: "#01AB31",
              fontSize: 19,
            }}
          />
        )}
      </Box>

      {/* COMMENT */}
      <Typography
        sx={{
          color: "rgba(0,0,0,0.6)",
          fontSize: "0.95rem",
          lineHeight: 1.6,
          flexGrow: 1,
        }}
      >
        "{review.comment}"
      </Typography>
    </Box>
  );
}
