import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AllBookings.css';

// AllBookings component - displays paginated list of bookings with filters and sorting
const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [carTypeFilter, setCarTypeFilter] = useState('');
  const [washTypeFilter, setWashTypeFilter] = useState('');

  useEffect(() => {
    fetchAllBookings();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [bookings]);

  // Sort bookings function
  const sortBookings = (bookings) => {
    return [...bookings].sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'price':
          aValue = parseFloat(a.carWashPrice);
          bValue = parseFloat(b.carWashPrice);
          break;
        case 'date':
          aValue = new Date(a.bookingDate);
          bValue = new Date(b.bookingDate);
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
  };

  const uniqueCarTypes = [...new Set(bookings.map(b => b.carType))].sort();
  const uniqueWashTypes = [...new Set(bookings.map(b => b.carWashType))].sort();

  const filteredBookings = bookings.filter(booking => {
    if (carTypeFilter && booking.carType !== carTypeFilter) return false;
    if (washTypeFilter && booking.carWashType !== washTypeFilter) return false;
    return true;
  });

  const sortedBookings = sortBookings(filteredBookings);

  const totalPages = Math.ceil(sortedBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBookings = sortedBookings.slice(startIndex, endIndex);

  const fetchAllBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:${import.meta.env.VITE_PORT}/api/bookings`);
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      const data = await response.json();
      setBookings(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="all-bookings-container">
        <div className="page-header">
          <h1>All Bookings</h1>
        </div>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading all bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="all-bookings-container">
        <div className="page-header">
          <h1>All Bookings</h1>
        </div>
        <div className="error-container">
          <h2>Error Loading Bookings</h2>
          <p>{error}</p>
          <button onClick={fetchAllBookings} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="all-bookings-container">
      <div className="page-header">
        <h1>All Bookings</h1>
        <p className="page-subtitle">View and manage all car wash bookings</p>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label htmlFor="carTypeFilter">Car Type:</label>
          <select
            id="carTypeFilter"
            value={carTypeFilter}
            onChange={(e) => setCarTypeFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Car Types</option>
            {uniqueCarTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="washTypeFilter">Wash Type:</label>
          <select
            id="washTypeFilter"
            value={washTypeFilter}
            onChange={(e) => setWashTypeFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Wash Types</option>
            {uniqueWashTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="sortBy">Sort by:</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="date">Date</option>
            <option value="price">Price</option>
          </select>
        </div>
        <button
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="sort-order-button"
        >
          {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <h2>No Bookings Found</h2>
          <p>There are no bookings in the system yet.</p>
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
                      <span className="date-label">Booking Date:</span>
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
    </div>
  );
};

export default AllBookings;