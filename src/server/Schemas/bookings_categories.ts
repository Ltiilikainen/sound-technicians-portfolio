import mongoose from 'mongoose';

const bookingsCategorySchema = new mongoose.Schema({
    category_name: String
});

export default mongoose.model('bookings_categories', bookingsCategorySchema);
