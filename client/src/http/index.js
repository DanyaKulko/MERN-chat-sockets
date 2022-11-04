const axios = require('axios');


// export const serverURI = 'http://192.168.2.246:5000';
export const serverURI = 'http://localhost:5000';

const $api = axios.create({
    baseURL: `${serverURI}/api`,
    withCredentials: true
})

$api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

$api.interceptors.response.use(config => config, async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && error.config && !error.config.__isRetryRequest) {
        try {
            const response = await axios.get(`${serverURI}/api/user/refresh`, {withCredentials: true});
            localStorage.setItem('token', response.data.token);
            originalRequest.__isRetryRequest = true;

            return $api.request(error.config);
        } catch (err) {
            console.log(err)
        }
    }
    return Promise.reject(error);
})

export default $api;