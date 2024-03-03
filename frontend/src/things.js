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
    const accessToken = cookies.get('access');
    if (accessToken) { config.headers['Authorization'] = `Bearer ${accessToken}`; }

    return config;
}, error => {
    return Promise.reject(error);
});
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response) {
        const response = error.response;
        if (response.status === 401) {
          if (response.data.msg === "Missing Authorization Header") {
            try {
              const refreshResponse = await axiosInstance.get('auth/refresh', {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${cookies.get('refresh')}`,
                }
              });
  
              if (refreshResponse.status === 200 && refreshResponse.data.access) {
                cookies.set('access', refreshResponse.data.access);
                const retryConfig = { ...error.config };
                retryConfig.headers['Authorization'] = `Bearer ${cookies.get('access')}`;
                
                return axiosInstance.request(retryConfig);
              } else {
                console.error("Refresh failed:", refreshResponse);
                window.location.href = '/auth';
              }
            } catch (refreshError) {
              console.error("Error during refresh:", refreshError);
              window.location.href = '/auth';
            }
          }
        } else if (response.status === 422) {
            window.location.href = '/auth';
        }
      }
      return Promise.reject(error);
    }
  );
  

export { cookies, axiosInstance };