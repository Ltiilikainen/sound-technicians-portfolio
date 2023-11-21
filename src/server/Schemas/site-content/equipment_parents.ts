import mongoose, {Schema} from 'mongoose';
import equipment_types from './equipment_types';
import uploads from './uploads';
import equipment_individuals from './equipment_individuals';
import bookings from './bookings';

const equipmentParentSchema = new mongoose.Schema({
    name: {type: String,
        required:  [true, 'Equipment must have a name']},
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
        ref: equipment_individuals,
    }]
}, {query: {
    populatePaths() {
        return this.populate('type')
            .populate('image')
            .populate({path: 'individuals', model: equipment_individuals, select: 'bookings', populate:{path: 'bookings', model: bookings}})
            .exec();
    }
}});

export default mongoose.model('equipment_parents', equipmentParentSchema);