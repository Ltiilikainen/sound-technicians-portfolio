import mongoose, {Schema} from 'mongoose';
import uploads from './uploads';

const referrerSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: [true, 'Referrer name is required']},
    affiliation: {
        type: String,
        required: [true, 'Referrer affiliation is required'],
    },
    image: {
        type: Schema.Types.ObjectId,
        ref: uploads
    },
    content: {
        type: String,
        required: [true, 'Reference text is required']}
}, {query:
{populatePaths() {
    return this.populate('image').exec();
}}});

export default mongoose.model('referrers', referrerSchema);