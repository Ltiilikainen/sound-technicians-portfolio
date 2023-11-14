import mongoose from 'mongoose';

const equipmentTypeSchema = new mongoose.Schema({
    type_name: String
});

export default mongoose.model('equipment_types', equipmentTypeSchema);