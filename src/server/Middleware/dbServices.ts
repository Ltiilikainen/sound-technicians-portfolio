import referrers from '../Schemas/site-content/referrers';
import work_examples from '../Schemas/site-content/work_examples';
import main_bookings from '../Schemas/site-content/main_bookings';
import equipment_parents from '../Schemas/site-content/equipment_parents';
import uploads from '../Schemas/site-content/uploads';
import user_data from '../Schemas/user/user_data';

/*References*/
function readRefs (query?: {[key:string]: unknown}) {
    if(query?.sample) return referrers.aggregate([{$sample: {size: 3}}, {$addFields: {'image': {$toObjectId: '$image'}}}, {$lookup: {from: 'uploads', localField: 'image', foreignField: '_id', as: 'image'}}]);
    if(query) return referrers.find(query).populatePaths();
    else return referrers.find().populatePaths();
}

/*Workd Examples*/
function readWorkExamples (query?: {[key:string]: unknown}) {
    if(query?.sample) return work_examples.aggregate([{$sample: {size: 2}}, {$addFields: {'file': {$toObjectId: '$file'}}}, {$lookup: {from: 'uploads', localField: 'file', foreignField: '_id', as: 'file'}}]);
    if(query) return work_examples.find(query).populatePaths();
    else return work_examples.find().populatePaths();
}

function addWorkExample (file:string, occasions: string) {
    return work_examples.create({file, occasions});
}

/*Bookings*/
function readBookings (query?: {[key:string]: unknown}) {
    if(query) return main_bookings.find(query).populatePaths();
    else return main_bookings.find().populatePaths();
}

/*Equipment*/
function readEquipment (query?: {[key:string]: unknown}) {
    if(query) return equipment_parents.find(query).populatePaths();
    else return equipment_parents.find().populatePaths();
}

/*Uploads*/
function readUploads (query?: {[key:string]: unknown}) {
    if(query) return uploads.find(query).populatePaths();
    else return uploads.find().populatePaths();
}

function addUpload (fileType: string, folder: string, file: string, tag: string) {
    const path = '/src/files/' + folder + '/' + file;
    return uploads.create({type: fileType, path, tag});
}

/*User*/
function readUser (query: {[key:string]: unknown}) {
    return user_data.find(query);
}

export default {
    readRefs, 
    readWorkExamples, 
    addWorkExample,
    readBookings, 
    readEquipment, 
    readUploads, 
    addUpload,
    readUser
};