import axios from 'axios';

const baseURL = '/api';

const getWorkAudio = () => {
    const request = axios.get(`${baseURL}/work-audio`);
    return request.then(response => response.data);
};

export default {getWorkAudio};