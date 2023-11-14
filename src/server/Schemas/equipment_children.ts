import mongoose from 'mongoose';

const equipmentChildSchema = new mongoose.Schema({
    parent_id: {
        type: String, //foreign key - equipment_parents
        ref: 'equipment_parents',
    },
    bookings: Array<string>, //foreign keys - main_bookings, equipment_only_bookings
});

module.exports = mongoose.model('equipment_children', equipmentChildSchema);