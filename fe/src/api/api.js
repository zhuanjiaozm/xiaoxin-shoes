// 导入api.js
import http from './index';

const itemMap = (params) => http.get('itemMap', params);


const update2 = (data) => http.post('update2', data);

const login2 = (params) => http.post('login2', params);

const getProductList = (flag) => http.get('getProductList', { flag });

const getInventory = (id) => http.get('getInventory/' + id);

const getAllInventory = () => http.get('getAllInventory');

const getBasicActiveDataByPage = () => http.get('getBasicActiveDataByPage');

const download = (fileName) => http.get('download2?fileName=' + fileName);


const exportExcel = () => http.get('exportExcel', {}, 'arraybuffer');

// const getCurrentUserInfo = () => http.post('/login/getCurrentUserInfo');

// const exportCSV = (params) => http.get(params);

const uploadFile = (url = 'uploadFile', file, isFile) => http.post('upload_excel', file, isFile);
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
    login2,
    update2,
    itemMap,
    download,
    uploadFile,
    getInventory,
    getAllInventory,
    getProductList,
    exportExcel,
    getBasicActiveDataByPage
}
