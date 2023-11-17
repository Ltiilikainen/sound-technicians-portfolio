import axios from 'axios';

const baseURL = '/api';

const getWorkAudio = () => {
    const request = axios.get(`${baseURL}/work-audio`);
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

const sendForm = (formData: IFormData) => {
    const request = axios.post(`${baseURL}/contact`, {formData});
    return request.then(response => response.data);
};

export default {getWorkAudio, getSchedule, getAllEquipment, sendForm};