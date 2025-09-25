import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddBookingForm from './AddBookingForm';
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();
  const [pendingBookings, setPendingBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchPendingBookings = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_FETCH_API}/api/bookings/pending`);
      if (!response.ok) {
        throw new Error('Failed to fetch pending bookings');
      }
      const data = await response.json();
      setPendingBookings(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingBookings();
  }, []);

  // Pagination calculations
  const totalPages = Math.ceil(pendingBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBookings = pendingBookings.slice(startIndex, endIndex);

  // Reset to page 1 when bookings change
  useEffect(() => {
    setCurrentPage(1);
  }, [pendingBookings]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return '#fef3c7';
      case 'confirmed':
        return '#d1fae5';
      case 'completed':
        return '#dbeafe';
      case 'cancelled':
        return '#fee2e2';
      default:
        return '#f3f4f6';
    }
  };

  const getStatusTextColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return '#92400e';
      case 'confirmed':
        return '#065f46';
      case 'completed':
        return '#1e40af';
      case 'cancelled':
        return '#dc2626';
      default:
        return '#374151';
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">Book Your Car Wash Now</h1>
            <button
              onClick={() => setShowAddForm(true)}
              className="hero-cta-button"
            >
              Add Booking
            </button>
          </div>
        </div>
      </section>

      {/* Pending Bookings Section */}
      <section className="pending-bookings-section">
        <div className="container">
          <h2 className="section-title">Pending Bookings</h2>

          {loading && (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading pending bookings...</p>
            </div>
          )}

          {error && (
            <div className="error-container">
              <h3>Error Loading Bookings</h3>
              <p>{error}</p>
              <button onClick={fetchPendingBookings} className="btn btn-primary">
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
              {pendingBookings.length === 0 ? (
                <div className="empty-state">
                  <h3>No Pending Bookings</h3>
                  <p>All caught up! No pending bookings at the moment.</p>
                </div>
              ) : (
                <>
                  <div className="bookings-grid">
                    {currentBookings.map(booking => (
                      <div
                        key={booking._id}
                        className="booking-card card card-clickable"
                        onClick={() => navigate(`/${booking._id}`)}
                      >
                        <div className="card-header">
                          <div className="customer-info">
                            <h3 className="customer-name">{booking.customerName}</h3>
                            <span
                              className="status-badge"
                              style={{
                                backgroundColor: getStatusColor(booking.status),
                                color: getStatusTextColor(booking.status)
                              }}
                            >
                              {booking.status}
                            </span>
                          </div>
                        </div>

                        <div className="card-body">
                          <div className="vehicle-section">
                            <div className="vehicle-details">
                              <div className="car-info-left">
                                <h4 className="car-name">{booking.carName}</h4>
                                <p className="car-model">{booking.carModel}</p>
                              </div>
                              <span className="car-type">{booking.carType}</span>
                            </div>
                          </div>

                          <div className="service-section">
                            <div className="service-info">
                              <span className="service-label">Service:</span>
                              <span className="service-value">{booking.carWashType}</span>
                            </div>
                            <div className="date-info">
                              <span className="date-label">Date:</span>
                              <span className="date-value">{formatDate(booking.bookingDate)}</span>
                            </div>
                            <div className="price-info">
                              <span className="price-label">Price:</span>
                              <span className="price-value">₹{booking.carWashPrice}</span>
                            </div>
                          </div>
                        </div>

                        <div className="card-footer">
                          <span className="view-details">Click to view details →</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="pagination-container">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="pagination-btn"
                      >
                        ← Previous
                      </button>

                      <div className="pagination-info">
                        Page {currentPage} of {totalPages}
                      </div>

                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="pagination-btn"
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </section>

      {/* Add Booking Form Modal */}
      {showAddForm && (
        <AddBookingForm
          onClose={() => setShowAddForm(false)}
          onBookingAdded={fetchPendingBookings}
        />
      )}
    </>
  );
};

export default Hero;