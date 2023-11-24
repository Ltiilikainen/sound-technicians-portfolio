import referrers from '../Schemas/site-content/referrers';
import work_examples from '../Schemas/site-content/work_examples';
import main_bookings from '../Schemas/site-content/main_bookings';
import equipment_parents from '../Schemas/site-content/equipment_parents';
import uploads from '../Schemas/site-content/uploads';
import user_data from '../Schemas/user/user_data';
import fs from 'fs';

/*References*/
function readRefs (query?: {[key:string]: unknown}) {
    if(query?.sample) return referrers.aggregate([{$sample: {size: 3}}, {$addFields: {'image': {$toObjectId: '$image'}}}, {$lookup: {from: 'uploads', localField: 'image', foreignField: '_id', as: 'image'}}]);
    if(query) return referrers.find(query).populatePaths();
    else return referrers.find().populatePaths();
}

function addRef(data: {name: string, affiliation: string, content: string, image?: string}) {
    return referrers.create(data);
}

async function updateRef(id: string, data: {name?: string, affiliation?: string, content?: string, image?: string}) {
    const referrer = await referrers.findOneAndUpdate({_id: id}, data);

    if(!referrer) {
        throw new Error('Could not find document ' + id);
    } else {
        if(data.image) {
            const file = await uploads.findByIdAndDelete({_id: referrer.image});
            if(!file) {
                throw new Error('Could not find file ' + referrer.image);
            } else {
                try {
                    file && fs.unlink(`.${file.path}`, () => {
                        return true;
                    });
                } catch (e) {
                    await uploads.create(file);
                    throw new Error('File deletion failed');
                }
            }
        } else {
            return true;
        }
    }
}

async function deleteRef(id: string) {
    const referrer = await referrers.findOneAndDelete({_id: id});
    if(!referrer) {
        throw new Error('Could not find document ' + id);
    } else {
        if(referrer.image) {
            const file = await uploads.findByIdAndDelete({_id: referrer.image});
            if(!file) {
                throw new Error('Could not find file ' + referrer.image);
            } else {
                try {
                    file && fs.unlink(`.${file.path}`, () => {
                        return referrer;
                    });
                } catch (e) {
                    await uploads.create(file);
                    await referrers.create(referrer);
                    throw new Error('File deletion failed');
                }
            }
        } else {
            return referrer;
        }
    }
}

/*Work Examples*/
function readWorkExamples (query?: {[key:string]: unknown}) {
    if(query?.sample) return work_examples.aggregate([{$sample: {size: 2}}, {$addFields: {'file': {$toObjectId: '$file'}}}, {$lookup: {from: 'uploads', localField: 'file', foreignField: '_id', as: 'file'}}]);
    if(query) return work_examples.find(query).populatePaths();
    else return work_examples.find().populatePaths();
}

function addWorkExample (file:string, occasions: string) {
    return work_examples.create({file, occasions});
}

async function updateWorkExample (id: string, data: {file?: string, occasions?: string}) {
    const example = await work_examples.findOneAndUpdate({_id: id}, data);

    if(!example) {
        throw new Error('Could not find document ' + id);
    } else {
        if(data.file) {
            const file = await uploads.findByIdAndDelete({_id: example.file});
            if(!file) {
                throw new Error('Could not find file ' + example.file);
            } else {
                try {
                    file && fs.unlink(`.${file.path}`, () => {
                        return true;
                    });
                } catch (e) {
                    await uploads.create(file);
                    throw new Error('File deletion failed');
                }
            }
        } else {
            return true;
        }
        console.log('This is the return value from update example');
        console.log(example);
    }
}

async function deleteWorkExample (id: string) {
    const example = await work_examples.findOneAndDelete({_id: id});
    if(!example) {
        throw new Error('Could not find document ' + id);
    } else {
        const file = await uploads.findByIdAndDelete({_id: example.file});
        if(!file) {
            throw new Error('Could not find file ' + example.file);
        } else {
            try {
                file && fs.unlink(`.${file.path}`, () => {
                    return true;
                });
            } catch (e) {
                await uploads.create(file);
                await work_examples.create(example);
                throw new Error('File deletion failed');
            }
        }
    }
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
    addRef,
    updateRef,
    deleteRef,

    readWorkExamples, 
    addWorkExample,
    updateWorkExample,
    deleteWorkExample,

    readBookings, 
    readEquipment, 
    readUploads, 
    addUpload,
    readUser
};