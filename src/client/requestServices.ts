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

const verifyAdmin = (token: string, rsaPub: string) => {
    if(rsaPub !== '') {
        jose.importPKCS8(rsaPub, 'RS256')
            .then(public_key => {
                try {
                    jose.jwtVerify(token, public_key)
                        .then(result => {
                            return result;
                        })
                        .catch((e) => {
                            console.log(e);
                            return false;
                        }
                        );
                } catch (err) {
                    return false;
                }
            });
    }
    return false;
};

export default {getHomePage, getReferences, getWorkAudio, getSchedule, getAllEquipment, getOneEquipment, sendForm, loginAdmin, verifyAdmin};