import mongoose from 'mongoose';

const mainBookingSchema = new mongoose.Schema({
    start_date: String, //ISO Date string
    end_date: String, //ISO Date string
    description: String,
    display_description: Boolean,
    category_id: {
        type:  String, //foreign key - bookings_categories
        ref: 'bookings_categories',
    },
    equipment: {
        type: Array<string>, //foreign keys - equipment_children
        ref: 'equipment_children',}
}, {timestamps: true});

module.exports = mongoose.model('main_bookings', mainBookingSchema);