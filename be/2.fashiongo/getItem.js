const http = require('../service/index');
const itemUrl = 'https://vendoradmin.fashiongo.net/api/item/11701984?listKey=2ea9901e-9dde-42bb-acf6-b8d64384896f';
const getInventoryUrl = 'https://vendoradmin.fashiongo.net/api/item/11701984?listKey=2ea9901e-9dde-42bb-acf6-b8d64384896f';

module.exports = {
    getItem: async function () {
        return await http.get(itemUrl).then(res => {
            return res.data;
        })
    },
    getInventoryPromise: async function (id) {
        return await http.get(`https://vendoradmin.fashiongo.net/api/item/${id}`).then(res => {
            return res.data;
        })
    },
    loginPromise: async function (id) {
        return await http.post(`https://vendoradmin.fashiongo.net/api/login`, {
            "username": "fashionemporio1",
            "password": "shoes8",
            "app": false
        }).then(res => {
            return res.data;
        })
    }
}