import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Button,
  Pagination,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const MenuPage = () => {
  const theme = useTheme();
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://www.themealdb.com/api/json/v1/1/search.php?s="
        );

        if (!response.ok) {
          throw new Error("Failed to fetch menu");
        }

        const data = await response.json();

        if (!data.meals) {
          throw new Error("No dishes found");
        }

        const formattedDishes = data.meals.map((meal) => ({
          id: meal.idMeal,
          name: meal.strMeal,
          description: meal.strInstructions.substring(0, 100) + "...",
          price: `$${(Math.random() * 10 + 5).toFixed(2)}`,
          category: meal.strCategory,
          image: meal.strMealThumb || "/images/placeholder-food.jpg",
        }));

        setDishes(formattedDishes);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
  }, []);

  const pageCount = Math.ceil(dishes.length / itemsPerPage);
  const currentItems = dishes.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (error) {
    return (
      <Container
        sx={{
          py: 4,
          textAlign: "center",
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          onClick={() => window.location.reload()}
          sx={{
            mt: 2,
            backgroundColor: theme.palette.primary.main,
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 4,
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        sx={{
          color: theme.palette.primary.main,
          fontWeight: 700,
          mb: 4,
          textAlign: "center",
          textTransform: "uppercase",
          letterSpacing: "1px",
        }}
      >
        Our Menu
      </Typography>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
            color: theme.palette.primary.main,
          }}
        >
          <CircularProgress color="inherit" size={60} />
        </Box>
      ) : dishes.length === 0 ? (
        <Typography
          variant="h6"
          color="textSecondary"
          sx={{
            mt: 4,
            textAlign: "center",
            fontStyle: "italic",
          }}
        >
          No menu items available
        </Typography>
      ) : (
        <>
          <Table
            sx={{
              mb: 4,
              "& .MuiTableCell-head": {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                fontWeight: 600,
                fontSize: "1rem",
              },
              "& .MuiTableRow-root:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>Dish</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentItems.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box
                        component="img"
                        src={item.image}
                        alt={item.name}
                        sx={{
                          width: 80,
                          height: 60,
                          objectFit: "cover",
                          borderRadius: 1,
                          mr: 2,
                          border: `1px solid ${theme.palette.divider}`,
                        }}
                        onError={(e) => {
                          e.target.src = "/images/placeholder-food.jpg";
                        }}
                      />
                      <Typography fontWeight={500}>{item.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{item.description}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={item.category}
                      size="small"
                      sx={{
                        backgroundColor: theme.palette.primary.light,
                        color: theme.palette.primary.contrastText,
                        textTransform: "capitalize",
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography color="secondary.main" fontWeight={600}>
                      {item.price}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        boxShadow: theme.shadows[2],
                        "&:hover": {
                          backgroundColor: theme.palette.secondary.dark,
                          boxShadow: theme.shadows[4],
                          transform: "translateY(-1px)",
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      Add to Order
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {pageCount > 1 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 4,
                mb: 2,
              }}
            >
              <Pagination
                count={pageCount}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                sx={{
                  "& .MuiPaginationItem-root": {
                    "&.Mui-selected": {
                      fontWeight: "bold",
                      backgroundColor: theme.palette.primary.light,
                      color: theme.palette.primary.contrastText,
                    },
                    "&:hover": {
                      backgroundColor: theme.palette.primary.light + "80",
                    },
                  },
                }}
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default MenuPage;