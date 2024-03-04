import tokenExp from './pages/auth/tokenExp'; 
import axios from 'axios';
import { Cookies } from 'react-cookie';

const cookies = new Cookies();
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/',
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    config => {
        const accessToken = cookies.get('access');
        if (accessToken) { 
            config.headers['Content-Type'] = 'application/json'
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

let isRefreshing = false;
let refreshSubscribers = [];

function onAccessTokenFetched(access_token) {
    refreshSubscribers.forEach(callback => callback(access_token));
    refreshSubscribers = [];
}

function addSubscriber(callback) {
    refreshSubscribers.push(callback);
}

axiosInstance.interceptors.response.use(
    response => {
        console.log('Response received:', response);
        return response;
    },
    async error => {
        console.error('Error occurred:', error);

        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            console.log('Unauthorized error, attempting to refresh token.');

            if (isRefreshing) {
                console.log('Token refresh already in progress, waiting for new token.');
                try {
                    const access_token = await new Promise((resolve) => {
                        addSubscriber(token => resolve(token));
                    });
                    console.log('New token received:', access_token);
                    originalRequest.headers['Authorization'] = 'Bearer ' + access_token;
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    console.error('Error during token refresh:', refreshError);
                    return Promise.reject(refreshError);
                }
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshResponse = await axiosInstance.get('auth/refresh', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${cookies.get('refresh')}`,
                    },
                });

                if (refreshResponse.status === 200 && refreshResponse.data.access) {
                    const exp = await tokenExp();
                    cookies.set('access', refreshResponse.data.access, {
                        expires: exp.a
                    });
                    
                    onAccessTokenFetched(refreshResponse.data.access);
                    originalRequest.headers['Authorization'] = 'Bearer ' + refreshResponse.data.access;
                    console.log('Token refreshed successfully:', refreshResponse.data.access);
                    return axiosInstance(originalRequest);
                } else {
                    console.error('Token refresh failed:', refreshResponse);
                    window.location.href = '/auth';
                }
            } catch (refreshError) {
                console.error('Error during token refresh:', refreshError);
                window.location.href = '/auth';
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

const handleReaction = async (val, post_id) => {
    try {
        const response = await axiosInstance.post("reaction", {
            val, post_id
        })

        if (response.status === 200) {
            window.location.reload()
        } 
    } catch (error) {
    }
};


export { cookies, axiosInstance, handleReaction };
