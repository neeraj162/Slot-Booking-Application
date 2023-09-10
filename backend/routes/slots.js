const express = require('express');
const router = express.Router();
const User = require('../models/User');
const DateSlot = require('../models/DateSlot');
const Booking = require('../models/Booking');
// const moment = require('moment');
const moment = require('moment-timezone');


// ROUTE 1: retrieve user booked appointements
router.post('/getslots', async (req, res) => {
    try {
        const email = req.body.email; // Assuming the user's email is passed as a body
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const bookings = await Booking.find({ user: user._id }).populate('dateSlot');

        // const currentDate = moment().format('YYYY-MM-DD');
        const currentDate = moment().tz('Asia/Kolkata').format('YYYY-MM-DD');

        // const currentTime = moment();
        // let formattedTime = currentTime.format('H:mm');
        formattedTime = moment().tz('Asia/Kolkata').format('H:mm');
        // console.log(currentDate,formattedTime)

        const bookedDateTimeslots = [];
        const expiredDateTimeslots = [];

        bookings.forEach(booking => {
            const date = booking.dateSlot.date;
            const timeslot = booking.dateSlot.timeslots.find(slot => slot.startTime === booking.timeslot);
            const id = booking._id;
            if (timeslot && timeslot.isBooked) {
                // console.log(currentDate,date);
                if (currentDate > date) {
                    expiredDateTimeslots.push({ id, date, timeslot });
                }
                else if (currentDate === date) {
                    if (timeslot.startTime.length == formattedTime.length) {
                        if (timeslot.startTime > formattedTime) {
                            bookedDateTimeslots.push({ id, date, timeslot });
                        }
                        else {
                            expiredDateTimeslots.push({ id, date, timeslot });
                        }
                    }
                    else if (timeslot.startTime.length > formattedTime.length) {
                        bookedDateTimeslots.push({ id, date, timeslot });
                    }
                    else {
                        expiredDateTimeslots.push({ id, date, timeslot });
                    }
                }
                else {
                    bookedDateTimeslots.push({ id, date, timeslot });
                }

            }
        });

        bookedDateTimeslots.sort((a, b) => {
            // Compare dates
            if (a.date < b.date) return -1;
            if (a.date > b.date) return 1;

            // Dates are equal, compare start times
            const startTimeA = a.timeslot.startTime;
            const startTimeB = b.timeslot.startTime;
            if (startTimeA < startTimeB) return -1;
            if (startTimeA > startTimeB) return 1;

            return 0;
        });
        expiredDateTimeslots.sort((a, b) => {
            // Compare dates
            if (a.date < b.date) return -1;
            if (a.date > b.date) return 1;

            // Dates are equal, compare start times
            const startTimeA = a.timeslot.startTime;
            const startTimeB = b.timeslot.startTime;
            if (startTimeA < startTimeB) return -1;
            if (startTimeA > startTimeB) return 1;

            return 0;
        });


        res.status(200).json({
            bookedDateTimeslots: bookedDateTimeslots,
            expiredDateTimeslots: expiredDateTimeslots
        });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occured");
    }
})

// ROUTE 2: book an appointment
router.post('/bookslot', async (req, res) => {
    try {
        const { email, date, timeslot } = req.body;

        // Find the user based on the provided email
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the date slot based on the provided date
        const dateSlot = await DateSlot.findOne({ date });

        if (!dateSlot) {
            return res.status(404).json({ error: 'Date slot not found' });
        }

        // Find the timeslot within the date slot
        const selectedTimeslot = dateSlot.timeslots.find(slot => slot.startTime === timeslot);

        if (!selectedTimeslot || selectedTimeslot.isBooked) {
            return res.status(400).json({ error: 'Selected timeslot is not available' });
        }

        // Create a new booking
        const booking = new Booking({
            user: user._id,
            dateSlot: dateSlot._id,
            timeslot,
        });

        // Update timeslot's availability
        selectedTimeslot.isBooked = true;
        await dateSlot.save();

        // Save the booking
        await booking.save();

        res.status(201).json({ message: 'Booking successful' });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occured");
    }
})

// ROUTE 3: Cancel an appointment
router.delete('/cancel/:bookingId', async (req, res) => {
    try {
        const bookingId = req.params.bookingId;

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Find the associated date slot
        const dateSlot = await DateSlot.findById(booking.dateSlot);

        if (!dateSlot) {
            return res.status(404).json({ error: 'Date slot not found' });
        }

        // Find the associated timeslot and mark it as available
        const timeslot = dateSlot.timeslots.find(slot => slot.startTime === booking.timeslot);

        if (timeslot) {
            timeslot.isBooked = false;
            await dateSlot.save();
        }

        // Delete the booking
        await Booking.findByIdAndDelete(bookingId);
        res.status(200).json({ message: 'Booking canceled successfully' });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occured");
    }
});

// ROUTE 4: retrieve timeslots available by a specific date
router.get('/:date', async (req, res) => {
    try {
        const date = req.params.date;
        const dateSlot = await DateSlot.findOne({ date });

        // const currentDate = moment().format('YYYY-MM-DD');


        // const currentTime = moment();
        // let formattedTime = currentTime.format('H:mm');

        const currentDate = moment().tz('Asia/Kolkata').format('YYYY-MM-DD');
        const inputDate = moment(date, 'YYYY-MM-DD');

        // const currentTime = moment();
        // let formattedTime = currentTime.format('H:mm');
        formattedTime = moment().tz('Asia/Kolkata').format('H:mm');

        // console.log(formattedTime);
        // console.log(dateSlot);
        if (!dateSlot || inputDate.isBefore(currentDate, 'day')) {
            return res.status(404).json({ error: 'Date slot not found' });
        }
        if (inputDate.isSame(currentDate, 'day')) {
            const times = dateSlot.timeslots.filter(timeslot => (!timeslot.isBooked)).map(timeslot => timeslot.startTime);
            if (!times) return res.status(404).json({ error: 'Time slot not found' });
            let timearray = [];
            for (let i = 0; i < times.length; i++) {
                // console.log(times[i], formattedTime);
                if (times[i].length == formattedTime.length) {
                    if (times[i] > formattedTime) {
                        timearray.push(times[i]);
                    }
                }
                else if (times[i].length > formattedTime.length) {
                    timearray.push(times[i]);
                }
            }
            // console.log(timearray);
            res.status(200).json(timearray);
        }
        else {
            const times = dateSlot.timeslots.filter(timeslot => !timeslot.isBooked).map(timeslot => timeslot.startTime);
            res.status(200).json(times);
        }
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occured");
    }
})

// ROUTE-5: get all available dates



module.exports = router;
