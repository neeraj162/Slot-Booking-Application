# AppointEase - MERN Stack Appointment Booking App

Welcome to AppointEase – your hassle-free appointment booking website! We understand the importance of managing your time efficiently, and that's why we've created a seamless platform that lets you effortlessly schedule and manage your appointments.

## About Website

This is a simple web application built using the MERN (MongoDB, Express, React, Node.js) stack that allows users to book appointments by selecting available dates and time slots. The application utilizes React+TypeScript for the frontend UI, providing a robust and type-safe development experience.

## Features
### Main features
* Login with Email and OTP: Users can log in using their email addresses and receive a one-time password (OTP) for authentication.
* Calendar View: Users can view a calendar that displays available dates for booking appointments.
* Date Selection: Users can navigate through the calendar and select a specific date to see the available time slots.
* Time Slot Booking: Once a user selects a date, they can view the available time slots for that date and book an appointment in either 30-minute or 1-hour intervals.
* Appointment Management: Users have the ability to cancel their booked appointments, freeing up the time slot for other users.

### Additional features
* About Page
* Amazing UI with designs

## Project Setup
* Clone the repository.
* Install Node.js, npm/yarn and mongoDB on your system.
### Frontend
* Navigate to the frontend folder './frontend'.
```
cd ./frontend
```
* run npm install to install the required packages.
```
npm install
```
* update the baseURL to the backend server in "./src/api/axios.js"
```
export default axios.create({
    baseURL: "backend_url",
});
```
* Run npm start to start the application
```
npm start
```
### Backend
* Navigate to the backend folder './backend'.
```
cd ./backend
```
* run npm install to install the required packages.
```
npm install
```
* Create a .env file in the current directory and add the following environment variables:
```
DATABASE_URI=<Your MongoDB atlas database url>
user=<Your Google Mail id>
pass=<Your Google Password>
```
* update the whitelist to the frontend server in "./config/corsOptions.js"
```
const whitelist = [
    'frontend_url',
];
```
* Run the server by using this command
```
node index.js
```
## Conclusion
The MERN Stack Appointment Booking App excels not only in its practical functionality but also in its exceptional visual appeal. With a seamless user experience complemented by stunning UI designs, the app sets a new standard for appointment scheduling while delighting users with its aesthetics.

