import mongoose, {Schema} from 'mongoose';
import bookings from './bookings';
import bookings_categories from './bookings_categories';
import equipment_individuals from './equipment_individuals';

const mainBookingSchema = new mongoose.Schema({
    time_id: {
        type: Schema.Types.ObjectId,
        ref: bookings
    },
    description: String,
    display_description: Boolean,
    category_id: {
        type:  Schema.Types.ObjectId,
        ref: bookings_categories,
    },
    equipment: [{
        type: Schema.Types.ObjectId, 
        ref: equipment_individuals
    }]
}, {timestamps: true});

export default mongoose.model('main_bookings', mainBookingSchema);