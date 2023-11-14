import mongoose from 'mongoose';

const equipmentBookingSchema = new mongoose.Schema({
    start_date: String, //ISO date string
    end_date: String, //ISO date string
}, {timestamps:  true});

export default mongoose.model('equipment_only_bookings', equipmentBookingSchema);