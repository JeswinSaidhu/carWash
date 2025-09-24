const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    carName: {
        type: String,
        required: true
    },
    carModel: {
        type: String,
        required: true
    },
    carType: {
        type: String,
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    customerEmail: {
        type: String,
        required: true
    },
    customerMobile: {
        type: Number,
        required: true
    },
    bookingDate: {
        type: Date,
        required: true
    },
    carWashType: {
        type: String,
        required: true
    },
    carWashDuration: {
        type: String,
        required: true
    },
    carWashPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: 'pending'
    },
});

module.exports = mongoose.model('Booking', bookingSchema);