import mongoose, {Schema} from 'mongoose';
import equipment_parents from './equipment_parents';
import main_bookings from './main_bookings';
import equipment_only_bookings from './equipment_only_bookings';

const equipmentChildSchema: Schema = new mongoose.Schema({
    parent_id: {
        type: Schema.Types.ObjectId,
        ref: equipment_parents,
    },
    bookings: [{
        type: Schema.Types.ObjectId,
        ref: [main_bookings, equipment_only_bookings]
    }],
});

export default mongoose.model('equipment_children', equipmentChildSchema);