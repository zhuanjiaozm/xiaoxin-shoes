const res = require('express/lib/response');
const http = require('../service/index');
const fs = require('fs'); //文件模块
const itemUrl = 'https://vendoradmin.fashiongo.net/api/item/11701984?listKey=2ea9901e-9dde-42bb-acf6-b8d64384896f';
const getInventoryUrl = 'https://vendoradmin.fashiongo.net/api/item/11701984?listKey=2ea9901e-9dde-42bb-acf6-b8d64384896f';
const productInfo = {
    "item": {
        "ingredients": "",
        "howtouse": "",
        "weight": null,
        "mapDropshipProductId": null,
        "crossSellCount": null,
        "categoryId": 237,
        "parentCategoryId": 234,
        "parentParentCategoryId": -1,
        "colorCount": 5
    },
    "inventory": {
        "update": [],
        "delete": []
    },
    "image": {
        "update": [],
        "delete": []
    },
    "crossSell": {
        "update": [],
        "delete": []
    },
    "changedInfo": {
        "oldPictureGeneral": "13815935_730af8c8-ae5b-4efa-b788-ab910c06eef5.jpg",
        "newPictureGeneral": "13815935_730af8c8-ae5b-4efa-b788-ab910c06eef5.jpg",
        "oldProductName": "FL-ALICIA-34",
        "packId": 34120,
        "active": false
    },
    "inventoryV2": {
        "saved": [],
        "deleted": []
    },
    "video": null,
    "volumeDiscounts": {
        "saved": [],
        "deleted": []
    },
    "linkItems": [],
    "productId": "13815935",
    "mapDropshipProductId": null,
    "dsSettingInfo": [],
    "vendorSettingInfo": []
};
module.exports = {
    getItem: async function () {
        return await http.get(itemUrl).then(res => {

            if (res.success && res.status === 200) {
                if (res.data && res.data.inventory) {
                    const { productId, productName, active, activatedOn } = res.data.item;
                    return res.data.inventory.map(item => {
                        return {
                            productId: productId,
                            colorId: item.colorId,
                            colorListId: item.colorListId,
                            colorName: item.colorName,
                            productName: productName,
                            active,
                            activatedOn,
                        }
                    })
                }
            }

            return res.data;
        })
    },

    getItemByAxios: async function (id) {
        return await http.get('https://vendoradmin.fashiongo.net/api/item/' + id).then(res => {
            return res.data;
        })
    },

    loginByAxios: async function () {
        return await http.post('https://vendoradmin.fashiongo.net/api/login', {
            "username": "fashionemporio1",
            "password": "shoes8",
            "app": false
        }).then(res => {
            return res.data;
        })
    },

    getBasicInactiveDataByPagePromiseByAxios: async function (pn) {
        return await http.get(`https://vendoradmin.fashiongo.net/api/items?pn=${pn}&ps=180&orderBy=lastModified&pageNo=1&pageSize=20&active=false&backUrl=;apn=4;ipn=2;pages=inactive`).then(res => {
            if (res && res.data && res.data.data && res.data.data.records) {
                const data = res.data.data.records;
                console.log(`查询[非active的商品]第${pn}页返回${data.length}条数据`);
                return data;
            } else {
                return [];
            }
        })
    },

    getBasicActiveDataByPagePromiseByAxios: async function (pn) {
        return await http.get(`https://vendoradmin.fashiongo.net/api/items?pn=${pn}&ps=180&orderBy=activatedOn&pageNo=1&pageSize=20&active=true&backUrl=;apn=4;ipn=1;pages=active`).then(res => {
            if (res && res.data && res.data.data && res.data.data.records) {
                const data = res.data.data.records;
                console.log(`查询[active的商品]第${pn}页返回${data.length}条数据`);
                return data;
            } else {
                return [];
            }
        })
    },

    getInventoryPromise: async function (id) {
        const response = await fetch(`https://vendoradmin.fashiongo.net/api/item/${id}`, {
            "headers": {
                "accept": "application/json",
                "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
                "authorization": global.Authorization,
                "cache-control": "no-cache",
                "content-type": "text/plain",
                "pragma": "no-cache",
                "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"102\", \"Google Chrome\";v=\"102\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
            },
            "referrer": "https://vendoradmin.fashiongo.net/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        });
        return response.json();
    },

    getBasicActiveDataByPagePromise: async function (pn) {
        console.log('getBasicActiveDataByPagePromise-pn: ', pn);
        const response = await fetch(`https://vendoradmin.fashiongo.net/api/items?pn=${pn}&ps=180&orderBy=activatedOn&pageNo=1&pageSize=20&active=true&backUrl=;apn=4;ipn=1;pages=active`, {
            "headers": {
                "accept": "application/json",
                "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
                "authorization": global.Authorization,
                "cache-control": "no-cache",
                "content-type": "text/plain",
                "pragma": "no-cache",
                "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"102\", \"Google Chrome\";v=\"102\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
            },
            "referrer": "https://vendoradmin.fashiongo.net/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        });
        return response.json();
    },

    getBasicInactiveDataByPagePromise: async function (pn) {
        console.log('getBasicInactiveDataByPagePromise-pn: ', pn);
        const response = await fetch(`https://vendoradmin.fashiongo.net/api/items?pn=${pn}&ps=180&orderBy=lastModified&pageNo=1&pageSize=20&active=false&backUrl=;apn=4;ipn=2;pages=inactive`, {
            "headers": {
                "accept": "application/json",
                "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
                "authorization": "Bearer eyJhbGciOiJIUzUxMiJ9.eyJ2ZW5kb3JUeXBlIjoxLCJkc1ZlbmRvcklkIjpudWxsLCJyb2xlIjoiVmVuZG9yQWRtaW4iLCJkc1ZlbmRvclR5cGUiOm51bGwsImRzUmVzb3VyY2VzIjoiIiwicmVzb3VyY2VzIjoiSXRlbXMsIE9yZGVycywgU3RhdGlzdGljcywgUGhvdG8gU3R1ZGlvIiwidXNlck5hbWUiOiJmYXNoaW9uZW1wb3JpbzEiLCJ3aG9sZXNhbGVySWQiOjYzNTUsImF1ZCI6IndlYiIsImdyb3VwSWRzIjpudWxsLCJndWlkIjoiQ0E3ODQzNzQtRjBDNC00Q0MzLUE1Q0YtNDc4OEI0MDY4NzYzIiwic2VjdXJpdHlVc2VySWQiOm51bGwsImlzT3JkZXJTdGF0dXNNYW5hZ2VtZW50IjpmYWxzZSwiZXhwIjoxNjU0MjM3NDQzLCJzZWN1cml0eVVzZXJSb2xlIjpudWxsfQ.o4BzKSlWtHglPADICzHtNQN5d3g6h72ZtasHZG36Y4iJy_2PGxwmSVlwPeyd9uyoaUPrDx-iYBucfgX7vGkKsw",
                "cache-control": "no-cache",
                "content-type": "text/plain",
                "pragma": "no-cache",
                "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"102\", \"Google Chrome\";v=\"102\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
            },
            "referrer": "https://vendoradmin.fashiongo.net/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        });
        return response.json();
    },

    updatePromise: async (product) => {
        const response = await fetch("https://vendoradmin.fashiongo.net/api/item/save", {
            "headers": {
                "accept": "application/json",
                "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
                "authorization": global.Authorization,
                "cache-control": "no-cache",
                "content-type": "application/json",
                "pragma": "no-cache",
                "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"101\", \"Google Chrome\";v=\"101\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
            },
            "referrer": "https://vendoradmin.fashiongo.net/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": JSON.stringify(product),
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        });
        return response.json();
    },

    loginPromise: async function () {
        const response = await fetch("https://vendoradmin.fashiongo.net/api/login", {
            "headers": {
                "accept": "application/json",
                "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
                "cache-control": "no-cache",
                "content-type": "text/plain",
                "pragma": "no-cache",
                "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"102\", \"Google Chrome\";v=\"102\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
            },
            "referrer": "https://vendoradmin.fashiongo.net/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": "{\"username\":\"fashionemporio1\",\"password\":\"shoes8\",\"app\":false}",
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        });
        return response.json();
    },

    sendMessage: async function (data) {
        const { title, content } = data;
        const url = `https://sctapi.ftqq.com/SCT66532Tp2XMTGSaLCjrI9yVfZEvW7ZA.send?title=${title}&desp=${content}`;
        const response = await fetch(url, {
            "headers": {
                "accept": "application/json",
                "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
                "cache-control": "no-cache",
                "content-type": "text/plain",
                "pragma": "no-cache",
                "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"102\", \"Google Chrome\";v=\"102\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
            },
            "referrerPolicy": "strict-origin-when-cross-origin",
            // "body": JSON.stringify(data),
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        });
        return response.json();
    }
}