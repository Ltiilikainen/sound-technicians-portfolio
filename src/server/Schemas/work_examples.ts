import mongoose, {Schema} from 'mongoose';
import uploads from './uploads';

const workExampleSchema = new mongoose.Schema({
    file: {
        type: Schema.Types.ObjectId,
        ref: uploads,
        required: true
    },
    occasion: String
});

export default mongoose.model('work_examples', workExampleSchema);