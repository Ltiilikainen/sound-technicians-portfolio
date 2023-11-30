import {Types} from 'mongoose';
import referrers from '../Schemas/site-content/referrers';
import work_examples from '../Schemas/site-content/work_examples';
import main_bookings from '../Schemas/site-content/main_bookings';
import equipment_parents from '../Schemas/site-content/equipment_parents';
import uploads from '../Schemas/site-content/uploads';
import user_data from '../Schemas/user/user_data';
import equipment_types from '../Schemas/site-content/equipment_types';
import equipment_individuals from '../Schemas/site-content/equipment_individuals';
import fs from 'fs';
import { isArray } from 'util';

/*References*/
function readRefs (query?: {[key:string]: unknown}) {
    if(query?.sample) return referrers.aggregate([{$sample: {size: 3}}, {$addFields: {'image': {$toObjectId: '$image'}}}, {$lookup: {from: 'uploads', localField: 'image', foreignField: '_id', as: 'image'}}]);
    if(query) return referrers.find(query).populatePaths();
    else return referrers.find().populatePaths();
}

async function addRef(refData: TReferenceData, image?: TFileData) {
    if(image) {
        try {
            const result = await addUpload(image);
            refData.image = result._id.toString();
        }
        catch(e) {
            console.log(e);
            throw new Error('Adding upload to database failed');
        }
    }
    return referrers.create(refData);
}

async function updateRef(id: string, refData: {name?: string, affiliation?: string, content?: string, image?: string}, image?: TFileData) {
    if(image) {
        try {
            const result = await addUpload(image);
            refData.image = result._id.toString();
        } catch (e) {
            console.log(e);
            throw new Error('Adding upload to database failed');
        }
    }
    
    const referrer = await referrers.findOneAndUpdate({_id: id}, refData);

    if(!referrer) {
        throw new Error('Could not find document ' + id);
    } else {
        if(refData.image) {
            //delete the outdated file information from the uploads collection
            const file = await uploads.findByIdAndDelete({_id: referrer.image});
            if(!file) {
                throw new Error('Could not find file ' + referrer.image);
            } else {
                try {
                    //use the file path to delete the file itself from the server
                    file && fs.unlink(`.${file.path}`, () => {
                        return referrer;
                    });
                } catch (e) {
                    await uploads.create(file);
                    throw new Error('File deletion failed');
                }
            }
        } else {
            return referrer;
        }
    }
}

async function deleteRef(id: string) {
    const referrer = await referrers.findOneAndDelete({_id: id});
    if(!referrer) {
        throw new Error('Could not find document ' + id);
    } else {
        if(referrer.image) {
            //if the reference had an associated image, delete it from its collection
            const file = await uploads.findByIdAndDelete({_id: referrer.image});
            if(!file) {
                throw new Error('Could not find file ' + referrer.image);
            } else {
                try {
                    //use the file path to also delete the file from the server
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

async function addWorkExample (fileData: TFileData, occasions: string) {
    try {
        const result = await addUpload(fileData);
        const file = result._id.toString();
        return work_examples.create({file, occasions});
    } catch(e) {
        console.log(e);
        throw new Error('Adding upload to database failed');
    }
    
}

async function updateWorkExample (id: string, data: {file?: string, occasions?: string}, newFile?: TFileData) {
    //add updated file to its collection if it exists
    if(newFile) {
        try {
            const result = await addUpload(newFile);
            //add updated file's ID to the data
            data.file = result._id.toString();
        } catch(e) {
            console.log(e);
            throw new Error('Adding upload to database failed');
        }
    }
    
    const example = await work_examples.findOneAndUpdate({_id: id}, data);

    if(!example) {
        throw new Error('Could not find document ' + id);
    } else {
        if(data.file) {
            //if file was updated, delete outdated file from database
            const file = await uploads.findByIdAndDelete({_id: example.file});
            if(!file) {
                throw new Error('Could not find file ' + example.file);
            } else {
                try {
                    //use file path to also delete outdated file from server
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

async function addEquipment (data: TEquipmentData, fileData?: TFileData) {
    console.log(data);
    console.log(fileData);
    const newEquipment: IEquipment = {
        name: data.name,
        type: '',
        specs: data.specs,
        individuals: []
    };

    try {
        if(fileData) {
            console.log('I cant read if statements lmao');
            const result = await addUpload(fileData);
            newEquipment.image = result._id.toString();
        }
        const type = await equipment_types.findOne({type_name: data.type});
        console.log(type);
        if(type === null) throw new Error('Equipment type unknown');
        newEquipment.type = type._id.toString();

        //initialise parent to get its ID
        const parent = await equipment_parents.create(newEquipment);

        //create individuals
        const individuals = await addIndividuals(parent._id, data.quantity);
        
        individuals.forEach(item => newEquipment.individuals.push(String(item._id)));
        //update parent with the array of the new individuals' IDs
        return equipment_parents.findOneAndUpdate({_id: parent._id}, {individuals: newEquipment.individuals});
    } catch(e) {
        console.log(e);
        throw new Error('Something went wrong');
    }
}

async function addIndividuals(parent_id: Types.ObjectId, quantity: string,) {
    const individualArray: {description: string, bookings: Array<string>}[] =  [];

    for(let i = 0; i < parseInt(quantity); i++) {
        individualArray.push({description: parent_id.toString(), bookings: []});
    }

    const individuals = await equipment_individuals.create(individualArray);
    return individuals;        
}

async function updateEquipment(id: string, data?: TEquimpentUpdateData, individualData?: TEquipmentIndividualFieldData) {
    const updatedData = {
        name: data?.name,
        specs: data?.specs
    };
    
    if(!individualData) {
        console.log(data);
        console.log(updatedData);
        const equipment = equipment_parents.findOneAndUpdate({_id:id}, updatedData);
        if(!equipment) throw new Error('Equipment not found');
        return equipment;
    } else {
        const equipment = await equipment_parents.findById({_id: id});
        if(!equipment) throw new Error('Couldn\'t find equipment');

        let individuals = equipment.individuals;
        
        if(individualData.newIndividuals) {
            const newIndividuals = await addIndividuals(equipment._id, individualData.newIndividuals);
            const newIds = newIndividuals.map(item => {
                if(item._id === undefined) throw new Error('Invalid individual ID');
                return (item._id as Types.ObjectId);
            });
            console.log(newIds);
            individuals = individuals.concat(newIds);
        }

        if(individualData.removedIndividuals) {
            try {
                const deleted = await deleteIndividuals(equipment._id, individualData.removedIndividuals);
                if(!isArray(deleted)) throw new Error('Deleted IDs invalid');
                const deletedIds = deleted.map(item => item._id);

                deletedIds.forEach(item => {
                    const index = individuals.indexOf(item);
                    individuals.splice(index, 1);
                });

            } catch(e) {
                console.log((e as Error).message);
                throw new Error('Failed to delete individuals');
            }   
        }
        console.log(individuals);

        if(!data){ 
            const equipment = equipment_parents.findByIdAndUpdate({_id: id}, {individuals: individuals});
            if(!equipment) throw new Error('Equipment not found');
            return equipment;
        }

        const eq = equipment_parents.findByIdAndUpdate({_id: id}, {...updatedData, individuals});
        if(!eq) throw new Error('Equipment not found');
        return eq;
    }
}

async function updateIndividual(id: string, data: TIndividualUpdateData) {
    let individual:unknown;
    if(data.removedBookings) {
        try {
            individual = await deleteEquipmentBookings(id, data.removedBookings);
        }catch (e) {
            console.log((e as Error).message);
            throw new Error('Failed to update individual at delete bookings');
        }
    }
    if(data.newBookings) {
        try {
            individual = await addEquipmentBookings(id, data.newBookings);
        }catch (e) {
            console.log((e as Error).message);
            throw new Error('Failed to update individual at add bookings');
        }
    }
    return (individual as TIndividualSchema);
}

async function addEquipmentBookings(equipmentId: string, bookingIds: string[]) {
    const equipment = equipment_individuals.findOne({_id: equipmentId});
    if(!equipment) throw new Error('Couldn\'t find equipment');

    const newBookings: Array<IBooking | string> = ((equipment as unknown) as IEquipmentChild).bookings;
    try {
        newBookings.concat(bookingIds);
    } catch(e) {
        console.log((e as Error).message);
        throw new Error('Failed to add bookings to equipment');
    }
    try {
        const updatedIndividual = equipment_individuals.findOneAndUpdate({_id: equipmentId}, {bookings: newBookings});
        return(updatedIndividual);
    } catch (e) {
        console.log((e as Error).message);
        throw new Error('Failed to add bookings to equipment');
    }
}

async function deleteEquipmentBookings(equipmentId: string, bookingIds: string[]) {
    const equipment = equipment_individuals.findOne({_id: equipmentId});
    if(!equipment) throw new Error('Couldn\'t find equipment');

    const newBookings: Array<IBooking | string> = ((equipment as unknown) as IEquipmentChild).bookings;
    try {
        bookingIds.forEach(item => {
            const index = newBookings.indexOf(item);
            newBookings.splice(index, 1);
        });
    } catch(e) {
        console.log((e as Error).message);
        throw new Error('Failed to delete bookings from equipment');
    }
    try {
        const updatedIndividual = equipment_individuals.findOneAndUpdate({_id: equipmentId}, {bookings: newBookings});
        return(updatedIndividual);
    } catch (e) {
        console.log((e as Error).message);
        throw new Error('Failed to delete bookings from equipment');
    }

}

async function deleteEquipment(id: string) {
    const equipment = await equipment_parents.findOneAndDelete({_id: id});

    if(!equipment) {
        throw new Error(`Couldn't find equipment ${id}`);
    //if equipment image exists, find the file and delete
    } else  if(equipment.image) {
        const file = await uploads.findOneAndDelete({_id: equipment.image});
        if(!file) {
            throw new Error('Could not find file ' + equipment.image);
        } else {
            try {
                file && fs.unlink(`.${file.path}`, () => {
                    return true;
                });
            } catch (e) {
                throw new Error('File deletion failed');
            }
        }
    }
    try {
        const individuals = await deleteIndividuals(equipment._id);
        return individuals;
    } catch (e) {
        console.log((e as Error).message);
        throw new Error('Couldn\'t delete individuals');
    }
}

async function deleteIndividuals(parentId: Types.ObjectId, inIds?: string[]) {
    if(!inIds) {
        const allIndividuals = await equipment_individuals.find({description: parentId});
        if(allIndividuals.length < 1) throw new Error('Could not find individuals');
        const deleted = await equipment_individuals.deleteMany({description: parentId});
        return deleted;
    } else {
        const deleted: unknown[] = [];
        inIds.forEach(item => {
            console.log(item);
            equipment_individuals.findByIdAndDelete({_id: item})
                .then(individual => {
                    if(!individual) throw new Error('Individual not found');
                    console.log(individual);
                    deleted.push(individual);
                })
                .catch(e => {
                    console.log(e.message);
                    throw new Error('Could not delete individual ' + item);
                });
        });
        console.log('deleted array');
        console.log(deleted);
        return (deleted as TIndividualSchema[]);
    }
}

/*Uploads*/
function readUploads (query?: {[key:string]: unknown}) {
    if(query) return uploads.find(query).populatePaths();
    else return uploads.find().populatePaths();
}

function addUpload (fileData: TFileData) {
    const path = '/src/files/' + fileData.folder + '/' + fileData.file;
    return uploads.create({type: fileData.fileType, path, tag: fileData.tag});
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
    addEquipment,
    updateEquipment,
    updateIndividual,
    deleteEquipment,

    readUploads, 
    addUpload,
    
    readUser
};