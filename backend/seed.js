const mongoose = require('mongoose');
const DateSlot = require('./models/DateSlot');
const dotenv = require("dotenv");

dotenv.config();

mongoose.connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.log('Error connecting to MongoDB', error);
});

const startDate = new Date('2023-09-10'); // Today's date
startDate.setHours(8, 0, 0, 0); // Set to 8:00 AM

const availableDates = [];

for (let i = 0; i < 20; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i); // Increment day by i

    const timeslots = [];
    for (let hour = 8; hour <= 12; hour++) { // Loop from 8:00 AM to 12:00 PM
        timeslots.push({
            startTime: `${hour}:00`
        });
    }
    for (let hour = 16; hour <= 22; hour++) { // Loop from 4:00 PM to 10:00 PM
        timeslots.push({
            startTime: `${hour}:00`
        });
    }

    availableDates.push({
        date: date.toISOString().slice(0, 10),
        timeslots: timeslots,
    });
}

async function seedDatabase() {
    try {
        await DateSlot.insertMany(availableDates);
        console.log('Database seeded successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        mongoose.disconnect();
    }
}

seedDatabase();
