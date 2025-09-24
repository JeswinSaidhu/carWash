import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AllBookings from './components/AllBookings';
import BookingDetails from './components/BookingDetails';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/all-bookings" element={<AllBookings />} />
          <Route path="/:id" element={<BookingDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
