import mongoose, {Schema} from 'mongoose';
import equipment_parents from './equipment_parents';
import bookings from './bookings';

const equipmentChildSchema: Schema = new mongoose.Schema({
    description: {
        type: Schema.Types.ObjectId,
        ref: equipment_parents,
        required: true
    },
    bookings: [{
        type: Schema.Types.ObjectId,
        ref: bookings,
    }],
}, {query: {
    populatePaths() {
        return this.populate({path: 'description', populate: [{path: 'type'}, {path: 'image'}]})
            .populate('bookings')
            .exec();
    }
}});

export default mongoose.model('equipment_individuals', equipmentChildSchema);