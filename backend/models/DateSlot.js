const mongoose = require('mongoose');

const timeslotSchema = new mongoose.Schema({
  startTime: {
    type: String,
    required: true,
  },
  isBooked: {
    type: Boolean,
    default: false,
  },
});

const dateSlotSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
    unique: true,
  },
  timeslots: [timeslotSchema],
});

const DateSlot = mongoose.model('DateSlot', dateSlotSchema);

module.exports = DateSlot;