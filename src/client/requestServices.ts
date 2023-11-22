import axios from 'axios';
import * as jose from 'jose';

const baseURL = '/api';

const getHomePage = () => {
    const request = axios.get(`${baseURL}/home`);
    return request.then(response => response.data);
};

const getReferences = () => {
    const request = axios.get(`${baseURL}/references`);
    return request.then(response => response.data);
};

const getWorkAudio = () => {
    const request = axios.get(`${baseURL}/work-examples`);
    return request.then(response => response.data);
};

const getSchedule = () => {
    const request = axios.get(`${baseURL}/bookings`);
    return request.then(response => response.data);
};

const getAllEquipment = () => {
    const request = axios.get(`${baseURL}/equipment`);
    return request.then(response => response.data);
};

const getOneEquipment = (id: string) => {
    const request = axios.get(`${baseURL}/equipment/${id}`);
    return request.then(response => response.data);
};

const sendForm = (formData: IFormData) => {
    const request = axios.post(`${baseURL}/contact`, {formData});
    return request.then(response => response.data);
};

const loginAdmin = (username:  string, password: string) => {
    const request = axios.post(`${baseURL}/login`, {username, password});
    return request.then(response => response.data);
};

const testAuth = (token: string) => {
    const request = axios.get(`${baseURL}/bookings/test`, {headers: {'Authorization': `Bearer ${token}`}});
    return request.then(response => response.data);
};

const verifyAdmin = (token: string, rsaPub: string) => {
    return verify(token, rsaPub);
    
    async function verify (token: string, rsaPub: string) 
    {const data = {auth: false, username: ''};
        if(token !== '' && rsaPub && rsaPub !== '') {
            jose.importSPKI(rsaPub, 'RS256')
                .then(public_key => {
                    try {
                        data.auth = true;
                        jose.jwtVerify(token, public_key)
                            .then(result => data.username = String(result.payload.username));
                    } catch (err) {
                        console.log(err);
                    }
                });
        
        }
        return data;
    }
};

export default {getHomePage, getReferences, getWorkAudio, getSchedule, getAllEquipment, getOneEquipment, sendForm, loginAdmin, verifyAdmin, testAuth};