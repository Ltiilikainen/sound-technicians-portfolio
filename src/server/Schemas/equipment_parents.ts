import mongoose from 'mongoose';

const equipmentParentSchema = new mongoose.Schema({
    equipment_name: String,
    equipment_type: {
        type: String, //foreign key - equipment_types
        ref: 'equipment_types'
    },
    image: {
        type: String, //foreing key - uploads
        ref: 'uploads',
    },
    specs: String,
    children: {
        type: Array<string>, //foreign key - equipment_children
        ref: 'equipment_children'
    }
});

module.exports = mongoose.model('equipment_parents', equipmentParentSchema);