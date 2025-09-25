import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AddBookingForm from './AddBookingForm';
import './BookingDetails.css';

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  useEffect(() => {
    if (booking) {
      setSelectedStatus(booking.status);
    }
  }, [booking]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_FETCH_API}/api/bookings/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch booking details');
      }
      const data = await response.json();
      setBooking(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching booking details:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return '#fef3c7'; // yellow
      case 'confirmed':
        return '#d1fae5'; // green
      case 'completed':
        return '#dbeafe'; // blue
      case 'cancelled':
        return '#fee2e2'; // red
      default:
        return '#f3f4f6'; // gray
    }
  };

  const getStatusTextColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return '#92400e'; // yellow text
      case 'confirmed':
        return '#065f46'; // green text
      case 'completed':
        return '#1e40af'; // blue text
      case 'cancelled':
        return '#dc2626'; // red text
      default:
        return '#374151'; // gray text
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        const response = await fetch(`${import.meta.env.VITE_FETCH_API}/api/bookings/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete booking');
        }
        navigate('/all-bookings');
      } catch (err) {
        alert('Error deleting booking: ' + err.message);
      }
    }
  };

  const handleBookingUpdated = () => {
    fetchBookingDetails(); // Refresh the booking details
  };

  const handleStatusUpdate = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_FETCH_API}/api/bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: selectedStatus }),
      });
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      const updatedBooking = await response.json();
      setBooking(updatedBooking.booking);
      alert('Status updated successfully!');
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="booking-details-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="booking-details-container">
        <div className="error-container">
          <h2>Booking Not Found</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/')} className="back-button">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="booking-details-container">
        <div className="error-container">
          <h2>Booking Not Found</h2>
          <p>The booking you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/')} className="back-button">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-details-container">
      <div className="booking-details-header">
        <button onClick={() => navigate('/')} className="back-button">
          ← Back
        </button>
        <div className="header-content">
          <h1 className="booking-title">Booking Details</h1>
          <span
            className="status-badge-large"
            style={{
              backgroundColor: getStatusColor(booking.status),
              color: getStatusTextColor(booking.status)
            }}
          >
            {booking.status}
          </span>
        </div>
        <div className="header-actions">
          <button onClick={() => setShowEditForm(true)} className="edit-button">
            ✏️ Edit
          </button>
          <button onClick={handleDelete} className="delete-button">
            🗑️ Delete
          </button>
        </div>
      </div>

      <div className="booking-details-content">
        <div className="details-section">
          <h2 className="section-title">Customer</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Name</span>
              <span className="info-value">{booking.customerName}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email</span>
              <span className="info-value">{booking.customerEmail}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Phone</span>
              <span className="info-value">{booking.customerMobile}</span>
            </div>
          </div>
        </div>

        <div className="details-section">
          <h2 className="section-title">Vehicle</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Car</span>
              <span className="info-value">{booking.carName}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Model</span>
              <span className="info-value">{booking.carModel}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Type</span>
              <span className="info-value">{booking.carType}</span>
            </div>
          </div>
        </div>

        <div className="details-section">
          <h2 className="section-title">Service</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Type</span>
              <span className="info-value">{booking.carWashType}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Duration</span>
              <span className="info-value">{booking.carWashDuration}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Price</span>
              <span className="info-value price-highlight">₹{booking.carWashPrice}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Booking Date</span>
              <span className="info-value">{formatDate(booking.bookingDate)}</span>
            </div>
          </div>
        </div>

        <div className="details-section">
          <h2 className="section-title">Update Status</h2>
          <div className="status-update-container">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="status-select"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              onClick={handleStatusUpdate}
              disabled={selectedStatus === booking.status}
              className="update-status-button"
            >
              Update Status
            </button>
          </div>
        </div>
      </div>

      {/* Edit Booking Form Modal */}
      {showEditForm && (
        <AddBookingForm
          bookingToEdit={booking}
          onClose={() => setShowEditForm(false)}
          onBookingAdded={handleBookingUpdated}
        />
      )}
    </div>
  );
};

export default BookingDetails;