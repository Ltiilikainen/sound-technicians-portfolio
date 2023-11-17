import mongoose, {Schema} from 'mongoose';
import equipment_types from './equipment_types';
import uploads from './uploads';
import equipment_children from './equipment_individuals';

const equipmentParentSchema = new mongoose.Schema({
    name: String,
    type: {
        type: Schema.Types.ObjectId, //foreign key - equipment_types
        ref: equipment_types
    },
    image: {
        type: Schema.Types.ObjectId, //foreing key - uploads
        ref: uploads,
    },
    specs: String,
    individuals: [{
        type: Schema.Types.ObjectId, 
        ref: equipment_children,
    }]
});

export default mongoose.model('equipment_parents', equipmentParentSchema);