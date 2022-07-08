import axios from 'axios';
import { Message } from 'element-ui';
var env = process.env.NODE_ENV;

axios.defaults.withCredentials = true;

// 创建一个 axios 实例
const request = axios.create({
    // baseURL: 'http://fengziqiao.xyz:3000/',
    // baseURL: 'http://localhost:3000/',
    baseURL: env === 'production' ? 'http://awsus.fengziqiao.xyz:3000/' : 'http://localhost:3000/',
    // baseURL: env === 'production' ? 'http://azjp2.fengziqiao.xyz:3000/' : 'http://localhost:3000/',
    withCredentials: true, // send cookies when cross-domain requests
    // timeout: 10000, // request timeout
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        // 'Content-Type': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*'
    },
});

const getFileNmaFromHeaders = (str) => {
    const arr = str && str.split(';');
    const filenameArr = arr && arr.filter((item) => item.includes('filename='));
    return filenameArr && filenameArr[0] && filenameArr[0].split('=')[1];
};

// 请求拦截器
request.interceptors.request.use(
    (configP) => {
        const config = configP;
        config.headers.Authorization = sessionStorage.getItem('token') || '';
        return config;
    },
    (error) => {
        // do something with request error
        console.log(error); // for debug
        return Promise.reject(error);
    },
);

// 返回拦截
request.interceptors.response.use((response) => {
    const fileName = getFileNmaFromHeaders(response.headers['content-disposition']);
    if (fileName) {
        return {
            data: response.data,
            fileName,
        };
    }
    return response.data;
}, (error) => {
    console.error(error);
    Message.error(error.message || '网络请求异常，请稍后重试!' || error);
});

// 按照请求类型对axios进行封装
const http = {
    get(url, data) {
        return request.get(url, {
            params: data,
        });
    },
    post(url = 'upload_excel', data, isUpload) {
        if (isUpload) {
            const formData = new FormData();
            formData.append('file', data);
            const config = {
                withCredentials: true, // send cookies when cross-domain requests
                timeout: 10000, // request timeout
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };
            return request.post(url, formData, config);
        } else {
            return request.post(url, data);
        }
    },
    // 上传文件
    uploadFile(url, file) {

    },
};

export default http;