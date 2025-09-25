import React, { useState, useEffect } from 'react';
import './AddBookingForm.css';

const AddBookingForm = ({ onClose, onBookingAdded, bookingToEdit }) => {
  const [formData, setFormData] = useState({
    carName: '',
    carModel: '',
    carType: '',
    customerName: '',
    customerEmail: '',
    customerMobile: '',
    bookingDate: '',
    carWashType: '',
    carWashDuration: '',
    carWashPrice: '',
    status: 'pending'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (bookingToEdit) {
      const date = new Date(bookingToEdit.bookingDate);
      const formattedDate = !isNaN(date.getTime()) ? date.toISOString().split('T')[0] : ''; // YYYY-MM-DD or empty if invalid
      setFormData({
        carName: bookingToEdit.carName || '',
        carModel: bookingToEdit.carModel || '',
        carType: bookingToEdit.carType || '',
        customerName: bookingToEdit.customerName || '',
        customerEmail: bookingToEdit.customerEmail || '',
        customerMobile: bookingToEdit.customerMobile || '',
        bookingDate: formattedDate,
        carWashType: bookingToEdit.carWashType || '',
        carWashDuration: bookingToEdit.carWashDuration || '',
        carWashPrice: bookingToEdit.carWashPrice || '',
        status: bookingToEdit.status || 'pending'
      });
    }
  }, [bookingToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Format bookingDate to DD/MM/YYYY for backend
      const [year, month, day] = formData.bookingDate.split('-');
      const formattedDate = `${day}/${month}/${year}`;

      const submitData = { ...formData, bookingDate: formattedDate };

      const url = bookingToEdit
        ? `${import.meta.env.VITE_FETCH_API}/api/bookings/${bookingToEdit._id}`
        : `${import.meta.env.VITE_FETCH_API}/api/bookings`;

      const method = bookingToEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${bookingToEdit ? 'update' : 'create'} booking`);
      }

      const result = await response.json();
      setSuccess(true);

      if (!bookingToEdit) {
        // Reset form only for new bookings
        setFormData({
          carName: '',
          carModel: '',
          carType: '',
          customerName: '',
          customerEmail: '',
          customerMobile: '',
          bookingDate: '',
          carWashType: '',
          carWashDuration: '',
          carWashPrice: '',
          status: 'pending'
        });
      }

      // Notify parent component
      if (onBookingAdded) {
        onBookingAdded();
      }

      // Close form after a delay
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-overlay">
      <div className="form-container">
        <div className="form-header">
          <h2>{bookingToEdit ? 'Edit Booking' : 'Add New Booking'}</h2>
          <button onClick={onClose} className="close-button">×</button>
        </div>

        {success && (
          <div className="success-message">
            ✓ Booking {bookingToEdit ? 'updated' : 'created'} successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-section">
            <div className="section-icon"></div>
            <h3>👤 Customer Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <input
                  type="text"
                  name="customerName"
                  placeholder="Customer Name"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="email"
                  name="customerEmail"
                  placeholder="Email Address"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="tel"
                  name="customerMobile"
                  placeholder="Phone Number"
                  value={formData.customerMobile}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="section-icon"></div>
            <h3>🚗 Vehicle Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <input
                  type="text"
                  name="carName"
                  placeholder="Car Brand (e.g., Toyota)"
                  value={formData.carName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="carModel"
                  placeholder="Car Model (e.g., Camry)"
                  value={formData.carModel}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <select
                  name="carType"
                  value={formData.carType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Car Type</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Coupe">Coupe</option>
                  <option value="Truck">Truck</option>
                  <option value="Van">Van</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="section-icon"></div>
            <h3>🧽 Service Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <input
                  type="date"
                  name="bookingDate"
                  value={formData.bookingDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <select
                  name="carWashType"
                  value={formData.carWashType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Service</option>
                  <option value="Basic Wash">Basic Wash</option>
                  <option value="Premium Wash">Premium Wash</option>
                  <option value="Deluxe Wash">Deluxe Wash</option>
                  <option value="Interior Cleaning">Interior Cleaning</option>
                  <option value="Full Service">Full Service</option>
                </select>
              </div>

              <div className="form-group">
                <select
                  name="carWashDuration"
                  value={formData.carWashDuration}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Duration</option>
                  <option value="30 minutes">30 minutes</option>
                  <option value="1 hour">1 hour</option>
                  <option value="1.5 hours">1.5 hours</option>
                  <option value="2 hours">2 hours</option>
                </select>
              </div>

              <div className="form-group">
                <input
                  type="number"
                  name="carWashPrice"
                  placeholder="Price (₹)"
                  value={formData.carWashPrice}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? (bookingToEdit ? 'Updating...' : 'Creating...') : (bookingToEdit ? 'Update Booking' : 'Create Booking')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookingForm;
