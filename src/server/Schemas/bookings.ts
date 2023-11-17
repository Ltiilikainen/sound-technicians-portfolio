import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    start_date: String, //ISO Date string
    end_date: String, //ISO Date string
});

export default mongoose.model('bookings', bookingSchema);