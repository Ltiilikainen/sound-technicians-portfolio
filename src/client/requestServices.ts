import axios from 'axios';
import * as jose from 'jose';

const baseURL = '/api';

const getHomePage = () => {
    const request = axios.get(`${baseURL}/home`);
    return request.then(response => response.data);
};

const uploadImage = (formData: FormData, token: string) => {
    const request = axios.post(`${baseURL}/upload/img`, formData, {'headers':{Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data'}});
    return request.then(response => response);
};

/*References ports*/
const getReferences = (id?: string) => {
    const request = id ? axios.get(`${baseURL}/references/${id}`) : axios.get(`${baseURL}/references`);
    return request.then(response => response.data);
};

const writeNewReference = (refData: {name: string, affiliation: string, content: string}, token: string, image?: {fileType: string, folder: string, file: string, tag: string}) => {
    const request = axios.post(`${baseURL}/references`, {refData, image}, {'headers':{Authorization: `Bearer ${token}`}});
    return request.then(response => response);
};

const updateReference = (id: string, token: string, name: string, affiliation: string, content: string, image?:string) => {
    const request = axios.put(`${baseURL}/references/${id}`, {name, affiliation, content, image}, {'headers':{Authorization: `Bearer ${token}`}});
    return request.then(response => response);
};

const deleteReference = (id: string, token: string) => {
    const request = axios.delete(`${baseURL}/references/${id}`, {'headers':{Authorization: `Bearer ${token}`}});
    return request.then(response => response);
};

/*Work examples ports*/
const getWorkAudio = (id?: string) => {
    const request = id ? axios.get(`${baseURL}/work-examples/${id}`) : axios.get(`${baseURL}/work-examples`);
    return request.then(response => response.data);
};

const uploadWorkAudio = (formData: FormData, token: string) => {
    const request = axios.post(`${baseURL}/upload/work-audio`, formData, {'headers':{Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data'}});
    return request.then(response => response);
};

const writeNewWorkAudio = (data: {fileType: string, folder: string, file: string, tag: string, occasions: string}, token: string) => {
    const request = axios.post(`${baseURL}/work-examples`, data, {'headers':{Authorization: `Bearer ${token}`}});
    return request.then(response => response);
};

const updateWorkAudio = (id: string, token: string, file?:string, occasions?:string) => {
    const request = axios.put(`${baseURL}/work-examples/${id}`, {file, occasions}, {'headers':{Authorization: `Bearer ${token}`}});
    return request.then(response => response);
};

const deleteWorkAudio = (id: string, token: string) => {
    const request = axios.delete(`${baseURL}/work-examples/${id}`, {'headers':{Authorization: `Bearer ${token}`}});
    return request.then(response => response);
};

/*Schedule ports*/
const getSchedule = (id?: string) => {
    const request = id ? axios.get(`${baseURL}/bookings/${id}`) : axios.get(`${baseURL}/bookings`);
    return request.then(response => response.data);
};

const fillScheduleForm = async() => {
    const response: {categories: Array<string>, equipment: Array<IEquipment>} = {categories: [], equipment: []};
    response.equipment = (await axios.get(`${baseURL}/equipment`)).data;
    const categories = (await axios.get(`${baseURL}/bookings/categories`)).data;
    response.categories = (categories as TBookingCategoryData[]).map(item => item.category_name);

    return response;
};

/*Equipment ports*/
const getEquipment = (id?: string) => {
    const request = id ? axios.get(`${baseURL}/equipment/model/${id}`) : axios.get(`${baseURL}/equipment`);
    return request.then(response => response.data);
};

const getEquipmentType = () => {
    const request = axios.get(`${baseURL}/equipment/types`);
    return request.then(response => response.data);
};

const addEquipment = (token:string, data: TEquipmentData, file?: TFileData) => {
    const request = axios.post(`${baseURL}/equipment`, {data, file}, {'headers':{Authorization: `Bearer ${token}`}});
    return request.then(response => response);
};

const updateEquipment = (id: string, token: string, data: TEquipmentData) => {
    const request = axios.put(`${baseURL}/equipment/model/${id}`, data, {'headers':{Authorization: `Bearer ${token}`}});
    return request.then(response => response);
};

const controlEquipmentBookings = (id: string, token: string, data: {startDate: string, endDate: string}) => {
    const request = axios.put(`${baseURL}/equipment/bookings/${id}`, data, {'headers':{Authorization: `Bearer ${token}`}});
    return request.then(response => response);
};

const deleteEquipment = (id: string, token: string) => {
    const request = axios.delete(`${baseURL}/equipment/${id}`, {'headers':{Authorization: `Bearer ${token}`}});
    return request.then(response => response);
};


/*Contact form*/

const sendForm = (formData: IFormData) => {
    const request = axios.post(`${baseURL}/contact`, {formData});
    return request.then(response => response.data);
};

/*User actions*/
const loginAdmin = (username:  string, password: string) => {
    const request = axios.post(`${baseURL}/login`, {username, password});
    return request.then(response => response.data);
};

const verifyAdmin = async (token: string, rsaPub: string) => {
    const data = {auth: false, username: ''};

    if(token !== '' && rsaPub && rsaPub !== '') {
        const public_key = await jose.importSPKI(rsaPub, 'RS256');
        try {
            const verification = await jose.jwtVerify(token, public_key);
                    
            if(verification.payload) {
                data.username = String(verification.payload.username);
                data.auth = true;
                return data;
            } else {
                return data;
            }
                       
        } catch (err) {
            console.log(err);
            return data;
        }
    }
    else {
        return data;
    }
};

export default {
    getHomePage, 
    uploadImage,

    getReferences, 
    writeNewReference,
    updateReference,
    deleteReference,

    getWorkAudio,
    uploadWorkAudio, 
    writeNewWorkAudio,
    updateWorkAudio,
    deleteWorkAudio,

    getSchedule, 

    fillScheduleForm,
    
    getEquipment,
    getEquipmentType,
    addEquipment,
    updateEquipment,
    controlEquipmentBookings,
    deleteEquipment,

    sendForm, 
    loginAdmin, 
    verifyAdmin};