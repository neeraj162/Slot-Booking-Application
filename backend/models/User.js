const mongoose = require('mongoose');
const { Schema } = mongoose;



const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    otp : {
        type: String
    },
    bookings : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
    }],
});
                
module.exports = mongoose.model('User', UserSchema);