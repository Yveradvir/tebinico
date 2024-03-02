import axios from 'axios';
import { Cookies } from 'react-cookie';

const cookies = new Cookies();
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/',
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(config => {
    const accessToken = cookies.get('access_token');
    if (accessToken) { config.headers['Authorization'] = `Bearer ${accessToken}`; }

    return config;
}, error => {
    return Promise.reject(error);
});

export {cookies, axiosInstance};