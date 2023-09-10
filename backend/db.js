const mongoose = require('mongoose');

const connectDB = async () => {
    mongoose.connect(process.env.DATABASE_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log('Connected to MongoDB');
      })
      .catch((error) => {
        console.log('Error connecting to MongoDB', error);
      });
}

module.exports = connectDB