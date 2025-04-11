import React from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  Avatar,
  Grid,
  Button,
  useTheme,
  Divider,
} from "@mui/material";
import {
  Restaurant as RestaurantIcon,
  LocalDining as DiningIcon,
  Nature as NatureIcon,
  EmojiFoodBeverage as BeverageIcon,
} from "@mui/icons-material";

const AboutPage = () => {
  const theme = useTheme();

  const features = [
    {
      icon: <RestaurantIcon fontSize="large" />,
      title: "Gourmet Cuisine",
      description:
        "Our chef brings 20 years of experience crafting exquisite dishes with locally-sourced ingredients.",
    },
    {
      icon: <DiningIcon fontSize="large" />,
      title: "Elegant Ambiance",
      description:
        "Experience dining in our beautifully designed space with warm lighting and comfortable seating.",
    },
    {
      icon: <NatureIcon fontSize="large" />,
      title: "Sustainable Practices",
      description:
        "We're committed to eco-friendly operations from farm to table.",
    },
    {
      icon: <BeverageIcon fontSize="large" />,
      title: "Curated Drinks",
      description:
        "Enjoy our selection of fine wines and craft cocktails paired perfectly with your meal.",
    },
  ];

  return (
    <Box
      sx={{
        background: theme.palette.background.default,
        minHeight: "100vh",
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mb: 6,
            background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
            color: "white",
            borderRadius: 3,
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            Our Story
          </Typography>
          <Typography variant="h5" component="p" sx={{ mb: 3 }}>
            Tradition meets innovation in every dish we serve
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            sx={{
              mt: 2,
              px: 4,
              fontWeight: 600,
            }}
          >
            View Our Menu
          </Button>
        </Paper>

        {/* History Section */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{
              color: theme.palette.primary.dark,
              mb: 4,
              fontWeight: 600,
            }}
          >
            Established in 2010
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem" }}>
                Founded by Chef Marco Laurent, our restaurant began as a small
                bistro with just 10 tables. What started as a passion project
                quickly gained recognition for our innovative take on
                traditional recipes.
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem" }}>
                Today, we're proud to be one of the city's most awarded dining
                establishments, featured in multiple culinary guides and beloved
                by locals and visitors alike.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  background: theme.palette.accent.light,
                  color: "white",
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" component="h3" gutterBottom>
                  "Food is not just eating energy. It's an experience."
                </Typography>
                <Typography variant="subtitle1">
                  - Chef Marco Laurent
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 6, borderColor: theme.palette.primary.light }} />

        {/* Features Section */}
        <Box
          sx={{
            mb: 8,
            px: { xs: 2, sm: 3 }, // Add horizontal padding on mobile/tablet
          }}
        >
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{
              color: theme.palette.primary.dark,
              mb: 6,
              textAlign: "center",
              fontWeight: 600,
              position: "relative",
              "&:after": {
                content: '""',
                display: "block",
                width: "80px",
                height: "4px",
                backgroundColor: theme.palette.secondary.main,
                margin: "16px auto 0",
                borderRadius: "2px",
              },
            }}
          >
            What Makes Us Special
          </Typography>

          <Grid
            container
            spacing={{ xs: 3, sm: 4, md: 6 }} // Responsive spacing
            sx={{
              // Add negative margin to compensate for grid spacing
              marginTop: { xs: -3, sm: -4, md: -6 },
              marginBottom: { xs: 3, sm: 4, md: 6 },
            }}
          >
            {features.map((feature, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                key={index}
                sx={{
                  // Add individual item padding
                  padding: { xs: 3, sm: 4, md: 6 },
                }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    borderRadius: 3,
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: theme.shadows[6],
                    },
                  }}
                >
                  {/* Rest of your card content remains the same */}
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.secondary.main,
                      width: 80,
                      height: 80,
                      mb: 3,
                      "& .MuiSvgIcon-root": {
                        fontSize: "2.5rem",
                      },
                    }}
                  >
                    {feature.icon}
                  </Avatar>
                  <Typography
                    variant="h5"
                    component="h3"
                    gutterBottom
                    sx={{
                      color: theme.palette.primary.dark,
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "text.secondary",
                      lineHeight: 1.6,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Team Section */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{
              color: theme.palette.primary.dark,
              mb: 6,
              textAlign: "center",
              fontWeight: 600,
            }}
          >
            Meet Our Team
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {[
              { name: "Marco Laurent", role: "Executive Chef" },
              { name: "Sophie Dubois", role: "Head Pastry Chef" },
              { name: "Antoine Martin", role: "Sommelier" },
              { name: "Elise Lambert", role: "General Manager" },
            ].map((member, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box sx={{ textAlign: "center" }}>
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      mb: 2,
                      mx: "auto",
                      bgcolor: theme.palette.primary.light,
                    }}
                  >
                    {member.name.charAt(0)}
                  </Avatar>
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{
                      color: theme.palette.primary.dark,
                      fontWeight: 600,
                    }}
                  >
                    {member.name}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {member.role}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutPage;