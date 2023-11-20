import referrers from '../Schemas/referrers';
import work_examples from '../Schemas/work_examples';
import main_bookings from '../Schemas/main_bookings';
import equipment_parents from '../Schemas/equipment_parents';
import uploads from '../Schemas/uploads';

function readRefs (query?: {[key:string]: unknown}) {
    if(query?.sample) return referrers.aggregate([{$sample: {size: 3}}, {$addFields: {'image': {$toObjectId: '$image'}}}, {$lookup: {from: 'uploads', localField: 'image', foreignField: '_id', as: 'image'}}]);
    if(query) return referrers.find(query).populatePaths();
    else return referrers.find().populatePaths();
}

function readWorkExamples (query?: {[key:string]: unknown}) {
    if(query?.sample) return work_examples.aggregate([{$sample: {size: 2}}, {$addFields: {'file': {$toObjectId: '$file'}}}, {$lookup: {from: 'uploads', localField: 'file', foreignField: '_id', as: 'file'}}]);
    if(query) return work_examples.find(query).populatePaths();
    else return work_examples.find().populatePaths();
}

function readBookings (query?: {[key:string]: unknown}) {
    if(query) return main_bookings.find(query).populatePaths();
    else return main_bookings.find().populatePaths();
}

function readEquipment (query?: {[key:string]: unknown}) {
    if(query) return equipment_parents.find(query).populatePaths();
    else return equipment_parents.find().populatePaths();
}

function readUploads (query?: {[key:string]: unknown}) {
    if(query) return uploads.find(query).populatePaths();
    else return uploads.find().populatePaths();
}

export default {readRefs, readWorkExamples, readBookings, readEquipment, readUploads};