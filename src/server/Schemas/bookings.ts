import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    start_date: {type: String, //ISO Date string
        required: [true, 'Start date is required']},
    end_date:{ type:  String, //ISO Date string
        required: [true, 'End date is required']}
});

export default mongoose.model('bookings', bookingSchema);