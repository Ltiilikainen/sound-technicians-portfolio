import mongoose from 'mongoose';

const equipmentTypeSchema = new mongoose.Schema({
    type_name: {type: String,
        required: [true, 'Equipment type must have a name']}
});

export default mongoose.model('equipment_types', equipmentTypeSchema);