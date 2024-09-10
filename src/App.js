// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './Pages/HomePage';
import BookingsList from './components/BookingsList';
import './styles/App.scss';

const App = () => {
  return (
    <Router>
      <div className="app-wrapper">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/booking-list" element={<BookingsList />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
