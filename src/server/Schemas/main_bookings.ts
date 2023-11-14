import mongoose, {Schema} from 'mongoose';
import bookings_categories from './bookings_categories';
import equipment_children from './equipment_children';

const mainBookingSchema = new mongoose.Schema({
    start_date: String, //ISO Date string
    end_date: String, //ISO Date string
    description: String,
    display_description: Boolean,
    category_id: {
        type:  Schema.Types.ObjectId,
        ref: bookings_categories,
    },
    equipment: [{
        type: Schema.Types.ObjectId, 
        ref: equipment_children
    }]
}, {timestamps: true});

export default mongoose.model('main_bookings', mainBookingSchema);