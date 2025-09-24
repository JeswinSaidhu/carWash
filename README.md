# Car Wash Booking System

## Overview

This is a full-stack car wash booking management system built with React (Vite) frontend and Node.js/Express backend with MongoDB database. The application allows users to create, view, edit, and delete car wash bookings with a modern, responsive interface.

## Features

- **Booking Management**: Create, read, update, and delete car wash bookings
- **Status Tracking**: Track booking status (Pending, Confirmed, Completed, Cancelled)
- **Filtering & Sorting**: Filter by car type and wash type, sort by date or price
- **Responsive Design**: Mobile-friendly interface with modern UI
- **Real-time Updates**: Live status updates and booking modifications

## Tech Stack

### Frontend

- **React** with Vite
- **CSS** for styling
- **React Router** for navigation

### Backend

- **Node.js** with Express
- **MongoDB** with Mongoose
- **CORS** for cross-origin requests

## Folder Structure

```
carWashAssessment/
├── backend/
│   ├── db/
│   │   └── model.js          # MongoDB schema definitions
│   ├── routes/
│   │   └── bookingRoutes.js  # API endpoints for bookings
│   ├── .env                  # Backend environment variables
│   ├── index.js              # Express server setup
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddBookingForm.jsx    # Booking creation/editing form
│   │   │   ├── AllBookings.jsx       # Bookings list with filters
│   │   │   ├── BookingDetails.jsx    # Individual booking details
│   │   │   ├── Hero.jsx              # Home page with pending bookings
│   │   │   ├── Navbar.jsx            # Navigation component
│   │   │   └── *.css                 # Component styles
│   │   ├── App.jsx                   # Main app component
│   │   ├── main.jsx                  # App entry point
│   │   └── index.css                 # Global styles
│   ├── .env                          # Frontend environment variables
│   ├── package.json
│   ├── package-lock.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── index.html
└── README.md
```

## Environment Setup

### Backend (.env in backend/ folder)

```
MONGO_URI = "your_mongodb_connection_string"
PORT = 3000
CORS_ORIGIN = "your_local_frontend_string"
```

### Frontend (.env in frontend/ folder)

```
VITE_PORT = 3000
```

**Important**: The `PORT` in backend/.env and `VITE_PORT` in frontend/.env must be the same value (e.g., both set to 3000) for the frontend to communicate with the backend API.

## Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB instance
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
# Create backend/.env with your MongoDB URI and PORT
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
# Create frontend/.env with VITE_PORT matching backend PORT
npm run dev
```

### Running the Application

1. Start the backend server: `cd backend && npm start`
2. Start the frontend development server: `cd frontend && npm run dev`

## API Endpoints

### Bookings

- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/pending` - Get pending bookings
- `GET /api/bookings/:id` - Get booking by ID
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Delete booking

### Search

- `GET /api/bookings/search?q=search_term` - Search bookings by car name or customer name

## Database Schema

### Booking Model

```javascript
{
  carName: String,
  carModel: String,
  carType: String,
  customerName: String,
  customerEmail: String,
  customerMobile: String,
  bookingDate: Date,
  carWashType: String,
  carWashDuration: String,
  carWashPrice: Number,
  status: String (pending/confirmed/completed/cancelled)
}
```

## Screenshots

### Home Page

![Home Page](./screenshots/home-page.png)

### All Bookings

![All Bookings](./screenshots/all-bookings.png)

### Booking Details

![Booking Details](./screenshots/booking-details.png)

### Add/Edit Booking

![Add Booking](./screenshots/add-booking.png)
