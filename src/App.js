import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './Pages/HomePage';
import BookingsList from './components/BookingsList';
import Alert from './components/Alert';
import MenuPage from './components/MenuPage';
import About from './components/About';
import LoginPage from './components/LoginPage';
import theme from './Pages/them';
import './styles/App.scss';
import { ThemeProvider } from '@emotion/react';

const App = () => {
  const [alert, setAlert] = useState({ isOpen: false, message: '', severity: 'info' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Enhanced alert function with severity
  const showAlert = (message, severity = 'info') => {
    setAlert({ isOpen: true, message, severity });
  };

  const closeAlert = () => {
    setAlert({ isOpen: false, message: '', severity: 'info' });
  };

  // Login handler with API integration
  const handleLogin = async (email, password) => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for cookies/sessions
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Login failed');
    }
    
    return await response.json();
  } catch (err) {
    throw err;
  }
};

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem('authToken');
    showAlert('Logged out successfully!', 'success');
  };

  // Protected Route component
  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      showAlert('You are not authorized to access this page!', 'error');
      return <Navigate to="/" replace />;
    }

    return children;
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="app-wrapper">
          {isAuthenticated && <Header onLogout={handleLogout} userRole={userRole} />}
          <main className="main-content">
            <Routes>
              <Route path="/login" element={
                isAuthenticated ? (
                  <Navigate to="/" replace />
                ) : (
                  <LoginPage onLogin={handleLogin} />
                )
              } />

              <Route path="/" element={
                <ProtectedRoute>
                  <HomePage showAlert={showAlert} />
                </ProtectedRoute>
              } />

              <Route path="/booking-list" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <BookingsList />
                </ProtectedRoute>
              } />

              <Route path="/menu" element={
                <ProtectedRoute>
                  <MenuPage />
                </ProtectedRoute>
              } />

              <Route path="/about" element={
                <ProtectedRoute>
                  <About />
                </ProtectedRoute>
              } />

              {/* Catch-all route for unauthorized access */}
              <Route path="*" element={
                isAuthenticated ? (
                  <Navigate to="/" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              } />
            </Routes>
          </main>
          {isAuthenticated && <Footer />}
          <Alert 
            isOpen={alert.isOpen} 
            onClose={closeAlert} 
            message={alert.message}
            severity={alert.severity}
          />
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;