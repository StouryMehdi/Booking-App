import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './Pages/HomePage';
import BookingsList from './components/BookingsList';
import Alert from './components/Alert';
import MenuPage from './components/MenuPage';
import About from './components/About';
import theme from './Pages/them';
import './styles/App.scss';
import { ThemeProvider } from '@emotion/react';

const App = () => {
  const [alert, setAlert] = useState({ isOpen: false, message: '' });

  // Function to open the alert with a specific message
  const showAlert = (message) => {
    setAlert({ isOpen: true, message });
  };

  // Function to close the alert
  const closeAlert = () => {
    setAlert({ isOpen: false, message: '' });
  };

  return (
    <ThemeProvider theme={theme}>
    <Router>
      <div className="app-wrapper">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage showAlert={showAlert} />} />
            <Route path="/booking-list" element={<BookingsList />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
        <Alert isOpen={alert.isOpen} onClose={closeAlert} message={alert.message} />
      </div>
    </Router>
    </ThemeProvider>
  );
};

export default App;
