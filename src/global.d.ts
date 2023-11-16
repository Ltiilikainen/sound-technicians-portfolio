interface IFile {
    _id: string,
    type: string,
    path: string,
    tag: string
}

interface IWorkExample {
    _id: string,
    file: IFile,
    occasions: string
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

interface IBooking {
    _id: string,
    start_date: string,
    end_date: string,
    description: string,
    display_description: boolean,
    category_id: string,
    equipment: Array<string>,
    created_at?: unknown,
    updated_at?: unknown
}

interface IEquipmentBooking {
    start_date: string,
    end_date: string,
    created_at?: unknown,
    updated_at?: unknown
}

interface IEquipmentType {
    _id: string,
    type_name: string
}

interface IEquipmentChild {
    _id: string,
    parent_id: string,
    bookings: Array<IBooking | IEquipmentBooking>
}

interface IEquipment {
    name: string, 
    type: ObjectId | IEquipmentType, 
    image: ObjectId | IFile,
    children: Array<string | IEquipmentChild>
}