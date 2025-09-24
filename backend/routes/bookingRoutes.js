// Import required modules
const express = require('express');
const router = express.Router();
const Booking = require('../db/model');

// POST /api/bookings - Create new booking
router.post('/', async (req, res) => {
    try {
        const { carName, carModel, carType, customerName, customerEmail, customerMobile, bookingDate, carWashType, carWashDuration, carWashPrice, status } = req.body;
        // Parse bookingDate from DD/MM/YYYY to Date object
        const [day, month, year] = bookingDate.split('/');
        const parsedBookingDate = new Date(`${year}-${month}-${day}`);
        const booking = new Booking({
            carName,
            carModel,
            carType,
            customerName,
            customerEmail,
            customerMobile,
            bookingDate: parsedBookingDate,
            carWashType,
            carWashDuration,
            carWashPrice,
            status
        });
        await booking.save();
        res.status(201).json({ message: 'Booking successful', booking });
    } catch (error) {
        res.status(400).json({ message: 'Booking failed', error: error.message });
    }
});

// GET /api/bookings - Get all bookings
router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving bookings', error: error.message });
    }
});

// GET /api/bookings/pending - Get pending bookings
router.get('/pending', async (req, res) => {
    try {
        const pendingBookings = await Booking.find({ status: 'pending' });
        res.json(pendingBookings);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving pending bookings', error: error.message });
    }
})

router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        const searchRegex = new RegExp(q, 'i');
        const bookings = await Booking.find({
            $or: [
                { carName: searchRegex },
                { customerName: searchRegex }
            ]
        });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error searching bookings', error: error.message });
    }
})

// PUT /api/bookings/:id - Update booking
router.put('/:id', async (req, res) => {
    try {
        const { status, customerName, customerMobile, customerEmail, carName, carType, carModel, carWashPrice, carWashDuration, bookingDate } = req.body;
        const updateData = {};

        // Build update object with provided fields
        if (status !== undefined) updateData.status = status;
        if (customerName !== undefined) updateData.customerName = customerName;
        if (customerMobile !== undefined) updateData.customerMobile = customerMobile;
        if (customerEmail !== undefined) updateData.customerEmail = customerEmail;
        if (carName !== undefined) updateData.carName = carName;
        if (carType !== undefined) updateData.carType = carType;
        if (carModel !== undefined) updateData.carModel = carModel;
        if (carWashPrice !== undefined) updateData.carWashPrice = carWashPrice;
        if (carWashDuration !== undefined) updateData.carWashDuration = carWashDuration;

        // Handle date conversion
        if (bookingDate !== undefined) {
            const [day, month, year] = bookingDate.split('/');
            updateData.bookingDate = new Date(`${year}-${month}-${day}`);
        }

        const booking = await Booking.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        res.json({ message: 'Booking updated successfully', booking });
    } catch (error) {
        res.status(400).json({ message: 'Booking update failed', error: error.message });
    }
});

// DELETE /api/bookings/:id - Delete booking
router.delete('/:id', async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        res.json({ message: 'Booking deleted successfully', booking });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting booking', error: error.message });
    }
})

router.get('/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving booking', error: error.message });
    }
})

router.put('/:id', async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        res.json(booking);
    } catch (error) {
        res.status(400).json({ message: 'Update failed', error: error.message });
    }
})

module.exports = router;