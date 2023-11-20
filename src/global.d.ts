interface IFile {
    _id: string,
    type: string,
    path: string,
    tag: string
}

interface IReference {
    _id: string,
    name: string,
    affiliation: string,
    image: string | IFile,
    content: string
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
}

interface IEvent {
    _id: string,
    time_id: IBooking,
    description: string,
    display_description: boolean,
    category_id: string,
    equipment: Array<string>,
    created_at?: unknown,
    updated_at?: unknown
}

interface ICalendarEvents {
    title?: string,
    start: string,
    end: string,
    allDay?: boolean,
    display?: string
}

interface IEquipmentType {
    _id: string,
    type_name: string
}

interface IEquipmentChild {
    _id: string,
    description: string | IEquipment,
    bookings: Array<IBooking>
}

interface IEquipment {
    _id: string,
    name: string, 
    type: string | IEquipmentType, 
    image: string | IFile,
    specs: string,
    individuals: Array<string | IEquipmentChild>
}