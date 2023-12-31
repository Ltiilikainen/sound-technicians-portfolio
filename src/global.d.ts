/*DB return content */

interface IFile {
    _id?: string,
    type: string,
    path: string,
    tag: string
}

interface IReference {
    _id?: string,
    name: string,
    affiliation: string,
    image: string | IFile,
    content: string
}

interface IWorkExample {
    _id?: string,
    file: IFile,
    occasions: string
}

//bookings schema
interface IBooking {
    _id?: string,
    start_date: string,
    end_date: string,
}

//main booking schema
interface IEvent {
    _id?: string,
    time_id: IBooking,
    description: string,
    display_description: boolean,
    category_id: string,
    equipment: Array<string>,
    created_at?: unknown,
    updated_at?: unknown
}

interface IEquipmentType {
    _id?: string,
    type_name: string
}

interface IEquipmentChild {
    _id?: string,
    description: string | IEquipment,
    bookings: Array<IBooking>
}

interface IEquipment {
    _id?: string,
    name: string, 
    type: string | IEquipmentType, 
    image?: string | IFile,
    specs: string,
    individuals: Array<string | IEquipmentChild>
}

interface IFormData {
    name: string,
    company: string,
    email: string,
    phone: string,
    purpose: string,
    startDate: Date | null,
    endDate: Date | null,
    body: string
}

/*DB create/update data types*/

type TFileData = {
    fileType: string,
    folder: string,
    file: string,
    tag: string
};

type TWorkExampleData = {
    file: string,
    occasions: string
};

type TReferenceData = {
    name: string,
    affiliation: string,
    content: string,
    image?: string
};

type TBookingCategoryData = {
    _id?: string,
    category_name: string
};

type TEquipmentData = {
    name: string, 
    type: string, 
    specs: string, 
    quantity: string, 
    image?: string,
    individuals?: Array<string>;
}

type TEquimpentUpdateData = {
    name: string,
    type: string,
    specs: string,
    image?: string,
}

type TEquipmentIndividualFieldData = {
    newIndividuals?: string,
    removedIndividuals?: string[]
}

type TIndividualUpdateData = {
    newBookings?: string[],
    removedBookings?: string[]
}

type TIndividualSchema = {
    _id: Types.ObjectId,
    description: Types.ObjectId,
    bookings: Types.ObjectId[],
    _v?: unknown
}


/*Frontend interfaces*/
interface ICalendarEvents {
    title?: string,
    start: string,
    end: string,
    allDay?: boolean,
    display?: string
}