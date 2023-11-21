import mongoose from 'mongoose';

const bookingsCategorySchema = new mongoose.Schema({
    category_name: {type: String,
        required: [true, 'Category has to have a name']}
});

export default mongoose.model('bookings_categories', bookingsCategorySchema);
