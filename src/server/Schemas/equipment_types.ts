import mongoose from 'mongoose';

const equipmentTypeSchema = new mongoose.Schema({
    type_name: String
});

module.exports = mongoose.model('equipment_types', equipmentTypeSchema);