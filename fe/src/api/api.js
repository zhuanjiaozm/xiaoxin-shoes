// 导入api.js
import http from './index';

const itemMap = (params) => http.get('itemMap', params);


const update2 = (params) => http.post('update2', params);


// const getCurrentUserInfo = () => http.post('/login/getCurrentUserInfo');

// const exportCSV = (params) => http.get(params);

const uploadFile = (url = 'uploadFile', file) => http.uploadFile(url, file);
// 上传文件
// export const uploadFile = (url, file) => {
//   const formData = new FormData();
//   formData.append('file', file);
//   const config = {
//     baseURL: '/api/', // url = base url + request url
//     withCredentials: true, // send cookies when cross-domain requests
//     timeout: 10000, // request timeout
//     headers: {
//       'Content-Type': 'multipart/form-data',
//       Authorization: store.state.token,
//     },
//   };
//   return axios.post(url, formData, config);
// };


export default {
    update2,
    itemMap,
    uploadFile
}