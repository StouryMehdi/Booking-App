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
  Chip
} from "@mui/material";

const MenuPage = () => {
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom sx={{ color: 'primary.main' }}>
              Our Menu
            </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : dishes.length === 0 ? (
        <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
          No menu items available
        </Typography>
      ) : (
        <>
          <Table sx={{ 
            '& .MuiTableCell-head': {
              backgroundColor: 'primary.light',
              color: 'primary.contrastText',
              fontWeight: 600
            },
            '& .MuiTableRow-root:hover': {
              backgroundColor: 'rgba(129, 199, 132, 0.1)'
            }
          }}>
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
                <TableRow key={item.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        component="img"
                        src={item.image}
                        alt={item.name}
                        sx={{ 
                          width: 80, 
                          height: 60, 
                          objectFit: 'cover',
                          borderRadius: 1,
                          mr: 2
                        }}
                        onError={(e) => {
                          e.target.src = '/images/placeholder-food.jpg';
                        }}
                      />
                      {item.name}
                    </Box>
                  </TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>
                    <Chip 
                      label={item.category} 
                      size="small" 
                      sx={{ 
                        backgroundColor: 'primary.light', 
                        color: 'white',
                        textTransform: 'capitalize'
                      }} 
                    />
                  </TableCell>
                  <TableCell>
                    <Typography color="secondary.main">
                      {item.price}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="contained" 
                      color="secondary"
                      size="small"
                    >
                      Add to Order
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {pageCount > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={pageCount}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                sx={{
                  '& .MuiPaginationItem-root': {
                    '&.Mui-selected': {
                      fontWeight: 'bold'
                    }
                  }
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