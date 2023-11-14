import mongoose from 'mongoose';

const bookingsCategorySchema = new mongoose.Schema({
    category_name: String
});

module.exports = mongoose.model('bookings_categories', bookingsCategorySchema);
