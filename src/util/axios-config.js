let axiosConfig = {
    // baseURL: 'http://wzbs-api.qeebu.cn',
    baseURL: '/api',
    timeout: 6000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    maxContentLength: 5000
}
if (location.hostname == 'localhost') {
  axiosConfig.baseURL = 'https://tpy-api.qeebu.com';
} else{
  axiosConfig.baseURL = '/api';
}
export default axiosConfig;