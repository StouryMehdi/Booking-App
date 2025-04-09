import React from "react";
import BookingForm from "../components/BookingForm";
import { Box, Container } from "@mui/material";
import BgImg from "../bg-rstaurant.jpg";

const HomePage = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        py: 8,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${BgImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.55)", // Dark overlay
          },
        }}
      />
      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
        <BookingForm />
      </Container>
    </Box>
  );
};

export default HomePage;
