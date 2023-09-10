const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  dateSlot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DateSlot',
  },
  timeslot: {
    type: String,
    required: true,
  },
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;