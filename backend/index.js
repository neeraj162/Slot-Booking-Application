const connectDB = require('./db');
const dotenv = require("dotenv");
const express = require('express');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const mongoose = require("mongoose");
const app = express()
const PORT = process.env.PORT || 4500

// Load environment variables from .env file
dotenv.config();

// conntect to mongoDB
connectDB()

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built in middleware for exchanging data in json
app.use(express.json())

// Available routes
app.use('/auth', require('./routes/auth'));
app.use('/slots', require('./routes/slots'));

mongoose.connection.once('open', () => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
