import mongoose from 'mongoose';

const uploadSchema = new mongoose.Schema({
    type: String,
    path: String,
    tag: String
}, {query:
{
    selectImages() {
        return this.where({$or: [{type: 'jpg'}, {type: 'jpeg'}, {type: 'png'}, {type: 'gif'}]});
    },
    selectAudio() {
        return this.where({$or: [{type: 'mp3'}, {type: 'wav'}, {type: 'ogg'}]});
    },
    selectVideo() {
        return this.where({$or: [{type: 'mp4'}, {type: 'avi'}, {type: 'wmv'}, {type: 'mpg'}, {type: 'mpeg'}]});
    }
}});

export default mongoose.model('uploads', uploadSchema);